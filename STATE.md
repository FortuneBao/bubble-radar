# 泡泡龙 Bubble Radar — STATE（项目唯一真相源 · 每次开工先读本文件）
更新: 2026-07-01 · 评估日: 2026-06-26

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
进度(2026-07-01): 轨道A v1 已上线并验证。
- GitHub Actions 工作流 .github/workflows/daily-run.yml:每日 UTC05:00(北京13:00)+手动触发;7步:checkout→Py3.12→装依赖→验series.pkl(1197186)→跑引擎存报告→验算五锚点(缺任一即红灯)→上传报告artifact(留30天)。
- 云端手动运行 #1/#3 均 Success:Python 3.12 在云端复现五锚点,跨版本一致坐实(本地3.14/云端3.12一致)。
- 官方action已升级 checkout@v5/setup-python@v6/upload-artifact@v5。
- 已知无害事项:upload-artifact@v5 仍报"Node20 deprecated"警告,为该组件上游已知问题、不影响运行,待v2改为报告回写仓库后自然消除。
- 认证约定:gh CLI 在当前VPN网络下不可用(api.github.com被掐断/token验证失败),已放弃;所有操作走"git推送(钥匙串免密)+GitHub网页触发/查看",Claude Code 指令中不再使用 gh 命令。
- v1只读、不回写仓库、不部署;v2起做:生成data.json→人工放行→Netlify自动部署。
Netlify现状(2026-07-01): 当前为手动拖拽部署,站点 bubbleradar0622.netlify.app,网站源码在仓库 site/ 目录。v2目标:改为Netlify连接GitHub仓库、盯site/自动部署,配合PR人工放行。

## 8. 工作法
大文件先在对话过目再落盘 · 模糊处问不猜 · 反面证据优先/要pushback · 全中文 · 投资内容是研究推演非建议。

## 9. 研究进展(2026-07-01)
- 完成全样本信号体检(见 scan/fullsample_scan.md):模型通过拷问,退出层覆盖每场大跌,平静期干净,双信号(灯/信贷)分工互补。
- 2022旗标漏报已裁决:不修,退出层gate🟠已兜住,FLAG_THR保持0.85。
- 信贷指标探索:候选#1(信贷-股市背离)已检验并否决。

## 10. 待解决问题清单(未来探索,勿遗漏)
1. 【2022型顶的早预警缺陷】2022(估值/利率杀型)顶,旗标漏报+所有信贷类信号滞后(信贷腿本身失灵),仅gate🟠在顶后74天兜住。补它的正确方向是"广度/波动类背离"(如"股价还涨但市场广度已走弱"),不是信贷类。未来纳入新理论时,顺带检验能否补上此缺陷,且必须同时通过全样本检验、不破坏其余时期。
2. 【HY-IG价差待验+缺数据】候选#3(HY-IG价差,测风险传染/系统性升级)理论上有独立价值,但缺IG利差长历史数据(FRED BAMLC0A0CM仅回溯到2023)。待解决:找到IG利差1996+的长历史源。
3. 【信贷指标仍需打磨】信贷腿是抓急性/信贷型顶的主力,值得继续找能补HYOAS盲区(而非冗余)的信贷类指标,但候选必须过五关检验(PIT/全样本/平静期/增量/分型)。

## 11. 新工作方法进度(v1完成,v2半程)
- v1(完成):GitHub Actions云端每日跑引擎+五锚点自验+出报告。
- v2(进行中,路线B):目标=让引擎自动吐出结构化数据(装配器),打通"引擎→data_base.json→网站"全自动+人工放行。
  - 已完成:摸清链路(engine只print不落文件;data_base.json目前人肉装配是最大断点;make_multilingual.py下游全自动可复现)。
  - 已定架构:装配器三文件(engine吐computed.json数字类 + 人工content_zh.json文案 + observations独立文件),assemble.py合并→data_base.json。
  - 已完成(2026-07-02):①calc_spec.md定稿。②装配器第一环=export_computed.py(引擎零字节改动、只读调用;内建五锚点保险丝,任一不符拒绝导出;吐computed.json全数字原始精度,格式对齐留给assemble)+check_computed.py(验收50项对data_base全绿;唯一差异=剔除lights20陈旧点2026-06-23——旧评估日残留,人肉追加新点未删旧点,已裁决以装配器为准)。冻结常量(四顶锚点/4个replay顶日/11段episode起止/redmonths起点1997-07)硬编码在导出器并注明勿改;★今日锚点与PCTX_END耦合,评估日推进时须一同更新。
  - 已完成(2026-07-02):②b装配器第二环=extract_content.py(一次性引导:从旧data_base抽content_zh.json文案库+observations.json观测值,防覆盖保护)+assemble.py(computed+content_zh+observations三输入合并;格式对齐emoji→词/小数位/"旗标ON"→"旗标 ON";内建结构保险丝;默认写验收稿,--final才覆盖真身)+check_assemble.py(三重验收:A序列化保真/B拼接字节比对/C差异刻画,全过)。已执行--final:data_base.json落地lights20两行修正(剔06-23补02-13),make_multilingual重生成site/data.json(仅同一修正,其余字节不变)。链条"引擎→computed→data_base→三语data.json"全确定性闭环。注:check_computed第7节与check_assemble的C测试针对修正前旧db,真身修正后不再成立属预期(一次性验收工具);文案变更流程=改content_zh.json→assemble --final(论述性措辞大改需同步make_multilingual的英/韩锚句);观测值今后只改observations.json(键US2Y/US10Y/DXY/VVIX/SOX,null显示"—")。
  - 已完成(2026-07-02):③观测抓取器=fetch_observations.py(FRED fredgraph CSV抓DGS2/DGS10+yfinance抓DX-Y.NYB/^VVIX/^SOX;值域哨兵防单位错;失败回退按裁决=单项失败沿用最近成功值并带其数据日期、从未有值才null、五项全失败不改写;observations.json新增dates逐项日期表,assemble零改动兼容;总设计师沙盒6场景13断言全过+本机实跑走通全链fetch→assemble --final→make_multilingual)。新依赖yfinance入requirements.txt。data_base的updated仍=PCTX_END红线不动,观测新鲜度看observations.json的dates。AAII裁决:缓做,与新指标批量检验+series.pkl追加放同一专门轮。
  - 待做:④Netlify新站点bubbleradarv03连GitHub盯site/自动部署 ⑤抓取器并入GitHub Actions日跑(留云端回写轮) ⑥核心11指标自动更新=series.pkl追加保锚点+AAII录入派生(最难,专门一轮)。
  - 观测值(2yr/10yr/DXY/VVIX/SOX)数据源已定:FRED家族(DGS2/DGS10走CSV/API) + yfinance家族(DX-Y.NYB/^VVIX/^SOX);AAII手动周更(官网反爬,输入=Bull/Neutral/Bear三个原始数,脚本派生spread和bull比例两序列);observations存独立文件不进series.pkl。
