# Bubble Radar 泡沫雷达 · 网站第一版

一个众包驱动的市场泡沫监测平台。纯静态网站，零后端，全部免费托管。

---

## 📁 文件结构

```
bubble-radar/
├── index.html          首页（雷达仪表盘）
├── methodology.html    方法论页（公式）
├── upload.html         数据上传页（含 CSV 自动校验）
├── message.html        留言页
├── data.json           ⭐ 唯一数据源——你每周只改这一个文件
├── assets/
│   ├── logo.svg        泡泡龙 logo（导航栏用）
│   ├── favicon.svg     浏览器标签小图标
│   └── style.css       全站样式（一般不用动）
├── js/
│   └── validate.js     上传页的 CSV 校验逻辑（一般不用动）
└── README.md           本文件
```

---

## 🚀 第一次上线（约 30–40 分钟，全程免费）

### 第 1 步：注册三个免费账号
1. **GitHub** — https://github.com（存代码）
2. **Vercel** — https://vercel.com（托管网站，直接用 GitHub 登录）
3. **Formspree** — https://formspree.io（接收上传文件和留言到你邮箱）

### 第 2 步：填入你的 Formspree 表单 ID（关键！）
上传和留言要发到你邮箱，必须先做这一步，否则表单点了没反应。

1. 登录 Formspree → New Form → 拿到一个表单地址，长这样：
   `https://formspree.io/f/abcdwxyz`
   其中 `abcdwxyz` 就是你的表单 ID。
2. 打开 `upload.html`，搜索 `YOUR_FORMSPREE_ID`，替换成你的 ID。
3. 打开 `message.html`，同样把 `YOUR_FORMSPREE_ID` 替换成你的 ID。
   （上传和留言可以共用一个表单 ID，邮件标题会自动区分；想分开就在 Formspree 建两个表单，各填各的。）

> 💡 第一次有人提交时，Formspree 会给你发一封确认邮件，点一下确认，以后就能正常收到了。免费档每月 50 封提交。

### 第 3 步：传到 GitHub
- 用 Cursor 打开 `bubble-radar` 文件夹 → 关联一个新的 GitHub 仓库 → push。
- （或在 github.com 新建仓库，把所有文件拖进去上传。）

### 第 4 步：用 Vercel 部署
1. 登录 Vercel → Add New → Project → 选你刚建的仓库。
2. Framework Preset 选 **Other**（因为是纯静态）。
3. 点 Deploy。
4. 一分钟后得到一个网址，如 `bubble-radar.vercel.app` —— 任何人都能访问了。

以后每次你 push 代码到 GitHub，Vercel 会**自动重新部署**，不用手动操作。

---

## 🔄 每周更新数据（你的日常，约 5 分钟）

这是整个设计的核心：**你每周只需要改 `data.json` 一个文件的几个数字。**

1. 每周四（或任何时候），把当周最新数据在和 AI 的对话里给它，让它生成新的 `data.json`。
2. 用 Cursor 或 GitHub 网页端，把 `data.json` 的内容替换成新的。
3. 保存 → Commit → Push。
4. 等约 1 分钟，Vercel 自动部署，网站上的 P 值、信号、指标就都更新了。

### data.json 字段说明
- `updated` — 更新日期，首页"数据更新于"会显示它，并据此算"距上次扫描多久"。
- `P` — 综合泡沫压力值（0–1），首页那个大数字。
- `phase` / `monthsToTop` — 当前阶段定性、距顶时间。
- `coreSignals[]` — 四个核心信号，每个有 today / top2000 / proximity（接近度 0–1，决定卡片颜色：<0.4 绿、0.4–0.7 黄、>0.7 红）。
- `monitoredIndicators[]` — 指标墙，没数据的填 `"—"` 会自动显示成灰色"待更新"。
- `focusStocks[]` — 三主线关注股票。
- `pTimeline[]` — 历史 P 值轨迹，`"isNow": true` 标记"我们在这里"。

> ⚠️ 改 JSON 时注意：逗号、引号、括号要配对。改完可以用 https://jsonlint.com 贴进去检查格式对不对，再 push。

---

## 📨 你会收到什么

- **有人上传数据** → 你邮箱收到一封邮件，含：用户填的说明、数据来源、纳入建议、**以及自动校验报告**（标注这份数据有没有异常，方便你判断要不要采纳）。附件是用户上传的 CSV。
- **有人留言** → 你邮箱收到留言内容。

你人工判断后，把值得采纳的数据/修正，在和 AI 的对话里更新进 `data.json`，push 即可。

---

## 🎨 关于"实时"

第一版数据是**人工更新**的（你每周改 data.json），但网站做成了"活雷达"的样子（扫描线转、数字呼吸、计时器走秒）。页面上诚实标注了"数据更新于 X·由社群人工维护"，没有谎称分钟级实时。这是刻意的产品设计——它传达"靠一群人盯着"，而不是假装有个永不停机的机器人。

---

## 🔮 第二版（以后）

架构已为升级铺好路：
- **数据自动化**：把"读 data.json"换成"读数据库/调 API"，或用定时 agent 自动抓数据，前端几乎不用改。
- **用户系统 + 积分**：登录、上传换积分、付费会员。
- **公开留言墙**、**多市场扩展**（日韩 / A股）。

---

*由 泡泡龙（Bub）维护 · Bubble Radar — 与你一起盯着泡沫。*
