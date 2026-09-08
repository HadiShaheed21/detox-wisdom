(() => {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // image62 is the Wisdom Students logo artwork, not a campaign photograph.
  const images = Array.from({ length: 79 }, (_, index) => index + 1)
    .filter(number => number !== 62)
    .map(number => ({
      number,
      group: ['people', 'place', 'detail'][(number - 1) % 3]
    }));
  const groupNames = { people: 'People & connection', place: 'Places to be', detail: 'Small details' };
  const more = document.getElementById('galleryMore');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const caption = document.getElementById('lightboxCaption');
  let filter = 'all';
  let shown = 12;

  function visibleImages() {
    return images.filter(image => filter === 'all' || image.group === filter);
  }

  function openImage(image) {
    lightboxImage.src = `assets/image${image.number}.webp`;
    lightboxImage.alt = `${groupNames[image.group]} — gallery image ${image.number}`;
    caption.textContent = `${groupNames[image.group]} · FRAME ${String(image.number).padStart(2, '0')}`;
    lightbox.showModal();
  }

  function render() {
    const visible = visibleImages();
    grid.innerHTML = '';
    visible.slice(0, shown).forEach(image => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'gallery-item';
      card.setAttribute('aria-label', `Open ${groupNames[image.group]}, image ${image.number}`);
      card.innerHTML = `<img src="assets/image${image.number}.webp" alt="" loading="lazy"><span>FRAME ${String(image.number).padStart(2, '0')} · ${image.group.toUpperCase()}</span>`;
      card.addEventListener('click', () => openImage(image));
      grid.appendChild(card);
    });
    more.hidden = shown >= visible.length;
    more.innerHTML = `See ${Math.min(12, visible.length - shown)} more frame${visible.length - shown === 1 ? '' : 's'} <span>↓</span>`;
  }

  document.querySelectorAll('.gallery-filter').forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    shown = 12;
    document.querySelectorAll('.gallery-filter').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', active);
    });
    render();
  }));
  more.addEventListener('click', () => { shown += 12; render(); });
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  render();
})();
