// Bubble Radar 渲染引擎 — point-in-time · 四色闸门 · 12周回放 · 三语(zh/en/ko)
(function(){
  window.__lang = window.__lang || 'zh';
  function L(){ return window.__lang || 'zh'; }
  function tx(v){ if(v && typeof v==='object' && !Array.isArray(v)){ return (v[L()]!==undefined? v[L()] : v.zh); } return v; }
  function t(k){ var d=RT[L()]||RT.zh; return (d[k]!==undefined? d[k] : RT.zh[k]); }
  function gname(c){ return t('lg_'+c); }

  // ---------- 渲染文案表（三语）----------
  var RT={
    zh:{
      status:'雷达运行中 · 评估日 ',
      gen:' · 页面生成 ', tzbj:'(北京时间)', vd:'数据至 ', od:'数据日 ', ed:'评估日 ',
      pP_tag:'压力 · Pressure', pP_let:'P · 气球现在多紧',
      pM_tag:'烈度 · Magnitude', pM_let:'M · 高位累积的重量', pM_phase:'累积能量 ',
      pR_tag:'反身性 · Reflexivity', pR_let:'R · 还有没有人在吹', pR_pre:'活性 ', pR_suf:'（辅助）',
      gateCap:'破裂确认灯 · Gate', gateActLbl:'当前动作：',
      actHead:'动作状态机 · 两层（旗标 × 灯/信贷）', actFlagOn:'泡沫旗标 ON · P 第 {P} 百分位', actFlagOff:'泡沫旗标 OFF', actCredOn:'信贷扳机 已触发', actCredOff:'信贷扳机 未触发',
      gl_green:'趋势完好', gl_yellow:'警戒', gl_orange:'破裂+承压', gl_red:'暴力崩盘',
      ga_green:'正常持有', ga_yellow:'开始减仓', ga_orange:'加速减仓', ga_red:'清仓',
      lg_green:'趋势完好', lg_yellow:'警戒/早期破位', lg_orange:'破裂+承压', lg_red:'暴力崩盘',
      readout:'当前判读：<b>P={P}</b>（结构压力已超 2000、五时点最高）　<b>M={M}</b>（高位累积重量史上最大）　闸门 <b style="color:{C}">● {GL}</b>（破裂未发生）<br>→ {PH}：气球史上最紧，但破裂确认灯仍绿。盯广度——指数持续丢 200 日线、闸门离绿，才是最早离场线索。<b>R 趋势已降为辅助、不作扳机。</b>',
      s_ext:'史上极端', s_vhigh:'极高', s_high:'高位', s_mid:'中等', s_mild:'温和',
      weight:'权重 ', pctPre:'第 ', pctSuf:' 百分位 · ', na:'数据待补', naDrop:'2020后无数据·冷启动丢弃',
      tipHint:'如果你认为这个数值需要更新，请点击底部的“给我留言”。',
      aux:'辅助',
      rpHint:'↑ 鼠标悬停任意一周，看当周完整仪表盘',
      rpdTop:'← 顶部当周', rpdAct:'动作：', rpdP:'P 压力', rpdM:'M 累积烈度', rpdR:'R 反身性',
      month:' 月',
      err:'⚠ 数据加载失败：{M}<br>如果你是直接双击打开本文件，浏览器会拦截本地数据读取。请通过网站链接访问，或用本地服务器打开。',
      rp:{'2000':'2000 网络泡沫顶','2007':'2007 信贷危机前','2020':'2020 疫情前','2022':'2022 加息周期顶'}
    },
    en:{
      status:'Radar live · eval date ',
      gen:' · generated ', tzbj:' (Beijing time)', vd:'data thru ', od:'as of ', ed:'eval date ',
      pP_tag:'Pressure', pP_let:'P · how tight the balloon is',
      pM_tag:'Magnitude', pM_let:'M · the weight piled up high', pM_phase:'Accumulated energy ',
      pR_tag:'Reflexivity', pR_let:'R · is anyone still blowing', pR_pre:'Activity ', pR_suf:' (auxiliary)',
      gateCap:'Rupture-confirmation light · Gate', gateActLbl:'Current action: ',
      actHead:'Action state machine · two-tier (flag × light/credit)', actFlagOn:'Bubble flag ON · P {P}th pct', actFlagOff:'Bubble flag OFF', actCredOn:'Credit trigger FIRED', actCredOff:'Credit trigger off',
      gl_green:'Trend intact', gl_yellow:'Caution', gl_orange:'Rupture + stress', gl_red:'Violent crash',
      ga_green:'Hold as normal', ga_yellow:'Begin trimming', ga_orange:'Trim faster', ga_red:'Exit',
      lg_green:'Trend intact', lg_yellow:'Caution / early break', lg_orange:'Rupture + stress', lg_red:'Violent crash',
      readout:'Current read: <b>P={P}</b> (structural pressure exceeds 2000, highest of five moments)　<b>M={M}</b> (the largest accumulated weight on record)　Gate <b style="color:{C}">● {GL}</b> (no rupture yet)<br>→ {PH}: the tightest balloon in history, yet the rupture light is still green. Watch breadth — only when indices keep losing the 200-day line and the gate leaves green is it the earliest exit cue. <b>R-trend is now auxiliary, not a trigger.</b>',
      s_ext:'historic extreme', s_vhigh:'very high', s_high:'high', s_mid:'moderate', s_mild:'mild',
      weight:'weight ', pctPre:'', pctSuf:'th pct · ', na:'pending', naDrop:'no data after 2020 · cold-start dropped',
      tipHint:'If you think this value needs updating, click "Contact" at the bottom.',
      aux:'auxiliary',
      rpHint:'↑ Hover any week to see its full dashboard',
      rpdTop:'← top week', rpdAct:'Action: ', rpdP:'P pressure', rpdM:'M accumulated severity', rpdR:'R reflexivity',
      month:' mo',
      err:'⚠ Failed to load data: {M}<br>If you opened this file by double-clicking, the browser blocks local data reads. Please use the website link, or open it with a local server.',
      rp:{'2000':'2000 dot-com top','2007':'2007 pre-credit-crisis','2020':'2020 pre-COVID','2022':'2022 rate-hike top'}
    },
    ko:{
      status:'레이더 가동 중 · 평가일 ',
      gen:' · 페이지 생성 ', tzbj:' (베이징 시간)', vd:'데이터 기준 ', od:'데이터 일자 ', ed:'평가일 ',
      pP_tag:'압력 · Pressure', pP_let:'P · 풍선이 얼마나 팽팽한가',
      pM_tag:'강도 · Magnitude', pM_let:'M · 고점에 쌓인 무게', pM_phase:'누적 에너지 ',
      pR_tag:'재귀성 · Reflexivity', pR_let:'R · 아직도 부는 사람이 있는가', pR_pre:'활성 ', pR_suf:' (보조)',
      gateCap:'붕괴 확인등 · Gate', gateActLbl:'현재 행동: ',
      actHead:'액션 상태기계 · 2단 (깃발 × 등/신용)', actFlagOn:'버블 깃발 ON · P {P}백분위', actFlagOff:'버블 깃발 OFF', actCredOn:'신용 방아쇠 발동', actCredOff:'신용 방아쇠 미발동',
      gl_green:'추세 양호', gl_yellow:'경계', gl_orange:'붕괴+압박', gl_red:'격렬한 폭락',
      ga_green:'정상 보유', ga_yellow:'비중 축소 시작', ga_orange:'축소 가속', ga_red:'전량 정리',
      lg_green:'추세 양호', lg_yellow:'경계/초기 이탈', lg_orange:'붕괴+압박', lg_red:'격렬한 폭락',
      readout:'현재 판독: <b>P={P}</b> (구조적 압력이 2000년을 넘어 다섯 시점 중 최고)　<b>M={M}</b> (역사상 최대의 누적 무게)　게이트 <b style="color:{C}">● {GL}</b> (아직 붕괴 없음)<br>→ {PH}: 역사상 가장 팽팽한 풍선이지만 붕괴등은 여전히 초록. 폭을 주시하라 — 지수가 계속 200일선을 잃고 게이트가 초록을 떠날 때 비로소 가장 빠른 이탈 신호. <b>R 추세는 이제 보조이며 방아쇠가 아니다.</b>',
      s_ext:'역사적 극단', s_vhigh:'매우 높음', s_high:'높음', s_mid:'중간', s_mild:'완만',
      weight:'가중치 ', pctPre:'', pctSuf:'분위 · ', na:'데이터 대기', naDrop:'2020 이후 데이터 없음 · 콜드스타트 폐기',
      tipHint:'이 값이 갱신되어야 한다고 생각하시면 하단의 "문의하기"를 클릭하세요.',
      aux:'보조',
      rpHint:'↑ 아무 주에나 마우스를 올리면 그 주의 전체 대시보드를 봅니다',
      rpdTop:'← 천장 주', rpdAct:'행동: ', rpdP:'P 압력', rpdM:'M 누적 강도', rpdR:'R 재귀성',
      month:'개월',
      err:'⚠ 데이터 로드 실패: {M}<br>이 파일을 더블클릭으로 여셨다면 브라우저가 로컬 데이터 읽기를 차단합니다. 웹사이트 링크로 접속하거나 로컬 서버로 열어 주세요.',
      rp:{'2000':'2000 닷컴 천장','2007':'2007 신용위기 직전','2020':'2020 코로나 직전','2022':'2022 금리 인상 천장'}
    }
  };

  var GATE={ green:{c:'var(--green)'}, yellow:{c:'var(--amber)'}, orange:{c:'var(--orange)'}, red:{c:'var(--red)'} };
  function strColor(s){ if(s>=90)return 'linear-gradient(90deg,var(--amber),var(--red))'; if(s>=60)return 'linear-gradient(90deg,var(--green-deep),var(--amber))'; return 'linear-gradient(90deg,var(--green),var(--green-deep))'; }
  function strLabel(s){ if(s>=95)return t('s_ext'); if(s>=80)return t('s_vhigh'); if(s>=60)return t('s_high'); if(s>=35)return t('s_mid'); return t('s_mild'); }
  function fmtVal(v,u){ if(v===null||v===undefined)return '<span class="na">'+t('na')+'</span>'; return v+'<span class="u">'+(u||'')+'</span>'; }

  function setStatus(){
    var stEl=document.getElementById('status-txt'); if(!stEl||!window.__DATA)return;
    var s=t('status')+window.__DATA.updated;
    if(window.__META&&window.__META.generated_at) s+=t('gen')+window.__META.generated_at+t('tzbj');
    stEl.textContent=s;
  }

  function render(d){
    setStatus();
    var trArrow={up:'↑',down:'↓',flat:'→'};
    var barcol={P:'linear-gradient(90deg,var(--amber),var(--red))',M:'linear-gradient(90deg,var(--green-deep),var(--amber))',R:'linear-gradient(90deg,var(--green),var(--green-deep))'};
    var pmr=[
      {cls:'P',tag:t('pP_tag'),letter:t('pP_let'),val:d.P.value.toFixed(3),phase:tx(d.P.phase),desc:tx(d.P.desc),bar:Math.min(d.P.value/1.1,1)*100,lead:true},
      {cls:'M',tag:t('pM_tag'),letter:t('pM_let'),val:d.M.value.toFixed(3),phase:t('pM_phase')+d.M.value.toFixed(2),desc:tx(d.M.desc),bar:Math.min(d.M.value/0.7,1)*100},
      {cls:'R',tag:t('pR_tag'),letter:t('pR_let'),val:d.R.value.toFixed(3),tr:trArrow[d.R.trend_dir],trcls:d.R.trend_dir,phase:t('pR_pre')+d.R.value.toFixed(2)+t('pR_suf'),desc:tx(d.R.desc),bar:Math.min(d.R.value/0.75,1)*100}
    ];
    document.getElementById('pmr-cards').innerHTML=pmr.map(function(c){
      var trHtml=c.tr?'<span class="tr '+c.trcls+'">'+c.tr+'</span>':'';
      return '<div class="pmr-card '+(c.lead?'lead':'')+'">'
        +'<div class="pmr-tag">'+c.tag+'</div><div class="pmr-letter '+c.cls+'">'+c.letter+'</div>'
        +'<div class="pmr-val">'+c.val+trHtml+'</div><div class="pmr-phase">'+c.phase+'</div>'
        +'<div class="pmr-desc">'+c.desc+'</div><div class="pmr-date">'+t('ed')+d.updated+'</div><div class="pmr-bar"><i style="width:'+c.bar+'%;background:'+barcol[c.cls]+'"></i></div></div>';
    }).join('');

    var g=GATE[d.gate.color];
    var lights=['green','yellow','orange','red'].map(function(k){ var on=k===d.gate.color; return '<span class="gl '+k+(on?' on':'')+'" title="'+t('gl_'+k)+'·'+t('ga_'+k)+'"></span>'; }).join('');
    document.getElementById('gate-box').innerHTML=
      '<div class="gate-left"><div class="gate-cap">'+t('gateCap')+'</div><div class="gate-lights">'+lights+'</div></div>'
      +'<div class="gate-right"><div class="gate-now" style="color:'+g.c+'">● '+t('gl_'+d.gate.color)+'</div>'
      +'<div class="gate-act">'+t('gateActLbl')+'<b style="color:'+g.c+'">'+t('ga_'+d.gate.color)+'</b></div>'
      +'<div class="gate-desc">'+tx(d.gate.desc)+'</div>'
      +'<div class="gate-date">'+t('ed')+d.updated+'</div></div>';

    // ---- 动作状态机 live 读数 (新引擎: 旗标 × 灯/信贷) ----
    var A=d.action;
    if(A){
      var aTone = !A.flag_on ? 'idle'
        : (A.light==='green' && !A.credit) ? 'ok'
        : (A.light==='yellow' && !A.credit) ? 'warn'
        : (A.light==='orange'||A.light==='red'||A.credit) ? 'alert' : 'idle';
      var aCol = {ok:'var(--green)',warn:'var(--amber)',alert:'var(--red)',idle:'var(--ink-dim)'}[aTone];
      var flagTxt = A.flag_on ? t('actFlagOn').replace('{P}', Math.round(A.P_pct*100)) : t('actFlagOff');
      document.getElementById('action-box').innerHTML=
        '<div class="act-head">'+t('actHead')+'</div>'
        +'<div class="act-row">'
        +'<span class="act-phase" style="color:'+aCol+';border-color:'+aCol+'">'+tx(A.phase)+'</span>'
        +'<span class="act-chip'+(A.flag_on?' flagon':'')+'">'+flagTxt+'</span>'
        +'<span class="act-chip'+(A.credit?' credon':'')+'">'+(A.credit?t('actCredOn'):t('actCredOff'))+'</span>'
        +'</div>'
        +'<div class="act-desc">'+tx(A.phase_desc)+'</div>';
    }

    document.getElementById('readout').innerHTML=t('readout')
      .replace('{P}',d.P.value.toFixed(3)).replace('{M}',d.M.value.toFixed(3))
      .replace('{C}',g.c).replace('{GL}',t('gl_'+d.gate.color)).replace('{PH}',tx(d.P.phase));

    document.getElementById('core-grid').innerHTML=d.indicators.filter(function(i){return i.tier===1;}).map(function(i){return icard(i,true);}).join('');
    document.getElementById('wall-grid').innerHTML=d.indicators.filter(function(i){return i.tier>=2;}).map(function(i){return icard(i,false);}).join('');

    document.getElementById('obs-grid').innerHTML=d.observations.map(function(o){
      var nm=tx(o.name), ds=tx(o.desc);
      var tip='<span class="help">?<span class="tip"><b>'+nm+'</b><br>'+ds+'<br><br>'+t('tipHint')+'</span></span>';
      return '<div class="ocard"><div class="ocard-name">'+nm+tip+'</div><div class="ocard-val">'+fmtVal(o.value,o.unit)+'</div>'
        +(o.value_date?'<div class="ocard-date">'+t('od')+o.value_date+'</div>':'')
        +'<div class="ocard-desc">'+ds+'</div></div>';
    }).join('');

    document.getElementById('hist-body').innerHTML=d.history.map(function(h){
      var isNow=(h.name&&h.name.zh==='今天')||h.name==='今天';
      function chip(v){ var col=v>=1?'var(--red-soft)':(v>=0.7?'var(--amber)':'var(--green)'); var bg=v>=1?'rgba(255,49,69,.13)':(v>=0.7?'rgba(255,210,63,.12)':'rgba(46,230,166,.12)'); return '<span class="pchip" style="color:'+col+';background:'+bg+'">'+v.toFixed(2)+'</span>'; }
      var trc=h.Rtrend>0.02?'var(--green)':(h.Rtrend<-0.05?'var(--red-soft)':'var(--amber)');
      var tra=h.Rtrend>0.02?'↑':(h.Rtrend<-0.05?'↓':'→');
      var gg=GATE[h.gate];
      return '<tr class="'+(isNow?'now':'')+'">'
        +'<td><span class="pn">'+tx(h.name)+'</span><br><span class="lb">'+tx(h.label)+'</span></td>'
        +'<td>'+chip(h.P)+'</td><td>'+chip(h.M)+'</td><td>'+chip(h.R)+'</td>'
        +'<td class="mono" style="color:'+trc+'">'+tra+' '+h.Rtrend.toFixed(2)+'<br><span class="lb">'+t('aux')+'</span></td>'
        +'<td><span class="gdot '+h.gate+'"></span> <span class="lb" style="color:'+gg.c+'">'+t('gl_'+h.gate)+'</span></td>'
        +'<td class="mono">'+tx(h.result)+'</td><td class="lb">'+tx(h.type)+'</td></tr>';
    }).join('');

    if(d.replay) buildReplay(d.replay);
    if(d.lights20) renderStrip20(d.lights20);
    if(d.episodes) renderEpisodes(d.redmonths,d.episodes);
    setTimeout(function(){ document.querySelectorAll('.strength i').forEach(function(el){ var w=el.getAttribute('data-w'); if(w)el.style.width=w; }); },150);
  }

  function icard(i,isCore){
    var s=i.strength, na=(s===null||s===undefined);
    var nm=tx(i.name), ds=tx(i.desc), dir=tx(i.direction);
    var tip='<span class="help">?<span class="tip"><b>'+nm+'</b><br>'+ds+'<br><br>'+t('tipHint')+'</span></span>';
    return '<div class="icard '+(isCore?'core':'')+'">'
      +'<div class="icard-top"><div class="icard-name">'+nm+tip+'</div><div class="icard-w">'+t('weight')+i.weight+'%</div></div>'
      +'<div class="icard-val '+(i.value===null?'na':'')+'">'+fmtVal(i.value,i.unit)+'</div>'
      +(i.value_date?'<div class="icard-date">'+t('vd')+i.value_date+'</div>':'')
      +'<div class="icard-desc">'+ds+'</div>'
      +(na?'<div class="strength"><i style="width:0"></i></div><div class="strength-lbl"><span>'+dir+'</span><span class="na">'+t('naDrop')+'</span></div>'
          :'<div class="strength"><i data-w="'+Math.min(s,100)+'%" style="width:0;background:'+strColor(s)+'"></i></div><div class="strength-lbl"><span>'+dir+'</span><span>'+t('pctPre')+s+t('pctSuf')+strLabel(s)+'</span></div>')
      +'</div>';
  }

  function renderStrip20(lights){
    var box=document.getElementById('strip20-bars'); if(!box)return;
    box.innerHTML=lights.map(function(l,i){ var today=i===lights.length-1;
      return '<div class="s20 '+l.gate+(today?' today':'')+'" data-i="'+i+'" title="'+l.date+' · P='+l.P.toFixed(3)+' · '+gname(l.gate)+'"></div>'; }).join('');
    var cap=document.getElementById('strip20-cap');
    function show(i){ var l=lights[i]; if(cap) cap.innerHTML=l.date+' &nbsp; P=<b>'+l.P.toFixed(3)+'</b> &nbsp; <span class="gd '+l.gate+'"></span> '+gname(l.gate); }
    box.querySelectorAll('.s20').forEach(function(c){ c.addEventListener('mouseenter',function(){ show(+c.getAttribute('data-i')); }); });
    show(lights.length-1);
  }

  function renderEpisodes(reds, eps){
    var rbox=document.getElementById('redmonth-grid');
    if(rbox&&reds) rbox.innerHTML=reds.map(function(m){ return '<span class="rm-chip">'+m+'</span>'; }).join('');
    var ebox=document.getElementById('ep-tbody'); if(!ebox||!eps)return;
    function cnt(n,cls){ return n>0?'<i><span class="d '+cls+'"></span>'+n+'</i>':''; }
    ebox.innerHTML=eps.map(function(e){
      return '<tr class="'+(e.hasred?'hasred':'')+'"><td class="mono">'+e.start+' → '+e.end+'</td>'
        +'<td class="mono">'+e.months+t('month')+'</td>'
        +'<td><span class="ep-cnt">'+cnt(e.R,'red')+cnt(e.O,'orange')+cnt(e.Y,'yellow')+cnt(e.G,'green')+'</span></td>'
        +'<td class="ep-event">'+tx(e.event)+'</td></tr>';
    }).join('');
  }

  function buildReplay(replay){
    var keys=Object.keys(replay);
    var box=document.getElementById('replay-box'); if(!box)return;
    var names=t('rp');
    var tabs='<div class="rp-tabs">'+keys.map(function(k,idx){ return '<button class="rp-tab'+(idx===0?' active':'')+'" data-k="'+k+'">'+(names[k]||k)+'</button>'; }).join('')+'</div>';
    box.innerHTML=tabs+'<div class="rp-main"><div class="rp-chart" id="rp-chart"></div><div class="rp-detail" id="rp-detail"></div></div>'
      +'<div class="rp-legend"><span><i class="gd green"></i>'+t('lg_green')+'</span><span><i class="gd yellow"></i>'+t('lg_yellow')+'</span><span><i class="gd orange"></i>'+t('lg_orange')+'</span><span><i class="gd red"></i>'+t('lg_red')+'</span><span class="rp-hint">'+t('rpHint')+'</span></div>';
    function draw(k){
      var weeks=replay[k].weeks, n=weeks.length;
      var W=720,H=300,pl=46,pr=18,pt=22,pb=40, plotW=W-pl-pr, plotH=H-pt-pb;
      var pMin=0.35,pMax=1.10;
      var X=function(i){return pl+plotW*i/(n-1);};
      var Y=function(p){return pt+plotH*(1-(p-pMin)/(pMax-pMin));};
      var svg='<svg viewBox="0 0 '+W+' '+H+'" class="rp-svg" preserveAspectRatio="xMidYMid meet">';
      [0.5,0.7,0.9,1.0,1.1].forEach(function(p){ var y=Y(p); var ref=(p===1.0); svg+='<line x1="'+pl+'" y1="'+y+'" x2="'+(W-pr)+'" y2="'+y+'" class="rp-grid'+(ref?' ref':'')+'"/><text x="'+(pl-8)+'" y="'+(y+4)+'" class="rp-ylab">'+p.toFixed(1)+'</text>'; });
      var topI=weeks.findIndex(function(w){return w.is_top;});
      if(topI>=0){ var txx=X(topI); svg+='<line x1="'+txx+'" y1="'+pt+'" x2="'+txx+'" y2="'+(H-pb)+'" class="rp-topline"/><text x="'+txx+'" y="'+(pt-7)+'" class="rp-toptxt">'+(L()==='zh'?'顶':'TOP')+'</text>'; }
      var pts=weeks.map(function(w,i){return X(i)+','+Y(w.P);}).join(' ');
      svg+='<polyline points="'+pts+'" class="rp-line"/>';
      weeks.forEach(function(w,i){
        var x=X(i),y=Y(w.P);
        if(i%2===0||w.is_top) svg+='<text x="'+x+'" y="'+(H-pb+18)+'" class="rp-xlab">'+w.date.slice(5)+'</text>';
        svg+='<circle cx="'+x+'" cy="'+y+'" r="'+(w.is_top?6.5:5)+'" class="rp-dot '+w.gate+(w.is_top?' top':'')+'" data-i="'+i+'"/>';
      });
      svg+='<line class="rp-cursor" x1="0" y1="'+pt+'" x2="0" y2="'+(H-pb)+'" style="opacity:0"/></svg>';
      document.getElementById('rp-chart').innerHTML=svg;
      var svgEl=document.querySelector('#rp-chart svg'), cursor=svgEl.querySelector('.rp-cursor');
      function show(i){
        var w=weeks[i], gg=GATE[w.gate];
        document.querySelectorAll('#rp-chart .rp-dot').forEach(function(c){ c.classList.toggle('hl', +c.getAttribute('data-i')===i); });
        cursor.setAttribute('x1',X(i)); cursor.setAttribute('x2',X(i)); cursor.style.opacity='1';
        document.getElementById('rp-detail').innerHTML=
          '<div class="rpd-date">'+w.date+(w.is_top?' <span class="rpd-top">'+t('rpdTop')+'</span>':'')+'</div>'
          +'<div class="rpd-gate" style="border-color:'+gg.c+'"><span class="gd '+w.gate+' big"></span><div><div class="rpd-gl" style="color:'+gg.c+'">'+t('gl_'+w.gate)+'</div><div class="rpd-ga">'+t('rpdAct')+t('ga_'+w.gate)+'</div></div></div>'
          +'<div class="rpd-row"><span>'+t('rpdP')+'</span><b>'+w.P.toFixed(3)+'</b></div>'
          +'<div class="rpd-row"><span>'+t('rpdM')+'</span><b>'+w.M.toFixed(3)+'</b></div>'
          +'<div class="rpd-row"><span>'+t('rpdR')+'</span><b>'+w.R.toFixed(3)+'</b></div>';
      }
      document.querySelectorAll('#rp-chart .rp-dot').forEach(function(c){ c.addEventListener('mouseenter',function(){ show(+c.getAttribute('data-i')); }); });
      show(topI>=0?topI:Math.floor(n/2));
    }
    box.querySelectorAll('.rp-tab').forEach(function(b){ b.addEventListener('click',function(){ box.querySelectorAll('.rp-tab').forEach(function(x){x.classList.remove('active');}); b.classList.add('active'); draw(b.getAttribute('data-k')); }); });
    draw(keys[0]);
  }

  function showErr(e){ var el=document.getElementById('err'); if(!el)return; el.style.display='block'; el.innerHTML=t('err').replace('{M}',e.message); }

  window.renderData=function(){ if(window.__DATA) render(window.__DATA); };
  fetch('data.json')
    .then(function(r){ if(!r.ok) throw new Error('data.json'); return r.json(); })
    .then(function(d){ window.__DATA=d; window.renderData(); }).catch(showErr);
  fetch('meta.json')
    .then(function(r){ return r.ok? r.json() : null; })
    .then(function(m){ window.__META=m; setStatus(); })
    .catch(function(){});
})();
