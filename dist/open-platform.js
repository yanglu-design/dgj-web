(() => {
  const coreData = {
    quick:{title:'标准化接口，快速上线',description:'提供完善的API接口和标准化文档，配合专业技术支持，降低开发难度，加快系统接入。',action:'申请接入',image:'jiekou.svg',alt:'标准化接口快速接入示意图',points:[['接口完善','覆盖订单、商品、库存等核心能力','code.svg'],['文档清晰','接口规范统一，对接简单易懂','server.svg'],['快速上线','专业团队协同配合，加快项目落地','升级.svg']]},
    aggregate:{title:'多渠道订单统一管理',description:'集中管理自建站、多平台、多店铺及线下订单，减少后台切换，降低漏单和错单风险。',action:'立即咨询',image:'juhe.svg',alt:'多渠道订单统一管理示意图',points:[['多店铺聚合','不同平台/店铺订单统一归集和处理','store.svg'],['线上线下一体','打通线上线下业务订单，统一履约流程','fork.svg'],['高效打单发货','订单集中处理，提升打单发货效率','print.svg']]},
    manage:{title:'商品订单库存全面协同',description:'统一管理商品、订单及进销存数据，减少重复维护，让多渠道经营更高效。',action:'了解方案',image:'yitihua.svg',alt:'商品订单库存全面协同示意图',points:[['商品统一管理','集中维护商品，减少多平台重复录入','control.platform.svg'],['库存协同同步','多渠道库存统一管理，降低超卖风险','layers.svg'],['业务数据贯通','打通商品、订单和进销存数据','chart-pie.svg']]},
    service:{title:'经验成熟，全程支持',description:'依托14+年打单技术积累和100万＋商家服务经验，为项目接入、联调和上线提供全流程支持',action:'联系商务',image:'fuwu.svg',alt:'成熟经验与全流程服务示意图',points:[['专业技术支持','及时响应，协助排查解决接口异常','tools.svg'],['商务协同服务','需求确认-项目上线，全流程沟通支持','usergroup.svg'],['成熟稳定能力','经过大量商家验证，保障长期稳定使用','internet.svg']]}
  };
  const stage = document.querySelector('.core-stage');
  const points = document.querySelector('#corePoints');
  const renderCore = key => {
    const data = coreData[key];
    stage.classList.add('changing');
    setTimeout(() => {
      document.querySelector('#coreTitle').textContent = data.title;
      document.querySelector('#coreDescription').textContent = data.description;
      document.querySelector('#coreAction').textContent = data.action;
      const image = document.querySelector('#coreImage'); image.src = `assets/images/${data.image}`; image.alt = data.alt;
      points.innerHTML = data.points.map(([title,text,icon]) => `<article><span class="core-point-icon"><img src="assets/icon/${icon}" alt=""></span><div><h3>${title}</h3><p>${text}</p></div></article>`).join('');
      stage.classList.remove('changing');
    }, 160);
  };
  document.querySelectorAll('.core-tabs button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.core-tabs button').forEach(item => item.classList.toggle('active', item === button));
    renderCore(button.dataset.core);
  }));
  renderCore('quick');

  const platformGroups = {
    main:[['抖音','抖音20.svg'],['淘宝/淘特','淘宝20.svg'],['天猫','天猫20.svg'],['微信小店/视频号','微信小店20.svg'],['阿里巴巴','168820.svg'],['京东','京东20.svg'],['快手','快手20.svg'],['拼多多','拼多多20.svg'],['小红书','小红书20.svg'],['淘工厂','淘工厂20.svg'],['自助体验','自由商城20.svg'],['开放平台','其他平台20.svg']],
    instant:[['美团','美团20.svg'],['京东秒送','京东20.svg'],['淘宝买菜','淘宝买菜20.svg'],['抖音即时零售','即时零售20.svg'],['微信小店','微信小店20.svg'],['快手','快手20.svg']],
    supply:[['抖音厂商代发','抖音20.svg'],['抖音供应链','抖音20.svg'],['微信供应商','微信小店供货商20.svg'],['快手厂商代发','快手20.svg'],['淘宝厂商代发','淘宝20.svg'],['京东供销','京东20.svg']],
    selected:[['抖音分销代发','抖音20.svg'],['微店','微店20.svg'],['快团团','快团团20.svg'],['美丽说','美丽说20.svg'],['唯品会','唯品会20.svg'],['苏宁易购','苏宁易购20.svg'],['爱库存','爱库存20.svg'],['团好货','团好货20.svg'],['蘑菇街','蘑菇街20.svg'],['贝贝','贝贝20.svg']]
  };
  const grid = document.querySelector('#openPlatformGrid');
  const trialText = name => name === '开放平台' ? '查看更多' : name === '自助体验' ? '免费使用' : '免费试用7天';
  const renderPlatforms = key => { grid.innerHTML = platformGroups[key].map(([name,icon]) => `<article class="platform-card"><img src="assets/icon/${icon}" alt=""><span>${name}</span>${name === '开放平台' ? '' : `<em>${name === '自助体验' ? '免费使用' : '免费试用'}</em>`}<button class="platform-trial" type="button"><span>${trialText(name)}</span></button></article>`).join(''); };
  document.querySelectorAll('.platform-tabs button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.platform-tabs button').forEach(item => item.classList.toggle('active', item === button));
    renderPlatforms(button.dataset.platform);
  }));
  renderPlatforms('main');

  document.querySelectorAll('.case-tabs button').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.case-tabs button').forEach(item => item.classList.toggle('active', item === button));
  }));
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) toggle.addEventListener('click', () => { const nav = document.querySelector('.nav'); const open = nav.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
})();
