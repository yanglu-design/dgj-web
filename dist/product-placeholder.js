(() => {
  const toggle = document.querySelector('.nav-toggle');
  toggle?.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', String(document.querySelector('.nav').classList.toggle('open')));
  });
})();
