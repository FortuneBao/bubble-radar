// ===== Bubble Radar · 前端 CSV 校验 =====
// 目标：不阻止提交（除非完全无法解析），而是生成质量报告，
// 随文件发给创始人，作为人工分拣的标注。

function parseCSV(text){
  // 简单稳健的 CSV 解析：按行、按逗号/制表符切
  const lines = text.replace(/\r/g,'').split('\n').filter(l=>l.trim().length>0);
  if(lines.length < 2) return null;
  const delim = lines[0].includes('\t') ? '\t' : ',';
  const rows = lines.map(l=>l.split(delim).map(c=>c.trim()));
  return rows;
}

// 尝试把字符串解析成日期（支持 YYYY-MM-DD, YYYY/MM/DD, YYYYMMDD, MM/DD/YYYY）
function parseDate(s){
  if(!s) return null;
  s = s.replace(/"/g,'').trim();
  let m;
  if(m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)) return new Date(+m[1],+m[2]-1,+m[3]);
  if(m = s.match(/^(\d{4})(\d{2})(\d{2})$/)) return new Date(+m[1],+m[2]-1,+m[3]);
  if(m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)) return new Date(+m[3],+m[1]-1,+m[2]);
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function parseNum(s){
  if(s==null) return NaN;
  s = String(s).replace(/["',%]/g,'').trim();
  if(s==='') return NaN;
  return parseFloat(s);
}

// 主校验函数：返回 {parseable, lines:[{type,msg}], verdict}
function validateData(text){
  const out = { parseable:false, lines:[], verdict:'' };
  const rows = parseCSV(text);
  if(!rows){
    out.lines.push({type:'err', msg:'无法解析为表格（行数不足或格式损坏）'});
    out.verdict = '❌ 文件无法解析，请检查是否为有效 CSV';
    return out;
  }

  // 找日期列和数值列：检查前两列哪列像日期
  let header = rows[0];
  let body = rows.slice(1);
  // 判断第一行是否表头（首格不是日期）
  if(parseDate(rows[0][0])) { body = rows; } // 没有表头，整体是数据

  // 找出日期列索引
  let dateCol = -1;
  for(let c=0;c<Math.min(3,body[0].length);c++){
    let hit=0;
    for(let i=0;i<Math.min(20,body.length);i++){ if(parseDate(body[i][c])) hit++; }
    if(hit >= Math.min(20,body.length)*0.7){ dateCol=c; break; }
  }
  // 找数值列（日期列之外第一个数值列）
  let valCol = -1;
  for(let c=0;c<body[0].length;c++){
    if(c===dateCol) continue;
    let hit=0;
    for(let i=0;i<Math.min(20,body.length);i++){ if(!isNaN(parseNum(body[i][c]))) hit++; }
    if(hit >= Math.min(20,body.length)*0.7){ valCol=c; break; }
  }

  if(dateCol===-1 || valCol===-1){
    out.lines.push({type:'err', msg:'未能识别出"日期列 + 数值列"的结构'});
    out.verdict = '❌ 无法识别日期和数值列，请确认数据为"日期,数值"两列';
    return out;
  }
  out.parseable = true;
  out.lines.push({type:'ok', msg:`可解析：第 ${dateCol+1} 列为日期，第 ${valCol+1} 列为数值，共 ${body.length} 行`});

  // 提取有效数据点
  let pts = [];
  for(const r of body){
    const d = parseDate(r[dateCol]);
    const v = parseNum(r[valCol]);
    if(d && !isNaN(v)) pts.push({d, v, raw:r[dateCol]});
  }
  pts.sort((a,b)=>a.d-b.d);

  if(pts.length < 10){
    out.lines.push({type:'warn', msg:`有效数据点仅 ${pts.length} 个，过少`});
  }

  // 1. 起点检查 ≤ 1995
  const first = pts[0].d, last = pts[pts.length-1].d;
  if(first.getFullYear() <= 1995){
    out.lines.push({type:'ok', msg:`起始 ${first.toISOString().slice(0,10)}，满足 ≤ 1995`});
  } else {
    out.lines.push({type:'warn', msg:`起始 ${first.toISOString().slice(0,10)} 晚于 1995，可能不满足完整性要求`});
  }

  // 2. 终点检查（最近 60 天内算"接近今天"）
  const daysSinceLast = (Date.now()-last.getTime())/86400000;
  if(daysSinceLast <= 60){
    out.lines.push({type:'ok', msg:`数据更新至 ${last.toISOString().slice(0,10)}，接近当前`});
  } else {
    out.lines.push({type:'warn', msg:`最新数据为 ${last.toISOString().slice(0,10)}，距今 ${Math.round(daysSinceLast)} 天，可能未更新`});
  }

  // 3. 数值有效性：全零/全空
  const nonZero = pts.filter(p=>p.v!==0).length;
  if(nonZero===0){
    out.lines.push({type:'err', msg:'数值列全为 0，疑似无效'});
  }

  // 4. 离群跳变：相邻日变化 > 50%
  let jumps = [];
  for(let i=1;i<pts.length;i++){
    const prev = pts[i-1].v, cur = pts[i].v;
    if(prev!==0){
      const ch = Math.abs((cur-prev)/prev);
      if(ch > 0.5 && Math.abs(prev) > 0.01){
        jumps.push({date: pts[i].d.toISOString().slice(0,10), pct: Math.round(ch*100)});
      }
    }
  }
  if(jumps.length===0){
    out.lines.push({type:'ok', msg:'未检测到异常跳变（相邻日 >50%）'});
  } else {
    const sample = jumps.slice(0,3).map(j=>`${j.date}(${j.pct}%)`).join('、');
    out.lines.push({type:'warn', msg:`检测到 ${jumps.length} 处异常跳变：${sample}${jumps.length>3?' …':''}`});
  }

  // 5. 重复值异常：连续相同值的最长串
  let maxRun=1, run=1;
  for(let i=1;i<pts.length;i++){
    if(pts[i].v===pts[i-1].v){ run++; maxRun=Math.max(maxRun,run); }
    else run=1;
  }
  if(maxRun >= 15){
    out.lines.push({type:'warn', msg:`检测到连续 ${maxRun} 个完全相同的值，疑似填充/伪造（注意区分停牌）`});
  } else {
    out.lines.push({type:'ok', msg:'无大量连续重复值'});
  }

  // 6. 周末数据检查（股票数据周末应为空）
  let weekendPts = pts.filter(p=>{const wd=p.d.getDay(); return wd===0||wd===6;}).length;
  const weekendRatio = weekendPts/pts.length;
  if(weekendRatio > 0.1){
    out.lines.push({type:'warn', msg:`${Math.round(weekendRatio*100)}% 的数据点落在周末（股票数据通常周末无交易，来源存疑；若是加密货币/宏观数据可忽略）`});
  }

  // 综合结论
  const warns = out.lines.filter(l=>l.type==='warn').length;
  const errs = out.lines.filter(l=>l.type==='err').length;
  if(errs>0){
    out.verdict = `⚠ 检测到 ${errs} 项严重问题、${warns} 项警告，建议人工重点复核`;
  } else if(warns>0){
    out.verdict = `基本可用，但有 ${warns} 项需人工复核的提示`;
  } else {
    out.verdict = '✅ 自动检查全部通过，建议人工确认来源真实性后纳入';
  }
  return out;
}

// 生成纯文本报告（随表单发给创始人）
function reportToText(rep, fileName){
  let t = `【Bubble Radar 自动校验报告】\n文件：${fileName}\n\n`;
  rep.lines.forEach(l=>{
    const mark = l.type==='ok'?'✅':(l.type==='warn'?'⚠️':'❌');
    t += `${mark} ${l.msg}\n`;
  });
  t += `\n结论：${rep.verdict}\n`;
  t += `\n（注：自动检查只能识别格式与统计异常，数据真伪需人工复核）`;
  return t;
}
