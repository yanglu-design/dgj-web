const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
class Node {
  constructor(tag) { this.tag = tag; this.children = []; this.attrs = {}; this.events = {}; this.value = ''; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute(key, value) { this.attrs[key] = value; }
  removeAttribute(key) { delete this.attrs[key]; }
  addEventListener(key, handler) { this.events[key] = handler; }
  contains(node) { return this === node || this.children.some(child => child.contains?.(node)); }
  scrollIntoView() {}
  focus() { this.events.focus?.(); }
  click() { this.clicked = true; this.events.click?.(); }
}
const source = fs.readFileSync(path.join(__dirname, '../dist/help-search-ui.js'), 'utf8');
const form = new Node('form'), input = new Node('input'); form.append(input); form.querySelector = () => input;
let submitted = 0, stored;
form.requestSubmit = () => { let blocked = false; form.events.submit({ preventDefault: () => { blocked = true; } }); if (!blocked) submitted++; };
const context = { window: { DGJHelpPages: { documents: [
  { id: '1', title: '如何开通电子面单' }, { id: '2', title: '电子面单介绍' },
  { id: '3', title: '<script>特殊文字' }
] } }, document: { querySelectorAll: () => [form], createElement: tag => new Node(tag), createTextNode: text => ({ text }), addEventListener() {} }, localStorage: { getItem: () => stored || null, setItem: (_, value) => { stored = value; } } };
vm.runInNewContext(source, context);
const api = context.window.DGJHelpSearch;
assert.equal(api.suggestions('电子面单')[0].id, '2');
assert.equal(api.suggestions('不存在').length, 0);
input.focus(); const panel = form.children[1]; assert.equal(panel.hidden, false);
assert.equal(panel.children[0].textContent, '历史记录');
input.value = '   '; form.requestSubmit(); assert.equal(submitted, 0);
input.value = ' 电子面单 '; form.requestSubmit(); assert.equal(submitted, 1); assert.equal(input.value, '电子面单');
input.value = ''; input.focus(); const historyButton = panel.children[1].children[0]; historyButton.click(); assert.equal(submitted, 2);
input.value = '电子面单'; input.events.input();
const key = value => input.events.keydown({ key: value, preventDefault() {} });
key('ArrowUp'); const last = panel.children[0].children.at(-1); assert.equal(last.attrs['aria-selected'], 'true');
key('Enter'); assert.equal(last.clicked, true); assert.equal(last.href, 'help-detail.html?id=1');
input.events.input(); key('Escape'); assert.equal(panel.hidden, true);
input.events.compositionstart(); form.requestSubmit(); assert.equal(submitted, 2); input.events.compositionend();
stored = '{broken'; assert.equal(api.readHistory().length, 0);
for (let i = 0; i < 8; i++) api.remember('搜索' + i);
assert.equal(api.readHistory().length, 5); api.remember('搜索7'); assert.equal(api.readHistory().filter(value => value === '搜索7').length, 1);
input.value = '<script>'; input.events.input(); const suggestion = panel.children[0].children[0]; assert.ok(suggestion.children.some(node => node.tag === 'mark')); assert.equal(suggestion.innerHTML, undefined);
console.log('Search history, real suggestions, keyboard navigation, IME, empty submissions, storage recovery and safe highlighting verified.');
