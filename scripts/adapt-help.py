"""Archive the five approved help samples with --fetch; rebuild offline otherwise."""
import html
import hashlib
import importlib.util
import json
import re
import sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import quote, urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'content/help-source'
ASSETS = ROOT / 'dist/assets/help-content'
spec = importlib.util.spec_from_file_location('news_adapter', ROOT / 'scripts/adapt-news.py')
news = importlib.util.module_from_spec(spec)
spec.loader.exec_module(news)
base_style = news.clean_style


def help_style(raw):
    # UEditor also emits CSS keyword sizes and Chinese font family names.
    raw = re.sub(r'(font-size\s*:\s*)(xx-small|x-small|small|medium|large|x-large|xx-large)(?=\s*;|\s*$)',
                 lambda m: m[1] + {'xx-small': '9px', 'x-small': '10px', 'small': '13px', 'medium': '16px', 'large': '18px', 'x-large': '24px', 'xx-large': '32px'}[m[2]], raw)
    safe = base_style(raw)
    family = re.search(r'(?:^|;)\s*font-family\s*:\s*([^;]+)', raw)
    if family and re.fullmatch(r'[\w\s,\-\"\u0027]+', family[1]):
        safe += ';font-family:' + family[1]
    return safe.strip(';')


news.clean_style = help_style


class ImageParser(HTMLParser):
    def __init__(self, raw):
        super().__init__(convert_charrefs=True)
        self.images = []
        self.feed(raw)

    def handle_starttag(self, tag, attrs):
        if tag == 'img':
            self.images.append(dict(attrs))


def image_url(src, base):
    parsed = urlparse(urljoin(base, html.unescape(src)))
    return parsed._replace(path=quote(parsed.path, safe='/%:@'), query=quote(parsed.query, safe='=&%')).geturl()


def fetch(url, path):
    request = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urlopen(request, timeout=40) as response:
        data = response.read()
    if not data:
        raise ValueError('Empty response: ' + url)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return data.decode('utf-8', errors='replace') if path.suffix == '.html' else data


def archive():
    SOURCE.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    records, assets, errors = [], {}, []
    samples = [('manufacturer-guide', '厂家新手引导', '869893367'), ('merchant-guide', '商家新手引导', '869901312'), ('intermediary-guide', '中间商新手引导', '869951888')]
    for ident, title, old_id in samples:
        url = 'https://www.sohu.com/a/' + old_id + '_120542292'
        try:
            desktop = fetch(url, SOURCE / 'raw' / (ident + '.html'))
            mobile = fetch('https://m.sohu.com/a/' + old_id + '_120542292', SOURCE / 'raw' / (ident + '-mobile.html'))
            heading = html.unescape(re.search(r'<title>(.*?)</title>', desktop, re.S)[1])
            summary = html.unescape(re.search(r'<meta name="description" content="([^"]*)"', desktop)[1])
            video = re.search(r'videoUrl:\s*"([^"]+)"', mobile)[1]
            poster = 'https:' + re.search(r'videoCover:\s*"([^"]+)"', mobile)[1]
            local = 'assets/help-content/' + ident + Path(urlparse(poster).path).suffix
            fetch(poster, ROOT / 'dist' / local)
            # Check the stable public video route without downloading the entire film.
            with urlopen(Request(video, headers={'User-Agent': 'Mozilla/5.0', 'Range': 'bytes=0-1023'}), timeout=40) as response:
                prefix = response.read(1024)
                content_type = response.headers.get('Content-Type', '')
                if b'ftyp' not in prefix[:64] and 'video/' not in content_type:
                    raise ValueError('Video response is not media: ' + content_type)
            records.append(dict(id=ident, title=title, heading=heading, product='distribution', category='getting-started', sourceUrl=url, summary=summary, rawHtml='<p>' + html.escape(summary) + '</p>', cover=local, video=dict(src=video, poster=local, verified=True), status='migrated'))
            print(title + ': archived video metadata and verified media', flush=True)
        except Exception as error:
            errors.append(dict(id=ident, sourceUrl=url, error=str(error)))
            print(title + ': ' + str(error), flush=True)
    for ident in ['1673489973673', '1612338372772']:
        url = 'https://www.dgjapp.com/newHelpsShow.html?id=' + ident
        try:
            raw = fetch(url, SOURCE / 'raw' / (ident + '.html'))
            title = html.unescape(re.search(r'<h1 class="ask_main_title">(.*?)</h1>', raw, re.S)[1])
            body = raw.split('<!--循环的内容-->', 1)[1].split('<!-- <div class="ask_main_content">', 1)[0].strip()
            # Source template repeats an old sample in an HTML comment; exclude it.
            for index, src in enumerate(dict.fromkeys(re.findall(r'<img[^>]+src=[\"\u0027]([^\"\u0027]+)', body, re.I))):
                absolute = urljoin(url, html.unescape(src))
                parsed = urlparse(absolute)
                absolute = parsed._replace(path=quote(parsed.path, safe='/%:@'), query=quote(parsed.query, safe='=&%')).geturl()
                suffix = Path(parsed.path).suffix.lower() or '.png'
                local = 'assets/help-content/' + ident + '-' + str(index + 1) + suffix
                fetch(absolute, ROOT / 'dist' / local)
                assets[absolute] = local
            text = html.unescape(re.sub('<[^>]+>', '', body))
            records.append(dict(id=ident, title=title, product='distribution', category='operations', sourceUrl=url, rawHtml=body, summary=re.sub(r'\s+', ' ', text).strip()[:160], status='migrated'))
            print(title + ': archived full body and images', flush=True)
        except Exception as error:
            errors.append(dict(id=ident, sourceUrl=url, error=str(error)))
            print(ident + ': ' + str(error), flush=True)
    (SOURCE / 'samples.json').write_text(json.dumps(records, ensure_ascii=False, indent=2))
    (SOURCE / 'assets.json').write_text(json.dumps(assets, ensure_ascii=False, indent=2))
    (SOURCE / 'migration-report.json').write_text(json.dumps(dict(expected=5, migrated=len(records), pending=errors), ensure_ascii=False, indent=2))


