'use strict';

/* ===== Page Loader ===== */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  setTimeout(() => loader.classList.add('hidden'), 1500);
  document.getElementById('footer-year').textContent = new Date().getFullYear();
});

/* ===== Dark / Light Mode ===== */
const checkbox = document.getElementById('checkbox');

function applyTheme(isDark) {
  document.body.classList.toggle('light', !isDark);
  checkbox.checked = isDark;
}

const savedTheme = localStorage.getItem('adv_darkmode');
applyTheme(savedTheme === null ? true : savedTheme === 'true');

checkbox.addEventListener('change', () => {
  const isDark = checkbox.checked;
  applyTheme(isDark);
  localStorage.setItem('adv_darkmode', isDark);
});

/* ===== Mobile Menu ===== */
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', false);
  });
});

/* ===== Navbar scroll style ===== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ===== Active nav link on scroll ===== */
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links li a[data-section]');

function updateActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.45) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.dataset.section === current);
  });
}
window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

/* ===== Scroll to top ===== */
const upBtn = document.getElementById('upbtn');
window.addEventListener('scroll', () => {
  upBtn.classList.toggle('visible', window.scrollY > 300);
}, { passive: true });
upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ===== Reveal on scroll ===== */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ===== Hero Particles ===== */
const particleContainer = document.getElementById('particles');
function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 8 + 4;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}%;
    bottom:-${size}px;
    animation-duration:${Math.random() * 8 + 6}s;
    animation-delay:${Math.random() * 4}s;
    opacity:${Math.random() * 0.5 + 0.2};
  `;
  particleContainer.appendChild(p);
  setTimeout(() => p.remove(), 14000);
}
setInterval(createParticle, 600);

/* ===== Stats Counter ===== */
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current).toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 16);
    statsObserver.unobserve(el);
  });
}, { threshold: 0.4 });
statNumbers.forEach(el => statsObserver.observe(el));

/* ===== Event Filter ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const eventCards = document.querySelectorAll('.events-row .card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    eventCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ===== Gallery Lightbox ===== */
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
let currentLightboxIndex = 0;

const galleryImages = Array.from(galleryItems).map(item => ({
  src: item.querySelector('img').src,
  alt: item.querySelector('img').alt
}));

function openLightbox(index) {
  currentLightboxIndex = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
function shiftLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
  lightboxImg.src = galleryImages[currentLightboxIndex].src;
  lightboxImg.alt = galleryImages[currentLightboxIndex].alt;
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i); });
});
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => shiftLightbox(-1));
lightboxNext.addEventListener('click', () => shiftLightbox(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') shiftLightbox(-1);
  if (e.key === 'ArrowRight') shiftLightbox(1);
});

/* ===== Testimonials Slider ===== */
const track = document.getElementById('testimonial-track');
const dotsContainer = document.getElementById('testimonial-dots');
const testimonialCards = track ? track.querySelectorAll('.testimonial-card') : [];
let tIndex = 0;
let tAuto;

function getVisibleCount() {
  return window.innerWidth <= 850 ? 1 : 2;
}
function totalSlides() {
  return Math.ceil(testimonialCards.length / getVisibleCount());
}
function buildDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides(); i++) {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === tIndex ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}
function goToSlide(i) {
  tIndex = i;
  const pct = (100 / getVisibleCount()) * tIndex;
  track.style.transform = `translateX(-${pct}%)`;
  dotsContainer.querySelectorAll('.t-dot').forEach((d, idx) => d.classList.toggle('active', idx === tIndex));
}
function nextSlide() {
  goToSlide((tIndex + 1) % totalSlides());
}
function startAuto() { tAuto = setInterval(nextSlide, 4000); }
function stopAuto()  { clearInterval(tAuto); }

if (track && testimonialCards.length) {
  buildDots();
  startAuto();
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);
  window.addEventListener('resize', () => { buildDots(); goToSlide(0); });
}

/* ===== Auth Gate ===== */
const API_BASE  = 'http://localhost:5000/api';

/* ===== Booking Form ===== */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    let valid = true;

    function setErr(id, errId, msg) {
      const f = document.getElementById(id);
      const el = document.getElementById(errId);
      if (f)  f.classList.toggle('error', !!msg);
      if (el) el.textContent = msg || '';
      if (msg) valid = false;
    }

    // Clear all errors first
    ['name','email','phone','guests','tour','travel-date'].forEach(id => {
      const errId = id === 'travel-date' ? 'date-error' : `${id}-error`;
      setErr(id, errId, '');
    });
    valid = true; // reset after clearing

    // Validate
    const nameVal   = document.getElementById('name').value.trim();
    const emailVal  = document.getElementById('email').value.trim();
    const phoneVal  = document.getElementById('phone').value.trim();
    const guestsVal = document.getElementById('guests').value;
    const tourVal   = document.getElementById('tour').value;
    const dateVal   = document.getElementById('travel-date').value;
    const countryVal= document.getElementById('country').value;
    const msgVal    = document.getElementById('remarks').value.trim();

    if (!nameVal)  setErr('name',  'name-error',  'Name is required.');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) setErr('email', 'email-error', 'Email is required.');
    else if (!emailRe.test(emailVal)) setErr('email', 'email-error', 'Enter a valid email.');
    if (!phoneVal) setErr('phone', 'phone-error', 'Contact number is required.');
    if (!guestsVal || Number(guestsVal) < 1) setErr('guests', 'guests-error', 'Enter number of guests.');
    if (!tourVal)  setErr('tour',  'tour-error',  'Please select a tour.');
    if (!dateVal)  setErr('travel-date', 'date-error', 'Please select a travel date.');

    if (!valid) return;

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Booking...';

    try {
      const res = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:       nameVal,
          email:      emailVal,
          phone:      phoneVal,
          guests:     Number(guestsVal),
          tour:       tourVal,
          travelDate: dateVal,
          country:    countryVal,
          message:    msgVal
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      contactForm.reset();
      const success = document.getElementById('form-success');
      success.textContent = "Booking confirmed! We'll contact you shortly.";
      success.style.cssText = '';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    } catch (err) {
      const success = document.getElementById('form-success');
      success.textContent = err.message;
      success.style.background = 'rgba(255,60,60,0.1)';
      success.style.borderColor = 'rgba(255,60,60,0.4)';
      success.style.color = '#ff4d4d';
      success.classList.add('show');
      setTimeout(() => { success.classList.remove('show'); success.style.cssText = ''; }, 5000);
    } finally {
      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Book Now';
    }
  });
}

/* ===== Auth Gate ===== */
const authGate  = document.getElementById('auth-gate');
const userPill  = document.getElementById('user-pill');
const userPillName   = document.getElementById('user-pill-name');
const userPillAvatar = document.getElementById('user-pill-avatar');
const signoutBtn     = document.getElementById('signout-btn');

function dismissGate() {
  authGate.classList.add('hidden');
  document.body.style.overflow = '';
}

function syncAuthUI() {
  const token = localStorage.getItem('adv_token');
  const user  = JSON.parse(localStorage.getItem('adv_user') || 'null');
  if (token && user) {
    userPill.style.display    = 'flex';
    userPillName.textContent  = user.name.split(' ')[0];
    userPillAvatar.textContent = user.name.charAt(0).toUpperCase();
    dismissGate();
  } else {
    userPill.style.display = 'none';
    authGate.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}
syncAuthUI();

signoutBtn.addEventListener('click', () => {
  localStorage.removeItem('adv_token');
  localStorage.removeItem('adv_user');
  syncAuthUI();
});

// Gate tab switching
authGate.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    authGate.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    authGate.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    authGate.querySelector(`#gate-${tab.dataset.gateTab}-form`).classList.add('active');
  });
});

