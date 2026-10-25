'use strict';

(() => {
  const { $, clamp, shuffle, sfx } = Astro;
  const { drawMars, drawEarth } = AstroPlanets;
  const DEG = Math.PI / 180;

  // ---------------------------------------------------------------------------
  // Content (the questions are in questions.js)
  // ---------------------------------------------------------------------------

  // The topics: all games together, or one game. Each links to its game on
  // the end screen, for questions answered wrong.
  const TOPICS = [
    { id: 'all', emoji: '🌌', name: { et: 'Kõik teemad', en: 'All topics' } },
    { id: 'kuufaasid', emoji: '🌙', name: { et: 'Kuu faasid', en: 'Moon Phases' }, href: '../kuufaasid/index.html' },
    { id: 'hupe', emoji: '🦘', name: { et: 'Hüppa planeedil', en: 'Planet Jump' }, href: '../hupe/index.html' },
    { id: 'rakett', emoji: '🚀', name: { et: 'Kosmoserakett', en: 'Space Rocket' }, href: '../rakett/index.html' },
    { id: 'planeedid', emoji: '🪐', name: { et: 'Planeetide rivi', en: 'Line Up the Planets' }, href: '../planeedid/index.html' },
    { id: 'meteoor', emoji: '🌠', name: { et: 'Püüa langev täht', en: 'Catch a Shooting Star' }, href: '../meteoor/index.html' },
    { id: 'tahtkujud', emoji: '✨', name: { et: 'Tähtkujud', en: 'Constellations' }, href: '../tahtkujud/index.html' },
    { id: 'eksoplaneet', emoji: '🔭', name: { et: 'Avasta eksoplaneet', en: 'Discover an Exoplanet' }, href: '../eksoplaneet/index.html' },
    { id: 'pildid', emoji: '🖼️', name: { et: 'Pildid', en: 'Pictures' }, href: '../malumang/index.html', game: { et: 'Mälumäng', en: 'Memory' } }
  ];

  const WHOS = ['🐱', '🐶', '🐻', '🐰', '🧑‍🚀'];

  // Stars of the constellations shown as pictures, from Tähtkujud:
  // [RA (deg, J2000), Dec (deg), visual magnitude].
  const CONS = {
    cassiopeia: [[2.29, 59.15, 2.3], [10.13, 56.54, 2.2], [14.18, 60.72, 2.2], [21.45, 60.24, 2.7], [28.60, 63.67, 3.4]],
    bigdipper: [[165.93, 61.75, 1.8], [165.46, 56.38, 2.4], [178.46, 53.69, 2.4], [183.86, 57.03, 3.3],
      [193.51, 55.96, 1.8], [200.98, 54.93, 2.2], [206.89, 49.31, 1.9]],
    orion: [[88.79, 7.41, 0.5], [83.78, 9.93, 3.4], [81.28, 6.35, 1.6], [83.00, -0.30, 2.2], [84.05, -1.20, 1.7],
      [85.19, -1.94, 1.8], [86.94, -9.67, 2.1], [78.63, -8.20, 0.1]],
    leo: [[152.09, 11.97, 1.4], [151.83, 16.76, 3.5], [154.99, 19.84, 2.0], [154.17, 23.42, 3.4], [148.19, 26.01, 3.9],
      [146.46, 23.77, 3.0], [168.53, 20.52, 2.6], [177.26, 14.57, 2.1], [168.56, 15.43, 3.3]],
    cygnus: [[310.36, 45.28, 1.3], [305.56, 40.26, 2.2], [299.08, 35.08, 3.9], [292.68, 27.96, 3.1], [311.55, 33.97, 2.5],
      [318.23, 30.23, 3.2], [296.24, 45.13, 2.9], [292.43, 51.73, 3.8], [289.28, 53.37, 3.8]],
    pegasus: [[2.10, 29.09, 2.1], [345.94, 28.08, 2.4], [346.19, 15.21, 2.5], [3.31, 15.18, 2.8], [340.37, 10.83, 3.4],
      [332.55, 6.20, 3.5], [326.05, 9.88, 2.4], [340.75, 30.22, 2.9]],
    cepheus: [[319.64, 62.59, 2.5], [322.16, 70.56, 3.2], [354.84, 77.63, 3.2], [342.42, 66.20, 3.5], [332.71, 58.20, 3.4]],
    scorpius: [[247.35, -26.43, 1.0], [245.30, -25.59, 2.9], [240.08, -22.62, 2.3], [241.36, -19.81, 2.6], [239.71, -26.11, 2.9],
      [248.97, -28.22, 2.8], [252.54, -34.29, 2.3], [252.97, -38.05, 3.0], [253.65, -42.36, 3.6], [258.04, -43.24, 3.3],
      [264.33, -43.00, 1.9], [266.90, -40.13, 3.0], [265.62, -39.03, 2.4], [263.40, -37.10, 1.6]],
    crux: [[187.79, -57.11, 1.6], [186.65, -63.10, 0.8], [191.93, -59.69, 1.3], [183.79, -58.75, 2.8]]
  };

  const TEXT = {
    et: {
      title: 'Kosmoseviktoriin',
      intro: 'Kui palju sa mängudest õppisid? Vasta küsimustele ja kogu punkte. Mida kiiremini õigesti vastad, seda rohkem punkte saad!',
      chooseMode: 'Kes mängib?',
      alone: 'Üksi',
      two: 'Kahekesi',
      player1: 'Mängija 1',
      player2: 'Mängija 2',
      duoTip: 'Pange telefon külili lauale, nii et mõlemad näevad. Kumbki vastab oma ekraanipoolel.',
      chooseTopic: 'Mis teemal?',
      play: 'Mängi',
      reading: 'Loe küsimust …',
      ready: 'Olen valmis ▶',
      next: 'Edasi',
      right: 'Õige',
      wrong: 'Vale',
      qNum: (i, n) => `${i} / ${n}`,
      points: (p) => `${p} p`,
      gotRight: (p) => `✅ Õige! +${p}`,
      streak: '🔥',
      gotWrong: '❌ Vale',
      timeUp: '⏰ Aeg sai otsa',
      answered: '✔',
      rotate: 'Keera telefon külili, et mõlemal oleks oma pool.',
      done: 'Valmis!',
      score: (r, n, p) => `${r} / ${n} õiget · ${p} punkti`,
      newBest: 'Uus rekord! 🏆',
      oldBest: (p) => `Rekord: ${p} punkti`,
      best: (p) => `🏆 Rekord: ${p} punkti`,
      noBest: 'Rekordit veel pole.',
      clear: '🗑️ Kustuta rekord',
      clearSure: '🗑️ Puuduta uuesti, et kustutada',
      practice: 'Tasub uuesti mängida:',
      wins: (w) => `${w} võitis!`,
      draw: 'Viik!',
      duoScore: (a, pa, b, pb) => `${a} ${pa} punkti · ${b} ${pb} punkti`,
      again: 'Uuesti',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      sound: 'Heli',
      credit: 'Fotod: Tõrva Astronoomiaklubi, litsents CC BY-NC-SA.'
    },
    en: {
      title: 'Space Quiz',
      intro: 'How much did you learn from the games? Answer the questions and collect points. The faster you answer right, the more points you get!',
      chooseMode: 'Who is playing?',
      alone: 'Alone',
      two: 'Two players',
      player1: 'Player 1',
      player2: 'Player 2',
      duoTip: 'Lay the phone sideways on the table, so that you both can see it. Each of you answers on your own half of the screen.',
      chooseTopic: 'Which topic?',
      play: 'Play',
      reading: 'Read the question …',
      ready: 'I’m ready ▶',
      next: 'Next',
      right: 'True',
      wrong: 'False',
      qNum: (i, n) => `${i} / ${n}`,
      points: (p) => `${p} pts`,
      gotRight: (p) => `✅ Right! +${p}`,
      streak: '🔥',
      gotWrong: '❌ Wrong',
      timeUp: '⏰ Time is up',
      answered: '✔',
      rotate: 'Turn the phone sideways, so that each of you has a half.',
      done: 'Done!',
      score: (r, n, p) => `${r} / ${n} right · ${p} points`,
      newBest: 'A new record! 🏆',
      oldBest: (p) => `Record: ${p} points`,
      best: (p) => `🏆 Record: ${p} points`,
      noBest: 'No record yet.',
      clear: '🗑️ Clear the record',
      clearSure: '🗑️ Tap again to clear it',
      practice: 'Worth playing again:',
      wins: (w) => `${w} wins!`,
      draw: 'A draw!',
      duoScore: (a, pa, b, pb) => `${a} ${pa} points · ${b} ${pb} points`,
      again: 'Again',
      menu: 'Menu',
      allGames: 'All games',
      sound: 'Sound',
      credit: 'Photos: Tõrva Astronoomiaklubi, licence CC BY-NC-SA.'
    }
  };

  const ROUND = 10;       // questions in a round
  const ANSWER_S = 30;    // seconds to answer
  const MAX_POINTS = 1000; // for an answer at once; half of it for one at the last moment
  const STREAK_BONUS = 200; // for each right answer from the third in a row on
  const SEEN_MAX = 40;    // questions remembered, so that the next rounds ask others first

  // Time to read the question before the answers and the clock appear (s),
  // longer for a longer question.
  const readTime = (q) => clamp(3 + q.q[Astro.lang].length * 0.1, 5, 14);

  // Every question gets an id and its topic.
  const ALL = [];
  for (const g of window.QUIZ) g.questions.forEach((q, i) => ALL.push(Object.assign(q, { id: `${g.game}.${i}`, game: g.game })));

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('viktoriin.');
  const state = {
    duo: store.get('duo', false),
    topic: store.get('topic', 'all'),
    whos: store.get('whos', [WHOS[0], WHOS[1]]),
    best: store.get('best', {}),  // the most points alone, for each topic
    seen: store.get('seen', []),  // ids of the questions asked lately
    clearArmed: false,            // the record is cleared on the next tap of 🗑️
    clearTimer: 0,
    round: [],        // the questions of this round
    i: 0,             // the current question
    opts: [],         // its answers, shuffled: { pic | text, right }
    phase: 'off',     // 'read', 'answer', 'reveal' or 'off'
    t: 0,             // seconds in this phase
    readFor: 0,
    paused: false,    // waiting for the phone to be turned sideways
    players: [],      // { score, streak, rightCount, choice, at, gained }
    order: [],        // the items placed so far in an order question
    missed: new Set(), // topics of the questions answered wrong, alone
    raf: 0,
    last: 0,
    tick: 0           // the last second ticked in the last few seconds
  };
  if (!TOPICS.some((tp) => tp.id === state.topic)) state.topic = 'all';
  if (!Array.isArray(state.whos) || state.whos.length !== 2 || !state.whos.every((w) => WHOS.includes(w))) state.whos = [WHOS[0], WHOS[1]];
  if (!state.best || typeof state.best !== 'object') state.best = {};
  if (!Array.isArray(state.seen)) state.seen = [];

  const t = (key) => TEXT[Astro.lang][key];
  const L = (o) => o[Astro.lang];

  // ---------------------------------------------------------------------------
  // Pictures
  // ---------------------------------------------------------------------------

  const PHOTO = (name) => `../pusle/images/${name}.jpg`;
  const worlds = { moon: PHOTO('moon'), jupiter: PHOTO('jupiter'), saturn: PHOTO('saturn'), mars: drawMars(300), earth: '' };
  // The Earth takes a moment to draw; the pictures already shown get it then.
  setTimeout(() => drawEarth(300, (url) => {
    worlds.earth = url;
    document.querySelectorAll('img.earth').forEach((img) => { img.src = url; });
  }), 50);

  // The eight planets as drawn in Planeetide rivi, each drawn the first time
  // a round needs it; the pictures already shown get it then.
  const planets = {};
  function needPlanet(id) {
    if (id in planets) return;
    planets[id] = '';
    AstroPlanets.drawPlanet(id, 240, (pic) => {
      planets[id] = pic.url;
      document.querySelectorAll(`img[data-planet="${id}"]`).forEach((img) => { img.src = pic.url; });
    });
  }

  let uid = 0;

  // The Moon from the Earth, `a` degrees after new moon: lit from the right
  // while waxing (as seen from the north), from the left while waning.
  function moonSVG(a) {
    const id = 'm' + uid++;
    const r = 45;
    const img = 2 * r * 1.122; // the Moon fills this much of its photo, as in Kuu faasid
    const k = Math.cos(a * DEG);
    const waning = ((a % 360) + 360) % 360 > 180;
    // the lit part: the limb on the right, then the terminator back up
    const lit = k > 0.999 ? '' :
      `<path d="M0 ${-r}A${r} ${r} 0 0 1 0 ${r}A${Math.abs(k) * r} ${r} 0 0 ${k > 0 ? 0 : 1} 0 ${-r}Z"${waning ? ' transform="scale(-1 1)"' : ''} />`;
    return `<svg viewBox="-50 -50 100 100" aria-hidden="true"><defs>` +
      `<clipPath id="${id}d"><circle r="${r}" /></clipPath><clipPath id="${id}l">${lit}</clipPath>` +
      `<filter id="${id}g"><feColorMatrix type="saturate" values="0.45" /></filter></defs>` +
      `<g filter="url(#${id}g)"><g clip-path="url(#${id}d)"><image href="${PHOTO('moon')}" x="${-img / 2}" y="${-img / 2}" width="${img}" height="${img}" opacity="0.13" /></g>` +
      `<g clip-path="url(#${id}l)"><image href="${PHOTO('moon')}" x="${-img / 2}" y="${-img / 2}" width="${img}" height="${img}" /></g></g>` +
      `<circle r="${r}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.8" /></svg>`;
  }

  // The Sun, the Earth and the Moon seen from above the North Pole, as in
  // Kuu faasid: sunlight from the right, the Moon going round anticlockwise.
  function spaceSVG(a) {
    const R = 30;
    const mx = 50 + R * Math.cos(a * DEG);
    const my = 50 - R * Math.sin(a * DEG);
    const arrow = (y) => `<path d="M97 ${y}H86M90 ${y - 3}L86 ${y}L90 ${y + 3}" />`;
    // a little arrowhead on the orbit, pointing the way the Moon goes
    const th = 140 * DEG;
    const ax = 50 + R * Math.cos(th);
    const ay = 50 - R * Math.sin(th);
    const rot = (Math.atan2(-Math.cos(th), -Math.sin(th)) * 180) / Math.PI;
    return `<svg viewBox="0 0 100 100" aria-hidden="true">` +
      `<circle cx="122" cy="50" r="26" fill="#ffd34d" /><circle cx="122" cy="50" r="30" fill="#ffd34d" opacity="0.25" />` +
      `<g stroke="#ffd34d" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">${arrow(22)}${arrow(78)}</g>` +
      `<circle cx="50" cy="50" r="${R}" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8" stroke-dasharray="2 2" />` +
      `<path transform="translate(${ax} ${ay}) rotate(${rot})" d="M3 0L-2 -2.6L-2 2.6Z" fill="rgba(255,255,255,0.7)" />` +
      `<circle cx="50" cy="50" r="9" fill="#2d6fc0" /><path d="M46 44Q51 42 54 46Q52 51 48 52Z" fill="#4caf43" />` +
      `<path d="M50 41A9 9 0 0 0 50 59Z" fill="rgba(5,8,30,0.65)" />` +
      `<circle cx="${mx}" cy="${my}" r="5.5" fill="#d8d8de" /><path d="M${mx} ${my - 5.5}A5.5 5.5 0 0 0 ${mx} ${my + 5.5}Z" fill="#3a3a48" /></svg>`;
  }

  // The stars of a constellation without its lines, as on a sky chart:
  // north up, east to the left.
  function conSVG(id) {
    const stars = CONS[id];
    const vec = (ra, dec) => [Math.cos(dec * DEG) * Math.cos(ra * DEG), Math.cos(dec * DEG) * Math.sin(ra * DEG), Math.sin(dec * DEG)];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const norm = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };
    const vs = stars.map((s) => vec(s[0], s[1]));
    const c = norm(vs.reduce((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]], [0, 0, 0]));
    const east = norm([-c[1], c[0], 0]);
    const north = [c[1] * east[2] - c[2] * east[1], c[2] * east[0] - c[0] * east[2], c[0] * east[1] - c[1] * east[0]];
    const ps = vs.map((v) => ({ x: -dot(v, east) / dot(v, c), y: -dot(v, north) / dot(v, c) }));
    const xs = ps.map((p) => p.x);
    const ys = ps.map((p) => p.y);
    const x0 = Math.min(...xs);
    const y0 = Math.min(...ys);
    const w = Math.max(...xs) - x0;
    const h = Math.max(...ys) - y0;
    const s = 76 / Math.max(w, h);
    const dots = ps.map((p, i) => {
      const x = 50 + (p.x - x0 - w / 2) * s;
      const y = 50 + (p.y - y0 - h / 2) * s;
      const r = clamp(3.6 - 0.6 * stars[i][2], 1.1, 3.6);
      return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 2.2).toFixed(1)}" fill="#cfe2ff" opacity="0.18" />` +
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#fff" />`;
    });
    return `<svg viewBox="0 0 100 100" aria-hidden="true">${dots.join('')}</svg>`;
  }

  // A plane, a satellite or a shooting star crossing a bit of night sky.
  function animSVG(kind) {
    const bg = '<g fill="#fff" opacity="0.7"><circle cx="14" cy="20" r="0.7" /><circle cx="80" cy="12" r="0.9" />' +
      '<circle cx="64" cy="70" r="0.6" /><circle cx="30" cy="84" r="0.8" /><circle cx="88" cy="56" r="0.6" /><circle cx="42" cy="42" r="0.5" /></g>';
    const fg = {
      plane: '<g class="anim-plane"><circle class="blink-a" cx="-2.5" r="1.8" fill="#ff4a4a" /><circle class="blink-b" cx="2.5" r="1.8" fill="#3cff6a" />' +
        '<circle class="strobe" r="1" fill="#fff" /></g>',
      satellite: '<circle class="anim-sat" r="1.3" fill="#f4f6ff" />',
      meteor: '<defs><linearGradient id="tail" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a0c8ff" stop-opacity="0" />' +
        '<stop offset="1" stop-color="#fff" /></linearGradient></defs>' +
        '<path class="anim-meteor" d="M22 16L70 58" stroke="url(#tail)" stroke-width="2" stroke-linecap="round" />'
    }[kind];
    return `<svg viewBox="0 0 100 100" class="anim" aria-hidden="true"><rect width="100" height="100" fill="#050a24" />${bg}${fg}</svg>`;
  }

  function picHTML(p) {
    let inner = '';
    if (p.photo) inner = `<img src="${PHOTO(p.photo)}" alt="">`;
    else if (p.planet) { needPlanet(p.planet); inner = `<img class="world" data-planet="${p.planet}" src="${planets[p.planet]}" alt="">`; }
    else if (p.world) inner = `<img class="${p.world === 'earth' ? 'earth ' : ''}world" src="${worlds[p.world]}" alt="">`;
    else if (p.moon !== undefined) inner = moonSVG(p.moon);
    else if (p.space !== undefined) inner = spaceSVG(p.space);
    else if (p.con) inner = conSVG(p.con);
    else if (p.anim) inner = animSVG(p.anim);
    return `<span class="pic-box">${inner}</span>`;
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    [['solo', '🧑', false], ['duo', '👥', true]].forEach(([key, emoji, duo]) => {
      const b = document.createElement('button');
      b.className = 'count mode';
      b.innerHTML = `<b>${emoji}</b><span data-mode="${key}"></span>`;
      b.addEventListener('click', () => {
        state.duo = duo;
        store.set('duo', duo);
        state.clearArmed = false;
        sfx.pick();
        updateMenu();
      });
      $('modes').appendChild(b);
    });

    document.querySelectorAll('.whos').forEach((row) => {
      const p = +row.dataset.p;
      WHOS.forEach((w) => {
        const b = document.createElement('button');
        b.className = 'count who-btn';
        b.textContent = w;
        b.addEventListener('click', () => {
          // the two players need different pictures
          if (state.whos[1 - p] === w) {
            sfx.oops();
            return;
          }
          state.whos[p] = w;
          store.set('whos', state.whos);
          sfx.pick();
          updateMenu();
        });
        row.appendChild(b);
      });
    });

    TOPICS.forEach((tp) => {
      const b = document.createElement('button');
      b.className = 'topic';
      b.innerHTML = `<b>${tp.emoji}</b><span></span>`;
      b.addEventListener('click', () => {
        state.topic = tp.id;
        store.set('topic', tp.id);
        state.clearArmed = false;
        sfx.pick();
        updateMenu();
      });
      $('topics').appendChild(b);
    });
  }

  function updateMenu() {
    [...$('modes').children].forEach((b, i) => {
      b.classList.toggle('selected', (i === 1) === state.duo);
      b.querySelector('span').textContent = t(i ? 'two' : 'alone');
    });
    $('players').classList.toggle('hidden', !state.duo);
    document.querySelectorAll('.whos').forEach((row) => {
      [...row.children].forEach((b, i) => b.classList.toggle('selected', WHOS[i] === state.whos[+row.dataset.p]));
    });
    [...$('topics').children].forEach((b, i) => {
      b.classList.toggle('selected', TOPICS[i].id === state.topic);
      b.querySelector('span').textContent = L(TOPICS[i].name);
    });
    // a record is kept only when playing alone
    const best = state.best[state.topic];
    $('best').classList.toggle('hidden', state.duo);
    $('best').textContent = best ? t('best')(best) : t('noBest');
    $('clearBtn').classList.toggle('hidden', state.duo || !best);
    $('clearBtn').textContent = t(state.clearArmed ? 'clearSure' : 'clear');
  }

  function showMenu() {
    stop();
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // A round
  // ---------------------------------------------------------------------------

  // Questions not asked lately come first. With all topics, the round takes
  // its questions from each game in turn.
  function pickRound() {
    const ok = (q) => !(state.duo && q.order);
    const fresh = (list) => {
      const s = shuffle(list.filter(ok));
      return s.filter((q) => !state.seen.includes(q.id)).concat(s.filter((q) => state.seen.includes(q.id)));
    };
    let round;
    if (state.topic === 'all') {
      const pools = shuffle(window.QUIZ.map((g) => fresh(ALL.filter((q) => q.game === g.game))));
      round = [];
      for (let k = 0; round.length < ROUND && pools.some((p) => p.length); k++) {
        const p = pools[k % pools.length];
        if (p.length) round.push(p.shift());
      }
      shuffle(round);
    } else {
      round = fresh(ALL.filter((q) => q.game === state.topic)).slice(0, ROUND);
    }
    // start drawing the planets the round shows
    for (const q of round) {
      for (const p of [q.pic, ...(q.answers || []), ...(q.order || [])]) if (p && p.planet) needPlanet(p.planet);
    }
    state.seen = state.seen.filter((id) => !round.some((q) => q.id === id)).concat(round.map((q) => q.id)).slice(-SEEN_MAX);
    store.set('seen', state.seen);
    return round;
  }

  function startGame() {
    stop();
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    $('game').classList.toggle('duo', state.duo);
    $('sides').classList.toggle('hidden', !state.duo);
    updateToggles();

    state.round = pickRound();
    state.players = (state.duo ? [0, 1] : [0]).map(() => ({ score: 0, streak: 0, rightCount: 0 }));
    state.missed = new Set();
    state.i = 0;
    showQuestion();
    state.last = performance.now();
    state.raf = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(state.raf);
    state.phase = 'off';
  }

  const question = () => state.round[state.i];

  function showQuestion() {
    const q = question();
    state.phase = 'read';
    state.t = 0;
    state.readFor = readTime(q);
    state.tick = 0;
    state.order = [];
    for (const p of state.players) Object.assign(p, { choice: null, at: 0, gained: 0 });

    if (q.tf !== undefined) {
      state.opts = [{ tf: true, right: q.tf === true }, { tf: false, right: q.tf === false }];
    } else if (q.order) {
      state.opts = shuffle(q.order.map((it, k) => ({ pic: it, rank: k })));
    } else {
      state.opts = shuffle(q.answers.map((a, k) => (a.et !== undefined ? { text: a, right: k === 0 } : { pic: a, right: k === 0 })));
    }

    $('qNum').textContent = t('qNum')(state.i + 1, state.round.length);
    $('question').textContent = L(q.q);
    $('question').classList.remove('hidden');
    $('explain').classList.add('hidden');
    $('duoNext').classList.add('hidden');
    $('qPic').innerHTML = q.pic ? picHTML(q.pic) : '';
    $('qPic').classList.toggle('hidden', !q.pic);
    $('result').classList.add('hidden');
    $('reading').classList.remove('hidden');
    // alone you may start at once; two players read for the same time
    $('readyBtn').classList.toggle('hidden', state.duo);
    $('readFill').style.width = '0%';

    const kind = q.tf !== undefined ? 'tf' : q.order ? 'order' : state.opts.some((o) => o.pic) ? 'pics' : 'texts';
    const long = kind === 'texts' && state.opts.some((o) => L(o.text).length > 34);
    const boxes = state.duo ? [...document.querySelectorAll('.side .answers')] : [$('answers')];
    boxes.forEach((box, p) => {
      box.className = `answers ${kind}${long ? ' long' : ''} n${state.opts.length}`;
      box.innerHTML = kind === 'order' ? orderHTML() : state.opts.map((o, k) => answerHTML(o, k)).join('');
      box.classList.add('waiting');
      box.dataset.p = p;
    });
    if (kind === 'order') wireOrder();
    else wireAnswers(boxes);
    updateScores();
    updateTime();
    $('stage').scrollTop = 0;
  }

  const SHAPES = ['▲', '◆', '●', '■'];

  function answerHTML(o, k) {
    if (o.tf !== undefined) {
      return `<button class="ans ${o.tf ? 'c3' : 'c0'}" data-k="${k}"><i class="shape">${o.tf ? '✔' : '✘'}</i><span class="txt">${L(TEXT)[o.tf ? 'right' : 'wrong']}</span></button>`;
    }
    const body = o.pic ? picHTML(o.pic) + (o.pic.label ? `<span class="txt">${L(o.pic.label)}</span>` : '') : `<span class="txt">${L(o.text)}</span>`;
    return `<button class="ans c${k}" data-k="${k}"><i class="shape">${SHAPES[k]}</i>${body}</button>`;
  }

  // Answers react on touch, not on release, so that two players can answer
  // at the same moment and the quicker one is really quicker.
  function wireAnswers(boxes) {
    boxes.forEach((box, p) => {
      box.querySelectorAll('.ans').forEach((b) => {
        b.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          choose(p, +b.dataset.k);
        });
      });
    });
  }

  function choose(p, k) {
    const pl = state.players[p];
    if (state.phase !== 'answer' || state.paused || pl.choice !== null) return;
    pl.choice = k;
    pl.at = state.t;
    sfx.pick();
    if (!state.duo) {
      reveal();
      return;
    }
    // the other player must not see which one was chosen
    const side = document.querySelector(`.side[data-p="${p}"]`);
    side.classList.add('locked');
    side.querySelector('.side-status').textContent = t('answered');
    if (state.players.every((x) => x.choice !== null)) reveal();
  }

  // An order question: tap the pictures in order; they fill the numbered
  // places, and a picture in a place goes back when tapped.
  function orderHTML() {
    const slots = state.opts.map((_, k) => `<button class="slot" data-s="${k}"><i>${k + 1}</i></button>`).join('');
    const items = state.opts.map((o, k) =>
      `<button class="item" data-k="${k}">${picHTML(o.pic)}${o.pic.label ? `<span class="txt">${L(o.pic.label)}</span>` : ''}</button>`).join('');
    return `<div class="slots">${slots}</div><div class="items">${items}</div>`;
  }

  function wireOrder() {
    const box = $('answers');
    box.querySelectorAll('.item').forEach((b) => b.addEventListener('click', () => {
      const k = +b.dataset.k;
      if (state.phase !== 'answer' || state.order.includes(k)) return;
      state.order.push(k);
      sfx.note(state.order.length - 1);
      drawOrder();
      if (state.order.length === state.opts.length) {
        state.players[0].choice = 0;
        state.players[0].at = state.t;
        setTimeout(reveal, 300);
      }
    }));
    box.querySelectorAll('.slot').forEach((b) => b.addEventListener('click', () => {
      const s = +b.dataset.s;
      if (state.phase !== 'answer' || s >= state.order.length || state.players[0].choice !== null) return;
      state.order.splice(s, 1);
      sfx.pick();
      drawOrder();
    }));
  }

  function drawOrder() {
    const box = $('answers');
    box.querySelectorAll('.slot').forEach((b, s) => {
      const k = state.order[s];
      b.innerHTML = k === undefined ? `<i>${s + 1}</i>` : `<i>${s + 1}</i>${picHTML(state.opts[k].pic)}`;
      b.classList.toggle('filled', k !== undefined);
    });
    box.querySelectorAll('.item').forEach((b) => b.classList.toggle('used', state.order.includes(+b.dataset.k)));
  }

  function startAnswering() {
    state.phase = 'answer';
    state.t = 0;
    $('reading').classList.add('hidden');
    document.querySelectorAll('.answers.waiting').forEach((b) => b.classList.remove('waiting'));
  }

  const isRight = (pl) => {
    if (pl.choice === null) return false;
    if (question().order) return state.order.every((k, s) => state.opts[k].rank === s);
    return state.opts[pl.choice].right;
  };

  function reveal() {
    if (state.phase !== 'answer') return;
    state.phase = 'reveal';
    const q = question();
    let anyRight = false;
    for (const pl of state.players) {
      const ok = isRight(pl);
      pl.ok = ok;
      if (ok) {
        anyRight = true;
        pl.streak++;
        pl.rightCount++;
        // full points at once, half at the last moment
        pl.gained = Math.round((MAX_POINTS * (1 - pl.at / ANSWER_S / 2)) / 10) * 10 + (pl.streak >= 3 ? STREAK_BONUS : 0);
        pl.score += pl.gained;
      } else {
        pl.streak = 0;
        pl.gained = 0;
        if (!state.duo) state.missed.add(q.game);
      }
    }
    if (anyRight) sfx.snap();
    else sfx.oops();

    // show the right answer on every side
    const boxes = state.duo ? [...document.querySelectorAll('.side .answers')] : [$('answers')];
    if (q.order) {
      const box = $('answers');
      box.classList.add('shown');
      box.querySelectorAll('.slot').forEach((b, s) => {
        const k = state.order[s];
        b.classList.add(k !== undefined && state.opts[k].rank === s ? 'right' : 'wrong');
      });
      // the right order under the child's own
      box.querySelector('.items').innerHTML = q.order.map((it, s) =>
        `<span class="item fixed"><i>${s + 1}</i>${picHTML(it)}${it.label ? `<span class="txt">${L(it.label)}</span>` : ''}</span>`).join('');
    } else {
      boxes.forEach((box, p) => {
        box.classList.add('shown');
        box.querySelectorAll('.ans').forEach((b) => {
          const k = +b.dataset.k;
          b.classList.toggle('right', state.opts[k].right);
          b.classList.toggle('wrong', k === state.players[p].choice && !state.opts[k].right);
          b.classList.toggle('picked', k === state.players[p].choice);
        });
      });
    }

    const verdict = (pl) => (pl.ok ? t('gotRight')(pl.gained) + (pl.streak >= 3 ? ' ' + t('streak') : '') :
      pl.choice === null ? t('timeUp') : t('gotWrong'));
    if (state.duo) {
      document.querySelectorAll('.side').forEach((side, p) => {
        side.classList.remove('locked');
        side.querySelector('.side-status').textContent = verdict(state.players[p]);
        side.classList.toggle('ok', state.players[p].ok);
      });
      $('question').classList.add('hidden');
      $('explain').textContent = L(q.why);
      $('explain').classList.remove('hidden');
      $('duoNext').classList.remove('hidden');
    } else {
      $('verdict').textContent = verdict(state.players[0]);
      $('verdict').className = 'verdict ' + (state.players[0].ok ? 'ok' : 'no');
      $('why').textContent = L(q.why);
      $('result').classList.remove('hidden');
      setTimeout(() => $('result').scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50);
    }
    updateScores();
    updateTime();
  }

  function next() {
    if (state.phase !== 'reveal') return;
    sfx.pick();
    state.i++;
    if (state.i >= state.round.length) finish();
    else showQuestion();
  }

  function updateScores() {
    if (state.duo) {
      document.querySelectorAll('.side').forEach((side, p) => {
        side.querySelector('.side-who').textContent = state.whos[p];
        side.querySelector('.side-pts').textContent = t('points')(state.players[p].score);
        if (state.phase !== 'reveal' && state.players[p].choice === null) {
          side.querySelector('.side-status').textContent = '';
          side.classList.remove('locked', 'ok');
        }
      });
    } else {
      $('soloScore').textContent = '⭐ ' + t('points')(state.players[0].score);
    }
  }

  function updateTime() {
    const left = state.phase === 'answer' ? Math.max(0, ANSWER_S - state.t) : state.phase === 'read' ? ANSWER_S : 0;
    $('timeFill').style.width = (100 * left) / ANSWER_S + '%';
    $('timeFill').classList.toggle('low', state.phase === 'answer' && left <= 5);
    $('timeText').textContent = state.phase === 'reveal' ? '' : '⏱ ' + Math.ceil(left);
  }

  // The phone must lie sideways for two players; until it does, the clock waits.
  const portrait = window.matchMedia('(orientation: portrait) and (max-width: 700px)');
  function checkRotate() {
    state.paused = state.duo && state.phase !== 'off' && portrait.matches;
    $('rotate').classList.toggle('hidden', !state.paused);
  }

  function frame(now) {
    const dt = Math.min(0.1, (now - state.last) / 1000);
    state.last = now;
    checkRotate();
    if (!state.paused) {
      if (state.phase === 'read') {
        state.t += dt;
        $('readFill').style.width = Math.min(100, (100 * state.t) / state.readFor) + '%';
        if (state.t >= state.readFor) startAnswering();
      } else if (state.phase === 'answer') {
        state.t += dt;
        const left = Math.ceil(ANSWER_S - state.t);
        if (left <= 5 && left > 0 && left !== state.tick) {
          state.tick = left;
          sfx.pick();
        }
        if (state.t >= ANSWER_S) reveal();
      }
      if (state.phase === 'answer' || state.phase === 'read') updateTime();
    }
    if (state.phase !== 'off') state.raf = requestAnimationFrame(frame);
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // End of the round
  // ---------------------------------------------------------------------------

  function finish() {
    stop();
    const n = state.round.length;
    $('practice').innerHTML = '';
    $('winBest').textContent = '';
    if (state.duo) {
      const [a, b] = state.players;
      const winner = a.score === b.score ? -1 : a.score > b.score ? 0 : 1;
      $('winTitle').textContent = winner < 0 ? t('draw') : t('wins')(state.whos[winner]);
      $('winScore').textContent = t('duoScore')(state.whos[0], a.score, state.whos[1], b.score);
      const top = Math.max(a.score, b.score, 1);
      $('winPic').innerHTML = '<div class="podium">' + state.players.map((pl, p) =>
        `<div class="step-col p${p + 1}"><span class="podium-who">${winner === p ? '<i class="crown">👑</i>' : ''}${state.whos[p]}</span>` +
        `<div class="podium-bar" style="--f:${pl.score / top}"><b>${pl.score}</b><small>${pl.rightCount} / ${n} ✅</small></div></div>`).join('') + '</div>';
    } else {
      const pl = state.players[0];
      const old = state.best[state.topic];
      if (pl.score > (old || 0)) {
        state.best[state.topic] = pl.score;
        store.set('best', state.best);
      }
      $('winTitle').textContent = t('done');
      $('winScore').textContent = t('score')(pl.rightCount, n, pl.score);
      if (pl.score > 0) $('winBest').textContent = pl.score > (old || 0) ? t('newBest') : t('oldBest')(old);
      const stars = Math.round((5 * pl.rightCount) / n);
      $('winPic').innerHTML = `<div class="medal"><span>${pl.rightCount === n ? '🏆' : pl.rightCount >= n / 2 ? '🌟' : '⭐'}</span>` +
        `<b>${'★'.repeat(stars)}<i>${'★'.repeat(5 - stars)}</i></b></div>`;
      // the games to play again, for the questions answered wrong
      const games = TOPICS.filter((tp) => state.missed.has(tp.id));
      if (games.length) {
        $('practice').innerHTML = `<p>${t('practice')}</p>` + games.map((tp) =>
          `<a class="practice-link" href="${tp.href}">${tp.emoji} ${L(tp.game || tp.name)}</a>`).join('');
      }
    }
    sfx.win();
    $('win').classList.remove('hidden');
    Astro.startConfetti($('confetti'));
  }

  // ---------------------------------------------------------------------------
  // Buttons
  // ---------------------------------------------------------------------------

  // Clearing the record of the chosen topic takes two taps, so that it is not
  // cleared by mistake. The second one must come within a few seconds.
  $('clearBtn').addEventListener('click', () => {
    clearTimeout(state.clearTimer);
    if (state.clearArmed) {
      state.clearArmed = false;
      delete state.best[state.topic];
      store.set('best', state.best);
      sfx.oops();
    } else {
      state.clearArmed = true;
      sfx.pick();
      state.clearTimer = setTimeout(() => {
        state.clearArmed = false;
        updateMenu();
      }, 4000);
    }
    updateMenu();
  });
  $('readyBtn').addEventListener('click', () => {
    if (state.phase === 'read') startAnswering();
  });
  $('nextBtn').addEventListener('click', next);
  $('duoNext').addEventListener('click', next);
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
  Astro.setupLanguage(TEXT, updateMenu);
})();
