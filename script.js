const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const cryptoStage = document.querySelector('.crypto-stage');

const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 72);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const closeMenu = () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation?.classList.remove('open');
  document.body.style.overflow = '';
};

menuButton?.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  navigation?.classList.toggle('open', willOpen);
  document.body.style.overflow = willOpen ? 'hidden' : '';
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

  cryptoStage?.addEventListener('pointermove', (event) => {
    const bounds = cryptoStage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    cryptoStage.style.setProperty('--pointer-x', `${x * 8}px`);
    cryptoStage.style.setProperty('--pointer-y', `${y * 8}px`);
  });
  cryptoStage?.addEventListener('pointerleave', () => {
    cryptoStage.style.setProperty('--pointer-x', '0px');
    cryptoStage.style.setProperty('--pointer-y', '0px');
  });
}
