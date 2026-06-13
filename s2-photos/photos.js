/* ─── PHOTOS + COMPLIMENTS ──────────────────────────────── */
(() => {

  // ── ADD YOUR PHOTOS HERE ──────────────────────────────────
  // Put files inside  s2-photos/photos/  and list them below.
  // You can name them anything — just match exactly.
  const PHOTOS = [
    { file: 'photo1.jpeg',  compliment: "Every photo of you feels like a painting the world wasn't ready for." },
    { file: 'photo2.jpeg',  compliment: "The way you carry yourself — effortlessly, like you don't even know you're magic." },
    { file: 'photo3.jpeg',  compliment: "You have this rare kind of beauty that makes people stop mid-sentence." },
    { file: 'photo4.jpeg',  compliment: "Soft eyes, warm heart. You make the world feel safer just by being in it." },
    { file: 'photo5.jpeg',  compliment: "I keep coming back to this one. You look like a dream I never want to wake from." },
    { file: 'photo6.jpeg',  compliment: "There's a quiet light about you that no camera ever fully captures — but this one tried." },
    { file: 'photo7.jpeg',  compliment: "This is my favourite version of you. Actually no — every version is my favourite." },
  ];
  // ─────────────────────────────────────────────────────────

  const gallery = document.getElementById('photo-gallery');
  let current = 0;

  function build() {
    gallery.innerHTML = '';

    const track = document.createElement('div');
    track.className = 'photo-track';

    PHOTOS.forEach((p, i) => {
      const card = document.createElement('div');
      card.className = 'photo-card' + (i === 0 ? ' active' : '');
      card.dataset.index = i;

      const img = document.createElement('img');
      img.src = `s2-photos/photos/${p.file}`;
      img.alt = '';
      img.className = 'photo-img';

      const caption = document.createElement('p');
      caption.className = 'photo-caption';
      caption.textContent = p.compliment;

      card.appendChild(img);
      card.appendChild(caption);
      track.appendChild(card);
    });

    // prev / next inside gallery
    const controls = document.createElement('div');
    controls.className = 'photo-controls';

    const prev = document.createElement('button');
    prev.className = 'photo-arrow';
    prev.textContent = '‹';
    prev.onclick = () => shift(-1);

    const counter = document.createElement('span');
    counter.className = 'photo-counter';
    counter.id = 'photo-counter';
    counter.textContent = `1 / ${PHOTOS.length}`;

    const next = document.createElement('button');
    next.className = 'photo-arrow';
    next.textContent = '›';
    next.onclick = () => shift(1);

    controls.appendChild(prev);
    controls.appendChild(counter);
    controls.appendChild(next);

    gallery.appendChild(track);
    gallery.appendChild(controls);
  }

  function shift(dir) {
    const cards = document.querySelectorAll('.photo-card');
    cards[current].classList.remove('active');
    current = (current + dir + PHOTOS.length) % PHOTOS.length;
    cards[current].classList.add('active');
    document.getElementById('photo-counter').textContent = `${current + 1} / ${PHOTOS.length}`;
  }

  build();

})();


/* ─── SECRET EASTER EGG: type "merub" ───────────────────── */
(() => {
  const SECRET = 'merub';
  let buffer = '';

  // build overlay once
  const overlay = document.createElement('div');
  overlay.id = 'egg-overlay';
  overlay.innerHTML = `
    <div id="egg-inner">
      <p id="egg-popcorn">🍿 hold your popcorns</p>
      <video id="egg-video" playsinline controls>
        <source src="secret/video.mp4" type="video/mp4">
      </video>
      <p id="egg-close-hint">tap anywhere to close</p>
    </div>
  `;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', close);

  // stop video click from bubbling (so clicking video doesn't close)
  document.getElementById('egg-video').addEventListener('click', e => e.stopPropagation());

  function open() {
    overlay.classList.add('active');
    setTimeout(() => {
      document.getElementById('egg-popcorn').classList.add('visible');
    }, 400);
    setTimeout(() => {
      document.getElementById('egg-video').classList.add('visible');
      document.getElementById('egg-video').play().catch(() => {});
      document.getElementById('egg-close-hint').classList.add('visible');
    }, 1800);
  }

  function close() {
    const vid = document.getElementById('egg-video');
    vid.pause();
    vid.currentTime = 0;
    overlay.classList.remove('active');
    document.getElementById('egg-popcorn').classList.remove('visible');
    vid.classList.remove('visible');
    document.getElementById('egg-close-hint').classList.remove('visible');
  }

  document.addEventListener('keydown', e => {
    // ignore when typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    buffer += e.key.toLowerCase();
    if (buffer.length > SECRET.length) buffer = buffer.slice(-SECRET.length);
    if (buffer === SECRET) { open(); buffer = ''; }
  });

})();
