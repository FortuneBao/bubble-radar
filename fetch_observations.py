# -*- coding: utf-8 -*-
"""
fetch_observations.py — 装配器第三环:观测值自动抓取
=====================================================
抓 5 个观测值写 observations.json(仅展示、不进泡沫计算):
  US2Y / US10Y ← FRED fredgraph CSV(免密钥, urllib)
  DXY / VVIX / SOX ← yfinance(DX-Y.NYB / ^VVIX / ^SOX)

失败回退(老板 2026-07-02 裁决,取代 calc_spec §8 的置空方案):
  单项失败 → 沿用最近一次成功值并保留其数据日期,打印 ⚠ 警告;
  该项从未有过值 → 置 null(装配器显示"—");
  五项全部失败 → 不改写文件,退出码 1。
值域哨兵:抓到的值越出合理域按失败处理(防单位/解析错)。

⑤B 两项加固(2026-07-02):
  只取已收盘 bar:yfinance 对交易中的当日会返回进行中的临时 bar(如 DXY 近 24 小时
    交易)。以"纽约时区的今天"为界,只放行数据日严格早于它的 bar——必然已收盘定格。
  无变化不改写:五键的 values 与 dates 与现有文件完全一致时,不落盘、不改 updated,
    打印说明后正常退出(退出码 0)。云端日跑据此天然免空提交;updated 由此获得
    "数据最后一次真实落地日"的诚实语义。

observations.json 结构(assemble.py 读 values+dates):
  {"updated": 最后一次数据落地日, "values": {key: 数值}, "dates": {key: 该值的数据日期}}

运行: .venv/bin/python3 fetch_observations.py
依赖: yfinance(requirements.txt)
"""
import csv, io, json, os, sys, urllib.request
from datetime import date, datetime
from zoneinfo import ZoneInfo

_BASE = os.path.dirname(os.path.abspath(__file__))
OBS = os.path.join(_BASE, 'observations.json')
TIMEOUT = 25

# (键, 来源, 代码) —— 顺序即文件内顺序,与 content_zh.json 展示序一致
SPECS = [
    ('US2Y',  'fred', 'DGS2'),
    ('US10Y', 'fred', 'DGS10'),
    ('DXY',   'yf',   'DX-Y.NYB'),
    ('VVIX',  'yf',   '^VVIX'),
    ('SOX',   'yf',   '^SOX'),
]

# 值域哨兵(越界=按失败处理)
RANGES = {
    'US2Y':  (0.1, 12.0),
    'US10Y': (0.1, 12.0),
    'DXY':   (65.0, 140.0),
    'VVIX':  (40.0, 300.0),
    'SOX':   (1000.0, 100000.0),
}

def fetch_fred(series):
    """FRED fredgraph CSV:取最后一个非缺失值 → (值, 数据日期)"""
    url = f'https://fred.stlouisfed.org/graph/fredgraph.csv?id={series}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        text = r.read().decode('utf-8')
    rows = [row for row in csv.reader(io.StringIO(text)) if len(row) >= 2]
    for d, v in reversed(rows[1:]):          # 跳表头,倒序找最新非'.'值
        if v not in ('.', ''):
            return float(v), d
    raise ValueError('序列全为缺失值')

def fetch_yf(sym):
    """yfinance:近10日收盘中,只取已收盘 bar 的最后一笔 → (值, 数据日期)
    已收盘判据:bar 的数据日严格早于"纽约时区的今天"(⑤B,防盘中临时值)。"""
    import yfinance as yf
    h = yf.Ticker(sym).history(period='10d')
    c = h['Close'].dropna()
    today_ny = datetime.now(ZoneInfo('America/New_York')).date()
    c = c[[ts.date() < today_ny for ts in c.index]]
    if len(c) == 0:
        raise ValueError('过滤纽约当日盘中 bar 后无已收盘数据')
    return float(c.iloc[-1]), str(c.index[-1].date())

def main():
    # 读旧文件(容忍旧格式无 dates:逐项日期缺失时回退到旧文件的 updated)
    prev = {'updated': None, 'values': {}, 'dates': {}}
    if os.path.exists(OBS):
        with open(OBS, encoding='utf-8') as f:
            prev = json.load(f)
    prev_vals = prev.get('values', {})
    prev_dates = prev.get('dates', {})
    prev_updated = prev.get('updated')

    values, dates, fresh = {}, {}, 0
    print('── 观测值抓取 ──')
    for key, src, sym in SPECS:
        try:
            v, d = fetch_fred(sym) if src == 'fred' else fetch_yf(sym)
            lo, hi = RANGES[key]
            if not (lo <= v <= hi):
                raise ValueError(f'值 {v} 越出合理域 [{lo}, {hi}]')
            values[key] = round(v, 2)
            dates[key] = d
            fresh += 1
            print(f'  ✓ {key:5s} = {values[key]}  (数据日 {d}, 源 {sym})')
        except Exception as e:
            old_v = prev_vals.get(key)
            old_d = prev_dates.get(key, prev_updated)
            if old_v is None:
                values[key], dates[key] = None, None
                print(f'  ✗ {key:5s} 抓取失败且无历史值 → 置空(前端显示"—") | 原因: {e}')
            else:
                values[key], dates[key] = old_v, old_d
                print(f'  ⚠ {key:5s} 抓取失败 → 沿用 {old_d} 旧值 {old_v} | 原因: {e}')

    if fresh == 0:
        print('✗ 五项全部失败 → 不改写 observations.json(保持原文件),退出码 1。')
        sys.exit(1)

    if values == prev_vals and dates == prev_dates:
        print(f'✓ 五键值与数据日均与现有一致 → 不改写文件(updated 保持 {prev_updated})。')
        return

    out = {'updated': str(date.today()), 'values': values, 'dates': dates}
    with open(OBS, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f'✓ 已写 observations.json({fresh}/5 项新鲜, updated={out["updated"]})')

if __name__ == '__main__':
    main()
