# 平台入口映射与公共卡片

用户于2026-11-18完成51项映射确认。起初仅接入首页，后根据新标注扩展到产品页、开放平台页及新闻侧栏。全部改动仍仅本地，未提交GitHub或发布Sites。

## 确认来源

- 用户填写文件：`outputs/01a1d3cb-daa2-7e23-9bc0-c5c6fbdc53ea/平台入口映射清单.xlsx`。
- 已确认记录及文件SHA256：`content/platform-links-confirmed.json`。
- 旧站来源：`https://www.dgjapp.com/productIntroduce.html`及该页公开接口`/authorize/print?sort=sort&articleColumnId=1762328934976&dgjSytemShow=1`。映射以用户确认表格为准，不在运行时依赖旧站接口。

## 已实施

| 分类 | 卡片数量 | 外部链接 | 新站页面 | 客服咨询 |
|---|---:|---:|---:|---:|
| 主流平台 | 12 | 11 | 1 | 0 |
| 即时零售 | 5 | 5 | 0 | 0 |
| 供销平台 | 6 | 6 | 0 | 0 |
| 优选平台 | 28 | 26 | 0 | 2 |
| 总计 | 51 | 48 | 1 | 2 |

- 48项按表格沿用原入口，仅去掉首尾空格；HTTP、查询参数、授权回调、片段路径等不擅自更改。得物、人人商城的testauth域名已由用户确认沿用。
- 开放平台使用相对路径`open-platform.html`，兼容本地和带项目路径的静态托管。
- 链接统一新页签，带`noopener noreferrer`；HTML属性转义不改变实际URL参数。
- 爱库存、鲸灵无外部链接，点击“商家内测邀请”打开独立咨询气泡，未代用户发送咨询。鲸灵卡片角标和悬停文字同步为内测邀请。
- 独立入口为`window.DGJPlatformConsult.open(trigger)`，不调用全局客服气泡。Esc关闭并返回原触发按钮，外部点击、焦点移出或窗口失焦可关闭；同一按钮再次点击可收起。
- 公共卡片支持键盘聚焦显示、内测客服弹窗、点击/离开/窗口失焦立即复原及重新悬停。产品页保留32项的原顺序；开放平台页沿用四类共51项，行为均与首页一致。
- 平台卡片点击、鼠标离开或窗口失焦后复原（is-dismissed），外链及咨询弹窗行为保留。鼠标离开时保持抑制，重新pointerenter才解除；只有:focus-visible键盘聚焦可解除，普通点击残留焦点不会展开。首页脚本/样式版本20261118-platform-leave；测试覆盖点击、离开、普通焦点、键盘焦点、窗口失焦与重新悬停。

## 2026-11-18 扩展范围

- `dist/platform-cards.js`统一首页、产品页、开放平台页的卡片渲染、映射与状态。三处调用同一实现，不复制交互代码。
- 公共卡片接口为`render(grid, items)`，只接收容器和当前要显示的卡片；分类数据选择与选项卡事件继续放在各页脚本。悬停/聚焦样式由`dist/platform-cards.css`统一负责。移除旧styles.css中更高优先级的按钮width:100%规则，按钮用left/right与width:auto填充卡片内区域；沿用1100px断点，左右内边距24px，小屏16px，悬停不改变卡片布局或尺寸。加载版本20261118-card-component。
- 新闻列表页产品试用侧栏10项读取同一映射；“淘宝”的显示名不改，映射键使用“淘宝/淘特”。原“查看更多”保持回首页。新闻详情没有这组平台侧栏，无额外改动。
- 产品页对比区“立即订购”新页签进入抖店service_id=7；开放平台底部“立即咨询”使用既有QQ客服完整URL；四个核心优势选项卡共享coreAction，均新页签进入`https://www.wjx.top/m/42955488.aspx`。
- `icon/魔筷星选20.svg`原样复制到`dist/assets/icon/魔筷星选20.svg`；平台目录和产品列表都引用SVG并附logo缓存版本，替换旧PNG/旧SVG显示。

