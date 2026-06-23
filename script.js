// mobile menu
const btn = document.querySelector('.menu-btn');
const links = document.querySelector('.links');
function setMenu(open){
  links.classList.toggle('open', open);
  btn.setAttribute('aria-expanded', open);
}
btn && btn.addEventListener('click', () => setMenu(!links.classList.contains('open')));
links && links.addEventListener('click', e => {
  if (e.target.tagName === 'A') setMenu(false);
});
// close on outside click / Esc
document.addEventListener('click', e => {
  if (links.classList.contains('open') && !e.target.closest('.nav')) setMenu(false);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// back to top
const toTop = document.getElementById('toTop');
addEventListener('scroll', () => {
  toTop.classList.toggle('show', scrollY > 600);
});
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

// lightbox
const figs = [...document.querySelectorAll('.figrid figure img')];
const lb = document.getElementById('lightbox');
const lbImg = lb.querySelector('.lb-img');
const lbCount = lb.querySelector('.lb-count');
let idx = 0;
function showLb(i){
  idx = (i + figs.length) % figs.length;
  lbImg.src = figs[idx].src;
  lbCount.textContent = `${idx + 1} / ${figs.length}`;
}
function openLb(i){ showLb(i); lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); }
function closeLb(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); }
figs.forEach((img, i) => img.addEventListener('click', () => openLb(i)));
lb.querySelector('.lb-close').addEventListener('click', closeLb);
lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); showLb(idx + 1); });
lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); showLb(idx - 1); });
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowRight') showLb(idx + 1);
  if (e.key === 'ArrowLeft') showLb(idx - 1);
});

// active nav highlight
const navlinks = [...document.querySelectorAll('.links a')];
const map = {};
navlinks.forEach(a => map[a.getAttribute('href').slice(1)] = a);
const obs = new IntersectionObserver(entries => {
  entries.forEach(en => {
    const a = map[en.target.id];
    if (a && en.isIntersecting) {
      navlinks.forEach(x => x.style.color = '');
      a.style.color = 'var(--red)';
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach(s => obs.observe(s));
