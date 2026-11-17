import importlib.util
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('adapter', Path(__file__).resolve().parents[1] / 'scripts/adapt-news.py')
adapter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(adapter)


class RichTextTest(unittest.TestCase):
    def test_editor_formatting_and_blanks(self):
        raw = '<p style="text-align:center;text-indent:2em"><span style="color:rgb(249, 110, 87);background-color:#ffee00;font-size:20px;font-weight:700;text-decoration:underline">重点</span></p><p><br></p><ol><li>步骤</li></ol><table><tr><td colspan="2">表格</td></tr></table>'
        clean = adapter.adapt(raw, 'https://www.dgjapp.com/', {})
        for value in ['text-align:center', 'text-indent:2em', 'color:rgb(249, 110, 87)', 'background-color:#ffee00', 'font-size:20px', 'font-weight:700', 'text-decoration:underline', '<p><br></p>', '<ol>', 'colspan="2"']:
            self.assertIn(value, clean)

    def test_unsafe_content_and_legacy_layout_removed(self):
        raw = '<div onclick="alert(1)" style="width:1080px;position:fixed;background-image:url(x);color:red"><script>alert(1)</script><a href="javascript:alert(1)">正文</a></div>'
        clean = adapter.adapt(raw, 'https://www.dgjapp.com/', {})
        self.assertIn('color:red', clean)
        self.assertIn('width:1080px', clean)
        for value in ['onclick', '<script', 'javascript:', 'position:', 'url(']:
            self.assertNotIn(value, clean)

    def test_editor_decorative_layout(self):
        raw = '<section style="display:flex;flex-flow:row;justify-content:center"><section style="background-image:linear-gradient(rgb(255, 228, 180) 13%, rgb(255, 207, 123) 88%);flex:0 0 auto;min-width:5%">01</section><section style="flex:100 100 0%;background-color:rgb(249, 110, 87)"><section style="width:0px;height:0px;border-style:solid;border-width:8px 0px 0px 9px;border-color:rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) rgba(255, 255, 255, 0) rgb(238, 163, 76);margin-top:-13px;transform:rotateX(180deg)"></section>系统超稳</section></section>'
        clean = adapter.adapt(raw, 'https://www.dgjapp.com/', {})
        for value in ['display:flex', 'flex-flow:row', 'linear-gradient(', 'flex:100 100 0%', 'width:0px', 'border-width:8px 0px 0px 9px', 'border-color:rgba(', 'margin-top:-13px', 'transform:rotateX(180deg)']:
            self.assertIn(value, clean)
        self.assertEqual(adapter.clean_style('background-image:linear-gradient(red, url(x));position:fixed;transform:translateX(999px)'), '')

    def test_images_require_local_mapping(self):
        with self.assertRaises(ValueError):
            adapter.adapt('<img src="/missing.png">', 'https://www.dgjapp.com/', {})
        self.assertIn('src="assets/news-articles/image.png"', adapter.adapt('<img src="/image.png" width="800" onerror="alert(1)">', 'https://www.dgjapp.com/', {'https://www.dgjapp.com/image.png': 'assets/news-articles/image.png'}))

    def test_flex_title_stays_above_overlapping_background(self):
        raw = '<section style="display:flex;flex-flow:column"><section style="z-index:1">标题</section><section style="margin-top:-20px;background-color:#fff">正文</section></section>'
        clean = adapter.adapt(raw, 'https://www.dgjapp.com/', {})
        self.assertIn('style="z-index:1"', clean)
        self.assertIn('margin-top:-20px', clean)
        self.assertEqual(adapter.clean_style('z-index:expression(alert(1))'), '')
        import json
        sources = json.loads((adapter.ROOT / 'content/news-source/articles.json').read_text())
        assets = json.loads((adapter.ROOT / 'content/news-source/assets.json').read_text())
        article = next(item for item in sources if item['id'] == '1777370433932')
        body = adapter.adapt(article['rawHtml'], article['sourceUrl'], assets)
        self.assertEqual(body.count('z-index:1'), 5)
        css = (adapter.ROOT / 'dist/news-detail.css').read_text()
        self.assertIn('.article-body{isolation:isolate;', css)


if __name__ == '__main__':
    unittest.main()
