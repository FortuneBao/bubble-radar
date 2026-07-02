# -*- coding: utf-8 -*-
"""
extract_content.py — 一次性引导:从现有 data_base.json 抽取两个装配输入文件
==========================================================================
产出:
  content_zh.json    全部人工文案字段(P/M/R/gate 的 phase/desc、指标 name/desc/
                     direction/unit/tier、观测项 name/desc/unit、history 的
                     name/label/result/type、replay 的 label、episodes 的 event)
  observations.json  5 个观测值(仅数值,带键名;第三步抓取器将接管更新此文件)

★ 仅供首次引导。两文件生成后即为人工维护的真相源,本脚本发现目标文件已存在
  会拒绝运行,防止覆盖后续人工修改。
运行: .venv/bin/python3 extract_content.py
"""
import json, os, sys

_BASE = os.path.dirname(os.path.abspath(__file__))
DB = os.path.join(_BASE, 'data_base.json')
CONTENT_OUT = os.path.join(_BASE, 'content_zh.json')
OBS_OUT = os.path.join(_BASE, 'observations.json')

# 观测项 名称→键 映射(顺序即展示顺序;键名供第三步抓取器使用)
OBS_KEYS = [
    ('2年期美债收益率', 'US2Y'),
    ('10年期美债收益率', 'US10Y'),
    ('美元指数DXY', 'DXY'),
    ('VVIX·波动率的波动率', 'VVIX'),
    ('费城半导体指数·点位', 'SOX'),
]

# history 行序 → id(与 computed.json 的 history id 对齐)
HIST_IDS = ['2000', '2007', '2020', '2022', 'today']

def main():
    for p in (CONTENT_OUT, OBS_OUT):
        if os.path.exists(p):
            print(f"✗ {os.path.basename(p)} 已存在——本脚本仅供首次引导,拒绝覆盖。若确要重建,请先手动删除该文件。")
            sys.exit(1)

    with open(DB, encoding='utf-8') as f:
        d = json.load(f)

    name2key = dict(OBS_KEYS)

    content = {
        'P': {'phase': d['P']['phase'], 'desc': d['P']['desc']},
        'M': {'desc': d['M']['desc']},
        'R': {'desc': d['R']['desc']},
        'gate': {'desc': d['gate']['desc']},
        'indicators': {i['key']: {'name': i['name'], 'desc': i['desc'], 'unit': i['unit'],
                                  'direction': i['direction'], 'tier': i['tier']}
                       for i in d['indicators']},
        'observations': [{'key': name2key[o['name']], 'name': o['name'],
                          'desc': o['desc'], 'unit': o['unit']}
                         for o in d['observations']],
        'history': {hid: {'name': h['name'], 'label': h['label'],
                          'result': h['result'], 'type': h['type']}
                    for hid, h in zip(HIST_IDS, d['history'])},
        'replay': {yr: {'label': d['replay'][yr]['label']} for yr in d['replay']},
        'episodes': {e['start']: {'event': e['event']} for e in d['episodes']},
    }

    obs = {
        'updated': d['updated'],   # 观测值最后更新日(第三步抓取器接管后由其改写)
        'values': {name2key[o['name']]: o['value'] for o in d['observations']},
    }

    with open(CONTENT_OUT, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    with open(OBS_OUT, 'w', encoding='utf-8') as f:
        json.dump(obs, f, ensure_ascii=False, indent=2)
    print(f"✓ 已生成 {os.path.basename(CONTENT_OUT)}(文案 {len(content['indicators'])}指标/"
          f"{len(content['history'])}history/{len(content['episodes'])}episodes)"
          f" 与 {os.path.basename(OBS_OUT)}({len(obs['values'])}个观测值)")

if __name__ == '__main__':
    main()
