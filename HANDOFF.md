# 店管家新官网交接

更新时间：2026-11-18（Asia/Shanghai，首页平台入口已本地接入）。本文件替代此前过时描述；只处理最新明确要求，不重做已验收页面或重跑全量抓取。

## 1. 我们在做什么

在 `/Users/luna/Documents/dgj_web` 中，依据 MasterGo 和浏览器标注搭建店管家新官网，迁移旧站新闻及帮助内容，保留编辑者主动排版。近期主线已从新闻扩展到帮助中心主体、203条内容迁移、搜索交互和公共导航/页尾完善。

这是直接维护静态 HTML/CSS/JS 的项目：`dist/` 是真实源码及预览目录，不是可删除重建的产物；根目录无 package.json，不要默认执行 npm build。数据生成文件通过既定 Python 脚本更新。

**2026-11-17 17:00（Asia/Shanghai）用户重新授权后已发布当前 dist。** 包含导航分割线修复及新版反馈交互。用户已明确知悉反馈仅保存在当前浏览器，无后台接收端；本轮按原方案发布，访问权限保持不变。

最新要求：继续本地修改，暂不提交或推送GitHub，也不发布Sites。首页六个功能“查看详情”已改新页签tfxportal入口，两处订购分别进入抖店service_id=24069和7；功能矩阵支持点击/键盘左右滑动切换，两个独立面板各12张相同占位卡片，非当前面板aria-hidden/inert，支持减少动态效果偏好。功能卡片点击后复原，离开后再悬停或键盘重新聚焦可再次展开。改动在dist/index.html、script.js、styles.css，tests/home-actions.test.cjs已通过；加载版本20261117-home-motion。以上尚未上传或发布。

平台入口：2026-11-18用户更新原Excel并回复“清单已确认”，51项全部已确认。已核对并本地接入首页：48项沿用外链、爱库存/鲸灵2项复用现有客服咨询气泡、开放平台新页签进新站open-platform.html。得物/人人商城含testauth域名和部分HTTP/特殊域名均按用户确认沿用，不擅改参数。确认存档content/platform-links-confirmed.json保留Excel SHA256及逐项来源；dist/platform-links.js为运行映射，只在首页加载。产品页和开放平台页的卡片入口未改。tests/platform-links.test.cjs、customer-service、home-actions、home-news通过。详见content/platform-links.md。本轮未提交/推送GitHub或发布Sites。

用户另纠正平台名称：微信小店/视频号→微信小店、咸鱼→闲鱼，已修改本地platform-data.js及相关名称判断、更新加载缓存版本20261117-platform-names；共享平台数据调用方同步显示正确名称，未按特定断点写死。未提交或发布。

2026-11-18追加本地修复：首页平台卡片点击后立即恢复默认样式，移开再悬停/键盘重新聚焦可再次展开；外链原生新页签和两项客服咨询行为保留。script.js/styles.css加载版本20261118-platform-reset，platform-links、customer-service、home-actions测试通过。仍不提交GitHub或发布Sites。

2026-11-18平台标签样式追加：仅“免费使用”标签增加free语义类，共用.platform-card em.free背景为主题蓝#0888ff；首页、产品页及开放平台页统一，免费试用橙色与内测邀请青色保留。相关样式/脚本入口版本20261118-free-badge；语法与平台/首页交互检查通过。仅本地修改。

平台卡片离开复原后续修正：pointerleave保持is-dismissed，pointerenter解除；CSS用:has(:focus-visible)替代:focus-within，普通残留焦点不再展开，window blur同步复原。index脚本/样式最新版本20261118-platform-leave，相关状态回归通过。本地未提交或发布。

六大核心功能卡片追加相同复原行为：点击、pointerleave、window blur均保持is-dismissed；重新pointerenter或:focus-visible键盘聚焦解除。复原时禁用反向过渡，立即显示默认内容，重新悬停仍有原展开动画。index脚本/样式最新版本20261118-feature-leave；home-actions与platform-links回归通过。仍仅本地修改，不提交GitHub或发布Sites。

