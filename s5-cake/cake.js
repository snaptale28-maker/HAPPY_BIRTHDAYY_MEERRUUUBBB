/* ─── CAKE + FIREWORKS FINALE ───────────────────────────── */
(() => {

  const stage = document.getElementById('cake-stage');
  let candlesLeft = 5;
  let blown = false;
  let cut = false;

  // ── BUILD CAKE UI ─────────────────────────────────────────
  stage.innerHTML = `
    <div id="cake-wrap">

      <svg id="cake-svg" viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg">

        <!-- candles -->
        <g id="candles">
          <rect x="62"  y="68" width="8" height="28" rx="2" fill="#f5c5c8"/>
          <rect x="90"  y="58" width="8" height="28" rx="2" fill="#c8b4f5"/>
          <rect x="118" y="52" width="8" height="28" rx="2" fill="#b4d4f5"/>
          <rect x="146" y="58" width="8" height="28" rx="2" fill="#f5e4b4"/>
          <rect x="174" y="68" width="8" height="28" rx="2" fill="#b4f5d4"/>
        </g>

        <!-- flames -->
        <g id="flames">
          <ellipse id="f0" cx="66"  cy="63" rx="5" ry="7" fill="#ffcc44" opacity="1"/>
          <ellipse id="f1" cx="94"  cy="53" rx="5" ry="7" fill="#ffaa33" opacity="1"/>
          <ellipse id="f2" cx="122" cy="47" rx="5" ry="7" fill="#ff8844" opacity="1"/>
          <ellipse id="f3" cx="150" cy="53" rx="5" ry="7" fill="#ffcc44" opacity="1"/>
          <ellipse id="f4" cx="178" cy="63" rx="5" ry="7" fill="#ffaa33" opacity="1"/>
        </g>

        <!-- cake layers -->
        <!-- top layer -->
        <ellipse cx="130" cy="100" rx="82" ry="14" fill="#f0a0a8"/>
        <rect x="48" y="100" width="164" height="30" fill="#f0a0a8"/>
        <ellipse cx="130" cy="130" rx="82" ry="14" fill="#e88898"/>

        <!-- middle layer -->
        <ellipse cx="130" cy="130" rx="90" ry="15" fill="#fce4b0"/>
        <rect x="40" y="130" width="180" height="30" fill="#fce4b0"/>
        <ellipse cx="130" cy="160" rx="90" ry="15" fill="#f0d090"/>

        <!-- bottom layer -->
        <ellipse cx="130" cy="160" rx="100" ry="16" fill="#e8b4b8"/>
        <rect x="30" y="160" width="200" height="32" fill="#e8b4b8"/>
        <ellipse cx="130" cy="192" rx="100" ry="16" fill="#d89098"/>

        <!-- decorations -->
        <circle cx="80"  cy="145" r="5" fill="#fff" opacity="0.6"/>
        <circle cx="110" cy="148" r="4" fill="#fff" opacity="0.5"/>
        <circle cx="140" cy="145" r="5" fill="#fff" opacity="0.6"/>
        <circle cx="170" cy="148" r="4" fill="#fff" opacity="0.5"/>
        <circle cx="200" cy="145" r="5" fill="#fff" opacity="0.6"/>

        <!-- frosting drips -->
        <path d="M58 100 Q65 115 62 130" stroke="#fff" stroke-width="3" fill="none" opacity="0.4" stroke-linecap="round"/>
        <path d="M100 98 Q107 114 104 130" stroke="#fff" stroke-width="3" fill="none" opacity="0.4" stroke-linecap="round"/>
        <path d="M155 98 Q162 114 159 130" stroke="#fff" stroke-width="3" fill="none" opacity="0.4" stroke-linecap="round"/>
        <path d="M195 100 Q202 115 199 130" stroke="#fff" stroke-width="3" fill="none" opacity="0.4" stroke-linecap="round"/>

        <!-- cut line (hidden) -->
        <line id="cut-line" x1="130" y1="88" x2="130" y2="196"
          stroke="rgba(255,255,255,0)" stroke-width="2" stroke-dasharray="6 4"/>

      </svg>

      <div id="cake-buttons">
        <button class="pill-btn" id="blow-btn">🌬️ Blow candles</button>
        <button class="pill-btn" id="cut-btn" style="display:none">🔪 Cut the cake</button>
      </div>

      <p id="cake-msg"></p>

    </div>
  `;

  const flames    = [0,1,2,3,4].map(i => document.getElementById('f' + i));
  const blowBtn   = document.getElementById('blow-btn');
  const cutBtn    = document.getElementById('cut-btn');
  const cakeMsg   = document.getElementById('cake-msg');
  const cutLine   = document.getElementById('cut-line');

  // ── FLAME FLICKER ─────────────────────────────────────────
  let flickerRaf;
  function flickerFlames() {
    flames.forEach(f => {
      if (parseFloat(f.getAttribute('opacity')) > 0) {
        const sc = 0.85 + Math.random() * 0.3;
        f.setAttribute('ry', (7 * sc).toFixed(2));
        f.setAttribute('cy', (parseFloat(f.dataset.baseY || f.getAttribute('cy')) - (sc - 1) * 3).toFixed(2));
        if (!f.dataset.baseY) f.dataset.baseY = f.getAttribute('cy');
      }
    });
    flickerRaf = requestAnimationFrame(flickerFlames);
  }
  flickerFlames();

  // ── BLOW ONE CANDLE ───────────────────────────────────────
  blowBtn.addEventListener('click', () => {
    if (blown) return;

    // find first lit flame
    const lit = flames.findIndex(f => parseFloat(f.getAttribute('opacity')) > 0.1);
    if (lit === -1) return;

    // extinguish it
    const f = flames[lit];
    f.setAttribute('opacity', '0');
    candlesLeft--;

    cakeMsg.textContent = candlesLeft > 0
      ? `${candlesLeft} candle${candlesLeft > 1 ? 's' : ''} left... keep going! 🌬️`
      : '';

    if (candlesLeft === 0) {
      blown = true;
      cancelAnimationFrame(flickerRaf);
      blowBtn.style.display = 'none';
      cutBtn.style.display  = 'inline-block';
      cakeMsg.textContent   = 'All out! Now make your wish ✨ then cut the cake.';

      // show cut line
      setTimeout(() => {
        cutLine.setAttribute('stroke', 'rgba(255,255,255,0.35)');
      }, 600);
    }
  });

  // ── CUT CAKE ──────────────────────────────────────────────
  cutBtn.addEventListener('click', () => {
    if (cut) return;
    cut = true;
    cutBtn.disabled = true;
    cakeMsg.textContent = '';

    // animate cut line bright
    cutLine.setAttribute('stroke', 'rgba(255,255,255,0.9)');

    // slide cake halves apart
    const cakeSvg = document.getElementById('cake-svg');
    cakeSvg.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s ease';
    setTimeout(() => {
      cakeSvg.style.transform = 'scale(1.05)';
      cakeSvg.style.opacity   = '0';
    }, 300);

    // launch fireworks overlay
    setTimeout(launchFireworks, 900);
  });

  // ── FIREWORKS ─────────────────────────────────────────────
  function launchFireworks() {
    const overlay = document.getElementById('fireworks-overlay');
    const canvas  = document.getElementById('fireworks-canvas');
    const ctx     = canvas.getContext('2d');

    overlay.classList.add('active');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const COLORS = ['#e8b4b8','#ffffff','#ffd6d8','#ffaaaa','#f5c5ff','#c5d5ff','#ffe5a0'];

    function burst(x, y) {
      const count = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 / count) * i + Math.random() * 0.3;
        const speed = 2 + Math.random() * 5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          r: 1.5 + Math.random() * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          decay: 0.012 + Math.random() * 0.01,
          gravity: 0.08
        });
      }
    }

    // auto-burst random positions
    const burstTimer = setInterval(() => {
      burst(
        canvas.width  * (0.15 + Math.random() * 0.7),
        canvas.height * (0.1  + Math.random() * 0.55)
      );
    }, 600);

    // initial bursts
    burst(canvas.width * 0.3, canvas.height * 0.35);
    burst(canvas.width * 0.7, canvas.height * 0.25);

    function drawFW() {
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) { particles.splice(idx, 1); return; }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = 6;
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(drawFW);
    }
    drawFW();

    // stop auto-burst after 8s
    setTimeout(() => clearInterval(burstTimer), 8000);

    // close on click
    overlay.addEventListener('click', () => {
      overlay.classList.remove('active');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  // reset when entering cake session
  window._sessionOnEnter = window._sessionOnEnter || {};
  window._sessionOnEnter[4] = () => {
    // nothing to reset on re-entry — let them enjoy
  };

})();
