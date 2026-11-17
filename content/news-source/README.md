# 新闻富文本存档

`articles.json` 保存已导入文章的元数据和原始正文 `rawHtml`，来自旧站展示页的正文区域，尚非后台接口直接导出。`assets.json` 记录原图地址与本地图片路径。`migration-report.md` 为完整的分类及导入状态清单，`pending-articles.json` 单独保存等待处理的缺图文章。原四篇样本及数据文件的备份位于 `content/news-migration-backup-20261116/`。

运行 `python3 scripts/adapt-news.py` 可按允许清单重建 `dist/news-data.js`。该步骤无需网络，保留正文颜色、字号、强调、对齐、缩进、段落间距、空行、列表和表格，以及编辑器内部的渐变、Flex、尺寸、边框折角、负边距和受限旋转。保留尺寸由正文区域的最大宽度约束；不会新增整篇正文的 Flex 或段落间距。脚本、事件属性、页面定位、外部背景资源和字体被过滤。图片按本地清单引用，缺少映射时停止生成，避免静默丢图。

接入后台时，只需提供相同字段与编辑器正文 HTML，继续使用此适配流程；实际后台输出仍需以接口样本验证。

验证命令：`python3 tests/test_news_richtext.py`、`node tests/news-samples.test.cjs`、`node tests/news-list.test.cjs`、`node tests/home-news.test.cjs`。
