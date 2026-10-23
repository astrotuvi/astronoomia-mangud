'use strict';

(() => {
  const { $, rand, clamp, shuffle, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  const ROUND = 60;       // s, one night
  const DAWN = 10;        // s at the end of the night when the sky gets light
  const HINT_MS = 5000;   // time with nothing caught before the hand shows a star
  const GRACE = 0.25;     // s a shooting star can still be caught after it fades
  const JAR_MAX = 44;     // stars that fit in the jar; more are counted but not drawn

  // Cassiopeia and Perseus as in tahtkujud/app.js: RA and Dec (J2000, degrees)
  // and magnitude. The Perseids seem to fly out of a spot between the two.
  const CONSTELLATIONS = [
    {
      name: { et: 'Kassiopeia', en: 'Cassiopeia' },
      stars: [[2.29, 59.15, 2.3], [10.13, 56.54, 2.2], [14.18, 60.72, 2.2], [21.45, 60.24, 2.7], [28.60, 63.67, 3.4]],
      lines: [[0, 1, 2, 3, 4]]
    },
    {
      name: { et: 'Perseus', en: 'Perseus' },
      stars: [
        [42.67, 55.90, 3.8], [46.20, 53.51, 2.9], [51.08, 49.86, 1.8], [55.73, 47.79, 3.0], [59.46, 40.01, 2.9],
        [59.74, 35.79, 4.0], [58.53, 31.88, 2.9], [47.37, 44.86, 3.8], [47.04, 40.96, 2.1], [46.29, 38.84, 3.4]
      ],
      lines: [[0, 1, 2, 3, 4, 5, 6], [2, 7, 8, 9]]
    }
  ];
  const RADIANT = [48, 58];
  const CENTRE = [32, 48];   // the middle of the picture of the two
  const DEG = Math.PI / 180;

  // the real showers, by month (0 = January) and day of their best night
  const SHOWERS = [
    { m: 7, d: 12, name: { et: 'Perseiidid', en: 'the Perseids' } },
    { m: 11, d: 14, name: { et: 'Geminiidid', en: 'the Geminids' } }
  ];

  const TEXT = {
    et: {
      title: 'Püüa langev täht',
      intro: 'Öösel lendavad taevas langevad tähed. Mitu neist jõuad ühe ööga purki püüda?',
      play: 'Mängi',
      best: (n) => `🏆 Rekord: ${n} ⭐`,
      noBest: 'Rekordit veel pole.',
      shower: (name) => `🌠 Täna öösel on päris tähesadu – ${name}! Mine pimedas õue ja vaata taevasse.`,
      captions: {
        start: ['Püüa langevaid tähti!', 'Puuduta tähte, kui see lendab'],
        fireball: ['Boliid! ⭐⭐', 'Väga hele langev täht'],
        plane: ['✈️ See on lennuk', 'Tema tuled vilguvad punaselt ja roheliselt'],
        planeAgain: ['✈️ Lennuk', ''],
        satellite: ['🛰️ See on satelliit', 'Ta liigub aeglaselt ega vilgu'],
        satelliteAgain: ['🛰️ Satelliit', ''],
        fact1: ['Kas teadsid?', 'Langev täht ei ole päris täht. See on liivatera suurune kivike, mis põleb õhus.'],
        fact2: ['Kas teadsid?', 'Langev täht lendab 60 km sekundis. Tartust Tallinna jõuaks ta 3 sekundiga!'],
        dawn: ['Hakkab valgeks minema', 'Veel natuke!']
      },
      nightOver: 'Öö sai läbi!',
      count: (n) => (n === 0 ? 'Seekord ei jäänud ükski täht purki.' :
        n === 1 ? 'Püüdsid 1 langeva tähe!' : `Püüdsid ${n} langevat tähte!`),
      newBest: 'Uus rekord! 🏆',
      oldBest: (n) => `Rekord: ${n} ⭐`,
      winTip: 'Kõige rohkem langevaid tähti näeb augusti keskel. Siis lendavad nad justkui Perseuse tähtkuju poolt, nagu selles mängus. Lama pimedas tekil ja vaata taevasse!',
      again: 'Uuesti',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      sound: 'Heli'
    },
    en: {
      title: 'Catch a Shooting Star',
      intro: 'At night, shooting stars fly across the sky. How many can you catch in your jar in one night?',
      play: 'Play',
      best: (n) => `🏆 Best: ${n} ⭐`,
      noBest: 'No best score yet.',
      shower: (name) => `🌠 Tonight there is a real meteor shower, ${name}! Go out after dark and look up at the sky.`,
      captions: {
        start: ['Catch the shooting stars!', 'Tap a star while it flies'],
        fireball: ['A fireball! ⭐⭐', 'A very bright shooting star'],
        plane: ['✈️ That is a plane', 'Its lights blink red and green'],
        planeAgain: ['✈️ A plane', ''],
        satellite: ['🛰️ That is a satellite', 'It moves slowly and does not blink'],
        satelliteAgain: ['🛰️ A satellite', ''],
        fact1: ['Did you know?', 'A shooting star is not a real star. It is a little stone, as small as a grain of sand, burning up in the air.'],
        fact2: ['Did you know?', 'A shooting star flies 60 km every second. That is over 2000 times faster than a car!'],
        dawn: ['The sky is getting light', 'Just a little longer!']
      },
      nightOver: 'The night is over!',
      count: (n) => (n === 0 ? 'No stars got into the jar this time.' :
        n === 1 ? 'You caught 1 shooting star!' : `You caught ${n} shooting stars!`),
      newBest: 'New record! 🏆',
      oldBest: (n) => `Best: ${n} ⭐`,
      winTip: 'The most shooting stars can be seen in the middle of August. Then they seem to fly out of the constellation Perseus, as in this game. Lie on a blanket in the dark and look up!',
      again: 'Again',
      menu: 'Menu',
      allGames: 'All games',
      sound: 'Sound'
    }
  };

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('meteoor.');
  const state = {
    best: Math.max(0, Math.floor(Number(store.get('best', 0)) || 0)),
    t: 0,            // time since the night began, s
    over: false,     // the night is over, the last stars fly to the jar
    overT: 0,
    caught: 0,
    inJar: 0,        // the caught stars that have reached the jar
    idle: 0,         // s since the last catch
    meteors: [],
    crafts: [],      // planes and satellites
    flying: [],      // caught stars on their way to the jar
    sparks: [],
    nextMeteor: 0,
    burst: 0,        // how many more come quickly one after another
    craftPlan: [],   // [time, kind] of the planes and satellites still to come
    fireballAt: 0,
    facts: [],       // [time, key] of the facts still to come
    seen: {},        // the plane and the satellite are explained only once
    caption: null,   // { key, until }
    hinted: null,    // the shooting star the hand points at
    raf: 0,
    last: 0,
    L: null,         // layout, see layout()
    gen: 0
  };

  const area = $('area');
  const cv = $('night');
  const ctx = cv.getContext('2d');
  const t = (key) => TEXT[Astro.lang][key];

  // A fixed random sequence, so that the sky looks the same every night.
  function seeded(seed) {
    let s = seed;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function starPath(x, y, r) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.45 : r;
      const a = (i * Math.PI) / 5;
      d += (i ? 'L' : 'M') + (x + rr * Math.sin(a)).toFixed(2) + ' ' + (y - rr * Math.cos(a)).toFixed(2);
    }
    return d + 'Z';
  }

  // ---------------------------------------------------------------------------
  // The jar: a 100 × 120 picture, filled from the bottom up
  // ---------------------------------------------------------------------------

  const slots = (() => {
    const r = seeded(7);
    const out = [];
    for (let row = 0; out.length < JAR_MAX; row++) {
      const n = row % 2 ? 5 : 6;
      for (let c = 0; c < n && out.length < JAR_MAX; c++) {
        out.push([
          (row % 2 ? 28.5 : 23.5) + c * 10.6 + (r() - 0.5) * 3,
          106 - row * 9.4 + (r() - 0.5) * 3,
          r() * 72
        ]);
      }
    }
    return out;
  })();

  function jarSVG(n) {
    const stars = slots.slice(0, n).map(([x, y, a]) =>
      `<path d="${starPath(x, y, 5.6)}" transform="rotate(${a.toFixed(0)} ${x.toFixed(2)} ${y.toFixed(2)})"/>`).join('');
    const body = 'M30 24C30 30 12 32 12 46V106C12 113 17 116 24 116H76C83 116 88 113 88 106V46C88 32 70 30 70 24Z';
    return `<ellipse cx="50" cy="72" rx="60" ry="62" fill="url(#jarGlow)" opacity="${(0.15 + 0.85 * clamp(n / 30, 0, 1)).toFixed(2)}"/>` +
      `<path d="${body}" fill="#0a1030" fill-opacity="0.6"/><path d="${body}" fill="url(#glass)"/>` +
      `<g fill="#ffd34d" filter="url(#starGlow)">${stars}</g>` +
      `<path d="${body}" fill="none" stroke="#dff2ff" stroke-opacity="0.75" stroke-width="2.4" stroke-linejoin="round"/>` +
      '<path d="M19 50V100" stroke="#fff" stroke-opacity="0.45" stroke-width="3" stroke-linecap="round"/>' +
      '<rect x="26" y="10" width="48" height="15" rx="4" fill="#c98a4b" stroke="#7a4a22" stroke-width="2"/>' +
      '<path d="M30 15H70M30 20H70" stroke="#7a4a22" stroke-opacity="0.5" stroke-width="1.2"/>';
  }

  // where a star in the jar is, in the area's pixels
  function slotXY(k) {
    const J = state.L.jar;
    const [x, y] = slots[Math.min(k, JAR_MAX - 1)];
    return { x: J.x + (x / 100) * J.w, y: J.y + (y / 120) * J.h, r: (5.6 / 100) * J.w };
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  // a real shower within three days of its best night
  function showerNow() {
    const now = new Date();
    for (const s of SHOWERS) {
      for (const y of [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1]) {
        if (Math.abs(now - new Date(y, s.m, s.d, 12)) <= 3.5 * 864e5) return s;
      }
    }
    return null;
  }

  function updateMenu() {
    $('menuJar').innerHTML = jarSVG(Math.min(state.best, JAR_MAX));
    $('best').textContent = state.best ? t('best')(state.best) : t('noBest');
    const s = showerNow();
    $('shower').classList.toggle('hidden', !s);
    if (s) $('shower').textContent = t('shower')(s.name[Astro.lang]);
  }

  function stopAll() {
    state.gen++;
    cancelAnimationFrame(state.raf);
    state.raf = 0;
    Astro.stopConfetti($('confetti'));
  }

  function showMenu() {
    stopAll();
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // Game
  // ---------------------------------------------------------------------------

  function startGame() {
    stopAll();
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    Object.assign(state, {
      t: 0, over: false, overT: 0, caught: 0, inJar: 0, idle: 0,
      meteors: [], crafts: [], flying: [], sparks: [],
      nextMeteor: 1.2, burst: 0, seen: {}, caption: null, hinted: null,
      fireballAt: rand(18, 48),
      facts: [[21, 'fact1'], [39, 'fact2'], [ROUND - DAWN, 'dawn']]
    });
    // a plane and a satellite in some order, then one more of either
    const kinds = shuffle(['plane', 'satellite']);
    kinds.push(Math.random() < 0.5 ? 'plane' : 'satellite');
    state.craftPlan = [[rand(5, 9), kinds[0]], [rand(23, 27), kinds[1]], [rand(41, 45), kinds[2]]];
    layout();
    showCaption('start', 3.5);
    updateBar();
    state.last = performance.now();
    state.raf = requestAnimationFrame(frame);
  }

  // Sizes in pixels, and the sky and the ground drawn once on their own
  // canvases.
  function layout() {
    const W = area.clientWidth;
    const H = area.clientHeight;
    if (!W || !H) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const u = Math.min(W, H);
    const G = clamp(H * 0.15, 50, 110);    // how tall the treeline is
    const jh = clamp(Math.min(H * 0.26, W * 0.34), 90, 180);
    const jw = (jh * 100) / 120;
    const jar = { w: jw, h: jh, x: (W - jw) / 2, y: H - G * 0.3 - jh };
    const L = {
      W, H, u, G, dpr, jar,
      hitR: Math.max(40, u * 0.08),
      // where the shooting stars fly: below the caption and above the trees
      box: { x0: W * 0.04, x1: W * 0.96, y0: Math.min(70, H * 0.12), y1: H - G - 10 },
      cx: W * (W > H ? 0.3 : 0.36),
      cy: H * (W > H ? 0.34 : 0.3),
      s: u * 0.62
    };
    [L.rx, L.ry] = project(L, RADIANT[0], RADIANT[1]);
    state.L = L;
    Object.assign($('jar').style, { left: jar.x + 'px', top: jar.y + 'px', width: jw + 'px', height: jh + 'px' });
    L.sky = drawSky(L);
    L.ground = drawGround(L);
    L.twinkles = makeTwinkles(L);
    // things in flight would be in the wrong place now
    state.meteors = [];
    state.inJar = state.caught;
    state.flying = [];
    drawJar();
    draw();
  }

  // Gnomonic projection around CENTRE, as on a sky chart: north up, east left.
  function project(L, ra, dec) {
    const a0 = CENTRE[0] * DEG;
    const d0 = CENTRE[1] * DEG;
    const a = ra * DEG;
    const d = dec * DEG;
    const c = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(a - a0);
    const xi = (Math.cos(d) * Math.sin(a - a0)) / c;
    const eta = (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(a - a0)) / c;
    return [L.cx - xi * L.s, L.cy - eta * L.s];
  }

  function layer(L) {
    const c = document.createElement('canvas');
    c.width = Math.round(L.W * L.dpr);
    c.height = Math.round(L.H * L.dpr);
    const g = c.getContext('2d');
    g.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    return [c, g];
  }

  function dot(g, x, y, r, color) {
    g.fillStyle = color;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }

  function drawSky(L) {
    const [c, g] = layer(L);
    const grad = g.createLinearGradient(0, 0, 0, L.H);
    grad.addColorStop(0, '#040820');
    grad.addColorStop(0.6, '#0c1644');
    grad.addColorStop(1, '#26357a');
    g.fillStyle = grad;
    g.fillRect(0, 0, L.W, L.H);
    const r = seeded(11);
    const n = clamp(Math.round((L.W * L.H) / 3500), 80, 320);
    for (let i = 0; i < n; i++) {
      const x = r() * L.W;
      const y = r() * (L.H - L.G * 0.5);
      dot(g, x, y, 0.4 + r() * r() * 1.2, `rgba(255,255,255,${(0.3 + r() * 0.6).toFixed(2)})`);
    }
    // Cassiopeia and Perseus, faintly joined
    for (const con of CONSTELLATIONS) {
      const p = con.stars.map(([ra, dec]) => project(L, ra, dec));
      g.strokeStyle = 'rgba(150, 180, 255, 0.2)';
      g.lineWidth = 1.2;
      g.lineJoin = 'round';
      for (const line of con.lines) {
        g.beginPath();
        line.forEach((k, i) => (i ? g.lineTo(...p[k]) : g.moveTo(...p[k])));
        g.stroke();
      }
      con.stars.forEach(([, , mag], k) => {
        const rr = 0.9 + (4.2 - mag) * 0.85;
        dot(g, p[k][0], p[k][1], rr * 2.4, 'rgba(200, 220, 255, 0.12)');
        dot(g, p[k][0], p[k][1], rr, '#fff');
      });
      // the name below the figure
      const size = Math.round(clamp(L.u * 0.03, 11, 15));
      g.fillStyle = 'rgba(200, 220, 255, 0.45)';
      g.font = `700 ${size}px Nunito, sans-serif`;
      g.textAlign = 'center';
      const xs = p.map((q) => q[0]);
      g.fillText(con.name[Astro.lang], (Math.min(...xs) + Math.max(...xs)) / 2, Math.max(...p.map((q) => q[1])) + size + 8);
    }
    return c;
  }

  // Spruces, a house with a lit window and the dome of a little observatory.
  function drawGround(L) {
    const [c, g] = layer(L);
    const r = seeded(5);
    const base = L.H - L.G * 0.45;
    const ink = '#03050f';
    g.fillStyle = ink;
    g.fillRect(0, base, L.W, L.H - base);
    // the house on the right and the dome on the left
    const hx = L.W * 0.8;
    const hs = L.G * 0.55;
    g.fillRect(hx - hs, base - hs * 0.8, hs * 2, hs * 0.8 + 1);
    g.beginPath();
    g.moveTo(hx - hs * 1.15, base - hs * 0.78);
    g.lineTo(hx, base - hs * 1.5);
    g.lineTo(hx + hs * 1.15, base - hs * 0.78);
    g.fill();
    g.fillStyle = '#ffcf6b';
    g.fillRect(hx - hs * 0.55, base - hs * 0.58, hs * 0.38, hs * 0.32);
    g.fillRect(hx + hs * 0.17, base - hs * 0.58, hs * 0.38, hs * 0.32);
    g.fillStyle = ink;
    const dx = L.W * 0.16;
    const ds = L.G * 0.42;
    g.fillRect(dx - ds, base - ds * 0.9, ds * 2, ds * 0.9 + 1);
    g.beginPath();
    g.arc(dx, base - ds * 0.9, ds, Math.PI, 0);
    g.fill();
    g.strokeStyle = '#1f2a5c';
    g.lineWidth = Math.max(2, ds * 0.18);
    g.beginPath();
    g.moveTo(dx + ds * 0.15, base - ds * 1.85);
    g.lineTo(dx + ds * 0.15, base - ds * 1.1);
    g.stroke();
    // spruces, kept away from the house and the dome
    for (let x = -10; x < L.W + 20; x += 8 + r() * 16) {
      if (Math.abs(x - hx) < hs * 1.4 || Math.abs(x - dx) < ds * 1.3) continue;
      const h = L.G * (0.45 + r() * 0.55);
      const w = h * (0.32 + r() * 0.1);
      g.fillStyle = ink;
      g.beginPath();
      g.moveTo(x, base - h);
      for (let k = 1; k <= 4; k++) {
        g.lineTo(x + (w * k) / 4, base - h + (h * k) / 4.3);
        g.lineTo(x + (w * k) / 8, base - h + (h * k) / 4.3);
      }
      g.lineTo(x + w * 0.1, base + 2);
      g.lineTo(x - w * 0.1, base + 2);
      for (let k = 4; k >= 1; k--) {
        g.lineTo(x - (w * k) / 8, base - h + (h * k) / 4.3);
        g.lineTo(x - (w * k) / 4, base - h + (h * k) / 4.3);
      }
      g.closePath();
      g.fill();
    }
    return c;
  }

  function makeTwinkles(L) {
    const r = seeded(23);
    return Array.from({ length: 26 }, () => ({
      x: r() * L.W,
      y: r() * (L.box.y1 - 20),
      r: 0.9 + r() * 1.1,
      f: 1.5 + r() * 2.5,
      p: r() * 6.3
    }));
  }

  // ---------------------------------------------------------------------------
  // Shooting stars, planes and satellites
  // ---------------------------------------------------------------------------

  // A shooting star flies away from the radiant, and stays in the sky.
  function spawnMeteor(fireball) {
    const L = state.L;
    const B = L.box;
    for (let tries = 0; tries < 30; tries++) {
      const x = rand(B.x0, B.x1);
      const y = rand(B.y0, B.y1 - L.u * 0.1);
      const dx = x - L.rx;
      const dy = y - L.ry;
      const d = Math.hypot(dx, dy);
      if (d < L.u * 0.08) continue;
      const ux = dx / d;
      const uy = dy / d;
      const room = Math.min(
        ux > 0 ? (B.x1 - x) / ux : ux < 0 ? (B.x0 - x) / ux : Infinity,
        uy > 0 ? (B.y1 - y) / uy : uy < 0 ? (B.y0 - y) / uy : Infinity
      );
      if (room < L.u * (fireball ? 0.35 : 0.15)) continue;
      const len = Math.min(room, L.u * (fireball ? rand(0.5, 0.65) : rand(0.22, 0.36)));
      const m = { x, y, ux, uy, len, dur: fireball ? 2.4 : rand(0.8, 1.4), age: 0, fireball, hit: false };
      state.meteors.push(m);
      return m;
    }
    return null;
  }

  // the head and the end of the tail now
  function track(m) {
    const p = clamp(m.age / m.dur, 0, 1);
    const head = m.len * p;
    const tail = Math.max(0, head - m.len * (m.fireball ? 0.5 : 0.42));
    return {
      hx: m.x + m.ux * head, hy: m.y + m.uy * head,
      tx: m.x + m.ux * tail, ty: m.y + m.uy * tail,
      // bright quickly, then fading out
      b: m.age > m.dur ? 0 : p < 0.15 ? p / 0.15 : p > 0.7 ? (1 - p) / 0.3 : 1
    };
  }

  function spawnCraft(kind) {
    const L = state.L;
    const B = L.box;
    const left = Math.random() < 0.5;
    const y0 = rand(B.y0 + 20, B.y0 + (B.y1 - B.y0) * 0.6);
    state.crafts.push({
      kind,
      x0: left ? -20 : L.W + 20,
      x1: left ? L.W + 20 : -20,
      y0,
      y1: clamp(y0 + rand(-0.15, 0.15) * L.u, B.y0, B.y1),
      dur: kind === 'plane' ? 13 : 15,
      age: 0,
      p: rand(0, 1)
    });
  }

  function craftXY(c) {
    const p = c.age / c.dur;
    return { x: c.x0 + (c.x1 - c.x0) * p, y: c.y0 + (c.y1 - c.y0) * p };
  }

  // ---------------------------------------------------------------------------
  // The loop
  // ---------------------------------------------------------------------------

  function frame(now) {
    // the clock stops while the page is hidden, as rAF does
    const dt = clamp((now - state.last) / 1000, 0, 0.05);
    state.last = now;
    if (!state.over) {
      state.t += dt;
      state.idle += dt;
      plan();
      if (state.t >= ROUND) {
        state.t = ROUND;
        state.over = true;
        hideHint();
        hideCaption();
      }
    } else state.overT += dt;

    state.meteors.forEach((m) => { m.age += dt; });
    state.meteors = state.meteors.filter((m) => m.age < m.dur + 0.6);
    state.crafts.forEach((c) => { c.age += dt; });
    state.crafts = state.crafts.filter((c) => c.age < c.dur);
    state.sparks.forEach((s) => {
      s.age += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
    });
    state.sparks = state.sparks.filter((s) => s.age < s.life);
    state.flying.forEach((f) => { f.age += dt; });
    const landed = state.flying.filter((f) => f.age >= f.dur);
    if (landed.length) {
      state.flying = state.flying.filter((f) => f.age < f.dur);
      state.inJar += landed.length;
      drawJar();
      sfx.clink();
    }
    if (state.caption && state.t >= state.caption.until) hideCaption();

    draw();
    placeHint();
    updateBar();
    if (state.over && !state.flying.length && state.overT > 1) {
      win();
      return;
    }
    state.raf = requestAnimationFrame(frame);
  }

  // what comes next in the night
  function plan() {
    const T = state.t;
    if (T >= state.nextMeteor && T < ROUND - 1.2) {
      const m = spawnMeteor(false);
      if (m && state.idle * 1000 >= HINT_MS && !state.hinted) state.hinted = m;
      if (state.burst > 0) state.burst--;
      else if (Math.random() < 0.15) state.burst = 2;
      state.nextMeteor = T + (state.burst > 0 ? rand(0.25, 0.4) : rand(1.2, 2));
    }
    if (state.fireballAt && T >= state.fireballAt) {
      state.fireballAt = 0;
      spawnMeteor(true);
    }
    if (state.craftPlan.length && T >= state.craftPlan[0][0]) spawnCraft(state.craftPlan.shift()[1]);
    // a fact waits until the caption before it is gone
    if (state.facts.length && T >= state.facts[0][0] && !state.caption) showCaption(state.facts.shift()[1], 6);
  }

  function draw() {
    const L = state.L;
    if (!L) return;
    const T = state.t;
    ctx.clearRect(0, 0, L.W, L.H);
    ctx.drawImage(L.sky, 0, 0, L.W, L.H);
    for (const s of L.twinkles) {
      const a = 0.5 + 0.5 * Math.sin(T * s.f + s.p);
      dot(ctx, s.x, s.y, s.r * (0.7 + 0.5 * a), `rgba(255,255,255,${(0.3 + 0.7 * a).toFixed(2)})`);
    }
    // dawn: the sky gets light and the stars fade
    const dawn = clamp((T - (ROUND - DAWN)) / DAWN, 0, 1) + (state.over ? state.overT * 0.1 : 0);
    if (dawn > 0) {
      const g = ctx.createLinearGradient(0, 0, 0, L.H);
      g.addColorStop(0, `rgba(90, 140, 220, ${(0.85 * dawn).toFixed(3)})`);
      g.addColorStop(0.7, `rgba(240, 170, 160, ${(0.85 * dawn).toFixed(3)})`);
      g.addColorStop(1, `rgba(255, 190, 110, ${Math.min(1, dawn).toFixed(3)})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, L.W, L.H);
    }
    for (const c of state.crafts) drawCraft(c);
    for (const m of state.meteors) drawMeteor(m);
    ctx.drawImage(L.ground, 0, 0, L.W, L.H);
    for (const s of state.sparks) {
      const a = 1 - s.age / s.life;
      dot(ctx, s.x, s.y, s.r * a + 0.3, s.c.replace('A', a.toFixed(2)));
    }
    ctx.fillStyle = '#ffd34d';
    ctx.shadowColor = '#ffd34d';
    ctx.shadowBlur = 12;
    for (const f of state.flying) {
      // along an arc from where it was caught to its place in the jar
      const p = Math.min(1, f.age / f.dur);
      const e = p * p * (3 - 2 * p);
      const to = slotXY(f.slot);
      const mx = (f.x + to.x) / 2;
      const my = Math.min(f.y, to.y) - L.u * 0.15;
      const x = (1 - e) * (1 - e) * f.x + 2 * (1 - e) * e * mx + e * e * to.x;
      const y = (1 - e) * (1 - e) * f.y + 2 * (1 - e) * e * my + e * e * to.y;
      const r = 14 + (to.r - 14) * e;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p * 4);
      ctx.fill(new Path2D(starPath(0, 0, r)));
      ctx.restore();
    }
    ctx.shadowBlur = 0;
  }

  function drawMeteor(m) {
    const k = track(m);
    const w = m.fireball ? 5 : 2.6;
    if (k.b > 0) {
      const g = ctx.createLinearGradient(k.tx, k.ty, k.hx, k.hy);
      g.addColorStop(0, 'rgba(160, 200, 255, 0)');
      g.addColorStop(1, m.fireball ? `rgba(200, 255, 210, ${k.b.toFixed(2)})` : `rgba(235, 245, 255, ${k.b.toFixed(2)})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = w;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(k.tx, k.ty);
      ctx.lineTo(k.hx, k.hy);
      ctx.stroke();
      const r = m.fireball ? 16 : 7;
      const h = ctx.createRadialGradient(k.hx, k.hy, 0, k.hx, k.hy, r);
      h.addColorStop(0, `rgba(255, 255, 255, ${k.b.toFixed(2)})`);
      h.addColorStop(0.35, m.fireball ? `rgba(140, 255, 170, ${(0.8 * k.b).toFixed(2)})` : `rgba(200, 225, 255, ${(0.6 * k.b).toFixed(2)})`);
      h.addColorStop(1, 'rgba(200, 225, 255, 0)');
      ctx.fillStyle = h;
      ctx.beginPath();
      ctx.arc(k.hx, k.hy, r, 0, Math.PI * 2);
      ctx.fill();
    } else if (!m.hit) {
      // a faint glow stays a moment where it flew
      const a = Math.max(0, 0.35 * (1 - (m.age - m.dur) / 0.6));
      ctx.strokeStyle = `rgba(180, 210, 255, ${a.toFixed(2)})`;
      ctx.lineWidth = w * 0.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(k.tx, k.ty);
      ctx.lineTo(k.hx, k.hy);
      ctx.stroke();
    }
  }

  function drawCraft(c) {
    const { x, y } = craftXY(c);
    // fades in and out near the edges of the sky
    const a = clamp(c.age / 1.5, 0, 1) * clamp((c.dur - c.age) / 1.5, 0, 1);
    if (c.kind === 'satellite') {
      dot(ctx, x, y, 4, `rgba(255, 255, 255, ${(0.15 * a).toFixed(2)})`);
      dot(ctx, x, y, 1.7, `rgba(255, 255, 255, ${(0.95 * a).toFixed(2)})`);
      return;
    }
    // a plane: red and green lights blinking in turn, and a white flash
    const ph = (c.age * 1.1 + c.p) % 1;
    const dir = c.x1 > c.x0 ? 1 : -1;
    if (ph < 0.5) {
      dot(ctx, x - 7 * dir, y, 6, `rgba(255, 60, 60, ${(0.25 * a).toFixed(2)})`);
      dot(ctx, x - 7 * dir, y, 2.4, `rgba(255, 80, 80, ${a.toFixed(2)})`);
    } else {
      dot(ctx, x + 7 * dir, y, 6, `rgba(60, 255, 120, ${(0.25 * a).toFixed(2)})`);
      dot(ctx, x + 7 * dir, y, 2.4, `rgba(90, 255, 140, ${a.toFixed(2)})`);
    }
    if (ph > 0.9) dot(ctx, x, y - 2, 3, `rgba(255, 255, 255, ${a.toFixed(2)})`);
  }

  // ---------------------------------------------------------------------------
  // Tapping
  // ---------------------------------------------------------------------------

  function distToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const l2 = dx * dx + dy * dy;
    const s = l2 ? clamp(((px - ax) * dx + (py - ay) * dy) / l2, 0, 1) : 0;
    return Math.hypot(px - ax - s * dx, py - ay - s * dy);
  }

  function tap(x, y) {
    if (state.over || !state.L) return;
    const R = state.L.hitR;
    let best = null;
    let bestD = R;
    for (const m of state.meteors) {
      if (m.hit || m.age > m.dur + GRACE) continue;
      const k = track(m);
      const d = distToSegment(x, y, k.tx, k.ty, k.hx, k.hy);
      if (d < bestD) {
        best = m;
        bestD = d;
      }
    }
    if (best) {
      catchMeteor(best);
      return;
    }
    for (const c of state.crafts) {
      const p = craftXY(c);
      if (Math.hypot(x - p.x, y - p.y) < R) {
        sfx.pick();
        showCaption(state.seen[c.kind] ? c.kind + 'Again' : c.kind, state.seen[c.kind] ? 2 : 4.5);
        state.seen[c.kind] = true;
        return;
      }
    }
  }

  function catchMeteor(m) {
    const k = track(m);
    m.hit = true;
    m.age = Math.max(m.age, m.dur); // it goes out, and a star flies to the jar instead
    const n = m.fireball ? 2 : 1;
    for (let i = 0; i < n; i++) {
      state.flying.push({ x: k.hx, y: k.hy, age: -0.12 * i, dur: 0.75, slot: state.caught });
      state.caught++;
    }
    // each catch plays the next note, up the scale and back down
    const i = (state.caught - 1) % 24;
    sfx.note(i <= 12 ? i : 24 - i);
    if (m.fireball) {
      sfx.snap();
      showCaption('fireball', 3);
    }
    for (let j = 0; j < (m.fireball ? 22 : 12); j++) {
      const a = rand(0, Math.PI * 2);
      const v = rand(40, 160);
      state.sparks.push({
        x: k.hx, y: k.hy, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        r: rand(1.5, 3.5), age: 0, life: rand(0.4, 0.7),
        c: Math.random() < 0.5 ? 'rgba(255,211,77,A)' : 'rgba(255,255,255,A)'
      });
    }
    state.idle = 0;
    if (state.hinted === m) hideHint();
    updateBar();
  }

  // ---------------------------------------------------------------------------
  // Hand, caption and bar
  // ---------------------------------------------------------------------------

  // the hand follows the head of the shooting star it points at
  function placeHint() {
    const m = state.hinted;
    if (!m) return;
    if (m.hit || m.age > m.dur || state.over) {
      hideHint();
      return;
    }
    const k = track(m);
    const el = $('tap');
    el.classList.remove('hidden');
    el.style.transform = `translate(${k.hx - el.offsetWidth / 2}px, ${k.hy + 4}px)`;
  }

  function hideHint() {
    state.hinted = null;
    $('tap').classList.add('hidden');
  }

  function showCaption(key, secs) {
    state.caption = { key, until: state.t + secs };
    $('caption').classList.remove('hidden');
    // restart the pop
    $('caption').style.animation = 'none';
    void $('caption').offsetWidth;
    $('caption').style.animation = '';
    fillCaption();
  }

  function fillCaption() {
    if (!state.caption) return;
    const [b, s] = t('captions')[state.caption.key];
    $('capTitle').textContent = b;
    $('capText').textContent = s;
    $('capText').classList.toggle('hidden', !s);
  }

  function hideCaption() {
    state.caption = null;
    $('caption').classList.add('hidden');
  }

  function updateBar() {
    $('progressFill').style.width = (100 * state.t) / ROUND + '%';
    const text = `⭐ ${state.caught}`;
    if ($('progressText').textContent !== text) $('progressText').textContent = text;
  }

  function drawJar() {
    $('jar').innerHTML = jarSVG(Math.min(state.inJar, JAR_MAX));
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // The end of the night
  // ---------------------------------------------------------------------------

  function win() {
    stopAll();
    const n = state.caught;
    const old = state.best;
    state.record = n > old;
    if (state.record) {
      state.best = n;
      store.set('best', n);
    }
    sfx.win();
    if (state.record) {
      // a little extra fanfare for a new record
      const gen = state.gen;
      [7, 9, 10, 12].forEach((k, i) => setTimeout(() => { if (gen === state.gen) sfx.note(k); }, 1000 + i * 120));
    }
    $('winJar').innerHTML = jarSVG(Math.min(n, JAR_MAX));
    state.oldBest = old;
    updateWin();
    $('win').classList.remove('hidden');
    Astro.startConfetti($('confetti'));
  }

  function updateWin() {
    $('winCount').textContent = t('count')(state.caught);
    $('winBest').textContent = state.record ? t('newBest') : state.best ? t('oldBest')(state.best) : '';
  }

  // ---------------------------------------------------------------------------
  // Buttons & resizing
  // ---------------------------------------------------------------------------

  new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden')) layout();
  }).observe(area);

  area.addEventListener('pointerdown', (e) => {
    const r = area.getBoundingClientRect();
    tap(e.clientX - r.left, e.clientY - r.top);
  });
  $('playBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', startGame);
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  updateToggles();
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    fillCaption();
    // the names of the constellations are drawn on the sky
    if (state.L && !$('game').classList.contains('hidden')) state.L.sky = drawSky(state.L);
    if (!$('win').classList.contains('hidden')) updateWin();
  });
})();
