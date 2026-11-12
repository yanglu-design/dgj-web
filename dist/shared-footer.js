(() => {
  const footerMarkup = `
    <div class="footer-inner">
      <img class="footer-logo" src="assets/icon/dgjlogo2.svg" alt="店管家">
      <div class="footer-nav-column">
        <h4>产品与服务</h4><span class="footer-rule"></span>
        <a href="products.html">批量打单发货</a>
        <a href="products.html?view=distribution">分销代发ERP</a>
        <a href="products.html?view=distribution-listing">铺货代发</a>
        <a href="#">打印控件下载</a>
      </div>
      <div class="footer-nav-column">
        <h4>活动与资源</h4><span class="footer-rule"></span>
        <a href="about.html">关于店管家</a>
        <a href="service.html">产品试用</a>
        <a href="news.html">新闻动态</a>
        <a href="help.html">帮助中心</a>
        <a href="open-platform.html">开放平台</a>
      </div>
      <div class="footer-nav-column footer-contact">
        <h4>联系我们</h4><span class="footer-rule"></span>
        <p><img src="assets/icon/call.svg" alt="">400 863 8288</p>
        <p><img src="assets/icon/logo-qq.svg" alt="">800183731</p>
        <p><img src="assets/icon/客服.svg" alt="">中恒电商</p>
        <p><img src="assets/icon/service.svg" alt="">周一至周天，9:00–23:00</p>
        <p><img src="assets/icon/location.svg" alt="">广东省深圳市福田区福田街道办深南中路3039号深圳国际文化大厦</p>
      </div>
      <div class="qr">
        <h4>店管家公众号</h4>
        <img src="assets/images/公众号@2x.png" alt="店管家公众号二维码">
        <span>扫码关注，了解更多</span>
      </div>
    </div>
    <div class="copyright">
      <span>深圳店管家软件有限公司（店管家官网-www.dgjapp.com）</span>
      <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">粤ICP备14060770号</a>
    </div>`;

  const mountFooter = () => {
    let footer = document.querySelector('footer[data-shared-footer], footer');
    if (!footer) {
      footer = document.createElement('footer');
      document.body.appendChild(footer);
    }
    footer.dataset.sharedFooter = '';
    if (!footer.id) footer.id = 'contact';
    footer.innerHTML = footerMarkup;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter, { once: true });
  } else {
    mountFooter();
  }
})();
