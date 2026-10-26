'use strict';

(() => {
  const { $, shuffle, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // The puzzle's photos by Tõrva Astronoomiaklubi (AstroBin, CC BY-NC-SA).
  const PICS = [
    { file: '../pusle/images/pleiades.jpg', name: { et: 'Plejaadid (Sõel)', en: 'The Pleiades' } },
    { file: '../pusle/images/moon.jpg', name: { et: 'Kuu', en: 'The Moon' } },
    { file: '../pusle/images/saturn.jpg', name: { et: 'Saturn', en: 'Saturn' } },
    { file: '../pusle/images/jupiter.jpg', name: { et: 'Jupiter', en: 'Jupiter' } },
    { file: '../pusle/images/eclipse.jpg', name: { et: 'Päikesevarjutus', en: 'Solar eclipse' } },
    { file: '../pusle/images/tsuchinshan.jpg', name: { et: 'Komeet Tsuchinshan-ATLAS', en: 'Comet Tsuchinshan–ATLAS' } },
    { file: '../pusle/images/ponsbrooks.jpg', name: { et: 'Komeet Pons-Brooks', en: 'Comet Pons–Brooks' } },
    { file: '../pusle/images/orion.jpg', name: { et: 'Orioni udu', en: 'Orion Nebula' } },
    { file: '../pusle/images/horsehead.jpg', name: { et: 'Hobusepea udu', en: 'Horsehead Nebula' } },
    { file: '../pusle/images/rosette.jpg', name: { et: 'Roseti udu', en: 'Rosette Nebula' } },
    { file: '../pusle/images/bubble.jpg', name: { et: 'Mulli udu', en: 'Bubble Nebula' } },
    { file: '../pusle/images/california.jpg', name: { et: 'California udu', en: 'California Nebula' } },
    { file: '../pusle/images/crescent.jpg', name: { et: 'Poolkuu udu', en: 'Crescent Nebula' } },
    { file: '../pusle/images/cygnusloop.jpg', name: { et: 'Luige silmus', en: 'Cygnus Loop' } },
    { file: '../pusle/images/dumbbell.jpg', name: { et: 'Hantli udu', en: 'Dumbbell Nebula' } },
    { file: '../pusle/images/elephant.jpg', name: { et: 'Elevandilondi udu', en: 'Elephant’s Trunk Nebula' } },
    { file: '../pusle/images/iris.jpg', name: { et: 'Iirise udu', en: 'Iris Nebula' } },
    { file: '../pusle/images/northamerica.jpg', name: { et: 'Põhja-Ameerika udu', en: 'North America Nebula' } },
    { file: '../pusle/images/spider.jpg', name: { et: 'Ämbliku ja Kärbse udu', en: 'Spider and Fly Nebulae' } },
    { file: '../pusle/images/questionmark.jpg', name: { et: 'Küsimärgi udu', en: 'Question Mark Nebula' } },
    { file: '../pusle/images/heart.jpg', name: { et: 'Südame udu', en: 'Heart Nebula' } },
    { file: '../pusle/images/crab.jpg', name: { et: 'Krabi udu', en: 'Crab Nebula' } },
    { file: '../pusle/images/andromeda.jpg', name: { et: 'Andromeeda galaktika', en: 'Andromeda Galaxy' } },
    { file: '../pusle/images/whirlpool.jpg', name: { et: 'Keerise galaktika', en: 'Whirlpool Galaxy' } },
    { file: '../pusle/images/pinwheel.jpg', name: { et: 'Tuuleveski galaktika', en: 'Pinwheel Galaxy' } },
    { file: '../pusle/images/triangulum.jpg', name: { et: 'Kolmnurga galaktika', en: 'Triangulum Galaxy' } },
    { file: '../pusle/images/bode.jpg', name: { et: 'Bode ja Sigari galaktika', en: 'Bode’s and Cigar Galaxies' } },
    { file: '../pusle/images/triplet.jpg', name: { et: 'Lõvi kolmik', en: 'Leo Triplet' } },
    { file: '../pusle/images/sombrero.jpg', name: { et: 'Sombreero galaktika', en: 'Sombrero Galaxy' } },
    { file: '../pusle/images/needle.jpg', name: { et: 'Nõela galaktika', en: 'Needle Galaxy' } }
  ];

  // Number of pairs offered, with the columns of the little grid picture.
  const PAIRS = [
    { n: 3, cols: 3 },
    { n: 4, cols: 4 },
    { n: 6, cols: 4 },
    { n: 8, cols: 4 },
    { n: 10, cols: 5 },
    { n: 12, cols: 6 },
    { n: 15, cols: 6 },
    { n: 18, cols: 6 }
  ];

  const TEXT = {
    et: {
      title: 'Mälumäng',
      intro: 'Pööra kaarte ja leia kaks ühesugust pilti.',
      choosePairs: 'Mitu paari?',
      play: 'Mängi',
      wellDone: 'Tubli!',
      again: 'Uuesti',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      peek: 'Piilu',
      sound: 'Heli',
      credit: 'Fotod: Tõrva Astronoomiaklubi, litsents CC BY-NC-SA.',
      found: (n, tries) => `Leidsid kõik ${n} paari ${tries} katsega!`,
      foundPeeked: (n) => `Leidsid kõik ${n} paari! Sa piilusid, seega seekord katseid ei loeta.`,
      newBest: 'See on sinu parim tulemus! 🏆',
      oldBest: (b) => `Sinu parim: ${b} katset.`,
      best: (b) => `🏆 Parim: ${b} katset`,
      noBest: 'Parimat tulemust veel pole.',
      clear: '🗑️ Kustuta parim tulemus',
      clearSure: '🗑️ Puuduta uuesti, et kustutada'
    },
    en: {
      title: 'Memory',
      intro: 'Turn the cards over and find two pictures that are the same.',
      choosePairs: 'How many pairs?',
      play: 'Play',
      wellDone: 'Well done!',
      again: 'Again',
      menu: 'Menu',
      allGames: 'All games',
      peek: 'Peek',
      sound: 'Sound',
      credit: 'Photos: Tõrva Astronoomiaklubi, licence CC BY-NC-SA.',
      found: (n, tries) => `You found all ${n} pairs in ${tries} tries!`,
      foundPeeked: (n) => `You found all ${n} pairs! You peeked, so the tries don't count this time.`,
      newBest: 'That is your best score! 🏆',
      oldBest: (b) => `Your best: ${b} tries.`,
      best: (b) => `🏆 Best: ${b} tries`,
      noBest: 'No best score yet.',
      clear: '🗑️ Clear the best score',
      clearSure: '🗑️ Tap again to clear it'
    }
  };

  const MISMATCH_MS = 1100; // how long two different cards stay open
  const PEEK_MS = 1500;     // how long the eye button shows all cards

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('malumang.');
  const state = {
    pairs: store.get('pairs', 4),
    cards: [],      // { pic, el, open, matched }
    open: [],       // cards turned over, at most two
    closeTimer: 0,
    peeking: false,
    peeked: false,  // the eye button was used, so the tries don't count
    found: [],      // pictures in the order they were found
    tries: 0,
    best: store.get('best', {}), // the fewest tries for each number of pairs
    clearArmed: false, // the best score is cleared on the next tap of 🗑️
    clearTimer: 0
  };
  if (!state.best || typeof state.best !== 'object') state.best = {};
  if (!PAIRS.some((p) => p.n === state.pairs)) state.pairs = 4;

  const area = $('area');
  const board = $('board');
  const t = (key) => TEXT[Astro.lang][key];

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    const counts = $('counts');
    PAIRS.forEach(({ n, cols }) => {
      const b = document.createElement('button');
      b.className = 'count';
      b.innerHTML = `<span class="mini" style="--k:${cols}">${'<i></i>'.repeat(2 * n)}</span><b>${n}</b>`;
      b.addEventListener('click', () => {
        state.pairs = n;
        store.set('pairs', n);
        state.clearArmed = false;
        sfx.pick();
        updateMenu();
      });
      counts.appendChild(b);
    });
  }

  function updateMenu() {
    [...$('counts').children].forEach((b, i) => b.classList.toggle('selected', PAIRS[i].n === state.pairs));
    const best = state.best[state.pairs];
    $('best').textContent = best ? t('best')(best) : t('noBest');
    $('clearBtn').classList.toggle('hidden', !best);
    $('clearBtn').textContent = t(state.clearArmed ? 'clearSure' : 'clear');
  }

  function updateNames() {
    for (const c of state.cards) c.el.querySelector('.name').textContent = c.pic.name[Astro.lang];
  }

  function showMenu() {
    clearTimeout(state.closeTimer);
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
    clearTimeout(state.closeTimer);
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    updateToggles();

    // a different set of pictures each time, two cards of each
    const pics = shuffle([...PICS]).slice(0, state.pairs);
    board.innerHTML = '';
    state.cards = shuffle([...pics, ...pics]).map((pic) => {
      const el = document.createElement('button');
      el.className = 'card';
      el.innerHTML =
        '<div class="inner"><div class="face back">✦</div>' +
        `<div class="face front"><img src="${pic.file}" alt=""><span class="name"></span></div></div>`;
      board.appendChild(el);
      const card = { pic, el, open: false, matched: false };
      el.addEventListener('click', () => turn(card));
      return card;
    });
    state.open = [];
    state.found = [];
    state.tries = 0;
    state.peeking = false;
    state.peeked = false;
    updateNames();
    layout();
    updateProgress();
  }

  // Columns and card size that make the cards as big as possible.
  function layout() {
    const n = state.cards.length;
    if (!n) return;
    const W = area.clientWidth;
    const H = area.clientHeight;
    const gap = Math.max(8, Math.min(W, H) * 0.02);
    let best = { score: -1 };
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols);
      const size = Math.min((W - gap * (cols + 1)) / cols, (H - gap * (rows + 1)) / rows);
      // a full last row looks tidier
      const score = size * (rows * cols === n ? 1 : 0.9);
      if (score > best.score) best = { score, cols, size: Math.floor(size) };
    }
    board.style.gridTemplateColumns = `repeat(${best.cols}, ${best.size}px)`;
    board.style.gap = gap + 'px';
    board.style.setProperty('--size', best.size + 'px');
  }

  function setOpen(card, open) {
    card.open = open;
    card.el.classList.toggle('open', open);
  }

  // Close two different cards that are still showing.
  function closeMismatch() {
    clearTimeout(state.closeTimer);
    state.open.forEach((c) => setOpen(c, false));
    state.open = [];
  }

  function turn(card) {
    if (state.peeking || card.matched || card.open) return;
    // a third card closes the two different ones at once, without waiting
    if (state.open.length === 2) closeMismatch();

    setOpen(card, true);
    state.open.push(card);
    sfx.pick();
    if (state.open.length < 2) return;

    state.tries++;
    const [a, b] = state.open;
    if (a.pic === b.pic) {
      state.open = [];
      for (const c of [a, b]) {
        c.matched = true;
        c.el.classList.add('matched');
      }
      state.found.push(a.pic);
      setTimeout(() => sfx.snap(), 250);
      updateProgress();
      if (state.found.length === state.pairs) win();
    } else {
      setTimeout(() => sfx.oops(), 350);
      state.closeTimer = setTimeout(closeMismatch, MISMATCH_MS);
    }
  }

  // Show every card for a moment.
  function peek() {
    if (state.peeking || state.found.length === state.pairs) return;
    closeMismatch();
    state.peeking = true;
    state.peeked = true;
    sfx.pick();
    state.cards.forEach((c) => { if (!c.matched) c.el.classList.add('open'); });
    setTimeout(() => {
      state.cards.forEach((c) => { if (!c.matched) c.el.classList.remove('open'); });
      state.peeking = false;
    }, PEEK_MS);
  }

  function updateProgress() {
    $('progressFill').style.width = (100 * state.found.length) / state.pairs + '%';
    $('progressText').textContent = `⭐ ${state.found.length} / ${state.pairs}`;
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  // The tries count only when the eye button was not used; the fewest are kept.
  function winText() {
    if (state.peeked) return t('foundPeeked')(state.pairs);
    const old = state.best[state.pairs];
    if (!old || state.tries < old) {
      state.best[state.pairs] = state.tries;
      store.set('best', state.best);
    }
    const best = state.tries <= (old || Infinity) ? t('newBest') : t('oldBest')(old);
    return `${t('found')(state.pairs, state.tries)} ${best}`;
  }

  function win() {
    const text = winText(); // the best is kept even if the menu is opened at once
    setTimeout(() => sfx.win(), 600);
    setTimeout(() => {
      if ($('game').classList.contains('hidden')) return;
      $('winGrid').style.gridTemplateColumns = `repeat(${Math.ceil(Math.sqrt(state.pairs))}, 1fr)`;
      $('winGrid').innerHTML = state.found
        .map((p) => `<figure><img src="${p.file}" alt=""><figcaption>${p.name[Astro.lang]}</figcaption></figure>`)
        .join('');
      $('winText').textContent = text;
      $('win').classList.remove('hidden');
      Astro.startConfetti($('confetti'));
    }, 1300);
  }

  // ---------------------------------------------------------------------------
  // Buttons & resizing
  // ---------------------------------------------------------------------------

  new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden')) layout();
  }).observe(area);

  // Clearing the best score for the chosen number of pairs takes two taps,
  // so that it is not cleared by mistake. The second one must come within
  // a few seconds.
  $('clearBtn').addEventListener('click', () => {
    clearTimeout(state.clearTimer);
    if (state.clearArmed) {
      state.clearArmed = false;
      delete state.best[state.pairs];
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
  $('playBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', startGame);
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('peekBtn').addEventListener('click', peek);
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  buildMenu();
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    updateNames();
  });
})();
