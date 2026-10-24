'use strict';

(() => {
  const { $, clamp, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // Stars as [name, RA (deg, J2000), Dec (deg), visual magnitude, from].
  // Stars are numbered in this order. Each star is joined to the star before
  // it, or to star index `from` when given (null: not joined, a new line
  // starts there). `extra` lines appear as soon as both their stars are lit.
  // Facts refer to stars by their number, so keep them in step with the order.
  // `mention` lists the stars the fact talks about, by index, with the name
  // to show beside the number ('' for the number only); the win picture
  // marks them. `deco` adds a nebula, galaxy or star cluster from the fact
  // to that picture (angle: position angle of a galaxy's long axis, degrees
  // from north).
  // The menu shows them in this order, from fewest stars to most, and
  // last Lõunarist, which cannot be seen from Estonia.
  const CONSTELLATIONS = [
    {
      id: 'cassiopeia',
      emoji: '👸',
      name: { et: 'Kassiopeia', en: 'Cassiopeia' },
      fact: {
        et: 'Kassiopeia tähed moodustavad suure W- või M-tähe. Vanas loos oli Kassiopeia uhke kuninganna, kes istub taevas oma troonil.',
        en: 'Cassiopeia’s stars make a big letter W or M. In an old story, Cassiopeia was a proud queen who sits on her throne in the sky.'
      },
      stars: [
        ['Caph', 2.29, 59.15, 2.3],
        ['Schedar', 10.13, 56.54, 2.2],
        ['Navi', 14.18, 60.72, 2.2],
        ['Ruchbah', 21.45, 60.24, 2.7],
        ['Segin', 28.60, 63.67, 3.4]
      ]
    },
    {
      id: 'auriga',
      emoji: '🐐',
      name: { et: 'Veomees', en: 'Auriga, the Charioteer' },
      fact: {
        et: 'Veomees hoiab süles kitse. Täht 1, Kapella, ongi see kits. Kapella on üks taeva heledamaid tähti ja talveõhtuti peaaegu otse pea kohal. Täht 4 kuulub ka Sõnni tähtkujusse.',
        en: 'The Charioteer carries a goat. Star 1, Capella, is that goat. Capella is one of the brightest stars in the sky, almost straight overhead on winter evenings. Star 4 also belongs to Taurus.'
      },
      mention: { 0: { et: 'Kapella', en: 'Capella' } },
      stars: [
        ['Capella', 79.17, 46.00, 0.1],
        ['Menkalinan', 89.88, 44.95, 1.9],
        ['θ Aur', 89.93, 37.21, 2.6],
        ['Elnath', 81.57, 28.61, 1.7],
        ['Hassaleh', 74.25, 33.17, 2.7]
      ],
      extra: [[4, 0]]
    },
    {
      id: 'lyra',
      emoji: '🎵',
      name: { et: 'Lüüra', en: 'Lyra, the Harp' },
      fact: {
        et: 'Lüüra on väike tähtkuju, mis on saanud nime vanaaegse pilli järgi. Täht 1, Veega, on suveöö üks heledamaid tähti. Veega, Deeneb ja Altair moodustavad suure Suvekolmnurga.',
        en: 'Lyra is a small constellation named after an old harp. Star 1, Vega, is one of the brightest stars of summer nights. Vega, Deneb and Altair make the big Summer Triangle.'
      },
      mention: { 0: { et: 'Veega', en: 'Vega' } },
      stars: [
        ['Vega', 279.23, 38.78, 0.0],
        ['ε Lyr', 281.08, 39.67, 4.7],
        ['ζ Lyr', 281.19, 37.61, 4.3],
        ['δ Lyr', 283.63, 36.90, 4.3],
        ['Sulafat', 284.74, 32.69, 3.3],
        ['Sheliak', 282.52, 33.36, 3.5]
      ],
      extra: [[2, 0], [5, 2]]
    },
    {
      id: 'andromeda',
      emoji: '🌌',
      name: { et: 'Andromeeda', en: 'Andromeda' },
      fact: {
        et: 'Vanas loos oli Andromeeda printsess, Kassiopeia tütar. Tähed 3, 5 ja 6 näitavad teed udusele laigule – Andromeeda galaktikale. Sellest saad teha ka pusle!',
        en: 'In the old story, Andromeda was a princess, Cassiopeia’s daughter. Stars 3, 5 and 6 point the way to a misty patch – the Andromeda Galaxy. You can make a puzzle of it too!'
      },
      mention: { 2: '', 4: '', 5: '' },
      deco: [{ ra: 10.68, dec: 41.27, kind: 'galaxy', angle: 35, name: { et: 'Andromeeda galaktika', en: 'Andromeda Galaxy' } }],
      stars: [
        ['Alpheratz', 2.10, 29.09, 2.1],
        ['δ And', 9.83, 30.86, 3.3],
        ['Mirach', 17.43, 35.62, 2.1],
        ['Almach', 30.97, 42.33, 2.1],
        ['μ And', 14.19, 38.50, 3.9, 2],
        ['ν And', 12.45, 41.08, 4.5]
      ]
    },
    {
      id: 'cepheus',
      emoji: '🤴',
      name: { et: 'Kefeus', en: 'Cepheus' },
      fact: {
        et: 'Vanas loos oli Kefeus kuningas, Kassiopeia mees ja Andromeeda isa. Tähed 1–5 näevad välja nagu lapse joonistatud maja. Täht 6 läheb umbes iga viie päeva tagant heledamaks ja jälle nõrgemaks.',
        en: 'In the old story, Cepheus was a king, Cassiopeia’s husband and Andromeda’s father. Stars 1 to 5 look like a house drawn by a child. Star 6 grows brighter and dimmer again about every five days.'
      },
      mention: { 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' },
      // the house: walls 1–2 and 4–5, roof 2–3–4, floor 5–1, ceiling 4–2
      stars: [
        ['Alderamin', 319.64, 62.59, 2.5],
        ['Alfirk', 322.16, 70.56, 3.2],
        ['Errai', 354.84, 77.63, 3.2],
        ['ι Cep', 342.42, 66.20, 3.5],
        ['ζ Cep', 332.71, 58.20, 3.4],
        ['δ Cep', 337.29, 58.42, 4.1]
      ],
      extra: [[4, 0], [3, 1]]
    },
    {
      id: 'bigdipper',
      emoji: '🐻',
      name: { et: 'Suur Vanker', en: 'Big Dipper' },
      fact: {
        et: 'Suur Vanker on osa Suure Karu tähtkujust. Eestis on ta taevas igal selgel ööl. Tähed 1 ja 2 on vankri tagumised rattad. Kui jätkad nende vahelist joont, jõuad Põhjanaelani.',
        en: 'The Big Dipper is part of the Great Bear. In Estonia you can see it on every clear night. Stars 1 and 2 point the way to the North Star.'
      },
      mention: { 0: '', 1: '' },
      stars: [
        ['Dubhe', 165.93, 61.75, 1.8],
        ['Merak', 165.46, 56.38, 2.4],
        ['Phecda', 178.46, 53.69, 2.4],
        ['Megrez', 183.86, 57.03, 3.3],
        ['Alioth', 193.51, 55.96, 1.8],
        ['Mizar', 200.98, 54.93, 2.2],
        ['Alkaid', 206.89, 49.31, 1.9]
      ],
      extra: [[3, 0]]
    },
    {
      id: 'littledipper',
      emoji: '🧸',
      name: { et: 'Väike Vanker', en: 'Little Dipper' },
      fact: {
        et: 'Väikese Vankri esimene täht on Põhjanael. Ta on alati põhjas ja peaaegu ei liigu. Kui vaatad Põhjanaela poole, tead, kus on põhi!',
        en: 'The first star of the Little Dipper is the North Star. It always stays in the north and hardly moves. Face the North Star and you know where north is!'
      },
      mention: { 0: { et: 'Põhjanael', en: 'North Star' } },
      stars: [
        ['Polaris', 37.95, 89.26, 2.0],
        ['Yildun', 263.05, 86.59, 4.4],
        ['ε UMi', 251.49, 82.04, 4.2],
        ['ζ UMi', 236.01, 77.79, 4.3],
        ['Kochab', 222.68, 74.16, 2.1],
        ['Pherkad', 230.18, 71.83, 3.0],
        ['η UMi', 244.38, 75.76, 5.0]
      ],
      extra: [[6, 3]]
    },
    {
      id: 'corona',
      emoji: '👑',
      name: { et: 'Põhjakroon', en: 'Northern Crown' },
      fact: {
        et: 'Põhjakroon on poolring tähti, nagu kuninga kroon. Kõige heledam täht, number 3, on nagu kroonis särav pärl.',
        en: 'The Northern Crown is a half-circle of stars, like a king’s crown. The brightest star, number 3, shines like a pearl in the crown.'
      },
      mention: { 2: '' },
      stars: [
        ['θ CrB', 233.23, 31.36, 4.1],
        ['Nusakan', 231.96, 29.11, 3.7],
        ['Alphecca', 233.67, 26.71, 2.2],
        ['γ CrB', 235.69, 26.30, 3.8],
        ['δ CrB', 237.40, 26.07, 4.6],
        ['ε CrB', 239.40, 26.88, 4.1],
        ['ι CrB', 240.36, 29.85, 5.0]
      ]
    },
    {
      id: 'bootes',
      emoji: '🐄',
      name: { et: 'Karjane', en: 'Boötes, the Herdsman' },
      fact: {
        et: 'Karjane ajab taevas karusid taga. Täht 1, Arktuurus, on oranž ja väga hele. Selle leiad, kui jätkad Suure Vankri aisa kaart.',
        en: 'The Herdsman follows the bears across the sky. Star 1, Arcturus, is orange and very bright. You can find it by following the curve of the Big Dipper’s handle.'
      },
      mention: { 0: { et: 'Arktuurus', en: 'Arcturus' } },
      stars: [
        ['Arcturus', 213.92, 19.18, 0.0],
        ['Izar', 221.25, 27.07, 2.4],
        ['δ Boo', 228.88, 33.31, 3.5],
        ['Nekkar', 225.49, 40.39, 3.5],
        ['Seginus', 218.02, 38.31, 3.0],
        ['ρ Boo', 217.96, 30.37, 3.6],
        ['Muphrid', 208.67, 18.40, 2.7, 0]
      ],
      extra: [[5, 0]]
    },
    {
      id: 'aquila',
      emoji: '🦅',
      name: { et: 'Kotkas', en: 'Aquila, the Eagle' },
      fact: {
        et: 'Kotkas lendab suvel mööda Linnuteed. Täht 2, Altair, on kotka kõige heledam täht. Koos Veega ja Deenebiga moodustab ta Suvekolmnurga.',
        en: 'The Eagle flies along the Milky Way in summer. Star 2, Altair, is the eagle’s brightest star. Together with Vega and Deneb it makes the Summer Triangle.'
      },
      mention: { 1: 'Altair' },
      stars: [
        ['Tarazed', 296.56, 10.61, 2.7],
        ['Altair', 297.70, 8.87, 0.8],
        ['Alshain', 298.83, 6.41, 3.7],
        ['δ Aql', 291.37, 3.11, 3.4, 1],
        ['η Aql', 298.12, 1.01, 3.9],
        ['θ Aql', 302.83, -0.82, 3.2],
        ['ζ Aql', 286.35, 13.86, 3.0, 3],
        ['λ Aql', 286.56, -4.88, 3.4, 3]
      ]
    },
    {
      id: 'cygnus',
      emoji: '🦢',
      name: { et: 'Luik', en: 'Cygnus, the Swan' },
      fact: {
        et: 'Luik lendab mööda Linnuteed. Täht 1, Deeneb, on tema saba ja täht 4, Albireo, tema pea. Pikksilmas on Albireo kaks tähte: kollane ja sinine.',
        en: 'The Swan flies along the Milky Way. Star 1, Deneb, is its tail and star 4, Albireo, is its head. Through a telescope Albireo is two stars: a yellow one and a blue one.'
      },
      mention: { 0: { et: 'Deeneb', en: 'Deneb' }, 3: 'Albireo' },
      stars: [
        ['Deneb', 310.36, 45.28, 1.3],
        ['Sadr', 305.56, 40.26, 2.2],
        ['η Cyg', 299.08, 35.08, 3.9],
        ['Albireo', 292.68, 27.96, 3.1],
        ['Gienah', 311.55, 33.97, 2.5, 1],
        ['ζ Cyg', 318.23, 30.23, 3.2],
        ['δ Cyg', 296.24, 45.13, 2.9, 1],
        ['ι Cyg', 292.43, 51.73, 3.8],
        ['κ Cyg', 289.28, 53.37, 3.8]
      ]
    },
    {
      id: 'leo',
      emoji: '🦁',
      name: { et: 'Lõvi', en: 'Leo, the Lion' },
      fact: {
        et: 'Lõvi on kevadine tähtkuju. Täht 1, Reegulus, on lõvi süda. Tähed 1–6 on lõvi pea ja lakk, mis näevad välja nagu tagurpidi küsimärk.',
        en: 'Leo is a spring constellation. Star 1, Regulus, is the lion’s heart. Stars 1 to 6 are the lion’s head and mane, which look like a backwards question mark.'
      },
      mention: { 0: { et: 'Reegulus', en: 'Regulus' }, 1: '', 2: '', 3: '', 4: '', 5: '' },
      stars: [
        ['Regulus', 152.09, 11.97, 1.4],
        ['η Leo', 151.83, 16.76, 3.5],
        ['Algieba', 154.99, 19.84, 2.0],
        ['Adhafera', 154.17, 23.42, 3.4],
        ['Rasalas', 148.19, 26.01, 3.9],
        ['ε Leo', 146.46, 23.77, 3.0],
        ['Zosma', 168.53, 20.52, 2.6, 2],
        ['Denebola', 177.26, 14.57, 2.1],
        ['Chertan', 168.56, 15.43, 3.3]
      ],
      extra: [[8, 0]]
    },
    {
      id: 'taurus',
      emoji: '🐂',
      name: { et: 'Sõnn', en: 'Taurus, the Bull' },
      fact: {
        et: 'Sõnni silm on punakas täht Aldebaran, number 2. Täht 9 ei ole üks täht, vaid täheparv Sõel – sellest saad teha ka pusle!',
        en: 'The bull’s eye is the reddish star Aldebaran, number 2. Star 9 is not one star but a star cluster, the Pleiades – you can make a puzzle of it too!'
      },
      mention: { 1: 'Aldebaran', 8: { et: 'Sõel', en: 'Pleiades' } },
      stars: [
        ['ζ Tau', 84.41, 21.14, 3.0],
        ['Aldebaran', 68.98, 16.51, 0.9],
        ['γ Tau', 64.95, 15.63, 3.7],
        ['Ain', 67.15, 19.18, 3.5],
        ['Elnath', 81.57, 28.61, 1.7],
        ['λ Tau', 60.17, 12.49, 3.4, 2],
        ['ο Tau', 51.20, 9.03, 3.6],
        ['μ Tau', 63.88, 8.89, 4.3, 5],
        ['Pleiades', 56.87, 24.11, 2.9, null]
      ]
    },
    {
      id: 'perseus',
      emoji: '🛡️',
      name: { et: 'Perseus', en: 'Perseus' },
      fact: {
        et: 'Perseus on vanade lugude kangelane, kes hoiab käes koletise Medusa pead. Täht 9, Algol, on Medusa silm. Selle valgus nõrgeneb iga kolme päeva tagant korraks. Augustis lendab Perseuse poolt palju langevaid tähti.',
        en: 'Perseus is a hero from old stories who holds the head of the monster Medusa. Star 9, Algol, is Medusa’s eye. It dims for a while every three days. In August many shooting stars fly out of Perseus.'
      },
      mention: { 8: 'Algol' },
      stars: [
        ['η Per', 42.67, 55.90, 3.8],
        ['γ Per', 46.20, 53.51, 2.9],
        ['Mirfak', 51.08, 49.86, 1.8],
        ['δ Per', 55.73, 47.79, 3.0],
        ['ε Per', 59.46, 40.01, 2.9],
        ['ξ Per', 59.74, 35.79, 4.0],
        ['ζ Per', 58.53, 31.88, 2.9],
        ['κ Per', 47.37, 44.86, 3.8, 2],
        ['Algol', 47.04, 40.96, 2.1],
        ['ρ Per', 46.29, 38.84, 3.4]
      ]
    },
    {
      id: 'pegasus',
      emoji: '🐎',
      name: { et: 'Pegasus', en: 'Pegasus' },
      fact: {
        et: 'Pegasus on tiibadega hobune. Tähed 1, 2, 3 ja 4 moodustavad suure ruudu, mida on sügisõhtuti lihtne leida. Täht 1 kuulub ka Andromeeda tähtkujusse.',
        en: 'Pegasus is a horse with wings. Stars 1, 2, 3 and 4 make a big square that is easy to find on autumn evenings. Star 1 also belongs to Andromeda.'
      },
      mention: { 0: '', 1: '', 2: '', 3: '' },
      stars: [
        ['Alpheratz', 2.10, 29.09, 2.1],
        ['Scheat', 345.94, 28.08, 2.4],
        ['Markab', 346.19, 15.21, 2.5],
        ['Algenib', 3.31, 15.18, 2.8],
        ['Homam', 340.37, 10.83, 3.4, 2],
        ['Biham', 332.55, 6.20, 3.5],
        ['Enif', 326.05, 9.88, 2.4],
        ['Matar', 340.75, 30.22, 2.9, 1],
        ['π Peg', 332.50, 33.18, 4.3],
        ['μ Peg', 342.50, 24.60, 3.5, 1],
        ['ι Peg', 331.75, 25.35, 3.8],
        ['κ Peg', 326.16, 25.65, 4.1]
      ],
      extra: [[3, 0]]
    },
    {
      id: 'hercules',
      emoji: '💪',
      name: { et: 'Herkules', en: 'Hercules' },
      fact: {
        et: 'Herkules on vanade lugude kõige tugevam kangelane. Taevas on ta pea alaspidi. Tähed 1–4 on tema keha. Tähtede 1 ja 2 vahel on udune laik M13 – kerasparv, kus on sadu tuhandeid tähti.',
        en: 'Hercules is the strongest hero of the old stories. In the sky he hangs upside down. Stars 1 to 4 are his body. Between stars 1 and 2 is a misty patch, M13 – a globular cluster of hundreds of thousands of stars.'
      },
      mention: { 0: '', 1: '', 2: '', 3: '' },
      deco: [{ ra: 250.42, dec: 36.46, kind: 'cluster', name: 'M13' }],
      stars: [
        ['ζ Her', 250.32, 31.60, 2.8],
        ['η Her', 250.72, 38.92, 3.5],
        ['π Her', 258.76, 36.81, 3.2],
        ['ε Her', 255.07, 30.93, 3.9],
        ['Kornephoros', 247.55, 21.49, 2.8, 0],
        ['γ Her', 245.48, 19.15, 3.8],
        ['Sarin', 258.76, 24.84, 3.1, 3],
        ['Rasalgethi', 258.66, 14.39, 3.1],
        ['θ Her', 269.06, 37.25, 3.9, 2],
        ['ι Her', 264.87, 46.01, 3.8],
        ['σ Her', 248.53, 42.44, 4.2, 1],
        ['τ Her', 244.94, 46.31, 3.9]
      ],
      extra: [[3, 0]]
    },
    {
      id: 'canismajor',
      emoji: '🐕',
      name: { et: 'Suur Peni', en: 'Canis Major, the Great Dog' },
      fact: {
        et: 'Suur Peni on kütt Orioni koer. Täht 1, Siirius, on kogu öötaeva kõige heledam täht. Eestis paistab ta talvel madalal lõunas. Siiriuse leiad, kui jätkad Orioni vöö kolme tähe joont vasakule alla.',
        en: 'The Great Dog is the hunter Orion’s dog. Star 1, Sirius, is the brightest star in the whole night sky. In Estonia it shines low in the south in winter. You can find Sirius by carrying on the line of Orion’s three belt stars down to the left.'
      },
      mention: { 0: { et: 'Siirius', en: 'Sirius' } },
      // the IAU figure: the dog's body and legs, then the head above Sirius
      stars: [
        ['Sirius', 101.29, -16.72, -1.5],
        ['Mirzam', 95.67, -17.96, 2.0],
        ['ν2 CMa', 99.17, -19.26, 3.9],
        ['ο1 CMa', 103.53, -24.18, 3.9],
        ['Adhara', 104.66, -28.97, 1.5],
        ['σ CMa', 105.43, -27.93, 3.5],
        ['Wezen', 107.10, -26.39, 1.8],
        ['ο2 CMa', 105.76, -23.83, 3.0],
        ['Aludra', 111.02, -29.30, 2.4, 6],
        ['ι CMa', 104.03, -17.05, 4.4, 0],
        ['Muliphein', 105.94, -15.63, 4.1],
        ['θ CMa', 103.55, -12.04, 4.1]
      ],
      extra: [[7, 0], [11, 9]]
    },
    {
      id: 'orion',
      emoji: '🏹',
      name: { et: 'Orion', en: 'Orion' },
      fact: {
        et: 'Orion on taevane kütt, kes hoiab ühes käes nuia ja teises kilpi. Tähed 4, 5 ja 6 on tema vöö. Vöö all on Orioni udu – sellest saad teha ka pusle!',
        en: 'Orion is a hunter in the sky, with a club in one hand and a shield in the other. Stars 4, 5 and 6 are his belt. Below the belt is the Orion Nebula – you can make a puzzle of it too!'
      },
      mention: { 3: '', 4: '', 5: '' },
      deco: [{ ra: 83.82, dec: -5.39, kind: 'nebula', name: { et: 'Orioni udu', en: 'Orion Nebula' } }],
      stars: [
        ['Betelgeuse', 88.79, 7.41, 0.5],
        ['Meissa', 83.78, 9.93, 3.4],
        ['Bellatrix', 81.28, 6.35, 1.6],
        ['Mintaka', 83.00, -0.30, 2.2],
        ['Alnilam', 84.05, -1.20, 1.7],
        ['Alnitak', 85.19, -1.94, 1.8],
        ['Saiph', 86.94, -9.67, 2.1],
        ['Rigel', 78.63, -8.20, 0.1, 3],
        ['μ Ori', 90.60, 9.65, 4.1, 0],
        ['ξ Ori', 92.99, 14.21, 4.5],
        ['π3 Ori', 72.46, 6.96, 3.2, 2],
        ['π1 Ori', 73.72, 10.15, 4.6],
        ['π5 Ori', 73.56, 2.44, 3.7, 10]
      ],
      extra: [[5, 0]]
    },
    {
      id: 'gemini',
      emoji: '👬',
      name: { et: 'Kaksikud', en: 'Gemini, the Twins' },
      fact: {
        et: 'Kaksikud on kaks venda, Kastor ja Polluks, kes hoiavad käest kinni. Tähed 1 ja 9 on nende pead. Kaksikuid näeb hästi talveõhtutel.',
        en: 'The Twins are two brothers, Castor and Pollux, holding hands. Stars 1 and 9 are their heads. You can see the Twins well on winter evenings.'
      },
      mention: { 0: { et: 'Kastor', en: 'Castor' }, 8: { et: 'Polluks', en: 'Pollux' } },
      // two stick figures holding hands: Castor's twin, the hands, Pollux's twin
      stars: [
        ['Castor', 113.65, 31.89, 1.6],
        ['τ Gem', 107.78, 30.25, 4.4],
        ['Mebsuta', 100.98, 25.13, 3.0],
        ['Tejat', 95.74, 22.51, 2.9],
        ['Propus', 93.72, 22.51, 3.3],
        ['ν Gem', 97.24, 20.21, 4.1, 2],
        ['ι Gem', 111.43, 27.80, 3.8, 1],
        ['υ Gem', 113.98, 26.90, 4.1],
        ['Pollux', 116.33, 28.03, 1.1],
        ['Wasat', 110.03, 21.98, 3.5, 7],
        ['Mekbuda', 106.03, 20.57, 3.9],
        ['Alhena', 99.43, 16.40, 1.9],
        ['λ Gem', 109.52, 16.54, 3.6, 9],
        ['ξ Gem', 101.32, 12.90, 3.4]
      ]
    },
    {
      id: 'virgo',
      emoji: '🌾',
      name: { et: 'Neitsi', en: 'Virgo, the Maiden' },
      fact: {
        et: 'Neitsi on kevadine tähtkuju. Ta hoiab käes viljapead – see on täht 1, Spiika. Spiika leiad, kui jätkad Suure Vankri aisa kaart Arktuuruseni ja sealt veel edasi.',
        en: 'Virgo is a spring constellation. She holds an ear of wheat – that is star 1, Spica. You can find Spica by following the curve of the Big Dipper’s handle to Arcturus and then on further.'
      },
      mention: { 0: { et: 'Spiika', en: 'Spica' } },
      // the IAU figure: Spica, Porrima in the middle, the four stars of the
      // head, Vindemiatrix, and the two lines out to the east
      stars: [
        ['Spica', 201.30, -11.16, 1.0],
        ['θ Vir', 197.49, -5.54, 4.4],
        ['Porrima', 190.42, -1.45, 2.7],
        ['Minelauva', 193.90, 3.40, 3.4],
        ['Vindemiatrix', 195.54, 10.96, 2.8],
        ['Zaniah', 184.98, -0.67, 3.9, 2],
        ['Zavijava', 177.67, 1.76, 3.6],
        ['ν Vir', 176.46, 6.53, 4.0],
        ['ο Vir', 181.30, 8.73, 4.1],
        ['Heze', 203.67, -0.60, 3.4, 2],
        ['τ Vir', 210.41, 1.54, 4.3],
        ['109 Vir', 221.56, 1.89, 3.7],
        ['ι Vir', 214.00, -6.00, 4.1, 9],
        ['μ Vir', 220.77, -5.66, 3.9]
      ],
      extra: [[8, 5]]
    },
    {
      id: 'draco',
      emoji: '🐉',
      name: { et: 'Lohe', en: 'Draco, the Dragon' },
      fact: {
        et: 'Lohe pikk keha looklev Suure ja Väikese Vankri vahel. Tähed 1–4 on tema pea. Täht 12, Thuban, oli Põhjanael siis, kui Egiptuses ehitati püramiide.',
        en: 'The Dragon’s long body winds between the Big and Little Dippers. Stars 1 to 4 are its head. Star 12, Thuban, was the North Star when the pyramids were built in Egypt.'
      },
      mention: { 0: '', 1: '', 2: '', 3: '', 11: 'Thuban' },
      stars: [
        ['Eltanin', 269.15, 51.49, 2.2],
        ['Rastaban', 262.61, 52.30, 2.8],
        ['Kuma', 263.07, 55.17, 4.9],
        ['Grumium', 268.38, 56.87, 3.8],
        ['Altais', 288.14, 67.66, 3.1],
        ['ε Dra', 297.04, 70.27, 3.8],
        ['χ Dra', 275.26, 72.73, 3.6],
        ['Aldhibah', 257.20, 65.71, 3.2],
        ['Athebyne', 245.99, 61.51, 2.7],
        ['θ Dra', 240.47, 58.57, 4.0],
        ['Edasich', 231.23, 58.97, 3.3],
        ['Thuban', 211.10, 64.38, 3.7],
        ['κ Dra', 188.37, 69.79, 3.9],
        ['Giausar', 172.85, 69.33, 3.8]
      ],
      extra: [[3, 0]]
    },
    {
      id: 'scorpius',
      emoji: '🦂',
      name: { et: 'Skorpion', en: 'Scorpius, the Scorpion' },
      fact: {
        et: 'Skorpioni süda on punane hiidtäht Antaares, number 1. Eestis paistab Antaares suveöödel ainult madalal lõunas ja skorpioni saba ei tõuse siin üldse silmapiiri kohale. Kogu skorpioni näeb lõuna pool, näiteks Kreekas.',
        en: 'The scorpion’s heart is the red giant star Antares, number 1. In Estonia Antares is only seen low in the south on summer nights, and the scorpion’s tail never rises above the horizon here. You can see the whole scorpion further south, for example in Greece.'
      },
      mention: { 0: { et: 'Antaares', en: 'Antares' } },
      // stood up on the menu card (only), so that the claws do not reach
      // under the 🌟 in its corner
      cardTurn: -35,
      stars: [
        ['Antares', 247.35, -26.43, 1.0],
        ['σ Sco', 245.30, -25.59, 2.9],
        ['Dschubba', 240.08, -22.62, 2.3],
        ['Acrab', 241.36, -19.81, 2.6],
        ['π Sco', 239.71, -26.11, 2.9, 2],
        ['τ Sco', 248.97, -28.22, 2.8, 0],
        ['ε Sco', 252.54, -34.29, 2.3],
        ['μ Sco', 252.97, -38.05, 3.0],
        ['ζ Sco', 253.65, -42.36, 3.6],
        ['η Sco', 258.04, -43.24, 3.3],
        ['Sargas', 264.33, -43.00, 1.9],
        ['ι Sco', 266.90, -40.13, 3.0],
        ['κ Sco', 265.62, -39.03, 2.4],
        ['Shaula', 263.40, -37.10, 1.6]
      ]
    },
    {
      id: 'crux',
      emoji: '🧭',
      name: { et: 'Lõunarist', en: 'Southern Cross' },
      fact: {
        et: 'Lõunarist on kõige väiksem tähtkuju. Eestist teda ei näe, sest ta on lõunataevas. Lõunapoolkeral leitakse tema abil lõunasuund: kui jätkad joont tähest 1 tähe 2 poole, näitab see lõunasse. Lõunaristi tähed on ka Austraalia ja Uus-Meremaa lipul.',
        en: 'The Southern Cross is the smallest constellation. You cannot see it from Estonia, because it is in the southern sky. In the southern half of the Earth, people use it to find south: carry on the line from star 1 towards star 2 and it points south. The stars of the Southern Cross are also on the flags of Australia and New Zealand.'
      },
      mention: { 0: '', 1: '' },
      // the long bar from top to bottom, then the short bar
      stars: [
        ['Gacrux', 187.79, -57.11, 1.6],
        ['Acrux', 186.65, -63.10, 0.8],
        ['Mimosa', 191.93, -59.69, 1.3, null],
        ['Imai', 183.79, -58.75, 2.8]
      ]
    }
  ];

  const TEXT = {
    et: {
      title: 'Tähtkujud',
      intro: 'Vali tähtkuju ja ühenda tähed numbrite järjekorras: 1, 2, 3 …',
      wellDone: 'Tubli!',
      again: 'Uuesti',
      other: 'Teine tähtkuju',
      allGames: 'Kõik mängud',
      menu: 'Menüü',
      guide: 'Vihje',
      sound: 'Heli',
      reset: 'Eemalda kõik 🌟',
      resetAsk: 'Kas eemaldada 🌟 kõigilt lahendatud tähtkujudelt?'
    },
    en: {
      title: 'Constellations',
      intro: 'Pick a constellation and join the stars in order: 1, 2, 3 …',
      wellDone: 'Well done!',
      again: 'Again',
      other: 'New constellation',
      allGames: 'All games',
      menu: 'Menu',
      guide: 'Hint',
      sound: 'Sound',
      reset: 'Clear all 🌟',
      resetAsk: 'Remove the 🌟 from all solved constellations?'
    }
  };

  const LINE_MS = 350;    // how long a new line takes to draw
  const HINT_MS = 3500;   // the next star starts to pulse after this long without progress
  const TAU = Math.PI * 2;
  const DEG = Math.PI / 180;

  // ---------------------------------------------------------------------------
  // State & helpers
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('tahtkujud.');

  const state = {
    idx: 0,
    guide: store.get('guide', false),
    finished: store.get('finished', []),
    L: null,
    lit: 0,          // stars 0 .. lit-1 are joined
    litAt: [],       // when each star was lit (performance.now())
    lastStep: 0,
    wrong: null,     // { i, t }: a star tapped out of turn wiggles
    pointer: null,   // id of the pointer that is down
    done: false,
    raf: 0
  };
  if (!Array.isArray(state.finished)) state.finished = [];

  const area = $('area');
  const sky = $('sky');

  // Small fast seeded random generator, so background stars stay put.
  function seeded(str) {
    let h = 1779033703;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    return () => {
      h = Math.imul(h ^ (h >>> 15), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }

  function links(con) {
    const out = [];
    con.stars.forEach((s, i) => {
      const from = s[4] === undefined ? i - 1 : s[4];
      if (from !== null && from >= 0) out.push([from, i]);
    });
    return out.concat(con.extra || []);
  }

  // Gnomonic projection around the middle of the constellation, as on a sky
  // chart: north up, east to the left, then turned by `turn` degrees
  // (clockwise on the screen). Unit: radians on the sky.
  // Returns the stars first, then the deco objects.
  function project(con, turn = 0) {
    const vec = (ra, dec) => {
      const a = ra * DEG;
      const d = dec * DEG;
      return [Math.cos(d) * Math.cos(a), Math.cos(d) * Math.sin(a), Math.sin(d)];
    };
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const norm = (a) => { const l = Math.hypot(...a); return a.map((x) => x / l); };

    const vs = con.stars.map((s) => vec(s[1], s[2]));
    const c = norm(vs.reduce((s, v) => [s[0] + v[0], s[1] + v[1], s[2] + v[2]], [0, 0, 0]));
    const east = norm(cross([0, 0, 1], c));
    const north = cross(c, east);
    const deco = (con.deco || []).map((d) => vec(d.ra, d.dec));
    const t = turn * DEG;
    return vs.concat(deco).map((v) => {
      const k = dot(v, c);
      const x = -dot(v, east) / k;
      const y = -dot(v, north) / k;
      return { x: x * Math.cos(t) - y * Math.sin(t), y: x * Math.sin(t) + y * Math.cos(t) };
    });
  }

  function segDist(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const l2 = dx * dx + dy * dy;
    const k = l2 ? clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / l2, 0, 1) : 0;
    return Math.hypot(p.x - (a.x + k * dx), p.y - (a.y + k * dy));
  }

  // Fit the constellation into W x H, north up as on the menu card, so that
  // Orion stands upright and the swan flies the same way.
  function computeLayout(con, W, H, opts = {}) {
    const u = Math.min(W, H);
    const pad = opts.pad !== undefined ? opts.pad : clamp(u * 0.12, 44, 110);
    const box = (ps) => {
      const xs = ps.map((p) => p.x);
      const ys = ps.map((p) => p.y);
      const x0 = Math.min(...xs);
      const y0 = Math.min(...ys);
      return { x0, y0, w: Math.max(...xs) - x0, h: Math.max(...ys) - y0 };
    };
    const all = project(con, opts.turn);
    const n = con.stars.length;
    const b = box(all.slice(0, n));
    const s = Math.min((W - 2 * pad) / Math.max(b.w, 1e-6), (H - 2 * pad) / Math.max(b.h, 1e-6));
    const place = (p) => ({
      x: W / 2 + (p.x - b.x0 - b.w / 2) * s,
      y: H / 2 + (p.y - b.y0 - b.h / 2) * s
    });
    const P = all.slice(0, n).map(place);
    const deco = (con.deco || []).map((d, k) => Object.assign({}, d, place(all[n + k])));

    const rad = con.stars.map((st) => Math.max(5, u * 0.011 * (1 + 0.28 * (4.5 - st[3]))));
    const fs = clamp(u * 0.05, 20, 40);
    const L = { W, H, u, P, rad, fs, deco, links: links(con), hitR: Math.max(34, u * 0.07) };
    L.labels = placeLabels(L);
    L.bg = backgroundStars(con, L);
    return L;
  }

  // Put each number on the side of its star that is furthest from lines,
  // other stars and numbers already placed.
  function placeLabels(L) {
    const { P, rad, fs, W, H } = L;
    const segs = L.links.map(([a, b]) => [P[a], P[b]]);
    const placed = [];
    return P.map((p, i) => {
      let best = null;
      let bestScore = -Infinity;
      for (let k = 0; k < 8; k++) {
        const ang = (k * Math.PI) / 4;
        const d = rad[i] + fs * 0.85;
        const q = { x: p.x + Math.cos(ang) * d, y: p.y + Math.sin(ang) * d };
        let score = Infinity;
        for (const [a, b] of segs) score = Math.min(score, segDist(q, a, b));
        P.forEach((o, j) => {
          if (j !== i) score = Math.min(score, Math.hypot(q.x - o.x, q.y - o.y) - rad[j]);
        });
        for (const o of placed) score = Math.min(score, Math.hypot(q.x - o.x, q.y - o.y) - fs);
        const m = fs * 0.7;
        if (q.x < m || q.x > W - m || q.y < m || q.y > H - m) score -= 1000;
        if (k === 1) score += 1; // slight preference for below right
        if (score > bestScore) {
          bestScore = score;
          best = q;
        }
      }
      placed.push(best);
      return best;
    });
  }

  // Faint unnumbered stars for a real-sky feel, kept away from the game stars.
  function backgroundStars(con, L) {
    const rnd = seeded(con.id);
    const n = Math.round((L.W * L.H) / 7000);
    const out = [];
    for (let k = 0; k < n; k++) {
      const s = {
        x: rnd() * L.W,
        y: rnd() * L.H,
        r: 0.5 + rnd() * rnd() * 1.6,
        a: 0.25 + rnd() * 0.45,
        f: 0.5 + rnd(),
        ph: rnd() * TAU
      };
      if (L.P.some((p) => Math.hypot(p.x - s.x, p.y - s.y) < L.hitR)) continue;
      out.push(s);
    }
    return out;
  }

  // ---------------------------------------------------------------------------
  // Drawing
  // ---------------------------------------------------------------------------

  const decoSize = (d, u) => u * (d.kind === 'galaxy' ? 0.09 : 0.04);

  // Misty patches for the nebula, galaxy or star cluster a fact talks about.
  function drawDeco(ctx, L) {
    for (const d of L.deco) {
      const R = decoSize(d, L.u);
      ctx.save();
      ctx.translate(d.x, d.y);
      if (d.kind === 'galaxy') {
        // long axis at position angle d.angle, measured from north through east
        const pa = d.angle * DEG;
        ctx.rotate(Math.atan2(-Math.cos(pa), -Math.sin(pa)));
        ctx.scale(1, 0.32);
      }
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
      if (d.kind === 'galaxy') {
        g.addColorStop(0, 'rgba(255, 248, 230, 1)');
        g.addColorStop(0.2, 'rgba(255, 240, 220, 0.8)');
        g.addColorStop(0.55, 'rgba(200, 205, 255, 0.4)');
        g.addColorStop(1, 'rgba(160, 170, 255, 0)');
      } else if (d.kind === 'cluster') {
        g.addColorStop(0, 'rgba(255, 252, 235, 1)');
        g.addColorStop(0.25, 'rgba(255, 238, 200, 0.7)');
        g.addColorStop(1, 'rgba(255, 220, 160, 0)');
      } else {
        g.addColorStop(0, 'rgba(255, 235, 245, 0.9)');
        g.addColorStop(0.3, 'rgba(255, 120, 190, 0.45)');
        g.addColorStop(1, 'rgba(120, 90, 255, 0)');
      }
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }

  // Of the candidate spots for a label ({ left, y, bonus }), the one furthest
  // from lines, stars (except star `own`), deco objects and labels already
  // placed (`taken`, rectangles), and inside the picture.
  function bestSpot(L, cands, w, h, own, taken) {
    const segs = L.links.map(([a, b]) => [L.P[a], L.P[b]]);
    let best = cands[0];
    let bestScore = -Infinity;
    for (const c of cands) {
      let score = Infinity;
      for (let f = 0; f <= 1; f += 0.25) {
        const q = { x: c.left + w * f, y: c.y };
        for (const [a, b] of segs) score = Math.min(score, segDist(q, a, b) - h / 2);
        L.P.forEach((o, j) => {
          if (j !== own) score = Math.min(score, Math.hypot(q.x - o.x, q.y - o.y) - L.rad[j] * 2 - h / 2);
        });
        for (const d of L.deco) score = Math.min(score, Math.hypot(q.x - d.x, q.y - d.y) - decoSize(d, L.u) * 0.5 - h / 2);
      }
      for (const r of taken) {
        if (c.left < r.left + r.w && r.left < c.left + w && Math.abs(c.y - r.y) < h) score -= 500;
      }
      const m = h * 0.3;
      if (c.left < m || c.left + w > L.W - m || c.y - h / 2 < m || c.y + h / 2 > L.H - m) score -= 1000;
      score += c.bonus || 0;
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    taken.push({ left: best.left, y: best.y, w });
    return best;
  }

  // Ring and label "number name" for each star the fact talks about, and the
  // name beside each nebula or galaxy.
  function drawMentions(ctx, L, con, lang) {
    const { P, rad, u } = L;
    const fs = L.fs * 0.85;
    const h = fs * 1.1;
    const nameOf = (x) => (typeof x === 'string' ? x : x[lang]);
    const taken = [];
    ctx.font = `900 ${fs}px Nunito, ui-rounded, "Trebuchet MS", sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.lineJoin = 'round';

    const text = (str, spot) => {
      ctx.lineWidth = fs * 0.24;
      ctx.strokeStyle = 'rgba(5, 8, 30, 0.9)';
      ctx.strokeText(str, spot.left, spot.y + fs * 0.04);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(str, spot.left, spot.y + fs * 0.04);
    };

    for (const key of Object.keys(con.mention || {})) {
      const i = Number(key);
      const p = P[i];
      // ring no wider than half the way to the nearest star (Orion's belt)
      let near = Infinity;
      P.forEach((o, j) => { if (j !== i) near = Math.min(near, Math.hypot(o.x - p.x, o.y - p.y)); });
      const ringR = Math.max(rad[i] + 4, Math.min(rad[i] * 1.6 + u * 0.018, near * 0.48));
      ctx.strokeStyle = '#5fd4ff';
      ctx.lineWidth = Math.max(3, u * 0.005);
      ctx.beginPath();
      ctx.arc(p.x, p.y, ringR, 0, TAU);
      ctx.stroke();

      const name = nameOf(con.mention[key]);
      const str = String(i + 1) + (name ? ' ' + name : '');
      const w = ctx.measureText(str).width;
      const cands = [];
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4;
        const cx = Math.cos(a);
        const cy = Math.sin(a);
        const qx = p.x + cx * (ringR + fs * 0.35);
        const qy = p.y + cy * (ringR + h * 0.55);
        const left = cx > 0.3 ? qx : cx < -0.3 ? qx - w : qx - w / 2;
        cands.push({ left, y: qy, bonus: k === 0 ? 2 : 0 }); // slight preference for the right
      }
      text(str, bestSpot(L, cands, w, h, i, taken));
    }

    for (const d of L.deco) {
      const str = nameOf(d.name);
      const w = ctx.measureText(str).width;
      const R = decoSize(d, u) * 0.6 + fs * 0.5;
      const cands = [
        { left: d.x - w / 2, y: d.y + R + h * 0.3, bonus: 2 },
        { left: d.x - w / 2, y: d.y - R - h * 0.3 },
        { left: d.x + R, y: d.y },
        { left: d.x - R - w, y: d.y }
      ];
      text(str, bestSpot(L, cands, w, h, -1, taken));
    }
  }

  // v: { lit, litAt, now, guide, hint, wrong, numbers, background, deco }
  function drawScene(ctx, L, v) {
    const { W, H, u, P, rad, fs } = L;
    ctx.clearRect(0, 0, W, H);
    if (v.background) {
      const g = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.5, H * 0.5, Math.hypot(W, H) * 0.7);
      g.addColorStop(0, '#24357f');
      g.addColorStop(1, '#070b26');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    for (const b of L.bg) {
      ctx.globalAlpha = b.a * (0.65 + 0.35 * Math.sin(v.now * 0.0012 * b.f + b.ph));
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.lineCap = 'round';
    if (v.deco) drawDeco(ctx, L);

    if (v.guide) {
      ctx.setLineDash([u * 0.012, u * 0.016]);
      ctx.strokeStyle = 'rgba(95, 212, 255, 0.4)';
      ctx.lineWidth = Math.max(2, u * 0.004);
      for (const [a, b] of L.links) {
        ctx.beginPath();
        ctx.moveTo(P[a].x, P[a].y);
        ctx.lineTo(P[b].x, P[b].y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // lines between lit stars, growing from the star lit first
    const lw = Math.max(3, u * 0.009);
    ctx.strokeStyle = '#ffd34d';
    ctx.lineWidth = lw;
    ctx.shadowColor = 'rgba(255, 211, 77, 0.8)';
    ctx.shadowBlur = lw * 2.5;
    for (const [a, b] of L.links) {
      if (a >= v.lit || b >= v.lit) continue;
      const [s, e] = v.litAt[a] <= v.litAt[b] ? [a, b] : [b, a];
      const k = clamp((v.now - v.litAt[e]) / LINE_MS, 0, 1);
      ctx.beginPath();
      ctx.moveTo(P[s].x, P[s].y);
      ctx.lineTo(P[s].x + (P[e].x - P[s].x) * k, P[s].y + (P[e].y - P[s].y) * k);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    P.forEach((p, i) => {
      const lit = i < v.lit;
      let x = p.x;
      if (v.wrong && v.wrong.i === i) {
        const dt = v.now - v.wrong.t;
        if (dt < 450) x += Math.sin(dt * 0.07) * u * 0.012 * (1 - dt / 450);
      }
      let r = rad[i];
      if (lit) {
        const k = clamp((v.now - v.litAt[i]) / 300, 0, 1);
        r *= 1 + 0.7 * Math.sin(k * Math.PI);
      }

      const glow = ctx.createRadialGradient(x, p.y, 0, x, p.y, r * 3.2);
      glow.addColorStop(0, lit ? 'rgba(255, 211, 77, 0.65)' : 'rgba(190, 225, 255, 0.5)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, p.y, r * 3.2, 0, TAU);
      ctx.fill();

      ctx.fillStyle = lit ? '#ffe9a0' : '#ffffff';
      ctx.beginPath();
      ctx.arc(x, p.y, r, 0, TAU);
      ctx.fill();

      if (i === v.lit && v.hint) {
        const k = (v.now % 1300) / 1300;
        ctx.strokeStyle = `rgba(95, 212, 255, ${0.9 * (1 - k)})`;
        ctx.lineWidth = Math.max(3, u * 0.006);
        ctx.beginPath();
        ctx.arc(x, p.y, r + L.hitR * 0.25 + L.hitR * 0.6 * k, 0, TAU);
        ctx.stroke();
      }
    });

    if (v.numbers) {
      ctx.font = `900 ${fs}px Nunito, ui-rounded, "Trebuchet MS", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';
      ctx.lineWidth = fs * 0.22;
      ctx.strokeStyle = 'rgba(5, 8, 30, 0.85)';
      L.labels.forEach((q, i) => {
        const lit = i < v.lit;
        ctx.fillStyle = lit ? 'rgba(255, 211, 77, 0.7)' : '#ffffff';
        ctx.strokeText(String(i + 1), q.x, q.y + fs * 0.04);
        ctx.fillText(String(i + 1), q.x, q.y + fs * 0.04);
      });
    }
  }

  // A finished constellation as a picture, for menu cards and the win screen.
  // With opts.lang, the stars and objects the fact talks about are marked.
  // With opts.card, it is turned by con.cardTurn for the menu.
  function renderPicture(con, size, opts = {}) {
    const dpr = window.devicePixelRatio || 1;
    const cv = opts.canvas || document.createElement('canvas');
    cv.width = Math.round(size * dpr);
    cv.height = Math.round(size * dpr);
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const L = computeLayout(con, size, size, { pad: size * 0.13, turn: opts.card && con.cardTurn });
    drawScene(ctx, L, {
      lit: con.stars.length,
      litAt: con.stars.map(() => -Infinity),
      now: 0,
      numbers: false,
      background: true,
      deco: !!opts.lang
    });
    if (opts.lang) drawMentions(ctx, L, con, opts.lang);
    return cv;
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    const cards = $('cards');
    CONSTELLATIONS.forEach((con, i) => {
      const b = document.createElement('button');
      b.className = 'pic';
      b.appendChild(renderPicture(con, 220, { card: true }));
      b.insertAdjacentHTML('beforeend',
        `<span class="name"></span><b class="count-badge">⭐ ${con.stars.length}</b><b class="done-badge hidden">🌟</b>`);
      b.addEventListener('click', () => {
        sfx.pick();
        startGame(i);
      });
      cards.appendChild(b);
    });
  }

  function updateMenu() {
    [...$('cards').children].forEach((b, i) => {
      const con = CONSTELLATIONS[i];
      b.querySelector('.name').textContent = `${con.emoji} ${con.name[Astro.lang]}`;
      b.querySelector('.done-badge').classList.toggle('hidden', !state.finished.includes(con.id));
    });
    $('resetBtn').classList.toggle('hidden', !state.finished.length);
  }

  function showMenu() {
    stopLoop();
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // Game
  // ---------------------------------------------------------------------------

  function startGame(i) {
    state.idx = i;
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');

    state.lit = 0;
    state.litAt = [];
    state.wrong = null;
    state.pointer = null;
    state.done = false;
    state.lastStep = performance.now();
    layout();
    updateProgress();
    updateToggles();
    startLoop();
  }

  function layout() {
    const W = area.clientWidth;
    const H = area.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    sky.width = Math.round(W * dpr);
    sky.height = Math.round(H * dpr);
    state.L = computeLayout(CONSTELLATIONS[state.idx], W, H);
  }

  function frame() {
    // same clock as litAt (a frame's own timestamp can be older than a tap)
    const now = performance.now();
    const ctx = sky.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawScene(ctx, state.L, {
      lit: state.lit,
      litAt: state.litAt,
      now,
      guide: state.guide && !state.done,
      hint: !state.done && (state.lit === 0 || now - state.lastStep > HINT_MS),
      wrong: state.wrong,
      numbers: true
    });
    state.raf = requestAnimationFrame(frame);
  }

  function startLoop() {
    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(frame);
  }

  function stopLoop() {
    cancelAnimationFrame(state.raf);
    state.raf = 0;
  }

  function updateProgress() {
    const total = CONSTELLATIONS[state.idx].stars.length;
    $('progressFill').style.width = (100 * state.lit) / total + '%';
    $('progressText').textContent = `⭐ ${state.lit} / ${total}`;
  }

  function updateToggles() {
    $('guideBtn').classList.toggle('off', !state.guide);
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Tapping and tracing
  // ---------------------------------------------------------------------------

  function localPoint(e) {
    const r = sky.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function nearestStar(pt) {
    const { P, hitR } = state.L;
    let best = -1;
    let bestD = hitR;
    P.forEach((p, i) => {
      const d = Math.hypot(pt.x - p.x, pt.y - p.y);
      if (d < bestD) {
        best = i;
        bestD = d;
      }
    });
    return best;
  }

  // A tap on the right star joins it; so does sliding a finger onto it.
  // Only a tap on a wrong star is answered, with a wiggle and a soft sound.
  function touchStar(pt, tap) {
    if (state.done) return;
    const next = state.L.P[state.lit];
    // be kind to small fingers: the right star wins if it is within reach,
    // even when another star (e.g. in Orion's belt) is a little closer
    if (Math.hypot(pt.x - next.x, pt.y - next.y) < state.L.hitR) {
      joinNext();
      return;
    }
    const i = nearestStar(pt);
    if (i < 0) return;
    if (i === state.lit) {
      joinNext();
    } else if (tap && i > state.lit) {
      state.wrong = { i, t: performance.now() };
      sfx.oops();
    }
  }

  function joinNext() {
    const now = performance.now();
    state.litAt[state.lit] = now;
    sfx.note(state.lit);
    state.lit++;
    state.lastStep = now;
    state.wrong = null;
    updateProgress();
    if (state.lit === CONSTELLATIONS[state.idx].stars.length) win();
  }

  sky.addEventListener('pointerdown', (e) => {
    if (state.pointer !== null || !state.L) return;
    e.preventDefault();
    sky.setPointerCapture(e.pointerId);
    state.pointer = e.pointerId;
    touchStar(localPoint(e), true);
  });
  sky.addEventListener('pointermove', (e) => {
    if (e.pointerId === state.pointer) touchStar(localPoint(e), false);
  });
  const release = (e) => {
    if (e.pointerId === state.pointer) state.pointer = null;
  };
  sky.addEventListener('pointerup', release);
  sky.addEventListener('pointercancel', release);

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  function win() {
    state.done = true;
    const con = CONSTELLATIONS[state.idx];
    if (!state.finished.includes(con.id)) {
      state.finished.push(con.id);
      store.set('finished', state.finished);
    }
    setTimeout(() => sfx.win(), 450);
    setTimeout(() => {
      if (!state.done || $('game').classList.contains('hidden')) return;
      stopLoop();
      $('winImg').src = renderPicture(con, 900, { lang: Astro.lang }).toDataURL('image/png');
      $('winName').textContent = `${con.emoji} ${con.name[Astro.lang]}`;
      $('winFact').textContent = con.fact[Astro.lang];
      $('win').classList.remove('hidden');
      Astro.startConfetti($('confetti'));
    }, 1600);
  }

  // ---------------------------------------------------------------------------
  // Resizing
  // ---------------------------------------------------------------------------

  // Watch the play area itself, which also catches a phone's address bar
  // showing or hiding.
  new ResizeObserver(() => {
    if ($('game').classList.contains('hidden') || !state.L) return;
    if (area.clientWidth !== state.L.W || area.clientHeight !== state.L.H) layout();
  }).observe(area);

  // ---------------------------------------------------------------------------
  // Buttons
  // ---------------------------------------------------------------------------

  $('againBtn').addEventListener('click', () => startGame(state.idx));
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);

  $('resetBtn').addEventListener('click', () => {
    if (!window.confirm(TEXT[Astro.lang].resetAsk)) return;
    state.finished = [];
    store.set('finished', state.finished);
    updateMenu();
  });

  $('guideBtn').addEventListener('click', () => {
    state.guide = !state.guide;
    store.set('guide', state.guide);
    updateToggles();
  });

  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  buildMenu();
  Astro.setupLanguage(TEXT, updateMenu);
})();