## 文件与验证

### 独立客服咨询弹窗

- MasterGo文件205958939153260，页面36:8424，共同父节点124:37596；右/左/上/下方位节点124:37440、124:37491、124:37525、124:37559。已成功读取四种结构，并通过Asset Session SHA256核对复制原SVG背景和微信二维码到`dist/assets/platform-consult/`。截图工具报节点不可导出/页面不匹配，因此未声称完成设计截图对照。
- 设计334×192px、16px内边距、12px圆角；左120px二维码及“加微信咨询”，右QQ800183731、客服电话400-863-8288、电话186-0306-5384。QQ使用已确认企点完整链接，两项电话分别tel；图标悬停与文字同步蓝色。
- `dist/platform-consult.js/css`是独立固定定位浮层，挂在body避免被页面overflow裁切。优先选择能完整容纳的右、左、下、上方位；均不满足时选择溢出较少的一侧并限位到视口12px留白内，小屏压缩内边距与二维码。使用原四种SVG箭头背景。
- 开启时以卡片为锚点；resize/捕获scroll重新定位，卡片滚出视口或已被分类切换移除则关闭。三处完整平台卡片页面加载弹窗CSS/JS，版本20261118-independent；不修改分类组件，不接入全局客服浮层。
- `tests/platform-consult.test.cjs`覆盖四方向、小屏限位、滚动/缩放跟随、重复点击、外部点击、Esc、焦点返回及资源路径。`platform-links`检查平台不会调用全局客服API。Banner、平台同步检查一并通过。

- `dist/platform-links.js`：从确认JSON生成的51项运行时映射。
- `dist/script.js`、`products.js`、`open-platform.js`调用公共卡片渲染器。
- `dist/styles.css`：以platform-cards语义类共享完整卡片交互样式。
- `dist/customer-service.js`：复用现有客服气泡，新增程序打开入口。各HTML已更新其缓存版本`20261118-platform-consult`。
- 本次涉及的四页依赖/脚本/样式版本`20261118-platform-sync`；魔筷星选logo版本`20261118-logo`。平台目录、映射、公共卡片应先于页面脚本加载。
- `tests/platform-links.test.cjs`验证51项、原参数保留、两项咨询、新站路径及状态；`tests/platform-sync.test.cjs`验证产品32卡、开放平台四类、新闻10个入口、四个核心选项卡、三处CTA链接及logo文件。客服、首页功能、新闻列表和Banner检查一并通过。

这些检查证明映射与前端交互配置一致，不代表第三方平台登录、授权、订购完成，未执行这些操作，也未声称逐页浏览器视觉验收。后续如有链接调整，先更新确认存档，再同步运行时映射和相关检查。

- 2026-11-18：独立咨询弹窗二维码已替换为用户提供的原始PNG（wechat-qr.png），不再使用设计稿二维码；保持120px显示尺寸，小屏96px，object-fit:contain保证完整显示。图片及弹窗依赖缓存版本20261118-user-qr，全局客服二维码不变。

## 独立咨询公用组件接入

页面引入 `platform-consult.css` 和 `platform-consult.js`（建议脚本使用 defer）。组件每页仅创建一个浮层，重复加载脚本不会重复初始化；不依赖平台分类或全局客服组件。二维码和联系方式统一在组件维护。

普通按钮声明式接入：
```html
<button type="button" data-consult="合作咨询" aria-haspopup="dialog" aria-expanded="false">咨询</button>
```

也可调用 `window.DGJPlatformConsult.open(button, { anchor: container, label: '合作咨询' })`；anchor省略时以按钮本身定位，label省略时为“客服咨询”。调用 `window.DGJPlatformConsult.close()` 关闭。平台卡片通过显式传入卡片anchor保留原有定位。四方向选择、跟随、关闭和焦点恢复均由组件统一处理。

- 平台名称更正：“即时零售”卡片改为“抖音即时零售”，共享目录和运行时映射同步更名；分类名称仍为“即时零售”，URL不变。已确认清单JSON保留原始填写记录中的旧名称。
