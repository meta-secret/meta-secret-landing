import { cpSync, mkdirSync, rmSync } from 'node:fs';

rmSync('_site', { recursive: true, force: true });
mkdirSync('_site');
for (const entry of ['index.html', '404.html', 'styles.css', 'script.js', 'robots.txt', 'sitemap.xml', 'CNAME', '.nojekyll', 'assets']) {
  cpSync(entry, `_site/${entry}`, { recursive: true });
}
console.log('Static site built in _site/.');
