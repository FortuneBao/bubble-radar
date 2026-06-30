"""
泡泡龙 Bubble Radar 定稿引擎 —— Point-in-Time (无前视 / 走查式)
计算 t 时刻只用 <= t 的数据; 未来数据仅供回顾校准. 冷启动: 历史观测 < MIN_OBS 丢弃.
取代 engine.py(全样本含前视). 数据: SERIES_PATH (NDQ_DEV 已补全至1990)
"""
import pickle, numpy as np, pandas as pd
SERIES_PATH='/home/claude/calc/series.pkl'
MARGIN_PATH='/mnt/project/marginstatistics.xlsx'
WEIGHTS={'SOX_DEV':14,'NDQ_DEV':12,'CONC':8,'CONC_PREMIUM':5,'BREADTH':11,'CAPE':10,
         'MARGIN_GDP':8,'VIX':7,'AAII':7,'HYOAS':5,'IPO':3}
REVERSE={'SOX_DEV':False,'NDQ_DEV':False,'CONC':False,'CONC_PREMIUM':False,'BREADTH':False,
         'CAPE':False,'MARGIN_GDP':False,'VIX':True,'AAII':False,'HYOAS':True,'IPO':False}
# BREADTH 已由涨跌家数换为 SPY/RSP 相对强弱: 高比值=越窄=越险 -> REVERSE=False
TOL={'CONC':400,'IPO':400,'CONC_PREMIUM':400,'MARGIN_GDP':90}
LAM=MU=0.4; P_WINDOW=12; R_WINDOW=6; MIN_OBS=12; DAY=86400*10**9

def _expanding_pit(vals):
    """vals按日期序; 返回 pit[i]=vals[:i]中严格小于vals[i]的比例 (扩张窗口, 无前视). pit[0]=0"""
    v=np.asarray(vals,float); n=len(v); uniq=np.unique(v); comp=np.searchsorted(uniq,v)
    m=len(uniq); tree=np.zeros(m+2,int); pit=np.zeros(n)
    def upd(i):
        i+=1
        while i<=m: tree[i]+=1; i+=i&-i
    def qry(i):
        s=0
        while i>0: s+=tree[i]; i-=i&-i
        return s
    for i in range(n):
        c=int(comp[i])
        if i>0: pit[i]=qry(c)/i
        upd(c)
    return pit

_prep=None; _comp=None; _gate=None
def load():
    with open(SERIES_PATH,'rb') as f: return pickle.load(f)

def _build():
    global _prep
    if _prep is not None: return
    s=load(); _prep={}
    for k in WEIGHTS:
        df=s[k].dropna(subset=['val']).sort_values('date').reset_index(drop=True)
        dns=df['date'].values.astype('datetime64[ns]').astype('int64')
        _prep[k]=(dns,_expanding_pit(df['val'].values))
def exo_pit(k,ts):
    if _prep is None: _build()
    dns,pit=_prep[k]; t=pd.Timestamp(ts).value
    i=int(np.searchsorted(dns,t,side='right'))-1
    if i<0 or i<MIN_OBS: return None                    # 无值 / 冷启动
    if (t-int(dns[i]))>TOL.get(k,45)*DAY: return None   # 当日无近值
    p=pit[i]; return (1-p) if REVERSE[k] else p
def energy_level(ts,weights=None):
    w=weights or WEIGHTS; num=0; W=0
    for k,wt in w.items():
        cp=exo_pit(k,ts)
        if cp is None: continue
        past=[exo_pit(k,pd.Timestamp(ts)-pd.DateOffset(months=m)) for m in range(7)]
        past=[p for p in past if p is not None]
        num+=wt*(0.6*cp+0.4*(np.mean(past) if past else cp)); W+=wt
    return num/W if W>0 else 0
def dynamic_P(ts,weights=None,lam=LAM,mu=MU):
    d=pd.Timestamp(ts)
    En=energy_level(d,weights); E12=energy_level(d-pd.DateOffset(months=P_WINDOW),weights); E24=energy_level(d-pd.DateOffset(months=2*P_WINDOW),weights)
    v=En-E12; a=(En-E12)-(E12-E24); return En*(1+lam*np.tanh(v)+mu*max(0,a))
def calc_M(ts,weights=None,nmonths=60):
    months=[pd.Timestamp(ts)-pd.DateOffset(months=k) for k in range(nmonths-1,-1,-1)]
    Ps=[dynamic_P(m,weights) for m in months]; e=0
    for i in range(1,len(Ps)): e+=Ps[i]-Ps[i-1]; e=max(0,e)
    return e

