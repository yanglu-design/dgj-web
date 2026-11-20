(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const chevron = '<span class="nav-chevron" aria-hidden="true"></span>';
  const normalizedPath = decodeURIComponent(location.pathname).replace(/\/+$/, '');
  const currentPage = (normalizedPath.split('/').pop() || 'index').replace(/\.html$/i, '');
  const productsActive = currentPage === 'products' || currentPage.startsWith('product-');

  const productGroups = [
    {
      title: '商家/厂家发货',
      items: [
        ['店管家', '多平台订单统一管理，高效打单发货', 'order-print.svg?v=20261112-2', 'order-printing'],
        ['店管家_分销代发', '订单自动分配，商家与厂家高效协同代发', 'distribution.png', 'distribution'],
        ['店管家_厂商代发打单', '自动接收代发订单，打单发货并回传单号', 'vendor-print.png', 'vendor-printing'],
        ['店管家_即时零售', '聚合即时零售订单，提升次日达发货效率', 'instant-retail.png', 'instant-retail']
      ]
    },
    {
      title: '发货辅助',
      items: [
        ['店管家分销上货', '多店铺商品批量上架，提升铺货效率', 'listing.png', 'distribution-listing'],
        ['店管家铺货助手', '商品批量管理与铺货，简化上架操作', 'listing-assistant.png', 'listing-assistant'],
        ['店管家_分销管理', '代发订单实时同步，提升分销协同效率', 'distribution-management.png', 'distribution-management'],
        ['快递单号共享', '电子面单多商家共享，降低打单成本', 'waybill.png', 'waybill-sharing']
      ]
    },
    {
      title: '商家营销工具',
      items: [
        ['店管家_AI数据助手', 'AI辅助数据处理，提升运营分析效率', 'ai-data.png', 'ai-data'],
        ['店小智_AI生图', 'AI快速生成商品图片，提升设计效率', 'ai-image.png', 'ai-image'],
        ['店管家_直播助手', '直播订单自动识别打印，提升发货效率', 'live-assistant.png', 'live-assistant']
      ]
    }
  ];

  const externalProducts = {
    'instant-retail': 'https://fuwu.jinritemai.com/detail?service_id=34004',
    'ai-data': 'https://erp.dgjapp.com/Account',
    'vendor-printing': 'https://fuwu.jinritemai.com/detail?btm_ppre=a2427.b76571.c4158.d20759_i4&btm_pre=a0254.b7465.c97409.c2380541.c199565.d063923&from=fwsc.search.ultra.service&isSearch=true&page_from=1k7rrjrno_b7465&pre_show_id=5afe6784-b4ac-412d-b7e1-81312fe27f02&searchKey=%E5%8E%82%E5%95%86&service_id=20383',
    'distribution-management': 'https://fuwu.kwaixiaodian.com/new/detail?id=1640236816583',
    'distribution-listing': 'https://fuwu.jinritemai.com/detail?btm_ppre=a0254.b7465.c97409.c2380541.d930270&btm_pre=a0254.b30541.c7579.d6976_8&from=fwsc.appList%40%2FsearchResult&page_from=1k7rrjrno_b30541&pre_show_id=94b0df39-6897-4263-9d73-d112457dec7c&searchKey=%E4%B8%8A%E8%B4%A7&service_id=32883',

    'listing-assistant': 'https://pc.1688.com/product/detail.htm?productCode=ZDnqm0eDP8Rbe8wo8SJioyjmSoo%2BTOhwpqz1xDy2mlI%3D&productType=PACKAGE&apid=6q1pROB0Q8U6%2B%2B4znWxsI4pGADXqtNn380DqRsaf30TVLYfqB9IrpMr7%2BDhrbLyHKK3%2FV1n8BqQwo3u6HqJ7%2BzsP',
    'ai-image': 'https://fximg.dgjapp.com/',
    'live-assistant': 'https://live.dgjapp.com/'
  };
  const productMenu = productGroups.map((group, groupIndex) => `
    <section class="product-menu-group" aria-labelledby="product-group-${groupIndex}">
      <h2 id="product-group-${groupIndex}">${group.title}</h2>
      <div class="product-menu-list">
        ${group.items.map(([name, description, icon, view]) => `
          <a class="product-menu-item" href="${externalProducts[view] || (view === 'order-printing' ? 'products.html' : 'product-' + view + '.html')}"${externalProducts[view] ? ' target="_blank" rel="noopener noreferrer"' : ''}>
            <img src="assets/icon/nav-products/${icon}" alt="" aria-hidden="true">
            <span><strong>${name}</strong><small>${description}</small></span>
          </a>
        `).join('')}
      </div>
    </section>
  `).join('');

  const navigation = [
    { label: '首页', href: 'index.html', active: currentPage === 'index' },
    { label: '开放平台', href: 'open-platform.html', active: currentPage === 'open-platform' },
    { label: '帮助中心', href: 'help.html', active: currentPage === 'help' },
    { label: '新闻动态', href: 'news.html', active: currentPage === 'news' },
    { label: '关于我们', href: 'about.html', active: currentPage === 'about' },
    {
      label: '新客免费试用',
      href: 'https://tfxportal.dgjapp.com/FFAccount',
      className: 'nav-cta',
      target: '_blank',
      rel: 'noopener noreferrer',
      active: false
    }
  ];

  const navLinks = navigation.map(item => {
    const classNames = [item.className, item.active ? 'is-active' : ''].filter(Boolean).join(' ');
    return `<a${classNames ? ` class="${classNames}"` : ''} href="${item.href}"${item.target ? ` target="${item.target}"` : ''}${item.rel ? ` rel="${item.rel}"` : ''}${item.active ? ' aria-current="page"' : ''}>${item.label}</a>`;
  });

  navLinks.splice(1, 0, `
    <div class="nav-product${productsActive ? ' is-current' : ''}">
      <a class="nav-product-trigger${productsActive ? ' is-active' : ''}" href="products.html" aria-haspopup="true" aria-expanded="false"${productsActive ? ' aria-current="page"' : ''}>产品与服务${chevron}</a>
      <div class="product-mega-menu" aria-label="产品与服务菜单">
        <div class="product-menu-inner">${productMenu}</div>
      </div>
    </div>
  `);

  header.innerHTML = `
    <a class="brand" href="index.html"><img src="assets/icon/dgjlogo1.svg" alt="店管家"></a>
    <button class="nav-toggle" type="button" aria-label="展开导航" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="主导航">${navLinks.join('')}</nav>
  `;

  const productNav = header.querySelector('.nav-product');
  const productTrigger = header.querySelector('.nav-product-trigger');
  const closeProductMenu = () => {
    productNav.classList.remove('is-open');
    productTrigger.setAttribute('aria-expanded', 'false');
  };

  productTrigger.addEventListener('click', event => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      event.preventDefault();
      const isOpen = productNav.classList.toggle('is-open');
      productTrigger.setAttribute('aria-expanded', String(isOpen));
    }
  });

  productNav.addEventListener('mouseenter', () => productTrigger.setAttribute('aria-expanded', 'true'));
  productNav.addEventListener('mouseleave', () => {
    if (!window.matchMedia('(max-width: 900px)').matches) productTrigger.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', event => {
    if (!productNav.contains(event.target)) closeProductMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeProductMenu();
      productTrigger.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (!window.matchMedia('(max-width: 900px)').matches) closeProductMenu();
  });
})();
