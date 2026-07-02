# -*- coding: utf-8 -*-
"""
check_computed.py — 第一步验收:computed.json 数字逐项比对 data_base.json
========================================================================
比对时临时套用第二步 assemble 将做的格式对齐(emoji→词、四舍五入、忽略空格比文案),
仅为验证数字正确;真正的格式转换仍属第二步 assemble.py。

预期结果:全绿,唯 lights20 一处"已知修正"(现有 data_base 中 2026-06-23 一条是
旧评估日的人肉装配残留——推进评估日时追加了新点未删旧点。老板已裁决以装配器为准)。

运行: .venv/bin/python3 check_computed.py   (退出码 0=验收通过, 1=有意外差异)
"""
import json, sys

C = json.load(open('computed.json', encoding='utf-8'))
D = json.load(open('data_base.json', encoding='utf-8'))

W = {'🟢': 'green', '🟡': 'yellow', '🟠': 'orange', '🔴': 'red'}
fails, notes = [], []

def ok(name, cond, detail=''):
    if cond:
        print(f"  ✓ {name}")
    else:
        print(f"  ✗ {name}  {detail}")
        fails.append(name)

def eq(a, b):
    return abs(a - b) < 1e-9

def nospace(s):
    return ''.join(str(s).split())

print('══ 1) 宏观 P/M/R/gate ══')
ok('updated', C['updated'] == D['updated'], f"{C['updated']} vs {D['updated']}")
ok('P.value(3位)', eq(round(C['P']['value'], 3), D['P']['value']))
ok('M.value(3位)', eq(round(C['M']['value'], 3), D['M']['value']))
ok('R.value(3位)', eq(round(C['R']['value'], 3), D['R']['value']))
ok('R.trend(2位)', eq(round(C['R']['trend'], 2), D['R']['trend']))
ok('R.trend_dir', C['R']['trend_dir'] == D['R']['trend_dir'])
ok('gate.color(词)', W[C['gate']['color']] == D['gate']['color'])
ok('gate.label', C['gate']['label'] == D['gate']['label'])

print('══ 2) action(9字段→7字段映射) ══')
ca, da = C['action'], D['action']
ok('phase', ca['phase'] == da['phase'])
ok('phase_desc(忽略空格)', nospace(ca['action']) == nospace(da['phase_desc']),
   f"\n      engine: {ca['action']}\n      db    : {da['phase_desc']}")
ok('light(词)', W[ca['light']] == da['light'])
ok('flag_on', bool(ca['flag_on']) == bool(da['flag_on']))
ok('P_pct', eq(ca['P_pct'], da['P_pct']))
ok('credit', bool(ca['credit']) == bool(da['credit']))
ok('weeks_broken', ca['weeks_broken'] == da['weeks_broken'])

print('══ 3) indicators × 11 ══')
dmap = {i['key']: i for i in D['indicators']}
for ci in C['indicators']:
    k = ci['key']; di = dmap[k]
    good = (ci['weight'] == di['weight']
            and eq(round(ci['value'], 2), di['value'])
            and eq(round(ci['strength'], 1), di['strength']))
    ok(f"{k}(weight/value/strength)", good,
       f"计算 {ci['weight']}/{round(ci['value'],2)}/{round(ci['strength'],1)} vs db {di['weight']}/{di['value']}/{di['strength']}")
ok('顺序一致', [i['key'] for i in C['indicators']] == [i['key'] for i in D['indicators']])

print('══ 4) history × 5(四冻结顶+今天) ══')
for ch, dh in zip(C['history'], D['history']):
    good = (eq(round(ch['P'], 3), dh['P']) and eq(round(ch['M'], 3), dh['M'])
            and eq(round(ch['R'], 3), dh['R']) and eq(round(ch['Rtrend'], 2), dh['Rtrend'])
            and W[ch['gate']] == dh['gate'])
    ok(f"{ch['id']}({dh['name']})", good,
       f"计算 {round(ch['P'],3)}/{round(ch['M'],3)}/{round(ch['R'],3)}/{round(ch['Rtrend'],2)}/{W[ch['gate']]} vs db {dh['P']}/{dh['M']}/{dh['R']}/{dh['Rtrend']}/{dh['gate']}")

print('══ 5) replay × 4(每窗13周) ══')
for yr in ['2000', '2007', '2020', '2022']:
    cr, dr = C['replay'][yr], D['replay'][yr]
    bad = []
    if cr['top_date'] != dr['top_date']:
        bad.append('top_date')
    for cw, dw in zip(cr['weeks'], dr['weeks']):
        good = (cw['date'] == dw['date'] and eq(round(cw['P'], 3), dw['P'])
                and eq(round(cw['M'], 3), dw['M']) and eq(round(cw['R'], 3), dw['R'])
                and W[cw['gate']] == dw['gate'] and nospace(cw['gate_label']) == nospace(dw['gate_label'])
                and bool(cw['is_top']) == bool(dw['is_top']))
        if not good:
            bad.append(cw['date'])
    ok(f"replay {yr}(13周全字段)", len(bad) == 0, f"差异: {bad}")

print('══ 6) episodes × 11 + redmonths ══')
for ce, de in zip(C['episodes'], D['episodes']):
    good = all(ce[k] == de[k] for k in ['start', 'end', 'months', 'R', 'O', 'Y', 'G', 'hasred'])
    ok(f"episode {ce['start']}..{ce['end']}", good, f"计算 {ce} vs db {de}")
ok('redmonths 逐项一致', C['redmonths'] == D['redmonths'],
   f"计算{len(C['redmonths'])}项 vs db{len(D['redmonths'])}项")

print('══ 7) lights20(已知修正块) ══')
STALE = '2026-06-23'   # 人肉装配残留:旧评估日的点,推进到 06-26 时追加了新点却未删除此点
cmap = {r['date']: r for r in C['lights20']}
dmap20 = {r['date']: r for r in D['lights20']}
shared = sorted(set(cmap) & set(dmap20))
overlap_bad = [dt for dt in shared
               if not (eq(round(cmap[dt]['P'], 3), dmap20[dt]['P']) and W[cmap[dt]['gate']] == dmap20[dt]['gate'])]
ok(f"共有日期 {len(shared)} 条逐条相等", len(overlap_bad) == 0, f"差异: {overlap_bad}")
db_only = sorted(set(dmap20) - set(cmap))
c_only = sorted(set(cmap) - set(dmap20))
new_tail = C['lights20'][-1]
expected_fix = (db_only == [STALE]                                  # db 独有 = 恰好那条陈旧点
                and len(c_only) == 1                                 # 计算独有 = 窗口头前移一周补位
                and new_tail['date'] == C['updated']
                and eq(round(new_tail['P'], 3), round(C['P']['value'], 3)))
ok('已知修正符合预期(差集恰为陈旧点与补位点)', expected_fix,
   f"db独有={db_only} 计算独有={c_only}")
notes.append(f"lights20 已知修正:剔除陈旧点 {STALE}(P={dmap20.get(STALE,{}).get('P')},旧评估日残留,卡在倒数第二位),"
             f"窗口头前移补入 {c_only[0] if c_only else '?'};"
             f"末点 = 评估日 {new_tail['date']}(P={round(new_tail['P'],3)} = 当前P值,自洽)")

print()
if fails:
    print(f"✗ 验收未通过,{len(fails)} 处意外差异: {fails}")
    sys.exit(1)
print('✓ 验收通过:全部数字复现 data_base.json;唯一差异为已裁决的 lights20 修正——')
for n in notes:
    print('  ·', n)
