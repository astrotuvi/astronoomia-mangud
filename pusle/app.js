'use strict';

(() => {
  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // Square crops of photos by Tõrva Astronoomiaklubi (AstroBin, CC BY-NC-SA).
  // `astrobin` is the image id: https://www.astrobin.com/<id>/
  const IMAGES = [
    {
      file: 'images/pleiades.jpg',
      astrobin: 'qirtxe',
      name: { et: 'Plejaadid (Sõel)', en: 'The Pleiades' },
      fact: {
        et: 'Plejaadid ehk Sõel on hulk noori kuumi sinakaid tähti. Selgel talveõhtul näed neid taevas ka ilma pikksilmata!',
        en: 'The Pleiades, or Seven Sisters, are a group of young, hot, blue stars. On a clear winter evening you can see them without a telescope!'
      }
    },
    {
      file: 'images/moon.jpg',
      astrobin: 'oy5di6',
      name: { et: 'Värviline Kuu', en: 'The Moon in colour' },
      fact: {
        et: 'See on Kuu! Värvid näitavad, et Kuu pind on eri kohtades tehtud erinevatest kivimitest.',
        en: 'This is the Moon! The colours show that different parts of the Moon are made of different kinds of rock.'
      }
    },
    {
      file: 'images/saturn.jpg',
      astrobin: 'fu9tbu',
      name: { et: 'Saturn', en: 'Saturn' },
      fact: {
        et: 'Saturn on hiiglaslik planeet. Tema ümber on ilusad rõngad, mis koosnevad jääst ja kivitükkidest.',
        en: 'Saturn is a giant planet. Its beautiful rings are made of pieces of ice and rock.'
      }
    },
    {
      file: 'images/jupiter.jpg',
      astrobin: 'gnc57p',
      name: { et: 'Jupiter', en: 'Jupiter' },
      fact: {
        et: 'Jupiter on Päikesesüsteemi suurim planeet. Punane laik on hiiglaslik torm, mis on suurem kui meie Maa!',
        en: 'Jupiter is the biggest planet in the Solar System. The red spot is a giant storm that is bigger than our Earth!'
      }
    },
    {
      file: 'images/eclipse.jpg',
      astrobin: 'ytu8fs',
      name: { et: 'Päikesevarjutus', en: 'Solar eclipse' },
      fact: {
        et: 'Kuu liikus Päikese ette ja kattis osa sellest. See pilt on tehtud 10. juunil 2021. Ära kunagi vaata Päikest ilma spetsiaalsete prillideta!',
        en: 'The Moon moved in front of the Sun and covered part of it. This photo was taken on 10 June 2021. Never look at the Sun without special glasses!'
      }
    },
    {
      file: 'images/orion.jpg',
      astrobin: 'uu55w0',
      name: { et: 'Orioni udu', en: 'Orion Nebula' },
      fact: {
        et: 'Orioni udu on suur gaasipilv, kus sünnivad uued tähed. Talvel võid seda näha isegi binokliga.',
        en: 'The Orion Nebula is a big cloud of gas where new stars are born. In winter you can even see it with binoculars.'
      }
    },
    {
      file: 'images/horsehead.jpg',
      astrobin: '4yxzcw',
      name: { et: 'Hobusepea udu', en: 'Horsehead Nebula' },
      fact: {
        et: 'Hobusepea udu on tume tolmupilv, mis näeb välja nagu hobuse pea. See asub Orioni tähtkujus.',
        en: 'The Horsehead Nebula is a dark cloud of dust shaped like a horse’s head. It is in the constellation Orion.'
      }
    },
    {
      file: 'images/rosette.jpg',
      astrobin: '61be3g',
      name: { et: 'Roseti udu', en: 'Rosette Nebula' },
      fact: {
        et: 'Roseti udu näeb välja nagu suur roos taevas. Selle keskel on hulk noori tähti.',
        en: 'The Rosette Nebula looks like a big rose in the sky. There is a group of young stars in its middle.'
      }
    },
    {
      file: 'images/andromeda.jpg',
      astrobin: '4ocaul',
      name: { et: 'Andromeeda galaktika', en: 'Andromeda Galaxy' },
      fact: {
        et: 'Andromeeda galaktika on meie Linnutee naaber. Selles on sadu miljardeid tähti!',
        en: 'The Andromeda Galaxy is our Milky Way’s neighbour. It has hundreds of billions of stars!'
      }
    },
    {
      file: 'images/whirlpool.jpg',
      astrobin: 'ymu58n',
      name: { et: 'Keerisgalaktika', en: 'Whirlpool Galaxy' },
      fact: {
        et: 'Keerisgalaktika spiraalharud keerlevad nagu vesi vannis. Tema kõrval on väike kaaslasgalaktika.',
        en: 'The Whirlpool Galaxy has spiral arms that swirl like water down a drain. A small galaxy is right next to it.'
      }
    }
  ];

  // Puzzle sizes offered (pieces per side).
  const SIDES = [2, 3, 4, 5, 6, 7];

  const TEXT = {
    et: {
      title: 'Tähepusle',
      choosePicture: 'Vali pilt',
      choosePieces: 'Mitu tükki?',
      play: 'Mängi',
      wellDone: 'Tubli!',
      again: 'Uuesti',
      other: 'Teine pilt',
      credit: 'Fotod: Tõrva Astronoomiaklubi (AstroBin), litsents CC BY-NC-SA.',
      photo: 'Foto: Tõrva Astronoomiaklubi',
      allGames: 'Kõik mängud'
    },
    en: {
      title: 'Star Puzzle',
      choosePicture: 'Pick a picture',
      choosePieces: 'How many pieces?',
      play: 'Play',
      wellDone: 'Well done!',
      again: 'Again',
      other: 'New picture',
      credit: 'Photos: Tõrva Astronoomiaklubi (AstroBin), licence CC BY-NC-SA.',
      photo: 'Photo: Tõrva Astronoomiaklubi',
      allGames: 'All games'
    }
  };

  // One jigsaw tab along an edge of length 1, in (along, outward) coordinates.
  // The shape is symmetric about 0.5 so neighbouring pieces fit exactly.
  const TAB = [
    ['L', 0.38, 0],
    ['C', 0.40, 0, 0.43, 0.03, 0.42, 0.07],
    ['C', 0.40, 0.11, 0.33, 0.13, 0.34, 0.19],
    ['C', 0.35, 0.27, 0.45, 0.28, 0.50, 0.28],
    ['C', 0.55, 0.28, 0.65, 0.27, 0.66, 0.19],
    ['C', 0.67, 0.13, 0.60, 0.11, 0.58, 0.07],
    ['C', 0.57, 0.03, 0.60, 0, 0.62, 0],
    ['L', 1, 0]
  ];
  const TAB_MARGIN = 0.3; // room around a piece for its tabs, relative to cell size

  // ---------------------------------------------------------------------------
  // State & helpers
  // ---------------------------------------------------------------------------

  const { $, rand, clamp, shuffle, sfx } = Astro;
  const store = Astro.makeStore('tahepusle.');

  const state = {
    imgIdx: store.get('img', 0),
    side: store.get('side', 3),
    ghost: store.get('ghost', true),
    img: null,
    pieces: [],
    L: null,
    zTop: 10,
    drag: null,
    done: false
  };
  if (!(state.imgIdx >= 0 && state.imgIdx < IMAGES.length)) state.imgIdx = 0;
  if (!SIDES.includes(state.side)) state.side = 3;

  const t = (key) => TEXT[Astro.lang][key];

  const area = $('area');
  const board = $('board');
  const hitCtx = document.createElement('canvas').getContext('2d');

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    const pics = $('pictures');
    IMAGES.forEach((im, i) => {
      const b = document.createElement('button');
      b.className = 'pic';
      b.innerHTML = `<img src="${im.file}" alt=""><span></span>`;
      b.addEventListener('click', () => {
        state.imgIdx = i;
        store.set('img', i);
        sfx.pick();
        updateMenu();
      });
      pics.appendChild(b);
    });

    const counts = $('counts');
    SIDES.forEach((k) => {
      const b = document.createElement('button');
      b.className = 'count';
      b.innerHTML = `<span class="mini" style="--k:${k}">${'<i></i>'.repeat(k * k)}</span><b>${k * k}</b>`;
      b.addEventListener('click', () => {
        state.side = k;
        store.set('side', k);
        sfx.pick();
        updateMenu();
      });
      counts.appendChild(b);
    });
  }

  function updateMenu() {
    [...$('pictures').children].forEach((b, i) => {
      b.classList.toggle('selected', i === state.imgIdx);
      b.querySelector('span').textContent = IMAGES[i].name[Astro.lang];
    });
    [...$('counts').children].forEach((b, i) => b.classList.toggle('selected', SIDES[i] === state.side));
  }

  function showMenu() {
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // Puzzle setup
  // ---------------------------------------------------------------------------

  function startGame() {
    const info = IMAGES[state.imgIdx];
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    updateToggles();

    if (state.img && state.img.dataset.src === info.file) {
      setupPuzzle();
      return;
    }
    const img = new Image();
    img.dataset.src = info.file;
    img.onload = () => {
      state.img = img;
      setupPuzzle();
    };
    img.src = info.file;
  }

  function setupPuzzle() {
    const n = state.side;
    const sign = () => (Math.random() < 0.5 ? 1 : -1);

    // Random tab directions for interior edges: h = horizontal edges, v = vertical edges.
    const h = Array.from({ length: n - 1 }, () => Array.from({ length: n }, sign));
    const v = Array.from({ length: n }, () => Array.from({ length: n - 1 }, sign));

    state.pieces.forEach((p) => p.el.remove());
    state.pieces = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const el = document.createElement('canvas');
        el.className = 'piece';
        area.appendChild(el);
        state.pieces.push({
          r, c, el,
          edges: {
            top: r === 0 ? 0 : -h[r - 1][c],
            right: c === n - 1 ? 0 : v[r][c],
            bottom: r === n - 1 ? 0 : h[r][c],
            left: c === 0 ? 0 : -v[r][c - 1]
          },
          x: 0, y: 0, placed: false, lift: false, path: null
        });
      }
    }

    state.done = false;
    state.drag = null;
    state.zTop = 10;
    area.classList.remove('complete');
    state.L = computeLayout();
    renderAll();
    scatter(state.pieces);
    state.pieces.forEach((p, i) => { p.el.style.zIndex = 10 + i; });
    state.zTop = 10 + state.pieces.length;
    positionAll();
    drawBoard();
    updateProgress();
  }

  // Largest board size S such that a tray of size (free - S) x fixed
  // has room for all pieces: (free - S) * fixed >= S^2.
  function fitBoard(free, fixed) {
    return (-fixed + Math.sqrt(fixed * fixed + 4 * fixed * free)) / 2;
  }

  // Board in the middle; loose pieces on both sides (landscape) or below (portrait).
  function computeLayout() {
    const W = area.clientWidth;
    const H = area.clientHeight;
    const n = state.side;
    const pad = Math.max(8, Math.min(W, H) * 0.02);
    const landscape = W > H * 1.15;
    let S, bx, by, regions;

    if (landscape) {
      S = Math.min(H - 2 * pad, W / (1 + 2.6 / n), fitBoard(W - 4 * pad, H - 2 * pad));
      bx = (W - S) / 2;
      by = (H - S) / 2;
      regions = [
        { x: pad, y: pad, w: bx - 2 * pad, h: H - 2 * pad },
        { x: bx + S + pad, y: pad, w: W - bx - S - 2 * pad, h: H - 2 * pad }
      ];
    } else {
      S = Math.min(W - 2 * pad, H * 0.62, (H - 3 * pad) / (1 + 1.4 / n), fitBoard(H - 3 * pad, W - 2 * pad));
      bx = (W - S) / 2;
      by = pad;
      regions = [{ x: pad, y: by + S + pad, w: W - 2 * pad, h: H - by - S - 2 * pad }];
    }
    S = Math.floor(S);
    bx = Math.round(bx);
    by = Math.round(by);
    const c = S / n;
    return { W, H, S, bx, by, c, m: c * TAB_MARGIN, landscape, regions };
  }

  // Spread pieces evenly over the free regions, with a little jitter.
  function scatter(list) {
    const { c } = state.L;
    const slots = [];
    for (const R of state.L.regions) {
      if (R.w <= 0 || R.h <= 0) continue;
      const cols = Math.max(1, Math.floor(R.w / c));
      const rows = Math.max(1, Math.floor(R.h / c));
      const sx = R.w / cols;
      const sy = R.h / rows;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          slots.push({ x: R.x + sx * (i + 0.5) - c / 2, y: R.y + sy * (j + 0.5) - c / 2 });
        }
      }
    }
    if (!slots.length) slots.push({ x: 0, y: state.L.H - c });
    shuffle(slots);
    shuffle([...list]).forEach((p, k) => {
      const s = slots[k % slots.length];
      const jitter = k >= slots.length ? c * 0.35 : c * 0.06;
      p.x = s.x + rand(-jitter, jitter);
      p.y = s.y + rand(-jitter, jitter);
      clampPiece(p);
    });
  }

  function clampPiece(p) {
    const { W, H, c, m } = state.L;
    p.x = clamp(p.x, m * 0.5, W - c - m * 0.5);
    p.y = clamp(p.y, m * 0.5, H - c - m * 0.5);
  }

  // ---------------------------------------------------------------------------
  // Drawing
  // ---------------------------------------------------------------------------

  function addEdge(path, ax, ay, bx, by, s) {
    if (s === 0) {
      path.lineTo(bx, by);
      return;
    }
    const dx = bx - ax;
    const dy = by - ay;
    // outward normal for a clockwise outline (screen coordinates, y down)
    const nx = dy * s;
    const ny = -dx * s;
    const pt = (u, v) => [ax + dx * u + nx * v, ay + dy * u + ny * v];
    for (const seg of TAB) {
      if (seg[0] === 'L') {
        path.lineTo(...pt(seg[1], seg[2]));
      } else {
        path.bezierCurveTo(...pt(seg[1], seg[2]), ...pt(seg[3], seg[4]), ...pt(seg[5], seg[6]));
      }
    }
  }

  // Outline of a piece, with its cell's top-left corner at (ox, oy).
  function piecePath(p, c, ox, oy) {
    const path = new Path2D();
    const e = p.edges;
    path.moveTo(ox, oy);
    addEdge(path, ox, oy, ox + c, oy, e.top);
    addEdge(path, ox + c, oy, ox + c, oy + c, e.right);
    addEdge(path, ox + c, oy + c, ox, oy + c, e.bottom);
    addEdge(path, ox, oy + c, ox, oy, e.left);
    path.closePath();
    return path;
  }

  function renderPiece(p) {
    const { c, m, S } = state.L;
    const dpr = window.devicePixelRatio || 1;
    const size = c + 2 * m;
    const cv = p.el;
    cv.width = Math.ceil(size * dpr);
    cv.height = Math.ceil(size * dpr);
    cv.style.width = size + 'px';
    cv.style.height = size + 'px';

    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    p.path = piecePath(p, c, m, m);

    ctx.save();
    ctx.clip(p.path);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(state.img, m - p.c * c, m - p.r * c, S, S);
    ctx.restore();

    // light rim so dark pieces stand out against the dark background
    ctx.lineWidth = Math.max(1.5, c * 0.018);
    ctx.strokeStyle = 'rgba(255,255,255,0.55)';
    ctx.stroke(p.path);
  }

  function renderAll() {
    state.pieces.forEach(renderPiece);
  }

  function drawBoard(full) {
    const { S, bx, by, c } = state.L;
    const dpr = window.devicePixelRatio || 1;
    board.width = Math.ceil(S * dpr);
    board.height = Math.ceil(S * dpr);
    board.style.width = S + 'px';
    board.style.height = S + 'px';
    board.style.transform = `translate(${bx}px, ${by}px)`;

    const ctx = board.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = 'rgba(3, 5, 20, 0.7)';
    ctx.fillRect(0, 0, S, S);
    if (full) {
      ctx.drawImage(state.img, 0, 0, S, S);
      return;
    }
    if (state.ghost && state.img) {
      ctx.globalAlpha = 0.3;
      ctx.drawImage(state.img, 0, 0, S, S);
      ctx.globalAlpha = 1;
    }
    // faint outlines of every slot help little ones see where pieces go
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    for (const p of state.pieces) {
      ctx.stroke(piecePath(p, c, p.c * c, p.r * c));
    }
  }

  function setPos(p) {
    const { m } = state.L;
    p.el.style.transform = `translate(${p.x - m}px, ${p.y - m}px)` + (p.lift ? ' scale(1.06)' : '');
  }

  function positionAll() {
    const { bx, by, c } = state.L;
    for (const p of state.pieces) {
      if (p.placed) {
        p.x = bx + p.c * c;
        p.y = by + p.r * c;
      }
      setPos(p);
    }
  }

  function updateProgress() {
    const total = state.pieces.length;
    const placed = state.pieces.filter((p) => p.placed).length;
    $('progressFill').style.width = (total ? (100 * placed) / total : 0) + '%';
    $('progressText').textContent = `⭐ ${placed} / ${total}`;
  }

  function updateToggles() {
    $('ghostBtn').classList.toggle('off', !state.ghost);
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Dragging
  // ---------------------------------------------------------------------------

  function localPoint(e) {
    const r = area.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // Topmost loose piece under the finger; if none is hit exactly,
  // take the nearest one close by (small fingers are not precise).
  function pickPiece(pt) {
    const { c, m } = state.L;
    const loose = state.pieces
      .filter((p) => !p.placed)
      .sort((a, b) => Number(b.el.style.zIndex) - Number(a.el.style.zIndex));
    for (const p of loose) {
      if (hitCtx.isPointInPath(p.path, pt.x - (p.x - m), pt.y - (p.y - m))) return p;
    }
    let best = null;
    let bestD = c * 0.6;
    for (const p of loose) {
      const d = Math.hypot(pt.x - (p.x + c / 2), pt.y - (p.y + c / 2));
      if (d < bestD) {
        best = p;
        bestD = d;
      }
    }
    return best;
  }

  area.addEventListener('pointerdown', (e) => {
    if (state.drag || state.done || !state.L) return;
    const pt = localPoint(e);
    const p = pickPiece(pt);
    if (!p) return;
    e.preventDefault();
    area.setPointerCapture(e.pointerId);
    state.drag = { p, id: e.pointerId, ox: pt.x - p.x, oy: pt.y - p.y };
    p.lift = true;
    p.el.classList.remove('snap');
    p.el.classList.add('dragging');
    p.el.style.zIndex = ++state.zTop;
    setPos(p);
    sfx.pick();
  });

  area.addEventListener('pointermove', (e) => {
    const d = state.drag;
    if (!d || e.pointerId !== d.id) return;
    const pt = localPoint(e);
    d.p.x = pt.x - d.ox;
    d.p.y = pt.y - d.oy;
    clampPiece(d.p);
    setPos(d.p);
  });

  function endDrag(e) {
    const d = state.drag;
    if (!d || (e && e.pointerId !== d.id)) return;
    state.drag = null;
    const p = d.p;
    p.lift = false;
    p.el.classList.remove('dragging');

    const { bx, by, c } = state.L;
    const tx = bx + p.c * c;
    const ty = by + p.r * c;
    if (Math.hypot(p.x - tx, p.y - ty) < c * 0.4) {
      placePiece(p);
    } else {
      setPos(p);
    }
  }
  area.addEventListener('pointerup', endDrag);
  area.addEventListener('pointercancel', endDrag);

  function placePiece(p) {
    p.placed = true;
    p.el.classList.add('snap', 'placed');
    p.el.style.zIndex = 1;
    positionAll();
    // restart the flash animation
    p.el.classList.remove('flash');
    void p.el.offsetWidth;
    p.el.classList.add('flash');
    sfx.snap();
    updateProgress();
    if (state.pieces.every((q) => q.placed)) win();
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  function win() {
    state.done = true;
    setTimeout(() => {
      drawBoard(true);
      area.classList.add('complete');
      sfx.win();
    }, 250);
    setTimeout(() => {
      const info = IMAGES[state.imgIdx];
      $('winImg').src = info.file;
      $('winName').textContent = info.name[Astro.lang];
      $('winFact').textContent = info.fact[Astro.lang];
      $('winCredit').textContent = '📷 ' + t('photo');
      $('winCredit').href = 'https://www.astrobin.com/' + info.astrobin + '/';
      $('win').classList.remove('hidden');
      Astro.startConfetti($('confetti'));
    }, 900);
  }

  // ---------------------------------------------------------------------------
  // Resizing
  // ---------------------------------------------------------------------------

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 120);
  });

  function onResize() {
    if ($('game').classList.contains('hidden') || !state.L || !state.pieces.length) return;
    const old = state.L;
    const L = computeLayout();
    if (L.W === old.W && L.H === old.H) return;
    if (state.drag) endDrag();
    state.L = L;

    const loose = state.pieces.filter((p) => !p.placed);
    if (L.landscape !== old.landscape) {
      scatter(loose);
    } else {
      for (const p of loose) {
        p.x *= L.W / old.W;
        p.y *= L.H / old.H;
        clampPiece(p);
      }
    }
    renderAll();
    positionAll();
    drawBoard(state.done);
  }

  // ---------------------------------------------------------------------------
  // Buttons
  // ---------------------------------------------------------------------------

  $('playBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', startGame);
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);

  $('ghostBtn').addEventListener('click', () => {
    state.ghost = !state.ghost;
    store.set('ghost', state.ghost);
    updateToggles();
    if (state.L && !state.done) drawBoard();
  });

  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  buildMenu();
  Astro.setupLanguage(TEXT, updateMenu);
})();