最新标注已扩展平台同步范围（覆盖此前“仅首页”范围说明）：新建dist/platform-cards.js，首页、产品页32卡、开放平台四类51卡共用已确认映射、悬停/点击/离开/失焦复原及客服咨询；新闻列表侧栏10个平台通过data-platform-link映射同一链接（淘宝映射淘宝/淘特）。产品页对比CTA新页签去抖店service_id=7；开放平台底部咨询去既有QQ客服完整链接，四个核心优势选项卡的coreAction均去https://www.wjx.top/m/42955488.aspx。魔筷星选从用户icon/魔筷星选20.svg重新复制并统一SVG引用，logo版本20261118-logo。四页相关加载版本20261118-platform-sync；platform-sync、platform-links、customer-service、home-actions、news-list、banner-hitarea检查通过。本轮仍未提交/推送GitHub或发布Sites。

平台卡片组件后续收敛：render(grid, items)不接收分类，分类选择/选项卡保留各页；新建platform-cards.css统一悬停/聚焦按钮样式，清除styles.css旧width:100%冲突。按钮left/right配合width:auto填满内容区，沿用1100px断点左右内边距24/16px，悬停不再改变卡片尺寸。三处页面均加载组件CSS/JS，相关加载最新版本20261118-card-component。platform-sync覆盖共享样式引用及分类边界；检查通过，仅本地修改。

独立内测咨询弹窗已完成（覆盖前文使用全局气泡的历史说明）：用户补充图层链接layer_id=124:37596后，成功读取四种方位。新增dist/platform-consult.js/css及assets/platform-consult，原设计二维码/SVG背景由Asset Session按SHA256复制到永久资源。334×192布局，含微信二维码、QQ800183731、客服电话400-863-8288及186-0306-5384；卡片改调DGJPlatformConsult.open，不调用DGJCustomerService.openOnline。按可用空间选右/左/下/上，缺空间限位视口；scroll/resize跟随，离屏/外部点击/Esc/焦点移出/窗口失焦关闭，Esc返回原触发点。三页弹窗依赖版本20261118-independent；platform-consult、platform-links、platform-sync、banner-hitarea测试通过。设计截图工具报不可导出/页面不匹配，未声称浏览器视觉验收。详见content/platform-links.md。无待提供设计链接事项；仍仅本地修改，未提交/推送GitHub或发布Sites。

同轮独立完成：open-platform底部slogan6.svg为1920x284，原图按钮x880/y176/w160/h44。open-platform.css点击热区改为图像比例百分比，删除720px下固定100x36热区覆盖；CSS缓存20261118-cta-fit。banner-hitarea测试增加390/720/1130/1920/2560宽度比例检查并通过，platform-sync回归通过。仅本地修改，未提交或发布。

### GitHub源码管理

- 用户新建并指定私有空仓库 `https://github.com/yanglu-design/dgj-web`，已核实仓库私有且为空，并将本地origin关联到该HTTPS地址。首次上传保留现有8次提交及后续整理提交，不强制推送，不改变可见性。
- 根目录新增README与.gitignore；3个旧导出ZIP及3个已跟踪.DS_Store仅移出索引，本机文件保留。旧ZIP仍存在于原有Git历史，未重写历史。dist、迁移档案、源素材、脚本与测试均保留。
- 本地上传前检查报告为`content/github-preflight-20261117.md`，其中“未关联远程、未整理”等是检查当时状态，不是本次授权后的当前状态。
- 本机GitHub CLI认证可访问该私有仓库，GitHub连接器曾返回404，不能据此断言仓库不存在。网络命令在沙箱内可能报DNS错误或误报凭据无效，按工具审批联网重试；不记录凭据。
- 上传GitHub用于源码管理，不创建Pages或其他自动部署；首次上传结果以远端main提交SHA校验为准。
- 2026-11-17首次上传成功：网站源码提交`a75bda387234bac95a60dd34f368b041766b0505`已推送到`origin/main`，本地main建立上游关联。后续交接记录以独立文档提交同步；保留原有8次提交和全部源素材，不强制推送。

## 2. 已完成什么

