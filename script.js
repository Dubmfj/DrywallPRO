document.addEventListener('DOMContentLoaded', () => {

/* ─────────────────────────────────────
   HAMBURGER MENU
───────────────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');

// Crear overlay dinámicamente
const overlay = document.createElement('div');
overlay.classList.add('mobile-overlay');
document.body.appendChild(overlay);

function openMenu() {
  mobileMenu.style.display = 'flex';
  overlay.style.display    = 'block';
  // Forzar reflow para que la transición arranque
  mobileMenu.getBoundingClientRect();
  overlay.getBoundingClientRect();
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  overlay.classList.add('open');
  hamburger.setAttribute('aria-expanded', true);
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  overlay.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
  // Ocultar después de que termine la transición
  setTimeout(() => {
    if (!mobileMenu.classList.contains('open')) {
      mobileMenu.style.display = 'none';
      overlay.style.display    = 'none';
    }
  }, 380);
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

mobileClose.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});


/* ─────────────────────────────────────
   HEADER HIDE / SHOW EN SCROLL
───────────────────────────────────── */
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const scrollingDown  = currentScrollY > lastScrollY;

  if (scrollingDown && currentScrollY > 80) {
    header.classList.add('header-hidden');
  } else if (!scrollingDown) {
    header.classList.remove('header-hidden');
  }

  lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
});


/* ─────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => { el.classList.add('visible'); }, delay);
      revealObserver.unobserve(el);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});


/* ─────────────────────────────────────
   CONTADOR ANIMADO
───────────────────────────────────── */
function animateCounter(el) {
  const target    = parseInt(el.dataset.count, 10);
  const suffix    = el.dataset.suffix || '';
  const duration  = 1200;
  const step      = 16;
  const increment = target / (duration / step);
  let current     = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + suffix;
  }, step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);

const statsBar = document.querySelector('.stats-bar');
if (statsBar) counterObserver.observe(statsBar);

}); // fin DOMContentLoaded