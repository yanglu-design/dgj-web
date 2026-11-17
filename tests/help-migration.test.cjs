const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => JSON.parse(fs.readFileSync(path.join(root, 'content/help-source', name), 'utf8'));
const inventory = read('inventory.json');
const samples = read('samples.json');
const report = read('bulk-report.json');
const context = { window: {} };
for (const name of ['help-migrated-data.js', 'help-page-data.js']) vm.runInNewContext(fs.readFileSync(path.join(root, 'dist', name), 'utf8'), context);
const { documents, aliases } = context.window.DGJHelpPages;
assert.equal(inventory.length, 203);
assert.equal(new Set(inventory.map(item => item.id)).size, inventory.length);
assert.equal(new Set(documents.map(item => item.id)).size, documents.length);
assert.equal(documents.length, inventory.length);
assert.equal(documents.filter(item => item.status === 'needs-images').length, 6);
assert.equal(read('missing-images.json').length, 49);
const byId = new Map(documents.map(item => [item.id, item]));
for (const sample of samples) {
  const result = byId.get(sample.id);
  assert.equal(result.title, sample.title);
  if (sample.video) assert.equal(result.video.src, sample.video.src);
}
for (const item of documents) {
  assert.ok(inventory.some(row => row.id === item.id));
  assert.ok(item.status === 'migrated' || item.status === 'needs-images');
  assert.ok(!/<(?:script|iframe|object|embed)\b|\son\w+\s*=/i.test(item.body));
  for (const [, src] of item.body.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    assert.ok(src.startsWith('assets/help-content/'), src);
    assert.ok(fs.statSync(path.join(root, 'dist', src)).size > 0, src);
  }
  if (item.video) {
    assert.equal(item.video.verified, true);
    assert.ok(item.video.src.startsWith('https://'));
    assert.ok(fs.existsSync(path.join(root, 'dist', item.video.poster)));
  }
}
assert.equal(documents.filter(item => item.video).length, 33);
for (const target of Object.values(aliases)) assert.ok(byId.has(target));
for (const product of context.window.DGJHelpPages.products) {
  for (const category of product.categories) {
    const expected = inventory.filter(item => item.product === product.id && item.category === category.id && byId.has(item.id)).map(item => item.id);
    const actual = documents.filter(item => item.product === product.id && item.category === category.id).map(item => item.id);
    assert.deepEqual(Array.from(actual), expected);
  }
}
assert.equal(report.migrated, documents.filter(item => item.status === 'migrated').length);
console.log('Verified inventory coverage, sample preservation, category order, media, local images, aliases and sanitized bodies.');
