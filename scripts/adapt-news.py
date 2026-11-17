"""Rebuild local news-data.js from archived editor HTML; no network access."""
import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, parse_qs

ROOT = Path(__file__).resolve().parents[1]
VERSION = 4
TAGS = set('p div section span br hr h1 h2 h3 h4 h5 h6 strong b em i u s del sub sup ul ol li blockquote table caption colgroup col thead tbody tfoot tr th td pre code a img'.split())
VOID = {'br', 'hr', 'img', 'col'}
DROP = {'script', 'style', 'iframe', 'object', 'embed', 'form', 'svg', 'math', 'template'}
COLORS = re.compile(r'(?:#[0-9a-f]{3,8}|rgba?\([\d.,%\s]+\)|hsla?\([\d.,%\s]+\)|[a-z]+)$', re.I)
LENGTH = re.compile(r'(?:0|\d+(?:\.\d+)?(?:px|em|rem|%|pt))$')
SIGNED_LENGTH = re.compile(r'-?(?:0|\d+(?:\.\d+)?(?:px|em|rem|%|pt))$')


def gradient(value):
    if not value.startswith(('linear-gradient(', 'radial-gradient(')) or not value.endswith(')'):
        return False
    if not re.fullmatch(r'[a-zA-Z0-9#.,%()\s+\-]+', value):
        return False
    words = re.findall(r'[a-zA-Z]+', re.sub(r'#[0-9a-fA-F]+', '', value))
    return all(word.lower() in {'linear', 'radial', 'gradient', 'rgb', 'rgba', 'hsl', 'hsla', 'deg', 'to', 'top', 'bottom', 'left', 'right', 'circle', 'ellipse', 'at', 'center', 'transparent'} for word in words)


