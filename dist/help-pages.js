(() => {
  const { products, documents } = window.DGJHelpPages;
  const params = new URLSearchParams(location.search);
  const view = document.body.dataset.helpView;
  const content = document.querySelector('#help-page-content');
  const el = (tag, className = '', text = '') => { const node = document.createElement(tag); node.className = className; node.textContent = text; return node; };
  const categoryUrl = (product, category) => 'help-category.html?product=' + encodeURIComponent(product) + '&category=' + encodeURIComponent(category);
  const productUrl = product => 'help-category.html?product=' + encodeURIComponent(product);
  const detailUrl = id => 'help-detail.html?id=' + encodeURIComponent(id);
  const icon = name => { const image = el('img'); image.src = 'assets/help-pages/' + name + '.svg'; image.alt = ''; return image; };
  const link = (text, href, className = '') => { const node = el('a', className, text); node.href = href; return node; };
  const activeNav = document.querySelector('.nav a[href="help.html"]');
  activeNav?.classList.add('is-active'); activeNav?.setAttribute('aria-current', 'page');
  const navToggle = document.querySelector('.nav-toggle');
  navToggle?.addEventListener('click', () => navToggle.setAttribute('aria-expanded', String(document.querySelector('.nav').classList.toggle('open'))));
  const requestedId = params.get('id') || 'manufacturer-guide';
  const documentId = window.DGJHelpPages.aliases[requestedId] || requestedId;
  const article = documents.find(item => item.id === documentId) || window.DGJHelpPages.legacyDocuments.find(item => item.id === requestedId);
  const productId = view === 'detail' && article ? article.product : params.get('product') || 'distribution';
  const product = products.find(item => item.id === productId);
  const categoryId = view === 'detail' && article ? article.category : params.get('category');
  const category = product?.categories.find(item => item.id === categoryId);
  const keyword = (params.get('q') || '').trim();
  const input = document.querySelector('.help-inline-search input'); input.value = keyword;
  const mark = (node, text) => {
    if (!keyword.trim()) { node.append(document.createTextNode(text)); return; }
    let start = 0, match;
    while ((match = text.indexOf(keyword, start)) !== -1) {
      node.append(document.createTextNode(text.slice(start, match)), el('mark', '', keyword)); start = match + keyword.length;
    }
    node.append(document.createTextNode(text.slice(start)));
  };
  if (view === 'search') {
    const breadcrumb = document.querySelector('.help-breadcrumb');
    breadcrumb?.append(link('帮助中心', 'help.html'), el('span', '', '/'), el('span', '', keyword || '搜索结果'));
    if (breadcrumb) breadcrumb.children[breadcrumb.children.length - 1].setAttribute('aria-current', 'page');
    document.title = (keyword ? keyword + ' - ' : '') + '搜索结果 - 店管家帮助中心';
    let selected = products.some(item => item.id === params.get('product')) ? params.get('product') : 'all';
    const productField = el('input'); productField.type = 'hidden'; productField.name = 'product';
    document.querySelector('.help-inline-search').append(productField);
    const tabs = document.querySelector('.help-result-tabs');
    const entries = [{ id: 'all', title: '全部' }, ...products];
    const render = () => {
      productField.value = selected;
      [...tabs.children].forEach(button => button.setAttribute('aria-pressed', String(button.dataset.product === selected)));
      content.replaceChildren();
      const matches = documents.filter(item => (selected === 'all' || item.product === selected) && (!keyword.trim() || (item.title + (item.summary || '') + (item.searchText || '')).includes(keyword.trim())));
      matches.forEach(item => {
        const result = el('article', 'help-search-result');
        const heading = el('h2'); const title = link('', detailUrl(item.id)); mark(title, item.title); heading.append(title);
        let excerpt = item.summary || item.searchText || item.title;
        if (keyword && !excerpt.includes(keyword) && item.searchText?.includes(keyword)) {
          const text = item.searchText.replace(/\s+/g, ' ').trim();
          const start = Math.max(0, text.indexOf(keyword) - 30);
          excerpt = (start ? '…' : '') + text.slice(start, start + 180);
        }
        const summary = el('p'); mark(summary, excerpt);
        const originProduct = products.find(entry => entry.id === item.product);
        const originCategory = originProduct.categories.find(entry => entry.id === item.category);
        const origin = el('p', 'help-result-path'); mark(origin, '来自：全部 > ' + originProduct.title + ' > ' + originCategory.title);
        result.append(heading, summary, origin); content.append(result);
      });
      if (!matches.length) content.append(el('p', 'help-empty-message', '暂无相关帮助文档'));
    };
    entries.forEach(item => {
      const button = el('button', '', item.title); button.type = 'button'; button.dataset.product = item.id;
      button.addEventListener('click', () => { selected = item.id; render(); }); tabs.append(button);
    });
    render(); return;
  }
  if (!product || categoryId && !category || view === 'detail' && !article) {
    content.append(el('h1', '', '文档不存在'), link('返回帮助中心', 'help.html')); return;
  }
  const breadcrumb = document.querySelector('.help-breadcrumb');
  const crumbs = [{ title: '帮助中心', href: 'help.html' }, { title: product.title, href: productUrl(product.id) }];
  if (category) crumbs.push({ title: category.title, href: categoryUrl(product.id, category.id) });
  if (view === 'detail') crumbs.push({ title: article.title });
  crumbs.forEach((item, index) => {
    if (index) breadcrumb.append(el('span', '', '/'));
    const node = index < crumbs.length - 1 ? link(item.title, item.href) : el('span', '', item.title);
    if (index === crumbs.length - 1) node.setAttribute('aria-current', 'page'); breadcrumb.append(node);
  });
  const tree = document.querySelector('.help-tree');
  const toggle = group => {
    const button = el('button', 'help-tree-toggle'); button.type = 'button'; button.setAttribute('aria-label', '展开或收起分类'); button.append(icon('chevron-down'));
    button.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); group.open = !group.open; });
    return button;
  };
  const bindSummary = summary => {
    summary.addEventListener('click', event => event.preventDefault());
    summary.children[0].addEventListener('click', event => event.stopPropagation());
  };
  products.forEach(item => {
    const group = el('details'); group.open = item.id === product.id;
    group.setAttribute('name', 'help-products');
    const title = el('summary'); title.append(link(item.title, productUrl(item.id)), toggle(group)); bindSummary(title); group.append(title);
    if (view === 'category' && !category && item.id === product.id) title.classList.add('is-selected');
    const categories = el('div', 'help-tree-children');
    item.categories.forEach(section => {
      const branch = el('details', 'help-tree-category'); branch.open = item.id === product.id && section.id === category?.id;
      branch.setAttribute('name', 'help-categories-' + item.id);
      const summary = el('summary');
      const categoryLink = link(section.title, categoryUrl(item.id, section.id));
      summary.append(categoryLink, toggle(branch)); bindSummary(summary);
      if (view === 'category' && branch.open) summary.classList.add('is-selected');
      branch.append(summary);
      const children = el('div', 'help-tree-children');
      documents.filter(doc => !doc.searchOnly && doc.product === item.id && doc.category === section.id).forEach(doc => {
        const entry = link(doc.title, detailUrl(doc.id)); entry.title = doc.title;
        if (view === 'detail' && doc.id === article.id) { entry.classList.add('is-selected'); entry.setAttribute('aria-current', 'page'); }
        children.append(entry);
      });
      branch.append(children); categories.append(branch);
    });
    group.append(categories); tree.append(group);
  });
  if (window.addEventListener) {
    const fitTree = () => {
      if (window.matchMedia('(min-width:701px)').matches) {
        const height = Math.max(0, window.innerHeight - tree.getBoundingClientRect().top - 16) + 'px';
        tree.style.height = height;
        tree.style.maxHeight = height;
      } else { tree.style.height = ''; tree.style.maxHeight = ''; }
    };
    window.addEventListener('scroll', fitTree, { passive: true });
    window.addEventListener('resize', fitTree);
    fitTree();
  }
  if (view === 'category') {
    const heading = category?.title || product.title;
    document.title = heading + ' - 帮助中心 - 店管家官网';
    content.append(el('h1', 'help-category-heading', heading));
    const renderCategory = (section, target) => {
    const items = documents.filter(item => !item.searchOnly && item.product === product.id && item.category === section.id);
    let group, previousType;
    items.forEach(item => {
      const type = item.video ? 'video' : 'article';
      if (type !== previousType) {
        group = type === 'video' ? el('div', 'help-guide-grid') : el('ul', 'help-full-list');
        target.append(group); previousType = type;
      }
      if (type === 'video') {
        const card = link('', detailUrl(item.id), 'help-guide-card');
        const coverUrl = item.cover || item.video.poster;
        if (coverUrl) { const cover = el('img'); cover.src = coverUrl; cover.alt = ''; card.append(cover); }
        card.title = item.title;
        card.append(el('span', '', item.title)); group.append(card);
      } else {
        const row = el('li'); row.append(link('· ' + item.title, detailUrl(item.id))); group.append(row);
      }
    });
    if (!items.length) target.append(el('p', 'help-empty-message', '该分类文档暂未提供'));
    };
    if (category) renderCategory(category, content);
    else {
      const list = el('ul', 'help-full-list');
      product.categories.forEach(section => {
        const row = el('li'); row.append(link('· ' + section.title, categoryUrl(product.id, section.id))); list.append(row);
      });
      content.append(list);
    }
    return;
  }
  document.title = article.title + ' - 帮助中心 - 店管家官网';
  if (article.video) {
    const video = el('video', 'help-video-player'); video.controls = true; video.preload = 'metadata'; video.playsInline = true; video.src = article.video.src; video.poster = article.video.poster;
    video.append(document.createTextNode('当前浏览器不支持视频播放。')); content.append(video);
    const error = el('p', 'help-empty-message', '视频暂时无法播放，请稍后重试或联系客服。'); error.hidden = true;
    video.addEventListener('error', () => { error.hidden = false; }); content.append(error);
  } else if (article.preview) { const preview = el('img', 'help-video-preview'); preview.src = article.preview; preview.alt = article.title; content.append(preview); }
  const heading = el('div', 'help-detail-heading'); heading.append(el('h1', '', article.heading || article.title));
  const share = el('button', 'help-share'); share.type = 'button'; share.append(icon('jump'), document.createTextNode('分享')); heading.append(share); content.append(heading);
  const body = el('div', 'help-richtext');
  if (article.body) { body.classList.add('help-source-body'); body.innerHTML = article.body; }
  else if (article.blocks) article.blocks.forEach(block => {
    const node = el(block.tag, '', block.text || '');
    if (block.src) { node.src = block.src; node.alt = block.alt; }
    if (block.href) { node.href = block.href; node.target = '_blank'; node.rel = 'noopener noreferrer'; }
    body.append(node);
  });
  else if (article.summary) body.append(el('p', '', article.summary));
  else if (!article.video) body.append(el('p', 'help-empty-message', '该文档内容暂未提供'));
  if (!article.video || article.body?.trim() || article.blocks?.length || article.summary?.trim()) content.append(body);
  const feedback = el('div', 'help-detail-feedback'); const row = el('div', 'help-feedback-row');
  row.append(el('span', 'help-feedback-question', '内容是否对您有帮助？'));
  const votes = el('div', 'help-feedback-votes'); row.append(votes);
  const storageKey = 'dgj-help-feedback:' + article.id;
  let saved = { entries: [] };
  try { saved = JSON.parse(localStorage.getItem(storageKey)) || saved; } catch (_) { /* Keep the form usable if stored data is invalid. */ }
  const persist = next => {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); saved = next; return true; }
    catch (_) { window.DGJAntMessage.error('保存失败，请检查浏览器存储权限后重试'); return false; }
  };
  const form = el('form', 'help-feedback-form'); form.hidden = true; form.id = 'help-feedback-form';
  ['有帮助', '没帮助'].forEach((text, index) => {
    const button = el('button'); button.type = 'button'; button.setAttribute('aria-pressed', String(saved.vote === text)); button.append(icon(index ? 'thumb-down' : 'thumb-up'), document.createTextNode(text));
    if (index) { button.setAttribute('aria-controls', form.id); button.setAttribute('aria-expanded', 'false'); }
    button.addEventListener('click', () => {
      if (!persist({ ...saved, vote: text, evaluatedAt: new Date().toISOString() })) return;
      votes.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      form.hidden = !index;
      votes.children[1].setAttribute('aria-expanded', String(!form.hidden));
      window.DGJAntMessage.success({ content: '评价成功', key: 'help-feedback', duration: 3 });
    }); votes.append(button);
  });
  const opinionRow = el('div', 'help-feedback-field');
  const opinionLabel = el('label', '', '意见反馈'); opinionLabel.htmlFor = 'help-feedback-opinion';
  const opinionBox = el('div', 'help-feedback-textarea');
  const opinion = el('textarea'); opinion.id = 'help-feedback-opinion'; opinion.name = 'opinion'; opinion.required = true; opinion.maxLength = 100; opinion.placeholder = '请提出您宝贵的意见';
  const count = el('span', 'help-feedback-count', '0/100');
  opinion.addEventListener('input', () => { count.textContent = opinion.value.length + '/100'; opinion.setCustomValidity(''); });
  opinionBox.append(opinion, count); opinionRow.append(opinionLabel, opinionBox);
  const contactRow = el('div', 'help-feedback-field');
  const contactLabel = el('label', '', '联系方式'); contactLabel.htmlFor = 'help-feedback-contact';
  const contactBox = el('div', 'help-feedback-contact'); const methods = el('div', 'help-feedback-methods'); methods.setAttribute('role', 'radiogroup'); methods.setAttribute('aria-label', '联系方式类型');
  const contactInput = el('input'); contactInput.id = 'help-feedback-contact'; contactInput.name = 'contact'; contactInput.placeholder = '请输入'; contactInput.type = 'tel'; contactInput.maxLength = 100;
  let contactType = '手机号码';
  ['手机号码', '电子邮箱', 'QQ'].forEach((text, index) => {
    const label = el('label'); const radio = el('input'); radio.type = 'radio'; radio.name = 'contactType'; radio.value = text; radio.checked = !index;
    radio.addEventListener('change', () => {
      contactType = text; contactInput.type = index === 1 ? 'email' : index === 0 ? 'tel' : 'text';
      contactInput.setAttribute('inputmode', index === 1 ? 'email' : 'numeric'); contactInput.setCustomValidity('');
    });
    label.append(radio, document.createTextNode(text)); methods.append(label);
  });
  contactInput.addEventListener('input', () => contactInput.setCustomValidity(''));
  contactBox.append(methods, contactInput); contactRow.append(contactLabel, contactBox);
  const actions = el('div', 'help-feedback-actions');
  const submit = el('button', 'help-feedback-submit', '提交'); submit.type = 'submit';
  const cancel = el('button', '', '取消'); cancel.type = 'button';
  const closeForm = () => { form.hidden = true; votes.children[1].setAttribute('aria-expanded', 'false'); };
  cancel.addEventListener('click', () => { closeForm(); votes.children[1].focus(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    opinion.setCustomValidity(opinion.value.trim() ? '' : '请填写您的意见');
    const value = contactInput.value.trim();
    const validContact = !value || (contactType === '手机号码' ? /^1[3-9]\d{9}$/.test(value) : contactType === 'QQ' ? /^[1-9]\d{4,11}$/.test(value) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
    contactInput.setCustomValidity(validContact ? '' : '请填写有效的' + contactType);
    if (!form.reportValidity()) return;
    const entries = Array.isArray(saved.entries) ? saved.entries : [];
    if (!persist({ ...saved, entries: [...entries, { opinion: opinion.value.trim(), contactType, contact: value, submittedAt: new Date().toISOString() }].slice(-50) })) return;
    closeForm(); opinion.value = ''; count.textContent = '0/100'; contactInput.value = '';
    window.DGJAntMessage.success({ content: '提交成功', key: 'help-feedback', duration: 3 }); votes.children[1].focus();
  });
  actions.append(submit, cancel); form.append(opinionRow, contactRow, actions);
  feedback.append(row, form); content.append(feedback);
  let statusTimer;
  share.addEventListener('click', async () => {
    const status = document.querySelector('.help-page-status');
    const message = await window.DGJShareArticle(article.title);
    if (!message) return;
    status.textContent = message;
    clearTimeout(statusTimer); status.hidden = false; statusTimer = setTimeout(() => { status.hidden = true; }, 3000);
  });
})();
