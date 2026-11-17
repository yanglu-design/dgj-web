const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../dist/banner-hitarea.js'), 'utf8');
for (const [width, height] of [[1920,480], [2560,480], [1440,480], [1285,1285/3], [1143,381], [640,640/3], [390,218]]) {
  const parentElement = { clientWidth: width, clientHeight: height }, link = { parentElement, style: {} };
  let resize;
  vm.runInNewContext(source, { document: { querySelectorAll: () => [link] }, window: { addEventListener: (_, callback) => { resize = callback; } } });
  const scale = Math.max(width / 1920, height / 480);
  const left = parseFloat(link.style.left), top = parseFloat(link.style.top);
  assert.ok(Math.abs((left - width / 2) / scale + 960 - 380) < 1e-8);
  assert.ok(Math.abs((top - height / 2) / scale + 240 - 293) < 1e-8);
  assert.equal(parseFloat(link.style.width), 160 * scale);
  assert.equal(parseFloat(link.style.height), 49 * scale);
  parentElement.clientWidth = 1920; parentElement.clientHeight = 480; resize();
  assert.equal(link.style.left, '380px'); assert.equal(link.style.top, '293px');
}
for (const filename of ['index.html', 'products.html']) {
  const html = fs.readFileSync(path.join(__dirname, '../dist', filename), 'utf8');
  assert.ok(/class="banner-button-hitarea" href="https:\/\/erp\.dgjapp\.com\/Account" target="_blank" rel="noopener noreferrer"/.test(html));
  assert.ok(html.includes('banner-hitarea.js?'));
}
console.log('Banner hit areas match centered cover geometry at desktop/mobile widths, resize correctly, and share the same new-tab ERP URL.');
