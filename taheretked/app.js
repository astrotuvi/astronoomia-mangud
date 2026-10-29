'use strict';

(() => {
  const { $, clamp, sfx } = Astro;

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  const DEG = Math.PI / 180;
  const LAT = 58.0 * DEG;   // Tõrva
  const LON = 25.93;        // degrees east

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
    spica: S(201.30, -11.16, 1.0, { et: 'Spiika', en: 'Spica' })
  };

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
    }
  };

  // the stars of Suur Vanker, for the views that show all of it
  const DIPPER = ['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid'];

  // The levels. Each is a chain of tasks in one sky, at the date and hour
  // `when` (UT), with its `caption`; a task with its own `when` (and `tz`, the
  // hours from UT to the clock time) turns the sky on to it, always forwards.
  // `limit` is the faintest stars shown, besides those of the figures, and
  // `win` the texts of the win screen. The kinds of task:
  //   hop: a line from `from` through `via`, carried on, leads to `find`;
  //     with `ticks`, the line has a tick at every gap between the two;
  //     without `find`, the task is only to draw the line, and the next
  //     task starts when it is drawn
  //   trace: join the numbered stars of `figure` in turn, as in Tähtkujud
  //   tap: tap `find`, near the stars `near`
  //   arc: a curve along the stars `along`, carried on through the stars
  //     `curve`, leads to `find`
  //   part: `find` is the part `f` of the way from `from` to `via`; any star
  //     of `accept` counts too
  //   slider: the sky starts as dark as `limit`, and the task is to move the
  //     slider to the countryside, where the faint stars of `figure` show
  // An arc without `find` is only to draw: it shows where a star is not, and
  // its `title` heads the fact. A `random` level picks a dark night of the
  // year and asks the tasks of its `pool` whose stars are up (or down) then;
  // without `help` the guide stars do not pulse, `figs` are the figures drawn
  // at the start, and with `fixedView` the view takes in all the tasks at
  // once.
  // `figure` is drawn in when the task is done, and the figures `given` are
  // there from its start. `span` is how much sky the
  // view shows across its shorter side, in degrees (70 if not given); a
  // closer view keeps the other figures out of the way. `show` adds stars
  // for the view to show, and with `keepLine` the line of the task before
  // stays bright, with its ticks. `arrow` points from a star towards
  // another, part of the way, to show which way to look.
  const LEVELS = [
    {
      id: 'vanker1',
      // the faintest stars shown, besides those of the figures: a small-town sky
      limit: 4.5,
      part: 'bigdipper',
      icon: '🍂',
      // 15 October 2026 at 21:00 summer time
      when: Date.UTC(2026, 9, 15, 18, 0),
      caption: { et: 'Sügisõhtu, 15. oktoober kell 21', en: 'An autumn evening, 15 October at 21:00' },
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
          kind: 'arc', along: ['alioth', 'mizar', 'alkaid'], curve: ['alioth', 'mizar', 'alkaid', 'arcturus', 'spica'],
          find: 'arcturus', figure: 'bootes', span: 20,
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
      // Only about how the sky turns: the view stays on Põhjanael, and the sky
      // turns round it by a quarter of a circle (6 hours of sidereal time)
      // three times, each time to a dark night, always forwards
      center: 'polaris',
      when: Date.UTC(2026, 9, 15, 18, 0),
      caption: { et: 'Sügisõhtu, 15. oktoober kell 21', en: 'An autumn evening, 15 October at 21:00' },
      win: {
        name: { et: 'Taevas pöörles', en: 'The sky turned' },
        fact: {
          et: 'Suur Vanker tiirleb ümber Põhjanaela: iga öö ja ka aasta jooksul. Kus ta parasjagu ka on, tema tagumised rattad näitavad Põhjanaela poole.',
          en: 'The Big Dipper goes round the North Star, every night and also over the year. Wherever it is, the two stars at the end of its bowl point to the North Star.'
        }
      },
      tasks: [
        {
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', span: 70, show: DIPPER, autoDraw: 'littledipper',
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
          // 15 January 2027 at 20:00 winter time: a quarter of a circle later
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', span: 100, show: DIPPER, hideNames: true, autoDraw: 'littledipper',
          when: Date.UTC(2027, 0, 15, 18, 0), tz: 2,
          caption: { et: 'Talveõhtu, 15. jaanuar kell 20', en: 'A winter evening, 15 January at 20:00' },
          text: {
            et: 'Kolm kuud hiljem, peaaegu samal kellaajal. Taevas on pöördunud. Leia Põhjanael uuesti.',
            en: 'Three months later, at almost the same hour. The sky has turned. Find the North Star again.'
          },
          fact: {
            et: 'Kolme kuuga on taevas pöördunud veerandi ringi. Põhja poole vaadates pöörleb taevas Põhjanaela ümber vastupäeva, aga Põhjanael ise jääb paigale.',
            en: 'In three months the sky has turned a quarter of a circle. Facing north, the sky turns anticlockwise round the North Star, but the North Star stays in place.'
          }
        },
        {
          // the same night, six hours later: 16 January at 02:00
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', span: 100, show: DIPPER, hideNames: true, autoDraw: 'littledipper',
          when: Date.UTC(2027, 0, 16, 0, 0), tz: 2,
          caption: { et: 'Talveöö, 16. jaanuar kell 2', en: 'A winter night, 16 January at 02:00' },
          text: {
            et: 'Sama öö, kuus tundi hiljem. Leia Põhjanael uuesti.',
            en: 'The same night, six hours later. Find the North Star again.'
          },
          fact: {
            et: 'Kuue tunniga pööras taevas veel veerandi ringi: sama palju kui kolme kuuga samal kellaajal. Suur Vanker on nüüd peaaegu pea kohal, tagurpidi.',
            en: 'In six hours the sky turned another quarter of a circle: as much as in three months at the same hour. The Big Dipper is now almost overhead, upside down.'
          }
        },
        {
          // 16 March 2027 at 04:00 winter time
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', span: 100, show: DIPPER, hideNames: true, autoDraw: 'littledipper',
          when: Date.UTC(2027, 2, 16, 2, 0), tz: 2,
          caption: { et: 'Kevadöö, 16. märts kell 4', en: 'A spring night, 16 March at 04:00' },
          text: {
            et: 'Kaks kuud hiljem, varahommikul. Leia Põhjanael uuesti.',
            en: 'Two months later, early in the morning. Find the North Star again.'
          },
          fact: {
            et: 'Kokku on taevas pöördunud kolmveerand ringi. Täisringi teeb ta ühe ööpäevaga, aga samal kellaajal vaadates ühe aastaga.',
            en: 'All in all, the sky has turned three quarters of a circle. It turns a full circle in a day and a night, but watched at the same hour, in a year.'
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
      // a countryside sky on a dark night picked at random; the tasks name
      // the stars to start from, but nothing pulses
      limit: 6,
      part: 'bigdipper',
      icon: '🌌',
      random: true,
      help: false,
      figs: ['bigdipper'],
      win: {
        name: { et: 'Päris taevas', en: 'A real sky' },
        fact: {
          et: 'Maal paistab taevas sadu tähti, ja tuttavad kujud on nende vahel raskemini leitavad. Suur Vanker näitab teed ka siis.',
          en: 'In the countryside the sky shows hundreds of stars, and the figures you know are harder to find among them. The Big Dipper shows the way then too.'
        }
      },
      // The tasks to choose from: a task is asked only if the stars `up` are
      // at least 10° above the horizon, or the stars `down` below it, on the
      // night picked.
      pool: [
        {
          kind: 'hop', from: 'merak', via: 'dubhe', find: 'polaris', span: 42, show: DIPPER, up: ['polaris'],
          text: {
            et: 'Leia Põhjanael Suure Vankri kahe tagumise ratta abil.',
            en: 'Find the North Star with the two stars at the end of the Big Dipper’s bowl.'
          },
          fact: {
            et: 'Maal on taevas sadu tähti, aga Suure Vankri tagumised rattad viivad ikka Põhjanaelani.',
            en: 'In the countryside there are hundreds of stars in the sky, but the two stars at the end of the Big Dipper’s bowl still lead to the North Star.'
          }
        },
        {
          kind: 'tap', find: 'vega', near: [], figure: 'lyra', up: ['vega'],
          show: ['eltanin', 'rastaban', 'kuma', 'grumium'],
          text: {
            et: 'Leia Veega, hele täht Lohe pea kõrval.',
            en: 'Find Vega, the bright star next to the Dragon’s head.'
          },
          fact: {
            et: 'Veega on meist 25 valgusaasta kaugusel. Tema valgus, mida praegu näed, lahkus temast 25 aastat tagasi.',
            en: 'Vega is 25 light years away. The light you see now left it 25 years ago.'
          }
        },
        {
          kind: 'arc', along: ['alioth', 'mizar', 'alkaid'], curve: ['alioth', 'mizar', 'alkaid', 'arcturus', 'spica'],
          find: 'arcturus', figure: 'bootes', span: 20, show: DIPPER, up: ['arcturus'],
          text: {
            et: 'Leia Arktuurus Suure Vankri aisa kaare abil.',
            en: 'Find Arcturus along the curve of the Big Dipper’s handle.'
          },
          fact: {
            et: 'Arktuurus on oranž, sest ta on Päikesest jahedam. Ta on aga palju suurem: läbimõõdult umbes 25 korda.',
            en: 'Arcturus is orange because it is cooler than the Sun. But it is much bigger: about 25 times as wide.'
          }
        },
        {
          kind: 'arc', along: ['alioth', 'mizar', 'alkaid'], curve: ['alioth', 'mizar', 'alkaid', 'arcturus', 'spica'],
          title: { et: 'Horisondi all', en: 'Below the horizon' }, span: 40, show: DIPPER, down: ['arcturus'],
          text: {
            et: 'Kus on Arktuurus? Leia see Suure Vankri aisa kaare abil.',
            en: 'Where is Arcturus? Find out along the curve of the Big Dipper’s handle.'
          },
          fact: {
            et: 'Kaar läheb maa alla: Arktuurus on praegu horisondi all. Õhtuti on ta taevas kevadel ja suvel.',
            en: 'The curve goes under the ground: Arcturus is below the horizon now. It is in the evening sky in spring and summer.'
          }
        },
        {
          kind: 'tap', find: 'alphecca', near: [], figure: 'corona', span: 20, up: ['alphecca', 'arcturus'],
          accept: ['theCrb', 'nusakan', 'gamCrb', 'delCrb', 'epsCrb', 'iotCrb'],
          show: ['arcturus', 'izar', 'delBoo', 'nekkar', 'seginus', 'rhoBoo', 'muphrid'],
          text: {
            et: 'Leia Põhjakroon Karjase kõrval.',
            en: 'Find the Northern Crown beside Boötes.'
          },
          fact: {
            et: 'Põhjakroonis on täht, mis on uinuv noova: umbes iga 80 aasta järel süttib ta mõneks päevaks heledaks.',
            en: 'In the Northern Crown there is a sleeping nova: about every 80 years it flares up and is bright for a few days.'
          }
        }
      ]
    },
    {
      id: 'vanker4',
      // as level 3, but the tasks name only the star to find, Suur Vanker is
      // not drawn in, and the view does not move to the stars of a task
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
          kind: 'tap', find: 'vega', near: [], figure: 'lyra', up: ['vega'],
          text: { et: 'Leia Veega.', en: 'Find Vega.' },
          fact: {
            et: 'Veega, Luige tähtkuju Deneeb ja Kotka tähtkuju Altair moodustavad Suvekolmnurga, mis paistab suvel ja sügisel õhtuti kõrgel.',
            en: 'Vega, Deneb in the Swan and Altair in the Eagle make the Summer Triangle, which is high in the evening sky in summer and autumn.'
          }
        },
        {
          kind: 'arc', along: ['alioth', 'mizar', 'alkaid'], curve: ['alioth', 'mizar', 'alkaid', 'arcturus', 'spica'],
          find: 'arcturus', figure: 'bootes', up: ['arcturus'],
          text: { et: 'Leia Arktuurus.', en: 'Find Arcturus.' },
          fact: {
            et: 'Arktuurus tähendab kreeka keeles karu valvajat: ta käib taevas Suure Karu järel.',
            en: 'Arcturus means the bear’s guard in Greek: it follows the Great Bear across the sky.'
          }
        },
        {
          kind: 'arc', along: ['alioth', 'mizar', 'alkaid'], curve: ['alioth', 'mizar', 'alkaid', 'arcturus', 'spica'],
          title: { et: 'Horisondi all', en: 'Below the horizon' }, down: ['arcturus'],
          text: { et: 'Kus on Arktuurus?', en: 'Where is Arcturus?' },
          fact: {
            et: 'Arktuurus on praegu horisondi all. Õhtuti on ta taevas kevadel ja suvel.',
            en: 'Arcturus is below the horizon now. It is in the evening sky in spring and summer.'
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
    }
  ];

  const TEXT = {
    et: {
      title: 'Tähest täheni',
      intro1: 'Õpi taevast tähti leidma. Tuntud tähtedest viivad jooned edasi järgmiste juurde.',
      intro2: 'Vea sõrme või hiirega ühelt tähelt läbi teise ja vaata, kuhu joon edasi viib. Siis puuduta tähte, mida otsid.',
      partBigDipper: 'Suur Vanker',
      levels: [
        { name: 'Õpi teed', about: 'Sügisõhtu: Suur Vanker näitab teed' },
        { name: 'Taevas pöörleb', about: 'Suur Vanker tiirleb ümber Põhjanaela' },
        { name: 'Päris taevas', about: 'Pime taevas sadade tähtedega, juhuslikul ööl' },
        { name: 'Ilma abita', about: 'Leia ise tähed' }
      ],
      seasons: ['Talve', 'Talve', 'Kevad', 'Kevad', 'Kevad', 'Suve', 'Suve', 'Suve', 'Sügis', 'Sügis', 'Sügis', 'Talve'],
      night: (season, evening, d, m, h) => `${season}${evening ? 'õhtu' : 'öö'}, ${d}. ${m} kell ${h}`,
      months: ['jaanuar', 'veebruar', 'märts', 'aprill', 'mai', 'juuni', 'juuli', 'august', 'september', 'oktoober', 'november', 'detsember'],
      date: (d, m) => `${d}. ${m}`,
      clock: (h) => `kell ${h}`,
      dateTime: (d, m, h, mm) => `${d}. ${m}, kell ${h}${mm ? '.' + String(mm).padStart(2, '0') : ''}`,
      lightSky: 'Taevas on hele: Päike on horisondi lähedal, ja paistavad ainult heledamad tähed.',
      daySky: 'Päike on üleval, ja tähti pole näha. Suur Vanker ja Põhjanael on ikka oma kohal.',
      day: 'Kuupäev',
      hour: 'Kellaaeg',
      skyCity: 'Linn',
      skyTown: 'Alevik',
      skyCountry: 'Maa',
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
      dirs: { 0: 'põhi', 45: 'kirre', 90: 'ida', 135: 'kagu', 180: 'lõuna', 225: 'edel', 270: 'lääs', 315: 'loode' },
      wellDone: 'Tubli!',
      again: 'Mängi uuesti',
      menu: 'Menüü',
      hint: 'Vihje',
      sound: 'Heli',
      credit: 'Tähed: Yale’i heledate tähtede kataloog (Hoffleit ja Warren, 1991).',
      allGames: 'Kõik mängud'
    },
    en: {
      title: 'Star Hopping',
      intro1: 'Learn to find stars in the sky. Lines from stars you know lead on to the next ones.',
      intro2: 'Drag your finger or the mouse from one star through another, and see where the line leads. Then tap the star you are looking for.',
      partBigDipper: 'The Big Dipper',
      levels: [
        { name: 'Learn the way', about: 'An autumn evening: the Big Dipper shows the way' },
        { name: 'The sky turns', about: 'The Big Dipper goes round the North Star' },
        { name: 'A real sky', about: 'A dark sky with hundreds of stars, on a night picked at random' },
        { name: 'Without help', about: 'Find the stars yourself' }
      ],
      seasons: ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'autumn', 'autumn', 'autumn', 'winter'],
      night: (season, evening, d, m, h) => `A ${season} ${evening ? 'evening' : 'night'}, ${d} ${m} at ${String(h).padStart(2, '0')}:00`,
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      date: (d, m) => `${d} ${m}`,
      clock: (h) => `${String(h).padStart(2, '0')}:00`,
      dateTime: (d, m, h, mm) => `${d} ${m}, ${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
      lightSky: 'The sky is light: the Sun is near the horizon, and only the brighter stars show.',
      daySky: 'The Sun is up, and no stars can be seen. The Big Dipper and the North Star are still in their places.',
      day: 'Date',
      hour: 'Time',
      skyCity: 'City',
      skyTown: 'Small town',
      skyCountry: 'Countryside',
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
      credit: 'Stars: the Yale Bright Star Catalogue (Hoffleit & Warren, 1991).',
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
    tz: 3,
    turn: null,       // the sky turning on to the next task: { th0, th1, ms0, ms1, t0, dur }
    sel: null,        // a guide star tapped, to tap the second one after it
    drag: null,
    wiggle: null,     // a wrong star: { star, t0 }
    flash: null,      // a star just found: { key, t0 }
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
  // the stars of the figures always show, the others to the level's limit
  // (in the slider task the stars of the figures too, so that the city hides them)
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
      top: $('task').offsetHeight + 12,
      pad: clamp(u * 0.09, 30, 70),   // room round the stars of a task
      hitR: clamp(u * 0.06, 24, 40)
    };
    if (state.cam) state.cam = taskView();
  }

  // A view that looks at the middle of the stars and fits them, with `span`
  // degrees of sky across the shorter side, or more if they need it, up to
  // 120°.
  function fitView(keys, L = state.L, span = (task() && task().span) || 70, center = level().center) {
    const vs = keys.map((k) => horizon(STARS[k]));
    const m = vs.reduce((a, v) => [a[0] + v[0], a[1] + v[1], a[2] + v[2]], [0, 0, 0]);
    let az = Math.atan2(m[0], m[1]) / DEG;
    let alt = Math.asin(m[2] / Math.hypot(...m)) / DEG;
    // looking at the middle of the stars' outline rather than at their
    // average, so that a crowd of stars on one side does not push the others
    // to the edge: twice, as the outline changes a little when the view turns
    let V;
    let box;
    if (center) {
      // looking straight at that star, so that the sky turns round it
      const c = horizon(STARS[center]);
      az = Math.atan2(c[0], c[1]) / DEG;
      alt = Math.asin(c[2]) / DEG;
    }
    for (let n = 0; n < 3; n++) {
      V = Object.assign(basis({ az, alt }), { s: 1, cx: 0, cy: 0 });
      const ps = vs.map((v) => toScreen(V, v)).filter(Boolean);
      box = {
        x0: Math.min(...ps.map((q) => q[0])), x1: Math.max(...ps.map((q) => q[0])),
        y0: Math.min(...ps.map((q) => q[1])), y1: Math.max(...ps.map((q) => q[1]))
      };
      if (n === 2 || center) break;
      // the inverse of the stereographic projection, for the middle of the box
      const X = (box.x0 + box.x1) / 2;
      const Y = -(box.y0 + box.y1) / 2;
      const r2 = X * X + Y * Y;
      const d = [0, 1, 2].map((i) => ((4 - r2) * V.fwd[i] + 4 * (X * V.right[i] + Y * V.up[i])) / (4 + r2));
      az = Math.atan2(d[0], d[1]) / DEG;
      alt = Math.asin(clamp(d[2], -1, 1)) / DEG;
    }
    const w = L.W / 2 - L.pad;
    const h = (L.H - L.top - 16) / 2 - L.pad;
    let s = Math.min(w, h) / (2 * Math.tan((span / 2) * DEG / 2));
    const sMin = Math.min(w, h) / (2 * Math.tan(60 * DEG / 2));
    const hx = Math.max(Math.abs(box.x0), Math.abs(box.x1));
    const hy = Math.max(Math.abs(box.y0), Math.abs(box.y1));
    if (hx > 1e-6) s = Math.min(s, w / hx);
    if (hy > 1e-6) s = Math.min(s, h / hy);
    return { az, alt, s: Math.max(s, sMin) };
  }

  // the view as it is now, ready for toScreen()
  function view(L = state.L, cam = state.cam) {
    return Object.assign(basis(cam), { s: cam.s, cx: L.W / 2, cy: L.top + (L.H - L.top - 16) / 2 });
  }

  // the stars the current task is about, for the view to show
  function viewKeys() {
    const k = task();
    if (!k) return ['dubhe', 'polaris'];
    const keys = [];
    if (k.from) keys.push(k.from, k.via);
    if (k.find) keys.push(k.find);
    if (k.near) keys.push(...k.near);
    if (k.along) keys.push(...k.along);
    if (k.figure) keys.push(...new Set(FIGURES[k.figure].lines.flat()));
    if (k.accept) keys.push(...k.accept);
    if (k.show) keys.push(...k.show);
    return keys;
  }

  // the view moves smoothly to show the stars of the next task
  function panTo(cam) {
    if (!state.cam) {
      state.cam = cam;
      return;
    }
    state.pan = { from: { ...state.cam }, to: cam, t0: performance.now(), dur: 1200 };
  }

  function stepPan(now) {
    const P = state.pan;
    if (!P) return;
    const p = clamp((now - P.t0) / P.dur, 0, 1);
    const e = p * p * (3 - 2 * p);
    let dAz = ((P.to.az - P.from.az + 540) % 360) - 180;
    state.cam = {
      az: P.from.az + dAz * e,
      alt: P.from.alt + (P.to.alt - P.from.alt) * e,
      s: P.from.s + (P.to.s - P.from.s) * e
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

  // A smooth curve through the stars, as a Catmull-Rom spline on the sky.
  function curvePoints(keys) {
    const P = keys.map((k) => vec(STARS[k]));
    const ext = (a, b) => [2 * a[0] - b[0], 2 * a[1] - b[1], 2 * a[2] - b[2]];
    const Q = [ext(P[0], P[1]), ...P, ext(P[P.length - 1], P[P.length - 2])];
    const pts = [];
    for (let i = 1; i < Q.length - 2; i++) {
      const [p0, p1, p2, p3] = [Q[i - 1], Q[i], Q[i + 1], Q[i + 2]];
      const n = Math.max(4, Math.round(Math.acos(clamp(dotv(p1, p2), -1, 1)) / DEG * 2));
      for (let j = 0; j < n; j++) {
        const u = j / n;
        const u2 = u * u;
        const u3 = u2 * u;
        pts.push(fromVec([0, 1, 2].map((q) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * u +
          (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * u2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * u3))));
      }
    }
    pts.push(STARS[keys[keys.length - 1]]);
    return pts;
  }

  // a line of a hop, drawn growing from its start
  function addLine(kind, a, b, keep) {
    const k = task();
    const line = { kind, a: a.key, b: b.key, t0: performance.now(), keep, ticks: [], ring: null, task: state.ti, when: state.when };
    if (kind === 'arc') {
      line.pts = curvePoints(k.curve.slice(k.curve.indexOf(a.key)));
      line.dur = 1800;
    } else if (kind === 'part') {
      // the ring at the part of the way, counted from the task's first star
      const from = a.key === k.from ? a : b;
      const to = from === a ? b : a;
      const H = hopPoints(from, to, 0);
      line.pts = hopPoints(a, b, 0).pts;
      line.ring = H.at(H.gap * k.f);
      line.dur = 700;
    } else {
      const H = hopPoints(a, b, Math.min(9, (110 * DEG) / Math.max(H0(a, b), 1e-6)));
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
      // a line that is not the task's fades out completely after a few
      // seconds, and is not on the map
      const a = l.keep ? (old ? 0.22 : 0.5) : 0.5 * (1 - clamp((age - 2.5) / 1.5, 0, 1));
      if (a <= 0.01 || (map && !l.keep)) continue;
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
      if (l.ring && p >= 1) {
        const q = place(V, l.ring);
        if (q) {
          g.strokeStyle = 'rgba(95, 212, 255, 0.95)';
          g.lineWidth = 2.5;
          g.beginPath();
          g.arc(q.x, q.y, L.hitR * 0.55, 0, Math.PI * 2);
          g.stroke();
        }
      }
    }

    // the figures
    for (const id of state.figs) {
      // in daylight only Suur Vanker's lines, where it is
      if (state.day && id !== 'bigdipper') continue;
      const f = FIGURES[id];
      g.strokeStyle = state.day ? 'rgba(255, 255, 255, 0.85)' : id === 'bigdipper' ? 'rgba(150, 180, 255, 0.45)' : 'rgba(255, 211, 77, 0.55)';
      g.lineWidth = figureWidth(u);
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
      if (s.mag < 2.6) dot(g, x, q.y, r * 2.6, `rgba(${c}, ${(0.13 * dim).toFixed(2)})`);
      dot(g, x, q.y, r, `rgba(${c}, ${dim.toFixed(2)})`);
    }

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
  }

  // A figure to draw, as in Tähtkujud: the lines between the stars joined
  // grow from the star joined first; with 💡 the whole figure shows as faint
  // dashed lines.
  const LINE_MS = 380;
  const HINT_MS = 3500;   // the next star starts to pulse after this long without progress
  const traceOf = (k) => k && k.kind === 'trace' && FIGURES[k.figure];
  const traceLinks = (f) => f.order.slice(1).map((key, i) => [f.order[i], key]).concat(f.extra);

  function drawTrace(g, L, V, now, f) {
    const at = (key) => place(V, STARS[key]);
    if (now < state.hintUntil) {
      g.setLineDash([6, 8]);
      g.strokeStyle = 'rgba(95, 212, 255, 0.4)';
      g.lineWidth = 2;
      for (const [a, b] of traceLinks(f)) {
        const p = at(a);
        const q = at(b);
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
    for (const [a, b] of traceLinks(f)) {
      const ia = f.order.indexOf(a);
      const ib = f.order.indexOf(b);
      if (ia >= state.lit || ib >= state.lit) continue;
      const [s, e] = state.litAt[ia] <= state.litAt[ib] ? [a, b] : [b, a];
      const k = clamp((now - state.litAt[f.order.indexOf(e)]) / (state.auto ? AUTO_MS : LINE_MS), 0, 1);
      const p = at(s);
      const q = at(e);
      if (!p || !q) continue;
      g.beginPath();
      g.moveTo(p.x, p.y);
      g.lineTo(p.x + (q.x - p.x) * k, p.y + (q.y - p.y) * k);
      g.stroke();
    }
    g.shadowBlur = 0;
  }

  // the stars joined are golden and pop as they light up, the next one
  // pulses at the start and when nothing has happened for a while, and
  // every star has its number
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
      g.fillStyle = i < state.lit ? 'rgba(255, 211, 77, 0.7)' : '#ffffff';
      g.strokeText(String(i + 1), best[0], best[1]);
      g.fillText(String(i + 1), best[0], best[1]);
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

  // the guide stars pulse, and the star just found glows
  function drawMarks(g, L, V, now) {
    const pulse = 0.5 + 0.5 * Math.sin(now / 260);
    const ring = (key, color, r) => {
      const q = place(V, STARS[key]);
      if (!q) return;
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
        if (key) ring(key, `rgba(255, 211, 77, ${(0.5 + 0.5 * pulse).toFixed(2)})`, L.hitR * (0.5 + 0.2 * pulse));
      }
      if (state.sel) ring(state.sel, 'rgba(255, 211, 77, 0.95)', L.hitR * 0.5);
      if (task().arrow) drawArrow(g, V, task().arrow, pulse);
    }
    const f = state.flash;
    if (f) {
      // (a frame may be timed a little before the star was found)
      const e = Math.max(0, (now - f.t0) / 1500);
      if (e < 1) ring(f.key, `rgba(255, 211, 77, ${(1 - e).toFixed(2)})`, L.hitR * (0.4 + e * 0.9));
      else ring(f.key, 'rgba(255, 211, 77, 0.8)', L.hitR * 0.45);
    }
  }

  // the stars the task names, and the ones found, get their names; the
  // figures found get theirs below them
  function drawLabels(g, L, V, map) {
    const fs = map ? 26 : Math.round(clamp(L.u * 0.03, 12, 16));
    g.font = `800 ${fs}px Nunito, sans-serif`;
    g.lineJoin = 'round';
    const keys = new Set(state.named);
    if (!map && state.phase === 'task') {
      const k = task();
      [k.from, k.via, ...(k.along || [])].filter((x) => x && known(STARS[x])).forEach((x) => keys.add(x));
    }
    const boxes = [];
    const hits = (b) => boxes.some((o) => b.x < o.x + o.w && o.x < b.x + b.w && b.y < o.y + o.h && o.y < b.y + b.h);
    g.textAlign = 'center';
    for (const id of state.figs) {
      if (id === 'bigdipper' && !map && state.ti > 1) continue;
      if (!map && state.hideFig && state.hideFig.has(id)) continue;
      if (!map && state.day && id !== 'bigdipper') continue;
      const pts = [...new Set(FIGURES[id].lines.flat())].map((k) => place(V, STARS[k])).filter(Boolean);
      if (!pts.length) continue;
      const xs = pts.map((q) => q.x);
      const x = (Math.min(...xs) + Math.max(...xs)) / 2;
      const y = Math.max(...pts.map((q) => q.y)) + fs + 8;
      const txt = FIGURES[id].name[Astro.lang];
      const w = g.measureText(txt).width;
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
      if (!q) continue;
      const r = starR(s.mag, L.u) + 5;
      const txt = nameOf(s.name);
      const w = g.measureText(txt).width;
      const tries = [[q.x + r, q.y - r - fs * 0.2], [q.x + r, q.y + r + fs * 0.8], [q.x - r - w, q.y - r - fs * 0.2], [q.x - r - w, q.y + r + fs * 0.8]];
      const box = (xy) => ({ x: xy[0], y: xy[1] - fs * 0.85, w, h: fs });
      const xy = tries.find((p) => !hits(box(p))) || tries[0];
      boxes.push(box(xy));
      g.strokeStyle = 'rgba(4, 8, 32, 0.85)';
      g.lineWidth = 4;
      g.strokeText(txt, xy[0], xy[1]);
      g.fillStyle = state.named.has(key) ? '#ffe9a0' : '#bfe6ff';
      g.fillText(txt, xy[0], xy[1]);
    }
  }

  // the ground below the horizon, with spruces along it and the directions
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
    // the stars fade in and out as the sky gets darker or lighter
    state.limit += (state.limitTo - state.limit) * clamp((now - (state.lastFrame || now)) / 250, 0, 1);
    state.lastFrame = now;
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
  function caption() {
    const T = state.turn;
    if (!T) {
      const k = task();
      return ((k && k.caption) || state.caption)[Astro.lang];
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
    $('taskText').textContent = k ? k.text[Astro.lang] : '';
    $('tip').textContent = '';
    $('nextBtn').classList.add('hidden');
    updateBar();
  }

  function showFact() {
    const k = task();
    const box = $('task');
    box.classList.add('fact');
    // a star with a name used in Estonia, or else its figure
    const name = k.find && known(STARS[k.find]) ? nameOf(STARS[k.find].name) : k.figure && FIGURES[k.figure].name[Astro.lang];
    $('taskName').textContent = k.title ? k.title[Astro.lang] : t('found')(name);
    $('taskText').textContent = k.fact[Astro.lang];
    $('tip').textContent = '';
    const last = state.ti === state.tasks.length - 1;
    $('nextBtn').textContent = last ? t('finish') : t('next');
    $('nextBtn').classList.remove('hidden');
    updateBar();
  }

  function updateBar() {
    const n = state.tasks.length;
    const k = state.ti + (state.phase === 'fact' || state.phase === 'wait' ? 1 : 0);
    $('fill').style.width = (100 * k) / n + '%';
    $('count').textContent = `${k} / ${n}`;
  }

  function relayoutTop() {
    if (!state.L) return;
    state.L.top = $('task').offsetHeight + 12;
  }

  // the view for the current task, or for all of them on a level without
  // moving views
  function taskView() {
    if (!level().fixedView) return fitView(viewKeys());
    const keys = state.tasks.flatMap((k) => [k.from, k.via, k.find, ...(k.along || []), ...(k.accept || [])]).filter(Boolean);
    return fitView([...keys, ...DIPPER], state.L, 70, null);
  }

  function startTask() {
    const k = task();
    state.limitTo = k.limit || level().limit;
    $('slider').classList.toggle('hidden', k.kind !== 'slider');
    $('skyRange').value = 0;
    if (k.when && k.when !== state.when) {
      turnTo(k);
      return;
    }
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
    state.light = 0;
    state.day = false;
    if (k.kind === 'explore') startExplore();
    state.sel = null;
    state.lit = 0;
    state.doneAt = 0;
    state.litAt = [];
    state.hintUntil = 0;
    state.lastAct = performance.now();
    state.lastStep = performance.now();
    showTask();
    relayoutTop();
    panTo(taskView());
  }

  // The sky turns forwards round Põhjanael to the task's date and hour,
  // while the caption counts the months or the hours; then the task starts.
  function turnTo(k) {
    const th1 = siderealTime(k.when);
    const d = (((th1 - state.th) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const dur = 1500 + 1200 * (d / Math.PI);
    state.turn = { th0: state.th, th1: state.th + d, ms0: state.when, ms1: k.when, tz: k.tz || 3, t0: performance.now(), dur };
    state.phase = 'turn';
    state.flash = null;
    // Väike Vanker is drawn again once Põhjanael is found
    if (k.hideNames) {
      state.figs.delete('littledipper');
      state.auto = null;
    }
    // the view for the task, worked out for the sky as it will be
    const th = state.th;
    state.th = th1;
    const cam = taskView();
    state.th = th;
    $('taskText').textContent = '';
    $('taskName').textContent = '';
    $('tip').textContent = '';
    $('nextBtn').classList.add('hidden');
    $('when').textContent = caption();
    state.pan = { from: { ...state.cam }, to: cam, t0: performance.now(), dur };
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
    // summer time from the end of March to the end of October
    const tz = day >= 86 && day < 303 ? 3 : 2;
    return { ms: Date.UTC(2027, 0, 1 + day) + (h - tz) * 3600000, tz };
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
    const sunAlt = Math.asin(horizon(sun(ms))[2]) / DEG;
    state.light = clamp((sunAlt + 18) / 18, 0, 1);
    state.day = sunAlt > -0.8;
    state.limitTo = level().limit - 3.5 * state.light;
    const local = new Date(ms + tz * 3600000);
    const mm = local.getUTCMinutes();
    state.caption = {};
    for (const lang of ['et', 'en']) {
      const T = TEXT[lang];
      state.caption[lang] = T.dateTime(local.getUTCDate(), T.months[local.getUTCMonth()], local.getUTCHours(), mm);
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
    $('nextBtn').textContent = t('finish');
    $('nextBtn').classList.remove('hidden');
    updateBar();
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
  function randomNight(lv) {
    for (let tries = 0; ; tries++) {
      const day = Math.floor(Math.random() * 365);
      // (not midnight, which would read "kell 0")
      const hour = [20, 21, 22, 23, 25, 26, 27][Math.floor(Math.random() * 7)];
      // summer time from the end of March to the end of October
      const tz = day >= 86 && day < 303 ? 3 : 2;
      const ms = Date.UTC(2027, 0, 1 + day, hour - tz);
      const th = siderealTime(ms);
      if (horizon(sun(ms), th)[2] > Math.sin(-15 * DEG) && tries < 500) continue;
      const alt = (key) => Math.asin(horizon(STARS[key], th)[2]) / DEG;
      const tasks = lv.pool.filter((k) => (k.up || []).every((key) => alt(key) >= 10) && (k.down || []).every((key) => alt(key) < 0));
      if (tasks.length < 3 && tries < 500) continue;
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
    $('menu').classList.add('hidden');
    $('win').classList.add('hidden');
    $('game').classList.remove('hidden');
    updateSound();
    showTask();
    layout();
    startTask();
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

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
      state.flash = { key, t0: performance.now() };
    }
    if (k.figure) state.figs.add(k.figure);
    // the way to it stays on the map, also when the star was tapped
    // straight away
    taskLine();
    state.lines.forEach((l) => { if (!l.keep) l.t0 = Math.min(l.t0, performance.now() - 6000); });
    state.phase = 'fact';
    state.sel = null;
    sfx.snap();
    later(200, () => sfx.note(state.ti + 2));
    showFact();
    relayoutTop();
    if (k.autoDraw) {
      state.hideFig = new Set();
      const ti = state.ti;
      later(400, () => { if (state.ti === ti) autoDraw(k.autoDraw); });
    }
    // the view takes in the figure just drawn
    panTo(taskView());
  }

  function nextTask() {
    sfx.pick();
    if (state.ti === state.tasks.length - 1) {
      win();
      return;
    }
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
    const want = [k.via, ...(k.along || [])].filter((x) => x && x !== a.key).map((x) => STARS[x]);
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
      if (s && s.mag < 4.5) return s;
    }
    return null;
  }

  // a drag from one star through another draws the line it makes
  function endHop(a, path) {
    const b = firstPassed(a, path);
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
    // a guide star, and then another one, draw the line between them
    const g = [k.from, k.via, ...(k.along || [])].filter(Boolean);
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
    if (state.phase !== 'task' || e.target.closest('button')) return;
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
    keys.push(...FIGURES.bigdipper.lines.flat());
    const cam = state.cam;
    state.cam = fitView(keys, L, 70, level().center);
    render(g, L, view(L, state.cam), performance.now(), true);
    state.cam = cam;
    return c.toDataURL('image/png');
  }

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

  // the slider of how dark the sky is: a city, a small town, the countryside
  const SKIES = [3, 4.5, 6];
  $('skyRange').addEventListener('input', () => {
    if (state.phase !== 'task') return;
    const i = +$('skyRange').value;
    state.limitTo = SKIES[i];
    state.lastAct = performance.now();
    sfx.note(i);
    if (i === 2 && task().kind === 'slider') later(1200, () => { if (state.phase === 'task') solve(); });
  });
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('nextBtn').addEventListener('click', nextTask);

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
    $('skyLabels').querySelectorAll('[data-sky]').forEach((el) => { el.title = t(el.dataset.sky); });
  });
})();
