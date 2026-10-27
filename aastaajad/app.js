'use strict';

(() => {
  const { $, clamp, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  const DEG = Math.PI / 180;
  const YEAR = 365;
  const SOLSTICE = 171;    // 21 June, in days from 1 January (0)
  const TILT = 23.44;      // degrees the Earth's axis is tilted
  const LAG = 20;          // days the weather lags behind the Sun
  const VIEW = 22 * DEG;   // how far above the Earth's path it is seen from
  const CLOSEST = 2;       // 3 January, when the Earth is closest to the Sun
  const FARTHEST = 184;    // 4 July, when it is farthest
  const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // The yards: Tartu in Estonia, and Sydney in Australia. lon is where the
  // flag goes on the globe.
  const PLACES = {
    estonia: { lat: 58.4, lon: 26.7 },
    australia: { lat: -33.9, lon: 151.2 }
  };

  // The tasks, in the order they are played. A 'place' task is solved by
  // moving the Earth to within `within` days of each day in `at`; an 'ask'
  // task by the right answer; 'tilt' by standing the axis upright and
  // moving the Earth a third of the way round. `start` is the day the Earth
  // starts on, `front` the longitude of the globe facing us, and `near`
  // draws the path stretched, with the Sun nearer to where the Earth is
  // closest.
  const TASKS = [
    { id: 'midsummer', icon: '🌞', kind: 'place', at: [174], within: 14, start: 300 },
    { id: 'christmas', icon: '🎄', kind: 'place', at: [357], within: 14, start: 174 },
    { id: 'equinox', icon: '⚖️', kind: 'place', at: [80, 263], within: 10, start: 357 },
    { id: 'australia', icon: '🦘', kind: 'ask', places: ['estonia', 'australia'], options: ['warm', 'cold'], right: 'warm', start: 174, front: 88 },
    { id: 'closest', icon: '📏', kind: 'ask', options: ['spring', 'summer', 'autumn', 'winter'], right: 'winter', start: CLOSEST, near: true },
    { id: 'upright', icon: '🌍', kind: 'tilt', start: 174 }
  ];

  const TEXT = {
    et: {
      title: 'Kuidas tekivad aastaajad?',
      intro1: 'Maa tiirleb ümber Päikese ja tema telg on kaldu. Liiguta Maad ja vaata, kui kõrgele tõuseb Päike Eestis ja kui pikk on päev.',
      intro2: 'Nii saad teada, miks on Eestis suvi soe ja talv külm.',
      chooseTask: 'Vali ülesanne',
      play: 'Mängi',
      tasks: {
        midsummer: {
          name: 'Jaanipäev', about: 'Suvi Eestis',
          title: 'Vii Maa sinna, kus ta on jaanipäeval',
          tip: 'Lohista Maad mööda tema teed ümber Päikese ja vaata, kuidas Eesti õu muutub.',
          miss: 'Jaanipäev on suve alguses, kui päevad on kõige pikemad.',
          fact: 'Jaanipäeva paiku on Maa telje põhjapoolne ots Päikese poole kaldu. Päike tõuseb Eestis kõrgele ja päev kestab üle 18 tunni.'
        },
        christmas: {
          name: 'Jõulud', about: 'Talv Eestis',
          title: 'Vii Maa sinna, kus ta on jõulude ajal',
          tip: 'Vaata, kui kõrgele tõuseb Päike Eestis ja kui pikk on päev.',
          miss: 'Jõulud on talve alguses, kui päevad on kõige lühemad.',
          fact: 'Talvel on põhjapoolne ots Päikesest eemale kaldu. Keskpäeval tõuseb Päike Tartus vaid 8 kraadi kõrgusele ja päev kestab natuke üle 6 tunni.'
        },
        equinox: {
          name: 'Päev ja öö', about: 'Kevad ja sügis',
          title: 'Leia kaks kohta, kus päev ja öö on ühepikkused',
          tip: 'Siis on mõlemad umbes 12 tundi pikad.',
          one: 'Leidsid ühe! Leia ka teine.',
          miss: 'Otsi kohta, kus mõlemad on umbes 12 tundi.',
          fact: 'Märtsis ja septembris ei ole telg kaldu Päikese poole ega sellest eemale. Siis on päev ja öö kogu Maal umbes 12 tundi pikad.'
        },
        australia: {
          name: 'Austraalia', about: 'Teisel pool Maad',
          title: 'Kas Austraalias on jõulude ajal soe või külm?',
          tip: 'Vii Maa jõulude kohale ja vaata Austraalia õue.',
          miss: 'Vaata Austraalia õue jõulude ajal: kui kõrgel on seal Päike ja kui pikk on päev?',
          fact: 'Kui põhjapoolne ots on Päikese poole kaldu, on lõunapoolne sellest eemale. Austraalias on jõulude ajal suvi ja jaanipäeval talv.'
        },
        closest: {
          name: 'Lähemal või kaugemal?', about: 'Kas kaugus toob aastaajad?',
          title: 'Siin on Maa Päikesele kõige lähemal. Mis aastaaeg on siis Eestis?',
          tip: 'Siin on Päike 147 miljoni km kaugusel, juulis kõige kaugemal, 152 miljoni km kaugusel. Vaata Eesti õue.',
          miss: 'Vaata Eesti õue: kas Päike on kõrgel või madalal ja kas maas on lund?',
          fact: 'Maa on Päikesele kõige lähemal jaanuari alguses, kui Eestis on talv. Kaugus muutub aasta jooksul vaid umbes 5 miljonit kilomeetrit ja see ei too aastaaegu.'
        },
        upright: {
          name: 'Püstine Maa', about: 'Kui telg poleks kaldu',
          title: 'Keera Maa telg püsti ja vii Maa ümber Päikese',
          tip: 'Lükka liugur vasakule, kuni kalle on 0°.',
          go: 'Nüüd lohista Maad ümber Päikese ja vaata õue. Mis juhtub?',
          fact: 'Ilma kaldeta poleks aastaaegu: päev ja öö oleksid kogu aasta umbes 12 tundi pikad ja Päike tõuseks iga päev sama kõrgele. Maa telg on kaldu umbes 23 kraadi.'
        }
      },
      answers: { warm: 'Soe ☀️', cold: 'Külm ❄️', spring: 'Kevad 🌸', summer: 'Suvi ☀️', autumn: 'Sügis 🍂', winter: 'Talv ❄️' },
      seasons: { spring: '🌸 kevad', summer: '☀️ suvi', autumn: '🍂 sügis', winter: '❄️ talv', none: 'aastaaegu pole' },
      here: (season) => `Siin on Eestis ${season.split(' ').pop()}.`,
      dayNight: (day, night) => `Siin on päev ${day} ja öö ${night}.`,
      yellow: 'Kollane koht näitab, kuhu minna.',
      places: { estonia: 'Eesti', australia: 'Austraalia' },
      months: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
      monthsShort: ['jaan', 'veebr', 'märts', 'apr', 'mai', 'juuni', 'juuli', 'aug', 'sept', 'okt', 'nov', 'dets'],
      date: (n, m) => `${n}. ${TEXT.et.months[m]}`,
      hm: (h, m) => (m ? `${h} h ${m} min` : `${h} h`),
      info: (day, night) => `Päev ${day} · öö ${night}`,
      noSet: 'Päike ei looju',
      noRise: 'Päike ei tõuse',
      dirs: { e: 'ida', s: 'lõuna', w: 'lääs', n: 'põhi' },
      closestAt: '147 mln km',
      farthestAt: '152 mln km',
      tilt: (deg) => `Telje kalle ${deg}°`,
      next: 'Edasi ▶',
      finish: 'Valmis! 🎉',
      winTitle: 'Tubli!',
      winName: 'Nüüd tead, kuidas tekivad aastaajad',
      winFact: 'Maa telg on kaldu. Kui põhjapoolkera on Päikese poole kaldu, tõuseb Päike Eestis kõrgele ja päev on pikk - siis on suvi. Kui põhjapoolkera on suunatud Päikesest eemale, paistab Päike madalalt ja päev on lühike - siis on talv.',
      again: 'Mängi uuesti',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      hint: 'Vihje',
      sound: 'Heli'
    },
    en: {
      title: 'What Causes the Seasons?',
      intro1: 'The Earth goes round the Sun, and its axis is tilted. Move the Earth and see how high the Sun climbs in Estonia and how long the day is.',
      intro2: 'So you find out why summer in Estonia is warm and winter cold.',
      chooseTask: 'Choose a task',
      play: 'Play',
      tasks: {
        midsummer: {
          name: 'Midsummer', about: 'Summer in Estonia',
          title: 'Move the Earth to where it is on Midsummer Day',
          tip: 'Drag the Earth along its path round the Sun and see how the yard in Estonia changes.',
          miss: 'Midsummer Day is at the start of summer, when the days are longest.',
          fact: 'Around Midsummer Day, the north end of the Earth\'s axis leans towards the Sun. The Sun climbs high over Estonia and the day lasts over 18 hours.'
        },
        christmas: {
          name: 'Christmas', about: 'Winter in Estonia',
          title: 'Move the Earth to where it is at Christmas',
          tip: 'See how high the Sun climbs in Estonia and how long the day is.',
          miss: 'Christmas is at the start of winter, when the days are shortest.',
          fact: 'In winter, the north end leans away from the Sun. At noon the Sun climbs only 8 degrees over Tartu, and the day lasts just over 6 hours.'
        },
        equinox: {
          name: 'Day and night', about: 'Spring and autumn',
          title: 'Find the two places where day and night are the same length',
          tip: 'Then both are about 12 hours long.',
          one: 'You found one! Find the other too.',
          miss: 'Look for a place where both are about 12 hours.',
          fact: 'In March and September the axis leans neither towards the Sun nor away from it. Then day and night are about 12 hours long all over the Earth.'
        },
        australia: {
          name: 'Australia', about: 'The other side of the Earth',
          title: 'Is it warm or cold in Australia at Christmas?',
          tip: 'Move the Earth to Christmas and look at the yard in Australia.',
          miss: 'Look at the yard in Australia at Christmas: how high is the Sun there, and how long is the day?',
          fact: 'When the north end leans towards the Sun, the south end leans away. In Australia it is summer at Christmas and winter at Midsummer.'
        },
        closest: {
          name: 'Closer or farther?', about: 'Does distance bring the seasons?',
          title: 'Here the Earth is closest to the Sun. What season is it in Estonia then?',
          tip: 'Here the Sun is 147 million km away, and in July at its farthest, 152 million km away. Look at the yard in Estonia.',
          miss: 'Look at the yard in Estonia: is the Sun high or low, and is there snow on the ground?',
          fact: 'The Earth is closest to the Sun in early January, when it is winter in Estonia. The distance changes by only about 5 million kilometres in a year, and that does not bring the seasons.'
        },
        upright: {
          name: 'An upright Earth', about: 'If the axis were not tilted',
          title: 'Stand the Earth\'s axis upright and move the Earth round the Sun',
          tip: 'Slide the slider to the left until the tilt is 0°.',
          go: 'Now drag the Earth round the Sun and watch the yard. What happens?',
          fact: 'Without the tilt there would be no seasons: day and night would be about 12 hours long all year, and the Sun would climb just as high every day. The Earth\'s axis is tilted by about 23 degrees.'
        }
      },
      answers: { warm: 'Warm ☀️', cold: 'Cold ❄️', spring: 'Spring 🌸', summer: 'Summer ☀️', autumn: 'Autumn 🍂', winter: 'Winter ❄️' },
      seasons: { spring: '🌸 spring', summer: '☀️ summer', autumn: '🍂 autumn', winter: '❄️ winter', none: 'no seasons' },
      here: (season) => `Here it is ${season.split(' ').pop()} in Estonia.`,
      dayNight: (day, night) => `Here the day is ${day} and the night ${night}.`,
      yellow: 'The yellow part shows where to go.',
      places: { estonia: 'Estonia', australia: 'Australia' },
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      date: (n, m) => `${n} ${TEXT.en.months[m]}`,
      hm: (h, m) => (m ? `${h} h ${m} min` : `${h} h`),
      info: (day, night) => `Day ${day} · night ${night}`,
      noSet: 'The Sun does not set',
      noRise: 'The Sun does not rise',
      dirs: { e: 'east', s: 'south', w: 'west', n: 'north' },
      closestAt: '147 mln km',
      farthestAt: '152 mln km',
      tilt: (deg) => `Tilt of the axis ${deg}°`,
      next: 'Go on ▶',
      finish: 'Done! 🎉',
      winTitle: 'Well done!',
      winName: 'Now you know what causes the seasons',
      winFact: 'The Earth\'s axis is tilted. When the northern hemisphere leans towards the Sun, the Sun climbs high over Estonia and the day is long - then it is summer. When the northern hemisphere points away from the Sun, the Sun shines low and the day is short - then it is winter.',
      again: 'Play again',
      menu: 'Menu',
      allGames: 'All games',
      hint: 'Hint',
      sound: 'Sound'
    }
  };

  // ---------------------------------------------------------------------------
  // The Sun, the seasons and the dates
  // ---------------------------------------------------------------------------

  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const norm = (a) => {
    const l = Math.hypot(a[0], a[1], a[2]);
    return [a[0] / l, a[1] / l, a[2] / l];
  };
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const smooth = (a, b, x) => {
    const t = clamp((x - a) / (b - a), 0, 1);
    return t * t * (3 - 2 * t);
  };
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  const rgb = (c, a = 1) => `rgba(${c.map(Math.round).join(',')},${a})`;
  const wrap = (d) => ((d % YEAR) + YEAR) % YEAR;
  // from day a to day b the short way round, in days
  const dayDiff = (b, a) => wrap(b - a + YEAR / 2) - YEAR / 2;

  // the Sun's declination on day d, in radians, with the axis tilted by
  // tilt degrees
  const decl = (d, tilt) => Math.asin(Math.sin(tilt * DEG) * Math.cos((2 * Math.PI * (d - SOLSTICE)) / YEAR));

  // the Sun's height above the horizon (alt) and its direction (az, from the
  // south towards the west), in radians, at latitude lat (degrees) and hour
  // angle t (radians, 0 at noon)
  function sunAt(lat, dec, t) {
    const p = lat * DEG;
    const alt = Math.asin(clamp(Math.sin(p) * Math.sin(dec) + Math.cos(p) * Math.cos(dec) * Math.cos(t), -1, 1));
    const az = Math.atan2(Math.sin(t), Math.cos(t) * Math.sin(p) - Math.tan(dec) * Math.cos(p));
    return { alt, az };
  }

  // hours from sunrise to sunset, counting the bending of light in the air
  function dayLength(lat, dec) {
    const p = lat * DEG;
    const c = (Math.sin(-0.833 * DEG) - Math.sin(p) * Math.sin(dec)) / (Math.cos(p) * Math.cos(dec));
    if (c <= -1) return 24;
    if (c >= 1) return 0;
    return (2 * Math.acos(c)) / DEG / 15;
  }

  // How warm it is at a place, from -1 in the middle of winter to 1 in the
  // middle of summer (more with a bigger tilt), from the Sun a few weeks
  // before, as the ground and the sea warm up slowly. trend is 1 while it
  // is getting warmer and -1 while it is getting colder, and 0 with no tilt.
  function weather(place, d, tilt) {
    const side = Math.sign(place.lat);
    const w = (Math.sin(decl(d - LAG, tilt)) * side) / Math.sin(TILT * DEG);
    const trend = tilt > 0 ? -Math.sign(Math.sin((2 * Math.PI * (d - LAG - SOLSTICE)) / YEAR)) * side : 0;
    let season = 'none';
    if (w > 0.6) season = 'summer';
    else if (w < -0.6) season = 'winter';
    else if (trend > 0) season = 'spring';
    else if (trend < 0) season = 'autumn';
    return { w, trend, season };
  }

  function dateOf(d) {
    let n = Math.floor(wrap(d));
    let m = 0;
    while (n >= MONTH_DAYS[m]) n -= MONTH_DAYS[m++];
    return [n + 1, m];
  }
  const monthStart = (m) => MONTH_DAYS.slice(0, m).reduce((a, b) => a + b, 0);

  function hm(hours) {
    let mins = Math.round(hours * 60);
    return t('hm')(Math.floor(mins / 60), mins % 60);
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('aastaajad.');
  const done = new Set((store.get('done', []) || []).filter((id) => TASKS.some((k) => k.id === id)));
  const state = {
    task: clamp(Number(store.get('task', 0)) || 0, 0, TASKS.length - 1),
    first: 0,          // the task this game started from
    day: 0,            // where the Earth is, in days from 1 January
    tilt: TILT,
    phase: 'play',     // 'play', 'solved' or 'over'
    found: [],         // the days of `at` found so far
    misses: 0,
    hintOn: false,     // the right part of the path glows
    tip: null,         // a message in place of the task's tip
    go: null,          // { from, to, t, dur, check }: the Earth sliding to a day
    drag: false,
    turned: 0,         // days the Earth went round with the axis upright
    L: null,
    map: null,         // the Earth's map, from AstroPlanets
    globe: null,       // { key, cv }: the last globe drawn
    yardKey: '',
    t: 0,
    raf: 0,
    last: 0,
    gen: 0
  };
  const taskNow = () => TASKS[state.task];
  const t = (key) => TEXT[Astro.lang][key];
  const tt = (key) => t('tasks')[taskNow().id][key];

  const cv = $('orbit');
  const ctx = cv.getContext('2d');

  AstroPlanets.drawEarthMap(512, 256, (m) => {
    state.map = m;
    state.globe = null;
    if (!$('win').classList.contains('hidden')) drawWin();
  });

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    TASKS.forEach((k, i) => {
      const b = document.createElement('button');
      b.className = 'level';
      b.innerHTML = `<span class="level-icon">${k.icon}</span><span class="level-text"><b class="level-name"></b>` +
        '<span class="level-about"></span></span><span class="done-badge"></span>';
      b.addEventListener('click', () => {
        state.task = i;
        store.set('task', i);
        sfx.pick();
        updateMenu();
      });
      $('levels').appendChild(b);
    });
  }

  function updateMenu() {
    [...$('levels').children].forEach((b, i) => {
      const k = TASKS[i];
      const tx = t('tasks')[k.id];
      b.classList.toggle('selected', i === state.task);
      b.querySelector('.level-name').textContent = `${i + 1}.\u00a0${tx.name}`;
      b.querySelector('.level-about').textContent = tx.about;
      b.querySelector('.done-badge').textContent = done.has(k.id) ? '🌟' : '';
    });
  }

  function stopAll() {
    state.gen++;
    cancelAnimationFrame(state.raf);
    state.raf = 0;
    Astro.stopConfetti($('confetti'));
  }

  function later(ms, fn) {
    const gen = state.gen;
    setTimeout(() => { if (gen === state.gen) fn(); }, ms);
  }

  function showMenu() {
    stopAll();
    $('win').classList.add('hidden');
    $('fact').classList.add('hidden');
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
    state.first = state.task;
    startTask(state.task);
    state.last = performance.now();
    state.raf = requestAnimationFrame(frame);
  }

  function startTask(i) {
    state.gen++;
    state.task = i;
    const k = taskNow();
    Object.assign(state, {
      day: k.start, tilt: TILT, phase: 'play', found: [], misses: 0, hintOn: false,
      tip: null, go: null, drag: false, turned: 0, yardKey: ''
    });
    $('fact').classList.add('hidden');
    $('tiltBox').classList.toggle('hidden', k.kind !== 'tilt');
    $('tiltBox').classList.remove('pulse');
    $('tilt').value = Math.round(TILT);
    buildYards();
    buildOptions();
    renderTask();
    updateBar();
    layout();
  }

  // the yards to show: Estonia, and on Austraalia Sydney too
  function buildYards() {
    const box = $('yards');
    box.innerHTML = '';
    for (const id of taskNow().places || ['estonia']) {
      const y = document.createElement('div');
      y.className = 'yard';
      y.dataset.place = id;
      y.innerHTML = '<div class="yard-head"></div><canvas></canvas><div class="yard-info"></div>';
      box.appendChild(y);
    }
  }

  function buildOptions() {
    const box = $('options');
    box.innerHTML = '';
    const k = taskNow();
    if (k.kind !== 'ask') return;
    for (const id of k.options) {
      const b = document.createElement('button');
      b.className = 'option';
      b.dataset.id = id;
      b.addEventListener('click', () => answer(id, b));
      box.appendChild(b);
    }
    fillOptions();
  }

  function fillOptions() {
    [...$('options').children].forEach((b) => { b.textContent = t('answers')[b.dataset.id]; });
  }

  function renderTask() {
    $('taskTitle').textContent = tt('title');
    let tip = state.tip ? state.tip() : tt('tip');
    if (taskNow().kind === 'tilt' && !state.tip && state.tilt === 0) tip = tt('go');
    $('taskTip').textContent = tip;
    $('tiltText').textContent = t('tilt')(Math.round(state.tilt));
  }

  // a message in place of the tip, made again when the language changes
  function say(fn) {
    state.tip = fn;
    renderTask();
  }

  function updateBar() {
    const n = state.task + (state.phase === 'play' ? 0 : 1);
    $('progressFill').style.width = (100 * n) / TASKS.length + '%';
    $('progressText').textContent = `${n} / ${TASKS.length}`;
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Layout: the Earth's path round the Sun, seen from a little above
  // ---------------------------------------------------------------------------

  const V = [0, Math.sin(VIEW), Math.cos(VIEW)];       // towards us
  const UP = [0, Math.cos(VIEW), -Math.sin(VIEW)];     // up on the screen

  function orbitLayout(W, H, pad) {
    const k = Math.sin(VIEW);
    const rx = Math.max(40, Math.min((W / 2 - pad) / 1.22, (H / 2 - pad) / (k + 0.34)));
    return {
      W, H, cx: W / 2, cy: H / 2 + 0.02 * rx, rx, ry: rx * k,
      re: clamp(0.2 * rx, 12, 80), rs: 0.13 * rx
    };
  }

  function layout() {
    const W = cv.clientWidth;
    const H = cv.clientHeight;
    if (!W || !H) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    state.L = { ...orbitLayout(W, H, 26), dpr, labels: true };
    const box = $('yards');
    box.classList.toggle('row', box.children.length > 1 && box.clientWidth > box.clientHeight * 1.3);
    for (const c of box.querySelectorAll('canvas')) {
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
    }
    state.yardKey = '';
  }

  // the angle round the path of day d: 21 June at the left, where the
  // north end of the axis leans towards the Sun, and anticlockwise as seen
  // from above, so that September is at the front
  const theta = (d) => Math.PI + (2 * Math.PI * (d - SOLSTICE)) / YEAR;
  const dayAt = (th) => wrap(SOLSTICE + ((th - Math.PI) / (2 * Math.PI)) * YEAR);

  // where on the screen the Earth is on day d, and where it is in space,
  // in pixels with y up and z towards us
  function earthAt(L, d) {
    const th = theta(d);
    return { x: L.cx + L.rx * Math.cos(th), y: L.cy - L.ry * Math.sin(th), P: [L.rx * Math.cos(th), 0, -L.rx * Math.sin(th)] };
  }

  // the Sun, which on Lähemal või kaugemal? sits nearer to where the Earth
  // is closest
  function sunAtL(L, near) {
    if (!near) return { x: L.cx, y: L.cy, S: [0, 0, 0] };
    const th = theta(CLOSEST);
    const f = 0.16;
    return { x: L.cx + f * L.rx * Math.cos(th), y: L.cy - f * L.ry * Math.sin(th), S: [f * L.rx * Math.cos(th), 0, -f * L.rx * Math.sin(th)] };
  }

  // ---------------------------------------------------------------------------
  // Drawing the globe
  // ---------------------------------------------------------------------------

  // The globe's own directions: a its axis, f the way to us across it and
  // e east, with longitude `front` facing us.
  function globeFrame(tilt, front) {
    const a = [Math.sin(tilt * DEG), Math.cos(tilt * DEG), 0];
    const va = dot(V, a);
    const f = norm([V[0] - va * a[0], V[1] - va * a[1], V[2] - va * a[2]]);
    return { a, f, e: cross(a, f), front };
  }
  function onGlobe(fr, lat, lon) {
    const p = lat * DEG;
    const l = (lon - fr.front) * DEG;
    const c = Math.cos(p);
    return [0, 1, 2].map((i) => fr.a[i] * Math.sin(p) + c * (Math.cos(l) * fr.f[i] + Math.sin(l) * fr.e[i]));
  }

  // The globe as a picture r device pixels in radius, lit from s, with the
  // map wrapped round it when it is ready.
  function globePicture(r, fr, s) {
    const key = [r, fr.a[0].toFixed(4), fr.front, s.map((v) => v.toFixed(3)).join(), !!state.map].join('|');
    if (state.globe && state.globe.key === key) return state.globe.cv;
    const size = Math.ceil(2 * r) + 2;
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const img = g.createImageData(size, size);
    const px = img.data;
    const m = state.map;
    const mid = size / 2;
    const SEA = [24, 70, 140];
    for (let j = 0; j < size; j++) {
      for (let i = 0; i < size; i++) {
        const x = (i + 0.5 - mid) / r;
        const yd = (j + 0.5 - mid) / r;
        const dd = Math.hypot(x, yd);
        const alpha = clamp((1 - dd) * r + 0.5, 0, 1);
        if (alpha <= 0) continue;
        const z = Math.sqrt(Math.max(0, 1 - dd * dd));
        const n = [x, -yd * UP[1] + z * V[1], -yd * UP[2] + z * V[2]];
        let col = SEA;
        if (m) {
          const lat = Math.asin(clamp(dot(n, fr.a), -1, 1)) / DEG;
          const lon = fr.front + Math.atan2(dot(n, fr.e), dot(n, fr.f)) / DEG;
          const mi = ((Math.floor(((lon + 180) / 360) * m.w) % m.w) + m.w) % m.w;
          const mj = clamp(Math.floor(((90 - lat) / 180) * m.h), 0, m.h - 1);
          const o = (mj * m.w + mi) * 4;
          col = [m.d[o], m.d[o + 1], m.d[o + 2]];
        }
        const cs = dot(n, s);
        const day = smooth(-0.08, 0.1, cs);
        const light = 0.12 + 0.88 * day * (0.55 + 0.45 * Math.max(0, cs));
        const haze = Math.pow(1 - z, 2) * 0.5 * (0.15 + 0.85 * day);
        const o = (j * size + i) * 4;
        px[o] = col[0] * light + 90 * haze + 4 * (1 - day);
        px[o + 1] = col[1] * light + 150 * haze + 8 * (1 - day);
        px[o + 2] = col[2] * light + 255 * haze + 26 * (1 - day);
        px[o + 3] = 255 * alpha;
      }
    }
    g.putImageData(img, 0, 0);
    state.globe = { key, cv: c };
    return c;
  }

  // The Earth at x, y, re pixels in radius, with its axis, the circle that
  // Estonia goes round in a day (bright where it is day there), and a flag
  // at each place.
  function drawEarth(g, L, x, y, re, tilt, s, places, front, cache) {
    const fr = globeFrame(tilt, front);
    const at = (n) => [x + re * n[0], y - re * dot(n, UP)];
    const line = (n0, n1) => {
      const [x0, y0] = at(n0);
      const [x1, y1] = at(n1);
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x1, y1);
      g.stroke();
    };
    const far = fr.a.map((v) => v * 1.55);
    g.lineCap = 'round';
    g.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    g.lineWidth = Math.max(1.5, re * 0.06);
    line(far.map((v) => -v), [0, 0, 0]);
    let pic;
    if (cache) pic = globePicture(Math.round(re * L.dpr), fr, s);
    else {
      const keep = state.globe;
      pic = globePicture(Math.round(re * L.dpr), fr, s);
      state.globe = keep;
    }
    const sz = pic.width / L.dpr;
    g.drawImage(pic, x - sz / 2, y - sz / 2, sz, sz);
    line(fr.a, far);

    // the equator, faintly, and the circle of each place
    const ring = (lat, lw, lit, dim) => {
      const N = 96;
      let prev = onGlobe(fr, lat, fr.front - 180);
      g.lineWidth = lw;
      for (let k = 1; k <= N; k++) {
        const n = onGlobe(fr, lat, fr.front - 180 + (360 * k) / N);
        if (dot(n, V) > 0 && dot(prev, V) > 0) {
          const midN = n.map((v, i) => (v + prev[i]) / 2);
          g.strokeStyle = dim === null ? lit : dot(midN, s) > 0 ? lit : dim;
          line(prev, n);
        }
        prev = n;
      }
    };
    ring(0, Math.max(1, re * 0.03), 'rgba(255, 255, 255, 0.35)', null);
    for (const id of places) {
      ring(PLACES[id].lat, Math.max(2, re * 0.07), '#ffd34d', 'rgba(140, 160, 220, 0.75)');
    }
    for (const id of places) {
      const p = PLACES[id];
      const n = onGlobe(fr, p.lat, p.lon);
      if (dot(n, V) < 0.05) continue;
      const [fx, fy] = at(n);
      const h = Math.max(10, re * 0.42);
      const w = h * 0.75;
      g.strokeStyle = '#fff';
      g.lineWidth = Math.max(1.2, h * 0.09);
      g.beginPath();
      g.moveTo(fx, fy);
      g.lineTo(fx, fy - h);
      g.stroke();
      const fh = h * 0.48;
      const top = fy - h;
      if (id === 'estonia') {
        ['#0072ce', '#000', '#fff'].forEach((c, i) => {
          g.fillStyle = c;
          g.fillRect(fx, top + (i * fh) / 3, w, fh / 3 + 0.3);
        });
      } else {
        g.fillStyle = '#ff5a5f';
        g.fillRect(fx, top, w, fh);
      }
      g.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      g.lineWidth = 1;
      g.strokeRect(fx, top, w, fh);
      if (places.length > 1 || L.labels) {
        g.font = `800 ${Math.round(clamp(re * 0.36, 11, 16))}px Nunito, sans-serif`;
        g.textAlign = 'left';
        g.textBaseline = 'middle';
        // at the right of the flag, or at the left of the pole when there is no room
        const name = t('places')[id];
        const right = fx + w + 4 + g.measureText(name).width < L.W - 2;
        g.textAlign = right ? 'left' : 'right';
        shadowText(g, name, right ? fx + w + 4 : fx - 4, top + fh / 2, '#fff');
      }
    }
  }

  function shadowText(g, text, x, y, color) {
    g.lineWidth = 3;
    g.strokeStyle = 'rgba(5, 8, 30, 0.85)';
    g.lineJoin = 'round';
    g.strokeText(text, x, y);
    g.fillStyle = color;
    g.fillText(text, x, y);
  }

  function drawSun(g, x, y, r) {
    const glow = g.createRadialGradient(x, y, r * 0.5, x, y, r * 2.6);
    glow.addColorStop(0, 'rgba(255, 200, 80, 0.55)');
    glow.addColorStop(1, 'rgba(255, 160, 40, 0)');
    g.fillStyle = glow;
    g.beginPath();
    g.arc(x, y, r * 2.6, 0, 2 * Math.PI);
    g.fill();
    const disc = g.createRadialGradient(x - r * 0.25, y - r * 0.25, r * 0.1, x, y, r);
    disc.addColorStop(0, '#fffbe0');
    disc.addColorStop(0.6, '#ffd34d');
    disc.addColorStop(1, '#ffa21c');
    g.fillStyle = disc;
    g.beginPath();
    g.arc(x, y, r, 0, 2 * Math.PI);
    g.fill();
  }

  // a point on the path, out from it by out pixels
  function pathPoint(L, d, out) {
    const th = theta(d);
    return [L.cx + (L.rx + out) * Math.cos(th), L.cy - (L.ry + out * 0.75) * Math.sin(th)];
  }

  function strokePath(g, L, d0, d1) {
    g.beginPath();
    const n = Math.max(2, Math.ceil(Math.abs(d1 - d0) / 2));
    for (let i = 0; i <= n; i++) {
      const [x, y] = pathPoint(L, d0 + ((d1 - d0) * i) / n, 0);
      if (i) g.lineTo(x, y);
      else g.moveTo(x, y);
    }
    g.stroke();
  }

  // the path with its months, the Sun and the Earth
  function drawOrbit(g, L, opts) {
    g.lineCap = 'round';
    g.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    g.lineWidth = 1.5;
    g.beginPath();
    g.ellipse(L.cx, L.cy, L.rx, L.ry, 0, 0, 2 * Math.PI);
    g.stroke();
    // the months, from where each begins, with its name in the middle of it
    if (opts.months === false) return drawBodies(g, L, opts);
    const fs = Math.round(clamp(L.rx * 0.075, 10, 15));
    g.font = `800 ${fs}px Nunito, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (let m = 0; m < 12; m++) {
      const d = monthStart(m);
      const [x0, y0] = pathPoint(L, d, -4);
      const [x1, y1] = pathPoint(L, d, 4);
      g.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x1, y1);
      g.stroke();
      const [tx, ty] = pathPoint(L, d + MONTH_DAYS[m] / 2, fs * 1.3);
      g.fillStyle = 'rgba(244, 246, 255, 0.55)';
      g.fillText(t('monthsShort')[m], tx, ty);
    }
    drawBodies(g, L, opts);
  }

  function drawBodies(g, L, opts) {
    if (opts.extra) opts.extra(g, L);
    const sun = sunAtL(L, opts.near);
    const earths = opts.earths.map((e) => ({ ...e, ...earthAt(L, e.day) }));
    // what is behind the Sun is drawn before it
    earths.filter((e) => e.P[2] < 0).forEach((e) => opts.drawEarth(e, sun));
    drawSun(g, sun.x, sun.y, L.rs);
    earths.filter((e) => e.P[2] >= 0).forEach((e) => opts.drawEarth(e, sun));
  }

  function draw() {
    const L = state.L;
    if (!L) return;
    const g = ctx;
    g.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    g.clearRect(0, 0, L.W, L.H);
    const k = taskNow();
    drawOrbit(g, L, {
      near: k.near,
      earths: [{ day: state.day }],
      extra: (g2) => {
        // the part of the path to go to, glowing
        if (state.hintOn && k.kind === 'place') {
          g2.strokeStyle = `rgba(255, 211, 77, ${0.3 + 0.25 * Math.sin(state.t * 5)})`;
          g2.lineWidth = Math.max(8, L.re * 0.8);
          k.at.filter((d) => !state.found.includes(d)).forEach((d) => strokePath(g2, L, d - k.within, d + k.within));
        }
        if (state.hintOn && k.id === 'australia') {
          g2.strokeStyle = `rgba(255, 211, 77, ${0.3 + 0.25 * Math.sin(state.t * 5)})`;
          g2.lineWidth = Math.max(8, L.re * 0.8);
          strokePath(g2, L, 350, 364);
        }
        // the days already found
        for (const d of state.found) {
          const [x, y] = pathPoint(L, d, 0);
          g2.fillStyle = '#ffd34d';
          g2.beginPath();
          g2.arc(x, y, Math.max(4, L.re * 0.25), 0, 2 * Math.PI);
          g2.fill();
        }
        if (k.near) drawDistances(g2, L);
      },
      drawEarth: (e, sun) => {
        const s = norm([sun.S[0] - e.P[0], sun.S[1] - e.P[1], sun.S[2] - e.P[2]]);
        drawEarth(g, L, e.x, e.y, L.re, state.tilt, s, k.places || ['estonia'], k.front ?? 30, true);
      }
    });
    drawYards();
  }

  // On Lähemal või kaugemal?, how far the Sun is where the Earth is
  // closest and where it is farthest
  function drawDistances(g, L) {
    const sun = sunAtL(L, true);
    const fs = Math.round(clamp(L.rx * 0.075, 10, 15));
    g.font = `800 ${fs}px Nunito, sans-serif`;
    g.textBaseline = 'middle';
    [[CLOSEST, 'closestAt'], [FARTHEST, 'farthestAt']].forEach(([d, key]) => {
      const [x, y] = pathPoint(L, d, 0);
      g.strokeStyle = 'rgba(255, 211, 77, 0.7)';
      g.lineWidth = 1.5;
      g.setLineDash([4, 5]);
      g.beginPath();
      g.moveTo(sun.x, sun.y);
      g.lineTo(x, y);
      g.stroke();
      g.setLineDash([]);
      g.fillStyle = '#ffd34d';
      g.beginPath();
      g.arc(x, y, 4, 0, 2 * Math.PI);
      g.fill();
      // under the line, nearer the Sun than the Earth
      const text = t(key);
      g.textAlign = 'center';
      const w = g.measureText(text).width;
      const tx = clamp(sun.x + (x - sun.x) * 0.5, w / 2 + 4, L.W - w / 2 - 4);
      shadowText(g, text, tx, sun.y + (y - sun.y) * 0.5 + fs, '#ffd34d');
    });
  }

  // ---------------------------------------------------------------------------
  // Drawing the yards
  // ---------------------------------------------------------------------------

  function drawYards() {
    const key = [state.day.toFixed(1), state.tilt, Astro.lang].join('|');
    if (key === state.yardKey) return;
    state.yardKey = key;
    for (const y of $('yards').children) {
      const id = y.dataset.place;
      const p = PLACES[id];
      const c = y.querySelector('canvas');
      drawYard(c, id, state.day, state.tilt);
      const [n, m] = dateOf(state.day);
      const wx = weather(p, state.day, state.tilt);
      y.querySelector('.yard-head').textContent = `${t('places')[id]}, ${t('date')(n, m)} · ${t('seasons')[wx.season]}`;
      const len = dayLength(p.lat, decl(state.day, state.tilt));
      y.querySelector('.yard-info').textContent = len >= 24 ? t('noSet') : len <= 0 ? t('noRise') : t('info')(hm(len), hm(24 - len));
    }
  }

  // The yard at a place on day d: the Sun's path over it from sunrise to
  // sunset with the Sun at noon, the ground, a tree, a child (a kangaroo in
  // Australia) with their noon shadows, and at the bottom the day (yellow)
  // and the night in 24 hours, with noon in the middle.
  function drawYard(c, id, d, tilt) {
    const W = c.clientWidth;
    const H = c.clientHeight;
    if (!W || !H) return;
    const dpr = window.devicePixelRatio || 1;
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, H);
    const p = PLACES[id];
    const dec = decl(d, tilt);
    const wx = weather(p, d, tilt);
    const south = p.lat > 0;            // which way the yard looks: to the Sun at noon
    const noon = sunAt(p.lat, dec, 0);
    const alt0 = noon.alt;
    const len = dayLength(p.lat, dec);

    const barH = clamp(H * 0.06, 8, 14);
    const barY = H - barH - 6;
    const yH = Math.round(H * 0.6);      // the horizon
    const top = 12;
    const bottom = barY - 6;
    const gh = bottom - yH;
    const xOf = (az) => {
      let a = south ? az : az - Math.PI;
      a = Math.atan2(Math.sin(a), Math.cos(a));
      return W / 2 + (a / Math.PI) * (W / 2) * 0.96;
    };
    const yOf = (alt) => yH - (alt / (Math.PI / 2)) * (yH - top);

    // the sky, brighter the higher the Sun climbs
    const lit = clamp(alt0 / (60 * DEG), 0, 1);
    const sky = g.createLinearGradient(0, 0, 0, yH);
    if (alt0 > 0) {
      sky.addColorStop(0, rgb(mix([46, 66, 120], [40, 120, 220], lit)));
      sky.addColorStop(1, rgb(mix([150, 160, 190], [160, 210, 250], lit)));
    } else {
      sky.addColorStop(0, rgb([10, 16, 45]));
      sky.addColorStop(1, rgb([34, 44, 90]));
    }
    g.fillStyle = sky;
    g.fillRect(0, 0, W, yH + 1);

    // the Sun's path, dotted, and the Sun at noon
    g.strokeStyle = 'rgba(255, 236, 160, 0.85)';
    g.lineWidth = 2;
    g.setLineDash([2, 6]);
    g.lineCap = 'round';
    let on = false;
    g.beginPath();
    for (let h = -180; h <= 180; h += 1.5) {
      const s = sunAt(p.lat, dec, h * DEG);
      if (s.alt <= 0) {
        on = false;
        continue;
      }
      const x = xOf(s.az);
      const y = yOf(s.alt);
      if (on) g.lineTo(x, y);
      else g.moveTo(x, y);
      on = true;
    }
    g.stroke();
    g.setLineDash([]);
    const rS = clamp(Math.min(W, H) * 0.05, 8, 22);
    if (alt0 > 0) {
      const sx = xOf(noon.az);
      const sy = yOf(alt0);
      drawSun(g, sx, sy, rS);
      g.font = `900 ${Math.round(clamp(H * 0.07, 12, 18))}px Nunito, sans-serif`;
      g.textAlign = 'left';
      g.textBaseline = 'middle';
      shadowText(g, `${Math.round(alt0 / DEG)}°`, sx + rS * 1.5, sy, '#fff');
    }

    // the ground: green, yellowing in autumn, or white with snow
    const snow = Math.abs(p.lat) > 45 ? smooth(0.55, 0.75, -wx.w) : 0;
    let grass = [80, 150, 64];
    if (wx.trend < 0) grass = mix(grass, [150, 140, 70], smooth(0.5, -0.2, wx.w));
    if (wx.trend > 0) grass = mix(grass, [120, 130, 80], smooth(0, -0.5, wx.w));
    if (id === 'australia') grass = mix([84, 150, 70], [170, 160, 90], smooth(0.2, 1, wx.w));
    grass = mix(grass, [232, 240, 252], snow);
    const shade = alt0 > 0 ? 0.6 + 0.4 * lit : 0.35;
    const far = mix(grass, [60, 80, 110], 0.35).map((v) => v * shade);
    g.fillStyle = rgb(far);
    g.beginPath();
    g.moveTo(0, yH + 2);
    for (let x = 0; x <= W; x += 8) g.lineTo(x, yH - 3 - 4 * Math.sin(x / 37) - 3 * Math.sin(x / 13 + 1));
    g.lineTo(W, yH + 2);
    g.fill();
    g.fillStyle = rgb(grass.map((v) => v * shade));
    g.fillRect(0, yH, W, bottom - yH);

    // the directions on the horizon
    g.font = `800 ${Math.round(clamp(H * 0.05, 10, 13))}px Nunito, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'bottom';
    g.fillStyle = snow > 0.5 ? 'rgba(40, 50, 90, 0.7)' : 'rgba(255, 255, 255, 0.75)';
    const dirs = t('dirs');
    [[-90, 'e'], [south ? 0 : 180, south ? 's' : 'n'], [90, 'w']].forEach(([az, k]) => g.fillText(dirs[k], xOf(az * DEG), bottom - 2));

    // the noon shadows fall towards us, longer the lower the Sun
    // with a narrow stem and a round end, for a body and a head, or a
    // trunk and a crown
    const shadow = (x, y, h, stem, end) => {
      if (alt0 <= 0) return;
      const l = Math.min((h / Math.tan(alt0)) * 0.35, H * 2);
      g.save();
      g.beginPath();
      g.rect(0, yH, W, gh);
      g.clip();
      const dark = snow > 0.5 ? [60, 80, 140] : [10, 20, 40];
      const fade = g.createLinearGradient(0, y, 0, y + l);
      fade.addColorStop(0, rgb(dark, 0.3));
      fade.addColorStop(1, rgb(dark, 0.12));
      g.fillStyle = fade;
      g.beginPath();
      g.moveTo(x - stem / 2, y);
      g.lineTo(x + stem / 2, y);
      g.lineTo(x + stem * 0.4, y + l * 0.8);
      g.lineTo(x - stem * 0.4, y + l * 0.8);
      g.fill();
      if (end > 0) {
        g.beginPath();
        g.ellipse(x, y + l * 0.88, end, clamp((end * 0.35) / Math.sin(alt0), end * 0.35, end * 2.5), 0, 0, 2 * Math.PI);
        g.fill();
      }
      g.restore();
    };

    const u = Math.min(W, H);
    // the tree
    const tx = W * 0.84;
    const ty = yH + gh * 0.3;
    const th = Math.min(H * 0.4, W * 0.32, (ty - top) * 0.7);
    const leaves = id === 'australia' ? { w: 1, trend: 0 } : wx;
    shadow(tx, ty, th * 0.85, th * 0.1, leafAmount(leaves) > 0.3 ? th * 0.28 : 0);
    drawTree(g, tx, ty, th, leaves, snow);

    // the snowman, when there is snow
    if (snow > 0.5) drawSnowman(g, W * 0.14, yH + gh * 0.55, Math.min(u * 0.22, gh * 0.9));

    // the child, or the kangaroo
    const cx = W * 0.3;
    const cy = yH + gh * 0.62;
    const ch = Math.min(H * 0.3, (cy - top) * 0.7);
    shadow(cx, cy, ch, ch * 0.3, ch * 0.12);
    if (id === 'australia') drawKangaroo(g, cx, cy, ch);
    else drawChild(g, cx, cy, ch, wx.season === 'winter' || snow > 0.3);

    // the day and the night
    const bx = 10;
    const bw = W - 20;
    g.fillStyle = rgb([16, 22, 60]);
    roundRect(g, bx, barY, bw, barH, barH / 2);
    g.fill();
    if (len > 0) {
      g.fillStyle = '#ffd34d';
      const dw = (bw * len) / 24;
      roundRect(g, bx + (bw - dw) / 2, barY, dw, barH, barH / 2);
      g.fill();
    }
  }

  function roundRect(g, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  // how many leaves a tree has (0 to 1), their colour, and how much blossom
  function leavesOf(wx) {
    if (wx.trend === 0 && wx.w >= -0.1 && wx.w < 0.95) return { amount: 0.85, col: [96, 170, 70], blossom: 0 };
    if (wx.w > 0.3 || (wx.trend === 0 && wx.w >= 0.95)) return { amount: 1, col: [44, 128, 56], blossom: 0 };
    if (wx.trend > 0) {
      return {
        amount: smooth(-0.3, 0.3, wx.w),
        col: [130, 200, 90],
        blossom: smooth(-0.3, 0, wx.w) * (1 - smooth(0.15, 0.3, wx.w))
      };
    }
    return { amount: smooth(-0.45, 0, wx.w), col: mix([214, 96, 40], [226, 176, 50], smooth(-0.3, 0.3, wx.w)), blossom: 0 };
  }
  const leafAmount = (wx) => leavesOf(wx).amount;

  // a tree h high standing at x, y: green in summer, with blossom in
  // spring, yellow and orange in autumn, and bare in winter
  function drawTree(g, x, y, h, wx, snow) {
    const trunk = '#6b4426';
    g.fillStyle = trunk;
    g.beginPath();
    g.moveTo(x - h * 0.05, y);
    g.lineTo(x - h * 0.03, y - h * 0.6);
    g.lineTo(x + h * 0.03, y - h * 0.6);
    g.lineTo(x + h * 0.05, y);
    g.fill();
    // the branches, which show when the leaves are few
    g.strokeStyle = trunk;
    g.lineCap = 'round';
    g.lineWidth = Math.max(1.5, h * 0.025);
    const branches = [[-0.22, 0.85, -0.5], [0.24, 0.82, -0.45], [-0.12, 0.98, -0.62], [0.1, 1, -0.66], [0, 0.9, -0.55]];
    for (const [bx, by, from] of branches) {
      g.beginPath();
      g.moveTo(x, y + from * h);
      g.lineTo(x + bx * h, y - by * h);
      g.stroke();
    }
    if (snow > 0.5) {
      g.strokeStyle = 'rgba(240, 246, 255, 0.9)';
      g.lineWidth = Math.max(1, h * 0.012);
      for (const [bx, by] of branches) {
        g.beginPath();
        g.moveTo(x + bx * h * 0.6, y - by * h * 0.8 - 1);
        g.lineTo(x + bx * h, y - by * h - 1);
        g.stroke();
      }
    }
    const { amount, col, blossom } = leavesOf(wx);
    if (amount > 0.02) {
      const blobs = [[0, 0.82, 0.3], [-0.2, 0.7, 0.22], [0.2, 0.7, 0.22], [-0.1, 0.95, 0.2], [0.12, 0.93, 0.2]];
      g.fillStyle = rgb(col, 0.35 + 0.65 * amount);
      for (const [bx, by, r] of blobs) {
        g.beginPath();
        g.arc(x + bx * h, y - by * h, r * h * (0.55 + 0.45 * amount), 0, 2 * Math.PI);
        g.fill();
      }
    }
    if (blossom > 0.05) {
      g.fillStyle = rgb([255, 214, 230], blossom);
      for (let i = 0; i < 14; i++) {
        const a = i * 2.4;
        const r = 0.28 * h * Math.sqrt((i + 0.5) / 14);
        g.beginPath();
        g.arc(x + r * Math.cos(a), y - 0.82 * h + r * Math.sin(a) * 0.8, Math.max(1.5, h * 0.025), 0, 2 * Math.PI);
        g.fill();
      }
    }
  }

  // a child h tall standing at x, y, in a warm coat and hat in winter
  function drawChild(g, x, y, h, winter) {
    const s = h / 100;
    g.lineCap = 'round';
    // legs
    g.strokeStyle = '#2b3566';
    g.lineWidth = 9 * s;
    g.beginPath();
    g.moveTo(x - 7 * s, y - 32 * s);
    g.lineTo(x - 8 * s, y - 4 * s);
    g.moveTo(x + 7 * s, y - 32 * s);
    g.lineTo(x + 8 * s, y - 4 * s);
    g.stroke();
    // body and arms
    const coat = winter ? '#3d6fd1' : '#ff6b5e';
    g.strokeStyle = coat;
    g.lineWidth = 8 * s;
    g.beginPath();
    g.moveTo(x - 14 * s, y - 62 * s);
    g.lineTo(x - 24 * s, y - 40 * s);
    g.moveTo(x + 14 * s, y - 62 * s);
    g.lineTo(x + 24 * s, y - 40 * s);
    g.stroke();
    g.fillStyle = coat;
    roundRect(g, x - 16 * s, y - 68 * s, 32 * s, (winter ? 42 : 36) * s, 10 * s);
    g.fill();
    // hands, head and face
    g.fillStyle = winter ? '#ffd34d' : '#f2c49b';
    for (const sx of [-1, 1]) {
      g.beginPath();
      g.arc(x + sx * 25 * s, y - 38 * s, 4.5 * s, 0, 2 * Math.PI);
      g.fill();
    }
    g.fillStyle = '#f2c49b';
    g.beginPath();
    g.arc(x, y - 80 * s, 13 * s, 0, 2 * Math.PI);
    g.fill();
    g.fillStyle = '#1a1440';
    for (const sx of [-1, 1]) {
      g.beginPath();
      g.arc(x + sx * 4.5 * s, y - 81 * s, 1.6 * s, 0, 2 * Math.PI);
      g.fill();
    }
    g.strokeStyle = '#1a1440';
    g.lineWidth = 1.6 * s;
    g.beginPath();
    g.arc(x, y - 78 * s, 5 * s, 0.2 * Math.PI, 0.8 * Math.PI);
    g.stroke();
    if (winter) {
      // a hat with a bobble, and a scarf
      g.fillStyle = '#e8455a';
      g.beginPath();
      g.arc(x, y - 84 * s, 13.5 * s, Math.PI, 2 * Math.PI);
      g.fill();
      g.fillStyle = '#fff';
      g.beginPath();
      g.arc(x, y - 99 * s, 4.5 * s, 0, 2 * Math.PI);
      g.fill();
      g.fillStyle = '#e8455a';
      roundRect(g, x - 13 * s, y - 70 * s, 26 * s, 7 * s, 3 * s);
      g.fill();
    } else {
      g.fillStyle = '#7a4a22';
      g.beginPath();
      g.arc(x, y - 84 * s, 13.5 * s, Math.PI * 1.05, Math.PI * 1.95);
      g.fill();
    }
  }

  // a kangaroo h tall standing at x, y
  function drawKangaroo(g, x, y, h) {
    const s = h / 100;
    const fur = '#b8743a';
    g.fillStyle = fur;
    g.strokeStyle = fur;
    g.lineCap = 'round';
    // the tail and the big feet
    g.lineWidth = 9 * s;
    g.beginPath();
    g.moveTo(x + 10 * s, y - 20 * s);
    g.quadraticCurveTo(x + 34 * s, y - 6 * s, x + 46 * s, y - 2 * s);
    g.stroke();
    g.lineWidth = 7 * s;
    g.beginPath();
    g.moveTo(x - 4 * s, y - 3 * s);
    g.lineTo(x - 22 * s, y - 3 * s);
    g.stroke();
    // the body, the head and the ears
    g.beginPath();
    g.ellipse(x, y - 34 * s, 17 * s, 30 * s, -0.2, 0, 2 * Math.PI);
    g.fill();
    g.beginPath();
    g.ellipse(x - 10 * s, y - 72 * s, 10 * s, 12 * s, -0.4, 0, 2 * Math.PI);
    g.fill();
    g.beginPath();
    g.ellipse(x - 20 * s, y - 68 * s, 8 * s, 5 * s, -0.2, 0, 2 * Math.PI);
    g.fill();
    for (const [ex, ang] of [[-12, -0.25], [-4, 0.15]]) {
      g.beginPath();
      g.ellipse(x + ex * s, y - 88 * s, 3.5 * s, 9 * s, ang, 0, 2 * Math.PI);
      g.fill();
    }
    g.fillStyle = '#e8c49a';
    g.beginPath();
    g.ellipse(x - 4 * s, y - 30 * s, 9 * s, 18 * s, -0.2, 0, 2 * Math.PI);
    g.fill();
    g.fillStyle = '#1a1440';
    g.beginPath();
    g.arc(x - 13 * s, y - 75 * s, 1.8 * s, 0, 2 * Math.PI);
    g.arc(x - 27 * s, y - 68 * s, 1.8 * s, 0, 2 * Math.PI);
    g.fill();
    // the little arms
    g.strokeStyle = fur;
    g.lineWidth = 4 * s;
    g.beginPath();
    g.moveTo(x - 10 * s, y - 50 * s);
    g.lineTo(x - 20 * s, y - 42 * s);
    g.stroke();
  }

  function drawSnowman(g, x, y, h) {
    const s = h / 100;
    g.fillStyle = '#f4f8ff';
    g.strokeStyle = 'rgba(150, 170, 210, 0.9)';
    g.lineWidth = 1.5;
    for (const [cy, r] of [[-22, 22], [-58, 16], [-84, 11]]) {
      g.beginPath();
      g.arc(x, y + cy * s, r * s, 0, 2 * Math.PI);
      g.fill();
      g.stroke();
    }
    g.fillStyle = '#1a1440';
    for (const sx of [-1, 1]) {
      g.beginPath();
      g.arc(x + sx * 4 * s, y - 87 * s, 1.6 * s, 0, 2 * Math.PI);
      g.fill();
    }
    g.fillStyle = '#ff8a2a';
    g.beginPath();
    g.moveTo(x, y - 84 * s);
    g.lineTo(x + 12 * s, y - 82 * s);
    g.lineTo(x, y - 80 * s);
    g.fill();
  }

  // ---------------------------------------------------------------------------
  // Playing
  // ---------------------------------------------------------------------------

  function frame(now) {
    const dt = Math.min(0.05, (now - state.last) / 1000);
    state.last = now;
    state.t += dt;
    const go = state.go;
    if (go) {
      go.t += dt;
      const q = clamp(go.t / go.dur, 0, 1);
      const e = q < 0.5 ? 2 * q * q : 1 - (-2 * q + 2) ** 2 / 2;
      moveTo(wrap(go.from + go.by * e));
      if (q >= 1) {
        state.go = null;
        if (go.check) dropped();
      }
    }
    draw();
    state.raf = requestAnimationFrame(frame);
  }

  // moves the Earth to day d, with a note for each new month
  function moveTo(d) {
    const before = state.day;
    if (dateOf(before)[1] !== dateOf(d)[1]) sfx.note(dateOf(d)[1] % 7);
    if (state.tilt === 0) state.turned += Math.abs(dayDiff(d, before));
    state.day = d;
    if (taskNow().kind === 'tilt') checkTilt();
  }

  function slideTo(d, check, dur) {
    const by = dayDiff(d, state.day);
    state.go = { from: state.day, by, t: 0, dur: dur || clamp(Math.abs(by) / 180, 0.25, 0.8), check };
  }

  // the Earth let go, or slid to where it was tapped
  function dropped() {
    const k = taskNow();
    if (state.phase !== 'play' || k.kind !== 'place') return;
    const hit = k.at.find((d) => !state.found.includes(d) && Math.abs(dayDiff(state.day, d)) <= k.within);
    if (hit !== undefined) {
      state.found.push(hit);
      sfx.snap();
      slideTo(hit, false, 0.35);
      if (state.found.length === k.at.length) solved();
      else {
        state.hintOn = false;
        state.misses = 0;
        say(() => tt('one'));
      }
      return;
    }
    state.misses++;
    if (state.misses >= 2) state.hintOn = true;
    const p = PLACES.estonia;
    const day = state.day;
    say(() => {
      let s;
      if (k.id === 'equinox') {
        const len = dayLength(p.lat, decl(day, state.tilt));
        s = `${t('dayNight')(hm(len), hm(24 - len))} ${tt('miss')}`;
      } else s = `${t('here')(t('seasons')[weather(p, day, state.tilt).season])} ${tt('miss')}`;
      return state.hintOn ? `${s} ${t('yellow')}` : s;
    });
  }

  function answer(id, b) {
    const k = taskNow();
    if (state.phase !== 'play') return;
    if (id === k.right) {
      b.classList.add('right');
      sfx.snap();
      if (k.id === 'australia') slideTo(357, false);
      solved();
      return;
    }
    sfx.oops();
    b.classList.remove('wrong');
    void b.offsetWidth;
    b.classList.add('wrong');
    state.misses++;
    if (state.misses >= 2) pulseRight();
    say(() => tt('miss'));
  }

  function pulseRight() {
    const k = taskNow();
    [...$('options').children].forEach((o) => o.classList.toggle('pulse', o.dataset.id === k.right));
    if (k.id === 'australia') state.hintOn = true;
  }

  function checkTilt() {
    if (state.phase !== 'play') return;
    if (state.tilt === 0 && state.turned >= YEAR / 3) solved();
  }

  function solved() {
    state.phase = 'solved';
    state.hintOn = false;
    done.add(taskNow().id);
    store.set('done', [...done]);
    updateBar();
    const last = state.task >= TASKS.length - 1;
    later(900, () => {
      $('factText').textContent = tt('fact');
      $('nextBtn').textContent = last ? t('finish') : t('next');
      $('fact').classList.remove('hidden');
    });
  }

  function next() {
    sfx.pick();
    $('fact').classList.add('hidden');
    if (state.task >= TASKS.length - 1) win();
    else {
      startTask(state.task + 1);
      store.set('task', state.task);
    }
  }

  function hint() {
    const k = taskNow();
    if (state.phase !== 'play') return;
    sfx.pick();
    if (k.kind === 'place') {
      state.hintOn = true;
      say(() => `${tt('tip')} ${t('yellow')}`);
    } else if (k.kind === 'ask') {
      if (k.id === 'australia') {
        state.hintOn = true;
        say(() => `${tt('tip')} ${t('yellow')}`);
      } else pulseRight();
    } else {
      $('tiltBox').classList.toggle('pulse', state.tilt > 0);
      renderTask();
    }
  }

  // ---------------------------------------------------------------------------
  // Win
  // ---------------------------------------------------------------------------

  function win() {
    stopAll();
    state.phase = 'over';
    store.set('task', 0);
    state.task = TASKS.length - 1;
    sfx.win();
    $('win').classList.remove('hidden');
    drawWin();
    Astro.startConfetti($('confetti'));
  }

  // the path with the Earth in the middle of each season in Estonia
  const SEASON_DAYS = [[174, 'summer'], [264, 'autumn'], [357, 'winter'], [80, 'spring']];
  function drawWin() {
    const c = $('winPic');
    const W = c.clientWidth;
    const H = c.clientHeight;
    if (!W || !H) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const L = { ...orbitLayout(W, H, 34), dpr, labels: false };
    L.re = clamp(0.13 * L.rx, 12, 60);
    const fs = Math.round(clamp(L.rx * 0.08, 11, 17));
    drawOrbit(g, L, {
      months: false,
      earths: SEASON_DAYS.map(([day, season]) => ({ day, season })),
      drawEarth: (e, sun) => {
        const s = norm([sun.S[0] - e.P[0], sun.S[1] - e.P[1], sun.S[2] - e.P[2]]);
        drawEarth(g, L, e.x, e.y, L.re, TILT, s, ['estonia'], 30, false);
        const len = dayLength(PLACES.estonia.lat, decl(e.day, TILT));
        const below = e.P[2] >= 0 || Math.abs(e.P[0]) > L.rx * 0.5;
        const ty = e.y + (below ? L.re + fs * 1.1 : -L.re * 1.7 - fs * 1.4);
        g.font = `900 ${fs}px Nunito, sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        const name = t('seasons')[e.season];
        const tx = clamp(e.x, g.measureText(name).width / 2 + 4, W - g.measureText(name).width / 2 - 4);
        shadowText(g, name, tx, ty, '#ffd34d');
        g.font = `800 ${Math.round(fs * 0.85)}px Nunito, sans-serif`;
        shadowText(g, hm(len), tx, ty + fs * 1.1, '#fff');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Pointer, buttons & resizing
  // ---------------------------------------------------------------------------

  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };
  const dayFrom = (L, x, y) => dayAt(Math.atan2(-(y - L.cy) / L.ry, (x - L.cx) / L.rx));

  // A press on the Earth drags it along its path; a press anywhere else
  // slides it to the nearest place on the path.
  cv.addEventListener('pointerdown', (e) => {
    const L = state.L;
    if (!L || state.phase !== 'play') return;
    const [x, y] = pos(e);
    const at = earthAt(L, state.day);
    if (Math.hypot(x - at.x, y - at.y) < L.re + 18) {
      state.drag = true;
      state.go = null;
      sfx.pick();
      try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      return;
    }
    slideTo(dayFrom(L, x, y), true);
  });
  cv.addEventListener('pointermove', (e) => {
    if (!state.drag || !state.L) return;
    const [x, y] = pos(e);
    moveTo(dayFrom(state.L, x, y));
  });
  const letGo = () => {
    if (!state.drag) return;
    state.drag = false;
    dropped();
  };
  cv.addEventListener('pointerup', letGo);
  cv.addEventListener('pointercancel', letGo);

  $('tilt').addEventListener('input', () => {
    state.tilt = Number($('tilt').value);
    state.globe = null;
    if (state.tilt === 0) {
      $('tiltBox').classList.remove('pulse');
      state.turned = 0;
    }
    renderTask();
  });

  const ro = new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden')) layout();
    if (!$('win').classList.contains('hidden')) drawWin();
  });
  [document.body, cv, $('yards')].forEach((el) => ro.observe(el));

  $('playBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', () => {
    state.task = 0;
    startGame();
  });
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('hintBtn').addEventListener('click', hint);
  $('nextBtn').addEventListener('click', next);
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  buildMenu();
  updateToggles();
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    if (!$('game').classList.contains('hidden')) {
      renderTask();
      fillOptions();
      state.yardKey = '';
      if (!$('fact').classList.contains('hidden')) {
        $('factText').textContent = tt('fact');
        $('nextBtn').textContent = state.task >= TASKS.length - 1 ? t('finish') : t('next');
      }
    }
    if (!$('win').classList.contains('hidden')) drawWin();
  });
})();
