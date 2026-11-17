(() => {
  const footerMarkup = `
    <div class="footer-inner">
      <img class="footer-logo" src="assets/icon/dgjlogo2.svg" alt="店管家">
      <div class="footer-nav-column">
        <h4>产品与服务</h4><span class="footer-rule"></span>
        <a href="products.html">批量打单发货</a>
        <a href="product-distribution.html">分销代发ERP</a>
        <a href="product-distribution-listing.html">铺货代发</a>
        <a href="https://www.dgjapp.com/widgeDownload/index.html" target="_blank" rel="noopener noreferrer">打印控件下载</a>
      </div>
      <div class="footer-nav-column">
        <h4>活动与资源</h4><span class="footer-rule"></span>
        <a href="about.html">关于店管家</a>
        <a href="index.html">产品试用</a>
        <a href="news.html">新闻动态</a>
        <a href="help.html">帮助中心</a>
        <a href="open-platform.html">开放平台</a>
      </div>
      <div class="footer-nav-column footer-contact">
        <h4>联系我们</h4><span class="footer-rule"></span>
        <p><img class="footer-contact-icon-default" src="assets/icon/call.svg" alt=""><img class="footer-contact-icon-hover" src="assets/footer-contact/call.svg" alt="">400 863 8288</p>
        <a class="footer-contact-link" href="https://webpage.qidian.qq.com/qidian/chatv3/pc.html?_type=wpa&amp;cate=7&amp;env=ol&amp;fid=31915&amp;ftype=1&amp;gseq=1794894714276&amp;isCustomEntry=0&amp;isLBS=0&amp;isSsc=0&amp;key=559c3e3cdf5301159de044c580674075&amp;kfuin=2885720638&amp;linkType=1&amp;qidian=true&amp;roleData=43443&amp;roleValue=1&amp;source=0&amp;translateSwitch=0&amp;type=10" target="_blank" rel="noopener noreferrer"><img class="footer-contact-icon-default" src="assets/icon/logo-qq.svg" alt=""><img class="footer-contact-icon-hover" src="assets/footer-contact/logo-qq.svg" alt="">800183731</a>
        <a class="footer-contact-link" href="https://amos.alicdn.com/getcid.aw?v=2&amp;uid=%E4%B8%AD%E6%81%92%E7%94%B5%E5%95%86&amp;site=cntaobao&amp;s=1&amp;groupid=0&amp;charset=utf-8&amp;token=EB1BBA6E1EEF0757" target="_blank" rel="noopener noreferrer"><img class="footer-contact-icon-default" src="assets/icon/客服.svg" alt=""><img class="footer-contact-icon-hover" src="assets/footer-contact/客服.svg" alt="">中恒电商</a>
        <p><img class="footer-contact-icon-default" src="assets/icon/service.svg" alt=""><img class="footer-contact-icon-hover" src="assets/footer-contact/service.svg" alt="">周一至周天，9:00–23:00</p>
        <p><img class="footer-contact-icon-default" src="assets/icon/location.svg" alt=""><img class="footer-contact-icon-hover" src="assets/footer-contact/location.svg" alt="">广东省深圳市福田区福田街道办深南中路3039号深圳国际文化大厦</p>
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
