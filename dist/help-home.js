(() => {
  const { products, documents } = window.DGJHelpPages;
  const navToggle = document.querySelector('.nav-toggle');
  navToggle?.addEventListener('click', () => navToggle.setAttribute('aria-expanded', String(document.querySelector('.nav').classList.toggle('open'))));
  const categoryUrl = (product, category) => 'help-category.html?product=' + encodeURIComponent(product) + '&category=' + encodeURIComponent(category);
  const detailUrl = id => 'help-detail.html?id=' + encodeURIComponent(id);
  const makeLink = (text, href) => { const node = document.createElement('a'); node.textContent = text; node.href = href; return node; };
  const normalizeTitle = title => title.replace(/[\s?？!！]/g, '');
  const entries = (product, category) => documents.filter(doc => !doc.searchOnly && doc.product === product && doc.category === category);
  const cards = [...document.querySelectorAll('.help-document-card')];
  const states = new Map();
  const summaries = new Map();
  const selectCategory = (productId, categoryId) => {
    const state = states.get(productId); if (!state) return;
    state.category = categoryId;
    state.labels.forEach(label => { const selected = label.dataset.category === categoryId; label.classList.toggle('is-selected', selected); label.setAttribute('aria-selected', String(selected)); });
    const rows = entries(productId, categoryId).slice(0, 6).map(doc => {
      const item = document.createElement('li'); item.title = doc.title; item.append(makeLink(doc.title, detailUrl(doc.id))); return item;
    });
    state.list.replaceChildren(...rows);
    state.more.href = categoryUrl(productId, categoryId);
    summaries.forEach((summary, key) => summary.classList.toggle('is-selected', key === productId + '/' + categoryId));
  };
  cards.forEach((card, index) => {
    const product = products[index];
    const more = card.querySelector('.help-more');
    const moreLink = makeLink('', categoryUrl(product.id, product.categories[0].id)); moreLink.className = 'help-more'; moreLink.append(...more.childNodes); more.replaceWith(moreLink);
    const labels = card.querySelector('.help-category-labels'); labels.replaceChildren(); labels.setAttribute('role', 'tablist');
    const buttons = product.categories.map(category => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = category.title; button.dataset.category = category.id; button.setAttribute('role', 'tab');
      button.addEventListener('click', () => selectCategory(product.id, category.id)); labels.append(button); return button;
    });
    states.set(product.id, { labels: buttons, list: card.querySelector('ul'), more: moreLink, category: product.categories[0].id });
    selectCategory(product.id, product.categories[0].id);
    const arrows = [...card.querySelectorAll('.help-tab-arrow')];
    arrows.forEach((arrow, i) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'help-tab-arrow'; button.textContent = arrow.textContent;
      button.setAttribute('aria-label', i ? '向右查看分类' : '向左查看分类');
      button.addEventListener('click', () => labels.scrollBy({ left: i ? 160 : -160, behavior: 'smooth' })); arrow.replaceWith(button);
    });
  });
  document.querySelectorAll('.help-faq-card li').forEach(item => {
    const title = item.textContent;
    const doc = documents.find(doc => doc.id === item.dataset.helpId) || documents.find(doc => normalizeTitle(doc.title) === normalizeTitle(title));
    if (doc) item.replaceChildren(makeLink(title, detailUrl(doc.id)));
  });
  const sidebar = document.querySelector('.help-sidebar'); sidebar.className = 'help-tree'; sidebar.replaceChildren();
  const chevron = group => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'help-tree-toggle'; button.setAttribute('aria-label', '展开或收起分类');
    const image = document.createElement('img'); image.src = 'assets/help-pages/chevron-down.svg'; image.alt = ''; button.append(image);
    button.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); group.open = !group.open; });
    return button;
  };
  products.forEach(product => {
    const group = document.createElement('details');
    group.setAttribute('name', 'help-products');
    const title = document.createElement('summary'); title.append(makeLink(product.title, 'help-category.html?product=' + encodeURIComponent(product.id)), chevron(group)); title.addEventListener('click', event => event.preventDefault()); group.append(title);
    title.children[0].addEventListener('click', event => event.stopPropagation());
    const categories = document.createElement('div'); categories.className = 'help-tree-children';
    product.categories.forEach(category => {
      const branch = document.createElement('details'); branch.className = 'help-tree-category';
      branch.setAttribute('name', 'help-categories-' + product.id);
      const summary = document.createElement('summary'); summary.textContent = category.title; summary.append(chevron(branch));
      summaries.set(product.id + '/' + category.id, summary);
      summary.addEventListener('click', event => { event?.preventDefault(); selectCategory(product.id, category.id); });
      const children = document.createElement('div'); children.className = 'help-tree-children';
      entries(product.id, category.id).forEach(doc => children.append(makeLink(doc.title, detailUrl(doc.id))));
      branch.append(summary, children); categories.append(branch);
    });
    group.append(categories); sidebar.append(group);
  });
})();
