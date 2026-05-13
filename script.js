/* ============================================================
   FAUZAN AL-GHIFARI PORTFOLIO — script.js
   Berisi: Loader, Cursor, Navbar, Scroll Animations,
           Role Typer, Stat Counter, Skill Bars,
           Certificate Modal, Contact Form, Back-to-Top
   ============================================================ */

/* ─── 1. LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Tunggu animasi bar selesai (~1.8s), lalu sembunyikan
  setTimeout(() => {
    loader.classList.add('hidden');
    // Setelah loader hilang, jalankan animasi hero
    triggerHeroAnimations();
  }, 2000);
});

/* ─── 3. NAVBAR ─────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

// Tambah class .scrolled saat scroll > 50px
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  // Tombol back-to-top
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
  // Highlight nav link aktif
  highlightActiveNav();
});

// Hamburger toggle (mobile)
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Tutup menu saat link diklik (mobile)
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Highlight nav link berdasarkan section yang sedang terlihat
function highlightActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        navLinkItems.forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
      }
    }
  });
}

/* ─── 4. SCROLL ANIMATIONS (AOS-like) ──────────────────────── */
const aosElements = document.querySelectorAll('[data-aos]');

const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Jalankan skill bars jika ada di dalam elemen ini
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => animateSkillBar(fill));
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

aosElements.forEach(el => aosObserver.observe(el));

/* ─── 5. SKILL BARS ANIMATION ───────────────────────────────── */
// Observer khusus untuk skill bars (bisa berada di luar [data-aos])
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateSkillBar(entry.target);
      skillObserver.unobserve(entry.target); // hanya sekali
    }
  });
}, { threshold: 0.3 });

skillFills.forEach(fill => skillObserver.observe(fill));

function animateSkillBar(fill) {
  const targetWidth = fill.getAttribute('data-width');
  if (targetWidth && fill.style.width === '') {
    // Delay kecil agar terlihat smooth
    setTimeout(() => {
      fill.style.width = targetWidth + '%';
    }, 200);
  }
}

