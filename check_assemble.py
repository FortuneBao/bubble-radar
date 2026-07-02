# -*- coding: utf-8 -*-
"""
check_assemble.py — 第二步验收:装配产物 对 现有 data_base.json 的逐字节验证
============================================================================
三重测试:
  A 序列化保真:现有 data_base.json 解析后用装配器同款序列化 → 必须逐字节复原自身。
  B 拼接字节比对:把现有 data_base 的 lights20 换成装配版的 lights20,再同款序列化,
    必须与装配产物逐字节一致 —— 证明"除 lights20 修正外,其余每一个字节都相同"。
  C lights20 差异刻画:差集必须恰好 = 剔除陈旧点 2026-06-23 + 补入窗口头一周,
    末点 = 评估日且 P = 当前 P 值。
运行: .venv/bin/python3 check_assemble.py   (退出码 0=验收通过, 1=未通过)
"""
import json, os, sys

_BASE = os.path.dirname(os.path.abspath(__file__))
STALE = '2026-06-23'

def ser(d):
    return json.dumps(d, ensure_ascii=False, indent=2).encode('utf-8')

def main():
    raw_db = open(os.path.join(_BASE, 'data_base.json'), 'rb').read()
    raw_asm = open(os.path.join(_BASE, 'data_base_assembled.json'), 'rb').read()
    db = json.loads(raw_db)
    asm = json.loads(raw_asm)
    fails = []

    # A 序列化保真
    a = ser(db) == raw_db
    print(f"  {'✓' if a else '✗'} A 序列化保真:现有 data_base 同款序列化逐字节复原自身")
    if not a:
        fails.append('A')

    # B 拼接字节比对
    spliced = dict(db)
    spliced['lights20'] = asm['lights20']
    b = ser(spliced) == raw_asm
    print(f"  {'✓' if b else '✗'} B 拼接比对:现有db仅替换lights20后 与 装配产物 逐字节一致")
    if not b:
        fails.append('B')
        # 差异定位辅助:找出除 lights20 外不等的顶层键
        for k in db:
            va = json.dumps(spliced[k], ensure_ascii=False, indent=2)
            vb = json.dumps(asm.get(k), ensure_ascii=False, indent=2)
            if va != vb:
                print(f"      ✗ 顶层键不一致: {k}")

    # C lights20 差异刻画
    dmap = {r['date']: r for r in db['lights20']}
    amap = {r['date']: r for r in asm['lights20']}
    shared_ok = all(dmap[dt] == amap[dt] for dt in set(dmap) & set(amap))
    db_only = sorted(set(dmap) - set(amap))
    a_only = sorted(set(amap) - set(dmap))
    tail = asm['lights20'][-1]
    c = (shared_ok and db_only == [STALE] and len(a_only) == 1
         and tail['date'] == asm['updated'] and tail['P'] == asm['P']['value'])
    print(f"  {'✓' if c else '✗'} C lights20 差异刻画:剔除 {db_only} · 补入 {a_only} · "
          f"共有日期全等={shared_ok} · 末点={tail['date']}(P={tail['P']})")
    if not c:
        fails.append('C')

    print()
    if fails:
        print(f"✗ 第二步验收未通过: {fails}")
        sys.exit(1)
    print('✓ 第二步验收通过:装配产物与现有 data_base.json 逐字节一致,'
          '唯一差异 = 已裁决的 lights20 修正(剔除陈旧点 2026-06-23、窗口头补入一周)。')

if __name__ == '__main__':
    main()
