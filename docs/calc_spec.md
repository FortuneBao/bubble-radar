# 泡泡龙美股泡沫雷达 · 计算规范 (calc_spec.md)

> **权威声明**:本文件是计算逻辑的"人话真相源"。与代码冲突时,**以 `engine_pit.py` 为准**。最后更新 2026-07-01。
> 所有公式均由 engine_pit.py 逐行提取并经全样本实跑验证(五锚点复现)。三处曾易被误读、已纠正:①`calc_M` 不直接用 MU;②`action_state` 只有 5 个 phase;③AAII 用两条不同序列。

---

## §0 元信息与常量

- **评估日** `PCTX_END = '2026-06-26'`(= data.json 的 updated,红线:两者必须相等)。
- **常量总表**(原样):

| 常量 | 值 | 用途 |
|---|---|---|
| `LAM` | 0.4 | P/R 动量放大:速度项 `tanh(v)` 系数 |
| `MU` | 0.4 | P/R 动量放大:正加速度项 `max(0,a)` 系数 |
| `P_WINDOW` | 12(月) | P 的速度/加速度回看窗 |
| `R_WINDOW` | 6(月) | R 的速度/加速度回看窗;R_trend 差分窗 |
| `MIN_OBS` | 12 | 冷启动:历史观测 < 12 则该指标不出值 |
| `TOL` 默认 | 45(天) | 陈旧容忍;例外:CONC/IPO/CONC_PREMIUM=400、MARGIN_GDP=90 |
| `FLAG_THR` | 0.85 | 泡沫旗标阈值(P 分位 53 周滚动峰值 ≥ 此) |
| `CREDIT_PP` | 1.5 | 信贷扳机:HYOAS 较半年低点走阔 ≥ 此(百分点) |
| `FAILFAST_WK` | 12(周) | 甩鞭快速止损窗口 |
| `DAY` | 86400×10⁹ | 1 天的纳秒数(陈旧判定用) |

---

## §1 数据层

### series.pkl —— 16 键(全部两列 DataFrame)

| 键 | 列 | 频率 | 跨度 | 角色 | 数据源 / 抓取 / 自动化状态 |
|---|---|---|---|---|---|
| SOX_DEV | date,val | 日 | 1996–26 | 指标:费半偏离200日均线 | 由费半价格派生;源待确认(v2补) |
| NDQ_DEV | date,val | 日 | 1990–26 | 指标:纳指偏离200日均线 | 由纳指价格派生;源待确认 |
| BREADTH | date,val | 日 | 2005–26 | 指标:SPY÷RSP | 由 SPY/RSP 派生;源待确认 |
| CAPE | date,val | 月 | 1881–26 | 指标:席勒周期估值 | Shiller/multpl;源待确认 |
| CONC | date,val | 年 | 1997–26 | 指标:前10权重 | 标普前10市值占比;源待确认 |
| CONC_PREMIUM | date,val | 年 | 2000–26 | 指标:集中度泡沫溢价 | 前10权重−盈利占比;源待确认 |
| MARGIN_GDP | date,val | 月 | 2000–26 | 指标:保证金杠杆/GDP | FINRA margin debt ÷ GDP;源待确认 |
| VIX | date,val | 日 | 1990–26 | 指标(反向) | CBOE/^VIX;源待确认 |
| AAII | date,val | 周 | 1987–26 | 指标分位源:**看多比例** | AAII 情绪调查(手工周更,见§8) |
| AAII_SPREAD | date,val | 周 | 1987–26 | **仅展示值源**:净多空差 | 同上(手工派生) |
| HYOAS | date,val | 日 | 1996–26 | 指标(反向)+信贷扳机 | **FRED `BAMLH0A0HYM2`** |
| IPO | date,val | 年 | 2000–25 | 指标:IPO 过热 | 年度IPO数;源待确认 |
| _SP500 | date,**close** | 日 | 1990–26 | 闸门/广度/动量/BO;展示回撤 | 指数收盘(已在 pkl) |
| _DJIA | date,**close** | 日 | 1990–26 | 同上 | 指数收盘(已在 pkl) |
| _NDQ | date,**close** | 日 | 1990–26 | 同上;展示回撤 | 指数收盘(已在 pkl) |
| _Z1FLOW | date,val | 季 | 1990–26 | R 的 Z1 分项 | Fed Z.1 资金流;源待确认 |

