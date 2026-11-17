const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
class Element {
  constructor() { this.events = {}; this.attrs = {}; this.hidden = true; this.active = false; this.classList = { toggle: (_, value) => { this.active = value; } }; }
  addEventListener(type, handler) { this.events[type] = handler; }
  setAttribute(key, value) { this.attrs[key] = value; }
  contains(node) { return node === this || node === this.button || node === this.panel; }
  querySelector(selector) { return selector === '.customer-service-trigger' ? this.button : this.panel; }
  focus() { this.focused = true; }
}
const items = Array.from({ length: 3 }, () => { const row = new Element(); row.button = new Element(); row.panel = new Element(); return row; });
const root = new Element(); root.querySelectorAll = () => items; root.contains = target => target === root || items.some(item => item.contains(target));
const docEvents = {}; let appended = 0;
const document = { activeElement: null, querySelector: () => null, createElement: () => root, body: { append: () => { appended++; } }, addEventListener: (type, handler) => { docEvents[type] = handler; } };
const dist = path.join(__dirname, '../dist');
const source = fs.readFileSync(path.join(dist, 'customer-service.js'), 'utf8');
vm.runInNewContext(source, { document });
assert.equal(appended, 1);
items[0].events.mouseenter(); assert.equal(items[0].panel.hidden, false); assert.equal(items[0].button.attrs['aria-expanded'], 'true');
items[1].events.mouseenter(); assert.equal(items[0].panel.hidden, true); assert.equal(items[1].panel.hidden, false);
items[1].events.mouseleave(); assert.ok(items.every(item => item.panel.hidden));
items[2].button.events.click(); items[2].events.mouseleave(); assert.equal(items[2].panel.hidden, false);
items[2].button.events.click(); assert.equal(items[2].panel.hidden, true);
items[0].events.focusin(); items[0].events.focusout({ relatedTarget: items[0].panel }); assert.equal(items[0].panel.hidden, false);
document.activeElement = items[0].panel; root.events.keydown({ key: 'Escape' }); assert.equal(items[0].button.focused, true); assert.ok(items.every(item => item.panel.hidden));
items[1].button.events.click(); docEvents.pointerdown({ target: {} }); assert.ok(items.every(item => item.panel.hidden));
assert.equal((root.innerHTML.match(/target="_blank" rel="noopener noreferrer"/g) || []).length, 2);
assert.ok(root.innerHTML.includes('href="tel:4008638288"'));
assert.equal((root.innerHTML.match(/class="customer-service-icon-default"/g) || []).length, 3);
assert.equal((root.innerHTML.match(/class="customer-service-icon-active"/g) || []).length, 3);
const stateSources = { 'wechat-default.svg': 'logo-wechat-cc.svg', 'wechat-active.svg': 'logo-wechat.svg', 'service-default.svg': 'service-cc.svg', 'service-active.svg': 'service.svg', 'phone-default.svg': 'call-cc.svg', 'phone-active.svg': 'call.svg', 'qq.svg': 'logo-qq.svg', 'taobao.svg': '客服.svg' };
for (const [copy, original] of Object.entries(stateSources)) {
  let expected = fs.readFileSync(path.join(dist, '../icon', original), 'utf8');
  if (copy.includes('-active')) expected = expected.replace(/fill="#[0-9a-fA-F]+"/g, 'fill="#FFFFFF"').replace(/fill-opacity="[^"]+"/g, 'fill-opacity="1"');
  assert.equal(fs.readFileSync(path.join(dist, 'assets/customer-service', copy), 'utf8'), expected, copy);
}
const footer = fs.readFileSync(path.join(dist, 'shared-footer.js'), 'utf8');
for (const [, href] of root.innerHTML.matchAll(/<a href="(https:[^"]+)"/g)) assert.ok(footer.includes(href.replaceAll('&', '&amp;')));
for (const [, src] of root.innerHTML.matchAll(/src="([^"]+)"/g)) assert.ok(fs.existsSync(path.join(dist, src.split('?')[0])), src);
for (const name of fs.readdirSync(dist).filter(name => name.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(dist, name), 'utf8');
  assert.equal((html.match(/customer-service\.js\?/g) || []).length, 1, name);
  assert.equal((html.match(/customer-service\.css\?/g) || []).length, 1, name);
}
console.log('Global loading, exclusive hover panels, touch toggle, keyboard focus, Escape, outside dismissal, assets and existing contact URLs verified.');
