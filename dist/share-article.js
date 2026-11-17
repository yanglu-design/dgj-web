(() => {
  window.DGJShareArticle = async () => {
    let copied = false;
    try {
      if (typeof navigator.clipboard?.writeText === 'function') {
        await navigator.clipboard.writeText(location.href);
        copied = true;
      }
    } catch (_) { /* Fall back for local previews and restricted clipboard access. */ }
    if (!copied) {
      const input = document.createElement('textarea');
      const focused = document.activeElement;
      input.value = location.href;
      input.setAttribute('readonly', '');
      input.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(input);
      try {
        input.select();
        copied = document.execCommand('copy');
      } catch (_) { /* Report failure without claiming the link was copied. */ }
      finally { input.remove(); focused?.focus({ preventScroll: true }); }
    }
    if (copied) {
      window.DGJAntMessage.success({ content: '文档链接复制成功', key: 'article-share', duration: 3 });
      return null;
    }
    window.DGJAntMessage.error({ content: '复制失败，请复制浏览器地址栏链接', key: 'article-share', duration: 3 });
    return null;
  };
})();
