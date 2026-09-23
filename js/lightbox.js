/* Lightbox i thjeshtë për galerinë e fotove */
(() => {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  const img = lb.querySelector('.lb-img');
  const btnClose = lb.querySelector('.lb-close');
  const btnPrev = lb.querySelector('.lb-prev');
  const btnNext = lb.querySelector('.lb-next');

  let images = [];
  let current = 0;

  function show(i) {
    current = (i + images.length) % images.length;
    img.src = images[current];
  }

  function open(list, start = 0) {
    images = list;
    show(start);
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('open'));
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; img.src = ''; }, 300);
  }

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  window.Lightbox = { open, close };
})();
