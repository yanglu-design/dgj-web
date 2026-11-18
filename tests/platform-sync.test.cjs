const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const dist = path.join(__dirname, '../dist');
const read = file => fs.readFileSync(path.join(dist, file), 'utf8');
const newsHtml = read('news.html');
const sidebar = [...newsHtml.matchAll(/data-platform-link="([^"]+)"/g)].map(([, name]) => ({ dataset: { platformLink: name } }));
assert.equal(sidebar.length, 10);
const makeGrid = () => ({ innerHTML: '', classList: { add() {} }, querySelectorAll: () => [], addEventListener() {} });
const productGrid = makeGrid(), openGrid = makeGrid();
const nodes = Object.fromEntries(['.core-stage', '#corePoints', '#coreTitle', '#coreDescription', '#coreAction', '#coreImage'].map(key => [key, { classList: { add() {}, remove() {} } }]));
nodes['#coreAction'].href = 'https://www.wjx.top/m/42955488.aspx';
const makeTab = key => ({ dataset: { core: key, platform: key }, events: {}, classList: { toggle() {} }, addEventListener(type, handler) { this.events[type] = handler; } });
const coreTabs = ['quick', 'aggregate', 'manage', 'service'].map(makeTab);
const platformTabs = ['mainstream', 'instant', 'supply', 'preferred'].map(makeTab);
const context = {
  window: { addEventListener() {} }, setTimeout: fn => fn(),
  document: {
    querySelector: selector => selector === '#productPlatformGrid' ? productGrid : selector === '#openPlatformGrid' ? openGrid : nodes[selector] || null,
    querySelectorAll: selector => selector === '[data-platform-link]' ? sidebar : selector === '.core-tabs button' ? coreTabs : selector === '.platform-tabs button' ? platformTabs : []
  }
};
for (const file of ['platform-data.js', 'platform-links.js', 'platform-cards.js', 'products.js', 'open-platform.js']) vm.runInNewContext(read(file), context);
const links = context.window.DGJPlatformLinks;
for (const a of sidebar) {
  assert.equal(a.href, links[a.dataset.platformLink].href);
  assert.equal(a.target, '_blank'); assert.equal(a.rel, 'noopener noreferrer');
}
assert.equal((productGrid.innerHTML.match(/class="platform-card"/g) || []).length, 32);
assert.equal((productGrid.innerHTML.match(/target="_blank" rel="noopener noreferrer"/g) || []).length, 32);
assert.ok(productGrid.innerHTML.includes('魔筷星选20.svg?v=20261118-logo'));
assert.equal(fs.readFileSync(path.join(dist, 'assets/icon/魔筷星选20.svg'), 'utf8'), fs.readFileSync(path.join(dist, '../icon/魔筷星选20.svg'), 'utf8'));
const labels = ['申请接入', '立即咨询', '了解方案', '联系商务'];
coreTabs.forEach((tab, i) => {
  tab.events.click();
  assert.equal(nodes['#coreAction'].textContent, labels[i]);
  assert.equal(nodes['#coreAction'].href, 'https://www.wjx.top/m/42955488.aspx');
});
platformTabs.forEach((tab, i) => {
  tab.events.click();
  assert.equal((openGrid.innerHTML.match(/class="platform-card"/g) || []).length, [12, 5, 6, 28][i]);
});
assert.ok(openGrid.innerHTML.includes('data-platform-consult="爱库存"'));
assert.ok(openGrid.innerHTML.includes('data-platform-consult="鲸灵"'));
const productsHtml = read('products.html');
assert.match(productsHtml, /class="comparison-cta"[^]*?href="https:\/\/fuwu\.jinritemai\.com\/detail\?service_id=7&amp;from=isv.detail" target="_blank" rel="noopener noreferrer"/);
const openHtml = read('open-platform.html');
assert.ok(openHtml.includes('id="coreAction" href="https://www.wjx.top/m/42955488.aspx" target="_blank" rel="noopener noreferrer"'));
const qq = read('customer-service.js').match(/const qq = '([^']+)'/)[1].replaceAll('&', '&amp;');
assert.ok(openHtml.includes(`href="${qq}" target="_blank" rel="noopener noreferrer" aria-label="立即咨询"`));
for (const file of ['index.html', 'products.html', 'open-platform.html']) {
  const html = read(file);
  const own = { 'index.html': 'script.js?', 'products.html': 'products.js?', 'open-platform.html': 'open-platform.js?' }[file];
  assert.ok(html.indexOf('platform-data.js?') < html.indexOf('platform-links.js?'));
  assert.ok(html.indexOf('platform-links.js?') < html.indexOf('platform-cards.js?'));
  assert.ok(html.indexOf('platform-cards.js?') < html.indexOf(own));
  assert.ok(html.includes('platform-cards.css?v=20261118-card-component'));
}
assert.equal(context.window.DGJPlatformCards.render.length, 2);
const sharedCss = read('platform-cards.css');
assert.ok(sharedCss.includes('left:var(--platform-card-action-inset)'));
assert.ok(sharedCss.includes('right:var(--platform-card-action-inset)'));
assert.ok(sharedCss.includes('width:auto'));
assert.ok(!read('styles.css').includes('hover .platform-trial'));
assert.ok(!read('platform-cards.js').includes('platformTabs'));
console.log('Shared cards and responsive button sizing, independent page tabs, synced links/actions, logo and dependency order verified.');
