const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const dist = path.resolve(__dirname, '../dist');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(dist, 'news-data.js'), 'utf8'), context);
const articles = context.window.DGJNewsArticles;
const report = JSON.parse(fs.readFileSync(path.join(dist, '../content/news-source/migration-report.json'), 'utf8'));
assert.equal(articles.length, report.imported);
assert.equal(new Set(articles.map(article => article.id)).size, articles.length);
assert.equal(report.imported + report.pending, report.expected);
const sampleIds = new Set(['1777370433932', '1770622508836', '1770276244345', '1574663968624']);
assert.equal(articles.filter(article => sampleIds.has(article.id)).length, 4);
assert.equal(articles.find(article => article.id === '1770622508836').date, '2026-02-09');
let images = 0;
for (const article of articles) {
  assert.match(article.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(article.publishedAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  assert.equal(article.publishedAt.slice(0, 10), article.date);
  assert.ok(article.title && article.category && article.summary && article.body);
  assert.ok(fs.existsSync(path.join(dist, article.thumbnail)));
  assert.doesNotMatch(article.body, /<(script|iframe|style|object)\b|\son\w+=|javascript:|expression\(/i);
  for (const [, src] of article.body.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    assert.ok(src.startsWith('assets/news-articles/'));
    const bytes = fs.readFileSync(path.join(dist, src));
    assert.ok(bytes.length > 100);
    assert.ok(bytes.subarray(0, 4).equals(Buffer.from([137, 80, 78, 71])) || bytes[0] === 255 && bytes[1] === 216 || ['GIF8', 'RIFF'].includes(bytes.toString('ascii', 0, 4)) || bytes.toString('ascii', 0, 2) === 'BM' || bytes.subarray(0, 500).toString().includes('<svg'), src);
    if (sampleIds.has(article.id)) images++;
  }
}
assert.equal(images, 26);
for (let i = 1; i < articles.length; i++) assert.ok(articles[i - 1].date >= articles[i].date);
for (const article of articles) {
  for (const [, id] of article.body.matchAll(/href="news-detail.html\?id=(\d+)"/g)) assert.ok(articles.some(item => item.id === id));
}
console.log(articles.length + ' migrated articles, local assets, ordering and original four samples verified.');
