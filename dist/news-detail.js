(() => {
  const articles = window.DGJNewsArticles || [];
  const id = new URLSearchParams(location.search).get('id') || '1770622508836';
  const article = articles.find(item => item.id === id);
  if (!article) {
    const main = document.querySelector('.article-main');
    main.replaceChildren();
    const box = document.createElement('div');
    box.className = 'article-shell article-card';
    const title = document.createElement('h1'); title.textContent = '文章不存在';
    const link = document.createElement('a'); link.href = 'news.html'; link.textContent = '返回新闻列表';
    box.append(title, link); main.append(box);
    document.title = '文章不存在 - 店管家官网';
    return;
  }
  document.title = article.title + ' - 店管家官网';
  document.querySelector('h1').textContent = article.title;
  const breadcrumb = document.querySelector('.article-breadcrumb');
  breadcrumb.querySelectorAll('a')[1].textContent = article.category;
  breadcrumb.querySelectorAll('a')[1].href = 'news.html?category=' + encodeURIComponent(article.category);
  breadcrumb.querySelector('[aria-current]').textContent = article.title;
  const time = document.querySelector('.article-header time');
  const publishedAt = article.publishedAt || article.date;
  time.dateTime = publishedAt.replace(' ', 'T');
  [...time.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).forEach(node => node.remove());
  time.append(publishedAt);
  // Body HTML is sanitized during import and contains only verified local image paths.
  document.querySelector('.article-body').innerHTML = article.body;
  document.querySelectorAll('.article-body table').forEach(table => {
    const scroll = document.createElement('div');
    scroll.className = 'article-table-scroll';
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', '文章表格，可横向滚动');
    table.before(scroll); scroll.append(table);
  });
  const related = articles.filter(item => item.id !== id).slice(0, 8);
  const list = document.querySelector('.article-related ul');
  list.replaceChildren(...related.map(item => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = 'news-detail.html?id=' + encodeURIComponent(item.id);
    link.textContent = item.title; li.append(link); return li;
  }));
  const next = articles[articles.indexOf(article) + 1];
  const nextNav = document.querySelector('.article-next');
  nextNav.hidden = !next;
  if (next) {
    const link = document.createElement('a'); link.className = 'article-next-title';
    link.href = 'news-detail.html?id=' + encodeURIComponent(next.id); link.textContent = next.title;
    nextNav.querySelector('.article-next-title').replaceWith(link);
  }
  document.querySelector('.nav a[href="news.html"]')?.classList.add('is-active');
  document.querySelector('.nav a[href="news.html"]')?.setAttribute('aria-current', 'page');
  document.querySelectorAll('.article-related li').forEach(item => { item.title = item.textContent; });
  const button = document.querySelector('.article-share');
  const status = document.querySelector('.article-share-status');
  let statusTimer;
  button.addEventListener('click', async () => {
    const message = await window.DGJShareArticle(document.querySelector('h1').textContent);
    if (!message) return;
    status.textContent = message;
    clearTimeout(statusTimer);
    status.hidden = false;
    statusTimer = setTimeout(() => { status.hidden = true; }, 3000);
  });
})();
