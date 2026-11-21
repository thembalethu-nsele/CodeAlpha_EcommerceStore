let adminProducts = [];
let editingId = null;

function setMsg(text) { document.getElementById('msg').textContent = text || ''; }

function resetForm() {
  editingId = null;
  ['p-name', 'p-category', 'p-price', 'p-stock', 'p-image', 'p-description']
    .forEach((id) => (document.getElementById(id).value = ''));
  document.getElementById('form-title').textContent = 'Add product';
  document.getElementById('save-btn').textContent = 'Add product';
  setMsg('');
}

async function loadAdminProducts() {
  const { ok, data } = await apiFetch('/products');
  const box = document.getElementById('admin-products');
  if (!ok) { box.innerHTML = '<p class="msg">' + esc(data.message) + '</p>'; return; }
  adminProducts = data;
  box.innerHTML = data.length ? `
    <table>
      <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th></th></tr></thead>
      <tbody>
        ${data.map((p) => `
          <tr>
            <td>${esc(p.name)}</td>
            <td>${esc(p.category)}</td>
            <td>${money(p.price)}</td>
            <td>${p.stock}</td>
            <td>
              <button class="btn btn-sm" onclick="editProduct('${p._id}')">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p._id}')">Delete</button>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>` : '<p>No products yet.</p>';
}

function editProduct(id) {
  const p = adminProducts.find((x) => x._id === id);
  if (!p) return;
  editingId = id;
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-category').value = p.category;
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-stock').value = p.stock;
  document.getElementById('p-image').value = p.imageUrl;
  document.getElementById('p-description').value = p.description;
  document.getElementById('form-title').textContent = 'Edit product';
  document.getElementById('save-btn').textContent = 'Update product';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function saveProduct() {
  const body = {
    name: document.getElementById('p-name').value.trim(),
    category: document.getElementById('p-category').value.trim() || 'General',
    price: Number(document.getElementById('p-price').value),
    stock: Number(document.getElementById('p-stock').value) || 0,
    imageUrl: document.getElementById('p-image').value.trim(),
    description: document.getElementById('p-description').value.trim(),
  };
  if (!body.name || document.getElementById('p-price').value === '') {
    setMsg('Name and price are required');
    return;
  }
  const path = editingId ? '/products/' + editingId : '/products';
  const method = editingId ? 'PUT' : 'POST';
  const { ok, data } = await apiFetch(path, { method, body: JSON.stringify(body) });
  if (!ok) { setMsg(data.message || 'Could not save product'); return; }
  showToast(editingId ? 'Product updated' : 'Product added');
  resetForm();
  loadAdminProducts();
}

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  const { ok, data } = await apiFetch('/products/' + id, { method: 'DELETE' });
  if (!ok) { setMsg(data.message || 'Could not delete product'); return; }
  showToast('Product deleted');
  loadAdminProducts();
}

async function loadAdminOrders() {
  const { ok, data } = await apiFetch('/orders');
  const box = document.getElementById('admin-orders');
  if (!ok) { box.innerHTML = '<p class="msg">' + esc(data.message) + '</p>'; return; }
  const statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  box.innerHTML = data.length ? `
    <table>
      <thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>
        ${data.map((o) => `
          <tr>
            <td>${esc(o._id.slice(-6).toUpperCase())}</td>
            <td>${esc(o.user ? o.user.name : 'Deleted user')}</td>
            <td>${o.items.map((i) => esc(i.name) + ' x ' + i.quantity).join('<br>')}</td>
            <td>${money(o.total)}</td>
            <td>
              <select onchange="updateStatus('${o._id}', this.value)">
                ${statuses.map((s) => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>` : '<p>No orders yet.</p>';
}

async function updateStatus(id, status) {
  const { ok, data } = await apiFetch('/orders/' + id + '/status', {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  showToast(ok ? 'Status updated' : data.message || 'Could not update');
}

// Only admins can use this page (the server also checks this)
const currentUser = getUser();
if (!currentUser || currentUser.role !== 'admin') {
  window.location.href = 'index.html';
} else {
  loadAdminProducts();
  loadAdminOrders();
}