### 新闻：51篇已全部迁移，补图已完成

| 原栏目 | 旧栏目ID | 新分类/数量 |
|---|---|---|
| 公司动态 | 1562305338760 | 企业资讯6、企业荣誉6 |
| 行业新闻 | 1562305354742 | 行业新闻18 |
| 电商干货 | 1565166432536 | 电商干货21 |

- 用户曾重复粘贴行业/干货入口，已核实真实ID并读取干货第二页，不要重新确认范围。
- 列表、分类筛选、搜索、分页、整卡进入新站详情、面包屑、下一篇和分享已接通统一数据；正文指向已迁移文档的链接转为新详情。
- 首页四类资讯各展示最新4篇，选项卡组居中，查看更多独立靠右并进入对应分类。“全部”显示文案的内部兼容值仍为`推荐内容`。
- 详情显示真实`publishedAt`时分秒，列表只显示日期，按完整时间倒序。“更多新闻”8条，排除当前文；新闻侧栏为“产品试用”，查看更多回首页。
- 原四样本：京东认证1777370433932、春节通知1770622508836、爆款总溜走1770276244345、打印发货教程1574663968624。样本获用户确认后再批量迁移。
- 《最佳变现方式——玩短视频！》1573630500314的4张知乎图已补齐，均resolved，不再向用户索要新闻补图。源在`配图/新闻补图/`，官网用`dist/assets/news-articles/1573630500314-1.png`至`-4.png`。第4张虽名PNG实为JPEG，已只转换官网副本，源文件保留。

### 帮助中心：203条均接入，6篇待补图

| 产品 | 条数 | 视频数 | 待补图文章 |
|---|---:|---:|---:|
| 分销代发ERP | 41 | 24 | 1 |
| 铺货代发 | 12 | 0 | 1 |
| 跨境分销 | 3 | 0 | 0 |
| 打单发货 | 147 | 9 | 4 |
| 合计 | 203 | 33 | 6 |

- 203条唯一内容：197条资源完整，6篇完整正文有49个缺图位置。用户明确批准“保留正文并标注原图暂缺”，不得删文或当作整篇正文失败。
- 831个本地资源映射，另有3张样本视频封面；格式按真实签名识别，保留GIF。33条视频用公开稳定路由，已检测媒体响应；未下载整段视频、未逐段浏览器播放验收。
- 原5篇样本保持：厂家manufacturer-guide、商家merchant-guide、中间商intermediary-guide、欢迎使用1673489973673、打单发货1612338372772。前三篇旧入口实际指向搜狐视频页，真实简介/封面/媒体地址已接入。欢迎文章源正文自身是一张长图，使用原图而非设计截图。
- 一级产品列表右侧只显示二级菜单：圆点、14px常规字重、16px条目间距；二级再进入卡片/文档列表。首页每分类按旧目录顺序最多6条，查看更多进入当前分类，不套用新闻时间倒序。
- 菜单一级字重500，二级padding-left24px，三级40px，间距8px；一、二级分别同级展开互斥。箭头16px加四周8px点击区，其他整行选择。一级只在进入一级列表时高亮，展开或选子级不高亮一级。
- 一级、二级、详情共用工作区：上下16px，短内容填满窗口，长内容随页面增长。左目录吸顶、独立滚动，按实际顶部位置动态计算高度，底部16px；<=700px上下排列。不要恢复正文固定高度滚动盒。
- 视频没有正文时隐藏正文容器及“该文档内容暂未提供”；有简介/正文时正常显示。普通缺正文预览仍可提示缺失。
- 原13个未匹配标题已由用户确认是设计虚拟标题，**不再是待补任务**。首页FAQ按新图更新成12条真实文章，以data-help-id关联；“所有帮助文档”改为“所有文档”。正式目录/搜索不混设计预览，旧预览标题匹配成功的ID保留兼容映射。

### 搜索、分享及其他页面

