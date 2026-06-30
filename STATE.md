# 泡泡龙 Bubble Radar — STATE（项目唯一真相源 · 每次开工先读本文件）
更新: 2026-06-30 · 评估日: 2026-06-26

## 0. 这是什么
PIT（point-in-time, 零前视）量化美股泡沫压力监测 + 三语(zh/en/ko)网站。
哲学: 骑 AI "卖铲人" 抛物线主升浪，靠四色灯总闸退出；AI 部分非价值投资。

## 1. 不可破的原则（违反即作废）
- PIT 零前视: 每个值(P/M/R+四色闸门)只用 ≤评估日 的数据；Fenwick 扩展窗分位；历史数据只作回顾校准。
- series.pkl = 1,197,186 字节、16 键、含手工锚点 → 只加载、永不脚本重建。开工先 `wc -c calc/series.pkl`。
- 引擎评估日常量 PCTX_END 必须 = data.json 的 updated。
- 红线: LLM 永不进核心信号计算（会引入前视+不可复现）。

## 2. 当前权威数值（评估日 2026-06-26）
P=0.963 · M=0.567 · R=0.578 · R趋势=−0.31 │ 灯🟢 · 旗标ON · 信贷✗ · 破位0周 · 满仓骑
历史顶(固定锚点,永不改): 2000=0.879/0.644/0.367 · 2007=0.746/0.516/0.541 · 2020=0.943/0.535/0.699 · 2022=0.786/0.297/0.688

## 3. 引擎 engine_pit.py（256行,已验证）
核心: dynamic_P / calc_M / R_value / R_trend / gate_color
动作层: bubble_flag / P_pct / credit_trigger / confirm_signal / weeks_broken / manage_put / action_state
常量: LAM=MU=0.4 · FLAG_THR=0.85 · CREDIT_PP=1.5 · FAILFAST_WK=12 · PCTX_END='2026-06-26'
依赖装在仓库内 .venv/（见 requirements.txt: numpy/pandas/openpyxl）。本地跑引擎用 `.venv/bin/python3 engine_pit.py`（勿用裸 python3，否则缺 pandas）→ 五时点表+今日动作+四崩盘确认+甩鞭测试，全部应复现锚点。
新机器克隆后重建环境: `python3 -m venv .venv && .venv/bin/pip install -r requirements.txt`。

## 4. 组合（16仓·100%无现金·AI骑顶80%+种子20%）
质量核: GOOGL10 AVGO10 MU9 CEG8 MRVL8 ASML7 GEV6
脆弱: Intel4 LITE4 AAOI3 │ 种子(灯亮不卖): IAU8 JPM7 ICOP5 │ 分散: AIQ5 BOTZ4 │ 独立: RDDT2
退出: 质量核破200日线+更低高点才个股离场否则持有到灯；种子穿越灯。

## 5. 周度体检 + 脆弱层止损（已定）
每周四刷新含全16仓小仪表盘(宏观 P/M/R+灯+旗标+信贷+动作 + 逐股扫描)。
脆弱层(AAOI/Intel/LITE)止损: 周线收盘破50DMA第1周=⚠️警告；连续第2周未收复或更低低点=🔻减/离场(可早于灯)；叙事破裂override立即离场。

## 6. 观察/否决
观察名单: Sivers(SIVE.ST) ~35SEK 极小仓(≤1.5%)、从砍AAOI换入。XFAB 已否决。
永久否决指标: VIX9D、VVIX（别再评估）。

## 7. 两轨架构（演进目标）
轨道A 确定性管线(程序·云端定时·无LLM): 抓数据→engine_pit.py→data.json→建站→部署(人工放行)→信号告警。
轨道B 判断层(LLM·按需·对话): 个股研究·叙事核查·多空·设计。
进度(2026-06-30): 仓库已上云 github.com/FortuneBao/bubble-radar(public)；引擎已可移植(相对路径+venv)、五锚点复现；下一步 GitHub Actions 云端定时跑(深度A:验算+出报告+人工放行)。数据自动抓取(深度B)与 series.pkl 增量写保锚点留待专门一轮。

## 8. 工作法
大文件先在对话过目再落盘 · 模糊处问不猜 · 反面证据优先/要pushback · 全中文 · 投资内容是研究推演非建议。
