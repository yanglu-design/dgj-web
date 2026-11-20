# 店管家新官网交接

更新时间：2026-11-18（Asia/Shanghai）。本文件记录当前状态，覆盖历史记录中的“仅本地”“未发布”等阶段说明。原始过程已完整保存在 [历史归档](content/handoff-history-20261118.md)。

## 当前状态与工作边界

项目位于 `/Users/luna/Documents/dgj_web`，直接维护静态 HTML/CSS/JS。`dist/` 是实际源码及运行素材，不是可删除的构建目录；没有 package.json，不执行 npm build。当前用户已授权的开发和发布均已完成。

本轮仅更新交接文档，不自动提交、推送或重新发布。后续收到新标注先本地增量修改；GitHub 和 Sites 分别按用户明确发布指令同步。保留工作区已有修改，不 reset、clean、强推或重写历史。

| 渠道 | 最新确认结果 |
|---|---|
| GitHub | https://github.com/yanglu-design/dgj-web ，main 已推送到 `49d0cf4`，包含全部14条正式功能描述及此前更新 |
| Sites | https://dianguanjia-home.toasty-bay-2879.chatgpt.site ，第15版 `succeeded`，保留 public |
| 分销代发线上页 | https://dianguanjia-home.toasty-bay-2879.chatgpt.site/product-distribution |
| GitHub Pages | 已保留用户创建的 `.github/workflows/static.yml`，上传路径 `./dist`；推送会触发工作流。本轮没有查验 Pages 部署终态，不据此宣称 Pages 已更新成功 |

GitHub 与 Sites 使用独立源码仓库，提交SHA不同是正常现象，不能互相替代。此次整理产生的文档改动尚未上传。

Sites 第15版精确信息：

- project_id：`appgprj_6ad19323460c819197cc07f35a283cd1`
- version_id：`appgprj_6ad19323460c819197cc07f35a283cd1~appgver_235763da75188191bd144a9d602680c4`
- deployment_id：`appgdep_6afd4f4d57988191a1a18a6df770d745`
- Sites源码SHA：`1c14ab6e1df976bd2e9b9ce1c62bb32f2758e0e6`
- 发布包：`/private/tmp/dgj-sites-release-20261118-feature-copy.tar.gz`；临时目录不作为长期备份。

## 已完成的主要内容

### 内容迁移、搜索与反馈

- 新闻51篇迁移完成，正文图片已补齐；帮助中心203条独立内容、33个视频已接入，197条完整、6篇仍有49处已批准缺图占位。
- 帮助目录、搜索、分类、详情及首页推荐已连接真实数据。设计中的虚拟标题已确认不用迁移，不再计为待办。
- 帮助/新闻分享直接复制文档链接，成功用 Ant Design Message 显示“文档链接复制成功”。本地 file:// 预览会复制本地文件URL。
- 帮助评价与反馈仅保存到当前浏览器 localStorage，没有后台接收接口。点击评价提示“评价成功”；没帮助才展开表单；取消隐藏；合法提交且保存成功才提示“提交成功”。用户已知悉并接受此边界。

### 公用组件与平台入口

- `platform-data.js`维护平台目录与试用文案，`platform-links.js`维护51项已确认映射，`platform-cards.js/css`仅负责卡片，分类/选项卡仍由各页面控制。
- 首页、店管家产品页、开放平台、分销代发页复用卡片；新闻列表侧栏10项链接使用同一映射。48项外链、爱库存/鲸灵2项独立咨询、开放平台1项新站入口。按确认清单保留HTTP、testauth及全部查询参数，不擅改地址。
- 名称已纠正为微信小店、闲鱼、抖音即时零售；分类仍叫“即时零售”。有赞、微盟、魔筷星选图标已按用户素材更新。
- 卡片点击、鼠标离开、窗口失焦后恢复默认；再次悬停或键盘可见聚焦可展开。CTA使用左右内边距+width:auto填充，避免旧width:100%规则溢出。
- 独立咨询组件 `platform-consult.js/css`与全局客服分离：`DGJPlatformConsult.open(button,{anchor,label})` / `close()`；普通按钮可声明 `data-consult="咨询标题"`。每页一个实例，重复加载有保护。
- 独立弹窗按可用空间选择右/左/下/上，限制视口边界；滚动/缩放跟随，外部点击、Esc、焦点离开、失焦关闭，Esc还原触发点焦点。二维码为用户提供原图，contain完整显示。详情见 [平台入口与组件说明](content/platform-links.md)。

### 页面与交互