**★ series.pkl 铁律**:= **1,197,186 字节**、16 键、**含手工锚点** → **只加载、永不脚本重建**。开工先 `wc -c calc/series.pkl`。当前 16 键均**手工离线维护、并入冻结 pkl**;v2 不改此(新数据走观测层独立文件 + 装配器)。

### marginstatistics.xlsx
- 工作表 `Customer Margin Balances`,取列 `Year-Month` + `Debit Balances in Customers' Securities Margin Accounts`。
- 计算 `debit.pct_change(6) × 100`(6 月同比 %)→ 喂 **R 的 MARGIN_G 分项**(注意:这不是指标层的 MARGIN_GDP)。

---

## §2 指标层

### 权重 WEIGHTS(和 = 90)与反向 REVERSE(仅 VIX/HYOAS)

| key | 权重 | 反向? | key | 权重 | 反向? |
|---|---|---|---|---|---|
| SOX_DEV | 14 | 否 | VIX | 7 | **是** |
| NDQ_DEV | 12 | 否 | AAII | 7 | 否 |
| BREADTH | 11 | 否 | CONC_PREMIUM | 5 | 否 |
| CAPE | 10 | 否 | HYOAS | 5 | **是** |
| CONC | 8 | 否 | IPO | 3 | 否 |
| MARGIN_GDP | 8 | 否 | | | |

和 = 14+12+11+10+8+8+7+7+5+5+3 = **90**。反向仅 **VIX、HYOAS**(低值=危险,分位翻转)。

### exo_pit(k, ts) —— 单指标 0–1 PIT 分位(逐行)

1. **预处理** `_build()`:每 key 按 date 排序、`dropna(val)`,对 `val` 序列算 `_expanding_pit`,缓存 `(日期int64, pit)`。
2. **`_expanding_pit(vals)`**:**扩展窗、无前视**。`pit[i]` = `vals[:i]` 中**严格小于** `vals[i]` 的比例;`pit[0]=0`。实现用 **Fenwick/BIT 树**:`np.unique` 秩压缩 → 遍历时 `qry(c)/i`(前缀和=之前秩<c 的个数)→ `upd(c)`。O(n log n)。
3. **as-of**:`i = searchsorted(dns, ts, 'right') − 1`(≤ts 的最后一点)。
4. **冷启动**:`i<0` 或 `i<MIN_OBS(=12)` → **None**。
5. **陈旧**:`ts − dns[i] > TOL 天` → **None**(TOL 见 §0)。
6. **反向**:`p = pit[i]`;`REVERSE[k]` 为真返回 `1−p`,否则 `p`。
7. **展示** `strength = exo_pit × 100`(已验证 11/11 精确复现 data_base.json)。

### ★ AAII 双序列专章(有意为之)
- **展示 `value`** = `AAII_SPREAD × 100`(最新 0.088 → **8.8** = Bull% − Bear% 净多空差)。
- **算分位 `strength`** = `exo_pit('AAII') × 100`,用的是 **`AAII` 键 = 看多比例**(最新 0.449 → 77.2)。
- **两条序列不同源、刻意如此**:展示给用户看直观的"净情绪差",算压力分位用"看多比例"。
- **每周输入** = Bull / Neutral / Bear 三个原始数;脚本派生两序列(`AAII`=Bull 比例、`AAII_SPREAD`=Bull−Bear)。

---

## §3 宏观合成层(常量 LAM=MU=0.4,P_WINDOW=12,R_WINDOW=6)

