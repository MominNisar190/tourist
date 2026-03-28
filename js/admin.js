'use strict';

const API = 'http://localhost:5000/api';

// ── Elements ──────────────────────────────────────────────
const loginScreen    = document.getElementById('admin-login-screen');
const dashboard      = document.getElementById('admin-dashboard');
const loginForm      = document.getElementById('admin-login-form');
const loginErr       = document.getElementById('a-login-err');
const loginBtn       = document.getElementById('a-login-btn');
const adminWelcome   = document.getElementById('admin-welcome');
const panelTitle     = document.getElementById('panel-title');
const logoutBtn      = document.getElementById('admin-logout');
const sidebarLinks   = document.querySelectorAll('.sidebar-link');
const panels         = document.querySelectorAll('.admin-panel');

// Messages
const msgsTbody  = document.getElementById('messages-tbody');
const msgEmpty   = document.getElementById('msg-empty');
const msgCount   = document.getElementById('msg-count');
const msgSearch  = document.getElementById('msg-search');

// Users
const usersTbody = document.getElementById('users-tbody');
const userEmpty  = document.getElementById('user-empty');
const userCount  = document.getElementById('user-count');
const userSearch = document.getElementById('user-search');

let allMessages = [];
let allUsers    = [];

// ── Auth ──────────────────────────────────────────────────
function getToken() { return localStorage.getItem('adv_admin_token'); }
function setToken(t) { localStorage.setItem('adv_admin_token', t); }
function clearToken() { localStorage.removeItem('adv_admin_token'); }

function showDashboard(username) {
  loginScreen.style.display = 'none';
  dashboard.style.display   = 'flex';
  adminWelcome.textContent  = `Welcome, ${username}`;
  loadMessages();
}

// Check existing session
const existingToken = getToken();
if (existingToken) {
  try {
    const payload = JSON.parse(atob(existingToken.split('.')[1]));
    if (payload.exp * 1000 > Date.now()) showDashboard(payload.username || 'Admin');
    else clearToken();
  } catch { clearToken(); }
}

// Login form
loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  loginErr.textContent = '';
  const username = document.getElementById('a-username').value.trim();
  const password = document.getElementById('a-password').value;
  if (!username || !password) { loginErr.textContent = 'Both fields required.'; return; }

  loginBtn.disabled = true;
  loginBtn.querySelector('.btn-label').textContent = 'Logging in...';

  try {
    const res  = await fetch(`${API}/admin/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    setToken(data.token);
    showDashboard(username);
  } catch (err) {
    loginErr.textContent = err.message;
  } finally {
    loginBtn.disabled = false;
    loginBtn.querySelector('.btn-label').textContent = 'Login';
  }
});

// Logout
logoutBtn.addEventListener('click', () => {
  clearToken();
  dashboard.style.display   = 'none';
  loginScreen.style.display = 'flex';
});

// ── Sidebar navigation ────────────────────────────────────
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebarLinks.forEach(l => l.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    link.classList.add('active');
    const panelId = `panel-${link.dataset.panel}`;
    document.getElementById(panelId).classList.add('active');
    panelTitle.textContent = link.dataset.panel.charAt(0).toUpperCase() + link.dataset.panel.slice(1);
    if (link.dataset.panel === 'users') loadUsers();
  });
});

// ── Messages ──────────────────────────────────────────────
async function loadMessages() {
  try {
    const res  = await fetch(`${API}/admin/messages`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (res.status === 401) { clearToken(); location.reload(); return; }
    allMessages = await res.json();
    renderMessages(allMessages);
  } catch {
    msgsTbody.innerHTML = '<tr><td colspan="11" style="color:#ff4d4d;padding:1rem">Failed to load messages</td></tr>';
  }
}

function renderMessages(data) {
  msgCount.textContent = `${data.length} record${data.length !== 1 ? 's' : ''}`;
  if (!data.length) { msgEmpty.style.display = 'block'; msgsTbody.innerHTML = ''; return; }
  msgEmpty.style.display = 'none';
  msgsTbody.innerHTML = data.map((m, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(m.name)}</td>
      <td><a href="mailto:${esc(m.email)}" style="color:#fc036b">${esc(m.email)}</a></td>
      <td><a href="tel:${esc(m.phone)}" style="color:#fc036b">${esc(m.phone)}</a></td>
      <td>${m.tour ? `<span class="badge">${esc(m.tour)}</span>` : '—'}</td>
      <td style="text-align:center">${m.guests || 1}</td>
      <td style="white-space:nowrap">${m.travelDate ? esc(m.travelDate) : '—'}</td>
      <td>${m.country ? `<span class="badge">${esc(m.country)}</span>` : '—'}</td>
      <td class="msg-text" title="${esc(m.message)}">${m.message ? esc(m.message) : '—'}</td>
      <td style="white-space:nowrap;color:rgba(255,255,255,0.4)">${formatDate(m.createdAt)}</td>
      <td><button class="del-btn" onclick="deleteMessage('${m._id}')"><i class="fa fa-trash"></i> Delete</button></td>
    </tr>
  `).join('');
}

msgSearch.addEventListener('input', () => {
  const q = msgSearch.value.toLowerCase();
  renderMessages(allMessages.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.email.toLowerCase().includes(q) ||
    m.message.toLowerCase().includes(q)
  ));
});

async function deleteMessage(id) {
  if (!confirm('Delete this message?')) return;
  try {
    await fetch(`${API}/admin/messages/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` }
    });
    allMessages = allMessages.filter(m => m._id !== id);
    renderMessages(allMessages);
  } catch { alert('Failed to delete'); }
}
window.deleteMessage = deleteMessage;

// ── Users ─────────────────────────────────────────────────
async function loadUsers() {
  try {
    const res  = await fetch(`${API}/admin/users`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    allUsers = await res.json();
    renderUsers(allUsers);
  } catch {
    usersTbody.innerHTML = '<tr><td colspan="5" style="color:#ff4d4d;padding:1rem">Failed to load users</td></tr>';
  }
}

function renderUsers(data) {
  userCount.textContent = `${data.length} user${data.length !== 1 ? 's' : ''}`;
  if (!data.length) { userEmpty.style.display = 'block'; usersTbody.innerHTML = ''; return; }
  userEmpty.style.display = 'none';
  usersTbody.innerHTML = data.map((u, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${esc(u.name)}</td>
      <td><a href="mailto:${esc(u.email)}" style="color:#fc036b">${esc(u.email)}</a></td>
      <td style="color:rgba(255,255,255,0.4)">${formatDate(u.createdAt)}</td>
      <td><button class="del-btn" onclick="deleteUser('${u._id}')"><i class="fa fa-trash"></i> Delete</button></td>
    </tr>
  `).join('');
}

async function deleteUser(id) {
  if (!confirm('Delete this user? This cannot be undone.')) return;
  try {
    await fetch(`${API}/admin/users/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` }
    });
    allUsers = allUsers.filter(u => u._id !== id);
    renderUsers(allUsers);
  } catch { alert('Failed to delete user'); }
}
window.deleteUser = deleteUser;

userSearch.addEventListener('input', () => {
  const q = userSearch.value.toLowerCase();
  renderUsers(allUsers.filter(u =>
    u.name.toLowerCase().includes(q) ||
    u.email.toLowerCase().includes(q)
  ));
});

// ── Helpers ───────────────────────────────────────────────
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}
