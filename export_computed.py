# -*- coding: utf-8 -*-
"""
export_computed.py — 装配器第一环:引擎数字出口
================================================
只读调用 engine_pit(引擎文件零字节改动)。产出 computed.json:
全部数字类字段、原始精度、emoji 原样;四舍五入 / emoji→词 / 空格排版 /
文案,全部留给第二步 assemble.py + content_zh.json(引擎管算、装配管排版)。

内建保险丝:导出前复算五锚点(四历史顶 + 今天),与下方冻结常量逐一比对
(P/M/R 三位小数)。任一不符 → 不写文件、退出码 1(红灯)。

运行: .venv/bin/python3 export_computed.py
"""
import json, os, sys
import numpy as np
import pandas as pd
import engine_pit as E

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'computed.json')

# ══════════════ 冻结常量(历史定死 · 勿改) ══════════════

# 四个历史顶锚点:P/M/R(3位) + Rtrend(2位) + 当日灯。按铁律只读、永不重算覆盖。
FROZEN_HISTORY = [
    {'id': '2000', 'date': '2000-03-10', 'P': 0.879, 'M': 0.644, 'R': 0.367, 'Rtrend': -0.05, 'gate': '🟡'},
    {'id': '2007', 'date': '2007-10-09', 'P': 0.746, 'M': 0.516, 'R': 0.541, 'Rtrend': -0.18, 'gate': '🟢'},
    {'id': '2020', 'date': '2020-02-19', 'P': 0.943, 'M': 0.535, 'R': 0.699, 'Rtrend': 0.22,  'gate': '🟢'},
    {'id': '2022', 'date': '2022-01-03', 'P': 0.786, 'M': 0.297, 'R': 0.688, 'Rtrend': -0.09, 'gate': '🟢'},
]

# 第五锚点 = 今天(评估日)。★评估日推进时,此行必须与 engine 的 PCTX_END 一同更新。
TODAY_ANCHOR = {'date': '2026-06-26', 'P': 0.963, 'M': 0.567, 'R': 0.578}

# 四次崩盘复盘的真实顶日期(窗口规则见 replay 段注释)
REPLAY_TOPS = {'2000': '2000-03-10', '2007': '2007-10-09', '2020': '2020-02-19', '2022': '2022-01-03'}

# 11 段历史情节起止月(与 data_base.json 顺序一致;色计数口径=每月最后一个日历日评估灯)
EPISODE_WINDOWS = [
    ('2000-01', '2003-03'), ('2007-11', '2009-06'), ('2020-03', '2020-08'),
    ('2022-02', '2022-12'), ('2011-08', '2011-11'), ('2010-05', '2010-08'),
    ('2018-10', '2019-01'), ('1998-09', '1999-09'), ('1994-04', '1994-07'),
    ('1997-05', '1998-04'), ('2004-07', '2004-09'),
]

# redmonths 扫描起点 = P 周网格起点(1997-06-06)后的首个整月。
# 已验证 1991-06..1997-06 亦无红月,起点选择不影响结果,钉死以保确定性。
REDMONTHS_START = '1997-07'

# 指标输出顺序(与 data_base 展示序一致:按权重降序)
INDICATOR_ORDER = ['SOX_DEV', 'NDQ_DEV', 'BREADTH', 'CAPE', 'CONC', 'MARGIN_GDP',
                   'VIX', 'AAII', 'CONC_PREMIUM', 'HYOAS', 'IPO']

# ══════════════ 小工具 ══════════════

def _fri_floor(d):
    """≤d 的最后一个周五"""
    d = pd.Timestamp(d)
    return d - pd.Timedelta(days=(d.weekday() - 4) % 7)

def _fri_ceil(d):
    """≥d 的第一个周五(d 为周五则取自身)"""
    d = pd.Timestamp(d)
    return d + pd.Timedelta(days=(4 - d.weekday()) % 7)

def _fri_nearest(d):
    """离 d 最近的周五(平局取前)"""
    d = pd.Timestamp(d)
    f, c = _fri_floor(d), _fri_ceil(d)
    return f if (d - f) <= (c - d) else c

def _f(x):
    """numpy 数值 → 原生 float(None 透传),保证 JSON 可序列化"""
    return None if x is None else float(x)

# ══════════════ 保险丝:五锚点自验 ══════════════

def verify_anchors():
    if E.PCTX_END != TODAY_ANCHOR['date']:
        print(f"✗ PCTX_END({E.PCTX_END}) ≠ 今日锚点日期({TODAY_ANCHOR['date']}),两者必须一同更新。")
        return False
    rows = [(h['date'], h['P'], h['M'], h['R']) for h in FROZEN_HISTORY]
    rows.append((TODAY_ANCHOR['date'], TODAY_ANCHOR['P'], TODAY_ANCHOR['M'], TODAY_ANCHOR['R']))
    ok = True
    print('── 五锚点自验(导出前保险丝) ──')
    for d, p, m, r in rows:
        rv = E.R_value(d)
        cp, cm = round(_f(E.dynamic_P(d)), 3), round(_f(E.calc_M(d)), 3)
        cr = None if rv is None else round(_f(rv), 3)
        hit = (cp, cm, cr) == (p, m, r)
        ok &= hit
        crs = f"{cr:.3f}" if cr is not None else "None"
        print(f"  {d}: 复算 {cp:.3f}/{cm:.3f}/{crs} vs 锚点 {p:.3f}/{m:.3f}/{r:.3f} {'✓' if hit else '✗ 不符!'}")
    return ok

