const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const cryptoStage = document.querySelector('.crypto-stage');
const themeButton = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('[data-theme-label]');
const themeColor = document.querySelector('meta[name="theme-color"]');
const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
const privacyTerm = document.querySelector('[data-privacy-term]');

const ctaVariants = ['proof', 'shard', 'zk', 'zk'];
const ctaStatus = {
  proof: { id0: 'verified / 7a2f:4d6c', nook: 'local key / active' },
  shard: { id0: 'threshold ready', nook: 'device held' },
  zk: { id0: 'proof accepted', nook: 'identity local' },
};

const randomVariantIndex = () => {
  if (globalThis.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    globalThis.crypto.getRandomValues(value);
    return value[0] % ctaVariants.length;
  }
  return Math.floor(Math.random() * ctaVariants.length);
};

const ctaVariant = ctaVariants[randomVariantIndex()];
document.documentElement.dataset.ctaVariant = ctaVariant;
document.querySelectorAll('.crypto-cta[data-product]').forEach((link) => {
  const product = link.dataset.product;
  const status = link.querySelector('[data-cta-status]');
  if (status && (product === 'id0' || product === 'nook')) status.textContent = ctaStatus[ctaVariant][product];
});

const storedTheme = () => {
  try {
    const value = localStorage.getItem('meta-secret-theme');
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

const applyTheme = (theme, persist = false) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  themeButton?.setAttribute('aria-pressed', String(theme === 'dark'));
  themeButton?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
  if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Light' : 'Dark';
  themeColor?.setAttribute('content', theme === 'dark' ? '#090b0a' : '#f3f2ee');
  if (persist) {
    try { localStorage.setItem('meta-secret-theme', theme); } catch {}
  }
};

applyTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');

themeButton?.addEventListener('click', () => {
  applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
});

themeMedia.addEventListener('change', (event) => {
  if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light');
});

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
const privacyTerms = [
  'login',
  'master password',
  'central authority',
  'paid subscription',
  'internet dependency',
  'third party trust',
];

if (privacyTerm && !reducedMotion) {
  const typeMs = 58;
  const deleteMs = 36;
  const holdMs = 2400;
  const gapMs = 320;
  let termIndex = 0;
  let timer = 0;

  const wait = (ms) =>
    new Promise((resolve) => {
      timer = window.setTimeout(resolve, ms);
    });

  const waitWhileHidden = async () => {
    while (document.hidden) await wait(200);
  };

  const typewrite = async () => {
    await wait(holdMs);

    while (true) {
      const current = privacyTerms[termIndex];
      termIndex = (termIndex + 1) % privacyTerms.length;
      const next = privacyTerms[termIndex];

      for (let i = current.length; i >= 0; i -= 1) {
        await waitWhileHidden();
        privacyTerm.textContent = current.slice(0, i);
        await wait(deleteMs);
      }

      await wait(gapMs);

      for (let i = 1; i <= next.length; i += 1) {
        await waitWhileHidden();
        privacyTerm.textContent = next.slice(0, i);
        await wait(typeMs);
      }

      await wait(holdMs);
    }
  };

  typewrite();
  window.addEventListener('pagehide', () => window.clearTimeout(timer));
}

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
