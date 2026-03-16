/* ─────────────────────────────────────
   HEADER HIDE / SHOW EN SCROLL
   Se oculta al bajar, aparece al subir
───────────────────────────────────── */
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;

  if (scrollingDown && currentScrollY > 80) {
    header.classList.add('header-hidden');
  } else if (!scrollingDown) {
    header.classList.remove('header-hidden');
  }

  lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
});


/* ─────────────────────────────────────
   SCROLL REVEAL
   Observa todos los .reveal y les agrega
   .visible cuando entran al viewport
───────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      revealObserver.unobserve(el); // solo una vez
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});


/* ─────────────────────────────────────
   CONTADOR ANIMADO
   Busca elementos con data-count y
   anima el número desde 0 hasta el valor
───────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1200; // ms
  const step = 16;       // ~60fps
  const steps = duration / step;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach((c) => animateCounter(c));

      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.3 }
);

const statsBar = document.querySelector('.stats-bar');
if (statsBar) counterObserver.observe(statsBar);