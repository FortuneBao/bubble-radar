// 泡泡龙 · 三语 i18n 引擎（单页 + 语言切换 · zh 原文留在 HTML，en/ko 在此覆盖）
(function(){
  var LANGS=['zh','en','ko'];
  function getLang(){
    try{ var l=localStorage.getItem('lang'); if(LANGS.indexOf(l)>=0) return l; }catch(e){}
    var n=((navigator.language||navigator.userLanguage)||'').toLowerCase();
    if(n.indexOf('ko')===0) return 'ko';
    if(n.indexOf('zh')===0) return 'zh';
    if(n.indexOf('en')===0) return 'en';
    return 'zh';
  }
  function capture(){
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      if(el.getAttribute('data-i18n-zh')===null || el.getAttribute('data-i18n-zh')===undefined){
        el.setAttribute('data-i18n-zh','1'); el.__zh=el.innerHTML;
      }
    });
  }
  function applyLang(lang){
    if(LANGS.indexOf(lang)<0) lang='zh';
    window.__lang=lang;
    var dict=(window.I18N&&window.I18N[lang])||{};
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var k=el.getAttribute('data-i18n');
      if(lang==='zh'){ if(el.__zh!==undefined) el.innerHTML=el.__zh; }
      else if(dict[k]!==undefined){ el.innerHTML=dict[k]; }
      else if(el.__zh!==undefined){ el.innerHTML=el.__zh; }
    });
    document.documentElement.lang=(lang==='zh'?'zh-CN':lang);
    document.querySelectorAll('#lang-switch button').forEach(function(b){
      b.classList.toggle('on', b.getAttribute('data-lang')===lang);
    });
    if(typeof window.renderData==='function') window.renderData();
  }
  function setLang(lang){ try{localStorage.setItem('lang',lang);}catch(e){} applyLang(lang); }
  window.setLang=setLang; window.applyLang=applyLang; window.getLang=getLang;
  function init(){
    capture();
    document.querySelectorAll('#lang-switch button').forEach(function(b){
      b.addEventListener('click',function(){ setLang(b.getAttribute('data-lang')); });
    });
    applyLang(getLang());
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

window.I18N = window.I18N || { en:{}, ko:{} };

/* ============================ 首页 index.html ============================ */
Object.assign(window.I18N.en, {
  nav_live:'● Live', nav_story:'The Story', nav_academic:'The Science', nav_indicators:'Indicators',
  nav_history:'Backtests', nav_replay:'Time Machine', nav_method:'Methodology', nav_message:'Contact',
  hero_head:'How much bigger <span class="accent">can this balloon get</span>?',
  hero_sub:'We track the U.S. equity bubble with three numbers: how <b>tight</b> it is right now, how <b>hard</b> it would burst, and whether anyone is still <b>blowing</b>. We don\'t call the day it pops — we turn invisible pressure into a gauge you can actually read.',
  strip_head:'Past 20 weeks · Rupture-confirmation light',
  gate_explain:'<div class="ge-card can">\n        <div class="ge-t"><span class="dot"></span>What this light gives you</div>\n        <p>It <b>doesn\'t predict the exact day of the top</b> — it confirms a real rupture the moment it begins. It reads <b>two independent signals</b>: a volatility light (the three major indices breaking below their 200-day average + staying below for two straight weeks + volatility spiking to a historic high) and a <b>credit trigger</b> (the high-yield spread widening ≥1.5 points above its six-month low).</p>\n        <p>No single signal catches them all: the volatility light caught 2000 (🔴) and 2022 (🟠); the <b>credit trigger caught 2007 and 2020</b> — especially a credit crisis like 2007, where the pure equity light barely reacted and only the credit trigger warned early. <b>Together, across 30 years, all four great crashes were caught.</b></p>\n        <p>When <b>green</b> you can hold with confidence; <b>don\'t act on yellow alone</b> (~3/4 are false) — the real exit cue is 🟠/red or the credit trigger. It confirms <b>after</b> the top and <b>before</b> the deepest point — a confirmation tool, not a crystal ball.</p>\n      </div>\n      <div class="ge-card adv">\n        <div class="ge-t"><span class="dot"></span>How it differs from classic gauges</div>\n        <p>P/E, the Buffett Indicator, the put-call ratio — they only answer "<b>how expensive is it right now</b>." A snapshot. But danger lies not only in how expensive, but in how long the pressure has been building and whether it\'s still accelerating.</p>\n        <p>We weld <b>time</b> into the gauge: P reads the velocity and acceleration of energy ("accelerating acceleration" is the fingerprint of a top), and M integrates 60 months of pressure (a river that resets at zero, not a reservoir that only fills).</p>\n        <p>A market that is "expensive but has gone sideways for three years with fading momentum" and one that is "just as expensive but still racing higher" look identical in a snapshot. The energy coordinate <b>tells them apart</b>.</p>\n      </div>\n      <div class="ge-card cant">\n        <div class="ge-t"><span class="dot"></span>What it cannot do</div>\n        <p><b>It can\'t give you the exact date of the top.</b> Across 155 years of history, calling tops on price velocity alone is right only ~11% of the time. Any tool that claims to tell you "the day it peaks" is lying to you.</p>\n        <p><b>It doesn\'t predict individual stocks.</b> It measures systemic pressure in the market\'s foundation, not whether any single stock rises or falls tomorrow.</p>\n        <p><b>It\'s not a crystal ball.</b> Bubble tops are inherently uncertain, and 2026 is a genuine out-of-sample test. We don\'t sell prophecy — we offer a disciplined risk dashboard.</p>\n      </div>',
  st_title:'The Ground Beneath Us',
  st_intro:'Before the formulas, let me tell you a story — about a seaside city built on soft mud, and how it sank into the sea on its most prosperous day. It is not a parable. Thonis-Heracleion was real: around the 2nd century BC its foundation liquefied, the whole city dropped seven meters into the Mediterranean, and it stayed lost until divers rediscovered it in the year 2000. Every scene in the story maps to a bubble pattern that has been verified again and again.',
  st_teaser:'<div class="stt-lead">"This ground can\'t hold. We\'ve built too heavy, too full."</div>\n      <p>A liquor no one had tasted before set the whole city ablaze; towers rose higher and higher, and even the worst mudflats were fought over and filled in. Only one mocked old man, staring at the fresh cracks at the base of the walls, spoke a warning no one would believe. And underground, unseen by everyone, the soft earth that had been pressed too long was creeping toward the limit it could no longer bear — until a day no different from any other.</p>\n      <a href="story.html" class="stt-link">Read the full story: The Ground Beneath Us →</a>',
  ac_title:'Seven Classic Pillars + Two New Findings',
  ac_intro:'Every scene in the <a href="story.html" style="color:var(--green);border-bottom:1px solid var(--grid)">story</a> maps to a real theory — peer-reviewed, or proven by the market over and over. We stand on the shoulders of these giants, and we honestly flag the limits of each theory and our own corrections. Full mathematical derivations are on the <a href="methodology.html" style="color:var(--green);border-bottom:1px solid var(--grid)">methodology page</a>.',
  p1:'<div class="pillar-h"><span class="pillar-n">Pillar 1</span><span class="pillar-t">Super-exponential acceleration · the critical point</span><span class="pillar-src">Johansen &amp; Sornette 2000</span></div>\n      <div class="pillar-body">Physicist Didier Sornette found that before a bubble top, prices "accelerate their acceleration" (super-exponential growth). <span class="use">We adopt</span> this acceleration concept; <span class="fix">we drop</span> the original model\'s much-disputed, easily-overfit "log-periodic oscillations." This very paper analyzed the 2000 Nasdaq crash. <span class="pillar-maps">Feeds P</span></div>',
  p2:'<div class="pillar-h"><span class="pillar-n">Pillar 2</span><span class="pillar-t">Critical slowing down · volatility build-up</span><span class="pillar-src">Scheffer 2009 · Nature</span></div>\n      <div class="pillar-body">As complex systems near a tipping point, warning signs such as "rising variance" appear. <span class="use">We adopt</span> the volatility build-up; <span class="fix">we honestly flag</span> the counter-evidence — research (Guttal 2016) shows market crashes don\'t fully match critical slowing down, so we use only the "low-volatility build-up" both sides confirm. <span class="pillar-maps">Feeds P</span></div>',
  p3:'<div class="pillar-h"><span class="pillar-n">Pillar 3</span><span class="pillar-t">Concentration &amp; mean reversion</span><span class="pillar-src">RBC / Invesco 2026</span></div>\n      <div class="pillar-body">At bubble tops, gains tend to be highly concentrated in a few leaders. The top-ten weight peaked at 27% in 2000; today it is 40%. <span class="use">We adopt</span> the top-ten weight, and add a "concentration bubble premium" = weight minus earnings share, separating a genuine moat from a valuation bubble. <span class="pillar-maps">Feeds P</span></div>',
  p4:'<div class="pillar-h"><span class="pillar-n">Pillar 4</span><span class="pillar-t">Percolation · fermentation time sets the severity</span><span class="pillar-src">Sornette 2016 · percolation model</span></div>\n      <div class="pillar-body">Using percolation theory, Sornette showed: the longer the memory → the bigger the bubble → the more likely the crash. Crash severity = height × fermentation time. <span class="use">This is the theoretical root of M</span> — the longer pressure ferments, the louder it bursts. <span class="pillar-maps">Feeds M</span></div>',
  p5:'<div class="pillar-h"><span class="pillar-n">Pillar 5</span><span class="pillar-t">Reflexivity · the self-reinforcing loop</span><span class="pillar-src">George Soros 1987</span></div>\n      <div class="pillar-body">Soros: rising prices themselves change perception, pulling cool bystanders in. When price breaks past the point where it "should have crashed" and doesn\'t, that itself becomes an advertisement. <span class="use">This is the root of R</span> — the stronger the inflow (fresh money) sustaining the boom, the longer the bubble lives; once the inflow turns down, the hidden fragility is exposed. <span class="pillar-maps">Feeds R</span></div>',
  p6:'<div class="pillar-h"><span class="pillar-n">Pillar 6</span><span class="pillar-t">Financial Instability Hypothesis</span><span class="pillar-src">Hyman Minsky 1992</span></div>\n      <div class="pillar-body">Minsky: "stability itself is destabilizing" — long calm encourages risk-taking and leverage build-up, until the "Minsky moment." <span class="use">This supports our "leverage / low-volatility build-up" dimension</span>, and perfectly explains 2008: the leverage that year was piled into real estate, not equities, so our model\'s equity P for 2008 isn\'t high — which is exactly the proof it can separate "an equity valuation bubble" from "credit-crisis spillover." <span class="pillar-maps">Leverage dimension · explains 2008</span></div>',
  p7:'<div class="pillar-h"><span class="pillar-n">Pillar 7</span><span class="pillar-t">Market energy · kinetic energy = ½ momentum²</span><span class="pillar-src">Tuncay · Ausloos · Vandewalle</span></div>\n      <div class="pillar-body">Prices have "kinetic energy": the herd inertia of chasing rallies and dumping losers, with kinetic energy roughly proportional to the square of momentum; energy is conserved between kinetic and potential forms and doesn\'t jump (it builds and releases). The crash signal = energy peaking + momentum turning negative. <span class="use">This is the core that welds "time" into P/M</span> — and it shares the same root as Soros\'s reflexivity ("buying triggers buying"). <span class="pillar-maps">The time-energy root of P/M</span></div>',
  p8:'<div class="pillar-h"><span class="pillar-n">New · Dragon Kings</span><span class="pillar-t">Great crashes are endogenous "outliers"</span><span class="pillar-src">Sornette · Dragon Kings</span></div>\n      <div class="pillar-body">About 99% of pullbacks follow one distribution; only a few mega-disasters are "outliers" — and roughly two-thirds of those are endogenous crashes led by super-exponential bubbles. <span class="use">This gives us our validation philosophy</span>: the signal should specifically identify these endogenous major tops, and not cry wolf at every ordinary pullback. <span class="pillar-maps">Validation philosophy</span></div>',
  p9:'<div class="pillar-h"><span class="pillar-n">New · Correction</span><span class="pillar-t">Before a crash, variance rises — autocorrelation doesn\'t</span><span class="pillar-src">Empirical testing · multiple studies</span></div>\n      <div class="pillar-body">Our own testing found that before major U.S. crashes, the classic critical-slowing "rise in autocorrelation" does <b>not</b> appear, but the "rise in variance" genuinely does. <span class="fix">So we corrected Pillar 2</span> — rupture confirmation (the four-color gate) uses only "high variance + breadth break," dropping autocorrelation. <span class="pillar-maps">Corrects Pillar 2 · the four-color gate</span></div>',
  cd_title:'Core Dimensions',
  cd_intro:'The highest-weighted indicators most reliably foreshadow a top — price momentum and market breadth. Each carries a strength bar showing its point-in-time percentile within its own history (compared only against its own past, no look-ahead) — the redder, the more extreme. Hover the question mark next to any indicator to see what it means.',
  wall_title:'The Indicator Wall · Everything else in the model',
  wall_intro:'Lower-weighted, but still part of the P calculation: valuation, sentiment, leverage, credit, and mania signals. Every one of them, laid out in full.',
  obs_title:'Watch List · Tracked, not yet weighted',
  obs_intro:'We watch these constantly, but because they have no stable, monotonic relationship with bubble tops (take interest rates: the 2000 top had high rates, the 2022 top had zero — opposite directions), they serve only as background context and carry no weight in P.',
  hist_title:'Backtests',
  hist_intro:'We put the model back at four key moments in the past to see whether it can tell "a bubble bursting on its own" apart from "an outside force knocking the market down." This is the real test of whether a model is useful — not just raising an alarm whenever prices fall. A detailed reading of each period is on the <a href="methodology.html" style="color:var(--green);border-bottom:1px solid var(--grid)">methodology page</a>.',
  hist_th:'<th>Period</th><th>P Pressure</th><th>M Severity</th><th>R Engine</th><th>R Trend</th><th>Gate</th><th>Outcome</th><th>Nature</th>',
  hist_readout:'<b>Today:</b> P=0.963 — structural pressure already exceeds 2000 and is the highest of all five moments; M=0.567 is likewise the highest — the "weight" pressing on this foundation is unprecedented. <b>But the rupture-confirmation light is still green</b> (all three major indices above their 200-day average, volatility not high). This is "the tightest balloon in history that still hasn\'t leaked": across the four historical tops, the gate typically leaves green only 2–6 weeks after the top. So what to watch now is breadth — <b>the moment indices stay below the 200-day line and the gate leaves green, that\'s the earliest exit cue</b>. R-trend has been demoted to auxiliary, not a trigger.',
  rp_title:'Time Machine · 12 weeks around each top',
  rp_intro:'Looking only at the day of the top is deceptive — a top is the calm before the storm, and the gate looks green any way you read it. So we put you back at the historical scene: pick a major top and watch how its "live weekly dashboard" evolved from <b>6 weeks before to 6 weeks after</b>. Each dot is that week\'s P; its color is that week\'s rupture-confirmation light — you\'ll see plainly how, <b>had you been living through it, you\'d have watched pressure pinned at the highs while the gate stepped away from green one notch at a time</b>. Hover any week for its full reading. All values are point-in-time (using only data up to that week, no look-ahead).',
  rx1_head:'How many times has this light actually flashed red?',
  rx1_sub:'We ran the four-color gate month by month across 1991–2026 (36 years). 🔴 Red (a breadth break + volatility spiking to a historic high) has lit a total of only <b style="color:var(--red-soft)">26 months</b>, all falling inside the three most violent crashes — it is extremely rare and extremely accurate, never a false alarm.',
  rx2_head:'Continuous warning episodes (with the green months counted)',
  rx2_sub:'We merge nearby warning months into "episodes" and honestly mark how many red / orange / yellow / green months each one held (including greens that fell in the middle). Note that <b>the 2022 rate-hike bear stayed orange throughout and never went red</b>; COVID had only 2 red months yet was the most violent.',
  ep_th:'<th>Period</th><th>Length</th><th>🔴 Red · 🟠 Orange · 🟡 Yellow · 🟢 Green</th><th>Event</th>',
  bound_title:'Our Honest Limits',
  bound_list:'<li><b>No look-ahead, empirically proven.</b> Every value at any moment (P/M/R + the four-color gate) uses only the data <b>up to that instant</b>. We verified it: delete all data after a given historical date, and that day\'s reading is bit-for-bit identical — historical data is used only for hindsight calibration, never to "peek at the future."</li>\n      <li><b>P can exceed 1.</b> P\'s "floor" (the energy level) is a 0–1 percentile, but when pressure is both extreme and accelerating, the kinetic amplification can push P past 1.0 — as it did at the June peak (1.029); today it sits at 0.963, still the highest of all five. That\'s a feature, not a bug.</li>\n      <li><b>Price momentum is no market-timing magic.</b> Across 155 years, calling tops on "velocity turning negative" alone is right only ~11% of the time, and can\'t tell a great bubble top from an ordinary pullback. The real discriminating power comes from the multi-dimensional energy state (valuation / leverage / concentration…); R-trend has been <b>demoted to auxiliary, not an exit trigger</b>.</li>\n      <li><b>Tiny sample + cold start.</b> Bubble-grade tops are inherently rare; in the early years (2000/2007) some short-history indicators (concentration / premium / IPO) are honestly dropped because the data hadn\'t accumulated yet. This 2026 round is a genuine out-of-sample test.</li>\n      <li><b>Fully transparent, criticism welcome.</b> Every weight, parameter, formula, and data source is public. <b>If you think a value needs updating, please tell us via "Contact."</b></li>',
  pe_text:'<b>Want the full derivation behind every number?</b> All the formulas for P / M / R, the weight and data source of all 11 indicators, the decision rules of the four-color light, and a one-by-one reading of the four historical tops — all laid bare on the methodology page.',
  pe_btn:'🔬 Enter the Methodology →',
  foot_dis:'This site is an independent research and educational project. All data comes from public sources and is computed transparently, for reference and discussion only, and <b>does not constitute investment advice</b>. Predicting a bubble top is inherently uncertain; P/M/R are tools to aid thinking, not certain prophecies. Investing carries risk — make your own decisions and bear your own gains and losses.'
});

Object.assign(window.I18N.ko, {
  nav_live:'● 실시간', nav_story:'원리 이야기', nav_academic:'학술 근거', nav_indicators:'지표',
  nav_history:'역사 검증', nav_replay:'타임머신', nav_method:'방법론', nav_message:'문의하기',
  hero_head:'이 풍선, <span class="accent">얼마나 더 부풀 수 있을까</span>?',
  hero_sub:'우리는 미국 증시 버블을 세 개의 숫자로 추적합니다 — 지금 얼마나 <b>팽팽한지</b>, 터지면 얼마나 <b>거센지</b>, 그리고 아직도 <b>부는 사람</b>이 있는지. 터지는 날짜를 맞히지 않습니다. 보이지 않는 압력을 당신이 읽을 수 있는 눈금으로 바꿀 뿐입니다.',
  strip_head:'지난 20주 · 붕괴 확인등',
  gate_explain:'<div class="ge-card can">\n        <div class="ge-t"><span class="dot"></span>이 등이 줄 수 있는 것</div>\n        <p>이 등은 <b>천장이 며칠에 올지 예측하지 않습니다</b> — 진짜 붕괴가 시작되는 그 순간 확인할 뿐입니다. <b>두 개의 독립 신호</b>를 봅니다: 변동성 등(3대 지수가 200일선 아래로 + 2주 연속 + 변동성이 역사적 고점으로 급등)과 <b>신용 방아쇠</b>(하이일드 스프레드가 6개월 저점보다 ≥1.5%p 확대).</p>\n        <p>어떤 단일 신호도 전부를 잡지 못합니다: 변동성 등은 2000(🔴)과 2022(🟠)를 잡았고, <b>신용 방아쇠는 2007과 2020을 잡았습니다</b> — 특히 2007 같은 신용위기에서는 순수 증시 등이 거의 반응하지 않았고 신용 방아쇠만이 일찍 경고했습니다. <b>둘을 합치면 30년간 네 번의 대붕괴를 하나도 놓치지 않았습니다.</b></p>\n        <p><b>초록</b>일 때는 안심하고 보유할 수 있습니다; <b>노란불 하나만으로 행동하지 마십시오</b>(약 3/4은 가짜) — 진짜 이탈 신호는 🟠/빨강 또는 신용 방아쇠입니다. 천장 <b>이후</b>, 최저점 <b>이전</b>에 확인합니다 — 수정구슬이 아니라 확인 도구입니다.</p>\n      </div>\n      <div class="ge-card adv">\n        <div class="ge-t"><span class="dot"></span>전통 지표와 무엇이 다른가</div>\n        <p>PER, 버핏 지수, 풋콜 비율 — 이들은 오직 "<b>지금 비싼가</b>"만 답합니다. 한 장의 스냅샷이죠. 그러나 위험은 얼마나 비싼지뿐 아니라, 그 압력이 얼마나 오래 쌓였고 아직도 가속하는지에 있습니다.</p>\n        <p>우리는 지표에 "<b>시간</b>"을 용접해 넣었습니다: P는 에너지의 속도와 가속도를 읽고("가속을 가속하는 것"이 천장의 지문입니다), M은 60개월의 압력을 적분합니다(0에서 리셋되는 강물이지, 채워지기만 하는 저수지가 아닙니다).</p>\n        <p>"비싸지만 3년째 횡보하며 동력이 식은" 시장과 "똑같이 비싸지만 아직도 질주하는" 시장은 스냅샷으로는 구별되지 않습니다. 에너지 좌표는 <b>이 둘을 구별합니다</b>.</p>\n      </div>\n      <div class="ge-card cant">\n        <div class="ge-t"><span class="dot"></span>이 등이 할 수 없는 것</div>\n        <p><b>정확한 천장 날짜는 줄 수 없습니다.</b> 155년 역사로 검증한 결과, 가격 속도만으로 천장을 잡는 정확도는 약 11%에 불과합니다. "며칠에 천장"이라고 말하는 어떤 도구도 당신을 속이는 것입니다.</p>\n        <p><b>개별 종목은 예측하지 않습니다.</b> 이것은 시장 지반의 시스템적 압력을 재는 것이지, 특정 종목이 내일 오를지 내릴지를 재는 것이 아닙니다.</p>\n        <p><b>수정 구슬이 아닙니다.</b> 버블의 천장은 본질적으로 불확실하며, 2026년은 진정한 표본 외 시험입니다. 우리는 예언이 아니라, 원칙 있는 리스크 대시보드를 제공합니다.</p>\n      </div>',
  st_title:'우리 발밑의 땅',
  st_intro:'공식을 이야기하기 전에, 한 이야기를 들려드리겠습니다 — 무른 진흙 위에 세워진 바닷가 도시가, 가장 번영하던 날 어떻게 바다 밑으로 가라앉았는지에 관한 이야기입니다. 이것은 우화가 아닙니다. 토니스-헤라클레이온은 실존했습니다. 기원전 2세기경 그 지반이 액상화되어 도시 전체가 7미터 가라앉아 지중해로 사라졌고, 2000년 잠수부들이 다시 발견하기 전까지 잊혀져 있었습니다. 이야기 속 모든 장면은 거듭 검증된 버블의 법칙과 맞닿아 있습니다.',
  st_teaser:'<div class="stt-lead">"이 땅은 버티지 못해. 우리는 너무 무겁게, 너무 빽빽이 지었어."</div>\n      <p>아무도 맛본 적 없는 독한 술이 도시 전체를 불태웠습니다. 건물은 점점 더 높아졌고, 가장 형편없는 갯벌마저 서로 차지하려 메워졌습니다. 오직 비웃음받던 한 노인만이, 벽 밑동에 새로 갈라진 금을 바라보며 아무도 믿지 않는 경고를 내뱉었습니다. 그리고 모두의 눈에 보이지 않는 지하에서는, 너무 오래 짓눌린 무른 흙이 더는 버틸 수 없는 한계를 향해 조금씩 다가가고 있었습니다 — 여느 날과 조금도 다르지 않던 그날까지.</p>\n      <a href="story.html" class="stt-link">전체 이야기 읽기: 우리 발밑의 땅 →</a>',
  ac_title:'7대 고전 이론 + 2개의 새로운 검증',
  ac_intro:'<a href="story.html" style="color:var(--green);border-bottom:1px solid var(--grid)">이야기</a> 속 모든 장면은 — 동료 심사를 거쳤거나 시장에서 거듭 입증된 — 실제 이론과 맞닿아 있습니다. 우리는 이 거인들의 어깨 위에 서 있으며, 각 이론의 한계와 우리의 보정을 정직하게 표시합니다. 전체 수학적 유도는 <a href="methodology.html" style="color:var(--green);border-bottom:1px solid var(--grid)">방법론 페이지</a>에 있습니다.',
  p1:'<div class="pillar-h"><span class="pillar-n">기둥 1</span><span class="pillar-t">초지수적 가속 · 임계점</span><span class="pillar-src">Johansen &amp; Sornette 2000</span></div>\n      <div class="pillar-body">물리학자 소르네트는 버블 천장 직전 가격이 "가속을 가속한다"(초지수적 성장)는 것을 발견했습니다. <span class="use">우리는 채택합니다</span> — 이 가속도 개념을. <span class="fix">우리는 버립니다</span> — 원 모델의 논란 많고 과적합되기 쉬운 "로그 주기 진동"을. 바로 이 논문이 2000년 나스닥 폭락을 분석했습니다. <span class="pillar-maps">P에 반영</span></div>',
  p2:'<div class="pillar-h"><span class="pillar-n">기둥 2</span><span class="pillar-t">임계 감속 · 변동성 누적</span><span class="pillar-src">Scheffer 2009 · Nature</span></div>\n      <div class="pillar-body">복잡계가 임계점에 가까워지면 "분산 상승" 같은 경고 신호가 나타납니다. <span class="use">우리는 채택합니다</span> — 변동성 누적을. <span class="fix">우리는 정직하게 표시합니다</span> — 반대 증거를. 연구(Guttal 2016)는 증시 폭락이 임계 감속과 완전히 일치하지는 않음을 보였고, 그래서 우리는 양측 모두 검증한 "낮은 변동성 누적"만 사용합니다. <span class="pillar-maps">P에 반영</span></div>',
  p3:'<div class="pillar-h"><span class="pillar-n">기둥 3</span><span class="pillar-t">집중도 평균 회귀</span><span class="pillar-src">RBC / Invesco 2026</span></div>\n      <div class="pillar-body">버블 천장에서는 상승분이 소수 주도주에 고도로 집중되는 경향이 있습니다. 상위 10종목 비중은 2000년 27%에서 정점을 찍었고, 오늘은 40%에 달합니다. <span class="use">우리는 채택합니다</span> — 상위 10종목 비중을. 그리고 "집중도 버블 프리미엄" = 비중 − 이익 비중을 새로 더해, 진짜 해자와 밸류에이션 버블을 구별합니다. <span class="pillar-maps">P에 반영</span></div>',
  p4:'<div class="pillar-h"><span class="pillar-n">기둥 4</span><span class="pillar-t">침투 이론 · 발효 시간이 강도를 정한다</span><span class="pillar-src">Sornette 2016 · 침투 모델</span></div>\n      <div class="pillar-body">소르네트는 침투 이론으로 보였습니다: 기억이 길수록 → 버블이 클수록 → 폭락 가능성이 크다. 폭락의 강도 = 높이 × 발효 시간. <span class="use">이것이 M의 이론적 뿌리입니다</span> — 압력이 오래 발효될수록 더 크게 터집니다. <span class="pillar-maps">M에 반영</span></div>',
  p5:'<div class="pillar-h"><span class="pillar-n">기둥 5</span><span class="pillar-t">재귀성 · 자기강화 순환</span><span class="pillar-src">George Soros 1987</span></div>\n      <div class="pillar-body">소로스: 가격 상승 자체가 인식을 바꾸어, 관망하던 냉정한 이들마저 끌어들입니다. 가격이 "무너졌어야 할" 지점을 돌파하고도 무너지지 않으면, 그것 자체가 광고가 됩니다. <span class="use">이것이 R의 뿌리입니다</span> — 번영을 떠받치는 유입(신규 자금)이 왕성할수록 버블은 연명하고, 유입이 꺾이는 순간 가려졌던 취약성이 드러납니다. <span class="pillar-maps">R에 반영</span></div>',
  p6:'<div class="pillar-h"><span class="pillar-n">기둥 6</span><span class="pillar-t">금융 불안정성 가설</span><span class="pillar-src">Hyman Minsky 1992</span></div>\n      <div class="pillar-body">민스키: "안정 그 자체가 불안정하다" — 오랜 평온은 위험 감수와 레버리지 축적을 부추기다가 "민스키 모멘트"에 이릅니다. <span class="use">이것은 우리의 "레버리지 / 낮은 변동성 누적" 차원을 뒷받침</span>하며, 2008을 완벽히 설명합니다: 그해 레버리지는 증시가 아니라 부동산에 쌓였고, 그래서 우리 모델의 2008 증시 P는 높지 않습니다 — 바로 이것이 "증시 밸류에이션 버블"과 "신용위기 전이"를 구별할 수 있다는 증거입니다. <span class="pillar-maps">레버리지 차원 · 2008 설명</span></div>',
  p7:'<div class="pillar-h"><span class="pillar-n">기둥 7</span><span class="pillar-t">시장 에너지 · 운동에너지 = ½ 운동량²</span><span class="pillar-src">Tuncay · Ausloos · Vandewalle</span></div>\n      <div class="pillar-body">가격에는 "운동에너지"가 있습니다: 오르면 따라 사고 떨어지면 던지는 군중의 관성으로, 운동에너지는 운동량의 제곱에 대략 비례합니다. 에너지는 운동·위치 형태 사이에서 보존되어 급변하지 않습니다(축적과 방출). 폭락 신호 = 에너지가 극대에 이르고 + 운동량이 음으로 전환. <span class="use">이것이 "시간"을 P/M에 용접해 넣는 핵심</span>이며, 소로스의 재귀성("매수가 매수를 부른다")과 같은 뿌리입니다. <span class="pillar-maps">P/M의 시간-에너지 뿌리</span></div>',
  p8:'<div class="pillar-h"><span class="pillar-n">신 검증 · 드래곤 킹</span><span class="pillar-t">대폭락은 내생적 "이상치"다</span><span class="pillar-src">Sornette · Dragon Kings</span></div>\n      <div class="pillar-body">약 99%의 조정은 하나의 분포를 따르고, 소수의 대재앙만이 "이상치"입니다 — 그중 약 3분의 2가 초지수적 버블이 앞서 이끈 내생적 폭락입니다. <span class="use">이것이 우리의 검증 철학을 줍니다</span>: 신호는 이런 내생적 대천장을 전문적으로 식별해야 하며, 평범한 조정마다 경보를 울려서는 안 됩니다. <span class="pillar-maps">검증 철학</span></div>',
  p9:'<div class="pillar-h"><span class="pillar-n">신 검증 · 보정</span><span class="pillar-t">폭락 전엔 분산이 오르고, 자기상관은 오르지 않는다</span><span class="pillar-src">실증 검증 · 다수 연구</span></div>\n      <div class="pillar-body">우리 자체 검증 결과, 미국 대폭락 전에 고전적 임계 감속의 "자기상관 상승"은 <b>나타나지 않았고</b>, "분산 상승"은 실제로 보편적이었습니다. <span class="fix">그래서 우리는 기둥 2를 보정했습니다</span> — 붕괴 확인(4색 게이트)은 "높은 분산 + 폭 이탈"만 쓰고, 자기상관은 버렸습니다. <span class="pillar-maps">기둥 2 보정 · 4색 게이트</span></div>',
  cd_title:'핵심 차원',
  cd_intro:'가중치가 가장 높은 지표가 천장을 가장 믿을 만하게 예고합니다 — 가격 동력과 시장 폭. 각 지표에는 강도 막대가 붙어, 자기 역사 안에서의 시점(point-in-time) 백분위를 보여줍니다(오직 자기 과거하고만 비교, 미래 엿보기 없음) — 붉을수록 극단적입니다. 지표 옆 물음표에 마우스를 올리면 의미를 볼 수 있습니다.',
  wall_title:'지표 벽 · 계산에 들어가는 나머지 지표들',
  wall_intro:'가중치는 조금 낮지만 똑같이 P 계산에 들어가는 밸류에이션·심리·레버리지·신용·과열 신호들. 하나도 빠짐없이 모두 펼쳐 놓았습니다.',
  obs_title:'관찰 목록 · 추적하되 아직 가중하지 않음',
  obs_intro:'우리는 이들을 늘 주시하지만, 버블 천장과 안정적인 단조 관계가 없기에(예컨대 금리: 2000년 천장은 고금리, 2022년 천장은 제로금리로 방향이 반대) 배경 관찰로만 두고 P 가중에는 넣지 않습니다.',
  hist_title:'역사 검증',
  hist_intro:'우리는 모델을 과거의 네 핵심 시점에 되돌려 놓고, "버블이 스스로 터진 것"과 "외력에 의해 떨어진 것"을 구별할 수 있는지 봅니다. 이것이야말로 모델이 쓸모 있는지 가르는 진짜 시험입니다 — 그저 떨어질 때마다 경보를 울리는 것이 아니라. 각 시기의 상세 해설은 <a href="methodology.html" style="color:var(--green);border-bottom:1px solid var(--grid)">방법론 페이지</a>에 있습니다.',
  hist_th:'<th>시기</th><th>P 압력</th><th>M 강도</th><th>R 엔진</th><th>R 추세</th><th>게이트</th><th>실제 결과</th><th>성격</th>',
  hist_readout:'<b>오늘:</b> P=0.963 — 구조적 압력이 이미 2000년을 넘어 다섯 시점 중 최고이며, M=0.567 역시 최고입니다 — 이 지반을 짓누르는 "무게"는 전례가 없습니다. <b>그러나 붕괴 확인등은 여전히 초록</b>입니다(3대 지수가 모두 200일선 위, 변동성도 높지 않음). 이것이 바로 "역사상 가장 팽팽하지만 아직 새지 않은 풍선"입니다: 네 번의 역사적 천장에서 게이트는 보통 천장 후 2–6주가 지나서야 초록을 떠났습니다. 그러니 지금 주시할 것은 폭입니다 — <b>지수가 200일선 아래 머물고 게이트가 초록을 떠나는 순간, 그것이 가장 빠른 이탈 신호</b>입니다. R 추세는 보조로 강등되어, 방아쇠가 아닙니다.',
  rp_title:'타임머신 · 천장 전후 12주',
  rp_intro:'천장 당일만 보는 것은 사람을 속입니다 — 천장은 폭풍 전의 고요이며, 게이트는 어떻게 봐도 초록입니다. 그래서 우리는 당신을 역사의 현장에 되돌려 놓습니다: 대천장 하나를 골라, 그 "주간 실시간 대시보드"가 <b>천장 6주 전부터 6주 후까지</b> 어떻게 한 주 한 주 변해 갔는지 봅니다. 각 점은 그 주의 P이고, 색은 그 주의 붕괴 확인등입니다 — <b>그때 그 속에 있었다면, 압력이 고점에 박힌 채 게이트가 한 칸씩 초록을 떠나는 것을 어떻게 지켜봤을지</b> 한눈에 보입니다. 아무 주에나 마우스를 올리면 그 주의 전체 수치를 볼 수 있습니다. 모든 값은 시점 기준(point-in-time)입니다(그 주와 그 이전 데이터만 사용, 미래 엿보기 없음).',
  rx1_head:'역사상 이 등은 빨간불을 몇 번이나 켰을까?',
  rx1_sub:'4색 게이트를 1991–2026년(36년) 동안 월 단위로 돌렸습니다. 🔴 빨간불(폭 이탈 + 변동성이 역사적 고점까지 급등)은 통틀어 단 <b style="color:var(--red-soft)">26개월</b>만 켜졌고, 모두 가장 격렬했던 세 번의 폭락 안에 있었습니다 — 극히 드물고, 극히 정확하며, 한 번도 거짓 경보를 낸 적이 없습니다.',
  rx2_head:'연속 경계 위기 구간(중간의 초록불 수 포함)',
  rx2_sub:'가까운 경계 달들을 "위기 구간"으로 묶고, 각 구간에 빨강 / 주황 / 노랑 / 초록이 몇 달씩 있었는지(중간에 낀 초록 포함) 정직하게 표시합니다. <b>2022년 금리 인상 약세장은 내내 주황이었고 한 번도 빨강이 되지 않았음</b>에 주목하세요. 코로나는 빨강이 2개월뿐이었지만 가장 격렬했습니다.',
  ep_th:'<th>구간</th><th>기간</th><th>🔴 빨강 · 🟠 주황 · 🟡 노랑 · 🟢 초록</th><th>사건</th>',
  bound_title:'우리의 정직한 한계',
  bound_list:'<li><b>미래 엿보기 없음, 실증 완료.</b> 어떤 시점의 모든 값(P/M/R + 4색 게이트)도 <b>그 순간까지의</b> 데이터만 씁니다. 우리는 검증했습니다: 특정 역사 일자 이후의 모든 데이터를 지워도 그날의 수치는 비트 단위로 동일합니다 — 역사 데이터는 오직 사후 보정에만 쓰이며, 결코 "미래를 엿보지" 않습니다.</li>\n      <li><b>P는 1을 넘을 수 있습니다.</b> P의 "바닥"(에너지 위치)은 0–1 백분위지만, 압력이 극단적이면서 가속할 때 운동에너지 증폭이 P를 1.0 위로 밀어 올립니다 — 6월 고점 1.029가 그 경우이며; 오늘은 0.963으로, 여전히 다섯 시점 중 최고입니다. 이것은 버그가 아니라 특성입니다.</li>\n      <li><b>가격 동력은 마법의 타이밍 도구가 아닙니다.</b> 155년 역사에서 "속도가 음으로 전환"하는 것만으로 천장을 잡는 정확도는 약 11%에 불과하며, 대형 버블 천장과 평범한 조정을 구별하지 못합니다. 진짜 판별력은 다차원 에너지 상태(밸류에이션 / 레버리지 / 집중도…)에서 나오며, R 추세는 <b>보조로 강등되어 이탈 방아쇠가 아닙니다</b>.</li>\n      <li><b>극소 표본 + 콜드 스타트.</b> 버블급 천장은 본래 드물며, 초기(2000/2007)에는 일부 짧은 역사의 지표(집중도 / 프리미엄 / IPO)가 데이터가 아직 쌓이지 않아 정직하게 버려집니다. 이번 2026 라운드는 진정한 표본 외 시험입니다.</li>\n      <li><b>완전 투명, 비판 환영.</b> 모든 가중치·매개변수·공식·데이터 출처가 공개되어 있습니다. <b>어떤 값이 갱신되어야 한다고 생각하시면 "문의하기"로 알려 주세요.</b></li>',
  pe_text:'<b>모든 숫자 뒤의 완전한 유도가 궁금하신가요?</b> P / M / R의 모든 공식, 11개 지표의 가중치와 데이터 출처, 4색 등의 판정 규칙, 네 번의 역사적 천장에 대한 하나하나의 해설 — 전부 방법론 페이지에 펼쳐져 있습니다.',
  pe_btn:'🔬 방법론으로 들어가기 →',
  foot_dis:'본 사이트는 독립적인 연구·교육 프로젝트입니다. 모든 데이터는 공개 출처에서 가져와 투명하게 계산되며, 참고와 토론을 위한 것일 뿐 <b>어떠한 투자 조언도 구성하지 않습니다</b>. 버블 천장의 예측은 본질적으로 불확실하며, P/M/R은 사고를 돕는 도구이지 확정된 예언이 아닙니다. 투자에는 위험이 따르며, 판단과 손익은 스스로 책임지십시오.'
});

/* ============================ 故事页 story.html ============================ */
Object.assign(window.I18N.en, {
  story_sub:'Before the formulas, let me tell you a story. Using something you can feel in your bones, it lays out every sign we believe shows up before a collapse. It takes about five minutes to read — and by the end you\'ll find this is no parable.',
  back_home:'\u2190 Back to home', foot_home:'Home',
  story_body:`<p class="st-lead">I was young that year, and I came to this seaside city with a sack of chisels on my back.</p>
      <p class="st-p">The city was built around a bay. At its center stood a patch of solid high ground, where the temples and homes of our forefathers had stood firm for centuries. Along the coast at its edges lay vast stretches of soft, wet mudflat — oily-sheened at low tide, swallowing your foot to the ankle if you stepped in. In those days everyone, from the high priest down to the fisherman, understood one plain truth: <span class="st-em">those mudflats were good only for drying nets, holding a market, letting children run — and anyone who built a house on them was taken for a fool.</span></p>
      <p class="st-p">It was an age of good sense. Merchant ships came in one after another, prosperous and orderly. With my stone-cutting trade I built houses and mended wall-footings on the good ground, and lived a settled life.</p>
      <p class="st-p">The change began with a liquor.</p>
      <p class="st-p">One year a liquor no one had ever seen arrived by sea. For generations this city had drunk a pale ale so weak it barely went to your head. But this new liquor was different — strong, pure, a fire down the throat; the first sip lit up the eyes of people raised on weak ale. Some called it holy water from the gods; more called it <span class="st-hl">the future itself, the foundation of everything to come</span>. Overnight, everyone wanted it, everyone was talking about it.</p>
      <p class="st-p">The first to catch on was a household up on the high ground. They got hold of the recipe and added two more floors to their three-story house — distilling below, hosting guests above — drawing people from every direction who paid dearly to drink. The neighbors called them greedy, but the liquor sold hotter and hotter, the building rose higher and higher, and the resale price shut up everyone who had gossiped. <span class="st-em">After all, it was the best ground in the city, producing the liquor everyone wanted — who could say it wasn't worth it?</span> So three floors became five, five became eight. Whoever could distill and sell liquor in their building, their building was worth a fortune.</p>
      <p class="st-p">The real madness began with the mudflats.</p>
      <p class="st-p">The man who had grown rich from the liquor had a distant relative — talentless, but through that connection he got hold of a little of the spent mash and dregs left from distilling. For next to nothing he drove piles and filled earth on a flat that "looked not quite so bad," put up a house, and began selling these leftovers. Everyone waited to laugh at him. <span class="st-hlg">But even those dregs sold at an enviable price — because they carried the name of that liquor, and even the scraps were fought over.</span></p>
      <p class="st-p">And with that, something cracked open in everyone's heart. Crowds rushed like madmen toward the once-worthless flats, scrambling to buy, to fill, to build, to get hold of anything that so much as touched that liquor. <span class="st-hl">Especially the "slightly-better bad land" — the kind that could get slightly more respectable mash — rose more fiercely than anything else.</span> The pace of building went from a few houses a year to dozens a month, and faster and faster by the day — because everyone feared that one step behind meant never catching up again.</p>
      <p class="st-p">Those years were a golden age for us stonemasons.</p>
      <p class="st-p">The more buildings rose, the more precious we repair-craftsmen became. For every building, the owner paid a sum on schedule to have us reinforce the foundation, patch the cracks, keep it all trim and sound. I had more work than I could finish, and earned more and more. Like the other masons pouring into the city, I made money and couldn't bear to leave, so I put down roots — first buying a building myself, then, growing bolder, even pooling money to raise new ones and distill liquor of my own. You see, it became a wheel that spun faster and faster: <span class="st-em">the hotter the liquor sold, the more buildings rose; the more buildings, the more we masons earned; we kept every building solid and gleaming, and seeing these "sound and reliable" towers, people dared to buy more, build more, distill more; the more they built, the more work and more masons poured in…</span> The whole city flourished.</p>
      <p class="st-p">There was an old man in the city; no one remembered his age. He didn't busy himself with money — all day he ran his hand over the ground, staring at the fresh hairline cracks at the base of the walls, his brow knitting tighter and tighter. To anyone who would listen he said: <span class="st-hlr">"This ground can't hold. We've built too heavy, too full."</span></p>
      <p class="st-p">But look around — the city had never been so prosperous. Lamps blazed through the night, the scent of liquor never ceased, the streets thronged with people come from afar to drink. Where was the faintest sign of collapse?</p>
      <p class="st-p">Yes, the earth did tremble lightly a few times, faint as someone stamping a foot far away; the well water did turn muddy now and then, and cleared again in a day or two. To be honest, <span class="st-em">in a few of those moments a flicker of unease I couldn't name passed through me too.</span> But each time I looked up at those around me — still chatting, still drinking, still building higher. So I shrugged, and <span class="st-em">like everyone else, swallowed that unease back down, and forgot it.</span></p>
      <p class="st-p">People laughed at the old man's fretting: "The city has stood all these years, perfectly fine — why on earth would it fall?"</p>
      <p class="st-p"><span class="st-em">In the end, in that age there was no method — none that could convince everyone, the way a weather forecast does today — to prove the pressure had reached its limit.</span> You couldn't turn the words "it's about to collapse" into something no one could refute and set it before them all. The old man spoke, but no one believed him. Myself included.</p>
      <p class="st-p">And in those days there was one thing none of us could see. It was happening underground.</p>
      <p class="st-p">All these years, every building we raised, every stone we stacked — that weight, every ounce of it, pressed down on the soft earth beneath our feet. The soft earth was pressed firmer and tighter, <span class="st-em">like a wet sponge squeezed over and over — hard to the touch on the surface, yet the force inside it creeping bit by bit toward the limit it could no longer bear.</span> The longer the press, the heavier the load, the more violent the collapse once it let go. And our daily patching as masons <span class="st-em">had never actually solved anything. We were only papering over those cracks on the surface, again and again. The truth beneath was never touched — only put off, day by day.</span></p>
      <p class="st-p">The day of the collapse was no different from any other.</p>
      <p class="st-p">I only remember that on that day a few things suddenly caught my eye, all at once. I saw that <span class="st-hl">even the farthest, worst flats had, with the last of their strength, been built over with low little bungalows — in the whole city, you could no longer find a single empty plot.</span> I looked up again at the finest, steadiest, hottest-selling liquor tower on the high ground; it <span class="st-hl">had already been raised to its 99th floor, too tall to add even half a meter more.</span> And in that very instant a haze passed through my mind — <span class="st-hl">how was it that the people putting up new buildings seemed suddenly fewer? The people coming to buy liquor… seemed not so many either? And the work in my hands… seemed not so much either?</span></p>
      <p class="st-p">Just one fleeting instant.</p>
      <p class="st-p">And in that very instant — when the repair work slowed, and no one tended the buildings that only human hands had barely kept standing — the earth below, that land we had pressed too long and pushed past its limit, at last, <span class="st-hlr">like water, dissolved.</span></p>
      <p class="st-p">No thunderclap, no warning. The tallest tower, the most splendid tavern, the noisiest market, and every soul still raising a cup in the street — <span class="st-hlr">in the space of a few heartbeats, the whole ground sank into the sea.</span> The prosperity above, the liquor, the building prices, the trade, and the force pent up underground for so many years all gave way in the same moment, together.</p>
      <p class="st-p">And then the sea was flat. So flat it was as if a city had never been here at all.</p>
      <hr class="st-hr">
      <p class="st-reveal">And here I must tell you something: this is not a parable.</p>
      <p class="st-p">This city truly existed. It was called <span class="st-em">Thonis-Heracleion</span>, once the most prosperous port at the mouth of the Nile in ancient Egypt — a gathering place of countless ships, rich beyond measure. It was built on the soft silt of the Nile Delta. Around the 2nd century BC, the ground beneath it truly liquefied — the whole city, with its towering temples and palaces, <span class="st-em">sank seven meters in a very short time, down into the Mediterranean.</span> Then it was utterly forgotten by all of humanity. For more than two thousand years, no one knew where it was. <span class="st-em">Not until the year 2000 did archaeologists finally find it again, on the sea floor.</span></p>
      <div class="st-note">I must be honest with you: that it was a real, prosperous trading port, truly built on soft ground, that its foundation truly liquefied, that it truly sank suddenly, and was truly not rediscovered until 2000 — these are established archaeological facts. The liquor that set everyone alight, the mason who made a fortune, the mocked old man — these I have reconstructed for you along the grain of human nature, as the most likely way it really played out.</div>
      <p class="st-p">Now let me point out to you, one by one, what lies behind each scene you've just watched. Not one of them is my invention — <span class="st-em">every scene is a real pattern, verified again and again.</span></p>
      <ul class="reveal-list">
        <li class="ri"><span class="ri-term">Reflexivity · Soros</span><span class="ri-txt">The distant relative who first sold dregs on the mud and grew rich when he should have failed, and how he set everyone alight — <b>one thing that "should have crashed but didn't" will turn even the coolest bystander into a player.</b></span></li>
        <li class="ri"><span class="ri-term">Super-exponential · Sornette</span><span class="ri-txt">The pace of building grew faster by the day, fast to the point of frenzy — <b>before a bubble top, the rise isn't steady; it's "accelerating acceleration."</b></span></li>
        <li class="ri"><span class="ri-term">Concentration · RBC</span><span class="ri-txt">In the end, the city's tallest, dearest, hottest-selling towers were held by only a few giants — <b>the prosperity at a top rests on fewer and fewer hands.</b></span></li>
        <li class="ri"><span class="ri-term">Critical slowing · Scheffer</span><span class="ri-txt">Those ignored faint tremors, the well water that muddied and cleared, the unnatural calm — <b>the closer a system comes to collapse, the calmer the surface looks, yet the "anomalies" beneath multiply.</b></span></li>
        <li class="ri"><span class="ri-term">Stability is instability · Minsky</span><span class="ri-txt">The longer the peace, the more everyone let down their guard and dared to add more — <b>calm is precisely danger accumulating.</b></span></li>
        <li class="ri"><span class="ri-term">Percolation &amp; fermentation · Sornette</span><span class="ri-txt">The soft earth below, pressed longer and heavier, collapsed more violently — <b>the longer pressure ferments, the more catastrophic the collapse.</b></span></li>
        <li class="ri"><span class="ri-term">Critical phase transition · LPPL</span><span class="ri-txt">In that final instant, the land that had held so long liquefied all at once on an ordinary day — <b>once pressure reaches that point, collapse comes in a single moment.</b></span></li>
      </ul>
      <p class="st-p">And the thing the mocked old man lacked — <span class="st-hlg">a forecast that could convince everyone, like a weather forecast — is exactly what we set out to make for you today.</span> We have gathered all of this into three numbers:</p>
      <div class="pmr-reveal">
        <div class="pmr-rev-card P"><div class="prl">P · Pressure</div><div class="prt">How close the foundation is, this very moment, <b>to the critical point</b> of liquefaction.</div></div>
        <div class="pmr-rev-card M"><div class="prl">M · Severity</div><div class="prt">How heavy these buildings press, and for how long; if it collapsed now, <b>how disastrously it would sink.</b></div></div>
        <div class="pmr-rev-card R"><div class="prl">R · Reflexivity</div><div class="prt">Whether the inflow sustaining the illusion that "all is solid" is <b>still running strong</b>. Once it stops, the fragility hidden so long swallows everything in an instant.</div></div>
      </div>
      <p class="st-p">If the old man had held these three numbers back then, would the ending have been different? And in today's market — what exactly are these three numbers? And how are they calculated?</p>
      <p class="st-p" style="margin-bottom:0"><span class="st-em">Next, allow me to turn from the mocked prophet into someone who lays every formula and every piece of data open before you.</span></p>
      <div class="story-cta"><a href="methodology.html">Enter the Methodology: formulas, parameters &amp; data sources →</a></div>`
});
Object.assign(window.I18N.ko, {
  story_sub:'공식을 이야기하기 전에 한 이야기를 들려드리겠습니다. 당신이 몸으로 느낄 수 있는 일을 통해, 붕괴 전에 나타난다고 우리가 믿는 모든 징후를 풀어 놓습니다. 읽는 데 약 5분 — 그리고 끝에 이르면 이것이 우화가 아님을 알게 되실 겁니다.',
  back_home:'\u2190 홈으로', foot_home:'홈',
  story_body:`<p class="st-lead">그해 나는 젊었고, 끌 한 자루를 짊어진 채 이 바닷가 도시에 왔다.</p>
      <p class="st-p">도시는 만(灣)을 따라 세워져 있었다. 중심에는 단단한 고지대가 있어 조상들의 신전과 저택이 그 위에 수백 년을 굳건히 서 있었다. 가장자리, 해안을 따라서는 드넓은 무르고 질척한 갯벌이 펼쳐져 있었다 — 썰물이면 기름처럼 번들거리고, 한 발 디디면 발목까지 빠지는 곳이었다. 그 시절 제사장부터 어부까지 누구나 가장 소박한 진리 하나를 알았다: <span class="st-em">그 진흙 땅은 그물이나 말리고, 장이나 서고, 아이들이나 뛰놀게 할 곳이지, 거기에 집을 짓는 자는 바보 취급을 받았다.</span></p>
      <p class="st-p">이치가 통하던 시절이었다. 바다 위 상선은 한 척 또 한 척, 넉넉하고 질서 있게 드나들었다. 나는 돌 다루는 솜씨로 좋은 자리에 집을 짓고 벽 밑동을 손보며 안정된 나날을 보냈다.</p>
      <p class="st-p">변화는 한 가지 술에서 시작되었다.</p>
      <p class="st-p">어느 해, 바닷길로 한 번도 본 적 없는 독한 술이 들어왔다. 이 도시 사람들은 대대로 머리에 거의 오르지도 않는 묽은 맥주만 마셔 왔다. 그런데 이 새 술은 달랐다 — 독하고 순수하며 목을 타고 불처럼 넘어갔다. 묽은 술에 길든 이들이 첫 모금에 눈이 번쩍 뜨였다. 누군가는 신이 내린 성수라 했고, 더 많은 이들은 <span class="st-hl">이것이야말로 미래이며 앞으로 모든 것의 근간이라</span> 했다. 순식간에 모두가 그 술을 원했고, 모두가 그 술을 입에 올렸다.</p>
      <p class="st-p">가장 먼저 알아챈 것은 고지대의 한 집안이었다. 그들은 이 술을 빚는 법을 손에 넣어, 본래 두세 층이던 저택을 두 층 더 올렸다 — 아래층에선 술을 빚고 위층에선 손님을 맞아, 사방에서 큰돈을 치르고 취하러 오는 사람들을 끌어들였다. 이웃들은 탐욕스럽다 했지만, 술은 점점 더 잘 팔리고 건물은 점점 더 높아졌으며, 되팔리는 값은 험담하던 이들의 입을 모두 다물게 했다. <span class="st-em">어쨌든 도시에서 가장 좋은 자리이고, 누구나 원하는 술을 빚으니, 그것이 그만한 값어치가 없다고 누가 말하겠는가?</span> 그리하여 세 층이 다섯 층이 되고, 다섯 층이 여덟 층이 되었다. 누구의 건물에서 술을 빚고 팔 수 있느냐에 따라 그 건물의 값이 정해졌다.</p>
      <p class="st-p">진짜 광기는 갯벌에서 시작되었다.</p>
      <p class="st-p">그 술로 부자가 된 사람에게 먼 친척이 하나 있었다 — 별 재주는 없었지만 그 연줄로 술을 빚고 남은 술지게미와 찌꺼기를 조금 손에 넣었다. 그는 거저나 다름없는 값으로 "그나마 덜 형편없어 보이는" 갯벌에 흙을 메우고 말뚝을 박아 집을 짓고는 이 찌꺼기를 팔기 시작했다. 모두가 그의 웃음거리를 기다렸다. <span class="st-hlg">그런데 그 찌꺼기마저 샘날 만큼 비싼 값에 팔렸다 — 그 술의 이름이 묻어 있다는 이유로, 찌꺼기조차 서로 차지하려 들었기 때문이다.</span></p>
      <p class="st-p">그러자 모두의 마음속에서 무언가가 쩍 갈라졌다. 사람들은 미친 듯이, 한때 아무도 거들떠보지 않던 갯벌로 몰려가 다투어 사고, 메우고, 짓고, 그 술과 조금이라도 닿은 것이면 무엇이든 다투어 손에 넣으려 했다. <span class="st-hl">특히 "그나마 조금 나은 못쓸 땅" — 조금 더 그럴듯한 술지게미를 얻을 수 있는 땅 — 이 누구보다 사납게 올랐다.</span> 건물이 올라가는 속도는 한 해 몇 채에서 한 달 수십 채로, 그리고 하루가 다르게 점점 더 빨라졌다 — 한 걸음만 늦어도 다시는 따라잡지 못할까 모두가 두려워했기 때문이다.</p>
      <p class="st-p">그 몇 해는 우리 석공들의 황금기였다.</p>
      <p class="st-p">건물이 많이 올라갈수록 집을 손보는 우리 같은 장인은 더 귀해졌다. 건물마다 주인은 정해진 때에 수리비를 치르고 우리를 불러 지반을 다지고 벽 틈을 메우며 모든 것을 말끔하게 손질했다. 내 손에는 다 못 할 만큼 일이 넘쳤고 벌이도 점점 늘었다. 도시로 몰려든 다른 석공들처럼 나도 돈을 벌고는 차마 떠나지 못해 뿌리를 내렸다 — 처음엔 내가 건물을 샀고, 나중엔 대담해져 돈을 모아 새 건물을 올리고 직접 술까지 빚었다. 보라, 이것은 점점 더 빨리 도는 바퀴가 되었다: <span class="st-em">술이 잘 팔릴수록 건물이 더 올라가고; 건물이 많아질수록 우리 석공이 더 벌고; 우리가 건물마다 단단하고 번듯하게 손질하니, 사람들은 이 "튼튼하고 믿음직한" 건물을 보며 더 사고 더 짓고 더 빚으려 들고; 더 지을수록 더 많은 일과 더 많은 석공이 몰려들고…</span> 도시 전체가 흥청거렸다.</p>
      <p class="st-p">도시에 한 노인이 있었다. 그의 나이를 아무도 기억하지 못했다. 그는 돈벌이에 바쁘지 않았다 — 온종일 땅을 쓸어 보고, 벽 밑동에 새로 갈라진 가는 금을 들여다보며 미간을 점점 더 찌푸렸다. 그는 듣는 이마다 붙잡고 말했다: <span class="st-hlr">"이 땅은 버티지 못해. 우리는 너무 무겁게, 너무 빽빽이 지었어."</span></p>
      <p class="st-p">그러나 둘러보라 — 이 도시는 지금처럼 번영한 적이 없었다. 밤이면 등불이 환했고, 술 향이 그치지 않았으며, 거리는 멀리서 취하러 온 사람들로 가득했다. 무너질 기미라곤 어디에도 없었다.</p>
      <p class="st-p">그렇다, 땅은 분명 몇 번 가볍게 흔들렸다. 멀리서 누가 발을 구른 듯 희미하게. 우물물도 몇 번 흐려졌다가 이틀이면 다시 맑아졌다. 솔직히 <span class="st-em">그 몇 순간엔 내 마음에도 뭐라 할 수 없는 불안이 스쳤다.</span> 그러나 그때마다 고개를 들어 주위를 보면 — 사람들은 여전히 웃고 떠들고, 여전히 취하고, 여전히 건물을 더 높이 올리고 있었다. 그래서 나도 어깨를 으쓱하고는 <span class="st-em">모두처럼 그 불안을 삼켜 버리고, 잊었다.</span></p>
      <p class="st-p">사람들은 노인의 기우를 비웃었다: "이 도시가 이만큼 멀쩡히 서 있었는데, 무슨 수로 무너진단 말인가?"</p>
      <p class="st-p"><span class="st-em">결국 그 시절엔 방법이 없었다 — 오늘 우리가 일기예보를 보듯 모두를 납득시킬 방법이 — 그 압력이 한계에 다다랐음을 증명할.</span> "곧 무너진다"는 말을 누구도 반박할 수 없는 무언가로 바꿔 모두 앞에 내놓을 수 없었다. 노인은 말했지만 아무도 그를 믿지 않았다. 나를 포함해서.</p>
      <p class="st-p">그리고 그 나날, 우리 누구도 보지 못한 일이 하나 있었다. 그것은 땅속에서 일어나고 있었다.</p>
      <p class="st-p">이 여러 해, 우리가 땅 위에 올린 건물 하나하나, 쌓은 돌 하나하나 — 그 무게가 한 톨도 빠짐없이 발밑의 무른 흙을 짓눌렀다. 무른 흙은 점점 더 단단하게, 더 팽팽하게 짓눌렸다. <span class="st-em">거듭 짜인 젖은 스펀지처럼 — 겉을 만지면 단단하지만, 그 안의 힘은 더는 버틸 수 없는 한계를 향해 조금씩 다가가고 있었다.</span> 오래, 무겁게 짓눌릴수록 일단 풀리면 더 사납게 무너진다. 그리고 우리 석공이 날마다 한 수리는 <span class="st-em">실은 무엇도 해결한 적이 없었다. 우리는 그저 겉면의 그 틈들을 몇 번이고 덮었을 뿐이다. 밑바닥의 진실은 건드려진 적이 없었고, 다만 우리가 하루하루 뒤로 미뤘을 뿐이다.</span></p>
      <p class="st-p">무너진 그날은 다른 날과 조금도 다르지 않았다.</p>
      <p class="st-p">다만 그날 문득 몇 가지가 한꺼번에 눈에 들어왔던 것만 기억난다. 나는 보았다, <span class="st-hl">가장 멀고 가장 형편없던 그 갯벌들마저 안간힘을 다해 낮은 단층집들로 메워져 — 도시 전체에 빈 땅이라곤 더는 한 뼘도 없었음을.</span> 고지대의 가장 좋고 가장 튼튼하며 술이 가장 잘 팔리던 대형 건물을 다시 올려다보니, 그것은 <span class="st-hl">이미 99층까지 올라가 반 미터도 더 올릴 수 없을 만큼 높았다.</span> 바로 그 순간 마음에 어렴풋이 — <span class="st-hl">어찌 된 일인지 새 건물을 올리는 사람이 갑자기 줄어든 듯했다. 술을 사러 오는 사람도… 그리 많지 않은 듯했다. 내 손의 일도… 그리 많지 않은 듯했다.</span></p>
      <p class="st-p">그저 그 한 찰나였다.</p>
      <p class="st-p">수리 일이 더뎌지고, 오직 사람 손으로 겨우 떠받쳐지던 건물들을 더는 아무도 돌보지 않게 된 바로 그 찰나 — 땅속, 우리가 너무 오래 짓눌러 이미 한계에 다다른 그 땅이 마침내 <span class="st-hlr">물처럼 풀려 버렸다.</span></p>
      <p class="st-p">천둥소리도 전조도 없었다. 가장 높은 건물, 가장 화려한 술집, 가장 시끌벅적한 장터, 그리고 거리에서 여전히 잔을 들고 웃고 떠들던 모든 사람 — <span class="st-hlr">몇 번의 심장 박동 사이에 땅 전체가 바다로 가라앉았다.</span> 지상의 번영과 술과 건물값과 거래, 그리고 땅속에 그토록 오래 갇혀 있던 그 힘이 같은 순간에 함께 무너졌다.</p>
      <p class="st-p">그러고 나서 바다는 잔잔해졌다. 여기에 도시 따위는 애초에 없었던 것처럼, 그렇게 잔잔했다.</p>
      <hr class="st-hr">
      <p class="st-reveal">여기까지 와서 한 가지 말씀드려야겠다: 이것은 우화가 아니다.</p>
      <p class="st-p">이 도시는 정말로 존재했다. 이름은 <span class="st-em">토니스-헤라클레이온</span>, 고대 이집트 나일강 하구에서 가장 번영했던 항구로, 만 척의 배가 모여드는 천하의 부유한 곳이었다. 나일 삼각주의 무른 진흙 위에 세워졌다. 대략 기원전 2세기경, 그 발밑의 지반이 정말로 액상화되었다 — 도시 전체가 우뚝한 신전과 궁전과 함께 <span class="st-em">아주 짧은 시간에 통째로 7미터 가라앉아 지중해로 잠겼다.</span> 그러고는 온 인류에게서 까맣게 잊혔다. 이천 년이 넘도록 아무도 그곳이 어디인지 알지 못했다. <span class="st-em">서기 2000년에 이르러서야 고고학자들이 마침내 바다 밑에서 그것을 다시 찾아냈다.</span></p>
      <div class="st-note">정직하게 말씀드려야겠다: 그것이 실재한 번영하는 무역항이었다는 것, 정말로 무른 땅 위에 세워졌다는 것, 지반이 정말로 액상화되었다는 것, 정말로 돌연 가라앉았다는 것, 그리고 정말로 2000년에야 다시 발견되었다는 것 — 이것들은 모두 확실한 고고학적 사실이다. 모두를 불태운 그 독한 술, 돈을 그러모은 석공, 비웃음받던 노인 — 이것들은 내가 인간 본성의 결을 따라, 가장 그럴듯하게 실제로 펼쳐졌을 모습으로 당신을 위해 복원한 것이다.</div>
      <p class="st-p">이제 이 이야기에서 당신이 방금 본 모든 장면 뒤에 숨은 것을 하나하나 짚어 드리겠다. 그중 무엇 하나 내가 지어낸 것이 없다 — <span class="st-em">모든 장면이 거듭 검증된 실제의 법칙이다.</span></p>
      <ul class="reveal-list">
        <li class="ri"><span class="ri-term">재귀성 · 소로스</span><span class="ri-txt">진흙 위에서 처음 술지게미를 팔아, 실패했어야 마땅한데 오히려 벼락부자가 된 그 먼 친척, 그리고 그가 어떻게 모두를 불태웠는지 — <b>"무너졌어야 하는데 무너지지 않은" 한 가지 일이, 가장 냉정한 방관자마저 직접 판에 끌어들인다.</b></span></li>
        <li class="ri"><span class="ri-term">초지수적 가속 · 소르네트</span><span class="ri-txt">건물 올리는 속도가 하루가 다르게, 미칠 듯이 빨라졌다 — <b>버블 천장 직전, 상승은 등속이 아니라 "가속을 가속하는" 것이다.</b></span></li>
        <li class="ri"><span class="ri-term">집중도 · RBC</span><span class="ri-txt">끝내 도시에서 가장 높고 비싸며 술이 가장 잘 팔리던 건물은 몇몇 거두의 손에만 쥐여 있었다 — <b>천장의 번영은 갈수록 소수에게만 떠받쳐진다.</b></span></li>
        <li class="ri"><span class="ri-term">임계 감속 · 셰퍼</span><span class="ri-txt">무시된 그 미세한 떨림, 흐려졌다 다시 맑아진 우물물, 그 기이한 고요 — <b>시스템이 붕괴에 가까워질수록 표면은 오히려 더 잔잔해지지만, 그 밑의 "이상 신호"는 늘어난다.</b></span></li>
        <li class="ri"><span class="ri-term">안정이 곧 불안정 · 민스키</span><span class="ri-txt">오래된 평온일수록 모두가 경계를 풀고 더 과감히 베팅하게 만든다 — <b>고요는 바로 위험이 쌓이는 것이다.</b></span></li>
        <li class="ri"><span class="ri-term">침투와 발효 시간 · 소르네트</span><span class="ri-txt">땅속 그 무른 흙은 오래, 무겁게 짓눌릴수록 더 거세게 무너졌다 — <b>압력이 오래 발효될수록 붕괴는 더 참혹하다.</b></span></li>
        <li class="ri"><span class="ri-term">임계 상전이 · LPPL</span><span class="ri-txt">마지막 그 한순간, 그토록 오래 버티던 땅이 평범한 어느 날 통째로 액상화되었다 — <b>압력이 그 점에 이르면 붕괴는 한순간에 온다.</b></span></li>
      </ul>
      <p class="st-p">그리고 비웃음받던 그 노인에게 없던 것 — <span class="st-hlg">모두를 납득시킬, 일기예보 같은 그 예측 — 이 바로 오늘 우리가 당신을 위해 하려는 일이다.</span> 우리는 이 모든 것을 세 개의 숫자로 거두었다:</p>
      <div class="pmr-reveal">
        <div class="pmr-rev-card P"><div class="prl">P · 압력</div><div class="prt">지반이 지금 이 순간 액상화의 <b>그 임계점에서 얼마나 가까운지</b>.</div></div>
        <div class="pmr-rev-card M"><div class="prl">M · 강도</div><div class="prt">이 건물들이 얼마나 무겁게, 얼마나 오래 짓눌렀는지; 만약 지금 무너진다면 <b>얼마나 처참하게 가라앉을지</b>.</div></div>
        <div class="pmr-rev-card R"><div class="prl">R · 재귀성</div><div class="prt">"모든 것이 튼튼하다"는 환상을 떠받치는 유입이 <b>아직 왕성한지</b>. 유입이 끊기는 순간, 그토록 오래 가려졌던 취약성이 한순간에 모든 것을 삼킨다.</div></div>
      </div>
      <p class="st-p">그 노인이 그때 이 세 숫자를 손에 쥐고 있었다면 결말은 달라졌을까? 그리고 오늘의 시장에서 이 세 숫자는 과연 얼마이며, 또 어떻게 계산되는가?</p>
      <p class="st-p" style="margin-bottom:0"><span class="st-em">이제, 비웃음받던 예언자에서, 모든 공식과 데이터를 당신 앞에 펼쳐 놓는 사람으로 바뀌는 것을 허락해 주시기 바란다.</span></p>
      <div class="story-cta"><a href="methodology.html">방법론으로 들어가기: 공식, 매개변수 &amp; 데이터 출처 →</a></div>`
});

/* ============================ 留言页 message.html ============================ */
Object.assign(window.I18N.en, {
  msg_sub:'This is an independent, non-profit research project. Every piece of feedback, every challenge, every dataset you send makes this method more reliable.',
  msg1_h:'📋 Leave a message / Submit data',
  msg1_p1:'Whether you want to point out a value that needs updating, question a weight, share a better data source, or simply share your view of the market — you\'re welcome to tell me through the form below. No login needed, anonymous is fine, and you can attach files.',
  msg1_p2:'There is always a <b style="color:var(--green)">"Contact"</b> floating button on the left edge of the page; click to open it. Or use the button below:',
  msg1_btn:'Open the feedback form →',
  msg2_h:'✉️ Or email me directly', msg2_p:'If you prefer email, write to:',
  msg3_h:'🐉 About the author',
  msg3_p1:'I\'m Bub (泡泡龙). This "Bubble Radar" distills a bit of what I\'ve learned from years of watching U.S. equities — especially the tech and semiconductor cycles — into three numbers you can track every day, woven from several academic theories.',
  msg3_p2:'I built it because of that mocked old man in the story — the market never lacks for warnings; what it lacks is a method that is convincing, quantifiable, and trackable over time. It isn\'t perfect, but it\'s transparent. I hope it helps you.',
  foot_dis2:'This site is an independent research and educational project. All data comes from public sources and is computed transparently, for reference and discussion only, and <b>does not constitute investment advice</b>. Investing carries risk — make your own decisions and bear your own gains and losses.'
});
Object.assign(window.I18N.ko, {
  msg_sub:'이것은 독립적인 비영리 연구 프로젝트입니다. 당신이 보내 주는 모든 피드백, 모든 의문, 모든 데이터가 이 방법을 더 믿을 만하게 만듭니다.',
  msg1_h:'📋 메시지 남기기 / 데이터 제출',
  msg1_p1:'어떤 값이 갱신되어야 한다고 짚어 주시든, 어떤 가중치에 의문을 제기하시든, 더 나은 데이터 출처를 공유하시든, 그저 시장에 대한 생각을 들려주시든 — 아래 설문으로 알려 주시면 환영합니다. 로그인이 필요 없고, 익명도 가능하며, 첨부도 올리실 수 있습니다.',
  msg1_p2:'페이지 왼쪽 가장자리에는 항상 <b style="color:var(--green)">"문의하기"</b> 플로팅 버튼이 있어 클릭하면 열립니다. 또는 아래 버튼을 누르세요:',
  msg1_btn:'설문 열기 →',
  msg2_h:'✉️ 또는 직접 이메일로', msg2_p:'이메일이 더 편하시면 이리로 보내 주세요:',
  msg3_h:'🐉 저자 소개',
  msg3_p1:'저는 Bub(泡泡龙)입니다. 이 "버블 레이더"는 여러 해 미국 증시, 특히 기술·반도체 사이클을 지켜본 작은 깨달음을, 여러 학술 이론을 녹여 매일 추적할 수 있는 세 개의 숫자로 만든 것입니다.',
  msg3_p2:'제가 이것을 만든 까닭은 이야기 속 비웃음받던 그 노인 때문입니다 — 시장에 경고가 부족했던 적은 없습니다. 부족한 것은 납득시킬 수 있고 정량화할 수 있으며 지속적으로 추적할 수 있는 방법입니다. 완벽하지는 않지만 투명합니다. 도움이 되기를 바랍니다.',
  foot_dis2:'본 사이트는 독립적인 연구·교육 프로젝트입니다. 모든 데이터는 공개 출처에서 가져와 투명하게 계산되며, 참고와 토론을 위한 것일 뿐 <b>어떠한 투자 조언도 구성하지 않습니다</b>. 투자에는 위험이 따르며, 판단과 손익은 스스로 책임지십시오.'
});

/* ============================ 方法论 methodology.html · EN ============================ */
Object.assign(window.I18N.en, {
  m_title:'Methodology: formulas, parameters & data sources',
  m_sub:`This page is what we owe that "mocked prophet" — laying out, with nothing held back, all the math behind the three numbers P, M, R, the value of every parameter, and the source of every dataset. It is rigorous, perhaps a little dry, but it is the entire basis for whether this method can convince you.`,
  m_toc:`<div class="toc-t">Contents</div>
    <a href="#concept">1 · What the three numbers actually measure</a>
    <a href="#time">2 · The core idea: everything carries time</a>
    <a href="#pformula">3 · The full formula for P (Pressure)</a>
    <a href="#mformula">4 · The full formula for M (Magnitude)</a>
    <a href="#rformula">5 · The full formula for R (Reflexivity)</a>
    <a href="#weights">6 · Indicators, weights & data sources</a>
    <a href="#correction">7 · Two key corrections: inflation & monopoly</a>
    <a href="#validation">8 · Backtests: four ways to die + the four-color light</a>
    <a href="#actionlayer">9 · Action layer · flag / credit / hit rate</a>
    <a href="#limits">10 · Honest limits</a>`,
  ms1:`<h2><span class="mn">01</span>What the three numbers actually measure</h2>
    <p>Picture the market as the city built on soft mud in the story. The three numbers answer three questions:</p>
    <h3>P · Pressure — how tight the balloon is now</h3>
    <p>Combining all bubble signals, it measures how close the market is to its "critical point." Each indicator is ranked only against <b>its own prior history</b> (a point-in-time exogenous percentile), with no "baseline year" anywhere — today and 2000 are each computed by exactly the same method. The energy level E is a 0–1 percentile, but when pressure is both extreme and accelerating, kinetic energy can push P past 1.0 (it reached 1.029 at the June peak) — <b>today P=0.963, still the highest of all five and above 2000 (0.879)</b>, yet neither is the other's baseline.</p>
    <h3>M · Magnitude — how hard it would burst</h3>
    <p>It measures "how much potential damage if it collapsed right now." It is the "fill-and-release" time-integral of the past 60 months of pressure P — <b>the heavier the load and the longer it's held, the worse the collapse</b>. Likewise point-in-time, with no baseline. Note: this is <b>potential</b> severity (how much dynamite is packed in); the actual drawdown still depends on "how it's detonated."</p>
    <h3>R · Reflexivity — whether anyone is still blowing</h3>
    <p>It measures "how strongly the inflow that sustains the boom is still running." As in the story: the city's solidity was an illusion propped up by an endless stream of money and people endlessly repairing it. <b>R staying high = the illusion persists, the bubble can hold; R turning down = the inflow dries up, the hidden fragility is exposed.</b> But after testing 155 years of history we found: calling tops on R-trend alone (or any price velocity) turning negative is right only ~11% of the time — so <b>R-trend is demoted to an auxiliary tilt, no longer an exit trigger</b>, and real rupture confirmation is handed to the four-color light below.</p>`,
  ms2:`<h2><span class="mn">02</span>The core idea: everything carries a time dimension</h2>
    <p>This is the most fundamental difference between this model and an ordinary "how expensive is it" gauge. We hold that a bubble is a <b>dynamical process</b>, with time as the core parameter. For every indicator, we look not only at "where it is right now" but at its <b>four features</b> over a span of time:</p>
    <ul>
      <li><b>Position</b>: how extreme each indicator's current value is in history + how long it has stayed elevated → composing the <b>energy level E</b> (current percentile 60% + past-6-month persistence 40%).</li>
      <li><b>Velocity & acceleration</b>: how E moved over the past 12 / 24 months, and whether it is "accelerating its acceleration" → amplified into <b>pressure P</b> (Pillar 7: kinetic energy ∝ momentum²).</li>
      <li><b>Accumulation</b>: the "fill-and-release" time-integral of the past 60 months of energy (resetting at zero) → <b>severity M</b>. The longer and heavier the load, the louder the burst.</li>
    </ul>
    <p>All three take <b>time</b> as the core dimension, and are point-in-time with no look-ahead throughout. The full formulas follow.</p>`,
  ms3:`<h2><span class="mn">03</span>The full formula for P (Pressure)</h2>
    <p>Step one: turn each indicator into a <b>point-in-time exogenous percentile</b> — ranked only against its <b>own prior</b> history, never looking ahead:</p>
    <div class="formula"><span class="cm"># danger percentile of indicator i at t (uses only data ≤ t)</span>
pᵢ(t) = #{ s &lt; t : xᵢ(s) &lt; xᵢ(t) } / #{ s &lt; t }    <span class="cm">reverse class takes 1−p</span>
        <span class="cm">cold start: fewer than 12 obs before t → drop this indicator</span></div>
    <p>Step two: compose the energy level E — current percentile counts 60%, the past 6 months' elevated persistence 40%, summed by weight:</p>
    <div class="formula"><span class="cm"># energy level E (multi-dimensional bubble state, 0–1)</span>
cᵢ(t) = 0.6·pᵢ(t) + 0.4·<span class="c">mean</span>{ pᵢ(t−m mo) : m=0..6 }
E(t)  = <span class="c">Σ</span> wᵢ·cᵢ(t) / <span class="c">Σ</span> wᵢ    <span class="cm">present indicators only</span></div>
    <p>Step three: dynamic pressure P = energy level × time-kinetic amplification (Pillar 7):</p>
    <div class="formula"><span class="cm"># velocity, acceleration (time is the core dimension)</span>
v = E(t) − E(t−12mo)
a = [E(t)−E(t−12)] − [E(t−12)−E(t−24)]
P(t) = E(t)·[ 1 + <span class="v">0.4</span>·tanh(v) + <span class="v">0.4</span>·max(0,a) ]
       <span class="cm">→ E∈[0,1]; P can exceed 1 when "extreme + accelerating" (1.029 at the June peak; today = 0.963)</span></div>
    <p><b>Key: no look-ahead throughout.</b> Every percentile uses only data ≤ t — historical/future data is used only for hindsight and calibration. We ran a hard check: delete all data after a given historical date, and that day's P/M/R and four-color light are <b>bit-for-bit identical</b>. (Early on we used a "full-sample percentile" for cross-period comparability, but that lets the historical baseline peek at the future, and has been overturned.)</p>`,
  ms4:`<h2><span class="mn">04</span>The full formula for M (Magnitude)</h2>
    <p>M depicts "potential collapse severity" — its theoretical root is Sornette's percolation theory: collapse severity = bubble height × fermentation time. We implement it as a "high-level fermentation integral" of past P:</p>
    <div class="formula"><span class="cm"># accumulated energy = "fill-and-release" integral of the past 60 months of P (a river, not a reservoir)</span>
energy = 0
for each of the past 60 months:
    energy += ΔP            <span class="cm">P rises → fill; P falls → release</span>
    energy = max(0, energy)    <span class="cm">floor at zero: reset on crossing zero</span>
M(t) = final value of energy   <span class="cm">no look-ahead, no 2000 baseline</span></div>
    <p>Intuition: the longer P stays above 0.5 (the fuller the fermentation) and the higher it once spiked (the larger the peak), the larger M. This explains why in 2007, even though equity P wasn't high, M wasn't low — because it lingered at elevated levels for a long time, the "dynamite" slowly accumulated up high.</p>`,
  ms5:`<h2><span class="mn">05</span>The full formula for R (Reflexivity)</h2>
    <p>R measures "the activity of the self-reinforcing loop" — the "mason repair loop" in the story. It is composed of three observable parts:</p>
    <div class="formula"><span class="cm"># reflexivity activity = weighted sum of three parts (each turned into a point-in-time percentile)</span>
activity A = <span class="v">0.5</span>·new money (dual-source) + <span class="v">0.25</span>·momentum persistence + <span class="v">0.25</span>·breakout survival

  <span class="cm">new money (dual-source) = 6-month growth of margin debt and the Fed Z.1 4-quarter-avg net inflow of household equities, each turned to a percentile then averaged</span>
  <span class="cm">momentum persistence = mean of (current price / past-6-month high) across the three major indices</span>
  <span class="cm">breakout survival = fraction of the past 6 months that price held above the 200-day average</span>

R(t) = A·[ 1 + <span class="v">0.4</span>·tanh(v_R) + <span class="v">0.4</span>·max(0,a_R) ]   <span class="cm">v_R/a_R use a 6-month window</span>
R-trend(t) = R(t) − R(t − 6mo)    <span class="cm">demoted to auxiliary tilt; its sign is not a trigger</span></div>
    <p>Reflexivity is the loop that "first self-reinforces, then self-defeats." But after testing 155 years of history we found something important: <b>calling tops on R-trend alone (or any price velocity) turning negative is right only ~11% of the time</b>, and can't tell a great bubble top from an ordinary pullback. So R-trend is <b>demoted to auxiliary, no longer an exit trigger</b>.</p>
    <h3>The real exit trigger: the four-color confirmation light</h3>
    <p>Reliable "rupture confirmation" comes from a combination of two <b>states</b> (not rates of change) — also the conclusion of the "critical-slowing correction":</p>
    <div class="formula"><span class="cm"># four-color rupture-confirmation light</span>
breadth = number of S&amp;P 500 / Dow / Nasdaq with close &gt; 200-day average
break = breadth ≤ 1 and <span class="c">for 2 straight weeks</span>
vol pct = point-in-time weekly rank of the 3 indices' 126-day realized volatility

  breadth intact: vol &lt; 90th → <span class="c">🟢 green</span> hold ; ≥90 → 🟡 yellow volatility shock
  breadth broken: vol &lt; 70 → 🟡 yellow early break ; 70–90 → 🟠 orange rupture+stress ; ≥90 → <span style="color:var(--red-soft)">🔴 red</span> violent crash</div>
    <p>On the day of the top it is always green or yellow (the calm before the storm), and only escalates notch by notch during the crash — across the four historical tops, it typically leaves green <b>2–6 weeks after the top</b>. How to read it: <b>P/M/R tell you how tight the balloon is; the four-color light tells you when it actually starts leaking.</b></p>`,
  ms6:`<h2><span class="mn">06</span>Indicator list, weights, and data sources</h2>
    <p>P is built from the following 11 indicators by relative weight, normalized over the indicators present at each point in time. The weighting reflects how reliably each signal has foreshadowed historical tops — price momentum and market breadth highest, mania signals (like IPOs) lowest. All data is from public sources.</p>
    <div style="overflow-x:auto">
      <table class="param-table">
        <thead><tr><th>Indicator</th><th>Weight</th><th>Danger direction</th><th>Data source</th></tr></thead>
        <tbody>
          <tr><td><b>Semiconductors vs 200-day avg</b></td><td class="mono">14%</td><td>higher = more dangerous</td><td>Philadelphia Semiconductor Index (SOX)</td></tr>
          <tr><td><b>Nasdaq vs 200-day avg</b></td><td class="mono">12%</td><td>higher = more dangerous</td><td>Nasdaq Composite</td></tr>
          <tr><td><b>Market breadth · SPY÷RSP</b></td><td class="mono">11%</td><td>narrower = more dangerous</td><td>SPY (cap-weighted) ÷ RSP (equal-weight) relative strength</td></tr>
          <tr><td><b>CAPE cyclical valuation</b></td><td class="mono">10%</td><td>higher = more dangerous</td><td>Shiller CAPE (Yale)</td></tr>
          <tr><td><b>Concentration · top-10 weight</b></td><td class="mono">8%</td><td>higher = more dangerous</td><td>S&amp;P 500 top-10 weight (RBC)</td></tr>
          <tr><td><b>Margin leverage / GDP</b></td><td class="mono">8%</td><td>higher = more dangerous</td><td>FINRA margin debt ÷ nominal GDP</td></tr>
          <tr><td><b>VIX complacency build-up</b></td><td class="mono">7%</td><td>lower & longer = more dangerous</td><td>CBOE VIX</td></tr>
          <tr><td><b>AAII retail sentiment</b></td><td class="mono">7%</td><td>greedier = more dangerous</td><td>AAII bull-bear survey</td></tr>
          <tr><td><b>Concentration bubble premium</b></td><td class="mono">5%</td><td>higher = more dangerous</td><td>top-10 weight − earnings share</td></tr>
          <tr><td><b>High-yield credit spread</b></td><td class="mono">5%</td><td>lower = more dangerous</td><td>ICE BofA HY OAS</td></tr>
          <tr><td><b>IPO mania</b></td><td class="mono">3%</td><td>higher = more dangerous</td><td>SEC annual IPO count</td></tr>
        </tbody>
      </table>
    </div>
    <p style="margin-top:14px"><b>Watch-list indicators (not weighted)</b>: 2-year / 10-year Treasury yields, the dollar index, VVIX, the absolute level of semiconductors. These have no stable, monotonic relationship with bubble tops — for example interest rates: the 2000 top had high rates, the 2022 top zero, opposite directions — so they serve only as background context.</p>`,
  ms7:`<h2><span class="mn">07</span>Two key corrections: inflation and monopoly</h2>
    <h3>Correction 1: inflation adjustment (use ratios to strip out nominal inflation)</h3>
    <p>No money-denominated indicator can be read at nominal value — otherwise today's figures look naturally inflated by inflation and economic growth. Take margin debt: today's nominal $1.42 trillion is 4.7× that of 2000, which sounds frightening, but <b>using the "margin / GDP" ratio (which automatically strips out inflation + growth), today is 4.64% versus 2.93% in 2000 — just 1.59×</b> — and that is the true leverage intensity. We apply this to all money-denominated indicators. (IPOs use "count," not dollars raised, so they're unaffected by inflation.)</p>
    <h3>Correction 2: monopoly adjustment (separate a real moat from a valuation bubble)</h3>
    <p>Today's market concentration is 40%, far above 2000's 27%. But today's giants really do earn more and have deeper moats than in 2000 — so you can't simply use "high concentration" to scare people. We added an indicator, <b>"concentration bubble premium" = top-10 weight% − top-10 earnings share%</b>, specifically to separate "reasonable concentration" from a "dangerous bubble":</p>
    <ul>
      <li>2015: weight 19%, earnings share 19% → premium <b>0%</b> (perfectly healthy, market cap matches fundamentals)</li>
      <li>2000: weight 27%, earnings share 22% → premium <b>5%</b> (some bubble)</li>
      <li>Today: weight 40%, earnings share 32% → premium <b>8.7%</b> (the largest disconnect on record)</li>
    </ul>
    <p>Meaning: of today's 40% concentration, 32% is backed by real earnings (a reasonable moat), and only 8.7% is pure valuation bubble — far more scientific than judging by 40% alone.</p>`,
  ms8:`<h2><span class="mn">08</span>Backtests: four ways to die + the four-color light</h2>
    <p>We put the model back at four moments in the past. If it merely "alarms when prices fall," it's worthless. The real test is whether it can tell "a bubble bursting on its own" from "being knocked down by an outside force" — and the results confirm exactly the validity of each theory.</p>
    <div class="case-card">
      <div class="cc-h"><span class="cc-yr">March 2000</span><span class="cc-lb">Dot-com top · baseline</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--amber)">0.879</b></span><span>M <b style="color:var(--green)">0.644</b></span><span>R <b style="color:var(--green)">0.367</b></span><span>R-trend <b style="color:var(--amber)">aux −0.05</b></span><span>Gate <b style="color:var(--amber)">🟡 Yellow</b></span></div>
      <div class="cc-txt"><b>This is our reference point.</b> A pure, textbook equity valuation bubble: semiconductors 111% above their average, CAPE 43, retail sentiment extremely greedy. P had reached critical, and R-trend had already turned down — the engine running flat out while beginning to cool, the very picture of a spent force. Outcome: Nasdaq crashed −78%. <b>It defines what "a bubble bursting on its own" looks like.</b></div>
    </div>
    <div class="case-card">
      <div class="cc-h"><span class="cc-yr">October 2007</span><span class="cc-lb">Before the credit crisis</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--green)">0.746</b></span><span>M <b style="color:var(--green)">0.516</b></span><span>R <b style="color:var(--green)">0.541</b></span><span>R-trend <b style="color:var(--amber)">aux −0.18</b></span><span>Gate <b style="color:var(--green)">🟢 Green</b></span></div>
      <div class="cc-txt">P was only 0.75, clearly below 2000. <b>Why? Because the leverage of 2008 was piled into real estate, not equities</b> — equity margin/GDP was then just 2.88%, even below 2000. This is exactly Minsky's prediction: a crisis need not come from the stock market itself. The model faithfully reflects "this is not an equity valuation bubble"; it lingered at elevated levels for a long time (so M isn't too low), and was finally pushed downhill by the <b>outside force</b> of the credit system's collapse. Outcome: S&amp;P −57%. <b>The model successfully separated "credit-crisis spillover" from "an equity bubble bursting on its own."</b></div>
    </div>
    <div class="case-card">
      <div class="cc-h"><span class="cc-yr">February 2020</span><span class="cc-lb">Before COVID</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--amber)">0.943</b></span><span>M <b style="color:var(--green)">0.535</b></span><span>R <b style="color:var(--green)">0.699</b></span><span>R-trend <b style="color:var(--green)">aux +0.22</b></span><span>Gate <b style="color:var(--green)">🟢 Green</b></span></div>
      <div class="cc-txt">Pre-COVID, growth-stock valuations were actually already high (P=0.94), but R was only 0.70 with a stalling trend — the engine wasn't strong. The result was a plunge of −34% triggered by a <b>pure external black swan</b> (the pandemic), followed by a V-shaped rebound. The model shows this wasn't a "self-reinforced-to-the-extreme" bubble top, but a process interrupted by an external shock. <b>This explains why it fell fast and recovered fast.</b></div>
    </div>
    <div class="case-card">
      <div class="cc-h"><span class="cc-yr">January 2022</span><span class="cc-lb">Rate-hike cycle top</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--amber)">0.786</b></span><span>M <b style="color:var(--green)">0.297</b></span><span>R <b style="color:var(--green)">0.688</b></span><span>R-trend <b style="color:var(--amber)">aux −0.09</b></span><span>Gate <b style="color:var(--green)">🟢 Green</b></span></div>
      <div class="cc-txt">P=0.786 had reached an elevated level, but <b>the key is that R-trend turned negative (aux −0.09) and the four-color light never left green</b> — rate-hike expectations cooled the inflow of new money, and the inflow sustaining the boom weakened. This is a "high-pressure + decelerating-engine" top. Outcome: S&amp;P −36%. <b>Note: this round, the four-color light never went red (at most orange) — monetary policy tightened in time and pricked the bubble, letting it deflate slowly rather than explode. This shows precisely: P/M/R measure how high the pressure is; the four-color light measures the severity of the rupture — the two have different jobs.</b></div>
    </div>
    <div class="case-card" style="border-color:var(--grid);background:linear-gradient(150deg,var(--panel2),var(--bg2))">
      <div class="cc-h"><span class="cc-yr">Today</span><span class="cc-lb">AI cycle</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--red-soft)">0.963</b></span><span>M <b style="color:var(--green)">0.567</b></span><span>R <b style="color:var(--amber)">0.578</b></span><span>R-trend <b style="color:var(--amber)">aux −0.31</b></span><span>Gate <b style="color:var(--green)">🟢 Green</b></span></div>
      <div class="cc-txt">P=0.963, structural pressure <b>exceeds</b> all four historical tops — today's valuation, concentration, leverage, and credit spread mostly sit at point-in-time historic extremes; M=0.567 is likewise the highest of the five moments, the accumulated "weight" up high unprecedented. <b>But the four-color confirmation light is still green</b> (all three major indices above the 200-day line, volatility not high), the rupture has not begun. This is "the tightest balloon in history that still hasn't leaked." <b>Conclusion: stay in, but this is the tightest balloon in your entire validation set. Watch breadth — the moment indices stay below the 200-day line and the light leaves green, that's the historical "2–6 weeks after the top" earliest exit window.</b></div>
    </div>
    <p style="margin-top:18px">Four histories, four different "ways to die," and the model gave readings that matched the facts in every case — that is the confidence on which we make it public. But remember the honest limits in the next section.</p>`,
  ms9:`<h2><span class="mn">10</span>Honest limits</h2>
    <ul>
      <li><b>No look-ahead, empirically proven.</b> Computing any value at any moment uses only the data up to that instant and before. Delete all data after a given historical date, and that day's reading is bit-for-bit identical — historical data is used only for hindsight calibration, never to peek at the future.</li>
      <li><b>P can exceed 1.</b> P's floor (the energy level) is a 0–1 percentile, but when pressure is both extreme and accelerating, kinetic amplification pushes P past 1.0 (1.029 at the June peak; today 0.963). That's a feature.</li>
      <li><b>Price momentum is no market-timing magic.</b> Across 155 years, calling tops on velocity turning negative alone is right ~11% of the time, and can't tell a great top from an ordinary one. So the discriminating power rests on the multi-dimensional energy state, and R-trend is demoted to auxiliary; the real exit trigger is the four-color light.</li>
      <li><b>Tiny sample + cold start.</b> Bubble-grade tops are inherently rare; in the early years (2000/2007) some short-history indicators are honestly dropped because the data hadn't accumulated. 2026 is a genuine out-of-sample test.</li>
      <li><b>R relies most on judgment; the breadth measure involves a trade-off.</b> Reflexivity is approximated with proxy variables; advance-decline breadth data is missing after 2020, so we now use <b>SPY/RSP relative strength</b> (cap-weighted ÷ equal-weight, continuous to today, fully objective), at the cost of lacking this pillar for 2000 since RSP did not yet exist.</li>
      <li><b>Fully transparent, criticism welcome.</b> Every weight, parameter, formula, and data source is on this page. <a href="message.html" style="color:var(--green);border-bottom:1px solid var(--grid)">"Contact"</a> tells us what needs updating.</li>
    </ul>
    <div class="story-cta"><a href="index.html">← Back to home, see today's live reading</a></div>`
});

/* ============================ 方法论 methodology.html · KO ============================ */
Object.assign(window.I18N.ko, {
  m_title:'방법론: 공식, 매개변수 & 데이터 출처',
  m_sub:`이 페이지는 그 "비웃음받던 예언자"에게 갚는 것입니다 — 세 숫자 P, M, R 뒤의 모든 수학, 모든 매개변수의 값, 모든 데이터의 출처를 아낌없이 펼쳐 놓습니다. 엄밀하고 다소 건조하지만, 이 방법이 당신을 납득시킬 수 있는지의 모든 근거입니다.`,
  m_toc:`<div class="toc-t">목차</div>
    <a href="#concept">1 · 세 숫자는 도대체 무엇을 재는가</a>
    <a href="#time">2 · 핵심 사상: 모든 것은 시간 차원을 갖는다</a>
    <a href="#pformula">3 · P(압력)의 완전한 공식</a>
    <a href="#mformula">4 · M(강도)의 완전한 공식</a>
    <a href="#rformula">5 · R(재귀성)의 완전한 공식</a>
    <a href="#weights">6 · 지표 목록, 가중치와 데이터 출처</a>
    <a href="#correction">7 · 두 가지 핵심 보정: 인플레이션과 독점</a>
    <a href="#validation">8 · 역사 검증: 네 가지 죽는 법 + 4색 등</a>
    <a href="#actionlayer">9 · 액션 레이어 · 깃발/신용/적중률</a>
    <a href="#limits">10 · 정직한 한계</a>`,
  ms1:`<h2><span class="mn">01</span>세 숫자는 도대체 무엇을 재는가</h2>
    <p>시장을 이야기 속 무른 진흙 위에 세워진 도시라고 그려 보자. 세 숫자는 각각 세 가지 질문에 답한다:</p>
    <h3>P · 압력 — 풍선이 지금 얼마나 팽팽한가</h3>
    <p>모든 버블 신호를 종합해 시장이 "임계점"에서 얼마나 가까운지를 잰다. 각 지표는 오직 <b>자기 자신의 이전 역사</b>하고만 순위를 매긴다(시점 기준 외생 백분위). "어느 해를 기준으로 삼는" 설정은 어디에도 없다 — 오늘과 2000년은 완전히 같은 방법으로 각각 계산된다. 에너지 위치 E는 0–1 백분위지만, 압력이 극단적이면서 가속할 때 운동에너지가 P를 1.0 위로 밀어 올릴 수 있다(6월 고점에 1.029) — <b>오늘 P=0.963, 여전히 다섯 시점 중 최고이며 2000년(0.879)을 넘어선다</b>, 둘 중 어느 것도 다른 것의 기준이 아니다.</p>
    <h3>M · 강도 — 터지면 얼마나 거센가</h3>
    <p>"지금 무너진다면 잠재적 파괴력이 얼마나 큰가"를 잰다. 과거 60개월 압력 P의 "채우고 방출하는" 시간 적분이다 — <b>무겁게, 오래 짓눌릴수록 더 처참하게 무너진다</b>. 마찬가지로 시점 기준이며 기준값이 없다. 주의: 이것은 <b>잠재</b> 강도(얼마나 많은 폭약이 채워졌는지)이며, 실제 낙폭은 "어떻게 점화되는지"에 달려 있다.</p>
    <h3>R · 재귀성 — 아직도 부는 사람이 있는가</h3>
    <p>"번영을 떠받치는 유입이 아직 왕성한지"를 잰다. 이야기처럼: 도시의 견고함은 끊임없는 돈과 사람이 쉴 새 없이 수리하고 떠받쳐 만든 환상이었다. <b>R이 고점을 유지 = 환상이 이어지고 버블이 버틴다; R이 꺾여 내려감 = 유입이 마르고 가려졌던 취약성이 드러난다.</b> 그러나 155년 역사를 검증한 결과: R 추세(또는 어떤 가격 속도)만으로 천장을 잡는 정확도는 약 11%에 불과했다 — 그래서 <b>R 추세는 보조 틸트로 강등되어 더는 이탈 방아쇠가 아니며</b>, 진짜 붕괴 확인은 아래의 4색 등에 맡긴다.</p>`,
  ms2:`<h2><span class="mn">02</span>핵심 사상: 모든 것은 시간 차원을 갖는다</h2>
    <p>이것이 이 모델 전체와 평범한 "비싼가 싼가" 지표의 가장 근본적인 차이다. 우리는 버블이 <b>동역학적 과정</b>이며 시간이 핵심 매개변수라고 본다. 어떤 지표든 "지금 어디 있는지"만 보지 않고, 일정 기간에 걸친 <b>네 가지 특징</b>을 본다:</p>
    <ul>
      <li><b>위치</b>: 각 지표의 현재 값이 역사에서 얼마나 극단적인지 + 고점에 얼마나 오래 머물렀는지 → <b>에너지 위치 E</b>로 합성(현재 백분위 60% + 과거 6개월 지속 40%).</li>
      <li><b>속도와 가속도</b>: E가 과거 12 / 24개월 어떻게 움직였는지, "가속을 가속하는지" → <b>압력 P</b>로 증폭(기둥 7: 운동에너지 ∝ 운동량²).</li>
      <li><b>누적</b>: 과거 60개월 에너지의 "채우고 방출하는" 시간 적분(0에서 리셋) → <b>강도 M</b>. 오래, 무겁게 짓눌릴수록 더 크게 터진다.</li>
    </ul>
    <p>셋 모두 <b>시간</b>을 핵심 차원으로 삼으며, 처음부터 끝까지 시점 기준·미래 엿보기 없음이다. 아래는 전체 공식이다.</p>`,
  ms3:`<h2><span class="mn">03</span>P(압력)의 완전한 공식</h2>
    <p>1단계: 각 지표를 <b>시점 기준 외생 백분위</b>로 바꾼다 — 오직 <b>자기 자신의 이전</b> 역사하고만 비교하며 절대 미래를 엿보지 않는다:</p>
    <div class="formula"><span class="cm"># t 시점 지표 i의 위험 백분위 (오직 ≤ t 데이터만 사용)</span>
pᵢ(t) = #{ s &lt; t : xᵢ(s) &lt; xᵢ(t) } / #{ s &lt; t }    <span class="cm">reverse 류는 1−p</span>
        <span class="cm">콜드 스타트: t 이전 관측 &lt; 12개 → 이 지표 폐기</span></div>
    <p>2단계: 에너지 위치 E 합성 — 현재 백분위 60%, 과거 6개월 고점 지속 40%, 가중치로 합산:</p>
    <div class="formula"><span class="cm"># 에너지 위치 E (다차원 버블 상태, 0–1)</span>
cᵢ(t) = 0.6·pᵢ(t) + 0.4·<span class="c">mean</span>{ pᵢ(t−m개월) : m=0..6 }
E(t)  = <span class="c">Σ</span> wᵢ·cᵢ(t) / <span class="c">Σ</span> wᵢ    <span class="cm">참여 지표만</span></div>
    <p>3단계: 동적 압력 P = 에너지 위치 × 시간 운동에너지 증폭(기둥 7):</p>
    <div class="formula"><span class="cm"># 속도, 가속도 (시간이 핵심 차원)</span>
v = E(t) − E(t−12개월)
a = [E(t)−E(t−12)] − [E(t−12)−E(t−24)]
P(t) = E(t)·[ 1 + <span class="v">0.4</span>·tanh(v) + <span class="v">0.4</span>·max(0,a) ]
       <span class="cm">→ E∈[0,1]; "극단+가속"일 때 P는 1을 넘을 수 있음 (6월 고점 1.029; 오늘 = 0.963)</span></div>
    <p><b>핵심: 처음부터 끝까지 미래 엿보기 없음.</b> 모든 백분위는 오직 ≤ t 데이터로만 계산된다 — 역사/미래 데이터는 사후 회고와 보정에만 쓰인다. 우리는 강한 검증을 했다: 특정 역사 일자 이후의 모든 데이터를 지워도 그날의 P/M/R과 4색 등은 <b>비트 단위로 동일</b>하다. (초기엔 기간 간 비교를 위해 "전체 표본 백분위"를 썼지만, 그것은 역사 기준이 미래를 엿보게 하는 것이라 폐기되었다.)</p>`,
  ms4:`<h2><span class="mn">04</span>M(강도)의 완전한 공식</h2>
    <p>M은 "잠재적 붕괴 강도"를 그린다 — 이론적 뿌리는 소르네트의 침투 이론이다: 붕괴 강도 = 버블 높이 × 발효 시간. 우리는 과거 P의 "고점 발효 적분"으로 구현한다:</p>
    <div class="formula"><span class="cm"># 누적 에너지 = 과거 60개월 P의 "채우고 방출하는" 적분 (저수지가 아니라 강물)</span>
energy = 0
과거 60개월을 한 달씩 순회:
    energy += ΔP            <span class="cm">P 상승 → 채움; P 하락 → 방출</span>
    energy = max(0, energy)    <span class="cm">바닥 0: 0을 지나면 리셋</span>
M(t) = energy 최종값         <span class="cm">미래 엿보기 없음, 2000 기준 없음</span></div>
    <p>직관: P가 0.5 위에 오래 머물수록(발효가 충분할수록), 한때 더 높이 치솟았을수록(정점이 클수록) M이 커진다. 이것이 2007년 증시 P는 높지 않았는데도 M은 낮지 않았던 이유를 설명한다 — 고점에서 오래 배회한 탓에 "폭약"이 고점에서 서서히 쌓였기 때문이다.</p>`,
  ms5:`<h2><span class="mn">05</span>R(재귀성)의 완전한 공식</h2>
    <p>R은 "자기강화 순환의 활성"을 잰다 — 이야기 속 그 "석공 수리 순환"이다. 관측 가능한 세 성분으로 합성된다:</p>
    <div class="formula"><span class="cm"># 재귀성 활성 = 세 성분 가중합 (각각 시점 기준 백분위로 변환)</span>
활성 A = <span class="v">0.5</span>·신규 자금(이중 출처) + <span class="v">0.25</span>·동력 지속 + <span class="v">0.25</span>·돌파 생존

  <span class="cm">신규 자금(이중 출처) = 신용잔고 6개월 증가율과 연준 Z.1 가계 보유 지분 4분기 평균 순유입, 각각 백분위로 변환 후 평균</span>
  <span class="cm">동력 지속 = 3대 지수 현재가/과거 6개월 최고가의 평균</span>
  <span class="cm">돌파 생존 = 과거 6개월 가격이 200일 이동평균선 위를 지킨 시간 비율</span>

R(t) = A·[ 1 + <span class="v">0.4</span>·tanh(v_R) + <span class="v">0.4</span>·max(0,a_R) ]   <span class="cm">v_R/a_R은 6개월 창</span>
R추세(t) = R(t) − R(t − 6개월)    <span class="cm">보조 틸트로 강등, 부호는 방아쇠가 아님</span></div>
    <p>재귀성은 "처음엔 자기강화, 끝내 자기파멸"하는 순환이다. 그러나 155년 역사를 검증한 뒤 중요한 사실을 발견했다: <b>R 추세(또는 어떤 가격 속도)만으로 천장을 잡는 정확도는 약 11%에 불과</b>하며, 대형 버블 천장과 평범한 조정을 구별하지 못한다. 그래서 R 추세는 <b>보조로 강등되어 더는 이탈 방아쇠가 아니다</b>.</p>
    <h3>진짜 이탈 방아쇠: 4색 확인등</h3>
    <p>믿을 만한 "붕괴 확인"은 두 <b>상태</b>(변화율이 아니라)의 조합에서 온다 — 이것이 "임계 감속 보정"의 결론이기도 하다:</p>
    <div class="formula"><span class="cm"># 4색 붕괴 확인등</span>
폭 = S&amp;P 500 / 다우 / 나스닥 중 종가 &gt; 200일 이동평균선 개수
이탈 = 폭 ≤ 1 이고 <span class="c">2주 연속</span>
변동성 백분위 = 3개 지수 126일 실현 변동성의 시점 기준 주간 순위

  폭 양호: 변동성 &lt; 90분위 → <span class="c">🟢 초록</span> 보유 ; ≥90 → 🟡 노랑 변동성 충격
  폭 이탈: 변동성 &lt; 70 → 🟡 노랑 초기 이탈 ; 70–90 → 🟠 주황 붕괴+압박 ; ≥90 → <span style="color:var(--red-soft)">🔴 빨강</span> 격렬한 폭락</div>
    <p>천장 당일엔 늘 초록이나 노랑(폭풍 전의 고요)이고, 폭락 도중에야 한 칸씩 올라간다 — 네 번의 역사적 천장에서 보통 <b>천장 후 2–6주</b>에 초록을 떠났다. 읽는 법: <b>P/M/R은 풍선이 얼마나 팽팽한지 알려 주고, 4색 등은 그것이 실제로 언제 새기 시작하는지 알려 준다.</b></p>`,
  ms6:`<h2><span class="mn">06</span>지표 목록, 가중치와 데이터 출처</h2>
    <p>P는 아래 11개 지표를 상대 가중치로 합성하며, 각 시점에 참여하는 지표로 정규화한다. 가중치 배분은 각 신호가 역사적 천장에서 얼마나 믿을 만하게 예고했는지를 반영한다 — 가격 동력과 시장 폭이 가장 높고, 과열 신호(IPO 등)가 가장 낮다. 모든 데이터는 공개 출처에서 온다.</p>
    <div style="overflow-x:auto">
      <table class="param-table">
        <thead><tr><th>지표</th><th>가중치</th><th>위험 방향</th><th>데이터 출처</th></tr></thead>
        <tbody>
          <tr><td><b>반도체 200일선 이격</b></td><td class="mono">14%</td><td>높을수록 위험</td><td>필라델피아 반도체 지수(SOX)</td></tr>
          <tr><td><b>나스닥 200일선 이격</b></td><td class="mono">12%</td><td>높을수록 위험</td><td>나스닥 종합지수</td></tr>
          <tr><td><b>시장 폭 · SPY÷RSP</b></td><td class="mono">11%</td><td>좁을수록 위험</td><td>SPY(시총가중) ÷ RSP(동일가중) 상대강도</td></tr>
          <tr><td><b>CAPE 경기조정 밸류에이션</b></td><td class="mono">10%</td><td>높을수록 위험</td><td>실러 CAPE(예일)</td></tr>
          <tr><td><b>시장 집중도 · 상위 10종목 비중</b></td><td class="mono">8%</td><td>높을수록 위험</td><td>S&amp;P 500 상위 10종목 비중(RBC)</td></tr>
          <tr><td><b>신용잔고 레버리지 / GDP</b></td><td class="mono">8%</td><td>높을수록 위험</td><td>FINRA 신용잔고 ÷ 명목 GDP</td></tr>
          <tr><td><b>VIX 안주 누적</b></td><td class="mono">7%</td><td>낮고 오래일수록 위험</td><td>CBOE VIX</td></tr>
          <tr><td><b>AAII 개인 심리</b></td><td class="mono">7%</td><td>탐욕적일수록 위험</td><td>AAII 강세-약세 설문</td></tr>
          <tr><td><b>집중도 버블 프리미엄</b></td><td class="mono">5%</td><td>높을수록 위험</td><td>상위 10종목 비중 − 이익 비중</td></tr>
          <tr><td><b>하이일드 신용 스프레드</b></td><td class="mono">5%</td><td>낮을수록 위험</td><td>ICE BofA HY OAS</td></tr>
          <tr><td><b>IPO 과열도</b></td><td class="mono">3%</td><td>높을수록 위험</td><td>SEC 연간 IPO 건수</td></tr>
        </tbody>
      </table>
    </div>
    <p style="margin-top:14px"><b>관찰 지표(가중 미포함)</b>: 2년 / 10년 국채 수익률, 달러 지수, VVIX, 반도체 절대 지수. 이들은 버블 천장과 안정적인 단조 관계가 없다 — 예컨대 금리는 2000년 천장이 고금리, 2022년 천장이 제로금리로 방향이 반대 — 그래서 배경 관찰로만 둔다.</p>`,
  ms7:`<h2><span class="mn">07</span>두 가지 핵심 보정: 인플레이션과 독점</h2>
    <h3>보정 1: 인플레이션 조정(비율로 명목 팽창 제거)</h3>
    <p>금액성 지표는 어느 것도 명목값으로 보면 안 된다 — 그러지 않으면 오늘의 숫자가 인플레이션과 경제 성장 탓에 자연히 부풀어 보인다. 신용잔고를 예로 들면: 오늘 명목 1.42조 달러는 2000년의 4.7배로 무섭게 들리지만, <b>"신용잔고 / GDP" 비율(인플레이션 + 성장 자동 제거)로 보면 오늘 4.64%, 2000년 2.93%로 1.59배에 불과</b>하며, 이것이 진짜 레버리지 강도다. 우리는 모든 금액성 지표에 이 처리를 적용한다. (IPO는 모집액이 아니라 "건수"를 써서 인플레이션의 영향을 받지 않는다.)</p>
    <h3>보정 2: 독점 보정(진짜 해자와 밸류에이션 버블 구별)</h3>
    <p>오늘 시장 집중도는 40%로 2000년의 27%를 크게 웃돈다. 그러나 오늘의 거대 기업은 2000년보다 실제로 더 잘 벌고 해자가 더 깊다 — 그래서 단순히 "집중도가 높다"로 겁줄 수 없다. 우리는 <b>"집중도 버블 프리미엄" = 상위 10종목 비중% − 상위 10종목 이익 비중%</b> 지표를 새로 더해, "합리적 집중"과 "위험한 버블"을 구별한다:</p>
    <ul>
      <li>2015년: 비중 19%, 이익 비중 19% → 프리미엄 <b>0%</b>(완전히 건강, 시총과 펀더멘털 일치)</li>
      <li>2000년: 비중 27%, 이익 비중 22% → 프리미엄 <b>5%</b>(버블 존재)</li>
      <li>오늘: 비중 40%, 이익 비중 32% → 프리미엄 <b>8.7%</b>(역사상 최대 괴리)</li>
    </ul>
    <p>의미: 오늘 40% 집중 중 32%는 실제 이익이 뒷받침하며(합리적 해자), 단 8.7%만이 순수 밸류에이션 버블이다 — 단순히 40%로 판단하는 것보다 훨씬 과학적이다.</p>`,
  ms8:`<h2><span class="mn">08</span>역사 검증: 네 가지 죽는 법 + 4색 등</h2>
    <p>우리는 모델을 과거 네 시점에 되돌려 놓는다. 그저 "떨어지면 경보"라면 아무 가치가 없다. 진짜 시험은 "버블이 스스로 터진 것"과 "외력에 떠밀려 내려온 것"을 구별할 수 있느냐이며 — 결과는 각 이론의 유효성을 정확히 입증한다.</p>
    <div class="case-card">
      <div class="cc-h"><span class="cc-yr">2000년 3월</span><span class="cc-lb">닷컴 천장 · 기준</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--amber)">0.879</b></span><span>M <b style="color:var(--green)">0.644</b></span><span>R <b style="color:var(--green)">0.367</b></span><span>R추세 <b style="color:var(--amber)">보조 −0.05</b></span><span>게이트 <b style="color:var(--amber)">🟡 노랑</b></span></div>
      <div class="cc-txt"><b>이것이 우리의 기준점이다.</b> 순수하고 교과서적인 증시 밸류에이션 버블: 반도체가 이동평균보다 111% 위, CAPE 43, 개인 심리 극도로 탐욕적. P는 임계에 이르렀고 R 추세는 이미 꺾여 내려갔다 — 엔진이 최고 속도로 돌면서 식기 시작한, 강한 활시위가 끝에 다다른(强弩之末) 모습이다. 결과: 나스닥 −78% 폭락. <b>"버블이 스스로 터지는 것"이 어떤 모습인지 정의한다.</b></div>
    </div>
    <div class="case-card">
      <div class="cc-h"><span class="cc-yr">2007년 10월</span><span class="cc-lb">신용위기 직전</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--green)">0.746</b></span><span>M <b style="color:var(--green)">0.516</b></span><span>R <b style="color:var(--green)">0.541</b></span><span>R추세 <b style="color:var(--amber)">보조 −0.18</b></span><span>게이트 <b style="color:var(--green)">🟢 초록</b></span></div>
      <div class="cc-txt">P는 0.75에 불과해 2000년보다 뚜렷이 낮았다. <b>왜? 2008년의 레버리지는 증시가 아니라 부동산에 쌓였기 때문</b> — 증시 신용잔고/GDP는 당시 2.88%로 2000년보다도 낮았다. 이것이 바로 민스키 이론의 예언이다: 위기가 반드시 증시 자체에서 오는 것은 아니다. 모델은 "이것은 증시 밸류에이션 버블이 아니다"를 충실히 반영했고, 고점에서 오래 배회한 탓에(그래서 M이 그리 낮지 않다) 끝내 신용 시스템 붕괴라는 <b>외력</b>에 떠밀려 내려왔다. 결과: S&amp;P −57%. <b>모델은 "신용위기 전이"와 "증시 자폭"을 성공적으로 구별했다.</b></div>
    </div>
    <div class="case-card">
      <div class="cc-h"><span class="cc-yr">2020년 2월</span><span class="cc-lb">코로나 직전</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--amber)">0.943</b></span><span>M <b style="color:var(--green)">0.535</b></span><span>R <b style="color:var(--green)">0.699</b></span><span>R추세 <b style="color:var(--green)">보조 +0.22</b></span><span>게이트 <b style="color:var(--green)">🟢 초록</b></span></div>
      <div class="cc-txt">코로나 전 성장주 밸류에이션은 사실 이미 낮지 않았지만(P=0.94), R은 0.70에 추세가 정체 — 엔진이 강하지 않았다. 결과는 <b>순수 외부 블랙스완</b>(팬데믹)이 촉발한 −34% 급락과 이은 V자 반등이었다. 모델은 이것이 "극한까지 자기강화한" 버블 천장이 아니라 외부 충격에 끊긴 과정임을 보여 준다. <b>이것이 빨리 떨어지고 빨리 회복한 이유를 설명한다.</b></div>
    </div>
    <div class="case-card">
      <div class="cc-h"><span class="cc-yr">2022년 1월</span><span class="cc-lb">금리 인상 사이클 천장</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--amber)">0.786</b></span><span>M <b style="color:var(--green)">0.297</b></span><span>R <b style="color:var(--green)">0.688</b></span><span>R추세 <b style="color:var(--amber)">보조 −0.09</b></span><span>게이트 <b style="color:var(--green)">🟢 초록</b></span></div>
      <div class="cc-txt">P=0.786으로 고점에 이르렀지만, <b>핵심은 R 추세가 음으로 전환(보조 −0.09)되고 4색 등이 끝내 초록을 떠나지 않은 것</b> — 금리 인상 기대가 신규 자금 유입을 식혔고, 번영을 떠받치던 유입이 약해졌다. 이것은 "고압력 + 엔진 감속"의 천장이다. 결과: S&amp;P −36%. <b>주의: 이 라운드에서 4색 등은 끝내 빨강이 되지 않았다(최대 주황) — 통화정책이 제때 긴축해 버블을 찔러, 폭발이 아니라 서서히 바람을 빼게 했다. 이것이 정확히 보여 준다: P/M/R은 압력의 높낮이를 재고, 4색 등은 붕괴의 강도를 재며, 둘의 역할은 다르다.</b></div>
    </div>
    <div class="case-card" style="border-color:var(--grid);background:linear-gradient(150deg,var(--panel2),var(--bg2))">
      <div class="cc-h"><span class="cc-yr">오늘</span><span class="cc-lb">AI 사이클</span></div>
      <div class="case-pmr"><span>P <b style="color:var(--red-soft)">0.963</b></span><span>M <b style="color:var(--green)">0.567</b></span><span>R <b style="color:var(--amber)">0.578</b></span><span>R추세 <b style="color:var(--amber)">보조 −0.31</b></span><span>게이트 <b style="color:var(--green)">🟢 초록</b></span></div>
      <div class="cc-txt">P=0.963, 구조적 압력이 네 역사적 천장을 <b>모두 넘어선다</b> — 오늘의 밸류에이션·집중도·레버리지·신용 스프레드 대부분이 시점 기준 역사적 극단에 있다; M=0.567 역시 다섯 시점 중 최고로, 고점에 누적된 "무게"가 전례 없다. <b>그러나 4색 확인등은 여전히 초록</b>이며(3대 지수가 모두 200일선 위, 변동성도 높지 않음) 붕괴는 아직 시작되지 않았다. 이것이 "역사상 가장 팽팽하지만 아직 새지 않은 풍선"이다. <b>결론: 시장에 머물되, 이것은 당신의 전체 검증 집합에서 가장 팽팽한 풍선이다. 폭을 주시하라 — 지수가 200일선 아래 머물고 등이 초록을 떠나는 순간, 그것이 역사상 "천장 후 2–6주"의 가장 빠른 이탈 창이다.</b></div>
    </div>
    <p style="margin-top:18px">네 번의 역사, 네 가지 다른 "죽는 법", 모델은 매번 사실과 부합하는 수치를 냈다 — 이것이 우리가 그것을 공개하는 근거다. 다만 다음 절의 정직한 한계를 기억하라.</p>`,
  ms9:`<h2><span class="mn">10</span>정직한 한계</h2>
    <ul>
      <li><b>미래 엿보기 없음, 실증 완료.</b> 어떤 시점의 모든 값을 계산할 때 그 순간과 그 이전 데이터만 쓴다. 특정 역사 일자 이후의 모든 데이터를 지워도 그날의 수치는 비트 단위로 동일하다 — 역사 데이터는 사후 회고 보정에만 쓰이며 결코 미래를 엿보지 않는다.</li>
      <li><b>P는 1을 넘을 수 있다.</b> P의 바닥(에너지 위치)은 0–1 백분위지만, 압력이 극단적이면서 가속할 때 운동에너지 증폭이 P를 1.0 위로 밀어 올린다(6월 고점 1.029; 오늘 0.963). 이것은 특성이다.</li>
      <li><b>가격 동력은 마법의 타이밍 도구가 아니다.</b> 155년 역사 검증에서 속도가 음으로 전환하는 것만으로 천장을 잡는 정확도는 약 11%이며, 대형 천장과 평범한 천장을 구별하지 못한다. 그래서 판별력은 다차원 에너지 상태에 있고, R 추세는 보조로 강등되었다; 진짜 이탈 방아쇠는 4색 확인등이다.</li>
      <li><b>극소 표본 + 콜드 스타트.</b> 버블급 천장은 본래 드물며, 초기(2000/2007)에는 일부 짧은 역사의 지표가 데이터가 아직 쌓이지 않아 정직하게 폐기된다. 2026년은 진정한 표본 외 시험이다.</li>
      <li><b>R이 판단에 가장 의존하고, 폭 기준엔 절충이 있다.</b> 재귀성은 대리 변수로 근사한다; 등락 종목 수 폭 데이터는 2020년 이후 결측이라, 이제 <b>SPY/RSP 상대강도</b>(시총가중 ÷ 동일가중, 현재까지 연속·완전 객관)를 쓰며, 그 대가로 RSP가 아직 상장되지 않았던 2000년엔 이 기둥이 없다.</li>
      <li><b>완전 투명, 비판 환영.</b> 모든 가중치·매개변수·공식·데이터 출처가 이 페이지에 있다. <a href="message.html" style="color:var(--green);border-bottom:1px solid var(--grid)">"문의하기"</a>로 갱신이 필요한 곳을 알려 달라.</li>
    </ul>
    <div class="story-cta"><a href="index.html">← 홈으로 돌아가 오늘의 실시간 수치 보기</a></div>`
});


/* ===== PART 06/07 动作剧本 + 崩盘后轮动 (新增) ===== */
Object.assign(window.I18N.en, {"pb_title": "Action Playbook · two-tier state machine", "pb_intro": "The light tells you “what state you’re in”; this layer tells you “what to do.” Action only switches on inside a <b>valuation bubble</b> — a “bubble flag” (the trailing-12-month peak of P’s percentile ≥85%) is the master switch: flag off, however expensive, you only watch.", "pb_table": "<table class=\"pb-table\"><thead><tr><th>State</th><th>Trigger</th><th>Action</th></tr></thead><tbody><tr><td class=\"pb-st pb-idle\">Watch</td><td>Flag off</td><td>Stay out</td></tr><tr><td class=\"pb-st pb-ok\">Ride full</td><td>Flag on + 🟢</td><td>Ride the bubble fully invested</td></tr><tr><td class=\"pb-st pb-warn\">Trim</td><td>Flag on + 🟡</td><td>Step down to &lt;10% high-β</td></tr><tr><td class=\"pb-st pb-alert\">Exit + hedge</td><td>Flag on + 🟠/red or credit trigger</td><td>Sell stocks + buy 12-month puts</td></tr><tr><td class=\"pb-st pb-alert\">Hold / roll</td><td>Confirmation persists</td><td>Still 🟠/red at expiry → roll (or 18–24-mo LEAPS)</td></tr><tr><td class=\"pb-st pb-warn\">Fail-fast exit</td><td>Back to 🟢 within 12 weeks</td><td>Treat as false break, stop out the puts</td></tr></tbody></table>", "pb_note": "A true crash stays broken for 30–81 weeks; a whipsaw usually heals within 8 — so “exit if it returns to green within 12 weeks” cuts 5 of 6 whipsaws and kills zero real crashes.", "rt_title": "After the Crash · rotation playbook", "rt_intro": "And after you’ve confirmed the rupture and hedged? A crash isn’t the end — it’s the starting line for switching engines.", "rt_grid": "<div class=\"rt-card rt-p1\"><div class=\"rt-ph\">Phase 1 · Shelter</div><div class=\"rt-txt\">Cash / short Treasuries / dollar / gold — survive first.</div></div><div class=\"rt-card rt-p2\"><div class=\"rt-ph\">Phase 2 · Anti-bubble rotation</div><div class=\"rt-txt\"><b>Highest conviction</b>: gold / real assets (the opposite of the bubble)<br><b>Highest elasticity</b>: emerging markets / international / commodities (neglected, cyclical rebound)<br><b>Value / small-cap</b>　·　<b>AI power infrastructure</b> (“dark fiber that eventually lights up”)</div></div>", "rt_note": "Tell the two crash types apart: a <b>valuation / concentration unwind</b> (2000/2022, Nasdaq-Dow correlation 0.70–0.85, wide growth-value gap) lets rotation begin <b>concurrently</b> with the decline; a <b>systemic credit crisis</b> (2008, correlation 0.93–0.97, nearly everything goes to one) means shelter first, rotate later."});
Object.assign(window.I18N.ko, {"pb_title": "액션 플레이북 · 2단 상태기계", "pb_intro": "등은 “지금 어떤 상태인지” 알려 주고, 이 층은 “무엇을 해야 하는지” 알려 준다. 행동은 오직 <b>밸류에이션 버블</b> 안에서만 켜진다 — “버블 깃발”(과거 12개월 P 백분위의 최고치 ≥85%)이 마스터 스위치다: 깃발이 꺼져 있으면 아무리 비싸도 관망만 한다.", "pb_table": "<table class=\"pb-table\"><thead><tr><th>상태</th><th>트리거</th><th>행동</th></tr></thead><tbody><tr><td class=\"pb-st pb-idle\">관망</td><td>깃발 꺼짐</td><td>개입 안 함</td></tr><tr><td class=\"pb-st pb-ok\">풀 배팅</td><td>깃발 ON + 🟢</td><td>풀 포지션으로 버블에 올라타기</td></tr><tr><td class=\"pb-st pb-warn\">비중 축소</td><td>깃발 ON + 🟡</td><td>고β를 &lt;10%로 단계적 축소</td></tr><tr><td class=\"pb-st pb-alert\">청산 + 헤지</td><td>깃발 ON + 🟠/빨강 또는 신용 방아쇠</td><td>주식 청산 + 12개월 풋 매수</td></tr><tr><td class=\"pb-st pb-alert\">보유 / 롤</td><td>확인 지속</td><td>만기에도 🟠/빨강이면 롤(또는 18–24개월 LEAPS)</td></tr><tr><td class=\"pb-st pb-warn\">빠른 손절</td><td>12주 내 🟢 복귀</td><td>가짜 이탈로 보고 풋 손절</td></tr></tbody></table>", "pb_note": "진짜 폭락은 30–81주 동안 이탈을 유지하고, 가짜 흔들림은 보통 8주 내 회복된다 — 그래서 “12주 내 초록 복귀 시 이탈”은 6번의 흔들림 중 5번을 걸러 내고 진짜 폭락은 하나도 오살하지 않는다.", "rt_title": "폭락 이후 · 로테이션 플레이북", "rt_intro": "붕괴를 확인하고 헤지한 다음은? 폭락은 끝이 아니라 엔진을 바꾸는 출발선이다.", "rt_grid": "<div class=\"rt-card rt-p1\"><div class=\"rt-ph\">Phase 1 · 피신</div><div class=\"rt-txt\">현금 / 단기채 / 달러 / 금 — 먼저 살아남기.</div></div><div class=\"rt-card rt-p2\"><div class=\"rt-ph\">Phase 2 · 반버블 로테이션</div><div class=\"rt-txt\"><b>최고 확신</b>: 금 / 실물자산(버블의 반대)<br><b>최고 탄력</b>: 신흥시장 / 국제 / 원자재(소외되고 순환적 반등)<br><b>가치 / 소형주</b>　·　<b>AI 전력 인프라</b>(“결국 불이 들어올 다크 파이버”)</div></div>", "rt_note": "두 가지 폭락을 구별하라: <b>밸류에이션/집중도 붕괴</b>(2000/2022, 나스닥-다우 상관 0.70–0.85, 성장-가치 격차 큼)는 로테이션이 하락과 <b>동시에</b> 시작될 수 있고; <b>시스템적 신용위기</b>(2008, 상관 0.93–0.97, 거의 모든 것이 하나로 수렴)는 먼저 피신하고 나중에 로테이션한다."});


/* ===== methodology section 09 动作层 (新增) ===== */
Object.assign(window.I18N.en, {"ms_act": "<h2><span class=\"mn\">09</span>Action layer: flag · credit trigger · hit rate</h2>\n    <p>P/M/R and the four-color light answer “how tight, and when it breaks.” To turn that into a disciplined <b>action</b>, two safeguards sit on top of the gate, with a master switch deciding when to engage at all. This layer is confirmed by a full point-in-time backtest over 1990–2026.</p>\n    <h3>Master switch: bubble flag (trailing-12-month peak of P’s percentile ≥85%)</h3>\n    <p>We only short inside a <b>valuation bubble</b>. Flag = P’s expanding percentile reached ≥0.85 at some point in the trailing 12 months. Flag off → this short strategy stays out entirely, hold as usual; flag on → enter the state machine below and carry it through to rupture confirmation.</p>\n    <h3>Parallel confirm: HYOAS credit trigger (≥1.5pp above the 6-month low)</h3>\n    <p>The volatility light only watches price breadth and volatility, and misses the “equities fine, credit cracks first” kind of crisis. So a credit trigger runs in parallel: it fires when the high-yield spread (HYOAS) > its trailing-6-month low + 1.5 points. <b>Confirmation = the four-color light reaching 🟠/red OR the credit trigger</b> — either path confirms. Backtest: in the 2007 credit crisis the pure equity light barely reacted (🟢 throughout, flag OFF) and only the credit trigger warned, ~14 months early; 2020 was also confirmed by the credit trigger before the light changed color; 2000 by red, 2022 by orange. <b>Together, across 30 years, all four great crashes were caught.</b></p>\n    <h3>Anti-whipsaw: 12-week fail-fast</h3>\n    <p>Not every break is a real crash. A true crash stays broken for 30–81 weeks; a whipsaw usually heals within 8. Rule: if the gate returns to 🟢 within 12 weeks of confirmation, treat it as a false break and stop out the puts (if the flag is still on, wait for the next break). Backtest: this rule cuts 5 of 6 whipsaws (e.g. 1999-10, 2018-12, 2025-04) and kills zero real crashes.</p>\n    <h3>The honest hit rate (don’t deify any single color)</h3>\n    <p>Running the gate month by month across 1990–2026, the frequency of “a ≥15% drawdown within 18 months of a peak in that color”:</p>\n    <div style=\"overflow-x:auto\"><table class=\"param-table\"><thead><tr><th>Peak color</th><th>≥15% drawdown hit rate</th><th>Reading</th></tr></thead><tbody><tr><td>🟡 Yellow</td><td class=\"mono\">26%</td><td>Mostly noise — ~27 non-green episodes, only 7 real ≥15% drops, ~3/4 false</td></tr><tr><td>🟠 Orange</td><td class=\"mono\">47%</td><td>A clear escalation, nearly half play out</td></tr><tr><td>🔴 Red</td><td class=\"mono\">71%</td><td>Extremely rare, extremely accurate — but the price is it comes late</td></tr></tbody></table></div>\n    <p>This is exactly why “don’t act on yellow alone; the real cue is 🟠/red or the credit trigger.” The price is late confirmation — the lead from confirmation to the trough: ~1 month in 2020, ~7 months in 2022, ~19 months in 2007, ~31 months in 2000. <b>It confirms after the top and before the deepest point — a confirmation tool, not a crystal ball.</b></p>"});
Object.assign(window.I18N.ko, {"ms_act": "<h2><span class=\"mn\">09</span>액션 레이어: 깃발 · 신용 방아쇠 · 적중률</h2>\n    <p>P/M/R과 4색 등은 “얼마나 팽팽한가, 언제 껨지는가”에 답한다. 이를 규율 있는 <b>행동</b>으로 바꾸려면 게이트 위에 두 개의 안전장치를 얇고, 마스터 스위치로 언제 개입할지를 정한다. 이 레이어는 1990–2026 전 구간 시점 기준 백테스트로 확인되었다.</p>\n    <h3>마스터 스위치: 버블 깃발 (과거 12개월 P 백분위 최고치 ≥85%)</h3>\n    <p>오직 <b>밸류에이션 버블</b> 안에서만 숯을 친다. 깃발 = 과거 12개월 동안 P의 확장 백분위가 ≥0.85에 도달한 적이 있음. 깃발 꺼짐 → 이 숯 전략은 전혀 개입하지 않고 평소대로 보유; 깃발 켜짐 → 아래 상태기계로 들어가 붕괴 확인까지 끓고 간다.</p>\n    <h3>병행 확인: HYOAS 신용 방아쇠 (6개월 저점보다 ≥1.5%p 위)</h3>\n    <p>변동성 등은 가격 폭과 변동성만 보아, “증시는 멀짱한데 신용이 먼저 갈라지는” 위기를 놓친다. 그래서 신용 방아쇠가 병행한다: 하이일드 스프레드(HYOAS)가 과거 6개월 저점 + 1.5%p를 넘으면 발동. <b>확인 = 4색 등이 🟠/빨강에 도달 또는 신용 방아쇠</b> — 둘 중 하나면 확인. 백테스트: 2007 신용위기에서 순수 증시 등은 거의 반응하지 않았고(내내 🟢, 깃발 OFF) 신용 방아쇠만이 약 14개월 일찍 경고했다; 2020도 등이 색을 바꾸기 전에 신용 방아쇠가 먼저 확인했다; 2000은 빨강, 2022는 주황으로 확인. <b>둘을 합치면 30년간 네 번의 대붕괴를 하나도 놓치지 않았다.</b></p>\n    <h3>흔들림 방지: 12주 빠른 손절</h3>\n    <p>모든 이탈이 진짜 폭락은 아니다. 진짜 폭락은 30–81주 이탈을 유지하고, 가짜 흔들림은 보통 8주 내 회복된다. 규칙: 확인 후 12주 내 게이트가 🟢로 복귀하면 가짜 이탈로 보고 풋을 손절한다(깃발이 여전히 켜져 있으면 다음 이탈을 기다림). 백테스트: 이 규칙은 6번의 흔들림(예: 1999-10, 2018-12, 2025-04) 중 5번을 걸러 내고 진짜 폭락은 하나도 오살하지 않는다.</p>\n    <h3>정직한 적중률 (어떤 단일 색도 신격화하지 말 것)</h3>\n    <p>게이트를 1990–2026 월 단위로 돌렸을 때, “그 색의 천장 후 18개월 내 ≥15% 낙폭” 빈도:</p>\n    <div style=\"overflow-x:auto\"><table class=\"param-table\"><thead><tr><th>천장 색</th><th>≥15% 낙폭 적중률</th><th>해석</th></tr></thead><tbody><tr><td>🟡 노랑</td><td class=\"mono\">26%</td><td>대부분 노이즈 — 비초록 약 27회 중 진짜 ≥15% 낙폭은 7회, 약 3/4이 가짜</td></tr><tr><td>🟠 주황</td><td class=\"mono\">47%</td><td>뚜렷한 격상, 거의 절반이 현실화</td></tr><tr><td>🔴 빨강</td><td class=\"mono\">71%</td><td>극히 드물고 극히 정확 — 그러나 대가는 늦게 온다는 것</td></tr></tbody></table></div>\n    <p>이것이 바로 “노란불 하나만으로 행동하지 말라; 진짜 신호는 🟠/빨강 또는 신용 방아쇠”의 근거다. 대가는 늦은 확인 — 확인에서 최저점까지의 선행: 2020 약 1개월, 2022 약 7개월, 2007 약 19개월, 2000 약 31개월. <b>천장 이후, 최저점 이전에 확인한다 — 수정구슬이 아니라 확인 도구다.</b></p>"});