def prepare_missing_images():
    report = json.loads((SOURCE / 'bulk-report.json').read_text())
    partial, missing, mappings = [], [], {}
    for failure in report['pending']:
        record = failure.get('archivedArticle', {})
        if not record.get('rawHtml') or not failure.get('missingImages'):
            continue
        record['status'] = 'needs-images'
        text = html.unescape(re.sub('<[^>]+>', ' ', record['rawHtml']))
        record['summary'] = re.sub(r'\s+', ' ', text).strip()[:160]
        partial.append(record)
        for index, item in enumerate(failure['missingImages'], 1):
            key = hashlib.sha256(item['sourceUrl'].encode()).hexdigest()[:24]
            local = 'assets/help-content/missing-' + key + '.svg'
            (ROOT / 'dist' / local).write_text('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="160" viewBox="0 0 640 160"><title>原图暂缺</title><rect width="640" height="160" rx="8" fill="#f2f5f8"/><text x="320" y="88" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#75808c">原图暂缺</text></svg>')
            mappings[item['sourceUrl']] = local
            # Feishu embeds contain both an expired src and a data-src origin.
            # Point both representations at the same explicit missing-image slot.
            for image in ImageParser(record['rawHtml']).images:
                urls = [image_url(image[key], record['sourceUrl']) for key in ['src', 'data-src'] if image.get(key)]
                if item['sourceUrl'] in urls:
                    for url in urls:
                        mappings[url] = local
            missing.append(dict(articleId=record['id'], title=record['title'], index=index, sourceUrl=item['sourceUrl'], placeholder=local, replacementPath='配图/帮助补图/' + record['id'] + '/' + str(index).zfill(2) + '.png', error=item['error']))
    (SOURCE / 'partial-articles.json').write_text(json.dumps(partial, ensure_ascii=False, indent=2))
    (SOURCE / 'partial-assets.json').write_text(json.dumps(mappings, ensure_ascii=False, indent=2))
    (SOURCE / 'missing-images.json').write_text(json.dumps(missing, ensure_ascii=False, indent=2))
    lines = ['# 帮助中心补图清单', '', '已按用户确认保留正文，原位置使用“原图暂缺”。请按下列路径提供 PNG 原图；如实际格式为 JPG/GIF，请保留真实扩展名。序号仅计算本篇缺失图片，从上往下排列。', '']
    for record in partial:
        lines += ['## ' + record['title'], '', '详情：help-detail.html?id=' + record['id'], '', '| 缺图顺序 | 建议补图路径 | 原始图片 |', '|---|---|---|']
        for item in missing:
            if item['articleId'] == record['id']:
                lines.append('| ' + str(item['index']) + ' | `' + item['replacementPath'] + '` | [原图地址](' + item['sourceUrl'] + ') |')
        lines.append('')
    (SOURCE / 'missing-images.md').write_text('\n'.join(lines))


def build(samples_only=False):
    records = json.loads((SOURCE / 'samples.json').read_text())
    assets = json.loads((SOURCE / 'assets.json').read_text())
    inventory = []
    if not samples_only and (SOURCE / 'bulk-articles.json').exists():
        records += json.loads((SOURCE / 'bulk-articles.json').read_text())
        assets.update(json.loads((SOURCE / 'bulk-assets.json').read_text()))
        if (SOURCE / 'partial-articles.json').exists():
            complete_ids = {record['id'] for record in records}
            partial = [record for record in json.loads((SOURCE / 'partial-articles.json').read_text()) if record['id'] not in complete_ids]
            records += partial
            partial_urls = {image_url(image['src'], record['sourceUrl']) for record in partial for image in ImageParser(record['rawHtml']).images if image.get('src')}
            assets.update({url: local for url, local in json.loads((SOURCE / 'partial-assets.json').read_text()).items() if url in partial_urls and url not in assets})
        inventory = json.loads((SOURCE / 'inventory.json').read_text())
        by_id = {record['id']: record for record in records}
        records = [by_id[row['id']] for row in inventory if row['id'] in by_id]
    for record in records:
        record['body'] = news.adapt(record.pop('rawHtml'), record['sourceUrl'], assets)
        def internal_link(match):
            url = html.unescape(match[1])
            target = re.search(r'newHelpsShow\.html\?id=(\d+)', url)
            if target and any(row['id'] == target[1] for row in records):
                return 'href="help-detail.html?id=' + target[1] + '"'
            return match[0]
        record['body'] = re.sub(r'href="([^"]+)"', internal_link, record['body'])
        record['searchText'] = html.unescape(re.sub('<[^>]+>', ' ', record['body']))
    (ROOT / 'dist/help-migrated-data.js').write_text('/* Generated by scripts/adapt-help.py; edit archived sources instead. */\nwindow.DGJHelpMigrated = ' + json.dumps(records, ensure_ascii=False) + ';\nwindow.DGJHelpInventory = ' + json.dumps(inventory, ensure_ascii=False) + ';\n')


if __name__ == '__main__':
    if '--fetch' in sys.argv:
        archive()
    if '--allow-missing-images' in sys.argv:
        prepare_missing_images()
    build(samples_only='--samples-only' in sys.argv)