- 帮助搜索三张MasterGo稿：输入82:38125、激活124:29706、结果124:26721。读取结构/样式成功，截图导出均超时，不能声称完成截图视觉验收。详见`content/help-search-design.md`。
- 首页搜索最大640px/圆角12px，内联400px/圆角8px，激活蓝紫渐变描边、蓝色光标；帮助搜索框原生清除图标已隐藏。空输入显示真实历史，最多5条、localStorage保存，标题到标签16px、标签间8px，无历史时不填假示例。
- 输入建议最多5条真实标题，前缀优先、高亮关键词；点击进详情，回车未选建议时全文搜索。支持上下键、Esc、外部点击关闭、中文输入法及空输入校验。
- 搜索结果为浅灰#F5F7FA页面背景、白卡，顶部面包屑/搜索框；产品标签选中蓝色下划线；标题16px/500、摘要14px单行省略，正文命中时提取附近摘要。保留700px/1000px断点。
- 帮助/新闻共用`share-article.js`：点击直接复制当前 URL，不调用原生分享；Clipboard API 失败则尝试 execCommand。成功使用本地 Ant Design 5.29.3 Message 提示“文档链接复制成功”，失败显示错误。按用户要求，本地预览也复制当前 file:// URL，该地址仅用于本地。
- 2026-11-17 本地新增反馈设计（MasterGo 124:36226 默认、124:36369 展开）：移除旧客服/反馈链接；评价后 Ant Design Message“评价成功”，仅“没帮助”展开表单。意见必填最多100字，联系方式可选手机/邮箱/QQ且选填，取消收起保留草稿；有效提交保存后提示“提交成功”并清空收起。用户明确批准先做前端并保存在当前浏览器；localStorage 按 `dgj-help-feedback:<文章ID>` 存储选中项及最近50条提交，未接后台，保存失败不报成功。本轮已随最新版本发布。旧站内容来自公开页面，不自动同步新增内容。
- 关于我们荣誉墙、发展历程已获认可，节点和箭头等使用用户icon；不主动重做。新闻分页/搜索用本地Ant Design5.29.3，React/ReactDOM18.3.1，保留精简依赖及许可证。
- 公共页尾打印控件下载为https://www.dgjapp.com/widgeDownload/index.html，新页签；产品试用回首页；菜单和联系我们悬停文字/图标纯白。

## 3. 后续改动：已同步Sites

以下改动最初按用户要求仅本地完成，现已在再次授权后随最新版本发布：

1. 页尾QQ800183731、旺旺“中恒电商”分别跳用户指定企点/amos链接，均新页签，带noopener noreferrer。完整参数以`dist/shared-footer.js`为准，不重建、不截断token/key/gseq；未代用户发送消息。
2. 产品菜单11个入口各自独立：店管家保留`products.html`，另外10个为`product-<slug>.html`占位页，展示对应产品名及“产品页面内容正在完善，敬请期待。”，不再全部落店管家页。页尾产品链接也更新到对应独立页。
3. 占位slug：distribution、vendor-printing、instant-retail、distribution-listing、listing-assistant、distribution-management、waybill-sharing、ai-data、ai-image、live-assistant。共用`product-placeholder.css/js`，导航产品项高亮，产品内容待后续设计。
4. 首页统计区五组数字及说明统一纯白，去掉数字渐变和说明透明度；未改数据截止说明的颜色。
5. 后续已修复首页Banner1热区随cover缩放/裁切定位，产品页增加同款ERP新页签入口；共用banner-hitarea.js，源图1920×480、按钮x380/y293/w160/h49，多尺寸计算检查通过。
6. 后续视频分类列表改为新手指引同款封面卡片，依据文档video类型区分图文列表；标题单行省略、左右12px、行列间距16px，首页卡片未改。
7. 全局悬浮联系客服已按MasterGo默认及三种悬停状态接入23个HTML：微信二维码、QQ/淘宝入口、电话，支持悬停、键盘和触屏；原设计素材永久存assets/customer-service。实现customer-service.css/js，说明content/customer-service.md，测试customer-service.test.cjs通过。已发布。
8. 客服图标按用户更新的根目录icon素材重新生成dist副本：默认/激活分开，激活纯白无透明度；弹出面板QQ、淘宝及电话的选项悬停时，图标与文字同步蓝色。页尾联系项悬停/键盘聚焦同步纯白，独立派生素材位于assets/footer-contact，保留默认图标。不要只用CSS filter试图去掉SVG内部fill-opacity。
9. 导航下拉遮挡分割线：shared-header.css以.site-header::after在菜单z-index:40之上重绘1px线（z-index:41、pointer-events:none），不挪动下拉、不制造悬停间隙。23个HTML缓存版本为shared-header.css?v=20261117-divider，已发布。
10. 帮助/新闻分享已统一直接复制当前文档URL，Ant Design Message提示“文档链接复制成功”。使用本地assets/vendor/antd-message-5.29.3.js及现有React/ReactDOM18.3.1；两个详情页先加载依赖，再加载share-article.js。无运行时CDN依赖；组件保留许可证。
11. 帮助详情新版评价及反馈表单已发布。help-pages.css/js缓存版本均为20261117-feedback；交互、字段、数据去向见第2节。提交成功表示浏览器localStorage写入成功，不表示客服或运营收到反馈。用户已主动询问并明确知悉这一点，随后仍授权发布。

