(() => {
  if (document.querySelector('#customer-service')) return;
  const root = document.createElement('aside'); root.id = 'customer-service'; root.className = 'customer-service'; root.setAttribute('aria-label', '联系客服');
  const qq = 'https://webpage.qidian.qq.com/qidian/chatv3/pc.html?_type=wpa&cate=7&env=ol&fid=31915&ftype=1&gseq=1794894714276&isCustomEntry=0&isLBS=0&isSsc=0&key=559c3e3cdf5301159de044c580674075&kfuin=2885720638&linkType=1&qidian=true&roleData=43443&roleValue=1&source=0&translateSwitch=0&type=10';
  const taobao = 'https://amos.alicdn.com/getcid.aw?v=2&uid=%E4%B8%AD%E6%81%92%E7%94%B5%E5%95%86&site=cntaobao&s=1&groupid=0&charset=utf-8&token=EB1BBA6E1EEF0757';
  root.innerHTML = `
    <div class="customer-service-item">
      <button class="customer-service-trigger" type="button" aria-label="关注微信公众号" aria-expanded="false" aria-controls="customer-service-wechat"><img class="customer-service-icon-default" src="assets/customer-service/wechat-default.svg?v=20261117-icons-refresh" alt=""><img class="customer-service-icon-active" src="assets/customer-service/wechat-active.svg?v=20261117-icons-refresh" alt=""></button>
      <div class="customer-service-panel customer-service-wechat" id="customer-service-wechat" hidden>
        <img class="customer-service-panel-bg" src="assets/customer-service/wechat-panel.svg" alt="">
        <div class="customer-service-panel-content"><div class="customer-service-qr"><img src="assets/customer-service/wechat-qr.png" alt="店管家微信公众号二维码"></div><p class="customer-service-caption">扫码关注微信公众号</p></div>
      </div>
    </div>
    <div class="customer-service-item">
      <button class="customer-service-trigger" type="button" aria-label="在线客服" aria-expanded="false" aria-controls="customer-service-online"><img class="customer-service-icon-default" src="assets/customer-service/service-default.svg?v=20261117-icons-refresh" alt=""><img class="customer-service-icon-active" src="assets/customer-service/service-active.svg?v=20261117-icons-refresh" alt=""></button>
      <div class="customer-service-panel" id="customer-service-online" hidden>
        <img class="customer-service-panel-bg" src="assets/customer-service/service-panel.svg" alt="">
        <div class="customer-service-panel-content">
          <a href="${qq}" target="_blank" rel="noopener noreferrer"><img class="customer-service-channel-icon customer-service-option-default" src="assets/customer-service/qq.svg?v=20261117-icons-refresh" alt=""><img class="customer-service-option-hover" src="assets/customer-service/qq-hover.svg" alt="">QQ客服</a>
          <a href="${taobao}" target="_blank" rel="noopener noreferrer"><img class="customer-service-channel-icon customer-service-option-default" src="assets/customer-service/taobao.svg?v=20261117-icons-refresh" alt=""><img class="customer-service-option-hover" src="assets/customer-service/taobao-hover.svg" alt="">淘宝客服</a>
        </div>
      </div>
    </div>
    <div class="customer-service-item">
      <button class="customer-service-trigger" type="button" aria-label="客服电话" aria-expanded="false" aria-controls="customer-service-phone"><img class="customer-service-icon-default" src="assets/customer-service/phone-default.svg?v=20261117-icons-refresh" alt=""><img class="customer-service-icon-active" src="assets/customer-service/phone-active.svg?v=20261117-icons-refresh" alt=""></button>
      <div class="customer-service-panel customer-service-phone" id="customer-service-phone" hidden>
        <img class="customer-service-panel-bg" src="assets/customer-service/phone-panel.svg" alt="">
        <div class="customer-service-panel-content"><a href="tel:4008638288"><img class="customer-service-option-default" src="assets/customer-service/phone-small.svg" alt=""><img class="customer-service-option-hover" src="assets/customer-service/phone-small-hover.svg" alt="">400 863 8288</a></div>
      </div>
    </div>`;
  document.body.append(root);
  const items = [...root.querySelectorAll('.customer-service-item')];
  let pinned = null;
  let returnFocus = null;
  const show = selected => {
    items.forEach(item => {
      const open = item === selected;
      item.classList.toggle('is-active', open);
      item.querySelector('.customer-service-trigger').setAttribute('aria-expanded', String(open));
      item.querySelector('.customer-service-panel').hidden = !open;
    });
  };
  window.DGJCustomerService = {
    openOnline(trigger) {
      returnFocus = trigger;
      pinned = items[1];
      show(pinned);
      pinned.querySelector('.customer-service-trigger').focus();
    }
  };
  items.forEach(item => {
    const button = item.querySelector('.customer-service-trigger');
    item.addEventListener('mouseenter', () => show(item));
    item.addEventListener('mouseleave', () => { if (pinned !== item) show(null); });
    item.addEventListener('focusin', () => show(item));
    item.addEventListener('focusout', event => { if (!item.contains(event.relatedTarget) && pinned !== item) show(null); });
    button.addEventListener('click', () => { returnFocus = null; pinned = pinned === item ? null : item; show(pinned); });
  });
  document.addEventListener('pointerdown', event => { if (!root.contains(event.target)) { returnFocus = null; pinned = null; show(null); } });
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      const active = items.find(item => item.contains(document.activeElement));
      const target = returnFocus || active?.querySelector('.customer-service-trigger');
      returnFocus = null;
      target?.focus();
      pinned = null; show(null);
    }
  });
})();
