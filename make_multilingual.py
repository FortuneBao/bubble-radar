#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
make_multilingual.py — 把引擎装配出的「基础版 data_base.json」(纯中文文案)
转成网站用的「多语言 data.json」({zh,en,ko})。

用法:  python3 make_multilingual.py  [in=data_base.json]  [out=data.json]

⚠ 文案翻译按结构位置硬编码(指标按 key / 观测·历史·危机段按顺序),
  对「只有数值变化」的每周刷新是稳健的。
  但若某条「论述性文案」(P.phase/P.desc/M.desc/R.desc/gate.desc)的中文措辞改了,
  需同步改下面对应的 en/ko 串(它们以当前中文为 zh 锚)。
"""
import json, sys, os
IN  = 'data_base.json'
OUT = 'data.json'
for a in sys.argv[1:]:
    if a.startswith('in='):  IN=a[3:]
    if a.startswith('out='): OUT=a[4:]

d=json.load(open(IN,encoding='utf-8'))
def ml(zh,en,ko): return {'zh':zh,'en':en,'ko':ko}

# ---- P / M / R / gate (论述性文案) ----
d['P']['phase']=ml(d['P']['phase'],'Tightest in history · no rupture yet','역사상 가장 팽팽 · 아직 붕괴 없음')
d['P']['desc']=ml(d['P']['desc'],'Structural pressure now exceeds 2000 — the highest of the five moments; but the rupture-confirmation light is still green.','구조적 압력이 이미 2000년을 넘어 다섯 시점 중 최고; 그러나 붕괴 확인등은 여전히 초록.')
d['M']['desc']=ml(d['M']['desc'],'The "weight" accumulated up high — the dynamite load pressing on the foundation, the highest of the five moments.','고점에 누적된 "무게" — 지반을 짓누르는 폭약 당량, 다섯 시점 중 최고.')
d['R']['desc']=ml(d['R']['desc'],'Whether the inflow sustaining the boom is still running strong (demoted to auxiliary, not a trigger).','번영을 떠받치는 유입이 아직 왕성한지 (보조로 강등, 방아쇠 아님).')
if 'label' in d['gate']: d['gate']['label']=ml(d['gate']['label'],'Trend intact','추세 양호')
d['gate']['desc']=ml(d['gate']['desc'],'All three major indices above the 200-day line, volatility not high — the rupture has not begun.','3대 지수가 모두 200일선 위, 변동성도 높지 않음 — 붕괴는 아직 시작되지 않음.')

# ---- action (动作状态机读数; phase 用映射表, phase_desc 以当前中文为锚) ----
phase_map={
 '满仓骑':('Ride at full position','풀 포지션 유지'),
 '减仓':('Trim down','비중 축소'),
 '观察(旗标OFF)':('Watch (flag OFF)','관망 (깃발 OFF)'),
 '做空确认':('Short confirmed','숏 확인'),
 '过渡':('Transition','전환 중'),
}
if 'action' in d:
    ph=d['action']['phase']
    e,k=phase_map.get(ph,(ph,ph)); d['action']['phase']=ml(ph,e,k)
    d['action']['phase_desc']=ml(d['action']['phase_desc'],
        'Flag ON but trend intact \U0001F7E2 \u2192 ride the bubble at full position; start trimming only once the light turns yellow.',
        '\uAE43\uBC1C ON\uC774\uC9C0\uB9CC \uCD94\uC138 \uC591\uD638 \U0001F7E2 \u2192 \uD480 \uD3EC\uC9C0\uC158\uC73C\uB85C \uBC84\uBE14\uC5D0 \uC62C\uB77C\uD0C0\uACE0, \uB178\uB780\uBD88\uC774 \uCF1C\uC9C8 \uB54C \uBE44\uC911 \uCD95\uC18C \uC2DC\uC791.')

# ---- 危险方向(可复用映射) ----
dirmap={
 '越高越危险':('higher = more dangerous','높을수록 위험'),
 '越窄越危险':('narrower = more dangerous','좁을수록 위험'),
 '越低越危险':('lower = more dangerous','낮을수록 위험'),
 '越低越久越危险':('lower & longer = more dangerous','낮고 오래일수록 위험'),
 '越贪婪越危险':('greedier = more dangerous','탐욕적일수록 위험'),
}
# ---- 11 指标(按 key) name + desc ----
ind_tr={
 'SOX_DEV':('Semiconductors vs 200-day avg','반도체 200일선 이격','How far the semiconductor sector trades above its yearly average; higher = more fragile','반도체 가격이 연평균선보다 높은 정도; 높을수록 취약'),
 'NDQ_DEV':('Nasdaq vs 200-day avg','나스닥 200일선 이격','How far the Nasdaq trades above its yearly average','나스닥이 연평균선보다 높은 정도'),
 'BREADTH':('Market breadth · SPY÷RSP','시장 폭 · SPY÷RSP','Cap-weighted SPY ÷ equal-weight RSP; the higher the ratio, the more gains concentrate in a few giants = the narrower the breadth','시총가중 SPY ÷ 동일가중 RSP; 비율이 높을수록 상승이 소수 거대 기업에 집중 = 폭이 좁음'),
 'CAPE':('CAPE cyclical valuation','CAPE 경기조정 밸류에이션','The Shiller P/E, a ten-year average valuation adjusted for inflation','실러 PER, 인플레이션을 제거한 10년 평균 밸류에이션'),
 'CONC':('Concentration · top-10 weight','시장 집중도 · 상위 10종목 비중','The top-ten companies\u2019 weight in the S&P 500; the more concentrated, the more fragile','상위 10개 기업의 S&P 500 내 비중; 집중될수록 취약'),
 'MARGIN_GDP':('Margin leverage / GDP','신용잔고 레버리지 / GDP','Margin debt as a share of GDP — the true leverage after stripping out inflation and growth','신용잔고의 GDP 대비 비중 — 인플레이션과 성장을 제거한 진짜 레버리지'),
 'VIX':('VIX complacency build-up','VIX 안주 누적','The fear index; the lower and longer it stays, the more complacent the market and the more pressure piles up','공포 지수; 낮고 오래일수록 시장이 안주하고 압력이 더 쌓임'),
 'AAII':('AAII retail sentiment','AAII 개인 심리','Bulls minus bears; the greedier, the closer to a top','강세 − 약세; 탐욕적일수록 천장에 가까움'),
 'CONC_PREMIUM':('Concentration bubble premium','집중도 버블 프리미엄','Top-ten weight minus earnings share — separating a real moat from a valuation bubble','상위 10종목 비중 − 이익 비중 — 진짜 해자와 밸류에이션 버블을 구별'),
 'HYOAS':('High-yield credit spread','하이일드 신용 스프레드','The spread between junk bonds and Treasuries; the lower it is, the more optimistically risk is priced','정크본드와 국채의 스프레드; 낮을수록 위험을 낙관적으로 가격에 반영'),
 'IPO':('IPO mania','IPO 과열도','The annual number of IPOs; the more there are, the bigger the cash-out frenzy','연간 IPO 건수; 많을수록 차익 실현 열풍'),
}
for it in d['indicators']:
    en_n,ko_n,en_d,ko_d=ind_tr[it['key']]
    it['name']=ml(it['name'],en_n,ko_n); it['desc']=ml(it['desc'],en_d,ko_d)
    if it.get('direction') in dirmap:
        e,k=dirmap[it['direction']]; it['direction']=ml(it['direction'],e,k)

# ---- 5 观测(按顺序) ----
obs_tr=[
 ('2-year Treasury yield','2년 국채 수익률','Short-end rates; 6.55% at the 2000 top vs 0.77% at the 2022 top — no monotonic relationship with tops','단기 금리; 2000년 천장 6.55% vs 2022년 천장 0.77% — 천장과 단조 관계 없음'),
 ('10-year Treasury yield','10년 국채 수익률','Long-end rates; macro backdrop','장기 금리; 거시 배경'),
 ('Dollar index (DXY)','달러 지수 DXY','Dollar strength; a backdrop for capital flows','달러 강약; 자금 흐름 배경'),
 ('VVIX · volatility of volatility','VVIX · 변동성의 변동성','The volatility of the VIX itself; data only from 2006','VIX 자체의 변동성; 2006년부터 데이터'),
 ('Philadelphia Semiconductor Index · level','필라델피아 반도체 지수 · 지수','The absolute level of semiconductors; its information is already captured by the deviation-from-average indicator','반도체 절대 지수; 그 정보는 이미 이동평균 이격 지표에 반영됨'),
]
for o,(en_n,ko_n,en_d,ko_d) in zip(d['observations'],obs_tr):
    o['name']=ml(o['name'],en_n,ko_n); o['desc']=ml(o['desc'],en_d,ko_d)

# ---- 5 历史(按顺序) name/label/result/type ----
his_tr=[
 ('March 2000','2000년 3월','Dot-com top','닷컴 천장','Crash −78% (Nasdaq)','폭락 −78% (나스닥)','Valuation bubble · yellow throughout the top','밸류에이션 버블 · 천장 내내 노랑'),
 ('October 2007','2007년 10월','Before the credit crisis','신용위기 직전','Crisis −57% (S&P)','위기 −57% (S&P)','Credit spillover · not an equity self-implosion','신용 전이 · 증시 자폭 아님'),
 ('February 2020','2020년 2월','Before COVID','코로나 직전','Black swan −34%','블랙스완 −34%','External shock · V-shaped rebound','외부 충격 · V자 반등'),
 ('January 2022','2022년 1월','Rate-hike cycle top','금리 인상 사이클 천장','Rate-hike bear −36%','금리 인상 약세장 −36%','Engine stalled · policy pricked it','엔진 정지 · 정책이 찌름'),
 ('Today','오늘','AI cycle','AI 사이클','In progress','진행 중','Tightest in history · trend intact','역사상 가장 팽팽 · 추세 양호'),
]
for h,(en_n,ko_n,en_l,ko_l,en_r,ko_r,en_t,ko_t) in zip(d['history'],his_tr):
    h['name']=ml(h['name'],en_n,ko_n); h['label']=ml(h['label'],en_l,ko_l)
    h['result']=ml(h['result'],en_r,ko_r); h['type']=ml(h['type'],en_t,ko_t)

# ---- 11 危机段(按顺序) event ----
ep_tr=[
 ('Dot-com top + double bottom','닷컴 천장 + 이중 바닥'),
 ('Global financial crisis','글로벌 금융위기'),
 ('COVID flash crash','코로나 급락'),
 ('Rate-hike bear (orange throughout · never red)','금리 인상 약세장 (내내 주황 · 한 번도 빨강 아님)'),
 ('Euro crisis / US downgrade','유럽 재정위기 / 미국 신용강등'),
 ('Flash crash / early euro crisis','플래시 크래시 / 유럽 재정위기 초기'),
 ('Q4 2018 plunge','2018년 4분기 급락'),
 ('LTCM aftermath','LTCM 여파'),
 ('1994 bond rout','1994 채권 폭락'),
 ('Asian financial crisis','아시아 금융위기'),
 ('Summer 2004 pullback','2004년 여름 조정'),
]
for e,(en_e,ko_e) in zip(d['episodes'],ep_tr):
    e['event']=ml(e['event'],en_e,ko_e)

json.dump(d,open(OUT,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print(f'✅ 写出 {OUT}  ({os.path.getsize(OUT)} 字节)')
