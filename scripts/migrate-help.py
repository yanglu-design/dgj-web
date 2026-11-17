"""Resume the approved help migration in product/category batches."""
import concurrent.futures
import hashlib
import html
import importlib.util
import json
import re
import threading
import time
from pathlib import Path
from urllib.parse import parse_qs, quote, urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'content/help-source'
spec = importlib.util.spec_from_file_location('help_adapter', ROOT / 'scripts/adapt-help.py')
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)
BASE = 'https://www.dgjapp.com/'
PRODUCTS = {
    'distribution': ['operations', 'videos'],
    'listing': ['assistant', 'pc-assistant'],
    'cross-border': ['getting-started'],
    'printing': ['getting-started', 'login', 'waybill', 'templates', 'print-components', 'shipping', 'labels', 'supplier', 'miniapp', 'other', 'videos'],
}
lock = threading.Lock()
assets = json.loads((SOURCE / 'assets.json').read_text())
if (SOURCE / 'bulk-assets.json').exists():
    assets.update(json.loads((SOURCE / 'bulk-assets.json').read_text()))
samples = json.loads((SOURCE / 'samples.json').read_text())
records = {row['id']: row for row in samples}
if (SOURCE / 'bulk-articles.json').exists():
    records.update({row['id']: row for row in json.loads((SOURCE / 'bulk-articles.json').read_text())})


def save(name, data):
    path = SOURCE / name
    temp = path.with_suffix('.tmp')
    temp.write_text(json.dumps(data, ensure_ascii=False, indent=2))
    temp.replace(path)


def get(url, path=None, media=False):
    if path and path.exists() and path.stat().st_size:
        return path.read_bytes()
    error = None
    for attempt in range(2):
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            if media:
                headers['Range'] = 'bytes=0-1023'
            with urlopen(Request(url, headers=headers), timeout=18) as response:
                data = response.read(1024) if media else response.read()
                if media and b'ftyp' not in data[:64] and 'video/' not in response.headers.get('Content-Type', ''):
                    raise ValueError('Not a video response')
            if not data:
                raise ValueError('Empty response')
            if path:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(data)
            return data
        except Exception as exc:
            error = exc
    raise RuntimeError(url + ': ' + str(error))


def normalize(url):
    parsed = urlparse(url)
    return parsed._replace(path=quote(parsed.path, safe='/%:@'), query=quote(parsed.query, safe='=&%')).geturl()


def restore_asset_manifest():
    """Recover cached mappings after an interrupted older checkpoint write."""
    files = {path.stem: 'assets/help-content/' + path.name for path in (ROOT / 'dist/assets/help-content').iterdir()}
    for path in (SOURCE / 'raw').glob('*.html'):
        base = BASE + 'newHelpsShow.html?id=' + path.stem
        for image in adapter.ImageParser(path.read_text()).images:
            for attribute in ['src', 'data-src']:
                if not image.get(attribute):
                    continue
                absolute = normalize(urljoin(base, html.unescape(image[attribute])))
                key = hashlib.sha256(absolute.encode()).hexdigest()[:24]
                if key in files:
                    assets[absolute] = files[key]


def image(src, base):
    absolute = normalize(urljoin(base, html.unescape(src)))
    with lock:
        if absolute in assets and (ROOT / 'dist' / assets[absolute]).exists():
            return assets[absolute]
    download = absolute.replace('http://', 'https://').replace('%5C', '/').replace('\\', '/')
    key = hashlib.sha256(absolute.encode()).hexdigest()[:24]
    data = get(download, SOURCE / 'asset-cache' / key)
    if data.startswith(b'\x89PNG'):
        suffix = '.png'
    elif data.startswith(b'\xff\xd8'):
        suffix = '.jpg'
    elif data.startswith((b'GIF87a', b'GIF89a')):
        suffix = '.gif'
    elif data[:4] == b'RIFF' and data[8:12] == b'WEBP':
        suffix = '.webp'
    else:
        raise ValueError('Unsupported image signature: ' + absolute)
    local = 'assets/help-content/' + key + suffix
    (ROOT / 'dist' / local).write_bytes(data)
    with lock:
        assets[absolute] = local
    return local


