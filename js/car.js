(async () => {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const root = document.getElementById('carDetail');

  if (!id) { root.innerHTML = '<p>Makina nuk u gjet.</p>'; return; }
  const car = await DB.get(id);
  if (!car) { root.innerHTML = '<p>Makina nuk ekziston.</p>'; return; }

  document.title = `${car.brand} ${car.model} (${car.year}) — Auto Kosova`;

  const images = car.images?.length ? car.images : ['assets/placeholder.jpg'];

  root.innerHTML = `
    <div class="car-detail">
      <div class="car-gallery">
        <div class="car-main-img">
          <img id="mainImg" src="${images[0]}" alt="${car.brand} ${car.model}" />
        </div>
        <div class="car-thumbs" id="detailThumbs">
          ${images.map((src, i) => `
            <button class="dthumb ${i===0?'active':''}" data-src="${src}">
              <img src="${src}" />
            </button>`).join('')}
        </div>
      </div>

      <div class="car-info">
        <span class="section-tag">${car.status === 'available' ? 'Në dispozicion' : car.status === 'reserved' ? 'Rezervuar' : 'Shitur'}</span>
        <h1 class="section-title">${car.brand} ${car.model}</h1>
        <p class="car-price-big">€ ${Number(car.price).toLocaleString('de-DE')}</p>

        <ul class="spec-list">
          <li><span>Viti</span><strong>${car.year}</strong></li>
          <li><span>Kilometrazhi</span><strong>${Number(car.km).toLocaleString('de-DE')} km</strong></li>
          <li><span>Karburanti</span><strong>${car.fuel}</strong></li>
          <li><span>Transmisioni</span><strong>${car.trans}</strong></li>
        </ul>

        ${car.desc ? `<p class="car-desc">${car.desc}</p>` : ''}

        <div class="car-cta">
          <a class="btn btn-primary btn-lg" target="_blank"
             href="https://wa.me/38344123456?text=${encodeURIComponent('Përshëndetje, jam i interesuar për '+car.brand+' '+car.model+' ('+car.year+')')}">
            📱 WhatsApp
          </a>
          <button class="btn btn-outline btn-lg" id="openGallery">🖼 Shiko të gjitha fotot</button>
        </div>
      </div>
    </div>
  `;

  // Ndrysho main img me klik në thumbnail
  document.querySelectorAll('.dthumb').forEach(b => {
    b.addEventListener('click', () => {
      document.getElementById('mainImg').src = b.dataset.src;
      document.querySelectorAll('.dthumb').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  // Lightbox
  document.getElementById('openGallery').addEventListener('click', () => {
    window.Lightbox.open(images, 0);
  });
  document.getElementById('mainImg').addEventListener('click', () => {
    window.Lightbox.open(images, 0);
  });
})();
