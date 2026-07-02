# -*- coding: utf-8 -*-
"""
assemble.py — 装配器第二环:合并三输入 → data_base.json
========================================================
输入:computed.json(引擎数字,原始精度) + content_zh.json(人工文案)
     + observations.json(观测值)
输出:默认写 data_base_assembled.json(验收用);
     传 --final 才覆盖 data_base.json(人工放行动作)。

格式对齐(全在本文件,引擎/导出器不管排版):
  emoji→词(🟢green/🟡yellow/🟠orange/🔴red)
  小数位:P/M/R 3位 · R.trend/Rtrend 2位 · 指标value 2位 · strength 1位
  phase_desc 空格:'旗标ON但'→'旗标 ON 但','旗标ON'→'旗标 ON'
  序列化:json indent=2 · ensure_ascii=False · 无尾换行(与现有 data_base 逐字节同风格)

内建保险丝:computed 必须带 anchors_verified=True;结构自检(11指标/权重和90/
lights20长度20/episodes月数=四色之和/文案键齐全),任一不符 → 不写文件、退出码 1。
运行: .venv/bin/python3 assemble.py [--final]
"""
import json, os, sys

_BASE = os.path.dirname(os.path.abspath(__file__))
W = {'🟢': 'green', '🟡': 'yellow', '🟠': 'orange', '🔴': 'red'}
PHASE_DESC_FIX = [('旗标ON但', '旗标 ON 但'), ('旗标ON', '旗标 ON')]

def _load(name):
    with open(os.path.join(_BASE, name), encoding='utf-8') as f:
        return json.load(f)

def _fix(s):
    for a, b in PHASE_DESC_FIX:
        s = s.replace(a, b)
    return s

def _obs_val(v):
    return '—' if v is None else v          # 空哨兵:抓取失败显示破折号(§8)

def die(msg):
    print(f"✗ {msg} → 拒绝装配(退出码 1)。")
    sys.exit(1)

def main():
    C, T, O = _load('computed.json'), _load('content_zh.json'), _load('observations.json')

    # ── 保险丝 ──
    if not C.get('meta', {}).get('anchors_verified'):
        die('computed.json 缺 anchors_verified=True(导出器保险丝未过?)')
    if len(C['indicators']) != 11:
        die(f"指标数 {len(C['indicators'])} ≠ 11")
    if sum(i['weight'] for i in C['indicators']) != 90:
        die('权重和 ≠ 90')
    if len(C['lights20']) != 20:
        die(f"lights20 长度 {len(C['lights20'])} ≠ 20")
    for e in C['episodes']:
        if e['months'] != e['R'] + e['O'] + e['Y'] + e['G']:
            die(f"episode {e['start']} 月数 {e['months']} ≠ 四色之和")
    for i in C['indicators']:
        if i['key'] not in T['indicators']:
            die(f"content_zh 缺指标文案: {i['key']}")
        if i['strength'] is None:
            die(f"指标 {i['key']} strength 为 None(冷启动/陈旧?)")
    for h in C['history']:
        if h['id'] not in T['history']:
            die(f"content_zh 缺 history 文案: {h['id']}")
    for e in C['episodes']:
        if e['start'] not in T['episodes']:
            die(f"content_zh 缺 episode 文案: {e['start']}")
    for o in T['observations']:
        if o['key'] not in O['values']:
            die(f"observations.json 缺观测值: {o['key']}")

    # ── 组装(键序严格对齐现有 data_base.json)──
    out = {
        'updated': C['updated'],
        'P': {'value': round(C['P']['value'], 3), 'phase': T['P']['phase'], 'desc': T['P']['desc']},
        'M': {'value': round(C['M']['value'], 3), 'desc': T['M']['desc']},
        'R': {'value': round(C['R']['value'], 3), 'trend': round(C['R']['trend'], 2),
              'trend_dir': C['R']['trend_dir'], 'desc': T['R']['desc']},
        'gate': {'color': W[C['gate']['color']], 'label': C['gate']['label'], 'desc': T['gate']['desc']},
        'action': {'phase': C['action']['phase'],
                   'phase_desc': _fix(C['action']['action']),
                   'flag_on': C['action']['flag_on'],
                   'P_pct': C['action']['P_pct'],
                   'credit': C['action']['credit'],
                   'light': W[C['action']['light']],
                   'weeks_broken': C['action']['weeks_broken']},
        'indicators': [{'key': i['key'],
                        'name': T['indicators'][i['key']]['name'],
                        'desc': T['indicators'][i['key']]['desc'],
                        'value': round(i['value'], 2),
                        'unit': T['indicators'][i['key']]['unit'],
                        'weight': i['weight'],
                        'strength': round(i['strength'], 1),
                        'direction': T['indicators'][i['key']]['direction'],
                        'tier': T['indicators'][i['key']]['tier']}
                       for i in C['indicators']],
        'observations': [{'name': o['name'], 'desc': o['desc'],
                          'value': _obs_val(O['values'][o['key']]), 'unit': o['unit']}
                         for o in T['observations']],
        'history': [{'name': T['history'][h['id']]['name'],
                     'label': T['history'][h['id']]['label'],
                     'P': round(h['P'], 3), 'M': round(h['M'], 3), 'R': round(h['R'], 3),
                     'Rtrend': round(h['Rtrend'], 2), 'gate': W[h['gate']],
                     'result': T['history'][h['id']]['result'],
                     'type': T['history'][h['id']]['type']}
                    for h in C['history']],
        'replay': {yr: {'label': T['replay'][yr]['label'],
                        'top_date': C['replay'][yr]['top_date'],
                        'weeks': [{'date': w['date'],
                                   'P': round(w['P'], 3), 'M': round(w['M'], 3), 'R': round(w['R'], 3),
                                   'gate': W[w['gate']], 'gate_label': w['gate_label'],
                                   'is_top': w['is_top']}
                                  for w in C['replay'][yr]['weeks']]}
                   for yr in C['replay']},
        'lights20': [{'date': l['date'], 'gate': W[l['gate']], 'P': round(l['P'], 3)}
                     for l in C['lights20']],
        'redmonths': list(C['redmonths']),
        'episodes': [{'start': e['start'], 'end': e['end'], 'months': e['months'],
                      'R': e['R'], 'O': e['O'], 'Y': e['Y'], 'G': e['G'],
                      'event': T['episodes'][e['start']]['event'],
                      'hasred': e['hasred']}
                     for e in C['episodes']],
    }

    final = '--final' in sys.argv[1:]
    out_path = os.path.join(_BASE, 'data_base.json' if final else 'data_base_assembled.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(json.dumps(out, ensure_ascii=False, indent=2))   # 无尾换行,与现有风格一致
    print(f"✓ 装配完成 → {os.path.basename(out_path)}"
          f"(updated={out['updated']}, P={out['P']['value']}, M={out['M']['value']}, "
          f"R={out['R']['value']}, 灯={out['gate']['color']}, phase={out['action']['phase']})")

if __name__ == '__main__':
    main()
