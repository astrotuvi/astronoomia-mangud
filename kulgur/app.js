'use strict';

(() => {
  const { $, clamp, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // The steps of a plan, and the way the rover faces: 0 north (up), 1 east,
  // 2 south, 3 west.
  const DIRS = { N: 0, E: 1, S: 2, W: 3 };
  const DX = [0, 1, 0, -1];
  const DY = [-1, 0, 1, 0];

  // An arrow that bends the way the rover turns, drawn because not all phones
  // have a font with the sign for it.
  const turnIcon = (flip) =>
    `<svg viewBox="0 0 24 24" aria-hidden="true"><path${flip ? ' transform="matrix(-1 0 0 1 24 0)"' : ''} ` +
    'd="M18 21V12a4 4 0 0 0-4-4H6M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="3.2" ' +
    'stroke-linecap="round" stroke-linejoin="round" /></svg>';
  const ICONS = {
    forward: '⬆️',
    left: turnIcon(false),
    right: turnIcon(true),
    photo: '📷',
    drill: '🔩',
    repeat: '🔁',
    done: '✔️'
  };

  const BASIC = ['forward', 'left', 'right'];

  // The levels. In a map, . is open ground, # a boulder, r a rock that is not
  // on the map until the rover is next to it, F the target and R the rover's
  // start. face is the way the rover starts, steps the buttons of the level,
  // delay the minutes a signal takes one way, battery the steps for one Sol,
  // limit the longest plan, and tasks what has to be done on the target (none:
  // just get there). goal is how the target looks, and card the postcard on
  // the win screen. repeatHint makes the Korda button pulse until the plan has a
  // block, on the level that teaches it. Keep delay within 5–20: a planet on a round orbit can't be drawn
  // for less than about 4.4 or more than about 21 minutes.
  const LEVELS = [
    {
      id: 'otse', face: 'N', steps: ['forward'], delay: 5, goal: 'flag', card: 'tracks',
      map: [
        '.....',
        '..F..',
        '.....',
        '.....',
        '.....',
        '..R..'
      ],
      name: { et: 'Otse', en: 'Straight On' },
      task: { et: 'Sõida lipuni.', en: 'Drive to the flag.' },
      fact: {
        et: 'Signaal on Maalt Marsile teel 3 kuni 22 minutit. Nii kaugelt ei saa kulgurit roolida, seepärast saab ta käsud korraga.',
        en: 'A signal takes 3 to 22 minutes from the Earth to Mars. A rover can\'t be steered from so far away, so it gets its orders all at once.'
      }
    },
    {
      id: 'poore', face: 'N', steps: BASIC, delay: 8, goal: 'flag', card: 'tracks',
      map: [
        '......',
        '.F....',
        '......',
        '......',
        '....R.',
        '......'
      ],
      name: { et: 'Esimene pööre', en: 'First Turn' },
      task: { et: 'Sõida lipuni. Pööre tehakse paigal.', en: 'Drive to the flag. A turn is made on the spot.' },
      fact: {
        et: 'Kulgurid sõidavad väga aeglaselt. Perseverance läbib tunnis kõige rohkem umbes 150 meetrit.',
        en: 'Rovers drive very slowly. Perseverance covers about 150 metres an hour at most.'
      }
    },
    {
      id: 'kivid', face: 'S', steps: BASIC, delay: 12, goal: 'flag', card: 'rocks',
      map: [
        '.......',
        '..R....',
        '.###...',
        '.....#.',
        '...#...',
        '.#...F.',
        '.......'
      ],
      name: { et: 'Kivid teel', en: 'Rocks in the Way' },
      task: {
        et: 'Sõida kividest mööda lipuni. Kulgur sõidab sinu poole, nii et tema vasak on sinu parem.',
        en: 'Drive past the rocks to the flag. The rover is coming towards you, so its left is your right.'
      },
      fact: {
        et: 'Kulgur vaatab kaameratega ette ja oskab ohtliku kivi ees ise peatuda.',
        en: 'A rover looks ahead with its cameras and can stop by itself in front of a dangerous rock.'
      }
    },
    {
      id: 'pildista', face: 'N', steps: [...BASIC, 'photo'], delay: 15, goal: 'rock', tasks: ['photo'], card: 'rock',
      map: [
        '......',
        '....F.',
        '..#...',
        '..#.#.',
        '......',
        '.R....'
      ],
      name: { et: 'Pildista', en: 'Take a Picture' },
      task: { et: 'Sõida rõngaga kivi juurde ja pildista seda.', en: 'Drive to the ringed rock and take its picture.' },
      fact: {
        et: 'Marss on punane, sest tema pinnases on roostes rauda.',
        en: 'Mars is red because there is rusty iron in its soil.'
      }
    },
    {
      id: 'puuri', face: 'N', steps: [...BASIC, 'photo', 'drill'], delay: 20, goal: 'rock', tasks: ['photo', 'drill'], card: 'hole',
      map: [
        '.......',
        '.#...#.',
        '...F...',
        '.#.#.#.',
        '.......',
        '.....R.'
      ],
      name: { et: 'Puuri', en: 'Drill' },
      task: { et: 'Sõida rõngaga kivi juurde. Kõigepealt pildista, siis puuri.', en: 'Drive to the ringed rock. First take a picture, then drill.' },
      fact: {
        et: 'Perseverance uurib kraatrit, kus oli kunagi järv. Ta puurib kividest proove ja otsib märke sellest, kas seal võis olla elu.',
        en: 'Perseverance is exploring a crater that once held a lake. It drills samples from rocks and looks for signs of whether there could have been life.'
      }
    },
    {
      id: 'aku', face: 'N', steps: BASIC, delay: 10, battery: 8, goal: 'flag', card: 'sun',
      map: [
        '........',
        '.....F..',
        '...#....',
        '...#..#.',
        '.#......',
        '.#...#..',
        '........',
        'R.......'
      ],
      name: { et: 'Akuga sõit', en: 'On a Battery' },
      task: {
        et: 'Lipp on kaugel. Iga samm kulutab akut. Kui aku saab tühjaks, jätkab kulgur järgmisel Solil.',
        en: 'The flag is far away. Every step uses the battery. When it runs out, the rover carries on the next Sol.'
      },
      fact: {
        et: 'Marsi ööpäev on Sol. See on 24 tundi ja 39 minutit, nii et peaaegu sama pikk kui meie ööpäev.',
        en: 'A day on Mars is called a Sol. It is 24 hours and 39 minutes, so almost as long as ours.'
      }
    },
    {
      id: 'teekond', face: 'N', steps: BASIC, delay: 14, battery: 8, goal: 'flag', card: 'sun',
      map: [
        '.F#.....',
        '...#....',
        '.#.#....',
        '.#..#...',
        '.##.#...',
        '.##..#..',
        '.###..#.',
        '.....R..'
      ],
      name: { et: 'Pikk teekond', en: 'A Long Way' },
      task: {
        et: 'Kaks teed viivad lipuni: üks sirgem, teine käänulisem. Ka pööre kulutab akut. Kumb jõuab kiiremini?',
        en: 'Two ways lead to the flag, one straighter and one more winding. Turns use the battery too. Which is quicker?'
      },
      fact: {
        et: 'Opportunity pidi töötama 90 Soli, aga töötas üle 14 aasta, kuni tolmutorm 2018. aastal Päikese varjas ja aku tühjaks jäi.',
        en: 'Opportunity was meant to work for 90 Sols, but it worked for over 14 years, until a dust storm in 2018 hid the Sun and its battery ran out.'
      }
    },
    {
      id: 'korda', face: 'N', steps: [...BASIC, 'repeat'], delay: 18, limit: 5, repeatHint: true, goal: 'flag', card: 'rim',
      map: [
        '.......',
        '....##.',
        '...#.F#',
        '..#..#.',
        '.#..#..',
        '#..#...',
        '#R#....'
      ],
      name: { et: 'Korda', en: 'Repeat' },
      task: {
        et: 'Tee läheb trepina lipuni, aga sõnumisse mahub vähe käske. Kasuta 🔁 Korda: pane trepiaste plokki ja vali, mitu korda seda tehakse.',
        en: 'The way goes up like stairs to the flag, but a message holds few orders. Use 🔁 Repeat: put one stair in a block and pick how many times to do it.'
      },
      fact: {
        et: 'Kulgur saadab pildid enamasti Marsi ümber tiirleva satelliidi kaudu. Nii jõuab Maale palju rohkem andmeid.',
        en: 'A rover mostly sends its pictures through a satellite going round Mars. That gets far more data to the Earth.'
      }
    },
    {
      id: 'peidus', face: 'N', steps: [...BASIC, 'repeat'], delay: 16, goal: 'flag', card: 'rim',
      map: [
        '.......',
        '.F.....',
        '.#rr.#.',
        '...r...',
        '.#...#.',
        '.....r.',
        '...R...'
      ],
      name: { et: 'Peidus kivid', en: 'Hidden Rocks' },
      task: {
        et: 'Sõida lipuni. Kõik kivid ei paista kaardil, need näeb alles kulguri kaamera.',
        en: 'Drive to the flag. Not all rocks show on the map: only the rover\'s camera sees them.'
      },
      fact: {
        et: 'Perseverance\'il on 23 kaamerat. Nendega vaatavad inimesed Maal, kuhu järgmisel Solil sõita.',
        en: 'Perseverance has 23 cameras. With them, people on the Earth see where to drive on the next Sol.'
      }
    },
    {
      id: 'jaa', face: 'E', steps: [...BASIC, 'photo', 'drill', 'repeat'], delay: 20, battery: 10, goal: 'ice', tasks: ['photo', 'drill'], card: 'sunset',
      map: [
        '........',
        '.#...r.F',
        '...#....',
        '.r...#..',
        '.....r..',
        '.#.#....',
        '.....#..',
        'R..r....'
      ],
      name: { et: 'Jää', en: 'Ice' },
      task: {
        et: 'Heledas laigus võib olla jääd. Sõida sinna, pildista ja puuri. Akust ei jätku ühe Soliga ja kõik kivid ei paista kaardil.',
        en: 'There may be ice in the pale patch. Drive there, take a picture and drill. The battery won\'t last one Sol, and not all rocks show on the map.'
      },
      fact: {
        et: 'Marsi pinna all on jääd. Maandur Phoenix kaevas selle 2008. aastal välja.',
        en: 'There is ice under the surface of Mars. The Phoenix lander dug it up in 2008.'
      }
    },
    // The bonus level, open when the others are done. The rest of it comes from
    // randomTrek, anew each time it is started.
    { id: 'retk', random: true, name: { et: 'Juhuslik retk', en: 'Random Trek' } }
  ];

  const TEXT = {
    et: {
      title: 'Marsikulgur',
      intro: 'Sina juhid kulgurit Marsil. Signaal on sinna minuteid teel, nii et roolida ei saa. Kirjuta plaan ja saada see teele!',
      play: 'Mängi',
      wellDone: 'Tubli!',
      next: 'Järgmine',
      newTrek: 'Uus retk',
      bonus: 'Boonustase',
      locked: (n) => `🔒 Avaneb, kui kõik ${n} ülesannet on tehtud`,
      again: 'Uuesti',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      hint: 'Vihje',
      sound: 'Heli',
      earth: 'Maa',
      mars: 'Marss',
      send: 'Saada',
      stop: 'Stopp',
      restart: 'Alusta otsast',
      step: {
        forward: 'Edasi', left: 'Vasakule', right: 'Paremale', photo: 'Pildista',
        drill: 'Puuri', repeat: 'Korda', done: 'Valmis'
      },
      empty: 'Plaan on tühi. Lisa käske nuppudega.',
      holeHere: 'lisa siia käsud',
      delay: (n) => `📡 ${n} min`,
      sol: (n) => `☀️ Sol ${n}`,
      limit: (n, max) => `✉️ ${n} / ${max} käsku`,
      signal: (n) => `Signaal on teel: ${n} minutit`,
      tooLate: (n) => `Käsk jõuab kohale ${n} minuti pärast.`,
      rock: 'Kivi on ees. Kulgur peatus ise.',
      edge: 'Siit kaart lõpeb.',
      nothing: 'Siin pole midagi uurida.',
      photoFirst: 'Kõigepealt pildista, et teaks, kuhu puurida.',
      short: 'Sihtmärgini on veel maad.',
      notDone: 'Kulgur on kohal, aga töö on veel tegemata.',
      night: (n) => `Aku sai tühjaks ja Päike loojus. Algab Sol ${n}.`,
      noPlan: 'Lisa plaani vähemalt üks käsk.',
      tooLong: (max) => `Sõnumisse mahub ainult ${max} käsku.`,
      photoDone: 'Pilt on tehtud! 📷',
      drillDone: 'Puurisin! 🔩',
      testFirst: 'Päris meeskonnad proovivad keerulisi sõite Maal kulguri kaksikuga. Sina proovid test-kulguriga.',
      test: (s) => `Test: ${s}`,
      testOk: 'Test: plaan toimib!',
      orders: (n) => (n === 1 ? '1 käsk' : `${n} käsku`),
      sols: (n) => (n === 1 ? '1 Sol' : `${n} Soli`),
      best: (s) => `🏆 Parim: ${s}`,
      treks: (n) => `🏆 Retki: ${n}`,
      result: (s) => `Kulus ${s}.`,
      clearBest: '🗑️ Kustuta parimad tulemused',
      clearAsk: 'Kas kustutada kõigi ülesannete parimad tulemused?',
      reset: 'Eemalda kõik 🌟',
      resetAsk: 'Kas eemaldada 🌟 kõigilt tehtud ülesannetelt?'
    },
    en: {
      title: 'Mars Rover',
      intro: 'You drive a rover on Mars. A signal takes minutes to get there, so it can\'t be steered live. Write a plan and send it!',
      play: 'Play',
      wellDone: 'Well done!',
      next: 'Next',
      newTrek: 'New trek',
      bonus: 'Bonus level',
      locked: (n) => `🔒 Opens when all ${n} levels are done`,
      again: 'Again',
      menu: 'Menu',
      allGames: 'All games',
      hint: 'Hint',
      sound: 'Sound',
      earth: 'Earth',
      mars: 'Mars',
      send: 'Send',
      stop: 'Stop',
      restart: 'Start over',
      step: {
        forward: 'Forward', left: 'Left', right: 'Right', photo: 'Picture',
        drill: 'Drill', repeat: 'Repeat', done: 'Done'
      },
      empty: 'The plan is empty. Add orders with the buttons.',
      holeHere: 'add orders here',
      delay: (n) => `📡 ${n} min`,
      sol: (n) => `☀️ Sol ${n}`,
      limit: (n, max) => `✉️ ${n} / ${max} orders`,
      signal: (n) => `The signal is on its way: ${n} minutes`,
      tooLate: (n) => `The order will arrive in ${n} minutes.`,
      rock: 'There is a rock ahead. The rover stopped by itself.',
      edge: 'The map ends here.',
      nothing: 'There is nothing to study here.',
      photoFirst: 'Take a picture first, to know where to drill.',
      short: 'The target is still some way off.',
      notDone: 'The rover is there, but the work is not done yet.',
      night: (n) => `The battery ran out and the Sun set. Sol ${n} begins.`,
      noPlan: 'Add at least one order to the plan.',
      tooLong: (max) => `A message holds only ${max} orders.`,
      photoDone: 'Picture taken! 📷',
      drillDone: 'Drilled! 🔩',
      testFirst: 'Real teams try hard drives on the rover\'s twin on the Earth. You try them on a test rover.',
      test: (s) => `Test: ${s}`,
      testOk: 'Test: the plan works!',
      orders: (n) => (n === 1 ? '1 order' : `${n} orders`),
      sols: (n) => (n === 1 ? '1 Sol' : `${n} Sols`),
      best: (s) => `🏆 Best: ${s}`,
      treks: (n) => `🏆 Treks: ${n}`,
      result: (s) => `It took ${s}.`,
      clearBest: '🗑️ Clear best scores',
      clearAsk: 'Clear the best scores of all levels?',
      reset: 'Clear all 🌟',
      resetAsk: 'Remove the 🌟 from all completed levels?'
    }
  };
  const t = (key) => TEXT[Astro.lang][key];

  // A rover from above, with its front up: six wheels, the solar panel, the body
  // with the mast, and a yellow arrow at the front.
  const ROVER = `<svg viewBox="0 0 100 100" aria-hidden="true" data-ink>
    <g fill="#2e2a33">
      <rect x="10" y="18" width="13" height="20" rx="5" /><rect x="77" y="18" width="13" height="20" rx="5" />
      <rect x="10" y="44" width="13" height="20" rx="5" /><rect x="77" y="44" width="13" height="20" rx="5" />
      <rect x="10" y="70" width="13" height="20" rx="5" /><rect x="77" y="70" width="13" height="20" rx="5" />
    </g>
    <rect x="20" y="40" width="60" height="46" rx="5" fill="#27509e" />
    <path d="M40 40V86M60 40V86M20 55H80M20 71H80" fill="none" stroke="#6f9fe0" stroke-width="2" />
    <rect x="27" y="20" width="46" height="24" rx="6" fill="#f0ebe2" />
    <circle cx="50" cy="30" r="7" fill="#3a3a48" />
    <path d="M50 1L64 16H36Z" fill="#ffd34d" />
  </svg>`;

  const TARGETS = {
    flag: `<svg viewBox="0 0 100 100" data-ink>
      <circle class="ring" cx="50" cy="50" r="42" fill="none" stroke="#ffd34d" stroke-width="5" />
      <rect x="39" y="18" width="6" height="64" rx="3" fill="#f4f6ff" />
      <path d="M45 20L74 32L45 44Z" fill="#ffd34d" />
    </svg>`,
    rock: `<svg viewBox="0 0 100 100" data-ink>
      <circle class="ring" cx="50" cy="50" r="42" fill="none" stroke="#ffd34d" stroke-width="5" />
      <path d="M26 66Q22 44 42 34Q62 26 74 46Q82 64 62 70Q40 76 26 66Z" fill="#c9bba8" />
      <path d="M36 50Q44 38 58 42" fill="none" stroke="#efe6d8" stroke-width="5" stroke-linecap="round" />
    </svg>`,
    ice: `<svg viewBox="0 0 100 100" data-ink>
      <circle class="ring" cx="50" cy="50" r="42" fill="none" stroke="#ffd34d" stroke-width="5" />
    </svg>`
  };

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('kulgur.');
  const done = store.get('done', []);
  const best = store.get('best', {});
  const BONUS = LEVELS.findIndex((l) => l.random);
  const bonusOpen = () => LEVELS.every((l) => l.random || done.includes(l.id));
  const state = {
    level: Math.max(0, LEVELS.findIndex((l) => !done.includes(l.id))),
    lv: null,
    rows: 0,
    cols: 0,
    cell: 40,
    start: null,      // where the rover starts: x, y, f
    goal: null,       // the target square: x, y
    rocks: new Set(), // all rocks, as 'x,y'
    shown: new Set(), // the rocks on the map
    w: null,          // the rover: x, y, f (way it faces), a (angle), k (tasks done)
    g: null,          // the test rover, while it runs
    track: [],
    gtrack: [],
    plan: [],
    open: null,       // the repeat block that steps now go into
    busy: false,
    run: 0,           // changes when a level starts or is left, to end what was running
    sol: 1,
    charge: 0,
    sent: 0,          // orders sent in this try
    sends: 0,
    stops: 0,
    opened: false,    // this win opened the bonus level
    tested: store.get('tested', false)
  };

  const key = (x, y) => `${x},${y}`;

  // ---------------------------------------------------------------------------
  // The plan: a list of steps and repeat blocks
  // ---------------------------------------------------------------------------

  // How many steps the rover really does for a node of the plan, and how many
  // orders a plan is. A block is an order itself, and so is each order in it,
  // so that a whole route in one block does not fit in a short message.
  const sizeOf = (n) => (n.type === 'forward' ? n.n : n.type === 'repeat' ? n.times * n.steps.reduce((s, m) => s + sizeOf(m), 0) : 1);
  const countOrders = (nodes) => nodes.reduce((s, n) => s + 1 + (n.type === 'repeat' ? n.steps.length : 0), 0);
  const copy = (n) => (n.type === 'repeat'
    ? { type: 'repeat', times: n.times, steps: n.steps.map(copy) }
    : n.type === 'forward' ? { type: 'forward', n: n.n } : { type: n.type });

  // The plan as single steps for the rover, each with the node it came from.
  function atoms(nodes) {
    const out = [];
    for (const n of nodes) {
      if (n.type === 'repeat') for (let i = 0; i < n.times; i++) out.push(...atoms(n.steps));
      else if (n.type === 'forward') for (let i = 0; i < n.n; i++) out.push({ type: 'forward', node: n });
      else out.push({ type: n.type, node: n });
    }
    return out;
  }

  // What is left of a plan when the first `left` of its steps have been done.
  // A block stopped half way is opened up: the rest of this round as steps,
  // then the block for the rounds still to come.
  function rest(nodes, left) {
    const out = [];
    for (const n of nodes) {
      const size = sizeOf(n);
      if (left >= size && size > 0) { left -= size; continue; }
      if (left === 0) { out.push(copy(n)); continue; }
      if (n.type === 'forward') out.push({ type: 'forward', n: n.n - left });
      else if (n.type === 'repeat') {
        const round = size / n.times;
        const full = Math.floor(left / round);
        const part = left - full * round;
        let more = n.times - full;
        if (part > 0) { out.push(...rest(n.steps, part)); more--; }
        if (more === 1) out.push(...n.steps.map(copy));
        else if (more > 1) out.push({ type: 'repeat', times: more, steps: n.steps.map(copy) });
      }
      left = 0;
    }
    return out;
  }

  function addStep(type) {
    if (state.busy) return;
    sfx.pick();
    touched();
    if (type === 'repeat') {
      if (state.open) closeBlock();
      else {
        state.open = { type: 'repeat', times: 2, steps: [] };
        state.plan.push(state.open);
      }
    } else {
      const list = state.open ? state.open.steps : state.plan;
      const last = list[list.length - 1];
      if (type === 'forward' && last && last.type === 'forward') last.n++;
      else list.push(type === 'forward' ? { type, n: 1 } : { type });
    }
    renderSteps();
    renderPlan();
  }

  function closeBlock() {
    if (state.open && !state.open.steps.length) state.plan = state.plan.filter((n) => n !== state.open);
    state.open = null;
  }

  function dropStep(list, n) {
    if (state.busy) return;
    sfx.pick();
    touched();
    if (n.type === 'forward' && n.n > 1) n.n--;
    else list.splice(list.indexOf(n), 1);
    if (n === state.open) state.open = null;
    renderSteps();
    renderPlan();
  }

  // ---------------------------------------------------------------------------
  // The world: what a step does
  // ---------------------------------------------------------------------------

  const atGoal = (w) => w.x === state.goal.x && w.y === state.goal.y;
  const tasksOf = () => state.lv.tasks || [];
  const reached = (w) => atGoal(w) && w.k >= tasksOf().length;

  // Why a step can't be done, or null if it can.
  function blockedBy(w, type, rocks) {
    if (type === 'forward') {
      const x = w.x + DX[w.f];
      const y = w.y + DY[w.f];
      if (x < 0 || y < 0 || x >= state.cols || y >= state.rows) return 'edge';
      return rocks.has(key(x, y)) ? 'rock' : null;
    }
    if (type === 'photo' || type === 'drill') {
      if (!atGoal(w) || w.k >= tasksOf().length) return 'nothing';
      return tasksOf()[w.k] === type ? null : 'photoFirst';
    }
    return null;
  }

  function apply(w, type) {
    if (type === 'forward') { w.x += DX[w.f]; w.y += DY[w.f]; }
    else if (type === 'left') { w.f = (w.f + 3) % 4; w.a -= 90; }
    else if (type === 'right') { w.f = (w.f + 1) % 4; w.a += 90; }
    else if (type === 'photo' || type === 'drill') w.k++;
  }

  // ---------------------------------------------------------------------------
  // The random level
  // ---------------------------------------------------------------------------

  const JOBS = {
    flag: { goal: 'flag', tasks: [], et: 'Sõida lipuni.', en: 'Drive to the flag.' },
    photo: {
      goal: 'rock', tasks: ['photo'], card: 'rock',
      et: 'Sõida rõngaga kivi juurde ja pildista seda.',
      en: 'Drive to the ringed rock and take its picture.'
    },
    drill: {
      goal: 'rock', tasks: ['photo', 'drill'], card: 'hole',
      et: 'Sõida rõngaga kivi juurde. Kõigepealt pildista, siis puuri.',
      en: 'Drive to the ringed rock. First take a picture, then drill.'
    },
    ice: {
      goal: 'ice', tasks: ['photo', 'drill'], card: 'sunset',
      et: 'Heledas laigus võib olla jääd. Sõida sinna, pildista ja puuri.',
      en: 'There may be ice in the pale patch. Drive there, take a picture and drill.'
    }
  };
  const HIDDEN_TEXT = { et: 'Kõik kivid ei paista kaardil.', en: 'Not all rocks show on the map.' };
  const BATTERY_TEXT = {
    et: 'Iga samm kulutab akut. Kui aku saab tühjaks, jätkab kulgur järgmisel Solil.',
    en: 'Every step uses the battery. When it runs out, the rover carries on the next Sol.'
  };

  // A landscape with the rover at one side and the target at the other: a field
  // of boulders, a ridge with one gap, or the target in a crater with one gap.
  function randomMap(rnd) {
    const int = (n) => Math.floor(rnd() * n);
    const cols = 6 + int(3);
    const rows = 6 + int(3);
    let map = Array.from({ length: rows }, () => Array(cols).fill('.'));
    const sx = int(cols);
    const sy = rows - 1 - int(2);
    const gx = int(cols);
    const gy = int(2);
    const kind = int(3);
    map.forEach((row) => row.forEach((_, x) => { if (rnd() < (kind === 0 ? 0.24 : 0.09)) row[x] = '#'; }));
    if (kind === 1) {
      const y = gy + 1 + int(sy - gy - 1);
      map[y].fill('#');
      map[y][int(cols)] = '.';
    } else if (kind === 2) {
      const ring = [];
      map.forEach((row, y) => row.forEach((_, x) => {
        if (Math.round(Math.hypot(x - gx, y - gy)) === 2) ring.push([x, y]);
      }));
      ring.forEach(([x, y]) => { map[y][x] = '#'; });
      const [x, y] = ring[int(ring.length)];
      map[y][x] = '.';
    }
    map[sy][sx] = 'R';
    map[gy][gx] = 'F';
    if (rnd() < 0.5) map.reverse();
    if (rnd() < 0.5) map.forEach((row) => row.reverse());
    if (rnd() < 0.5) map = map[0].map((_, x) => map.map((row) => row[x]));
    return map.map((row) => row.join(''));
  }

  // How many steps the shortest way to the target takes, or 0 if there is none.
  function stepsNeeded(map, f) {
    const y0 = map.findIndex((row) => row.includes('R'));
    const queue = [{ x: map[y0].indexOf('R'), y: y0, f, n: 0 }];
    const seen = new Set();
    while (queue.length) {
      const c = queue.shift();
      if (map[c.y][c.x] === 'F') return c.n;
      const x = c.x + DX[c.f];
      const y = c.y + DY[c.f];
      const open = map[y] && map[y][x] && !'#r'.includes(map[y][x]);
      for (const n of [{ ...c, f: (c.f + 3) % 4 }, { ...c, f: (c.f + 1) % 4 }, open ? { ...c, x, y } : null]) {
        if (!n || seen.has(`${n.x},${n.y},${n.f}`)) continue;
        seen.add(`${n.x},${n.y},${n.f}`);
        queue.push({ ...n, n: c.n + 1 });
      }
    }
    return 0;
  }

  // Makes the level anew. Only a map with a way through is kept, counting the
  // hidden rocks, and the way has to be long enough to need some planning.
  function randomTrek(lv, rnd) {
    const pick = (list) => list[Math.floor(rnd() * list.length)];
    const f = pick([0, 1, 2, 3]);
    const hidden = rnd() < 0.5;
    let map;
    let n;
    do {
      map = randomMap(rnd);
      if (hidden) map = map.map((row) => row.replace(/#/g, (c) => (rnd() < 0.3 ? 'r' : c)));
      n = stepsNeeded(map, f);
    } while (n < 8 || n > 24);
    const job = JOBS[pick(['flag', 'flag', 'photo', 'drill', 'ice'])];
    const battery = rnd() < 0.4 ? pick([8, 9, 10]) : undefined;
    const text = (lang) => [job[lang], hidden && HIDDEN_TEXT[lang], battery && BATTERY_TEXT[lang]].filter(Boolean).join(' ');
    Object.assign(lv, {
      map,
      face: 'NESW'[f],
      steps: [...BASIC, ...job.tasks, 'repeat'],
      delay: 5 + Math.floor(rnd() * 16),
      battery,
      goal: job.goal,
      tasks: job.tasks,
      card: job.card || (battery ? 'sun' : pick(['tracks', 'rocks', 'rim'])),
      ground: 1 + Math.floor(rnd() * 999),
      task: { et: text('et'), en: text('en') },
      fact: pick(LEVELS.filter((l) => !l.random)).fact
    });
  }
  // A fixed one to begin with, for the picture on its card.
  randomTrek(LEVELS[LEVELS.length - 1], seeded(4242));

  // ---------------------------------------------------------------------------
  // Drawing the map
  // ---------------------------------------------------------------------------

  function seeded(seed) {
    let s = seed;
    return () => (s = (s * 16807) % 2147483647) / 2147483647;
  }

  // Smooth noise, like the ground in shared/planets.js, but flat
  function noiseAt(x, y) {
    const hash = (i, j) => {
      const v = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
      return v - Math.floor(v);
    };
    const i = Math.floor(x);
    const j = Math.floor(y);
    const u = x - i;
    const v = y - j;
    const su = u * u * (3 - 2 * u);
    const sv = v * v * (3 - 2 * v);
    const a = hash(i, j) + (hash(i + 1, j) - hash(i, j)) * su;
    const b = hash(i, j + 1) + (hash(i + 1, j + 1) - hash(i, j + 1)) * su;
    return a + (b - a) * sv;
  }
  const fbm = (x, y) => noiseAt(x, y) * 0.55 + noiseAt(x * 2.1 + 7, y * 2.1 + 3) * 0.28 + noiseAt(x * 4.3 + 1, y * 4.3 + 9) * 0.17;

  // An uneven rock
  function blob(g, x, y, rx, ry, rnd, fill) {
    const n = 9;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = 0.82 + rnd() * 0.3;
      pts.push([x + Math.cos(a) * rx * r, y + Math.sin(a) * ry * r]);
    }
    g.fillStyle = fill;
    g.beginPath();
    for (let i = 0; i < n; i++) {
      const p = pts[i];
      const q = pts[(i + 1) % n];
      const mx = (p[0] + q[0]) / 2;
      const my = (p[1] + q[1]) / 2;
      if (i === 0) g.moveTo(mx, my);
      else g.quadraticCurveTo(p[0], p[1], mx, my);
    }
    const p = pts[0];
    const q = pts[1];
    g.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    g.fill();
  }

  // The ground of a level, with sand and small craters for looks: cols × rows
  // squares of S pixels, with the ice at the square goal on the level with ice.
  let terrain = null;
  function makeTerrain(level, cols, rows, S, goal) {
    const zoom = 56 / S;
    const w = cols * S;
    const h = rows * S;
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const g = cv.getContext('2d');
    const img = g.createImageData(w, h);
    const look = LEVELS[level].ground || level;
    const off = look * 13.7;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const big = fbm((x * zoom) / 90 + off, (y * zoom) / 90);
        const fine = fbm((x * zoom) / 11 + off, (y * zoom) / 11 + 5);
        const k = clamp((big - 0.32) * 2.6, 0, 1);
        const tone = 0.86 + 0.26 * fine;
        const o = (y * w + x) * 4;
        img.data[o] = (150 + 52 * k) * tone;
        img.data[o + 1] = (84 + 38 * k) * tone;
        img.data[o + 2] = (54 + 22 * k) * tone;
        img.data[o + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    const rnd = seeded(look * 991 + 17);
    for (let i = 0; i < cols * rows * 0.22; i++) {
      const x = rnd() * w;
      const y = rnd() * h;
      const r = (4 + rnd() * 9) / zoom;
      g.fillStyle = 'rgba(70, 36, 24, 0.3)';
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = 'rgba(240, 190, 150, 0.22)';
      g.lineWidth = 1.6 / zoom;
      g.beginPath();
      g.arc(x, y, r, 0.2 * Math.PI, 1.2 * Math.PI);
      g.stroke();
    }
    if (LEVELS[level].goal === 'ice') {
      const cx = (goal.x + 0.5) * S;
      const cy = (goal.y + 0.5) * S;
      blob(g, cx, cy, S * 0.4, S * 0.36, rnd, '#e6edf2');
      blob(g, cx + S * 0.05, cy + S * 0.04, S * 0.24, S * 0.2, rnd, '#c8dcea');
    }
    return cv;
  }

  function drawRock(g, x, y, c) {
    const rnd = seeded((x + 1) * 7919 + (y + 1) * 104729);
    const cx = (x + 0.5) * c;
    const cy = (y + 0.5) * c;
    blob(g, cx + c * 0.05, cy + c * 0.08, c * 0.4, c * 0.36, rnd, 'rgba(30, 14, 10, 0.5)');
    blob(g, cx, cy, c * 0.39, c * 0.35, rnd, '#4a3530');
    blob(g, cx - c * 0.07, cy - c * 0.08, c * 0.23, c * 0.18, rnd, '#7a5e52');
  }

  function drawTrack(g, pts, cur, colour, dash) {
    const c = state.cell;
    g.save();
    g.strokeStyle = colour;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.lineWidth = Math.max(2, c * 0.1);
    g.setLineDash(dash ? [c * 0.14, c * 0.2] : []);
    g.beginPath();
    pts.concat([[cur.x, cur.y]]).forEach((p, i) => {
      const x = (p[0] + 0.5) * c;
      const y = (p[1] + 0.5) * c;
      if (i) g.lineTo(x, y);
      else g.moveTo(x, y);
    });
    g.stroke();
    g.restore();
  }

  function draw() {
    const cv = $('ground');
    const dpr = window.devicePixelRatio || 1;
    const c = state.cell;
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.imageSmoothingQuality = 'high';
    g.drawImage(terrain, 0, 0, state.cols * c, state.rows * c);
    g.strokeStyle = 'rgba(255, 240, 225, 0.16)';
    g.lineWidth = 1;
    g.beginPath();
    for (let i = 1; i < state.cols; i++) { g.moveTo(i * c, 0); g.lineTo(i * c, state.rows * c); }
    for (let j = 1; j < state.rows; j++) { g.moveTo(0, j * c); g.lineTo(state.cols * c, j * c); }
    g.stroke();
    drawTrack(g, state.track, state.w, 'rgba(70, 36, 24, 0.55)', false);
    if (state.g) drawTrack(g, state.gtrack, state.g, 'rgba(95, 212, 255, 0.85)', true);
    for (const k of state.shown) {
      const [x, y] = k.split(',').map(Number);
      drawRock(g, x, y, c);
    }
    if (state.w.k >= 1 && tasksOf()[state.w.k - 1] === 'drill') {
      g.fillStyle = '#1c100c';
      g.beginPath();
      g.arc((state.goal.x + 0.5) * c, (state.goal.y + 0.5) * c, c * 0.09, 0, Math.PI * 2);
      g.fill();
    }
  }

  function place(el, w) {
    const c = state.cell;
    el.style.transform = `translate(${w.x * c}px, ${w.y * c}px) rotate(${w.a}deg)`;
  }

  function layout() {
    if (!state.lv) return;
    const box = $('mapBox').getBoundingClientRect();
    if (!box.width || !box.height) return;
    const gap = 6;
    const c = Math.max(10, Math.floor(Math.min((box.width - gap * 2) / state.cols, (box.height - gap * 2) / state.rows)));
    state.cell = c;
    const w = state.cols * c;
    const h = state.rows * c;
    const map = $('map');
    map.style.width = `${w}px`;
    map.style.height = `${h}px`;
    map.style.left = `${(box.width - w) / 2}px`;
    map.style.top = `${(box.height - h) / 2}px`;
    const dpr = window.devicePixelRatio || 1;
    const cv = $('ground');
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    for (const id of ['rover', 'ghost', 'target']) {
      $(id).style.width = `${c}px`;
      $(id).style.height = `${c}px`;
    }
    $('target').style.transform = `translate(${state.goal.x * c}px, ${state.goal.y * c}px)`;
    place($('rover'), state.w);
    if (state.g) place($('ghost'), state.g);
    draw();
  }

  // ---------------------------------------------------------------------------
  // The plan and the buttons on the screen
  // ---------------------------------------------------------------------------

  function stepLabel(type) {
    return `<span class="ic">${ICONS[type]}</span><span>${t('step')[type]}</span>`;
  }

  function renderSteps() {
    const box = $('steps');
    box.innerHTML = '';
    for (const type of state.lv.steps) {
      const closing = type === 'repeat' && state.open;
      const b = document.createElement('button');
      b.className = 'step-btn' + (closing ? ' open' : '');
      b.dataset.step = closing ? 'done' : type;
      b.innerHTML = stepLabel(closing ? 'done' : type);
      b.setAttribute('aria-label', t('step')[closing ? 'done' : type]);
      b.addEventListener('click', () => addStep(type));
      box.appendChild(b);
    }
  }

  function makeChip(list, n) {
    const b = document.createElement('button');
    b.className = 'chip';
    const many = n.type === 'forward' && n.n > 1;
    b.innerHTML = ICONS[n.type] + (many ? `<span>${n.n}×</span>` : '');
    b.setAttribute('aria-label', t('step')[n.type] + (many ? ` ${n.n}×` : ''));
    b.addEventListener('click', () => dropStep(list, n));
    n.el = b;
    return b;
  }

  function renderPlan() {
    const box = $('chips');
    box.innerHTML = '';
    if (!state.plan.length) {
      const p = document.createElement('div');
      p.className = 'empty';
      p.textContent = t('empty');
      box.appendChild(p);
    }
    for (const n of state.plan) {
      if (n.type !== 'repeat') {
        box.appendChild(makeChip(state.plan, n));
        continue;
      }
      const block = document.createElement('div');
      block.className = 'block' + (n === state.open ? ' open' : '');
      const times = document.createElement('button');
      times.className = 'chip times';
      times.innerHTML = `${ICONS.repeat}<span>${n.times}×</span>`;
      times.addEventListener('click', () => {
        if (state.busy) return;
        sfx.pick();
        touched();
        n.times = n.times >= 4 ? 2 : n.times + 1;
        renderPlan();
      });
      block.appendChild(times);
      n.el = times;
      for (const m of n.steps) block.appendChild(makeChip(n.steps, m));
      if (n === state.open && !n.steps.length) {
        const hole = document.createElement('span');
        hole.className = 'hole';
        hole.textContent = t('holeHere');
        block.appendChild(hole);
      }
      const drop = document.createElement('button');
      drop.className = 'chip drop';
      drop.textContent = '✕';
      drop.setAttribute('aria-label', t('step').repeat);
      drop.addEventListener('click', () => dropStep(state.plan, n));
      block.appendChild(drop);
      box.appendChild(block);
    }
    box.scrollTop = box.scrollHeight;
    updateStatus();
  }

  function updateStatus() {
    const lv = state.lv;
    $('progressFill').style.width = `${(Math.min(state.level + 1, BONUS) / BONUS) * 100}%`;
    $('progressText').textContent = lv.random ? t('bonus') : `${state.level + 1} / ${BONUS}`;
    $('levelName').textContent = lv.name[Astro.lang];
    $('taskText').textContent = lv.task[Astro.lang];
    $('delayText').textContent = t('delay')(lv.delay);
    $('solText').textContent = lv.battery ? t('sol')(state.sol) : '';
    $('battery').classList.toggle('hidden', !lv.battery);
    if (lv.battery) $('batteryFill').style.width = `${(state.charge / lv.battery) * 100}%`;
    const n = countOrders(state.plan);
    const lim = $('limitText');
    lim.textContent = lv.limit ? t('limit')(n, lv.limit) : '';
    lim.classList.toggle('limit-over', !!lv.limit && n > lv.limit);
    $('sendBtn').classList.toggle('dim', !state.plan.length);
  }

  let toastTimer = 0;
  function toast(text, ms) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms || 3400);
  }

  // On the level that teaches the repeat, points at the Korda button: when asked,
  // or by itself after a while. No other level shows what to do next.
  let idleTimer = 0;
  function clearPulse() {
    document.querySelectorAll('.pulse').forEach((el) => el.classList.remove('pulse'));
    document.querySelectorAll('.chip.bad').forEach((el) => el.classList.remove('bad'));
  }
  function pulseRepeat() {
    if (!state.lv.repeatHint || state.plan.some((n) => n.type === 'repeat')) return;
    $('steps').querySelector('[data-step="repeat"]').classList.add('pulse');
  }
  function touched() {
    clearPulse();
    clearTimeout(idleTimer);
    if (!state.lv.repeatHint) return;
    idleTimer = setTimeout(() => {
      if (!state.busy && !$('game').classList.contains('hidden') && $('win').classList.contains('hidden')) pulseRepeat();
    }, 9000);
  }

  // ---------------------------------------------------------------------------
  // Moving things
  // ---------------------------------------------------------------------------

  function tween(ms, f, then) {
    const id = state.run;
    const t0 = performance.now();
    requestAnimationFrame(function tick(now) {
      if (id !== state.run) return;
      const k = clamp((now - t0) / ms, 0, 1);
      f(k * k * (3 - 2 * k));
      if (k < 1) requestAnimationFrame(tick);
      else then();
    });
  }
  function wait(ms, then) {
    const id = state.run;
    setTimeout(() => { if (id === state.run) then(); }, ms);
  }

  // Moves a rover through one step that can be done. speed 1 is the real rover.
  function animateStep(el, w, type, track, speed, then) {
    if (type === 'forward') {
      const x0 = w.x;
      const y0 = w.y;
      apply(w, type);
      const x1 = w.x;
      const y1 = w.y;
      if (track) track.push([x0, y0]);
      if (speed === 1) sfx.roll(0.44);
      tween(440 * speed, (k) => {
        w.x = x0 + (x1 - x0) * k;
        w.y = y0 + (y1 - y0) * k;
        place(el, w);
        draw();
      }, () => {
        w.x = x1;
        w.y = y1;
        then();
      });
    } else if (type === 'left' || type === 'right') {
      const a0 = w.a;
      apply(w, type);
      const a1 = w.a;
      if (speed === 1) sfx.roll(0.32);
      tween(320 * speed, (k) => {
        w.a = a0 + (a1 - a0) * k;
        place(el, w);
      }, then);
    } else then();
  }

  // ---------------------------------------------------------------------------
  // Sending a plan
  // ---------------------------------------------------------------------------

  function setBusy(on) {
    state.busy = on;
    $('sendBtn').classList.toggle('hidden', on);
    $('stopBtn').classList.toggle('hidden', !on);
    document.querySelector('.plan').classList.toggle('running', on);
  }

  function send() {
    if (state.busy) return;
    closeBlock();
    touched();
    renderSteps();
    renderPlan();
    if (!state.plan.length) {
      sfx.oops();
      toast(t('noPlan'));
      return;
    }
    const n = countOrders(state.plan);
    if (state.lv.limit && n > state.lv.limit) {
      sfx.oops();
      toast(t('tooLong')(state.lv.limit));
      pulseRepeat();
      return;
    }
    clearTimeout(idleTimer);
    state.sent += n;
    state.sends++;
    setBusy(true);
    showSignal(() => drive());
  }

  // The dot flies from the Earth to Mars. How far apart they are on round
  // orbits comes from the delay of the level, at 499 seconds of light for each
  // astronomical unit.
  let skipSignal = null;
  function showSignal(then) {
    const lv = state.lv;
    const R = 56;                     // the Earth's orbit in the picture
    const m = 1.524;
    const d = (lv.delay * 60) / 499;
    const cos = clamp((1 + m * m - d * d) / (2 * m), -1, 1);
    const a0 = (205 * Math.PI) / 180;
    const a1 = a0 + Math.acos(cos);
    const ex = Math.cos(a0) * R;
    const ey = Math.sin(a0) * R;
    const mx = Math.cos(a1) * R * m;
    const my = Math.sin(a1) * R * m;
    $('signalPic').innerHTML =
      `<circle r="${R}" fill="none" stroke="#5fd4ff" stroke-width="1" opacity="0.5" />` +
      `<circle r="${R * m}" fill="none" stroke="#e8a070" stroke-width="1" opacity="0.5" />` +
      '<circle r="9" fill="#ffd34d" />' +
      `<line x1="${ex}" y1="${ey}" x2="${mx}" y2="${my}" stroke="#f4f6ff" stroke-width="1" stroke-dasharray="3 4" opacity="0.5" />` +
      `<circle cx="${ex}" cy="${ey}" r="7" fill="#3f8fe0" />` +
      `<circle cx="${mx}" cy="${my}" r="6" fill="#d9774a" />` +
      `<circle id="signalDot" cx="${ex}" cy="${ey}" r="3.5" fill="#fff" />` +
      `<text x="${ex}" y="${ey + 18}" font-size="12" font-weight="800" text-anchor="middle" fill="#9fd4ff">${t('earth')}</text>` +
      `<text x="${mx}" y="${my - 11}" font-size="12" font-weight="800" text-anchor="middle" fill="#f0a880">${t('mars')}</text>`;
    $('signalText').textContent = t('signal')(lv.delay);
    $('signal').classList.remove('hidden');
    sfx.signal();
    const id = state.run;
    let ended = false;
    const end = () => {
      if (ended || id !== state.run) return;
      ended = true;
      skipSignal = null;
      $('signal').classList.add('hidden');
      then();
    };
    if (state.sends > 1) skipSignal = end;
    const dot = $('signalDot');
    tween(3000, (k) => {
      if (ended) return;
      dot.setAttribute('cx', ex + (mx - ex) * k);
      dot.setAttribute('cy', ey + (my - ey) * k);
    }, end);
  }

  function reveal() {
    for (let f = 0; f < 4; f++) {
      const k = key(state.w.x + DX[f], state.w.y + DY[f]);
      if (state.rocks.has(k)) state.shown.add(k);
    }
  }

  // The rover carries out the plan alone, step by step.
  function drive() {
    const list = atoms(state.plan);
    const w = state.w;
    let i = 0;
    let lit = null;

    const light = (el) => {
      if (lit) lit.classList.remove('now');
      lit = el;
      if (lit) {
        lit.classList.add('now');
        lit.scrollIntoView({ block: 'nearest' });
      }
    };
    const finish = () => {
      light(null);
      state.plan = rest(state.plan, i);
      renderPlan();
      setBusy(false);
      touched();
    };
    const stopped = (why) => {
      sfx.oops();
      const rover = $('rover');
      rover.classList.add('shake');
      setTimeout(() => rover.classList.remove('shake'), 400);
      toast(t(why));
      finish();
      state.stops++;
      if (state.plan[0] && state.plan[0].el) state.plan[0].el.classList.add('bad');
      if (state.stops >= 2) pulseRepeat();
    };

    const next = () => {
      if (reached(w)) {
        light(null);
        draw();
        won();
        return;
      }
      if (i >= list.length) {
        light(null);
        toast(t(atGoal(w) ? 'notDone' : 'short'));
        state.stops++;
        finish();
        if (state.stops >= 2) pulseRepeat();
        return;
      }
      const a = list[i];
      light(a.node.el);
      const why = blockedBy(w, a.type, state.rocks);
      if (why) {
        if (why === 'rock') {
          state.shown.add(key(w.x + DX[w.f], w.y + DY[w.f]));
          draw();
        }
        stopped(why);
        return;
      }
      const after = () => {
        i++;
        if (a.type === 'forward') reveal();
        sfx.pick();
        draw();
        if (state.lv.battery) {
          state.charge--;
          updateStatus();
          if (state.charge <= 0 && !reached(w)) { night(finish); return; }
        }
        wait(90, next);
      };
      if (a.type === 'photo') {
        apply(w, a.type);
        const f = $('flash');
        f.classList.remove('on');
        void f.offsetWidth;
        f.classList.add('on');
        sfx.clink();
        toast(t('photoDone'), 1500);
        wait(620, after);
      } else if (a.type === 'drill') {
        apply(w, a.type);
        const r = $('rover');
        r.classList.add('drilling');
        sfx.rumble(0.9);
        toast(t('drillDone'), 1500);
        wait(950, () => {
          r.classList.remove('drilling');
          after();
        });
      } else animateStep($('rover'), w, a.type, state.track, 1, after);
    };
    next();
  }

  // The battery is empty: the Sun sets, and the rover goes on the next Sol.
  function night(then) {
    state.sol++;
    $('night').classList.add('on');
    sfx.land();
    toast(t('night')(state.sol), 3000);
    wait(1500, () => {
      state.charge = state.lv.battery;
      $('night').classList.remove('on');
      updateStatus();
      wait(450, then);
    });
  }

  // 💡 runs the plan on the test rover, which knows only what is on the map.
  function test() {
    if (state.busy) return;
    touched();
    closeBlock();
    renderSteps();
    renderPlan();
    const first = !state.tested;
    if (first) {
      state.tested = true;
      store.set('tested', true);
      toast(t('testFirst'), 5200);
    }
    if (!state.plan.length) {
      toast(t('noPlan'));
      pulseRepeat();
      return;
    }
    const g = { ...state.w };
    state.g = g;
    state.gtrack = [];
    setBusy(true);
    const el = $('ghost');
    el.classList.remove('hidden');
    place(el, g);
    draw();
    const list = atoms(state.plan);
    let i = 0;
    const end = (text) => {
      if (text) toast(text);
      wait(900, () => {
        state.g = null;
        el.classList.add('hidden');
        draw();
        setBusy(false);
        touched();
      });
    };
    const next = () => {
      if (reached(g)) { sfx.note(4); end(t('testOk')); return; }
      if (i >= list.length) { end(t('test')(atGoal(g) ? t('notDone') : t('short'))); return; }
      const a = list[i++];
      const why = blockedBy(g, a.type, state.shown);
      if (why) { end(t('test')(t(why))); return; }
      if (a.type === 'photo' || a.type === 'drill') {
        apply(g, a.type);
        wait(160, next);
      } else animateStep(el, g, a.type, state.gtrack, 0.45, next);
    };
    wait(first ? 3000 : 0, next);
  }

  // ---------------------------------------------------------------------------
  // Levels
  // ---------------------------------------------------------------------------

  // keep: the random level stays as it was, to try it again.
  function startLevel(i, keep) {
    state.run++;
    state.level = i;
    const lv = LEVELS[i];
    if (lv.random && !keep) randomTrek(lv, Math.random);
    state.lv = lv;
    state.rows = lv.map.length;
    state.cols = lv.map[0].length;
    state.rocks = new Set();
    state.shown = new Set();
    lv.map.forEach((row, y) => {
      [...row].forEach((c, x) => {
        if (c === '#' || c === 'r') state.rocks.add(key(x, y));
        if (c === '#') state.shown.add(key(x, y));
        if (c === 'F') state.goal = { x, y };
        if (c === 'R') state.start = { x, y };
      });
    });
    const f = DIRS[lv.face];
    state.w = { x: state.start.x, y: state.start.y, f, a: f * 90, k: 0 };
    state.g = null;
    state.track = [];
    state.gtrack = [];
    state.plan = [];
    state.open = null;
    state.sol = 1;
    state.charge = lv.battery || 0;
    state.sent = 0;
    state.sends = 0;
    state.stops = 0;
    skipSignal = null;
    setBusy(false);
    reveal();
    $('rover').innerHTML = ROVER;
    $('ghost').innerHTML = ROVER;
    $('ghost').classList.add('hidden');
    $('rover').classList.remove('drilling', 'shake');
    $('target').innerHTML = TARGETS[lv.goal];
    $('signal').classList.add('hidden');
    $('night').classList.remove('on');
    $('toast').classList.remove('show');
    $('win').classList.add('hidden');
    Astro.stopConfetti($('confetti'));
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    terrain = makeTerrain(i, state.cols, state.rows, 56, state.goal);
    renderSteps();
    renderPlan();
    layout();
    touched();
  }

  function showMenu() {
    state.run++;
    clearTimeout(idleTimer);
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    buildMenu();
  }

  // The picture of a level on its card: its map as it starts, without the rocks
  // that are hidden, on a square of ground. Drawn once, as a PNG so that phones
  // in dark mode leave it alone.
  const pictures = [];
  function levelPicture(i) {
    if (pictures[i]) return pictures[i];
    const lv = LEVELS[i];
    const rows = lv.map.length;
    const cols = lv.map[0].length;
    const n = Math.max(rows, cols);
    const c = Math.floor(300 / n);
    const ox = Math.floor((n - cols) / 2);
    const oy = Math.floor((n - rows) / 2);
    const find = (ch) => {
      const y = lv.map.findIndex((row) => row.includes(ch));
      return { x: lv.map[y].indexOf(ch), y };
    };
    const goal = find('F');
    const start = find('R');
    const ground = makeTerrain(i, n, n, c, { x: goal.x + ox, y: goal.y + oy });
    const g = ground.getContext('2d');
    g.translate(ox * c, oy * c);

    g.strokeStyle = 'rgba(255, 240, 225, 0.2)';
    g.lineWidth = 1;
    g.strokeRect(0, 0, cols * c, rows * c);
    g.beginPath();
    for (let x = 1; x < cols; x++) { g.moveTo(x * c, 0); g.lineTo(x * c, rows * c); }
    for (let y = 1; y < rows; y++) { g.moveTo(0, y * c); g.lineTo(cols * c, y * c); }
    g.stroke();

    lv.map.forEach((row, y) => {
      [...row].forEach((ch, x) => { if (ch === '#') drawRock(g, x, y, c); });
    });

    // the target, as in TARGETS
    g.save();
    g.translate(goal.x * c, goal.y * c);
    g.scale(c / 100, c / 100);
    if (lv.goal === 'flag') {
      g.fillStyle = '#f4f6ff';
      g.fillRect(39, 18, 6, 64);
      g.fillStyle = '#ffd34d';
      g.beginPath();
      g.moveTo(45, 20);
      g.lineTo(74, 32);
      g.lineTo(45, 44);
      g.fill();
    } else if (lv.goal === 'rock') {
      blob(g, 50, 52, 28, 22, seeded(7), '#c9bba8');
      blob(g, 44, 45, 15, 9, seeded(11), '#efe6d8');
    }
    g.strokeStyle = '#ffd34d';
    g.lineWidth = 6;
    g.beginPath();
    g.arc(50, 50, 42, 0, Math.PI * 2);
    g.stroke();
    g.restore();

    // the rover, as in ROVER
    g.translate((start.x + 0.5) * c, (start.y + 0.5) * c);
    g.rotate((DIRS[lv.face] * Math.PI) / 2);
    g.scale(c / 100, c / 100);
    g.translate(-50, -50);
    g.fillStyle = '#2e2a33';
    for (const y of [18, 44, 70]) {
      g.fillRect(10, y, 13, 20);
      g.fillRect(77, y, 13, 20);
    }
    g.fillStyle = '#27509e';
    g.fillRect(20, 40, 60, 46);
    g.fillStyle = '#f0ebe2';
    g.fillRect(27, 20, 46, 24);
    g.fillStyle = '#3a3a48';
    g.beginPath();
    g.arc(50, 30, 7, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#ffd34d';
    g.beginPath();
    g.moveTo(50, 1);
    g.lineTo(64, 16);
    g.lineTo(36, 16);
    g.fill();

    if (lv.random) {
      const size = n * c;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.font = `900 ${size * 0.6}px Nunito, sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.lineWidth = size * 0.035;
      g.strokeStyle = 'rgba(30, 14, 10, 0.75)';
      g.strokeText('?', size / 2, size / 2);
      g.fillStyle = '#ffd34d';
      g.fillText('?', size / 2, size / 2);
    }

    pictures[i] = ground.toDataURL('image/png');
    return pictures[i];
  }

  const usesSols = (lv) => !!lv.battery;
  const scoreText = (lv, n) => (usesSols(lv) ? t('sols')(n) : t('orders')(n));

  function buildMenu() {
    const box = $('levels');
    box.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'pictures';
    LEVELS.forEach((lv, i) => {
      const b = document.createElement('button');
      const locked = lv.random && !bonusOpen();
      b.className = 'pic' + (i === state.level ? ' selected' : '') + (locked ? ' locked' : '');
      b.innerHTML = '<img alt=""><span><b class="number"></b> <i></i></span>';
      b.querySelector('img').src = levelPicture(i);
      b.querySelector('.number').textContent = `${i + 1}.`;
      b.querySelector('i').textContent = lv.name[Astro.lang];
      if (done.includes(lv.id)) b.insertAdjacentHTML('beforeend', '<b class="done-badge">🌟</b>');
      if (locked) {
        const note = document.createElement('div');
        note.className = 'best';
        note.textContent = t('locked')(BONUS);
        b.appendChild(note);
      } else if (best[lv.id]) {
        const score = document.createElement('div');
        score.className = 'best';
        score.textContent = lv.random ? t('treks')(best[lv.id]) : t('best')(scoreText(lv, best[lv.id]));
        b.appendChild(score);
      }
      b.addEventListener('click', () => {
        if (locked) {
          sfx.oops();
          return;
        }
        state.level = i;
        sfx.pick();
        buildMenu();
      });
      row.appendChild(b);
    });
    box.appendChild(row);
    $('resetBtn').classList.toggle('hidden', !done.length);
    $('clearBest').classList.toggle('hidden', !Object.keys(best).length);
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  function won() {
    const lv = state.lv;
    const wasOpen = bonusOpen();
    if (!done.includes(lv.id)) {
      done.push(lv.id);
      store.set('done', done);
    }
    state.opened = !wasOpen && bonusOpen();
    const score = usesSols(lv) ? state.sol : state.sent;
    // Maps of the random level can't be compared, so it counts the treks.
    if (lv.random) best[lv.id] = (best[lv.id] || 0) + 1;
    else if (!best[lv.id] || score < best[lv.id]) best[lv.id] = score;
    store.set('best', best);
    sfx.snap();
    wait(1000, () => {
      sfx.win();
      showWin();
      $('win').classList.remove('hidden');
      Astro.startConfetti($('confetti'));
    });
  }

  // The level the next button goes to: the bonus level at once when it has just
  // opened, and a new trek on the bonus level itself.
  const nextLevel = () => (state.opened ? BONUS : Math.min(state.level + 1, BONUS));

  function showWin() {
    const lv = state.lv;
    const score = usesSols(lv) ? state.sol : state.sent;
    $('winName').textContent = `${lv.name[Astro.lang]} · ${t('result')(scoreText(lv, score))}`;
    $('winFact').textContent = lv.fact[Astro.lang];
    if (!$('winPic').firstChild || $('winPic').dataset.card !== lv.card) {
      const img = new Image();
      img.alt = '';
      img.src = postcard(lv.card);
      $('winPic').innerHTML = '';
      $('winPic').appendChild(img);
      $('winPic').dataset.card = lv.card;
    }
    const to = nextLevel();
    $('nextBtn').classList.toggle('hidden', to === BONUS && !bonusOpen());
    $('nextBtn').querySelector('span').textContent = t(lv.random ? 'newTrek' : to === BONUS ? 'bonus' : 'next');
  }

  // What the rover sees: rusty ground under a butterscotch sky. By day the sky
  // of Mars is reddish, and blue around the Sun as it sets.
  function postcard(kind) {
    const S = 640;
    const cv = document.createElement('canvas');
    cv.width = cv.height = S;
    const g = cv.getContext('2d');
    const rnd = seeded(kind.length * 4099 + kind.charCodeAt(0) * 37);
    const dusk = kind === 'sunset';
    const H = Math.round(S * (kind === 'sun' ? 0.5 : 0.44));

    const sky = g.createLinearGradient(0, 0, 0, H);
    if (dusk) {
      sky.addColorStop(0, '#26252e');
      sky.addColorStop(1, '#6b6a70');
    } else {
      sky.addColorStop(0, '#b4875f');
      sky.addColorStop(1, '#e8c79e');
    }
    g.fillStyle = sky;
    g.fillRect(0, 0, S, H + 2);

    // The Sun looks about two thirds as wide from Mars as from the Earth.
    if (dusk || kind === 'sun') {
      const sx = S * (dusk ? 0.56 : 0.66);
      const sy = H - (dusk ? 66 : 110);
      const glow = g.createRadialGradient(sx, sy, 0, sx, sy, dusk ? 210 : 120);
      if (dusk) {
        glow.addColorStop(0, 'rgba(205, 232, 255, 0.95)');
        glow.addColorStop(0.25, 'rgba(130, 180, 235, 0.62)');
        glow.addColorStop(1, 'rgba(90, 130, 190, 0)');
      } else {
        glow.addColorStop(0, 'rgba(255, 245, 225, 0.85)');
        glow.addColorStop(1, 'rgba(255, 235, 200, 0)');
      }
      g.fillStyle = glow;
      g.fillRect(0, 0, S, H + 2);
      g.fillStyle = '#fffdf4';
      g.beginPath();
      g.arc(sx, sy, dusk ? 8 : 10, 0, Math.PI * 2);
      g.fill();
    }

    // far hills, or the rim of a crater
    const hills = (rise, rough, colour, off) => {
      g.fillStyle = colour;
      g.beginPath();
      g.moveTo(0, H + 2);
      for (let x = 0; x <= S; x += 4) {
        g.lineTo(x, H - rise * (0.4 + fbm(x / rough + off, off)));
      }
      g.lineTo(S, H + 2);
      g.fill();
    };
    if (kind === 'rim') hills(120, 170, '#a9764f', 3);
    hills(46, 90, dusk ? '#2e2528' : '#99664a', 11);

    // the ground, in perspective
    const img = g.createImageData(S, S - H);
    for (let y = 0; y < S - H; y++) {
      const d = (y + 1) / (S - H);
      const z = 1 / (d + 0.05);
      for (let x = 0; x < S; x++) {
        const u = ((x - S / 2) / S) * z;
        const n = fbm(u * 3 + 20, z * 2.2);
        const tone = (0.72 + 0.5 * n) * (0.82 + 0.24 * d) * (dusk ? 0.36 : 1);
        const o = (y * S + x) * 4;
        img.data[o] = 186 * tone;
        img.data[o + 1] = 106 * tone;
        img.data[o + 2] = 66 * tone;
        img.data[o + 3] = 255;
      }
    }
    g.putImageData(img, 0, H);

    // the rover's own tracks running back behind it
    if (kind === 'tracks') {
      g.fillStyle = 'rgba(66, 34, 22, 0.42)';
      for (const side of [-1, 1]) {
        g.beginPath();
        g.moveTo(S / 2 + side * 12, H + 6);
        g.lineTo(S / 2 + side * 16, H + 6);
        g.lineTo(S / 2 + side * 250, S);
        g.lineTo(S / 2 + side * 130, S);
        g.fill();
      }
    }

    // scattered rocks, the far ones first
    const shade = dusk ? ['#1b1412', '#2f2422', '#47383a'] : ['#4a2c20', '#6e4a3a', '#94705c'];
    const rocks = [];
    for (let i = 0; i < (kind === 'rocks' ? 60 : 34); i++) {
      const d = rnd() * rnd();
      const x = rnd() * S;
      if (kind === 'tracks' && Math.abs(x - S / 2) < 40 + d * 300) continue;
      rocks.push([x, d]);
    }
    rocks.sort((a, b) => a[1] - b[1]);
    for (const [x, d] of rocks) {
      const y = H + 6 + d * (S - H - 10);
      const r = 2 + d * 46 * (0.4 + rnd());
      blob(g, x + r * 0.3, y + r * 0.35, r * 1.2, r * 0.42, rnd, 'rgba(30, 14, 10, 0.38)');
      blob(g, x, y, r, r * 0.68, rnd, shade[0]);
      blob(g, x - r * 0.1, y - r * 0.13, r * 0.78, r * 0.48, rnd, shade[1]);
      if (r > 8) blob(g, x - r * 0.25, y - r * 0.28, r * 0.36, r * 0.2, rnd, shade[2]);
    }

    // the big rock in front, with a drilled hole in it for 'hole'
    if (kind === 'rock' || kind === 'hole') {
      const x = S * 0.5;
      const y = S * 0.74;
      blob(g, x + 34, y + 72, 200, 46, rnd, 'rgba(30, 14, 10, 0.45)');
      blob(g, x, y, 165, 118, rnd, '#6b4a3c');
      blob(g, x - 16, y - 18, 130, 86, rnd, '#8c6a58');
      blob(g, x - 52, y - 50, 62, 30, rnd, '#ab8a75');
      if (kind === 'hole') {
        g.fillStyle = 'rgba(200, 180, 160, 0.55)';
        g.beginPath();
        g.arc(x + 6, y + 2, 34, 0, Math.PI * 2);
        g.fill();
        g.fillStyle = '#17100d';
        g.beginPath();
        g.arc(x + 6, y + 2, 15, 0, Math.PI * 2);
        g.fill();
      }
    }
    return cv.toDataURL('image/png');
  }

  // ---------------------------------------------------------------------------
  // Buttons & resizing
  // ---------------------------------------------------------------------------

  new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden')) layout();
  }).observe($('mapBox'));

  $('playBtn').addEventListener('click', () => startLevel(state.level));
  $('againBtn').addEventListener('click', () => startLevel(state.level, true));
  $('nextBtn').addEventListener('click', () => startLevel(nextLevel()));
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('sendBtn').addEventListener('click', send);
  $('stopBtn').addEventListener('click', () => {
    sfx.oops();
    toast(t('tooLate')(state.lv.delay));
  });
  $('restartBtn').addEventListener('click', () => {
    sfx.pick();
    startLevel(state.level, true);
  });
  $('hintBtn').addEventListener('click', test);
  $('signal').addEventListener('click', () => { if (skipSignal) skipSignal(); });
  $('soundBtn').classList.toggle('off', !sfx.on);
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    $('soundBtn').classList.toggle('off', !sfx.on);
    sfx.pick();
  });
  $('resetBtn').addEventListener('click', () => {
    if (!window.confirm(t('resetAsk'))) return;
    done.length = 0;
    store.set('done', done);
    if (state.level === BONUS) state.level = 0;
    buildMenu();
  });
  $('clearBest').addEventListener('click', () => {
    if (!window.confirm(t('clearAsk'))) return;
    for (const id of Object.keys(best)) delete best[id];
    store.set('best', best);
    buildMenu();
  });

  Astro.setupLanguage(TEXT, () => {
    buildMenu();
    if (state.lv) {
      renderSteps();
      renderPlan();
      if (!$('win').classList.contains('hidden')) showWin();
    }
  });
})();