def clean_style(raw):
    result = {}
    for declaration in raw.split(';'):
        if ':' not in declaration:
            continue
        key, value = declaration.split(':', 1)
        key = key.strip().lower()
        value = re.sub(r'\s*!important\s*$', '', value.strip(), flags=re.I)
        if re.search(r'url|expression|javascript|var\(|[\\<>@]', value, re.I):
            continue
        valid = False
        if key in {'color', 'background-color'}:
            valid = bool(COLORS.fullmatch(value))
        elif key in {'background', 'background-image'}:
            valid = gradient(value) or (key == 'background' and bool(COLORS.fullmatch(value)))
        elif key == 'display':
            valid = value in {'block', 'inline', 'inline-block', 'flex', 'inline-flex'}
        elif key == 'z-index':
            valid = value == 'auto' or bool(re.fullmatch(r'-?\d+', value))
        elif key in {'align-items', 'align-self'}:
            valid = value in {'auto', 'stretch', 'center', 'flex-start', 'flex-end', 'baseline'}
        elif key == 'justify-content':
            valid = value in {'center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly'}
        elif key in {'flex-direction', 'flex-flow'}:
            valid = value in {'row', 'column', 'row-reverse', 'column-reverse', 'row wrap', 'row nowrap', 'column wrap'}
        elif key == 'flex-wrap':
            valid = value in {'wrap', 'nowrap', 'wrap-reverse'}
        elif key == 'flex':
            valid = value in {'auto', 'none', 'initial'} or bool(re.fullmatch(r'\d+(?:\.\d+)?(?:\s+\d+(?:\.\d+)?)?(?:\s+(?:auto|0|\d+(?:\.\d+)?(?:px|%|em)))?', value))
        elif key in {'flex-grow', 'flex-shrink', 'order'}:
            valid = bool(re.fullmatch(r'\d+(?:\.\d+)?', value))
        elif key in {'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height', 'gap', 'row-gap', 'column-gap'}:
            valid = value == 'auto' or bool(LENGTH.fullmatch(value))
        elif key in {'overflow', 'overflow-x', 'overflow-y'}:
            valid = value in {'hidden', 'visible', 'auto'}
        elif key == 'box-sizing':
            valid = value == 'border-box'
        elif key == 'transform':
            valid = bool(re.fullmatch(r'(?:(?:rotate[XY]?\(-?\d+(?:\.\d+)?deg\)|perspective\(0px\))\s*)+', value))
        elif key.startswith('border'):
            if key.endswith('color'):
                tokens = re.sub(r'rgba?\([^)]*\)|hsla?\([^)]*\)', 'COLOR', value).split()
                valid = 1 <= len(tokens) <= 4 and all(x == 'COLOR' or COLORS.fullmatch(x) for x in tokens)
            elif key.endswith(('width', 'radius')):
                valid = 1 <= len(value.split()) <= 4 and all(LENGTH.fullmatch(x) for x in value.split())
            elif key.endswith('style'):
                valid = all(x in {'none', 'solid', 'dashed', 'dotted', 'double'} for x in value.split())
            elif key in {'border', 'border-top', 'border-bottom', 'border-left', 'border-right'}:
                tokens = re.sub(r'rgba?\([^)]*\)|hsla?\([^)]*\)', 'COLOR', value).split()
                valid = 1 <= len(tokens) <= 3 and all(LENGTH.fullmatch(x) or x in {'COLOR', 'none', 'solid', 'dashed', 'dotted', 'double'} or COLORS.fullmatch(x) for x in tokens)
        elif key == 'font-weight':
            valid = value in {'normal', 'bold', 'bolder', 'lighter'} or bool(re.fullmatch('[1-9]00', value))
        elif key == 'font-style':
            valid = value in {'normal', 'italic', 'oblique'}
        elif key in {'text-decoration', 'text-decoration-line'}:
            valid = all(x in {'none', 'underline', 'overline', 'line-through'} for x in value.split())
        elif key == 'text-align':
            valid = value in {'left', 'right', 'center', 'justify', 'start', 'end'}
        elif key == 'vertical-align':
            valid = value in {'baseline', 'middle', 'top', 'bottom', 'sub', 'super', 'text-top', 'text-bottom'}
        elif key == 'line-height':
            valid = value == 'normal' or bool(re.fullmatch(r'\d+(?:\.\d+)?', value)) or bool(LENGTH.fullmatch(value))
        elif key in {'font-size', 'text-indent', 'letter-spacing', 'word-spacing', 'margin-top', 'margin-bottom', 'margin-left', 'margin-right', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right'}:
            valid = bool((SIGNED_LENGTH if key.startswith('margin') or key in {'text-indent', 'letter-spacing', 'word-spacing'} else LENGTH).fullmatch(value))
        elif key in {'margin', 'padding'}:
            valid = 1 <= len(value.split()) <= 4 and all((SIGNED_LENGTH if key == 'margin' else LENGTH).fullmatch(x) for x in value.split())
        elif key == 'list-style-type':
            valid = value in {'disc', 'circle', 'square', 'decimal', 'lower-alpha', 'upper-alpha', 'lower-roman', 'upper-roman', 'none'}
        if valid:
            result[key] = value
    return ';'.join(key + ':' + value for key, value in result.items())


class Sanitizer(HTMLParser):
    def __init__(self, base, assets):
        super().__init__(convert_charrefs=True)
        self.base, self.assets = base, assets
        self.output, self.stack = [], []
        self.blocked = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        blocked = self.blocked > 0 or tag in DROP
        emitted = tag if tag in TAGS and not blocked else None
        if tag == 'img' and emitted:
            src = urljoin(self.base, attrs.get('src', ''))
            # URL encoding is normalized when the asset manifest is archived.
            from urllib.parse import quote
            u = urlparse(src)
            src = u._replace(path=quote(u.path, safe='/%:@'), query=quote(u.query, safe='=&%')).geturl()
            if src not in self.assets:
                raise ValueError('Missing local image mapping: ' + src)
            attrs['src'] = self.assets[src]
        safe = {}
        if emitted:
            style = clean_style(attrs.get('style', ''))
            if attrs.get('align') in {'left', 'right', 'center', 'justify'}:
                style += ';text-align:' + attrs['align']
            if style:
                safe['style'] = style.strip(';')
            if tag == 'img':
                safe.update(src=attrs['src'], alt=attrs.get('alt', ''), loading='lazy')
                for key in ['width', 'height']:
                    if attrs.get(key, '').isdigit():
                        safe[key] = attrs[key]
            if tag == 'a':
                href = urljoin(self.base, attrs.get('href', ''))
                if urlparse(href).scheme in {'https', 'http', 'mailto', 'tel'}:
                    safe.update(href=href, target='_blank', rel='noopener noreferrer')
            if tag in {'td', 'th'}:
                for key in ['colspan', 'rowspan']:
                    if attrs.get(key, '').isdigit():
                        safe[key] = attrs[key]
            if tag == 'ol' and re.fullmatch(r'-?\d+', attrs.get('start', '')):
                safe['start'] = attrs['start']
            self.output.append('<' + tag + ''.join(' ' + k + '="' + html.escape(v, quote=True) + '"' for k, v in safe.items()) + '>')
        if tag not in {'br', 'hr', 'img', 'col', 'input', 'meta', 'link', 'source', 'wbr', 'embed'}:
            self.stack.append((tag, emitted, blocked))
            if blocked:
                self.blocked += 1

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index][0] == tag:
                while len(self.stack) > index:
                    _, emitted, blocked = self.stack.pop()
                    if blocked:
                        self.blocked -= 1
                    if emitted:
                        self.output.append('</' + emitted + '>')
                break

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)

    def handle_data(self, data):
        if not self.blocked:
            self.output.append(html.escape(data))

    def result(self):
        while self.stack:
            self.handle_endtag(self.stack[-1][0])
        return ''.join(self.output)


def adapt(raw, base, assets):
    parser = Sanitizer(base, assets)
    parser.feed(raw)
    return parser.result()


def build():
    source = ROOT / 'content/news-source'
    records = json.loads((source / 'articles.json').read_text())
    assets = json.loads((source / 'assets.json').read_text())
    ids = {record['id'] for record in records}
    def local_article_link(match):
        tag = match.group(0)
        href = re.search(r'href="([^"]+)"', tag)
        if not href:
            return tag
        url = urlparse(html.unescape(href[1]))
        article_id = parse_qs(url.query).get('id', [''])[0]
        if url.hostname in {'www.dgjapp.com', 'dgjapp.com'} and url.path.endswith('/newsShow.html') and article_id in ids:
            tag = tag.replace(href[0], 'href="news-detail.html?id=' + article_id + '"')
            tag = re.sub(r' (?:target|rel)="[^"]*"', '', tag)
        return tag
    for record in records:
        record['body'] = adapt(record.pop('rawHtml'), record['sourceUrl'], assets)
        record['body'] = re.sub(r'<a\b[^>]*>', local_article_link, record['body'])
        record['adaptationVersion'] = VERSION
    records.sort(key=lambda record: (record.get('publishedAt', record['date']), record['id']), reverse=True)
    return '// Generated by scripts/adapt-news.py; edit archived sources, not this file.\nwindow.DGJNewsArticles = ' + json.dumps(records, ensure_ascii=False, indent=2) + ';\n'


if __name__ == '__main__':
    (ROOT / 'dist/news-data.js').write_text(build())
    print('Rebuilt news articles from archived sources.')
