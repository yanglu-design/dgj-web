(() => {
  const track = document.querySelector('.honor-track');
  if (!track) return;
  const cards = [...track.children];
  let index = 0;
  const visibleCount = () => innerWidth <= 640 ? 2 : innerWidth <= 900 ? 3 : 5;
  const update = () => {
    const gap = 18;
    const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
    index = Math.max(0, Math.min(index, Math.max(0, cards.length - visibleCount())));
    track.style.transform = `translateX(${-index * (cardWidth + gap)}px)`;
  };
  document.querySelector('.honor-arrow.prev')?.addEventListener('click', () => { index -= 1; update(); });
  document.querySelector('.honor-arrow.next')?.addEventListener('click', () => { index += 1; update(); });
  addEventListener('resize', update);
  update();
})();