def inventory():
    rows = []
    for product, categories in PRODUCTS.items():
        source = Path('/tmp/help-' + product + '.html').read_text()
        (SOURCE / 'raw' / ('directory-' + product + '.html')).write_text(source)
        parts = re.split(r'<div class="helps-list"[^>]*>', source)[1:]
        assert len(parts) == len(categories), (product, len(parts))
        if product == 'distribution':
            for order, record in enumerate(samples[:3]):
                rows.append(dict(id=record['id'], title=record['title'], product=product, category='getting-started', order=order, sourceUrl=record['sourceUrl'], type='video'))
        for category, part in zip(categories, parts):
            section = part.split('</ul>', 1)[0]
            for order, item in enumerate(re.findall(r'<li(?:\s[^>]*)?>.*?</li>', section, re.S)):
                video = re.search(r'data-url="([^"]+)"', item)
                if video:
                    ident = re.search(r'data-id="([^"]+)"', item)[1]
                    title = html.unescape(re.search(r'<span[^>]*>(.*?)</span>', item, re.S)[1]).strip()
                    poster = re.search(r'<img[^>]+src="([^"]+)"', item)
                    rows.append(dict(id=ident, title=title, product=product, category=category, order=order, sourceUrl=urljoin(BASE, html.unescape(video[1])), type='video', poster=urljoin(BASE, poster[1]) if poster else None))
                else:
                    anchor = re.search(r'<a\s[^>]*href="([^\"]*newHelpsShow.html\?id=([^\"&]+))"[^>]*>(.*?)</a>', item, re.S)
                    if anchor:
                        rows.append(dict(id=anchor[2], title=html.unescape(re.sub('<[^>]+>', '', anchor[3])).strip(), product=product, category=category, order=order, sourceUrl=urljoin(BASE, anchor[1]), type='article'))
    save('inventory.json', rows)
    return rows


def migrate(row):
    ident, url = row['id'], row['sourceUrl']
    if ident in records:
        return records[ident], None
    record = dict(id=ident, title=row['title'], product=row['product'], category=row['category'], sourceUrl=url, status='migrated')
    missing = []
    try:
        if row['type'] == 'video':
            get(url, media=True)
            poster = image(row['poster'], BASE) if row.get('poster') else ''
            record.update(video=dict(src=url, poster=poster, verified=True), cover=poster, rawHtml='', summary='')
        else:
            raw = get(url, SOURCE / 'raw' / (ident + '.html')).decode('utf-8', errors='replace')
            title = re.search(r'<h1 class="ask_main_title">(.*?)</h1>', raw, re.S)
            if not title or '<!--循环的内容-->' not in raw:
                raise ValueError('Article template/body not found')
            record['title'] = html.unescape(title[1]).strip()
            body = raw.split('<!--循环的内容-->', 1)[1].split('<!-- <div class="ask_main_content">', 1)[0].strip()
            if not body:
                raise ValueError('Empty source body')
            record['rawHtml'] = body
            seen = set()
            for attributes in adapter.ImageParser(body).images:
                src = attributes.get('src', '')
                if not src or src in seen:
                    continue
                seen.add(src)
                try:
                    image(src, url)
                except Exception as error:
                    alternate = attributes.get('data-src')
                    try:
                        if not alternate:
                            raise error
                        local = image(alternate, url)
                        assets[normalize(urljoin(url, html.unescape(src)))] = local
                    except Exception as fallback_error:
                        missing.append(dict(sourceUrl=normalize(urljoin(url, html.unescape(src))), originUrl=alternate, error=str(fallback_error)))
            if missing:
                raise ValueError(str(len(missing)) + ' images unavailable')
            # Report embeds instead of silently dropping unsupported media.
            if re.search(r'<(?:iframe|embed|object|video)\b', body, re.I):
                raise ValueError('Embedded media requires separate adaptation')
            record['rawHtml'] = body
            text = re.sub(r'\s+', ' ', html.unescape(re.sub('<[^>]+>', ' ', body))).strip()
            record['summary'] = text[:160]
            adapter.news.adapt(body, url, assets)
        return record, None
    except Exception as error:
        record['status'] = 'needs-images' if missing else 'pending'
        return None, dict(id=ident, title=row['title'], product=row['product'], category=row['category'], sourceUrl=url, error=str(error), missingImages=missing, archivedArticle=record)


def main():
    restore_asset_manifest()
    rows = inventory()
    stats = {product: dict(entries=sum(r['product'] == product for r in rows), videos=sum(r['product'] == product and r['type'] == 'video' for r in rows)) for product in PRODUCTS}
    print('Inventory: ' + json.dumps(stats, ensure_ascii=False), flush=True)
    failures, batches = [], []
    for product, categories in PRODUCTS.items():
        for category in categories:
            group = list({r['id']: r for r in rows if r['product'] == product and r['category'] == category}.values())
            for offset in range(0, len(group), 25):
                batch = group[offset:offset + 25]
                batch_errors = []
                with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
                    for record, error in pool.map(migrate, batch):
                        if record:
                            records[record['id']] = record
                        if error:
                            failures.append(error)
                            batch_errors.append(error)
                save('bulk-articles.json', [r for ident, r in records.items() if ident not in {s['id'] for s in samples}])
                save('bulk-assets.json', assets)
                batches.append(dict(product=product, category=category, offset=offset, expected=len(batch), succeeded=len(batch) - len(batch_errors), pending=batch_errors))
                save('bulk-report.json', dict(inventory=stats, entries=len(rows), unique=len({r['id'] for r in rows}), migrated=len(records), batches=batches, pending=failures))
                print(f'{product}/{category} [{offset + 1}-{offset + len(batch)}]: {len(batch) - len(batch_errors)}/{len(batch)}; pending {len(failures)}', flush=True)
    print('Finished; archived records: ' + str(len(records)), flush=True)


if __name__ == '__main__':
    main()
