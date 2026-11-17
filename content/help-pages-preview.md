# 帮助中心主体页面预览

主体页面已搭建，现已接入全部四个产品目录的 203 条真实内容（含原 5 篇样本），其中 6 篇待补图。正式目录和搜索不再混入设计预览。此前虚拟 FAQ 标题已按新设计替换为 12 条真实文章，均按明确 ID 进入详情；原 13 个虚拟标题不再列为待补内容。详情见 help-source/bulk-report.md；真实数据由 dist/help-migrated-data.js 提供。

- 分类：help-category.html?product=distribution&category=getting-started（3 张新手指引卡片）；category=operations（设计中的操作指引，加常见问题关联的标题预览）。
- 详情：help-detail.html?id=manufacturer-guide；另有 merchant-guide、intermediary-guide、1673489973673、1612338372772。
- 搜索：help-search.html?q=电子面单；支持四个产品过滤、标题/摘要搜索和关键词高亮。
- help.html 的搜索、目录、分类标签、查看更多及已匹配样本入口已接通。
- 帮助首页 FAQ 标题全部进入对应文档预览；目录为产品—分类—文档三级，选项间距 8px。右侧选项卡在当前页切换分类，按统一目录顺序展示最多 6 条文档，“查看更多”链接到当前分类列表。已有首页标题也进入统一预览数据，尚缺正文的条目仍非已迁移文档。

设计节点：分类 82:11176、82:28240；详情 82:27624、82:29063、124:19133；搜索 94:06842。页面样式和逻辑在 dist/help-pages.css、dist/help-pages.js，帮助首页衔接在 dist/help-home.js。

厂家、商家、中间商已接真实视频入口、封面及完整简介，两篇操作指引已替换为完整原文及本地图片。其他尚缺正文条目仍为预览。反馈仅保留本地选中，不发送数据；反馈问题暂不可用。未制作未提供设计的弹窗或复杂空状态。面包屑按实际文档生成，已修正设计稿中与正文不符的示例路径。

验证：node tests/help-pages.test.cjs、node tests/help-home.test.cjs；相关 JS 语法、HTML 本地引用及新闻列表/首页回归检查通过。测试使用简化 DOM 执行真实脚本，不等于浏览器视觉验收。
