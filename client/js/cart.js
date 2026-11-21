function renderCart() {
  const cart = getCart();
  const box = document.getElementById('cart-box');
  const old = document.getElementById('address');
  const keepAddress = old ? old.value : '';

  if (!cart.length) {
    box.innerHTML = '<p>Your cart is empty. <a href="index.html">Browse products</a></p>';
    return;
  }

  let total = 0;
  const rows = cart.map((i, idx) => {
    const sub = i.price * i.quantity;
    total += sub;
    return `
      <tr>
        <td>${esc(i.name)}</td>
        <td>${money(i.price)}</td>
        <td><input type="number" class="qty" min="1" max="${i.stock}" value="${i.quantity}" onchange="updateQty(${idx}, this.value)" /></td>
        <td>${money(sub)}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeItem(${idx})">Remove</button></td>
      </tr>`;
  }).join('');

  box.innerHTML = `
    <table>
      <thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <h3 class="total">Total: ${money(total)}</h3>
    <textarea id="address" placeholder="Shipping address">${esc(keepAddress)}</textarea>
    <p class="msg" id="msg"></p>
    <button class="btn" onclick="checkout()">Place order</button>`;
}

function updateQty(index, value) {
  const cart = getCart();
  let qty = parseInt(value, 10);
  if (!qty || qty < 1) qty = 1;
  if (qty > cart[index].stock) {
    qty = cart[index].stock;
    showToast('Only ' + qty + ' in stock');
  }
  cart[index].quantity = qty;
  saveCart(cart);
  updateCartCount();
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

async function checkout() {
  const msg = document.getElementById('msg');
  if (!getToken()) { window.location.href = 'login.html'; return; }

  const items = getCart().map((i) => ({ productId: i.productId, quantity: i.quantity }));
  const shippingAddress = document.getElementById('address').value;
  const { ok, data } = await apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify({ items, shippingAddress }),
  });
  if (!ok) { msg.textContent = data.message || 'Could not place order'; return; }

  saveCart([]);
  window.location.href = 'orders.html';
}

renderCart();