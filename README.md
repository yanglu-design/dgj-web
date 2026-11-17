# 店管家新官网

静态 HTML、CSS 和 JavaScript 网站，包含产品介绍、新闻动态、帮助中心和全局客服入口。

## 目录

- `dist/`：实际网站源码、运行素材及生成的数据文件，必须纳入版本管理。
- `content/`：新闻与帮助迁移来源、原始存档、素材映射及报告。
- `scripts/`：迁移及数据适配脚本。
- `tests/`：页面、交互和数据检查。
- `icon/`、`配图/`、`荣誉/`：维护用源素材；网页引用 `dist/assets/` 内的副本。
- `HANDOFF.md`：当前进度、发布记录、待办及维护约束。
- `.openai/hosting.json`：现有 Sites 项目标识与静态目录，不是 GitHub Pages 配置。

本项目没有 npm 构建步骤。不要删除 `dist/` 或将其加入忽略规则。

## 本地预览

在项目根目录执行：

```sh
python3 -m http.server 8000 --directory dist
```

浏览器打开 `http://localhost:8000/`。网站部署时应将 `dist/` 内容作为网站根目录。

## 检查

按改动范围运行相应检查，例如：

```sh
node tests/help-pages.test.cjs
node tests/share-article.test.cjs
node tests/customer-service.test.cjs
node tests/banner-hitarea.test.cjs
node tests/news-samples.test.cjs
python3 tests/test_news_richtext.py
```

其他检查见 `tests/`。简化 DOM 和数据测试不代替浏览器视觉或视频播放验收。

## 内容维护

先修改 `content/` 中的原始存档或素材映射，再用 `scripts/adapt-news.py`、`scripts/adapt-help.py` 生成对应网页数据；使用方式与补图流程见 `HANDOFF.md` 和相关来源目录 README。不要直接改生成的 JS 正文。

源素材和网页副本用途不同，不要仅因重复就删除。旧 ZIP 导出及系统缓存不再纳入后续版本；已有 Git 历史保留。

## 当前范围与限制

- 已接入 51 篇新闻、203 条帮助内容；6 篇帮助文章共 49 处缺图，按批准方案显示“原图暂缺”。
- 10 个产品页面仍为各自独立的占位页，等待设计与内容。
- 评价及反馈仅保存在当前浏览器的 `localStorage`，没有服务器接收端。界面“提交成功”表示本地保存成功，不代表运营或客服已收到。
- 分享直接复制当前页面 URL；本地预览复制的地址仅用于本地。
- GitHub 仓库用于版本管理，不会因推送自动发布网站；托管配置与 Sites 发布另行处理。

此仓库维护企业网站及素材，没有授予通用开源使用许可。第三方组件保留其原有许可证和声明。
