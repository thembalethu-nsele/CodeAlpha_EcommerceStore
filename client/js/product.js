let currentProduct = null;

async function loadProduct() {
  const id = new URLSearchParams(window.location.search).get('id');
  const box = document.getElementById('detail');
  const { ok, data } = await apiFetch('/products/' + id);
  if (!ok) { box.innerHTML = '<p class="msg">Product not found.</p>'; return; }

  currentProduct = data;
  const image = data.imageUrl
    ? `<img src="${esc(data.imageUrl)}" alt="${esc(data.name)}" />`
    : '<div class="no-img">No image</div>';

  box.innerHTML = `
    <div class="detail">
      ${image}
      <div>
        <h2>${esc(data.name)}</h2>
        <p class="price">${money(data.price)}</p>
        <p style="margin:12px 0">${esc(data.description)}</p>
        <p>Category: ${esc(data.category)}</p>
        <p class="stock">${data.stock > 0 ? data.stock + ' in stock' : 'Out of stock'}</p>
        <div style="margin-top:16px">
          <input type="number" id="qty" class="qty" min="1" max="${data.stock}" value="1" />
          <button class="btn" ${data.stock < 1 ? 'disabled' : ''} onclick="addFromDetail()">Add to cart</button>
        </div>
      </div>
    </div>`;
}

function addFromDetail() {
  const qty = parseInt(document.getElementById('qty').value, 10) || 1;
  addToCart(currentProduct, qty);
}

loadProduct();