涉及共享导航/页尾、客服气泡、Banner热区、产品占位页、帮助列表/详情及分享组件；各加载方缓存版本已更新。检查了独立产品路由、客服链接、Banner适配计算、评价/取消/校验/提交/存储失败和分享复制；未声称逐页浏览器视觉验收。

## 4. Sites发布状态及经验

- 复用现有“店管家企业官网”，不新建。`.openai/hosting.json`的project_id：`appgprj_6ad19323460c819197cc07f35a283cd1`，静态目录dist。
- 地址：https://dianguanjia-home.toasty-bay-2879.chatgpt.site 。帮助入口/help.html可能规范为/help。访问权限保持原仅owner的custom配置，未改公开。
- 2026-11-17 17:00（Asia/Shanghai）最后部署成功：源码提交`3914d3f9a79f5e3b50ba44cdcd63a69486c8cadd`；部署ID`appgdep_6afc1797bf388191885f48d6e11f0f10`。包含当前完整 dist；归档`/private/tmp/dgj-sites-release-20261117-feedback.tar.gz`。本轮分享、客服、Banner、帮助页面相关测试通过，未逐页浏览器视觉验收。
- 最新保存版本ID：`appgprj_6ad19323460c819197cc07f35a283cd1~appgver_177f95ee806081919e4e0934e5eaa355`。原生部署工具已返回succeeded，无待轮询部署。前一成功版本源码为`511739165800972bdf8ca24edd756d4325c0533d`，用于定位历史，不自动回滚。
- 依Sites技能，在独立目录`/private/tmp/dgj-sites-update-20261117/.sites-checkout`打开既有源仓库。本地项目无remote、有大量未提交改动，未对本地仓库commit/push或清理；远端源提交发生在临时仓库。
- 单次Git push上限64MiB，首次107.6MiB被拒。相同推送不要原样重试；失败提交保留，在临时仓库从远端基点分5批每批约40MiB文件推送，全部齐备后只部署最终版本。没有删图、降质或发布中间批次。
- 首次全量迁移的历史归档约163MiB：`/private/tmp/dgj-sites-update-20261117.tar.gz`，不是最新发布包。64MiB限制针对单次Git push，不是部署归档大小；后续小量修改直接增量同步即可，不必重复分五批。
- 下次须用户再次明确授权更新Sites。先读技能、get_site、获取新凭据、验证或重开checkout，临时目录可能清理。凭据只通过stdin传递，不写文件、命令参数或交接；旧凭据不要重用。保持站点ID和访问权限。

## 5. 待补信息与下一步

### 6篇49处帮助图片

| ID | 标题 | 数量 |
|---|---|---:|
| 1673489662640 | 小程序-如何快速设置自动代发 | 5 |
| 1765351792316 | app端官方仓操作指引 | 22 |
| 1692783281591 | 新版小红书店铺面单开通教程 | 13 |
| 1579247495621 | 如何使用一联单模板 | 1 |
| 1698219911741 | 抖店_在线寄件 | 3 |
| 1693970625736 | 抖店_承诺日达 | 5 |

