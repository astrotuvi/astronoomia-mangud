'use strict';

(() => {
  const { $, rand, clamp, sfx } = Astro;
  const { drawMars, drawEarth } = AstroPlanets;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // Where to jump. g is how strongly the world pulls (m/s², on Jupiter at
  // the top of the clouds), pic its picture and fill how much of the picture
  // the planet fills (as in the clip paths in index.html). Photos by Tõrva
  // Astronoomiaklubi (AstroBin, CC BY-NC-SA); Mars and the Earth are drawn.
  const WORLDS = [
    {
      id: 'earth',
      g: 9.81,
      pic: null,
      fill: 0.99,
      color: '#4fa3ff',
      dust: '#c9b48a',
      name: { et: 'Maa', en: 'The Earth' },
      to: { et: 'Maale', en: 'the Earth' },
      fact: {
        et: 'Maa tõmbab kõike enda poole. Seda nimetatakse raskusjõuks. Seepärast kukud pärast hüpet alati tagasi maha.',
        en: 'The Earth pulls everything towards it. This pull is called gravity. That is why you always come back down after a jump.'
      }
    },
    {
      id: 'moon',
      g: 1.62,
      pic: '../pusle/images/moon.jpg',
      fill: 0.89,
      color: '#d6deea',
      dust: '#b8b8be',
      name: { et: 'Kuu', en: 'The Moon' },
      to: { et: 'Kuule', en: 'the Moon' },
      fact: {
        et: 'Kuu on Maast palju väiksem ja tõmbab kuus korda nõrgemalt. Seal hüppad kuus korda kõrgemale ja tuled aeglaselt alla. Astronaudid hüppasid Kuul nagu kängurud!',
        en: 'The Moon is much smaller than the Earth and pulls six times more weakly. There you jump six times higher and float slowly back down. Astronauts hopped on the Moon like kangaroos!'
      }
    },
    {
      id: 'mars',
      g: 3.71,
      pic: null,
      fill: 0.8,
      color: '#ff7a3d',
      dust: '#d9784a',
      name: { et: 'Marss', en: 'Mars' },
      to: { et: 'Marsile', en: 'Mars' },
      fact: {
        et: 'Marss on Maast väiksem ja tõmbab peaaegu kolm korda nõrgemalt. Seal hüppad peaaegu kolm korda kõrgemale kui Maal.',
        en: 'Mars is smaller than the Earth and pulls almost three times more weakly. There you jump almost three times higher than on the Earth.'
      }
    },
    {
      id: 'jupiter',
      g: 24.79,
      pic: '../pusle/images/jupiter.jpg',
      fill: 0.8,
      color: '#e8c08a',
      dust: '#f3ead6',
      name: { et: 'Jupiter', en: 'Jupiter' },
      to: { et: 'Jupiterile', en: 'Jupiter' },
      fact: {
        et: 'Jupiter on Maast palju suurem ja tõmbab üle kahe korra tugevamalt. Seal saad vaevu hüpata! Päriselt pole Jupiteril maapinda, ainult pilved, nii et seal seista ei saaks.',
        en: 'Jupiter is much bigger than the Earth and pulls more than twice as strongly. There you can hardly jump at all! In fact Jupiter has no ground, only clouds, so you could not really stand there.'
      }
    }
  ];

  const WHOS = ['🐱', '🐶', '🐻', '🐰', '🧑‍🚀'];

  const TEXT = {
    et: {
      title: 'Hüppa planeedil',
      intro: 'Kui kõrgele saad hüpata Kuul, Marsil või Jupiteril? Hüppa ja püüa igal taevakehal täht kinni!',
      chooseWho: 'Kes hüppab?',
      play: 'Hüppa',
      catchIt: 'Hüppa ja püüa täht!',
      caught: 'Täht on käes! ⭐',
      flyTo: (to) => `🚀 Lenda ${to}`,
      finish: '🏆 Vaata, kui kõrgele hüppasid',
      wellDone: 'Tubli!',
      winText: (who) => `${who} hüppas Kuul kuus korda kõrgemale kui Maal! Mida nõrgemalt taevakeha sind enda poole tõmbab, seda kõrgemale saad hüpata.`,
      again: 'Uuesti',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      sound: 'Heli',
      credit: 'Fotod: Tõrva Astronoomiaklubi, litsents CC BY-NC-SA.'
    },
    en: {
      title: 'Planet Jump',
      intro: 'How high can you jump on the Moon, Mars or Jupiter? Jump and catch the star on every world!',
      chooseWho: 'Who is jumping?',
      play: 'Jump',
      catchIt: 'Jump and catch the star!',
      caught: 'Got the star! ⭐',
      flyTo: (to) => `🚀 Fly to ${to}`,
      finish: '🏆 See how high you jumped',
      wellDone: 'Well done!',
      winText: (who) => `${who} jumped six times higher on the Moon than on the Earth! The more weakly a world pulls you towards it, the higher you can jump.`,
      again: 'Again',
      menu: 'Menu',
      allGames: 'All games',
      sound: 'Sound',
      credit: 'Photos: Tõrva Astronoomiaklubi, licence CC BY-NC-SA.'
    }
  };

  // The jumper leaves the ground equally fast everywhere, so only the pull
  // of the world changes how high and how long the jump is: on the Earth
  // 0.34 m in half a second, on the Moon 2.1 m in more than three seconds.
  const SPEED = 2.6;      // m/s
  const BODY = 0.9;       // m, how tall the jumper is
  const VIEW = 2.2;       // m of sky above the ground, before the view follows the jumper up
  const POLE = 2.6;       // m, how tall the measuring pole is
  const HINT_MS = 4000;   // idle time before the hand shows where to tap

  const height = (w) => (SPEED * SPEED) / (2 * w.g);
  // where the star hangs: just below the top of the jumper's head at the
  // highest point
  const starHeight = (w) => BODY + 0.95 * height(w);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('hupe.');
  const state = {
    who: WHOS.includes(store.get('who', '')) ? store.get('who', '') : WHOS[0],
    world: WORLDS[0],
    caught: [],     // the worlds whose star is caught
    best: {},       // the highest jump on each world, m
    air: false,
    t: 0,           // time since the jump began, s
    y: 0,           // height of the feet above the ground, m
    vy: 0,
    squash: 0,      // 1 just after landing, then down to 0
    factDue: false, // the star is caught, so the fact shows after landing
    cam: 0,         // how far up the view has moved, m
    parts: [],      // dust and star sparkles
    raf: 0,
    last: 0,
    hintTimer: 0,
    L: null,        // layout, see layout()
    gen: 0          // bumped when a game starts or ends, to stop old timers
  };

  const area = $('area');
  const scene = $('scene');
  const t = (key) => TEXT[Astro.lang][key];

  // The pictures of the worlds. Mars is drawn at once, the Earth in the
  // background, so it shows up a moment later.
  const pics = { moon: WORLDS[1].pic, jupiter: WORLDS[3].pic, mars: drawMars(300), earth: '' };

  // A world as a ball: a 100-unit picture cropped round, for inside an svg.
  function ballSVG(w, attrs = '') {
    const f = w.fill;
    const vb = `${50 - 50 * f} ${50 - 50 * f} ${100 * f} ${100 * f}`;
    return `<svg ${attrs} viewBox="${vb}"><circle cx="50" cy="50" r="${49 * f}" fill="${w.color}"/>` +
      `<image class="pic-${w.id}" href="${pics[w.id]}" width="100" height="100" preserveAspectRatio="none" clip-path="url(#clip-${w.id})"/></svg>`;
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
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
    WORLDS.forEach((w) => {
      const b = document.createElement('button');
      b.className = 'world-btn';
      b.innerHTML = ballSVG(w);
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        goTo(w);
      });
      b.addEventListener('pointerdown', (e) => e.stopPropagation());
      $('worlds').appendChild(b);
    });
  }

  function updateMenu() {
    [...$('whos').children].forEach((b, i) => b.classList.toggle('selected', WHOS[i] === state.who));
  }

  function stopAll() {
    state.gen++;
    clearTimeout(state.hintTimer);
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
    $('jumper').textContent = state.who;
    state.caught = [];
    state.best = {};
    arrive(WORLDS[0]);
  }

  function arrive(w) {
    state.world = w;
    state.air = false;
    state.y = state.vy = state.t = state.squash = state.cam = 0;
    state.parts = [];
    state.factDue = false;
    $('fact').classList.add('hidden');
    layout();
    updateTexts();
    updateBar();
    poke();
  }

  // Fly to another world: the scene fades out and in.
  function goTo(w) {
    if (w === state.world || area.classList.contains('travel')) return;
    sfx.pick();
    const gen = state.gen;
    area.classList.add('travel');
    setTimeout(() => {
      if (gen !== state.gen) return;
      cancelAnimationFrame(state.raf);
      state.raf = 0;
      arrive(w);
      area.classList.remove('travel');
    }, 260);
  }

  // Sizes in pixels: the ground line, metres to pixels and where the
  // jumper and the pole stand.
  function layout() {
    const W = area.clientWidth;
    const H = area.clientHeight;
    if (!W || !H) return;
    const G = Math.round(H * 0.74);
    const top = 70;  // room for the caption
    const k = Math.max(30, (G - top) / VIEW);
    const cx = W / 2;
    const px = Math.max(26, cx - 1.3 * k);
    state.L = { W, H, G, k, cx, px, star: clamp(0.13 * k, 14, 40) };
    drawScene();
    place();
  }

  // a repeatable random sequence, so a world looks the same after resizing
  function seeded(seed) {
    return () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  }

  function starPath(x, y, r) {
    let d = '';
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.45 : r;
      const a = (i * Math.PI) / 5;
      d += `${i ? 'L' : 'M'}${(x + rr * Math.sin(a)).toFixed(1)} ${(y - rr * Math.cos(a)).toFixed(1)}`;
    }
    return d + 'Z';
  }

  // What is far away (the Sun, the Earth in the Moon's sky, …), in screen
  // pixels; it moves only a little when the view follows the jumper.
  function farSVG(id, W, H, G) {
    const m = Math.min(W, H);
    const rnd = seeded(11);
    let s = '';
    if (id === 'earth') {
      const r = m * 0.06;
      s += `<circle cx="${W * 0.86}" cy="${H * 0.17}" r="${r * 2.4}" fill="url(#sunGlow)"/>` +
        `<circle cx="${W * 0.86}" cy="${H * 0.17}" r="${r}" fill="url(#sunGrad)"/>`;
      [[0.18, 0.2, 1], [0.6, 0.34, 0.75]].forEach(([x, y, f]) => {
        const c = m * 0.05 * f;
        s += `<g fill="#fff" opacity="0.9"><ellipse cx="${W * x}" cy="${H * y}" rx="${c * 2.2}" ry="${c}"/>` +
          `<circle cx="${W * x - c * 0.7}" cy="${H * y - c * 0.5}" r="${c}"/><circle cx="${W * x + c * 0.6}" cy="${H * y - c * 0.7}" r="${c * 1.2}"/></g>`;
      });
    } else if (id === 'moon' || id === 'jupiter') {
      for (let i = 0; i < 70; i++) {
        s += `<circle cx="${(rnd() * W).toFixed(1)}" cy="${(rnd() * G * 0.85).toFixed(1)}" r="${(0.6 + rnd() * 1.1).toFixed(1)}" fill="#fff" opacity="${(0.3 + rnd() * 0.6).toFixed(2)}"/>`;
      }
      if (id === 'moon') {
        // the Earth in the Moon's sky
        s += `<g transform="translate(${W * 0.82} ${H * 0.2})">${ballSVG(WORLDS[0], `x="${-m * 0.07}" y="${-m * 0.07}" width="${m * 0.14}" height="${m * 0.14}"`)}</g>`;
      } else {
        // two of Jupiter's moons: Io and Europa
        s += `<circle cx="${W * 0.2}" cy="${H * 0.22}" r="${m * 0.018}" fill="#f2d35b"/>` +
          `<circle cx="${W * 0.78}" cy="${H * 0.14}" r="${m * 0.013}" fill="#e9e4da"/>`;
      }
    } else {
      // Mars: a small, pale Sun, as it is farther away
      s += `<circle cx="${W * 0.8}" cy="${H * 0.18}" r="${m * 0.07}" fill="url(#sunGlow)" opacity="0.7"/>` +
        `<circle cx="${W * 0.8}" cy="${H * 0.18}" r="${m * 0.03}" fill="#fff8e0"/>`;
    }
    return s;
  }

  // The ground of each world, from the ground line down.
  function groundSVG(id, W, H, G) {
    const rnd = seeded(id.length * 97 + 5);
    const D = H * 1.6;  // deep enough for when the view moves up
    const wavy = (y, amp, n) => {
      let d = `M0 ${y}`;
      for (let i = 1; i <= n; i++) d += ` Q${((i - 0.5) * W) / n} ${y - amp * (0.5 + rnd())} ${(i * W) / n} ${y}`;
      return d + ` L${W} ${G + D} L0 ${G + D}Z`;
    };
    let s = '';
    if (id === 'earth') {
      s += `<path d="${wavy(G - H * 0.04, H * 0.08, 3)}" fill="#7cc46a"/>`;
      s += `<rect y="${G}" width="${W}" height="${D}" fill="#4caf43"/><rect y="${G}" width="${W}" height="4" fill="#6fd25e"/>`;
      for (let i = 0; i < 14; i++) {
        const x = rnd() * W;
        const y = G + 14 + rnd() * (H - G - 20);
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${['#fff', '#ffd34d', '#ff7eb6'][i % 3]}"/>`;
      }
    } else if (id === 'moon') {
      s += `<path d="${wavy(G + 2, H * 0.03, 4)}" fill="#8e8e95"/><rect y="${G}" width="${W}" height="3" fill="#b8b8be"/>`;
      for (let i = 0; i < 12; i++) {
        const x = rnd() * W;
        const y = G + 10 + rnd() * (H - G - 14);
        const rx = 8 + rnd() * 34 * ((y - G) / (H - G) + 0.4);
        s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx * 0.28).toFixed(1)}" fill="#76767d" stroke="#b5b5bb" stroke-width="2"/>`;
      }
    } else if (id === 'mars') {
      s += `<path d="${wavy(G - H * 0.03, H * 0.1, 2)}" fill="#a5532f"/>`;
      s += `<rect y="${G}" width="${W}" height="${D}" fill="#b85a2e"/><rect y="${G}" width="${W}" height="3" fill="#d27848"/>`;
      for (let i = 0; i < 16; i++) {
        const x = rnd() * W;
        const y = G + 8 + rnd() * (H - G - 12);
        const r = 3 + rnd() * 9;
        s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * 0.6).toFixed(1)}" fill="#6e2e16"/>`;
      }
    } else {
      // Jupiter's cloud tops, in bands
      const bands = ['#efe2c6', '#c99466', '#f3ead6', '#b5784c', '#e6d2ae', '#a8683f', '#efe2c6'];
      let y = G;
      bands.forEach((c, i) => {
        s += `<path d="${wavy(y, 6 + i * 2, 3 + i)}" fill="${c}"/>`;
        y += 6 + i * 9;
      });
    }
    return s;
  }

  function drawScene() {
    const { W, H, G, k, px } = state.L;
    const w = state.world;
    // the pole, with a mark every half metre
    let pole = `<line x1="${px}" y1="${G}" x2="${px}" y2="${G - POLE * k}" stroke="rgba(255,255,255,0.55)" stroke-width="8" stroke-linecap="round"/>`;
    for (let m = 0.5; m <= POLE; m += 0.5) {
      pole += `<line x1="${px - 7}" y1="${G - m * k}" x2="${px + 7}" y2="${G - m * k}" stroke="rgba(255,255,255,0.55)" stroke-width="2"/>`;
    }
    scene.setAttribute('viewBox', `0 0 ${W} ${H}`);
    scene.innerHTML =
      `<rect width="${W}" height="${H}" fill="url(#sky-${w.id})"/>` +
      `<g id="far">${farSVG(w.id, W, H, G)}</g>` +
      `<g id="near">${groundSVG(w.id, W, H, G)}${pole}` +
      `<line id="poleFill" x1="${px}" y1="${G}" x2="${px}" y2="${G}" stroke="${w.color}" stroke-width="8" stroke-linecap="round"/>` +
      '<g id="marks"></g><ellipse id="shadow" fill="#000"/>' +
      `<path id="star" fill="#ffd34d" stroke="#fff7c2" stroke-width="2" stroke-linejoin="round" d="${starPath(state.L.cx, G - starHeight(w) * k, state.L.star)}"/>` +
      '<g id="partsL"></g></g>';
    const jumper = $('jumper');
    jumper.style.fontSize = BODY * k + 'px';
    jumper.style.width = BODY * k * 1.2 + 'px';
    drawMarks();
  }

  // the highest jump on each world, as a little picture of the world beside the pole
  function drawMarks() {
    const { G, k, px } = state.L;
    const s = clamp(0.16 * k, 18, 30);
    scene.querySelector('#marks').innerHTML = WORLDS.filter((w) => state.best[w.id]).map((w) => {
      const y = G - state.best[w.id] * k;
      return `<line x1="${px}" y1="${y}" x2="${px + 14}" y2="${y}" stroke="${w.color}" stroke-width="3"/>` +
        ballSVG(w, `x="${px + 14}" y="${y - s / 2}" width="${s}" height="${s}"`);
    }).join('');
  }

  // Put everything that moves in its place.
  function place() {
    const L = state.L;
    if (!L) return;
    const { G, k, cx } = L;
    const w = state.world;
    const Y = (m) => G - (m - state.cam) * k;   // height in metres to screen pixels
    scene.querySelector('#near').setAttribute('transform', `translate(0 ${state.cam * k})`);
    scene.querySelector('#far').setAttribute('transform', `translate(0 ${state.cam * k * 0.15})`);
    scene.querySelector('#poleFill').setAttribute('y2', G - Math.min(state.y, POLE) * k);

    const sh = 1 / (1 + 1.2 * state.y);
    const shadow = scene.querySelector('#shadow');
    shadow.setAttribute('cx', cx);
    shadow.setAttribute('cy', G + 0.03 * k);
    shadow.setAttribute('rx', 0.34 * k * sh);
    shadow.setAttribute('ry', 0.07 * k * sh);
    shadow.setAttribute('opacity', 0.35 * sh);

    // a star above the view, or behind the caption, shows as an arrow instead
    const caught = state.caught.includes(w.id);
    const high = Y(starHeight(w)) < 70;
    scene.querySelector('#star').style.display = caught || high ? 'none' : '';
    const up = $('starUp');
    up.classList.toggle('hidden', caught || !high);
    up.style.left = cx + 'px';

    // stretched while moving fast, squashed just after landing
    let sx = 1;
    let sy = 1;
    if (state.air) {
      sy = 1 + 0.12 * Math.min(1, Math.abs(state.vy) / SPEED);
      sx = 1 / sy;
    } else if (state.squash > 0) {
      sy = 1 - 0.22 * state.squash;
      sx = 1 + 0.18 * state.squash;
    }
    const jumper = $('jumper');
    const s = BODY * k;
    jumper.style.transform = `translate(${cx - s * 0.6}px, ${Y(state.y + BODY)}px) scale(${sx}, ${sy})`;
    const tap = $('tap');
    tap.style.transform = `translate(${cx + s * 0.45}px, ${G - s * 0.3}px)`;

    $('partsL').innerHTML = state.parts.map((p) =>
      `<circle cx="${(cx + p.x * k).toFixed(1)}" cy="${(G - p.y * k).toFixed(1)}" r="${Math.max(2, p.r * k).toFixed(1)}" fill="${p.c}"/>`
    ).join('');
  }

  // ---------------------------------------------------------------------------
  // Jumping
  // ---------------------------------------------------------------------------

  function jump() {
    if (state.air || $('game').classList.contains('hidden') || !$('win').classList.contains('hidden') ||
      area.classList.contains('travel')) return;
    state.air = true;
    state.t = 0;
    state.vy = SPEED;
    $('tap').classList.add('hidden');
    sfx.jump(SPEED / state.world.g);
    run();
    poke();
  }

  function run() {
    if (state.raf) return;
    state.last = performance.now();
    state.raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    // the first frame's time can be a little before the jump began
    const dt = clamp((now - state.last) / 1000, 0, 0.05);
    state.last = now;
    const w = state.world;
    if (state.air) {
      state.t += dt;
      const T = (2 * SPEED) / w.g;
      if (state.t >= T) land();
      else {
        state.y = SPEED * state.t - (w.g * state.t * state.t) / 2;
        state.vy = SPEED - w.g * state.t;
      }
      if (state.y > (state.best[w.id] || 0)) state.best[w.id] = state.y;
      const head = state.y + BODY;
      if (!state.caught.includes(w.id) && head >= starHeight(w) - (0.6 * state.L.star) / state.L.k) catchStar();
      // the view follows the jumper's head up
      state.cam = Math.max(0, head + 0.3 - VIEW);
    } else {
      state.squash = Math.max(0, state.squash - dt / 0.22);
    }
    state.parts.forEach((p) => {
      p.vy -= w.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    });
    state.parts = state.parts.filter((p) => p.y > 0);
    place();
    if (state.air || state.squash > 0 || state.parts.length) state.raf = requestAnimationFrame(frame);
    else state.raf = 0;
  }

  function land() {
    const w = state.world;
    state.air = false;
    state.y = state.vy = state.cam = 0;
    state.squash = 1;
    sfx.land();
    // a puff of dust, which flies far where the pull is weak
    for (let i = 0; i < 12; i++) {
      const side = i % 2 ? 1 : -1;
      state.parts.push({ x: side * rand(0.1, 0.35), y: 0.01, vx: side * rand(0.3, 1.1), vy: rand(0.5, 1.5), r: rand(0.015, 0.035), c: w.dust });
    }
    drawMarks();
    // what was learnt, once the jumper is back on the ground
    if (state.factDue) {
      state.factDue = false;
      const gen = state.gen;
      setTimeout(() => {
        if (gen !== state.gen || state.world !== w) return;
        if (state.air) state.factDue = true;
        else showFact();
      }, 400);
    }
  }

  function catchStar() {
    const w = state.world;
    state.caught.push(w.id);
    sfx.snap();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const v = rand(0.8, 1.6);
      state.parts.push({ x: 0, y: starHeight(w), vx: v * Math.cos(a), vy: v * Math.sin(a) + 0.5, r: 0.035, c: '#ffd34d' });
    }
    updateBar();
    updateTexts();
    state.factDue = true;
  }

  function nextWorld() {
    return WORLDS.find((w) => !state.caught.includes(w.id));
  }

  function showFact() {
    const lang = Astro.lang;
    const w = state.world;
    const next = nextWorld();
    $('factText').textContent = w.fact[lang];
    $('nextBtn').textContent = next ? TEXT[lang].flyTo(next.to[lang]) : t('finish');
    $('fact').classList.remove('hidden');
    clearTimeout(state.hintTimer);
  }

  // after a few seconds with no jump, a hand shows where to tap
  function poke() {
    clearTimeout(state.hintTimer);
    $('tap').classList.add('hidden');
    const gen = state.gen;
    state.hintTimer = setTimeout(() => {
      if (gen !== state.gen || state.air || !$('fact').classList.contains('hidden')) return;
      $('tap').classList.remove('hidden');
    }, HINT_MS);
  }

  function updateTexts() {
    const w = state.world;
    $('worldName').textContent = w.name[Astro.lang];
    $('worldTip').textContent = t(state.caught.includes(w.id) ? 'caught' : 'catchIt');
    if (!$('fact').classList.contains('hidden')) showFact();
  }

  function updateBar() {
    const n = state.caught.length;
    $('progressFill').style.width = (100 * n) / WORLDS.length + '%';
    $('progressText').textContent = `⭐ ${n} / ${WORLDS.length}`;
    [...$('worlds').children].forEach((b, i) => {
      const w = WORLDS[i];
      b.classList.toggle('now', w === state.world);
      b.classList.toggle('done', state.caught.includes(w.id));
      b.setAttribute('aria-label', w.name[Astro.lang]);
    });
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  // The four jumps side by side, at the same scale.
  function drawChart() {
    const G = 222;
    const top = Math.max(...WORLDS.map(height)) + BODY;
    const k = (G - 16) / top;
    const size = BODY * k;
    $('winChart').innerHTML = WORLDS.map((w, i) => {
      const x = 50 + i * 100;
      const y = G - height(w) * k;
      return `<rect x="${x - 46}" y="${G}" width="92" height="8" rx="4" fill="${w.color}"/>` +
        `<line x1="${x}" y1="${G}" x2="${x}" y2="${y}" stroke="${w.color}" stroke-width="3" stroke-dasharray="4 5"/>` +
        `<ellipse cx="${x}" cy="${G + 2}" rx="${size * 0.3}" ry="4" fill="#000" opacity="0.4"/>` +
        `<text x="${x}" y="${y - size * 0.12}" font-size="${size}" text-anchor="middle">${state.who}</text>` +
        ballSVG(w, `x="${x - 24}" y="${G + 16}" width="48" height="48"`);
    }).join('');
  }

  function win() {
    stopAll();
    sfx.win();
    drawChart();
    $('winText').textContent = TEXT[Astro.lang].winText(state.who);
    $('win').classList.remove('hidden');
    Astro.startConfetti($('confetti'));
  }

  // ---------------------------------------------------------------------------
  // Buttons & resizing
  // ---------------------------------------------------------------------------

  new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden')) layout();
  }).observe(area);

  area.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.fact, .worlds')) return;
    jump();
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'ArrowUp') && !$('game').classList.contains('hidden')) {
      e.preventDefault();
      jump();
    }
  });
  $('nextBtn').addEventListener('click', () => {
    const next = nextWorld();
    $('fact').classList.add('hidden');
    if (next) goTo(next);
    else win();
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

  buildMenu();
  updateToggles();
  setTimeout(() => drawEarth(400, (url) => {
    pics.earth = url;
    document.querySelectorAll('image.pic-earth').forEach((im) => im.setAttribute('href', url));
  }), 100);
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    if (!$('game').classList.contains('hidden')) {
      updateTexts();
      updateBar();
    }
    if (!$('win').classList.contains('hidden')) $('winText').textContent = TEXT[Astro.lang].winText(state.who);
  });
})();
