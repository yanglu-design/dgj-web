(() => {
  const platforms = [
    ['阿里巴巴','168820.svg'],['淘宝/淘特','淘宝20.svg'],['天猫','天猫20.svg'],['京东','京东20.svg'],['拼多多','拼多多20.svg'],
    ['抖音','抖音20.svg'],['快手','快手20.svg'],['有赞','有赞20.svg'],['微盟','微盟20.svg'],['微信小店','微信小店20.svg'],
    ['值点','值点20.png'],['头条','头条20.png'],['鲁班','鲁班20.png'],['火山','火山20.svg'],['蘑菇街','蘑菇街20.svg'],
    ['美丽说','美丽说20.svg'],['小店','小店20.png'],['微店','微店20.svg'],['抖音厂商代发','抖音20.svg'],['抖音分销代发','抖音20.svg'],
    ['萌推','萌推20.svg'],['贝贝','贝贝20.svg'],['云集','云集20.svg'],['小红书','小红书20.svg'],['魔筷星选','魔筷星选20.svg?v=20261118-logo'],
    ['苏宁易购','苏宁易购20.svg'],['唯品会','唯品会20.svg'],['淘工厂','淘工厂20.svg'],['快团团','快团团20.svg'],['度小店','度小店20.svg'],
    ['自助体验','自由商城20.svg'],['开放平台','其他平台20.svg']
  ];
  const grid = document.querySelector('#productPlatformGrid');
  window.DGJPlatformCards.render(grid, platforms);

  const toggle = document.querySelector('.nav-toggle');
  if (toggle) toggle.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
})();
