/* ============================================================
   FAUZAN AL-GHIFARI PORTFOLIO — script.js
   Berisi: Loader, Cursor, Navbar, Scroll Animations,
           Role Typer, Stat Counter, Skill Bars,
           Certificate Modal, Contact Form, Back-to-Top
   ============================================================ */

/* ─── 1. LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    triggerHeroAnimations();
  }, 2000);
});

/* ─── 2. NAVBAR — scroll + hamburger ────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navItems  = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  // sticky style
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // back-to-top visibility
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
  // highlight active section
  highlightActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Tutup menu mobile saat link diklik
navItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;
  sections.forEach(section => {
    const top  = section.offsetTop;
    const h    = section.offsetHeight;
    const id   = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (!link) return;
    if (scrollY >= top && scrollY < top + h) {
      navItems.forEach(l => l.classList.remove('active-link'));
      link.classList.add('active-link');
    }
  });
}

/* ─── 3. SCROLL ANIMATIONS (IntersectionObserver) ───────────── */
const aosEls = document.querySelectorAll('[data-aos]');
const aosObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Jika ada skill-fill di dalam elemen, animasikan
      entry.target.querySelectorAll('.skill-fill').forEach(animateSkillBar);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
aosEls.forEach(el => aosObs.observe(el));

/* ─── 4. SKILL BARS ──────────────────────────────────────────── */
const skillFills = document.querySelectorAll('.skill-fill');
const skillObs   = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBar(entry.target);
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillFills.forEach(fill => skillObs.observe(fill));

function animateSkillBar(fill) {
  const w = fill.getAttribute('data-width');
  if (w && fill.style.width === '') {
    setTimeout(() => { fill.style.width = w + '%'; }, 200);
  }
}

/* ─── 5. STAT COUNTER ────────────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num');
const statObs  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target, parseInt(entry.target.getAttribute('data-target')));
      statObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => statObs.observe(n));

function animateCounter(el, target) {
  let cur = 0;
  const step = Math.ceil(target / 40);
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { el.textContent = target + '+'; clearInterval(t); }
    else               { el.textContent = cur; }
  }, 40);
}

/* ─── 6. HERO ENTRY ANIMATIONS ──────────────────────────────── */
function triggerHeroAnimations() {
  const items = [
    '.hero-badge', '.hero-title', '.hero-roles',
    '.hero-desc',  '.hero-actions', '.hero-stats', '.profile-frame'
  ];
  items.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
}

/* ─── 7. ROLE CYCLING ────────────────────────────────────────── */
/*
 * HTML menggunakan beberapa .role-item; JS membaca semua teks dari sana
 * lalu memutar satu per satu dengan animasi fade-in / fade-out.
 */
(function initRoles() {
  const wrapper = document.querySelector('.roles-wrapper');
  if (!wrapper) return;

  // Kumpulkan semua teks dari role-item di HTML
  const roleEls = Array.from(wrapper.querySelectorAll('.role-item'));
  const texts   = roleEls.map(el => el.textContent.trim()).filter(Boolean);
  if (texts.length === 0) return;

  // Bersihkan HTML, buat satu elemen aktif
  wrapper.innerHTML = `<span class="role-item active">${texts[0]}</span>`;
  let current = 0;

  function next() {
    const el = wrapper.querySelector('.role-item');
    if (!el) return;

    // Fade out
    el.classList.remove('active');
    el.classList.add('fade-out');

    setTimeout(() => {
      current = (current + 1) % texts.length;
      el.classList.remove('fade-out');
      el.textContent = texts[current];
      // Force reflow agar animasi ulang
      void el.offsetWidth;
      el.classList.add('active');
    }, 420);
  }

  // Mulai setelah loader selesai
  setTimeout(() => setInterval(next, 2800), 2500);
})();

/* ─── 8. CERTIFICATE MODAL ───────────────────────────────────── */
const certModal      = document.getElementById('certModal');
const certModalImg   = document.getElementById('certModalImg');
const certModalTitle = document.getElementById('certModalTitle');
const certModalIssuer= document.getElementById('certModalIssuer');

