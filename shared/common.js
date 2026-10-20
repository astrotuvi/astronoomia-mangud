'use strict';

// Helpers shared by all games: settings, language, sounds and star confetti.
window.Astro = (() => {
  const $ = (id) => document.getElementById(id);
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const shuffle = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Settings in localStorage, which may be unavailable (private mode etc.).
  function makeStore(prefix) {
    return {
      get(key, fallback) {
        try {
          const v = localStorage.getItem(prefix + key);
          return v === null ? fallback : JSON.parse(v);
        } catch (e) {
          return fallback;
        }
      },
      set(key, value) {
        try { localStorage.setItem(prefix + key, JSON.stringify(value)); } catch (e) { /* ignore */ }
      }
    };
  }

  // Language and sound are shared by all games.
  const settings = makeStore('astromangud.');

  const LANGS = ['et', 'en'];
  let lang = settings.get('lang', 'et');
  if (!LANGS.includes(lang)) lang = 'et';

  // Fill every [data-t] element from TEXT[lang] and wire up the .lang buttons.
  // onChange runs after each change, for texts the game sets itself.
  function setupLanguage(TEXT, onChange) {
    function apply() {
      document.documentElement.lang = lang;
      if (TEXT[lang].title) document.title = TEXT[lang].title;
      document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = TEXT[lang][el.dataset.t]; });
      document.querySelectorAll('[data-t-label]').forEach((el) => { el.setAttribute('aria-label', TEXT[lang][el.dataset.tLabel]); });
      document.querySelectorAll('.lang button').forEach((b) => b.classList.toggle('active', b.dataset.lang === lang));
      if (onChange) onChange(lang);
    }
    document.querySelectorAll('.lang button').forEach((b) => {
      b.addEventListener('click', () => {
        lang = b.dataset.lang;
        settings.set('lang', lang);
        apply();
      });
    });
    apply();
  }

  // ---------------------------------------------------------------------------
  // Sounds (generated, no files needed)
  // ---------------------------------------------------------------------------

  let soundOn = settings.get('sound', true);
  let ac = null;
  function audio() {
    if (!ac) {
      try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
    }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function tone(freq, delay, dur, type, vol, freqEnd) {
    if (!soundOn) return;
    const a = audio();
    if (!a) return;
    const o = a.createOscillator();
    const g = a.createGain();
    const t0 = a.currentTime + delay;
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(a.destination);
    o.start(t0);
    o.stop(t0 + dur + 0.05);
  }
  // C major pentatonic, so any run of notes sounds like a tune
  const SCALE = [523, 587, 659, 784, 880, 1047, 1175, 1319, 1568, 1760, 2093, 2349, 2637];

  const sfx = {
    get on() { return soundOn; },
    set on(v) {
      soundOn = v;
      settings.set('sound', v);
    },
    pick() { tone(480, 0, 0.09, 'sine', 0.08, 720); },
    snap() {
      tone(660, 0, 0.14, 'triangle', 0.22, 990);
      tone(1320, 0.07, 0.18, 'sine', 0.08);
    },
    note(i) {
      const f = SCALE[Math.min(i, SCALE.length - 1)];
      tone(f, 0, 0.35, 'triangle', 0.2);
      tone(f * 2, 0.02, 0.3, 'sine', 0.05);
    },
    oops() { tone(220, 0, 0.18, 'sine', 0.12, 170); },
    // a rocket engine: low filtered noise that swells and fades over dur seconds
    rumble(dur) {
      if (!soundOn) return;
      const a = audio();
      if (!a) return;
      const buf = a.createBuffer(1, Math.ceil(a.sampleRate * dur), a.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      const src = a.createBufferSource();
      src.buffer = buf;
      const f = a.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 380;
      const g = a.createGain();
      const t0 = a.currentTime;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.4);
      g.gain.setValueAtTime(0.35, t0 + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(f).connect(g).connect(a.destination);
      src.start(t0);
    },
    win() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.13, 0.4, 'triangle', 0.2));
      tone(1568, 0.55, 0.7, 'sine', 0.12);
      tone(2093, 0.7, 0.8, 'sine', 0.06);
    }
  };

  // ---------------------------------------------------------------------------
  // Star confetti on a full-screen canvas
  // ---------------------------------------------------------------------------

  let confettiRaf = 0;
  function startConfetti(cv) {
    const dpr = window.devicePixelRatio || 1;
    const W = window.innerWidth;
    const H = window.innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ['#ffd34d', '#5fd4ff', '#ff7eb6', '#9dff8a', '#ffffff', '#c59bff'];
    const parts = Array.from({ length: 120 }, () => ({
      x: rand(0, W),
      y: rand(-H, -10),
      r: rand(6, 14),
      vy: rand(1.5, 4),
      vx: rand(-1, 1),
      a: rand(0, Math.PI * 2),
      va: rand(-0.08, 0.08),
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    const t0 = performance.now();

    function star(x, y, r, a) {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 ? r * 0.45 : r;
        const ang = a + (i * Math.PI) / 5;
        ctx.lineTo(x + rr * Math.sin(ang), y - rr * Math.cos(ang));
      }
      ctx.closePath();
      ctx.fill();
    }

    cancelAnimationFrame(confettiRaf);
    (function frame(now) {
      const elapsed = now - t0;
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const q of parts) {
        q.x += q.vx;
        q.y += q.vy;
        q.a += q.va;
        // keep raining for a few seconds, then let the last stars fall away
        if (q.y > H + 20 && elapsed < 3500) q.y = -20;
        if (q.y < H + 20) alive = true;
        ctx.fillStyle = q.color;
        star(q.x, q.y, q.r, q.a);
      }
      if (alive) confettiRaf = requestAnimationFrame(frame);
    })(t0);
  }

  function stopConfetti(cv) {
    cancelAnimationFrame(confettiRaf);
    cv.getContext('2d').clearRect(0, 0, cv.width, cv.height);
  }

  return {
    $, rand, clamp, shuffle, makeStore, setupLanguage, sfx, startConfetti, stopConfetti,
    get lang() { return lang; }
  };
})();
