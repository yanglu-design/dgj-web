const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const dist = path.resolve(__dirname, '../dist');
class E {
  constructor(text = '') { this.textContent = text; this.attrs = {}; this.events = {}; this.children = []; this.dataset = {}; this.value = ''; }
  setAttribute(k, v) { this.attrs[k] = v; }
  getAttribute(k) { return this.attrs[k] ?? this[k] ?? null; }
  addEventListener(k, f) { this.events[k] = f; }
  append(...items) { this.children.push(...items); }
  appendChild(item) { this.children.push(item); return item; }
  replaceChildren(...items) { this.children = items; }
}
class Card extends E {
  constructor() {
    super();
    this.fields = Object.fromEntries(['h2', '.news-copy > p', 'time', '.news-thumbnail', '.news-label'].map(key => [key, new E()]));
    this.fields.time.childNodes = [];
    this.fields.time.append = text => { this.fields.time.textContent = text; };
  }
  get textContent() { return this.fields ? Object.values(this.fields).map(e => e.textContent).join(' ') : ''; }
  set textContent(value) {}
  cloneNode() { return new Card(); }
  querySelector(selector) { return selector === '.news-card-link' ? this.children.find(e => e.className === 'news-card-link') : this.fields[selector]; }
}
const list = new E(); list.children = [new Card()]; list.querySelector = () => list.children[0];
const tabs = ['推荐内容', '企业资讯', '企业荣誉', '行业新闻', '电商干货'].map(category => { const e = new E(); e.dataset.category = category; return e; });
const search = new E(), form = new E(), empty = new E(), paginationMount = new E();
let pagination, inputProps;
const context = { window: {}, Node: { TEXT_NODE: 3 }, URLSearchParams, location: { search: '' },
  React: { createElement: (component, props) => props }, ReactDOM: { createRoot: mount => ({ render: props => { if (mount === search) inputProps = props; else pagination = props; } }) },
  document: {
    createElement: () => new E(),
    querySelector: s => ({ '.news-list': list, '.news-search-field': search, '.news-search': form, '.news-empty': empty, '.news-pagination': paginationMount })[s],
    querySelectorAll: s => s === '.news-tabs button' ? tabs : s === '.news-card' ? list.children : s === '.news-thumbnail' ? list.children.map(card => card.fields['.news-thumbnail']) : []
  }
};
vm.runInNewContext(fs.readFileSync(path.join(dist, 'news-data.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(dist, 'news.js'), 'utf8'), context);
assert.equal(list.children.length, context.window.DGJNewsArticles.length);
assert.equal(list.children.filter(card => !card.hidden).length, 10);
pagination.onChange(2, 10);
assert.equal(pagination.current, 2);
assert.equal(list.children[0].hidden, true);
assert.equal(list.children[10].hidden, false);
tabs[2].events.click();
assert.equal(pagination.current, 1);
assert.equal(pagination.total, context.window.DGJNewsArticles.filter(a => a.category === '企业荣誉').length);
assert.ok(list.children.filter(card => !card.hidden).every(card => card.dataset.category === '企业荣誉'));
assert.equal(inputProps.variant, 'borderless');
assert.equal(inputProps.type, 'search');
tabs[0].events.click(); inputProps.onChange({ target: { value: '不存在的新闻样本987' } });
assert.equal(pagination.total, 0); assert.equal(empty.hidden, false);
inputProps.onChange({ target: { value: '春节' } });
assert.ok(pagination.total > 0); assert.equal(empty.hidden, true);
form.events.submit({ preventDefault() {} });
assert.equal(pagination.current, 1);
inputProps.onChange({ target: { value: '' } });
assert.equal(pagination.total, context.window.DGJNewsArticles.length);
console.log('News list renders the full catalog; pagination, category filtering and search verified.');
