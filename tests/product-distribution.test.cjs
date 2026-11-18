const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const dist = path.resolve(__dirname, '../dist');
const html = fs.readFileSync(path.join(dist, 'product-distribution.html'), 'utf8');
let rendered;
const window = { DGJPlatformCards: { render: (grid, items) => { rendered = items; } } };
const context = { window, document: { querySelector: () => null } };
vm.runInNewContext(fs.readFileSync(path.join(dist,'platform-data.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(dist,'platform-links.js'),'utf8'),context);
vm.runInNewContext(fs.readFileSync(path.join(dist,'product-distribution.js'),'utf8'),context);
assert.equal(rendered.length,12);
for (const item of rendered) assert.ok(window.DGJPlatformLinks[item[0]].href);
const rows = [...html.matchAll(/<tr><th scope="row">([^<]+)<\/th><td>[^<]+<\/td>(.*?)<\/tr>/g)];
assert.equal(rows.length,14);
rows.forEach((row,i) => assert.deepEqual([...row[2].matchAll(/class="(yes|no)"/g)].map(m=>m[1]), [i<5?'yes':'no',i<13?'yes':'no','yes']));
for (const [,asset] of html.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^" ]*)?"/g)) {
 if (!asset.startsWith('https:')) assert.ok(fs.existsSync(path.join(dist,asset)),asset);
}
assert.ok(!html.includes('product-placeholder'));
assert.equal((html.match(/service_id=24069/g)||[]).length,2);
assert.ok(html.indexOf('platform-cards.js')<html.indexOf('product-distribution.js'));
console.log('Distribution page: assets, 12 shared platforms, 14 feature rows and ordering links verified.');

const css = fs.readFileSync(path.join(dist, 'product-distribution.css'), 'utf8');
const arrow = css.match(/\.distribution-order-arrow\{[^}]*mask:url\("data:image\/svg\+xml;base64,([^" ]+)"\)/);
assert.ok(arrow, 'Arrow mask must work in file previews without fetching another local file');
assert.deepEqual(Buffer.from(arrow[1], 'base64'), fs.readFileSync(path.join(dist, '../icon/arrow-right.svg')));