def _buildR():
    global _comp
    if _comp is not None: return
    s=load()
    mg=pd.read_excel(MARGIN_PATH, sheet_name='Customer Margin Balances')
    mg=mg[['Year-Month',"Debit Balances in Customers' Securities Margin Accounts"]].copy(); mg.columns=['ym','debit']
    mg['date']=pd.to_datetime(mg['ym'],format='%Y-%m'); mg=mg.sort_values('date').reset_index(drop=True); mg['val']=mg['debit'].pct_change(6)*100
    MG=mg.dropna(subset=['val']).reset_index(drop=True)
    z=s['_Z1FLOW'].sort_values('date').reset_index(drop=True).copy(); z['val']=z['val'].rolling(4).mean(); Z1=z.dropna(subset=['val']).reset_index(drop=True)
    def mom(x):
        x=x.sort_values('date').reset_index(drop=True).copy(); x['v']=x['close']/x['close'].rolling(126).max(); return x[['date','v']].rename(columns={'v':'val'})
    ml=[mom(s[k]) for k in ['_SP500','_DJIA','_NDQ']]; mm=ml[0].rename(columns={'val':'a'})
    mm=mm.merge(ml[1].rename(columns={'val':'b'}),on='date').merge(ml[2].rename(columns={'val':'c'}),on='date'); mm['val']=mm[['a','b','c']].mean(axis=1); MOM=mm.dropna(subset=['val']).reset_index(drop=True)
    def bo(x):
        x=x.sort_values('date').reset_index(drop=True).copy(); x['ma']=x['close'].rolling(200).mean(); x['ab']=(x['close']>x['ma']).astype(float); x['v']=x['ab'].rolling(126).mean(); return x[['date','v']].rename(columns={'v':'val'})
    bl=[bo(s[k]) for k in ['_SP500','_DJIA','_NDQ']]; bb=bl[0].rename(columns={'val':'a'})
    bb=bb.merge(bl[1].rename(columns={'val':'b'}),on='date').merge(bl[2].rename(columns={'val':'c'}),on='date'); bb['val']=bb[['a','b','c']].mean(axis=1); BO=bb.dropna(subset=['val']).reset_index(drop=True)
    _comp={}
    for nm,df,tol in [('MARGIN_G',MG,45),('Z1',Z1,200),('MOM',MOM,10),('BO',BO,10)]:
        df=df.sort_values('date').reset_index(drop=True)
        dns=df['date'].values.astype('datetime64[ns]').astype('int64')
        _comp[nm]=(dns,_expanding_pit(df['val'].values),tol)
def _rexo(k,ts):
    dns,pit,tol=_comp[k]; t=pd.Timestamp(ts).value; i=int(np.searchsorted(dns,t,side='right'))-1
    if i<0 or i<MIN_OBS or (t-int(dns[i]))>tol*DAY: return None
    return pit[i]
def activity(ts):
    _buildR()
    pm=_rexo('MARGIN_G',ts); pz=_rexo('Z1',ts); pmo=_rexo('MOM',ts); pb=_rexo('BO',ts)
    nm=np.mean([x for x in [pm,pz] if x is not None]) if (pm is not None or pz is not None) else None
    num=0; w=0
    for val,wt in [(nm,0.5),(pmo,0.25),(pb,0.25)]:
        if val is not None: num+=wt*val; w+=wt
    return num/w if w>0 else None
def R_value(ts,lam=LAM,mu=MU):
    d=pd.Timestamp(ts); A=activity(d); A6=activity(d-pd.DateOffset(months=R_WINDOW)); A12=activity(d-pd.DateOffset(months=2*R_WINDOW))
    if None in (A,A6,A12): return None
    v=A-A6; a=v-(A6-A12); return A*(1+lam*np.tanh(v)+mu*max(0,a))
def R_trend(ts):
    a=R_value(ts); b=R_value(pd.Timestamp(ts)-pd.DateOffset(months=R_WINDOW))
    return (a-b) if (a is not None and b is not None) else None

