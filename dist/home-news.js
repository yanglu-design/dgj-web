(() => {
  const articles = window.DGJNewsArticles || [];
  const tabs = [...document.querySelectorAll('#news .news-tabs > span')];
  const grid = document.querySelector('#news .news-grid');
  const more = document.querySelector('#news .news-more');
  const render = category => {
    tabs.forEach(tab => {
      const selected = tab.textContent === category;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    more.href = 'news.html?category=' + encodeURIComponent(category);
    grid.replaceChildren(...articles.filter(article => article.category === category).slice(0, 4).map(article => {
      const card = document.createElement('article');
      const link = document.createElement('a'); link.href = 'news-detail.html?id=' + encodeURIComponent(article.id);
      const cover = document.createElement('div'); cover.className = 'news-cover';
      const image = document.createElement('img'); image.src = article.thumbnail || 'assets/news/新闻0@2x.png';
      image.alt = ''; image.loading = 'lazy';
      image.onerror = () => { image.onerror = null; image.src = 'assets/news/新闻0@2x.png'; };
      const title = document.createElement('p'); title.textContent = article.title;
      cover.append(image); link.append(cover, title); card.append(link); return card;
    }));
  };
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.addEventListener('click', () => render(tab.textContent));
    tab.addEventListener('keydown', event => {
      if (['Enter', ' '].includes(event.key)) { event.preventDefault(); render(tab.textContent); }
      if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault(); const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        render(next.textContent); next.focus();
      }
    });
  });
  document.querySelector('#news .news-tabs').setAttribute('role', 'tablist');
  if (tabs.length) render(tabs[0].textContent);
})();
