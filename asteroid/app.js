'use strict';

(() => {
  const { $, clamp, rand, shuffle, sfx } = Astro;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // The sky picture is FIELD pixels square and 1° across, two Moon widths.
  // Everything in it is made up: the stars, the asteroid, the noise and the
  // things that are not asteroids. A level takes frames pictures on as many
  // nights, plus extra ones shown later; stars is how many stars there are,
  // and ast how bright the asteroid is, both against noise of 1.
  const FIELD = 1000;
  const MOON = FIELD / 2;
  const LEVELS = [
    {
      id: 'clear', frames: 2, stars: 120, ast: 60, steps: ['find'],
      decoys: {},
      name: { et: 'Selge vilgutus', en: 'A clear blink' },
      about: { et: 'Kaks pilti, vähe tähti', en: 'Two pictures, few stars' }
    },
    {
      id: 'crowd', frames: 2, stars: 900, ast: 9, far: true, steps: ['find', 'speed'],
      decoys: { variable: 1, cosmic: 2 },
      name: { et: 'Tähtede rägastik', en: 'A crowd of stars' },
      about: { et: 'Palju tähti ja nõrk asteroid', en: 'Many stars and a faint asteroid' }
    },
    {
      id: 'nights', frames: 3, extra: 1, stars: 400, ast: 15, far: true, steps: ['find', 'predict', 'speed'],
      decoys: { variable: 1, cosmic: 2, satellite: 0.5 },
      name: { et: 'Kolm ööd', en: 'Three nights' },
      about: { et: 'Leia tee ja ennusta, kus ta homme on', en: 'Find the path and say where it will be next' }
    },
    {
      id: 'fast', frames: 3, stars: 400, ast: 22, near: true, steps: ['find', 'speed', 'orbit'],
      decoys: { variable: 1, cosmic: 2, satellite: 1 },
      name: { et: 'Kiire külaline', en: 'A fast visitor' },
      about: { et: 'Asteroid Maa lähedal', en: 'An asteroid near the Earth' }
    }
  ];

  // Where an asteroid goes round the Sun, by how far it moves among the
  // stars in a night: 0 beyond Neptune, 1 in the asteroid belt, 2 near the
  // Earth. The edges of the kinds on the scale, in pixels a night.
  const SPEED_EDGES = [6, 40, 250, 1000];
  const PSF = 1.5;               // how blurred the stars are (px)
  const BLINK_MS = 650;          // how long each picture shows when blinking
  const MAX_ZOOM = 8;
  const MARK_COLOR = '#ffd34d';
  const RULER_COLOR = '#ff8ad8';
  // where on its path each planet is drawn (radians from the right, clockwise)
  const PLANET_ANGLES = { mercury: 0.3, venus: 2.4, earth: -1.57, mars: 0.9, jupiter: 2.5, saturn: -0.6, uranus: 1.3, neptune: -2.4 };
  const ROCK_COLORS = ['#cfe6ff', '#b3a796', '#d0906a'];
  // the planets on the paths round the Sun: distance (AU), colour, size
  const PLANETS = [
    ['mercury', 0.39, '#b9b0a4', 2.2], ['venus', 0.72, '#f2d29b', 2.8], ['earth', 1, '#5fa8ff', 3],
    ['mars', 1.52, '#ff7b4a', 2.6], ['jupiter', 5.2, '#e8c9a0', 4.5], ['saturn', 9.54, '#f0dca0', 4],
    ['uranus', 19.2, '#9fe8f0', 3.4], ['neptune', 30.1, '#6f8cff', 3.4]
  ];

  const TEXT = {
    et: {
      title: 'Leia asteroid',
      intro1: 'Asteroidid on kivimürakad, mis tiirlevad ümber Päikese. Teleskoobis paistavad nad täpselt nagu tähed.',
      intro2: 'Teleskoop pildistab sama taevalaiku mitmel ööl. Tähed püsivad paigal, aga asteroid liigub. Vilguta pilte ja leia, mis liigub!',
      chooseLevel: 'Vali tase',
      catalogue: 'Sinu asteroidid',
      play: 'Alusta',
      menu: 'Menüü',
      newField: 'Uus taevalaik',
      nextLevel: 'Järgmine tase',
      reset: '🗑️ Kustuta kõik avastused',
      resetAsk: 'Kas kustutada kõik sinu avastused?',
      allGames: 'Kõik mängud',
      hint: 'Vihje',
      sound: 'Heli',
      next: 'Edasi ▶',
      zoomIn: 'Suurenda',
      zoomOut: 'Vähenda',
      blink: 'Vilguta',
      night: (n) => `Öö ${n}`,
      steps: { find: 'Leia', predict: 'Ennusta', speed: 'Kui kiiresti?', orbit: 'Maa lähedal?' },
      findTitle: '🔍 Leia asteroid',
      findText: (n) => `Teleskoop pildistas sama taevalaiku ${['', '', 'kahel', 'kolmel'][n]} ööl järjest. Vilguta pilte ja otsi täppi, mis hüppab paigast paika. Puuduta asteroidi igal pildil.`,
      zoomTip: 'Nupuga + saad pilti suurendada ja lohistades liigutada.',
      foundOne: (night, left) => `Leidsid ta ${night}. ööl! Leia ta veel ${['', 'ühelt', 'kahelt'][left]} pildilt.`,
      foundAll: 'Tubli! Asteroid liigub tähtede vahel iga ööga edasi. Tähed on nii kaugel, et nad paistavad paigal.',
      already: 'Selle oled juba leidnud. Otsi teda teiselt pildilt.',
      star: 'See on täht: ta on igal pildil samas kohas.',
      variable: 'See täht muudab heledust, aga ei liigu paigast. Asteroid on igal pildil eri kohas.',
      cosmic: 'See on kosmilise kiire jälg kaameras. Seda on ainult ühel pildil, ja see on tähtedest teravam.',
      satellite: 'Satelliit lendas pildistamise ajal üle taeva ja jättis triibu. Asteroid on täpp, mitte triip.',
      noise: 'Siin on ainult tühi taevas ja müra.',
      findHint: 'Asteroid on helendava ringi sees. Vajuta 💡 uuesti, siis jääb ring väiksemaks.',
      predictTitle: (n) => `🎯 Kus on ta ${n}. ööl?`,
      predictText: (n) => `Asteroid liigub iga ööga sama palju ja samas suunas. Puuduta kohta, kus ta on ${n}. ööl.`,
      predictWrong: (n) => `Vaata, kui palju liigub asteroid ühest ööst teiseni. ${n}. ööl on ta jälle sama palju edasi.`,
      predictLine: 'Kriipsjoon näitab, kuhu asteroid edasi liigub.',
      predictOk: (n) => `Õige! ${n}. öö pilt näitab asteroidi just seal. Nii arvutavad astronoomid ette, kus asteroid järgmisel ööl on, ja leiavad ta uuesti.`,
      speedTitle: '📏 Kui kiiresti?',
      speedText: 'Mida lähemal asteroid on, seda kiiremini paistab ta tähtede vahel liikuvat. Lohista roosa joone otsad asteroidi peale kahel järjestikusel ööl ja vaata skaalalt, kus ta tiirleb.',
      fieldSize: 'Kogu pilt on kahe Kuu läbimõõdu laiune.',
      moonWidths: (v) => `${v} Kuu läbimõõtu`,
      speedNames: ['Neptuunist kaugemal: liigub väga aeglaselt', 'Asteroidide vöös Marsi ja Jupiteri vahel', 'Maa lähedal: liigub kiiresti'],
      speedBar: ['Neptuuni taga', 'vöö', 'Maa lähedal'],
      speedWrong: 'Vaata, kuhu roosa kriips skaalal jääb.',
      speedHint: 'Pane roosa joone otsad 1. ja 2. öö asteroidi peale. Hele kriips skaalal näitab õiget kohta.',
      speedOk: [
        'Õige! Ta on Neptuunist kaugemal, kus Päikese valgus on nõrk ja kõik on jääs. Seepärast liigub ta nii aeglaselt.',
        'Õige! Ta tiirleb asteroidide vöös Marsi ja Jupiteri vahel, kus on enamik asteroide.',
        'Õige! Ta on Maa lähedal, seepärast liigub ta tähtede vahel nii kiiresti.'
      ],
      orbitTitle: '🌍 Kas ta tuleb Maa lähedale?',
      orbitText: 'Asteroidi asukohtadest mitmel ööl arvutasid astronoomid välja tema tee ümber Päikese. Roosa on asteroidi tee ja sinine Maa tee.',
      orbitNames: ['Tema tee ristub Maa teega', 'Ta tuleb Maa tee lähedale, aga ei ristu sellega', 'Ta jääb Marsi ja Jupiteri vahele'],
      orbitWrong: 'Vaata, kus roosa tee on sinise Maa tee suhtes.',
      orbitHint: 'Sinine ring on Maa tee. Kas roosa tee läheb sellest läbi või jääb väljapoole?',
      orbitOk: [
        'Õige! Tema tee ristub Maa teega. Maa ja asteroid on aga väga harva samal ajal samas kohas. Astronoomid arvutavad tema tee aastateks ette, ja see asteroid möödub Maast ohutult.',
        'Õige! Ta tuleb Maa tee lähedale, aga jääb sellest väljapoole. Astronoomid jälgivad ka selliseid asteroide, et teada nende teed täpselt.'
      ],
      tryAgain: 'Proovi uuesti.',
      discovered: 'Avastasid asteroidi!',
      discoveredFar: 'Avastasid kauge jäise maailma!',
      pickName: 'Vali talle nimi:',
      nameNote: 'Enne nime saab asteroid ajutise tähise: aasta, poolkuu täht ja järjekord. Nime pakub välja avastaja.',
      madeUp: 'See asteroid on välja mõeldud, aga just nii leitakse päris asteroide.',
      notToScale: 'Kaugused pole õiges mõõtkavas.',
      planets: { earth: 'Maa', mars: 'Marss', jupiter: 'Jupiter', neptune: 'Neptuun' },
      kindShort: ['Neptuunist kaugemal', 'asteroidide vöös', 'Maa lähedal'],
      summary: (kind, v) => `Tiirleb ${kind} ja liigub ööga ${v} Kuu läbimõõtu.`,
      crosses: ['Tema tee ristub Maa teega.', 'Tuleb Maa tee lähedale.'],
      facts: [
        ['Clyde Tombaugh leidis 1930. aastal Pluuto täpselt nii: ta vilgutas kahte eri ööl tehtud fotot ja otsis täppi, mis liigub.',
          'Neptuunist kaugemal tiirleb tuhandeid jäiseid kehi. Mõned neist, näiteks Pluuto ja Eris, on kääbusplaneedid.'],
        ['Esimese asteroidi, Cerese, leidis Giuseppe Piazzi 1801. aastal. Nüüd peetakse Cerest kääbusplaneediks.',
          'Asteroide on leitud üle miljoni, ja enamik neist tiirleb Marsi ja Jupiteri vahel.',
          'Asteroidid on tükid, mis jäid üle, kui planeedid 4,6 miljardit aastat tagasi tekkisid.'],
        ['Maa lähedal tiirlevaid asteroide otsitakse igal ööl, et teada nende teed aastateks ette. Praegu pole teada ühtki suurt asteroidi, mis lähema saja aasta jooksul Maale kukuks.',
          'Kosmosesond DART põrkas 2022. aastal asteroidi Dimorphos vastu ja muutis tema teed. Nii katsetati, kuidas asteroidi vajaduse korral eemale lükata.']
      ],
      // asteroids named after Estonia, its places and people
      estonian: [
        'Asteroid 1541 Estonia sai nime Eesti järgi. Selle avastas Soome astronoom Yrjö Väisälä 1939. aastal.',
        'Asteroid 2099 Öpik on nime saanud Eesti astronoomi Ernst Öpiku järgi, kes töötas Tartus ja uuris meteoore, komeete ja asteroide.',
        'Asteroid 1743 Schmidt on nime saanud Naissaarel sündinud Bernhard Schmidti järgi. Ta kaotas noorena parema käe, aga lihvis ikkagi teleskoopide peegleid ja leiutas Schmidti kaamera, millega saab pildistada korraga suurt taevalaiku.',
        'Asteroid 768 Struveana kannab astronoomide Struvede nime. Friedrich Georg Wilhelm Struve töötas Tartu tähetornis ja oli üks esimesi, kes mõõtis, kui kaugel on üks täht.',
        'Asteroid 11577 Einasto on nime saanud Tartu astronoomi Jaan Einasto järgi. Ta aitas avastada, et galaktikad paiknevad kosmoses nagu hiiglaslikus võrgus, mille silmade vahel on suured tühjad alad.',
        'Asteroid 4227 Kaali on nime saanud Saaremaa Kaali kraatri järgi. Kraatri tekitas meteoriit, mis kukkus sinna umbes 3500 aastat tagasi.',
        'Asteroid 11829 Tuvikene on nime saanud Eesti astronoomi Tõnu Tuvikese järgi.',
        'Asteroide on nimetatud ka laulja Georg Otsa (3738 Ots), helilooja Arvo Pärdi (4087 Pärt) ja luuletaja Jaan Kaplinski (29528 Kaplinski) järgi.',
        'Eesti kohtade järgi on nime saanud asteroidid 4163 Saaremaa, 35347 Tallinn, 35618 Tartu ja 13995 Tõravere. Tõraveres asub Tartu Ülikooli Tartu observatoorium, Eesti kosmosekeskus.'
      ],
      names: ['Kullerkupp', 'Sinilill', 'Ilmarine', 'Vanemuine', 'Linda', 'Kalev', 'Tõll', 'Lennuk', 'Säde', 'Virmaline', 'Rändur', 'Kivike', 'Tuisk', 'Kaja',
        'Udu', 'Välk', 'Piret', 'Ahti', 'Pikker', 'Äike', 'Vikerkaar', 'Tähetolm', 'Lumehelves', 'Merevaik', 'Kaste', 'Hõbe', 'Laine', 'Kiir',
        'Helk', 'Tulukene', 'Kõu', 'Rahe', 'Rändrahn', 'Ränikivi', 'Kalevipoeg', 'Olevipoeg', 'Sulevipoeg', 'Salme', 'Kratt', 'Näkk', 'Tont',
        'Tuuleema', 'Härmatis', 'Jäälill', 'Vine', 'Tuuleke', 'Pilveke', 'Sära', 'Kuma', 'Tulesäde', 'Kristall', 'Pärl', 'Graniit', 'Haldjas',
        'Päkapikk', 'Vetevana', 'Metsaema', 'Hiid', 'Vägilane', 'Alevipoeg', 'Kanarbik', 'Sammal', 'Sõnajalg', 'Kadakas', 'Pihlakas', 'Rukkilill',
        'Kellukas', 'Ristik', 'Jaanimardikas', 'Ööbik', 'Pääsuke', 'Lõoke', 'Kurg', 'Rähn', 'Öökull', 'Siil', 'Orav', 'Ilves', 'Kvarts', 'Basalt',
        'Marmor', 'Paekivi', 'Raudkivi', 'Torm', 'Tuulispask', 'Vihmapiisk', 'Jääpurikas', 'Kastepiisk', 'Lumepall', 'Allikas', 'Kosk', 'Leek',
        'Lõke', 'Tungal', 'Küünal', 'Läige', 'Vilgatus', 'Hulkur', 'Uitaja', 'Seikleja']
    },
    en: {
      title: 'Find the Asteroid',
      intro1: 'Asteroids are lumps of rock that go round the Sun. Through a telescope they look just like stars.',
      intro2: 'The telescope takes pictures of the same patch of sky on several nights. The stars stay put, but an asteroid moves. Flip between the pictures and find what moves!',
      chooseLevel: 'Pick a level',
      catalogue: 'Your asteroids',
      play: 'Start',
      menu: 'Menu',
      newField: 'New patch of sky',
      nextLevel: 'Next level',
      reset: '🗑️ Clear all discoveries',
      resetAsk: 'Clear all your discoveries?',
      allGames: 'All games',
      hint: 'Hint',
      sound: 'Sound',
      next: 'Next ▶',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      blink: 'Blink',
      night: (n) => `Night ${n}`,
      steps: { find: 'Find', predict: 'Predict', speed: 'How fast?', orbit: 'Near the Earth?' },
      findTitle: '🔍 Find the asteroid',
      findText: (n) => `The telescope took pictures of the same patch of sky on ${['', '', 'two', 'three'][n]} nights in a row. Flip between them and look for a dot that jumps from place to place. Tap the asteroid in every picture.`,
      zoomTip: 'With the + button you can zoom in, and drag to move around.',
      foundOne: (night, left) => `You found it on night ${night}! Find it in ${['', 'one more picture', 'two more pictures'][left]}.`,
      foundAll: 'Well done! The asteroid moves on among the stars every night. The stars are so far away that they seem to stand still.',
      already: 'You have found this one already. Look for it in another picture.',
      star: 'This is a star: it is in the same place in every picture.',
      variable: 'This star changes its brightness, but it does not move. An asteroid is in a different place in each picture.',
      cosmic: 'This is the track of a cosmic ray in the camera. It is in only one picture, and it is sharper than the stars.',
      satellite: 'A satellite flew across the sky while the picture was taken and left a streak. An asteroid is a dot, not a streak.',
      noise: 'There is only empty sky and noise here.',
      findHint: 'The asteroid is inside the glowing ring. Press 💡 again to make the ring smaller.',
      predictTitle: (n) => `🎯 Where is it on night ${n}?`,
      predictText: (n) => `The asteroid moves the same distance in the same direction every night. Tap the place where it is on night ${n}.`,
      predictWrong: (n) => `See how far the asteroid moves from one night to the next. On night ${n} it has moved on the same distance again.`,
      predictLine: 'The dashed line shows where the asteroid goes next.',
      predictOk: (n) => `Right! The picture of night ${n} shows the asteroid just there. This is how astronomers work out where an asteroid will be the next night, and find it again.`,
      speedTitle: '📏 How fast?',
      speedText: 'The closer an asteroid is, the faster it seems to move among the stars. Drag the ends of the pink line onto the asteroid on two nights in a row, and see on the scale where it goes round the Sun.',
      fieldSize: 'The whole picture is two Moon widths across.',
      moonWidths: (v) => `${v} Moon widths`,
      speedNames: ['Beyond Neptune: it moves very slowly', 'In the asteroid belt between Mars and Jupiter', 'Near the Earth: it moves fast'],
      speedBar: ['beyond Neptune', 'belt', 'near the Earth'],
      speedWrong: 'See where the pink mark is on the scale.',
      speedHint: 'Put the ends of the pink line on the asteroid of nights 1 and 2. The pale mark on the scale shows the right place.',
      speedOk: [
        'Right! It is beyond Neptune, where the sunlight is weak and everything is frozen. That is why it moves so slowly.',
        'Right! It goes round in the asteroid belt between Mars and Jupiter, where most asteroids are.',
        'Right! It is near the Earth, which is why it moves so fast among the stars.'
      ],
      orbitTitle: '🌍 Does it come near the Earth?',
      orbitText: 'From where the asteroid was on several nights, astronomers worked out its path round the Sun. The asteroid\'s path is pink and the Earth\'s is blue.',
      orbitNames: ['Its path crosses the Earth\'s', 'It comes close to the Earth\'s path but does not cross it', 'It stays between Mars and Jupiter'],
      orbitWrong: 'See where the pink path is compared with the blue path of the Earth.',
      orbitHint: 'The blue ring is the Earth\'s path. Does the pink path cross it, or stay outside it?',
      orbitOk: [
        'Right! Its path crosses the Earth\'s. But the Earth and the asteroid are very rarely in the same place at the same time. Astronomers work out its path years ahead, and this asteroid passes the Earth safely.',
        'Right! It comes close to the Earth\'s path but stays outside it. Astronomers keep watching asteroids like this too, to know their paths exactly.'
      ],
      tryAgain: 'Try again.',
      discovered: 'You discovered an asteroid!',
      discoveredFar: 'You discovered a distant icy world!',
      pickName: 'Pick a name for it:',
      nameNote: 'Before it has a name, an asteroid gets a temporary label: the year, a letter for the half of the month and its number. The discoverer suggests the name.',
      madeUp: 'This asteroid is made up, but this is just how real asteroids are found.',
      notToScale: 'The distances are not to scale.',
      planets: { earth: 'Earth', mars: 'Mars', jupiter: 'Jupiter', neptune: 'Neptune' },
      kindShort: ['beyond Neptune', 'in the asteroid belt', 'near the Earth'],
      summary: (kind, v) => `It goes round the Sun ${kind} and moves ${v} Moon widths a night.`,
      crosses: ['Its path crosses the Earth\'s.', 'It comes close to the Earth\'s path.'],
      facts: [
        ['Clyde Tombaugh found Pluto in 1930 just like this: he flipped between two photos taken on different nights and looked for a dot that moved.',
          'Thousands of icy bodies go round the Sun beyond Neptune. Some of them, like Pluto and Eris, are dwarf planets.'],
        ['The first asteroid, Ceres, was found by Giuseppe Piazzi in 1801. Now Ceres is counted as a dwarf planet.',
          'More than a million asteroids have been found, and most of them go round between Mars and Jupiter.',
          'Asteroids are pieces left over from when the planets formed 4.6 billion years ago.'],
        ['Asteroids near the Earth are searched for every night, so that their paths are known years ahead. No big asteroid is known that would hit the Earth in the next hundred years.',
          'In 2022 the DART spacecraft crashed into the asteroid Dimorphos and changed its path. It was a test of how to push an asteroid away if we ever need to.']
      ],
      estonian: [
        'The asteroid 1541 Estonia was named after Estonia. It was found by the Finnish astronomer Yrjö Väisälä in 1939.',
        'The asteroid 2099 Öpik is named after the Estonian astronomer Ernst Öpik, who worked in Tartu and studied meteors, comets and asteroids.',
        'The asteroid 1743 Schmidt is named after Bernhard Schmidt, who was born on the Estonian island of Naissaar. He lost his right hand as a boy, but still ground mirrors for telescopes, and invented the Schmidt camera, which takes pictures of a large patch of sky at once.',
        'The asteroid 768 Struveana is named after the Struve family of astronomers. Friedrich Georg Wilhelm Struve worked at the Tartu Observatory and was one of the first to measure how far away a star is.',
        'The asteroid 11577 Einasto is named after the Tartu astronomer Jaan Einasto. He helped find out that the galaxies lie in a giant web, with huge empty spaces between its threads.',
        'The asteroid 4227 Kaali is named after the Kaali crater on Saaremaa. The crater was made by a meteorite that fell there about 3500 years ago.',
        'The asteroid 11829 Tuvikene is named after the Estonian astronomer Tõnu Tuvikene.',
        'Asteroids are also named after the singer Georg Ots (3738 Ots), the composer Arvo Pärt (4087 Pärt) and the poet Jaan Kaplinski (29528 Kaplinski).',
        'Asteroids named after places in Estonia are 4163 Saaremaa, 35347 Tallinn, 35618 Tartu and 13995 Tõravere. Tõravere is the home of the Tartu Observatory of the University of Tartu, the Estonian space centre.'
      ],
      names: ['Pebble', 'Wanderer', 'Spark', 'Willow', 'Thistle', 'Flint', 'Echo', 'Pip', 'Rocky', 'Cosmo', 'Puddle', 'Dandelion', 'Misty', 'Breeze', 'Bolt',
        'Ember', 'Glimmer', 'Twinkle', 'Hazel', 'Zephyr', 'Frost', 'Amber', 'Dewdrop', 'Thunder', 'Rainbow', 'Silver', 'Ripple', 'Starling',
        'Sparkle', 'Hailstone', 'Bramble', 'Boulder', 'Nugget', 'Pumice', 'Granite', 'Crystal', 'Pearl', 'Quartz', 'Jasper', 'Opal', 'Drifter',
        'Nomad', 'Tumble', 'Whirl', 'Gust', 'Drizzle', 'Snowflake', 'Icicle', 'Cinder', 'Flicker', 'Shimmer', 'Gleam', 'Pixie', 'Sprite', 'Meadow',
        'Elf', 'Gnome', 'Troll', 'Imp', 'Wisp', 'Giant', 'Heather', 'Moss', 'Fern', 'Juniper', 'Rowan', 'Cornflower', 'Bluebell', 'Clover',
        'Firefly', 'Nightingale', 'Swallow', 'Skylark', 'Crane', 'Woodpecker', 'Owl', 'Hedgehog', 'Squirrel', 'Lynx', 'Basalt', 'Marble',
        'Limestone', 'Cobble', 'Storm', 'Whirlwind', 'Raindrop', 'Snowball', 'Brook', 'Waterfall', 'Flame', 'Bonfire', 'Torch', 'Candle', 'Glint',
        'Blink', 'Rambler', 'Roamer', 'Wayfarer', 'Pinecone', 'Acorn']
    }
  };

  const t = (key) => TEXT[Astro.lang][key];
  const fmt = (v, d) => v.toLocaleString(Astro.lang === 'et' ? 'et-EE' : 'en-GB', { minimumFractionDigits: d, maximumFractionDigits: d });
  const moonFmt = (px) => fmt(px / MOON, 2);

  // ---------------------------------------------------------------------------
  // A patch of sky: the stars, the asteroid and the things that are not it
  // ---------------------------------------------------------------------------

  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  // A provisional label like real ones: the year, a letter for the half of
  // the month (A for 1–15 January, B for 16–31 January, …, no I), a
  // second letter and a number.
  function designation() {
    const d = new Date();
    const half = 'ABCDEFGHJKLMNOPQRSTUVWXY'[d.getMonth() * 2 + (d.getDate() > 15 ? 1 : 0)];
    return { des: `${d.getFullYear()} ${half}${pick('ABCDEFGHJKLMNOPQRSTUVWXYZ'.split(''))}`, num: Math.floor(rand(1, 100)) };
  }

  // Its path round the Sun, from its kind: a (AU) and e of an ellipse,
  // turned by w. A near one either crosses the Earth's path or keeps just
  // outside it.
  function makeOrbit(kind, cross) {
    let a;
    let e;
    if (kind === 0) {
      a = rand(39, 46);
      e = rand(0.05, 0.2);
    } else if (kind === 1) {
      a = rand(2.3, 3.1);
      e = rand(0.04, 0.18);
    } else if (cross) {
      a = rand(1.3, 2.0);
      e = 1 - rand(0.45, 0.75) / a;
    } else {
      a = rand(1.6, 2.2);
      e = 1 - rand(1.22, 1.33) / a;
    }
    return { a, e, w: rand(0, 2 * Math.PI), M0: rand(0, 2 * Math.PI) };
  }

  function makeField(L) {
    const kind = L.near ? 2 : L.far && Math.random() < 1 / 6 ? 0 : 1;
    const cross = kind === 2 && Math.random() < 0.6;
    const speed = [rand(12, 25), rand(100, 170), rand(320, 400)][kind];
    const n = L.frames + (L.extra || 0);
    // the asteroid's place on each night, all inside the picture
    const m = 70;
    let pos;
    for (let k = 0; k < 200; k++) {
      const ang = rand(0, 2 * Math.PI);
      const dx = Math.cos(ang) * speed * (n - 1);
      const dy = Math.sin(ang) * speed * (n - 1);
      const x0 = [m - Math.min(0, dx), FIELD - m - Math.max(0, dx)];
      const y0 = [m - Math.min(0, dy), FIELD - m - Math.max(0, dy)];
      if (x0[0] > x0[1] || y0[0] > y0[1]) continue;
      const sx = rand(x0[0], x0[1]);
      const sy = rand(y0[0], y0[1]);
      pos = Array.from({ length: n }, (_, j) => ({ x: sx + (dx * j) / (n - 1), y: sy + (dy * j) / (n - 1) }));
      break;
    }
    const step = { x: pos[1].x - pos[0].x, y: pos[1].y - pos[0].y };
    const away = (p, r) => pos.every((q) => dist(p, q) > r);
    const spot = (r) => {
      for (let k = 0; k < 100; k++) {
        const p = { x: rand(30, FIELD - 30), y: rand(30, FIELD - 30) };
        if (away(p, r)) return p;
      }
      return { x: 30, y: 30 };
    };

    // many faint stars and a few bright ones; none right on the asteroid
    const stars = [];
    for (let k = 0; k < L.stars; k++) {
      const p = { x: rand(0, FIELD), y: rand(0, FIELD), A: Math.min(3000, 3 + 7 * Math.random() ** -1.2) };
      if (away(p, p.A > 200 ? 26 : 12)) stars.push(p);
    }
    const D = L.decoys;
    // a star that is bright on one night and faint on the next
    const variables = Array.from({ length: D.variable || 0 }, () => {
      const p = spot(40);
      const hi = rand(30, 60);
      const lo = hi / rand(3.5, 5);
      const first = Math.random() < 0.5;
      p.As = Array.from({ length: n }, (_, j) => ((j % 2 === 0) === first ? hi : lo));
      return p;
    });
    // cosmic rays: a few sharp pixels on one picture
    const cosmics = Array.from({ length: D.cosmic || 0 }, () => {
      const p = spot(30);
      p.frame = Math.floor(rand(0, L.frames));
      const len = Math.floor(rand(1, 5));
      const ang = rand(0, 2 * Math.PI);
      p.px = Array.from({ length: len }, (_, j) => [Math.round(p.x + Math.cos(ang) * j), Math.round(p.y + Math.sin(ang) * j)]);
      return p;
    });
    // a satellite's streak across one picture, not over the asteroid
    const sats = [];
    if (Math.random() < (D.satellite || 0)) {
      for (let k = 0; k < 50; k++) {
        const frame = Math.floor(rand(0, L.frames));
        const ang = rand(0, Math.PI);
        const c = { x: rand(200, 800), y: rand(200, 800) };
        const s = { frame, a: { x: c.x - Math.cos(ang) * 1500, y: c.y - Math.sin(ang) * 1500 }, b: { x: c.x + Math.cos(ang) * 1500, y: c.y + Math.sin(ang) * 1500 } };
        if (segDist(pos[frame], s.a, s.b) > 40) {
          sats.push(s);
          break;
        }
      }
    }
    const { des, num } = designation();
    return {
      L, kind, cross, speed, n, pos, step, stars, variables, cosmics, sats, des, num,
      orbit: makeOrbit(kind, cross),
      // a near one moves so fast that it leaves a short streak
      streak: kind === 2 ? 0.045 : 0
    };
  }

  function segDist(p, a, b) {
    const vx = b.x - a.x;
    const vy = b.y - a.y;
    const u = clamp(((p.x - a.x) * vx + (p.y - a.y) * vy) / (vx * vx + vy * vy), 0, 1);
    return Math.hypot(p.x - (a.x + u * vx), p.y - (a.y + u * vy));
  }

  // ---------------------------------------------------------------------------
  // The pictures: blurred stars and grainy noise, as from a telescope's camera
  // ---------------------------------------------------------------------------

  function blob(buf, x, y, A, sig) {
    const r = Math.ceil(sig * 3.5);
    const xi = Math.round(x);
    const yi = Math.round(y);
    const k = -1 / (2 * sig * sig);
    for (let j = Math.max(0, yi - r); j <= Math.min(FIELD - 1, yi + r); j++) {
      const dy = j - y;
      for (let i = Math.max(0, xi - r); i <= Math.min(FIELD - 1, xi + r); i++) {
        const dx = i - x;
        buf[j * FIELD + i] += A * Math.exp((dx * dx + dy * dy) * k);
      }
    }
  }

  // a line of blobs from a to b, as bright as A along it
  function streak(buf, a, b, A, sig) {
    const len = dist(a, b);
    const steps = Math.max(1, Math.ceil(len / 0.5));
    const each = (A * (len / steps)) / (sig * Math.sqrt(2 * Math.PI));
    for (let s = 0; s <= steps; s++) {
      const u = s / steps;
      const x = a.x + (b.x - a.x) * u;
      const y = a.y + (b.y - a.y) * u;
      if (x < -5 || y < -5 || x > FIELD + 5 || y > FIELD + 5) continue;
      blob(buf, x, y, each, sig);
    }
  }

  // from brightness to colour: a dark blue sky and white stars, with the
  // faint ones lifted so that they show
  const LUT_N = 400;
  const LUT_MAX = 80;
  const LUT = (() => {
    const lut = new Uint8ClampedArray((LUT_N + 1) * 3);
    for (let i = 0; i <= LUT_N; i++) {
      const v = (i / LUT_N) * LUT_MAX - 2.5;
      const d = clamp((v + 1.5) / 72, 0, 1) ** 0.6;
      lut[i * 3] = 6 + d * 249;
      lut[i * 3 + 1] = 8 + d * 247;
      lut[i * 3 + 2] = 24 + d * 231;
    }
    return lut;
  })();

  function renderFrames(F) {
    const base = new Float32Array(FIELD * FIELD);
    for (const s of F.stars) blob(base, s.x, s.y, s.A, PSF);
    F.pics = [];
    for (let k = 0; k < F.n; k++) {
      const buf = base.slice();
      const p = F.pos[k];
      if (F.streak) {
        const h = { x: (F.step.x * F.streak) / 2, y: (F.step.y * F.streak) / 2 };
        streak(buf, { x: p.x - h.x, y: p.y - h.y }, { x: p.x + h.x, y: p.y + h.y }, F.L.ast, PSF);
      } else blob(buf, p.x, p.y, F.L.ast, PSF);
      for (const v of F.variables) blob(buf, v.x, v.y, v.As[k], PSF);
      for (const s of F.sats) if (s.frame === k) streak(buf, s.a, s.b, 28, 1.1);
      for (const c of F.cosmics) {
        if (c.frame !== k) continue;
        for (const [i, j] of c.px) if (i >= 0 && j >= 0 && i < FIELD && j < FIELD) buf[j * FIELD + i] += rand(90, 160);
      }
      const cv = document.createElement('canvas');
      cv.width = cv.height = FIELD;
      const cx = cv.getContext('2d');
      const img = cx.createImageData(FIELD, FIELD);
      const d = img.data;
      for (let i = 0; i < buf.length; i++) {
        // noise of about 1, from three random numbers
        const v = buf[i] + (Math.random() + Math.random() + Math.random() - 1.5) * 2;
        const li = clamp(Math.round(((v + 2.5) / LUT_MAX) * LUT_N), 0, LUT_N) * 3;
        d[i * 4] = LUT[li];
        d[i * 4 + 1] = LUT[li + 1];
        d[i * 4 + 2] = LUT[li + 2];
        d[i * 4 + 3] = 255;
      }
      cx.putImageData(img, 0, 0);
      F.pics.push(cv);
    }
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('asteroid.');
  const state = {
    level: store.get('level', 0),
    done: store.get('done', []),           // the levels finished at least once
    catalogue: store.get('catalogue', []), // every asteroid found, newest last
    F: null,
    phase: 'find',
    shown: 0,        // how many pictures can be shown
    frame: 0,        // the picture shown
    blinking: true,
    marks: [],       // [night] = found
    hintAt: null,    // { x, y, r, until } a ring to look in
    hints: 0,        // how many times 💡 was pressed in this step
    misses: 0,       // wrong taps in the predict step
    wrongAt: null,   // the last wrong tap there
    ruler: null,     // [a, b] the pink line's ends
    entry: null,     // the catalogue entry of this asteroid
    names: [],       // the names to pick from
    view: { cx: FIELD / 2, cy: FIELD / 2, z: 1 },
    raf: 0
  };
  if (!(state.level >= 0 && state.level < LEVELS.length)) state.level = 0;
  if (!Array.isArray(state.done)) state.done = [];
  if (!Array.isArray(state.catalogue)) state.catalogue = [];

  // ---------------------------------------------------------------------------
  // Pictures for the menu: an asteroid, in the colour of its kind
  // ---------------------------------------------------------------------------

  function rockPic(kind) {
    return (
      '<svg viewBox="0 0 40 40" aria-hidden="true">' +
      `<path d="M10 13Q15 6 23 7.5Q31 8 34 15Q37 23 31 29Q25 35 16 33Q7 31 6 23Q5.5 17 10 13Z" fill="${ROCK_COLORS[kind]}" stroke="#1a1440" stroke-width="1.6"/>` +
      '<g fill="#1a1440" opacity="0.2"><circle cx="16" cy="16" r="3.2"/><circle cx="25" cy="24" r="4"/><circle cx="24" cy="13" r="1.8"/><circle cx="13" cy="26" r="1.6"/></g>' +
      '</svg>'
    );
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    LEVELS.forEach((L, i) => {
      const b = document.createElement('button');
      b.className = 'level';
      b.innerHTML =
        `<span class="level-icon">${rockPic(L.near ? 2 : 1)}</span>` +
        '<span class="level-text"><b class="level-name"></b><span class="level-about"></span></span>' +
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

  const desHTML = (e) => `${e.des}<sub>${e.num}</sub>`;

  function summary(e) {
    let s = t('summary')(t('kindShort')[e.kind], moonFmt(e.speed));
    if (e.kind === 2) s += ' ' + t('crosses')[e.cross ? 0 : 1];
    return s;
  }

  function updateMenu() {
    [...$('levels').children].forEach((b, i) => {
      const L = LEVELS[i];
      b.classList.toggle('selected', i === state.level);
      b.querySelector('.level-name').textContent = `${i + 1} · ${L.name[Astro.lang]}`;
      b.querySelector('.level-about').textContent = L.about[Astro.lang];
      b.querySelector('.done-badge').classList.toggle('hidden', !state.done.includes(L.id));
    });
    const box = $('catalogue');
    box.innerHTML = '';
    $('catalogueBox').classList.toggle('hidden', !state.catalogue.length);
    $('catCount').textContent = `(${state.catalogue.length})`;
    for (const e of [...state.catalogue].reverse()) {
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.innerHTML = `<span class="cat-pic">${rockPic(e.kind)}</span><div><b></b><span></span></div>`;
      const b = card.querySelector('b');
      if (e.name) {
        b.textContent = e.name + ' ';
        const des = document.createElement('small');
        des.className = 'cat-des';
        des.innerHTML = `(${desHTML(e)})`;
        b.appendChild(des);
      } else b.innerHTML = desHTML(e);
      card.querySelector('span:not(.cat-pic)').textContent = summary(e);
      box.appendChild(card);
    }
  }

  function showMenu() {
    stopBlink();
    cancelAnimationFrame(state.raf);
    orbitRun++;
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // Showing the sky: zoomed and moved, with the marks on top
  // ---------------------------------------------------------------------------

  const canvas = $('skyPic');
  const ctx = canvas.getContext('2d');
  let W = 0;
  let H = 0;
  let dpr = 1;

  function resize() {
    const box = $('skyBox');
    dpr = window.devicePixelRatio || 1;
    W = box.clientWidth;
    H = box.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    setView(state.view.cx, state.view.cy, state.view.z);
  }

  // css px per picture pixel
  const scale = () => (Math.min(W, H) / FIELD) * state.view.z;
  const toScreen = (p) => ({ x: W / 2 + (p.x - state.view.cx) * scale(), y: H / 2 + (p.y - state.view.cy) * scale() });
  const fromScreen = (p) => ({ x: state.view.cx + (p.x - W / 2) / scale(), y: state.view.cy + (p.y - H / 2) / scale() });

  // Zoom z with the point (cx, cy) of the picture in the middle, kept so
  // that the picture fills the box once it is bigger than it.
  function setView(cx, cy, z) {
    const v = state.view;
    v.z = clamp(z, 1, MAX_ZOOM);
    const s = scale();
    const hw = W / 2 / s;
    const hh = H / 2 / s;
    v.cx = hw * 2 >= FIELD ? FIELD / 2 : clamp(cx, hw, FIELD - hw);
    v.cy = hh * 2 >= FIELD ? FIELD / 2 : clamp(cy, hh, FIELD - hh);
    $('zoomInBtn').classList.toggle('off', v.z >= MAX_ZOOM - 1e-9);
    $('zoomOutBtn').classList.toggle('off', v.z <= 1 + 1e-9);
    draw();
  }

  // zoom by a factor, keeping the point at (x, y) on the screen in its place
  function zoomAt(factor, at) {
    const p = fromScreen(at);
    const z = clamp(state.view.z * factor, 1, MAX_ZOOM);
    const s = (Math.min(W, H) / FIELD) * z;
    setView(p.x - (at.x - W / 2) / s, p.y - (at.y - H / 2) / s, z);
  }

  // bring a point of the picture into view, if it is not there already
  function showPoint(p, margin) {
    const q = toScreen(p);
    if (q.x < margin || q.y < margin || q.x > W - margin || q.y > H - margin) setView(p.x, p.y, state.view.z);
  }

  function pill(text, x, y, bg, fg, align) {
    ctx.font = '900 14px Nunito, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    const w = ctx.measureText(text).width + 16;
    const cx = align === 'left' ? x + w / 2 : clamp(x, w / 2 + 4, W - w / 2 - 4);
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, y - 12, w, 24, 12);
    ctx.fill();
    ctx.fillStyle = fg;
    ctx.fillText(text, cx, y + 1);
  }

  function draw() {
    if (!state.F || !W) return;
    const F = state.F;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#03051a';
    ctx.fillRect(0, 0, W, H);
    const s = scale();
    const o = toScreen({ x: 0, y: 0 });
    // sharp pixels once they are big, as in a real camera picture
    ctx.imageSmoothingEnabled = s * dpr < 2;
    ctx.drawImage(F.pics[state.frame], o.x, o.y, FIELD * s, FIELD * s);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.strokeRect(o.x, o.y, FIELD * s, FIELD * s);

    const now = performance.now();
    // the ring to look in
    if (state.hintAt && now < state.hintAt.until) {
      const c = toScreen(state.hintAt);
      ctx.strokeStyle = `rgba(255, 211, 77, ${0.55 + 0.35 * Math.sin(now / 120)})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(c.x, c.y, Math.max(18, state.hintAt.r * s), 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    // the asteroid's path, once it has been found on every night
    const marked = F.pos.filter((p, k) => state.marks[k]);
    if (state.phase !== 'find' && marked.length > 1) {
      ctx.strokeStyle = 'rgba(255, 211, 77, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      marked.forEach((p) => { const q = toScreen(p); ctx.lineTo(q.x, q.y); });
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
    }
    // where it goes on, after two misses in the predict step
    if (state.phase === 'predict' && state.misses >= 2) {
      const last = F.pos[F.L.frames - 1];
      const a = toScreen(last);
      const b = toScreen({ x: last.x + F.step.x * 1.6, y: last.y + F.step.y * 1.6 });
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 7]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
    }

    // a ring round the asteroid on each night it was found, with the night
    const R = Math.max(13, 9 * s);
    F.pos.forEach((p, k) => {
      if (!state.marks[k]) return;
      const q = toScreen(p);
      ctx.globalAlpha = k === state.frame ? 1 : 0.45;
      ctx.strokeStyle = MARK_COLOR;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(q.x, q.y, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.fillStyle = MARK_COLOR;
      ctx.font = '900 13px Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(String(k + 1), q.x, q.y - R - 2);
      ctx.globalAlpha = 1;
    });

    // a wrong guess in the predict step
    if (state.phase === 'predict' && state.wrongAt) {
      const q = toScreen(state.wrongAt);
      ctx.strokeStyle = RULER_COLOR;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(q.x - 8, q.y - 8);
      ctx.lineTo(q.x + 8, q.y + 8);
      ctx.moveTo(q.x + 8, q.y - 8);
      ctx.lineTo(q.x - 8, q.y + 8);
      ctx.stroke();
      ctx.lineWidth = 1;
    }

    // the pink line for measuring how far it moved, with handles at its ends
    if (state.phase === 'speed' && state.ruler) {
      const [a, b] = state.ruler.map(toScreen);
      ctx.strokeStyle = RULER_COLOR;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.lineWidth = 2.5;
      for (const q of [a, b]) {
        ctx.beginPath();
        ctx.arc(q.x, q.y, 11, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.lineWidth = 1;
      const len = dist(state.ruler[0], state.ruler[1]);
      pill(t('moonWidths')(moonFmt(len)), (a.x + b.x) / 2, Math.max(16, Math.min(a.y, b.y) - 24), RULER_COLOR, '#1a1440');
    }

    // which night this is
    pill(t('night')(state.frame + 1), 10, 22, 'rgba(255, 211, 77, 0.92)', '#1a1440', 'left');
  }

  function loop() {
    draw();
    if (state.hintAt && performance.now() < state.hintAt.until) state.raf = requestAnimationFrame(loop);
  }

  function animate() {
    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(loop);
  }

  // ---------------------------------------------------------------------------
  // Flipping between the nights
  // ---------------------------------------------------------------------------

  let blinkTimer = 0;

  function startBlink() {
    stopBlink();
    state.blinking = true;
    blinkTimer = setInterval(() => {
      state.frame = (state.frame + 1) % state.shown;
      updateNights();
      draw();
    }, BLINK_MS);
    updateNights();
  }

  function stopBlink() {
    clearInterval(blinkTimer);
    state.blinking = false;
    updateNights();
  }

  function showFrame(k) {
    stopBlink();
    state.frame = k;
    updateNights();
    draw();
  }

  function buildNights() {
    const box = $('nights');
    box.innerHTML = '';
    for (let k = 0; k < state.shown; k++) {
      const b = document.createElement('button');
      b.className = 'night';
      b.addEventListener('click', () => { sfx.pick(); showFrame(k); });
      box.appendChild(b);
    }
    updateNights();
  }

  function updateNights() {
    [...$('nights').children].forEach((b, k) => {
      b.textContent = t('night')(k + 1);
      b.classList.toggle('active', k === state.frame);
    });
    $('blinkBtn').textContent = state.blinking ? '⏸️' : '▶️';
  }

  // ---------------------------------------------------------------------------
  // Game
  // ---------------------------------------------------------------------------

  function startGame() {
    orbitRun++;
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    const L = LEVELS[state.level];
    const F = makeField(L);
    renderFrames(F);
    state.F = F;
    state.phase = L.steps[0];
    state.shown = L.frames;
    state.frame = 0;
    state.marks = F.pos.map(() => false);
    state.hintAt = null;
    state.hints = 0;
    state.misses = 0;
    state.wrongAt = null;
    state.ruler = null;
    state.entry = null;
    state.view = { cx: FIELD / 2, cy: FIELD / 2, z: 1 };
    updateToggles();
    buildNights();
    resize();
    setFeedback('');
    updatePanel();
    startBlink();
  }

  function setFeedback(text, good) {
    const el = $('feedback');
    el.textContent = text || '';
    el.classList.toggle('good', !!good);
  }

  function showNext(fn) {
    const b = $('nextBtn');
    b.textContent = t('next');
    b.classList.remove('hidden');
    b.onclick = () => {
      sfx.pick();
      fn();
    };
  }

  // on to the next step, or the win screen after the last
  function nextStep() {
    const steps = state.F.L.steps;
    const i = steps.indexOf(state.phase);
    if (i + 1 >= steps.length) win();
    else go(steps[i + 1]);
  }

  function updateProgress() {
    const steps = state.F.L.steps;
    const i = state.phase === 'done' ? steps.length : steps.indexOf(state.phase);
    $('progressFill').style.width = (100 * i) / steps.length + '%';
    $('progressText').textContent = t('steps')[steps[Math.min(i, steps.length - 1)]];
  }

  function updatePanel() {
    const F = state.F;
    $('options').innerHTML = '';
    $('qExtra').innerHTML = '';
    $('nextBtn').classList.add('hidden');
    updateProgress();
    const target = F.L.frames + 1;

    if (state.phase === 'find') {
      $('qTitle').textContent = t('findTitle');
      $('qText').textContent = `${t('findText')(F.L.frames)} ${t('zoomTip')}`;
      if (allFound()) showNext(nextStep);
    } else if (state.phase === 'predict') {
      $('qTitle').textContent = t('predictTitle')(target);
      $('qText').textContent = t('predictText')(target);
      if (state.marks[F.L.frames]) showNext(nextStep);
    } else if (state.phase === 'speed') {
      $('qTitle').textContent = t('speedTitle');
      $('qText').textContent = `${t('speedText')} ${t('fieldSize')}`;
      $('qExtra').appendChild(speedScale());
      updateScale();
      t('speedNames').forEach((name, k) => addOption(name, k === F.kind, () => {
        setFeedback(t('speedOk')[k], true);
        showNext(nextStep);
      }, () => setFeedback(`${t('tryAgain')} ${t('speedWrong')}`)));
    } else if (state.phase === 'orbit') {
      $('qTitle').textContent = t('orbitTitle');
      $('qText').textContent = t('orbitText');
      const box = document.createElement('div');
      box.className = 'orbits';
      $('qExtra').appendChild(box);
      orbitView(box, F);
      const right = F.cross ? 0 : 1;
      t('orbitNames').forEach((name, k) => addOption(name, k === right, () => {
        setFeedback(t('orbitOk')[k], true);
        showNext(nextStep);
      }, () => setFeedback(`${t('tryAgain')} ${t('orbitWrong')}`)));
    }
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

  function go(phase) {
    state.phase = phase;
    state.hints = 0;
    state.hintAt = null;
    setFeedback('');
    if (phase === 'speed') {
      // the pink line starts beside the path, shorter than a night's move
      const F = state.F;
      const len = Math.hypot(F.step.x, F.step.y);
      const ux = F.step.x / len;
      const uy = F.step.y / len;
      const off = Math.max(60, len * 0.3);
      const a = { x: clamp(F.pos[0].x - uy * off, 20, FIELD - 20), y: clamp(F.pos[0].y + ux * off, 20, FIELD - 20) };
      const l = Math.max(80, len * 0.5);
      const c = Math.cos(0.6);
      const sn = Math.sin(0.6);
      const b = { x: clamp(a.x + (ux * c - uy * sn) * l, 20, FIELD - 20), y: clamp(a.y + (ux * sn + uy * c) * l, 20, FIELD - 20) };
      state.ruler = [a, b];
      stopBlink();
      state.frame = 0;
      showPoint(a, 40);
    }
    if (phase === 'orbit') {
      stopBlink();
      state.frame = 0;
    }
    updateNights();
    updatePanel();
    draw();
  }

  // ---------------------------------------------------------------------------
  // Finding the asteroid
  // ---------------------------------------------------------------------------

  const allFound = () => state.marks.slice(0, state.F.L.frames).every(Boolean);

  // how near a tap must be, in picture pixels
  const reach = () => clamp(22 / scale(), 8, 40);

  function tapFind(p) {
    const F = state.F;
    const tol = reach();
    // while blinking, the asteroid counts on any night; otherwise on the one shown
    const frames = state.blinking ? [...Array(F.L.frames).keys()] : [state.frame];
    let best = null;
    for (const k of frames) {
      const d = dist(p, F.pos[k]);
      if (d < tol * (F.streak ? 1.4 : 1) && (!best || d < best.d || (state.marks[best.k] && !state.marks[k]))) best = { k, d };
    }
    if (best) {
      if (state.marks[best.k]) {
        setFeedback(t('already'));
        return;
      }
      state.marks[best.k] = true;
      const found = state.marks.slice(0, F.L.frames).filter(Boolean).length;
      sfx.note(found + 1);
      state.hintAt = null;
      state.hints = 0;
      if (allFound()) {
        sfx.snap();
        setFeedback(t('foundAll'), true);
      } else setFeedback(t('foundOne')(best.k + 1, F.L.frames - found), true);
      updatePanel();
      draw();
      return;
    }
    sfx.oops();
    const k = state.frame;
    if (F.sats.some((s) => s.frame === k && segDist(p, s.a, s.b) < tol * 0.8)) setFeedback(t('satellite'));
    else if (F.cosmics.some((c) => c.frame === k && dist(p, c) < tol)) setFeedback(t('cosmic'));
    else if (F.variables.some((v) => dist(p, v) < tol)) setFeedback(t('variable'));
    else if (F.stars.some((s) => dist(p, s) < tol * 0.8)) setFeedback(t('star'));
    else setFeedback(t('noise'));
  }

  // The guess of where it is on the next night: near enough shows the
  // picture of that night with the asteroid in it.
  function tapPredict(p) {
    const F = state.F;
    const n = F.L.frames;
    if (state.marks[n]) return;
    const step = Math.hypot(F.step.x, F.step.y);
    const tol = Math.max(step * 0.3, 16, reach());
    if (dist(p, F.pos[n]) < tol) {
      state.marks[n] = true;
      state.wrongAt = null;
      state.hintAt = null;
      state.shown = n + 1;
      buildNights();
      $('nights').lastChild.classList.add('new');
      showFrame(n);
      showPoint(F.pos[n], 40);
      sfx.snap();
      setFeedback(t('predictOk')(n + 1), true);
      updatePanel();
    } else {
      state.misses++;
      state.wrongAt = p;
      sfx.oops();
      setFeedback(`${t('predictWrong')(n + 1)}${state.misses >= 2 ? ' ' + t('predictLine') : ''}`);
      draw();
    }
  }

  // ---------------------------------------------------------------------------
  // How fast: the pink line and the scale of where it goes round the Sun
  // ---------------------------------------------------------------------------

  // where a move of px a night goes on the scale, in percent: each kind
  // gets a third, on a log scale within it
  function speedPos(px) {
    const E = SPEED_EDGES;
    const n = E.length - 1;
    if (px <= E[0]) return 0;
    for (let k = 0; k < n; k++) {
      if (px < E[k + 1]) return (100 * (k + Math.log(px / E[k]) / Math.log(E[k + 1] / E[k]))) / n;
    }
    return 100;
  }

  // a line across the scale, in SVG so that it stays bright in dark mode
  const markPic = (color) =>
    `<svg viewBox="0 0 10 46" preserveAspectRatio="none" aria-hidden="true"><rect x="2" y="2" width="6" height="42" rx="3" fill="${color}" stroke="#1a1440" stroke-width="2"/></svg>`;

  function speedScale() {
    const el = document.createElement('div');
    el.className = 'speed-scale';
    el.innerHTML =
      `<div class="speeds">${t('speedBar').map((name, k) => `<span class="k${k}">${name}</span>`).join('')}</div>` +
      `<span class="scale-hint hidden">${markPic('#ffffff')}</span><span class="scale-ruler">${markPic(RULER_COLOR)}</span>`;
    return el;
  }

  function updateScale() {
    const el = $('qExtra').querySelector('.scale-ruler');
    if (el && state.ruler) el.style.left = speedPos(dist(state.ruler[0], state.ruler[1])) + '%';
  }

  // an end of the pink line close to the asteroid on a night snaps onto it
  function moveRulerEnd(end, at) {
    const F = state.F;
    let p = fromScreen(at);
    p = { x: clamp(p.x, 0, FIELD), y: clamp(p.y, 0, FIELD) };
    const tol = clamp(22 / scale(), 4, 60);
    const near = F.pos.find((q, k) => state.marks[k] && dist(p, q) < tol);
    state.ruler[end] = near ? { x: near.x, y: near.y } : p;
    updateScale();
    draw();
  }

  // ---------------------------------------------------------------------------
  // Tapping, dragging and pinching on the sky
  // ---------------------------------------------------------------------------

  function local(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  const pointers = new Map();
  let drag = null;  // { end } a ruler end, or { x, y, cx, cy, moved } a move
  let pinch = null; // { d, z, p } two fingers at their start

  const twoFingers = () => {
    const [a, b] = [...pointers.values()];
    return { d: Math.max(20, Math.hypot(a.x - b.x, a.y - b.y)), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  };

  canvas.addEventListener('pointerdown', (e) => {
    if (!state.F) return;
    const at = local(e);
    pointers.set(e.pointerId, at);
    try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* not a real pointer */ }
    if (pointers.size === 2) {
      const f = twoFingers();
      pinch = { d: f.d, z: state.view.z, p: fromScreen(f) };
      drag = null;
    } else if (pointers.size === 1) {
      drag = { x: at.x, y: at.y, cx: state.view.cx, cy: state.view.cy, moved: false };
      if (state.phase === 'speed' && state.ruler) {
        const d = state.ruler.map((q) => { const s = toScreen(q); return Math.hypot(s.x - at.x, s.y - at.y); });
        const end = d[0] <= d[1] ? 0 : 1;
        if (d[end] < 30) drag = { end };
      }
    }
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    const at = local(e);
    pointers.set(e.pointerId, at);
    if (pinch && pointers.size === 2) {
      const f = twoFingers();
      const z = clamp((pinch.z * f.d) / pinch.d, 1, MAX_ZOOM);
      const s = (Math.min(W, H) / FIELD) * z;
      setView(pinch.p.x - (f.x - W / 2) / s, pinch.p.y - (f.y - H / 2) / s, z);
    } else if (drag && drag.end !== undefined) moveRulerEnd(drag.end, at);
    else if (drag) {
      if (Math.hypot(at.x - drag.x, at.y - drag.y) > 8) drag.moved = true;
      if (drag.moved) {
        const s = scale();
        setView(drag.cx - (at.x - drag.x) / s, drag.cy - (at.y - drag.y) / s, state.view.z);
      }
    }
  });
  const stopDrag = (e) => {
    if (!pointers.delete(e.pointerId)) return;
    if (e.type === 'pointerup' && drag && drag.end === undefined && !drag.moved && !pinch) {
      const p = fromScreen(local(e));
      if (p.x >= 0 && p.y >= 0 && p.x <= FIELD && p.y <= FIELD) {
        if (state.phase === 'find') tapFind(p);
        else if (state.phase === 'predict') tapPredict(p);
      }
    }
    if (pointers.size < 2) pinch = null;
    drag = null;
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);

  canvas.addEventListener('wheel', (e) => {
    if (!state.F) return;
    e.preventDefault();
    zoomAt(Math.exp(-e.deltaY * 0.004), local(e));
  }, { passive: false });

  $('zoomInBtn').addEventListener('click', () => { sfx.pick(); zoomAt(2, { x: W / 2, y: H / 2 }); });
  $('zoomOutBtn').addEventListener('click', () => { sfx.pick(); zoomAt(0.5, { x: W / 2, y: H / 2 }); });
  $('blinkBtn').addEventListener('click', () => {
    sfx.pick();
    if (state.blinking) stopBlink();
    else startBlink();
  });

  // ---------------------------------------------------------------------------
  // 💡
  // ---------------------------------------------------------------------------

  function hint() {
    sfx.pick();
    const F = state.F;
    if (state.phase === 'find') {
      // a ring round the asteroid on a night it has not been found, smaller
      // each time, and not quite centred on it
      let k = state.marks[state.frame] ? state.marks.findIndex((m, j) => !m && j < F.L.frames) : state.frame;
      if (k < 0) return;
      if (k !== state.frame) showFrame(k);
      else stopBlink();
      const r = [150, 70, 28][Math.min(state.hints, 2)];
      const a = rand(0, 2 * Math.PI);
      const off = rand(0, 0.45) * r;
      const c = { x: F.pos[k].x + Math.cos(a) * off, y: F.pos[k].y + Math.sin(a) * off };
      state.hintAt = { x: c.x, y: c.y, r, until: performance.now() + 4000 };
      state.hints++;
      showPoint(c, 60);
      setFeedback(t('findHint'));
      animate();
    } else if (state.phase === 'predict') {
      const p = F.pos[F.L.frames];
      state.misses = Math.max(state.misses, 2);
      state.hintAt = { x: p.x, y: p.y, r: 45, until: performance.now() + 3000 };
      showPoint(p, 60);
      setFeedback(t('predictLine'));
      animate();
    } else if (state.phase === 'speed') {
      const mark = $('qExtra').querySelector('.scale-hint');
      mark.style.left = speedPos(F.speed) + '%';
      mark.classList.remove('hidden');
      setFeedback(t('speedHint'));
    } else if (state.phase === 'orbit') setFeedback(t('orbitHint'));
  }

  // ---------------------------------------------------------------------------
  // The paths round the Sun, seen from above
  // ---------------------------------------------------------------------------

  // The distances are on a square-root scale, so that the Earth's path and
  // the far ones both fit, except round a near asteroid, where they are
  // even, so that it is clear whether its path crosses the Earth's. The
  // asteroid goes round once in 10 s, faster when nearer the Sun.
  let orbitRun = 0;
  function orbitView(el, F) {
    const run = ++orbitRun;
    const o = F.orbit;
    const rmax = [56, 5.8, 3.8][F.kind];
    const R = (r) => 8 + 88 * (F.kind === 2 ? r / rmax : Math.sqrt(r / rmax));
    const map = (x, y) => {
      const r = Math.hypot(x, y) || 1e-9;
      const k = R(r) / r;
      return [x * k, -y * k];
    };
    const at = (E) => {
      const b = o.a * Math.sqrt(1 - o.e * o.e);
      const x = o.a * (Math.cos(E) - o.e);
      const y = b * Math.sin(E);
      return map(x * Math.cos(o.w) - y * Math.sin(o.w), x * Math.sin(o.w) + y * Math.cos(o.w));
    };
    const shown = PLANETS.filter(([id, a]) => a < rmax * 0.98 && !(F.kind === 0 && a < 0.9));
    const names = t('planets');
    let svg = '<svg viewBox="-100 -100 200 200" aria-hidden="true">';
    if (F.kind !== 0) {
      svg += `<circle r="${(R(2.2) + R(3.3)) / 2}" fill="none" stroke="#b3a796" stroke-width="${R(3.3) - R(2.2)}" opacity="0.16"/>`;
    }
    for (const [id, a, color] of shown) {
      const earth = id === 'earth';
      svg += `<circle r="${R(a)}" fill="none" stroke="${color}" stroke-width="${earth ? 1.8 : 1}" opacity="${earth ? 0.9 : 0.45}"/>`;
    }
    const path = [];
    for (let k = 0; k <= 160; k++) path.push(at((k / 160) * 2 * Math.PI).map((v) => v.toFixed(2)).join(' '));
    svg += `<path d="M ${path.join(' L ')} Z" fill="none" stroke="${RULER_COLOR}" stroke-width="1.6"/>`;
    svg += '<circle r="9" fill="#ffd34d" opacity="0.3"/><circle r="5.5" fill="#ffd34d"/>';
    // each planet somewhere on its path, with its name beside it
    for (const [id, a, color, size] of shown) {
      const ang = PLANET_ANGLES[id];
      const x = R(a) * Math.cos(ang);
      const y = R(a) * Math.sin(ang);
      svg += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${size}" fill="${color}"/>`;
      if (names[id]) {
        const lx = x + Math.cos(ang) * (size + 7);
        const ly = y + Math.sin(ang) * (size + 7) + 3;
        svg += `<text class="orbit-label" x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" text-anchor="middle" fill="${color}" stroke="#0a0f30" stroke-width="2.5" paint-order="stroke">${names[id]}</text>`;
      }
    }
    svg += `<circle class="orbit-ast" r="3.4" fill="#ffffff" stroke="${RULER_COLOR}" stroke-width="1.4"/></svg>`;
    el.innerHTML = svg + `<p class="orbit-note">${t('notToScale')}</p>`;
    const dot = el.querySelector('.orbit-ast');
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t0 = performance.now();
    const place = (now) => {
      if (run !== orbitRun || !el.isConnected) return;
      // the mean anomaly, and from it the place on the ellipse
      const Mn = o.M0 + ((now - t0) / 10000) * 2 * Math.PI;
      let E = Mn;
      for (let k = 0; k < 6; k++) E -= (E - o.e * Math.sin(E) - Mn) / (1 - o.e * Math.cos(E));
      const [x, y] = at(E);
      dot.setAttribute('cx', x.toFixed(2));
      dot.setAttribute('cy', y.toFixed(2));
      if (!still) requestAnimationFrame(place);
    };
    place(t0);
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  function fillWin() {
    const F = state.F;
    const e = state.entry;
    $('winTitle').textContent = t(F.kind === 0 ? 'discoveredFar' : 'discovered');
    $('winDes').innerHTML = desHTML(e);
    if (e.name) $('winDes').prepend(e.name + ' · ');
    $('winSum').textContent = summary(e);
    $('winFact').textContent = state.fact[Astro.lang];
    const box = $('names');
    box.innerHTML = '';
    for (const name of state.names) {
      const b = document.createElement('button');
      b.className = 'name';
      b.textContent = name;
      b.classList.toggle('selected', e.name === name);
      b.addEventListener('click', () => {
        sfx.note(state.names.indexOf(name) + 3);
        e.name = name;
        store.set('catalogue', state.catalogue);
        fillWin();
      });
      box.appendChild(b);
    }
    $('nextLevelBtn').classList.toggle('hidden', state.level + 1 >= LEVELS.length);
    orbitView($('orbits'), F);
  }

  // Names to pick from that no asteroid in the catalogue has yet; once
  // they run out, the same names again with II, III and so on.
  function freshNames(count) {
    const used = new Set(state.catalogue.map((e) => e.name).filter(Boolean));
    const ROMAN = ['', ' II', ' III', ' IV', ' V', ' VI', ' VII', ' VIII', ' IX', ' X'];
    const names = [];
    for (let r = 0; names.length < count; r++) {
      const suffix = r < ROMAN.length ? ROMAN[r] : ` ${r + 1}`;
      const free = t('names').map((n) => n + suffix).filter((n) => !used.has(n));
      names.push(...shuffle(free).slice(0, count - names.length));
    }
    return shuffle(names);
  }

  function win() {
    const F = state.F;
    state.phase = 'done';
    stopBlink();
    updateProgress();
    const L = F.L;
    if (!state.done.includes(L.id)) {
      state.done.push(L.id);
      store.set('done', state.done);
    }
    state.entry = { des: F.des, num: F.num, kind: F.kind, speed: Math.round(F.speed), cross: F.cross, name: '' };
    state.catalogue.push(state.entry);
    store.set('catalogue', state.catalogue);
    state.names = freshNames(4);
    // a fact about its kind, or for half of those in the belt and near the
    // Earth, one about an asteroid named after Estonia or an Estonian
    const list = F.kind !== 0 && Math.random() < 0.5 ? 'estonian' : null;
    const of = (lang) => (list ? TEXT[lang][list] : TEXT[lang].facts[F.kind]);
    const k = Math.floor(Math.random() * of('et').length);
    state.fact = { et: of('et')[k], en: of('en')[k] };
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
  }).observe($('skyBox'));

  $('playBtn').addEventListener('click', startGame);
  $('newFieldBtn').addEventListener('click', startGame);
  $('nextLevelBtn').addEventListener('click', () => {
    state.level = Math.min(LEVELS.length - 1, state.level + 1);
    store.set('level', state.level);
    startGame();
  });
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('resetBtn').addEventListener('click', () => {
    if (!window.confirm(t('resetAsk'))) return;
    state.done = [];
    state.catalogue = [];
    store.set('done', state.done);
    store.set('catalogue', state.catalogue);
    updateMenu();
  });
  $('hintBtn').addEventListener('click', hint);
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  buildMenu();
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    if (!$('game').classList.contains('hidden') && state.F) {
      const fb = $('feedback').textContent;
      updatePanel();
      updateNights();
      if (!fb) setFeedback('');
      draw();
    }
    if (!$('win').classList.contains('hidden')) fillWin();
  });
})();
