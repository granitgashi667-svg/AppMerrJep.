/* Inicializimi i Swiper-it për hero-n */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.hero-swiper', {
    loop: true,
    speed: 1200,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    autoplay: { delay: 6000, disableOnInteraction: false },
    pagination: { el: '.hero-swiper .swiper-pagination', clickable: true },
    navigation: {
      nextEl: '.hero-swiper .swiper-button-next',
      prevEl: '.hero-swiper .swiper-button-prev',
    },
  });
});
