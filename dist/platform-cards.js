(() => {
  const catalog = window.DGJPlatformCatalog;
  const links = window.DGJPlatformLinks;
  const boundGrids = new Set();
  const escapePlatformAttribute = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  function bind(grid) {
    if (boundGrids.has(grid)) return;
    boundGrids.add(grid);
    grid.addEventListener('click', event => {
      const trigger = event.target.closest('.platform-trial');
      if (!trigger || !grid.contains(trigger)) return;
      trigger.closest('.platform-card').classList.add('is-dismissed');
      if (event.detail > 0) trigger.blur();
      if (trigger.hasAttribute('data-platform-consult')) window.DGJPlatformConsult.open(trigger, {
        anchor: trigger.closest('.platform-card'),
        label: `${trigger.dataset.platformConsult}商家内测咨询`
      });
    });
  }
  function render(grid, items) {
    bind(grid);
    grid.classList.add('platform-cards');
    grid.innerHTML = items.map(item => {
      const [name, icon] = item;
      const action = links[name];
      const consult = action.type === 'consult';
      const text = consult ? '商家内测邀请' : catalog.trialText(name);
      const badge = consult ? text : catalog.badgeText(item);
      const badgeClass = [badge.length > 4 ? 'long' : '', badge === '商家内测邀请' ? 'invite' : '', badge === '免费使用' ? 'free' : ''].filter(Boolean).join(' ');
      const attributes = `class="platform-trial" aria-label="${name}：${text}"`;
      const trigger = consult
        ? `<button ${attributes} type="button" data-platform-consult="${name}" aria-haspopup="dialog" aria-expanded="false"><span>${text}</span></button>`
        : `<a ${attributes} href="${escapePlatformAttribute(action.href)}" target="_blank" rel="noopener noreferrer"><span>${text}</span></a>`;
      return `<div class="platform-card"><img src="assets/icon/${icon}" alt=""><span>${name}</span>${badge ? `<em class="${badgeClass}">${badge}</em>` : ''}${trigger}</div>`;
    }).join('');
    grid.querySelectorAll('.platform-card').forEach(card => {
      card.addEventListener('pointerleave', () => card.classList.add('is-dismissed'));
      card.addEventListener('pointerenter', () => card.classList.remove('is-dismissed'));
      card.addEventListener('focusin', event => {
        if (event.target.matches(':focus-visible')) card.classList.remove('is-dismissed');
      });
    });
  }

  window.addEventListener('blur', () => {
    boundGrids.forEach(grid => grid.querySelectorAll('.platform-card').forEach(card => card.classList.add('is-dismissed')));
  });
  document.querySelectorAll('[data-platform-link]').forEach(anchor => {
    const action = links[anchor.dataset.platformLink];
    anchor.href = action.href;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
  });
  window.DGJPlatformCards = { render };
})();