详见`content/help-source/missing-images.md`/JSON。用户可放入`配图/帮助补图/<文章ID>/01.png`等，序号只计算缺图；JPG/GIF请保留真实扩展名。收到后更新映射、占位与needs-images状态，离线重建并验证，不默认再全量抓取。

下一步顺序：

1. 等用户查看最新线上版本或本地预览并给新标注，按范围增量修正；当前已授权任务均完成。
2. 收到产品设计/内容后完善10个占位页，不自行编造功能、价格或重建已完成店管家页。
3. 收到补图后替换49处占位；视频可由用户实际播放验收，不把字节检测当完整播放成功。
4. 若要求集中接收评价/反馈，先确定接收服务、接口、字段、权限和存储方案，再把本地保存替换为真实提交；只有服务端确认成功才提示提交成功。当前没有接收邮箱、Webhook、表单服务或后台接口，不假设Sites发布会自动收集localStorage。
5. 只有再次授权Sites才同步后续本地变化，并确认部署终态。

## 6. 文件与数据流程

| 用途 | 文件 |
|---|---|
| 新闻列表/详情/首页 | dist/news.html、news.js/css、news-detail.html/js/css、home-news.js |
| 新闻源数据与报告 | content/news-source/articles.json、assets.json、missing-images.json、migration-report.* |
| 新闻生成 | scripts/adapt-news.py → dist/news-data.js |
| 帮助首页 | dist/help.html、help.css、help-home.js |
| 帮助子页/共用交互 | dist/help-category.html、help-detail.html、help-search.html、help-pages.css/js |
| 帮助搜索/分享 | dist/help-search-ui.js、dist/share-article.js |
| 帮助评价/反馈 | dist/help-pages.js/css；tests/help-pages.test.cjs；localStorage键dgj-help-feedback:<文章ID> |
| Ant Design提示依赖 | dist/assets/vendor/antd-message-5.29.3.js、react-18.3.1.min.js、react-dom-18.3.1.min.js |
| 帮助数据装配 | dist/help-page-data.js；之前先加载help-migrated-data.js |
| 帮助原始目录/正文 | content/help-source/inventory.json、samples.json、bulk-articles.json、partial-articles.json、raw/ |
| 帮助资源/报告 | content/help-source/assets.json、bulk-assets.json、partial-assets.json、missing-images.*、bulk-report.* |
| 帮助抓取/生成 | scripts/migrate-help.py、scripts/adapt-help.py |
| 公共部分/占位 | dist/shared-header.js/css、shared-footer.js、styles.css、product-*.html、product-placeholder.css/js |
| 客服气泡/状态图标 | dist/customer-service.js/css、dist/assets/customer-service、dist/assets/footer-contact；content/customer-service.md |
| Banner点击热区 | dist/banner-hitarea.js；tests/banner-hitarea.test.cjs |

更新正文：改原始存档/映射 → `python3 scripts/adapt-news.py`或`python3 scripts/adapt-help.py` → 相关检查 → 更新加载方版本。不要手改生成JS正文。

帮助`--samples-only`仅作明确回退到5篇；常规命令恢复全量；`--allow-missing-images`按报告生成已批准占位。完整记录优先旧partial，避免补齐后又降回缺图状态。

检查按实际改动选择，不无故全量重跑：

```sh
node tests/help-pages.test.cjs
node tests/help-home.test.cjs
node tests/help-migration.test.cjs
node tests/help-search-ui.test.cjs
node tests/share-article.test.cjs
node tests/customer-service.test.cjs
node tests/banner-hitarea.test.cjs
node tests/news-samples.test.cjs
node tests/home-news.test.cjs
node tests/news-list.test.cjs
python3 tests/test_news_richtext.py
```

简化DOM/数据检查不等于浏览器视觉验收；Sites succeeded及URL证明部署成功，不代表所有页面或视频逐一人工验收。

## 7. 经验与协作约束