# ---- 四色闸门 (波动百分位也走 point-in-time) ----
def _buildG():
    global _gate
    if _gate is not None: return
    s=load(); idx={}
    for k in ['_SP500','_DJIA','_NDQ']:
        x=s[k].sort_values('date').reset_index(drop=True).copy(); x['ret']=np.log(x['close']).diff(); x['ma200']=x['close'].rolling(200).mean(); idx[k]=x
    grid=pd.date_range('1991-01-01','2026-06-26',freq='W-FRI'); vols=[]
    def vol_raw(d):
        v=[]
        for k in idx:
            sub=idx[k][idx[k]['date']<=d].tail(126)
            if len(sub)>20: v.append(sub['ret'].std()*np.sqrt(252))
        return np.mean(v) if v else np.nan
    gv=np.array([vol_raw(d) for d in grid]); gn=grid.values.astype('datetime64[ns]').astype('int64')
    ok=~np.isnan(gv); gn=gn[ok]; gv=gv[ok]; gpit=_expanding_pit(gv)
    _gate={'idx':idx,'gn':gn,'gpit':gpit,'vol_raw':vol_raw}
def gate_color(ts):
    _buildG(); g=_gate; d=pd.Timestamp(ts)
    def breadth(dd):
        c=0
        for k in g['idx']:
            sub=g['idx'][k][g['idx'][k]['date']<=dd]
            if len(sub) and pd.notna(sub['ma200'].iloc[-1]) and sub['close'].iloc[-1]>sub['ma200'].iloc[-1]: c+=1
        return c
    br=breadth(d); brp=breadth(d-pd.Timedelta(days=7)); broken=(br<=1) and (brp<=1)
    i=int(np.searchsorted(g['gn'],d.value,side='right'))-1; vp=g['gpit'][i] if i>=0 else 0.5
    if not broken: return ('🟡','波动惊吓·趋势未破') if vp>=0.90 else ('🟢','趋势完好')
    if vp>=0.90: return ('🔴','暴力崩盘')
    if vp>=0.70: return ('🟠','破裂+承压')
    return ('🟡','早期破位')

# ============ 动作层：泡沫旗标 + HYOAS信贷扳机 + 两层动作状态机 + 12周快速止损 ============
# (原 engine_pit_v2.py 工作副本，已并入正式版；E. 引用改为本模块直接引用)
FLAG_THR = 0.85          # 泡沫旗标阈值：过去12月 P 的扩展分位峰值 ≥ 0.85
CREDIT_PP = 1.5          # 信贷扳机：HYOAS > 前6月低位 + 1.5pp
FAILFAST_WK = 12         # 快速止损窗口（周）
PCTX_END = '2026-06-26'  # P 分位走查网格终点（=当前评估日）

_PCTX=None
def _build_pctx():
    """预算 P 的 PIT 扩展分位 + 过去12月分位峰值(旗标)。一次性缓存。"""
    global _PCTX
    if _PCTX is not None: return
    grid=pd.date_range('1997-06-06',PCTX_END,freq='W-FRI')
    P=np.array([dynamic_P(d) for d in grid])
    pct=np.array([(P[:i+1]<=P[i]).mean() for i in range(len(P))])
    s_pct=pd.Series(pct,index=grid)
    flag=s_pct.rolling(53,min_periods=1).max()
    _PCTX={'grid':grid,'P':pd.Series(P,index=grid),'pct':s_pct,'flag':flag}

def _asof(series,ts):
    i=series.index.searchsorted(pd.Timestamp(ts),side='right')-1
    return series.iloc[max(i,0)]

def bubble_flag(ts,thr=FLAG_THR):
    _build_pctx(); return bool(_asof(_PCTX['flag'],ts)>=thr)

def P_pct(ts):
    _build_pctx(); return float(_asof(_PCTX['pct'],ts))

_HY=None
def _hy():
    global _HY
    if _HY is None:
        s=load(); hy=s['HYOAS'].copy(); hy['date']=pd.to_datetime(hy['date'])
        _HY=hy.set_index('date')['val'].sort_index()
    return _HY

def credit_trigger(ts):
    hy=_hy(); d=pd.Timestamp(ts)
    if d<hy.index[0]: return False
    cur=hy.loc[:d].iloc[-1]; lo=hy.loc[d-pd.Timedelta(days=183):d].min()
    return bool(cur>=lo+CREDIT_PP)

def _broken_g(d):
    """≥2/3 指数在 200 日线下方、且上一周亦如此 = 破位。(动作层自带, 与 gate_color 同口径)"""
    d=pd.Timestamp(d); _buildG(); idx=_gate['idx']
    def br(dd):
        c=0
        for k in idx:
            sub=idx[k][idx[k]['date']<=dd]
            if len(sub) and pd.notna(sub['ma200'].iloc[-1]) and sub['close'].iloc[-1]>sub['ma200'].iloc[-1]: c+=1
        return c
    return (br(d)<=1) and (br(d-pd.Timedelta(days=7))<=1)

