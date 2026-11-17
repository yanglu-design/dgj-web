const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dist = path.resolve(__dirname, '../dist');
class Element {
  constructor(tag = 'div') { this.tag = tag; this.children = []; this.attrs = {}; this.events = {}; this.dataset = {}; this.style = {}; this.textContent = ''; this.classes = new Set(); this.classList = { add: value => this.classes.add(value), toggle: value => { if (this.classes.has(value)) { this.classes.delete(value); return false; } this.classes.add(value); return true; } }; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute(key, value) { this.attrs[key] = value; }
  addEventListener(key, handler) { this.events[key] = handler; }
  focus() { this.focused = true; }
  setCustomValidity(message) { this.validationMessage = message; }
  reportValidity() { return [this, ...this.querySelectorAll('input'), ...this.querySelectorAll('textarea')].every(node => !node.validationMessage); }
  querySelectorAll(tag) { return this.children.flatMap(child => child instanceof Element ? [...(child.tag === tag ? [child] : []), ...child.querySelectorAll(tag)] : []); }
}
function run(view, query) {
  const content = new Element(), tree = new Element(), breadcrumb = new Element(), input = new Element('input'), form = new Element('form'), tabs = new Element();
  const selectors = { '#help-page-content': content, '.help-tree': tree, '.help-breadcrumb': breadcrumb, '.help-inline-search input': input, '.help-inline-search': form, '.help-result-tabs': tabs };
  const storage = new Map(), notices = [];
  const context = { window: { DGJAntMessage: { success: message => notices.push(message), error: message => notices.push(message) } }, localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) }, URLSearchParams, location: { search: query }, document: { body: { dataset: { helpView: view } }, querySelector: selector => selectors[selector] || null, createElement: tag => new Element(tag), createTextNode: text => ({ text }) } };
  vm.runInNewContext(fs.readFileSync(path.join(dist, 'help-migrated-data.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(dist, 'help-page-data.js'), 'utf8'), context);
  vm.runInNewContext(fs.readFileSync(path.join(dist, 'help-pages.js'), 'utf8'), context);
  return { content, tree, breadcrumb, input, tabs, context, storage, notices };
}
const videoOnly = run('detail', '?id=1643102301108');
assert.ok(videoOnly.content.children.some(node => node.tag === 'video'));
assert.ok(!videoOnly.content.children.some(node => node.className === 'help-richtext'));
const videoWithBody = run('detail', '?id=manufacturer-guide');
assert.ok(videoWithBody.content.children.some(node => node.className === 'help-richtext'));
let page = run('category', '?product=distribution&category=getting-started');
assert.equal(page.breadcrumb.children[2].href, 'help-category.html?product=distribution');
assert.equal(page.tree.children.length, 4);
assert.equal(page.content.children[1].children.length, 3);
assert.equal(page.content.children[1].children[0].href, 'help-detail.html?id=manufacturer-guide');
page = run('category', '?product=distribution&category=operations');
assert.equal(page.content.children[1].children.length, page.context.window.DGJHelpPages.documents.filter(item => !item.searchOnly && item.product === 'distribution' && item.category === 'operations').length);
assert.equal(page.content.children[1].className, 'help-full-list');
for (const product of ['distribution', 'printing']) {
  const videoPage = run('category', '?product=' + product + '&category=videos');
  const grid = videoPage.content.children[1];
  const expected = videoPage.context.window.DGJHelpPages.documents.filter(item => item.product === product && item.category === 'videos');
  assert.equal(grid.className, 'help-guide-grid');
  assert.equal(grid.children.length, expected.length);
  expected.forEach((item, index) => {
    assert.equal(grid.children[index].href, 'help-detail.html?id=' + item.id);
    assert.equal(grid.children[index].children[0].src, item.cover || item.video.poster);
  });
}
for (const product of page.context.window.DGJHelpPages.products) {
  const overview = run('category', '?product=' + product.id);
  assert.equal(overview.content.children[0].textContent, product.title);
  assert.equal(overview.content.children.length, 2);
  assert.equal(overview.content.children[1].children.length, product.categories.length);
  assert.equal(overview.breadcrumb.children.at(-1).textContent, product.title);
  product.categories.forEach((category, index) => assert.equal(overview.content.children[1].children[index].children[0].href, 'help-category.html?product=' + product.id + '&category=' + category.id));
}
for (const id of ['manufacturer-guide', 'merchant-guide', 'intermediary-guide', '1673489973673', '1612338372772']) {
  page = run('detail', '?id=' + id);
  const item = page.context.window.DGJHelpPages.documents.find(doc => doc.id === id);
  assert.equal(page.breadcrumb.children.at(-1).textContent, item.title);
  assert.equal(item.status, 'migrated');
  assert.ok(item.body);
  if (item.video) {
    const video = page.content.children.find(node => node.tag === 'video');
    assert.equal(video.src, item.video.src);
    assert.equal(video.controls, true);
    assert.equal(video.preload, 'metadata');
  }
  const buttons = page.content.querySelectorAll('button');
  const vote = buttons.find(button => button.attrs['aria-pressed'] === 'false'); vote.events.click();
  assert.equal(vote.attrs['aria-pressed'], 'true');
  assert.ok(!buttons.some(button => button.disabled));
}
page = run('detail', '?id=manufacturer-guide');
const feedback = page.content.children.find(node => node.className === 'help-detail-feedback');
const [row, feedbackForm] = feedback.children;
const [positive, negative] = row.querySelectorAll('button');
const [submit, cancel] = feedbackForm.querySelectorAll('button');
const opinion = feedbackForm.querySelectorAll('textarea')[0];
const contactInputs = feedbackForm.querySelectorAll('input');
const contact = contactInputs.at(-1);
assert.equal(feedbackForm.hidden, true);
negative.events.click();
assert.equal(feedbackForm.hidden, false);
assert.equal(page.notices.at(-1).content, '评价成功');
assert.equal(negative.attrs['aria-expanded'], 'true');
positive.events.click();
assert.equal(feedbackForm.hidden, true);
assert.equal(negative.attrs['aria-pressed'], 'false');
negative.events.click();
cancel.events.click();
assert.equal(feedbackForm.hidden, true);
assert.equal(negative.focused, true);
negative.events.click();
opinion.value = '   '; contact.value = '';
feedbackForm.events.submit({ preventDefault() {} });
assert.equal(feedbackForm.hidden, false);
assert.ok(opinion.validationMessage);
opinion.value = '希望补充详细步骤'; opinion.events.input();
contact.value = 'invalid';
feedbackForm.events.submit({ preventDefault() {} });
assert.ok(contact.validationMessage);
contactInputs[1].events.change();
assert.equal(contact.type, 'email');
contact.value = 'reader@example.com'; contact.events.input();
feedbackForm.events.submit({ preventDefault() {} });
assert.equal(feedbackForm.hidden, true);
assert.equal(page.notices.at(-1).content, '提交成功');
const stored = JSON.parse(page.storage.get('dgj-help-feedback:manufacturer-guide'));
assert.equal(stored.vote, '没帮助');
assert.equal(stored.entries[0].opinion, '希望补充详细步骤');
assert.equal(stored.entries[0].contactType, '电子邮箱');
assert.equal(stored.entries[0].contact, 'reader@example.com');
assert.equal(opinion.value, '');
negative.events.click();
page.context.localStorage.setItem = () => { throw Error('quota'); };
opinion.value = '另一条意见'; opinion.events.input(); contact.value = '';
feedbackForm.events.submit({ preventDefault() {} });
assert.equal(feedbackForm.hidden, false);
assert.match(page.notices.at(-1), /保存失败/);
page = run('search', '?q=' + encodeURIComponent('电子面单'));
assert.ok(page.content.children.length >= 6);
assert.ok(page.content.querySelectorAll('mark').length > 0);
page.tabs.children[1].events.click();
assert.equal(page.tabs.children[1].attrs['aria-pressed'], 'true');
page = run('search', '?q=' + encodeURIComponent('<script>不存在'));
assert.equal(page.content.children[0].textContent, '暂无相关帮助文档');
page = run('detail', '?id=not-a-document');
assert.equal(page.content.children[0].textContent, '文档不存在');
console.log('Help categories, five preview details, breadcrumbs, feedback selection, search filtering and invalid IDs verified.');
