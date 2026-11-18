(() => {
  const names = ['阿里巴巴','淘宝/淘特','天猫','京东','拼多多','抖音','快手','有赞','微盟','微信小店','淘工厂','度小店'];
  const catalog = Object.values(window.DGJPlatformCatalog.groups).flat();
  window.DGJPlatformCards.render(document.querySelector('#distributionPlatformGrid'), names.map(name => catalog.find(item => item[0] === name)));
  const toggle = document.querySelector('.nav-toggle');
  toggle?.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(document.querySelector('.nav').classList.toggle('open')));
  });
})();