# ══════════════ 组装 ══════════════

def build():
    end = pd.Timestamp(E.PCTX_END)
    E._build_pctx()
    Pser, grid = E._PCTX['P'], E._PCTX['grid']

    # —— 宏观 P / M / R / 灯 ——
    P, M = _f(E.dynamic_P(end)), _f(E.calc_M(end))
    R, Rt = _f(E.R_value(end)), _f(E.R_trend(end))
    trend_dir = None if Rt is None else ('up' if Rt > 0 else ('down' if Rt < 0 else 'flat'))
    col, lab = E.gate_color(end)

    # —— 动作层:action_state 整包 9 字段原样(第二步再映射为 data_base 的 7 字段)——
    act = E.action_state(E.PCTX_END)
    act = {k: (bool(v) if isinstance(v, (bool, np.bool_)) else v) for k, v in act.items()}

    # —— 11 指标:value = 该键最新一笔原始值(≤评估日);唯一特例 AAII = AAII_SPREAD×100 ——
    s = E.load()
    inds = []
    for k in INDICATOR_ORDER:
        src = 'AAII_SPREAD' if k == 'AAII' else k
        df = s[src].dropna(subset=['val']).sort_values('date')
        df = df[df['date'] <= end]
        raw = float(df['val'].iloc[-1])
        if k == 'AAII':
            raw *= 100.0
        st = E.exo_pit(k, end)
        inds.append({'key': k, 'weight': E.WEIGHTS[k], 'value': raw,
                     'value_date': str(df['date'].iloc[-1].date()),
                     'strength': None if st is None else _f(st) * 100.0})

    # —— history:四顶读冻结锚点,"今天"行取实时 ——
    hist = [dict(h, frozen=True) for h in FROZEN_HISTORY]
    hist.append({'id': 'today', 'date': E.PCTX_END, 'P': P, 'M': M, 'R': R,
                 'Rtrend': Rt, 'gate': col, 'frozen': False})

    # —— replay:窗口中心 = 顶所在周(或其后第一个)周五,±6 周共 13 点;is_top = 离顶最近的周五 ——
    replay = {}
    for yr, td in REPLAY_TOPS.items():
        top = pd.Timestamp(td)
        center, mark = _fri_ceil(top), _fri_nearest(top)
        weeks = []
        for w in range(-6, 7):
            d = center + pd.Timedelta(weeks=w)
            c2, l2 = E.gate_color(d)
            rv = E.R_value(d)
            weeks.append({'date': str(d.date()), 'P': _f(Pser.asof(d)), 'M': _f(E.calc_M(d)),
                          'R': _f(rv), 'gate': c2, 'gate_label': l2, 'is_top': bool(d == mark)})
        replay[yr] = {'top_date': td, 'weeks': weeks}

    # —— lights20:周网格最近 20 个周五(末点 = 评估日)——
    l20 = []
    for d in grid[-20:]:
        c2, _ = E.gate_color(d)
        l20.append({'date': str(pd.Timestamp(d).date()), 'gate': c2, 'P': _f(Pser.loc[d])})

    # —— episodes 色计数 + redmonths(口径:每月最后一个日历日评估灯)——
    m2c = {'🔴': 'R', '🟠': 'O', '🟡': 'Y', '🟢': 'G'}
    eps = []
    for st_, en_ in EPISODE_WINDOWS:
        c = {'R': 0, 'O': 0, 'Y': 0, 'G': 0}
        for mth in pd.period_range(st_, en_, freq='M'):
            d = mth.to_timestamp(how='end').normalize()
            c[m2c[E.gate_color(d)[0]]] += 1
        eps.append({'start': st_, 'end': en_, 'months': sum(c.values()),
                    'R': c['R'], 'O': c['O'], 'Y': c['Y'], 'G': c['G'], 'hasred': c['R'] > 0})

    reds = []
    for mth in pd.period_range(REDMONTHS_START, end.to_period('M'), freq='M'):
        d = mth.to_timestamp(how='end').normalize()
        if E.gate_color(d)[0] == '🔴':
            reds.append(str(mth))

    return {
        'updated': E.PCTX_END,
        'P': {'value': P},
        'M': {'value': M},
        'R': {'value': R, 'trend': Rt, 'trend_dir': trend_dir},
        'gate': {'color': col, 'label': lab},
        'action': act,
        'indicators': inds,
        'history': hist,
        'replay': replay,
        'lights20': l20,
        'redmonths': reds,
        'episodes': eps,
        'meta': {'generated_by': 'export_computed.py', 'engine': 'engine_pit.py',
                 'pctx_end': E.PCTX_END, 'anchors_verified': True},
    }

if __name__ == '__main__':
    if not verify_anchors():
        print('✗ 五锚点未全部复现 → 拒绝导出 computed.json(退出码 1)。')
        sys.exit(1)
    data = build()
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"✓ 五锚点全部复现,已写 {os.path.basename(OUT)}"
          f"(updated={data['updated']}, P={data['P']['value']:.3f}, M={data['M']['value']:.3f}, R={data['R']['value']:.3f})")
