let products = [];
let categoriesLoaded = false;

function card(p) {
  const image = p.imageUrl
    ? `<img src="${esc(p.imageUrl)}" alt="${esc(p.name)}" />`
    : '<div class="no-img">No image</div>';
  return `
    <div class="card">
      ${image}
      <div class="card-body">
        <h3>${esc(p.name)}</h3>
        <p class="price">${money(p.price)}</p>
        <p class="stock">${p.stock > 0 ? p.stock + ' in stock' : 'Out of stock'}</p>
        <a class="btn btn-outline" href="product.html?id=${p._id}">Details</a>
        <button class="btn" ${p.stock < 1 ? 'disabled' : ''} onclick="addFromList('${p._id}')">Add to cart</button>
      </div>
    </div>`;
}

async function loadProducts() {
  const params = new URLSearchParams();
  const search = document.getElementById('search').value.trim();
  const category = document.getElementById('category').value;
  if (search) params.set('search', search);
  if (category) params.set('category', category);

  const { ok, data } = await apiFetch('/products?' + params.toString());
  const box = document.getElementById('products');
  if (!ok) { box.innerHTML = '<p class="msg">' + esc(data.message) + '</p>'; return; }

  products = data;
  if (!categoriesLoaded) {
    const select = document.getElementById('category');
    [...new Set(data.map((p) => p.category))].forEach((c) => {
      select.innerHTML += `<option value="${esc(c)}">${esc(c)}</option>`;
    });
    categoriesLoaded = true;
  }
  box.innerHTML = products.length ? products.map(card).join('') : '<p>No products found.</p>';
}

function addFromList(id) {
  const p = products.find((x) => x._id === id);
  if (p) addToCart(p, 1);
}

document.getElementById('search').addEventListener('input', loadProducts);
document.getElementById('category').addEventListener('change', loadProducts);
loadProducts();