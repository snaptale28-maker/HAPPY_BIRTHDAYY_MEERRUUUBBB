/* ─── RADIO SESSION ─────────────────────────────────────── */
(() => {

  // ── ADD YOUR RADIO STATIONS HERE ─────────────────────────
  // Put mp3 files in  s4-radio/audio/
  // frequency: any number between 87.5 and 108.0
  const STATIONS = [
    { freq: 90.2,  name: 'Love FM',       file: 'station1.mp3' },
    { freq: 94.7,  name: 'Our Songs',     file: 'station2.mp3' },
    { freq: 103.5, name: 'Just For You',  file: 'station3.mp3' },
  ];
  // ─────────────────────────────────────────────────────────

  const MIN_FREQ = 87.5, MAX_FREQ = 108.0;
  const widget = document.getElementById('radio-widget');

  let power    = false;
  let freq     = 100.0;
  let dragging = false;
  let dragStartX, dragStartFreq;
  let audio    = null;
  let scanTimer = null;

  // ── BUILD UI ──────────────────────────────────────────────
  widget.innerHTML = `
    <div id="radio-body">

      <div id="radio-display">
        <div id="radio-off-msg">— OFF —</div>
        <div id="radio-on-content">
          <div id="radio-freq-big"><span id="freq-val">100.0</span><span id="freq-unit">FM</span></div>
          <div id="radio-station-name"></div>
          <div id="radio-signal">
            <div class="sig-bar"></div><div class="sig-bar"></div>
            <div class="sig-bar"></div><div class="sig-bar"></div>
            <div class="sig-bar"></div>
          </div>
        </div>
      </div>

      <div id="radio-dial-wrap">
        <div id="radio-dial-track">
          <div id="radio-needle"></div>
          <div id="radio-dial-knob" title="Drag to tune"></div>
        </div>
        <div id="radio-freq-labels">
          <span>87.5</span><span>95</span><span>100</span><span>105</span><span>108</span>
        </div>
      </div>

      <div id="radio-controls">
        <button class="radio-btn" id="radio-scan-left">&#9664;&#9664;</button>
        <button class="radio-btn radio-power" id="radio-power-btn">&#9711;</button>
        <button class="radio-btn" id="radio-scan-right">&#9654;&#9654;</button>
      </div>

    </div>
  `;

  // refs
  const body       = document.getElementById('radio-body');
  const offMsg     = document.getElementById('radio-off-msg');
  const onContent  = document.getElementById('radio-on-content');
  const freqVal    = document.getElementById('freq-val');
  const stationEl  = document.getElementById('radio-station-name');
  const knob       = document.getElementById('radio-dial-knob');
  const needle     = document.getElementById('radio-needle');
  const powerBtn   = document.getElementById('radio-power-btn');
  const scanL      = document.getElementById('radio-scan-left');
  const scanR      = document.getElementById('radio-scan-right');
  const sigBars    = document.querySelectorAll('.sig-bar');

  // ── HELPERS ───────────────────────────────────────────────
  function freqToPercent(f) {
    return ((f - MIN_FREQ) / (MAX_FREQ - MIN_FREQ)) * 100;
  }

  function updateKnob() {
    const pct = freqToPercent(freq);
    knob.style.left   = pct + '%';
    needle.style.left = pct + '%';
    freqVal.textContent = freq.toFixed(1);
  }

  function getStation() {
    return STATIONS.find(s => Math.abs(s.freq - freq) < 0.4) || null;
  }

  function updateSignal() {
    const station = getStation();
    const dist = station ? Math.abs(station.freq - freq) : 99;
    // strength 0–5
    const strength = dist < 0.1 ? 5 : dist < 0.2 ? 4 : dist < 0.3 ? 3 : dist < 0.4 ? 1 : 0;
    sigBars.forEach((b, i) => b.classList.toggle('active', i < strength));
    stationEl.textContent = strength >= 3 && station ? station.name : '';
  }

  function playStation() {
    stopAudio();
    const station = getStation();
    const dist = station ? Math.abs(station.freq - freq) : 99;
    if (station && dist < 0.15) {
      audio = new Audio('s4-radio/audio/' + station.file);
      audio.loop = true;
      audio.volume = Math.max(0, 1 - dist * 8);
      audio.play().catch(() => {});
    }
  }

  function stopAudio() {
    if (audio) { audio.pause(); audio = null; }
  }

  function togglePower() {
    power = !power;
    body.classList.toggle('on', power);
    offMsg.style.display  = power ? 'none'  : 'flex';
    onContent.style.display = power ? 'flex' : 'none';
    powerBtn.classList.toggle('active', power);
    if (power) { updateKnob(); updateSignal(); playStation(); }
    else { stopAudio(); clearInterval(scanTimer); }
  }

  // ── DIAL DRAG ─────────────────────────────────────────────
  function onDragStart(e) {
    if (!power) return;
    dragging = true;
    dragStartX = e.touches ? e.touches[0].clientX : e.clientX;
    dragStartFreq = freq;
    e.preventDefault();
  }

  function onDragMove(e) {
    if (!dragging) return;
    const track = document.getElementById('radio-dial-track');
    const W = track.offsetWidth;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = cx - dragStartX;
    const dFreq = (dx / W) * (MAX_FREQ - MIN_FREQ);
    freq = Math.min(MAX_FREQ, Math.max(MIN_FREQ, dragStartFreq + dFreq));
    freq = Math.round(freq * 10) / 10;
    updateKnob();
    updateSignal();
    clearTimeout(window._radioPlayDelay);
    window._radioPlayDelay = setTimeout(playStation, 300);
  }

  function onDragEnd() { dragging = false; }

  knob.addEventListener('mousedown',  onDragStart);
  knob.addEventListener('touchstart', onDragStart, { passive: false });
  window.addEventListener('mousemove',  onDragMove);
  window.addEventListener('touchmove',  onDragMove, { passive: false });
  window.addEventListener('mouseup',    onDragEnd);
  window.addEventListener('touchend',   onDragEnd);

  // ── SCAN BUTTONS ──────────────────────────────────────────
  function scan(dir) {
    if (!power) return;
    clearInterval(scanTimer);
    scanTimer = setInterval(() => {
      freq = Math.min(MAX_FREQ, Math.max(MIN_FREQ, Math.round((freq + dir * 0.1) * 10) / 10));
      updateKnob();
      updateSignal();
      if (freq === MIN_FREQ || freq === MAX_FREQ) clearInterval(scanTimer);
    }, 80);
    clearTimeout(window._radioPlayDelay);
    window._radioPlayDelay = setTimeout(playStation, 500);
  }

  scanL.addEventListener('mousedown',  () => scan(-1));
  scanR.addEventListener('mousedown',  () => scan(1));
  scanL.addEventListener('touchstart', () => scan(-1), { passive: true });
  scanR.addEventListener('touchstart', () => scan(1),  { passive: true });
  ['mouseup','touchend'].forEach(ev => {
    scanL.addEventListener(ev, () => clearInterval(scanTimer));
    scanR.addEventListener(ev, () => clearInterval(scanTimer));
  });

  powerBtn.addEventListener('click', togglePower);

  // stop when leaving
  window._sessionOnEnter = window._sessionOnEnter || {};
  [0, 1, 2, 4].forEach(idx => {
    const prev = window._sessionOnEnter[idx];
    window._sessionOnEnter[idx] = () => { stopAudio(); if (prev) prev(); };
  });

  // init display
  offMsg.style.display    = 'flex';
  onContent.style.display = 'none';
  updateKnob();

})();
