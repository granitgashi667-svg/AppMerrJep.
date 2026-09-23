/* =========================================================
   admin.js — Paneli i Adminit
   ========================================================= */

const $ = (id) => document.getElementById(id);

let editingImages = [];   // array me dataURL
let editingId = null;

/* ---------- Zgjidhja e fotove ---------- */
$('fImages').addEventListener('change', async (e) => {
  const files = [...e.target.files];
  for (const f of files) {
    const dataUrl = await DB.fileToDataURL(f);
    editingImages.push(dataUrl);
  }
  renderThumbs();
  e.target.value = '';
});

function renderThumbs() {
  const t = $('thumbs');
  t.innerHTML = '';
  editingImages.forEach((src, i) => {
    const div = document.createElement('div');
    div.className = 'thumb';
    div.innerHTML = `<img src="${src}" /><button type="button" data-i="${i}">×</button>`;
    t.appendChild(div);
  });
  t.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      editingImages.splice(+btn.dataset.i, 1);
      renderThumbs();
    });
  });
}

/* ---------- Reset ---------- */
function resetForm() {
  ['fBrand','fModel','fYear','fPrice','fKm','fDesc'].forEach(id => $(id).value = '');
  $('fFuel').value = 'Benzinë';
  $('fTrans').value = 'Automatik';
  $('fStatus').value = 'available';
  editingImages = [];
  editingId = null;
  renderThumbs();
}
$('resetBtn').addEventListener('click', resetForm);

/* ---------- Save ---------- */
$('carForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const car = {
    id: editingId || crypto.randomUUID(),
    brand: $('fBrand').value.trim(),
    model: $('fModel').value.trim(),
    year: +$('fYear').value,
    price: +$('fPrice').value,
    km: +$('fKm').value || 0,
    fuel: $('fFuel').value,
    trans: $('fTrans').value,
    status: $('fStatus').value,
    desc: $('fDesc').value.trim(),
    images: editingImages.slice(),
    createdAt: Date.now(),
  };
  await DB.put(car);
  resetForm();
  loadList();
  alert('✅ Makina u ruajt me sukses!');
});

/* ---------- Lista ---------- */
async function loadList() {
  const all = await DB.all();
  $('carCount').textContent = `${all.length} makina`;
  const q = ($('adminSearch').value || '').toLowerCase();
  const list = all.filter(c =>
    !q || `${c.brand} ${c.model} ${c.year}`.toLowerCase().includes(q)
  ).sort((a,b) => b.createdAt - a.createdAt);

  const box = $('adminList');
  box.innerHTML = '';
  if (list.length === 0) {
    box.innerHTML = `<p style="color:var(--text-dim)">Nuk ka makina të ruajtura.</p>`;
    return;
  }

  list.forEach(car => {
    const img = car.images?.[0] || 'assets/placeholder.jpg';
    const card = document.createElement('div');
    card.className = 'admin-card';
    card.innerHTML = `
      <div class="admin-card-img"><img src="${img}" onerror="this.src='assets/placeholder.jpg'" /></div>
      <div class="admin-card-body">
        <div class="admin-card-title">${car.brand} ${car.model} (${car.year})</div>
        <div class="admin-card-info">
          <span>€ ${Number(car.price).toLocaleString('de-DE')}</span>
          <span>${Number(car.km).toLocaleString('de-DE')} km</span>
          <span>${car.status}</span>
        </div>
        <div class="admin-card-actions">
          <button class="btn btn-outline btn-sm" data-edit="${car.id}">✏️ Edito</button>
          <button class="btn btn-danger btn-sm" data-del="${car.id}">🗑 Fshi</button>
        </div>
      </div>
    `;
    box.appendChild(card);
  });

  box.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => editCar(b.dataset.edit)));
  box.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => delCar(b.dataset.del)));
}

async function editCar(id) {
  const car = await DB.get(id);
  if (!car) return;
  editingId = car.id;
  editingImages = car.images ? car.images.slice() : [];
  $('fBrand').value = car.brand;
  $('fModel').value = car.model;
  $('fYear').value = car.year;
  $('fPrice').value = car.price;
  $('fKm').value = car.km;
  $('fFuel').value = car.fuel;
  $('fTrans').value = car.trans;
  $('fStatus').value = car.status;
  $('fDesc').value = car.desc || '';
  renderThumbs();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function delCar(id) {
  if (!confirm('A je i sigurt që do ta fshish këtë makinë?')) return;
  await DB.delete(id);
  loadList();
}

$('clearAllBtn').addEventListener('click', async () => {
  if (!confirm('⚠️ Kjo do të fshijë TË GJITHA makinat. Vazhdo?')) return;
  await DB.clear();
  loadList();
});

$('adminSearch').addEventListener('input', loadList);

/* ---------- Start ---------- */
loadList();
