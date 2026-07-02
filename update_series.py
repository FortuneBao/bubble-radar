# -*- coding: utf-8 -*-
"""
update_series.py — ⑥A:series.pkl 唯一合法追加器(铁律 v2 的执行者)
====================================================================
职责:给 8 条日频自动层序列追加新数据点,严格 append-only,历史行一个字节不动。
  自动层:_SP500/_DJIA/_NDQ/VIX(收盘原值) · HYOAS(FRED原值)
         NDQ_DEV/SOX_DEV(对自身200日简单均线的偏离%) · BREADTH(SPY÷RSP)
  不归本器管:AAII两条(⑥B人工录入派生) · CAPE/MARGIN_GDP/CONC/CONC_PREMIUM/
             IPO/_Z1FLOW(低频人工层)。

两段式(先考试后动刀):
  --qualify  只读资格考试:抓真实数据,用候选口径重算 pkl 存量末 20 个点,
             与既有值逐位比对;每条序列必须有唯一胜出口径(max|Δ|≤容差)。
             结果写 calc/qualify_report.json。不写 pkl。
  --append   动刀,但必须持全科 PASS 的资格报告:
             ① 本地备份 pkl → calc/backups/(git 历史另为一重备份)
             ② 按胜出口径计算新行(仅 日期>该序列末点;yfinance 行必须
                日期<纽约今天=已收盘定格)
             ③ 前缀相等断言:新表前 len(旧表) 行必须与旧表完全相等
             ④ 写 pkl → 子进程跑 export_computed.py:五锚点保险丝必须过,
                且 computed.json 必须字节不变(追加的未来行 PIT 不可见 → 铁证)
             ⑤ 全过才写台账 calc/series_ledger.json(bytes+sha256+各序列末点);
                任何一步失败 → 自动还原备份,退出码 1。
台账 = 铁律 v2 的锚:工作流不再核对固定字节数,改核对"pkl 与台账 sha256 一致"。
运行: .venv/bin/python3 update_series.py --qualify   (先)
      .venv/bin/python3 update_series.py --append    (后)
"""
import csv, hashlib, io, json, os, shutil, subprocess, sys, time, urllib.request
from datetime import datetime
from zoneinfo import ZoneInfo

import pandas as pd

BASE = os.path.dirname(os.path.abspath(__file__))
PKL = os.path.join(BASE, 'calc', 'series.pkl')
LEDGER = os.path.join(BASE, 'calc', 'series_ledger.json')
QREPORT = os.path.join(BASE, 'calc', 'qualify_report.json')
BACKUP_DIR = os.path.join(BASE, 'calc', 'backups')
TIMEOUT = 30
OVERLAP = 20                      # 资格考试:重算存量末 20 个点

# (键, 源, 代码, 变换)。dev200 = (收盘/自身200日SMA − 1)×100;ratio = 甲收盘÷乙收盘
AUTO = [
    ('_SP500',  'yf',    '^GSPC',   'close'),
    ('_DJIA',   'yf',    '^DJI',    'close'),
    ('_NDQ',    'yf',    '^IXIC',   'close'),
    ('VIX',     'yf',    '^VIX',    'close'),
    ('HYOAS',   'fred',  'BAMLH0A0HYM2', 'close'),
    ('NDQ_DEV', 'yf',    '^IXIC',   'dev200'),
    ('SOX_DEV', 'fred',  'NASDAQSOX', 'dev200'),
    ('BREADTH', 'yf2',   'SPY|RSP', 'ratio'),
]

