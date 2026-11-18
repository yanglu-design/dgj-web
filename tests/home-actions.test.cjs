const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const dist = path.join(__dirname, '../dist');
const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const detailLinks = [...html.matchAll(/<a class="feature-details"([^>]+)>查看详情<\/a>/g)];
assert.equal(detailLinks.length, 6);
detailLinks.forEach(([, attrs]) => {
  assert.ok(attrs.includes('href="https://tfxportal.dgjapp.com/FFAccount"'));
  assert.ok(attrs.includes('target="_blank" rel="noopener noreferrer"'));
});
const orders = [...html.matchAll(/<a class="primary-btn small"([^>]+)>立即订购/g)];
assert.equal(orders.length, 2);
['24069', '7'].forEach((service, index) => {
  assert.ok(orders[index][1].includes(`href="https://fuwu.jinritemai.com/detail?service_id=${service}&amp;from=isv.detail"`));
  assert.ok(orders[index][1].includes('target="_blank" rel="noopener noreferrer"'));
});
for (const key of ['distribution', 'printing']) {
  const matrix = html.split(`id="matrix-panel-${key}"`)[1].split('</div>')[0];
  assert.equal((matrix.match(/<article>/g) || []).length, 12);
}
const tabs = ['distribution', 'printing'].map(key => ({
  id: 'matrix-tab-' + key, dataset: { matrix: key }, attrs: {}, events: {},
  classList: { toggle(name, value) { this[name] = value; } },
  setAttribute(name, value) { this.attrs[name] = value; },
  addEventListener(name, handler) { this.events[name] = handler; },
  focus() { this.focused = true; }
}));
const slider = { dataset: {} };
const panels = ['distribution', 'printing'].map(key => ({ dataset: { matrixPanel: key }, attrs: {}, setAttribute(name, value) { this.attrs[name] = value; } }));
const card = { events: {}, classList: { add() { card.dismissed = true; }, remove() { card.dismissed = false; } }, addEventListener(name, handler) { this.events[name] = handler; } };
const detail = { events: {}, keyboardFocus: false, matches: () => detail.keyboardFocus, closest: () => card, addEventListener(name, handler) { this.events[name] = handler; }, blur() { this.blurred = true; } };
const windowEvents = {};
const source = fs.readFileSync(path.join(dist, 'script.js'), 'utf8');
vm.runInNewContext(source.slice(source.indexOf('const matrixTabs =')), {
  window: { addEventListener: (name, handler) => { windowEvents[name] = handler; } },
  document: { querySelectorAll: selector => selector === '.matrix-tabs button' ? tabs : selector === '[data-matrix-panel]' ? panels : [detail], querySelector: () => slider }
});
tabs[1].events.click();
assert.equal(slider.dataset.active, 'printing');
assert.equal(panels[0].inert, true);
assert.equal(panels[1].inert, false);
assert.equal(tabs[0].attrs['aria-selected'], 'false');
assert.equal(tabs[1].attrs['aria-selected'], 'true');
assert.equal(tabs[0].tabIndex, -1);
tabs[1].events.keydown({ key: 'ArrowRight', preventDefault() {} });
assert.equal(slider.dataset.active, 'distribution');
assert.equal(panels[1].attrs['aria-hidden'], 'true');
assert.equal(tabs[0].focused, true);
tabs[0].events.keydown({ key: 'End', preventDefault() {} });
assert.equal(slider.dataset.active, 'printing');
tabs[0].events.click(); tabs[1].events.click();
assert.equal(slider.dataset.active, 'printing');
detail.events.click({ detail: 1 });
assert.equal(card.dismissed, true);
assert.equal(detail.blurred, true);
card.events.pointerleave();
assert.equal(card.dismissed, true);
detail.events.focus();
assert.equal(card.dismissed, true);
card.events.pointerenter();
assert.equal(card.dismissed, false);
detail.events.click({ detail: 0 });
detail.keyboardFocus = true; detail.events.focus();
assert.equal(card.dismissed, false);
windowEvents.blur();
assert.equal(card.dismissed, true);
detail.keyboardFocus = false; detail.events.focus();
assert.equal(card.dismissed, true);
card.events.pointerenter();
assert.equal(card.dismissed, false);
console.log('Links, sliding panels and feature-card click/leave/window-blur reset with pointer/keyboard re-entry verified.');
