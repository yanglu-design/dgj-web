(() => {
  if (window.DGJPlatformConsult) return;
  const popup = document.createElement('div');
  popup.id = 'platform-consult-panel';
  popup.className = 'platform-consult';
  popup.hidden = true;
  popup.tabIndex = -1;
  popup.setAttribute('role', 'dialog');
  popup.setAttribute('aria-label', '商家内测咨询');
  const qq = 'https://webpage.qidian.qq.com/qidian/chatv3/pc.html?_type=wpa&cate=7&env=ol&fid=31915&ftype=1&gseq=1794894714276&isCustomEntry=0&isLBS=0&isSsc=0&key=559c3e3cdf5301159de044c580674075&kfuin=2885720638&linkType=1&qidian=true&roleData=43443&roleValue=1&source=0&translateSwitch=0&type=10';
  popup.innerHTML = `
    <img class="platform-consult-bg" src="assets/platform-consult/right.svg" alt="">
    <div class="platform-consult-content">
      <div class="platform-consult-qr"><img src="assets/platform-consult/wechat-qr.png?v=20261118-user-qr" alt="微信咨询二维码"><span>加微信咨询</span></div>
      <div class="platform-consult-channels">
        <a href="${qq}" target="_blank" rel="noopener noreferrer" aria-label="QQ客服：800183731"><span class="platform-consult-icon platform-consult-qq" aria-hidden="true"></span>800183731</a>
        <a href="tel:4008638288" aria-label="客服电话：400-863-8288"><span class="platform-consult-icon platform-consult-service" aria-hidden="true"></span>400-863-8288</a>
        <a href="tel:18603065384" aria-label="联系电话：186-0306-5384"><span class="platform-consult-icon platform-consult-phone" aria-hidden="true"></span>186-0306-5384</a>
      </div>
    </div>`;
  document.body.append(popup);
  const background = popup.querySelector('.platform-consult-bg');
  let trigger = null;
  let anchor = null;
  const close = (restoreFocus = false) => {
    const previous = trigger;
    trigger?.setAttribute('aria-expanded', 'false');
    trigger = null; anchor = null; popup.hidden = true;
    if (restoreFocus && previous?.isConnected) previous.focus({ preventScroll: true });
  };
  const position = () => {
    if (!anchor?.isConnected) { close(); return; }
    const rect = anchor.getBoundingClientRect();
    const vw = document.documentElement.clientWidth, vh = window.innerHeight;
    if (rect.bottom <= 0 || rect.top >= vh || rect.right <= 0 || rect.left >= vw) { close(); return; }
    const width = popup.offsetWidth, height = popup.offsetHeight;
    const gap = 12, margin = 12;
    const cx = (rect.left + rect.right) / 2, cy = (rect.top + rect.bottom) / 2;
    const candidates = [
      { side: 'right', x: rect.right + gap, y: cy - height / 2 },
      { side: 'left', x: rect.left - gap - width, y: cy - height / 2 },
      { side: 'bottom', x: cx - width / 2, y: rect.bottom + gap },
      { side: 'top', x: cx - width / 2, y: rect.top - gap - height }
    ];
    const overflow = p => Math.max(0, margin - p.x) + Math.max(0, p.x + width + margin - vw)
      + Math.max(0, margin - p.y) + Math.max(0, p.y + height + margin - vh);
    const selected = candidates.find(p => overflow(p) === 0)
      || candidates.reduce((best, p) => overflow(p) < overflow(best) ? p : best);
    popup.dataset.side = selected.side;
    background.src = `assets/platform-consult/${selected.side}.svg`;
    popup.style.left = Math.max(margin, Math.min(selected.x, vw - width - margin)) + 'px';
    popup.style.top = Math.max(margin, Math.min(selected.y, vh - height - margin)) + 'px';
  };
  window.DGJPlatformConsult = {
    open(source, { anchor: target = source, label = '客服咨询' } = {}) {
      if (!source?.isConnected || !target?.isConnected) return;
      if (trigger === source && !popup.hidden) { close(); return; }
      close();
      trigger = source; anchor = target;
      source.setAttribute('aria-controls', popup.id);
      source.setAttribute('aria-expanded', 'true');
      popup.setAttribute('aria-label', label);
      popup.hidden = false;
      position();
      if (!popup.hidden) popup.focus({ preventScroll: true });
    },
    close
  };
  document.addEventListener('click', event => {
    const source = event.target.closest('[data-consult]');
    if (source) {
      event.preventDefault();
      window.DGJPlatformConsult.open(source, { label: source.dataset.consult || '客服咨询' });
    }
  });
  document.addEventListener('pointerdown', event => {
    if (!popup.hidden && !popup.contains(event.target) && !trigger?.contains(event.target)) close();
  });
  document.addEventListener('keydown', event => {
    if (!popup.hidden && event.key === 'Escape') { event.preventDefault(); close(true); }
  });
  popup.addEventListener('focusout', event => {
    if (!popup.contains(event.relatedTarget) && event.relatedTarget !== trigger) close();
  });
  window.addEventListener('resize', () => { if (!popup.hidden) position(); });
  window.addEventListener('scroll', () => { if (!popup.hidden) position(); }, true);
  window.addEventListener('blur', () => close());
})();
