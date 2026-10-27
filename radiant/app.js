'use strict';

(() => {
  const { $, rand, clamp, shuffle, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  const DEG = Math.PI / 180;
  const FLY = 0.35;       // s that a shooting star takes to draw its trail
  const ALONG = 8;        // degrees: a line nearer than this to the trail goes along it

  // Star figures as in tahtkujud/app.js: [RA, Dec (J2000, degrees),
  // magnitude, from]. Each star is joined to the one before it, or to star
  // index `from` when given (null: not joined); `extra` adds more lines.
  // `label` puts the name at that RA and Dec instead of in the middle of
  // the figure.
  const FIGURES = [
    {
      id: 'perseus',
      name: { et: 'Perseus', en: 'Perseus' },
      stars: [
        [42.67, 55.90, 3.8], [46.20, 53.51, 2.9], [51.08, 49.86, 1.8], [55.73, 47.79, 3.0], [59.46, 40.01, 2.9],
        [59.74, 35.79, 4.0], [58.53, 31.88, 2.9], [47.37, 44.86, 3.8, 2], [47.04, 40.96, 2.1], [46.29, 38.84, 3.4]
      ]
    },
    {
      id: 'cassiopeia',
      name: { et: 'Kassiopeia', en: 'Cassiopeia' },
      stars: [[2.29, 59.15, 2.3], [10.13, 56.54, 2.2], [14.18, 60.72, 2.2], [21.45, 60.24, 2.7], [28.60, 63.67, 3.4]]
    },
    {
      id: 'andromeda',
      name: { et: 'Andromeeda', en: 'Andromeda' },
      stars: [[2.10, 29.09, 2.1], [9.83, 30.86, 3.3], [17.43, 35.62, 2.1], [30.97, 42.33, 2.1], [14.19, 38.50, 3.9, 2], [12.45, 41.08, 4.5]]
    },
    {
      id: 'auriga',
      name: { et: 'Veomees', en: 'Auriga' },
      stars: [[79.17, 46.00, 0.1], [89.88, 44.95, 1.9], [89.93, 37.21, 2.6], [81.57, 28.61, 1.7], [74.25, 33.17, 2.7]],
      extra: [[4, 0]]
    },
    {
      id: 'taurus',
      name: { et: 'Sõnn', en: 'Taurus' },
      stars: [
        [84.41, 21.14, 3.0], [68.98, 16.51, 0.9], [64.95, 15.63, 3.7], [67.15, 19.18, 3.5], [81.57, 28.61, 1.7],
        [60.17, 12.49, 3.4, 2], [51.20, 9.03, 3.6], [63.88, 8.89, 4.3, 5], [56.87, 24.11, 2.9, null]
      ]
    },
    {
      id: 'orion',
      name: { et: 'Orion', en: 'Orion' },
      stars: [
        [88.79, 7.41, 0.5], [83.78, 9.93, 3.4], [81.28, 6.35, 1.6], [83.00, -0.30, 2.2], [84.05, -1.20, 1.7],
        [85.19, -1.94, 1.8], [86.94, -9.67, 2.1], [78.63, -8.20, 0.1, 3], [90.60, 9.65, 4.1, 0], [92.99, 14.21, 4.5],
        [72.46, 6.96, 3.2, 2], [73.72, 10.15, 4.6], [73.56, 2.44, 3.7, 10]
      ],
      extra: [[5, 0]]
    },
    {
      id: 'gemini',
      name: { et: 'Kaksikud', en: 'Gemini' },
      stars: [
        [113.65, 31.89, 1.6], [107.78, 30.25, 4.4], [100.98, 25.13, 3.0], [95.74, 22.51, 2.9], [93.72, 22.51, 3.3],
        [97.24, 20.21, 4.1, 2], [111.43, 27.80, 3.8, 1], [113.98, 26.90, 4.1], [116.33, 28.03, 1.1], [110.03, 21.98, 3.5, 7],
        [106.03, 20.57, 3.9], [99.43, 16.40, 1.9], [109.52, 16.54, 3.6, 9], [101.32, 12.90, 3.4]
      ]
    },
    {
      id: 'leo',
      name: { et: 'Lõvi', en: 'Leo' },
      stars: [
        [152.09, 11.97, 1.4], [151.83, 16.76, 3.5], [154.99, 19.84, 2.0], [154.17, 23.42, 3.4], [148.19, 26.01, 3.9],
        [146.46, 23.77, 3.0], [168.53, 20.52, 2.6, 2], [177.26, 14.57, 2.1], [168.56, 15.43, 3.3]
      ],
      extra: [[8, 0]]
    },
    {
      id: 'virgo',
      name: { et: 'Neitsi', en: 'Virgo' },
      stars: [
        [201.30, -11.16, 1.0], [197.49, -5.54, 4.4], [190.42, -1.45, 2.7], [193.90, 3.40, 3.4], [195.54, 10.96, 2.8],
        [184.98, -0.67, 3.9, 2], [177.67, 1.76, 3.6], [176.46, 6.53, 4.0], [181.30, 8.73, 4.1], [203.67, -0.60, 3.4, 2],
        [210.41, 1.54, 4.3], [221.56, 1.89, 3.7], [214.00, -6.00, 4.1, 9], [220.77, -5.66, 3.9]
      ],
      extra: [[8, 5]]
    },
    {
      id: 'bigdipper',
      name: { et: 'Suur Vanker', en: 'Big Dipper' },
      stars: [
        [165.93, 61.75, 1.8], [165.46, 56.38, 2.4], [178.46, 53.69, 2.4], [183.86, 57.03, 3.3], [193.51, 55.96, 1.8],
        [200.98, 54.93, 2.2], [206.89, 49.31, 1.9]
      ],
      extra: [[3, 0]]
    },
    {
      id: 'littledipper',
      name: { et: 'Väike Vanker', en: 'Little Dipper' },
      stars: [
        [37.95, 89.26, 2.0], [263.05, 86.59, 4.4], [251.49, 82.04, 4.2], [236.01, 77.79, 4.3], [222.68, 74.16, 2.1],
        [230.18, 71.83, 3.0], [244.38, 75.76, 5.0]
      ],
      extra: [[6, 3]]
    },
    {
      id: 'bootes',
      name: { et: 'Karjane', en: 'Boötes' },
      stars: [
        [213.92, 19.18, 0.0], [221.25, 27.07, 2.4], [228.88, 33.31, 3.5], [225.49, 40.39, 3.5], [218.02, 38.31, 3.0],
        [217.96, 30.37, 3.6], [208.67, 18.40, 2.7, 0]
      ],
      extra: [[5, 0]]
    },
    {
      id: 'corona',
      name: { et: 'Põhjakroon', en: 'Northern Crown' },
      stars: [[233.23, 31.36, 4.1], [231.96, 29.11, 3.7], [233.67, 26.71, 2.2], [235.69, 26.30, 3.8], [237.40, 26.07, 4.6], [239.40, 26.88, 4.1], [240.36, 29.85, 5.0]]
    },
    {
      id: 'hercules',
      name: { et: 'Herkules', en: 'Hercules' },
      stars: [
        [250.32, 31.60, 2.8], [250.72, 38.92, 3.5], [258.76, 36.81, 3.2], [255.07, 30.93, 3.9], [247.55, 21.49, 2.8, 0],
        [245.48, 19.15, 3.8], [258.76, 24.84, 3.1, 3], [258.66, 14.39, 3.1], [269.06, 37.25, 3.9, 2], [264.87, 46.01, 3.8],
        [248.53, 42.44, 4.2, 1], [244.94, 46.31, 3.9]
      ],
      extra: [[3, 0]]
    },
    {
      id: 'lyra',
      name: { et: 'Lüüra', en: 'Lyra' },
      stars: [[279.23, 38.78, 0.0], [281.08, 39.67, 4.7], [281.19, 37.61, 4.3], [283.63, 36.90, 4.3], [284.74, 32.69, 3.3], [282.52, 33.36, 3.5]],
      extra: [[2, 0], [5, 2]]
    },
    {
      id: 'draco',
      name: { et: 'Lohe', en: 'Draco' },
      label: [250, 63],
      stars: [
        [269.15, 51.49, 2.2], [262.61, 52.30, 2.8], [263.07, 55.17, 4.9], [268.38, 56.87, 3.8], [288.14, 67.66, 3.1],
        [297.04, 70.27, 3.8], [275.26, 72.73, 3.6], [257.20, 65.71, 3.2], [245.99, 61.51, 2.7], [240.47, 58.57, 4.0],
        [231.23, 58.97, 3.3], [211.10, 64.38, 3.7], [188.37, 69.79, 3.9], [172.85, 69.33, 3.8]
      ],
      extra: [[3, 0]]
    },
    {
      id: 'cygnus',
      name: { et: 'Luik', en: 'Cygnus' },
      stars: [
        [310.36, 45.28, 1.3], [305.56, 40.26, 2.2], [299.08, 35.08, 3.9], [292.68, 27.96, 3.1], [311.55, 33.97, 2.5, 1],
        [318.23, 30.23, 3.2], [296.24, 45.13, 2.9, 1], [292.43, 51.73, 3.8], [289.28, 53.37, 3.8]
      ]
    },
    {
      id: 'cepheus',
      name: { et: 'Kefeus', en: 'Cepheus' },
      stars: [[319.64, 62.59, 2.5], [322.16, 70.56, 3.2], [354.84, 77.63, 3.2], [342.42, 66.20, 3.5], [332.71, 58.20, 3.4], [337.29, 58.42, 4.1]],
      extra: [[4, 0], [3, 1]]
    },
    {
      id: 'pegasus',
      name: { et: 'Pegasus', en: 'Pegasus' },
      stars: [
        [2.10, 29.09, 2.1], [345.94, 28.08, 2.4], [346.19, 15.21, 2.5], [3.31, 15.18, 2.8], [340.37, 10.83, 3.4, 2],
        [332.55, 6.20, 3.5], [326.05, 9.88, 2.4], [340.75, 30.22, 2.9, 1], [332.50, 33.18, 4.3], [342.50, 24.60, 3.5, 1],
        [331.75, 25.35, 3.8], [326.16, 25.65, 4.1]
      ],
      extra: [[3, 0]]
    }
  ];

  // A constellation that is no longer on star maps: only its name, where it
  // was, between Boötes, Draco and the Big Dipper.
  const OLD = [{ id: 'quadrans', name: { et: 'Müürikvadrant', en: 'Mural Quadrant' }, at: [231, 53] }];

  // The levels, in the order of the menu. Each time the trails are new and
  // made up, flying out of the real radiants:
  //   strays: trails that belong to no shower
  //   fact: on the win screen
  //   showers: each with its radiant (RA and Dec, degrees, on the best
  //     night), how many trails it has, its name, the constellations to pick
  //     from (answer: the right ones), and the fact shown when it is named;
  //     alt: another fact for another right answer
  const PERSEIDS = {
    radiant: [48, 58],
    trails: 6,
    name: { et: 'perseiidid', en: 'Perseids' },
    answer: ['perseus'],
    options: ['perseus', 'andromeda', 'auriga', 'cepheus'],
    fact: {
      et: 'Perseus annab nime perseiididele. Neid näeb igal aastal 12. augusti paiku. Kivikesed jäid maha komeedist Swift-Tuttle.',
      en: 'Perseus gives its name to the Perseids. They come every year around 12 August. The little stones were left behind by the comet Swift–Tuttle.'
    }
  };
  const GEMINIDS = {
    radiant: [112, 33],
    trails: 7,
    name: { et: 'geminiidid', en: 'Geminids' },
    answer: ['gemini'],
    options: ['gemini', 'orion', 'auriga', 'taurus'],
    fact: {
      et: 'Kaksikud on ladina keeles Gemini, nii et need on geminiidid. Neid näeb igal aastal 14. detsembri paiku. Kivikesed on pärit asteroidilt Phaethon.',
      en: 'Gemini, the Twins, gives its name to the Geminids. They come every year around 14 December. The little stones come from the asteroid Phaethon.'
    }
  };
  const LEVELS = [
    {
      id: 'perseids',
      icon: '☀️',
      name: { et: 'August', en: 'August' },
      about: { et: 'Üks vool', en: 'One shower' },
      strays: 0,
      fact: {
        et: 'Langevad tähed lendavad tegelikult kõik rööbiti, ühes suunas. Ühest kohast tulevad nad ainult näiliselt, nagu pikad raudteerööpad, mis kaugel justkui kokku saavad.',
        en: 'Shooting stars really all fly side by side, in the same direction. They only seem to come from one spot, as long railway lines seem to meet far away.'
      },
      showers: [PERSEIDS]
    },
    {
      id: 'geminids',
      icon: '❄️',
      name: { et: 'Detsember', en: 'December' },
      about: { et: 'Üks vool', en: 'One shower' },
      strays: 0,
      fact: {
        et: 'Meteoorivool tuleb siis, kui Maa läbib komeedi või asteroidi maha jäetud kivikeste juga. Maa jõuab sinna igal aastal samal ajal, nii et ka vool tuleb igal aastal samal ajal.',
        en: 'A meteor shower comes when the Earth passes through a stream of little stones left behind by a comet or an asteroid. The Earth gets there at the same time every year, so the shower comes at the same time every year too.'
      },
      showers: [{ ...GEMINIDS }]
    },
    {
      id: 'leonids',
      icon: '🍂',
      name: { et: 'November', en: 'November' },
      about: { et: 'Mõni jälg ei sobi', en: 'Some trails don’t fit' },
      strays: 2,
      fact: {
        et: 'Kõik jäljed ei tulnud radiandist. Igal pimedal ööl lendab tunnis mõni juhuslik langev täht, mis ei kuulu ühtegi voolu.',
        en: 'Not every trail came from the radiant. On every dark night a few stray shooting stars an hour fly that belong to no shower.'
      },
      showers: [{
        radiant: [152, 22],
        trails: 7,
        name: { et: 'leoniidid', en: 'Leonids' },
        answer: ['leo'],
        options: ['leo', 'bigdipper', 'virgo', 'gemini'],
        fact: {
          et: 'Lõvi on ladina keeles Leo, nii et need on leoniidid. Neid näeb 17. novembri paiku. Mõnel aastal on tulnud tähesadu, kus lendas tuhandeid langevaid tähti tunnis, viimati umbes aastal 2000.',
          en: 'Leo, the Lion, gives its name to the Leonids. They come around 17 November. In some years they have brought a meteor storm with thousands of shooting stars an hour, last around the year 2000.'
        }
      }]
    },
    {
      id: 'draconids',
      icon: '🍁',
      name: { et: 'Oktoober', en: 'October' },
      about: { et: 'Mõni jälg ei sobi', en: 'Some trails don’t fit' },
      strays: 3,
      fact: {
        et: 'Radiant liigub koos tähtedega üle taeva. Mida kõrgemal ta on, seda rohkem langevaid tähti näeb. Seepärast on enamikku voolusid kõige parem vaadata pärast südaööd, drakoniide aga õhtul.',
        en: 'The radiant moves across the sky with the stars. The higher it is, the more shooting stars you see. That is why most showers are best after midnight, but the Draconids in the evening.'
      },
      showers: [{
        radiant: [262, 54],
        trails: 7,
        name: { et: 'drakoniidid', en: 'Draconids' },
        answer: ['draco'],
        options: ['draco', 'lyra', 'cygnus', 'littledipper'],
        fact: {
          et: 'Lohe on ladina keeles Draco, nii et need on drakoniidid. Neid näeb 8. oktoobri paiku, kõige paremini õhtul. Kivikesed jäid maha komeedist Giacobini-Zinner.',
          en: 'Draco, the Dragon, gives its name to the Draconids. They come around 8 October and are best seen in the evening. The little stones were left behind by the comet Giacobini–Zinner.'
        }
      }]
    },
    {
      id: 'quadrantids',
      icon: '⛄',
      name: { et: 'Jaanuar', en: 'January' },
      about: { et: 'Tähtkuju, mida enam pole', en: 'A constellation that is gone' },
      strays: 3,
      fact: {
        et: 'Taevas on 88 tähtkuju. Nende nimekiri lepiti kokku 1922. aastal ja Müürikvadrant jäi sealt välja. Kvadrantiidid kannavad tema nime edasi.',
        en: 'There are 88 constellations in the sky. Their list was agreed in 1922, and the Mural Quadrant was left out. The Quadrantids keep its name alive.'
      },
      showers: [{
        radiant: [230, 49],
        trails: 8,
        name: { et: 'kvadrantiidid', en: 'Quadrantids' },
        answer: ['quadrans', 'bootes'],
        options: ['quadrans', 'bootes', 'corona', 'bigdipper'],
        fact: {
          et: 'Müürikvadrant on ladina keeles Quadrans Muralis, nii et need on kvadrantiidid. Seda tähtkuju tänapäeva tähekaartidel enam pole: see koht on nüüd Karjase serval. Kvadrantiide näeb 3.–4. jaanuaril, aga ainult mõne tunni.',
          en: 'The Mural Quadrant, Quadrans Muralis in Latin, gives its name to the Quadrantids. This constellation is no longer on star maps: the spot is now at the edge of Boötes. The Quadrantids come on 3–4 January, but only for a few hours.'
        },
        alt: {
          bootes: {
            et: 'Õige, see koht on nüüd Karjase serval. Aga vool sai nime vana tähtkuju järgi, mis oli siin varem: Müürikvadrant ehk ladina keeles Quadrans Muralis. Nii et need on kvadrantiidid. Neid näeb 3.–4. jaanuaril, aga ainult mõne tunni.',
            en: 'Right, the spot is now at the edge of Boötes. But the shower is named after an old constellation that used to be here: the Mural Quadrant, Quadrans Muralis in Latin. So these are the Quadrantids. They come on 3–4 January, but only for a few hours.'
          }
        }
      }]
    },
    {
      id: 'two',
      icon: '✨',
      name: { et: 'Kaks voolu', en: 'Two showers' },
      about: { et: 'Detsember', en: 'December' },
      strays: 2,
      fact: {
        et: 'Ühel ööl võib lennata mitu voolu korraga. Mõnel detsembriööl lendavad nii geminiidid kui ka ursiidid. Iga vool tuleb oma radiandist, nii saavad astronoomid nad lahku.',
        en: 'Several showers can fly on the same night. On some nights in December there are both Geminids and Ursids. Each shower comes from its own radiant, which is how astronomers tell them apart.'
      },
      showers: [{ ...GEMINIDS, trails: 6 }, {
        radiant: [217, 76],
        trails: 5,
        name: { et: 'ursiidid', en: 'Ursids' },
        answer: ['littledipper'],
        options: ['littledipper', 'bigdipper', 'draco', 'cassiopeia'],
        fact: {
          et: 'Väike Vanker on osa Väikese Karu tähtkujust, mis on ladina keeles Ursa Minor, nii et need on ursiidid. Neid näeb 22. detsembri paiku. Kivikesed jäid maha komeedist Tuttle.',
          en: 'The Little Dipper is part of the Little Bear, Ursa Minor in Latin, which gives its name to the Ursids. They come around 22 December. The little stones were left behind by the comet Tuttle.'
        }
      }]
    }
  ];

  const TEXT = {
    et: {
      title: 'Uuri meteoore',
      intro1: 'Langevad tähed jätsid fotole jäljed. Joonista iga jälje heledast peast joon tagasi piki jälge ja leia koht, kust nad kõik tulevad. Seda kohta taevas nimetatakse radiandiks.',
      intro2: 'Tähtkuju, kus radiant on, annab meteoorivoolule nime.',
      chooseLevel: 'Vali tase',
      play: 'Mängi',
      captions: {
        start: ['Uuri meteoore!', 'Vajuta langeva tähe heledale peale ja lohista sõrm tagasi piki tema jälge.'],
        more: ['Joonista veel jooni', 'Joonista joon igale jäljele. Ühe voolu jäljed tulevad kõik samast kohast.'],
        where: ['Kus jooned kokku saavad?', 'Puuduta seda kohta taevas. Jooni võid veel parandada.'],
        traceFirst: ['Joonista enne kõik jooned', 'Igal jäljel peab olema joon, mis läheb piki jälge'],
        fromHead: ['Alusta heledast peast', 'Vajuta jälje heledale otsale ja lohista tagasi piki jälge'],
        dragBack: ['Nüüd lohista', 'Hoia sõrme all ja lohista tagasi piki jälge'],
        offTrail: ['Joon ei lähe piki jälge', 'Lohista joone otsas olevat täppi, et seda parandada'],
        miss: ['Siin jooned kokku ei saa', 'Vaata, kus jooned lõikuvad'],
        missStray: ['Siin jooned kokku ei saa', 'Kõik jäljed ei tule radiandist. Otsi kohta, kus kokku saab mitu joont.'],
        found: ['Leidsid radiandi! 🎯', 'Sealt paistavad tulevat kõik selle voolu langevad tähed'],
        second: ['Siin on veel üks vool!', 'Osa valgeid jälgi tuleb teisest kohast. Leia ka nende radiant.']
      },
      askTitle: 'Millises tähtkujus on radiant?',
      askTip: 'Vaata, milline tähtkuju on kollase rõnga juures.',
      askWrong: 'Vaata uuesti: milline tähtkuju on rõngale kõige lähemal?',
      strayNote: 'Hallid jäljed on juhuslikud langevad tähed, mis ei kuulu ühtegi voolu.',
      old: (name) => `${name} (vana)`,
      goOn: 'Edasi ▶',
      done: 'Valmis! 🎉',
      winTitle: 'Tubli!',
      and: ' ja ',
      nextLevel: 'Järgmine tase',
      again: 'Uued meteoorid',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      hint: 'Vihje',
      sound: 'Heli'
    },
    en: {
      title: 'Meteor Detective',
      intro1: 'The shooting stars left trails on the photo. Draw a line from the bright head of each trail back along it, and find the spot they all come from. That spot in the sky is called the radiant.',
      intro2: 'The constellation the radiant is in gives the meteor shower its name.',
      chooseLevel: 'Choose a level',
      play: 'Play',
      captions: {
        start: ['Be a meteor detective!', 'Press the bright head of a shooting star and drag back along its trail.'],
        more: ['Draw more lines', 'Draw a line on every trail. All the trails of one shower come from the same spot.'],
        where: ['Where do the lines meet?', 'Tap that spot in the sky. You can still fix the lines.'],
        traceFirst: ['Draw all the lines first', 'Every trail needs a line along it'],
        fromHead: ['Start at the bright head', 'Press the bright end of the trail and drag back along it'],
        dragBack: ['Now drag', 'Keep your finger down and drag back along the trail'],
        offTrail: ['The line is off the trail', 'Drag the dot at the end of the line to fix it'],
        miss: ['The lines don’t meet here', 'Look where the lines cross'],
        missStray: ['The lines don’t meet here', 'Not every trail comes from the radiant. Look for a spot where many lines meet.'],
        found: ['You found the radiant! 🎯', 'All the shooting stars of this shower seem to come from there'],
        second: ['There is one more shower!', 'Some of the white trails come from another spot. Find their radiant too.']
      },
      askTitle: 'Which constellation is the radiant in?',
      askTip: 'Look at which constellation is by the yellow ring.',
      askWrong: 'Look again: which constellation is closest to the ring?',
      strayNote: 'The grey trails are stray shooting stars that belong to no shower.',
      old: (name) => `${name} (old)`,
      goOn: 'Go on ▶',
      done: 'Done! 🎉',
      winTitle: 'Well done!',
      and: ' and ',
      nextLevel: 'Next level',
      again: 'New meteors',
      menu: 'Menu',
      allGames: 'All games',
      hint: 'Hint',
      sound: 'Sound'
    }
  };

  // ---------------------------------------------------------------------------
  // The sky
  // ---------------------------------------------------------------------------

  const vec = (ra, dec) => [Math.cos(dec * DEG) * Math.cos(ra * DEG), Math.cos(dec * DEG) * Math.sin(ra * DEG), Math.sin(dec * DEG)];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const norm = (p) => {
    const l = Math.hypot(p[0], p[1], p[2]);
    return [p[0] / l, p[1] / l, p[2] / l];
  };
  const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  // how far v is from the great circle through a and b, radians
  const offCircle = (v, a, b) => Math.asin(Math.abs(dot(v, norm(cross(a, b)))));
  // the place d (radians) away from v towards the direction t
  const along = (v, t, d) => norm(v.map((x, i) => x * Math.cos(d) + t[i] * Math.sin(d)));

  // east and north at a place on the sky
  function tangent(v) {
    const ra = Math.atan2(v[1], v[0]);
    const dec = Math.asin(clamp(v[2], -1, 1));
    return [
      [-Math.sin(ra), Math.cos(ra), 0],
      [-Math.sin(dec) * Math.cos(ra), -Math.sin(dec) * Math.sin(ra), Math.cos(dec)]
    ];
  }
  // the direction from v at a position angle th (from north through east)
  function towards(v, th) {
    const [e, n] = tangent(v);
    return n.map((x, i) => x * Math.cos(th) + e[i] * Math.sin(th));
  }

  // The gnomonic projection around the middle of the view, drawn as on a
  // sky chart with north up and east to the left. It turns every great
  // circle into a straight line, so the trails of a shower, which fly along
  // great circles from the radiant, point exactly at it. Pixels, or null
  // for what is too far round.
  function toScreen(L, v) {
    const d = dot(v, L.c);
    if (d < 0.15) return null;
    return [L.cx - (dot(v, L.e) / d) * L.s, L.cy - (dot(v, L.n) / d) * L.s];
  }
  function fromScreen(L, x, y) {
    const xi = (L.cx - x) / L.s;
    const eta = (L.cy - y) / L.s;
    return norm(L.c.map((q, i) => q + xi * L.e[i] + eta * L.n[i]));
  }

  // the largest scale that keeps v inside a box, at most s
  function fit(L, v, x0, x1, y0, y1, s) {
    const d = dot(v, L.c);
    if (d <= 0.15) return s;
    const xi = dot(v, L.e) / d;
    const eta = dot(v, L.n) / d;
    if (xi > 0) s = Math.min(s, (L.cx - x0) / xi);
    if (xi < 0) s = Math.min(s, (x1 - L.cx) / -xi);
    if (eta > 0) s = Math.min(s, (L.cy - y0) / eta);
    if (eta < 0) s = Math.min(s, (y1 - L.cy) / -eta);
    return s;
  }

  // A fixed random sequence, so that the faint stars are the same every time.
  function seeded(seed) {
    let s = seed;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  // faint stars all over the sky
  const FIELD = (() => {
    const r = seeded(17);
    return Array.from({ length: 3200 }, () => {
      const v = vec(r() * 360, Math.asin(r() * 2 - 1) / DEG);
      return { v, r: 0.35 + r() * r() * 1.1, a: 0.25 + r() * 0.55 };
    });
  })();

  FIGURES.forEach((f) => {
    f.v = f.stars.map(([ra, dec]) => vec(ra, dec));
    f.pairs = [];
    f.stars.forEach((s, i) => {
      const from = s.length > 3 ? s[3] : i - 1;
      if (i > 0 && from !== null) f.pairs.push([from, i]);
    });
    (f.extra || []).forEach((p) => f.pairs.push(p));
    if (f.label) f.labelV = vec(...f.label);
  });
  OLD.forEach((o) => { o.v = vec(...o.at); });

  const figName = (id) => (FIGURES.find((f) => f.id === id) || OLD.find((o) => o.id === id)).name[Astro.lang];
  const cap = (s) => s[0].toUpperCase() + s.slice(1);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('radiant.');
  const done = new Set((store.get('done', []) || []).filter((id) => LEVELS.some((l) => l.id === id)));
  const state = {
    level: clamp(Number(store.get('level', 0)) || 0, 0, LEVELS.length - 1),
    c: null,           // the middle of the view, as a vector
    showers: [],       // the level's showers, with R (the radiant) and found, named
    trails: [],        // { a, b, shower (-1 for a stray), at, w, bright, end, ok }:
                       // a from where it began to its head b, and the line
                       // drawn back from the head to end, ok when along it
    phase: 'trace',    // 'trace', 'wait', 'ask' or 'over'
    t: 0,
    misses: 0,         // taps beside the radiant in a row
    missRings: [],     // { v, t } where they were
    hint: null,        // { v, r, k }: a ring round the radiant, from 💡
    hintN: 0,
    flash: null,       // { id, until }: the right figure lit up by 💡
    hand: null,        // the trail the hand points at
    drag: null,        // { tr, end, ok, moved }: the line being drawn, and as it was
    pulse: null,       // { tr, until }: its head ringed, after a press beside it
    ask: null,         // { k, wrong, done, picked }
    pan: [0, 0],       // px the picture is slid by, so that the question
    panTo: [0, 0],     // does not hide the constellation, and where to
    caption: null,
    allFound: false,
    L: null,
    raf: 0,
    last: 0,
    gen: 0
  };
  const levelNow = () => LEVELS[state.level];
  const t = (key) => TEXT[Astro.lang][key];

  const area = $('area');
  const cv = $('sky');
  const ctx = cv.getContext('2d');

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

  function showerNames(lv) {
    return cap(lv.showers.map((s) => s.name[Astro.lang]).join(t('and')));
  }

  function updateMenu() {
    [...$('levels').children].forEach((b, i) => {
      const lv = LEVELS[i];
      b.classList.toggle('selected', i === state.level);
      b.querySelector('.level-name').textContent = `${i + 1}. ${lv.name[Astro.lang]}`;
      // once solved, the level tells which shower it is
      b.querySelector('.level-about').textContent = done.has(lv.id) ? showerNames(lv) : lv.about[Astro.lang];
      b.querySelector('.done-badge').textContent = done.has(lv.id) ? '🌟' : '';
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
    $('ask').classList.add('hidden');
    const lv = levelNow();
    Object.assign(state, {
      showers: lv.showers.map((s) => ({ ...s, R: vec(...s.radiant), found: false, named: false })),
      trails: [], phase: 'trace', t: 0, misses: 0, missRings: [], hint: null, hintN: 0,
      flash: null, hand: null, drag: null, pulse: null, ask: null, allFound: false, pan: [0, 0], panTo: [0, 0]
    });
    // the middle of the view: near the radiant, but not on it, or between
    // the two radiants
    const mid = norm(state.showers.reduce((a, s) => a.map((x, i) => x + s.R[i]), [0, 0, 0]));
    const off = (state.showers.length > 1 ? rand(0, 3) : rand(4, 10)) * DEG;
    state.c = along(mid, towards(mid, rand(0, 2 * Math.PI)), off);
    layout();
    makeTrails();
    layout();
    hideHand();
    showCaption('start');
    updateBar();
    state.last = performance.now();
    state.raf = requestAnimationFrame(frame);
  }

  // whether the question goes at the right instead of at the bottom, as in
  // style.css
  const sideAsk = () => window.matchMedia('(min-aspect-ratio: 5/4) and (min-width: 560px)').matches;

  // The pixels for one radian in the middle of the view: about 64 degrees
  // across the shorter side, and at most 100 across the longer one.
  const viewScale = (W, H) => Math.max(Math.min(W, H) / (2 * Math.tan(32 * DEG)), Math.max(W, H) / (2 * Math.tan(50 * DEG)));

  // East and north in the view. The sky is drawn north up, except that
  // with two radiants the photo is turned so that they lie along the
  // longer side of the box (wide: true when it is wider than tall).
  function turned(wide) {
    const [e, n] = tangent(state.c);
    if (state.showers.length < 2) return { e, n };
    const D = state.showers[1].R.map((x, i) => x - state.showers[0].R[i]);
    let a = Math.atan2(dot(D, n), dot(D, e)) - (wide ? 0 : Math.PI / 2);
    // as near to north up as can be
    a = Math.atan2(Math.sin(a), Math.cos(a));
    if (a > Math.PI / 2) a -= Math.PI;
    if (a <= -Math.PI / 2) a += Math.PI;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    return { e: e.map((x, i) => x * ca + n[i] * sa), n: n.map((x, i) => x * ca - e[i] * sa) };
  }

  // Sizes in pixels. The radiants are kept out from under the caption and
  // the question, and the whole sky fits.
  function layout() {
    const W = area.clientWidth;
    const H = area.clientHeight;
    if (!W || !H) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const u = Math.min(W, H);
    const top = Math.min(84, H * 0.25);
    const box = sideAsk()
      ? { x0: W * 0.1, x1: Math.max(W * 0.3, W - 350), y0: top, y1: H - 24 }
      : { x0: W * 0.16, x1: W * 0.84, y0: top, y1: Math.max(top + 60, H - clamp(H * 0.42, 200, 300)) };
    const cx = (box.x0 + box.x1) / 2;
    const cy = (box.y0 + box.y1) / 2;
    const L = { W, H, u, dpr, box, cx, cy, c: state.c, ...turned(box.x1 - box.x0 >= box.y1 - box.y0) };
    let s = viewScale(W, H);
    for (const sh of state.showers) s = fit(L, sh.R, box.x0, box.x1, box.y0, box.y1, s);
    for (const tr of state.trails) {
      s = fit(L, tr.a, 10, W - 10, 10, H - 10, s);
      s = fit(L, tr.b, 10, W - 10, 10, H - 10, s);
    }
    L.s = s;
    // slid while the question is open (see aim)
    L.cx0 = cx;
    L.cy0 = cy;
    L.cx = cx + state.pan[0];
    L.cy = cy + state.pan[1];
    L.cap = captionBox();
    L.hitR = Math.max(24, u * 0.045);       // how near a tap must be to a trail
    L.tol = Math.max(34, u * 0.075);        // and to the radiant
    L.ring = Math.max(16, u * 0.035);
    state.L = L;
    L.sky = paintSky(L);
    aim();
  }

  // Where the picture slides to while the question is open: just far
  // enough that the question does not hide the name of the right
  // constellation, but not so far that the radiant goes off the top.
  function aim() {
    const L = state.L;
    const a = state.ask;
    state.panTo = [0, 0];
    if (!L || !a || $('ask').classList.contains('hidden')) return;
    const sh = state.showers[a.k];
    const id = sh.answer[0];
    const f = FIGURES.find((q) => q.id === id);
    const o = OLD.find((q) => q.id === id);
    const at = f ? labelAt(L, f, f.v.map((v) => toScreen(L, v))) : o && toScreen(L, o.v);
    const R = toScreen(L, sh.R);
    if (!at || !R) return;
    const size = Math.round(clamp(L.u * 0.032, 12, 16));
    ctx.font = `800 ${size}px Nunito, sans-serif`;
    const w = ctx.measureText(figName(id)).width / 2;
    // where they are with the picture not slid
    const [px, py] = state.pan;
    const ask = $('ask');
    if (sideAsk()) {
      const dx = Math.min(0, ask.offsetLeft - 12 - w - (at[0] - px));
      state.panTo = [Math.max(dx, L.ring + 12 - (R[0] - px)), 0];
    } else {
      const dy = Math.min(0, ask.offsetTop - 10 - size / 2 - (at[1] - py));
      state.panTo = [0, Math.max(dy, L.ring + 12 - (R[1] - py))];
    }
  }

  // the picture slides a little at a time towards where aim says
  function slide(dt) {
    const L = state.L;
    const [px, py] = state.pan;
    const [tx, ty] = state.panTo;
    if (!L || (px === tx && py === ty)) return;
    const q = Math.min(1, dt * 7);
    state.pan = Math.hypot(tx - px, ty - py) < 0.5 ? [tx, ty] : [px + (tx - px) * q, py + (ty - py) * q];
    L.cx = L.cx0 + state.pan[0];
    L.cy = L.cy0 + state.pan[1];
    L.sky = paintSky(L);
  }

  // where the caption is at its tallest, so that no trail is put under it
  function captionBox() {
    const c = $('caption');
    const hidden = c.classList.contains('hidden');
    const was = [$('capTitle').textContent, $('capText').textContent];
    c.classList.remove('hidden');
    let h = 0;
    for (const [b, x] of Object.values(t('captions'))) {
      $('capTitle').textContent = b;
      $('capText').textContent = x;
      h = Math.max(h, c.offsetHeight);
    }
    // all across, if it cannot be measured
    const box = c.offsetWidth
      ? { x0: c.offsetLeft, x1: c.offsetLeft + c.offsetWidth, y1: c.offsetTop + h + 10 }
      : { x0: -1, x1: area.clientWidth + 1, y1: c.offsetTop + h + 10 };
    [$('capTitle').textContent, $('capText').textContent] = was;
    c.classList.toggle('hidden', hidden);
    return box;
  }

  // distance from P to the line through A and B
  function lineDist(P, A, B) {
    const dx = B[0] - A[0];
    const dy = B[1] - A[1];
    return Math.abs((P[0] - A[0]) * dy - (P[1] - A[1]) * dx) / Math.hypot(dx, dy);
  }
  // and to the segment from A to B
  function segDist(P, A, B) {
    const dx = B[0] - A[0];
    const dy = B[1] - A[1];
    const q = clamp(((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / (dx * dx + dy * dy), 0, 1);
    return Math.hypot(P[0] - A[0] - q * dx, P[1] - A[1] - q * dy);
  }

  // The trails of each shower fly out of its radiant all round, nearer
  // ones shorter, as they are seen more end on. Strays fly any way, but
  // never through a radiant.
  function makeTrails() {
    const L = state.L;
    const m = 14;
    const onScreen = (p) => p && p[0] > m && p[0] < L.W - m && p[1] > m && p[1] < L.H - m;
    // whether any of the trail from A to B is under the caption
    const underCap = (A, B) => Array.from({ length: 9 }, (_, i) => i / 8).some((q) => {
      const x = A[0] + (B[0] - A[0]) * q;
      const y = A[1] + (B[1] - A[1]) * q;
      return y < L.cap.y1 && x > L.cap.x0 && x < L.cap.x1;
    });
    const minLen = Math.max(36, L.u * 0.08);
    const rads = state.showers.map((s) => toScreen(L, s.R));
    const out = [];
    const mids = [];
    const crowded = (A, B) => {
      const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
      return mids.some((q) => Math.hypot(q[0] - M[0], q[1] - M[1]) < L.u * 0.13);
    };
    const add = (A, B, shower, a, b) => {
      mids.push([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]);
      out.push({ a, b, shower, w: rand(1.6, 2.8), bright: rand(0.7, 1), end: null, ok: false });
    };
    state.showers.forEach((sh, k) => {
      const base = rand(0, 2 * Math.PI);
      for (let i = 0; i < sh.trails; i++) {
        for (let tries = 0; tries < 300; tries++) {
          // spread all round, unless that side is off the view; and nearer
          // the radiant, if farther ones don't fit
          const th = tries < 40 ? base + ((i + rand(0.15, 0.85)) * 2 * Math.PI) / sh.trails : rand(0, 2 * Math.PI);
          const dir = towards(sh.R, th);
          const d = rand(9, Math.max(16, 50 - tries * 0.4)) * DEG;
          // The farther from the radiant, the longer, as the nearer ones
          // come more towards us and are seen more end on: from just long
          // enough to tap, 9 degrees away, to over three times that, 50 away.
          const far = (Math.sin(d) - Math.sin(9 * DEG)) / (Math.sin(50 * DEG) - Math.sin(9 * DEG));
          const len = (minLen / L.s) * (1.1 + 2.3 * far) * rand(0.9, 1.1);
          const a = along(sh.R, dir, d);
          const b = along(sh.R, dir, d + len);
          const A = toScreen(L, a);
          const B = toScreen(L, b);
          if (!onScreen(A) || !onScreen(B)) continue;
          if (Math.hypot(B[0] - A[0], B[1] - A[1]) < minLen || crowded(A, B) || underCap(A, B)) continue;
          if (state.showers.some((o, j) => j !== k && offCircle(o.R, a, b) < 7 * DEG)) continue;
          add(A, B, k, a, b);
          break;
        }
      }
    });
    for (let i = 0; i < levelNow().strays; i++) {
      for (let tries = 0; tries < 80; tries++) {
        const A = [rand(m, L.W - m), rand(m, L.H - m)];
        const ang = rand(0, 2 * Math.PI);
        const len = rand(0.1, 0.18) * L.u;
        const B = [A[0] + len * Math.cos(ang), A[1] + len * Math.sin(ang)];
        if (!onScreen(B) || crowded(A, B) || underCap(A, B)) continue;
        const a = fromScreen(L, ...A);
        const b = fromScreen(L, ...B);
        if (rads.some((P) => lineDist(P, A, B) < L.u * 0.14) || state.showers.some((o) => offCircle(o.R, a, b) < 8 * DEG)) continue;
        add(A, B, -1, a, b);
        break;
      }
    }
    // they flash one after another, as if the camera was open all night
    shuffle(out).forEach((tr, i) => { tr.at = 0.8 + i * 0.5; });
    state.trails = out;
  }

  // ---------------------------------------------------------------------------
  // Drawing
  // ---------------------------------------------------------------------------

  function dot2(g, x, y, r, color) {
    g.fillStyle = color;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }

  // the dark sky, the stars and the figures with their names, drawn once
  function paintSky(L) {
    const c = document.createElement('canvas');
    c.width = Math.round(L.W * L.dpr);
    c.height = Math.round(L.H * L.dpr);
    const g = c.getContext('2d');
    g.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    drawSky(g, L);
    return c;
  }

  function drawSky(g, L) {
    const grad = g.createLinearGradient(0, 0, 0, L.H);
    grad.addColorStop(0, '#040820');
    grad.addColorStop(1, '#0d1846');
    g.fillStyle = grad;
    g.fillRect(0, 0, L.W, L.H);
    for (const s of FIELD) {
      const p = toScreen(L, s.v);
      if (!p || p[0] < -2 || p[0] > L.W + 2 || p[1] < -2 || p[1] > L.H + 2) continue;
      dot2(g, p[0], p[1], s.r, `rgba(255,255,255,${s.a.toFixed(2)})`);
    }
    const k = clamp(L.u / 600, 0.8, 1.3);
    const size = Math.round(clamp(L.u * 0.032, L.small ? 8 : 12, 16));
    g.font = `800 ${size}px Nunito, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    for (const f of FIGURES) {
      const p = f.v.map((v) => toScreen(L, v));
      drawLines(g, f, p, 'rgba(150, 180, 255, 0.3)', 1.2);
      f.stars.forEach(([, , mag], i) => {
        if (!p[i]) return;
        const r = (0.8 + (4.2 - mag) * 0.7) * k;
        dot2(g, p[i][0], p[i][1], r * 2.4, 'rgba(255, 255, 255, 0.12)');
        dot2(g, p[i][0], p[i][1], r, '#fff');
      });
      const at = labelAt(L, f, p);
      if (at) label(g, f.name[Astro.lang], at[0], at[1], 'rgba(200, 220, 255, 0.75)', L);
    }
    g.font = `italic 700 ${size}px Nunito, sans-serif`;
    for (const o of OLD) {
      const p = toScreen(L, o.v);
      if (p) label(g, t('old')(o.name[Astro.lang]), p[0], p[1], 'rgba(190, 195, 215, 0.6)', L);
    }
  }

  function drawLines(g, f, p, color, w) {
    g.strokeStyle = color;
    g.lineWidth = w;
    g.lineJoin = 'round';
    g.lineCap = 'round';
    g.beginPath();
    for (const [i, j] of f.pairs) {
      if (!p[i] || !p[j]) continue;
      g.moveTo(...p[i]);
      g.lineTo(...p[j]);
    }
    g.stroke();
  }

  // the name in the middle of the figure, or where it says
  function labelAt(L, f, p) {
    let at = null;
    if (f.labelV) at = toScreen(L, f.labelV);
    else {
      const q = p.filter(Boolean);
      if (q.length < f.stars.length / 2) return null;
      const xs = q.map((s) => s[0]);
      const ys = q.map((s) => s[1]);
      at = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
    }
    return at;
  }

  // a name, unless it would be cut off by the edge of L
  function label(g, text, x, y, color, L) {
    const w = g.measureText(text).width / 2;
    if (L && (x - w < 2 || x + w > L.W - 2 || y < 10 || y > L.H - 10)) return;
    g.lineWidth = 4;
    g.strokeStyle = 'rgba(4, 8, 32, 0.8)';
    g.strokeText(text, x, y);
    g.fillStyle = color;
    g.fillText(text, x, y);
  }

  // how far from A along (dx, dy) to the edge of the view
  function toEdge(L, A, dx, dy) {
    let k = Infinity;
    if (dx > 0) k = Math.min(k, (L.W - A[0]) / dx);
    if (dx < 0) k = Math.min(k, -A[0] / dx);
    if (dy > 0) k = Math.min(k, (L.H - A[1]) / dy);
    if (dy < 0) k = Math.min(k, -A[1] / dy);
    return Math.max(0, k);
  }

  // where a trail is on the screen: A where it began, B its head, and
  // (dx, dy) the way back from the head along it
  function ends(L, tr) {
    const A = toScreen(L, tr.a);
    const B = toScreen(L, tr.b);
    if (!A || !B) return null;
    const l = Math.hypot(A[0] - B[0], A[1] - B[1]);
    return { A, B, dx: (A[0] - B[0]) / l, dy: (A[1] - B[1]) / l };
  }

  const found = (tr) => tr.shower >= 0 && state.showers[tr.shower].found;

  // The line drawn back from a trail's head: solid to the dot at its end,
  // which can be dragged to fix it, then dashed to the edge of the view.
  // Blue along the trail and orange off it, and gold from the radiant once
  // that is found.
  function drawBack(g, L, tr, dots) {
    const k = ends(L, tr);
    if (!k) return;
    if (found(tr)) {
      const R = toScreen(L, state.showers[tr.shower].R);
      if (!R) return;
      g.setLineDash([]);
      g.strokeStyle = 'rgba(255, 211, 77, 0.45)';
      g.lineWidth = 1.5;
      g.beginPath();
      g.moveTo(...R);
      g.lineTo(...k.A);
      g.stroke();
      return;
    }
    const E = tr.end && toScreen(L, tr.end);
    if (!E) return;
    const l = Math.hypot(E[0] - k.B[0], E[1] - k.B[1]);
    if (l < 1) return;
    const ux = (E[0] - k.B[0]) / l;
    const uy = (E[1] - k.B[1]) / l;
    const edge = toEdge(L, E, ux, uy);
    const color = tr.ok ? '160, 205, 255' : '255, 160, 90';
    g.lineCap = 'round';
    g.strokeStyle = `rgba(${color}, 0.6)`;
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(...k.B);
    g.lineTo(...E);
    g.stroke();
    g.setLineDash([7, 6]);
    g.strokeStyle = `rgba(${color}, 0.6)`;
    g.lineWidth = 1.6;
    g.beginPath();
    g.moveTo(...E);
    g.lineTo(E[0] + ux * edge, E[1] + uy * edge);
    g.stroke();
    g.setLineDash([]);
    if (dots) {
      dot2(g, E[0], E[1], 7, `rgba(${color}, 0.95)`);
      dot2(g, E[0], E[1], 2.5, '#fff');
    }
  }

  // A trail, as on a photo: a thin streak, faint where the shooting star
  // began and slowly growing wider and brighter, brightest just before its
  // head, where it burnt out and the streak narrows quickly to a point. It
  // has a bluish glow, and is drawn from its start to its head while it
  // flies (age from 0 to FLY s).
  function drawTrail(g, L, tr, age) {
    if (age < 0) return;
    const k = ends(L, tr);
    if (!k) return;
    const p = clamp(age / FLY, 0.02, 1);
    const gold = found(tr);
    const grey = tr.shower < 0 && state.allFound;
    const core = gold ? '255, 225, 130' : grey ? '160, 170, 195' : '245, 250, 255';
    const halo = gold ? '255, 200, 60' : grey ? '130, 140, 170' : '150, 190, 255';
    const a = tr.bright;
    const H = [k.A[0] + (k.B[0] - k.A[0]) * p, k.A[1] + (k.B[1] - k.A[1]) * p];
    const len = Math.hypot(H[0] - k.A[0], H[1] - k.A[1]) || 1;
    const ux = (H[0] - k.A[0]) / len;
    const uy = (H[1] - k.A[1]) / len;
    // the streak with half widths along it, as [how far along, half width]
    const streak = (wide) => {
      const pts = [[0, 0.1], [0.3, 0.35], [0.75, 0.75], [0.92, 1], [0.98, 0.7], [1, 0.3]].map(([q, h]) => [q, h * tr.w * 0.6 * wide]);
      const at = (q, h, side) => [k.A[0] + (H[0] - k.A[0]) * q - uy * h * side, k.A[1] + (H[1] - k.A[1]) * q + ux * h * side];
      g.beginPath();
      for (const [q, h] of pts) g.lineTo(...at(q, h, 1));
      for (const [q, h] of pts.reverse()) g.lineTo(...at(q, h, -1));
      g.closePath();
      g.fill();
    };
    const grad = g.createLinearGradient(...k.A, ...H);
    grad.addColorStop(0, `rgba(${core}, ${(0.05 * a).toFixed(2)})`);
    grad.addColorStop(0.4, `rgba(${core}, ${(0.45 * a).toFixed(2)})`);
    grad.addColorStop(0.85, `rgba(${core}, ${a.toFixed(2)})`);
    grad.addColorStop(1, p < 1 ? '#fff' : `rgba(${core}, ${a.toFixed(2)})`);
    g.fillStyle = grad;
    // the glow is a soft shadow, as bright as the streak is at each place
    g.shadowColor = `rgba(${halo}, 0.9)`;
    g.shadowBlur = tr.w * 3 * (window.devicePixelRatio || 1);
    streak(1);
    g.shadowColor = 'transparent';
    g.shadowBlur = 0;
  }

  // the radiant found: a yellow ring, with the shower's name under it once
  // it is named
  function drawRadiant(g, L, sh, pulse) {
    const R = toScreen(L, sh.R);
    if (!R) return;
    g.strokeStyle = '#ffd34d';
    g.lineWidth = 3;
    g.beginPath();
    g.arc(R[0], R[1], L.ring * (1 + 0.12 * pulse), 0, Math.PI * 2);
    g.stroke();
    if (sh.named) {
      const size = Math.round(clamp(L.u * 0.038, L.small ? 10 : 14, 19));
      g.font = `900 ${size}px Nunito, sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      label(g, cap(sh.name[Astro.lang]), R[0], R[1] + L.ring + size * 0.8, '#ffd34d');
    }
  }

  function draw() {
    const L = state.L;
    if (!L) return;
    const T = state.t;
    ctx.clearRect(0, 0, L.W, L.H);
    ctx.drawImage(L.sky, 0, 0, L.W, L.H);
    // 💡 in the question: the right figure lights up for a moment
    if (state.flash && T < state.flash.until) {
      const f = FIGURES.find((q) => q.id === state.flash.id);
      const a = 0.5 + 0.4 * Math.sin(T * 8);
      if (f) drawLines(ctx, f, f.v.map((v) => toScreen(L, v)), `rgba(255, 211, 77, ${a.toFixed(2)})`, 3);
      const o = OLD.find((q) => q.id === state.flash.id);
      const p = o && toScreen(L, o.v);
      if (p) {
        ctx.strokeStyle = `rgba(255, 211, 77, ${a.toFixed(2)})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(p[0], p[1], L.u * 0.12, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    // 💡 while searching: a ring round the part of the sky with the radiant,
    // only while every trail has its line
    if (state.hint && allTraced()) {
      const P = toScreen(L, state.hint.v);
      if (P) {
        ctx.setLineDash([8, 7]);
        ctx.strokeStyle = `rgba(255, 211, 77, ${(0.55 + 0.3 * Math.sin(T * 4)).toFixed(2)})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(P[0], P[1], state.hint.r * L.u, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    for (const tr of state.trails) drawBack(ctx, L, tr, true);
    for (const tr of state.trails) drawTrail(ctx, L, tr, T - tr.at);
    // a press on a trail, not on its head: the head is ringed
    const pu = state.pulse;
    const pk = pu && T < pu.until && ends(L, pu.tr);
    if (pk) {
      ctx.strokeStyle = `rgba(255, 211, 77, ${(0.6 + 0.35 * Math.sin(T * 10)).toFixed(2)})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(pk.B[0], pk.B[1], L.hitR * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }
    state.showers.forEach((sh) => {
      if (sh.found) drawRadiant(ctx, L, sh, Math.max(0, 1 - (T - sh.foundT) / 0.6) + 0.5 * Math.sin(T * 3) * 0.3);
    });
    // a red ring that fades where a tap missed the radiant
    for (const m of state.missRings) {
      const P = toScreen(L, m.v);
      const a = 1 - (T - m.t) / 0.9;
      if (!P || a <= 0) continue;
      ctx.strokeStyle = `rgba(255, 110, 110, ${a.toFixed(2)})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(P[0], P[1], L.ring * (1.4 - 0.4 * a), 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // ---------------------------------------------------------------------------
  // Playing
  // ---------------------------------------------------------------------------

  function frame(now) {
    const dt = Math.min(0.05, (now - state.last) / 1000);
    state.last = now;
    state.t += dt;
    state.missRings = state.missRings.filter((m) => state.t - m.t < 0.9);
    slide(dt);
    placeHand();
    draw();
    state.raf = requestAnimationFrame(frame);
  }

  // the trails with a line drawn back along them
  const traced = () => state.trails.filter((tr) => tr.ok).length;
  // the radiants can be tapped only once every trail has its line
  const allTraced = () => state.trails.length > 0 && state.trails.every((tr) => tr.ok);
  const seen = (tr) => state.t - tr.at > FLY;
  // the next trail to draw a line on, one with a wrong line first
  const nextTrail = () => {
    const open = state.trails.filter((tr) => !tr.ok && !found(tr) && seen(tr));
    return open.find((tr) => tr.end) || open[0];
  };

  // What a press is on: the head of a trail or the dot at the end of its
  // line, whichever is nearer, or else the trail itself.
  function pickAt(x, y) {
    const L = state.L;
    let best = null;
    let bd = L.hitR;
    for (const tr of state.trails) {
      if (found(tr) || !seen(tr)) continue;
      const k = ends(L, tr);
      if (!k) continue;
      const E = tr.end && toScreen(L, tr.end);
      for (const [kind, P] of [['head', k.B], ['dot', E]]) {
        const d = P ? Math.hypot(P[0] - x, P[1] - y) : Infinity;
        if (d < bd) [best, bd] = [{ tr, kind }, d];
      }
    }
    if (best) return best;
    for (const tr of state.trails) {
      const k = !found(tr) && seen(tr) && ends(L, tr);
      if (k && segDist([x, y], k.A, k.B) < L.hitR * 0.8) return { tr, kind: 'trail' };
    }
    return null;
  }

  // whether a line from the head to P goes back along the trail
  function followsTrail(k, P) {
    const l = Math.hypot(P[0] - k.B[0], P[1] - k.B[1]);
    return ((P[0] - k.B[0]) * k.dx + (P[1] - k.B[1]) * k.dy) / l > Math.cos(ALONG * DEG);
  }

  // The finger is lifted: the line stays where it is, blue if it goes
  // along the trail, and orange if it is off and needs fixing.
  function drawn(d) {
    const tr = d.tr;
    if (!d.moved) {
      // only a tap: nothing changes, and a tap on the dot of a good line
      // is a guess, as the dots may lie on the radiant
      tr.end = d.end;
      tr.ok = d.ok;
      if (tr.end && tr.ok) guess(d.x, d.y);
      else showCaption(tr.end ? 'offTrail' : 'dragBack');
      return;
    }
    if (tr.ok) {
      if (!d.ok) {
        sfx.note(traced() - 1);
        showCaption(allTraced() ? 'where' : 'more');
      } else sfx.pick();
    } else {
      sfx.oops();
      showCaption('offTrail');
    }
    updateBar();
  }

  // a tap on the sky, not on a trail: is the radiant here?
  function guess(x, y) {
    const L = state.L;
    if (!allTraced()) {
      sfx.oops();
      showCaption('traceFirst');
      return;
    }
    let best = -1;
    let bd = Infinity;
    state.showers.forEach((sh, k) => {
      if (sh.found) return;
      const P = toScreen(L, sh.R);
      const d = P ? Math.hypot(P[0] - x, P[1] - y) : Infinity;
      if (d < bd) [best, bd] = [k, d];
    });
    if (best >= 0 && bd <= L.tol) {
      foundRadiant(best);
      return;
    }
    state.misses++;
    state.missRings.push({ v: fromScreen(L, x, y), t: state.t });
    sfx.oops();
    showCaption(levelNow().strays ? 'missStray' : 'miss');
    // after two misses the part of the sky with the radiant is ringed
    if (state.misses >= 2 && !state.hint) ringHint();
  }

  function foundRadiant(k) {
    const sh = state.showers[k];
    sh.found = true;
    sh.foundT = state.t;
    state.hint = null;
    state.hintN = 0;
    state.misses = 0;
    for (const tr of state.trails) {
      if (tr.shower === k) tr.ok = true;
    }
    state.phase = 'wait';
    hideHand();
    sfx.snap();
    showCaption('found');
    updateBar();
    later(1300, () => openAsk(k));
  }

  // a ring round the part of the sky with the radiant, smaller each time
  function ringHint() {
    const L = state.L;
    const k = state.showers.findIndex((sh) => !sh.found);
    if (k < 0) return;
    const R = toScreen(L, state.showers[k].R);
    if (!R) return;
    const r = [0.3, 0.2, 0.13][Math.min(state.hintN, 2)];
    state.hintN++;
    const off = rand(0, 0.45) * r * L.u;
    const ang = rand(0, 2 * Math.PI);
    state.hint = { v: fromScreen(L, R[0] + off * Math.cos(ang), R[1] + off * Math.sin(ang)), r, k };
  }

  function hint() {
    sfx.pick();
    if (state.phase === 'ask' && state.ask && !state.ask.done) {
      state.flash = { id: state.showers[state.ask.k].answer[0], until: state.t + 2.5 };
      return;
    }
    if (state.phase !== 'trace') return;
    if (!allTraced()) pointAt(nextTrail());
    else ringHint();
  }

  // ---------------------------------------------------------------------------
  // The question: which constellation is the radiant in?
  // ---------------------------------------------------------------------------

  function openAsk(k) {
    if (state.phase !== 'wait') return;
    state.phase = 'ask';
    state.ask = { k, wrong: [], done: false, picked: null, order: shuffle([...state.showers[k].options]) };
    hideCaption();
    $('ask').classList.remove('hidden');
    renderAsk();
  }

  function renderAsk() {
    const a = state.ask;
    if (!a) return;
    const sh = state.showers[a.k];
    const opts = $('options');
    opts.innerHTML = '';
    if (!a.done) {
      $('askTitle').textContent = t('askTitle');
      $('askText').textContent = a.wrong.length ? t('askWrong') : t('askTip');
      a.order.forEach((id) => {
        const b = document.createElement('button');
        b.className = 'option';
        b.textContent = figName(id);
        if (a.wrong.includes(id)) {
          b.classList.add('wrong');
          b.disabled = true;
        }
        // after two misses the right one pulses
        if (a.wrong.length >= 2 && id === sh.answer[0]) b.classList.add('pulse');
        b.addEventListener('click', () => answer(id));
        opts.appendChild(b);
      });
      $('nextBtn').classList.add('hidden');
      aim();
      return;
    }
    $('askTitle').textContent = `${figName(a.picked)} → ${cap(sh.name[Astro.lang])}`;
    const last = state.showers.every((s) => s.named);
    const fact = ((sh.alt && sh.alt[a.picked]) || sh.fact)[Astro.lang];
    $('askText').textContent = last && levelNow().strays ? `${fact} ${t('strayNote')}` : fact;
    $('nextBtn').textContent = t(last ? 'done' : 'goOn');
    $('nextBtn').classList.remove('hidden');
    aim();
  }

  function answer(id) {
    const a = state.ask;
    const sh = state.showers[a.k];
    if (sh.answer.includes(id)) {
      a.done = true;
      a.picked = id;
      sh.named = true;
      state.flash = null;
      if (state.showers.every((s) => s.named)) state.allFound = true;
      sfx.snap();
    } else {
      a.wrong.push(id);
      sfx.oops();
    }
    renderAsk();
    updateBar();
  }

  function next() {
    sfx.pick();
    $('ask').classList.add('hidden');
    state.ask = null;
    aim();
    if (state.showers.some((s) => !s.found)) {
      state.phase = 'trace';
      showCaption('second');
      return;
    }
    state.phase = 'over';
    later(500, win);
  }

  // ---------------------------------------------------------------------------
  // The hand, the caption and the bar
  // ---------------------------------------------------------------------------

  function pointAt(tr) {
    state.hand = tr || null;
    placeHand();
  }

  // the hand presses the head and slides back along the trail, over and over
  function placeHand() {
    const tr = state.hand;
    const el = $('tap');
    const k = tr && !tr.ok && state.L && ends(state.L, tr);
    if (!k) {
      if (tr) hideHand();
      return;
    }
    el.classList.remove('hidden');
    const len = Math.hypot(k.A[0] - k.B[0], k.A[1] - k.B[1]) * 1.8 + state.L.u * 0.05;
    const q = clamp(((state.t % 1.8) / 1.8 - 0.2) / 0.6, 0, 1);
    const x = k.B[0] + k.dx * len * q;
    const y = k.B[1] + k.dy * len * q;
    el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${y}px)`;
  }

  function hideHand() {
    state.hand = null;
    $('tap').classList.add('hidden');
  }

  function showCaption(key) {
    state.caption = key;
    const c = $('caption');
    c.classList.remove('hidden');
    // restart the pop
    c.style.animation = 'none';
    void c.offsetWidth;
    c.style.animation = '';
    fillCaption();
  }

  function fillCaption() {
    if (!state.caption) return;
    const [b, s] = t('captions')[state.caption];
    $('capTitle').textContent = b;
    $('capText').textContent = s;
  }

  function hideCaption() {
    state.caption = null;
    $('caption').classList.add('hidden');
  }

  // While the lines are drawn, it counts the trails with a line; then
  // the steps: all the lines, and finding and naming each radiant.
  function updateBar() {
    const [done, all] = allTraced()
      ? [1 + state.showers.filter((s) => s.found).length + state.showers.filter((s) => s.named).length, 1 + 2 * state.showers.length]
      : [traced(), state.trails.length];
    $('progressFill').style.width = (100 * done) / all + '%';
    $('progressText').textContent = `${done} / ${all}`;
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Win
  // ---------------------------------------------------------------------------

  function win() {
    stopAll();
    const lv = levelNow();
    done.add(lv.id);
    store.set('done', [...done]);
    sfx.win();
    $('nextLevelBtn').classList.toggle('hidden', state.level >= LEVELS.length - 1);
    $('win').classList.remove('hidden');
    updateWin();
    drawWin();
    Astro.startConfetti($('confetti'));
  }

  function updateWin() {
    const lv = levelNow();
    $('winName').textContent = showerNames(lv);
    $('winFact').textContent = lv.fact[Astro.lang];
  }

  // the whole sky of the level, with the radiants and their names
  function drawWin() {
    const c = $('winSky');
    const W = c.clientWidth;
    const H = c.clientHeight;
    if (!W || !H) return;
    const dpr = window.devicePixelRatio || 1;
    c.width = Math.round(W * dpr);
    c.height = Math.round(H * dpr);
    const g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const u = Math.min(W, H);
    const L = { W, H, u, c: state.c, ...turned(W >= H), cx: W / 2, cy: H / 2, ring: Math.max(10, u * 0.035), small: true };
    let s = viewScale(W, H);
    const m = u * 0.08;
    for (const sh of state.showers) s = fit(L, sh.R, m * 2, W - m * 2, m * 2, H - m * 2, s);
    for (const tr of state.trails) {
      s = fit(L, tr.a, m, W - m, m, H - m, s);
      s = fit(L, tr.b, m, W - m, m, H - m, s);
    }
    L.s = s;
    drawSky(g, L);
    for (const tr of state.trails) drawBack(g, L, tr, false);
    for (const tr of state.trails) drawTrail(g, L, tr, FLY);
    for (const sh of state.showers) drawRadiant(g, L, sh, 0);
  }

  // ---------------------------------------------------------------------------
  // Pointer, buttons & resizing
  // ---------------------------------------------------------------------------

  const pos = (e) => {
    const r = cv.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  // A press on a trail's bright head, dragged back along the trail, draws
  // a line; the dot at the end of a line drags it again. A press anywhere
  // else is a guess where the radiant is, and so is a tap on a trail or a
  // dot once every trail has its line.
  cv.addEventListener('pointerdown', (e) => {
    if (state.phase !== 'trace' || !state.L || state.drag) return;
    const [x, y] = pos(e);
    const hit = pickAt(x, y);
    if (!hit) {
      guess(x, y);
      return;
    }
    if (hit.kind === 'trail' && allTraced()) {
      guess(x, y);
      return;
    }
    hideHand();
    sfx.pick();
    if (hit.kind === 'trail') {
      state.pulse = { tr: hit.tr, until: state.t + 1.5 };
      showCaption('fromHead');
      return;
    }
    state.drag = { tr: hit.tr, end: hit.tr.end, ok: hit.tr.ok, moved: false, x, y };
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  cv.addEventListener('pointermove', (e) => {
    const d = state.drag;
    const L = state.L;
    const k = d && ends(L, d.tr);
    if (!k) return;
    const [x, y] = pos(e).map((q, i) => clamp(q, 3, (i ? L.H : L.W) - 3));
    // a finger that shakes a little is still a tap
    if (!d.moved && Math.hypot(x - d.x, y - d.y) < 8) return;
    if (Math.hypot(x - k.B[0], y - k.B[1]) < Math.max(20, L.u * 0.05)) return;
    d.moved = true;
    d.tr.end = fromScreen(L, x, y);
    d.tr.ok = followsTrail(k, [x, y]);
  });
  const letGo = () => {
    const d = state.drag;
    state.drag = null;
    if (d) drawn(d);
  };
  cv.addEventListener('pointerup', letGo);
  cv.addEventListener('pointercancel', letGo);

  new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden') && state.c) layout();
    if (!$('win').classList.contains('hidden')) drawWin();
  }).observe(document.body);

  $('playBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', startGame);
  $('nextLevelBtn').addEventListener('click', () => {
    state.level = Math.min(state.level + 1, LEVELS.length - 1);
    store.set('level', state.level);
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
    fillCaption();
    renderAsk();
    if (state.L && !$('game').classList.contains('hidden')) state.L.sky = paintSky(state.L);
    if (!$('win').classList.contains('hidden')) {
      updateWin();
      drawWin();
    }
  });
})();
