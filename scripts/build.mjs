import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const fingerprint = (contents) => createHash('sha256').update(contents).digest('hex').slice(0, 12);

const stylesheet = readFileSync('styles.css');
const javascript = readFileSync('script.js');
const stylesheetName = `styles.${fingerprint(stylesheet)}.css`;
const javascriptName = `script.${fingerprint(javascript)}.js`;

const writeHtml = (source, destination) => {
  const html = readFileSync(source, 'utf8')
    .replace('href="styles.css"', `href="${stylesheetName}"`)
    .replace('src="script.js"', `src="${javascriptName}"`);

  writeFileSync(destination, html);
};

rmSync('_site', { recursive: true, force: true });
mkdirSync('_site');
for (const entry of ['styles.css', 'script.js', 'robots.txt', 'sitemap.xml', 'CNAME', '.nojekyll', 'assets']) {
  cpSync(entry, `_site/${entry}`, { recursive: true });
}

cpSync('styles.css', `_site/${stylesheetName}`);
cpSync('script.js', `_site/${javascriptName}`);
writeHtml('index.html', '_site/index.html');
writeHtml('404.html', '_site/404.html');

console.log(`Static site built in _site/ with ${stylesheetName} and ${javascriptName}.`);
