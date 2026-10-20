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
      arrived: (who, to) => `${who} made it to ${to}!`
    }
  };

  const HINT_MS = 5000;   // idle time before the next empty spot starts to glow
  const BURN = 2.6;       // seconds of flight per fuel tank
  const ARRIVE = 2.4;     // seconds from the last tank to landing

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

  scene.innerHTML =
    '<rect width="100%" height="100%" fill="url(#skyGrad)"/>' +
    '<g id="starsL"></g><image id="destImg" mask="url(#soft)" style="mix-blend-mode: screen"/>' +
    '<g id="worldL"></g><g id="slotsL"></g><g id="trayL"></g><g id="flameL"></g><g id="partsL"></g>';
  const L$ = (id) => scene.querySelector('#' + id);
  const [starsL, destImg, worldL, slotsL, trayL, flameL, partsL] =
    ['starsL', 'destImg', 'worldL', 'slotsL', 'trayL', 'flameL', 'partsL'].map(L$);

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

  const ease = (x) => x * x * (3 - 2 * x);
  const lerp = (a, b, x) => a + (b - a) * x;

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

  function fly() {
    state.phase = 'fly';
    const n = state.dest.tanks;
    const total = n * BURN + ARRIVE;
    state.parts.forEach((p) => {
      p.el.classList.remove('move', 'snap', 'pop');
      p.spin = rand(-1, 1) < 0 ? -1 : 1;
      p.dropT = null;
    });
    const fl = {
      t0: performance.now(),
      last: 0,              // flight time of the previous frame
      alt: 0,
      total,
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
    sfx.rumble(total);
    fl.raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    const fl = state.fl;
    if (!fl) return;
    const { W, H, k, gx, gy } = state.L;
    const n = state.dest.tanks;
    const time = (now - fl.t0) / 1000;
    const burnEnd = n * BURN;
    const arrive = clamp((time - burnEnd) / ARRIVE, 0, 1);

    // speed up after liftoff, slow down when arriving; added up in small
    // steps, so slow frames do not change how far the rocket gets
    const speed = (tt) => H * 1.5 * clamp((tt - 0.3) / 2.2, 0, 1) * (1 - 0.85 * ease(clamp((tt - burnEnd) / ARRIVE, 0, 1)));
    for (let tt = fl.last; tt < time; tt += 1 / 60) fl.alt += speed(tt) * Math.min(1 / 60, time - tt);
    fl.last = time;
    const v = speed(time);
    setSky(clamp(fl.alt / (H * 3), 0, 1));
    worldL.style.transform = `translateY(${fl.alt}px)`;

    // stars stream past, faster when near
    const starsOn = clamp((fl.alt / (H * 3) - 0.3) / 0.5, 0, 1);
    starsL.setAttribute('opacity', starsOn);
    [...starsL.children].forEach((ln, i) => {
      const s = fl.stars[i];
      const y = ((s.y * (H + 40) + fl.alt * s.z * 0.5) % (H + 40)) - 20;
      const x = s.x * W;
      const len = Math.min(40, v * s.z * 0.02);
      ln.setAttribute('x1', x);
      ln.setAttribute('x2', x);
      ln.setAttribute('y1', y);
      ln.setAttribute('y2', y - len);
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

    // the planet comes into view near the end
    const pp = clamp((time - (burnEnd - 1.6)) / (1.6 + ARRIVE * 0.8), 0, 1);
    const pe = ease(pp);
    const size = Math.min(W, H) * (0.1 + 0.62 * pe);
    const pcy = lerp(-size * 0.6, H * 0.36, pe);
    destImg.setAttribute('opacity', pp > 0 ? 1 : 0);
    destImg.setAttribute('x', W / 2 - size / 2);
    destImg.setAttribute('y', pcy - size / 2);
    destImg.setAttribute('width', size);
    destImg.setAttribute('height', size);

    // rocket: shake on the pad, rise to the middle, then fly into the planet
    const h = rocketHeight(n) * k;
    const rise = ease(clamp((time - 0.3) / 2.2, 0, 1));
    let ay = gy - Math.max(0, gy - h / 2 - H * 0.58) * rise;
    const ax = gx + (time < 0.7 ? Math.sin(time * 80) * 2.5 * (1 - time / 0.7) : 0);
    const ae = ease(arrive);
    const rs = lerp(1, 0.25, ae);
    ay = lerp(ay, pcy + size * 0.15 + h * rs, ae);

    // empty tanks drop off; the engine and fins move up to the next tank
    let lift = 0;
    for (let i = 0; i < n; i++) lift += 80 * ease(clamp((time - (i + 1) * BURN) / 0.35, 0, 1));

    for (const p of state.parts) {
      const q = slotPos(p.slot);
      let y = q.y;
      if (p.kind === 'engine' || p.kind === 'fin') y -= lift * k;
      let X = ax + (q.x - gx) * rs;
      let Y = ay + (y - gy) * rs;
      let rot = 0;
      let op = 1;
      if (p.kind === 'tank') {
        const i = p.slot.tank;
        p.inner.querySelector('.fuel').setAttribute('width', 52 * (1 - clamp((time - i * BURN) / BURN, 0, 1)));
        const drop = time - (i + 1) * BURN;
        if (drop > 0) {
          if (p.dropT === null) {
            p.dropT = time;
            sfx.pick();
          }
          // falls back towards Earth, turning slowly
          X += drop * 40 * p.spin;
          Y += drop * drop * H * 0.45;
          rot = drop * 50 * p.spin;
          op = clamp(1 - drop / 1.4, 0, 1);
        }
      }
      setTransform(p.el, X, Y, k * rs, p.flip, rot);
      p.el.style.opacity = op;
    }

    // flame below the engine, flickering
    const fx = ax;
    const fy = ay + (-lift * k) * rs;
    const flick = rand(0.85, 1.15) * clamp(time / 0.3, 0, 1) * (1 - ae);
    fl.flame.style.transform = `translate(${fx}px, ${fy}px) scale(${k * rs}, ${k * rs * flick})`;

    updateProgress(clamp(time / fl.total, 0, 1));
    if (time >= fl.total + 0.4) {
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
