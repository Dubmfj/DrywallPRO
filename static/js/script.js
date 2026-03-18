/* ─────────────────────────────────────
   PRELOADER — GSAP
───────────────────────────────────── */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const plLogo    = document.querySelector('.pl-logo');
  const plDivider = document.querySelector('.pl-divider');
  const plCtrWrap = document.querySelector('.pl-counter-wrap');
  const plCounter = document.querySelector('.pl-counter');
  const plBarWrap = document.querySelector('.pl-bar-wrap');
  const plBar     = document.querySelector('.pl-bar');

  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline();

  // 1) Logo entra
  tl.to(plLogo, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.2)

  // 2) Línea divisora se expande
    .to(plDivider, { opacity: 1, width: 'min(400px, 80vw)', duration: 0.6, ease: 'power2.out' }, 0.7)

  // 3) Contador y barra aparecen
    .to(plCtrWrap, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.9)
    .to(plBarWrap, { opacity: 1, duration: 0.4, ease: 'power2.out' }, 1.0)

  // 4) Barra + contador 0 → 100
    .to(plBar, {
      width: '100%',
      duration: 1.8,
      ease: 'power1.inOut',
      onUpdate() {
        plCounter.textContent = Math.round(this.progress() * 100);
      }
    }, 1.1)

  // 5) Flash amarillo al llegar a 100
    .to(plCounter, { color: '#f5c518', duration: 0.2, ease: 'power2.in' }, '+=0.05')

  // 6) Fade out contenido
    .to(plLogo,    { opacity: 0, y: -20, duration: 0.35, ease: 'power2.in' }, '+=0.15')
    .to([plCtrWrap, plBarWrap, plDivider], { opacity: 0, duration: 0.3, stagger: 0.05, ease: 'power2.in' }, '<0.05')

  // 7) Preloader sube y revela la página
    .to('#preloader', { yPercent: -100, duration: 0.75, ease: 'power4.inOut' }, '-=0.05')

  // 8) Limpieza
    .call(() => {
      preloader.style.display = 'none';
      document.body.style.overflow = '';
    });

})();

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

const statsBar  = document.querySelector('.stats-bar');
const nosStats  = document.querySelector('.nos-stats');
if (statsBar) counterObserver.observe(statsBar);
if (nosStats)  counterObserver.observe(nosStats);

}); // fin DOMContentLoaded