/* ─── 6. STAT COUNTER (HERO) ────────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num');

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      animateCounter(el, target);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(num => statObserver.observe(num));

function animateCounter(el, target) {
  let current  = 0;
  const step   = Math.ceil(target / 40);
  const timer  = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = current;
    }
  }, 40);
}

/* ─── 7. HERO ENTRY ANIMATIONS ──────────────────────────────── */
function triggerHeroAnimations() {
  // Fade-in elemen hero secara bertahap
  const heroItems = [
    '.hero-badge',
    '.hero-title',
    '.hero-roles',
    '.hero-desc',
    '.hero-actions',
    '.hero-stats',
    '.profile-frame',
  ];

  heroItems.forEach((selector, i) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;

    // Trigger reflow lalu animasikan
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

/* ─── 8. CERTIFICATE MODAL ──────────────────────────────────── */
const certModal     = document.getElementById('certModal');
const certModalImg  = document.getElementById('certModalImg');
const certModalTitle= document.getElementById('certModalTitle');
const certModalIssuer= document.getElementById('certModalIssuer');

/**
 * Buka modal sertifikat saat kartu diklik.
 * Fungsi ini dipanggil dari atribut onclick di HTML.
 * @param {HTMLElement} card - elemen .cert-card yang diklik
 */
function openCertModal(card) {
  const img    = card.querySelector('img');
  const title  = card.querySelector('h4');
  const issuer = card.querySelector('.cert-issuer');

  certModalImg.src       = img ? img.src : '';
  certModalImg.alt       = title ? title.textContent : '';
  certModalTitle.textContent  = title  ? title.textContent  : '';
  certModalIssuer.textContent = issuer ? issuer.textContent : '';

  certModal.classList.add('active');
  document.body.style.overflow = 'hidden'; // lock scroll
}

/**
 * Tutup modal sertifikat.
 * @param {Event} [e] - event klik (opsional); modal hanya tutup jika klik di overlay
 */
function closeCertModal(e) {
  // Jika dipanggil dari onclick overlay, tutup hanya jika target-nya overlay itu sendiri
  if (e && e.target !== certModal) return;
  certModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Tutup modal dengan tombol Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal.classList.contains('active')) {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ─── 9. CONTACT FORM ───────────────────────────────────────── */
/**
 * Handle submit form kontak.
 * Karena ini static site (GitHub Pages), form tidak benar-benar dikirim.
 * Anda bisa integrasikan dengan Formspree, EmailJS, dsb.
 *
 * Cara integrasi Formspree:
 *   1. Daftar di https://formspree.io
 *   2. Buat form baru, dapatkan endpoint URL
 *   3. Ganti FORMSPREE_URL di bawah dengan URL tersebut
 *   4. Hapus komentar pada blok fetch di bawah
 */
const FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID'; // ← GANTI

function handleFormSubmit(e) {
  e.preventDefault();

  const form    = document.getElementById('contactForm');
  const note    = document.getElementById('formNote');
  const btn     = form.querySelector('button[type="submit"]');
  const btnSpan = btn.querySelector('span');

  // Validasi sederhana
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !subject || !message) {
    showFormNote('Harap isi semua field terlebih dahulu.', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showFormNote('Format email tidak valid.', 'error');
    return;
  }

  // Loading state
  btn.disabled  = true;
  btnSpan.textContent = 'Mengirim...';

  /* ── Aktifkan blok ini jika sudah punya Formspree ──
  fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, subject, message })
  })
  .then(res => {
    if (res.ok) {
      showFormNote('✅ Pesan berhasil dikirim! Terima kasih, saya akan segera membalas.', 'success');
      form.reset();
    } else {
      showFormNote('❌ Gagal mengirim pesan. Coba lagi atau hubungi via email langsung.', 'error');
    }
  })
  .catch(() => showFormNote('❌ Terjadi kesalahan jaringan.', 'error'))
  .finally(() => {
    btn.disabled = false;
    btnSpan.textContent = 'Kirim Pesan';
  });
  ── End Formspree block ── */

  // Simulasi pengiriman (hapus blok ini jika sudah pakai Formspree)
  setTimeout(() => {
    showFormNote('✅ Pesan berhasil dikirim! Terima kasih, saya akan segera membalas.', 'success');
    form.reset();
    btn.disabled = false;
    btnSpan.textContent = 'Kirim Pesan';
  }, 1500);
}

function showFormNote(msg, type) {
  const note = document.getElementById('formNote');
  note.textContent = msg;
  note.style.color = type === 'error' ? '#f87171' : 'var(--teal)';
  // Hapus pesan setelah 5 detik
  setTimeout(() => { note.textContent = ''; }, 5000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─── 10. SMOOTH SCROLL untuk anchor links ──────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── 11. ACTIVE NAV LINK STYLE (CSS dinamis) ──────────────── */
// Tambahkan style untuk .active-link jika belum ada di CSS
const styleEl = document.createElement('style');
styleEl.textContent = `
  .nav-link.active-link {
    color: var(--text) !important;
  }
  .nav-link.active-link::after {
    width: 100% !important;
  }
`;
document.head.appendChild(styleEl);

/* ─── 12. HOVER TILT pada Project Cards ────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -5;  // max ±5deg
    const rotateY = ((x - cx) / cx) *  5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease';
  });
});

/* ─── 13. TYPING EFFECT pada hero (opsional fallback) ──────── */
// Role cycling sudah ditangani CSS animation (roleSlide).
// Blok ini hanya sebagai fallback / alternatif jika ingin JS-based.
// Sudah disabled by default.

/* ─── 14. PARTICLE EFFECT pada Hero (ringan) ────────────────── */
(function createParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('span');
    p.classList.add('hero-particle');

    const size  = Math.random() * 3 + 1;
    const left  = Math.random() * 100;
    const delay = Math.random() * 8;
    const dur   = Math.random() * 6 + 6;

    p.style.cssText = `
      position:absolute;
      left:${left}%;
      bottom:-10px;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:rgba(99,102,241,${Math.random() * 0.4 + 0.1});
      animation: particleRise ${dur}s ${delay}s linear infinite;
      pointer-events:none;
      z-index:0;
    `;
    hero.appendChild(p);
  }

  // Inject keyframe
  const ks = document.createElement('style');
  ks.textContent = `
    @keyframes particleRise {
      0%   { transform: translateY(0) scale(1); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 0.5; }
      100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
    }
  `;
  document.head.appendChild(ks);
})();

/* ─── 15. KONAMI CODE easter egg (fun!) ────────────────────── */
const konamiCode = [38,38,40,40,37,39,37,39,66,65];
let konamiIndex  = 0;
document.addEventListener('keydown', (e) => {
  if (e.keyCode === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      konamiIndex = 0;
      triggerEasterEgg();
    }
  } else {
    konamiIndex = 0;
  }
});

function triggerEasterEgg() {
  const msg = document.createElement('div');
  msg.style.cssText = `
    position:fixed; top:50%; left:50%;
    transform:translate(-50%,-50%) scale(0);
    background:linear-gradient(135deg,#6366f1,#a855f7);
    color:#fff; padding:2rem 3rem; border-radius:20px;
    font-size:1.5rem; font-weight:700; z-index:9999;
    text-align:center; box-shadow:0 20px 60px rgba(0,0,0,0.5);
    transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  `;
  msg.innerHTML = '🎮 Konami Code!<br><small style="font-size:0.9rem;font-weight:400">Kamu menemukan easter egg! 🎉</small>';
  document.body.appendChild(msg);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => { msg.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });

  setTimeout(() => {
    msg.style.transform = 'translate(-50%,-50%) scale(0)';
    setTimeout(() => msg.remove(), 400);
  }, 2500);
}

/* ─── 16. YEAR di footer (auto-update) ─────────────────────── */
// Jika kamu menambahkan elemen dengan id="footerYear", ini akan otomatis diisi
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ─── INIT LOG ──────────────────────────────────────────────── */
console.log(
  '%c🚀 Fauzan Al-Ghifari Portfolio ',
  'background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;padding:8px 16px;border-radius:8px;font-weight:700;font-size:14px'
);
console.log('%cDibuat dengan HTML, CSS & JavaScript murni', 'color:#818cf8;font-size:12px');