# 候选口径:(说明, auto_adjust, 末位处理 postround)。按序尝试,首个达容差者胜出。
CANDS = {
    'close':  [('raw收盘·round2', False, 2)],
    'dev200': [('raw收盘·SMA200含当日·全精度', False, None),
               ('raw收盘·SMA200含当日·round4',  False, 4),
               ('raw收盘·SMA200不含当日·全精度', 'shift', None),
               ('raw收盘·SMA200不含当日·round4',  'shift', 4)],
    'ratio':  [('raw收盘比值·全精度', False, None), ('raw收盘比值·round4', False, 4),
               ('adj收盘比值·全精度', True,  None), ('adj收盘比值·round4', True,  4)],
}
PRICE_TOL = 0.02      # 价格当量容差(默认):dev/ratio 的重算差按"当日"价格逐日折算 ≤2分钱
# 血统量化差覆盖:SOX_DEV 清洁段建自 investing 1位小数收盘(±0.05),FRED 官方亦可能
# 1位小数(±0.05),故价格当量放宽到 0.12;对照:幽灵行污染的价格当量 ≈10 点,判别力仍有 ~80 倍。
SERIES_PRICE_TOL = {'SOX_DEV': 0.12}

def _scale_series(spec, cand):
    """价格当量换算刻度(逐日):dev200 → 当日MA/100;ratio → 当日分母收盘;
    close → None(直接用绝对容差 0.005)。"""
    kind = spec[3]
    if kind == 'close':
        return None
    if kind == 'dev200':
        df = fred_series(spec[2]) if spec[1] == 'fred' else yf_closes(spec[2], False)
        ma = df['close'].rolling(200).mean()
        if cand[1] == 'shift':
            ma = ma.shift(1)
        return pd.Series((ma / 100.0).values, index=df['date'].values).dropna()
    b = spec[2].split('|')[1]
    dfb = yf_closes(b, cand[1])
    return pd.Series(dfb['close'].values, index=dfb['date'].values)

# 事件备案:存量尾段已知受染时,资格考试改用"清洁窗"(clean_before 之前的末20点)。
# 桥接期:干净新点追加积满 OVERLAP 个后,严格末20点考试自然恢复;expiry 后通道自动关闭。
KNOWN_EVENTS = {
    'SOX_DEV': {
        'clean_before': '2025-12-01',
        'expiry': '2026-08-31',
        'note': '建库摄入的investing数据含幽灵周末行(pkl实存2025-12-06/2024-05-18两根周六行),2025-12-08起存量尾段200日均线受染(dev偏低0.1~0.35pp,3位小数口径无感,冻结历史不改);官方/共识收盘无分歧;换源FRED NASDAQSOX',
    },
}

_yf_cache = {}

def _today_ny():
    return datetime.now(ZoneInfo('America/New_York')).date()

def yf_closes(sym, adjust):
    """近2年日收盘 → DataFrame[date(无时区Timestamp), close];只留已收盘bar(日期<纽约今天)"""
    key = (sym, bool(adjust) if adjust != 'shift' else False)
    if key not in _yf_cache:
        import yfinance as yf
        for attempt in (1, 2):
            h = yf.Ticker(sym).history(period='2y', auto_adjust=key[1])
            c = h['Close'].dropna()
            if len(c) >= 260:
                break
            if attempt == 2:
                raise ValueError(f'yfinance {sym} 连续两次空/短响应({len(c)}行)')
            time.sleep(5)
        today = _today_ny()
        rows = [(pd.Timestamp(ts.date()), float(v)) for ts, v in c.items() if ts.date() < today]
        _yf_cache[key] = pd.DataFrame(rows, columns=['date', 'close'])
    return _yf_cache[key]

_fred_cache = {}

def fred_series(series):
    """FRED fredgraph CSV 全史 → DataFrame[date, close](带缓存;SSL瞬断重试一次)"""
    if series in _fred_cache:
        return _fred_cache[series]
    url = f'https://fred.stlouisfed.org/graph/fredgraph.csv?id={series}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    for attempt in (1, 2):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                text = r.read().decode('utf-8')
            break
        except Exception:
            if attempt == 2:
                raise
            time.sleep(5)
    rows = []
    for row in csv.reader(io.StringIO(text)):
        if len(row) >= 2 and row[1] not in ('.', ''):
            try:
                rows.append((pd.Timestamp(row[0]), float(row[1])))
            except (ValueError, TypeError):
                pass                     # 表头等不可解析行自然跳过
    _fred_cache[series] = pd.DataFrame(rows, columns=['date', 'close'])
    return _fred_cache[series]