- 分销代发页 `product-distribution.html/css/js`已按MasterGo节点 `54:00449`（1920×4433）完成：Banner、3项优势、12个平台、3类角色痛点、6项解决方案、14行3版本对比、3项服务保障。
- 14条功能描述已全部替换为用户逐行确认文案，不再有占位描述；支持矩阵保留：标准版前5项，高级版前13项，企业版全部14项。订购进入抖店 `service_id=24069`。
- 本地icon/配图优先；解决方案最新版747×518已含效率气泡，删除重复DOM气泡。勾叉、推荐角标、订购箭头使用源素材；表头参照店管家产品页。
- 分销代发桌面内容宽1200px；<=1000px平台4列，<=700px平台2列、角色/保障纵排、方案顺排，版本表独立横滚。小屏Banner采用独立文字和CTA，避免整图裁切遮住按钮。
- 首页六大功能详情进入tfxportal；两项订购分别service_id=24069/7。功能矩阵2个面板各12个占位卡，支持方向键及左右滑动过渡，支持减少动态效果偏好。
- 开放平台顶部“联系我们”调用独立咨询组件；4个核心优势按钮统一问卷星申请地址；底部“立即咨询”和流程“合作洽谈”进入已确认企点客服链接。
- 公用顶部菜单AI生图→https://fximg.dgjapp.com/，直播助手→https://live.dgjapp.com/，铺货助手→用户指定1688 PACKAGE完整链接；均新页签。页尾“铺货代发”与铺货助手地址完全一致。
- 删除AI生图、直播助手、铺货助手3个本地占位页，保留菜单图标。分销代发已由占位改完整页面；剩余2个占位页待设计。
- 经授权删除根目录3个历史site压缩包，约48MB；早已从Git索引移除，不影响源码和线上网站，旧Git历史未改写。

## 待办与已知限制

1. 等待新标注或设计，完善2个剩余占位页：instant-retail、waybill-sharing。其余7个产品菜单入口已改外链并删除占位页，不要重新创建。
2. 帮助缺图：1673489662640（5）、1765351792316（22）、1692783281591（13）、1579247495621（1）、1698219911741（3）、1693970625736（5）。详见 `content/help-source/missing-images.md`/JSON。补图放 `配图/帮助补图/<文章ID>/01.png` 等，序号只计缺图，保留真实扩展名。
3. 若需要集中接收反馈，先确定真实接口和存储方案，再替换localStorage；部署静态网站不会自动将反馈发给运营。
4. 视频尚未逐条人工播放验收；自动数据检查、图片加载及部署成功不能替代完整业务/视觉验收。
5. 用户曾遇到Sites Cloudflare阻断页；站点访问设置已确认public，但不代表所有网络可访问。没有权限修改Cloudflare安全策略，不把此问题归咎于前端代码或擅改访问权限。

## 文件入口与数据维护

| 用途 | 维护位置 |
|---|---|
| 首页 | dist/index.html、script.js、styles.css、home-news.js |
| 店管家/分销代发/开放平台 | dist/products.html/js/css、product-distribution.html/js/css、open-platform.html/js/css |
| 公用导航/页尾 | dist/shared-header.js/css、shared-footer.js |
| 平台目录/映射/卡片 | dist/platform-data.js、platform-links.js、platform-cards.js/css |
| 独立咨询/全局客服 | dist/platform-consult.js/css；customer-service.js/css，二者保持独立 |
| 已确认映射来源 | content/platform-links-confirmed.json、outputs/01a1d3cb-daa2-7e23-9bc0-c5c6fbdc53ea/平台入口映射清单.xlsx |
| 新闻 | content/news-source/ → scripts/adapt-news.py → dist/news-data.js；news.js/css及news-detail.js/css |
| 帮助 | content/help-source/ → scripts/adapt-help.py → dist/help-migrated-data.js；help-page-data.js装配，help-pages.js/css负责交互 |
| 搜索与分享 | dist/help-search-ui.js、share-article.js |
| Banner点击区 | dist/banner-hitarea.js；底部开放平台CTA比例定位在open-platform.css |
| 图片原稿/运行副本 | icon/、配图/ → dist/assets/icon/、dist/assets/images/ |

修改正文应更新源存档/映射，再运行相应adapt脚本，不手改生成JS正文。不重新全量抓取；帮助 `--samples-only`仅用于明确回退，`--allow-missing-images`用于保留已批准缺图占位。确认清单JSON保留历史原名，运行映射改名时需同步查找和检查，不能改掉原URL参数。

## 本轮经验与验证

