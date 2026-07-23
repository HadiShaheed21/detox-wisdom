// ---------- mobile menu ----------
const btn = document.querySelector('.menu-btn');
const links = document.querySelector('.links');
function setMenu(open){
  links.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
}
btn && btn.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links && links.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
document.addEventListener('click', e => {
  if (links.classList.contains('open') && !e.target.closest('.nav')) setMenu(false);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ---------- language toggle (ML <-> EN) ----------
const langToggle = document.getElementById('langToggle');
let lang = 'ml';
function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-ml][data-en]').forEach(el => {
    el.textContent = el.dataset[lang];
  });
  langToggle.querySelectorAll('span').forEach((s, i) => {
    s.style.color = (i === (lang === 'ml' ? 0 : 1)) ? 'var(--red)' : '';
  });
}
langToggle && langToggle.addEventListener('click', () => {
  lang = lang === 'ml' ? 'en' : 'ml';
  applyLang();
});
applyLang();

// ---------- detox meter ----------
const DETOX_Q = [
  'ഉണർന്നാൽ ആദ്യം ഫോൺ എടുക്കാറുണ്ടോ?',
  'ദിവസം 4 മണിക്കൂറിൽ കൂടുതൽ സ്ക്രീൻ ടൈം?',
  'ഭക്ഷണം കഴിക്കുമ്പോൾ ഫോൺ ഉപയോഗിക്കാറുണ്ടോ?',
  'നോട്ടിഫിക്കേഷൻ ഇല്ലെങ്കിലും ഇടയ്ക്കിടെ ഫോൺ നോക്കാറുണ്ടോ?',
  'ഉറങ്ങുന്നതിന് തൊട്ടുമുൻപ് സ്ക്രോൾ ചെയ്യാറുണ്ടോ?',
  'ഫോൺ ഇല്ലാതെ ബോറടിക്കുന്നതായി തോന്നാറുണ്ടോ?'
];
const OPTS = [['ഒരിക്കലും', 0], ['ചിലപ്പോൾ', 1], ['എപ്പോഴും', 2]];
const detoxQs = document.getElementById('detoxQs');
if (detoxQs){
  DETOX_Q.forEach((q, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="q-text">${i + 1}. ${q}</div><div class="opts">` +
      OPTS.map(([label, v]) =>
        `<label><input type="radio" name="q${i}" value="${v}" ${v === 0 ? 'checked' : ''}>${label}</label>`
      ).join('') + '</div>';
    detoxQs.appendChild(li);
  });
  document.getElementById('detoxForm').addEventListener('submit', e => {
    e.preventDefault();
    let score = 0;
    DETOX_Q.forEach((_, i) => {
      const sel = document.querySelector(`input[name="q${i}"]:checked`);
      if (sel) score += +sel.value;
    });
    const pct = Math.round((score / (DETOX_Q.length * 2)) * 100);
    const box = document.getElementById('detoxResult');
    box.hidden = false;
    box.querySelector('.meter-fill').style.width = pct + '%';
    const level = pct < 34 ? 'Low' : pct < 67 ? 'Moderate' : 'High';
    box.querySelector('.detox-score').textContent = `Addiction Level: ${pct}% (${level})`;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

// ---------- dashboard tabs ----------
document.querySelectorAll('.dash-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
  });
});

// ---------- pledge modal + certificate ----------
const modal = document.getElementById('pledgeModal');
function openModal(){ modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
document.getElementById('openPledge')?.addEventListener('click', openModal);
modal?.querySelector('.modal-close').addEventListener('click', closeModal);
modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

// auto popup once when scrolled to bottom
let popped = false;
addEventListener('scroll', () => {
  if (!popped && innerHeight + scrollY >= document.body.offsetHeight - 40){
    popped = true; openModal();
  }
});

const certLogo = new Image();
certLogo.src = 'assets/image41.webp';   // കുട്ടിക്കളിയല്ല സോഷ്യൽ മീഡിയ logo

document.getElementById('pledgeForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('pledgeName').value.trim() || 'Friend';
  const cv = document.getElementById('certCanvas');
  const ctx = cv.getContext('2d');
  // make sure brand font is ready before drawing to canvas
  try { await document.fonts.load('700 30px "Baloo Chettan 2"'); } catch (_) {}

  // ---- light theme background ----
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 1000, 700);
  ctx.fillStyle = '#f6f7f9'; ctx.fillRect(40, 40, 920, 620);
  ctx.strokeStyle = '#e8192c'; ctx.lineWidth = 8; ctx.strokeRect(24, 24, 952, 652);
  ctx.textAlign = 'center';

  // campaign logo (smaller: 260px wide, top-centered)
  let textY = 250;
  if (certLogo.complete && certLogo.naturalWidth){
    const w = 260, h = w * (certLogo.naturalHeight / certLogo.naturalWidth);
    ctx.drawImage(certLogo, 500 - w / 2, 80, w, h);
    textY = 80 + h + 60;
  }
  ctx.fillStyle = '#5b626e'; ctx.font = '22px Inter, sans-serif';
  ctx.fillText('This certifies that', 500, textY);
  ctx.fillStyle = '#16181d'; ctx.font = 'bold 52px Inter, sans-serif';
  ctx.fillText(name, 500, textY + 70);
  ctx.fillStyle = '#3a4150'; ctx.font = '20px Inter, sans-serif';
  ctx.fillText('has pledged to use social media responsibly and to', 500, textY + 135);
  ctx.fillText('protect children from unregulated access.', 500, textY + 170);
  ctx.fillStyle = '#e8192c'; ctx.font = '700 28px "Baloo Chettan 2", sans-serif';
  ctx.fillText('WISDOM STUDENTS', 500, 618);

  // trigger download directly
  const a = document.createElement('a');
  a.download = 'pledge-certificate.png';
  a.href = cv.toDataURL('image/png');
  a.click();
});

// ---------- back to top ----------
const toTop = document.getElementById('toTop');
addEventListener('scroll', () => { toTop.classList.toggle('show', scrollY > 600); });
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- active nav highlight ----------
const navlinks = [...document.querySelectorAll('.links a')];
const map = {};
navlinks.forEach(a => map[a.getAttribute('href').slice(1)] = a);
const obs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    const a = map[en.target.id];
    if (a && en.isIntersecting){
      navlinks.forEach(x => x.style.color = '');
      a.style.color = 'var(--red)';
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
