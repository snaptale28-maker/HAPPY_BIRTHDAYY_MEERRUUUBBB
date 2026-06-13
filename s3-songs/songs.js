/* ─── SONGS SESSION ─────────────────────────────────────── */
(() => {

  // ── ADD YOUR SONGS HERE ───────────────────────────────────
  const SONGS = [
    { title: 'Tu Chahiye',  artist: 'Pritam, Amitabh Bhattacharya', file: 'song1.mp3' },
    { title: 'Toota Jo Kabhi Tara',  artist: 'Atif Aslam and Sumedha Karmahe', file: 'song2.mp3' },
    { title: 'Tere Hawaale',  artist: 'Arijit Singh and Shilpa Rao', file: 'song3.mp3' },
    { title: 'Ishq',  artist: 'Faheem Abdullah, Rauhan Malik', file: 'song4.mp3' },
    { title: 'Soch na Sake',  artist: 'Amaal Mallik, Arijit Singh', file: 'song5.mp3' },
  ];
  // ─────────────────────────────────────────────────────────

  const container = document.getElementById('song-list');
  let current = null;

  function build() {
    container.innerHTML = '';
    SONGS.forEach((song, i) => {
      const row = document.createElement('div');
      row.className = 'song-row';
      row.id = 'song-' + i;
      row.innerHTML =
        '<button class="song-play-btn" aria-label="Play">' +
          '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">' +
            '<path d="M3 2l9 5-9 5V2z" fill="currentColor"/>' +
          '</svg>' +
        '</button>' +
        '<div class="song-info">' +
          '<span class="song-title">' + song.title + '</span>' +
          '<span class="song-artist">' + song.artist + '</span>' +
        '</div>' +
        '<div class="song-progress-wrap">' +
          '<div class="song-bar"><div class="song-fill" id="fill-' + i + '"></div></div>' +
          '<span class="song-time" id="time-' + i + '">0:00</span>' +
        '</div>';
      row.querySelector('.song-play-btn').addEventListener('click', () => toggle(i, song, row));
      container.appendChild(row);
    });
  }

  function toggle(i, song, row) {
    if (current) {
      current.audio.pause();
      current.audio.currentTime = 0;
      const prev = document.getElementById('song-' + current.index);
      if (prev) prev.classList.remove('playing');
      clearInterval(current.timer);
      resetBar(current.index);
      if (current.index === i) { current = null; return; }
    }

    const audio = new Audio('s3-songs/audio/' + song.file);
    row.classList.add('playing');

    const timer = setInterval(() => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      document.getElementById('fill-' + i).style.width = pct + '%';
      document.getElementById('time-' + i).textContent = fmt(audio.currentTime);
    }, 250);

    audio.addEventListener('ended', () => {
      row.classList.remove('playing');
      resetBar(i);
      clearInterval(timer);
      current = null;
    });

    audio.play().catch(() => {});
    current = { audio, index: i, timer };
  }

  function resetBar(i) {
    const fill = document.getElementById('fill-' + i);
    const time = document.getElementById('time-' + i);
    if (fill) fill.style.width = '0%';
    if (time) time.textContent = '0:00';
  }

  function fmt(s) {
    const m = Math.floor(s / 60);
    return m + ':' + Math.floor(s % 60).toString().padStart(2, '0');
  }

  // pause when navigating away
  window._sessionOnEnter = window._sessionOnEnter || {};
  [0, 1, 3, 4].forEach(idx => {
    const prev = window._sessionOnEnter[idx];
    window._sessionOnEnter[idx] = () => {
      if (current) current.audio.pause();
      if (prev) prev();
    };
  });

  build();

})();
