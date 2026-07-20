import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const notFoundHtml = readFileSync('404.html', 'utf8');
const analyticsId = 'G-LSB54PR33J';
const requiredText = [
  'Your secrets.',
  'Your keys.',
  'https://id0.app',
  'https://simple.nokey.sh',
  'https://sentinel.nokey.sh',
  'https://github.com/meta-secret/meta-secret-core',
  'https://github.com/meta-secret/nook',
  'contact@meta-secret.org',
];

for (const text of requiredText) {
  if (!html.includes(text)) throw new Error(`Required content is missing: ${text}`);
}

for (const asset of ['styles.css', 'script.js', 'assets/favicon.svg', 'assets/og-card.svg', '404.html', 'robots.txt', 'sitemap.xml']) {
  if (!existsSync(asset)) throw new Error(`Required asset is missing: ${asset}`);
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(match[1])) throw new Error(`Anchor has no matching id: #${match[1]}`);
}

if (!html.includes('<main id="main">') || !html.includes('<h1>')) {
  throw new Error('Document landmarks or primary heading are missing.');
}

if (html.includes('tildacdn') || html.includes('jquery')) {
  throw new Error('Legacy landing-page dependencies must not return.');
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
