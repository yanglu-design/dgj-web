const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const confirmed = JSON.parse(fs.readFileSync(path.join(root, 'content/platform-links-confirmed.json'), 'utf8'));
const card = { events: {}, dismissed: false, classList: { add() { card.dismissed = true; }, remove() { card.dismissed = false; } }, addEventListener(name, handler) { this.events[name] = handler; } };
const grid = { classList: { add() {} }, events: {}, innerHTML: '', querySelectorAll: () => [card], addEventListener(name, handler) { this.events[name] = handler; }, contains(node) { return node === this.trigger; } };
let opened;
const windowEvents = {};
const context = {
  window: { addEventListener: (name, handler) => { windowEvents[name] = handler; }, DGJPlatformConsult: { open: trigger => { opened = trigger; } }, DGJCustomerService: { openOnline: () => { throw Error('Platform cards must not open the global service bubble'); } } },
  document: { querySelector: () => grid, querySelectorAll: () => [] }
};
for (const name of ['platform-data.js', 'platform-links.js', 'platform-cards.js']) vm.runInNewContext(fs.readFileSync(path.join(root, 'dist', name), 'utf8'), context);
const source = fs.readFileSync(path.join(root, 'dist/script.js'), 'utf8');
vm.runInNewContext(source.slice(0, source.indexOf('platformTabs.forEach')), context);
const links = context.window.DGJPlatformLinks;
assert.equal(Object.keys(links).length, 51);
assert.equal(confirmed.records.length, 51);
assert.equal(confirmed.records.filter(row => row.type === 'external').length, 48);
assert.equal(confirmed.records.filter(row => row.type === 'consult').length, 2);
assert.deepEqual(confirmed.records.filter(row => row.type === 'consult').map(row => row.name), ['爱库存', '鲸灵']);
for (const row of confirmed.records) {
  assert.equal(links[row.name === '即时零售' ? '抖音即时零售' : row.name].type, row.type);
  assert.equal(links[row.name === '即时零售' ? '抖音即时零售' : row.name].href, row.href);
  if (row.decision === '沿用旧链接') assert.equal(row.href, row.sourceUrl);
}
const groupNames = { mainstream: '主流平台', instant: '即时零售', supply: '供销平台', preferred: '优选平台' };
for (const [key, group] of Object.entries(groupNames)) {
  context.renderPlatforms(key);
  const rows = confirmed.records.filter(row => row.group === group);
  const anchors = [...grid.innerHTML.matchAll(/<a ([^>]+)>/g)];
  assert.equal(anchors.length, rows.filter(row => row.type !== 'consult').length);
  for (const [, attrs] of anchors) {
    assert.ok(attrs.includes('target="_blank" rel="noopener noreferrer"'));
    const decoded = attrs.match(/href="([^"]*)"/)[1].replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
    assert.ok(rows.some(row => row.href === decoded));
  }
  assert.equal((grid.innerHTML.match(/data-platform-consult=/g) || []).length, rows.filter(row => row.type === 'consult').length);
}
assert.equal(links['开放平台'].href, 'open-platform.html');
assert.ok(fs.existsSync(path.join(root, 'dist', links['开放平台'].href)));
assert.ok(links['得物'].href.includes('testauth.dgjapp.com'));
assert.ok(links['人人商城'].href.includes('testauth.dgjapp.com'));
const trigger = { consult: true, dataset: { platformConsult: '爱库存' }, closest: () => card, hasAttribute() { return this.consult; }, blur() { this.blurred = true; } }; grid.trigger = trigger;
grid.events.click({ detail: 1, target: { closest: () => trigger } });
assert.equal(opened, trigger);
assert.equal(card.dismissed, true);
assert.equal(trigger.blurred, true);
card.events.pointerleave();
assert.equal(card.dismissed, true);
card.events.focusin({ target: { matches: () => false } });
assert.equal(card.dismissed, true);
card.events.pointerenter();
assert.equal(card.dismissed, false);
trigger.consult = false; opened = null;
grid.events.click({ detail: 0, target: { closest: () => trigger } });
assert.equal(card.dismissed, true);
assert.equal(opened, null);
card.events.focusin({ target: { matches: () => true } });
assert.equal(card.dismissed, false);
windowEvents.blur();
assert.equal(card.dismissed, true);
card.events.focusin({ target: { matches: () => false } });
assert.equal(card.dismissed, true);
card.events.pointerenter();
assert.equal(card.dismissed, false);
opened = null;
grid.events.click({ target: { closest: () => null } });
assert.equal(opened, null);
const index = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
assert.ok(index.indexOf('platform-links.js?') < index.indexOf('script.js?'));
for (const page of ['index.html', 'products.html', 'open-platform.html', 'news.html']) {
  const html = fs.readFileSync(path.join(root, 'dist', page), 'utf8');
  assert.ok(html.includes('platform-links.js'));
  assert.ok(html.includes('platform-cards.js'));
}
console.log('All 51 mappings, consultation, new-site route, post-click reset and hover/focus re-entry verified.');
