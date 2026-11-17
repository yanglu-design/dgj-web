(() => {
  const fallback = 'assets/news/新闻0@2x.png';
  const articles = window.DGJNewsArticles || [];
  const list = document.querySelector('.news-list');
  const template = list.querySelector('.news-card').cloneNode(true);
  list.replaceChildren(...articles.map(article => {
    const card = template.cloneNode(true);
    card.hidden = false;
    card.dataset.category = article.category;
    card.querySelector('h2').textContent = article.title;
    card.querySelector('.news-copy > p').textContent = article.summary;
    const time = card.querySelector('time');
    time.dateTime = article.date;
    [...time.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => node.remove());
    time.append(article.date);
    const image = card.querySelector('.news-thumbnail'); image.src = article.thumbnail || fallback; image.loading = 'lazy';
    const label = card.querySelector('.news-label'); label.textContent = article.category;
    label.className = 'news-label ' + ({ '企业荣誉': 'honor', '行业新闻': 'warning', '电商干货': 'tips' }[article.category] || '');
    let link = card.querySelector('.news-card-link');
    if (!link) { link = document.createElement('a'); link.className = 'news-card-link'; card.appendChild(link); }
    link.href = 'news-detail.html?id=' + encodeURIComponent(article.id);
    link.setAttribute('aria-label', '阅读：' + article.title);
    return card;
  }));
  document.querySelectorAll('.news-thumbnail').forEach(img => {
    const useFallback = () => { img.onerror = null; img.src = fallback; };
    img.onerror = useFallback;
    if (!img.getAttribute('src')?.trim() || (img.complete && img.naturalWidth === 0)) useFallback();
  });
  const buttons = [...document.querySelectorAll('.news-tabs button')];
  const cards = [...document.querySelectorAll('.news-card')];
  let keyword = '';
  const root = ReactDOM.createRoot(document.querySelector('.news-pagination'));
  const locale = { items_per_page: '条/页', jump_to: '到第', jump_to_confirm: '确定', page: '页', prev_page: '上一页', next_page: '下一页', prev_5: '向前 5 页', next_5: '向后 5 页', page_size: '每页条数' };
  const requested = new URLSearchParams(location.search).get('category');
  let category = buttons.some(button => button.dataset.category === requested) ? requested : '推荐内容';
  let current = 1, pageSize = 10;
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
  const update = () => {
    const filtered = cards.filter(card => (category === '推荐内容' || card.dataset.category === category) && card.textContent.includes(keyword.trim()));
    current = Math.max(1, Math.min(current, Math.ceil(filtered.length / pageSize) || 1));
    const visible = new Set(filtered.slice((current - 1) * pageSize, current * pageSize));
    cards.forEach(card => { card.hidden = !visible.has(card); });
    document.querySelector('.news-empty').hidden = filtered.length > 0;
    root.render(React.createElement(window.DGJAntPagination, {
      total: filtered.length, current, pageSize,
      showTotal: total => '共 ' + total + ' 条', showSizeChanger: true,
      pageSizeOptions: [10, 20, 50, 100], showQuickJumper: true,
      locale, onChange: (page, size) => { current = size === pageSize ? page : 1; pageSize = size; update(); }
    }));
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.category;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    current = 1; update();
  }));
  const searchRoot = ReactDOM.createRoot(document.querySelector('.news-search-field'));
  searchRoot.render(React.createElement(window.DGJAntInput, {
    type: 'search', variant: 'borderless', placeholder: '搜索相关文章', 'aria-label': '搜索相关文章',
    onChange: event => { keyword = event.target.value; current = 1; update(); }
  }));
  document.querySelector('.news-search').addEventListener('submit', event => { event.preventDefault(); current = 1; update(); });
  update();
})();