### energy_level(ts)
对 11 指标:`cp = exo_pit(k,ts)`;`past` = 当月及前 6 月(`range(7)`)的 exo_pit 中非 None 者;
单指标贡献 = `weight × (0.6·cp + 0.4·mean(past))`(past 空则用 cp)。
**能量 = Σ贡献 ÷ Σ(当时可用指标的权重 W)**。归一化按**实际可用**权重和(全在=90;缺项按实际和),不是死除 90。

### dynamic_P(ts) —— P 值
```
En  = energy_level(ts)
E12 = energy_level(ts − 12月)
E24 = energy_level(ts − 24月)
v = En − E12                 # 速度(12月变化)
a = (En−E12) − (E12−E24)     # 加速度
P = En × (1 + LAM·tanh(v) + MU·max(0, a))     # LAM=MU=0.4
```
= 当前能量 × 动量放大子:速度经 `tanh` 有界±1(×0.4),加速度只取正 `max(0,a)`(×0.4)——上涨且加速时 P 被放大。

### calc_M(ts) —— M 值(60 月正向棘轮累加)
```
Ps = [dynamic_P(ts − k月) for k in 59..0]   # 60个月,由远及近
e = 0
for i in 1..59:  e += Ps[i] − Ps[i−1];  e = max(0, e)   # 每步截断到 ≥0
M = e
```
= 5 年内 **P 的正向增量累加**(负增量被 `max(0,·)` 吞掉),"高处累积的重量"。
**★ 明确:calc_M 不直接用 LAM/MU**——它调用的 `dynamic_P` 内部才有;calc_M 自身只做棘轮累加。

### R_value / R_trend —— 资金活性(同形动量放大,窗口 6 月)
- **`activity(ts)`** = 4 分项 PIT 分位加权:`0.5×mean(MARGIN_G, Z1) + 0.25×MOM + 0.25×BO`(按可用 renorm)。各分项及陈旧容忍:
  - **MARGIN_G**(tol=45):margin 借方 6 月同比%(xlsx)→ PIT 分位。
  - **Z1**(tol=200):`_Z1FLOW` 4 季滚动均 → PIT 分位。
  - **MOM**(tol=10):3 指数各 `close ÷ 126日滚动最高` 求均 → PIT 分位。
  - **BO**(tol=10):3 指数各 `126日内 close>200日均线 天数占比` 求均 → PIT 分位。
- **`R_value`** = `A × (1 + LAM·tanh(A−A6) + MU·max(0, (A−A6)−(A6−A12)))`,`A/A6/A12` = 活性在 ts / −6月 / −12月(任一 None → None)。
- **`R_trend(ts)`** = `R_value(ts) − R_value(ts − 6月)`。

---

## §4 闸门层 gate_color(ts) → 🟢🟡🟠🔴

**两个输入**:
- **广度破位** `broken`:`br(d)` = 3 指数(_SP500/_DJIA/_NDQ)中 `close>200日均线` 的个数(0–3)。`broken = (br(d)≤1) 且 (br(d−7天)≤1)` —— **≤1 个在线上、且连续两周**。
- **波动分位** `vp`:周网格(W-FRI,**1991 起**)算 `vol_raw`= 3 指数各"最近 126 日对数收益 std × √252"求均,再 `_expanding_pit` → PIT 分位;取 as-of ts。

**判定(阈值原样)**:
```
若 not broken:  vp≥0.90 → 🟡"波动惊吓·趋势未破"       否则 → 🟢"趋势完好"
若 broken:      vp≥0.90 → 🔴"暴力崩盘"
                vp≥0.70 → 🟠"破裂+承压"
                否则     → 🟡"早期破位"
```

---

## §5 动作层(FLAG_THR=0.85 · CREDIT_PP=1.5 · FAILFAST_WK=12)

