'use strict';

(() => {
  const { $, rand, clamp, sfx } = Astro;
  const { drawMars, drawEarth, drawPlanet } = AstroPlanets;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // Where to jump. g is how strongly the world pulls (m/s², on Jupiter at
  // the top of the clouds), pic its picture and fill how much of the picture
  // the planet fills (as in the clip paths in index.html). Photos by Tõrva
  // Astronoomiaklubi (AstroBin, CC BY-NC-SA); Mars, the Earth and Ceres are
  // drawn.
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
    },
    {
      id: 'ceres',
      g: 0.28,
      pic: null,
      fill: 0.99,
      color: '#8f8a84',
      dust: '#77726c',
      name: { et: 'Ceres', en: 'Ceres' },
      to: { et: 'Ceresele', en: 'Ceres' },
      fact: {
        et: 'Ceres on kääbusplaneet asteroidide vöös, Marsi ja Jupiteri vahel. See on Maast nii palju väiksem, et tõmbab 35 korda nõrgemalt. Seal hüppad kõrgemale kui maja ja oled õhus peaaegu 20 sekundit!',
        en: 'Ceres is a dwarf planet in the asteroid belt, between Mars and Jupiter. It is so much smaller than the Earth that it pulls 35 times more weakly. There you jump higher than a house and stay in the air for almost 20 seconds!'
      }
    }
  ];

  // Who can jump: a little figure standing with the arms up, drawn in a
  // 120 × 100 box with the feet at the bottom. `back` is drawn behind the
  // body and the head (tails, ears), `front` on top of the head (the face).
  const eyes =
    '<circle cx="52" cy="28" r="3.3" fill="#222"/><circle cx="68" cy="28" r="3.3" fill="#222"/>' +
    '<circle cx="53.2" cy="26.8" r="1.2" fill="#fff"/><circle cx="69.2" cy="26.8" r="1.2" fill="#fff"/>';
  const cheeks = '<circle cx="45" cy="36" r="3.6" fill="#ff8fa3" opacity="0.55"/><circle cx="75" cy="36" r="3.6" fill="#ff8fa3" opacity="0.55"/>';
  const smile = (y) => `<path d="M55 ${y}Q57.5 ${y + 3} 60 ${y}Q62.5 ${y + 3} 65 ${y}" stroke="#222" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  const WHOS = [
    {
      id: 'cat', name: { et: 'Kass', en: 'The cat' },
      fur: '#f2a541', light: '#ffe3bf', dark: '#c4741f',
      back: '<path d="M74 84Q95 86 92 64Q90 54 97 47" stroke="#f2a541" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<path d="M40 24L41 2L58 12Z" fill="#f2a541"/><path d="M80 24L79 2L62 12Z" fill="#f2a541"/>' +
        '<path d="M44 18L44.5 8L53 13Z" fill="#ffb3c1"/><path d="M76 18L75.5 8L67 13Z" fill="#ffb3c1"/>',
      front: '<path d="M56 9v6M60 8v7M64 9v6" stroke="#c4741f" stroke-width="2" stroke-linecap="round"/>' +
        '<ellipse cx="60" cy="38" rx="8" ry="5.5" fill="#ffe3bf"/>' + eyes + cheeks +
        '<path d="M57.5 34h5L60 37Z" fill="#ff7f96"/>' + smile(38.5) +
        '<path d="M48 36L37 34M48 39.5L37 41M72 36L83 34M72 39.5L83 41" stroke="#7a4a22" stroke-width="1.2" stroke-linecap="round"/>'
    },
    {
      id: 'dog', name: { et: 'Koer', en: 'The dog' },
      fur: '#c98a4b', light: '#f6e1c6', dark: '#7a4a22',
      back: '<path d="M75 78Q88 74 88 60" stroke="#c98a4b" stroke-width="7" fill="none" stroke-linecap="round"/>',
      front: '<ellipse cx="68" cy="27" rx="6.5" ry="6" fill="#7a4a22"/>' +
        '<ellipse cx="39" cy="30" rx="7" ry="14" fill="#7a4a22" transform="rotate(18 39 30)"/>' +
        '<ellipse cx="81" cy="30" rx="7" ry="14" fill="#7a4a22" transform="rotate(-18 81 30)"/>' +
        '<ellipse cx="60" cy="39" rx="10" ry="7" fill="#f6e1c6"/>' + eyes + cheeks +
        '<ellipse cx="60" cy="35" rx="4" ry="3" fill="#222"/>' +
        '<path d="M58 41h4v3a2 2 0 0 1-4 0Z" fill="#ff7f96"/>' + smile(40)
    },
    {
      id: 'bear', name: { et: 'Karu', en: 'The bear' },
      fur: '#a0703f', light: '#e2bf93', dark: '#5e3d1f',
      back: '<circle cx="42" cy="13" r="8" fill="#a0703f"/><circle cx="78" cy="13" r="8" fill="#a0703f"/>' +
        '<circle cx="42" cy="13" r="4.5" fill="#e2bf93"/><circle cx="78" cy="13" r="4.5" fill="#e2bf93"/>',
      front: '<circle cx="60" cy="38" r="8" fill="#e2bf93"/>' + eyes + cheeks +
        '<ellipse cx="60" cy="35" rx="3.6" ry="2.6" fill="#3a2410"/>' + smile(39)
    },
    {
      id: 'bunny', name: { et: 'Jänes', en: 'The bunny' },
      fur: '#f1eef5', light: '#ffd9e3', dark: '#b9b2c4',
      back: '<circle cx="78" cy="82" r="6.5" fill="#fff"/>' +
        '<ellipse cx="50" cy="-2" rx="6.5" ry="16" fill="#f1eef5" transform="rotate(-10 50 12)"/>' +
        '<ellipse cx="70" cy="-2" rx="6.5" ry="16" fill="#f1eef5" transform="rotate(10 70 12)"/>' +
        '<ellipse cx="50" cy="-1" rx="3" ry="11" fill="#ffc2d1" transform="rotate(-10 50 12)"/>' +
        '<ellipse cx="70" cy="-1" rx="3" ry="11" fill="#ffc2d1" transform="rotate(10 70 12)"/>',
      front: eyes + cheeks + '<path d="M58 34h4L60 36.5Z" fill="#ff7f96"/>' + smile(37) +
        '<rect x="58.2" y="38.5" width="3.6" height="4" rx="1" fill="#fff" stroke="#c9c2d4" stroke-width="0.6"/>'
    },
    {
      id: 'astronaut', name: { et: 'Astronaut', en: 'The astronaut' },
      fur: '#eef1f6', light: '#5b6b8a', dark: '#8a95a8',
      back: '<rect x="40" y="50" width="40" height="32" rx="6" fill="#8a95a8"/>',
      chest: '<rect x="52" y="62" width="16" height="11" rx="2.5" fill="#5b6b8a"/>' +
        '<circle cx="56.5" cy="67.5" r="2" fill="#ff5a6e"/><circle cx="63.5" cy="67.5" r="2" fill="#4cd07d"/>',
      front: '<ellipse cx="60" cy="31" rx="15.5" ry="12.5" fill="#2b3b6b"/>' +
        '<path d="M49 27Q52 21 59 20.5" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.7"/>'
    }
  ];

  function figure(c, attrs = '') {
    const belly = c.chest || `<ellipse cx="60" cy="71" rx="11" ry="12.5" fill="${c.light}"/>`;
    const paws = c.id === 'astronaut' ? c.dark : c.light;
    return `<svg ${attrs} viewBox="0 0 120 100" overflow="visible">${c.back}` +
      `<rect x="47" y="76" width="11" height="20" rx="5.5" fill="${c.fur}"/><rect x="62" y="76" width="11" height="20" rx="5.5" fill="${c.fur}"/>` +
      `<ellipse cx="51.5" cy="96" rx="8" ry="4" fill="${paws}"/><ellipse cx="68.5" cy="96" rx="8" ry="4" fill="${paws}"/>` +
      `<path d="M47 59L34 45M73 59L86 45" stroke="${c.fur}" stroke-width="9" stroke-linecap="round"/>` +
      `<circle cx="33" cy="43.5" r="5" fill="${paws}"/><circle cx="87" cy="43.5" r="5" fill="${paws}"/>` +
      `<ellipse cx="60" cy="68" rx="18" ry="20" fill="${c.fur}"/>${belly}` +
      `<circle cx="60" cy="30" r="22" fill="${c.fur}"/>${c.front}</svg>`;
  }

  const TEXT = {
    et: {
      title: 'Hüppa planeedil',
      intro: 'Kui kõrgele saad hüpata Kuul, Marsil, Jupiteril või kääbusplaneedil Ceresel? Hüppa ja püüa igal taevakehal täht kinni!',
      chooseWho: 'Kes hüppab?',
      play: 'Hüppa',
      catchIt: 'Hüppa ja püüa täht!',
      caught: 'Täht on käes! ⭐',
      flyTo: (to) => `🚀 Lenda ${to}`,
      finish: '🏆 Vaata, kui kõrgele hüppasid',
      wellDone: 'Tubli!',
      winText: (who) => `${who.name.et} hüppas Kuul kuus korda ja Ceresel 35 korda kõrgemale kui Maal! Mida nõrgemalt taevakeha sind enda poole tõmbab, seda kõrgemale saad hüpata.`,
      again: 'Uuesti',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      sound: 'Heli',
      credit: 'Fotod: Tõrva Astronoomiaklubi, litsents CC BY-NC-SA.'
    },
    en: {
      title: 'Planet Jump',
      intro: 'How high can you jump on the Moon, Mars, Jupiter or the dwarf planet Ceres? Jump and catch the star on every world!',
      chooseWho: 'Who is jumping?',
      play: 'Jump',
      catchIt: 'Jump and catch the star!',
      caught: 'Got the star! ⭐',
      flyTo: (to) => `🚀 Fly to ${to}`,
      finish: '🏆 See how high you jumped',
      wellDone: 'Well done!',
      winText: (who) => `${who.name.en} jumped six times higher on the Moon than on the Earth, and 35 times higher on Ceres! The more weakly a world pulls you towards it, the higher you can jump.`,
      again: 'Again',
      menu: 'Menu',
      allGames: 'All games',
      sound: 'Sound',
      credit: 'Photos: Tõrva Astronoomiaklubi, licence CC BY-NC-SA.'
    }
  };

  // The jumper leaves the ground equally fast everywhere, so only the pull
  // of the world changes how high and how long the jump is: on the Earth
  // 0.34 m in half a second, on the Moon 2.1 m in more than three seconds,
  // on Ceres 12 m in almost 20 seconds.
  const SPEED = 2.6;      // m/s
  const BODY = 0.9;       // m, how tall the jumper is
  const VIEW = 2.2;       // m of sky above the ground, before the view follows the jumper up
  const POLE = 2.6;       // m, how tall the measuring pole is, unless the jump is higher
  const HINT_MS = 4000;   // idle time before the hand shows where to tap

  const height = (w) => (SPEED * SPEED) / (2 * w.g);
  const poleOf = (w) => (height(w) > POLE ? Math.ceil(height(w) + 0.5) : POLE);
  // where the star hangs: just below the top of the jumper's head at the
  // highest point
  const starHeight = (w) => BODY + 0.95 * height(w);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('hupe.');
  const state = {
    who: WHOS.find((w) => w.id === store.get('who', '')) || WHOS[0],
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

  // The pictures of the worlds. Mars is drawn at once, the Earth and Ceres
  // in the background, so they show up a moment later.
  const pics = { moon: WORLDS[1].pic, jupiter: WORLDS[3].pic, mars: drawMars(300), earth: '', ceres: '' };

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
      b.innerHTML = figure(w);
      b.addEventListener('click', () => {
        state.who = w;
        store.set('who', w.id);
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
    // once every star is caught, the win screen can be seen again from here
    const f = document.createElement('button');
    f.id = 'finishBtn';
    f.className = 'world-btn finish hidden';
    f.textContent = '🏆';
    f.addEventListener('click', (e) => {
      e.stopPropagation();
      sfx.pick();
      win();
    });
    f.addEventListener('pointerdown', (e) => e.stopPropagation());
    $('worlds').appendChild(f);
  }

  function updateMenu() {
    [...$('whos').children].forEach((b, i) => {
      b.classList.toggle('selected', WHOS[i] === state.who);
      b.setAttribute('aria-label', WHOS[i].name[Astro.lang]);
    });
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
    $('jumper').innerHTML = figure(state.who);
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
    } else if (id === 'moon' || id === 'jupiter' || id === 'ceres') {
      // on Ceres the view goes far up, so the stars reach above the screen
      const above = id === 'ceres' ? H * 0.7 : 0;
      for (let i = 0; i < (id === 'ceres' ? 120 : 70); i++) {
        s += `<circle cx="${(rnd() * W).toFixed(1)}" cy="${(rnd() * (G * 0.85 + above) - above).toFixed(1)}" r="${(0.6 + rnd() * 1.1).toFixed(1)}" fill="#fff" opacity="${(0.3 + rnd() * 0.6).toFixed(2)}"/>`;
      }
      if (id === 'ceres') {
        // a small Sun, as Ceres is almost three times farther from it than the Earth
        s += `<circle cx="${W * 0.8}" cy="${H * 0.16}" r="${m * 0.05}" fill="url(#sunGlow)" opacity="0.6"/>` +
          `<circle cx="${W * 0.8}" cy="${H * 0.16}" r="${m * 0.02}" fill="#fff8e0"/>`;
      } else if (id === 'moon') {
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
    } else if (id === 'ceres') {
      // dark ground with craters, and bright salt in some of them
      s += `<path d="${wavy(G + 2, H * 0.05, 3)}" fill="#57534f"/><rect y="${G}" width="${W}" height="3" fill="#7d7873"/>`;
      for (let i = 0; i < 12; i++) {
        const x = rnd() * W;
        const y = G + 10 + rnd() * (H - G - 14);
        const rx = 8 + rnd() * 34 * ((y - G) / (H - G) + 0.4);
        s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${(rx * 0.28).toFixed(1)}" fill="#46433f" stroke="#76716c" stroke-width="2"/>`;
        if (i % 4 === 1) s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(rx * 0.35).toFixed(1)}" ry="${(rx * 0.1).toFixed(1)}" fill="#f2f2ea"/>`;
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
    const top = poleOf(w);
    let pole = `<line x1="${px}" y1="${G}" x2="${px}" y2="${G - top * k}" stroke="rgba(255,255,255,0.55)" stroke-width="8" stroke-linecap="round"/>`;
    for (let m = 0.5; m <= top; m += 0.5) {
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
    jumper.style.height = BODY * k + 'px';
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
    scene.querySelector('#poleFill').setAttribute('y2', G - Math.min(state.y, poleOf(w)) * k);

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
    WORLDS.forEach((w, i) => {
      const b = $('worlds').children[i];
      b.classList.toggle('now', w === state.world);
      b.classList.toggle('done', state.caught.includes(w.id));
      b.setAttribute('aria-label', w.name[Astro.lang]);
    });
    $('finishBtn').classList.toggle('hidden', n < WORLDS.length);
    $('finishBtn').setAttribute('aria-label', t('finish'));
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  // The jumps side by side, at the same scale. The jumpers are drawn
  // bigger than that, or they would be tiny beside the high jump on Ceres.
  function drawChart() {
    const G = 430;
    const size = 60;
    const k = (G - size - 6) / Math.max(...WORLDS.map(height));
    $('winChart').setAttribute('viewBox', `0 0 ${WORLDS.length * 100} 500`);
    $('winChart').innerHTML = WORLDS.map((w, i) => {
      const x = 50 + i * 100;
      const y = G - height(w) * k;
      return `<rect x="${x - 46}" y="${G}" width="92" height="8" rx="4" fill="${w.color}"/>` +
        `<line x1="${x}" y1="${G}" x2="${x}" y2="${y}" stroke="${w.color}" stroke-width="3" stroke-dasharray="4 5"/>` +
        `<ellipse cx="${x}" cy="${G + 2}" rx="${size * 0.3}" ry="4" fill="#000" opacity="0.4"/>` +
        figure(state.who, `x="${x - size * 0.6}" y="${y - size}" width="${size * 1.2}" height="${size}"`) +
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
  const show = (id, url) => {
    pics[id] = url;
    document.querySelectorAll(`image.pic-${id}`).forEach((im) => im.setAttribute('href', url));
  };
  setTimeout(() => drawEarth(400, (url) => {
    show('earth', url);
    drawPlanet('ceres', 300, ({ url }) => show('ceres', url));
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
