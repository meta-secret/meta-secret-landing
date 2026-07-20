import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const notFoundHtml = readFileSync('404.html', 'utf8');
const analyticsId = 'G-LSB54PR33J';
const requiredText = [
  'Privacy has',
  'no master key.',
  'Open tools for secrets that remain yours.',
  'Secrets belong to people,',
  'Keys, not accounts',
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

if (!html.includes('<main id="main">') || !html.includes('<h1>')) {
  throw new Error('Document landmarks or primary heading are missing.');
}

if (html.includes('tildacdn') || html.includes('jquery')) {
  throw new Error('Legacy landing-page dependencies must not return.');
}

if (html.includes('fonts.googleapis.com') || html.includes('fonts.gstatic.com')) {
  throw new Error('The page must not depend on third-party font delivery.');
}

if (!html.includes('name="color-scheme" content="light only"')) {
  throw new Error('The light-only color scheme guard is missing.');
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
