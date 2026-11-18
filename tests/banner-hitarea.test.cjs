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
const openCss = fs.readFileSync(path.join(__dirname, '../dist/open-platform.css'), 'utf8');
const ctaRule = openCss.match(/\.open-cta>a\{([^}]+)\}/)[1];
const percent = property => Number(ctaRule.match(new RegExp(property + ':([\\d.]+)%'))[1]) / 100;
for (const width of [390, 720, 1130, 1920, 2560]) {
  const height = width * 284 / 1920;
  const scale = width / 1920;
  const hitWidth = width * percent('width');
  assert.ok(Math.abs(width * percent('left') - hitWidth / 2 - 880 * scale) < .001);
  assert.ok(Math.abs(height * percent('top') - 176 * scale) < .001);
  assert.ok(Math.abs(hitWidth - 160 * scale) < .001);
  assert.ok(Math.abs(height * percent('height') - 44 * scale) < .001);
}
assert.equal((openCss.match(/\.open-cta>a\{/g) || []).length, 1);
console.log('Cover banner and proportional open-platform CTA hit areas match source buttons across desktop/mobile widths.');

const openHtml = fs.readFileSync(path.join(__dirname, '../dist/open-platform.html'), 'utf8');
assert.ok(openHtml.includes('class="open-hero-hit banner-button-hitarea" type="button" data-consult="开放平台咨询"'));
assert.ok(openHtml.includes('banner-hitarea.js?'));
assert.ok(!openCss.includes('.open-hero-hit{display:none}'));
