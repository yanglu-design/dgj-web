(() => {
  const { documents } = window.DGJHelpPages;
  const historyKey = 'dgj-help-search-history';
  const readHistory = () => {
    try { const data = JSON.parse(localStorage.getItem(historyKey) || '[]'); return Array.isArray(data) ? data.filter(item => typeof item === 'string' && item.trim()).slice(0, 5) : []; }
    catch (_) { return []; }
  };
  const remember = value => {
    try { localStorage.setItem(historyKey, JSON.stringify([value, ...readHistory().filter(item => item !== value)].slice(0, 5))); } catch (_) { /* Search remains available when storage is disabled. */ }
  };
  const suggestions = keyword => {
    const query = keyword.trim();
    if (!query) return [];
    return documents.filter(item => item.title.includes(query)).sort((a, b) => Number(b.title.startsWith(query)) - Number(a.title.startsWith(query))).slice(0, 5);
  };
  window.DGJHelpSearch = { readHistory, remember, suggestions };
  document.querySelectorAll('form.help-search, form.help-inline-search').forEach((form, index) => {
    const input = form.querySelector('input[name="q"]');
    input.autocomplete = 'off'; input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-expanded', 'false');
    const panel = document.createElement('div'); panel.className = 'help-search-dropdown'; panel.id = 'help-search-options-' + index; panel.hidden = true;
    input.setAttribute('aria-controls', panel.id); form.append(panel);
    let active = -1, options = [], composing = false;
    const close = () => { panel.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; };
    const select = value => { input.value = value; remember(value); form.requestSubmit(); };
    const highlight = (node, title, query) => {
      let start = 0, found;
      while ((found = title.indexOf(query, start)) >= 0) {
        node.append(document.createTextNode(title.slice(start, found)));
        const mark = document.createElement('mark'); mark.textContent = query; node.append(mark); start = found + query.length;
      }
      node.append(document.createTextNode(title.slice(start)));
    };
    const render = () => {
      panel.replaceChildren(); active = -1; input.removeAttribute('aria-activedescendant');
      const query = input.value.trim();
      const list = document.createElement('div'); list.className = query ? 'help-search-suggestions' : 'help-search-history-tags';
      options = [];
      if (!query) {
        const title = document.createElement('p'); title.className = 'help-search-history-title'; title.textContent = '历史记录'; panel.append(title);
        readHistory().forEach(value => {
          const button = document.createElement('button'); button.type = 'button'; button.textContent = value;
          button.addEventListener('click', () => select(value)); options.push(button); list.append(button);
        });
      } else {
        suggestions(query).forEach(item => {
          const link = document.createElement('a'); link.href = 'help-detail.html?id=' + encodeURIComponent(item.id); highlight(link, item.title, query);
          link.addEventListener('click', () => { remember(query); close(); }); options.push(link); list.append(link);
        });
      }
      list.setAttribute('role', 'listbox');
      options.forEach((option, i) => { option.id = panel.id + '-' + i; option.setAttribute('role', 'option'); option.setAttribute('aria-selected', 'false'); });
      if (!options.length) { const empty = document.createElement('p'); empty.className = 'help-search-dropdown-empty'; empty.textContent = query ? '暂无匹配文档，按回车搜索全文' : '暂无搜索记录'; list.append(empty); }
      panel.append(list); panel.hidden = false; input.setAttribute('aria-expanded', 'true');
    };
    input.addEventListener('focus', render);
    input.addEventListener('input', () => { if (!composing) render(); });
    input.addEventListener('compositionstart', () => { composing = true; });
    input.addEventListener('compositionend', () => { composing = false; render(); });
    input.addEventListener('keydown', event => {
      if (composing || event.isComposing) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); return; }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault(); if (panel.hidden) render(); if (!options.length) return;
        active = active < 0 ? (event.key === 'ArrowDown' ? 0 : options.length - 1) : (active + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length;
        options.forEach((option, i) => option.setAttribute('aria-selected', String(i === active)));
        input.setAttribute('aria-activedescendant', options[active].id); options[active].scrollIntoView({ block: 'nearest' });
      } else if (event.key === 'Enter' && !panel.hidden && active >= 0) { event.preventDefault(); options[active].click(); }
    });
    form.addEventListener('submit', event => {
      if (composing) { event.preventDefault(); return; }
      const value = input.value.trim();
      if (!value) { event.preventDefault(); input.focus(); render(); return; }
      input.value = value; remember(value); close();
    });
    form.addEventListener('focusout', event => { if (!form.contains(event.relatedTarget)) close(); });
    document.addEventListener('pointerdown', event => { if (!form.contains(event.target)) close(); });
  });
})();