def confirm_signal(ts):
    """崩盘确认 = 灯达🟠/🔴 或 信贷扳机。"""
    col,_=gate_color(ts); return (col in ('🟠','🔴')) or credit_trigger(ts)

def weeks_broken(ts):
    d=pd.Timestamp(ts); n=0
    while n<=200 and _broken_g(d-pd.Timedelta(weeks=n)): n+=1
    return n

def manage_put(entry_ts,now_ts):
    """管理已建 put：触发后≤12周回🟢=甩鞭止损；否则持有/滚动。"""
    entry=pd.Timestamp(entry_ts); now=pd.Timestamp(now_ts); d=entry; wk=0
    while d<=now and wk<=80:
        col,_=gate_color(d)
        if col=='🟢' and not _broken_g(d):
            if (d-entry).days<=FAILFAST_WK*7:
                return ('止损离场',f'触发后{(d-entry).days//7}周即回🟢 → 判甩鞭，止损离场，旗标仍ON则等下次破位')
            break
        d+=pd.Timedelta(weeks=1); wk+=1
    return ('持有/滚动','破位持续未回绿 → 真崩盘，持有put；到期且仍🟠/🔴则滚动下一档12月put')

def action_state(ts):
    """两层动作状态机：旗标(总开关) × 灯/信贷 → 当前该做什么。"""
    col,lab=gate_color(ts); flag=bubble_flag(ts); cr=credit_trigger(ts)
    conf=(col in ('🟠','🔴')) or cr; wb=weeks_broken(ts) if conf else 0
    if not flag:
        phase,act='观察(旗标OFF)','非泡沫顶部环境：本做空策略不介入；按常规持仓'
    elif col=='🟢' and not cr:
        phase,act='满仓骑','旗标ON但趋势完好🟢 → 满仓骑泡沫，黄灯亮再减仓'
    elif col=='🟡' and not cr:
        phase,act='减仓','旗标ON+🟡(头部通常已破7~12%) → 开始/加速减仓；进一步破裂则清仓'
    elif conf:
        src='🔴暴力崩盘' if col=='🔴' else ('🟠破裂承压' if col=='🟠' else '信贷扳机')
        phase='做空确认'
        act=(f'旗标ON + 崩盘确认({src})，已破位{wb}周 → 清空股票，买12月裸put；此后≤12周回🟢则按甩鞭止损')
    else:
        phase,act='过渡','旗标ON，信号过渡中，观望'
    return {'date':str(pd.Timestamp(ts).date()),'light':col,'label':lab,'flag_on':flag,
            'P_pct':round(P_pct(ts),2),'credit':cr,'weeks_broken':wb,'phase':phase,'action':act}

if __name__=='__main__':
    P5={'2000顶':'2000-03-10','2007顶':'2007-10-09','2020顶':'2020-02-19','2022顶':'2022-01-03','今天':'2026-06-26'}
    print(f"{'时期':7s} {'P':>6s} {'M':>6s} {'R水平':>6s} {'R趋势*':>7s} {'确认闸':>11s}")
    for n,d in P5.items():
        r=R_value(d); rt=R_trend(d); col,lab=gate_color(d)
        rs=f"{r:.3f}" if r is not None else "—"; rts=f"{rt:+.3f}" if rt is not None else "—"
        print(f"{n:7s} {dynamic_P(d):6.3f} {calc_M(d):6.3f} {rs:>6s} {rts:>7s} {col+lab:>12s}")
    print('\n=== 今日动作读数 (2026-06-26) ===')
    for k,v in action_state('2026-06-26').items(): print(f'  {k:13s}: {v}')
    print('\n=== 四次崩盘：确认信号是否触发(全部应 True) ===')
    cases={'2000科网':'2000-02-25','2007金融':'2007-08-10','2020疫情':'2020-02-28','2022加息':'2022-03-18'}
    for nm,sig in cases.items():
        st=action_state(sig)
        print(f'  {nm}: 信号日{sig} 灯{st["light"]} 旗标{"ON" if st["flag_on"] else "OFF"} 信贷{st["credit"]} 确认{confirm_signal(sig)}')
    print('\n=== 甩鞭案例：管理规则应判止损离场 ===')
    for nm,sig in {'1999-10 late-bubble dip':'1999-10-01','2025-04 tariff dip':'2025-04-04','2018-12 correction':'2018-12-21'}.items():
        mp=manage_put(sig,pd.Timestamp(sig)+pd.Timedelta(days=300)); print(f'  {nm}: {mp[0]}')
