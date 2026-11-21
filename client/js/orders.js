async function loadOrders() {
  if (!getToken()) { window.location.href = 'login.html'; return; }
  const box = document.getElementById('orders');
  const { ok, data } = await apiFetch('/orders/mine');
  if (!ok) { box.innerHTML = '<p class="msg">' + esc(data.message) + '</p>'; return; }
  if (!data.length) { box.innerHTML = '<p>You have no orders yet.</p>'; return; }

  box.innerHTML = data.map((o) => `
    <div class="order">
      <p><strong>Order ${esc(o._id.slice(-6).toUpperCase())}</strong>
         <span class="badge">${esc(o.status)}</span></p>
      <p class="stock">${new Date(o.createdAt).toLocaleString()}</p>
      <ul>
        ${o.items.map((i) => `<li>${esc(i.name)} x ${i.quantity} (${money(i.priceAtPurchase)} each)</li>`).join('')}
      </ul>
      <p>Ship to: ${esc(o.shippingAddress)}</p>
      <p class="price">Total: ${money(o.total)}</p>
    </div>`).join('');
}

loadOrders();