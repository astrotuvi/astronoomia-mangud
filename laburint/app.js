'use strict';

(() => {
  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // The photos of Tähepusle, by Tõrva Astronoomiaklubi (AstroBin, CC BY-NC-SA).
  // `astrobin` is the image id: https://www.astrobin.com/<id>/
  // `kind` keeps the decoys a different kind of thing from the picture to find.
  const PHOTOS = [
    {
      file: '../pusle/images/pleiades.jpg',
      kind: 'cluster',
      astrobin: 'qirtxe',
      name: { et: 'Plejaadid (Sõel)', en: 'The Pleiades' },
      fact: {
        et: 'Plejaadid ehk Sõel on hulk noori kuumi sinakaid tähti. Selgel talveõhtul näed neid taevas ka ilma pikksilmata!',
        en: 'The Pleiades, or Seven Sisters, are a group of young, hot, blue stars. On a clear winter evening you can see them without a telescope!'
      }
    },
    {
      file: '../pusle/images/moon.jpg',
      kind: 'moon',
      astrobin: 'oy5di6',
      name: { et: 'Värviline Kuu', en: 'The Moon in colour' },
      fact: {
        et: 'See on Kuu! Värvid näitavad, et Kuu pind on eri kohtades tehtud erinevatest kivimitest.',
        en: 'This is the Moon! The colours show that different parts of the Moon are made of different kinds of rock.'
      }
    },
    {
      file: '../pusle/images/saturn.jpg',
      kind: 'planet',
      astrobin: 'fu9tbu',
      name: { et: 'Saturn', en: 'Saturn' },
      fact: {
        et: 'Saturn on hiiglaslik planeet. Tema ümber on ilusad rõngad, mis koosnevad jääst ja kivitükkidest.',
        en: 'Saturn is a giant planet. Its beautiful rings are made of pieces of ice and rock.'
      }
    },
    {
      file: '../pusle/images/jupiter.jpg',
      kind: 'planet',
      astrobin: 'gnc57p',
      name: { et: 'Jupiter', en: 'Jupiter' },
      fact: {
        et: 'Jupiter on Päikesesüsteemi suurim planeet. Punane laik on hiiglaslik torm, mis on suurem kui meie Maa!',
        en: 'Jupiter is the biggest planet in the Solar System. The red spot is a giant storm that is bigger than our Earth!'
      }
    },
    {
      file: '../pusle/images/eclipse.jpg',
      kind: 'sun',
      astrobin: 'ytu8fs',
      name: { et: 'Päikesevarjutus', en: 'Solar eclipse' },
      fact: {
        et: 'Kuu liikus Päikese ette ja kattis osa sellest. See pilt on tehtud 10. juunil 2021. Ära kunagi vaata Päikest ilma spetsiaalsete prillideta!',
        en: 'The Moon moved in front of the Sun and covered part of it. This photo was taken on 10 June 2021. Never look at the Sun without special glasses!'
      }
    },
    {
      file: '../pusle/images/tsuchinshan.jpg',
      kind: 'comet',
      astrobin: '9k85ql',
      name: { et: 'Komeet Tsuchinshan-ATLAS', en: 'Comet Tsuchinshan–ATLAS' },
      fact: {
        et: 'Komeet on suur jäine kivi. Kui see tuleb Päikese lähedale, hakkab jää aurama ja tekib pikk helendav saba. Seda komeeti nägi 2024. aasta oktoobris ka palja silmaga.',
        en: 'A comet is a big lump of ice and rock. When it comes near the Sun, the ice turns to gas and makes a long glowing tail. In October 2024 you could see this comet without a telescope.'
      }
    },
    {
      file: '../pusle/images/ponsbrooks.jpg',
      kind: 'comet',
      astrobin: '0tbdac',
      name: { et: 'Komeet Pons-Brooks', en: 'Comet Pons–Brooks' },
      fact: {
        et: 'See komeet tuleb Päikese juurde tagasi umbes iga 71 aasta järel. Järgmine kord näeb seda alles 2095. aastal!',
        en: 'This comet comes back to the Sun about every 71 years. The next time we can see it is in 2095!'
      }
    },
    {
      file: '../pusle/images/orion.jpg',
      kind: 'nebula',
      astrobin: 'uu55w0',
      name: { et: 'Orioni udu', en: 'Orion Nebula' },
      fact: {
        et: 'Orioni udu on suur gaasipilv, kus sünnivad uued tähed. Talvel võid seda näha isegi binokliga.',
        en: 'The Orion Nebula is a big cloud of gas where new stars are born. In winter you can even see it with binoculars.'
      }
    },
    {
      file: '../pusle/images/horsehead.jpg',
      kind: 'nebula',
      astrobin: '4yxzcw',
      name: { et: 'Hobusepea udu', en: 'Horsehead Nebula' },
      fact: {
        et: 'Hobusepea udu on tume tolmupilv, mis näeb välja nagu hobuse pea. See asub Orioni tähtkujus.',
        en: 'The Horsehead Nebula is a dark cloud of dust shaped like a horse’s head. It is in the constellation Orion.'
      }
    },
    {
      file: '../pusle/images/rosette.jpg',
      kind: 'nebula',
      astrobin: '61be3g',
      name: { et: 'Roseti udu', en: 'Rosette Nebula' },
      fact: {
        et: 'Roseti udu näeb välja nagu suur roos taevas. Selle keskel on hulk noori tähti.',
        en: 'The Rosette Nebula looks like a big rose in the sky. There is a group of young stars in its middle.'
      }
    },
    {
      file: '../pusle/images/bubble.jpg',
      kind: 'nebula',
      astrobin: 's8kr1m',
      name: { et: 'Mulli udu', en: 'Bubble Nebula' },
      fact: {
        et: 'Mulli udu on hiiglaslik gaasimull. Selle on puhunud üks väga kuum ja suur täht, mis on mulli sees.',
        en: 'The Bubble Nebula is a giant bubble of gas. It was blown by a very hot, big star inside it.'
      }
    },
    {
      file: '../pusle/images/california.jpg',
      kind: 'nebula',
      astrobin: 'q8ho3d',
      name: { et: 'Kalifornia udu', en: 'California Nebula' },
      fact: {
        et: 'See udu on sama kujuga nagu Kalifornia osariik Ameerikas. Taevas on see sama pikk kui viis täiskuud kõrvuti.',
        en: 'This nebula has the same shape as the state of California in America. In the sky it is as long as five full moons side by side.'
      }
    },
    {
      file: '../pusle/images/crescent.jpg',
      kind: 'nebula',
      astrobin: 'h4lzn6',
      name: { et: 'Poolkuu udu', en: 'Crescent Nebula' },
      fact: {
        et: 'Poolkuu udu on gaasikest, mille üks väga kuum täht on enda ümbert välja puhunud.',
        en: 'The Crescent Nebula is a shell of gas that a very hot star has blown out around itself.'
      }
    },
    {
      file: '../pusle/images/cygnusloop.jpg',
      kind: 'nebula',
      astrobin: 'wgllu0',
      name: { et: 'Luige silmus', en: 'Cygnus Loop' },
      fact: {
        et: 'Siin plahvatas tuhandeid aastaid tagasi üks täht. Plahvatuse jäänused paisuvad ikka veel laiali nagu suur rõngas.',
        en: 'A star exploded here thousands of years ago. What is left of it is still spreading out like a big ring.'
      }
    },
    {
      file: '../pusle/images/dumbbell.jpg',
      kind: 'nebula',
      astrobin: '7uonbx',
      name: { et: 'Hantli udu', en: 'Dumbbell Nebula' },
      fact: {
        et: 'Hantli udu tekkis, kui üks Päikese-sarnane täht oma välimised kihid minema heitis. Kunagi juhtub nii ka meie Päikesega.',
        en: 'The Dumbbell Nebula formed when a star like the Sun threw off its outer layers. One day this will happen to our Sun too.'
      }
    },
    {
      file: '../pusle/images/elephant.jpg',
      kind: 'nebula',
      astrobin: 't3aagk',
      name: { et: 'Elevandilondi udu', en: 'Elephant’s Trunk Nebula' },
      fact: {
        et: 'Selles suures gaasipilves on tume tolmusammas, mis meenutab elevandi lonti. Selle sees sünnivad uued tähed.',
        en: 'In this big cloud of gas there is a dark pillar of dust that looks like an elephant’s trunk. New stars are being born inside it.'
      }
    },
    {
      file: '../pusle/images/iris.jpg',
      kind: 'nebula',
      astrobin: 'oay737',
      name: { et: 'Iirise udu', en: 'Iris Nebula' },
      fact: {
        et: 'Iirise udu on tolmupilv, mis peegeldab ühe ereda tähe sinist valgust. See näeb välja nagu lill.',
        en: 'The Iris Nebula is a cloud of dust that reflects the blue light of a bright star. It looks like a flower.'
      }
    },
    {
      file: '../pusle/images/northamerica.jpg',
      kind: 'nebula',
      astrobin: 'wl3iuw',
      name: { et: 'Põhja-Ameerika udu', en: 'North America Nebula' },
      fact: {
        et: 'Kogu see udu on Põhja-Ameerika mandri kujuline. Pildil on selle keskosa. Udu on Luige tähtkujus ereda tähe Deenebi lähedal.',
        en: 'The whole nebula has the shape of North America. The picture shows its middle part. It is in the constellation Cygnus, near the bright star Deneb.'
      }
    },
    {
      file: '../pusle/images/spider.jpg',
      kind: 'nebula',
      astrobin: 'ur6xpe',
      name: { et: 'Ämbliku ja Kärbse udu', en: 'Spider and Fly Nebulae' },
      fact: {
        et: 'Siin on kaks gaasipilve, mida kutsutakse Ämblikuks ja Kärbseks. Mõlemas sünnivad uued tähed.',
        en: 'Here are two clouds of gas called the Spider and the Fly. New stars are being born in both of them.'
      }
    },
    {
      file: '../pusle/images/questionmark.jpg',
      kind: 'nebula',
      astrobin: 'jnx2hb',
      name: { et: 'Küsimärgi udu', en: 'Question Mark Nebula' },
      fact: {
        et: 'See punane gaasipilv on kaugelt vaadates küsimärgi kujuline. Selles sünnivad uued tähed.',
        en: 'Seen from far away, this red cloud of gas is shaped like a question mark. New stars are being born in it.'
      }
    },
    {
      file: '../pusle/images/heart.jpg',
      kind: 'nebula',
      astrobin: 'daq9v5',
      name: { et: 'Südame udu', en: 'Heart Nebula' },
      fact: {
        et: 'Südame udu on südame kujuline punane gaasipilv. Selle keskel on noored tähed, mis panevad gaasi helendama.',
        en: 'The Heart Nebula is a red cloud of gas shaped like a heart. Young stars in its middle make the gas glow.'
      }
    },
    {
      file: '../pusle/images/crab.jpg',
      kind: 'nebula',
      astrobin: '9msc3y',
      name: { et: 'Krabi udu', en: 'Crab Nebula' },
      fact: {
        et: 'Krabi udu on plahvatanud tähe jäänus. Inimesed nägid seda plahvatust aastal 1054. See oli nii ere, et paistis isegi päeval!',
        en: 'The Crab Nebula is what is left of a star that exploded. People saw the explosion in the year 1054. It was so bright that it could be seen even in the daytime!'
      }
    },
    {
      file: '../pusle/images/andromeda.jpg',
      kind: 'galaxy',
      astrobin: '4ocaul',
      name: { et: 'Andromeeda galaktika', en: 'Andromeda Galaxy' },
      fact: {
        et: 'Andromeeda galaktika on meie Linnutee naaber. Selles on sadu miljardeid tähti!',
        en: 'The Andromeda Galaxy is our Milky Way’s neighbour. It has hundreds of billions of stars!'
      }
    },
    {
      file: '../pusle/images/whirlpool.jpg',
      kind: 'galaxy',
      astrobin: 'ymu58n',
      name: { et: 'Keerise galaktika', en: 'Whirlpool Galaxy' },
      fact: {
        et: 'Keerise galaktika spiraalharud keerlevad nagu vesi vannis. Tema kõrval on väike kaaslasgalaktika.',
        en: 'The Whirlpool Galaxy has spiral arms that swirl like water down a drain. A small galaxy is right next to it.'
      }
    },
    {
      file: '../pusle/images/pinwheel.jpg',
      kind: 'galaxy',
      astrobin: 'aqmyzp',
      name: { et: 'Tuuleveski galaktika', en: 'Pinwheel Galaxy' },
      fact: {
        et: 'See galaktika näeb välja nagu tuuleveski. Ta on meie Linnuteest suurem.',
        en: 'This galaxy looks like a pinwheel. It is bigger than our Milky Way.'
      }
    },
    {
      file: '../pusle/images/triangulum.jpg',
      kind: 'galaxy',
      astrobin: 'yvvd54',
      name: { et: 'Kolmnurga galaktika', en: 'Triangulum Galaxy' },
      fact: {
        et: 'Kolmnurga galaktika on Andromeeda galaktika väike naaber. Väga pimedas kohas võib seda näha isegi palja silmaga.',
        en: 'The Triangulum Galaxy is a small neighbour of the Andromeda Galaxy. In a very dark place you can even see it without a telescope.'
      }
    },
    {
      file: '../pusle/images/bode.jpg',
      kind: 'galaxy',
      astrobin: 'xcthwy',
      name: { et: 'Bode ja Sigari galaktika', en: 'Bode’s and Cigar Galaxies' },
      fact: {
        et: 'Vasakul on spiraalne Bode galaktika ja paremal Sigari galaktika, kus sünnib väga palju uusi tähti. Need on Suure Vankri lähedal.',
        en: 'On the left is the spiral Bode’s Galaxy and on the right the Cigar Galaxy, where lots of new stars are being born. They are near the Big Dipper.'
      }
    },
    {
      file: '../pusle/images/triplet.jpg',
      kind: 'galaxy',
      astrobin: '3frqwu',
      name: { et: 'Lõvi kolmik', en: 'Leo Triplet' },
      fact: {
        et: 'Siin on korraga kolm galaktikat! Need on Lõvi tähtkujus üksteise naabrid.',
        en: 'Here are three galaxies at once! They are neighbours in the constellation Leo.'
      }
    },
    {
      file: '../pusle/images/sombrero.jpg',
      kind: 'galaxy',
      astrobin: 'yle81q',
      name: { et: 'Sombreero galaktika', en: 'Sombrero Galaxy' },
      fact: {
        et: 'See galaktika näeb välja nagu laia äärega Mehhiko kübar sombreero. Tume triip selle keskel on tolm.',
        en: 'This galaxy looks like a sombrero, a Mexican hat with a wide brim. The dark stripe across it is dust.'
      }
    },
    {
      file: '../pusle/images/needle.jpg',
      kind: 'galaxy',
      astrobin: '7mcpat',
      name: { et: 'Nõela galaktika', en: 'Needle Galaxy' },
      fact: {
        et: 'See on spiraalgalaktika, mida me näeme täpselt küljelt, nii et see paistab peenike nagu nõel. Küljelt vaadates näeks meie Linnutee välja umbes samasugune.',
        en: 'This is a spiral galaxy that we see exactly from the side, so it looks as thin as a needle. Seen from the side, our Milky Way would look much the same.'
      }
    }
  ];

  // `cells`: about this many cells along the longer side of the maze, each at
  // least `min` px, so that a finger can follow the paths. `match`: the task
  // shows the picture to find, otherwise its name. `decoys`: how many wrong
  // pictures. `same`: the decoys are the same kind of thing as the picture to
  // find. `dark`: the maze is seen only where the rocket has been, and with
  // `lamp` only around the rocket, as the dark comes back behind it.
  // `count`: a picture found here, without first going to a wrong one or
  // asking for a hint, adds to how many times it has been found.
  const LEVELS = [
    { icon: '🖼️', cells: 9, min: 40, match: true, decoys: 1 },
    { icon: '🌀', cells: 13, min: 34, match: true, decoys: 1 },
    { icon: '🔤', cells: 13, min: 34, match: false, decoys: 1, count: true },
    { icon: '🎯', cells: 17, min: 28, match: false, decoys: 2, count: true },
    { icon: '🌑', cells: 17, min: 28, match: false, decoys: 2, dark: true, count: true },
    { icon: '🔦', cells: 17, min: 28, match: false, decoys: 2, same: true, dark: true, lamp: true, count: true }
  ];

  const SPEED = 9; // cells a second
  const REACH = 4; // at most this many steps to where the finger is, so that it cannot jump a wall

  const TEXT = {
    et: {
      title: 'Kosmoselabürint',
      intro1: 'Lenda raketiga läbi labürindi õige pildini.',
      intro2: 'Labürindi servades on pildid. Vaata, milline neist on see, mida otsid, ja leia tee selleni. Rakett liigub, kui vead sõrme või hiirega mööda käiku. Arvutis saad vajutada ka nooleklahve.',
      chooseLevel: 'Vali tase',
      levels: [
        { name: 'Sama pilt', about: 'Leia tee pildini, mis on üleval' },
        { name: 'Suurem labürint', about: 'Sama pilt, aga pikem tee' },
        { name: 'Pildi nimi', about: 'Üleval on pildi asemel selle nimi' },
        { name: 'Kolm pilti', about: 'Kaks pilti kolmest on valed ja labürint on veel suurem' },
        { name: 'Pime labürint', about: 'Labürint paistab ainult seal, kus rakett on lennanud' },
        { name: 'Sarnased pildid', about: 'Kõik kolm pilti on sama liiki ja labürint paistab ainult raketi ümber' }
      ],
      play: 'Mängi',
      foundTitle: 'Nime järgi leitud pildid',
      foundAbout: 'Tasemetel 3–6 loeb pilt siis, kui rakett jõuab selleni enne ühtegi valet pilti ja ilma vihjeta.',
      clear: '🗑️ Kustuta skoor',
      clearAsk: 'Kas kustutada kõigi piltide skoor?',
      flyMatch: 'Lenda raketiga selle pildini:',
      fly: 'Lenda raketiga pildini, millel on',
      back: 'Lenda tagasi 🚀',
      notThis: 'See ei ole pilt, mida otsid. Lenda teise pildini!',
      notThis2: 'See ei ole pilt, mida otsid. Proovi mõnda teist pilti!',
      wellDone: 'Tubli!',
      newMaze: 'Uus labürint',
      nextLevel: 'Järgmine tase',
      menu: 'Menüü',
      hint: 'Vihje',
      sound: 'Heli',
      credit: 'Fotod: Tõrva Astronoomiaklubi, litsents CC BY-NC-SA.',
      photo: 'Foto: Tõrva Astronoomiaklubi',
      allGames: 'Kõik mängud'
    },
    en: {
      title: 'Space Maze',
      intro1: 'Fly the rocket through the maze to the right picture.',
      intro2: 'There are pictures at the edges of the maze. Work out which one you are looking for, and find the way to it. To move the rocket, drag your finger or the mouse along a path. On a computer you can also use the arrow keys.',
      chooseLevel: 'Pick a level',
      levels: [
        { name: 'Same picture', about: 'Find the way to the picture shown at the top' },
        { name: 'Bigger maze', about: 'The same picture, but a longer way' },
        { name: 'The name', about: 'The name of the picture instead of the picture' },
        { name: 'Three pictures', about: 'Two of the three pictures are wrong, in an even bigger maze' },
        { name: 'Dark maze', about: 'You see the maze only where the rocket has been' },
        { name: 'Look-alikes', about: 'All three pictures are the same kind of thing, and you see the maze only around the rocket' }
      ],
      play: 'Play',
      foundTitle: 'Pictures found by name',
      foundAbout: 'On levels 3–6 a picture counts when the rocket gets to it before any wrong picture, and without a hint.',
      clear: '🗑️ Clear the counts',
      clearAsk: 'Clear the counts of all the pictures?',
      flyMatch: 'Fly the rocket to this picture:',
      fly: 'Fly the rocket to the picture of',
      back: 'Fly back 🚀',
      notThis: 'This is not the picture you are looking for. Fly to the other one!',
      notThis2: 'This is not the picture you are looking for. Try another one!',
      wellDone: 'Well done!',
      newMaze: 'New maze',
      nextLevel: 'Next level',
      menu: 'Menu',
      hint: 'Hint',
      sound: 'Sound',
      credit: 'Photos: Tõrva Astronoomiaklubi, licence CC BY-NC-SA.',
      photo: 'Photo: Tõrva Astronoomiaklubi',
      allGames: 'All games'
    }
  };

  // ---------------------------------------------------------------------------
  // State & helpers
  // ---------------------------------------------------------------------------

  const { $, rand, clamp, shuffle, sfx } = Astro;
  const store = Astro.makeStore('laburint.');
  const t = (key) => TEXT[Astro.lang][key];

  const field = $('field');
  const cv = $('maze');
  const fogCv = document.createElement('canvas');
  const rocketEl = $('rocket');
  const fingerEl = $('finger');
  const photoEls = [$('photoA'), $('photoB'), $('photoC')];

  // the open sides of a cell, as bits, and the side of the cell next to it
  const DIRS = [
    { bit: 1, dx: 0, dy: -1, back: 4 },
    { bit: 2, dx: 1, dy: 0, back: 8 },
    { bit: 4, dx: 0, dy: 1, back: 1 },
    { bit: 8, dx: -1, dy: 0, back: 2 }
  ];

  const done = new Set(store.get('done', []));
  // how many times each picture has been found by its name, by its file name: { orion: 2, … }
  const found = store.get('found', {});
  const photoKey = (p) => p.file.split('/').pop().replace(/\.\w+$/, '');
  const state = {
    level: clamp(store.get('level', 0), 0, LEVELS.length - 1),
    set: null,      // [target, ...decoys]
    last: [],       // the pictures to find lately, not to be asked again soon
    L: null,        // the layout of the field
    m: null,        // the maze
    cell: 0,        // where the rocket is, or last was
    pos: { x: 0, y: 0 }, // the rocket, in cells
    angle: -45,
    scale: 1,
    queue: [],      // the cells the rocket is flying to, in turn
    stack: [],      // the way from the start to the rocket, without the dead ends left again
    seen: new Set(), // the cells the rocket has been in, for the dark maze
    fly: null,      // the rocket flying into the right picture
    drag: null,
    busy: false,
    moved: false,
    missed: false,  // the rocket has been to a wrong picture, or a hint was asked for, in this maze
    start: 0,
    hintUntil: 0,
    gen: 0          // goes up when a game ends, so that its timers do nothing
  };
  const level = () => LEVELS[state.level];

  function later(ms, fn) {
    const gen = state.gen;
    setTimeout(() => { if (gen === state.gen) fn(); }, ms);
  }

  // ---------------------------------------------------------------------------
  // The maze
  // ---------------------------------------------------------------------------

  // A maze with one way between any two cells, dug from the start by going
  // on at random and stepping back from dead ends. It makes long winding
  // paths with few short side ones, so the way through is long: harder than
  // a maze with more side paths, where the way through is shorter.
  function carve(cols, rows, start) {
    const open = new Uint8Array(cols * rows);
    const seen = new Uint8Array(cols * rows);
    const stack = [start];
    seen[start] = 1;
    while (stack.length) {
      const i = stack[stack.length - 1];
      const x = i % cols;
      const y = Math.floor(i / cols);
      const next = shuffle(DIRS.filter((d) => {
        const nx = x + d.dx;
        const ny = y + d.dy;
        return nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny * cols + nx];
      }));
      if (!next.length) {
        stack.pop();
        continue;
      }
      const d = next[0];
      const j = (y + d.dy) * cols + x + d.dx;
      open[i] |= d.bit;
      open[j] |= d.back;
      seen[j] = 1;
      stack.push(j);
    }
    return open;
  }

  function neighbours(m, i) {
    const out = [];
    for (const d of DIRS) {
      if (m.open[i] & d.bit) out.push(i + d.dy * m.cols + d.dx);
    }
    return out;
  }

  // the steps from `from` to `to`, without `from`; null if it takes more than maxSteps
  function route(m, from, to, maxSteps = Infinity) {
    const prev = new Int32Array(m.cols * m.rows).fill(-1);
    const dist = new Int32Array(m.cols * m.rows).fill(-1);
    dist[from] = 0;
    const todo = [from];
    for (let k = 0; k < todo.length; k++) {
      const i = todo[k];
      if (i === to) break;
      if (dist[i] >= maxSteps) continue;
      for (const j of neighbours(m, i)) {
        if (dist[j] < 0) {
          dist[j] = dist[i] + 1;
          prev[j] = i;
          todo.push(j);
        }
      }
    }
    if (dist[to] < 0) return null;
    const path = [];
    for (let i = to; i !== from; i = prev[i]) path.unshift(i);
    return path;
  }

  // A maze with the start in the middle and the ways out on two opposite
  // sides: left and right on a wide screen, top and bottom on a tall one.
  // With three pictures, one side has two, one in each half. The ways out
  // are about as far from the start, so that the nearest one does not give
  // the answer, and the way to one does not go past another. A few tries,
  // as in a narrow maze they may be far from even.
  function makeMaze(cols, rows, wide, n) {
    let best = null;
    for (let k = 0; k < 40; k++) {
      const m = tryMaze(cols, rows, wide, n);
      if (m && (!best || m.score > best.score)) best = m;
      if (best && best.diff <= Math.max(1, best.len * 0.15)) break;
    }
    return best;
  }

  function tryMaze(cols, rows, wide, n) {
    const start = Math.floor(rows / 2) * cols + Math.floor(cols / 2);
    const m = { cols, rows, start, wide, open: carve(cols, rows, start) };
    const along = wide ? rows : cols;
    const cellOn = (side, k) => {
      if (wide) return k * cols + (side ? cols - 1 : 0);
      return side ? (rows - 1) * cols + k : k;
    };
    // for each way out: the side, and the first and last+1 cell along it
    let parts;
    if (n === 2) parts = [[0, 0, along], [1, 0, along]];
    else {
      const two = Math.random() < 0.5 ? 0 : 1;
      const h = Math.floor(along / 2);
      parts = [[two, 0, h], [two, along - h, along], [1 - two, 0, along]];
    }
    const sets = parts.map(([side, a, b]) => {
      const out = [];
      for (let k = a; k < b; k++) out.push(cellOn(side, k));
      return out;
    });
    const ways = new Map();
    sets.flat().forEach((i) => ways.set(i, route(m, start, i)));

    let best = null;
    let bestScore = -Infinity;
    const pick = (chosen) => {
      if (chosen.length < sets.length) {
        for (const i of sets[chosen.length]) pick([...chosen, i]);
        return;
      }
      const paths = chosen.map((i) => ways.get(i));
      if (paths.some((p, k) => chosen.some((i, j) => j !== k && p.includes(i)))) return;
      const lens = paths.map((p) => p.length);
      const lo = Math.min(...lens);
      const hi = Math.max(...lens);
      const score = lo - 2 * (hi - lo) + rand(0, 3);
      if (score > bestScore) {
        bestScore = score;
        best = chosen;
        m.len = lo;
        m.diff = hi - lo;
      }
    };
    pick([]);
    if (!best) return null;
    m.score = bestScore;
    m.exits = best;
    // the side of each exit cell that opens to its picture, and which half
    // of the side the picture is in (0: anywhere, 1: first, 2: second)
    m.gates = parts.map(([side]) => (wide ? (side ? 2 : 8) : (side ? 4 : 1)));
    m.parts = parts.map(([side, a, b]) => ({ side, half: b - a === along ? 0 : a === 0 ? 1 : 2 }));
    return m;
  }

  // ---------------------------------------------------------------------------
  // Layout
  // ---------------------------------------------------------------------------

  // The pictures beside the maze on a wide screen, above and below it on a
  // tall one. With three pictures, two of them share a side.
  function layout(wide) {
    const W = field.clientWidth;
    const H = field.clientHeight;
    const gap = 12;
    if (wide === undefined) wide = W > H;
    const share = level().decoys > 1 ? 0.5 : 1;
    const P = Math.floor(wide
      ? Math.min((H - gap) * share, H * 0.5, W * 0.2)
      : Math.min((W - gap) * share, W * 0.5, H * 0.2));
    const mw = wide ? W - 2 * (P + gap) : W - 8;
    const mh = wide ? H - 8 : H - 2 * (P + gap);
    return { W, H, P, gap, wide, mw, mh };
  }

  function gridSize(L) {
    const long = Math.max(L.mw, L.mh);
    let n = level().cells;
    while (n > 5 && long / n < level().min) n--;
    const c = long / n;
    const other = Math.max(3, Math.floor(Math.min(L.mw, L.mh) / c));
    return L.mw >= L.mh ? [n, other] : [other, n];
  }

  // the size and place of the maze, the pictures and the canvases
  function fit() {
    const { L, m } = state;
    m.c = Math.floor(Math.min(L.mw / m.cols, L.mh / m.rows));
    m.x = Math.round((L.W - m.cols * m.c) / 2);
    m.y = Math.round((L.H - m.rows * m.c) / 2);

    const dpr = window.devicePixelRatio || 1;
    cv.width = fogCv.width = Math.ceil(L.W * dpr);
    cv.height = fogCv.height = Math.ceil(L.H * dpr);
    cv.style.width = L.W + 'px';
    cv.style.height = L.H + 'px';

    m.photoBox = m.exits.map((e, k) => {
      const [cx, cy] = center(m, e);
      const { side, half } = m.parts[k];
      const P = L.P;
      const span = L.wide ? L.H : L.W;
      const lo = half === 2 ? span / 2 + L.gap / 2 : 0;
      const hi = half === 1 ? span / 2 - L.gap / 2 - P : span - P;
      if (L.wide) {
        return { x: side ? m.x + m.cols * m.c + L.gap : m.x - L.gap - P, y: clamp(cy - P / 2, lo, hi), P };
      }
      return { x: clamp(cx - P / 2, lo, hi), y: side ? m.y + m.rows * m.c + L.gap : m.y - L.gap - P, P };
    });
    photoEls.forEach((el, k) => {
      const b = m.photoBox[k];
      el.classList.toggle('hidden', !b);
      if (!b) return;
      el.style.width = el.style.height = b.P + 'px';
      el.style.transform = `translate(${b.x}px, ${b.y}px)`;
    });

    const s = Math.round(m.c * 0.9);
    rocketEl.style.width = rocketEl.style.height = s + 'px';
    rocketEl.style.fontSize = Math.round(s * 0.8) + 'px';
    rocketEl.style.lineHeight = s + 'px';
    fingerEl.style.fontSize = Math.round(m.c * 0.7) + 'px';

    if (level().dark) {
      // the dark over the maze, with the places the rocket has been cleared again
      fillDark();
      if (!level().lamp) state.seen.forEach((i) => reveal(...center(m, i)));
    }
  }

  // the dark over the whole maze
  function fillDark() {
    const m = state.m;
    const f = fogCv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    f.setTransform(dpr, 0, 0, dpr, 0, 0);
    f.clearRect(0, 0, state.L.W, state.L.H);
    const pad = m.c * 0.3;
    f.fillStyle = '#0b1238';
    f.beginPath();
    f.roundRect(m.x - pad, m.y - pad, m.cols * m.c + 2 * pad, m.rows * m.c + 2 * pad, Math.min(22, m.c * 0.4));
    f.fill();
  }

  // clear the dark around a point of the field
  function reveal(x, y) {
    const f = fogCv.getContext('2d');
    const r = state.m.c * (level().lamp ? 2.2 : 1.7);
    const g = f.createRadialGradient(x, y, r * 0.45, x, y, r);
    g.addColorStop(0, 'rgba(0, 0, 0, 1)');
    g.addColorStop(1, 'rgba(0, 0, 0, 0)');
    f.globalCompositeOperation = 'destination-out';
    f.fillStyle = g;
    f.beginPath();
    f.arc(x, y, r, 0, Math.PI * 2);
    f.fill();
    f.globalCompositeOperation = 'source-over';
  }

  // ---------------------------------------------------------------------------
  // Drawing
  // ---------------------------------------------------------------------------

  const center = (m, i) => [m.x + (i % m.cols + 0.5) * m.c, m.y + (Math.floor(i / m.cols) + 0.5) * m.c];

  function line(ctx, pts) {
    ctx.beginPath();
    pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  }

  function draw(now) {
    const { L, m } = state;
    const c = m.c;
    const ctx = cv.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, L.W, L.H);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // the floor of the maze
    const pad = c * 0.15;
    ctx.fillStyle = 'rgba(2, 4, 20, 0.5)';
    ctx.beginPath();
    ctx.roundRect(m.x - pad, m.y - pad, m.cols * c + 2 * pad, m.rows * c + 2 * pad, Math.min(22, c * 0.4));
    ctx.fill();

    // from each way out to its picture
    ctx.strokeStyle = 'rgba(255, 251, 224, 0.8)';
    ctx.lineWidth = Math.max(4, c * 0.1);
    ctx.setLineDash([0.1, c * 0.25]);
    m.exits.forEach((e, k) => {
      const [x, y] = center(m, e);
      const b = m.photoBox[k];
      const side = m.parts[k].side;
      const bx = L.wide ? (side ? b.x : b.x + b.P) : clamp(x, b.x + 20, b.x + b.P - 20);
      const by = L.wide ? clamp(y, b.y + 20, b.y + b.P - 20) : (side ? b.y : b.y + b.P);
      const ex = L.wide ? (side ? x + c / 2 : x - c / 2) : x;
      const ey = L.wide ? y : (side ? y + c / 2 : y - c / 2);
      line(ctx, [[ex, ey], [bx, by]]);
    });
    ctx.setLineDash([]);

    // the way flown so far
    const rx = m.x + state.pos.x * c;
    const ry = m.y + state.pos.y * c;
    ctx.strokeStyle = 'rgba(255, 211, 77, 0.35)';
    ctx.lineWidth = c * 0.22;
    if (!state.fly) line(ctx, [...state.stack.map((i) => center(m, i)), [rx, ry]]);
    else line(ctx, state.stack.map((i) => center(m, i)));

    // the walls
    ctx.strokeStyle = '#5fd4ff';
    ctx.lineWidth = Math.max(3, c * 0.1);
    ctx.beginPath();
    const gate = (i, bit) => m.exits.some((e, k) => e === i && m.gates[k] === bit);
    for (let y = 0; y < m.rows; y++) {
      for (let x = 0; x < m.cols; x++) {
        const i = y * m.cols + x;
        const px = m.x + x * c;
        const py = m.y + y * c;
        if (!(m.open[i] & 1) && !gate(i, 1)) { ctx.moveTo(px, py); ctx.lineTo(px + c, py); }
        if (!(m.open[i] & 8) && !gate(i, 8)) { ctx.moveTo(px, py); ctx.lineTo(px, py + c); }
        if (x === m.cols - 1 && !gate(i, 2)) { ctx.moveTo(px + c, py); ctx.lineTo(px + c, py + c); }
        if (y === m.rows - 1 && !gate(i, 4)) { ctx.moveTo(px, py + c); ctx.lineTo(px + c, py + c); }
      }
    }
    ctx.stroke();

    if (level().dark) {
      // with the lamp, only the rocket lights the maze, even as it flies into a picture
      if (level().lamp) fillDark();
      if (!state.fly || level().lamp) reveal(rx, ry);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(fogCv, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // the hint: the way to the right picture, fading, over the dark too
    const hint = (state.hintUntil - now) / 2500;
    if (hint > 0) {
      const way = route(m, state.cell, m.exits[m.target]) || [];
      ctx.strokeStyle = `rgba(255, 211, 77, ${0.8 * Math.min(1, hint * 2)})`;
      ctx.lineWidth = c * 0.3;
      ctx.shadowColor = 'rgba(255, 211, 77, 0.8)';
      ctx.shadowBlur = c * 0.3;
      line(ctx, [center(m, state.cell), ...way.map((i) => center(m, i))]);
      ctx.shadowBlur = 0;
    }
  }

  function placeRocket(now) {
    const m = state.m;
    const s = Math.round(m.c * 0.9);
    const x = m.x + state.pos.x * m.c - s / 2;
    const y = m.y + state.pos.y * m.c - s / 2;
    rocketEl.style.transform = `translate(${x}px, ${y}px) rotate(${state.angle}deg) scale(${state.scale})`;
    // a finger under the rocket, if nothing has happened for a while
    const idle = !state.moved && !state.busy && now - state.start > 2500;
    fingerEl.classList.toggle('hidden', !idle);
    if (idle) fingerEl.style.transform = `translate(${x + s * 0.2}px, ${y + s * 0.95}px)`;
  }

  // the level, in the top bar
  function showLevel() {
    $('levelName').textContent = `${state.level + 1}. ${t('levels')[state.level].name}`;
  }

  function updateSound() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Flying
  // ---------------------------------------------------------------------------

  let raf = 0;
  let last = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!state.m) return;
    step(dt, now);
    placeRocket(now);
    draw(now);
  }

  function turnTo(dx, dy, dt) {
    const want = (Math.atan2(dy, dx) * 180) / Math.PI + 45; // the emoji points up and right
    const d = ((want - state.angle) % 360 + 540) % 360 - 180;
    state.angle += d * Math.min(1, dt * 16);
  }

  function step(dt, now) {
    const m = state.m;
    if (state.fly) {
      const f = state.fly;
      const k = Math.min(1, (now - f.t0) / 600);
      const e = k * k * (3 - 2 * k);
      state.pos.x = f.x0 + (f.x1 - f.x0) * e;
      state.pos.y = f.y0 + (f.y1 - f.y0) * e;
      state.scale = 1 - 0.6 * e;
      turnTo(f.x1 - f.x0, f.y1 - f.y0, dt);
      if (k === 1 && !f.done) {
        f.done = true;
        later(300, win);
      }
      return;
    }
    let left = SPEED * dt;
    while (left > 0 && state.queue.length) {
      const j = state.queue[0];
      const tx = (j % m.cols) + 0.5;
      const ty = Math.floor(j / m.cols) + 0.5;
      const dx = tx - state.pos.x;
      const dy = ty - state.pos.y;
      const d = Math.hypot(dx, dy);
      if (d > 1e-6) turnTo(dx, dy, dt);
      if (d <= left) {
        state.pos.x = tx;
        state.pos.y = ty;
        left -= d;
        state.queue.shift();
        enter(j);
      } else {
        state.pos.x += (dx / d) * left;
        state.pos.y += (dy / d) * left;
        left = 0;
      }
    }
  }

  function enter(j) {
    const m = state.m;
    state.cell = j;
    state.seen.add(j);
    const s = state.stack;
    if (s.length > 1 && s[s.length - 2] === j) s.pop();
    else s.push(j);
    const k = m.exits.indexOf(j);
    if (k >= 0) arrive(k);
  }

  function arrive(k) {
    const m = state.m;
    state.queue = [];
    state.drag = null;
    state.busy = true;
    if (k === m.target) {
      sfx.snap();
      photoEls[k].classList.add('right');
      const b = m.photoBox[k];
      state.fly = {
        t0: performance.now(),
        x0: state.pos.x,
        y0: state.pos.y,
        x1: (b.x + b.P / 2 - m.x) / m.c,
        y1: (b.y + b.P / 2 - m.y) / m.c
      };
    } else {
      sfx.oops();
      state.missed = true;
      photoEls[k].classList.add('wrong');
      later(500, () => showFact(k));
    }
  }

  // fly towards cell j, if the way there is short
  function goToward(j) {
    const m = state.m;
    if (j < 0 || state.busy) return;
    const q = state.queue;
    const qi = q.indexOf(j);
    if (qi >= 0) {
      q.length = qi + 1;
      return;
    }
    const from = q.length ? q[q.length - 1] : state.cell;
    if (j === from) return;
    const way = route(m, from, j, REACH);
    if (!way) return;
    q.push(...way);
    state.moved = true;
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    LEVELS.forEach((lv, i) => {
      const b = document.createElement('button');
      b.className = 'level';
      b.innerHTML = `<span class="level-icon">${lv.icon}</span><span class="level-text"><b class="level-name"></b>` +
        '<span class="level-about"></span></span><span class="done-badge"></span>';
      b.addEventListener('click', () => {
        state.level = i;
        store.set('level', i);
        sfx.pick();
        updateMenu();
      });
      $('levels').appendChild(b);
    });
  }

  function updateMenu() {
    [...$('levels').children].forEach((b, i) => {
      const tx = t('levels')[i];
      b.classList.toggle('selected', i === state.level);
      b.querySelector('.level-name').textContent = `${i + 1}. ${tx.name}`;
      b.querySelector('.level-about').textContent = tx.about;
      b.querySelector('.done-badge').textContent = done.has(i) ? '🌟' : '';
    });
    updateFound();
  }

  // every picture, with how many times it has been found by its name
  const foundEls = [];
  function buildFound() {
    PHOTOS.forEach((p) => {
      const d = document.createElement('div');
      d.className = 'found-pic';
      d.innerHTML = '<img alt="" loading="lazy"><span class="found-name"></span><b class="found-n"></b>';
      d.querySelector('img').src = p.file;
      foundEls.push(d);
    });
  }

  // the most found first; the same count in the order of the list
  function updateFound() {
    const n = PHOTOS.map((p) => found[photoKey(p)] || 0);
    PHOTOS.forEach((p, i) => {
      const d = foundEls[i];
      d.classList.toggle('none', !n[i]);
      d.querySelector('.found-name').textContent = p.name[Astro.lang];
      d.querySelector('.found-n').textContent = '× ' + n[i];
    });
    const order = PHOTOS.map((p, i) => i).sort((a, b) => n[b] - n[a] || a - b);
    $('found').replaceChildren(...order.map((i) => foundEls[i]));
    $('clearBtn').classList.toggle('hidden', !n.some((k) => k));
    $('clearBtn').textContent = t('clear');
  }

  // asked first, in a box of the browser's own, so that a second tap on the
  // same spot does not clear them
  $('clearBtn').addEventListener('click', () => {
    if (!window.confirm(t('clearAsk'))) return;
    Object.keys(found).forEach((k) => delete found[k]);
    store.set('found', found);
    sfx.oops();
    updateFound();
  });

  function showMenu() {
    state.gen++;
    cancelAnimationFrame(raf);
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('fact').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    state.m = null;
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // A maze
  // ---------------------------------------------------------------------------

  // The picture to find, not one of the last few, and decoys of other kinds,
  // and of different kinds from each other when there are enough. Or, on the
  // level of look-alikes, decoys of the same kind: so the picture to find is a
  // nebula or a galaxy, the kinds with enough pictures.
  function makeSet() {
    const same = level().same;
    const ofKind = (k) => PHOTOS.filter((q) => q.kind === k);
    const target = shuffle(PHOTOS.filter((p) => !state.last.includes(p.file)
      && (!same || ofKind(p.kind).length > level().decoys)))[0];
    state.last = [target.file, ...state.last].slice(0, 10);
    const set = [target];
    if (same) return set.concat(shuffle(ofKind(target.kind).filter((q) => q !== target)).slice(0, level().decoys));
    for (let d = 0; d < level().decoys; d++) {
      let pool = PHOTOS.filter((q) => !set.some((s) => s.kind === q.kind));
      if (!pool.length) pool = PHOTOS.filter((q) => q.kind !== target.kind && !set.includes(q));
      set.push(pool[Math.floor(Math.random() * pool.length)]);
    }
    return set;
  }

  function startGame() {
    state.gen++;
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('fact').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    updateSound();
    showLevel();
    state.m = null;
    state.set = makeSet();
    // the task first, as it sets how much room is left for the maze
    showTask();
    const L = layout();
    state.L = L;
    newMaze();
    cancelAnimationFrame(raf);
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function newMaze() {
    const L = state.L;
    const [cols, rows] = gridSize(L);
    const set = state.set;
    const m = makeMaze(cols, rows, L.wide, set.length);
    m.target = Math.floor(Math.random() * set.length);
    m.photos = shuffle(set.slice(1));
    m.photos.splice(m.target, 0, set[0]);
    state.m = m;
    photoEls.forEach((el, k) => {
      if (m.photos[k]) el.src = m.photos[k].file;
      el.classList.remove('right', 'wrong');
    });
    state.cell = m.start;
    state.pos = { x: (m.start % cols) + 0.5, y: Math.floor(m.start / cols) + 0.5 };
    state.angle = -45;
    state.scale = 1;
    state.queue = [];
    state.stack = [m.start];
    state.seen = new Set([m.start]);
    state.fly = null;
    state.drag = null;
    state.busy = false;
    state.moved = false;
    state.missed = false;
    state.hintUntil = 0;
    state.start = performance.now();
    fit();
  }

  // the picture to find, or its name
  function showTask() {
    if (!state.set) return;
    const p = state.set[0];
    const match = level().match;
    $('task').classList.toggle('match', match);
    $('taskText').textContent = t(match ? 'flyMatch' : 'fly');
    $('targetName').textContent = match ? '' : p.name[Astro.lang];
    $('targetImg').classList.toggle('hidden', !match);
    if (match) $('targetImg').src = p.file;
  }

  // what a wrong picture shows
  function showFact(k) {
    const p = state.m.photos[k];
    $('factImg').src = p.file;
    $('factName').textContent = p.name[Astro.lang];
    $('factText').textContent = p.fact[Astro.lang];
    $('factNote').textContent = t(state.m.photos.length > 2 ? 'notThis2' : 'notThis');
    $('fact').classList.remove('hidden');
  }

  $('backBtn').addEventListener('click', () => {
    $('fact').classList.add('hidden');
    sfx.pick();
    state.busy = false;
  });

  // the right picture, big, with what it shows
  function win() {
    cancelAnimationFrame(raf);
    done.add(state.level);
    store.set('done', [...done]);
    const p = state.set[0];
    if (level().count && !state.missed) {
      const key = photoKey(p);
      found[key] = (found[key] || 0) + 1;
      store.set('found', found);
    }
    $('winImg').src = p.file;
    $('winName').textContent = p.name[Astro.lang];
    $('winFact').textContent = p.fact[Astro.lang];
    $('winCredit').textContent = '📷 ' + t('photo');
    $('winCredit').href = 'https://www.astrobin.com/' + p.astrobin + '/';
    $('nextLevelBtn').classList.toggle('hidden', state.level === LEVELS.length - 1);
    $('win').classList.remove('hidden');
    sfx.win();
    Astro.startConfetti($('confetti'));
  }

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------

  function cellAt(e) {
    const m = state.m;
    const r = field.getBoundingClientRect();
    const x = Math.floor((e.clientX - r.left - m.x) / m.c);
    const y = Math.floor((e.clientY - r.top - m.y) / m.c);
    if (x < 0 || y < 0 || x >= m.cols || y >= m.rows) return -1;
    return y * m.cols + x;
  }

  field.addEventListener('pointerdown', (e) => {
    if (!state.m || state.busy) return;
    e.preventDefault();
    try { field.setPointerCapture(e.pointerId); } catch (err) { /* not a real pointer */ }
    state.drag = e.pointerId;
    goToward(cellAt(e));
  });
  field.addEventListener('pointermove', (e) => {
    if (state.drag !== e.pointerId) return;
    goToward(cellAt(e));
  });
  const endDrag = (e) => {
    if (state.drag === e.pointerId) state.drag = null;
  };
  field.addEventListener('pointerup', endDrag);
  field.addEventListener('pointercancel', endDrag);

  const KEYS = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
  window.addEventListener('keydown', (e) => {
    if (!(e.key in KEYS) || !state.m || $('game').classList.contains('hidden')) return;
    e.preventDefault();
    if (state.busy || state.queue.length > 1) return;
    const m = state.m;
    const d = DIRS[KEYS[e.key]];
    const from = state.queue.length ? state.queue[0] : state.cell;
    if (m.open[from] & d.bit) goToward(from + d.dy * m.cols + d.dx);
  });

  // ---------------------------------------------------------------------------
  // Resizing
  // ---------------------------------------------------------------------------

  // the field, not the window: the task above it may change its height too,
  // e.g. when the font comes or the language changes
  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(onResize, 120);
  }).observe(field);

  // the same maze, bigger or smaller; a new one if the screen was turned
  function onResize() {
    if (!state.m || $('game').classList.contains('hidden')) return;
    const L = layout();
    if (L.W === state.L.W && L.H === state.L.H) return;
    if (L.wide !== state.m.wide && !state.busy) {
      state.L = L;
      newMaze();
      return;
    }
    // while a picture is shown, the same maze for now, turned the old way
    state.L = layout(state.m.wide);
    fit();
  }

  // ---------------------------------------------------------------------------
  // Buttons
  // ---------------------------------------------------------------------------

  $('playBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', startGame);
  $('nextLevelBtn').addEventListener('click', () => {
    state.level = Math.min(state.level + 1, LEVELS.length - 1);
    store.set('level', state.level);
    startGame();
  });
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);

  $('hintBtn').addEventListener('click', () => {
    if (!state.m || state.busy) return;
    state.hintUntil = performance.now() + 2500;
    state.moved = true;
    state.missed = true;
    sfx.pick();
  });

  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateSound();
    sfx.pick();
  });

  buildMenu();
  buildFound();
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    showTask();
    if (state.m) showLevel();
  });
})();