function openCertModal(card) {
  const img    = card.querySelector('img');
  const title  = card.querySelector('h4');
  const issuer = card.querySelector('.cert-issuer');
  certModalImg.src            = img    ? img.src            : '';
  certModalImg.alt            = title  ? title.textContent  : '';
  certModalTitle.textContent  = title  ? title.textContent  : '';
  certModalIssuer.textContent = issuer ? issuer.textContent : '';
  certModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCertModal(e) {
  // Jika dipanggil dari overlay, hanya tutup jika klik tepat di overlay
  if (e && e.target !== certModal) return;
  certModal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && certModal.classList.contains('active')) {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ─── 9. CONTACT FORM ────────────────────────────────────────── */
/*
 * Untuk mengaktifkan pengiriman nyata via Formspree:
 * 1. Daftar di https://formspree.io (gratis)
 * 2. Buat form baru → salin endpoint
 * 3. Ganti FORMSPREE_URL di bawah
 * 4. Hapus blok simulasi & aktifkan blok fetch
 */
const FORMSPREE_URL = 'https://formspree.io/f/mpqbgllr'; // ← GANTI

function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('contactForm');
  const note    = document.getElementById('formNote');
  const btn     = form.querySelector('button[type="submit"]');
  const btnSpan = btn.querySelector('span');

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    setNote('Harap isi semua field terlebih dahulu.', 'error'); return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setNote('Format email tidak valid.', 'error'); return;
  }

  btn.disabled = true;
  btnSpan.textContent = 'Mengirim...';

  /* Formspree */ 
  fetch(FORMSPREE_URL, {
    method:'POST',
    headers:{'Accept':'application/json','Content-Type':'application/json'},
    body: JSON.stringify({name, email, subject, message})
  })
  .then(res => {
    if (res.ok) { setNote('✅ Pesan terkirim! Terima kasih, saya akan segera membalas.','success'); form.reset(); }
    else        { setNote('❌ Gagal mengirim. Coba lagi atau hubungi via email langsung.','error'); }
  })
  .catch(() => setNote('❌ Terjadi kesalahan jaringan.','error'))
  .finally(() => { btn.disabled=false; btnSpan.textContent='Kirim Pesan'; }); 

  /* ── Aktifkan jika sudah punya Formspree ──
  ffetch(FORMSPREE_URL, {
    method:'POST',
    headers:{'Accept':'application/json','Content-Type':'application/json'},
    body: JSON.stringify({name, email, subject, message})
  })
  .then(res => {
    if (res.ok) { setNote('✅ Pesan terkirim! Terima kasih, saya akan segera membalas.','success'); form.reset(); }
    else        { setNote('❌ Gagal mengirim. Coba lagi atau hubungi via email langsung.','error'); }
  })
  .catch(() => setNote('❌ Terjadi kesalahan jaringan.','error'))
  .finally(() => { btn.disabled=false; btnSpan.textContent='Kirim Pesan'; });
  ── End Formspree ── */

function setNote(msg, type) {
  const note = document.getElementById('formNote');
  note.textContent = msg;
  note.style.color = type === 'error' ? '#f87171' : '#14b8a6';
  setTimeout(() => { note.textContent = ''; }, 5000);
}

/* ─── 10. SMOOTH SCROLL ──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});

/* ─── 11. PROJECT CARD TILT ──────────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height/2) / (r.height/2)) * -5;
    const ry = ((e.clientX - r.left - r.width /2) / (r.width /2)) *  5;
    card.style.transition = 'transform 0.1s ease';
    card.style.transform  = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease';
    card.style.transform  = '';
  });
});

/* ─── 12. FLOATING PARTICLES (hero) ─────────────────────────── */
(function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('span');
    const size  = Math.random() * 3 + 1;
    const left  = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur   = Math.random() * 6 + 6;
    p.style.cssText = `
      position:absolute; left:${left}%; bottom:-10px;
      width:${size}px; height:${size}px; border-radius:50%;
      background:rgba(99,102,241,${(Math.random()*0.4+0.1).toFixed(2)});
      animation:particleRise ${dur}s ${delay}s linear infinite;
      pointer-events:none; z-index:0;
    `;
    hero.appendChild(p);
  }
  const ks = document.createElement('style');
  ks.textContent = `
    @keyframes particleRise {
      0%   { transform:translateY(0) scale(1); opacity:0; }
      10%  { opacity:1; }
      90%  { opacity:0.5; }
      100% { transform:translateY(-100vh) scale(0.3); opacity:0; }
    }
  `;
  document.head.appendChild(ks);
})();

/* ─── 13. KONAMI CODE easter egg ─────────────────────────────── */
const KONAMI = [38,38,40,40,37,39,37,39,66,65];
let ki = 0;
document.addEventListener('keydown', e => {
  ki = (e.keyCode === KONAMI[ki]) ? ki + 1 : 0;
  if (ki === KONAMI.length) { ki = 0; easterEgg(); }
});
function easterEgg() {
  const el = document.createElement('div');
  el.style.cssText = `
    position:fixed; top:50%; left:50%;
    transform:translate(-50%,-50%) scale(0);
    background:linear-gradient(135deg,#6366f1,#a855f7);
    color:#fff; padding:2rem 3rem; border-radius:20px;
    font-size:1.5rem; font-weight:700; z-index:9999;
    text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.5);
    transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  `;
  el.innerHTML = '🎮 Konami Code!<br><small style="font-size:0.9rem;font-weight:400">Kamu menemukan easter egg! 🎉</small>';
  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.transform = 'translate(-50%,-50%) scale(1)';
  }));
  setTimeout(() => {
    el.style.transform = 'translate(-50%,-50%) scale(0)';
    setTimeout(() => el.remove(), 400);
  }, 2500);
}

/* ─── CONSOLE SIGNATURE ──────────────────────────────────────── */
console.log('%c🚀 Fauzan Al-Ghifari | Portfolio v2.0','background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;padding:8px 16px;border-radius:8px;font-weight:700;font-size:14px');
console.log('%cBuilt with HTML · CSS · JavaScript','color:#818cf8;font-size:12px');