- 保留百度编辑器主动排版：原HTML与适配body分开存档，保留空行、颜色、字体、强调、缩进、边框、渐变、受限负边距/Flex及z-index。不要抽纯文本、截图替代复杂文字，或给正文整体新增flex/gap叠加间距。
- 京东编号装饰依赖z-index，漏掉会遮字；正文isolation:isolate。清洗仍过滤脚本、事件、危险链接、fixed等，不能无限放开CSS。
- 图片保持比例、小图不放大。帮助内联max-width:920px曾覆盖响应式规则，正文限定max-width:100%!important及height:auto!important不能丢。用户补图不能只改后缀，转换官网副本、保留源文件。
- 飞书img可能同时有src/data-src，用HTMLParser取属性并保留来源；不用贪婪正则误取data-src。缺图要明确占位，不静默丢失。
- 只改detail选择器曾造成一级/二级适配不统一，已修为共享布局层。公共CSS尽量带作用域；改CSS/JS后更新实际入口缓存版本，新闻数据需更新index/news/news-detail三处。
- 用户素材在icon/及配图/，网页用dist/assets副本。file://外部SVG CSS mask曾导致图标消失，现有mask用原SVG data URI，勿改回外部mask。
- “成功”提示应与实际完成动作一致。当前用户已确认反馈仅存浏览器；未来接后台须等待真实响应，不把前端提示、localStorage或静态站点部署当成已发送给运营。联系方式保存在用户浏览器，交接/日志不要输出实际填写数据。
- MasterGo文件ID205958939153260；新闻详情历史节点109:48920，帮助历史根60:75003。新任务读当前选择，不假定历史ID仍有效；只读设计实现代码，不擅自改画布。临时素材Session会过期，必要素材存永久路径。工具发现只输出必要schema。
- CUA曾明确拒绝file://，不得绕过；工具超时/未验收如实说明。截图蓝框、编号、预览属性不是页面设计，不写入源码。
- 工作区既有修改/未跟踪素材很多，不清理回滚、不重解压历史zip；源码增量用apply_patch，生成和资源用脚本/复制。
- 用户要求先方案时不执行；确认后持续推进，不重复请求已授权内容。实际缺资源或权限限制集中请协助，不编造内容。明确local-only时不提交、不推送、不部署。

2026-11-18二维码更新：独立平台咨询弹窗的assets/platform-consult/wechat-qr.png替换为用户提供的原图，逐字节核对一致；contain完整显示，缓存版本20261118-user-qr。全局客服二维码未改。仅本地，未发布。

2026-11-18：独立咨询浮层已整理为公用组件，open(source,{anchor,label})不再依赖platform-card或平台数据；支持普通按钮data-consult声明式调用，重复引入保护。平台卡片显式传anchor保持原交互，接入说明见content/platform-links.md。platform-consult、platform-links、platform-sync测试通过；脚本缓存20261118-shared-consult。仅本地未发布。

2026-11-18：开放平台顶部Banner“联系我们”热区改为data-consult按钮，复用独立咨询组件；使用banner-hitarea.js按原图1920×480、按钮380/293/160/49及cover裁切定位，移除移动端隐藏。底部立即咨询保持原链接。仅本地。

2026-11-18 Sites发布成功：版本12，源码ae12cf161c170f4216bdcc95e8842d2f21910b91，版本ID appgprj_6ad19323460c819197cc07f35a283cd1~appgver_e38687055400819193bd8f80bc5cf556，部署appgdep_6afd194cdf288191ae776db1ec47f4b4，status=succeeded。线上https://dianguanjia-home.toasty-bay-2879.chatgpt.site，保留public。归档/private/tmp/dgj-sites-release-20261118-consult.tar.gz。仅同步Sites专用源码仓库，未推送GitHub。

2026-11-18 GitHub同步：保留远端6edf551新增的Pages工作流（上传./dist），本轮包含平台映射、公用卡片/独立咨询组件、二维码、Banner和首页交互及相关测试。14项Node检查、diff空白检查、改动文件大小和常见凭据模式检查通过。删除的三个历史ZIP此前已忽略，不产生源码删除。
