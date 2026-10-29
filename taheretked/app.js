'use strict';

(() => {
  const { $, clamp, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  const DEG = Math.PI / 180;
  const LAT = 58.0 * DEG;   // Tõrva
  const LON = 25.93;        // degrees east
  // the clock is on winter time all the year round, UT + 2 hours, so that
  // the hours do not jump in spring and autumn
  const TZ = 2;

  // The stars the tasks use, as RA and Dec (J2000, degrees), visual magnitude,
  // name and, if it is not white, colour. The figures are as in
  // tahtkujud/app.js.
  const S = (ra, dec, mag, name, color) => ({ ra, dec, mag, name, color });
  const STARS = {
    // Suur Vanker
    dubhe: S(165.93, 61.75, 1.8, 'Dubhe', '255, 226, 180'),
    merak: S(165.46, 56.38, 2.4, 'Merak'),
    phecda: S(178.46, 53.69, 2.4, 'Phecda'),
    megrez: S(183.86, 57.03, 3.3, 'Megrez'),
    alioth: S(193.51, 55.96, 1.8, 'Alioth'),
    mizar: S(200.98, 54.93, 2.2, { et: 'Miitsar', en: 'Mizar' }),
    alkaid: S(206.89, 49.31, 1.9, 'Alkaid'),
    // Väike Vanker
    polaris: S(37.95, 89.26, 2.0, { et: 'Põhjanael', en: 'North Star' }, '255, 244, 220'),
    yildun: S(263.05, 86.59, 4.4, 'Yildun'),
    epsUmi: S(251.49, 82.04, 4.2, 'ε UMi'),
    zetUmi: S(236.01, 77.79, 4.3, 'ζ UMi'),
    kochab: S(222.68, 74.16, 2.1, 'Kochab', '255, 206, 160'),
    pherkad: S(230.18, 71.83, 3.0, 'Pherkad'),
    etaUmi: S(244.38, 75.76, 5.0, 'η UMi'),
    // Lohe, from the tip of the tail to the head
    giausar: S(172.85, 69.33, 3.8, 'Giausar'),
    kapDra: S(188.37, 69.79, 3.9, 'κ Dra'),
    thuban: S(211.10, 64.38, 3.7, 'Thuban'),
    edasich: S(231.23, 58.97, 3.3, 'Edasich'),
    theDra: S(240.47, 58.57, 4.0, 'θ Dra'),
    athebyne: S(245.99, 61.51, 2.7, 'Athebyne'),
    aldhibah: S(257.20, 65.71, 3.2, 'Aldhibah'),
    chiDra: S(275.26, 72.73, 3.6, 'χ Dra'),
    epsDra: S(297.04, 70.27, 3.8, 'ε Dra'),
    altais: S(288.14, 67.66, 3.1, 'Altais'),
    grumium: S(268.38, 56.87, 3.8, 'Grumium'),
    kuma: S(263.07, 55.17, 4.9, 'Kuma'),
    rastaban: S(262.61, 52.30, 2.8, 'Rastaban'),
    eltanin: S(269.15, 51.49, 2.2, 'Eltanin', '255, 214, 170'),
    // Lüüra
    vega: S(279.23, 38.78, 0.0, { et: 'Veega', en: 'Vega' }, '220, 232, 255'),
    epsLyr: S(281.08, 39.67, 4.7, 'ε Lyr'),
    zetLyr: S(281.19, 37.61, 4.3, 'ζ Lyr'),
    delLyr: S(283.63, 36.90, 4.3, 'δ Lyr'),
    sulafat: S(284.74, 32.69, 3.3, 'Sulafat'),
    sheliak: S(282.52, 33.36, 3.5, 'Sheliak'),
    // Karjane
    arcturus: S(213.92, 19.18, 0.0, { et: 'Arktuurus', en: 'Arcturus' }, '255, 198, 140'),
    izar: S(221.25, 27.07, 2.4, 'Izar'),
    delBoo: S(228.88, 33.31, 3.5, 'δ Boo'),
    nekkar: S(225.49, 40.39, 3.5, 'Nekkar'),
    seginus: S(218.02, 38.31, 3.0, 'Seginus'),
    rhoBoo: S(217.96, 30.37, 3.6, 'ρ Boo'),
    muphrid: S(208.67, 18.40, 2.7, 'Muphrid'),
    // Põhjakroon
    theCrb: S(233.23, 31.36, 4.1, 'θ CrB'),
    nusakan: S(231.96, 29.11, 3.7, 'Nusakan'),
    alphecca: S(233.67, 26.71, 2.2, 'Alphecca'),
    gamCrb: S(235.69, 26.30, 3.8, 'γ CrB'),
    delCrb: S(237.40, 26.07, 4.6, 'δ CrB'),
    epsCrb: S(239.40, 26.88, 4.1, 'ε CrB'),
    iotCrb: S(240.36, 29.85, 5.0, 'ι CrB'),
    // where the arc from the handle goes on to
    spica: S(201.30, -11.16, 1.0, { et: 'Spiika', en: 'Spica' }),
    // Orion: the four corners, the belt, the head and the sword. Only the
    // shoulders and Riigel are named in the texts; the others by their place.
    betelgeuse: S(88.79, 7.41, 0.5, { et: 'Betelgeuse', en: 'Betelgeuse' }, '255, 190, 130'),
    bellatrix: S(81.28, 6.35, 1.6, { et: 'Bellatrix', en: 'Bellatrix' }),
    rigel: S(78.63, -8.20, 0.1, { et: 'Riigel', en: 'Rigel' }, '215, 228, 255'),
    saiph: S(86.94, -9.67, 2.1, 'Saiph'),
    mintaka: S(83.00, -0.30, 2.2, 'Mintaka'),
    alnilam: S(84.05, -1.20, 1.7, 'Alnilam'),
    alnitak: S(85.19, -1.94, 1.8, 'Alnitak'),
    meissa: S(83.78, 9.93, 3.4, 'Meissa'),
    // the club and the shield
    muOri: S(90.60, 9.65, 4.1, 'μ Ori'),
    xiOri: S(92.99, 14.21, 4.5, 'ξ Ori'),
    pi3Ori: S(72.46, 6.96, 3.2, 'π3 Ori'),
    pi1Ori: S(73.72, 10.15, 4.6, 'π1 Ori'),
    pi5Ori: S(73.56, 2.44, 3.7, 'π5 Ori'),
    c42Ori: S(83.85, -4.84, 4.6, '42 Ori'),
    m42: S(83.82, -5.39, 4.0, { et: 'Orioni udu', en: 'Orion Nebula' }),
    iotOri: S(83.86, -5.91, 2.8, 'ι Ori'),
    sirius: S(101.29, -16.72, -1.5, { et: 'Siirius', en: 'Sirius' }, '215, 228, 255'),
    // the rest of Suur Peni, whose lower half is only a few degrees up in
    // Estonia, behind the trees
    mirzam: S(95.67, -17.96, 2.0, 'Mirzam'),
    nu2CMa: S(99.17, -19.26, 3.9, 'ν2 CMa'),
    omi1CMa: S(103.53, -24.18, 3.9, 'ο1 CMa'),
    adhara: S(104.66, -28.97, 1.5, 'Adhara'),
    sigCMa: S(105.43, -27.93, 3.5, 'σ CMa'),
    wezen: S(107.10, -26.39, 1.8, 'Wezen'),
    omi2CMa: S(105.76, -23.83, 3.0, 'ο2 CMa'),
    aludra: S(111.02, -29.30, 2.4, 'Aludra'),
    iotCMa: S(104.03, -17.05, 4.4, 'ι CMa'),
    muliphein: S(105.94, -15.63, 4.1, 'Muliphein'),
    theCMa: S(103.55, -12.04, 4.1, 'θ CMa'),
    // Sõnn, with Aldebaran as its eye
    aldebaran: S(68.98, 16.51, 0.9, { et: 'Aldebaran', en: 'Aldebaran' }, '255, 190, 130'),
    theTau: S(67.17, 15.87, 3.4, 'θ Tau'),
    gamTau: S(64.95, 15.63, 3.7, 'γ Tau'),
    delTau: S(65.73, 17.54, 3.8, 'δ Tau'),
    epsTau: S(67.15, 19.18, 3.5, 'ε Tau'),
    elnath: S(81.57, 28.61, 1.7, 'Elnath'),
    zetTau: S(84.41, 21.14, 3.0, 'ζ Tau'),
    // Sõel, found as one target, with the name on its brightest star
    alcyone: S(56.87, 24.11, 2.9, { et: 'Sõel', en: 'Pleiades' }),
    atlas: S(57.29, 24.05, 3.6, 'Atlas'),
    electra: S(56.22, 24.11, 3.7, 'Electra'),
    maia: S(56.46, 24.37, 3.9, 'Maia'),
    merope: S(56.58, 23.95, 4.2, 'Merope'),
    taygeta: S(56.30, 24.47, 4.3, 'Taygeta'),
    pleione: S(57.30, 24.14, 5.1, 'Pleione'),
    procyon: S(114.83, 5.22, 0.3, { et: 'Prooküon', en: 'Procyon' }, '255, 248, 230'),
    castor: S(113.65, 31.89, 1.6, { et: 'Kastor', en: 'Castor' }),
    pollux: S(116.33, 28.03, 1.1, { et: 'Polluks', en: 'Pollux' }, '255, 210, 160'),
    // the rest of Kaksikud
    tauGem: S(107.78, 30.25, 4.4, 'τ Gem'),
    mebsuta: S(100.98, 25.13, 3.0, 'Mebsuta'),
    tejat: S(95.74, 22.51, 2.9, 'Tejat'),
    propus: S(93.72, 22.51, 3.3, 'Propus'),
    nuGem: S(97.24, 20.21, 4.1, 'ν Gem'),
    iotGem: S(111.43, 27.80, 3.8, 'ι Gem'),
    upsGem: S(113.98, 26.90, 4.1, 'υ Gem'),
    wasat: S(110.03, 21.98, 3.5, 'Wasat'),
    mekbuda: S(106.03, 20.57, 3.9, 'Mekbuda'),
    alhena: S(99.43, 16.40, 1.9, 'Alhena'),
    lamGem: S(109.52, 16.54, 3.6, 'λ Gem'),
    xiGem: S(101.32, 12.90, 3.4, 'ξ Gem'),
    capella: S(79.17, 46.00, 0.1, { et: 'Kapella', en: 'Capella' }, '255, 240, 200'),
    // the rest of Veomees, with Elnath, which it shares with Sõnn
    menkalinan: S(89.88, 44.95, 1.9, 'Menkalinan'),
    theAur: S(89.93, 37.21, 2.6, 'θ Aur'),
    hassaleh: S(74.25, 33.17, 2.7, 'Hassaleh')
  };
  // the Orion Nebula is drawn as a fuzzy glow, not as a star
  STARS.m42.nebula = true;

  // the stars of Orion's figure, and of his belt, which a drag snaps onto as
  // one line, as its stars are too close together to tell apart
  const ORION = ['betelgeuse', 'bellatrix', 'mintaka', 'alnilam', 'alnitak', 'rigel', 'saiph'];
  const BELT = ['mintaka', 'alnilam', 'alnitak'];

  // Figures, by the keys of their stars; each line is joined from star to
  // star. `where` says, for a wrong star tapped, which figure it is in.
  const FIGURES = {
    bigdipper: {
      where: { et: 'Suures Vankris', en: 'the Big Dipper' },
      name: { et: 'Suur Vanker', en: 'Big Dipper' },
      lines: [['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid'], ['megrez', 'dubhe']]
    },
    littledipper: {
      // to draw: the stars in turn, each joined to the one before, and the
      // lines `extra` once both their stars are lit, as in Tähtkujud
      order: ['polaris', 'yildun', 'epsUmi', 'zetUmi', 'kochab', 'pherkad', 'etaUmi'],
      extra: [['etaUmi', 'zetUmi']],
      where: { et: 'Väikeses Vankris', en: 'the Little Dipper' },
      name: { et: 'Väike Vanker', en: 'Little Dipper' },
      lines: [['polaris', 'yildun', 'epsUmi', 'zetUmi', 'kochab', 'pherkad', 'etaUmi', 'zetUmi']]
    },
    draco: {
      order: ['giausar', 'kapDra', 'thuban', 'edasich', 'theDra', 'athebyne', 'aldhibah', 'chiDra', 'epsDra', 'altais',
        'grumium', 'kuma', 'rastaban', 'eltanin'],
      extra: [['grumium', 'eltanin']],
      where: { et: 'Lohe tähtkujus', en: 'the Dragon' },
      name: { et: 'Lohe', en: 'Draco, the Dragon' },
      // (its name below its head, not in the middle of its long body, where
      // Väike Vanker is)
      label: ['grumium', 'kuma', 'rastaban', 'eltanin'],
      lines: [['giausar', 'kapDra', 'thuban', 'edasich', 'theDra', 'athebyne', 'aldhibah', 'chiDra', 'epsDra', 'altais',
        'grumium', 'kuma', 'rastaban', 'eltanin', 'grumium']]
    },
    lyra: {
      where: { et: 'Lüüra tähtkujus', en: 'Lyra' },
      name: { et: 'Lüüra', en: 'Lyra' },
      lines: [['vega', 'epsLyr', 'zetLyr', 'delLyr', 'sulafat', 'sheliak', 'zetLyr', 'vega']]
    },
    bootes: {
      where: { et: 'Karjase tähtkujus', en: 'Boötes' },
      name: { et: 'Karjane', en: 'Boötes' },
      lines: [['arcturus', 'izar', 'delBoo', 'nekkar', 'seginus', 'rhoBoo', 'arcturus'], ['arcturus', 'muphrid']]
    },
    corona: {
      where: { et: 'Põhjakroonis', en: 'the Northern Crown' },
      name: { et: 'Põhjakroon', en: 'Northern Crown' },
      lines: [['theCrb', 'nusakan', 'alphecca', 'gamCrb', 'delCrb', 'epsCrb', 'iotCrb']]
    },
    // Orion as in Tähtkujud: from the left shoulder over the head to the
    // other one, down along the belt to a foot, Riigel from the other end of
    // the belt, and the club and the shield; a star of `join` is joined to
    // that star rather than to the one before it
    orion: {
      order: ['betelgeuse', 'meissa', 'bellatrix', 'mintaka', 'alnilam', 'alnitak', 'saiph', 'rigel',
        'muOri', 'xiOri', 'pi3Ori', 'pi1Ori', 'pi5Ori'],
      join: { rigel: 'mintaka', muOri: 'betelgeuse', pi3Ori: 'bellatrix', pi5Ori: 'pi3Ori' },
      extra: [['alnitak', 'betelgeuse']],
      where: { et: 'Orioni tähtkujus', en: 'Orion' },
      name: { et: 'Orion', en: 'Orion' },
      lines: [['betelgeuse', 'meissa', 'bellatrix', 'mintaka', 'alnilam', 'alnitak', 'saiph'], ['mintaka', 'rigel'],
        ['alnitak', 'betelgeuse', 'muOri', 'xiOri'], ['bellatrix', 'pi3Ori', 'pi1Ori'], ['pi3Ori', 'pi5Ori']]
    },
    taurus: {
      where: { et: 'Sõnni tähtkujus', en: 'Taurus, the Bull' },
      name: { et: 'Sõnn', en: 'Taurus' },
      lines: [['elnath', 'epsTau', 'delTau', 'gamTau', 'theTau', 'aldebaran', 'zetTau']]
    },
    // (a cluster, not lines: only the ring round it, and its name on its
    // brightest star)
    pleiades: {
      label: [],
      where: { et: 'Sõelas', en: 'the Pleiades' },
      name: { et: 'Sõel', en: 'Pleiades' },
      lines: [['alcyone'], ['atlas'], ['electra'], ['maia'], ['merope'], ['taygeta'], ['pleione']]
    },
    // Suur Peni as in Tähtkujud, which draws itself once Siirius is found
    canismajor: {
      order: ['sirius', 'mirzam', 'nu2CMa', 'omi1CMa', 'adhara', 'sigCMa', 'wezen', 'omi2CMa', 'aludra',
        'iotCMa', 'muliphein', 'theCMa'],
      join: { aludra: 'wezen', iotCMa: 'sirius' },
      extra: [['omi2CMa', 'sirius'], ['theCMa', 'iotCMa']],
      where: { et: 'Suure Peni tähtkujus', en: 'Canis Major, the Great Dog' },
      name: { et: 'Suur Peni', en: 'Canis Major' },
      lines: [['sirius', 'mirzam', 'nu2CMa', 'omi1CMa', 'adhara', 'sigCMa', 'wezen', 'omi2CMa', 'sirius'], ['wezen', 'aludra'],
        ['sirius', 'iotCMa', 'muliphein', 'theCMa', 'iotCMa']]
    },
    // Veomees as in Tähtkujud, which draws itself once Kapella is found
    auriga: {
      labelBeside: 'capella',
      order: ['capella', 'menkalinan', 'theAur', 'elnath', 'hassaleh'],
      extra: [['hassaleh', 'capella']],
      where: { et: 'Veomehe tähtkujus', en: 'Auriga, the Charioteer' },
      name: { et: 'Veomees', en: 'Auriga' },
      lines: [['capella', 'menkalinan', 'theAur', 'elnath', 'hassaleh', 'capella']]
    },
    // Kastor and Polluks, to find: only the ring round them
    twins: {
      label: [],
      where: { et: 'Kaksikute tähtkujus', en: 'Gemini, the Twins' },
      name: { et: 'Kaksikud', en: 'Gemini' },
      lines: [['castor'], ['pollux']]
    },
    // and Kaksikud as in Tähtkujud, which draws itself once they are found
    gemini: {
      order: ['castor', 'tauGem', 'mebsuta', 'tejat', 'propus', 'nuGem', 'iotGem', 'upsGem', 'pollux',
        'wasat', 'mekbuda', 'alhena', 'lamGem', 'xiGem'],
      join: { nuGem: 'mebsuta', iotGem: 'tauGem', wasat: 'upsGem', lamGem: 'wasat' },
      where: { et: 'Kaksikute tähtkujus', en: 'Gemini, the Twins' },
      name: { et: 'Kaksikud', en: 'Gemini' },
      lines: [['castor', 'tauGem', 'mebsuta', 'tejat', 'propus'], ['mebsuta', 'nuGem'], ['tauGem', 'iotGem', 'upsGem', 'pollux'],
        ['upsGem', 'wasat', 'mekbuda', 'alhena'], ['wasat', 'lamGem', 'xiGem']]
    },
    // the bright stars of several figures, drawn dashed
    triangle: {
      asterism: true,
      labelMid: true,
      where: { et: 'Talvekolmnurgas', en: 'the Winter Triangle' },
      name: { et: 'Talvekolmnurk', en: 'Winter Triangle' },
      lines: [['betelgeuse', 'sirius', 'procyon', 'betelgeuse']]
    },
    hexagon: {
      asterism: true,
      // (back to Kapella at the end, to close it)
      order: ['capella', 'aldebaran', 'rigel', 'sirius', 'procyon', 'pollux', 'capella'],
      where: { et: 'Talvekuusnurgas', en: 'the Winter Hexagon' },
      name: { et: 'Talvekuusnurk', en: 'Winter Hexagon' },
      lines: [['capella', 'aldebaran', 'rigel', 'sirius', 'procyon', 'pollux', 'capella']]
    }
  };

  // Photos by Tõrva Astronoomiaklubi (AstroBin, CC BY-NC-SA), the square
  // crops of Pusle. Each is lined up with the sky from two stars in it: RA
  // and Dec (degrees), and where the star is in the photo (pixels).
  // `astrobin` is the image id: https://www.astrobin.com/<id>/
  const PHOTOS = {
    pleiades: {
      name: { et: 'Sõel', en: 'The Pleiades' },
      file: '../pusle/images/pleiades.jpg',
      astrobin: 'qirtxe',
      // the brightest star, and the one up to the right of the others
      anchors: [[56.871, 24.105, 278, 530], [56.302, 24.467, 955, 410]],
      eye: {
        et: 'Silmaga näed kuut või seitset tähte. Kaamera kogub valgust kaua ja näeb palju rohkem tähti ning sinist udu nende ümber.',
        en: 'With the eye you see six or seven stars. The camera collects light for a long time and sees many more stars, and blue haze round them.'
      }
    },
    orion: {
      name: { et: 'Orioni udu', en: 'The Orion Nebula' },
      file: '../pusle/images/orion.jpg',
      astrobin: 'uu55w0',
      // the stars in the bright middle of the nebula, and the bright star at
      // the bottom of the sword
      anchors: [[83.819, -5.390, 522, 408], [83.858, -5.910, 237, 910]],
      eye: {
        et: 'Silmaga näed udust täppi. Kaamera kogub valgust kaua ja näeb värve, mida silm ei näe.',
        en: 'With the eye you see a fuzzy dot. The camera collects light for a long time and sees colours the eye does not see.'
      }
    },
    horsehead: {
      name: { et: 'Hobusepea udu', en: 'The Horsehead Nebula' },
      file: '../pusle/images/horsehead.jpg',
      astrobin: '4yxzcw',
      // the left-hand star of the belt, and the star in the blue haze
      anchors: [[85.190, -1.943, 198, 553], [85.410, -2.259, 575, 760]]
    }
  };

  // the stars of Suur Vanker, for the views that show all of it
  const DIPPER = ['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid'];

  // The levels. Each is a chain of tasks in one sky, at the date and hour
  // `when` (UT), with its `caption`; a task with its own `when` turns the sky
  // on to it, always forwards.
  // `limit` is the faintest stars shown, besides those of the figures, and
  // `win` the texts of the win screen. The kinds of task:
  //   hop: a line from `from` through `via`, carried on, leads to `find`;
  //     with `ticks`, the line has a tick at every gap between the two;
  //     without `find`, the task is only to draw the line, and the next
  //     task starts when it is drawn
  //   trace: join the numbered stars of `figure` in turn, as in Tähtkujud
  //   tap: tap `find`, near the stars `near`
  //   arc: a curve along the stars `along`, carried on through the stars
  //     `curve`, leads to `find`; it stops a little past the first star after
  //     `along`. The curve is the circle on the sky through the last two
  //     stars of `along` and that star, and starts at the first of the
  //     three. With `curveArrow`, a short curved arrow under the stars
  //     `along` shows which way to slide.
  //   part: `find` is part of the way along a line from `from` to `via`,
  //     as the text says; any star of `accept` counts too
  //   slider: the sky starts bright, and the task is to move the slider
  //     towards the dark sky, where the faint stars of Väike Vanker show
  //   note: only a text to read, its `title` and `fact`, with the button to
  //     go on; with `below`, a dashed curve through its three stars `curve`
  //     goes on through the horizon to the `star` below it, which a dashed circle
  //     marks
  // `jump`: the sky goes to the task's `when` at once, without turning.
  // `height`: once the task is done, a dashed line from the horizon straight
  // up to that star shows how high it is, in degrees.
  // An arc without `find` is only to draw: it shows where a star is not, and
  // its `title` heads the fact. A `random` level picks a dark night of the
  // year and asks the tasks of its `pool` whose stars are up then;
  // without `help` the guide stars do not pulse, `figs` are the figures drawn
  // at the start, and with `fixedView` the view takes in all the tasks at
  // once.
  // `figure` is drawn in when the task is done, and the figures `given` are
  // there from its start. `span` is how much sky the
  // view shows across its shorter side, in degrees (70 if not given); a
  // closer view keeps the other figures out of the way. `show` adds stars
  // for the view to show, and with `keepLine` the line of the task before
  // stays bright, with its ticks. `arrow` points from a star towards
  // another, part of the way, to show which way to look. The stars of a
  // level's `names` always have their names. A level's `center` is the star
  // its views look straight at, and a task's `center` (null for none)
  // overrides it; while the sky turns, the view is wide round the level's
  // centre. `autoDraw` is a figure that draws itself when the task
  // is done, and `hideNames` hides the names of Põhjanael and Väike Vanker
  // until Põhjanael is found again. A `wide` task keeps the wide view round
  // the level's centre, as while the sky turns. On a level that `look`s at
  // the horizon, the view stays at that height and turns only sideways, and
  // the tasks in one sky share one view. On a `steady` level, too, the card
  // at the top keeps the room of the biggest text of its sky, and the slider
  // keeps its room once done, so that the view does not move when the text
  // changes.
  const LEVELS = [
    {
      id: 'vanker1',
      // the faintest stars shown, besides those of the figures: a small-town sky
      limit: 4.5,
      part: 'bigdipper',
      icon: '🍂',
      // 15 October 2026 at 20:00
      when: Date.UTC(2026, 9, 15, 18, 0),
      caption: { et: 'Sügisõhtu, 15. oktoober kell 20', en: 'An autumn evening, 15 October at 20:00' },
      win: {
        name: { et: 'Suur Vanker näitas teed', en: 'The Big Dipper showed the way' },
        fact: {
          et: 'Suur Vanker on Eestis taevas igal selgel ööl. Nüüd oskad tema abil leida Põhjanaela, Väikese Vankri, Lohe, Veega, Arktuuruse ja Põhjakrooni.',
          en: 'In Estonia the Big Dipper is in the sky on every clear night. Now you can use it to find the North Star, the Little Dipper, the Dragon, Vega, Arcturus and the Northern Crown.'
        }
      },
      tasks: [
        {
          kind: 'hop', from: 'merak', via: 'dubhe', ticks: true, span: 42, show: ['polaris', ...DIPPER],
          text: {
            et: 'Tõmba joon läbi Suure Vankri kahe tagumise ratta ja jätka seda.',
            en: 'Draw a line through the two stars at the end of the Big Dipper’s bowl and carry it on.'
          }
        },
        {
          kind: 'tap', find: 'polaris', near: [], span: 42, show: DIPPER, keepLine: true,
          text: {
            et: 'Põhjanael on sellel joonel, viis korda nii kaugel, kui on kahe ratta vahe. Puuduta Põhjanaela.',
            en: 'The North Star is on this line, five times as far as the gap between the two stars. Tap the North Star.'
          },
          fact: {
            et: 'Põhjanael on peaaegu täpselt taevapooluse kohal. Kogu taevas pöörleb tema ümber, aga tema ise püsib paigal, alati põhjas.',
            en: 'The North Star is almost exactly at the sky’s pole. The whole sky turns round it, but it stays in place, always in the north.'
          }
        },
        {
          kind: 'trace', figure: 'littledipper', span: 34,
          text: {
            et: 'Põhjanael on Väikese Vankri aisa ots. Joonista Väike Vanker: puuduta tähti järjest 1, 2, 3 … või libista sõrme tähest täheni.',
            en: 'The North Star is the end of the Little Dipper’s handle. Draw the Little Dipper: tap the stars in turn 1, 2, 3 … or slide your finger from star to star.'
          },
          fact: {
            et: 'Väikese Vankri tähed on Suure Vankri tähtedest nõrgemad. Linnas paistavad temast ainult Põhjanael ja vankri kaks tagumist ratast.',
            en: 'The stars of the Little Dipper are fainter than those of the Big Dipper. In a city only the North Star and the two stars at the end of the bowl can be seen.'
          }
        },
        {
          kind: 'trace', figure: 'draco', span: 55,
          text: {
            et: 'Lohe saba ots on Suure Vankri ja Põhjanaela vahel. Joonista Lohe sabast peani: puuduta tähti järjest 1, 2, 3 …',
            en: 'The tip of the Dragon’s tail is between the Big Dipper and the North Star. Draw the Dragon from its tail to its head: tap the stars in turn 1, 2, 3 …'
          },
          fact: {
            et: 'Lohe looklev keha ümbritseb Väikest Vankrit. Tema pea on neli tähte, ja selle kõrval paistab hele Veega.',
            en: 'The Dragon’s winding body wraps round the Little Dipper. Its head is four stars, and next to it shines bright Vega.'
          }
        },
        {
          kind: 'tap', find: 'vega', near: [], figure: 'lyra', arrow: ['eltanin', 'vega'],
          show: ['eltanin', 'rastaban', 'kuma', 'grumium'],
          text: {
            et: 'Leia Veega, hele täht Lohe pea kõrval.',
            en: 'Find Vega, the bright star next to the Dragon’s head.'
          },
          fact: {
            et: 'Veega on Lüüra tähtkuju kõige heledam täht, meist 25 valgusaasta kaugusel. Eestis ta ei looju kunagi.',
            en: 'Vega is the brightest star of Lyra, 25 light years away. In Estonia it never sets.'
          }
        },
        {
          kind: 'arc', along: ['mizar', 'alkaid'], curve: ['mizar', 'alkaid', 'arcturus', 'spica'],
          find: 'arcturus', figure: 'bootes', span: 20, curveArrow: true,
          show: ['dubhe', 'merak', 'phecda', 'megrez'],
          text: {
            et: 'Leia Arktuurus. Libista sõrme mööda Suure Vankri aisa ja jätka sama kaarega edasi.',
            en: 'Find Arcturus. Slide your finger along the Big Dipper’s handle and carry on along the same curve.'
          },
          fact: {
            et: 'Arktuurus on põhjataeva kõige heledam täht, oranž hiidtäht Karjase tähtkujus. Sügisõhtul on ta madalal ja loojub varsti, aga kevadel tõuseb ta õhtuti kõrgele.',
            en: 'Arcturus is the brightest star in the northern half of the sky, an orange giant in Boötes. On an autumn evening it is low and soon sets, but in spring it climbs high in the evening.'
          }
        },
        {
          // on an autumn evening, low in the west, the Crown is to the left
          // of Karjane and a little higher
          kind: 'tap', find: 'alphecca', near: [], figure: 'corona', span: 20, arrow: ['izar', 'alphecca'],
          accept: ['theCrb', 'nusakan', 'gamCrb', 'delCrb', 'epsCrb', 'iotCrb'],
          show: ['arcturus', 'izar', 'delBoo', 'nekkar', 'seginus', 'rhoBoo', 'muphrid'],
          text: {
            et: 'Leia Põhjakroon. See on poolring tähti Karjasest vasakul.',
            en: 'Find the Northern Crown. It is a half circle of stars to the left of Boötes.'
          },
          fact: {
            et: 'Põhjakroon on poolring tähti nagu kuninga kroon. Tema kõige heledam täht on nagu kroonis särav pärl.',
            en: 'The Northern Crown is a half circle of stars, like a king’s crown. Its brightest star is like a shining pearl in it.'
          }
        }
      ]
    },
    {
      id: 'vanker2',
      limit: 4.5,
      part: 'bigdipper',
      icon: '🔄',
      // Only about how the sky turns: the sky turns round Põhjanael, always
      // forwards, by about a quarter of a circle each time (90°, 99° and
      // 120°): evenings in October, January and April at 21:00, and in July
      // at 23:00, as the sky is light earlier then
      center: 'polaris',
      // 6 October 2026 at 21:00
      when: Date.UTC(2026, 9, 6, 19, 0),
      caption: { et: 'Sügisõhtu, 6. oktoober kell 21', en: 'An autumn evening, 6 October at 21:00' },
      win: {
        name: { et: 'Taevas pöörles', en: 'The sky turned' },
        fact: {
          et: 'Suur Vanker tiirleb ümber Põhjanaela: iga öö ja ka aasta jooksul. Kus ta parasjagu ka on, tema tagumised rattad näitavad Põhjanaela poole.',
          en: 'The Big Dipper goes round the North Star, every night and also over the year. Wherever it is, the two stars at the end of its bowl point to the North Star.'
        }
      },
      tasks: [
        {
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', span: 45, center: null, show: DIPPER, autoDraw: 'littledipper',
          text: {
            et: 'Leia Põhjanael. Tõmba joon läbi Suure Vankri kahe tagumise ratta ja jätka seda.',
            en: 'Find the North Star. Draw a line through the two stars at the end of the Big Dipper’s bowl and carry it on.'
          },
          fact: {
            et: 'Põhjanael on peaaegu täpselt taevapooluse kohal. Kogu taevas pöörleb tema ümber, aga tema ise püsib paigal. Tema küljes ripub Väike Vanker.',
            en: 'The North Star is almost exactly at the sky’s pole. The whole sky turns round it, but it stays in place. The Little Dipper hangs from it.'
          }
        },
        {
          // 5 January 2027 at 21:00: the sky turns about 90°
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', span: 45, center: null, show: DIPPER, hideNames: true, autoDraw: 'littledipper',
          when: Date.UTC(2027, 0, 5, 19, 0),
          caption: { et: 'Talveõhtu, 5. jaanuar kell 21', en: 'A winter evening, 5 January at 21:00' },
          text: {
            et: 'Jaanuari alguses, jälle kell 21. Taevas on pöördunud. Leia Põhjanael uuesti.',
            en: 'At the start of January, again at 21:00. The sky has turned. Find the North Star again.'
          },
          fact: {
            et: 'Taevas on pöördunud umbes veerand ringi. Samal kellaajal vaadates pöörleb taevas iga kuuga Põhjanaela ümber edasi, põhja poole vaadates vastupäeva. Põhjanael ise jääb paigale.',
            en: 'The sky has turned about a quarter of a circle. Watched at the same hour, the sky turns on round the North Star every month, anticlockwise when you face north. The North Star stays in place.'
          }
        },
        {
          // 15 April 2027 at 21:00: the sky turns about 99°
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', span: 45, center: null, show: DIPPER, hideNames: true, autoDraw: 'littledipper',
          when: Date.UTC(2027, 3, 15, 19, 0),
          caption: { et: 'Kevadõhtu, 15. aprill kell 21', en: 'A spring evening, 15 April at 21:00' },
          text: {
            et: 'Aprilli keskel, jälle kell 21. Leia Põhjanael uuesti.',
            en: 'In the middle of April, again at 21:00. Find the North Star again.'
          },
          fact: {
            et: 'Taevas pööras jälle umbes veerand ringi. Suur Vanker on nüüd peaaegu pea kohal, tagurpidi.',
            en: 'The sky turned about a quarter of a circle again. The Big Dipper is now almost overhead, upside down.'
          }
        },
        {
          // 15 July 2027 at 23:00: at 21:00 the sky would still be light. The
          // sky turns about 120° this time.
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', span: 45, center: null, show: DIPPER, hideNames: true, autoDraw: 'littledipper',
          when: Date.UTC(2027, 6, 15, 21, 0),
          caption: { et: 'Suveöö, 15. juuli kell 23', en: 'A summer night, 15 July at 23:00' },
          text: {
            et: 'Juulis on kell 21 veel valge, seepärast vaatame kell 23. Leia Põhjanael uuesti.',
            en: 'In July it is still light at 21:00, so we look at 23:00. Find the North Star again.'
          },
          fact: {
            et: 'Seekord pööras taevas rohkem kui veerand ringi, sest vaatame hiljem: kell 23, mitte kell 21. Taevas pöörleb ka iga tunniga edasi. Juulis kell 23 on taevas hele, aga Suur Vanker ja Põhjanael paistavad.',
            en: 'This time the sky turned more than a quarter of a circle, as we look later: at 23:00, not at 21:00. The sky also turns on every hour. At 23:00 in July the sky is light, but the Big Dipper and the North Star show.'
          }
        },
        {
          // the player's own date and hour, with two sliders
          kind: 'explore', span: 100, show: DIPPER,
          text: {
            et: 'Vali ise kuupäev ja kellaaeg ning vaata, kus on Suur Vanker. Põhjanael jääb alati paigale.',
            en: 'Pick a date and an hour yourself and see where the Big Dipper is. The North Star always stays in place.'
          }
        }
      ]
    },
    {
      id: 'vanker3',
      // Arktuurus rises and sets, and Veega never does: from a spring evening,
      // when Arktuurus has just risen, through May, when it is highest, to
      // September, when it is going down, and a winter evening, when it is
      // below the horizon, until it is back up by the morning. There is one
      // view for each sky, at the height `look`; it turns only sideways, and
      // the picture slides up or down.
      limit: 4.5,
      part: 'bigdipper',
      icon: '🌅',
      help: false,
      look: 30,
      // Põhjanael always has its name, as Suur Vanker has
      names: ['polaris'],
      // 15 March 2027 at 21:00
      when: Date.UTC(2027, 2, 15, 19, 0),
      caption: { et: 'Kevadõhtu, 15. märts kell 21', en: 'A spring evening, 15 March at 21:00' },
      win: {
        name: { et: 'Tõusevad ja loojuvad', en: 'They rise and set' },
        fact: {
          et: 'Arktuurus tõuseb ja loojub: õhtuti on ta taevas kevadest sügiseni. Veega, Suur Vanker ja Põhjanael on Eestis taevas igal ööl.',
          en: 'Arcturus rises and sets: it is in the evening sky from spring to autumn. Vega, the Big Dipper and the North Star are in the sky every night in Estonia.'
        }
      },
      tasks: [
        {
          kind: 'arc', along: ['mizar', 'alkaid'], curve: ['mizar', 'alkaid', 'arcturus', 'spica'],
          find: 'arcturus', figure: 'bootes', show: DIPPER,
          text: {
            et: 'Leia Arktuurus Suure Vankri aisa kaare abil.',
            en: 'Find Arcturus along the curve of the Big Dipper’s handle.'
          },
          fact: {
            et: 'Kevadõhtul on Arktuurus just idast tõusnud. Iga nädalaga on ta samal kellaajal natuke kõrgemal.',
            en: 'On a spring evening Arcturus has just risen in the east. Every week it is a little higher at the same hour.'
          }
        },
        {
          kind: 'tap', find: 'vega', near: [], figure: 'lyra', given: ['draco'],
          show: ['eltanin', 'rastaban', 'kuma', 'grumium'],
          text: {
            et: 'Leia Veega Lohe pea kõrval.',
            en: 'Find Vega next to the Dragon’s head.'
          },
          fact: {
            et: 'Veega on praegu madalal põhjas, aga ta ei looju kunagi: nagu Suur Vanker, tiirleb ta ümber Põhjanaela.',
            en: 'Vega is low in the north now, but it never sets: like the Big Dipper, it goes round the North Star.'
          }
        },
        {
          // 15 May 2027 at 22:30, in twilight
          kind: 'arc', along: ['mizar', 'alkaid'], curve: ['mizar', 'alkaid', 'arcturus', 'spica'],
          find: 'arcturus', figure: 'bootes', show: DIPPER,
          when: Date.UTC(2027, 4, 15, 20, 30),
          caption: { et: 'Kevadöö, 15. mai kell 22.30', en: 'A spring night, 15 May at 22:30' },
          text: {
            et: 'Mai keskel on kell 21 veel valge, seepärast vaatame kell 22.30. Leia Arktuurus uuesti.',
            en: 'In the middle of May it is still light at 21:00, so we look at 22:30. Find Arcturus again.'
          },
          fact: {
            et: 'Arktuurus on lõunas, nii kõrgel, kui ta Eestis üldse tõuseb: umbes 51 kraadi. Ta on oranž, sest ta on Päikesest jahedam.',
            en: 'Arcturus is in the south, as high as it ever gets in Estonia: about 51 degrees. It is orange because it is cooler than the Sun.'
          }
        },
        {
          kind: 'part', from: 'arcturus', via: 'vega', find: 'alphecca', figure: 'corona', names: ['vega'],
          accept: ['theCrb', 'nusakan', 'gamCrb', 'delCrb', 'epsCrb', 'iotCrb'],
          text: {
            et: 'Leia Põhjakroon. Tõmba joon Arktuurusest Veegani: kroon on umbes kolmandiku tee peal.',
            en: 'Find the Northern Crown. Draw a line from Arcturus to Vega: the Crown is about a third of the way.'
          },
          fact: {
            et: 'Põhjakroon on poolring seitsmest tähest. Ta on Arktuuruse ja Veega vahel, nii et kui need kaks on taevas, leiad ka tema.',
            en: 'The Northern Crown is a half circle of seven stars. It is between Arcturus and Vega, so when those two are in the sky, you can find it too.'
          }
        },
        {
          // 15 September 2027 at 20:00
          kind: 'arc', along: ['mizar', 'alkaid'], curve: ['mizar', 'alkaid', 'arcturus', 'spica'],
          find: 'arcturus', figure: 'bootes', show: DIPPER,
          when: Date.UTC(2027, 8, 15, 18, 0),
          caption: { et: 'Sügisõhtu, 15. september kell 20', en: 'An autumn evening, 15 September at 20:00' },
          text: {
            et: 'Septembri keskel, kell 20. Leia Arktuurus uuesti.',
            en: 'In the middle of September, at 20:00. Find Arcturus again.'
          },
          fact: {
            et: 'Sügisõhtul on Arktuurus läänes ja loojub iga nädalaga varem.',
            en: 'On an autumn evening Arcturus is in the west and sets earlier every week.'
          }
        },
        {
          kind: 'tap', find: 'vega', near: [], figure: 'lyra', given: ['draco'],
          show: ['eltanin', 'rastaban', 'kuma', 'grumium'],
          text: { et: 'Leia Veega.', en: 'Find Vega.' },
          fact: {
            et: 'Veega on peaaegu pea kohal. Hilissuvel ja sügise alguses on ta õhtuti kõige kõrgemal.',
            en: 'Vega is almost overhead. In late summer and early autumn it is highest in the evening.'
          }
        },
        {
          // 5 January 2028 at 21:00: Arktuurus is below the
          // horizon, which is only to read; the curve along the handle goes
          // on through the horizon to where it is
          kind: 'note', title: { et: 'Allpool silmapiiri', en: 'Below the horizon' }, show: [...DIPPER, 'arcturus'],
          below: { star: 'arcturus', curve: ['mizar', 'alkaid', 'arcturus'] },
          when: Date.UTC(2028, 0, 5, 19, 0),
          caption: { et: 'Talveõhtu, 5. jaanuar kell 21', en: 'A winter evening, 5 January at 21:00' },
          fact: {
            et: 'Kus on Arktuurus? Talveõhtul on ta allpool silmapiiri ega paista. Õhtuti on ta taevas kevadest sügiseni.',
            en: 'Where is Arcturus? On a winter evening it is below the horizon and cannot be seen. It is in the evening sky from spring to autumn.'
          }
        },
        {
          kind: 'tap', find: 'vega', near: [], figure: 'lyra', given: ['draco'],
          show: ['eltanin', 'rastaban', 'kuma', 'grumium'], height: 'vega',
          text: { et: 'Leia Veega.', en: 'Find Vega.' },
          fact: {
            et: 'Talveõhtul on Veega madalal põhjas, aga silmapiiri taha ta ei lähe.',
            en: 'On a winter evening Vega is low in the north, but it does not go below the horizon.'
          }
        },
        {
          // the same night, at 06:00 in the morning: the sky turns 135°
          kind: 'arc', along: ['mizar', 'alkaid'], curve: ['mizar', 'alkaid', 'arcturus', 'spica'],
          find: 'arcturus', figure: 'bootes', show: [...DIPPER, 'vega'], names: ['vega'],
          when: Date.UTC(2028, 0, 6, 4, 0),
          caption: { et: 'Talvehommik, 6. jaanuar kell 6', en: 'A winter morning, 6 January at 06:00' },
          text: {
            et: 'Sama öö hommikul kell 6. Leia Arktuurus.',
            en: 'The same night, at 6 in the morning. Find Arcturus.'
          },
          fact: {
            et: 'Talvel on Arktuurus hommikutaevas. Üheksa tunniga pöördus taevas sama palju kui neli ja pool kuud õhtuti: jaanuari hommikul kell 6 on taevas nagu mai keskel kell 21.',
            en: 'In winter Arcturus is in the morning sky. In nine hours the sky turned as much as it does in four and a half months of evenings: at 6 on a January morning the sky is as at 21:00 in the middle of May.'
          }
        }
      ]
    },
    {
      id: 'vanker4',
      // how bright the sky is: on the autumn evening of level 1, with Suur
      // Vanker upright below Põhjanael, the slider from a bright sky to a
      // dark one; Lohe in the dark sky; and a July night at 23:00, when the
      // twilight keeps the sky bright even at the dark end
      limit: 6,
      part: 'bigdipper',
      icon: '🌗',
      center: 'polaris',
      steady: true,
      // 15 October 2026 at 20:00
      when: Date.UTC(2026, 9, 15, 18, 0),
      caption: { et: 'Sügisõhtu, 15. oktoober kell 20', en: 'An autumn evening, 15 October at 20:00' },
      win: {
        name: { et: 'Hele ja pime taevas', en: 'Bright and dark skies' },
        fact: {
          et: 'Mida pimedam on taevas, seda rohkem tähti paistab. Linnatuled, Kuu ja suvine videvik teevad taeva heledaks.',
          en: 'The darker the sky, the more stars show. City lights, the Moon and the summer twilight make the sky bright.'
        }
      },
      tasks: [
        {
          // the lines of Väike Vanker join up as its stars show
          kind: 'slider', given: ['littledipper'], names: ['polaris'], center: null, span: 40, show: [...DIPPER, ...FIGURES.littledipper.order],
          title: { et: 'Pime taevas', en: 'A dark sky' },
          text: {
            et: 'Kui paistab täiskuu või oled linnas, on taevas hele, ja Väikesest Vankrist paistab ainult kolm tähte. Vii liugur pimeda taeva poole, et näha teda tervenisti.',
            en: 'When the full Moon is out, or you are in a city, the sky is bright, and only three stars of the Little Dipper show. Move the slider towards the dark sky to see all of it.'
          },
          fact: {
            et: 'Pimedas taevas paistab Väike Vanker tervenisti. Linnatuled ja Kuu valgustavad taevast, ja siis nõrgemaid tähti ei paista.',
            en: 'In a dark sky the whole Little Dipper shows. City lights and the Moon light up the sky, and then the fainter stars do not show.'
          }
        },
        {
          kind: 'trace', figure: 'draco', span: 55,
          text: {
            et: 'Pimedas taevas on tähti nii palju, et tuttavaid kujusid on nende vahel raskem näha. Joonista Lohe sabast peani.',
            en: 'In a dark sky there are so many stars that the figures you know are harder to see among them. Draw the Dragon from its tail to its head.'
          },
          fact: {
            et: 'Lohe tähed on nõrgad: linnas teda peaaegu ei näe, aga pimedas taevas paistab ta tervenisti.',
            en: 'The Dragon’s stars are faint: in a city it can hardly be seen, but in a dark sky all of it shows.'
          }
        },
        {
          // 15 July 2027 at 23:00: the Sun is only about 9° below the horizon
          // (straight to it, without turning the sky for months)
          kind: 'slider', given: ['littledipper'], names: ['polaris'], wide: true, jump: true,
          when: Date.UTC(2027, 6, 15, 21, 0),
          caption: { et: 'Suveöö, 15. juuli kell 23', en: 'A summer night, 15 July at 23:00' },
          title: { et: 'Hele suveöö', en: 'A light summer night' },
          text: {
            et: 'Juulis kell 23. Vii liugur jälle pimeda taeva poole.',
            en: 'At 23:00 in July. Move the slider towards the dark sky again.'
          },
          fact: {
            et: 'Suveööl ei lähe taevas Eestis päris pimedaks, sest Päike on ainult natuke allpool silmapiiri. Ka maal, kus tulesid pole, paistavad siis ainult heledamad tähed.',
            en: 'On a summer night the sky in Estonia never gets quite dark, as the Sun is only a little below the horizon. Even in the countryside, with no lights, only the brighter stars show then.'
          }
        },
        {
          // the player's own play with the slider, on a dark autumn evening,
          // until they press Valmis
          kind: 'slider', free: true, given: ['littledipper'], names: ['polaris'], wide: true,
          when: Date.UTC(2027, 9, 15, 18, 0),
          caption: { et: 'Sügisõhtu, 15. oktoober kell 20', en: 'An autumn evening, 15 October at 20:00' },
          text: {
            et: 'Liiguta liugurit ise ja vaata, kuidas tähed heledas taevas kaovad ja pimedas taevas tagasi tulevad.',
            en: 'Move the slider yourself and watch the stars fade in a bright sky and come back in a dark one.'
          }
        }
      ]
    },
    {
      id: 'vanker5',
      // a dark sky on a night picked at random; the tasks name only the star
      // to find, Suur Vanker is not drawn in, and the view does not move to
      // the stars of a task
      limit: 6,
      part: 'bigdipper',
      icon: '🎯',
      random: true,
      help: false,
      figs: [],
      fixedView: true,
      win: {
        name: { et: 'Ilma abita', en: 'Without help' },
        fact: {
          et: 'Leidsid tähed ise üles, nagu päris taevas. Nüüd võid minna õue ja proovida!',
          en: 'You found the stars yourself, as in the real sky. Now you can go outside and try!'
        }
      },
      pool: [
        {
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', up: ['polaris'],
          text: { et: 'Leia Põhjanael.', en: 'Find the North Star.' },
          fact: {
            et: 'Põhjanael on Eestis alati umbes 58 kraadi kõrgusel: nii kõrgel, kui kaugel põhja pool ekvaatorit Eesti asub.',
            en: 'In Estonia the North Star is always about 58 degrees up: as high as Estonia is far north of the equator.'
          }
        },
        {
          kind: 'tap', find: 'kochab', near: [], figure: 'littledipper', up: ['polaris'],
          accept: ['yildun', 'epsUmi', 'zetUmi', 'pherkad', 'etaUmi'],
          text: { et: 'Leia Väike Vanker.', en: 'Find the Little Dipper.' }
        },
        {
          kind: 'arc', along: ['mizar', 'alkaid'], curve: ['mizar', 'alkaid', 'arcturus', 'spica'],
          find: 'arcturus', figure: 'bootes', up: ['arcturus'],
          text: { et: 'Leia Arktuurus.', en: 'Find Arcturus.' },
          fact: {
            et: 'Arktuurus tähendab kreeka keeles karu valvajat: ta käib taevas Suure Karu järel.',
            en: 'Arcturus means the bear’s guard in Greek: it follows the Great Bear across the sky.'
          }
        },
        {
          kind: 'tap', find: 'alphecca', near: [], figure: 'corona', up: ['alphecca', 'arcturus'],
          accept: ['theCrb', 'nusakan', 'gamCrb', 'delCrb', 'epsCrb', 'iotCrb'],
          text: { et: 'Leia Põhjakroon.', en: 'Find the Northern Crown.' },
          fact: {
            et: 'Vanad kreeklased nägid Põhjakroonis printsess Ariadne krooni.',
            en: 'The ancient Greeks saw the crown of the princess Ariadne in the Northern Crown.'
          }
        }
      ]
    },
    {
      // The Orion part. A winter evening, at the same hour as level 1, with
      // Orion upright in the south: hops from the belt and the corners to the
      // bright stars round him, which make the Winter Hexagon. After Sõel and
      // the Orion Nebula, the view zooms in on their `photo`, and a `note`
      // with a `photo` looks at what cannot be seen at all: its `text` shows
      // while the view zooms in, and its fact when the photo is there.
      id: 'orion1',
      limit: 4.5,
      // the lines of the tasks done go when the next task starts, and the
      // win map has only the figures, not the lines of the hops
      clearLines: true,
      mapLines: false,
      part: 'orion',
      icon: '❄️',
      figs: [],
      // 15 February 2027 at 20:00
      when: Date.UTC(2027, 1, 15, 18, 0),
      caption: { et: 'Talveõhtu, 15. veebruar kell 20', en: 'A winter evening, 15 February at 20:00' },
      win: {
        name: { et: 'Orion näitas teed', en: 'Orion showed the way' },
        fact: {
          et: 'Orion on talveõhtuti lõunataevas. Nüüd oskad tema abil leida Siiriuse, Aldebarani, Sõela, Prooküoni, Kaksikud, Kapella ja Orioni udu.',
          en: 'Orion is in the southern sky on winter evenings. Now you can use him to find Sirius, Aldebaran, the Pleiades, Procyon, the Twins, Capella and the Orion Nebula.'
        }
      },
      tasks: [
        {
          kind: 'trace', figure: 'orion', span: 32, namesAfter: ['betelgeuse', 'bellatrix', 'rigel'],
          text: {
            et: 'Joonista Orion: puuduta tähti järjest 1, 2, 3 … või libista sõrme tähest täheni.',
            en: 'Draw Orion: tap the stars in turn 1, 2, 3 … or slide your finger from star to star.'
          },
          fact: {
            et: 'Orion on kütt vanadest kreeka lugudest, ühes käes nui ja teises kilp. Tema õlad on punakas Betelgeuse ja Bellatrix, tema jalg on sinakasvalge Riigel, ja keskel on kolm tähte reas: Orioni vöö.',
            en: 'Orion is a hunter from the old Greek stories, with a club in one hand and a shield in the other. His shoulders are reddish Betelgeuse and Bellatrix, his foot is blue-white Rigel, and in the middle are three stars in a row: Orion’s belt.'
          }
        },
        {
          kind: 'hop', from: 'mintaka', via: 'alnitak', find: 'sirius', autoDraw: 'canismajor', span: 30, show: ORION,
          text: {
            et: 'Leia Siirius. Jätka Orioni vöö kolme tähe joont vasakule alla.',
            en: 'Find Sirius. Carry the line of the three stars of Orion’s belt on, down to the left.'
          },
          fact: {
            et: 'Siirius on kogu öötaeva kõige heledam täht. Ta on meist ainult 8,6 valgusaasta kaugusel, üks meie lähimaid naabreid.',
            en: 'Sirius is the brightest star of the whole night sky. It is only 8.6 light years away, one of our nearest neighbours.'
          }
        },
        {
          kind: 'hop', from: 'alnitak', via: 'mintaka', find: 'aldebaran', figure: 'taurus', span: 30, show: ORION,
          text: {
            et: 'Leia Aldebaran. Jätka vöö joont teisele poole, paremale üles.',
            en: 'Find Aldebaran. Carry the line of the belt the other way, up to the right.'
          },
          fact: {
            et: 'Aldebaran on Sõnni punakas silm. Ta on oranž hiidtäht, meist 65 valgusaasta kaugusel.',
            en: 'Aldebaran is the reddish eye of the Bull. It is an orange giant, 65 light years away.'
          }
        },
        {
          kind: 'tap', find: 'alcyone', near: [], figure: 'pleiades', keepLine: true, photo: 'pleiades', span: 30,
          accept: ['atlas', 'electra', 'maia', 'merope', 'taygeta', 'pleione'],
          show: ['mintaka', 'alnitak', 'aldebaran'],
          text: {
            et: 'Jätka sama joont veel edasi ja leia Sõel.',
            en: 'Carry the same line on further and find the Pleiades.'
          },
          fact: {
            et: 'Sõel on täheparv. Silmaga näeb temast kuut või seitset tähte, aga tegelikult on seal umbes tuhat tähte.',
            en: 'The Pleiades are a star cluster. With the eye one sees six or seven of its stars, but there are about a thousand.'
          }
        },
        {
          // (the Winter Triangle only with the fact, and gone at the next task)
          kind: 'hop', from: 'bellatrix', via: 'betelgeuse', find: 'procyon', ticks: true, figure: 'triangle', figureOnce: true,
          span: 30, show: ORION,
          text: {
            et: 'Leia Prooküon. Tõmba joon Bellatrixist läbi Betelgeuse ja jätka seda vasakule.',
            en: 'Find Procyon. Draw a line from Bellatrix through Betelgeuse and carry it on to the left.'
          },
          fact: {
            et: 'Betelgeuse, Siirius ja Prooküon on Talvekolmnurk. Neid kolme heledat tähte on talveõhtul lõunataevas kerge leida.',
            en: 'Betelgeuse, Sirius and Procyon are the Winter Triangle. These three bright stars are easy to find in the southern sky on a winter evening.'
          }
        },
        {
          kind: 'hop', from: 'rigel', via: 'betelgeuse', find: 'pollux', accept: ['castor'], ticks: true, figure: 'twins', autoDraw: 'gemini', span: 30,
          title: { et: 'Kastor ja Polluks!', en: 'Castor and Pollux!' },
          text: {
            et: 'Leia Kaksikud. Tõmba joon Riigelist läbi Betelgeuse ja jätka seda üles.',
            en: 'Find the Twins. Draw a line from Rigel through Betelgeuse and carry it on upwards.'
          },
          fact: {
            et: 'Kastor ja Polluks on Kaksikute kaks heledat tähte, nagu kaks venda. Polluks on oranžikas ja natuke heledam.',
            en: 'Castor and Pollux are the two bright stars of the Twins, like two brothers. Pollux is orange and a little brighter.'
          }
        },
        {
          // (from the left-hand foot, a corner of the figure just drawn:
          // Kapella is 2° off the line, closer than along the sword)
          kind: 'hop', from: 'saiph', via: 'meissa', find: 'capella', ticks: true, autoDraw: 'auriga', span: 30, show: ORION,
          text: {
            et: 'Leia Kapella. Tõmba joon Orioni vasakpoolsest jalast läbi tema pea ja jätka seda üles.',
            en: 'Find Capella. Draw a line from Orion’s left-hand foot through his head and carry it on upwards.'
          },
          fact: {
            et: 'Kapella ei looju Eestis kunagi. Suveõhtul on ta madalal põhjas.',
            en: 'Capella never sets in Estonia. On a summer evening she is low in the north.'
          }
        },
        {
          // the sword's stars count too: the nebula is in the middle of them
          kind: 'tap', find: 'm42', near: [], accept: ['iotOri', 'c42Ori'], span: 30, show: ORION, photo: 'orion',
          text: {
            et: 'Leia Orioni udu. Vöö all ripub mõõk, ja selle keskel on udune täht.',
            en: 'Find the Orion Nebula. Below the belt hangs the sword, and in its middle is a fuzzy star.'
          },
          fact: {
            et: 'Orioni udu on hiiglaslik gaasipilv, kus sünnivad uued tähed. Ta on meist umbes 1300 valgusaasta kaugusel.',
            en: 'The Orion Nebula is a huge cloud of gas where new stars are born. It is about 1,300 light years away.'
          }
        },
        {
          // only to look: "left-hand" is safe here, as this sky does not turn
          kind: 'note', photo: 'horsehead', span: 12, center: null, show: ['alnitak', 'alnilam', 'mintaka', 'm42'],
          title: { et: 'Hobusepea udu', en: 'The Horsehead Nebula' },
          text: {
            et: 'Vaata veel vöö vasakpoolse tähe alla.',
            en: 'Look also below the left-hand star of the belt.'
          },
          fact: {
            et: 'Hobusepea udu on tume tolmupilv. Ta varjab enda taga helendavat gaasi, nii et paistab hobusepea kuju. Teda ei näe silmaga ega binokliga.',
            en: 'The Horsehead Nebula is a dark cloud of dust. It hides the glowing gas behind it, so that the shape of a horse’s head shows. It cannot be seen with the eye or with binoculars.'
          }
        },
        {
          // From Siirius, 14° up, to Kapella, 78° up: the view is as close as
          // they let it be. Only Orion's lines are drawn, and no names, so
          // that the numbers show.
          kind: 'trace', figure: 'hexagon', span: 30, onlyFigs: ['orion'], noLabels: true,
          text: {
            et: 'Joonista Talvekuusnurk: Kapellast Aldebarani, Riigeli, Siiriuse, Prooküoni ja Polluksini ning tagasi.',
            en: 'Draw the Winter Hexagon: from Capella to Aldebaran, Rigel, Sirius, Procyon and Pollux, and back.'
          },
          fact: {
            et: 'Talvekuusnurk on kuus heledat tähte kuuest tähtkujust. Betelgeuse on peaaegu tema keskel.',
            en: 'The Winter Hexagon is six bright stars from six constellations. Betelgeuse is almost in its middle.'
          }
        }
      ]
    }
  ];

  const TEXT = {
    et: {
      title: 'Tähest täheni',
      intro1: 'Õpi taevast tähti leidma. Tuntud tähtedest viivad jooned edasi järgmiste juurde.',
      intro2: 'Vea sõrme või hiirega ühelt tähelt läbi teise ja vaata, kuhu joon edasi viib. Siis puuduta tähte, mida otsid.',
      partBigDipper: 'Suur Vanker',
      partOrion: 'Orion',
      levels: [
        { name: 'Leia suunad', about: 'Sügisõhtu: Suur Vanker näitab teed' },
        { name: 'Taevas pöörleb', about: 'Suur Vanker tiirleb ümber Põhjanaela' },
        { name: 'Tõusevad ja loojuvad', about: 'Arktuurus tuleb ja läheb, Veega jääb' },
        { name: 'Hele ja pime taevas', about: 'Linnatuled, Kuu ja suveöö' },
        { name: 'Ilma abita', about: 'Pime taevas juhuslikul ööl: leia ise tähed' },
        { name: 'Leia suunad', about: 'Talveõhtu: Orion näitab teed' }
      ],
      seasons: ['Talve', 'Talve', 'Kevad', 'Kevad', 'Kevad', 'Suve', 'Suve', 'Suve', 'Sügis', 'Sügis', 'Sügis', 'Talve'],
      night: (season, evening, d, m, h) => `${season}${evening ? 'õhtu' : 'öö'}, ${d}. ${m} kell ${h}`,
      months: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
      date: (d, m) => `${d}. ${m}`,
      clock: (h) => `kell ${h}`,
      dateTime: (d, m, h, mm) => `${d}. ${m}, kell ${h}.${String(mm).padStart(2, '0')}`,
      summer: (h, mm) => ` (suveaja järgi ${!h && !mm ? 'kesköö' : `kell ${h}${mm === null ? '' : '.' + String(mm).padStart(2, '0')}`})`,
      midnight: (d, m) => `${d}. ${m}, kesköö`,
      lightSky: 'Taevas on hele: Päike on horisondi lähedal ja paistavad ainult heledamad tähed.',
      daySky: 'Päike on üleval ja tähti pole näha. Suur Vanker ja Põhjanael on ikka oma kohal.',
      day: 'Kuupäev',
      hour: 'Kellaaeg',
      skyLabel: 'Taeva heledus',
      skyBright: 'Hele taevas',
      skyDark: 'Pime taevas',
      nextLevel: 'Järgmine tase',
      play: 'Mängi',
      found: (name) => `${name}!`,
      isThis: (name) => `See on ${name}. Otsi edasi!`,
      notThis: 'See ei ole see täht. Otsi edasi!',
      drawFirst: 'Tõmba kõigepealt joon.',
      seeLine: 'Vaata, kuhu joon viib!',
      inFigure: (name) => `See täht on ${name}. Otsi edasi!`,
      next: 'Edasi ▶',
      finish: 'Valmis 🏁',
      dirs: { 0: 'põhi', 45: 'kirre', 90: 'ida', 135: 'kagu', 180: 'lõuna', 225: 'edel', 270: 'lääs', 315: 'loe' },
      wellDone: 'Tubli!',
      again: 'Mängi uuesti',
      menu: 'Menüü',
      hint: 'Vihje',
      sound: 'Heli',
      credit: 'Tähed: Yale’i heledate tähtede kataloog (Hoffleit ja Warren, 1991). Fotod: Tõrva Astronoomiaklubi, litsents CC BY-NC-SA.',
      photo: 'Foto: Tõrva Astronoomiaklubi',
      allGames: 'Kõik mängud'
    },
    en: {
      title: 'Star Hopping',
      intro1: 'Learn to find stars in the sky. Lines from stars you know lead on to the next ones.',
      intro2: 'Drag your finger or the mouse from one star through another, and see where the line leads. Then tap the star you are looking for.',
      partBigDipper: 'The Big Dipper',
      partOrion: 'Orion',
      levels: [
        { name: 'Find the directions', about: 'An autumn evening: the Big Dipper shows the way' },
        { name: 'The sky turns', about: 'The Big Dipper goes round the North Star' },
        { name: 'They rise and set', about: 'Arcturus comes and goes, Vega stays' },
        { name: 'Bright and dark skies', about: 'City lights, the Moon and summer nights' },
        { name: 'Without help', about: 'A dark sky on a night picked at random: find the stars yourself' },
        { name: 'Find the directions', about: 'A winter evening: Orion shows the way' }
      ],
      seasons: ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'],
      night: (season, evening, d, m, h) => `A ${season} ${evening ? 'evening' : 'night'}, ${d} ${m} at ${String(h).padStart(2, '0')}:00`,
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      date: (d, m) => `${d} ${m}`,
      clock: (h) => `${String(h).padStart(2, '0')}:00`,
      dateTime: (d, m, h, mm) => `${d} ${m}, ${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
      summer: (h, mm) => ` (${!h && !mm ? 'midnight' : `${String(h).padStart(2, '0')}:${String(mm || 0).padStart(2, '0')}`} summer time)`,
      midnight: (d, m) => `${d} ${m}, midnight`,
      lightSky: 'The sky is light: the Sun is near the horizon, and only the brighter stars show.',
      daySky: 'The Sun is up, and no stars can be seen. The Big Dipper and the North Star are still in their places.',
      day: 'Date',
      hour: 'Time',
      skyLabel: 'How bright the sky is',
      skyBright: 'Bright sky',
      skyDark: 'Dark sky',
      nextLevel: 'Next level',
      play: 'Play',
      found: (name) => `${name}!`,
      isThis: (name) => `This is ${name}. Keep looking!`,
      notThis: 'This is not the star. Keep looking!',
      drawFirst: 'Draw the line first.',
      seeLine: 'See where the line leads!',
      inFigure: (name) => `This star is in ${name}. Keep looking!`,
      next: 'Next ▶',
      finish: 'Done 🏁',
      dirs: { 0: 'N', 45: 'NE', 90: 'E', 135: 'SE', 180: 'S', 225: 'SW', 270: 'W', 315: 'NW' },
      wellDone: 'Well done!',
      again: 'Play again',
      menu: 'Menu',
      hint: 'Hint',
      sound: 'Sound',
      credit: 'Stars: the Yale Bright Star Catalogue (Hoffleit & Warren, 1991). Photos: Tõrva Astronoomiaklubi, licence CC BY-NC-SA.',
      photo: 'Photo: Tõrva Astronoomiaklubi',
      allGames: 'All games'
    }
  };

  // ---------------------------------------------------------------------------
  // State & helpers
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('taheretked.');
  const t = (key) => TEXT[Astro.lang][key];
  const nameOf = (n) => (typeof n === 'string' ? n : n[Astro.lang]);
  // the stars with a name used in Estonia, such as Põhjanael and Veega; the
  // Arabic names of the others are only in the data
  const known = (s) => s.name && typeof s.name === 'object';

  const area = $('area');
  const cv = $('sky');
  const ctx = cv.getContext('2d');
  const fingerEl = $('finger');

  const done = new Set(store.get('done', []));
  const state = {
    level: clamp(store.get('level', 0), 0, LEVELS.length - 1),
    tasks: [],        // the tasks of the game being played
    ti: 0,            // the task being played
    phase: 'menu',    // 'task', 'fact' or 'win'
    th: 0,            // the sidereal time, radians
    L: null,          // the layout
    cam: null,        // where the view looks: { az, alt, s }
    pan: null,        // the view moving: { from, to, t0, dur }
    lines: [],        // the hops drawn: arrows, arcs and parts of the way
    figs: new Set(['bigdipper']), // the figures drawn
    named: new Set(),  // the stars with their names shown
    lit: 0,           // in a figure to draw, stars 0 .. lit-1 of its order are joined
    litAt: [],        // when each of them was joined (performance.now())
    lastStep: 0,      // when the last star was joined
    doneAt: 0,        // when the figure was finished, for its numbers to fade out
    auto: null,       // a figure drawing itself
    hideFig: null,    // the figures whose names are hidden
    light: 0,         // how light the sky is, from 0 (night) to 1 (the Sun just set)
    day: false,       // the Sun is up: no stars, only Suur Vanker's lines and Põhjanael
    limit: 4.5,       // the faintest stars shown now, moving towards limitTo
    limitTo: 4.5,
    when: 0,          // the date and hour of the sky (ms, UT), and the hours to the clock time
    tz: TZ,
    turn: null,       // the sky turning on to the next task: { th0, th1, ms0, ms1, t0, dur }
    skyLimit: 2.5,    // the faintest stars the slider of how bright the sky is lets show
    skyStep: 0,
    skyTop: 0,        // on a level that looks at the horizon, the room for the cards of a sky
    skyTopW: 0,       // and the width it was measured at
    sel: null,        // a guide star tapped, to tap the second one after it
    drag: null,
    wiggle: null,     // a wrong star: { star, t0 }
    flash: null,      // a star just found: { key, t0 }
    photo: null,      // a photo over the sky: { id, at, out, fast }
    hintUntil: 0,
    lastAct: 0,
    gen: 0
  };
  const level = () => LEVELS[state.level];
  const task = () => state.tasks[state.ti];
  let raf = 0;

  function later(ms, fn) {
    const gen = state.gen;
    setTimeout(() => { if (gen === state.gen) fn(); }, ms);
  }

  // A place on the sky, ready for horizon().
  function sphere(ra, dec) {
    return { ra: ra * DEG, sd: Math.sin(dec * DEG), cd: Math.cos(dec * DEG) };
  }
  Object.entries(STARS).forEach(([key, s]) => Object.assign(s, { key }, sphere(s.ra, s.dec)));
  // the other stars, without the ones that are in STARS too
  // the colour of a star from its colour index B-V: blue-white for hot
  // stars, orange for cool ones
  function colorOf(bv) {
    const k = clamp((bv + 0.2) / 1.8, 0, 1);
    const at = (a, b, c) => Math.round(k < 0.4 ? a + (b - a) * (k / 0.4) : b + (c - b) * ((k - 0.4) / 0.6));
    return `${at(205, 255, 255)}, ${at(220, 248, 190)}, ${at(255, 235, 130)}`;
  }
  // the stars of the catalogue in stars.js, without the ones in STARS
  const named = Object.values(STARS);
  const near = (a, b) => a.sd * b.sd + a.cd * b.cd * Math.cos(a.ra - b.ra) > Math.cos(0.1 * DEG);
  const FIELD = [];
  for (let i = 0; i < STAR_CATALOGUE.length; i += 4) {
    const [ra, dec, mag, bv] = STAR_CATALOGUE.slice(i, i + 4);
    const s = Object.assign({ mag, color: colorOf(bv) }, sphere(ra, dec));
    if (!named.some((n) => near(n, s))) FIELD.push(s);
  }
  const ALL = [...named, ...FIELD];

  // Where each photo is on the sky: from a pixel of it to RA and Dec, on the
  // plane touching the sky at its first star, which is flat enough for a
  // degree of sky. Seen from below, the sky has the east to the left of the
  // north, as in the photos, which are only turned and scaled: as complex
  // numbers, pixel = k · (−east, −north) from the first star.
  Object.values(PHOTOS).forEach((P) => {
    const [[r1, d1, u1, v1], [r2, d2, u2, v2]] = P.anchors;
    const c = Math.cos(d1 * DEG);
    const wr = -(r2 - r1) * c;
    const wi = -(d2 - d1);
    const n = wr * wr + wi * wi;
    const kr = ((u2 - u1) * wr + (v2 - v1) * wi) / n;
    const ki = ((v2 - v1) * wr - (u2 - u1) * wi) / n;
    const m = kr * kr + ki * ki;
    P.toSky = (u, v) => sphere(r1 - ((u - u1) * kr + (v - v1) * ki) / m / c, d1 - ((v - v1) * kr - (u - u1) * ki) / m);
    // (pixels per degree; the photos are 1200 px square)
    P.scale = Math.sqrt(m);
    P.W = P.H = 1200;
    P.mid = P.toSky(600, 600);
    // the photo with its edges fading out, so that it melts into the sky
    const img = new Image();
    img.onload = () => {
      const W = img.naturalWidth;
      const H = img.naturalHeight;
      const c2 = document.createElement('canvas');
      c2.width = W;
      c2.height = H;
      const g = c2.getContext('2d');
      g.drawImage(img, 0, 0);
      g.globalCompositeOperation = 'destination-in';
      const R = Math.min(W, H) / 2;
      const grad = g.createRadialGradient(W / 2, H / 2, R * 0.7, W / 2, H / 2, R);
      grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, W, H);
      Object.assign(P, { img: c2, W, H, mid: P.toSky(W / 2, H / 2) });
    };
    img.src = P.file;
  });
  // the stars of the figures always show, the others to the level's limit
  // (in the slider task the stars of the figures too, so that a bright sky hides them)
  const shown = (s) => (state.day ? s.key === 'polaris'
    : (s.key && task() && task().kind !== 'slider') || s.mag <= state.limit + 0.7);
  // and the faintest ones dimmer rather than smaller
  const faint = (s) => (s.key && task() && task().kind !== 'slider'
    ? clamp((state.limit + 0.7 - s.mag) / 1.4, 0.85, 1)
    : clamp((state.limit + 0.7 - s.mag) / 1.4, 0, 1));

  // unit vectors on the sky (x to RA 0, z to the north pole), and back
  const vec = (s) => [s.cd * Math.cos(s.ra), s.cd * Math.sin(s.ra), s.sd];
  function fromVec(v) {
    const n = Math.hypot(...v);
    const z = v[2] / n;
    return { ra: Math.atan2(v[1], v[0]), sd: z, cd: Math.sqrt(Math.max(0, 1 - z * z)) };
  }
  const dotv = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  // The sidereal time at Tõrva, radians, from the time in ms (UT).
  function siderealTime(ms) {
    const D = (ms - Date.UTC(2000, 0, 1, 12)) / 86400000;
    const gmst = 18.697374558 + 24.06570982441908 * D;
    return ((((gmst * 15 + LON) % 360) + 360) % 360) * DEG;
  }

  // Where a star is seen from Tõrva: x to the east, y to the north, z up.
  function horizon(s, th = state.th) {
    const h = th - s.ra;
    const ch = Math.cos(h);
    return [
      -s.cd * Math.sin(h),
      s.sd * Math.cos(LAT) - s.cd * ch * Math.sin(LAT),
      s.sd * Math.sin(LAT) + s.cd * ch * Math.cos(LAT)
    ];
  }

  function dirOf(az, alt) {
    return [Math.cos(alt * DEG) * Math.sin(az * DEG), Math.cos(alt * DEG) * Math.cos(az * DEG), Math.sin(alt * DEG)];
  }

  // which way is forward, right and up for a view looking at az, alt
  function basis(cam) {
    const a = cam.az * DEG;
    const h = cam.alt * DEG;
    return {
      fwd: dirOf(cam.az, cam.alt),
      right: [Math.cos(a), -Math.sin(a), 0],
      up: [-Math.sin(h) * Math.sin(a), -Math.sin(h) * Math.cos(a), Math.cos(h)]
    };
  }

  // Stereographic projection around the middle of the view, which keeps the
  // shapes of the figures: pixels, or null for what is behind the viewer.
  function toScreen(V, v) {
    const d = dotv(v, V.fwd);
    if (d < -0.3) return null;
    const k = 2 / (1 + d);
    return [V.cx + k * dotv(v, V.right) * V.s, V.cy - k * dotv(v, V.up) * V.s];
  }

  // Stars low down are dimmed by the air, and hidden below the horizon.
  const lowDim = (z) => clamp(z / 0.1, 0, 1);

  // seeded random numbers, so that the trees are the same every time
  function seeded(seed) {
    let x = seed;
    return () => {
      x = (x * 16807) % 2147483647;
      return (x - 1) / 2147483646;
    };
  }

  // the treeline: spruces at their direction, with their height in degrees,
  // lower in the west, so that Arktuurus shows above them
  const TREES = (() => {
    const r = seeded(7);
    const out = [];
    for (let az = 0; az < 360; az += 1.2 + r() * 2.6) {
      const low = az > 262 && az < 306;
      out.push({ az, h: low ? 1 + r() * 1.3 : 2.2 + r() * 3.2 });
    }
    return out;
  })();

  // ---------------------------------------------------------------------------
  // Layout and the view
  // ---------------------------------------------------------------------------

  function layout() {
    const W = area.clientWidth;
    const H = area.clientHeight;
    if (!W || !H) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const u = Math.min(W, H);
    state.L = {
      W, H, u, dpr,
      top: cardRoom(),
      bottom: bottomRoom(),
      pad: clamp(u * 0.09, 30, 70),   // room round the stars of a task
      hitR: clamp(u * 0.06, 24, 40)
    };
    if (state.cam) state.cam = state.photo && !state.photo.out ? photoCam(state.photo.id) : taskView();
  }

  // A view that looks at the middle of the stars and fits them, with `span`
  // degrees of sky across the shorter side, or more if they need it, up to
  // 120°.
  function fitView(keys, L = state.L, span = (task() && task().span) || 70,
    center = task() && 'center' in task() ? task().center : level().center,
    slide = !center && !!(level().center || level().look)) {
    const vs = keys.map((k) => horizon(STARS[k]));
    const m = vs.reduce((a, v) => [a[0] + v[0], a[1] + v[1], a[2] + v[2]], [0, 0, 0]);
    let az = Math.atan2(m[0], m[1]) / DEG;
    let alt = Math.asin(m[2] / Math.hypot(...m)) / DEG;
    // looking at the middle of the stars' outline rather than at their
    // average, so that a crowd of stars on one side does not push the others
    // to the edge: twice, as the outline changes a little when the view turns
    let V;
    let box;
    // On a level with a centre, the view always looks at it (Põhjanael, due
    // north), and the stars of a task without a centre of its own are framed
    // by sliding the picture, not by turning the view, which would tilt it:
    // so zooming in and out never looks like the sky turning. On a level
    // that looks at the horizon, the view turns only sideways, to face the
    // stars, at the level's height, and the picture slides only up or down,
    // so that the ground stays level.
    const look = slide && level().look;
    if (center || (slide && !look)) {
      const c = aim(center || level().center);
      az = Math.atan2(c[0], c[1]) / DEG;
      alt = Math.asin(c[2]) / DEG;
    }
    const outline = () => {
      V = Object.assign(basis({ az, alt }), { s: 1, cx: 0, cy: 0 });
      const ps = vs.map((v) => toScreen(V, v)).filter(Boolean);
      box = {
        x0: Math.min(...ps.map((q) => q[0])), x1: Math.max(...ps.map((q) => q[0])),
        y0: Math.min(...ps.map((q) => q[1])), y1: Math.max(...ps.map((q) => q[1]))
      };
    };
    for (let n = 0; n < 3; n++) {
      outline();
      if (n === 2 || center || (slide && !look)) break;
      // the inverse of the stereographic projection, for the middle of the box
      const X = (box.x0 + box.x1) / 2;
      const Y = -(box.y0 + box.y1) / 2;
      const r2 = X * X + Y * Y;
      const d = [0, 1, 2].map((i) => ((4 - r2) * V.fwd[i] + 4 * (X * V.right[i] + Y * V.up[i])) / (4 + r2));
      az = Math.atan2(d[0], d[1]) / DEG;
      alt = Math.asin(clamp(d[2], -1, 1)) / DEG;
    }
    if (look) {
      // (with the ground below the stars, to show how high they are)
      alt = look;
      vs.push(dirOf(az, -3));
      outline();
    }
    // (with a slider at the bottom, less room is kept round the stars, as
    // the slider takes some of the height, and in the one view of a sky,
    // which takes in the stars of several tasks)
    const pad = task() && (task().kind === 'slider' || level().look) && !L.map ? 20 : L.pad;
    const w = L.W / 2 - pad;
    const h = (L.H - L.top - (L.bottom || 16)) / 2 - pad;
    let s = Math.min(w, h) / (2 * Math.tan((span / 2) * DEG / 2));
    const sMin = Math.min(w, h) / (2 * Math.tan(60 * DEG / 2));
    // the middle of the stars' outline, where the picture slides to
    const ox = slide && !look ? (box.x0 + box.x1) / 2 : 0;
    const oy = slide ? (box.y0 + box.y1) / 2 : 0;
    const hx = Math.max(Math.abs(box.x0 - ox), Math.abs(box.x1 - ox));
    const hy = Math.max(Math.abs(box.y0 - oy), Math.abs(box.y1 - oy));
    if (hx > 1e-6) s = Math.min(s, w / hx);
    if (hy > 1e-6) s = Math.min(s, h / hy);
    return { az, alt, s: Math.max(s, sMin), ox, oy };
  }

  // A view straight at a star, as wide as a circle of `R` degrees round it:
  // round Põhjanael, just enough for Suur Vanker in every position (Alkaid,
  // its farthest star, is 40.0° from Põhjanael), so that the zoom stays the
  // same however the sky turns.
  // where a view with a centre looks: for Põhjanael, at the pole itself, as
  // Põhjanael is 0.7° from it and goes round it in a small circle, which
  // would rock the ground as the sky turns
  function aim(key) {
    return key === 'polaris' ? [0, Math.cos(LAT), Math.sin(LAT)] : horizon(STARS[key]);
  }

  function ringView(key, R = 40.5, L = state.L) {
    const c = aim(key);
    // (a margin just for the size of the stars and their names)
    const w = L.W / 2 - 14;
    const h = (L.H - L.top - (L.bottom || 16)) / 2 - 10;
    return { az: Math.atan2(c[0], c[1]) / DEG, alt: Math.asin(c[2]) / DEG, s: Math.min(w, h) / (2 * Math.tan((R / 2) * DEG)) };
  }

  // a view straight at the middle of a photo, just wide enough for it
  function photoCam(id, L = state.L) {
    const P = PHOTOS[id];
    const c = horizon(P.mid);
    const R = Math.min(P.W, P.H) / P.scale;
    const w = L.W / 2 - 8;
    const h = (L.H - L.top - (L.bottom || 16)) / 2 - 8;
    return { az: Math.atan2(c[0], c[1]) / DEG, alt: Math.asin(c[2]) / DEG, s: Math.min(w, h) / (2 * Math.tan((R / 2) * DEG)) };
  }

  // the view as it is now, ready for toScreen()
  function view(L = state.L, cam = state.cam) {
    // (ox, oy: how far the picture is slid, in the units of the projection)
    return Object.assign(basis(cam), {
      s: cam.s,
      cx: L.W / 2 - (cam.ox || 0) * cam.s,
      cy: L.top + (L.H - L.top - (L.bottom || 16)) / 2 - (cam.oy || 0) * cam.s
    });
  }

  // the stars the current task is about, for the view to show
  function viewKeys() {
    return task() ? keysOf(task(), state.phase === 'fact') : ['dubhe', 'polaris'];
  }

  // the stars a task is about, and once it is done, the figure drawing itself
  function keysOf(k, fact) {
    const keys = [];
    if (k.from) keys.push(k.from, k.via);
    if (k.find) keys.push(k.find);
    if (k.near) keys.push(...k.near);
    if (k.along) keys.push(...k.along);
    if (k.figure) keys.push(...new Set(FIGURES[k.figure].lines.flat()));
    if (k.accept) keys.push(...k.accept);
    if (k.show) keys.push(...k.show);
    if (k.autoDraw && fact) keys.push(...FIGURES[k.autoDraw].order);
    return keys;
  }

  // the stars of all the tasks in the sky of the current one, from the task
  // that turned the sky on to the next one that does
  function skyKeys() {
    const ts = state.tasks;
    let i = state.ti;
    while (i > 0 && !ts[i].when) i--;
    const keys = [];
    for (let j = i; j < ts.length && (j === i || !ts[j].when); j++) keys.push(...keysOf(ts[j], false));
    return keys;
  }

  // the view moves smoothly to show the stars of the next task
  function panTo(cam, dur = 1200) {
    if (!state.cam) {
      state.cam = cam;
      return;
    }
    state.pan = { from: { ...state.cam }, to: cam, t0: performance.now(), dur };
  }

  function stepPan(now) {
    const P = state.pan;
    if (!P) return;
    const p = clamp((now - P.t0) / P.dur, 0, 1);
    const e = p * p * (3 - 2 * p);
    // the shorter way round, but while the sky turns, the way the stars go
    // (east, south, west), unless that is nearly all the way round
    let dAz = ((P.to.az - P.from.az + 540) % 360) - 180;
    const fwd = (((P.to.az - P.from.az) % 360) + 360) % 360;
    if (P.forward && fwd < 300) dAz = fwd;
    // Zooming far in or out, as to a photo, the zoom goes evenly, by the
    // same factor every moment, and the point zoomed at moves straight across
    // the screen, rather than flying off it.
    const zoom = Math.abs(Math.log(P.to.s / P.from.s)) > 1;
    const s = zoom ? P.from.s * Math.pow(P.to.s / P.from.s, e) : P.from.s + (P.to.s - P.from.s) * e;
    const f = !zoom ? e : P.to.s > P.from.s ? 1 - ((1 - e) * P.from.s) / s : (e * P.to.s) / s;
    const lerp = (a, b) => (a || 0) + ((b || 0) - (a || 0)) * f;
    state.cam = {
      az: P.from.az + dAz * f,
      alt: P.from.alt + (P.to.alt - P.from.alt) * f,
      s,
      // the picture slides on the screen as the view zooms (the point that
      // stays still moves straight, rather than the slide being scaled)
      ox: lerp(P.from.ox * P.from.s, P.to.ox * P.to.s) / s,
      oy: lerp(P.from.oy * P.from.s, P.to.oy * P.to.s) / s
    };
    if (p >= 1) state.pan = null;
  }

  // ---------------------------------------------------------------------------
  // The lines of the hops
  // ---------------------------------------------------------------------------

  // From a through b and on along the great circle, to `ahead` times the
  // gap beyond b: points on the sky, a point every half degree.
  function hopPoints(a, b, ahead) {
    const A = vec(a);
    const B = vec(b);
    const gap = Math.acos(clamp(dotv(A, B), -1, 1));
    const c = dotv(A, B);
    let N = [B[0] - c * A[0], B[1] - c * A[1], B[2] - c * A[2]];
    const n = Math.hypot(...N);
    N = N.map((q) => q / n);
    const end = gap * (1 + ahead);
    const pts = [];
    for (let x = 0; x <= end; x += 0.5 * DEG) {
      pts.push(fromVec([Math.cos(x) * A[0] + Math.sin(x) * N[0], Math.cos(x) * A[1] + Math.sin(x) * N[1], Math.cos(x) * A[2] + Math.sin(x) * N[2]]));
    }
    return { pts, gap, at: (x) => fromVec([Math.cos(x) * A[0] + Math.sin(x) * N[0], Math.cos(x) * A[1] + Math.sin(x) * N[1], Math.cos(x) * A[2] + Math.sin(x) * N[2]]) };
  }

  // A smooth arc on the sky: the circle through the three stars `keys`,
  // so that it bends evenly. From star `a`, on past star `b` by `past`
  // degrees, a point every half degree.
  function arcPoints(keys, a, b, past = 0) {
    const P = keys.map((k) => vec(STARS[k]));
    // (the plane through the three stars cuts the sphere in that circle:
    // its normal is the axis of the circle)
    const u = P[1].map((x, i) => x - P[0][i]);
    const w = P[2].map((x, i) => x - P[0][i]);
    let n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    const ln = Math.hypot(...n);
    n = n.map((x) => x / ln);
    let d = dotv(P[0], n);
    if (d < 0) { n = n.map((x) => -x); d = -d; }
    const r = Math.sqrt(1 - d * d);
    const pa = vec(STARS[a]);
    const e1 = pa.map((x, i) => x - dotv(pa, n) * n[i]);
    const l1 = Math.hypot(...e1);
    e1.forEach((x, i) => { e1[i] = x / l1; });
    const e2 = [n[1] * e1[2] - n[2] * e1[1], n[2] * e1[0] - n[0] * e1[2], n[0] * e1[1] - n[1] * e1[0]];
    const pb = vec(STARS[b]);
    let tb = Math.atan2(dotv(pb, e2), dotv(pb, e1));
    // (the way round from `a` to `b` is the way the stars `keys` go)
    const sense = Math.sign(Math.atan2(dotv(P[1], e2), dotv(P[1], e1))) || 1;
    tb *= sense;
    if (tb < 0) tb += 2 * Math.PI;
    const end = tb + (past * DEG) / r;
    const pts = [];
    for (let t = 0; t <= end; t += (0.5 * DEG) / r) {
      const ct = Math.cos(t * sense);
      const st = Math.sin(t * sense);
      pts.push(fromVec([0, 1, 2].map((i) => d * n[i] + r * (ct * e1[i] + st * e2[i]))));
    }
    return pts;
  }

  // a line of a hop, drawn growing from its start
  function addLine(kind, a, b, keep) {
    const k = task();
    const line = { kind, a: a.key, b: b.key, t0: performance.now(), keep, ticks: [], task: state.ti, when: state.when };
    if (kind === 'arc') {
      // (through the last two stars of `along` to the star after them, and
      // on a little, about 5°, past it)
      const to = k.curve[k.along.length];
      const from = k.along[k.along.length - 2];
      line.pts = arcPoints([from, k.along[k.along.length - 1], to], from, to, 5);
      line.dur = 1800;
    } else if (kind === 'part') {
      line.pts = hopPoints(a, b, 0).pts;
      line.dur = 700;
    } else {
      // (along Orion's belt, which is short, as far as from the other stars)
      const belt = BELT.includes(a.key) && BELT.includes(b.key);
      const H = hopPoints(a, b, Math.min(belt ? 21 : 9, (110 * DEG) / Math.max(H0(a, b), 1e-6)));
      line.pts = H.pts;
      line.dur = 1500;
      if (k.ticks && a.key === k.from && b.key === k.via) {
        for (let n = 1; n <= 8; n++) line.ticks.push({ n, s: H.at(H.gap * (1 + n)), s2: H.at(H.gap * (1 + n) + 0.3 * DEG) });
      }
    }
    // only a few loose lines at a time; the ones the task asks for stay
    const loose = state.lines.filter((l) => !l.keep);
    if (loose.length >= 3) state.lines.splice(state.lines.indexOf(loose[0]), 1);
    state.lines.push(line);
    return line;
  }
  const H0 = (a, b) => Math.acos(clamp(dotv(vec(a), vec(b)), -1, 1));

  // whether the task's own line is drawn, by a drag, taps or the hint
  function lineDrawn() {
    const k = task();
    if (!['hop', 'part', 'arc'].includes(k.kind)) return false;
    return state.lines.some((l) => l.keep && l.task === state.ti);
  }

  // the task's own line, as the hint shows it, unless it is drawn already
  function taskLine() {
    const k = task();
    const has = (a, b) => state.lines.some((l) => l.keep && l.task === state.ti && l.a === a && l.b === b);
    if (k.kind === 'hop' && !has(k.from, k.via)) {
      const l = addLine('hop', STARS[k.from], STARS[k.via], true);
      if (!k.find) lineDone(l);
    }
    if (k.kind === 'part' && !has(k.from, k.via) && !has(k.via, k.from)) addLine('part', STARS[k.from], STARS[k.via], true);
    if (k.kind === 'arc' && !state.lines.some((l) => l.kind === 'arc' && l.task === state.ti)) {
      const l = addLine('arc', STARS[k.along[0]], STARS[k.along[1]], true);
      if (!k.find) lineDone(l);
    }
  }

  // ---------------------------------------------------------------------------
  // Drawing
  // ---------------------------------------------------------------------------

  function dot(g, x, y, r, color) {
    g.fillStyle = color;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.fill();
  }

  // the lines of the figures, the same while they are drawn and afterwards
  const figureWidth = (u) => clamp(u * 0.004, 1.5, 2.5);

  const starR = (mag, u) => clamp(0.9 + (4.4 - mag) * 0.8, 0.7, 5) * clamp(u / 650, 0.8, 1.3);

  // no figures drawn in a slider task until it is done, except the one to
  // play with, which starts at the dark sky
  const figsHidden = (map) => !map && task() && task().kind === 'slider' && !task().free && state.phase === 'task';
  // and with the slider to play with, a figure only while all its stars show
  const figHidden = (id, map) => !map && task() && task().free && !FIGURES[id].lines.flat().every((k) => shown(STARS[k]));

  // a task with `onlyFigs` draws only those figures, and its own once done
  const onlyFigs = (id, map) => {
    const k = !map && task();
    return k && k.onlyFigs && !k.onlyFigs.includes(id) && !(state.phase === 'fact' && id === k.figure);
  };

  // where a star is on the screen now, or null
  function place(V, s) {
    const v = horizon(s);
    if (v[2] <= 0) return null;
    const p = toScreen(V, v);
    return p ? { x: p[0], y: p[1], z: v[2] } : null;
  }

  // a line through points on the sky, in pieces where it is above the
  // horizon a little (the trees hide the rest); up to the share `p` of it
  function skyPath(g, V, pts, p = 1) {
    const n = Math.max(1, Math.round(pts.length * p));
    let pen = false;
    g.beginPath();
    let last = null;
    for (let i = 0; i < n; i++) {
      const v = horizon(pts[i]);
      const q = v[2] > -0.03 ? toScreen(V, v) : null;
      if (!q) { pen = false; continue; }
      if (pen) g.lineTo(q[0], q[1]);
      else g.moveTo(q[0], q[1]);
      pen = true;
      last = q;
    }
    g.stroke();
    return last;
  }

  function render(g, L, V, now, map = false) {
    const { W, H, u } = L;
    // the sky, lighter towards the horizon
    const hz = toScreen(V, dirOf(state.cam.az, 0));
    const y1 = hz ? clamp(hz[1], H * 0.3, H * 3) : H;
    const grad = g.createLinearGradient(0, 0, 0, y1);
    grad.addColorStop(0, '#040820');
    grad.addColorStop(0.7, '#0c1644');
    grad.addColorStop(1, '#26357a');
    g.fillStyle = grad;
    g.fillRect(0, 0, W, H);
    // a day sky, under the lines of Suur Vanker
    if (state.day && !map) {
      g.fillStyle = 'rgba(95, 150, 225, 0.85)';
      g.fillRect(0, 0, W, H);
      drawSun(g, L, V);
    }

    // the hops
    g.lineCap = 'round';
    g.lineJoin = 'round';
    for (const l of state.lines) {
      // the lines drawn before the sky turned would point somewhere else now,
      // and none while the player turns the sky
      if (!map && (l.when !== state.when || (task() && task().kind === 'explore'))) continue;
      const p = map ? 1 : clamp((now - l.t0) / l.dur, 0, 1);
      const age = (now - l.t0) / 1000;
      // the lines of the tasks done are fainter, except on the map
      const old = !map && l.task < state.ti && !(task().keepLine && l.task === state.ti - 1);
      if (old && level().clearLines) continue;
      // a line that is not the task's fades out completely after a few
      // seconds, and is not on the map
      const a = l.keep ? (old ? 0.22 : 0.5) : 0.5 * (1 - clamp((age - 2.5) / 1.5, 0, 1));
      if (a <= 0.01 || (map && (!l.keep || level().mapLines === false))) continue;
      g.strokeStyle = `rgba(255, 220, 120, ${a.toFixed(2)})`;
      g.lineWidth = clamp(u * 0.0035, 1.5, 2.2);
      g.setLineDash(l.kind === 'part' ? [] : [6, 9]);
      g.lineDashOffset = map ? 0 : -now / 40;
      const tip = skyPath(g, V, l.pts, p);
      g.setLineDash([]);
      if (tip && p < 1) dot(g, tip[0], tip[1], 3, 'rgba(255, 230, 140, 0.7)');
      // the ticks at every gap between the two stars, numbered
      const fs = map ? 20 : Math.round(clamp(u * 0.024, 11, 14));
      g.font = `800 ${fs}px Nunito, sans-serif`;
      g.textAlign = 'center';
      for (const tk of l.ticks) {
        const v = horizon(tk.s);
        const q = v[2] > 0 ? toScreen(V, v) : null;
        const q2 = toScreen(V, horizon(tk.s2));
        if (!q || !q2 || old || (!map && (now - l.t0) / l.dur < tk.n / 9)) continue;
        const dx = q2[0] - q[0];
        const dy = q2[1] - q[1];
        const d = Math.hypot(dx, dy) || 1;
        const nx = -dy / d;
        const ny = dx / d;
        g.strokeStyle = 'rgba(255, 220, 120, 0.55)';
        g.lineWidth = 1.5;
        g.beginPath();
        g.moveTo(q[0] - nx * 5, q[1] - ny * 5);
        g.lineTo(q[0] + nx * 5, q[1] + ny * 5);
        g.stroke();
        g.fillStyle = 'rgba(255, 230, 150, 0.6)';
        g.fillText(String(tk.n), q[0] + nx * 14, q[1] + ny * 14 + fs * 0.35);
      }
    }

    // the figures (not while the slider of how bright the sky is waits for
    // the dark sky: the player is to find them only as the stars come out)
    for (const id of figsHidden(map) ? [] : state.figs) {
      // in daylight only Suur Vanker's lines, where it is
      if (state.day && id !== 'bigdipper') continue;
      if (figHidden(id, map)) continue;
      if (onlyFigs(id, map)) continue;
      const f = FIGURES[id];
      g.strokeStyle = state.day ? 'rgba(255, 255, 255, 0.85)' : id === 'bigdipper' ? 'rgba(150, 180, 255, 0.45)'
        : f.asterism ? 'rgba(150, 210, 255, 0.5)' : 'rgba(255, 211, 77, 0.55)';
      g.lineWidth = figureWidth(u);
      // (the bright stars of several figures, such as the Winter Triangle, dashed)
      g.setLineDash(f.asterism ? [5, 7] : []);
      for (const line of f.lines) {
        g.beginPath();
        for (let i = 1; i < line.length; i++) {
          // (only between stars that show: a city sky hides the faint ones)
          if (!state.day && (!shown(STARS[line[i - 1]]) || !shown(STARS[line[i]]))) continue;
          const a = place(V, STARS[line[i - 1]]);
          const b = place(V, STARS[line[i]]);
          if (!a || !b) continue;
          g.moveTo(a.x, a.y);
          g.lineTo(b.x, b.y);
        }
        g.stroke();
      }
      g.setLineDash([]);
    }
    // a figure being drawn, and just after its last star, while its
    // numbers and golden lines fade out
    const fade = state.phase === 'fact' && state.doneAt ? 1 - clamp((now - state.doneAt - 700) / 1300, 0, 1) : 1;
    const tr = !map && (state.auto || ((state.phase === 'task' || fade > 0) && traceOf(task())));
    g.globalAlpha = tr ? fade : 1;
    if (tr) drawTrace(g, L, V, now, tr);
    g.globalAlpha = 1;

    // the stars
    for (const s of ALL) {
      if (!shown(s)) continue;
      const q = place(V, s);
      if (!q || q.x < -10 || q.x > W + 10 || q.y < -10 || q.y > H + 10) continue;
      let x = q.x;
      const w = state.wiggle;
      if (w && w.star === s && !map) {
        const e = Math.max(0, (now - w.t0) / 400);
        if (e < 1) x += Math.sin(e * Math.PI * 6) * 6 * (1 - e);
      }
      const dim = lowDim(q.z) * faint(s);
      // the stars of the figures a little bigger, so that the faint ones can be followed
      const r = s.key ? Math.max(starR(s.mag, u), starR(3.6, u)) : starR(s.mag, u);
      const c = s.color || '255, 255, 255';
      // the Orion Nebula, a fuzzy glow
      if (s.nebula) {
        const R = Math.max(r * 3, 7);
        const glow = g.createRadialGradient(x, q.y, 0, x, q.y, R);
        glow.addColorStop(0, `rgba(235, 228, 255, ${(0.8 * dim).toFixed(2)})`);
        glow.addColorStop(0.35, `rgba(205, 195, 255, ${(0.35 * dim).toFixed(2)})`);
        glow.addColorStop(1, 'rgba(205, 195, 255, 0)');
        g.fillStyle = glow;
        g.fillRect(x - R, q.y - R, 2 * R, 2 * R);
        continue;
      }
      if (s.mag < 2.6) dot(g, x, q.y, r * 2.6, `rgba(${c}, ${(0.13 * dim).toFixed(2)})`);
      dot(g, x, q.y, r, `rgba(${c}, ${dim.toFixed(2)})`);
    }

    if (!map) drawPhoto(g, V, now);
    g.globalAlpha = tr ? fade : 1;
    if (tr) drawTraceStars(g, L, V, now, tr);
    // the twilight over the stars, so that they fade
    if (state.light > 0 && !state.day && !map) {
      g.fillStyle = `rgba(80, 120, 190, ${(0.6 * state.light).toFixed(2)})`;
      g.fillRect(0, 0, W, H);
    }
    g.globalAlpha = 1;
    if (!map) drawMarks(g, L, V, now);
    drawLabels(g, L, V, map);
    drawGround(g, L, V);
    if (!map && task() && state.phase === 'fact' && (task().below || task().height)) {
      drawHorizon(g, L, V);
      if (task().below) drawBelow(g, L, V, now, task().below);
      if (task().height) drawHeight(g, L, V, now, task().height);
    }
  }

  // A photo over the stars, lined up with them: the photo is mapped onto
  // the screen through three of its corners, as over a degree of sky the
  // projection is as good as flat.
  function drawPhoto(g, V, now) {
    const ph = state.photo;
    const P = ph && PHOTOS[ph.id];
    const a = ph ? photoAlpha(now) : 0;
    if (!P || !P.img || a <= 0) return;
    const at = (u, v) => toScreen(V, horizon(P.toSky(u, v)));
    const p0 = at(0, 0);
    const p1 = at(P.W, 0);
    const p2 = at(0, P.H);
    if (!p0 || !p1 || !p2) return;
    g.save();
    g.globalAlpha = a;
    g.transform((p1[0] - p0[0]) / P.W, (p1[1] - p0[1]) / P.W, (p2[0] - p0[0]) / P.H, (p2[1] - p0[1]) / P.H, p0[0], p0[1]);
    g.drawImage(P.img, 0, 0);
    g.restore();
  }

  // how much the photo shows: fading in once the view has zoomed to it, and
  // out again, quickly when the player goes on
  function photoAlpha(now) {
    const ph = state.photo;
    const fadeIn = clamp((now - ph.at) / 900, 0, 1);
    return ph.out ? fadeIn * (1 - clamp((now - ph.out) / (ph.fast ? 300 : 900), 0, 1)) : fadeIn;
  }

  // the horizon as a line
  function drawHorizon(g, L, V) {
    g.save();
    g.strokeStyle = 'rgba(190, 205, 255, 0.55)';
    g.lineWidth = 1.5;
    g.beginPath();
    let pen = false;
    for (let az = 0; az <= 360; az += 1) {
      const q = toScreen(V, dirOf(az, 0));
      if (!q || Math.abs(q[0] - L.W / 2) > L.W * 2) { pen = false; continue; }
      if (pen) g.lineTo(...q);
      else g.moveTo(...q);
      pen = true;
    }
    g.stroke();
    g.restore();
  }

  // a dashed line from the horizon straight up to a star, growing, and how
  // high the star is, in degrees, beside it
  function drawHeight(g, L, V, now, key) {
    const v = horizon(STARS[key]);
    const alt = Math.asin(v[2]) / DEG;
    const az = Math.atan2(v[0], v[1]) / DEG;
    const p = clamp((now - state.factAt - 600) / 1200, 0, 1);
    // (up to the ring round the star found)
    const star = toScreen(V, v);
    const pts = [];
    for (let a = 0; a <= alt * p; a += 0.25) pts.push(toScreen(V, dirOf(az, a)));
    const ok = pts.filter((q) => q && star && Math.hypot(q[0] - star[0], q[1] - star[1]) > L.hitR * 0.45 + 3);
    if (ok.length < 2) return;
    g.save();
    g.strokeStyle = 'rgba(255, 220, 120, 0.95)';
    g.lineWidth = clamp(L.u * 0.004, 2, 2.6);
    g.lineCap = 'round';
    g.setLineDash([5, 6]);
    g.beginPath();
    ok.forEach((q, i) => (i ? g.lineTo(...q) : g.moveTo(...q)));
    g.stroke();
    if (p >= 1) {
      const m = toScreen(V, dirOf(az, alt / 2));
      const fs = Math.round(clamp(L.u * 0.03, 12, 16));
      g.font = `800 ${fs}px Nunito, sans-serif`;
      g.textAlign = 'left';
      g.strokeStyle = 'rgba(4, 8, 32, 0.85)';
      g.lineWidth = 4;
      g.setLineDash([]);
      const txt = `${Math.round(alt)}°`;
      g.strokeText(txt, m[0] + 8, m[1] + fs * 0.35);
      g.fillStyle = 'rgba(255, 233, 160, 0.9)';
      g.fillText(txt, m[0] + 8, m[1] + fs * 0.35);
    }
    g.restore();
  }

  // A star below the horizon: a dashed curve growing through the stars down
  // to the star, and a dashed circle and its name there.
  function drawBelow(g, L, V, now, b) {
    const at = (v) => toScreen(V, v);
    g.save();
    const p = clamp((now - state.noteAt) / 2400, 0, 1);
    const pts = arcPoints(b.curve, b.curve[0], b.star);
    const n = Math.max(1, Math.round(pts.length * p));
    g.strokeStyle = 'rgba(255, 220, 120, 0.6)';
    g.lineWidth = clamp(L.u * 0.0035, 1.5, 2.2);
    g.lineCap = 'round';
    g.setLineDash([6, 9]);
    g.lineDashOffset = -now / 40;
    g.beginPath();
    pts.slice(0, n).forEach((s, i) => {
      const q = at(horizon(s));
      if (q) i ? g.lineTo(...q) : g.moveTo(...q);
    });
    g.stroke();
    const q = at(horizon(STARS[b.star]));
    if (q && p >= 1) {
      g.strokeStyle = 'rgba(255, 211, 77, 0.8)';
      g.lineWidth = 2.5;
      g.lineDashOffset = 0;
      g.beginPath();
      g.arc(q[0], q[1], L.hitR * 0.45, 0, Math.PI * 2);
      g.stroke();
      const fs = Math.round(clamp(L.u * 0.03, 12, 16));
      g.font = `800 ${fs}px Nunito, sans-serif`;
      g.textAlign = 'center';
      g.fillStyle = 'rgba(255, 233, 160, 0.85)';
      g.fillText(nameOf(STARS[b.star].name), q[0], q[1] + L.hitR * 0.45 + fs + 4);
    }
    g.restore();
  }

  // A figure to draw, as in Tähtkujud: the lines between the stars joined
  // grow from the star joined first; with 💡 the whole figure shows as faint
  // dashed lines.
  const LINE_MS = 380;
  const HINT_MS = 3500;   // the next star starts to pulse after this long without progress
  const traceOf = (k) => k && k.kind === 'trace' && FIGURES[k.figure];
  // the lines of a figure to draw, as places in its order, so that a star
  // can come twice, as the first star again to close the figure
  const traceLinks = (f) => f.order.slice(1).map((key, i) => [f.join && f.join[key] ? f.order.indexOf(f.join[key]) : i, i + 1])
    .concat((f.extra || []).map(([a, b]) => [f.order.indexOf(a), f.order.indexOf(b)]));

  function drawTrace(g, L, V, now, f) {
    const at = (key) => place(V, STARS[key]);
    if (now < state.hintUntil) {
      g.setLineDash([6, 8]);
      g.strokeStyle = 'rgba(95, 212, 255, 0.4)';
      g.lineWidth = 2;
      for (const [a, b] of traceLinks(f)) {
        const p = at(f.order[a]);
        const q = at(f.order[b]);
        if (!p || !q) continue;
        g.beginPath();
        g.moveTo(p.x, p.y);
        g.lineTo(q.x, q.y);
        g.stroke();
      }
      g.setLineDash([]);
    }
    const lw = figureWidth(L.u);
    // (a figure that draws itself looks as it will when it is done)
    g.strokeStyle = state.auto ? 'rgba(255, 211, 77, 0.55)' : '#ffd34d';
    g.lineWidth = lw;
    g.shadowColor = 'rgba(255, 211, 77, 0.8)';
    g.shadowBlur = state.auto ? 0 : lw * 2.5;
    for (const [ia, ib] of traceLinks(f)) {
      if (ia >= state.lit || ib >= state.lit) continue;
      const [s, e] = state.litAt[ia] <= state.litAt[ib] ? [ia, ib] : [ib, ia];
      const k = clamp((now - state.litAt[e]) / (state.auto ? AUTO_MS : LINE_MS), 0, 1);
      const p = at(f.order[s]);
      const q = at(f.order[e]);
      if (!p || !q) continue;
      g.beginPath();
      g.moveTo(p.x, p.y);
      g.lineTo(p.x + (q.x - p.x) * k, p.y + (q.y - p.y) * k);
      g.stroke();
    }
    g.shadowBlur = 0;
  }

  // the stars joined are golden and pop as they light up, the next one
  // pulses at the start and when nothing has happened for a while, and the
  // next two have their numbers
  function drawTraceStars(g, L, V, now, f) {
    // (a figure that draws itself is only its lines)
    if (state.auto) return;
    const pts = f.order.map((key) => place(V, STARS[key]));
    pts.forEach((q, i) => {
      if (!q || i >= state.lit) return;
      const k = clamp((now - state.litAt[i]) / 300, 0, 1);
      const r = Math.max(starR(STARS[f.order[i]].mag, L.u), starR(3.6, L.u)) * 1.3 * (1 + 0.7 * Math.sin(k * Math.PI));
      dot(g, q.x, q.y, r * 2.6, 'rgba(255, 211, 77, 0.3)');
      dot(g, q.x, q.y, r, '#ffe9a0');
    });
    const next = pts[state.lit];
    const hint = state.phase === 'task' && (state.lit === 0 || now - state.lastStep > HINT_MS || now < state.hintUntil);
    if (next && hint) {
      const k = (now % 1300) / 1300;
      g.strokeStyle = `rgba(95, 212, 255, ${(0.9 * (1 - k)).toFixed(2)})`;
      g.lineWidth = 3;
      g.beginPath();
      g.arc(next.x, next.y, 6 + L.hitR * 0.25 + L.hitR * 0.6 * k, 0, Math.PI * 2);
      g.stroke();
    }
    // the numbers beside the stars, on the side away from the other stars of
    // the figure and from the numbers placed already
    const fs = Math.round(clamp(L.u * 0.034, 13, 18));
    g.font = `900 ${fs}px Nunito, sans-serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.lineJoin = 'round';
    g.lineWidth = fs * 0.22;
    g.strokeStyle = 'rgba(5, 8, 30, 0.85)';
    const placed = [];
    pts.forEach((q, i) => {
      if (!q) return;
      const d = fs * 0.95;
      let best = null;
      let bestScore = -Infinity;
      for (let a = 0; a < 8; a++) {
        const x = q.x + Math.cos((a * Math.PI) / 4 - Math.PI / 4) * d;
        const y = q.y + Math.sin((a * Math.PI) / 4 - Math.PI / 4) * d;
        let score = Infinity;
        pts.forEach((o, j) => { if (o && j !== i) score = Math.min(score, Math.hypot(o.x - x, o.y - y)); });
        placed.forEach((o) => { score = Math.min(score, Math.hypot(o[0] - x, o[1] - y) * 0.8); });
        if (score > bestScore + 0.5) {
          bestScore = score;
          best = [x, y];
        }
      }
      placed.push(best);
      // only the next two stars have their numbers, so that the figure shows:
      // a joined star's number fades out, and the one after the next fades in
      const a = i < state.lit ? 1 - clamp((now - state.litAt[i]) / 600, 0, 1)
        : i === state.lit ? 1
          : i === state.lit + 1 ? clamp((now - state.lastStep) / 400, 0, 1) : 0;
      if (a <= 0) return;
      const keep = g.globalAlpha;
      g.globalAlpha = keep * a;
      g.fillStyle = i < state.lit ? 'rgb(255, 211, 77)' : '#ffffff';
      g.strokeText(String(i + 1), best[0], best[1]);
      g.fillText(String(i + 1), best[0], best[1]);
      g.globalAlpha = keep;
    });
    g.textBaseline = 'alphabetic';
  }

  // an arrow from the first star towards the second, from a quarter of the
  // way to two thirds, so that it shows the way without reaching the star
  function drawArrow(g, V, [a, b], pulse) {
    const H = hopPoints(STARS[a], STARS[b], 0);
    const p = place(V, H.at(H.gap * 0.25));
    const q = place(V, H.at(H.gap * 0.67));
    if (!p || !q) return;
    const ang = Math.atan2(q.y - p.y, q.x - p.x);
    const len = Math.hypot(q.x - p.x, q.y - p.y);
    const head = clamp(len * 0.25, 10, 18);
    g.save();
    g.strokeStyle = `rgba(95, 212, 255, ${(0.45 + 0.35 * pulse).toFixed(2)})`;
    g.lineWidth = 3;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(p.x, p.y);
    g.lineTo(q.x, q.y);
    g.moveTo(q.x - head * Math.cos(ang - 0.5), q.y - head * Math.sin(ang - 0.5));
    g.lineTo(q.x, q.y);
    g.lineTo(q.x - head * Math.cos(ang + 0.5), q.y - head * Math.sin(ang + 0.5));
    g.stroke();
    g.restore();
  }

  // A short curved arrow beside the stars to slide along, on the side the
  // arc bends to: bulging towards them as the arc does, it ends a little
  // past the last of them, pointing on the way the arc goes.
  function drawCurveArrow(g, L, V, k, pulse) {
    const at = (key) => place(V, STARS[key]);
    const A = at(k.along[0]);
    const C = at(k.along[k.along.length - 1]);
    if (!A || !C) return;
    const len = Math.hypot(C.x - A.x, C.y - A.y) || 1;
    const u = [(C.x - A.x) / len, (C.y - A.y) / len];
    // (on the side the arc bends to: where the star after them is, also
    // when it is below the horizon)
    let n = [-u[1], u[0]];
    const T = toScreen(V, horizon(STARS[k.curve[k.along.length]]));
    if (T && (T[0] - A.x) * n[0] + (T[1] - A.y) * n[1] < 0) n = [-n[0], -n[1]];
    const off = L.hitR * 0.8;
    const S = [A.x - u[0] * len * 0.1 + n[0] * off, A.y - u[1] * len * 0.1 + n[1] * off];
    const E = [C.x + u[0] * len * 0.5 + n[0] * off * 1.6, C.y + u[1] * len * 0.5 + n[1] * off * 1.6];
    const Q = [C.x + n[0] * off * 0.5, C.y + n[1] * off * 0.5];
    const ang = Math.atan2(E[1] - Q[1], E[0] - Q[0]);
    const head = 13;
    g.save();
    g.strokeStyle = `rgba(95, 212, 255, ${(0.45 + 0.35 * pulse).toFixed(2)})`;
    g.lineWidth = 3;
    g.lineCap = 'round';
    g.lineJoin = 'round';
    g.beginPath();
    g.moveTo(...S);
    g.quadraticCurveTo(...Q, ...E);
    g.moveTo(E[0] - head * Math.cos(ang - 0.5), E[1] - head * Math.sin(ang - 0.5));
    g.lineTo(...E);
    g.lineTo(E[0] - head * Math.cos(ang + 0.5), E[1] - head * Math.sin(ang + 0.5));
    g.stroke();
    g.restore();
  }

  // a circle round a figure: from its middle, a little wider than its stars
  function figCircle(V, id) {
    const ps = [...new Set(FIGURES[id].lines.flat())].map((k) => place(V, STARS[k])).filter(Boolean);
    if (!ps.length) return null;
    const xs = ps.map((q) => q.x);
    const ys = ps.map((q) => q.y);
    const c = { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
    return { c, R: Math.max(...ps.map((q) => Math.hypot(q.x - c.x, q.y - c.y))) + 12 };
  }

  // the guide stars pulse, and the star just found glows
  function drawMarks(g, L, V, now) {
    const pulse = 0.5 + 0.5 * Math.sin(now / 260);
    const ring = (key, color, r) => {
      const q = place(V, STARS[key]);
      if (!q) return;
      circle(q, color, r);
    };
    const circle = (q, color, r) => {
      g.strokeStyle = color;
      g.lineWidth = 2.5;
      g.beginPath();
      g.arc(q.x, q.y, r, 0, Math.PI * 2);
      g.stroke();
    };
    if (state.phase === 'task') {
      const hint = now < state.hintUntil;
      for (const key of guides()) ring(key, `rgba(95, 212, 255, ${(0.35 + 0.5 * pulse).toFixed(2)})`, starR(STARS[key].mag, L.u) + 6 + 4 * pulse);
      if (hint) {
        const k = task();
        const key = k.find;
        // (when any star of the figure counts, round the whole figure)
        const fc = k.accept && figCircle(V, k.figure);
        const color = `rgba(255, 211, 77, ${(0.5 + 0.5 * pulse).toFixed(2)})`;
        if (fc) circle(fc.c, color, fc.R + L.hitR * 0.2 * pulse);
        else if (key) ring(key, color, L.hitR * (0.5 + 0.2 * pulse));
      }
      if (state.sel) ring(state.sel, 'rgba(255, 211, 77, 0.95)', L.hitR * 0.5);
      if (task().arrow) drawArrow(g, V, task().arrow, pulse);
      if (task().curveArrow) drawCurveArrow(g, L, V, task(), pulse);
    }
    const f = state.flash;
    if (f) {
      // (a frame may be timed a little before the star was found)
      const e = Math.max(0, (now - f.t0) / 1500);
      const fc = f.fig && figCircle(V, f.fig);
      if (fc) {
        if (e < 1) circle(fc.c, `rgba(255, 211, 77, ${(1 - e).toFixed(2)})`, fc.R + L.hitR * 0.9 * (1 - e));
        else circle(fc.c, 'rgba(255, 211, 77, 0.8)', fc.R);
      } else if (e < 1) ring(f.key, `rgba(255, 211, 77, ${(1 - e).toFixed(2)})`, L.hitR * (0.4 + e * 0.9));
      else ring(f.key, 'rgba(255, 211, 77, 0.8)', L.hitR * 0.45);
    }
  }

  // the stars the task names (`names`, and the ones to start from), and the
  // ones found, get their names; the figures found get theirs below them
  function drawLabels(g, L, V, map) {
    const fs = map ? 26 : Math.round(clamp(L.u * 0.03, 12, 16));
    g.font = `800 ${fs}px Nunito, sans-serif`;
    g.lineJoin = 'round';
    // (none while a task with `noLabels` is on, so that its numbers show)
    if (!map && task() && task().noLabels && state.phase === 'task') return;
    const keys = new Set([...state.named, ...(level().names || [])]);
    if (!map && task()) {
      const k = task();
      // (the stars to start from while the task is on, and its `names` also after)
      // (and `namesAfter` only once it is done, so that they are not in the way)
      const ks = state.phase === 'task' ? [k.from, k.via, ...(k.along || []), ...(k.names || [])]
        : [...(k.names || []), ...(k.namesAfter || [])];
      ks.filter((x) => x && known(STARS[x])).forEach((x) => keys.add(x));
    }
    const boxes = [];
    const hits = (b) => boxes.some((o) => b.x < o.x + o.w && o.x < b.x + b.w && b.y < o.y + o.h && o.y < b.y + b.h);
    g.textAlign = 'center';
    for (const id of figsHidden(map) ? [] : state.figs) {
      if (onlyFigs(id, map)) continue;
      // (Suur Vanker's name only at the start, but all along with the slider
      // of how bright the sky is, where it is one of the figures to see)
      if (id === 'bigdipper' && !map && state.ti > 1 && task().kind !== 'slider') continue;
      if (!map && state.hideFig && state.hideFig.has(id)) continue;
      if (!map && state.day && id !== 'bigdipper') continue;
      if (figHidden(id, map)) continue;
      // (only the stars that show: in a bright sky a figure may have none)
      const pts = [...new Set(FIGURES[id].label || FIGURES[id].lines.flat())].filter((k) => map || state.day || shown(STARS[k]))
        .map((k) => place(V, STARS[k])).filter(Boolean);
      if (!pts.length) continue;
      const xs = pts.map((q) => q.x);
      const txt = FIGURES[id].name[Astro.lang];
      const w = g.measureText(txt).width;
      // (inside the screen; with `labelMid`, in the middle of its stars, as
      // inside the Winter Triangle, rather than below them)
      const mid = FIGURES[id].labelMid;
      let x = clamp(mid ? xs.reduce((a, b) => a + b, 0) / xs.length : (Math.min(...xs) + Math.max(...xs)) / 2, w / 2 + 4, L.W - w / 2 - 4);
      let y = mid ? pts.reduce((a, q) => a + q.y, 0) / pts.length + fs * 0.35 : Math.max(...pts.map((q) => q.y)) + fs + 8;
      // (with `labelBeside`, to the right of the figure, just below that
      // star, as Veomees below Kapella)
      const by = FIGURES[id].labelBeside && place(V, STARS[FIGURES[id].labelBeside]);
      if (by) {
        x = clamp(Math.max(...xs) + w / 2 + 8, w / 2 + 4, L.W - w / 2 - 4);
        y = by.y + fs + 6;
      }
      // (below the name of another figure, if they would overlap)
      for (let n = 0; n < 4 && hits({ x: x - w / 2, y: y - fs * 0.85, w, h: fs }); n++) y += fs + 2;
      boxes.push({ x: x - w / 2, y: y - fs * 0.85, w, h: fs });
      g.strokeStyle = 'rgba(4, 8, 32, 0.85)';
      g.lineWidth = 4;
      g.strokeText(txt, x, y);
      g.fillStyle = 'rgba(200, 220, 255, 0.75)';
      g.fillText(txt, x, y);
    }
    // each name beside its star, on the first side where it does not cover
    // another name, the brightest stars first
    g.textAlign = 'left';
    for (const key of [...keys].sort((a, b) => STARS[a].mag - STARS[b].mag)) {
      const s = STARS[key];
      const q = place(V, s);
      if (!q || (!map && !shown(s))) continue;
      const r = starR(s.mag, L.u) + 5;
      const txt = nameOf(s.name);
      const w = g.measureText(txt).width;
      const tries = [[q.x + r, q.y - r - fs * 0.2], [q.x + r, q.y + r + fs * 0.8], [q.x - r - w, q.y - r - fs * 0.2], [q.x - r - w, q.y + r + fs * 0.8]];
      const box = (xy) => ({ x: xy[0], y: xy[1] - fs * 0.85, w, h: fs });
      const inside = (p) => p[0] >= 2 && p[0] + w <= L.W - 2;
      const xy = tries.find((p) => inside(p) && !hits(box(p))) || tries.find(inside) || tries[0];
      boxes.push(box(xy));
      g.strokeStyle = 'rgba(4, 8, 32, 0.85)';
      g.lineWidth = 4;
      g.strokeText(txt, xy[0], xy[1]);
      g.fillStyle = state.named.has(key) ? '#ffe9a0' : '#bfe6ff';
      g.fillText(txt, xy[0], xy[1]);
    }
  }

  // the ground below the horizon, with spruces along it and the directions
  // the Sun, when it is up: much bigger than it looks, with a glow round
  // it, and behind the trees when it is low
  function drawSun(g, L, V) {
    const q = toScreen(V, horizon(sun(state.when)));
    if (!q) return;
    const r = L.hitR * 0.55;
    const glow = g.createRadialGradient(q[0], q[1], r * 0.8, q[0], q[1], r * 4);
    glow.addColorStop(0, 'rgba(255, 245, 200, 0.7)');
    glow.addColorStop(1, 'rgba(255, 245, 200, 0)');
    g.fillStyle = glow;
    g.fillRect(q[0] - r * 4, q[1] - r * 4, r * 8, r * 8);
    dot(g, q[0], q[1], r, '#fff6c8');
  }

  function drawGround(g, L, V) {
    const ink = '#03050f';
    // The horizon is a circle in this projection, with the sky inside it:
    // the ground is everything outside it. Points behind the viewer are
    // projected too, far off the screen, so that the circle is whole.
    const far = (v) => {
      const d = Math.max(dotv(v, V.fwd), -0.97);
      const k = 2 / (1 + d);
      return [V.cx + k * dotv(v, V.right) * V.s, V.cy - k * dotv(v, V.up) * V.s];
    };
    g.fillStyle = ink;
    g.beginPath();
    g.rect(-10, -10, L.W + 20, L.H + 20);
    for (let az = 0; az <= 360; az += 1) {
      const p = far(dirOf(az, 0));
      if (az === 0) g.moveTo(...p);
      else g.lineTo(...p);
    }
    g.closePath();
    g.fill('evenodd');
    for (const tr of TREES) {
      const b = toScreen(V, dirOf(tr.az, -0.3));
      const t2 = toScreen(V, dirOf(tr.az, tr.h));
      if (!b || !t2 || b[0] < -60 || b[0] > L.W + 60) continue;
      const dx = t2[0] - b[0];
      const dy = t2[1] - b[1];
      const h = Math.hypot(dx, dy);
      if (h < 2) continue;
      const ux = dx / h;
      const uy = dy / h;
      const w = h * 0.36;
      const at = (along, side) => [b[0] + ux * along + uy * -side, b[1] + uy * along + ux * side];
      g.beginPath();
      g.moveTo(...at(h, 0));
      for (let k = 1; k <= 4; k++) {
        g.lineTo(...at(h - (h * k) / 4.3, (w * k) / 4));
        g.lineTo(...at(h - (h * k) / 4.3, (w * k) / 8));
      }
      g.lineTo(...at(0, w * 0.1));
      g.lineTo(...at(0, -w * 0.1));
      for (let k = 4; k >= 1; k--) {
        g.lineTo(...at(h - (h * k) / 4.3, -(w * k) / 8));
        g.lineTo(...at(h - (h * k) / 4.3, -(w * k) / 4));
      }
      g.closePath();
      g.fill();
    }
    const fs = L.map ? 22 : Math.round(clamp(L.u * 0.028, 12, 15));
    g.font = `800 ${fs}px Nunito, sans-serif`;
    g.textAlign = 'center';
    g.fillStyle = 'rgba(190, 205, 255, 0.7)';
    for (const [az, txt] of Object.entries(t('dirs'))) {
      const q = toScreen(V, dirOf(+az, -2.5));
      if (q && q[0] > fs * 2.5 && q[0] < L.W - fs * 2.5 && q[1] < L.H - 4) g.fillText(txt, q[0], q[1] + fs * 0.4);
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const L = state.L;
    if (!L || !state.cam) return;
    stepTurn(now);
    stepPan(now);
    stepLight(now);
    // the stars fade in and out as the sky gets darker or lighter
    state.limit += (state.limitTo - state.limit) * clamp((now - (state.lastFrame || now)) / 250, 0, 1);
    state.lastFrame = now;
    if (state.photo && state.photo.out && now - state.photo.out > 1000) state.photo = null;
    g0(now);
    // the 👆 shows where to start, when nothing has happened for a while
    // only in the first task, until its line is drawn: later the pulsing
    // stars show where to start
    const idle = state.level === 0 && state.ti === 0 && state.phase === 'task' && !state.drag && !state.pan && now - state.lastAct > 7000 && !lineDrawn();
    const at = idle ? idleSpot() : null;
    fingerEl.classList.toggle('hidden', !at);
    if (at) Object.assign(fingerEl.style, { left: at.x - 16 + 'px', top: at.y + 4 + 'px' });
  }

  function g0(now) {
    const L = state.L;
    const V = view();
    ctx.clearRect(0, 0, L.W, L.H);
    render(ctx, L, V, now);
    const d = state.drag;
    if (d && d.mode === 'hop' && d.a) {
      const a = place(V, d.a);
      if (a) {
        g0line(a, d.last);
      }
    }
  }

  // the line being dragged, from the first star to the finger
  function g0line(a, p) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // ---------------------------------------------------------------------------
  // Tasks
  // ---------------------------------------------------------------------------

  // the stars that pulse on this level, to show where to start
  function guides() {
    const k = task();
    if (!k || state.phase !== 'task' || level().help === false) return [];
    if (k.kind === 'hop' || k.kind === 'part') return [k.from, k.via];
    if (k.kind === 'arc') return k.along;
    if (k.kind === 'tap') return k.near;
    return [];
  }

  // where the 👆 points when nothing happens
  function idleSpot() {
    const k = task();
    const V = view();
    // (a figure to draw has its next star pulsing instead)
    const key = k.kind === 'trace' ? null : k.from || (k.along && k.along[0]) || (k.near && k.near[0]);
    return key ? place(V, STARS[key]) : null;
  }

  // the date and hour of the sky; while it turns, the date or the hour it
  // has got to
  // Summer time, from 01:00 UT on the last Sunday of March to 01:00 UT on
  // the last Sunday of October, as in the European Union
  function summerTime(ms) {
    const y = new Date(ms).getUTCFullYear();
    const lastSunday = (m) => {
      const d = new Date(Date.UTC(y, m + 1, 0, 1));
      return d.getTime() - d.getUTCDay() * 86400000;
    };
    return ms >= lastSunday(2) && ms < lastSunday(9);
  }

  // a caption on the clock of winter time, with the hour of summer time
  // after it in brackets when summer time is on, as "kell 20 (suveaja
  // järgi kell 21)"; with `minutes`, also on the full hour
  function withSummer(text, ms, minutes = false) {
    if (!summerTime(ms)) return text;
    const d = new Date(ms + (TZ + 1) * 3600000);
    const mm = d.getUTCMinutes();
    return text + t('summer')(d.getUTCHours(), mm || minutes ? mm : null);
  }

  function caption() {
    const T = state.turn;
    if (!T) {
      const k = task();
      return withSummer(((k && k.caption) || state.caption)[Astro.lang], state.when, k && k.kind === 'explore');
    }
    const e = clamp((performance.now() - T.t0) / T.dur, 0, 1);
    const ms = T.ms0 + (T.ms1 - T.ms0) * e;
    const d = new Date(ms + T.tz * 3600000);
    if (T.ms1 - T.ms0 < 2 * 86400000) return t('clock')(d.getUTCHours());
    return t('date')(d.getUTCDate(), t('months')[d.getUTCMonth()]);
  }

  function showTask() {
    const k = task();
    if (k && k.kind === 'explore') {
      showExplore();
      return;
    }
    const box = $('task');
    box.classList.remove('fact');
    $('when').textContent = caption();
    $('taskName').textContent = '';
    $('taskText').textContent = k && k.text ? k.text[Astro.lang] : '';
    $('tip').textContent = '';
    $('photoCredit').classList.add('hidden');
    $('nextBtn').classList.add('hidden');
    $('sliderDone').textContent = t('finish');
    updateBar();
  }

  function showFact() {
    const k = task();
    const box = $('task');
    box.classList.add('fact');
    // a star with a name used in Estonia, or else its figure
    const name = k.find && known(STARS[k.find]) ? nameOf(STARS[k.find].name) : k.figure && FIGURES[k.figure].name[Astro.lang];
    $('taskName').textContent = k.title ? k.title[Astro.lang] : t('found')(name);
    // (a task without a fact shows only what was found)
    $('taskText').textContent = k.fact ? k.fact[Astro.lang] : '';
    $('tip').textContent = '';
    const last = state.ti === state.tasks.length - 1;
    $('nextBtn').textContent = last ? t('finish') : t('next');
    $('nextBtn').classList.remove('hidden');
    if (state.photo && !state.photo.out) photoText();
    updateBar();
  }

  // A photo of the spot just found: the view zooms in on it, and the photo
  // fades in over the stars, lined up with them, with its credit and what
  // the eye sees there; after a while, or on a tap, it fades back to the
  // star dots and the view zooms out again.
  const ZOOM_MS = 1800;
  const PHOTO_MS = 9000;
  function showPhoto(id) {
    const ph = { id, at: performance.now() + ZOOM_MS, out: null };
    state.photo = ph;
    // (the card first, so that the view leaves room for it)
    photoText();
    relayoutTop();
    panTo(photoCam(id), ZOOM_MS);
    later(ZOOM_MS + PHOTO_MS, () => { if (state.photo === ph) hidePhoto(); });
  }

  function hidePhoto(fast = false) {
    const ph = state.photo;
    if (!ph || ph.out) return;
    ph.out = performance.now();
    ph.fast = fast;
    $('tip').textContent = '';
    $('photoCredit').classList.add('hidden');
    if (fast) return;
    const ti = state.ti;
    later(700, () => {
      if (state.ti !== ti || state.phase !== 'fact') return;
      relayoutTop();
      panTo(taskView(), ZOOM_MS);
    });
  }

  // a tap on the sky while a fact is shown hides the photo, or shows it again
  function togglePhoto() {
    const k = task();
    if (state.photo && !state.photo.out) hidePhoto();
    else if (!state.photo && k.photo) showPhoto(k.photo);
  }

  function photoText() {
    const P = PHOTOS[state.photo.id];
    $('tip').textContent = P.eye ? P.eye[Astro.lang] : '';
    $('photoCredit').textContent = '📷 ' + t('photo');
    $('photoCredit').href = 'https://www.astrobin.com/' + P.astrobin + '/';
    $('photoCredit').classList.remove('hidden');
  }

  function updateBar() {
    const n = state.tasks.length;
    const k = state.ti + (state.phase === 'fact' || state.phase === 'wait' ? 1 : 0);
    $('fill').style.width = (100 * k) / n + '%';
    $('count').textContent = `${k} / ${n}`;
  }

  function relayoutTop() {
    if (!state.L) return;
    state.L.top = cardRoom();
    state.L.bottom = bottomRoom();
  }

  // The room for the card at the top. On a level that looks at the horizon,
  // it is the same for all the tasks of a sky, the most any of their texts
  // and facts needs, so that the view does not move from one task to the
  // next; it is measured when the sky turns, and when the screen changes.
  function cardRoom() {
    if (!(level().look || level().steady) || state.phase === 'menu') return $('task').offsetHeight + 12;
    if (!state.skyTop || state.skyTopW !== area.clientWidth) measureSky();
    return state.skyTop;
  }

  function measureSky() {
    const ids = ['when', 'taskName', 'taskText', 'tip', 'nextBtn'];
    const keep = ids.map((id) => [$(id).textContent, $(id).className]);
    const box = $('task');
    const fact = box.classList.contains('fact');
    const ti = state.ti;
    const ts = state.tasks;
    let i = ti;
    while (i > 0 && !ts[i].when) i--;
    let h = 0;
    for (let j = i; j < ts.length && (j === i || !ts[j].when); j++) {
      state.ti = j;
      // (the caption of the sky the task is in)
      $('when').textContent = withSummer((ts[i].caption || level().caption)[Astro.lang], ts[i].when || level().when);
      if (ts[j].text) {
        box.classList.remove('fact');
        $('taskName').textContent = '';
        $('taskText').textContent = ts[j].text[Astro.lang];
        $('nextBtn').classList.add('hidden');
        h = Math.max(h, box.offsetHeight);
      }
      if (ts[j].fact) {
        showFact();
        h = Math.max(h, box.offsetHeight);
      }
    }
    state.ti = ti;
    ids.forEach((id, n) => {
      $(id).textContent = keep[n][0];
      $(id).className = keep[n][1];
    });
    box.classList.toggle('fact', fact);
    updateBar();
    state.skyTop = h + 12;
    state.skyTopW = area.clientWidth;
  }

  // the sliders at the bottom are kept clear too
  function bottomRoom() {
    const el = ['explore', 'slider'].map($).find((e) => !e.classList.contains('hidden'));
    return el ? el.offsetHeight + 24 : 16;
  }

  // the view for the current task, or for all of them on a level without
  // moving views
  function taskView() {
    if (task() && (task().kind === 'explore' || task().wide) && level().center) return ringView(level().center);
    if (level().look) return fitView(skyKeys());
    if (!level().fixedView) return fitView(viewKeys());
    const keys = state.tasks.flatMap((k) => [k.from, k.via, k.find, ...(k.along || []), ...(k.accept || [])]).filter(Boolean);
    return fitView([...keys, ...DIPPER], state.L, 70, null);
  }

  function startTask() {
    const k = task();
    state.limitTo = k.limit || level().limit;
    // (with `jump`, the sky is at the task's date and hour at once)
    const jump = k.jump && k.when && k.when !== state.when;
    if (jump) {
      state.th = siderealTime(k.when);
      state.when = k.when;
      state.tz = TZ;
      state.caption = k.caption;
      state.flash = null;
      state.skyTop = 0;
    }
    const turning = k.when && k.when !== state.when;
    // (just after the sky has turned, or jumped)
    const turned = state.phase === 'turn' || jump;
    // the slider of how bright the sky is starts at the bright end, or to
    // play with, at the dark end, with the button to finish beside it;
    // after a turn it waits, keeping its room, until the sky has turned and
    // its light has changed to the new date and hour
    $('slider').classList.toggle('hidden', k.kind !== 'slider');
    $('slider').classList.toggle('waiting', k.kind === 'slider' && (turning || turned));
    $('slider').classList.toggle('free', !!k.free);
    $('skyRange').value = k.free ? 100 : 0;
    if (turning) {
      turnTo(k);
      return;
    }
    state.skyLimit = k.free ? SKY_DARK : SKY_BRIGHT;
    state.skyStep = 0;
    state.phase = 'task';
    state.auto = null;
    (k.given || []).forEach((f) => state.figs.add(f));
    // the names of Põhjanael and Väike Vanker hidden, to be found again
    state.hideFig = new Set(k.hideNames ? ['littledipper'] : []);
    if (k.hideNames) {
      state.named.delete('polaris');
      state.figs.delete('littledipper');
    }
    state.auto = null;
    $('explore').classList.toggle('hidden', k.kind !== 'explore');
    skyLight(turned);
    if (k.kind === 'explore') startExplore();
    state.sel = null;
    state.lit = 0;
    state.doneAt = 0;
    state.litAt = [];
    state.hintUntil = 0;
    state.lastAct = performance.now();
    state.lastStep = performance.now();
    showTask();
    // (a text only to read: straight to it, with the button; with a photo,
    // its text while the view goes there, and its fact with the photo)
    if (k.kind === 'note') {
      state.phase = 'fact';
      state.noteAt = performance.now();
      if (!k.photo) showFact();
      else {
        const ti = state.ti;
        later(1400, () => {
          if (state.ti !== ti) return;
          showFact();
          relayoutTop();
          if (!state.photo) showPhoto(k.photo);
        });
      }
    }
    relayoutTop();
    panTo(taskView());
    if (jump) {
      state.pan = null;
      state.cam = taskView();
    }
  }

  // The sky turns forwards round Põhjanael to the task's date and hour,
  // while the caption counts the months or the hours; then the task starts.
  function turnTo(k) {
    const th1 = siderealTime(k.when);
    const d = (((th1 - state.th) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    // (slowly enough to follow the stars as they go round: about 6.5 s for a
    // quarter of a circle)
    const dur = 3500 + 6000 * (d / Math.PI);
    state.turn = { th0: state.th, th1: state.th + d, ms0: state.when, ms1: k.when, tz: TZ, t0: performance.now(), dur };
    state.phase = 'turn';
    state.flash = null;
    // Väike Vanker is drawn again once Põhjanael is found
    if (k.hideNames) {
      state.figs.delete('littledipper');
      state.auto = null;
    }
    // on a level that looks at the horizon, the stars are found again in the
    // new sky: their names and figures go while it turns
    if (level().look) {
      state.figs = new Set(level().figs || ['bigdipper']);
      state.named = new Set();
    }
    // the view for the task, worked out for the sky as it will be
    const th = state.th;
    state.th = th1;
    // (on a level with a centre, the wide view round it while the sky turns,
    // and the task's own view comes after; on a level that looks at the
    // horizon, the turn ends on the view of the new sky, with the room for its
    // cards, so that the view stays put when the task starts)
    if (level().look || level().steady) {
      state.skyTop = 0;
      relayoutTop();
    }
    const cam = level().center ? ringView(level().center) : taskView();
    state.th = th;
    $('taskText').textContent = '';
    $('taskName').textContent = '';
    $('tip').textContent = '';
    $('nextBtn').classList.add('hidden');
    $('when').textContent = caption();
    state.pan = { from: { ...state.cam }, to: cam, t0: performance.now(), dur, forward: true };
    sfx.pick();
  }

  function stepTurn(now) {
    const T = state.turn;
    if (!T) return;
    const p = clamp((now - T.t0) / T.dur, 0, 1);
    const e = p * p * (3 - 2 * p);
    state.th = T.th0 + (T.th1 - T.th0) * e;
    $('when').textContent = caption();
    if (p >= 1) {
      state.th = T.th1 % (2 * Math.PI);
      state.when = T.ms1;
      state.tz = T.tz;
      state.caption = task().caption;
      state.turn = null;
      startTask();
    }
  }

  // The player's own date and hour: the evening's date over the year 2027,
  // and the time from 18:00 to 06:00 on the clock, by the minute.
  function exploreTime() {
    const day = +$('dayRange').value;
    const h = 18 + (+$('hourRange').value) / 60;
    return { ms: Date.UTC(2027, 0, 1 + day) + (h - TZ) * 3600000, tz: TZ };
  }

  function startExplore() {
    // the sliders start where the sky is now
    const local = new Date(state.when + state.tz * 3600000);
    let h = local.getUTCHours() + local.getUTCMinutes() / 60;
    let day = Math.round((Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - Date.UTC(2027, 0, 1)) / 86400000);
    if (h < 12) {
      h += 24;
      day -= 1;
    }
    $('dayRange').value = clamp(day, 0, 364);
    $('hourRange').value = clamp(Math.round((h - 18) * 60), 0, 720);
    explore();
  }

  // the sky at the sliders' date and hour, lighter when the Sun is not far
  // below the horizon
  function explore() {
    const { ms, tz } = exploreTime();
    state.when = ms;
    state.tz = tz;
    state.th = siderealTime(ms);
    skyLight();
    const local = new Date(ms + tz * 3600000);
    const mm = local.getUTCMinutes();
    // midnight with the evening's date, as "15. juuli, kesköö"
    const midnight = local.getUTCHours() === 0 && mm === 0;
    const eve = new Date(ms + tz * 3600000 - 86400000);
    state.caption = {};
    for (const lang of ['et', 'en']) {
      const T = TEXT[lang];
      state.caption[lang] = midnight
        ? T.midnight(eve.getUTCDate(), T.months[eve.getUTCMonth()])
        : T.dateTime(local.getUTCDate(), T.months[local.getUTCMonth()], local.getUTCHours(), mm);
    }
    // the view stays on Põhjanael
    if (state.L) state.cam = taskView();
    showExplore();
  }

  function showExplore() {
    const k = task();
    $('task').classList.remove('fact');
    $('when').textContent = caption();
    $('taskName').textContent = '';
    $('taskText').textContent = k.text[Astro.lang];
    $('tip').textContent = state.day ? t('daySky') : state.light > 0.5 ? t('lightSky') : '';
    // the button to finish is beside the sliders, so that the card is low
    $('nextBtn').classList.add('hidden');
    $('exploreDone').textContent = t('finish');
    updateBar();
  }

  // how light the sky is at its date and hour: the stars fade in twilight,
  // and none show when the Sun is up
  // With `slow`, after the sky has turned, the twilight changes smoothly to
  // the new date and hour, and then the slider shows.
  function skyLight(slow = false) {
    const sunAlt = Math.asin(horizon(sun(state.when))[2]) / DEG;
    const light = clamp((sunAlt + 18) / 18, 0, 1);
    state.day = sunAlt > -0.8;
    // (the slider adds the light of the Moon and of the lights round, and
    // the twilight comes on top of it)
    state.skyBase = task().kind === 'slider' ? state.skyLimit : task().limit || level().limit;
    state.ramp = slow && Math.abs(light - (state.light || 0)) > 0.01
      ? { from: state.light || 0, to: light, t0: performance.now(), dur: 1500 } : null;
    if (!state.ramp) {
      state.light = light;
      $('slider').classList.remove('waiting');
    }
    limitFromLight();
  }

  function limitFromLight() {
    state.limitTo = state.skyBase - 3.5 * state.light;
    // (with the slider, Põhjanael and the brightest stars always show, also
    // at the full Moon on a light summer night, so that the sky is not empty)
    if (task().kind === 'slider') state.limitTo = Math.max(state.limitTo, 1.6);
  }

  function stepLight(now) {
    const R = state.ramp;
    if (!R) return;
    const p = clamp((now - R.t0) / R.dur, 0, 1);
    state.light = R.from + (R.to - R.from) * p * p * (3 - 2 * p);
    limitFromLight();
    if (p >= 1) {
      state.ramp = null;
      $('slider').classList.remove('waiting');
    }
  }

  // where the Sun is at a time (ms, UT): accurate to about a degree
  function sun(ms) {
    const n = (ms - Date.UTC(2000, 0, 1, 12)) / 86400000;
    const g = (357.528 + 0.9856003 * n) * DEG;
    const l = (280.46 + 0.9856474 * n) * DEG + (1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * DEG;
    const e = 23.439 * DEG;
    return sphere(Math.atan2(Math.cos(e) * Math.sin(l), Math.cos(l)) / DEG, Math.asin(Math.sin(e) * Math.sin(l)) / DEG);
  }

  // A dark night of 2027 picked at random, an hour from 20:00 to 03:00 on the
  // clock with the Sun at least 15° below the horizon (so not in June and
  // July), and the tasks of the level's pool whose stars are up then.
  // (Not only nights when all of them are up: on a dark night with
  // Arktuurus up, Suur Vanker is always high. Põhjanael and Väike Vanker
  // never set, so they are asked every night. Half of the nights are ones
  // with all of them up.)
  function randomNight(lv) {
    const all = Math.random() < 0.5;
    for (let tries = 0; ; tries++) {
      const day = Math.floor(Math.random() * 365);
      // (not midnight, which would read "kell 0")
      const hour = [20, 21, 22, 23, 25, 26, 27][Math.floor(Math.random() * 7)];
      const tz = TZ;
      const ms = Date.UTC(2027, 0, 1 + day, hour - tz);
      const th = siderealTime(ms);
      if (horizon(sun(ms), th)[2] > Math.sin(-15 * DEG) && tries < 500) continue;
      const alt = (key) => Math.asin(horizon(STARS[key], th)[2]) / DEG;
      const tasks = lv.pool.filter((k) => (k.up || []).every((key) => alt(key) >= 10));
      if (all && tasks.length < lv.pool.length && tries < 500) continue;
      const d = new Date(ms + tz * 3600000);
      const caption = {};
      for (const lang of ['et', 'en']) {
        const T = TEXT[lang];
        caption[lang] = T.night(T.seasons[d.getUTCMonth()], hour < 24, d.getUTCDate(), T.months[d.getUTCMonth()], d.getUTCHours());
      }
      return { ms, tz, caption, tasks };
    }
  }

  function startGame() {
    state.gen++;
    state.ti = 0;
    state.lines = [];
    state.figs = new Set(level().figs || ['bigdipper']);
    state.named = new Set();
    state.flash = null;
    state.photo = null;
    state.cam = null;
    state.pan = null;
    let when = level().when;
    state.caption = level().caption;
    state.tasks = level().tasks;
    if (level().random) {
      const night = randomNight(level());
      when = night.ms;
      state.caption = night.caption;
      state.tasks = night.tasks;
    }
    state.th = siderealTime(when);
    state.when = when;
    state.turn = null;
    state.limit = state.limitTo = level().limit;
    state.skyTop = 0;
    $('menu').classList.add('hidden');
    $('win').classList.add('hidden');
    $('photoBox').classList.add('hidden');
    $('game').classList.remove('hidden');
    updateSound();
    showTask();
    layout();
    startTask();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  // the faintest stars shown at the two ends of the slider of how bright the
  // sky is: with only three stars of Väike Vanker, and all of them
  const SKY_BRIGHT = 2.5;
  const SKY_DARK = 6;

  // A figure that draws itself, quietly, as one line growing smoothly from
  // its first star: each line grows for as long as the next one waits.
  const AUTO_MS = 330;
  function autoDraw(id) {
    const f = FIGURES[id];
    state.figs.delete(id);
    state.auto = f;
    state.lit = 0;
    state.litAt = [];
    const t0 = performance.now() + 400;
    f.order.forEach((key, i) => {
      state.litAt[i] = t0 + i * AUTO_MS;
    });
    state.lit = f.order.length;
    // (not if the player has gone on to the next task meanwhile)
    const ti = state.ti;
    later(400 + f.order.length * AUTO_MS + 200, () => {
      if (state.ti !== ti) return;
      state.figs.add(id);
      state.auto = null;
    });
  }

  // the task is done: the star gets its name and the figure is drawn in
  function solve() {
    const k = task();
    const key = k.kind === 'trace' ? null : k.find;
    if (key) {
      if (known(STARS[key])) state.named.add(key);
      // (and the other stars that count, if they have names, as Kastor)
      (k.accept || []).filter((x) => known(STARS[x])).forEach((x) => state.named.add(x));
      // (when any star of the figure counts, such as Põhjakroon, the ring
      // goes round the whole figure)
      state.flash = { key, t0: performance.now(), fig: k.accept ? k.figure : null };
    }
    if (k.figure) state.figs.add(k.figure);
    // the way to it stays on the map, also when the star was tapped
    // straight away
    taskLine();
    state.lines.forEach((l) => { if (!l.keep) l.t0 = Math.min(l.t0, performance.now() - 6000); });
    state.phase = 'fact';
    state.factAt = performance.now();
    state.sel = null;
    // (the slider is done with, and leaves room for the view, or on a
    // steady level only goes out of sight)
    $('slider').classList.add(level().steady ? 'waiting' : 'hidden');
    sfx.snap();
    later(200, () => sfx.note(state.ti + 2));
    showFact();
    relayoutTop();
    if (k.autoDraw) {
      state.hideFig = new Set();
      const ti = state.ti;
      later(400, () => {
        if (state.ti !== ti) return;
        // (the ring round the stars found, as Kastor and Polluks, goes as
        // their whole figure draws itself)
        if (state.flash && state.flash.fig) state.flash = null;
        autoDraw(k.autoDraw);
      });
    }
    // the view takes in the figure just drawn (a wide view, and the one
    // view of a sky on a level that looks at the horizon, stay as they are)
    if (!k.wide && !level().look) panTo(taskView());
    if (k.photo) {
      const ti = state.ti;
      later(1300, () => { if (state.ti === ti && state.phase === 'fact' && !state.photo) showPhoto(k.photo); });
    }
  }

  function nextTask() {
    sfx.pick();
    if (state.ti === state.tasks.length - 1) {
      win();
      return;
    }
    hidePhoto(true);
    if (task().figureOnce) state.figs.delete(task().figure);
    state.ti++;
    state.flash = null;
    startTask();
  }

  // the line of a task that is only to draw it: once it has grown, the
  // next task starts
  function lineDone(l) {
    state.phase = 'wait';
    state.sel = null;
    $('tip').textContent = t('seeLine');
    updateBar();
    later(l.dur + 600, () => {
      if (task().fact) solve();
      else {
        state.ti++;
        startTask();
      }
    });
  }

  // a wrong star wiggles and says its name
  function wrong(s) {
    state.wiggle = { star: s, t0: performance.now() };
    const fig = s.key && Object.values(FIGURES).find((f) => f.lines.flat().includes(s.key));
    $('tip').textContent = known(s) ? t('isThis')(nameOf(s.name)) : fig ? t('inFigure')(fig.where[Astro.lang]) : t('notThis');
    sfx.oops();
  }

  // In a figure to draw, a tap on the next star joins it, and so does
  // sliding a finger onto it; the next star wins if it is within reach, even
  // when another star is a little closer. Only a tap on a star of the figure
  // out of turn is answered, with a wiggle and a soft sound.
  function touchStar(p, tap) {
    const f = traceOf(task());
    const next = place(view(), STARS[f.order[state.lit]]);
    if (next && Math.hypot(p.x - next.x, p.y - next.y) < state.L.hitR) {
      joinNext();
      return;
    }
    if (!tap) return;
    const s = pick(p);
    if (s && f.order.indexOf(s.key) > state.lit) {
      state.wiggle = { star: s, t0: performance.now() };
      sfx.oops();
    }
  }

  function joinNext() {
    const now = performance.now();
    const f = traceOf(task());
    state.litAt[state.lit] = now;
    sfx.note(state.lit);
    state.lit++;
    state.lastStep = now;
    state.wiggle = null;
    if (state.lit === f.order.length) {
      state.doneAt = now;
      solve();
    }
  }

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------

  function pointAt(e) {
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // The star a finger is on: the brightest near it, not the nearest, so that
  // a faint star beside the one aimed at does not get in the way.
  function pick(p, R = state.L.hitR, but = null) {
    const V = view();
    let best = null;
    let score = Infinity;
    for (const s of ALL) {
      if (s === but || !shown(s)) continue;
      const q = place(V, s);
      if (!q) continue;
      const d = Math.hypot(q.x - p.x, q.y - p.y);
      if (d > R) continue;
      const sc = s.mag + (2 * d) / R;
      if (sc < score) {
        score = sc;
        best = s;
      }
    }
    return best;
  }

  // the first star that a drag from star a passed, after it left a; a
  // guide star of the task is caught from a little further away
  function firstPassed(a, path) {
    const V = view();
    const pa = place(V, a);
    const R = state.L.hitR;
    const k = task();
    // (from the belt, its other stars are not the second star: the drag
    // did not go along it, or it would have snapped onto it)
    const skip = BELT.includes(a.key) ? BELT : [];
    const want = [k.via, ...(k.along || [])].filter((x) => x && x !== a.key && !skip.includes(x)).map((x) => STARS[x]);
    const i0 = path.findIndex((p) => !pa || Math.hypot(p.x - pa.x, p.y - pa.y) > R * 0.8);
    if (i0 < 0) return null;
    const rest = path.slice(i0);
    // a guide star anywhere along the drag, also past the star to find
    for (const p of rest) {
      for (const w of want) {
        const q = place(V, w);
        if (q && Math.hypot(q.x - p.x, q.y - p.y) < R * 1.1) return w;
      }
    }
    for (const p of rest) {
      const s = pick(p, R * 0.7, a);
      if (s && s.mag < 4.5 && !skip.includes(s.key)) return s;
    }
    return null;
  }

  // A drag from a star of Orion's belt along it, either way, snaps onto the
  // whole belt, from the end it starts at: its stars are too close together
  // to drag through one by one. The way along it is the way from the star
  // to where the finger is let go, within 20°.
  function beltWay(a, path) {
    const V = view();
    const m = place(V, STARS.mintaka);
    const n = place(V, STARS.alnitak);
    const p = place(V, a);
    const q = path[path.length - 1];
    if (!m || !n || !p || !q) return null;
    const dx = q.x - p.x;
    const dy = q.y - p.y;
    const bx = n.x - m.x;
    const by = n.y - m.y;
    const d = Math.hypot(dx, dy);
    const cos = (dx * bx + dy * by) / (d * Math.hypot(bx, by) || 1);
    if (d < 4 || Math.abs(cos) < 0.94) return null;
    return cos > 0 ? ['mintaka', 'alnitak'] : ['alnitak', 'mintaka'];
  }

  // a drag from one star through another draws the line it makes
  function endHop(a, path) {
    const belt = BELT.includes(a.key) && beltWay(a, path);
    let b;
    if (belt) [a, b] = belt.map((x) => STARS[x]);
    else b = firstPassed(a, path);
    if (!b) return;
    const k = task();
    const is = (x, y) => (a.key === x && b.key === y);
    let kind = 'hop';
    if (k.kind === 'part' && (is(k.from, k.via) || is(k.via, k.from))) kind = 'part';
    if (k.kind === 'arc' && k.along.includes(a.key) && k.along.indexOf(b.key) > k.along.indexOf(a.key)) kind = 'arc';
    const keep = (kind === 'arc') || (kind === 'part') || (k.kind === 'hop' && is(k.from, k.via));
    const same = (l) => l.keep && l.task === state.ti && l.kind === kind && (kind === 'arc' || (l.a === a.key && l.b === b.key));
    // drawn already: drawn again, growing
    if (keep) state.lines = state.lines.filter((l) => !same(l));
    if (kind === 'arc') {
      const l = addLine('arc', STARS[k.along[0]], STARS[k.along[1]], true);
      if (!k.find) lineDone(l);
    } else {
      const l = addLine(kind, a, b, keep);
      if (keep && k.kind === 'hop' && !k.find) lineDone(l);
    }
    sfx.snap();
  }

  function tap(p) {
    const s = pick(p);
    if (!s) return;
    const k = task();
    if (k.kind === 'slider' || k.kind === 'explore') return;
    if (!k.find && (k.kind === 'hop' || k.kind === 'arc') && ![k.from, k.via, ...(k.along || [])].includes(s.key)) {
      $('tip').textContent = t('drawFirst');
      sfx.pick();
      return;
    }
    if (s.key === k.find || (k.accept || []).includes(s.key)) {
      solve();
      return;
    }
    // a guide star, and then another one, draw the line between them (any
    // star of the belt, when the line is along it)
    const g = [k.from, k.via, ...(k.along || [])].filter(Boolean);
    if (BELT.includes(k.from) && BELT.includes(k.via)) g.push(...BELT);
    if (g.includes(s.key)) {
      if (state.sel && state.sel !== s.key) {
        endHop(STARS[state.sel], [place(view(), s)]);
        state.sel = null;
      } else {
        state.sel = s.key;
        sfx.pick();
      }
      return;
    }
    if (state.named.has(s.key) || state.figs.has('bigdipper') && FIGURES.bigdipper.lines.flat().includes(s.key)) {
      sfx.pick();
      return;
    }
    wrong(s);
  }

  area.addEventListener('pointerdown', (e) => {
    // (not a press on a button, a link or the sliders over the sky)
    if (e.target.closest('button, input, a, .sky-slider')) return;
    if (state.phase === 'fact' && task() && task().photo) {
      togglePhoto();
      return;
    }
    if (state.phase !== 'task') return;
    const p = pointAt(e);
    state.lastAct = performance.now();
    const k = task();
    const s = pick(p);
    try { area.setPointerCapture(e.pointerId); } catch (err) { /* a pointer that is gone already */ }
    const mode = k.kind === 'trace' ? 'trace' : 'hop';
    if (mode === 'trace') touchStar(p, true);
    state.drag = { id: e.pointerId, mode, a: mode === 'hop' ? s : null, p0: p, last: p, path: [p], t0: performance.now(), moved: false };
  });

  area.addEventListener('pointermove', (e) => {
    const d = state.drag;
    if (!d || d.id !== e.pointerId) return;
    const p = pointAt(e);
    d.last = p;
    d.path.push(p);
    if (Math.hypot(p.x - d.p0.x, p.y - d.p0.y) > 10) d.moved = true;
    state.lastAct = performance.now();
    if (d.mode === 'trace' && state.phase === 'task') touchStar(p, false);
  });

  function endDrag(e) {
    const d = state.drag;
    if (!d || d.id !== e.pointerId) return;
    state.drag = null;
    if (state.phase !== 'task') return;
    if (d.mode === 'trace') return;
    if (!d.moved) {
      tap(d.p0);
      return;
    }
    if (d.mode === 'hop' && d.a) {
      state.sel = null;
      endHop(d.a, d.path);
    }
  }
  area.addEventListener('pointerup', endDrag);
  area.addEventListener('pointercancel', (e) => {
    if (state.drag && state.drag.id === e.pointerId) state.drag = null;
  });

  // ---------------------------------------------------------------------------
  // Menu and win
  // ---------------------------------------------------------------------------

  // the levels of each part under its own heading
  const levelBtns = [];
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
      $(lv.part === 'orion' ? 'levelsOrion' : 'levels').appendChild(b);
      levelBtns.push(b);
    });
  }

  function updateMenu() {
    levelBtns.forEach((b, i) => {
      const tx = t('levels')[i];
      b.classList.toggle('selected', i === state.level);
      b.querySelector('.level-name').textContent = `${i + 1}. ${tx.name}`;
      b.querySelector('.level-about').textContent = tx.about;
      b.querySelector('.done-badge').textContent = done.has(LEVELS[i].id) ? '🌟' : '';
    });
  }

  function showMenu() {
    state.gen++;
    state.phase = 'menu';
    cancelAnimationFrame(raf);
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    $('photoBox').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    fingerEl.classList.add('hidden');
    updateMenu();
  }

  // the map of the whole chain: all the hops and figures, with the names
  function mapPicture() {
    const size = 900;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const g = c.getContext('2d');
    const L = { W: size, H: size, u: size * 0.8, dpr: 1, top: 20, pad: 40, hitR: 36, map: true };
    const keys = state.tasks.flatMap((k) => [k.from, k.via, k.find, ...(k.along || []),
      ...(k.figure ? FIGURES[k.figure].lines.flat() : [])]).filter(Boolean);
    if (level().part === 'bigdipper') keys.push(...FIGURES.bigdipper.lines.flat());
    const cam = state.cam;
    const figs = state.figs;
    // (with the figures shown only for a while, as the Winter Triangle)
    state.figs = new Set([...figs, ...state.tasks.flatMap((k) => [k.figure, k.autoDraw]).filter(Boolean)]);
    state.cam = fitView(keys, L, 70, level().center, false);
    const V = view(L, state.cam);
    render(g, L, V, performance.now(), true);
    state.figs = figs;
    // the places of the photos, with a frame round each, to tap
    state.mapPhotos = [];
    g.strokeStyle = 'rgba(255, 233, 160, 0.9)';
    g.lineWidth = 3;
    for (const id of new Set(state.tasks.map((k) => k.photo).filter(Boolean))) {
      const P = PHOTOS[id];
      const q = toScreen(V, horizon(P.mid));
      const e = toScreen(V, horizon(P.toSky(P.W, P.H / 2)));
      if (!q || !e) continue;
      const r = Math.max(Math.hypot(e[0] - q[0], e[1] - q[1]) * 0.75, 13);
      g.strokeRect(q[0] - r, q[1] - r, 2 * r, 2 * r);
      state.mapPhotos.push({ id, x: q[0], y: q[1] });
    }
    state.cam = cam;
    return c.toDataURL('image/png');
  }

  // A tap on the map near a photo's frame shows the photo, over the map.
  $('winImg').addEventListener('click', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    // (the picture is square, in the middle of the image's box)
    const side = Math.min(r.width, r.height);
    const x = ((e.clientX - r.left - (r.width - side) / 2) / side) * 900;
    const y = ((e.clientY - r.top - (r.height - side) / 2) / side) * 900;
    let best = null;
    let bd = 60;
    for (const m of state.mapPhotos || []) {
      const d = Math.hypot(m.x - x, m.y - y);
      if (d < bd) {
        bd = d;
        best = m;
      }
    }
    if (!best) return;
    const P = PHOTOS[best.id];
    $('photoBoxImg').src = P.file;
    $('photoBoxName').textContent = P.name[Astro.lang];
    $('photoBoxCredit').textContent = '📷 ' + t('photo');
    $('photoBoxCredit').href = 'https://www.astrobin.com/' + P.astrobin + '/';
    $('photoBox').classList.remove('hidden');
    sfx.pick();
  });
  $('photoBox').addEventListener('click', (e) => {
    if (!e.target.closest('a')) $('photoBox').classList.add('hidden');
  });

  function win() {
    state.phase = 'win';
    done.add(level().id);
    store.set('done', [...done]);
    fingerEl.classList.add('hidden');
    $('winImg').src = mapPicture();
    $('winName').textContent = level().win.name[Astro.lang];
    $('winFact').textContent = level().win.fact[Astro.lang];
    $('nextLevelBtn').classList.toggle('hidden', state.level === LEVELS.length - 1);
    $('win').classList.remove('hidden');
    sfx.win();
    Astro.startConfetti($('confetti'));
  }

  function updateSound() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
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

  $('dayRange').addEventListener('input', () => { if (task() && task().kind === 'explore') explore(); });
  $('hourRange').addEventListener('input', () => { if (task() && task().kind === 'explore') explore(); });

  // The slider of how bright the sky is, smoothly from a bright sky (a city,
  // the full Moon) to a dark one; done when the faint stars of Väike Vanker
  // show, and the slider has stayed there a moment.
  $('skyRange').addEventListener('input', () => {
    if (state.phase !== 'task' || task().kind !== 'slider') return;
    const v = +$('skyRange').value / 100;
    state.skyLimit = SKY_BRIGHT + (SKY_DARK - SKY_BRIGHT) * v;
    skyLight();
    state.lastAct = performance.now();
    // a note at every fifth of the way
    const step = Math.min(4, Math.floor(v * 5));
    if (step !== state.skyStep) {
      state.skyStep = step;
      sfx.note(step);
    }
    if (v >= 0.85 && !task().free) later(1200, () => { if (state.phase === 'task' && +$('skyRange').value >= 85) solve(); });
  });
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('nextBtn').addEventListener('click', nextTask);
  $('exploreDone').addEventListener('click', nextTask);
  $('sliderDone').addEventListener('click', nextTask);

  $('hintBtn').addEventListener('click', () => {
    if (state.phase !== 'task') return;
    state.lastAct = performance.now();
    taskLine();
    state.hintUntil = performance.now() + 4000;
    sfx.pick();
  });

  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateSound();
    sfx.pick();
  });

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (state.phase === 'menu') return;
      layout();
    }, 120);
  }).observe(area);

  buildMenu();
  updateMenu();
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    if (state.phase === 'task') showTask();
    if (state.phase === 'fact') showFact();
    if (state.phase === 'win') {
      $('winName').textContent = level().win.name[Astro.lang];
      $('winFact').textContent = level().win.fact[Astro.lang];
    }
  });
})();
