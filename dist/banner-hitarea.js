(() => {
  // banner1.svg: 1920 × 480; visible button rectangle: x380 y293 w160 h49.
  // Both the carousel image and product background use centered cover sizing.
  const links = [...document.querySelectorAll('.banner-button-hitarea')];
  const fit = link => {
    const container = link.parentElement;
    const width = container.clientWidth, height = container.clientHeight;
    const scale = Math.max(width / 1920, height / 480);
    link.style.left = ((width - 1920 * scale) / 2 + 380 * scale) + 'px';
    link.style.top = ((height - 480 * scale) / 2 + 293 * scale) + 'px';
    link.style.width = 160 * scale + 'px';
    link.style.height = 49 * scale + 'px';
  };
  links.forEach(fit);
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(entries => {
      entries.forEach(entry => links.filter(link => link.parentElement === entry.target).forEach(fit));
    });
    links.forEach(link => observer.observe(link.parentElement));
  } else window.addEventListener('resize', () => links.forEach(fit));
})();
