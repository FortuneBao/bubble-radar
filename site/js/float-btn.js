// 全站统一的"给我留言"悬浮按钮（腾讯问卷）
(function(){
  if(document.getElementById('idy_floatdiv')) return; // message页已有则不重复
  var div=document.createElement('div');
  div.id='idy_floatdiv';
  div.style.cssText='position:fixed;display:flex;left:0;bottom:10%;width:30px;border-top-right-radius:6px;border-bottom-right-radius:6px;height:100px;background:#26B941;line-height:24px;writing-mode:vertical-rl;align-items:center;justify-content:center;font-family:PingFangSC-Regular,sans-serif;font-size:16px;z-index:999;';
  div.innerHTML='<a href="https://wj.qq.com/s2/27084873/8ad1/" target="blank" style="color:#FFFFFF;text-decoration:none;">给我留言</a>';
  document.body.appendChild(div);
})();
