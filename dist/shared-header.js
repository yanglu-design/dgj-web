(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const chevron = '<svg class="nav-chevron" viewBox="0 0 1024 1024" aria-hidden="true"><path d="M884 256h-75c-5.1 0-9.9 2.4-13 6.4L512 642 228 262.4a16 16 0 0 0-13-6.4h-75c-6.5 0-10.3 7.4-6.5 12.6l352 470.9a32 32 0 0 0 51 0l352-470.9c3.8-5.2 0-12.6-6.5-12.6z"/></svg>';
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const productsActive = currentPage === 'products.html';

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

  const productMenu = productGroups.map((group, groupIndex) => `
    <section class="product-menu-group" aria-labelledby="product-group-${groupIndex}">
      <h2 id="product-group-${groupIndex}">${group.title}</h2>
      <div class="product-menu-list">
        ${group.items.map(([name, description, icon, view]) => `
          <a class="product-menu-item" href="products.html?view=${view}">
            <img src="assets/icon/nav-products/${icon}" alt="" aria-hidden="true">
            <span><strong>${name}</strong><small>${description}</small></span>
          </a>
        `).join('')}
      </div>
    </section>
  `).join('');

  const navigation = [
    { label: '首页', href: 'index.html', active: currentPage === 'index.html' },
    { label: '开放平台', href: 'open-platform.html', active: currentPage === 'open-platform.html' },
    { label: '帮助中心', href: 'help.html', active: currentPage === 'help.html' },
    { label: '新闻动态', href: 'news.html', active: currentPage === 'news.html' },
    { label: '关于我们', href: 'about.html', active: currentPage === 'about.html' },
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