- **bubble_flag(ts)**:`_build_pctx` 在周网格(**1997-06-06 .. PCTX_END**)算 P,`pct[i]=(P[:i+1] ≤ P[i]).mean()`(**含自身 ≤**),`flag = pct 的 53 周滚动最大`;`bubble_flag = flag(as-of ts) ≥ 0.85`。含义:**过去约 1 年内 P 曾进历史前 15%** → 旗标 ON。
- **P_pct(ts)**:上述 `pct` 的 as-of 值(今日 = 0.94)。
- **credit_trigger(ts)**:`cur = HYOAS 当前值`;`lo = 过去 183 天 HYOAS 最低`;**触发 = `cur ≥ lo + 1.5pp`**。
- **weeks_broken(ts)**:自 ts 往回数 `_broken_g` 连续成立的周数(上限 200)。`_broken_g` = 与闸门同口径的广度破位。
- **confirm_signal(ts)**:`灯 ∈ {🟠,🔴}` **或** `credit_trigger` → 崩盘确认。
- **manage_put(entry, now)**:自建仓起逐周走;若 **≤12 周(FAILFAST_WK)** 内回 🟢 且未破位 → 返回 **`止损离场`**(甩鞭假信号);否则 → **`持有/滚动`**。

### action_state(ts) 的 5 个 phase(逐条触发)
```
col,lab=gate_color; flag=bubble_flag; cr=credit_trigger
conf=(col∈🟠🔴) or cr;  wb=weeks_broken if conf else 0
① not flag            → '观察(旗标OFF)'   非泡沫顶环境,本策略不介入,常规持仓
② flag & 🟢 & not cr   → '满仓骑'          旗标ON+趋势完好 → 满仓骑,黄灯再减
③ flag & 🟡 & not cr   → '减仓'            旗标ON+🟡(通常已破7~12%)→ 减/清
④ flag & conf         → '做空确认'        旗标ON+崩盘确认(🟠/🔴/信贷),已破位wb周 → 清股+买12月裸put
⑤ 其余                 → '过渡'            旗标ON、信号过渡中,观望
返回 dict: date, light, label, flag_on, P_pct, credit, weeks_broken, phase, action
```
**★ 注明**:`manage_put` 的 **`持有/滚动` vs `止损离场`** 是**独立函数返回值,不是 action_state 的 phase**。"清仓+对冲"对应 phase `做空确认`。

---

## §6 两种分位口径说明(并存,不统一)

- **指标层 `_expanding_pit`** 用**严格 `<`**(之前值严格小于当前值的比例)。
- **`P_pct` / bubble_flag 的 pct** 用**含自身 `≤`**(`(P[:i+1]≤P[i]).mean()`)。
- 两者差异为 **1/n**(样本量大时可忽略)。
- **★ 刻意不统一**:统一会改动历史数值,破坏五锚点复现。规范以"复现锚点"为最高优先级,故保留两口径并存。

---

## §7 派生字段(装配器目标:computed.json)

装配器让引擎吐一份"全数字 JSON",供合并成 data_base.json。分三类(详见 provenance 分析):

**🟢 引擎可直接给**(现成/加 emoji→词映射即可):
- `updated`(=PCTX_END);`P.value` `M.value` `R.value` `R.trend`;`R.trend_dir`(取 trend 符号);`gate.color`(🟢→green)、`gate.label`;`action` 全 7 字段(action_state 整包);`indicators[].key/.weight`(=WEIGHTS)/`.strength`(=exo_pit×100)。
- `history[].P/M/R/Rtrend/gate` 引擎能重算,**但按铁律读固定锚点值、不重算**。

**🟡 引擎需扩展**(有函数/数据,缺输出或组装):
- `indicators[].value`:新增"每 key 最新原始 val"访问器(10/11 直取;**AAII 特例 = AAII_SPREAD×100**)。
- `episodes[].R/O/Y/G/hasred`:对每段区间用 `gate_color` **数各色月份**。
- `replay[].weeks[].{P,M,R,gate,gate_label,is_top}`:对每次崩盘窗口**逐周遍历组装**。
- `lights20[].{date,gate,P}`:组装最近 20 周序列。
- `redmonths[]`:扫全历史挑红色月份。

