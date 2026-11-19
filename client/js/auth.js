const API = '/api/auth';

function saveSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

async function sendAuth(path, body) {
  const msg = document.getElementById('msg');
  try {
    const res = await fetch(`${API}/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      msg.textContent = data.message || 'Something went wrong';
      return;
    }
    saveSession(data);
    window.location.href = 'index.html';
  } catch {
    msg.textContent = 'Cannot reach the server';
  }
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

// Show different links in the navbar depending on login state
const user = JSON.parse(localStorage.getItem('user') || 'null');
const links = document.getElementById('nav-links');
if (links) {
  links.innerHTML = user
    ? `<span style="color:#fff">Hi, ${user.name}</span> <a href="#" onclick="logout()">Logout</a>`
    : `<a href="login.html">Login</a><a href="register.html">Register</a>`;
}