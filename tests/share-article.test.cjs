const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(require('node:path').join(__dirname, '../dist/share-article.js'), 'utf8');
const run = async (href, navigator, fallback = false) => {
  const messages = [], selected = [];
  let removed = false, focused = false;
  const document = {
    activeElement: { focus() { focused = true; } },
    body: { appendChild() {} },
    createElement: () => ({ style: {}, setAttribute() {}, select() { selected.push(this.value); }, remove() { removed = true; } }),
    execCommand: command => { assert.equal(command, 'copy'); return fallback; }
  };
  const window = { DGJAntMessage: {
    success: value => messages.push(['success', value]),
    error: value => messages.push(['error', value])
  } };
  vm.runInNewContext(source, { window, navigator, location: { href }, document });
  assert.equal(await window.DGJShareArticle('测试文章'), null);
  return { messages, selected, removed, focused };
};
(async () => {
  for (const href of ['https://example.com/news-detail.html?id=1', 'file:///preview/help-detail.html?id=1']) {
    const copied = [];
    const result = await run(href, {
      share: () => { throw Error('Native share must never be called'); },
      clipboard: { writeText: async value => copied.push(value) }
    });
    assert.deepEqual(copied, [href]);
    assert.equal(result.messages[0][0], 'success');
    assert.equal(result.messages[0][1].content, '文档链接复制成功');
    assert.equal(result.messages[0][1].duration, 3);
  }
  for (const navigator of [{}, { clipboard: { writeText: async () => { throw Error('denied'); } } }]) {
    const result = await run('file:///preview/help-detail.html?id=2', navigator, true);
    assert.deepEqual(result.selected, ['file:///preview/help-detail.html?id=2']);
    assert.equal(result.messages[0][0], 'success');
    assert.ok(result.removed && result.focused);
  }
  const failed = await run('https://example.com/help-detail.html?id=3', {}, false);
  assert.equal(failed.messages[0][0], 'error');
  assert.equal(failed.messages.length, 1);
  assert.ok(failed.removed && failed.focused);
  console.log('Direct URL copy, local preview, clipboard fallback, failure feedback and Ant Design success message verified.');
})().catch(error => { console.error(error); process.exitCode = 1; });