def compute(spec, cand):
    """按 (源,代码,变换)+候选口径 → 全量 DataFrame[date, val]"""
    _, src, sym, kind = spec
    label, adj, pr = cand
    if kind == 'close':
        df = fred_series(sym) if src == 'fred' else yf_closes(sym, False)
        out = df.rename(columns={'close': 'val'}).copy()
        out['val'] = out['val'].round(2)
        return out
    if kind == 'dev200':
        df = (fred_series(sym) if src == 'fred' else yf_closes(sym, False)).copy()
        ma = df['close'].rolling(200).mean()
        if adj == 'shift':
            ma = ma.shift(1)
        out = pd.DataFrame({'date': df['date'], 'val': (df['close'] / ma - 1.0) * 100.0}).dropna()
        if pr is not None:
            out['val'] = out['val'].round(pr)
        return out.reset_index(drop=True)
    if kind == 'ratio':
        a, b = sym.split('|')
        da, db = yf_closes(a, adj), yf_closes(b, adj)
        m = da.merge(db, on='date', suffixes=('_a', '_b'))
        out = pd.DataFrame({'date': m['date'], 'val': m['close_a'] / m['close_b']})
        if pr is not None:
            out['val'] = out['val'].round(pr)
        return out
    raise ValueError(kind)

def qualify():
    d = pd.read_pickle(PKL)
    report = {'passed': True, 'when': datetime.now(ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M'),
              'overlap': OVERLAP, 'series': {}}
    print(f'── 资格考试:重算存量末 {OVERLAP} 点,逐位比对 ──')
    print('   (close型比绝对差≤0.005;dev/ratio型比逐日价格当量,默认≤0.02,SOX_DEV≤0.12)')
    for spec in AUTO:
        key, _, sym, kind = spec
        old = d[key].reset_index(drop=True)
        def _exam(tail, reasons):
            for cand in CANDS[kind]:
                try:
                    full = compute(spec, cand).set_index('date')['val']
                    scale = _scale_series(spec, cand)
                except Exception as e:
                    reasons.append(f'候选[{cand[0]}] 抓取/计算异常: {e}')
                    continue
                base = SERIES_PRICE_TOL.get(key, PRICE_TOL)
                tol = 0.005 + 1e-9 if scale is None else base + (0.005 if cand[2] is not None else 0.0) + 1e-9
                diffs, miss = [], None
                for _, r in tail.iterrows():
                    dt, sv = pd.Timestamp(r.iloc[0]), float(r.iloc[1])
                    if dt not in full.index or (scale is not None and dt not in scale.index):
                        miss = str(dt)[:10]
                        break
                    d_ = abs(float(full.loc[dt]) - sv)
                    diffs.append(d_ if scale is None else d_ * float(scale.loc[dt]))
                if miss:
                    reasons.append(f'候选[{cand[0]}] 日期错位: 源缺 {miss}')
                    continue
                mx = max(diffs)
                if mx <= tol:
                    return (cand, mx, tol)
                reasons.append(f'候选[{cand[0]}] 容差未达: max|Δ价当量|={mx:.3g} > {tol:.3g}')
            return None

        mode = 'strict'
        rs, rc = [], []
        best = _exam(old.tail(OVERLAP), rs)
        if not best and key in KNOWN_EVENTS:
            ev = KNOWN_EVENTS[key]
            if datetime.now(ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d') <= ev['expiry']:
                best = _exam(old[old['date'] < pd.Timestamp(ev['clean_before'])].tail(OVERLAP), rc)
                mode = 'clean_window'
        if best:
            cand, mx, tol = best
            entry = {'pass': True, 'mode': mode, 'convention': cand[0],
                     'auto_adjust': cand[1], 'postround': cand[2],
                     'max_abs_diff': mx, 'tol': tol}
            if mode == 'clean_window':
                entry['event_note'] = KNOWN_EVENTS[key]['note']
                entry['clean_before'] = KNOWN_EVENTS[key]['clean_before']
            report['series'][key] = entry
            tag = '' if mode == 'strict' else ' [清洁窗备案]'
            print(f'  ✓ {key:9s} PASS{tag} 口径=[{cand[0]}] max|Δ*|={mx:.3g} (容差{tol:.3g})')
        else:
            report['series'][key] = {'pass': False, 'strict_reasons': rs, 'clean_reasons': rc}
            report['passed'] = False
            print(f'  ✗ {key:9s} FAIL → 禁止追加,回报总设计师;逐候选原因:')
            for line in rs:
                print(f'      [strict] {line}')
            for line in rc:
                print(f'      [清洁窗] {line}')
    with open(QREPORT, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(('✓ 全科 PASS,' if report['passed'] else '✗ 存在 FAIL,') + f'报告已写 {os.path.basename(QREPORT)}')
    sys.exit(0 if report['passed'] else 1)


def _round3(o):
    """递归:所有 float 归约到 3 位小数(官方读数口径)"""
    if isinstance(o, float):
        return round(o, 3)
    if isinstance(o, list):
        return [_round3(x) for x in o]
    if isinstance(o, dict):
        return {k: _round3(v) for k, v in o.items()}
    return o

def _strip_ind_fields(o):
    """深拷贝并剔除 indicators[*] 的三个合法可变字段(value/value_date/strength)"""
    c = json.loads(json.dumps(o))
    for it in c.get('indicators', []):
        for f in ('value', 'value_date', 'strength'):
            it.pop(f, None)
    return c

def _confined_diff(a, b):
    """回填足迹核验(终版语义:三位小数是官方口径,原始精度微移=噪声):
    ① indicators[*] 的 value/value_date/strength 可自由变(诚实新数据);
    ② 其余一切,在"全体浮点归约到 3 位小数"后必须逐字段相等——即 P/M/R、灯、
       动作、history、lights20 等官方读数一个都不许动;原始精度的微颤放行。
    合规 → 返回人类可读的指标变化清单;越界(3dp口径有变) → 返回 None。"""
    if _round3(_strip_ind_fields(a)) != _round3(_strip_ind_fields(b)):
        return None
    out = []
    for ia, ib in zip(a.get('indicators', []), b.get('indicators', [])):
        for f in ('value', 'value_date', 'strength'):
            if ia.get(f) != ib.get(f):
                out.append(f"{ia['key']}.{f}: {ia.get(f)} → {ib.get(f)}")
    return out

def write_ledger(d):
    raw = open(PKL, 'rb').read()
    led = {'bytes': len(raw), 'sha256': hashlib.sha256(raw).hexdigest(),
           'updated': datetime.now(ZoneInfo('Asia/Shanghai')).strftime('%Y-%m-%d %H:%M'),
           'series': {k: {'rows': int(len(v)), 'last_date': str(v['date'].iloc[-1])[:10]}
                      for k, v in d.items()}}
    with open(LEDGER, 'w', encoding='utf-8') as f:
        json.dump(led, f, ensure_ascii=False, indent=2)
    return led

def append():
    if not os.path.exists(QREPORT):
        sys.exit('✗ 缺 qualify_report.json → 先跑 --qualify。')
    rep = json.load(open(QREPORT, encoding='utf-8'))
    if not rep.get('passed'):
        sys.exit('✗ 资格考试未全科 PASS → 禁止追加。')
    d = pd.read_pickle(PKL)
    import engine_pit as _E                     # 评估日红线:只追严格未来行
    _PCTX_END = pd.Timestamp(_E.PCTX_END)
    print(f'评估日红线 PCTX_END = {str(_PCTX_END)[:10]}(≤此日期的回填由⑥C推进仪式吸收)')
    os.makedirs(BACKUP_DIR, exist_ok=True)
    bkp = os.path.join(BACKUP_DIR, 'series_' + datetime.now(ZoneInfo('Asia/Shanghai')).strftime('%Y%m%d_%H%M%S') + '.pkl')
    shutil.copy2(PKL, bkp)
    print(f'✓ 已备份 → {os.path.relpath(bkp, BASE)}')

    total = 0
    print('── 追加(append-only,历史行零触碰) ──')
    for spec in AUTO:
        key, _, sym, kind = spec
        r = rep['series'][key]
        cand = (r['convention'], r['auto_adjust'], r['postround'])
        old = d[key].reset_index(drop=True)
        last = pd.Timestamp(old['date'].iloc[-1])
        full = compute(spec, cand)
        add = full[full['date'] > last].reset_index(drop=True)
        n_bf = int((add['date'] <= _PCTX_END).sum())
        add = add[add['date'] > _PCTX_END].reset_index(drop=True)
        add.columns = list(old.columns)          # 对齐原表列名(close/val),防concat裂列
        if len(add) == 0:
            note = f'(有{n_bf}点≤评估日,延至⑥C)' if n_bf else ''
            print(f'  = {key:9s} 无新点{note}(末点 {str(last)[:10]})')
            continue
        new = pd.concat([old, add], ignore_index=True)
        if not new.iloc[:len(old)].equals(old):
            shutil.copy2(bkp, PKL)
            sys.exit(f'✗ {key} 前缀相等断言失败 → 已还原备份,退出。')
        d[key] = new
        total += len(add)
        pts = ' '.join(f"{str(x.iloc[0])[:10]}={x.iloc[1]:.4f}" for _, x in add.iterrows())
        note = f'(另{n_bf}点≤评估日,延至⑥C)' if n_bf else ''
        print(f'  + {key:9s} 追加 {len(add)} 点{note}: {pts}')

    if total == 0:
        print('✓ 八条序列均无新点,pkl 未动,收工。')
        return
    pd.to_pickle(d, PKL)

    # 保险丝A:五锚点必须复现(子进程导出器,退出码一票否决)
    # 保险丝B:computed.json 若变,只允许"回填足迹"——indicators[*] 的
    #          value/value_date/strength;其余任何字段(updated/P/M/R/gate/action/
    #          history/replay/lights20/redmonths/episodes/meta)有一丝变化即越界还原。
    #          纯未来行(>评估日)追加 → computed 应逐字节不变;
    #          滞后序列(如 HYOAS)回填 ≤评估日 的行 → 合法变化,需随后重装配上站。
    before = open(os.path.join(BASE, 'computed.json'), 'rb').read()
    ret = subprocess.run([sys.executable, os.path.join(BASE, 'export_computed.py')],
                         capture_output=True, text=True, cwd=BASE)
    after = open(os.path.join(BASE, 'computed.json'), 'rb').read()
    print(ret.stdout.rstrip())
    if ret.returncode != 0:
        shutil.copy2(bkp, PKL)
        with open(os.path.join(BASE, 'computed.json'), 'wb') as f:
            f.write(before)
        sys.exit('✗ 导出器保险丝退出码≠0 → 已还原 pkl 与 computed.json,退出。')
    if before != after:
        chg = _confined_diff(json.loads(before), json.loads(after))
        if chg is None:
            shutil.copy2(bkp, PKL)
            with open(os.path.join(BASE, 'computed.json'), 'wb') as f:
                f.write(before)
            sys.exit('✗ computed.json 出现白名单外变化(非回填足迹)→ 已还原,退出并回报。')
        print('△ 回填触及 ≤评估日 数据,computed.json 合法更新(3位小数官方口径全体不变,已核):')
        for line in chg:
            print('   ', line)
        print('△ 原始精度层面 P/M/网格 允许微颤(噪声);随后请执行: assemble.py --final → make_multilingual.py 使站点同步。')

    led = write_ledger(d)
    tailmsg = 'computed.json 逐字节不变' if before == after else 'computed.json 白名单内更新(见上)'
    print(f'✓ 追加完成:+{total} 点;五锚点复现;{tailmsg};'
          f"台账已更新(bytes={led['bytes']}, sha256={led['sha256'][:12]}…)")

if __name__ == '__main__':
    if '--qualify' in sys.argv[1:]:
        qualify()
    elif '--append' in sys.argv[1:]:
        append()
    else:
        print(__doc__)