- MasterGo读取先选中明确画板；无选中时索要含layer_id的图层链接，页面链接不够。分销代发节点54:00449；独立咨询共同父节点124:37596（文件205958939153260、页面36:8424）。截图导出曾失败，不冒称已完成设计截图对照。
- 用户更新源图后，必须重新复制dist副本并更新缓存版本；核对源与副本字节一致。新版配图可能自带文字/气泡，先确认后删除重复叠层。
- file://下外部SVG mask可能不显示。分销代发订购箭头将icon/arrow-right.svg原字节转data URI，保留currentColor；已有测试验证内嵌内容与原图一致，不用文字箭头代替。
- 推荐表头采用灰色单元格底+橙色圆角伪元素，避免border-collapse下圆角不可靠；角标保持原PNG，52px定位。
- 热区跟随原图尺寸、cover缩放及居中裁切计算，不能固定坐标猜测。banner1/2/5均1920×480，按钮380/293/160/49；slogan6为1920×284，按钮880/176/160/44，采用百分比。
- 共享代码修改后同步所有加载方缓存；完整URL保留编码参数，HTML属性转义&为&amp;，不要重复解码/编码。导航外链设置_blank和noopener noreferrer。
- 最近全量运行15项Node检查通过；后续文案更改复跑product-distribution检查并逐行核对14项，通过。按改动范围选择测试，不为文档修改重跑全套。
- 浏览器已检查分销代发1130px/390px：无坏图、整页无横向溢出、手机标题和按钮可见、表格独立横滚。后续图标/文案修订做源素材和DOM检查，不能称每次都完成浏览器视觉验收。
- GitHub上传先fetch并核对远端增量，保留用户Pages工作流；明确暂存源码/素材/文档，排除临时 `.xlsx.inspect.ndjson`。此临时文件仍在本地未跟踪，未删除或上传。
- Sites发布使用独立临时checkout与官方site-workflow助手，先打开同步远端，再覆盖dist、打包、save、deploy；凭据只留会话内存并走stdin，不落盘或打印。失败保留提交并按原因重试，部署终态succeeded才报告完成。
- Sites首次大源码推送曾遇64MiB单次传输限制，后分批同步成功；不是GitHub单文件限制。此次小量改动增量推送即可。最近一次连接暂时失败重试后成功，未产生重复站点。

常用检查：`node tests/product-distribution.test.cjs`、`platform-sync.test.cjs`、`platform-links.test.cjs`、`platform-consult.test.cjs`、`banner-hitarea.test.cjs`（后四项同位于tests/）。新闻/帮助改动使用tests下对应检查及 `python3 tests/test_news_richtext.py`。

GitHub最近提交：49d0cf4（14条描述）、cea7917（页尾/合作洽谈）、54e2d98（分销代发页与导航）。Sites最近版本15（14条描述）、14（页尾/合作洽谈）、13（分销代发页与导航）。

2026-11-20首页更新：MasterGo选中124:53155特色功能，读取12张功能卡片的图标、标题、说明；两套矩阵面板沿用此前相同内容约定，替换占位为设计12项，SVG从icon复制到dist。功能矩阵与订购方案均调整为打单发货在前且默认选中，面板顺序、aria/inert、滑动方向、订购链接同步换位。home-actions检查通过，缓存20261120-matrix。仅本地未发布。

2026-11-20导航：厂商代发vendor-printing、分销管理distribution-management、分销上货distribution-listing改为用户指定完整外链，复用_blank/noopener noreferrer；保留全部编码参数，所有页面header缓存20261120-product-links。未删除对应占位文件（用户未要求）。仅本地未发布。

2026-11-20矩阵布局修正：重新读取MasterGo124:53155，明确图标32px、图文8px间距、标题20/32和说明16/24、padding24、卡片最小宽240。修复旧网格标题默认margin和隐式行分配问题，图标跨两行，标题/说明各自紧凑对齐；auto-fit按240px最小宽自适应列数（930视口3列），卡片min-height130且内容可增高。两套面板共用，缓存20261120-matrix-layout，仅本地未发布。

2026-11-20：公用产品导航AI数据助手ai-data改为https://erp.dgjapp.com/Account，新页签打开并复用noopener noreferrer，导航缓存20261120-ai-data-link。保留占位页文件，仅本地未发布。

2026-11-20：按用户要求删除已关联外链的4个占位页：product-ai-data.html、product-vendor-printing.html、product-distribution-management.html、product-distribution-listing.html。此前AI生图/直播助手/铺货助手3页已删除；目前仅即时零售和快递单号共享保留占位。外链、菜单图标和公共占位CSS/JS保留，检查无内部悬空引用。仅本地未发布。

2026-11-20：即时零售菜单保留显示，改为新页签https://fuwu.jinritemai.com/detail?service_id=34004；删除product-instant-retail.html占位，检查无HTML内部引用。现仅快递单号共享保留占位，覆盖此前2个占位页说明。导航缓存20261120-instant-link。仅本地未发布。
