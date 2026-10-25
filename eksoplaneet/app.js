'use strict';

(() => {
  const { $, clamp, shuffle, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // Real stars and planets found by the dips they make in the starlight.
  // The light curves are made up from each planet's real size (Re, in Earth
  // radii) and period (P, in days); the noise, the starspots and the flares
  // are made up too. R is the star's radius in Sun radii, and hz the periods
  // (days) of planets in its habitable zone, where water could be liquid.
  // The dips are drawn wider than they are (a few hours) so that they show.
  // days is how long the star is watched and t0 the first dip; a level with
  // dips instead is watched for that many dips of its planet, a different
  // number each time, from a different start.
  const LEVELS = [
    {
      id: 'hd209458',
      name: { et: 'Selge varjutus', en: 'A clear dip' },
      star: {
        name: 'HD 209458', R: 1.16, color: '#fff2d0', hz: [340, 750],
        about: { et: 'Päikese-sarnane täht, Päikesest veidi suurem', en: 'A star like the Sun, a little bigger' }
      },
      dips: [3, 4, 5], noise: 0.0008,
      planets: [{
        name: 'HD 209458 b', P: 3.525, Re: 15.1, dur: 0.13,
        pic: 'jupiter', filter: 'sepia(0.5) saturate(2) hue-rotate(-20deg) brightness(1.05)',
        fact: {
          et: 'See on esimene planeet, mille möödumist oma tähe eest nähti 1999. aastal. Ta on nii kuum, et tema atmosfäär aurab kosmosesse nagu komeedi saba.',
          en: 'The first planet seen passing in front of its star, in 1999. It is so hot that its air streams away into space like the tail of a comet.'
        }
      }]
    },
    {
      id: 'kepler22',
      name: { et: 'Väike varjutus', en: 'A small dip' },
      star: {
        name: 'Kepler-22', R: 0.98, color: '#ffe9b8', hz: [250, 650],
        about: { et: 'Päikese-sarnane täht, peaaegu sama suur kui Päike', en: 'A star like the Sun, almost the same size' }
      },
      dips: [3, 4, 5], noise: 0.00016,
      planets: [{
        name: 'Kepler-22 b', P: 289.9, Re: 2.1, dur: 0.31,
        pic: 'neptune', filter: 'hue-rotate(-15deg) saturate(0.8) brightness(1.2)',
        fact: {
          et: 'See on esimene planeet, mis leiti Päikese-sarnase tähe elamiskõlblikust vööndist. Avastus tehti 2011. aastal. Keegi ei tea veel, kas planeet on kivine või ookeaniga kaetud.',
          en: 'The first planet found in the habitable zone of a star like the Sun, in 2011. Nobody knows yet whether it is rocky or covered by an ocean.'
        }
      }]
    },
    {
      id: 'lhs1140',
      name: { et: 'Kaks planeeti', en: 'Two planets' },
      star: {
        name: 'LHS 1140', R: 0.21, color: '#ff9a6a', hz: [13, 36],
        about: { et: 'Punane kääbus, viis korda Päikesest väiksem ja palju jahedam', en: 'A red dwarf, five times smaller than the Sun and much cooler' }
      },
      days: 60, noise: 0.0006,
      planets: [
        {
          name: 'LHS 1140 b', P: 24.74, t0: 8, Re: 1.73, dur: 0.09,
          pic: 'venus', filter: 'hue-rotate(170deg) saturate(0.9) brightness(1.05)',
          fact: {
            et: 'Võib-olla on ta ookeaniga kaetud veemaailm. Teleskoopidega uuritakse, kas tal on atmosfäär, mis hoiaks planeedi soojas.',
            en: 'It may be a water world covered by an ocean. Astronomers are using telescopes to find out whether it has an atmosphere that would keep the planet warm.'
          }
        },
        {
          name: 'LHS 1140 c', P: 3.78, t0: 1.2, Re: 1.27, dur: 0.06,
          pic: 'mercury', filter: 'sepia(0.6) hue-rotate(-20deg) saturate(1.6)',
          fact: {
            et: 'Ta on oma tähele nii lähedal, et aasta kestab seal vähem kui neli päeva.',
            en: 'It is so close to its star that a year there lasts less than four days.'
          }
        }
      ]
    },
    {
      id: 'kepler1649',
      name: { et: 'Rahutu täht', en: 'A restless star' },
      star: {
        name: 'Kepler-1649', R: 0.23, color: '#ff8a5c', hz: [15, 43],
        about: {
          et: 'Rahutu punane kääbus: pinnal on plekid ja vahel lööb ta korraks heledaks',
          en: 'A restless red dwarf: it has spots, and now and then it flares up'
        }
      },
      days: 70, noise: 0.0004,
      // the spots turn round every 13 days, so their wobbles fall between the dips
      spots: { amp: 0.0025, P: 13.1, phase: -2.77 },
      flares: [{ t: 13.3, a: 0.004 }, { t: 37.8, a: 0.003 }, { t: 52.1, a: 0.005 }],
      planets: [{
        name: 'Kepler-1649 c', P: 19.54, t0: 6, Re: 1.06, dur: 0.08,
        pic: 'mars', filter: 'hue-rotate(-10deg) saturate(1.2) brightness(0.9)',
        fact: {
          et: 'Arvuti pidas tema heleduse muutumist algul millekski muuks. Inimesed vaatasid Kepleri teleskoobi andmed uuesti läbi ja leidsid ta 2020. aastal. Ta on peaaegu Maa suurune.',
          en: 'A computer first took the change in brightness it made for something else. People went through the Kepler telescope\'s data again and found it in 2020. It is almost as big as the Earth.'
        }
      }]
    }
  ];

  const EARTH_IN_SUN = 0.009168; // the Earth's radius in Sun radii
  const SIZES = [1, 2, 4, 11];    // the size choices, in Earth radii
  const OBSERVE_S = 18;           // how long the telescope takes to record (s)
  const FLATTEN_S = 1.5;          // how long the spots' wobble takes to be taken out (s)
  const COLORS = ['#ffd34d', '#5fd4ff'];
  const RULER_COLOR = '#ff8ad8'; // the days and depth rulers, unlike the dips marked

  const TEXT = {
    et: {
      title: 'Avasta eksoplaneet',
      intro1: 'Eksoplaneet on planeet, mis tiirleb ümber mõne muu tähe kui Päike. Neid on leitud juba üle 6000.',
      intro2: 'Kui planeet möödub tähe eest, tähe valgus natuke nõrgeneb. Jälgi tähe heledust, leia lohud ja uuri välja, milline see planeet on.',
      chooseStar: 'Vali täht',
      catalogue: 'Sinu avastused',
      play: 'Alusta',
      menu: 'Menüü',
      newStar: 'Uus täht',
      reset: '🗑️ Kustuta kõik avastused',
      resetAsk: 'Kas kustutada kõik sinu avastused? Siis algab iga tase jälle päris tähega.',
      nextLevel: 'Järgmine tase',
      newEach: 'Iga kord uus täht',
      madeUp: 'See täht ja tema planeedid on välja mõeldud, aga just selliseid planeete on päriselt leitud.',
      madeUpEmpty: 'See täht on välja mõeldud.',
      noPlanet: 'Siin pole planeeti',
      noPlanetNote: 'Kui sa ei leia ühtegi lohku, mis korduks sama aja tagant, vajuta „Siin pole planeeti“.',
      missed: 'Vaata uuesti: siin on lohke, mis korduvad sama aja tagant. 💡 näitab, kus.',
      noneHint: 'Vaata hoolega: kas siin on mõni lohk, mis kordub sama aja tagant? Müra, plekid ja loited nii ei kordu.',
      checked: 'Täht kontrollitud!',
      noneRight: 'Õige! Selle tähe eest ei möödu ükski planeet. Võib-olla on tal planeete, aga nende tee ei vii tähe eest läbi. Enamiku tähtedega on just nii, ja ka see on teaduses tähtis tulemus.',
      catNone: 'Planeete ei leitud: ükski ei möödu tähe eest.',
      allGames: 'Kõik mängud',
      hint: 'Vihje',
      sound: 'Heli',
      next: 'Edasi ▶',
      discovered: 'Avastasid!',
      picNote: 'Pildid näitavad, milline planeet võiks olla. Päriselt pole keegi neid nii lähedalt näinud.',
      hzName: 'elamiskõlblik vöönd',
      notToScale: 'Täht, planeedid ja kaugused pole õiges mõõtkavas.',
      day: 'päev',
      zoomIn: 'Suurenda',
      zoomTip: 'Nupuga + saad graafikut suurendada ja iga lohku eraldi mõõta.',
      zoomOut: 'Vähenda',
      pan: 'Näidatav osa',
      brightness: 'heledus',
      steps: ['Vaatle', 'Kui tihti?', 'Kui suur?', 'Vesi?'],
      observeTitle: '🔭 Vaatle tähte',
      observeText: 'Teleskoop mõõdab tähe heledust. Puuduta graafikul iga lohku, kus tähe valgus korraks nõrgeneb.',
      marked: (n) => `Leitud lohke: ${n}`,
      moreDips: 'Leia veel lohke. Planeet möödub tähe eest alati sama aja tagant.',
      moreKinds: 'Vaata hoolega: kas kõik lohud on ühesugused? Leia igat sorti vähemalt kolm.',
      enoughOne: 'Tubli! Lohud korduvad ühesuguse vahega. See on planeet, mis tiirleb ümber tähe.',
      enoughTwo: 'Tubli! Lohke on kaht eri sügavust, ja kumbki kordub oma vahega. Siin on kaks planeeti!',
      noise: 'Siin pole varjutust, see on ainult müra. Planeedi varjutus kordub alati sama aja tagant.',
      spot: 'See lai ja ümar kõikumine tuleb tähe pinnal olevatest plekkidest, kui täht pöörleb. Planeedi lohk on kitsas ja kordub täpselt sama aja tagant.',
      flare: 'See on täheloide: täht lõi korraks heledamaks. Planeedi möödudes tähe valgus hoopis nõrgeneb.',
      planetOf: (name) => `Planeet ${name}`,
      periodTitle: '⏱️ Kui tihti?',
      periodText: 'Mitme päeva tagant planeet tähe eest möödub? Lohista roosad jooned kahe järjestikuse lohu peale ja vaata noole kohalt, mitu päeva on nende vahel.',
      periodHint: (a, b) => `Lahuta kahe järjestikuse lohu päevad: ${b} − ${a}.`,
      periodOk: (p) => `Õige! Planeet tiirleb ümber tähe ${p} päevaga. Nii pikk on seal aasta.`,
      days: (p) => `${p} päeva`,
      sizeTitle: '📏 Kui suur?',
      sizeText: 'Mida suurem planeet, seda sügavam lohk. Lohista roosa joon lohu põhja ja vaata skaalalt, milline planeet teeb sellise lohu.',
      flattened: 'Eemaldasime plekkide muutlikkuse, nüüd saad lohu sügavust mõõta.',
      smallStar: 'Väikese tähe ees teeb sama planeet sügavama lohu, sest ta katab tähest suurema osa.',
      sizeWrong: 'Vaata, kuhu roosa kriips skaalal jääb.',
      sizeHint: 'Hele kriips skaalal näitab, kui sügav on selle planeedi lohk.',
      sizeNames: ['Maa-suurune', 'Super-Maa', 'Neptuuni-suurune', 'Jupiteri-suurune'],
      sizeShort: ['Maa-suurune', 'super-Maa', 'Neptuuni-suurune', 'Jupiteri-suurune'],
      sizeBar: ['Maa', 'super-Maa', 'Neptuun', 'Jupiter'],
      sizeOk: (s) => `Õige! Planeet on ${s}.`,
      zoneTitle: '💧 Kas seal võiks olla vett?',
      zoneText: (lo, hi, p) => `Selle tähe ümber võiks vesi olla vedel planeetidel, mis tiirlevad ${lo}–${hi} päevaga. Selle planeedi aasta on ${p} päeva.`,
      zoneHint: 'Lühem aasta tähendab, et planeet on tähele lähemal ja seal on kuumem.',
      zoneNames: ['Liiga kuum', 'Paras, vesi võiks olla vedel', 'Liiga külm'],
      zoneShort: ['liiga kuum', 'elamiskõlblikus vööndis', 'liiga külm'],
      zoneBar: ['aur', 'vedel vesi', 'jää'],
      zoneOk: [
        'Õige! Planeet on tähele nii lähedal, et vesi keeks ära.',
        'Õige! See planeet on elamiskõlblikus vööndis, kus vesi võiks olla vedel.',
        'Õige! Planeet on tähest nii kaugel, et vesi külmuks.'
      ],
      tryAgain: 'Proovi uuesti.',
      nextPlanet: 'Nüüd uuri teist planeeti.',
      summary: (p, size, zone) => `Tiirleb ümber tähe ${p} päevaga, on ${size} ja ${zone}.`,
      sunLike: (R) => `Päikese-sarnane täht, ${R > 1.1 ? 'Päikesest veidi suurem' : R < 0.92 ? 'Päikesest veidi väiksem' : 'peaaegu sama suur kui Päike'}`,
      orange: 'Oranž kääbus, Päikesest veidi väiksem ja jahedam',
      red: (n) => `Punane kääbus, ${n} korda Päikesest väiksem ja palju jahedam`,
      restless: 'Rahutu punane kääbus: pinnal on plekid ja vahel lööb ta korraks heledaks',
      // what a made-up planet is like, by its size and zone
      facts: [
        ['Kiviplaneet, nii lähedal oma tähele, et pinnal võib olla sulanud kivi.',
          'Maa-suurune planeet elamiskõlblikus vööndis: just selliseid otsivad teadlased kõige rohkem.',
          'Maa-suurune jäine planeet, kus kogu vesi oleks jää.'],
        ['Kuum super-Maa: Maast suurem kiviplaneet, mille pind võib olla laavast.',
          'Super-Maa: Maast suuremaid kiviplaneete pole meie Päikesesüsteemis ühtegi, aga teiste tähtede juures on neid väga palju.',
          'Külm super-Maa, mille pind on tõenäoliselt jääs.'],
        ['Kuum Neptuun: paks gaasikiht, mida tähe kuumus tasapisi ära puhub.',
          'Neptuuni-suurune planeet on enamasti gaasist ja jääst, nii et sellel pole kõva pinda, kuhu astuda.',
          'Jäine hiid nagu Uraan ja Neptuun: gaas ja jää, väga külm.'],
        ['Kuum Jupiter: hiiglaslik gaasiplaneet oma tähe kõrval. Neid leitakse kergesti, sest nende lohud on sügavad.',
          'Hiidplaneet ise on gaasist, aga kui tal on suured kuud, võiks neil olla vett.',
          'Külm hiidplaneet, nagu Jupiter ja Saturn meie Päikesesüsteemis.']
      ]
    },
    en: {
      title: 'Discover an Exoplanet',
      intro1: 'An exoplanet is a planet that goes round a star other than the Sun. More than 6000 have been found.',
      intro2: 'When a planet passes in front of its star, the star gets a little fainter. Watch the star\'s brightness, find the dips and work out what the planet is like.',
      chooseStar: 'Pick a star',
      catalogue: 'Your discoveries',
      play: 'Start',
      menu: 'Menu',
      newStar: 'New star',
      reset: '🗑️ Clear all discoveries',
      resetAsk: 'Clear all your discoveries? Then each level starts again with a real star.',
      nextLevel: 'Next level',
      newEach: 'A new star every time',
      madeUp: 'This star and its planets are made up, but planets just like them have really been found.',
      madeUpEmpty: 'This star is made up.',
      noPlanet: 'No planet here',
      noPlanetNote: 'If you find no dips that come again after the same time, press “No planet here”.',
      missed: 'Look again: there are dips here that come again after the same time. 💡 shows where.',
      noneHint: 'Look closely: is there a dip that comes again after the same time? Noise, spots and flares do not repeat like that.',
      checked: 'Star checked!',
      noneRight: 'Right! No planet passes in front of this star. It may have planets, but their paths do not take them in front of it. That is so for most stars, and it is an important result in science too.',
      catNone: 'No planets found: none passes in front of the star.',
      allGames: 'All games',
      hint: 'Hint',
      sound: 'Sound',
      next: 'Next ▶',
      discovered: 'Discovered!',
      picNote: 'The pictures show what the planets could look like. Nobody has seen them this close.',
      hzName: 'habitable zone',
      notToScale: 'The star, the planets and the distances are not to scale.',
      day: 'day',
      zoomIn: 'Zoom in',
      zoomTip: 'With the + button you can zoom in on the graph and measure each dip on its own.',
      zoomOut: 'Zoom out',
      pan: 'Part shown',
      brightness: 'brightness',
      steps: ['Watch', 'How often?', 'How big?', 'Water?'],
      observeTitle: '🔭 Watch the star',
      observeText: 'The telescope measures how bright the star is. Tap each dip in the graph where the star dims for a while.',
      marked: (n) => `Dips found: ${n}`,
      moreDips: 'Find more dips. A planet always passes in front of its star after the same time.',
      moreKinds: 'Look closely: are all the dips the same? Find at least three of each kind.',
      enoughOne: 'Well done! The dips come again after the same time. It is a planet going round the star.',
      enoughTwo: 'Well done! The dips are of two depths, and each kind comes again after its own time. There are two planets here!',
      noise: 'There is no dip here, just noise. A planet\'s dip always comes again after the same time.',
      spot: 'This wide, round wobble comes from spots on the star as it turns. A planet\'s dip is narrow and comes again after exactly the same time.',
      flare: 'This is a flare: the star got brighter for a moment. A planet makes the star fainter.',
      planetOf: (name) => `Planet ${name}`,
      periodTitle: '⏱️ How often?',
      periodText: 'How many days apart does the planet pass in front of the star? Drag the pink lines onto two dips in a row and see above the arrow how many days there are between them.',
      periodHint: (a, b) => `Subtract the days of two dips in a row: ${b} − ${a}.`,
      periodOk: (p) => `Right! The planet goes round the star in ${p} days. That is how long a year is there.`,
      days: (p) => `${p} days`,
      sizeTitle: '📏 How big?',
      sizeText: 'The bigger the planet, the deeper the dip. Drag the pink line to the bottom of the dip and see on the scale which planet makes a dip like that.',
      flattened: 'We took out the changes from the spots, so now you can measure the dip\'s depth.',
      smallStar: 'In front of a small star the same planet makes a deeper dip, because it covers more of the star.',
      sizeWrong: 'See where the pink mark is on the scale.',
      sizeHint: 'The pale mark on the scale shows how deep this planet\'s dip is.',
      sizeNames: ['Earth-sized', 'Super-Earth', 'Neptune-sized', 'Jupiter-sized'],
      sizeShort: ['Earth-sized', 'a super-Earth', 'Neptune-sized', 'Jupiter-sized'],
      sizeBar: ['Earth', 'super-Earth', 'Neptune', 'Jupiter'],
      sizeOk: (s) => `Right! The planet is ${s}.`,
      zoneTitle: '💧 Could there be water?',
      zoneText: (lo, hi, p) => `Round this star water could be liquid on planets that go round it in ${lo}–${hi} days. This planet's year is ${p} days.`,
      zoneHint: 'A shorter year means that the planet is closer to the star, where it is hotter.',
      zoneNames: ['Too hot', 'Just right, water could be liquid', 'Too cold'],
      zoneShort: ['too hot', 'in the habitable zone', 'too cold'],
      zoneBar: ['steam', 'liquid water', 'ice'],
      zoneOk: [
        'Right! The planet is so close to its star that water would boil away.',
        'Right! This planet is in the habitable zone, where water could be liquid.',
        'Right! The planet is so far from its star that water would freeze.'
      ],
      tryAgain: 'Try again.',
      nextPlanet: 'Now look at the other planet.',
      summary: (p, size, zone) => `It goes round its star in ${p} days, is ${size} and ${zone}.`,
      sunLike: (R) => `A star like the Sun, ${R > 1.1 ? 'a little bigger' : R < 0.92 ? 'a little smaller' : 'almost the same size'}`,
      orange: 'An orange dwarf, a little smaller and cooler than the Sun',
      red: (n) => `A red dwarf, ${n} times smaller than the Sun and much cooler`,
      restless: 'A restless red dwarf: it has spots, and now and then it flares up',
      facts: [
        ['A rocky planet so close to its star that its ground may be molten rock.',
          'An Earth-sized planet in the habitable zone: just what scientists look for most.',
          'An icy Earth-sized planet, where all the water would be ice.'],
        ['A hot super-Earth: a rocky planet bigger than the Earth, whose ground may be lava.',
          'A super-Earth: there are no rocky planets bigger than the Earth in our Solar System, but round other stars there are very many.',
          'A cold super-Earth, probably covered in ice.'],
        ['A hot Neptune: a thick layer of gas that the star\'s heat is slowly blowing away.',
          'A Neptune-sized planet is mostly gas and ice, so it has no hard ground to stand on.',
          'An ice giant like Uranus and Neptune: gas and ice, and very cold.'],
        ['A hot Jupiter: a giant gas planet right next to its star. They are easy to find, because their dips are deep.',
          'The giant itself is made of gas, but if it has big moons, they could have water.',
          'A cold giant, like Jupiter and Saturn in our Solar System.']
      ]
    }
  };

  // ---------------------------------------------------------------------------
  // The planets worked out
  // ---------------------------------------------------------------------------

  function prepare(L) {
    for (const p of L.planets) {
      p.depth = ((p.Re * EARTH_IN_SUN) / L.star.R) ** 2;
      // drawn at least this wide, or a dip of a few hours would not show
      p.half = Math.max(p.dur, L.days * 0.012) / 2;
      p.times = [];
      for (let t = p.t0; t < L.days - p.half; t += p.P) p.times.push(t);
      let best = 0;
      SIZES.forEach((s, k) => { if (Math.abs(Math.log(p.Re / s)) < Math.abs(Math.log(p.Re / SIZES[best]))) best = k; });
      p.size = best;
      p.zone = p.P < L.star.hz[0] ? 0 : p.P > L.star.hz[1] ? 2 : 1;
    }
    return L;
  }
  LEVELS.forEach(prepare);

  // ---------------------------------------------------------------------------
  // Made-up stars, after each real one has been found
  // ---------------------------------------------------------------------------

  const { rand } = Astro;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const logRand = (a, b) => Math.exp(rand(Math.log(a), Math.log(b)));
  // two significant digits, for the edges of the habitable zone
  const nice = (v) => {
    const q = 10 ** (Math.floor(Math.log10(v)) - 1);
    return Math.round(v / q) * q;
  };

  // A star of a kind: its size R (Sun radii), temperature T and mass M, and
  // from those the periods of its habitable zone, where it gets between
  // 1.1 and 0.36 times the sunlight the Earth gets.
  function makeStar(kind) {
    let st;
    if (kind === 'sun') {
      const R = rand(0.85, 1.2);
      st = { R, T: rand(5300, 6100), M: R, about: (lang) => TEXT[lang].sunLike(R) };
      st.color = st.T > 5900 ? '#fff6e0' : '#ffe9b8';
    } else if (kind === 'orange') {
      st = { R: rand(0.65, 0.8), T: rand(4300, 5000), color: '#ffc98a', about: (lang) => TEXT[lang].orange };
      st.M = st.R;
    } else {
      const R = rand(0.15, 0.45);
      const n = Math.round(1 / R);
      st = { R, T: rand(3000, 3600), M: R, color: '#ff9a6a', about: (lang) => (kind === 'restless' ? TEXT[lang].restless : TEXT[lang].red(n)) };
    }
    const lum = st.R ** 2 * (st.T / 5772) ** 4;
    const period = (a) => (365.25 * a ** 1.5) / Math.sqrt(st.M);
    st.hz = [nice(period(0.95 * Math.sqrt(lum))), nice(period(1.67 * Math.sqrt(lum)))];
    st.name = `EKSO-${Math.floor(rand(100, 10000))}`;
    const about = st.about;
    st.about = { et: about('et'), en: about('en') };
    return st;
  }

  // A period well inside a zone, so that the answer is clear.
  function periodIn(zone, hz) {
    if (zone === 0) return logRand(Math.max(1.2, hz[0] / 10), hz[0] / 1.25);
    if (zone === 1) return logRand(hz[0] * 1.12, hz[1] / 1.12);
    return logRand(hz[1] * 1.2, hz[1] * 1.45);
  }

  // What a made-up planet could look like, by its size and zone, each in
  // a slightly different colour.
  function lookFor(size, zone) {
    const hue = ` hue-rotate(${Math.round(rand(-25, 25))}deg)`;
    const looks = [
      [['mercury', 'sepia(0.6) hue-rotate(-20deg) saturate(1.6)'], ['earth', ''], ['mercury', 'saturate(0.3) brightness(1.3) hue-rotate(180deg)']],
      [['venus', 'sepia(0.5) saturate(1.8) hue-rotate(-25deg)'], ['earth', 'saturate(0.8)'], ['mars', 'saturate(0.2) brightness(1.4) hue-rotate(160deg)']],
      [['neptune', 'hue-rotate(-60deg) saturate(1.3)'], ['neptune', ''], ['uranus', '']],
      [['jupiter', 'sepia(0.5) saturate(2) hue-rotate(-20deg) brightness(1.05)'], ['jupiter', ''], ['saturn', '']]
    ];
    const [pic, filter] = looks[size][zone];
    return { pic, filter: (filter + hue).trim() };
  }

  function makePlanet(star, size, zone, P) {
    return Object.assign({ P, Re: SIZES[size] * rand(0.87, 1.15), dur: 0.1 }, lookFor(size, zone), {
      fact: { et: TEXT.et.facts[size][zone], en: TEXT.en.facts[size][zone] }
    });
  }

  // How long to watch for n dips of a planet going round in P days: from
  // part way into a turn to part way into the turn after the last dip, so
  // that no dip is cut at either end.
  function watch(P, n) {
    const t0 = rand(0.1, 0.9) * P;
    return { t0, days: t0 + P * (n - 1 + rand(0.35, 0.85)) };
  }

  // A real level with dips, watched for a number of them.
  function watchReal(real) {
    const p = { ...real.planets[0] };
    const { t0, days } = watch(p.P, pick(real.dips));
    p.t0 = t0;
    return prepare({ ...real, days, planets: [p] });
  }

  // A new star of the same kind as level i, with planets that are new too.
  function makeLevel(i) {
    const base = LEVELS[i];
    const star = makeStar(pick([['sun', 'orange'], ['sun', 'orange'], ['orange', 'red'], ['restless']][i]));
    let planets;
    if (i === 0) {
      const zone = pick([0, 0, 1, 2]);
      planets = [makePlanet(star, pick([2, 3, 3]), zone, periodIn(zone, star.hz))];
    } else if (i === 1 || i === 3) {
      const zone = pick([0, 1, 1, 2]);
      planets = [makePlanet(star, pick(i === 1 ? [0, 1, 1] : [0, 1]), zone, periodIn(zone, star.hz))];
    } else {
      // two planets of different sizes; the inner one goes round three or
      // four times while the outer one goes round once, give or take a
      // fifth, and is never in a zone near its edge
      const sizes = shuffle([0, 1, 2]).slice(0, 2);
      const zone = pick([0, 1, 1, 2]);
      // a hot outer planet still takes days, so the inner one is not too fast
      const outer = zone === 0 ? logRand(Math.min(5, star.hz[0] / 1.3), star.hz[0] / 1.25) : periodIn(zone, star.hz);
      let ratio;
      let inner;
      for (let k = 0; k < 50; k++) {
        ratio = pick([3, 4]) + rand(-0.2, 0.2);
        inner = outer / ratio;
        if ([star.hz[0], star.hz[1]].every((e) => Math.abs(Math.log(inner / e)) > Math.log(1.12))) break;
      }
      const zoneOf = (P) => (P < star.hz[0] ? 0 : P > star.hz[1] ? 2 : 1);
      planets = [makePlanet(star, sizes[0], zoneOf(inner), inner), makePlanet(star, sizes[1], zone, outer)];
    }
    // watch for three to five dips of the outermost planet on the first two
    // levels, like their real stars, and three on the others
    const Po = planets[planets.length - 1].P;
    const { t0, days } = watch(Po, i < 2 ? pick(base.dips) : 3);
    planets[planets.length - 1].t0 = t0;
    const half = Math.max(0.1, days * 0.012) / 2;
    if (planets.length > 1) {
      // the outer planet's dips fall between the inner one's: each turn of
      // the outer one moves them on by the part of a turn over the whole number
      const pi = planets[0];
      const drift = Po / pi.P - Math.round(Po / pi.P);
      const phase = pi.P * (0.5 - drift);
      pi.t0 = ((t0 - phase) % pi.P + pi.P) % pi.P;
      if (pi.t0 < half * 2) pi.t0 += pi.P;
    }
    planets.forEach((p, k) => { p.name = `${star.name} ${'bc'[k]}`; });
    const L = { name: base.name, star, days, planets, generated: true };
    // one in five has no planet that passes in front of it, except when two
    // are promised; it still gets the noise, spots and flares of its kind
    const empty = i !== 2 && Math.random() < 0.2;
    const depths = planets.map((p) => ((p.Re * EARTH_IN_SUN) / star.R) ** 2);
    const shallow = Math.min(...depths);
    // a small dip is two to three and a half times as deep as the noise,
    // and for half of the stars it is almost lost in it
    const small = Math.random() < 0.5 ? rand(2.1, 2.6) : rand(2.6, 3.4);
    L.noise = shallow / [rand(12, 20), small, rand(5, 7), rand(4, 5)][i];
    if (i === 3) {
      // spots whose wobble is not at its lowest at a dip, and a few flares away from the dips
      L.spots = { amp: shallow * rand(1.1, 1.6), P: rand(6, 16), phase: 0 };
      const dips = [];
      for (let tc = t0; tc < days; tc += Po) dips.push(tc);
      for (let k = 0; k < 100; k++) {
        L.spots.phase = rand(0, 2 * Math.PI);
        if (dips.every((tc) => Math.sin((2 * Math.PI * tc) / L.spots.P + L.spots.phase) > -0.55)) break;
      }
      L.flares = [];
      for (let k = 0; k < 40 && L.flares.length < 3; k++) {
        const tf = rand(1, days - 1);
        if (dips.every((tc) => Math.abs(tf - tc) > half * 3 + 0.5)) L.flares.push({ t: tf, a: shallow * rand(1.5, 3) });
      }
    }
    if (empty) L.planets = [];
    return prepare(L);
  }

  const fmt = (v, d) => v.toLocaleString(Astro.lang === 'et' ? 'et-EE' : 'en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtP = (P) => fmt(P, P < 100 ? 1 : 0);

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('eksoplaneet.');
  const state = {
    level: store.get('level', 0),
    found: store.get('found', []), // the real stars done
    catalogue: store.get('catalogue', null), // every planet found, newest last
    L: null,
    data: null,       // { t, f, avg, spot } samples of the light curve
    marks: [],        // [planet][transit] = marked
    phase: 'observe', // observe, period, size, zone, done
    pi: 0,            // the planet being studied
    t0: 0,            // when the recording started
    shown: 0,         // how much of the curve is shown (days)
    raf: 0,
    ruler: null,      // the depth the ruler is at
    flat: 0,          // how much of the spots' wobble is taken out, 0 to 1
    flatT0: 0,        // when the taking out started
    hintAt: null,     // { p, t, until } a dip to point at
    v0: 0,            // the first day shown on the graph
    span: 0           // how many days the graph shows
  };
  if (!(state.level >= 0 && state.level < LEVELS.length)) state.level = 0;
  if (!Array.isArray(state.found)) state.found = [];
  const entry = (p) => ({ name: p.name, P: p.P, size: p.size, zone: p.zone, pic: p.pic, filter: p.filter });
  if (!Array.isArray(state.catalogue)) {
    // from before the catalogue was kept: the real planets found
    state.catalogue = [];
    LEVELS.forEach((L) => { if (state.found.includes(L.id)) L.planets.forEach((p) => state.catalogue.push(entry(p))); });
  }

  const t = (key) => TEXT[Astro.lang][key];
  const canvas = $('graph');
  const ctx = canvas.getContext('2d');

  // ---------------------------------------------------------------------------
  // Pictures of the planets, drawn once each
  // ---------------------------------------------------------------------------

  // A star of the given colour with its glow, as an inline SVG: phones in
  // dark mode darken CSS gradients and shadows. The star fills the middle
  // two thirds, the glow the rest.
  let starIds = 0;
  function starPic(color, cls = '') {
    const id = 'star' + starIds++;
    return (
      `<svg class="${cls}" viewBox="-1.5 -1.5 3 3" aria-hidden="true">` +
      `<radialGradient id="${id}g"><stop offset="0.55" stop-color="${color}" stop-opacity="0.8"/>` +
      `<stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>` +
      `<radialGradient id="${id}d" cx="0.4" cy="0.4" r="0.75"><stop offset="0" stop-color="#fff"/>` +
      `<stop offset="0.55" stop-color="${color}"/></radialGradient>` +
      `<circle r="1.5" fill="url(#${id}g)"/><circle r="1" fill="url(#${id}d)"/></svg>`
    );
  }

  const PICS = {};
  const waiting = {};
  function withPic(id, cb) {
    if (PICS[id]) return cb(PICS[id]);
    if (waiting[id]) return waiting[id].push(cb);
    waiting[id] = [cb];
    AstroPlanets.drawPlanet(id, 240, (pic) => {
      PICS[id] = pic;
      waiting[id].forEach((f) => f(pic));
    });
  }
  function planetImg(p, cls) {
    const img = document.createElement('img');
    img.className = cls;
    img.alt = '';
    img.style.filter = p.filter;
    withPic(p.pic, (pic) => { img.src = pic.url; });
    return img;
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    LEVELS.forEach((L, i) => {
      const b = document.createElement('button');
      b.className = 'level';
      b.innerHTML =
        `<span class="level-dot" style="--r:${0.6 + 0.4 * Math.min(1, L.star.R)}">${starPic(L.star.color)}</span>` +
        '<span class="level-text"><b class="level-name"></b><span class="level-star"></span></span>' +
        '<b class="done-badge hidden">🌟</b>';
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
      const L = LEVELS[i];
      b.classList.toggle('selected', i === state.level);
      b.querySelector('.level-name').textContent = `${i + 1} · ${L.name[Astro.lang]}`;
      const done = state.found.includes(L.id);
      b.querySelector('.done-badge').classList.toggle('hidden', !done);
      // the real star first, then a made-up one each time
      b.querySelector('.level-star').textContent = done ? t('newEach') : L.star.name;
    });
    // the planets found so far
    const box = $('catalogue');
    box.innerHTML = '';
    $('catalogueBox').classList.toggle('hidden', !state.catalogue.length);
    $('catCount').textContent = `(${state.catalogue.filter((p) => !p.empty).length})`;
    for (const p of [...state.catalogue].reverse()) {
      const card = document.createElement('div');
      card.className = 'cat-card';
      if (p.empty) {
        card.classList.add('empty');
        card.innerHTML = `<span class="cat-pic cat-star">${starPic(p.color)}</span>`;
      } else {
        card.appendChild(planetImg(p, 'cat-pic'));
      }
      const text = document.createElement('div');
      text.innerHTML = '<b></b><span></span>';
      text.querySelector('b').textContent = p.name;
      text.querySelector('span').textContent = p.empty ? t('catNone') : summary(p);
      card.appendChild(text);
      box.appendChild(card);
    }
  }

  function summary(p) {
    return t('summary')(fmtP(p.P), t('sizeShort')[p.size], t('zoneShort')[p.zone]);
  }

  function showMenu() {
    cancelAnimationFrame(state.raf);
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // The light curve
  // ---------------------------------------------------------------------------

  function gauss() {
    let u = 0;
    while (!u) u = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
  }

  // How much of the star a planet covers at time t, from 0 to 1: it slides
  // in, covers it fully for a while, and slides out.
  function cover(p, time) {
    let best = 0;
    for (const tc of p.times) {
      const x = Math.abs(time - tc) / p.half;
      if (x < 1) best = Math.max(best, Math.min(1, (1 - x) / 0.25));
    }
    return best;
  }

  function spotWobble(L, time) {
    if (!L.spots) return 0;
    const w = (2 * Math.PI * time) / L.spots.P;
    return L.spots.amp * (Math.sin(w + L.spots.phase) + 0.35 * Math.sin(2 * (w + L.spots.phase)));
  }

  function wobble(L, time) {
    let f = spotWobble(L, time);
    for (const fl of L.flares || []) if (time >= fl.t) f += fl.a * Math.exp(-(time - fl.t) / 0.25);
    return f;
  }

  function makeData(L) {
    const N = 700;
    const tt = [];
    const f = [];
    for (let i = 0; i < N; i++) {
      const time = ((i + 0.5) / N) * L.days;
      let v = 1 + L.noise * gauss() + wobble(L, time);
      for (const p of L.planets) v -= p.depth * cover(p, time);
      tt.push(time);
      f.push(v);
    }
    // a running average shows the dips through the noise
    const narrowest = L.planets.length ? Math.min(...L.planets.map((p) => p.half)) : Math.max(0.1, L.days * 0.012) / 2;
    const k = Math.max(2, Math.round((narrowest / L.days) * N * 0.5));
    const avg = f.map((_, i) => {
      let s = 0;
      let n = 0;
      for (let j = Math.max(0, i - k); j <= Math.min(N - 1, i + k); j++) { s += f[j]; n++; }
      return s / n;
    });
    // the spots' wobble alone, to take out before the dips are measured
    const spot = tt.map((time) => spotWobble(L, time));
    const deepest = Math.max(0, ...L.planets.map((p) => p.depth));
    const swing = (L.spots ? L.spots.amp * 1.35 : 0) + 3.5 * L.noise;
    const lo = 1 - deepest - swing;
    const hi = 1 + swing;
    const pad = (hi - lo) * 0.08;
    return { t: tt, f, avg, spot, lo: lo - pad, hi: hi + pad };
  }

  // ---------------------------------------------------------------------------
  // Drawing the graph
  // ---------------------------------------------------------------------------

  const M = { l: 70, r: 14, t: 34, b: 40 }; // room round the plot for labels
  let W = 0;
  let H = 0;

  function resize() {
    const box = $('graphBox');
    const dpr = window.devicePixelRatio || 1;
    W = box.clientWidth;
    H = box.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  const X = (time) => M.l + ((time - state.v0) / state.span) * (W - M.l - M.r);
  const Y = (f) => M.t + ((state.data.hi - f) / (state.data.hi - state.data.lo)) * (H - M.t - M.b);
  const fromY = (y) => state.data.hi - ((y - M.t) / (H - M.t - M.b)) * (state.data.hi - state.data.lo);
  const fromX = (x) => state.v0 + ((x - M.l) / (W - M.l - M.r)) * state.span;

  // ---------------------------------------------------------------------------
  // Zooming in on the time axis, to see the narrow dips better
  // ---------------------------------------------------------------------------

  const MAX_ZOOM = 16;

  // Show span days from v0, kept within the recording.
  function setView(v0, span) {
    const days = state.L.days;
    state.span = clamp(span, days / MAX_ZOOM, days);
    state.v0 = clamp(v0, 0, days - state.span);
    const pan = $('panWin');
    pan.style.left = (100 * state.v0) / days + '%';
    pan.style.width = (100 * state.span) / days + '%';
    $('zoomInBtn').classList.toggle('off', state.span <= days / MAX_ZOOM + 1e-9);
    $('zoomOutBtn').classList.toggle('off', state.span >= days - 1e-9);
    draw();
  }

  // Zoom by a factor, keeping the day at x (px on the graph) in its place.
  function zoomAt(factor, x) {
    const time = fromX(x);
    const span = clamp(state.span / factor, state.L.days / MAX_ZOOM, state.L.days);
    setView(time - ((x - M.l) / (W - M.l - M.r)) * span, span);
  }
  const zoomMiddle = (factor) => zoomAt(factor, (M.l + W - M.r) / 2);

  // Bring a day into view, if it is not on the graph already.
  function showDay(time) {
    if (time < state.v0 || time > state.v0 + state.span) setView(time - state.span / 2, state.span);
  }

  function niceStep(range, n) {
    const raw = range / n;
    const p = 10 ** Math.floor(Math.log10(raw));
    for (const m of [1, 2, 5, 10]) if (m * p >= raw) return m * p;
    return 10 * p;
  }

  function draw() {
    if (!state.L || !W) return;
    const L = state.L;
    const D = state.data;
    ctx.clearRect(0, 0, W, H);
    const x0 = M.l;
    const x1 = W - M.r;
    const y0 = M.t;
    const y1 = H - M.b;
    ctx.fillStyle = 'rgba(5, 8, 30, 0.55)';
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);

    // the grid and the labels
    ctx.font = '700 13px Nunito, sans-serif';
    ctx.textBaseline = 'middle';
    const ys = niceStep(D.hi - D.lo, 4);
    const yd = clamp(-Math.floor(Math.log10(ys * 100) + 1e-9), 0, 3);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillStyle = 'rgba(244, 246, 255, 0.65)';
    ctx.textAlign = 'right';
    for (let v = Math.ceil(D.lo / ys) * ys; v <= D.hi; v += ys) {
      const y = Y(v);
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      ctx.fillText(`${fmt(v * 100, yd)} %`, x0 - 6, y);
    }
    const xs = niceStep(state.span, Math.max(3, Math.floor((x1 - x0) / 90)));
    const xd = clamp(-Math.floor(Math.log10(xs) + 1e-9), 0, 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let v = Math.ceil(state.v0 / xs - 1e-9) * xs; v <= state.v0 + state.span + 1e-9; v += xs) {
      const x = X(v);
      ctx.beginPath();
      ctx.moveTo(x, y0);
      ctx.lineTo(x, y1);
      ctx.stroke();
      ctx.fillText(fmt(Math.abs(v) < 1e-9 ? 0 : v, xd), x, y1 + 6); // not "−0"
    }
    ctx.textAlign = 'right';
    ctx.fillText(t('day'), x1, y1 + 22);
    ctx.save();
    ctx.translate(14, (y0 + y1) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(t('brightness'), 0, 0);
    ctx.restore();

    // the full brightness of the star
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x0, Y(1));
    ctx.lineTo(x1, Y(1));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;

    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, x1 - x0, y1 - y0);
    ctx.clip();

    // a dip pointed at by the hint
    const now = performance.now();
    if (state.hintAt && now < state.hintAt.until) {
      const p = state.hintAt.p;
      const a = 0.25 + 0.2 * Math.sin(now / 120);
      ctx.fillStyle = `rgba(255, 211, 77, ${a})`;
      ctx.fillRect(X(state.hintAt.t - p.half * 2), y0, X(p.half * 4) - X(0), y1 - y0);
    }

    // the measurements, and the running average through them
    const n = D.t.findIndex((v) => v > state.shown);
    const upto = n < 0 ? D.t.length : n;
    // only those on the graph, and one more at each side for the line
    const step = L.days / D.t.length;
    const from = Math.max(0, Math.floor(state.v0 / step) - 1);
    const to = Math.min(upto, Math.ceil((state.v0 + state.span) / step) + 1);
    // with the spots' wobble taken out as much as state.flat says
    const fl = state.flat;
    ctx.fillStyle = 'rgba(159, 216, 255, 0.75)';
    for (let i = from; i < to; i++) {
      ctx.beginPath();
      ctx.arc(X(D.t[i]), Y(D.f[i] - fl * D.spot[i]), 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = from; i < to; i++) ctx.lineTo(X(D.t[i]), Y(D.avg[i] - fl * D.spot[i]));
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.restore();

    // its label, on top of the curve
    const full = `${fmt(100, 0)} %`;
    ctx.font = '900 13px Nunito, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(5, 8, 30, 0.85)';
    ctx.fillRect(x0 + 2, Y(1) - 9, ctx.measureText(full).width + 10, 18);
    ctx.fillStyle = '#fff';
    ctx.fillText(full, x0 + 7, Y(1) + 1);

    // the dips found, with their days above
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    const dd = L.days < 100 ? 1 : 0;
    L.planets.forEach((p, k) => {
      const active = state.phase === 'observe' || state.phase === 'done' || k === state.pi;
      const showDays = state.phase !== 'observe' && k === state.pi;
      p.times.forEach((tc, j) => {
        if (!state.marks[k][j]) return;
        const x = X(tc);
        if (x < x0 - 1 || x > x1 + 1) return;
        ctx.globalAlpha = active ? 1 : 0.3;
        ctx.strokeStyle = COLORS[k];
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(x, y0);
        ctx.lineTo(x, y1);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
        ctx.fillStyle = COLORS[k];
        if (showDays) {
          ctx.font = '900 14px Nunito, sans-serif';
          ctx.fillText(fmt(tc, dd), x, y0 - 4);
        } else {
          ctx.beginPath();
          ctx.arc(x, y0 - 10, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });
    });

    // the ruler for measuring the days between two dips: a line at each
    // end, and an arrow between them with the days above it
    if (state.phase === 'period' && state.gap) {
      const xa = X(state.gap[0]);
      const xb = X(state.gap[1]);
      const ym = (Y(1) + y1) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x0, y0, x1 - x0, y1 - y0);
      ctx.clip();
      ctx.strokeStyle = RULER_COLOR;
      ctx.fillStyle = RULER_COLOR;
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 6]);
      for (const x of [xa, xb]) {
        ctx.beginPath();
        ctx.moveTo(x, y0);
        ctx.lineTo(x, y1);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(xa, ym);
      ctx.lineTo(xb, ym);
      ctx.stroke();
      // the arrow heads, pointing out to the lines
      const dir = Math.sign(xb - xa) || 1;
      for (const [x, s] of [[xa, -dir], [xb, dir]]) {
        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.lineTo(x - s * 12, ym - 8);
        ctx.lineTo(x - s * 12, ym + 8);
        ctx.fill();
      }
      ctx.lineWidth = 1;
      const label = t('days')(fmtP(Math.abs(state.gap[1] - state.gap[0])));
      ctx.font = '900 15px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lw = ctx.measureText(label).width + 16;
      const lx = clamp((xa + xb) / 2, x0 + lw / 2 + 2, x1 - lw / 2 - 2);
      ctx.fillStyle = RULER_COLOR;
      ctx.beginPath();
      ctx.roundRect(lx - lw / 2, ym - 34, lw, 24, 12);
      ctx.fill();
      ctx.fillStyle = '#1a1440';
      ctx.fillText(label, lx, ym - 21);
      ctx.restore();
    }

    // the ruler for measuring a dip's depth
    if (state.phase === 'size' && state.ruler !== null) {
      const y = Y(1 - state.ruler);
      ctx.strokeStyle = RULER_COLOR;
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.fillStyle = RULER_COLOR;
      ctx.beginPath();
      ctx.arc(x1 - 16, y, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1a1440';
      ctx.font = '900 14px Nunito, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText('↕', x1 - 16, y + 1);
    }
  }

  function loop() {
    const L = state.L;
    if (state.phase === 'observe' && state.shown < L.days) {
      state.shown = Math.min(L.days, ((performance.now() - state.t0) / 1000 / OBSERVE_S) * L.days);
      if (state.shown >= L.days) updatePanel();
    }
    const flattening = state.flatT0 && state.flat < 1;
    if (flattening) {
      const x = Math.min(1, (performance.now() - state.flatT0) / 1000 / FLATTEN_S);
      state.flat = x * x * (3 - 2 * x);
      if (x >= 1) state.flat = 1;
    }
    draw();
    const hinting = state.hintAt && performance.now() < state.hintAt.until;
    if ((state.phase === 'observe' && state.shown < L.days) || hinting || flattening) state.raf = requestAnimationFrame(loop);
  }

  function animate() {
    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(loop);
  }

  // ---------------------------------------------------------------------------
  // Game
  // ---------------------------------------------------------------------------

  function startGame() {
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    const real = LEVELS[state.level];
    const L = state.found.includes(real.id) ? makeLevel(state.level) : real.dips ? watchReal(real) : real;
    state.L = L;
    state.data = makeData(L);
    state.marks = L.planets.map((p) => p.times.map(() => false));
    state.phase = 'observe';
    state.pi = 0;
    state.shown = 0;
    state.t0 = performance.now();
    state.ruler = null;
    state.gap = null;
    state.flat = 0;
    state.flatT0 = 0;
    state.hintAt = null;
    state.v0 = 0;
    state.span = L.days;
    updateToggles();
    resize();
    setView(0, L.days);
    updatePanel();
    animate();
  }

  const markedCount = (k) => state.marks[k].filter(Boolean).length;
  const enough = () => state.marks.length > 0 && state.marks.every((m) => m.filter(Boolean).length >= 3);

  // Steps done so far, for the progress bar: the watching, then three
  // questions for each planet.
  function updateProgress() {
    const L = state.L;
    const total = 1 + 3 * L.planets.length;
    const stepOf = { observe: 0, period: 1, size: 2, zone: 3 };
    const done = state.phase === 'done' ? total : state.phase === 'observe' ? 0 : 1 + 3 * state.pi + stepOf[state.phase] - 1;
    $('progressFill').style.width = (100 * done) / total + '%';
    const step = state.phase === 'done' ? 3 : stepOf[state.phase];
    $('progressText').textContent = t('steps')[step];
  }

  function setFeedback(text, good) {
    const el = $('feedback');
    el.textContent = text || '';
    el.classList.toggle('good', !!good);
  }

  function showNext(label, fn) {
    const b = $('nextBtn');
    b.textContent = label;
    b.classList.remove('hidden');
    b.onclick = () => {
      sfx.pick();
      fn();
    };
  }

  // The question for the current step, with its choices.
  function updatePanel() {
    const L = state.L;
    const p = L.planets[state.pi];
    const two = L.planets.length > 1;
    $('starInfo').innerHTML = `${starPic(L.star.color, 'star-dot')}<span><b>${L.star.name}</b> · </span>`;
    $('starInfo').lastChild.append(L.star.about[Astro.lang]);
    $('options').innerHTML = '';
    $('qExtra').innerHTML = '';
    $('nextBtn').classList.add('hidden');
    $('noPlanetBtn').classList.add('hidden');
    updateProgress();

    if (state.phase === 'observe') {
      $('qTitle').textContent = t('observeTitle');
      $('qText').textContent = t('observeText');
      const n = state.marks.reduce((s, m) => s + m.filter(Boolean).length, 0);
      $('qExtra').textContent = t('marked')(n);
      if (enough()) {
        setFeedback(t(two ? 'enoughTwo' : 'enoughOne'), true);
        showNext(t('next'), () => go('period'));
      } else if (state.shown >= L.days) {
        const some = state.marks.some((m) => m.filter(Boolean).length >= 3);
        if (!$('feedback').textContent || $('feedback').classList.contains('good')) {
          setFeedback(two && some ? t('moreKinds') : `${t('moreDips')} ${t('noPlanetNote')}`);
        }
        $('noPlanetBtn').classList.remove('hidden');
      }
      return;
    }

    const title = two ? `${t('planetOf')(p.name)}: ` : '';
    if (state.phase === 'period') {
      $('qTitle').textContent = title + t('periodTitle');
      $('qText').textContent = t('periodText');
      const choices = shuffle([p.P, p.P * 2, p.P / 2, p.P * 3]);
      choices.forEach((v) => addOption(t('days')(fmtP(v)), v === p.P, () => {
        setFeedback(t('periodOk')(fmtP(p.P)), true);
        showNext(t('next'), () => go('size'));
      }, () => periodHint(p)));
    } else if (state.phase === 'size') {
      $('qTitle').textContent = title + t('sizeTitle');
      $('qText').textContent = (L.spots ? t('flattened') + ' ' : '') + t('sizeText') + (L.star.R < 0.5 ? ' ' + t('smallStar') : '') + ' ' + t('zoomTip');
      $('qExtra').appendChild(sizeScale());
      updateScale();
      SIZES.forEach((s, k) => {
        addOption(t('sizeNames')[k], k === p.size, () => {
          setFeedback(t('sizeOk')(t('sizeShort')[k]), true);
          showNext(t('next'), () => go('zone'));
        }, () => setFeedback(`${t('tryAgain')} ${t('sizeWrong')}`));
      });
    } else if (state.phase === 'zone') {
      $('qTitle').textContent = title + t('zoneTitle');
      $('qText').textContent = t('zoneText')(fmt(L.star.hz[0], 0), fmt(L.star.hz[1], 0), fmtP(p.P));
      $('qExtra').appendChild(zoneBar(L, p));
      t('zoneNames').forEach((name, k) => addOption(name, k === p.zone, () => {
        setFeedback(t('zoneOk')[k], true);
        if (state.pi + 1 < L.planets.length) {
          showNext(t('next'), () => {
            state.pi++;
            go('period');
            setFeedback(t('nextPlanet'));
          });
        } else {
          showNext(t('next'), win);
        }
      }, () => setFeedback(`${t('tryAgain')} ${t('zoneHint')}`)));
    }
  }

  function periodHint(p) {
    const a = p.times[0];
    const b = p.times[1];
    const dd = state.L.days < 100 ? 1 : 0;
    setFeedback(`${t('tryAgain')} ${t('periodHint')(fmt(a, dd), fmt(b, dd))}`);
  }

  // A choice button: the right one shows its answer, a wrong one shakes.
  function addOption(label, right, onRight, onWrong) {
    const b = document.createElement('button');
    b.className = 'option';
    b.textContent = label;
    b.addEventListener('click', () => {
      if ($('options').classList.contains('answered')) return;
      if (right) {
        b.classList.add('right');
        $('options').classList.add('answered');
        sfx.snap();
        onRight();
      } else {
        b.classList.remove('wrong');
        void b.offsetWidth; // restart the shake
        b.classList.add('wrong');
        sfx.oops();
        onWrong();
      }
    });
    $('options').classList.remove('answered');
    $('options').appendChild(b);
  }

  // The planet sizes as a scale of dip depths round this star, each size in
  // an equal part, with the pink ruler's depth on it. The edges between
  // the sizes are halfway between them on a log scale, as in prepare().
  const SCALE_EDGES = [SIZES[0] / 3, ...SIZES.slice(1).map((s, k) => Math.sqrt(s * SIZES[k])), SIZES[SIZES.length - 1] * 3];

  // where a dip of this depth goes on the scale, in percent
  function scalePos(depth) {
    const Re = (Math.sqrt(depth) * state.L.star.R) / EARTH_IN_SUN;
    const E = SCALE_EDGES;
    const n = E.length - 1;
    if (Re <= E[0]) return 0;
    for (let k = 0; k < n; k++) {
      if (Re < E[k + 1]) return (100 * (k + Math.log(Re / E[k]) / Math.log(E[k + 1] / E[k]))) / n;
    }
    return 100;
  }

  // a line across the scale, in SVG so that it stays bright in dark mode
  const markPic = (color) =>
    `<svg viewBox="0 0 10 46" preserveAspectRatio="none" aria-hidden="true"><rect x="2" y="2" width="6" height="42" rx="3" fill="${color}" stroke="#1a1440" stroke-width="2"/></svg>`;

  function sizeScale() {
    const el = document.createElement('div');
    el.className = 'size-scale';
    el.innerHTML =
      `<div class="sizes">${t('sizeBar').map((name, k) => `<span class="s${k}">${name}</span>`).join('')}</div>` +
      `<span class="scale-hint hidden">${markPic('#ffffff')}</span><span class="scale-ruler">${markPic(RULER_COLOR)}</span>`;
    return el;
  }

  function updateScale() {
    const el = $('qExtra').querySelector('.scale-ruler');
    if (el) el.style.left = scalePos(state.ruler) + '%';
  }

  // The zones round the star: steam, liquid water, ice, with the periods
  // at the edges and the planet's year as a line.
  function zoneBar(L, p) {
    const el = document.createElement('div');
    el.className = 'zone-bar';
    const names = t('zoneBar');
    el.innerHTML =
      `<div class="zones"><span class="z-hot">${names[0]}</span><span class="z-hz">${names[1]}</span><span class="z-cold">${names[2]}</span></div>` +
      `<div class="zone-ticks"><span style="left:33.3%">${fmt(L.star.hz[0], 0)}</span><span style="left:66.7%">${fmt(L.star.hz[1], 0)}</span></div>`;
    // where the planet goes: on a log scale within its zone
    const [lo, hi] = L.star.hz;
    let pos;
    if (p.P < lo) pos = 33.3 * clamp(1 - Math.log(lo / p.P) / Math.log(lo / (lo / 30)), 0.08, 0.92);
    else if (p.P > hi) pos = 66.7 + 33.3 * clamp(Math.log(p.P / hi) / Math.log(30), 0.08, 0.92);
    else pos = 33.3 + (33.3 * Math.log(p.P / lo)) / Math.log(hi / lo);
    const dot = document.createElement('span');
    dot.className = 'zone-planet';
    dot.style.left = pos + '%';
    dot.innerHTML = markPic(COLORS[L.planets.indexOf(p)]);
    el.appendChild(dot);
    return el;
  }

  function go(phase) {
    state.phase = phase;
    setFeedback('');
    if (phase === 'size') state.ruler = 0;
    // the days ruler from the first dip to part way to the next
    if (phase === 'period') {
      const p = state.L.planets[state.pi];
      state.gap = [p.times[0], p.times[0] + p.P * 0.6];
      showDay(p.times[0]);
    }
    // before the first dip is measured, the spots' wobble is taken out
    if (phase === 'size' && state.L.spots && !state.flatT0) {
      state.flatT0 = performance.now();
      animate();
    }
    updatePanel();
    draw();
  }

  // ---------------------------------------------------------------------------
  // Tapping and dragging on the graph
  // ---------------------------------------------------------------------------

  function local(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // One finger: in the period and size steps it drags the ruler; otherwise
  // a tap marks a dip and a drag moves along the days. Two fingers zoom and
  // move.
  const pointers = new Map();
  let dragging = false; // the ruler
  let gapEnd = 0;       // which end of the days ruler is dragged
  let panFrom = null;   // { x, v0, moved } a drag along the days
  let pinch = null;     // { d, span, time } two fingers at their start

  const twoFingers = () => {
    const [a, b] = [...pointers.values()];
    return { d: Math.max(20, Math.abs(a.x - b.x)), x: (a.x + b.x) / 2 };
  };

  canvas.addEventListener('pointerdown', (e) => {
    if (!state.L) return;
    const at = local(e);
    pointers.set(e.pointerId, at);
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* not a real pointer */ }
    if (pointers.size === 2) {
      const f = twoFingers();
      pinch = { d: f.d, span: state.span, time: fromX(f.x) };
      dragging = false;
      panFrom = null;
    } else if (pointers.size === 1) {
      if (state.phase === 'size') {
        dragging = true;
        moveRuler(at);
      } else if (state.phase === 'period' && state.gap) {
        dragging = true;
        gapEnd = Math.abs(at.x - X(state.gap[0])) <= Math.abs(at.x - X(state.gap[1])) ? 0 : 1;
        moveRuler(at);
      } else panFrom = { x: at.x, v0: state.v0, moved: false };
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    const at = local(e);
    pointers.set(e.pointerId, at);
    if (pinch && pointers.size === 2) {
      const f = twoFingers();
      const span = clamp((pinch.span * pinch.d) / f.d, state.L.days / MAX_ZOOM, state.L.days);
      setView(pinch.time - ((f.x - M.l) / (W - M.l - M.r)) * span, span);
    } else if (dragging) moveRuler(at);
    else if (panFrom) {
      if (Math.abs(at.x - panFrom.x) > 8) panFrom.moved = true;
      if (panFrom.moved) setView(panFrom.v0 - ((at.x - panFrom.x) / (W - M.l - M.r)) * state.span, state.span);
    }
  });
  const stopDrag = (e) => {
    if (!pointers.delete(e.pointerId)) return;
    if (e.type === 'pointerup' && panFrom && !panFrom.moved && !pinch && state.phase === 'observe') tapDip(local(e));
    if (pointers.size < 2) pinch = null;
    dragging = false;
    panFrom = null;
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);

  // the mouse wheel or a touchpad zooms at the pointer, and sideways moves
  canvas.addEventListener('wheel', (e) => {
    if (!state.L) return;
    e.preventDefault();
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      setView(state.v0 + (e.deltaX / (W - M.l - M.r)) * state.span, state.span);
    } else zoomAt(Math.exp(-e.deltaY * 0.004), local(e).x);
  }, { passive: false });

  $('zoomInBtn').addEventListener('click', () => { sfx.pick(); zoomMiddle(2); });
  $('zoomOutBtn').addEventListener('click', () => { sfx.pick(); zoomMiddle(0.5); });

  // The strip under the graph is the whole recording, with the part shown
  // on it: drag that part, or tap the strip to go there.
  let panGrab = null;
  $('pan').addEventListener('pointerdown', (e) => {
    if (!state.L) return;
    const r = $('pan').getBoundingClientRect();
    const at = ((e.clientX - r.left) / r.width) * state.L.days;
    const inside = at >= state.v0 && at <= state.v0 + state.span;
    panGrab = inside ? at - state.v0 : state.span / 2;
    try { $('pan').setPointerCapture(e.pointerId); } catch (err) { /* not a real pointer */ }
    setView(at - panGrab, state.span);
  });
  $('pan').addEventListener('pointermove', (e) => {
    if (panGrab === null) return;
    const r = $('pan').getBoundingClientRect();
    setView(((e.clientX - r.left) / r.width) * state.L.days - panGrab, state.span);
  });
  const stopPan = () => { panGrab = null; };
  $('pan').addEventListener('pointerup', stopPan);
  $('pan').addEventListener('pointercancel', stopPan);

  function moveRuler(at) {
    if (state.phase === 'period') {
      // an end close to a dip of this planet snaps onto it
      const p = state.L.planets[state.pi];
      let time = clamp(fromX(at.x), 0, state.L.days);
      const reach = Math.max(p.half * 1.5, (16 / (W - M.l - M.r)) * state.span);
      const near = p.times.find((tc) => Math.abs(time - tc) < reach);
      if (near !== undefined) time = near;
      state.gap[gapEnd] = time;
    } else {
      state.ruler = clamp(1 - fromY(at.y), 0, 1 - state.data.lo);
      updateScale();
    }
    draw();
  }

  // A tap marks the nearest dip, or says why there is none.
  function tapDip(at) {
    const L = state.L;
    const time = fromX(at.x);
    if (time < 0 || time > state.shown) return;
    const reach = state.span * 0.02;
    let best = null;
    L.planets.forEach((p, k) => p.times.forEach((tc, j) => {
      const d = Math.abs(time - tc);
      if (tc <= state.shown && d < Math.max(reach, p.half * 1.2) && (!best || d < best.d)) best = { k, j, d };
    }));
    if (best) {
      if (state.marks[best.k][best.j]) return;
      state.marks[best.k][best.j] = true;
      sfx.note(markedCount(best.k) + 2 * best.k);
      setFeedback('');
      state.hintAt = null;
    } else {
      sfx.oops();
      const flare = (L.flares || []).find((fl) => time > fl.t - 0.4 && time < fl.t + 1.2);
      setFeedback(t(flare ? 'flare' : L.spots ? 'spot' : 'noise'));
    }
    updatePanel();
    draw();
  }

  // 💡: point at a dip not found yet, or explain the question again.
  function hint() {
    sfx.pick();
    const L = state.L;
    if (state.phase === 'observe') {
      // a dip of the planet with the fewest found
      const order = L.planets.map((p, k) => k).sort((a, b) => markedCount(a) - markedCount(b));
      for (const k of order) {
        const j = L.planets[k].times.findIndex((tc, j) => !state.marks[k][j] && tc <= state.shown);
        if (j >= 0) {
          state.hintAt = { p: L.planets[k], t: L.planets[k].times[j], until: performance.now() + 2500 };
          showDay(state.hintAt.t);
          animate();
          return;
        }
      }
      setFeedback(t(L.planets.length ? 'moreDips' : 'noneHint'));
    } else if (state.phase === 'period') periodHint(L.planets[state.pi]);
    else if (state.phase === 'size') {
      const mark = $('qExtra').querySelector('.scale-hint');
      mark.style.left = scalePos(L.planets[state.pi].depth) + '%';
      mark.classList.remove('hidden');
      setFeedback(t('sizeHint'));
    }
    else if (state.phase === 'zone') setFeedback(t('zoneHint'));
  }

  // "No planet here": right for a star without one, or a nudge to look again.
  function noPlanet() {
    if (state.L.planets.length) {
      sfx.oops();
      setFeedback(t('missed'));
      return;
    }
    sfx.snap();
    win();
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  function fillWin() {
    const box = $('winPlanets');
    box.innerHTML = '';
    const empty = !state.L.planets.length;
    $('winTitle').textContent = t(empty ? 'checked' : 'discovered');
    $('picNote').classList.toggle('hidden', empty);
    $('orbits').classList.toggle('hidden', empty);
    $('madeUp').textContent = t(empty ? 'madeUpEmpty' : 'madeUp');
    if (empty) {
      const row = document.createElement('div');
      row.className = 'win-planet';
      row.innerHTML = `<span class="win-star">${starPic(state.L.star.color)}</span><div><b></b><p class="win-fact"></p></div>`;
      row.querySelector('b').textContent = state.L.star.name;
      row.querySelector('.win-fact').textContent = t('noneRight');
      box.appendChild(row);
    }
    for (const p of state.L.planets) {
      const row = document.createElement('div');
      row.className = 'win-planet';
      row.appendChild(planetImg(p, 'win-planet-pic'));
      const text = document.createElement('div');
      text.innerHTML = '<b></b><p class="win-sum"></p><p class="win-fact"></p>';
      text.querySelector('b').textContent = p.name;
      text.querySelector('.win-sum').textContent = summary(p);
      text.querySelector('.win-fact').textContent = p.fact[Astro.lang];
      row.appendChild(text);
      box.appendChild(row);
    }
    $('nextLevelBtn').classList.toggle('hidden', state.level + 1 >= LEVELS.length);
    $('madeUp').classList.toggle('hidden', !state.L.generated);
    if (!empty) orbitScheme(state.L);
  }

  // The star seen from above, with the habitable zone as a green ring and
  // each planet going round on its orbit. The orbits are on a log scale of
  // the period, so that a planet close to the star and the zone far out
  // both fit; the inner one is still the faster, as the real one is.
  let orbitRun = 0;
  function orbitScheme(L) {
    const el = $('orbits');
    const run = ++orbitRun;
    const Ps = L.planets.map((p) => p.P);
    const [h0, h1] = L.star.hz;
    const lo = Math.min(h0, ...Ps) / 1.6;
    const hi = Math.max(h1, ...Ps) * 1.3;
    const rad = (P) => 26 + (66 * Math.log(P / lo)) / Math.log(hi / lo);
    const r0 = rad(h0);
    const r1 = rad(h1);
    const rm = (r0 + r1) / 2;
    let svg =
      `<svg viewBox="-100 -100 200 200" aria-hidden="true">` +
      `<circle r="${r0}" fill="#ff7a4a" opacity="0.35"/>` +
      `<circle r="${rm}" fill="none" stroke="#4fd08a" stroke-width="${r1 - r0}" opacity="0.45"/>` +
      `<circle r="${(r1 + 98) / 2}" fill="none" stroke="#6fa8ff" stroke-width="${98 - r1}" opacity="0.2"/>` +
      `<path id="hzArc" fill="none" d="M ${-rm} 0 A ${rm} ${rm} 0 0 1 ${rm} 0"/>` +
      `<text class="orbit-label" dy="0.35em"><textPath href="#hzArc" startOffset="50%" text-anchor="middle">${t('hzName')}</textPath></text>` +
      L.planets.map((p, k) => `<circle r="${rad(p.P)}" fill="none" stroke="${COLORS[k]}" stroke-width="1.2" opacity="0.8"/>`).join('') +
      starPic(L.star.color).replace('<svg class=""', '<svg x="-18" y="-18" width="36" height="36"') +
      L.planets.map((p, k) => {
        const d = 9 + 4 * Math.sqrt(p.Re);
        return `<g class="orbit-planet"><image x="${-d / 2}" y="${-d / 2}" width="${d}" height="${d}" style="filter:${p.filter}"/></g>`;
      }).join('') +
      `</svg>`;
    el.innerHTML = svg + `<p class="orbit-note">${t('notToScale')}</p>`;
    const groups = [...el.querySelectorAll('.orbit-planet')];
    L.planets.forEach((p, k) => withPic(p.pic, (pic) => groups[k].querySelector('image').setAttribute('href', pic.url)));
    // the fastest planet goes round in 5 s, the others in step with it
    const fast = Math.min(...Ps);
    const start = L.planets.map(() => Math.random() * 2 * Math.PI);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    const place = (now) => {
      if (run !== orbitRun || $('win').classList.contains('hidden')) return;
      L.planets.forEach((p, k) => {
        const a = start[k] - ((now - t0) / 5000) * (fast / p.P) * 2 * Math.PI;
        const r = rad(p.P);
        groups[k].setAttribute('transform', `translate(${(r * Math.cos(a)).toFixed(2)} ${(r * Math.sin(a)).toFixed(2)})`);
      });
      if (!still) requestAnimationFrame(place);
    };
    place(t0);
  }

  function win() {
    state.phase = 'done';
    updateProgress();
    draw();
    if (state.L.id && !state.found.includes(state.L.id)) {
      state.found.push(state.L.id);
      store.set('found', state.found);
    }
    state.L.planets.forEach((p) => state.catalogue.push(entry(p)));
    if (!state.L.planets.length) state.catalogue.push({ name: state.L.star.name, empty: true, color: state.L.star.color });
    store.set('catalogue', state.catalogue);
    sfx.win();
    $('win').classList.remove('hidden');
    fillWin();
    Astro.startConfetti($('confetti'));
  }

  // ---------------------------------------------------------------------------
  // Buttons & resizing
  // ---------------------------------------------------------------------------

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden')) resize();
  }).observe($('graphBox'));

  $('playBtn').addEventListener('click', startGame);
  $('newStarBtn').addEventListener('click', startGame);
  $('nextLevelBtn').addEventListener('click', () => {
    state.level = Math.min(LEVELS.length - 1, state.level + 1);
    store.set('level', state.level);
    startGame();
  });
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('resetBtn').addEventListener('click', () => {
    if (!window.confirm(t('resetAsk'))) return;
    state.found = [];
    state.catalogue = [];
    store.set('found', state.found);
    store.set('catalogue', state.catalogue);
    updateMenu();
  });
  $('hintBtn').addEventListener('click', hint);
  $('noPlanetBtn').addEventListener('click', () => { if (state.phase === 'observe') noPlanet(); });
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  buildMenu();
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    if (!$('game').classList.contains('hidden') && state.L) {
      const fb = $('feedback').textContent;
      updatePanel();
      if (!fb) setFeedback('');
      draw();
    }
    if (!$('win').classList.contains('hidden')) fillWin();
  });
})();
