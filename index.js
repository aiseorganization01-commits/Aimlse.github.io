/* ══ VIEW SWITCHING ══ */
var isDoc = false;
function showMain(){
  isDoc = false;
  document.getElementById('view-main').style.display = '';
  document.getElementById('view-docs').style.display = 'none';
  var nd = document.getElementById('navDocs');
  nd.classList.remove('active');
  nd.innerHTML = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2a1 1 0 0 1 1-1h8l3 3v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/><polyline points="9,1 9,4 12,4"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="9" y2="11"/></svg>Docs';
  document.getElementById('navCta').style.display = '';
  document.getElementById('menuBtn').style.display = 'none';
  window.scrollTo(0,0);
  setTimeout(initReveal, 50);
}
function showDocs(){
  isDoc = true;
  document.getElementById('view-main').style.display = 'none';
  document.getElementById('view-docs').style.display = 'block';
  var nd = document.getElementById('navDocs');
  nd.classList.add('active');
  nd.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>Back';
  document.getElementById('navCta').style.display = 'none';
  document.getElementById('menuBtn').style.display = 'flex';
  window.scrollTo(0,0);
}
function toggleView(){ isDoc ? showMain() : showDocs(); }

/* ══ COUNTDOWN ══ */
var LAUNCH = new Date('2026-07-11T22:00:00Z'), launched = false;
function pad(n){return('0'+Math.max(0,Math.floor(n))).slice(-2);}
function tick(){
  var d=document.getElementById('cd-d'),h=document.getElementById('cd-h'),m=document.getElementById('cd-m'),s=document.getElementById('cd-s');
  if(!d)return;
  var diff=LAUNCH-Date.now();
  if(diff<=0){d.textContent=h.textContent=m.textContent=s.textContent='00';if(!launched){launched=true;boom();}return;}
  var ts=Math.floor(diff/1000),ns=pad(ts%60);
  if(s.textContent!==ns){s.classList.add('tick');setTimeout(()=>s.classList.remove('tick'),130);}
  d.textContent=pad(Math.floor(ts/86400));
  h.textContent=pad(Math.floor((ts%86400)/3600));
  m.textContent=pad(Math.floor((ts%3600)/60));
  s.textContent=ns;
}
tick();setInterval(tick,1000);

/* ══ LANDING REVEAL ══ */
function initReveal(){
  if(!('IntersectionObserver' in window)){document.querySelectorAll('#view-main .reveal').forEach(el=>el.classList.add('in'));return;}
  var io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.04,rootMargin:'0px 0px -30px 0px'});
  document.querySelectorAll('#view-main .reveal').forEach(el=>io.observe(el));
  setTimeout(()=>document.querySelectorAll('#view-main .reveal:not(.in)').forEach(el=>el.classList.add('in')),2200);
}
document.addEventListener('DOMContentLoaded', initReveal);

/* ══ CONFETTI ══ */
var pts=[],spT=0,cnv=document.getElementById('confetti'),ctx=cnv.getContext('2d');
function rsz(){cnv.width=innerWidth;cnv.height=innerHeight;}rsz();window.addEventListener('resize',rsz);
var PAL=['#c9a84c','#e8c96a','#9e7a22','#f4d03f','#fff8dc','#fff','#d4ac0d','#ffeaa0'];
function mkP(){return{x:Math.random()*cnv.width,y:-20-Math.random()*40,w:Math.random()*10+4,h:Math.random()*14+5,vx:(Math.random()-.5)*3.8,vy:Math.random()*3.4+2,rot:Math.random()*Math.PI*2,vr:(Math.random()-.5)*.15,color:PAL[Math.floor(Math.random()*PAL.length)],alpha:1,shape:['rect','circle','ribbon'][Math.floor(Math.random()*3)]};}
function dpP(p){ctx.save();ctx.globalAlpha=p.alpha;ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.fillStyle=p.color;if(p.shape==='circle'){ctx.beginPath();ctx.arc(0,0,p.w/2,0,Math.PI*2);ctx.fill();}else if(p.shape==='ribbon'){ctx.beginPath();ctx.moveTo(-p.w/2,-p.h/2);ctx.lineTo(p.w/2,-p.h/4);ctx.lineTo(p.w/2,p.h/2);ctx.lineTo(-p.w/2,p.h/4);ctx.closePath();ctx.fill();}else{ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);}ctx.restore();}
function animC(){ctx.clearRect(0,0,cnv.width,cnv.height);if(spT<170){var n=spT<75?22:7;for(var i=0;i<n;i++)pts.push(mkP());spT++;}pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.058;p.vx*=.997;p.rot+=p.vr;if(p.y>cnv.height*.68)p.alpha-=.02;dpP(p);});pts=pts.filter(p=>p.alpha>0);if(pts.length||spT<170)requestAnimationFrame(animC);}
function boom(){spT=0;pts=[];animC();setTimeout(()=>document.getElementById('unlock').classList.add('show'),900);}

/* ══ DOCS SCROLLSPY ══ */
var DS=['d-overview','d-quickstart','d-requirements','d-aci','d-f0','d-f1','d-f2','d-f3','d-interop','d-collab','d-pytorch','d-beta','d-phases','d-faq'];
function spy(){
  if(!isDoc)return;
  var y=window.scrollY+120,cur='d-overview';
  DS.forEach(id=>{var el=document.getElementById(id);if(el&&el.offsetTop<=y)cur=id;});
  document.querySelectorAll('.sb-link').forEach(a=>a.classList.toggle('active',a.dataset.t===cur));
  document.querySelectorAll('.toc-dot').forEach(d=>d.classList.toggle('active',d.dataset.t===cur));
}
window.addEventListener('scroll',spy,{passive:true});

/* ══ SIDEBAR / TOC CLICKS ══ */
document.querySelectorAll('.sb-link').forEach(a=>{
  a.addEventListener('click',()=>{
    var el=document.getElementById(a.dataset.t);
    if(el)el.scrollIntoView({behavior:'smooth'});
    document.getElementById('sidebar').classList.remove('open');
  });
});
document.querySelectorAll('.toc-dot').forEach(d=>{
  d.addEventListener('click',()=>{var el=document.getElementById(d.dataset.t);if(el)el.scrollIntoView({behavior:'smooth'});});
});
document.getElementById('menuBtn').addEventListener('click',()=>document.getElementById('sidebar').classList.toggle('open'));
document.addEventListener('click',e=>{
  var sb=document.getElementById('sidebar'),mb=document.getElementById('menuBtn');
  if(sb.classList.contains('open')&&!sb.contains(e.target)&&e.target!==mb)sb.classList.remove('open');
});

/* ══ FAQ ══ */
function toggleFaq(item){var o=item.classList.contains('open');document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));if(!o)item.classList.add('open');}

/* ══ COPY CODE ══ */
function cpCode(btn){
  var code=btn.closest('.cb').querySelector('code');
  navigator.clipboard.writeText(code.innerText||code.textContent).then(()=>{var o=btn.textContent;btn.textContent='Copied!';setTimeout(()=>btn.textContent=o,1800);}).catch(()=>{});
}
