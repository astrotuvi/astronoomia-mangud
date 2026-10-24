'use strict';

(() => {
  const { $, shuffle, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // The planets in order from the Sun, drawn by shared/planets.js. Until a
  // picture is ready the planet is a plain ball of its `base` colour. r is
  // the size in the game: not to scale (Jupiter would be 28 times as wide as
  // Mercury), but bigger and smaller in the right order, so the empty places
  // hint at which planet goes where. wf and hf are how much wider and taller
  // than the ball the picture is with the rings.
  const PLANETS = [
    {
      id: 'mercury', r: 0.38, base: '#9a928a',
      name: { et: 'Merkuur', en: 'Mercury' },
      fact: { et: 'Päikesele kõige lähem ja kõige väiksem planeet.', en: 'The closest planet to the Sun, and the smallest.' }
    },
    {
      id: 'venus', r: 0.62, base: '#e0c48c',
      name: { et: 'Veenus', en: 'Venus' },
      fact: { et: 'Kõige kuumem planeet. Taevas paistab ta väga heleda tähena.', en: 'The hottest planet. In the sky it looks like a very bright star.' }
    },
    {
      id: 'earth', r: 0.65, base: '#2a5e9e',
      name: { et: 'Maa', en: 'Earth' },
      fact: { et: 'Meie kodu. Ainus planeet, kus teame elu olevat.', en: 'Our home, and the only planet where we know there is life.' }
    },
    {
      id: 'mars', r: 0.48, base: '#b86a44',
      name: { et: 'Marss', en: 'Mars' },
      fact: { et: 'Punane planeet. Seal on kõige kõrgem mägi kogu Päikesesüsteemis.', en: 'The red planet. It has the tallest mountain in the Solar System.' }
    },
    {
      id: 'jupiter', r: 1.25, base: '#c9a47e',
      name: { et: 'Jupiter', en: 'Jupiter' },
      fact: { et: 'Kõige suurem planeet. Tema punane laik on torm, mis on suurem kui Maa.', en: 'The biggest planet. Its red spot is a storm bigger than the Earth.' }
    },
    {
      id: 'saturn', r: 1.05, wf: 2.0, base: '#d9be86',
      name: { et: 'Saturn', en: 'Saturn' },
      fact: { et: 'Tal on ilusad rõngad, mis on tehtud jää- ja kivitükkidest.', en: 'It has beautiful rings made of bits of ice and rock.' }
    },
    {
      id: 'uranus', r: 0.85, wf: 1.04, hf: 1.66, base: '#a5dbe2',
      name: { et: 'Uraan', en: 'Uranus' },
      fact: { et: 'Ta on külili ja veereb nagu pall ümber Päikese.', en: 'It lies on its side and rolls round the Sun like a ball.' }
    },
    {
      id: 'neptune', r: 0.82, base: '#3e64c8',
      name: { et: 'Neptuun', en: 'Neptune' },
      fact: { et: 'Päikesest kõige kaugem planeet. Seal puhuvad kõige tugevamad tuuled.', en: 'The planet farthest from the Sun. It has the strongest winds.' }
    }
  ];
  for (const p of PLANETS) {
    p.wf = p.wf || 1;
    p.hf = p.hf || 1;
  }

  // How many planets, from the Sun outwards: the four rocky ones, the ones
  // that can be seen without a telescope, or all eight.
  const LEVELS = [4, 6, 8];

  const TEXT = {
    et: {
      title: 'Planeetide rivi',
      intro: 'Lohista planeedid oma kohale. Esimene on Päikesele kõige lähem.',
      chooseLevel: 'Mitu planeeti?',
      level: (n) => `${n} planeeti`,
      play: 'Mängi',
      wellDone: 'Tubli!',
      again: 'Uuesti',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      hint: 'Vihje',
      sound: 'Heli',
      farther: (name) => `${name} on Päikesest kaugemal.`,
      closer: (name) => `${name} on Päikesele lähemal.`,
      win: (n) => `Panid kõik ${n} planeeti õigesse järjekorda!`,
      winFact: {
        4: 'Need neli on väikesed kivised planeedid, nagu Maa.',
        6: 'Saturnini välja näeb planeete taevas ka ilma teleskoobita.',
        8: 'Neli esimest on väikesed ja kivised. Neli viimast on suured ja neil pole kõva pinda, kuhu astuda.'
      }
    },
    en: {
      title: 'Line Up the Planets',
      intro: 'Drag the planets to their places. The first one is closest to the Sun.',
      chooseLevel: 'How many planets?',
      level: (n) => `${n} planets`,
      play: 'Play',
      wellDone: 'Well done!',
      again: 'Again',
      menu: 'Menu',
      allGames: 'All games',
      hint: 'Hint',
      sound: 'Sound',
      farther: (name) => `${name} is farther from the Sun.`,
      closer: (name) => `${name} is closer to the Sun.`,
      win: (n) => `You put all ${n} planets in the right order!`,
      winFact: {
        4: 'These four are small rocky planets, like the Earth.',
        6: 'The planets as far as Saturn can be seen in the sky without a telescope.',
        8: 'The first four are small and rocky. The last four are big and have no hard ground to stand on.'
      }
    }
  };

  const TRAY = 0.75;  // planets waiting in the tray are this much smaller
  const GAP = 0.35;   // room between the places, in the same units as r
  const SUN = 1.2;    // how much of the Sun shows at the edge
  const TOP = 56;     // room at the top of the play area for the messages
  const PAD = 10;
  const MIN_HIT = 54; // even Mercury is this easy to grab (px)

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('planeedid.');
  const state = {
    n: store.get('n', 4),
    hint: store.get('hint', false),
    finished: store.get('finished', []), // the levels done at least once
    slots: [],     // { p, i, el, ghost, label, x, y, filled }
    pieces: [],    // { p, i, el, svg, x, y, tx, ty, placed, wrong }
    selected: null,
    drag: null,
    done: false,
    L: null,       // the current layout
    toastTimer: 0
  };
  if (!LEVELS.includes(state.n)) state.n = 4;
  if (!Array.isArray(state.finished)) state.finished = [];

  const area = $('area');
  const t = (key) => TEXT[Astro.lang][key];

  // ---------------------------------------------------------------------------
  // Drawing
  // ---------------------------------------------------------------------------

  // The pictures take a moment to draw, one after another from Mercury out,
  // and each is filled in everywhere when it is ready. They are drawn about
  // as big as they are shown on a large screen.
  const PICS = {};
  function picture(p) {
    const pic = PICS[p.id];
    return `<image href="${pic.url}" x="${-pic.w / 2}" y="${-pic.h / 2}" width="${pic.w}" height="${pic.h}" />`;
  }
  (function next(k) {
    const p = PLANETS[k];
    if (!p) return;
    AstroPlanets.drawPlanet(p.id, Math.round(Math.max(192, p.r * 480)), (pic) => {
      PICS[p.id] = pic;
      document.querySelectorAll(`g.pic-${p.id}`).forEach((el) => { el.innerHTML = picture(p); });
      next(k + 1);
    });
  })(0);

  function planetArt(p) {
    return `<g class="pic-${p.id}">${PICS[p.id] ? picture(p) : `<circle r="50" fill="${p.base}" />`}</g>`;
  }

  // An <svg> of one planet, or of its dashed outline for an empty place.
  function planetSVG(p, outline) {
    const w = 50 * p.wf;
    const h = 50 * p.hf;
    const inner = outline
      ? '<g fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" stroke-dasharray="6 6">' +
        '<circle r="50" vector-effect="non-scaling-stroke" />' +
        (p.id === 'saturn' ? '<ellipse rx="97" ry="21" vector-effect="non-scaling-stroke" />' : '') +
        `</g><g class="ghost">${planetArt(p)}</g>`
      : planetArt(p);
    return `<svg viewBox="${-w} ${-h} ${2 * w} ${2 * h}" overflow="visible" aria-hidden="true">${inner}</svg>`;
  }

  // The planets in a row next to the Sun, for the menu and the win screen.
  // Names under them alternate between two lines so that they do not overlap.
  // In the menu every row is as tall as the one with all eight, so that the
  // planets are the same size in each and only the row grows longer.
  function rowSVG(ps, names) {
    let x = SUN + GAP;
    const top = Math.max(...(names ? ps : PLANETS).map((p) => p.r * p.hf)) + 0.15;
    let parts = '';
    let labels = '';
    ps.forEach((p, i) => {
      const cx = x + p.r * p.wf;
      parts += `<g transform="translate(${cx * 50} 0) scale(${p.r})">${planetArt(p)}</g>`;
      if (names) {
        const y = (top + 0.5 + (i % 2) * 0.6) * 50;
        labels += `<text x="${cx * 50}" y="${y}">${p.name[Astro.lang]}</text>`;
      }
      x = cx + p.r * p.wf + GAP;
    });
    const bottom = names ? top + 1.3 : top;
    const vb = [0, -top * 50, x * 50, (top + bottom) * 50];
    const svg =
      `<svg viewBox="${vb.join(' ')}" preserveAspectRatio="xMinYMid meet" aria-hidden="true">` +
      `<circle cx="${(SUN - 3.2) * 50}" r="${3.2 * 50 + 12}" fill="url(#sunGlow)" />` +
      parts +
      (names ? `<g class="row-names">${labels}</g>` : '') +
      '</svg>';
    return { svg, aspect: vb[2] / vb[3] };
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    const box = $('levels');
    LEVELS.forEach((n) => {
      const b = document.createElement('button');
      b.className = 'level';
      const row = rowSVG(PLANETS.slice(0, n), false);
      b.innerHTML =
        `<span class="level-row" style="--aspect:${row.aspect}">${row.svg}</span>` +
        '<span class="level-name"></span><b class="done-badge hidden">🌟</b>';
      b.addEventListener('click', () => {
        state.n = n;
        store.set('n', n);
        sfx.pick();
        updateMenu();
      });
      box.appendChild(b);
    });
  }

  function updateMenu() {
    [...$('levels').children].forEach((b, i) => {
      const n = LEVELS[i];
      b.classList.toggle('selected', n === state.n);
      b.querySelector('.level-name').textContent = t('level')(n);
      b.querySelector('.done-badge').classList.toggle('hidden', !state.finished.includes(n));
    });
  }

  function showMenu() {
    endDrag();
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // Game
  // ---------------------------------------------------------------------------

  function startGame() {
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    endDrag();
    area.querySelectorAll('.slot, .label, .piece').forEach((el) => el.remove());
    $('toast').classList.remove('show');

    const ps = PLANETS.slice(0, state.n);
    state.slots = ps.map((p, i) => {
      const el = document.createElement('div');
      el.className = 'slot';
      el.innerHTML = planetSVG(p, true);
      el.addEventListener('click', () => { if (state.selected) tryPlace(state.selected, slot); });
      const label = document.createElement('div');
      label.className = 'label';
      area.append(el, label);
      const slot = { p, i, el, label, filled: false };
      return slot;
    });

    // the tray holds the planets mixed up, never already in order
    let order;
    do order = shuffle(ps.map((_, i) => i)); while (order.every((v, k) => v === k));
    state.pieces = order.map((i) => {
      const p = ps[i];
      const el = document.createElement('div');
      el.className = 'piece';
      el.innerHTML = planetSVG(p, false);
      area.appendChild(el);
      const piece = { p, i, el, svg: el.firstChild, placed: false, wrong: 0 };
      el.addEventListener('pointerdown', (e) => pointerDown(e, piece));
      return piece;
    });

    state.selected = null;
    state.done = false;
    updateToggles();
    updateLabels();
    layout();
    updateProgress();
  }

  // Where everything goes. On a wide screen the Sun is at the left, the
  // places run to the right and the tray is below them; on a tall screen the
  // Sun is at the top, the places run down and the tray is to their right.
  // u runs away from the Sun, v across.
  function layout() {
    if (!state.slots.length) return;
    const W = area.clientWidth;
    const H = area.clientHeight;
    const hor = W >= H;
    const ps = state.slots.map((s) => s.p);
    const n = ps.length;
    const along = (p) => 2 * p.r * (hor ? p.wf : p.hf);
    const across = (p) => 2 * p.r * (hor ? p.hf : p.wf);

    const mainLen = hor ? W : H - TOP;
    const crossLen = hor ? H - TOP : W;
    const LB = hor ? 46 : 84; // room for the names
    const band = Math.max(...ps.map(across));
    const sumAlong = ps.reduce((a, p) => a + along(p), 0);
    const units = SUN + sumAlong + GAP * (n + 1);
    const s = Math.max(10, Math.min(
      (crossLen - LB - PAD * 3) / (band * (1 + TRAY)),
      (mainLen - PAD * 2) / units,
      120));
    // spread the places out when there is room to spare
    const extra = Math.max(0, mainLen - PAD * 2 - s * units);
    const gap = GAP * s + Math.min(extra / (n + 1), s);
    const trayGap = gap + ((1 - TRAY) * sumAlong * s) / n;

    const used = band * s * (1 + TRAY) + LB + PAD * 3;
    const off = Math.max(0, (crossLen - used) / 2);
    const u0 = (hor ? 0 : TOP) + PAD + SUN * s;
    const v1 = (hor ? TOP : 0) + off + PAD + (band * s) / 2;
    const v2 = v1 + (band * s) / 2 + LB + PAD + (band * TRAY * s) / 2;
    const at = (u, v) => (hor ? { x: u, y: v } : { x: v, y: u });

    const sunR = 3.2 * s;
    const sunU = u0 - sunR;
    const sun = at(sunU, v1);
    Object.assign($('sun').style, {
      left: sun.x - sunR + 'px', top: sun.y - sunR + 'px', width: 2 * sunR + 'px', height: 2 * sunR + 'px'
    });

    let u = u0 + gap;
    for (const slot of state.slots) {
      const p = slot.p;
      Object.assign(slot, at(u + (along(p) * s) / 2, v1));
      slot.w = 2 * p.r * p.wf * s;
      slot.h = 2 * p.r * p.hf * s;
      Object.assign(slot.el.style, {
        left: slot.x + 'px', top: slot.y + 'px', width: slot.w + 'px', height: slot.h + 'px'
      });
      slot.reach = Math.max(slot.w, slot.h) / 2 + 40;
      // the name just past the edge of the place
      const edge = v1 + (across(p) * s) / 2;
      slot.labelAt = hor ? { x: slot.x, y: edge + 4 } : { x: edge + 8, y: slot.y };
      u += along(p) * s + gap;
    }

    // the orbits: circles round the Sun through each place
    const bandPx = band * s + 16;
    const clip = hor
      ? `<rect x="0" y="${v1 - bandPx / 2}" width="${W}" height="${bandPx}" />`
      : `<rect x="${v1 - bandPx / 2}" y="0" width="${bandPx}" height="${H}" />`;
    $('orbits').innerHTML =
      `<defs><clipPath id="orbitClip">${clip}</clipPath></defs><g clip-path="url(#orbitClip)">` +
      state.slots.map((sl) => `<circle cx="${sun.x}" cy="${sun.y}" r="${Math.hypot(sl.x - sun.x, sl.y - sun.y)}" />`).join('') +
      '</g>';

    u = u0 + gap;
    for (const piece of state.pieces) {
      const p = piece.p;
      const a = at(u + (along(p) * TRAY * s) / 2, v2);
      piece.tx = a.x;
      piece.ty = a.y;
      piece.w = 2 * p.r * p.wf * s;
      piece.h = 2 * p.r * p.hf * s;
      piece.svg.style.width = piece.w + 'px';
      piece.svg.style.height = piece.h + 'px';
      u += along(p) * TRAY * s + trayGap;
    }

    state.L = { hor };
    state.pieces.forEach((pc) => { if (pc !== (state.drag && state.drag.piece)) home(pc); });
    arrangeLabels();
  }

  // Put a planet in its place, or back in the tray.
  function home(piece) {
    const slot = state.slots[piece.i];
    const at = piece.placed ? slot : { x: piece.tx, y: piece.ty };
    moveTo(piece, at.x, at.y, piece.placed ? 1 : TRAY);
  }

  function moveTo(piece, x, y, k) {
    piece.x = x;
    piece.y = y;
    piece.el.style.left = x + 'px';
    piece.el.style.top = y + 'px';
    piece.el.style.width = Math.max(MIN_HIT, piece.w * k) + 'px';
    piece.el.style.height = Math.max(MIN_HIT, piece.h * k) + 'px';
    piece.svg.style.transform = `translate(-50%, -50%) scale(${k})`;
  }

  // The place's number, or the planet's name once it is there.
  function updateLabels() {
    for (const slot of state.slots) {
      slot.label.textContent = slot.filled ? slot.p.name[Astro.lang] : String(slot.i + 1);
      slot.label.classList.toggle('named', slot.filled);
    }
    arrangeLabels();
  }

  // Names that would run into the one before go on a second line.
  function arrangeLabels() {
    if (!state.L) return;
    const hor = state.L.hor;
    let right = [-Infinity, -Infinity];
    for (const slot of state.slots) {
      const el = slot.label;
      const at = slot.labelAt;
      if (!at) continue;
      el.classList.toggle('side', !hor);
      let line = 0;
      if (hor) {
        const w = el.offsetWidth;
        line = at.x - w / 2 >= right[0] + 6 ? 0 : 1;
        right[line] = at.x + w / 2;
      }
      el.style.left = at.x + 'px';
      el.style.top = at.y + line * 20 + 'px';
    }
  }

  // ---------------------------------------------------------------------------
  // Dragging and tapping
  // ---------------------------------------------------------------------------

  function local(e) {
    const r = area.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function pointerDown(e, piece) {
    if (piece.placed || state.done || state.drag) return;
    e.preventDefault();
    piece.el.setPointerCapture(e.pointerId);
    const at = local(e);
    state.drag = { piece, id: e.pointerId, sx: at.x, sy: at.y, ox: piece.x - at.x, oy: piece.y - at.y, moved: false };
  }

  area.addEventListener('pointermove', (e) => {
    const d = state.drag;
    if (!d || d.id !== e.pointerId) return;
    const at = local(e);
    if (!d.moved) {
      if (Math.hypot(at.x - d.sx, at.y - d.sy) < 8) return;
      d.moved = true;
      select(null);
      d.piece.el.classList.add('dragging');
      sfx.pick();
      say(d.piece.p.name[Astro.lang], 1500);
    }
    moveTo(d.piece, at.x + d.ox, at.y + d.oy, 1);
  });

  area.addEventListener('pointerup', (e) => {
    const d = state.drag;
    if (!d || d.id !== e.pointerId) return;
    endDrag();
    if (!d.moved) {
      // a tap picks the planet up; a tap on a place then puts it there
      select(state.selected === d.piece ? null : d.piece);
      if (state.selected) {
        sfx.pick();
        say(d.piece.p.name[Astro.lang], 1500);
      }
      return;
    }
    // the nearest empty place within reach
    let best = null;
    let bestD = Infinity;
    for (const slot of state.slots) {
      if (slot.filled) continue;
      const dist = Math.hypot(slot.x - d.piece.x, slot.y - d.piece.y);
      if (dist < slot.reach && dist < bestD) {
        best = slot;
        bestD = dist;
      }
    }
    if (best) tryPlace(d.piece, best);
    else home(d.piece);
  });

  area.addEventListener('pointercancel', (e) => {
    const d = state.drag;
    if (!d || d.id !== e.pointerId) return;
    endDrag();
    home(d.piece);
  });

  // a tap on an empty spot puts down the planet that was picked up
  area.addEventListener('click', (e) => {
    if (e.target === area || e.target.closest('.orbits, .sun')) select(null);
  });

  function endDrag() {
    if (!state.drag) return;
    state.drag.piece.el.classList.remove('dragging');
    state.drag = null;
  }

  function select(piece) {
    if (state.selected) state.selected.el.classList.remove('selected');
    state.selected = piece;
    if (piece) piece.el.classList.add('selected');
  }

  function tryPlace(piece, slot) {
    select(null);
    if (slot.filled) return;
    const name = piece.p.name[Astro.lang];
    if (slot.i === piece.i) {
      piece.placed = true;
      slot.filled = true;
      piece.el.classList.add('placed');
      slot.el.classList.add('filled');
      slot.el.classList.remove('pulse');
      home(piece);
      sfx.snap();
      setTimeout(() => sfx.note(slot.i), 160);
      say(`${slot.i + 1}. ${name}. ${piece.p.fact[Astro.lang]}`, 5000);
      updateLabels();
      updateProgress();
      if (state.slots.every((s) => s.filled)) win();
      return;
    }
    // a wrong place: say which way to look, and after two misses show it
    piece.wrong++;
    sfx.oops();
    slot.el.classList.remove('wiggle');
    void slot.el.offsetWidth; // restart the animation
    slot.el.classList.add('wiggle');
    home(piece);
    say(t(piece.i > slot.i ? 'farther' : 'closer')(name), 2500);
    if (piece.wrong >= 2) state.slots[piece.i].el.classList.add('pulse');
  }

  function say(text, ms) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => el.classList.remove('show'), ms);
  }

  function updateProgress() {
    const n = state.slots.length;
    const k = state.slots.filter((s) => s.filled).length;
    $('progressFill').style.width = (100 * k) / n + '%';
    $('progressText').textContent = `🪐 ${k} / ${n}`;
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
    $('hintBtn').classList.toggle('off', !state.hint);
    area.classList.toggle('hint', state.hint);
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  function showWinRow() {
    $('winPic').innerHTML = rowSVG(state.slots.map((s) => s.p), true).svg;
  }

  function win() {
    state.done = true;
    if (!state.finished.includes(state.n)) {
      state.finished.push(state.n);
      store.set('finished', state.finished);
    }
    setTimeout(() => sfx.win(), 900);
    setTimeout(() => {
      if (!state.done || $('game').classList.contains('hidden')) return;
      showWinRow();
      $('winText').textContent = `${t('win')(state.n)} ${t('winFact')[state.n]}`;
      $('win').classList.remove('hidden');
      Astro.startConfetti($('confetti'));
    }, 2600);
  }

  // ---------------------------------------------------------------------------
  // Buttons & resizing
  // ---------------------------------------------------------------------------

  new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden')) layout();
  }).observe(area);

  $('playBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', startGame);
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('hintBtn').addEventListener('click', () => {
    state.hint = !state.hint;
    store.set('hint', state.hint);
    updateToggles();
    sfx.pick();
  });
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  buildMenu();
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    updateLabels();
    if (!$('win').classList.contains('hidden')) {
      showWinRow();
      $('winText').textContent = `${t('win')(state.n)} ${t('winFact')[state.n]}`;
    }
  });
})();
