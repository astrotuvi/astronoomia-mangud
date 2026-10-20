'use strict';

(() => {
  const { $, rand, clamp, shuffle, sfx } = Astro;
  const SVGNS = 'http://www.w3.org/2000/svg';

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // Where to fly. The farther away, the more fuel tanks the rocket needs.
  // Photos by Tõrva Astronoomiaklubi (AstroBin, CC BY-NC-SA); Mars is drawn.
  const DESTS = [
    {
      id: 'moon',
      tanks: 1,
      file: '../pusle/images/moon.jpg',
      url: 'https://www.astrobin.com/oy5di6/',
      name: { et: 'Kuu', en: 'The Moon' },
      to: { et: 'Kuule', en: 'the Moon' },
      fact: {
        et: 'Kuu on meie kõige lähem naaber kosmoses. Päris astronaudid käisid Kuul juba üle 50 aasta tagasi.',
        en: 'The Moon is our closest neighbour in space. Real astronauts walked on the Moon more than 50 years ago.'
      }
    },
    {
      id: 'mars',
      tanks: 2,
      file: null, // drawn by drawMars()
      name: { et: 'Marss', en: 'Mars' },
      to: { et: 'Marsile', en: 'Mars' },
      fact: {
        et: 'Marss on punane planeet, sest seal on punane liiv. Marsil sõidavad ringi robotautod, mida kutsutakse kulguriteks.',
        en: 'Mars is the red planet, because it is covered in red sand. Robot cars called rovers drive around on Mars.'
      }
    },
    {
      id: 'jupiter',
      tanks: 3,
      file: '../pusle/images/jupiter.jpg',
      url: 'https://www.astrobin.com/gnc57p/',
      name: { et: 'Jupiter', en: 'Jupiter' },
      to: { et: 'Jupiterile', en: 'Jupiter' },
      fact: {
        et: 'Jupiter on kõige suurem planeet. Selle sisse mahuks üle tuhande Maa!',
        en: 'Jupiter is the biggest planet. More than a thousand Earths would fit inside it!'
      }
    },
    {
      id: 'saturn',
      tanks: 4,
      file: '../pusle/images/saturn.jpg',
      url: 'https://www.astrobin.com/fu9tbu/',
      name: { et: 'Saturn', en: 'Saturn' },
      to: { et: 'Saturnile', en: 'Saturn' },
      fact: {
        et: 'Saturnil on ilusad rõngad. Need on tehtud lugematutest jäätükkidest ja kivikestest.',
        en: 'Saturn has beautiful rings. They are made of countless pieces of ice and rock.'
      }
    }
  ];

  const WHOS = ['🐱', '🐶', '🐻', '🐰', '🧑‍🚀'];

  // Tapping a part of the rocket gives it the next colour.
  const COLORS = ['#ff5a5f', '#ff9f1c', '#ffd34d', '#3ccf7e', '#4fa3ff', '#a66bff', '#ff7eb6', '#f4f6ff', '#9aa3b5'];
  const DEFAULT_COLOR = { nose: 0, body: 7, tank: 4, engine: 8, fin: 0 };

  const TEXT = {
    et: {
      title: 'Kosmoserakett',
      intro: 'Ehita rakett ja lenda kosmosesse! Mida kaugemale lendad, seda rohkem kütusepaake on vaja. Puuduta raketi osa, et selle värvi muuta.',
      chooseDest: 'Kuhu lendame?',
      chooseWho: 'Kes lendab?',
      play: 'Ehita',
      launch: 'Start!',
      liftoff: 'Start!',
      wellDone: 'Tubli!',
      again: 'Uuesti',
      other: 'Uus sõit',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      sound: 'Heli',
      reset: 'Eemalda kõik 🌟',
      resetAsk: 'Kas eemaldada 🌟 kõigilt külastatud kohtadelt?',
      credit: 'Fotod: Tõrva Astronoomiaklubi (AstroBin), litsents CC BY-NC-SA.',
      photo: 'Foto: Tõrva Astronoomiaklubi (AstroBin)',
      orbiting: 'Tiirleme ümber Maa 🌍',
      off: (to) => `Lendame ${to}!`,
      arrived: (who, to) => `${who} jõudis ${to}!`
    },
    en: {
      title: 'Space Rocket',
      intro: 'Build a rocket and fly into space! The farther you fly, the more fuel tanks you need. Tap a part of the rocket to change its colour.',
      chooseDest: 'Where shall we fly?',
      chooseWho: 'Who is flying?',
      play: 'Build',
      launch: 'Launch!',
      liftoff: 'Liftoff!',
      wellDone: 'Well done!',
      again: 'Again',
      other: 'New trip',
      menu: 'Menu',
      allGames: 'All games',
      sound: 'Sound',
      reset: 'Clear all 🌟',
      resetAsk: 'Remove the 🌟 from all the places you have visited?',
      credit: 'Photos: Tõrva Astronoomiaklubi (AstroBin), licence CC BY-NC-SA.',
      photo: 'Photo: Tõrva Astronoomiaklubi (AstroBin)',
      orbiting: 'Going round the Earth 🌍',
      off: (to) => `Off to ${to}!`,
      arrived: (who, to) => `${who} made it to ${to}!`
    }
  };

  const HINT_MS = 5000;   // idle time before the next empty spot starts to glow
  // the flight, in seconds
  const ASCENT = 3.8;     // from liftoff up into space
  const ZOOM = 1.6;       // the view zooms out until the whole Earth is seen
  const ORBIT = 3.4;      // one lap around the Earth
  const BURN = 2.0;       // burning one fuel tank on the way to the goal
  const CRUISE = 2.6;     // from the last burn to landing

  // ---------------------------------------------------------------------------
  // Rocket parts
  // ---------------------------------------------------------------------------

  // Each part is drawn from its top centre, in units where the body is 100
  // wide. x0 is its left edge. Fins are drawn for the right side.
  const SHAPES = {
    nose: { x0: -50, w: 100, h: 120 },
    body: { x0: -50, w: 100, h: 150 },
    tank: { x0: -50, w: 100, h: 80 },
    engine: { x0: -40, w: 80, h: 60 },
    fin: { x0: 0, w: 45, h: 105 }
  };

  function darker(hex, f = 0.72) {
    const v = parseInt(hex.slice(1), 16);
    const c = [v >> 16, (v >> 8) & 255, v & 255].map((x) => Math.round(x * f));
    return `rgb(${c.join(',')})`;
  }

  // SVG for one part. who is the astronaut in the window, fuel how full a tank is.
  function partSVG(kind, ci, who, fuel = 1) {
    const c = COLORS[ci];
    const d = darker(c);
    const o = 'stroke="#1a1440" stroke-width="4.5" stroke-linejoin="round"';
    switch (kind) {
      case 'nose': {
        const p = 'M-50 120C-50 60-25 20 0 0C25 20 50 60 50 120Z';
        return `<path d="${p}" fill="${c}" ${o}/><path class="shine" d="${p}" fill="url(#shine)"/>` +
          `<rect x="-50" y="104" width="100" height="16" fill="${d}" ${o}/>`;
      }
      case 'body': {
        const rivets = [-36, -18, 0, 18, 36]
          .map((x) => `<circle cx="${x}" cy="10" r="2.6" fill="${d}"/><circle cx="${x}" cy="140" r="2.6" fill="${d}"/>`)
          .join('');
        return `<rect x="-50" y="0" width="100" height="150" fill="${c}" ${o}/>` +
          '<rect class="shine" x="-50" y="0" width="100" height="150" fill="url(#shine)"/>' + rivets +
          `<circle cx="0" cy="70" r="33" fill="#d6deea" ${o}/>` +
          '<circle cx="0" cy="70" r="24" fill="#7fd3ff" stroke="#1a1440" stroke-width="3"/>' +
          `<text class="who" x="0" y="72" font-size="34" text-anchor="middle" dominant-baseline="central">${who}</text>` +
          '<ellipse class="shine" cx="-10" cy="58" rx="8" ry="4.5" fill="#fff" opacity="0.6"/>';
      }
      case 'tank':
        return `<rect x="-50" y="0" width="100" height="80" fill="${c}" ${o}/>` +
          '<rect class="shine" x="-50" y="0" width="100" height="80" fill="url(#shine)"/>' +
          `<rect x="-50" y="0" width="100" height="12" fill="${d}" ${o}/>` +
          `<rect x="-50" y="68" width="100" height="12" fill="${d}" ${o}/>` +
          '<rect x="-30" y="26" width="60" height="28" rx="9" fill="#2a2350" stroke="#1a1440" stroke-width="3"/>' +
          `<rect class="fuel" x="-26" y="30" width="${52 * fuel}" height="20" rx="6" fill="#ffb21c"/>`;
      case 'engine':
        return `<path d="M-22 18L22 18L38 60L-38 60Z" fill="url(#metal)" ${o}/>` +
          `<rect x="-40" y="0" width="80" height="20" rx="4" fill="${c}" ${o}/>`;
      case 'fin':
        return `<path d="M0 0L45 50L45 105L0 65Z" fill="${c}" ${o}/>` +
          `<path d="M4 44L41 82" stroke="${d}" stroke-width="7" stroke-linecap="round"/>`;
    }
    return '';
  }

  // Spots for the parts, from the bottom up, in the order they are hinted.
  // ax, ay: where the part's top centre goes; the ground is at y = 0.
  function rocketSlots(n) {
    const slots = [{ kind: 'engine', ax: 0, ay: -60 }];
    for (let i = 0; i < n; i++) slots.push({ kind: 'tank', ax: 0, ay: -60 - 80 * (i + 1), tank: i });
    const top = -60 - 80 * n;
    slots.push({ kind: 'body', ax: 0, ay: top - 150 });
    slots.push({ kind: 'nose', ax: 0, ay: top - 270 });
    slots.push({ kind: 'fin', ax: 50, ay: -125, flip: 1 });
    slots.push({ kind: 'fin', ax: -50, ay: -125, flip: -1 });
    return slots.map((s) => ({ flip: 1, part: null, ...s }));
  }
  const rocketHeight = (n) => 330 + 80 * n;

  // The finished rocket as a picture (win screen).
  function rocketPicture(svg) {
    const n = state.dest.tanks;
    const h = rocketHeight(n);
    const order = [...state.slots].sort((a, b) => (a.kind === 'fin' ? -1 : 0) - (b.kind === 'fin' ? -1 : 0));
    svg.setAttribute('viewBox', `-110 ${-h - 10} 220 ${h + 20}`);
    svg.innerHTML = order
      .map((s) => `<g transform="translate(${s.ax} ${s.ay}) scale(${s.flip} 1)">${partSVG(s.kind, s.part.color, state.who)}</g>`)
      .join('');
  }

  // Mars has no photo, so it is drawn: a red ball with dark patches and a polar cap.
  function drawMars(size) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const g = cv.getContext('2d');
    g.fillStyle = '#000';
    g.fillRect(0, 0, size, size);
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 60; i++) {
      g.fillStyle = `rgba(255,255,255,${0.2 + rnd() * 0.5})`;
      g.beginPath();
      g.arc(rnd() * size, rnd() * size, rnd() * size * 0.002 + 0.5, 0, Math.PI * 2);
      g.fill();
    }
    const c = size / 2;
    const r = size * 0.4;
    const ball = g.createRadialGradient(c - r * 0.3, c - r * 0.3, r * 0.1, c, c, r);
    ball.addColorStop(0, '#f6a066');
    ball.addColorStop(0.6, '#d0602f');
    ball.addColorStop(1, '#6e2410');
    g.save();
    g.beginPath();
    g.arc(c, c, r, 0, Math.PI * 2);
    g.fillStyle = ball;
    g.fill();
    g.clip();
    // dark lands
    g.fillStyle = 'rgba(80, 25, 10, 0.35)';
    [[0, -0.05, 0.55, 0.12, -0.3], [-0.25, 0.42, 0.22, 0.08, 0.2], [0.55, 0.3, 0.12, 0.1, 0], [-0.6, -0.1, 0.1, 0.16, 0.3]]
      .forEach(([x, y, rx, ry, a]) => {
        g.beginPath();
        g.ellipse(c + x * r, c + y * r, rx * r, ry * r, a, 0, Math.PI * 2);
        g.fill();
      });
    // polar cap
    g.fillStyle = 'rgba(255, 255, 255, 0.85)';
    g.beginPath();
    g.ellipse(c, c - r * 0.97, r * 0.3, r * 0.12, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
    return cv.toDataURL('image/png');
  }
  DESTS.find((d) => d.id === 'mars').file = drawMars(600);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('rakett.');
  const state = {
    dest: DESTS.find((d) => d.id === store.get('dest', 'moon')) || DESTS[0],
    who: WHOS.includes(store.get('who', '')) ? store.get('who', '') : WHOS[0],
    visited: store.get('visited', []),
    phase: 'menu',   // menu, build, ready, count, fly, done
    slots: [],
    parts: [],
    drag: null,
    hintTimer: 0,
    L: null,         // layout, see layout()
    fl: null,        // flight
    gen: 0           // bumped when a game starts or ends, to stop old timers
  };
  if (!Array.isArray(state.visited)) state.visited = [];

  const area = $('area');
  const scene = $('scene');
  const t = (key) => TEXT[Astro.lang][key];

  // The Earth seen from space, drawn with a radius of 100.
  const EARTH = '<circle r="116" fill="url(#earthGlow)"/><circle r="100" fill="url(#earthGrad)"/>' +
    '<g clip-path="url(#earthClip)"><g fill="#4cb963">' +
    '<path d="M-12-62C8-74 38-58 34-36C52-24 48 4 30 20C26 44 12 66-2 64C-12 46-16 28-28 14C-42 4-38-20-24-28C-28-44-24-56-12-62Z"/>' +
    '<path d="M-82-30C-66-34-56-18-58-2C-56 20-66 40-76 52C-88 36-96 6-94-10C-92-22-88-28-82-30Z"/>' +
    '<path d="M52-70C72-74 92-52 86-30C80-36 66-38 56-50C50-56 48-64 52-70Z"/>' +
    '<path d="M48 40C62 34 78 42 74 56C66 64 52 62 46 52Z"/></g>' +
    '<g fill="#fff"><ellipse cy="100" rx="50" ry="14"/>' +
    '<g opacity="0.7"><ellipse cx="-40" cy="-40" rx="26" ry="6" transform="rotate(-12 -40 -40)"/>' +
    '<ellipse cx="10" cy="34" rx="34" ry="6" transform="rotate(8 10 34)"/><ellipse cx="60" cy="-6" rx="20" ry="5"/>' +
    '<ellipse cx="-60" cy="62" rx="22" ry="5"/></g></g>' +
    '<circle r="100" fill="url(#earthShade)"/></g>';

  scene.innerHTML =
    '<rect width="100%" height="100%" fill="url(#skyGrad)"/>' +
    `<g id="starsL"></g><g id="earthL" style="display: none">${EARTH}</g>` +
    '<image id="destImg" mask="url(#soft)" style="mix-blend-mode: screen"/>' +
    '<g fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 10" stroke-linecap="round">' +
    '<circle id="orbitRing" opacity="0"/><path id="tripPath" opacity="0"/></g>' +
    '<g id="worldL"></g><g id="slotsL"></g><g id="trayL"></g><g id="flameL"></g><g id="partsL"></g>';
  const L$ = (id) => scene.querySelector('#' + id);
  const [starsL, earthL, destImg, orbitRing, tripPath, worldL, slotsL, trayL, flameL, partsL] =
    ['starsL', 'earthL', 'destImg', 'orbitRing', 'tripPath', 'worldL', 'slotsL', 'trayL', 'flameL', 'partsL'].map(L$);

  function svgEl(tag, attrs = {}, parent) {
    const el = document.createElementNS(SVGNS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    DESTS.forEach((d) => {
      const b = document.createElement('button');
      b.className = 'pic dest';
      b.innerHTML = `<img src="${d.file}" alt=""><span class="name"></span>` +
        `<span class="fuel-row">${'<i></i>'.repeat(d.tanks)}</span><b class="done-badge hidden">🌟</b>`;
      b.addEventListener('click', () => {
        state.dest = d;
        store.set('dest', d.id);
        sfx.pick();
        updateMenu();
      });
      $('dests').appendChild(b);
    });
    WHOS.forEach((w) => {
      const b = document.createElement('button');
      b.className = 'count who-btn';
      b.innerHTML = `<b>${w}</b>`;
      b.addEventListener('click', () => {
        state.who = w;
        store.set('who', w);
        sfx.pick();
        updateMenu();
      });
      $('whos').appendChild(b);
    });
  }

  function updateMenu() {
    [...$('dests').children].forEach((b, i) => {
      const d = DESTS[i];
      b.classList.toggle('selected', d === state.dest);
      b.querySelector('.name').textContent = d.name[Astro.lang];
      b.querySelector('.done-badge').classList.toggle('hidden', !state.visited.includes(d.id));
    });
    [...$('whos').children].forEach((b, i) => b.classList.toggle('selected', WHOS[i] === state.who));
    $('resetBtn').classList.toggle('hidden', !state.visited.length);
  }

  function stopAll() {
    state.gen++;
    clearTimeout(state.hintTimer);
    if (state.fl) cancelAnimationFrame(state.fl.raf);
    state.fl = null;
    state.drag = null;
    Astro.stopConfetti($('confetti'));
  }

  function showMenu() {
    stopAll();
    state.phase = 'menu';
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // Building
  // ---------------------------------------------------------------------------

  function startGame() {
    stopAll();
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    $('launchBtn').classList.add('hidden');
    $('countdown').classList.add('hidden');
    updateToggles();
    state.phase = 'build';

    const n = state.dest.tanks;
    state.slots = rocketSlots(n);
    partsL.innerHTML = '';
    flameL.innerHTML = '';
    starsL.innerHTML = '';
    destImg.setAttribute('href', state.dest.file);
    destImg.setAttribute('opacity', 0);
    earthL.style.display = 'none';
    orbitRing.setAttribute('opacity', 0);
    tripPath.setAttribute('opacity', 0);
    worldL.style.transform = '';
    worldL.style.display = '';
    $('caption').classList.remove('show');
    setSky(0);
    slotsL.style.display = '';
    trayL.style.display = '';

    // ghost outlines where the parts go
    slotsL.innerHTML = '';
    for (const s of state.slots) {
      const sh = SHAPES[s.kind];
      s.el = svgEl('g', { class: 'slot', 'data-kind': s.kind }, slotsL);
      s.el.innerHTML = `<g class="ghost" transform="translate(${-(sh.x0 + sh.w / 2)} ${-sh.h / 2})">${partSVG(s.kind, 7, '')}</g>`;
    }

    // loose parts in the tray, in a random order
    // one part for each spot; a fin is made for its own side (left or right)
    state.parts = shuffle(state.slots.map((s) => makePart(s.kind, s.flip)));
    state.parts.forEach((p, i) => { p.cell = i; });
    layout();
    updateProgress();
    poke();
  }

  function makePart(kind, side) {
    const el = svgEl('g', { class: 'part' }, partsL);
    const mid = svgEl('g', { class: 'mid' }, el);
    const sh = SHAPES[kind];
    const inner = svgEl('g', { transform: `translate(${-(sh.x0 + sh.w / 2)} ${-sh.h / 2})` }, mid);
    const p = { kind, color: DEFAULT_COLOR[kind], el, mid, inner, slot: null, cell: 0, x: 0, y: 0, s: 1, side, flip: side };
    el._part = p;
    drawPart(p);
    return p;
  }

  function drawPart(p, fuel = 1) {
    p.inner.innerHTML = partSVG(p.kind, p.color, state.who, fuel);
  }

  function setTransform(el, x, y, s, flip = 1, rot = 0) {
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${s * flip}, ${s})`;
  }
  const place = (p) => setTransform(p.el, p.x, p.y, p.s, p.flip);

  // Sizes and positions for the current screen. During building the parts
  // tray is beside the rocket (wide screens) or below it (tall screens).
  function layout() {
    const W = area.clientWidth;
    const H = area.clientHeight;
    if (!W || !H) return;
    const n = state.dest.tanks;
    const withTray = state.phase === 'build';
    const groundH = Math.max(80, H * 0.15);
    let zone;
    let tray = null;
    if (withTray && W > H * 1.05) {
      zone = { x: 0, w: W * 0.55, gy: H - groundH };
      tray = { x: W * 0.55, y: 12, w: W * 0.45 - 12, h: H - 24 };
    } else if (withTray) {
      const th = H * 0.36;
      zone = { x: 0, w: W, gy: H - th - 6 };
      tray = { x: 12, y: H - th, w: W - 24, h: th - 12 };
    } else {
      zone = { x: 0, w: W, gy: H - groundH };
    }
    const k = Math.min((zone.gy - 16) / (rocketHeight(n) + 40), zone.w / 300);
    state.L = { W, H, k, gx: zone.x + zone.w / 2, gy: zone.gy, tray, cells: [] };

    // tray cells: as big as possible for the number of parts
    trayL.innerHTML = '';
    if (tray) {
      svgEl('rect', { x: tray.x, y: tray.y, width: tray.w, height: tray.h, rx: 24, class: 'tray' }, trayL);
      const m = state.parts.length;
      let best = null;
      for (let cols = 1; cols <= m; cols++) {
        const rows = Math.ceil(m / cols);
        const cw = tray.w / cols;
        const ch = tray.h / rows;
        const score = Math.min(cw, ch / 1.3);
        if (!best || score > best.score) best = { score, cols, rows, cw, ch };
      }
      for (let i = 0; i < m; i++) {
        const c = i % best.cols;
        const r = Math.floor(i / best.cols);
        state.L.cells.push({ x: tray.x + (c + 0.5) * best.cw, y: tray.y + (r + 0.5) * best.ch, w: best.cw, h: best.ch });
      }
    }

    drawWorld();
    for (const s of state.slots) {
      const q = slotPos(s);
      setTransform(s.el, q.x, q.y, k, s.flip);
    }
    if (state.phase === 'build' || state.phase === 'ready' || state.phase === 'count') {
      for (const p of state.parts) {
        if (p === state.drag?.p) continue;
        if (p.slot) Object.assign(p, slotPos(p.slot), { s: k });
        else trayPos(p);
        place(p);
      }
    }
  }

  function slotPos(s) {
    const { k, gx, gy } = state.L;
    const sh = SHAPES[s.kind];
    return { x: gx + k * (s.ax + s.flip * (sh.x0 + sh.w / 2)), y: gy + k * (s.ay + sh.h / 2) };
  }

  function trayPos(p) {
    const c = state.L.cells[p.cell];
    if (!c) return;
    const sh = SHAPES[p.kind];
    p.x = c.x;
    p.y = c.y;
    p.s = Math.min(state.L.k, (0.78 * c.w) / sh.w, (0.78 * c.h) / sh.h);
    p.flip = p.side;
  }

  // Ground, launch pad and tower; during a flight also clouds and smoke.
  function drawWorld() {
    const { W, H, k, gx, gy } = state.L;
    const towerH = rocketHeight(state.dest.tanks) * 0.8 * k;
    let s = `<rect x="${-W}" y="${gy + 14 * k}" width="${3 * W}" height="${H * 2}" fill="#5cc46a"/>` +
      `<rect x="${-W}" y="${gy + 14 * k}" width="${3 * W}" height="${8 * k}" fill="#3f9e4f"/>` +
      `<rect x="${gx - 150 * k}" y="${gy}" width="${300 * k}" height="${24 * k}" rx="${5 * k}" fill="#8a90a6" stroke="#1a1440" stroke-width="${3 * k}"/>`;
    // a lattice tower beside the rocket
    const tx = gx + 112 * k;
    const tw = 18 * k;
    s += `<g stroke="#e0533a" stroke-width="${3 * k}" fill="none"><rect x="${tx}" y="${gy - towerH}" width="${tw}" height="${towerH}"/>`;
    for (let y = gy; y > gy - towerH + 1; y -= tw) s += `<path d="M${tx} ${y}L${tx + tw} ${y - tw}M${tx} ${y - tw}L${tx + tw} ${y}"/>`;
    s += '</g>';
    if (state.fl) {
      for (const c of state.fl.clouds) {
        const x = c.x * W;
        const y = gy - c.y * H;
        const r = c.r * Math.min(W, H);
        s += `<g fill="#fff" opacity="0.92"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}"/>` +
          `<circle cx="${x - r * 0.35}" cy="${y - r * 0.2}" r="${r * 0.38}"/><circle cx="${x + r * 0.2}" cy="${y - r * 0.3}" r="${r * 0.45}"/></g>`;
      }
      s += '<g id="smokeL" fill="#eef1f8"></g>';
    }
    worldL.innerHTML = s;
  }

  // ---------------------------------------------------------------------------
  // Dragging
  // ---------------------------------------------------------------------------

  function pointerPos(e) {
    const r = scene.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  scene.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.part');
    if (!el || state.drag) return;
    const p = el._part;
    if (p.slot) {
      if (state.phase === 'build' || state.phase === 'ready') recolor(p);
      return;
    }
    if (state.phase !== 'build') return;
    e.preventDefault();
    const q = pointerPos(e);
    const dx = (q.x - p.x) / p.s;
    const dy = (q.y - p.y) / p.s;
    state.drag = { p, id: e.pointerId, dx, dy, x0: q.x, y0: q.y, moved: false };
    scene.setPointerCapture(e.pointerId);
    partsL.appendChild(p.el);
    p.el.classList.add('dragging', 'snap');
    p.el.classList.remove('wiggle');
    p.s = state.L.k;
    p.x = q.x - dx * p.s;
    p.y = q.y - dy * p.s;
    place(p);
    sfx.pick();
    poke();
  });

  scene.addEventListener('pointermove', (e) => {
    const d = state.drag;
    if (!d || e.pointerId !== d.id) return;
    const q = pointerPos(e);
    if (!d.moved && Math.hypot(q.x - d.x0, q.y - d.y0) > 8) {
      d.moved = true;
      d.p.el.classList.remove('snap');
    }
    d.p.x = q.x - d.dx * d.p.s;
    d.p.y = q.y - d.dy * d.p.s;
    place(d.p);
  });

  function endDrag(e) {
    const d = state.drag;
    if (!d || e.pointerId !== d.id) return;
    state.drag = null;
    const p = d.p;
    p.el.classList.remove('dragging');
    p.el.classList.add('snap');
    poke();

    // the nearest free spot for this kind of part
    let best = null;
    let bestDist = Infinity;
    for (const s of state.slots) {
      if (s.part || s.kind !== p.kind || s.flip !== p.side) continue;
      const q = slotPos(s);
      const dist = Math.hypot(q.x - p.x, q.y - p.y);
      if (dist < bestDist) {
        best = s;
        bestDist = dist;
      }
    }
    if (d.moved && best && bestDist < 220 * state.L.k) {
      putInSlot(p, best);
      return;
    }
    // back to the tray; a tap shows where the part goes
    trayPos(p);
    place(p);
    if (!d.moved && best) flashSlot(best);
    else sfx.oops();
  }
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);

  function putInSlot(p, s) {
    p.slot = s;
    s.part = p;
    p.flip = s.flip;
    p.s = state.L.k;
    Object.assign(p, slotPos(s));
    place(p);
    s.el.classList.remove('hint');
    restart(p.el, 'pop');
    sfx.snap();
    updateProgress();
    if (state.slots.every((x) => x.part)) ready();
  }

  // Run a CSS animation again from the start.
  function restart(el, cls) {
    el.classList.remove(cls);
    void el.getBoundingClientRect();
    el.classList.add(cls);
  }

  function flashSlot(s) {
    restart(s.el, 'hint');
    setTimeout(() => { if (!s.part) s.el.classList.remove('hint'); }, 1600);
  }

  function recolor(p) {
    p.color = (p.color + 1) % COLORS.length;
    drawPart(p);
    restart(p.el, 'pop');
    sfx.note(p.color);
    poke();
  }

  // Something happened: restart the wait before the next hint.
  function poke() {
    clearTimeout(state.hintTimer);
    if (state.phase !== 'build') return;
    state.hintTimer = setTimeout(() => {
      const s = state.slots.find((x) => !x.part);
      if (!s || state.drag) return poke();
      s.el.classList.add('hint');
      const p = state.parts.find((x) => !x.slot && x.kind === s.kind);
      if (p) restart(p.el, 'wiggle');
      poke();
    }, HINT_MS);
  }

  function updateProgress(frac) {
    const total = state.slots.length;
    const done = state.slots.filter((s) => s.part).length;
    if (frac === undefined) {
      $('progressFill').style.width = (100 * done) / total + '%';
      $('progressText').textContent = `🔧 ${done} / ${total}`;
    } else {
      $('progressFill').style.width = 100 * frac + '%';
      $('progressText').textContent = '🚀';
    }
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Launch
  // ---------------------------------------------------------------------------

  // All parts are on: the tray goes away, the rocket moves to the middle.
  function ready() {
    state.phase = 'ready';
    clearTimeout(state.hintTimer);
    slotsL.style.display = 'none';
    trayL.style.display = 'none';
    state.parts.forEach((p) => p.el.classList.add('move'));
    layout();
    const gen = state.gen;
    setTimeout(() => {
      if (gen !== state.gen || state.phase !== 'ready') return;
      [0, 2, 4].forEach((i, j) => setTimeout(() => sfx.note(i), j * 120));
      $('launchBtn').classList.remove('hidden');
    }, 500);
  }

  function countdown() {
    if (state.phase !== 'ready') return;
    state.phase = 'count';
    $('launchBtn').classList.add('hidden');
    const cd = $('countdown');
    const gen = state.gen;
    ['3', '2', '1', t('liftoff')].forEach((txt, i) => {
      setTimeout(() => {
        if (gen !== state.gen) return;
        cd.textContent = txt;
        cd.classList.remove('hidden');
        cd.classList.toggle('go', i === 3);
        restart(cd, 'tick');
        if (i < 3) sfx.note(4 - i);
        else fly();
      }, i * 900);
    });
    setTimeout(() => { if (gen === state.gen) cd.classList.add('hidden'); }, 3 * 900 + 1100);
  }

  // ---------------------------------------------------------------------------
  // Flight
  // ---------------------------------------------------------------------------

  // The flight, as on a real trip: up into space, the view zooms out to show
  // the whole Earth, one lap around the Earth with the engine off, then the
  // engine fires again and the rocket leaves for its goal.

  const ease = (x) => x * x * (3 - 2 * x);
  const lerp = (a, b, x) => a + (b - a) * x;
  const mod = (a, b) => ((a % b) + b) % b;

  function mix(c1, c2, x) {
    const a = parseInt(c1.slice(1), 16);
    const b = parseInt(c2.slice(1), 16);
    const ch = (v, s) => (v >> s) & 255;
    const m = [16, 8, 0].map((s) => Math.round(lerp(ch(a, s), ch(b, s), x)));
    return `rgb(${m.join(',')})`;
  }

  // 0 = blue day sky, 1 = black space
  function setSky(x) {
    document.getElementById('skyTop').setAttribute('stop-color', mix('#3d9cf0', '#050822', clamp(x * 1.4, 0, 1)));
    document.getElementById('skyBottom').setAttribute('stop-color', mix('#bfe6ff', '#0d1440', x));
  }

  // When each part of the trip starts. Getting into orbit takes the first
  // tank (half of it if there is only one), leaving takes the rest.
  function timeline(n) {
    const A = Math.min(1, n / 2);
    const z0 = ASCENT + 0.2;
    const z1 = z0 + ZOOM;
    const dep = z1 + ORBIT;
    const burn = (n - A) * BURN;
    return { A, z0, z1, dep, burn, end: dep + burn + CRUISE };
  }
  const fuelUsed = (T, n, t) =>
    T.A * clamp((t - 0.3) / (ASCENT - 0.3), 0, 1) + (n - T.A) * clamp((t - T.dep) / T.burn, 0, 1);
  // when tank i is empty and drops off
  const dropTime = (T, i) => (i + 1 <= T.A ? 0.3 + ((ASCENT - 0.3) * (i + 1)) / T.A : T.dep + (i + 1 - T.A) * BURN);
  // the rocket turns towards the right while climbing (degrees)
  const pitchAt = (T, t) => 50 * ease(clamp((t - 2) / (T.z0 - 2), 0, 1));

  // a point on a curve, and the way the curve goes there (degrees, 0 = up)
  function bezier([a, b, c, d], s) {
    const u = 1 - s;
    const w = [u * u * u, 3 * u * u * s, 3 * u * s * s, s * s * s];
    const v = [u * u, 2 * u * s, s * s];
    const tx = v[0] * (b.x - a.x) + v[1] * (c.x - b.x) + v[2] * (d.x - c.x);
    const ty = v[0] * (b.y - a.y) + v[1] * (c.y - b.y) + v[2] * (d.y - c.y);
    return {
      x: w[0] * a.x + w[1] * b.x + w[2] * c.x + w[3] * d.x,
      y: w[0] * a.y + w[1] * b.y + w[2] * c.y + w[3] * d.y,
      rot: (Math.atan2(tx, -ty) * 180) / Math.PI
    };
  }

  // Where the Earth, the goal and the rocket are at a flight time. The rocket
  // is given by its centre, turn (degrees, 0 = nose up) and scale.
  function scenery(time) {
    const { W, H, k, gx, gy } = state.L;
    const T = state.fl.T;
    const m = Math.min(W, H);
    const Hr = rocketHeight(state.dest.tanks);
    const re = m * 0.2;            // the whole Earth
    const ro = m * 0.3;            // the orbit around it
    const so = (m * 0.16) / Hr;    // the rocket's scale in space
    const mid = { x: W / 2, y: H / 2 };

    // climbing: the rocket rises to the middle, the world moves past
    const h = Hr * k;
    const rise = ease(clamp((time - 0.3) / 2.2, 0, 1));
    const bottom = gy - Math.max(0, gy - h / 2 - H * 0.58) * rise;
    const shake = time < 0.7 ? Math.sin(time * 80) * 2.5 * (1 - time / 0.7) : 0;
    // while turning it gets a little smaller if needed, to fit a narrow screen
    const rot = pitchAt(T, time);
    const fit = Math.min(k, (W * 0.85) / (Hr * Math.sin((rot * Math.PI) / 180) + 200));
    const up = { x: gx + shake, y: bottom - h / 2, rot, sc: fit };
    if (time < T.z0) return { rocket: up };

    // zooming out: the Earth comes up from below and shrinks into a ball
    if (time < T.z1) {
      const z = ease((time - T.z0) / ZOOM);
      const r0 = Math.max(W, H) * 1.6;
      const r = r0 * Math.pow(re / r0, z);
      const top = lerp(H, H / 2 - re, z);
      return {
        earth: { x: W / 2, y: top + r, r },
        ring: { ...mid, r: ro, op: 0.5 * clamp((z - 0.6) / 0.4, 0, 1) },
        rocket: {
          x: lerp(up.x, mid.x, z),
          y: lerp(up.y, mid.y - ro, z),
          rot: lerp(up.rot, 90, z),
          sc: up.sc * Math.pow(so / up.sc, z)
        }
      };
    }

    // one lap around the Earth, clockwise from the top
    if (time < T.dep) {
      const phi = -Math.PI / 2 + (2 * Math.PI * (time - T.z1)) / ORBIT;
      return {
        earth: { ...mid, r: re },
        ring: { ...mid, r: ro, op: 0.5 },
        rocket: { x: mid.x + ro * Math.cos(phi), y: mid.y + ro * Math.sin(phi), rot: (phi * 180) / Math.PI + 180, sc: so }
      };
    }

    // off to the goal: the Earth falls behind, the goal comes closer
    const tau = clamp((time - T.dep) / (T.end - T.dep), 0, 1);
    const cam = ease(clamp(tau / 0.7, 0, 1));
    const f = lerp(1, 0.4, cam);
    const E = { x: lerp(mid.x, W * 0.12, cam), y: lerp(mid.y, H * 0.86, cam), r: re * f };
    const g = ease(tau);
    const size = m * 0.05 * Math.pow(0.62 / 0.05, g);
    const D = { x: lerp(W * 0.9, W * 0.6, g), y: lerp(H * 0.14, H * 0.4, g), size };
    const p0 = { x: E.x, y: E.y - ro * f };
    const path = [p0, { x: p0.x + W * 0.2, y: p0.y }, { x: D.x - size * 0.35, y: D.y + size * 0.55 }, D];
    const q = bezier(path, 1 - Math.pow(1 - tau, 1.6));
    return {
      earth: E,
      ring: { x: E.x, y: E.y, r: ro * f, op: 0.5 * (1 - clamp(tau / 0.25, 0, 1)) },
      dest: D,
      path,
      pathOp: 0.4 * clamp(tau / 0.1, 0, 1) * clamp((1 - tau) / 0.25, 0, 1),
      rocket: { x: q.x, y: q.y, rot: q.rot, sc: so * lerp(1, 0.45, ease(clamp((tau - 0.6) / 0.4, 0, 1))) }
    };
  }

  function fly() {
    state.phase = 'fly';
    const n = state.dest.tanks;
    const T = timeline(n);
    state.parts.forEach((p) => {
      p.el.classList.remove('move', 'snap', 'pop');
      p.spin = rand(-1, 1) < 0 ? -1 : 1;
      p.drop = null;
    });
    const fl = {
      T,
      drops: Array.from({ length: n }, (_, i) => dropTime(T, i)),
      t0: performance.now(),
      last: 0,              // flight time of the previous frame
      alt: 0,               // how far the world has moved down and left
      side: 0,
      relit: false,
      cap: '',
      clouds: Array.from({ length: 6 }, (_, i) => ({ x: rand(0.05, 0.95), y: 0.6 + i * 0.28 + rand(0, 0.1), r: rand(0.09, 0.16) })),
      stars: Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), z: rand(0.3, 1) })),
      smoke: Array.from({ length: 10 }, () => ({ x: rand(-1, 1), v: rand(0.5, 1.2), r: rand(0.6, 1.2) })),
      raf: 0
    };
    state.fl = fl;
    drawWorld();
    starsL.innerHTML = fl.stars.map(() => '<line stroke="#fff" stroke-linecap="round"/>').join('');
    fl.flame = svgEl('g', {}, flameL);
    fl.flame.innerHTML = '<path d="M-30 0Q-38 55 0 135Q38 55 30 0Z" fill="url(#flameGrad)"/>' +
      '<path d="M-16 0Q-20 32 0 78Q20 32 16 0Z" fill="#fff7c2"/>';
    sfx.rumble(ASCENT + 0.6);
    fl.raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    const fl = state.fl;
    if (!fl) return;
    const { W, H, k, gx, gy } = state.L;
    const n = state.dest.tanks;
    const T = fl.T;
    const Hr = rocketHeight(n);
    const time = (now - fl.t0) / 1000;

    // climbing: speed up after liftoff, slow down when reaching orbit; added
    // up in small steps, so slow frames do not change how far the rocket gets
    const speed = (tt) => H * 1.5 * clamp((tt - 0.3) / 2.2, 0, 1) * (1 - ease(clamp((tt - T.z0 + 0.4) / 1.2, 0, 1)));
    for (let tt = fl.last; tt < time; tt += 1 / 60) {
      const d = speed(tt) * Math.min(1 / 60, time - tt);
      const a = (pitchAt(T, tt) * Math.PI) / 180;
      fl.alt += d * Math.cos(a);
      fl.side += d * Math.sin(a);
    }
    fl.last = time;
    const v = speed(time);
    const pa = (pitchAt(T, time) * Math.PI) / 180;
    setSky(clamp(fl.alt / (H * 3), 0, 1));
    worldL.style.transform = `translate(${-fl.side}px, ${fl.alt}px)`;
    worldL.style.display = time > T.z1 ? 'none' : '';

    // stars stream past while climbing, faster when near
    starsL.setAttribute('opacity', clamp((fl.alt / (H * 3) - 0.3) / 0.5, 0, 1));
    [...starsL.children].forEach((ln, i) => {
      const s = fl.stars[i];
      const x = mod(s.x * (W + 40) - fl.side * s.z * 0.5, W + 40) - 20;
      const y = mod(s.y * (H + 40) + fl.alt * s.z * 0.5, H + 40) - 20;
      const len = Math.min(40, v * s.z * 0.02);
      ln.setAttribute('x1', x);
      ln.setAttribute('y1', y);
      ln.setAttribute('x2', x + Math.sin(pa) * len);
      ln.setAttribute('y2', y - Math.cos(pa) * len);
      ln.setAttribute('stroke-width', 1 + 2 * s.z);
    });

    // smoke at the pad
    const smoke = worldL.querySelector('#smokeL');
    if (smoke && time < 4) {
      smoke.setAttribute('opacity', clamp(1 - time / 3.5, 0, 1));
      smoke.innerHTML = fl.smoke.map((s) => {
        const g = clamp(time - 0.2, 0, 4);
        return `<circle cx="${gx + (s.x * 60 + s.x * g * 140) * k}" cy="${gy - (10 + g * 20) * k}" r="${(25 + g * 60 * s.v) * s.r * k}"/>`;
      }).join('');
    }

    const sc = scenery(time);
    earthL.style.display = sc.earth ? '' : 'none';
    if (sc.earth) earthL.setAttribute('transform', `translate(${sc.earth.x} ${sc.earth.y}) scale(${sc.earth.r / 100})`);
    orbitRing.setAttribute('opacity', sc.ring ? sc.ring.op : 0);
    if (sc.ring) {
      orbitRing.setAttribute('cx', sc.ring.x);
      orbitRing.setAttribute('cy', sc.ring.y);
      orbitRing.setAttribute('r', sc.ring.r);
    }
    tripPath.setAttribute('opacity', sc.path ? sc.pathOp : 0);
    if (sc.path) {
      const [a, b, c, d] = sc.path;
      tripPath.setAttribute('d', `M${a.x} ${a.y}C${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`);
    }
    destImg.setAttribute('opacity', sc.dest ? 1 : 0);
    if (sc.dest) {
      const D = sc.dest;
      destImg.setAttribute('x', D.x - D.size / 2);
      destImg.setAttribute('y', D.y - D.size / 2);
      destImg.setAttribute('width', D.size);
      destImg.setAttribute('height', D.size);
    }

    const R = sc.rocket;
    const cos = Math.cos((R.rot * Math.PI) / 180);
    const sin = Math.sin((R.rot * Math.PI) / 180);
    // a point of the rocket, in units from its centre, on the screen
    const toScreen = (ux, uy) => ({ x: R.x + (ux * cos - uy * sin) * R.sc, y: R.y + (ux * sin + uy * cos) * R.sc });

    if (!fl.relit && time >= T.dep) {
      fl.relit = true;
      sfx.rumble(T.burn + 0.6);
    }

    // empty tanks drop off; the engine and fins move up to the next tank
    let lift = 0;
    for (let i = 0; i < n; i++) lift += 80 * ease(clamp((time - fl.drops[i]) / 0.35, 0, 1));
    const used = fuelUsed(T, n, time);

    for (const p of state.parts) {
      const s = p.slot;
      const sh = SHAPES[p.kind];
      let uy = s.ay + sh.h / 2 + Hr / 2;
      if (p.kind === 'engine' || p.kind === 'fin') uy -= lift;
      let pose = { ...toScreen(s.ax + s.flip * (sh.x0 + sh.w / 2), uy), rot: R.rot, sc: R.sc };
      let op = 1;
      if (p.kind === 'tank') {
        const i = s.tank;
        p.inner.querySelector('.fuel').setAttribute('width', 52 * (1 - clamp(used - i, 0, 1)));
        const dt = time - fl.drops[i];
        if (dt > 0) {
          if (!p.drop) {
            p.drop = pose;
            sfx.pick();
          }
          // falls behind the rocket, turning slowly
          const d = p.drop;
          const f = d.sc / k;
          const lx = dt * 40 * p.spin * f;
          const ly = dt * dt * H * 0.45 * f;
          const c = Math.cos((d.rot * Math.PI) / 180);
          const sn = Math.sin((d.rot * Math.PI) / 180);
          pose = { x: d.x + lx * c - ly * sn, y: d.y + lx * sn + ly * c, rot: d.rot + dt * 50 * p.spin, sc: d.sc };
          op = clamp(1 - dt / 1.4, 0, 1);
        }
      }
      setTransform(p.el, pose.x, pose.y, pose.sc, p.flip, pose.rot);
      p.el.style.opacity = op;
    }

    // flame below the engine, flickering, only while the engine burns
    const ramp = (a, b) => clamp((time - a) / 0.25, 0, 1) * clamp((b - time) / 0.25, 0, 1);
    const fire = Math.max(ramp(0, ASCENT + 0.2), ramp(T.dep, T.dep + T.burn + 0.1)) * rand(0.85, 1.15);
    const base = toScreen(0, Hr / 2 - lift);
    fl.flame.style.transform = `translate(${base.x}px, ${base.y}px) rotate(${R.rot}deg) scale(${R.sc}, ${R.sc * fire})`;

    // a line of text for the grown-ups reading along
    const cap = time >= T.z1 && time < T.dep ? t('orbiting')
      : time >= T.dep && time < T.dep + 3 ? TEXT[Astro.lang].off(state.dest.to[Astro.lang]) : '';
    if (cap !== fl.cap) {
      fl.cap = cap;
      if (cap) $('caption').textContent = cap;
      $('caption').classList.toggle('show', !!cap);
    }

    updateProgress(clamp(time / T.end, 0, 1));
    if (time >= T.end + 0.4) {
      state.phase = 'done';
      win();
      return;
    }
    fl.raf = requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  function win() {
    const d = state.dest;
    if (!state.visited.includes(d.id)) {
      state.visited.push(d.id);
      store.set('visited', state.visited);
    }
    sfx.win();
    $('winImg').src = d.file;
    rocketPicture($('winRocket'));
    updateWinText();
    $('win').classList.remove('hidden');
    Astro.startConfetti($('confetti'));
  }

  function updateWinText() {
    const d = state.dest;
    const lang = Astro.lang;
    $('winName').textContent = TEXT[lang].arrived(state.who, d.to[lang]);
    $('winFact').textContent = d.fact[lang];
    const cr = $('winCredit');
    cr.classList.toggle('hidden', !d.url);
    if (d.url) {
      cr.href = d.url;
      cr.textContent = t('photo');
    }
  }

  // ---------------------------------------------------------------------------
  // Buttons & resizing
  // ---------------------------------------------------------------------------

  new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden') && state.phase !== 'menu') layout();
  }).observe(area);

  $('playBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', startGame);
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('launchBtn').addEventListener('click', countdown);
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });
  $('resetBtn').addEventListener('click', () => {
    if (!window.confirm(t('resetAsk'))) return;
    state.visited = [];
    store.set('visited', state.visited);
    updateMenu();
  });

  buildMenu();
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    if (!$('win').classList.contains('hidden')) updateWinText();
  });
})();
