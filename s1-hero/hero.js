/* ─── HERO PARTICLES ────────────────────────────────────── */
(() => {
  const canvas = document.getElementById('hero-particles');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], raf;

  const COLORS = ['rgba(232,180,184,', 'rgba(255,255,255,', 'rgba(200,150,155,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function random(min, max) { return Math.random() * (max - min) + min; }

  function spawn() {
    return {
      x:     random(0, W),
      y:     random(0, H),
      r:     random(1, 2.8),
      alpha: random(0.08, 0.45),
      dx:    random(-0.18, 0.18),
      dy:    random(-0.28, -0.08),
      da:    random(0.0003, 0.001),
      pulse: random(0, Math.PI * 2),
      color: COLORS[Math.floor(random(0, COLORS.length))]
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: 90 }, spawn);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.pulse += p.da * 60;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.y < -10)  p.y = H + 10;
      if (p.x < -10)  p.x = W + 10;
      if (p.x > W+10) p.x = -10;
    });

    raf = requestAnimationFrame(draw);
  }

  function start() { init(); draw(); }
  function stop()  { cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); }

  window.addEventListener('resize', resize);

  // start on load
  start();

  // lifecycle: restart when returning to hero
  window._sessionOnEnter = window._sessionOnEnter || {};
  window._sessionOnEnter[0] = start;

  // stop when leaving hero to save CPU
  document.querySelectorAll('.dot').forEach(d => {
    d.addEventListener('click', () => { if (+d.dataset.index !== 0) stop(); });
  });
  document.querySelectorAll('.arrow-btn').forEach(b => {
    b.addEventListener('click', stop);
  });

})();
