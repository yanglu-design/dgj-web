const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const dist = path.resolve(__dirname, '../dist');
class Element {
  constructor(text = '') { this.textContent = text; this.children = []; this.attrs = {}; this.events = {}; this.classList = { toggle() {} }; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.children = children; }
  setAttribute(key, value) { this.attrs[key] = value; }
  addEventListener(key, handler) { this.events[key] = handler; }
  focus() { this.focused = true; }
}
const names = ['企业资讯', '企业荣誉', '行业新闻', '电商干货'];
const tabs = names.map(name => new Element(name));
const grid = new Element(), more = new Element(), tablist = new Element();
const context = { window: {}, document: {
  querySelectorAll: () => tabs,
  querySelector: selector => selector.endsWith('.news-grid') ? grid : selector.endsWith('.news-more') ? more : tablist,
  createElement: () => new Element()
} };
vm.runInNewContext(fs.readFileSync(path.join(dist, 'news-data.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(path.join(dist, 'home-news.js'), 'utf8'), context);
for (const tab of tabs) {
  tab.events.click();
  const expected = context.window.DGJNewsArticles.filter(article => article.category === tab.textContent).slice(0, 4);
  assert.equal(grid.children.length, 4);
  expected.forEach((article, i) => {
    const link = grid.children[i].children[0];
    assert.equal(link.href, 'news-detail.html?id=' + article.id);
    assert.equal(link.children[1].textContent, article.title);
  });
  assert.equal(more.href, 'news.html?category=' + encodeURIComponent(tab.textContent));
}
console.log('All four homepage categories show their four latest articles and correct detail links.');
