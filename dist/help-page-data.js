// Design preview content only. Original documents and video sources will be connected in the next migration stage.
(() => {
  const assets = 'assets/help-pages/';
  const products = [
    { id: 'distribution', title: '分销代发ERP系统', categories: [{ id: 'getting-started', title: '新手指引', layout: 'cards' }, { id: 'operations', title: '分销代发操作指引' }, { id: 'videos', title: '视频教程' }] },
    { id: 'printing', title: '打单发货系统', categories: [{ id: 'getting-started', title: '新手指引' }, { id: 'login', title: '授权登录' }, { id: 'waybill', title: '电子面单' }, { id: 'templates', title: '模板设置' }, { id: 'print-components', title: '打印组件' }, { id: 'shipping', title: '打单发货' }, { id: 'labels', title: '小标签+扫描打印' }, { id: 'supplier', title: '厂家代发' }, { id: 'miniapp', title: '小程序打单' }, { id: 'other', title: '其他问题' }, { id: 'videos', title: '视频教程' }] },
    { id: 'listing', title: '铺货代发系统', categories: [{ id: 'assistant', title: '铺货助手' }, { id: 'pc-assistant', title: 'PC端-铺货助手' }] },
    { id: 'cross-border', title: '跨境分销代发系统', categories: [{ id: 'getting-started', title: '新手指引' }] }
  ];
  const documents = [
    { id: 'manufacturer-guide', product: 'distribution', category: 'getting-started', title: '厂家新手引导', heading: '厂家一件代发新手操作教程-店管家分销代发系列操作教程', cover: assets + 'image-82-30636.png', preview: assets + 'image-82-28188.png', summary: '厂家一件代发新手操作教程。厂家角色：我是工厂，专门帮各个平台开店的分销商一件代发商品，我需要管理全平台和线下的客户订单和发货，传统代发都是表格导入订单打单导出物流单号给分销商发货。' },
    { id: 'merchant-guide', product: 'distribution', category: 'getting-started', title: '商家新手引导', cover: assets + 'image-82-30657.png' },
    { id: 'intermediary-guide', product: 'distribution', category: 'getting-started', title: '中间商新手引导', cover: assets + 'image-82-30775.png' },
    { id: '1673489973673', product: 'distribution', category: 'operations', title: '欢迎使用店管家分销代发!', blocks: [{ tag: 'img', src: assets + 'image-82-15575.png', alt: '欢迎使用店管家分销代发操作指引' }] },
    { id: '1612338372772', product: 'distribution', category: 'operations', title: '如何使用代发系统打单发货', summary: '不压货，不囤货，一件代发，已经成为现在抖音、快手等电商平台的一大潮流。也随着直播的兴起，订单暴增，订单积压，导出导入的订单容易商品错乱，创建子账号又会引起客户订单隐私泄露，造成打单发货成为商家与厂家最棘手的问题。', blocks: [
      { tag: 'p', text: '不压货，不囤货，一件代发，已经成为现在抖音、快手等电商平台的一大潮流。也随着直播的兴起，订单暴增，订单积压，导出导入的订单容易商品错乱，创建子账号又会引起客户订单隐私泄露，造成打单发货成为商家与厂家最棘手的问题。' },
      { tag: 'p', text: '店管家新上线的订单分发系统，有效的解决了代发订单的打单发货问题，直接实现分销商与供应商订单的区分与正常打单发货。那么代发订单怎么打印的呢？' },
      { tag: 'p', text: '以下教程来教你如何使用本分单系统完成订单的打印与发货，一起来看看！' },
      { tag: 'p', text: '注意事项：由于不同平台限制，对应的平台打印订单时需选择不同的电子面单打印：' },
      ...['拼多多平台开通拼多多电子面单打单发货', '京东平台开通京东类型电子面单打单发货', '淘宝/阿里/淘工厂开通菜鸟电子面单打单发货', '抖店平台开通抖音电子面单打单发货', '快手平台开通快手电子面单打单发货', '小红书需要开通小红书电子面单打单发货', '其余平台可用以上任意电子面单'].map(text => ({ tag: 'p', text })),
      { tag: 'h2', text: '分销商角色' }, { tag: 'p', text: '1.首次进入店管家分单系统后，新用户注册后并登陆分单系统' },
      { tag: 'a', text: 'https://tfxportal.dgjapp.com/FFAccount?from=fxdaifahhj', href: 'https://tfxportal.dgjapp.com/FFAccount?from=fxdaifahhj' },
      { tag: 'img', src: assets + 'image-124-19865.png', alt: '店管家分销代发系统注册登录' },
      { tag: 'p', text: '2.登录后，在系统设置>>>基础设置，设置分销商默认代发地址，用于供应商代发的快递面单上的发件地址' },
      { tag: 'img', src: assets + 'image-124-19768.png', alt: '设置分销商默认代发地址' },
      { tag: 'p', text: '3.进入分单系统后，添加授权店铺' }
    ] }
  ];
  ['库存管理如何完成设置', '如何帮商家代打发货零散订单', '虚拟供应商导出订单操作', '代发系统如何完成对账结算', '分销代发系统怎么设置快递模板打印内容', '商品绑定多厂家操作步骤', '小程序-如何快速设置自动代发', '抖音-如何快速设置自动代发', '抖音-欢迎使用店管家分销代发', '1688定制商品', '分销代发单号分享教程', '店管家分销代发操作教程', '【重要】小红书新版电子面单切换通知', '小红书非店铺面单开通教程', '小红书店铺面单开通教程'].forEach((title, i) => documents.push({ id: 'operation-' + (i + 1), product: 'distribution', category: 'operations', title }));
  const searchExamples = [
  [
    "outlet-waybill",
    "printing",
    "waybill",
    "怎么开通网点电子面单?怎么申请网点电子面单?",
    "开通网点电子面单，点此查看：网点面单支持哪些快递公司？开通方法联系网点负责人开取，获得客户编码与密码（如果您不清楚信息可以联系网点财务或者管理员）韵达：网点账号登录录网点管"
  ],
  [
    "add-outlet-waybill",
    "distribution",
    "getting-started",
    "网点电子面单开通后如何添加网点电子面单账号?",
    "电子面单分享(共享)功能主要是为了满足各类商家在不同场景对电子面单单号的使用需求而设计使用的，完美地解决了快递网点，区域承包商，大卖家或厂家怎么分享电子面单单号给商家的问题，通过分享单号关联码可同时管理上千店铺，不需要绑定店铺，支持四通一达，即可将菜鸟/拼多多电子面单单号共享给其他店铺使用。还可以多商家众筹共享单号节约费用。"
  ],
  [
    "jd-waybill",
    "printing",
    "waybill",
    "如何使用京东无界面电子面单打单发货？",
    "越来越多的商户入驻京东，作为B2C最大的网购实力平台的京东，也通过不同的方式为商家解决各类订单管理的问题，店管家_批量打印发货 应用软件也通过了京东电商平台审核，入驻京麦服务市场，更好的为商家解决了订单的难题，那么如何使用京东无界面电子面单打单发货呢？"
  ],
  [
    "distribution-waybill",
    "distribution",
    "getting-started",
    "店管家分销代发电子面单开通教程",
    "电子面单，是由电商平台和快递公司联合向商家提供的一种通过热敏纸打印输出纸质物流面单的物流服务。 商家可在各电商店铺后台申请开通服务，平台会把服务申请流转给快递公司，快递公司审核通过后会给商家提供电子面单热敏打印纸，商家再通过店管家软件与电子面单系统交互并获得运单号（快递运单号由快递公司提供）等打印信息，并通过热敏打印机（打印机由商家自行购买或与网点协商解决）完成电子面单打印并交付快递公司揽收派送。"
  ],
  [
    "redbook-waybill",
    "printing",
    "waybill",
    "小红书非店铺面单开通教程",
    "非店铺电子面单适用人群：没有开通小红书店铺的厂家。开通链接：https://ebill.xiaohongshu.com/ebill/waybill/apply注册面单账号步骤1）点击开通链接，跳转到小红书个人面单的登录页面，点击【注册】。"
  ],
  [
    "douyin-waybill",
    "printing",
    "waybill",
    "没有抖音店铺如何使用抖音面单",
    "注意：仅针对不开抖音店铺的商家去开通抖音非店铺的面单请认真阅读以下教程，完成单号配置！一、开通抖音非店铺面单1. 点击网址，常用手机号注册登录→ https://ebill.douyinec.com/login"
  ]
];
  searchExamples.forEach(([id, product, category, title, summary]) => documents.push({ id, product, category, title, summary, searchOnly: true }));
  const homeReferences = [
  {
    "id": "home-1-1",
    "product": "distribution",
    "category": "getting-started",
    "title": "厂家新手引导"
  },
  {
    "id": "home-1-2",
    "product": "distribution",
    "category": "getting-started",
    "title": "商家新手引导"
  },
  {
    "id": "home-1-3",
    "product": "distribution",
    "category": "getting-started",
    "title": "中间商新手引导"
  },
  {
    "id": "home-2-1",
    "product": "printing",
    "category": "getting-started",
    "title": "新手商家使用店管家打单发货教程"
  },
  {
    "id": "home-2-2",
    "product": "printing",
    "category": "getting-started",
    "title": "如何设置合并发货订单、拆分订单?"
  },
  {
    "id": "home-2-3",
    "product": "printing",
    "category": "getting-started",
    "title": "线下微商表格订单如何导入打印"
  },
  {
    "id": "home-2-4",
    "product": "printing",
    "category": "getting-started",
    "title": "电子面单单号分享到其他店铺教程"
  },
  {
    "id": "home-2-5",
    "product": "printing",
    "category": "getting-started",
    "title": "多店铺如何操作关联"
  },
  {
    "id": "home-2-6",
    "product": "printing",
    "category": "getting-started",
    "title": "多店铺如何操作关联"
  },
  {
    "id": "home-3-1",
    "product": "listing",
    "category": "assistant",
    "title": "首次进入店管家铺货代发助手，操作绑定店铺并铺货"
  },
  {
    "id": "home-3-2",
    "product": "listing",
    "category": "assistant",
    "title": "完成订购授权后再次选择商品进行铺货"
  },
  {
    "id": "home-3-3",
    "product": "listing",
    "category": "assistant",
    "title": "关联已有抖音、快手店铺商品"
  },
  {
    "id": "home-3-4",
    "product": "listing",
    "category": "assistant",
    "title": "查看快手、抖音代销商品订单并进行采购"
  },
  {
    "id": "home-3-5",
    "product": "listing",
    "category": "assistant",
    "title": "代销商品"
  },
  {
    "id": "home-3-6",
    "product": "listing",
    "category": "assistant",
    "title": "铺货设置"
  },
  {
    "id": "home-4-1",
    "product": "cross-border",
    "category": "getting-started",
    "title": "店管家_TikTok如何完成跨境代发使用教程"
  },
  {
    "id": "home-4-2",
    "product": "cross-border",
    "category": "getting-started",
    "title": "店管家_如何安装采集插件与采集商品使用教程"
  },
  {
    "id": "home-4-3",
    "product": "cross-border",
    "category": "getting-started",
    "title": "店管家_如何授权TikTok店铺操作教程"
  },
  {
    "id": "faq-1-1",
    "product": "distribution",
    "category": "operations",
    "title": "厂家如何给商家代发订单?"
  },
  {
    "id": "faq-1-2",
    "product": "distribution",
    "category": "operations",
    "title": "如何自动分配订单?不用手动发送"
  },
  {
    "id": "faq-1-3",
    "product": "distribution",
    "category": "operations",
    "title": "分销商如何绑定厂家?"
  },
  {
    "id": "faq-2-1",
    "product": "printing",
    "category": "getting-started",
    "title": "如何自动合并订单?"
  },
  {
    "id": "faq-2-2",
    "product": "printing",
    "category": "getting-started",
    "title": "怎么打单发货?"
  },
  {
    "id": "faq-2-3",
    "product": "printing",
    "category": "getting-started",
    "title": "如何自定义打印?如何手工打单、打散单?非平台订单怎打印？"
  },
  {
    "id": "faq-3-1",
    "product": "printing",
    "category": "waybill",
    "title": "怎么开通网点电子面单?怎么申请网点电子面单?"
  },
  {
    "id": "faq-3-2",
    "product": "printing",
    "category": "waybill",
    "title": "如何批量回收单号?自定义打印怎么回收单号?"
  },
  {
    "id": "faq-3-3",
    "product": "printing",
    "category": "waybill",
    "title": "网点电子面单开通后如何添加网点电子面单账号?"
  },
  {
    "id": "faq-4-1",
    "product": "printing",
    "category": "other",
    "title": "如何导出自定义打印的订单？"
  },
  {
    "id": "faq-4-2",
    "product": "printing",
    "category": "other",
    "title": "如何导出发货记录？导出发货记录包含哪些信息？"
  },
  {
    "id": "faq-4-3",
    "product": "printing",
    "category": "other",
    "title": "如何查询发货记录？可以查多长时间？去年的能查吗？"
  }
];
  const normalizeTitle = title => title.replace(/[\s?？!！]/g, '');
  homeReferences.forEach(item => {
    if (!documents.some(doc => normalizeTitle(doc.title) === normalizeTitle(item.title))) documents.push(item);
  });
  const aliases = {};
  const legacyDocuments = documents.slice();
  const canonicalTitle = title => title.replace(/[^\w\u4e00-\u9fff]/g, '');
  legacyDocuments.forEach(preview => {
    const match = (window.DGJHelpMigrated || []).find(item => canonicalTitle(item.title) === canonicalTitle(preview.title));
    if (match && match.id !== preview.id) aliases[preview.id] = match.id;
  });
  (window.DGJHelpMigrated || []).forEach(item => {
    const index = documents.findIndex(doc => doc.id === item.id);
    if (index >= 0) documents[index] = item;
    else documents.push(item);
  });
  if (window.DGJHelpInventory?.length) {
    const real = new Map((window.DGJHelpMigrated || []).map(item => [item.id, item]));
    documents.splice(0, documents.length, ...window.DGJHelpInventory.filter(item => real.has(item.id)).map(item => real.get(item.id)));
  }
  window.DGJHelpPages = { products, documents, aliases, legacyDocuments };
})();
