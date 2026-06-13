/* ─── APP NAVIGATION ENGINE ─────────────────────────────── */
const App = (() => {
  const sessions = document.querySelectorAll('.session');
  const dots     = document.querySelectorAll('.dot');
  let current    = 0;

  function go(index) {
    if (index < 0 || index >= sessions.length) return;

    // deactivate current
    sessions[current].classList.remove('active');
    dots[current].classList.remove('active');

    // activate target
    current = index;
    sessions[current].classList.add('active');
    dots[current].classList.add('active');

    // fire lifecycle hook if module registered one
    if (window._sessionOnEnter && window._sessionOnEnter[index]) {
      window._sessionOnEnter[index]();
    }
  }

  // dot clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => go(+dot.dataset.index));
  });

  // keyboard arrows
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(current + 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   go(current - 1);
  });

  // swipe support (mobile)
  let touchStartX = 0, touchStartY = 0;
  document.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? go(current + 1) : go(current - 1);
    }
  }, { passive: true });

  // registry for per-session init hooks
  window._sessionOnEnter = {};

  return { go, current: () => current };
})();
