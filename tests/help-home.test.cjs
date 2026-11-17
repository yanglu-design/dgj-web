const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const dist = path.resolve(__dirname, '../dist');
class E {
  constructor(tag = 'div', text = '') { this.tag = tag; this.textContent = text; this.children = []; this.attrs = {}; this.events = {}; this.dataset = {}; this.classes = new Set(); this.classList = { toggle: (name, force) => { const on = force ?? !this.classes.has(name); if (on) this.classes.add(name); else this.classes.delete(name); return on; } }; }
  get childNodes() { return this.children; }
  append(...items) { for (const item of items) { item.parent = this; this.children.push(item); } }
  replaceChildren(...items) { this.children = []; this.append(...items); }
  replaceWith(item) { const parent = this.parent; parent.children[parent.children.indexOf(this)] = item; item.parent = parent; }
  setAttribute(key, value) { this.attrs[key] = value; }
  addEventListener(key, fn) { this.events[key] = fn; }
}
const cards = Array.from({ length: 4 }, () => {
  const card = new E(); const more = new E('span'), labels = new E(), list = new E('ul');
  card.append(more, labels, list);
  card.querySelector = selector => selector === '.help-more' ? card.children[0] : selector === '.help-category-labels' ? labels : list;
  card.querySelectorAll = () => [];
  return card;
});
const source = fs.readFileSync(path.join(dist, 'help.html'), 'utf8');
const faqs = [...source.matchAll(/<li title="([^"]+)" data-help-id="([^"]+)">/g)].map(match => { const item = new E('li', match[1]); item.dataset.helpId = match[2]; return item; });
assert.equal(faqs.length, 12);
const sidebar = new E();
const context = { window: {}, document: {
  createElement: tag => new E(tag),
  querySelector: selector => selector === '.help-sidebar' ? sidebar : null,
  querySelectorAll: selector => selector === '.help-document-card' ? cards : selector === '.help-faq-card li' ? faqs : []
} };
vm.runInNewContext(fs.readFileSync(path.join(dist, 'help-migrated-data.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(dist, 'help-page-data.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(dist, 'help-home.js'), 'utf8'), context);
assert.equal(sidebar.children.length, 4);
const firstCategory = sidebar.children[0].children[1].children[0];
assert.equal(firstCategory.children[1].children.length, 3);
const faqIds = ['1670487503137', '1623376953492', '1643103369803', '1663658618793', '1607651589443', '1617186973497', '1581404732371', '1581573668105', '1581573818615', '1643103112235', '1614844451705', '1643103254262'];
for (const [index, faq] of faqs.entries()) {
  assert.equal(faq.children.length, 1);
  assert.equal(faq.children[0].href, 'help-detail.html?id=' + faqIds[index]);
}
const docs = context.window.DGJHelpPages.documents;
context.window.DGJHelpPages.products.forEach((product, index) => {
  const card = cards[index], buttons = card.children[1].children;
  buttons.forEach((button, categoryIndex) => {
    button.events.click(); const category = product.categories[categoryIndex];
    const expected = docs.filter(doc => !doc.searchOnly && doc.product === product.id && doc.category === category.id).slice(0, 6);
    const rows = card.children[2].children;
    assert.equal(rows.length, expected.length); assert.ok(rows.length <= 6);
    expected.forEach((doc, i) => assert.equal(rows[i].children[0].href, 'help-detail.html?id=' + doc.id));
    assert.equal(card.children[0].href, 'help-category.html?product=' + product.id + '&category=' + category.id);
  });
});
firstCategory.children[0].events.click();
assert.equal(cards[0].children[0].href, 'help-category.html?product=distribution&category=getting-started');
console.log('FAQ detail links, three-level navigation, ordered six-item previews and current-category list links verified.');
