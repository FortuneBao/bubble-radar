// Bubble Radar 渲染引擎 — 从 data.json 读取真实计算结果
(function(){
  fetch('data.json')
    .then(r=>{ if(!r.ok) throw new Error('data.json 加载失败'); return r.json(); })
    .then(render)
    .catch(showErr);

  // 强度条颜色：0-60绿, 60-90琥珀, 90+红
  function strColor(s){
    if(s>=90) return 'linear-gradient(90deg,var(--amber),var(--red))';
    if(s>=60) return 'linear-gradient(90deg,var(--green-deep),var(--amber))';
    return 'linear-gradient(90deg,var(--green),var(--green-deep))';
  }
  function strLabel(s){
    if(s>=100) return '超 2000 顶';
    if(s>=90) return '逼近 2000';
    if(s>=60) return '高位';
    if(s>=35) return '中等';
    return '温和';
  }
  function fmtVal(v,u){
    if(v===null||v===undefined) return '<span class="na">数据待补</span>';
    return v+'<span class="u">'+(u||'')+'</span>';
  }

  function render(d){
    // 状态行
    document.getElementById('status-txt').textContent='雷达运行中 · 数据更新于 '+d.updated;

    // ===== P/M/R 三卡 =====
    var trArrow={up:'↑',down:'↓',flat:'→'};
    var pPct=Math.min(d.P.value/1.5*100,100);
    var mPct=Math.min(d.M.value/2.5*100,100);
    var rPct=Math.min(d.R.value/1.3*100,100);
    var pmr=[
      {cls:'P lead',tag:'压力 · Pressure',letter:'P · 气球现在多紧',val:d.P.value.toFixed(2),phase:d.P.phase,desc:d.P.desc,bar:pPct,barcol:'linear-gradient(90deg,var(--amber),var(--red))'},
      {cls:'M',tag:'烈度 · Magnitude',letter:'M · 若爆会多猛',val:d.M.value.toFixed(2),phase:'潜在烈度 '+d.M.value.toFixed(1)+'×',desc:d.M.desc,bar:mPct,barcol:'linear-gradient(90deg,var(--green-deep),var(--amber))'},
      {cls:'R',tag:'反身性 · Reflexivity',letter:'R · 还有没有人在吹',val:d.R.value.toFixed(2),tr:trArrow[d.R.trend_dir],trcls:d.R.trend_dir,phase:d.R.trend_dir==='up'?'引擎加速 ↑':(d.R.trend_dir==='down'?'引擎降温 ↓':'引擎见顶 →'),desc:d.R.desc,bar:rPct,barcol:'linear-gradient(90deg,var(--green),var(--green-deep))'}
    ];
    document.getElementById('pmr-cards').innerHTML=pmr.map(function(c){
      var trHtml=c.tr?'<span class="tr '+c.trcls+'">'+c.tr+'</span>':'';
      return '<div class="pmr-card '+(c.cls.indexOf('lead')>=0?'lead':'')+'">'
        +'<div class="pmr-tag">'+c.tag+'</div>'
        +'<div class="pmr-letter '+c.cls.charAt(0)+'">'+c.letter+'</div>'
        +'<div class="pmr-val">'+c.val+trHtml+'</div>'
        +'<div class="pmr-phase">'+c.phase+'</div>'
        +'<div class="pmr-desc">'+c.desc+'</div>'
        +'<div class="pmr-bar"><i style="width:'+c.bar+'%;background:'+c.barcol+'"></i></div>'
        +'</div>';
    }).join('');

    // 综合判读
    document.getElementById('readout').innerHTML=
      '当前判读：<b>P='+d.P.value.toFixed(2)+'</b>(压力已'+(d.P.value>1?'超过':'接近')+' 2000 年水平)　'
      +'<b>M='+d.M.value.toFixed(2)+'</b>(潜在破坏力 '+d.M.value.toFixed(1)+' 倍于 2000)　'
      +'<b>R='+d.R.value.toFixed(2)+' '+trArrow[d.R.trend_dir]+'</b>(引擎'+(d.R.trend_dir==='up'?'仍在加速':(d.R.trend_dir==='down'?'正在降温':'已见顶'))+')<br>'
      +'→ '+d.P.phase+'：'+d.P.desc;

    // ===== 核心维度(tier 1)=====
    var core=d.indicators.filter(function(i){return i.tier===1;});
    document.getElementById('core-grid').innerHTML=core.map(function(i){return icard(i,true);}).join('');

    // ===== 指标墙(tier 2,3)=====
    var wall=d.indicators.filter(function(i){return i.tier>=2;});
    document.getElementById('wall-grid').innerHTML=wall.map(function(i){return icard(i,false);}).join('');

    // ===== 观测指标 =====
    document.getElementById('obs-grid').innerHTML=d.observations.map(function(o){
      return '<div class="ocard"><div class="ocard-name">'+o.name+'</div>'
        +'<div class="ocard-val">'+fmtVal(o.value,o.unit)+'</div>'
        +'<div class="ocard-desc">'+o.desc+'</div></div>';
    }).join('');

    // ===== 历史校验表 =====
    document.getElementById('hist-body').innerHTML=d.history.map(function(h){
      var isNow=h.name==='今天';
      function chip(v,base){ // 颜色：≥1红, ≥0.7琥珀, else绿
        var col=v>=1?'var(--red-soft)':(v>=0.7?'var(--amber)':'var(--green)');
        var bg=v>=1?'rgba(255,49,69,.13)':(v>=0.7?'rgba(255,210,63,.12)':'rgba(46,230,166,.12)');
        return '<span class="pchip" style="color:'+col+';background:'+bg+'">'+v.toFixed(2)+'</span>';
      }
      var trc=h.Rtrend>0.02?'var(--green)':(h.Rtrend<-0.05?'var(--red-soft)':'var(--amber)');
      var tra=h.Rtrend>0.02?'↑':(h.Rtrend<-0.05?'↓':'→');
      return '<tr class="'+(isNow?'now':'')+'">'
        +'<td><span class="pn">'+h.name+'</span><br><span class="lb">'+h.label+'</span></td>'
        +'<td>'+chip(h.P)+'</td><td>'+chip(h.M)+'</td><td>'+chip(h.R)+'</td>'
        +'<td class="mono" style="color:'+trc+';font-weight:700">'+tra+' '+h.Rtrend.toFixed(2)+'</td>'
        +'<td class="mono">'+h.result+'</td>'
        +'<td class="lb">'+h.type+'</td></tr>';
    }).join('');

    // 动画：强度条延迟填充
    setTimeout(function(){
      document.querySelectorAll('.strength i,.pmr-bar i').forEach(function(el){
        var w=el.getAttribute('data-w'); if(w)el.style.width=w;
      });
    },150);
  }

  function icard(i,isCore){
    var s=i.strength;
    var col=strColor(s);
    var barW=Math.min(s,100);
    return '<div class="icard '+(isCore?'core':'')+'">'
      +'<div class="icard-top"><div class="icard-name">'+i.name+'</div>'
      +'<div class="icard-w">权重 '+i.weight+'%</div></div>'
      +'<div class="icard-val '+(i.value===null?'na':'')+'">'+fmtVal(i.value,i.unit)+'</div>'
      +'<div class="icard-desc">'+i.desc+'</div>'
      +'<div class="strength"><i data-w="'+barW+'%" style="width:0;background:'+col+'"></i></div>'
      +'<div class="strength-lbl"><span>'+i.direction+'</span><span>'+strLabel(s)+'</span></div>'
      +'</div>';
  }

  function showErr(e){
    var el=document.getElementById('err');
    el.style.display='block';
    el.innerHTML='⚠ 数据加载失败：'+e.message+'<br>如果你是直接双击打开本文件，浏览器会拦截本地数据读取。请通过网站链接访问，或用本地服务器(如 VS Code 的 Live Server)打开。';
  }
})();
