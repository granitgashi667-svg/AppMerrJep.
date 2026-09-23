/* =========================================================
   main.js — Faqja kryesore: shfaq makinat, filtra, kalkulator
   ========================================================= */

const els = {
  grid: document.getElementById('carsGrid'),
  empty: document.getElementById('emptyState'),
  search: document.getElementById('searchInput'),
  brand: document.getElementById('filterBrand'),
  year: document.getElementById('filterYear'),
  fuel: document.getElementById('filterFuel'),
  sort: document.getElementById('sortBy'),
  burger: document.getElementById('burger'),
  nav: document.getElementById('nav'),
  header: document.getElementById('header'),
};

let ALL_CARS = [];

/* ---------- Ngarko makinat ---------- */
async function loadCars() {
  ALL_CARS = await DB.all();
  // Nëse DB është bosh, krijo 3 shembuj fillestarë (demo)
  if (ALL_CARS.length === 0) {
    ALL_CARS = await seedDemoData();
  }
  populateFilters();
  renderCars();
}

/* ---------- Demo data (për herën e parë) ---------- */
async function seedDemoData() {
  const demo = [
    {
      id: crypto.randomUUID(),
      brand: 'Hyundai', model: 'Tucson', year: 2022, price: 24500,
      km: 32000, fuel: 'Benzinë', trans: 'Automatik',
      status: 'available',
      images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80'],
      desc: 'Hyundai Tucson 2022, gjendje shumë e mirë, shërbime të rregullta.',
      createdAt: Date.now()
    },
    {
      id: crypto.randomUUID(),
      brand: 'Kia', model: 'Sportage', year: 2021, price: 21900,
      km: 48000, fuel: 'Dizel', trans: 'Automatik',
      status: 'available',
      images: ['https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80'],
      desc: 'Kia Sportage 2021, 4x4, ambiente e ruajtur mirë.',
      createdAt: Date.now() - 1000
    },
    {
      id: crypto.randomUUID(),
      brand: 'Genesis', model: 'G70', year: 2020, price: 28900,
      km: 61000, fuel: 'Benzinë', trans: 'Automatik',
      status: 'reserved',
      images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80'],
      desc: 'Genesis G70, luksoz, shumë i pajisur.',
      createdAt: Date.now() - 2000
    },
  ];
  for (const c of demo) await DB.put(c);
  return demo;
}

/* ---------- Mbush filtrat ---------- */
function populateFilters() {
  const brands = [...new Set(ALL_CARS.map(c => c.brand).filter(Boolean))].sort();
  els.brand.innerHTML = '<option value="">Të gjitha markat</option>' +
    brands.map(b => `<option>${b}</option>`).join('');

  const years = [...new Set(ALL_CARS.map(c => c.year).filter(Boolean))].sort((a,b) => b-a);
  els.year.innerHTML = '<option value="">Çdo vit</option>' +
    years.map(y => `<option>${y}</option>`).join('');
}

/* ---------- Filtro dhe rendit ---------- */
function getFiltered() {
  const q = els.search.value.trim().toLowerCase();
  const b = els.brand.value;
  const y = els.year.value;
  const f = els.fuel.value;
  const s = els.sort.value;

  let out = ALL_CARS.filter(c => {
    const text = `${c.brand} ${c.model} ${c.year}`.toLowerCase();
    return (!q || text.includes(q))
      && (!b || c.brand === b)
      && (!y || String(c.year) === String(y))
      && (!f || c.fuel === f);
  });

  if (s === 'price-asc') out.sort((a,b) => a.price - b.price);
  else if (s === 'price-desc') out.sort((a,b) => b.price - a.price);
  else if (s === 'year-desc') out.sort((a,b) => b.year - a.year);
  else out.sort((a,b) => b.createdAt - a.createdAt);

  return out;
}

/* ---------- Render kartat ---------- */
function renderCars() {
  const list = getFiltered();
  els.grid.innerHTML = '';
  els.empty.hidden = list.length > 0;

  list.forEach(car => {
    const img = (car.images && car.images[0]) || 'assets/placeholder.jpg';
    const statusLabel = car.status === 'sold' ? 'Shitur'
                      : car.status === 'reserved' ? 'Rezervuar' : '';
    const card = document.createElement('article');
    card.className = 'car-card';
    card.innerHTML = `
      <div class="car-img-wrap">
        <img src="${img}" alt="${car.brand} ${car.model}" loading="lazy"
             onerror="this.src='assets/placeholder.jpg'" />
        ${statusLabel ? `<span class="car-badge ${car.status}">${statusLabel}</span>` : ''}
        <span class="car-price">€ ${Number(car.price).toLocaleString('de-DE')}</span>
      </div>
      <div class="car-body">
        <h3 class="car-title">${car.brand} ${car.model}</h3>
        <div class="car-meta">
          <span>📅 ${car.year}</span>
          <span>🛣 ${Number(car.km).toLocaleString('de-DE')} km</span>
          <span>⛽ ${car.fuel}</span>
          <span>⚙️ ${car.trans}</span>
        </div>
        <div class="car-actions">
          <a href="car.html?id=${car.id}" class="btn btn-primary btn-sm">Detaje</a>
          <button class="btn btn-outline btn-sm" data-gallery="${car.id}">Fotot</button>
        </div>
      </div>
    `;
    els.grid.appendChild(card);
  });

  // Butoni "Fotot" hap lightbox
  els.grid.querySelectorAll('[data-gallery]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.gallery;
      const car = ALL_CARS.find(c => c.id === id);
      if (car && car.images?.length) {
        window.Lightbox?.open(car.images, 0);
      }
    });
  });
}

/* ---------- Filtra: event listeners ---------- */
['input','change'].forEach(evt => {
  els.search?.addEventListener(evt, renderCars);
  els.brand?.addEventListener(evt, renderCars);
  els.year?.addEventListener(evt, renderCars);
  els.fuel?.addEventListener(evt, renderCars);
  els.sort?.addEventListener(evt, renderCars);
});

/* ---------- Burger menu ---------- */
els.burger?.addEventListener('click', () => els.nav.classList.toggle('open'));

/* ---------- Header scroll ---------- */
window.addEventListener('scroll', () => {
  els.header.classList.toggle('scrolled', window.scrollY > 40);
});

/* ---------- Kalkulator ---------- */
const calc = {
  price: document.getElementById('calcPrice'),
  ship: document.getElementById('calcShip'),
  tax: document.getElementById('calcTax'),
  total: document.getElementById('calcTotal'),
};
function updateCalc() {
  const p = +calc.price.value || 0;
  const s = +calc.ship.value || 0;
  const t = +calc.tax.value || 0;
  const total = p + s + (p * t / 100);
  calc.total.textContent = '€ ' + total.toLocaleString('de-DE', { maximumFractionDigits: 0 });
}
[calc.price, calc.ship, calc.tax].forEach(el => el?.addEventListener('input', updateCalc));
updateCalc();

/* ---------- Viti në footer ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Start ---------- */
loadCars();
