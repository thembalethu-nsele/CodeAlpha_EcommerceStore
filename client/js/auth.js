const API = '/api';

// ---------- Session ----------
function getUser() { return JSON.parse(localStorage.getItem('user') || 'null'); }
function getToken() { return localStorage.getItem('token'); }
function saveSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// ---------- Helpers ----------
function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}
function money(n) { return 'R ' + Number(n).toFixed(2); }
function showToast(text) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = text;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2000);
}

async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;
  try {
    const res = await fetch(API + path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401 && token) { logout(); }
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { message: 'Cannot reach the server' } };
  }
}

// ---------- Cart (stored in the browser) ----------
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }
function cartCount() { return getCart().reduce((n, i) => n + i.quantity, 0); }
function updateCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = cartCount();
}
function addToCart(p, qty = 1) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === p._id);
  const current = item ? item.quantity : 0;
  if (current + qty > p.stock) { showToast('Only ' + p.stock + ' in stock'); return; }
  if (item) item.quantity += qty;
  else cart.push({ productId: p._id, name: p.name, price: p.price, imageUrl: p.imageUrl, stock: p.stock, quantity: qty });
  saveCart(cart);
  updateCartCount();
  showToast('Added to cart');
}

// ---------- Navbar ----------
function renderNav() {
  const el = document.getElementById('nav-links');
  if (!el) return;
  const u = getUser();
  let html = '<a href="index.html">Products</a>';
  html += '<a href="cart.html">Cart (<span id="cart-count">' + cartCount() + '</span>)</a>';
  if (u) {
    html += '<a href="orders.html">My Orders</a>';
    if (u.role === 'admin') html += '<a href="admin.html">Admin</a>';
    html += '<span class="hi">Hi, ' + esc(u.name) + '</span>';
    html += '<a href="#" onclick="logout()">Logout</a>';
  } else {
    html += '<a href="login.html">Login</a><a href="register.html">Register</a>';
  }
  el.innerHTML = html;
}

// ---------- Register / Login ----------
async function sendAuth(path, body) {
  const msg = document.getElementById('msg');
  const { ok, data } = await apiFetch('/auth/' + path, { method: 'POST', body: JSON.stringify(body) });
  if (!ok) { msg.textContent = data.message || 'Something went wrong'; return; }
  saveSession(data);
  window.location.href = 'index.html';
}
function register() {
  sendAuth('register', {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  });
}
function login() {
  sendAuth('login', {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  });
}

renderNav();