// ─── APPS SCRIPT URL ─────────────────────────
var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJxxqt2LOwLuZxmktgHj7Kg5mcAbZbf_vFP6IWk_uRrAZ_rlsetgD7Tc9mY5KpBxWj/exec';

// ─── COUNTDOWN ───────────────────────────────
var LAUNCH = new Date('2026-06-20T22:00:00Z');
var cdLaunched = false;

function cdPad(n) { return ('0' + Math.max(0, Math.floor(n))).slice(-2); }

function cdTick() {
  var dEl = document.getElementById('cd-d');
  var hEl = document.getElementById('cd-h');
  var mEl = document.getElementById('cd-m');
  var sEl = document.getElementById('cd-s');
  if (!dEl) return;
  var diff = LAUNCH.getTime() - Date.now();
  if (diff <= 0) {
    dEl.textContent = hEl.textContent = mEl.textContent = sEl.textContent = '00';
    if (!cdLaunched) { cdLaunched = true; triggerLaunch(); }
    return;
  }
  var ts = Math.floor(diff / 1000);
  var newS = cdPad(ts % 60);
  if (sEl.textContent !== newS) {
    sEl.classList.add('tick');
    setTimeout(function() { sEl.classList.remove('tick'); }, 130);
  }
  dEl.textContent = cdPad(Math.floor(ts / 86400));
  hEl.textContent = cdPad(Math.floor((ts % 86400) / 3600));
  mEl.textContent = cdPad(Math.floor((ts % 3600) / 60));
  sEl.textContent = newS;
}
cdTick();
setInterval(cdTick, 1000);

// ─── DOM READY ───────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.04, rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(function(el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('in'); });
  }
  setTimeout(function() {
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el) { el.classList.add('in'); });
  }, 2000);

  // Option pills
  var sel = {};
  document.querySelectorAll('[data-group]').forEach(function(grid) {
    var g = grid.dataset.group;
    var multi = grid.classList.contains('multi');
    sel[g] = multi ? [] : '';
    grid.querySelectorAll('.opt').forEach(function(pill) {
      pill.addEventListener('click', function() {
        if (multi) {
          pill.classList.toggle('on');
          var v = pill.dataset.value;
          if (pill.classList.contains('on')) {
            if (sel[g].indexOf(v) === -1) sel[g].push(v);
          } else {
            sel[g] = sel[g].filter(function(x) { return x !== v; });
          }
        } else {
          grid.querySelectorAll('.opt').forEach(function(p) { p.classList.remove('on'); });
          pill.classList.add('on');
          sel[g] = pill.dataset.value;
        }
      });
    });
  });

  function getVal(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function setStatus(msg, type) {
    var s = document.getElementById('statusMsg');
    s.textContent = msg;
    s.className = 'status-msg' + (type ? ' ' + type : '');
  }
  function disableBtn() { document.getElementById('submitBtn').disabled = true; }
  function enableBtn()  { document.getElementById('submitBtn').disabled = false; }
  function showSuccess() {
    document.getElementById('formBody').style.display = 'none';
    document.getElementById('successView').classList.add('show');
    document.getElementById('surveyCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  document.getElementById('submitBtn').addEventListener('click', function() {
    if (!getVal('f_name'))          { setStatus('Please enter your full name.', 'err'); return; }
    if (!isEmail(getVal('f_email'))){ setStatus('Please enter a valid email address.', 'err'); return; }
    if (!getVal('f_role'))          { setStatus('Please enter your current role.', 'err'); return; }
    if (!sel['yrs'])                { setStatus('Please select your years of experience.', 'err'); return; }
    if (!sel['ml'])                 { setStatus('Please select your ML experience level.', 'err'); return; }
    if (!getVal('f_proj'))          { setStatus('Please describe a project you\'ve built.', 'err'); return; }
    if (!getVal('f_why'))           { setStatus('Please answer the beta fit question.', 'err'); return; }
    if (!sel['commit'])             { setStatus('Please answer the commitment question.', 'err'); return; }

    disableBtn();
    setStatus('Submitting your application...');

    var payload = JSON.stringify({
      timestamp:  new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' }),
      name:       getVal('f_name'),
      email:      getVal('f_email'),
      role:       getVal('f_role'),
      links:      getVal('f_links') || '-',
      yrs:        sel['yrs'] || '-',
      ml:         sel['ml'] || '-',
      frameworks: (sel['fw'] && sel['fw'].length) ? sel['fw'].join(', ') : '-',
      project:    getVal('f_proj') || '-',
      helpers:    sel['helpers'] || '-',
      why:        getVal('f_why') || '-',
      commit:     sel['commit'] || '-'
    });

    var data = JSON.parse(payload);
    var params = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');

    fetch(APPS_SCRIPT_URL + '?' + params, {
      method: 'GET',
      mode:   'no-cors'
    })
    .then(function() { showSuccess(); })
    .catch(function(err) {
      console.error(err);
      setStatus('Network error. Please email info@aimlse.org if this persists.', 'err');
      enableBtn();
    });
  });

});

// ─── CONFETTI + LAUNCH ───────────────────────
var confettiParts = [], spawnT = 0;
var canvas = document.getElementById('confetti');
var ctx = canvas.getContext('2d');
function rsz() { canvas.width = innerWidth; canvas.height = innerHeight; }
rsz();
window.addEventListener('resize', rsz);
var PAL = ['#c9a84c','#e8c96a','#9e7a22','#f4d03f','#fff8dc','#ffffff','#d4ac0d','#ffeaa0'];
function mkP() {
  return { x: Math.random()*canvas.width, y: -20-Math.random()*40, w: Math.random()*10+4, h: Math.random()*14+5, vx: (Math.random()-.5)*3.8, vy: Math.random()*3.4+2, rot: Math.random()*Math.PI*2, vr: (Math.random()-.5)*.15, color: PAL[Math.floor(Math.random()*PAL.length)], alpha: 1, shape: ['rect','circle','ribbon'][Math.floor(Math.random()*3)] };
}
function drawP(p) {
  ctx.save(); ctx.globalAlpha = p.alpha; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
  if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0,0,p.w/2,0,Math.PI*2); ctx.fill(); }
  else if (p.shape === 'ribbon') { ctx.beginPath(); ctx.moveTo(-p.w/2,-p.h/2); ctx.lineTo(p.w/2,-p.h/4); ctx.lineTo(p.w/2,p.h/2); ctx.lineTo(-p.w/2,p.h/4); ctx.closePath(); ctx.fill(); }
  else { ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); }
  ctx.restore();
}
function animConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (spawnT < 170) { var n = spawnT < 75 ? 22 : 7; for (var i = 0; i < n; i++) confettiParts.push(mkP()); spawnT++; }
  confettiParts.forEach(function(p) { p.x+=p.vx; p.y+=p.vy; p.vy+=.058; p.vx*=.997; p.rot+=p.vr; if(p.y>canvas.height*.68) p.alpha-=.02; drawP(p); });
  confettiParts = confettiParts.filter(function(p) { return p.alpha > 0; });
  if (confettiParts.length || spawnT < 170) requestAnimationFrame(animConfetti);
  else ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function triggerLaunch() {
  spawnT = 0; confettiParts = []; animConfetti();
  setTimeout(function() { document.getElementById('unlock').classList.add('show'); }, 900);
  setTimeout(function() { window.location.href = 'lp.html'; }, 3200);
}
// setTimeout(function(){ triggerLaunch(); }, 2000); // DEV TEST