**⚪ 纯人工文案/常量**:P/M/R/gate 的 phase/desc;indicators 的 name/desc/direction/unit/tier;observations 的 name/desc/unit;history 的 name/label/result/type;episodes 的 start/end/months/event;replay 的 label/top_date。

**格式细节(装配器必须对齐)**:emoji→词(🟢green/🟡yellow/🟠orange/🔴red);`R.trend` 保 2 位小数;`action.phase_desc` 的空格排版(data_base 有"旗标 ON",引擎输出"旗标ON",须对齐否则网站文案微差)。

---

## §8 观测层(独立于 series.pkl)

5 个观测值(仅展示、不进泡沫计算),**不进 series.pkl、存独立文件**:

| 观测 | 数据源 / 符号 | 抓取 |
|---|---|---|
| 2年期美债 | FRED `DGS2` | CSV/API |
| 10年期美债 | FRED `DGS10` | CSV/API |
| 美元指数 DXY | yfinance `DX-Y.NYB` | API |
| VVIX | yfinance `^VVIX` | API |
| 费半指数(绝对) | yfinance `^SOX` | API |

- **investing.com 弃用**(反爬)。
- **抓取失败 → 空哨兵降级**(TradingAgents 模式:填 `"—"`/空,前端显示灰色"待更新",不中断)。
- **AAII 手动周更**(官网反爬):输入 Bull/Neutral/Bear 三原始数,脚本派生 `AAII`(bull 比例)与 `AAII_SPREAD`(净差)两序列(见 §2)。

---

## §9 L2 新指标登记模板 + 架构

### 新指标登记模板(未来加宏观指标,须填全)
| 字段 | 说明 |
|---|---|
| key | 大写英文键名 |
| 中文 name / desc | 展示文案 |
| 数据源 + 抓取方法 | FRED 代码 / yfinance 符号 / 手工;CSV/API |
| 清洗规则 | dropna、单位、派生(如 pct_change) |
| 方向 REVERSE? | 低值危险=是(如 VIX/HYOAS) |
| 权重 | 整数;**注明并入 WEIGHTS 后新的归一化和** |
| TOL 陈旧天数 | 日频 45 / 月频 90 / 年频 400 |
| MIN_OBS | 默认 12 |
| 展示 value 算法 | 原始 val,或特殊派生(如 AAII=SPREAD×100) |
| 文案字段 | name/desc/direction/unit/tier(人工) |

### 个股 / 板块层架构
- 各自 `computed_*.json` + 各自文案库 + 装配器合并;**独立于大盘泡沫趋势、结合看**(大盘管总闸,个股管标的)。

### ★ 信号分工地图(收录自 scan/fullsample_scan.md)
- **信贷扳机** → 抓**急性 / 信贷型顶**(2007 顶前 74 天、2020 顶后 9 天)。
- **gate 🟠🔴** → 抓**估值 / 政策型慢熊**(2022 顶后 74 天、2023、2025;信贷不响时灯顶上)。
- **旗标层(P_pct≥0.85)** = **宽松进场开关,非卖出信号**(2007/2022 未触发也无妨,退出靠确认层)。
- **新指标须证明:它补的是这张图上哪块空白**(尤其"2022 型估值杀"的早预警,方向=广度/波动背离,非信贷)。

### ★ 新指标检验协议(五关,全过才纳入)
0. **PIT 接数据**(零前视、并入或独立存)。
1. **描述性初筛**(在已知顶附近是否有信号)。
2. **全样本扫描**(2005–2026,**看平静期是否平静**)。
3. **增量价值**(补盲区,还是与现有信号冗余)。
4. **分型矩阵**(信号→后续回撤的落点)。
5. **通过才定权重、建公式**。

**当前裁决**:候选#1(信贷-股市背离)**已否决**(高噪音回声、无增量、补不了 2022);候选#3(HY-IG 价差,测风险传染)**待长历史数据**(FRED `BAMLC0A0CM` 仅回溯 2023,需 1996+ 源)。
