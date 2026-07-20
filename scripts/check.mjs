import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const notFoundHtml = readFileSync('404.html', 'utf8');
const cryptoPlate = readFileSync('assets/crypto-plate.svg', 'utf8');
const analyticsId = 'G-LSB54PR33J';
const requiredText = [
  'Privacy has',
  'Privacy has no login, master password, central authority, paid subscription, internet dependency, or third party trust.',
  'Tools for secrets that remain yours—even when platforms disappear.',
  'Launch id0',
  'Open Nook',
  'Secrets belong to people,',
  'We remove single',
  'points of authority.',
  'Keys, not accounts',
  'Open id0.app',
  'https://id0.app',
  'Open nokey.sh',
  'https://nokey.sh',
  'assets/crypto-plate.svg?v=formula-axis-clear',
  'https://simple.nokey.sh',
  'https://sentinel.nokey.sh',
  'https://github.com/meta-secret/meta-secret-core',
  'https://github.com/meta-secret/nook',
  'contact@meta-secret.org',
];

for (const text of requiredText) {
  if (!html.includes(text)) throw new Error(`Required content is missing: ${text}`);
}

if (!readFileSync('script.js', 'utf8').includes("const ctaVariants = ['proof', 'shard', 'zk', 'zk'];")) {
  throw new Error('Project CTA weighting must remain Proof Rail 1, Key Shard 1, ZK Gate 2.');
}

for (const asset of ['styles.css', 'script.js', 'assets/crypto-plate.svg', 'assets/favicon.svg', 'assets/og-card.svg', '404.html', 'robots.txt', 'sitemap.xml']) {
  if (!existsSync(asset)) throw new Error(`Required asset is missing: ${asset}`);
}

for (const font of [
  'assets/fonts/barlow-condensed-500.woff2',
  'assets/fonts/barlow-condensed-600.woff2',
  'assets/fonts/ibm-plex-mono-400.woff2',
  'assets/fonts/ibm-plex-mono-500.woff2',
  'assets/fonts/inter-latin.woff2',
]) {
  if (!existsSync(font)) throw new Error(`Self-hosted font is missing: ${font}`);
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(match[1])) throw new Error(`Anchor has no matching id: #${match[1]}`);
}

if (!html.includes('<main id="main">') || !html.includes('<h1')) {
  throw new Error('Document landmarks or primary heading are missing.');
}

const privacyTerms = [
  'login',
  'master password',
  'central authority',
  'paid subscription',
  'internet dependency',
  'third party trust',
];
const script = readFileSync('script.js', 'utf8');
if (
  !html.includes('data-privacy-term>login</span>') ||
  privacyTerms.some((term) => !script.includes(`'${term}'`))
) {
  throw new Error('The rotating privacy headline is missing one of its required states.');
}

if (!html.includes('<div class="vision-heading">') || !readFileSync('styles.css', 'utf8').includes('.vision-heading h2')) {
  throw new Error('The vision headline must remain grouped in its primary responsive grid column.');
}

if (html.includes('tildacdn') || html.includes('jquery')) {
  throw new Error('Legacy landing-page dependencies must not return.');
}

if (html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com')) {
  throw new Error('The page must not depend on third-party font delivery.');
}

for (const text of ['E(R) / y^2 = x^3 - x + 1', 'THIRD INTERSECTION R', 'P + Q = -R']) {
  if (!cryptoPlate.includes(text)) throw new Error(`Elliptic-curve construction is incomplete: ${text}`);
}

if (cryptoPlate.includes('E(GF(p))') || cryptoPlate.includes('P + Q = R')) {
  throw new Error('The obsolete elliptic-curve misconception returned.');
}

if (!html.includes('name="color-scheme" content="light dark"') || !notFoundHtml.includes('name="color-scheme" content="light dark"')) {
  throw new Error('Light and dark color-scheme support is missing.');
}

if (!html.includes('class="theme-toggle"') || !html.includes('meta-secret-theme')) {
  throw new Error('The persisted color-theme control is missing.');
}

for (const forbiddenColor of ['#c7ff35', '#8df1c5', 'chartreuse', 'lime']) {
  const surfaces = ['styles.css', 'assets/favicon.svg', 'assets/og-card.svg']
    .map((path) => readFileSync(path, 'utf8').toLowerCase())
    .join('\n');
  if (surfaces.includes(forbiddenColor)) throw new Error(`Forbidden green accent returned: ${forbiddenColor}`);
}

for (const [page, content] of [
  ['index.html', html],
  ['404.html', notFoundHtml],
]) {
  if (!content.includes(`gtag/js?id=${analyticsId}`) || !content.includes(`gtag('config', '${analyticsId}')`)) {
    throw new Error(`Google Analytics is missing or misconfigured in ${page}.`);
  }
}

console.log('Content, assets, anchors, analytics, and document landmarks are valid.');