// Gate helpers
function gateSetErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg || '';
}
function gateFieldErr(fieldId, errId, msg) {
  const f = document.getElementById(fieldId);
  if (f) f.classList.toggle('error', !!msg);
  gateSetErr(errId, msg);
}

// Gate Login
document.getElementById('gate-login-form').addEventListener('submit', async e => {
  e.preventDefault();
  gateFieldErr('gate-login-email',    'gate-login-email-err',    '');
  gateFieldErr('gate-login-password', 'gate-login-password-err', '');
  gateSetErr('gate-login-global-err', '');

  const email    = document.getElementById('gate-login-email').value.trim();
  const password = document.getElementById('gate-login-password').value;
  let valid = true;
  if (!email)    { gateFieldErr('gate-login-email',    'gate-login-email-err',    'Email required'); valid = false; }
  if (!password) { gateFieldErr('gate-login-password', 'gate-login-password-err', 'Password required'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('gate-login-submit');
  btn.disabled = true; btn.querySelector('.btn-label').textContent = 'Logging in...';
  try {
    const res  = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('adv_token', data.token);
    localStorage.setItem('adv_user', JSON.stringify(data.user));
    syncAuthUI();
  } catch (err) {
    gateSetErr('gate-login-global-err', err.message);
  } finally {
    btn.disabled = false; btn.querySelector('.btn-label').textContent = 'Login';
  }
});

// Gate Signup
document.getElementById('gate-signup-form').addEventListener('submit', async e => {
  e.preventDefault();
  ['gate-signup-name','gate-signup-email','gate-signup-password'].forEach(id => gateFieldErr(id, `${id}-err`, ''));
  gateSetErr('gate-signup-global-err', '');

  const name     = document.getElementById('gate-signup-name').value.trim();
  const email    = document.getElementById('gate-signup-email').value.trim();
  const password = document.getElementById('gate-signup-password').value;
  let valid = true;
  if (!name)               { gateFieldErr('gate-signup-name',     'gate-signup-name-err',     'Name required'); valid = false; }
  if (!email)              { gateFieldErr('gate-signup-email',    'gate-signup-email-err',    'Email required'); valid = false; }
  if (password.length < 6) { gateFieldErr('gate-signup-password', 'gate-signup-password-err', 'Min 6 characters'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('gate-signup-submit');
  btn.disabled = true; btn.querySelector('.btn-label').textContent = 'Creating...';
  try {
    const res  = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    localStorage.setItem('adv_token', data.token);
    localStorage.setItem('adv_user', JSON.stringify(data.user));
    syncAuthUI();
  } catch (err) {
    gateSetErr('gate-signup-global-err', err.message);
  } finally {
    btn.disabled = false; btn.querySelector('.btn-label').textContent = 'Create Account';
  }
});

// Gate Admin Login
document.getElementById('gate-admin-form').addEventListener('submit', async e => {
  e.preventDefault();
  gateFieldErr('gate-admin-user', 'gate-admin-user-err', '');
  gateFieldErr('gate-admin-pass', 'gate-admin-pass-err', '');
  gateSetErr('gate-admin-global-err', '');

  const username = document.getElementById('gate-admin-user').value.trim();
  const password = document.getElementById('gate-admin-pass').value;
  let valid = true;
  if (!username) { gateFieldErr('gate-admin-user', 'gate-admin-user-err', 'Username required'); valid = false; }
  if (!password) { gateFieldErr('gate-admin-pass', 'gate-admin-pass-err', 'Password required'); valid = false; }
  if (!valid) return;

  const btn = document.getElementById('gate-admin-submit');
  btn.disabled = true; btn.querySelector('.btn-label').textContent = 'Verifying...';
  try {
    const res  = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Invalid credentials');
    localStorage.setItem('adv_admin_token', data.token);
    window.location.href = 'admin.html';
  } catch (err) {
    gateSetErr('gate-admin-global-err', err.message);
  } finally {
    btn.disabled = false;
    btn.querySelector('.btn-label').textContent = 'Enter Admin Panel';
  }
});
