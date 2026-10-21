'use strict';

(() => {
  const { $, clamp, rand, sfx } = Astro;
  const NS = 'http://www.w3.org/2000/svg';

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // The Moon's place is its angle from the Sun, seen from above the North Pole:
  // 0 is between the Earth and the Sun, 180 behind the Earth. It goes round
  // anticlockwise, so the angle grows day by day.
  const MONTH = 29.53;     // days from one new moon to the next
  const MONTH_S = 20;      // seconds for one month when ▶ plays it

  // The Moon's path is tilted by about 5 degrees, so at most new and full
  // moons it passes above or below the Sun or the Earth's shadow. Eclipses
  // happen only when the nodes, where its path crosses the Earth's path round
  // the Sun, point towards the Sun. As the Earth goes round the Sun, the
  // nodes turn about 30.7 degrees a month relative to the Sun, so this comes
  // round about every six months.
  const TILT = 5.1;
  const NODE_STEP = 30.7;  // degrees a month
  const NODE0 = 70;        // the nodes at the start, away from the Sun
  const SOLAR_LIM = 1.5;   // how far above or below (degrees) the Moon can still touch the Sun
  const LUNAR_LIM = 1.2;   // … and the Earth's shadow
  const SEASON = 17;       // nodes this close to the Sun's direction make an eclipse season

  // The eight phases. New, full and the quarters get 10 degrees each way.
  const PHASES = [
    { at: 0, et: 'noorkuu', en: 'new moon' },
    { at: 45, et: 'kasvav kuusirp', en: 'waxing crescent' },
    { at: 90, et: 'esimene veerand', en: 'first quarter' },
    { at: 135, et: 'kasvav kuu', en: 'waxing gibbous' },
    { at: 180, et: 'täiskuu', en: 'full moon' },
    { at: 225, et: 'kahanev kuu', en: 'waning gibbous' },
    { at: 270, et: 'viimane veerand', en: 'last quarter' },
    { at: 315, et: 'kahanev kuusirp', en: 'waning crescent' }
  ];

  // Tasks, shown one at a time over the view, from the four main phases to
  // the phases in between (not in the order they come) and the eclipses: make a phase by name, make the Moon
  // in a picture (a random angle in the range), or make a solar or lunar
  // eclipse, which needs eclipse season. A task is solved when the Moon is let go in the right place.
  const TASKS = [
    {
      phase: 4,
      ask: {
        et: 'Lohista Kuud tema teel ümber Maa nii, et Maalt paistaks täiskuu: Kuu, mis on üleni valgustatud.',
        en: 'Drag the Moon along its path round the Earth so that we see a full moon from the Earth: a Moon that is lit all over.'
      },
      fact: {
        et: 'Täiskuu ajal on Kuu Päikesest Maa teisel pool. Päike valgustab kogu Kuu poolt, mis on meie poole. Täiskuu tõuseb õhtul, kui Päike loojub, ja on kõige kõrgemal keskööl.',
        en: 'At full moon, the Moon is on the other side of the Earth from the Sun. The Sun lights all of the side that faces us. A full moon rises in the evening as the Sun sets, and is highest at midnight.'
      }
    },
    {
      phase: 2,
      ask: {
        et: 'Tee esimene veerand: Kuu, mille parem pool on valgustatud ja vasak pool tume.',
        en: 'Make a first quarter: a Moon whose right half is lit and left half is dark.'
      },
      fact: {
        et: 'Kuu on teinud veerandi tiirust ümber Maa ja noorkuust on möödas umbes nädal. Kuu on ise alati pooleldi valgustatud, aga nüüd näeme valgustatud poolest ainult poolt.',
        en: 'The Moon has gone a quarter of the way round the Earth, about a week after new moon. Half of the Moon is always lit, but now we see only half of the lit half.'
      }
    },
    {
      phase: 0,
      ask: {
        et: 'Tee noorkuu: Kuu, mida me Maalt üldse ei näe.',
        en: 'Make a new moon: a Moon we cannot see from the Earth at all.'
      },
      fact: {
        et: 'Noorkuu ajal on Kuu Maa ja Päikese vahel. Tema valgustatud pool on Päikese poole ja meie poole jääb tume pool. Kuu on siis päeval taevas koos Päikesega ning Päikese sära varjab ta ära.',
        en: 'At new moon, the Moon is between the Earth and the Sun. Its lit side faces the Sun, and its dark side faces us. The Moon is then in the daytime sky with the Sun, hidden in its glare.'
      }
    },
    {
      phase: 6,
      ask: {
        et: 'Tee viimane veerand: Kuu, mille vasak pool on valgustatud ja parem pool tume.',
        en: 'Make a last quarter: a Moon whose left half is lit and right half is dark.'
      },
      fact: {
        et: 'Täiskuust on möödas umbes nädal. Viimane veerand tõuseb keskööl ja on hommikul kõrgel taevas, nii et seda näeb ka koolimineku ajal.',
        en: 'About a week has passed since full moon. The last quarter rises at midnight and is high in the sky in the morning, so you can see it on your way to school.'
      }
    },
    {
      pic: [210, 240],
      ask: {
        et: 'Tee selline Kuu nagu pildil.',
        en: 'Make a Moon like the one in the picture.'
      },
      fact: {
        et: 'See on kahanev kuu. Iga päevaga liigub Kuu oma teel ümber Maa umbes 12 kraadi edasi, nii et ta tõuseb iga päev umbes 50 minutit hiljem.',
        en: 'This is a waning gibbous Moon. Every day the Moon moves about 12 degrees further round the Earth, so it rises about 50 minutes later each day.'
      }
    },
    {
      pic: [30, 60],
      ask: {
        et: 'Tee selline Kuu nagu pildil.',
        en: 'Make a Moon like the one in the picture.'
      },
      fact: {
        et: 'See on kasvav kuusirp. Seda näeb õhtul läänes, varsti pärast päikeseloojangut. Vahel paistab nõrgalt ka Kuu tume osa: sinna jõuab valgus, mis on peegeldunud Maalt.',
        en: 'This is a waxing crescent. You can see it in the west in the evening, soon after sunset. Sometimes the dark part glows faintly too: it is lit by sunlight reflected from the Earth.'
      }
    },
    {
      pic: [300, 330],
      ask: {
        et: 'Tee selline Kuu nagu pildil.',
        en: 'Make a Moon like the one in the picture.'
      },
      fact: {
        et: 'See on kahanev kuusirp. Seda näeb varahommikul idas, enne päikesetõusu. Mõne päeva pärast on jälle noorkuu ja kõik algab otsast peale. Noorkuust noorkuuni kulub 29 ja pool päeva.',
        en: 'This is a waning crescent. You can see it in the east early in the morning, before sunrise. In a few days there will be a new moon again, and it all starts over. From one new moon to the next takes 29 and a half days.'
      }
    },
    {
      pic: [120, 150],
      ask: {
        et: 'Tee selline Kuu nagu pildil.',
        en: 'Make a Moon like the one in the picture.'
      },
      fact: {
        et: 'See on kasvav kuu: valgustatud on rohkem kui pool, aga täiskuuni on veel mõni päev. Teda näeb juba pärastlõunal, kui Päike on veel taevas.',
        en: 'This is a waxing gibbous Moon: more than half is lit, but full moon is still a few days away. You can see it already in the afternoon, while the Sun is still up.'
      }
    },
    {
      eclipse: 'solar',
      photo: true,
      ask: {
        et: 'Tee nüüd päikesevarjutus! See õnnestub ainult varjutuste ajal, kui kohad, kus Kuu tee hele ja tume pool kokku saavad, on Päikese suunas. Vajuta ▶️ ja oota, kuni näed kirja „Varjutuste aeg“.',
        en: 'Now make a solar eclipse! It only works in eclipse season, when the points where the bright and faint halves of the Moon\'s path meet are in line with the Sun. Press ▶️ and wait until you see “Eclipse season”.'
      },
      fact: {
        et: 'Kuu vari langeb Maale ja seal läheb keset päeva pimedaks. Kuu tee on umbes 5 kraadi viltu, nii et tavaliselt läheb Kuu noorkuu ajal Päikesest kõrgemalt või madalamalt mööda. Varjutuste aeg tuleb umbes iga poole aasta tagant. Pildil on osaline päikesevarjutus 10. juunil 2021.',
        en: 'The Moon\'s shadow falls on the Earth, and there it gets dark in the middle of the day. The Moon\'s path is tilted by about 5 degrees, so at new moon it usually passes above or below the Sun. Eclipse season comes about every six months. The picture shows a partial solar eclipse on 10 June 2021.'
      }
    },
    {
      eclipse: 'lunar',
      ask: {
        et: 'Tee kuuvarjutus: pane Kuu Maa varju. Seegi õnnestub ainult varjutuste ajal.',
        en: 'Make a lunar eclipse: put the Moon in the Earth\'s shadow. This too only works in eclipse season.'
      },
      fact: {
        et: 'Kuu ei kao ära, vaid muutub vaskpunaseks. Maa õhk painutab natuke Päikese valgust Kuu peale ja see valgus on punane nagu päikeseloojangul. Päikese- ja kuuvarjutus tulevad tihti paarikaupa, kahenädalase vahega.',
        en: 'The Moon does not disappear but turns copper red. The Earth\'s air bends a little sunlight onto the Moon, and that light is red like a sunset. Solar and lunar eclipses often come in pairs, two weeks apart.'
      }
    }
  ];

  const TEXT = {
    et: {
      title: 'Kuu faasid',
      fromSpace: 'Vaade kosmosest, põhjapooluse kohalt',
      fromEarth: 'Maalt vaadates',
      weSee: 'pool, mida näeme Maalt',
      higher: 'Kuu tee kõrgem pool',
      lower: 'Kuu tee madalam pool',
      season: '⭐ Varjutuste aeg',
      sun: 'Päike',
      next: 'Edasi',
      right: 'Õige! 🎉',
      missSolar: 'Kuu läks Päikesest mööda. Oota varjutuste aega!',
      missLunar: 'Kuu läks Maa varjust mööda. Oota varjutuste aega!',
      taskBtn: 'Ülesanne',
      later: 'Peida ülesanne',
      solar: 'päikesevarjutus',
      lunar: 'kuuvarjutus',
      age: (d) => `Noorkuust möödas ${d} ${d === 1 ? 'päev' : 'päeva'}`,
      wellDone: 'Tubli!',
      allSolved: `Lahendasid kõik ${TASKS.length} ülesannet!`,
      winFact: 'Kuu ise on alati pooleldi valgustatud. Tema kuju muutub sellepärast, et me näeme Maalt iga päev erinevat osa tema valgustatud poolest.',
      moonCredit: 'Foto: Tõrva Astronoomiaklubi (AstroBin)',
      eclipseCredit: 'Foto: Tõrva Astronoomiaklubi',
      again: 'Uuesti',
      allGames: 'Kõik mängud',
      run: 'Käivita',
      hint: 'Vihje',
      sound: 'Heli',
      credit: 'Fotod: Tõrva Astronoomiaklubi (AstroBin), litsents CC BY-NC-SA.'
    },
    en: {
      title: 'Moon Phases',
      fromSpace: 'View from space, above the North Pole',
      fromEarth: 'Seen from the Earth',
      weSee: 'the side we see from the Earth',
      higher: 'higher half of the Moon\'s path',
      lower: 'lower half of the Moon\'s path',
      season: '⭐ Eclipse season',
      sun: 'Sun',
      next: 'Next',
      right: 'Correct! 🎉',
      missSolar: 'The Moon passed by the Sun. Wait for eclipse season!',
      missLunar: 'The Moon passed by the Earth\'s shadow. Wait for eclipse season!',
      taskBtn: 'Task',
      later: 'Hide the task',
      solar: 'solar eclipse',
      lunar: 'lunar eclipse',
      age: (d) => `${d} ${d === 1 ? 'day' : 'days'} since new moon`,
      wellDone: 'Well done!',
      allSolved: `You solved all ${TASKS.length} tasks!`,
      winFact: 'Half of the Moon is always lit. Its shape changes because every day we see a different part of the lit half from the Earth.',
      moonCredit: 'Photo: Tõrva Astronoomiaklubi (AstroBin)',
      eclipseCredit: 'Photo: Tõrva Astronoomiaklubi',
      again: 'Again',
      allGames: 'All games',
      run: 'Play',
      hint: 'Hint',
      sound: 'Sound',
      credit: 'Photos: Tõrva Astronoomiaklubi (AstroBin), licence CC BY-NC-SA.'
    }
  };

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const state = {
    angle: 300,
    total: 0,           // degrees the Moon has gone round, for the nodes
    node: NODE0,        // the angle of a node from the Sun's direction
    nodeShift: 0,       // added to the nodes when the eclipse task starts
    dragging: false,
    running: false,     // ▶ plays a month
    open: true,         // the task card is shown; the child can fold it away and just explore
    task: 0,
    target: 0,          // the angle of the picture task
    solved: false,      // the task is done and its fact is showing
    hintUntil: 0
  };

  const t = (key) => TEXT[Astro.lang][key];
  const norm = (a) => ((a % 360) + 360) % 360;
  const signed = (a) => norm(a + 180) - 180;   // -180 … 180
  const dist = (a, b) => Math.abs(signed(a - b));
  const rad = (a) => (a * Math.PI) / 180;

  function phaseOf(a) {
    a = norm(a);
    if (a < 10 || a > 350) return 0;
    if (a < 80) return 1;
    if (a <= 100) return 2;
    if (a < 170) return 3;
    if (a <= 190) return 4;
    if (a < 260) return 5;
    if (a <= 280) return 6;
    return 7;
  }
  // How far the Moon is above (+) or below the plane of the Earth's path.
  const lat = (a) => TILT * Math.sin(rad(a - state.node));
  // How far apart the Moon and the Sun, and the Moon and the Earth's shadow,
  // look from the Earth, in Moon radii. The Sun is a Moon wide and the
  // shadow 2.6 Moons, so they touch at 2 and 3.6. The sideways distance is
  // not to scale, so that the Sun comes into view a few degrees from new moon.
  const sunSep = (a) => Math.hypot(signed(a) * 0.4, (lat(a) / SOLAR_LIM) * 2);
  const shadowSep = (a) => Math.hypot(signed(a - 180) * 0.6, (lat(a) / LUNAR_LIM) * 3.6);
  const isSeason = () => dist(state.node, 0) < SEASON || dist(state.node, 180) < SEASON;

  function nameOf(a) {
    if (sunSep(a) < 2) return t('solar');
    if (shadowSep(a) < 3.6) return t('lunar');
    return PHASES[phaseOf(a)][Astro.lang];
  }

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // ---------------------------------------------------------------------------
  // The Moon as seen from the Earth: the club's photo, lit by a mask
  // ---------------------------------------------------------------------------

  // The lit part of a disc of radius R. Seen from the north, a waxing Moon
  // (0 … 180) is lit on the right and a waning one on the left. The
  // terminator is half an ellipse with the half-width R·|cos a|.
  function litPath(a, R) {
    a = norm(a);
    const c = Math.cos(rad(a));
    const rx = (R * Math.abs(c)).toFixed(2);
    if (a <= 180) return `M0 ${-R}A${R} ${R} 0 0 1 0 ${R}A${rx} ${R} 0 0 ${c > 0 ? 0 : 1} 0 ${-R}Z`;
    return `M0 ${-R}A${R} ${R} 0 0 0 0 ${R}A${rx} ${R} 0 0 ${c > 0 ? 1 : 0} 0 ${-R}Z`;
  }

  // Draws a Moon of radius 80 into an svg with the viewBox around 0,0 and
  // returns a function that shows it at an angle. With sky, the Sun behind
  // it (solar eclipse) and the Earth's shadow on it (lunar eclipse) are shown,
  // above or below it as the tilt of its path makes them.
  let uid = 0;
  function moonView(svg, sky) {
    const id = 'mv' + uid++;
    const R = 80;
    const S = (R * 1200) / 535;   // the photo, scaled so that its Moon has radius R
    const img = `<image href="../pusle/images/moon.jpg" x="${-S / 2}" y="${-S / 2}" width="${S}" height="${S}"`;
    svg.innerHTML = `
      <defs>
        <clipPath id="${id}c"><circle r="${R}"/></clipPath>
        <filter id="${id}g"><feColorMatrix type="saturate" values="0.45"/></filter>
        <filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter>
        <filter id="${id}u" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
        <mask id="${id}m"><path class="lit" fill="#fff" filter="url(#${id}b)"/></mask>
        <radialGradient id="${id}s"><stop offset="0" stop-color="#fff6d0"/><stop offset="0.7" stop-color="#ffc24a"/><stop offset="1" stop-color="#ff9a1c"/></radialGradient>
        <radialGradient id="${id}k"><stop offset="0.4" stop-color="#fff" stop-opacity="0.9"/><stop offset="0.55" stop-color="#cfe6ff" stop-opacity="0.45"/><stop offset="1" stop-color="#cfe6ff" stop-opacity="0"/></radialGradient>
      </defs>
      ${sky ? `<g class="sun"><circle class="corona" r="${R * 2}" fill="url(#${id}k)"/><circle r="${R}" fill="url(#${id}s)"/></g>` : ''}
      <circle r="${R}" fill="#06070f"/>
      <g clip-path="url(#${id}c)">
        ${img} class="earthshine" filter="url(#${id}g)"/>
        ${img} mask="url(#${id}m)" filter="url(#${id}g)"/>
        ${sky ? `<circle class="umbra" r="${R * 2.6}" fill="#a8441e" filter="url(#${id}u)" style="mix-blend-mode:multiply"/>` : ''}
      </g>`;
    const lit = svg.querySelector('.lit');
    const sun = svg.querySelector('.sun');
    const corona = svg.querySelector('.corona');
    const umbra = svg.querySelector('.umbra');
    const earthshine = svg.querySelector('.earthshine');

    return (a) => {
      lit.setAttribute('d', litPath(a, R));
      // The dark part glows faintly with light from the Earth, but not near
      // new moon, when the Moon is lost in the Sun's glare.
      const d = signed(a);
      earthshine.setAttribute('opacity', (0.13 * clamp((Math.abs(d) - 6) / 14, 0, 1)).toFixed(3));
      if (!sky) return;
      // Near new moon the Sun is behind the Moon: to the right of it after
      // new moon, as the Moon then is east of the Sun, and below it when the
      // Moon is higher. When it misses, the Sun peeks out above or below.
      const b = lat(a);
      sun.style.display = Math.abs(d) < 7 ? '' : 'none';
      sun.setAttribute('opacity', clamp((7 - Math.abs(d)) / 2, 0, 1).toFixed(2));
      sun.setAttribute('transform', `translate(${(d * 0.4 * R).toFixed(2)} ${(clamp((b / SOLAR_LIM) * 2, -2.3, 2.3) * R).toFixed(2)})`);
      corona.setAttribute('opacity', clamp(1 - sunSep(a) / 0.25, 0, 1).toFixed(2));
      // Near full moon the Earth's shadow, 2.6 Moons wide, crosses the Moon
      // from west to east, or passes above or below it.
      const e = signed(a - 180);
      umbra.style.display = Math.abs(e) < 7 ? '' : 'none';
      umbra.setAttribute('cx', (e * 0.6 * R).toFixed(2));
      umbra.setAttribute('cy', (clamp((b / LUNAR_LIM) * 3.6, -4, 4) * R).toFixed(2));
    };
  }

  // ---------------------------------------------------------------------------
  // The view from space: the Sun's light from the right, the Earth in the
  // middle and the Moon on its path, not to scale
  // ---------------------------------------------------------------------------

  const ORBIT = 82;
  const EARTH = 18;
  const MOON = 10;
  const space = $('space');
  const sp = {};

  function buildSpace() {
    space.innerHTML = `
      <defs>
        <radialGradient id="ocean" cx="0.6" cy="0.45" r="0.6"><stop offset="0" stop-color="#5fb4ff"/><stop offset="1" stop-color="#1b4fa8"/></radialGradient>
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
      </defs>`;
    // shadows: the Earth's goes far behind it, the Moon's tapers to a point
    // that just reaches the Earth
    el('polygon', { class: 'shadow', points: `0,${-EARTH} 0,${EARTH} -600,${EARTH - 6} -600,${-EARTH + 6}`, filter: 'url(#soft)' }, space);
    sp.moonShadow = el('polygon', { class: 'shadow', filter: 'url(#soft)' }, space);
    // the Moon's path: the higher half bright, the lower half faint, and the
    // nodes where they meet
    sp.nodeLine = el('line', { class: 'node-line' }, space);
    sp.orbitUp = el('path', { class: 'orbit up' }, space);
    sp.orbitDown = el('path', { class: 'orbit down' }, space);
    sp.nodes = [0, 1].map(() => el('circle', { class: 'node', r: 2.8 }, space));
    for (let i = 0; i < 4; i++) {
      // little arrows showing that the Moon goes round anticlockwise
      const a = 45 + i * 90;
      el('path', { class: 'arrow', d: 'M-4 -4L3 0L-4 4', transform: `rotate(${-a}) translate(${ORBIT} 0) rotate(-90)` }, space);
    }
    sp.hint = el('circle', { class: 'hint-spot', r: MOON + 6 }, space);
    sp.sight = el('line', { class: 'sight' }, space);

    const earth = el('g', { class: 'earth' }, space);
    el('circle', { r: EARTH, fill: 'url(#ocean)' }, earth);
    // land round the edge and the Arctic ice in the middle, roughly as seen
    // from above the North Pole
    el('path', { d: 'M-17 -5C-12 -12 -4 -16 4 -17C2 -12 -3 -9 -8 -7C-11 -3 -14 0 -17 -5Z', fill: '#5a9e46' }, earth);
    el('path', { d: 'M9 -15C14 -11 17 -4 17 3C13 4 11 -2 8 -6C6 -9 6 -12 9 -15Z', fill: '#5a9e46' }, earth);
    el('path', { d: 'M-6 16C-2 12 4 11 9 13C6 16 1 18 -6 16Z', fill: '#5a9e46' }, earth);
    el('path', { d: 'M-4 -4C-1 -6 3 -5 4 -2C6 1 3 4 0 4C-3 5 -6 2 -4 -4Z', fill: '#f4f8ff', opacity: 0.9 }, earth);
    el('path', { d: `M0 ${-EARTH}A${EARTH} ${EARTH} 0 0 0 0 ${EARTH}Z`, fill: '#020414', opacity: 0.62 }, earth);
    sp.you = el('circle', { class: 'you', r: 2.6 }, space);

    sp.moon = el('g', { class: 'moon' }, space);
    el('circle', { r: MOON, fill: '#3a3f58' }, sp.moon);
    el('path', { d: `M0 ${-MOON}A${MOON} ${MOON} 0 0 1 0 ${MOON}Z`, fill: '#ecebe4' }, sp.moon);
    sp.red = el('circle', { r: MOON, fill: '#a8441e', opacity: 0 }, sp.moon);
    sp.rim = el('path', { class: 'rim' }, space);
  }

  function updateSpace() {
    const a = state.angle;
    const x = ORBIT * Math.cos(rad(a));
    const y = -ORBIT * Math.sin(rad(a));
    sp.moon.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    // the Moon's shadow just reaches the Earth only when it does not pass
    // above or below it
    const reach = ORBIT - EARTH + 3 - 16 * clamp(Math.abs(lat(a)) / SOLAR_LIM - 1, 0, 1);
    sp.moonShadow.setAttribute('points', `${x},${y - MOON} ${x},${y + MOON} ${x - reach},${y}`);
    sp.red.setAttribute('opacity', (0.75 * clamp((3.6 - shadowSep(a)) / 2, 0, 1)).toFixed(2));
    const at = (n) => `${(ORBIT * Math.cos(rad(n))).toFixed(2)} ${(-ORBIT * Math.sin(rad(n))).toFixed(2)}`;
    const n = state.node;
    // each half as two quarters: an arc between two opposite points would
    // wobble, as rounding moves its centre a little off the Earth
    const half = (from) => `M${at(from)}A${ORBIT} ${ORBIT} 0 0 0 ${at(from + 90)}A${ORBIT} ${ORBIT} 0 0 0 ${at(from + 180)}`;
    sp.orbitUp.setAttribute('d', half(n));
    sp.orbitDown.setAttribute('d', half(n + 180));
    sp.nodeLine.setAttribute('x1', ORBIT * Math.cos(rad(n)));
    sp.nodeLine.setAttribute('y1', -ORBIT * Math.sin(rad(n)));
    sp.nodeLine.setAttribute('x2', -ORBIT * Math.cos(rad(n)));
    sp.nodeLine.setAttribute('y2', ORBIT * Math.sin(rad(n)));
    sp.nodes.forEach((c, i) => {
      c.setAttribute('cx', ORBIT * Math.cos(rad(n + 180 * i)));
      c.setAttribute('cy', -ORBIT * Math.sin(rad(n + 180 * i)));
    });
    $('season').classList.toggle('hidden', !isSeason());
    // the half of the Moon that faces the Earth, and the line of sight to it
    const ux = -Math.cos(rad(a));
    const uy = Math.sin(rad(a));
    const r = MOON + 3;
    const p = (s) => `${(x + r * (ux * Math.cos(s) - uy * Math.sin(s))).toFixed(2)} ${(y + r * (ux * Math.sin(s) + uy * Math.cos(s))).toFixed(2)}`;
    sp.rim.setAttribute('d', `M${p(-Math.PI / 2)}A${r} ${r} 0 0 1 ${p(Math.PI / 2)}`);
    sp.you.setAttribute('cx', (-ux * EARTH).toFixed(2));
    sp.you.setAttribute('cy', (-uy * EARTH).toFixed(2));
    sp.sight.setAttribute('x1', (-ux * EARTH).toFixed(2));
    sp.sight.setAttribute('y1', (-uy * EARTH).toFixed(2));
    sp.sight.setAttribute('x2', (x + ux * r).toFixed(2));
    sp.sight.setAttribute('y2', (y + uy * r).toFixed(2));
  }

  // ---------------------------------------------------------------------------
  // Showing the angle
  // ---------------------------------------------------------------------------

  const showView = moonView($('view'), true);
  const showTarget = moonView($('target'), false);

  function update() {
    updateSpace();
    showView(state.angle);
    $('phaseName').textContent = nameOf(state.angle);
    const a = norm(state.angle);
    const days = Math.round((a / 360) * MONTH) % 30;
    $('phaseInfo').textContent = t('age')(days);
    const hint = state.open && performance.now() < state.hintUntil;
    sp.hint.style.display = hint ? '' : 'none';
    if (hint) {
      sp.hint.setAttribute('cx', ORBIT * Math.cos(rad(state.target)));
      sp.hint.setAttribute('cy', -ORBIT * Math.sin(rad(state.target)));
    }
  }

  // ---------------------------------------------------------------------------
  // Dragging the Moon
  // ---------------------------------------------------------------------------

  const nodeNow = () => norm(NODE0 + state.nodeShift - (NODE_STEP * state.total) / 360);

  let lastPhase = -1;
  function setAngle(a) {
    // the nodes turn as the months go by, forwards or back
    state.total += signed(a - state.angle);
    state.node = nodeNow();
    state.angle = norm(a);
    const ph = phaseOf(state.angle);
    if (ph !== lastPhase && lastPhase !== -1 && state.dragging) sfx.note(ph);
    lastPhase = ph;
    update();
  }

  function pointAngle(ev) {
    const pt = space.createSVGPoint();
    pt.x = ev.clientX;
    pt.y = ev.clientY;
    const p = pt.matrixTransform(space.getScreenCTM().inverse());
    if (Math.hypot(p.x, p.y) < EARTH) return null;
    return (Math.atan2(-p.y, p.x) * 180) / Math.PI;
  }

  space.addEventListener('pointerdown', (ev) => {
    if (state.solved) return;
    const a = pointAngle(ev);
    if (a === null) return;
    space.setPointerCapture(ev.pointerId);
    state.dragging = true;
    stopRun();
    if (state.open) $('feedback').textContent = '';
    sfx.pick();
    setAngle(a);
  });
  space.addEventListener('pointermove', (ev) => {
    if (!state.dragging) return;
    const a = pointAngle(ev);
    if (a !== null) setAngle(a);
  });
  const release = () => {
    if (!state.dragging) return;
    state.dragging = false;
    if (state.open) check();
  };
  space.addEventListener('pointerup', release);
  space.addEventListener('pointercancel', release);

  // ---------------------------------------------------------------------------
  // ▶ plays a month
  // ---------------------------------------------------------------------------

  let runRaf = 0;
  function startRun() {
    state.running = true;
    $('runBtn').textContent = '⏸️';
    let prev = performance.now();
    cancelAnimationFrame(runRaf);
    (function frame(now) {
      setAngle(state.angle + ((now - prev) / 1000) * (360 / MONTH_S));
      prev = now;
      if (state.running) runRaf = requestAnimationFrame(frame);
    })(prev);
  }
  function stopRun() {
    state.running = false;
    cancelAnimationFrame(runRaf);
    $('runBtn').textContent = '▶️';
  }

  // ---------------------------------------------------------------------------
  // Tasks
  // ---------------------------------------------------------------------------

  function taskTarget(task) {
    if (task.pic) return state.target;
    if (task.eclipse) return task.eclipse === 'solar' ? 0 : 180;
    return PHASES[task.phase].at;
  }

  function showTask() {
    const task = TASKS[state.task];
    if (task.pic) {
      state.target = Math.round(rand(task.pic[0], task.pic[1]));
      showTarget(state.target);
    } else {
      state.target = taskTarget(task);
    }
    state.solved = false;
    if (task.eclipse === 'solar') holdOffSeason();
    $('target').classList.toggle('hidden', !task.pic);
    $('fact').classList.add('hidden');
    $('feedback').textContent = '';
    showTaskText();
    updateProgress();
    update();
  }

  // When the solar eclipse task starts, the nodes turn so that the next new
  // moon passes by the Sun and the one after it, one or two months away,
  // makes an eclipse, with a lunar eclipse two weeks later.
  const ECLIPSE_NODE = 7;   // the nodes at that second new moon
  function holdOffSeason() {
    const ahead = norm(-state.angle) || 360;   // degrees to the next new moon
    const next = state.node - (NODE_STEP * ahead) / 360;
    const want = ECLIPSE_NODE + NODE_STEP;
    let delta = signed(want - next);
    if (Math.abs(delta) > 90) delta = signed(want + 180 - next);
    const from = state.nodeShift;
    const to = from + delta;
    const t0 = performance.now();
    (function step(now) {
      const k = clamp((now - t0) / 1200, 0, 1);
      state.nodeShift = from + (to - from) * k * k * (3 - 2 * k);
      state.node = nodeNow();
      update();
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  function showTaskText() {
    const task = TASKS[state.task];
    $('ask').textContent = task.ask[Astro.lang];
    $('factText').textContent = task.fact[Astro.lang];
  }

  // Called when the Moon is let go. A wrong place is not named, as the child
  // may just be exploring, but a new or full moon without an eclipse is.
  function check() {
    const task = TASKS[state.task];
    const a = state.angle;
    let ok;
    let msg = '';
    if (task.eclipse === 'solar') {
      ok = sunSep(a) < 2;
      if (!ok && dist(a, 0) < 10) msg = t('missSolar');
    } else if (task.eclipse === 'lunar') {
      ok = shadowSep(a) < 3.6;
      if (!ok && dist(a, 180) < 10) msg = t('missLunar');
    } else if (task.pic) {
      ok = dist(a, state.target) < 15;
    } else {
      ok = phaseOf(a) === task.phase;
    }
    if (!ok) {
      $('feedback').textContent = msg;
      return;
    }
    // a picture snaps exactly into place, and an eclipse too if it is
    // still there
    const snap = taskTarget(task);
    if (task.pic) setAngle(snap);
    else if (task.eclipse && (task.eclipse === 'solar' ? sunSep(snap) < 2 : shadowSep(snap) < 3.6)) setAngle(snap);
    state.solved = true;
    $('feedback').textContent = t('right');
    $('factPic').classList.toggle('hidden', !task.photo);
    $('fact').classList.remove('hidden');
    sfx.snap();
    updateProgress();
    update();
  }

  function next() {
    sfx.pick();
    if (state.task + 1 < TASKS.length) {
      state.task++;
      showTask();
    } else {
      win();
    }
  }

  function updateProgress() {
    const done = state.task + (state.solved ? 1 : 0);
    $('progressFill').style.width = (100 * done) / TASKS.length + '%';
    $('progressText').textContent = `⭐ ${done} / ${TASKS.length}`;
  }

  // Folds the task card away to just explore, or brings it back.
  function toggleTask() {
    if (state.solved) return;
    sfx.pick();
    state.open = !state.open;
    $('feedback').textContent = '';
    updateTaskCard();
    update();
  }

  function updateTaskCard() {
    $('task').classList.toggle('hidden', !state.open);
    $('hintBtn').classList.toggle('hidden', !state.open);
    $('taskBtn').classList.toggle('off', !state.open);
    fitTaskCard();
  }

  // Makes the task card as tall as the tallest task with the longest
  // message, so that the views below do not change size during play.
  function fitTaskCard() {
    const card = $('task');
    if (card.classList.contains('hidden')) return;
    const ask = $('ask');
    const feedback = $('feedback');
    const target = $('target');
    const saved = [ask.textContent, feedback.textContent, target.classList.contains('hidden')];
    const msgs = [t('right'), t('missSolar'), t('missLunar')];
    card.style.minHeight = '';
    target.classList.remove('hidden');
    // (the emoji makes a line a little taller)
    feedback.textContent = msgs.reduce((a, b) => (b.length > a.length ? b : a)) + ' 🎉';
    let h = 0;
    for (const task of TASKS) {
      ask.textContent = task.ask[Astro.lang];
      h = Math.max(h, Math.ceil(card.getBoundingClientRect().height));
    }
    [ask.textContent, feedback.textContent] = saved;
    target.classList.toggle('hidden', saved[2]);
    card.style.minHeight = h + 'px';
  }

  // ---------------------------------------------------------------------------
  // Game
  // ---------------------------------------------------------------------------

  function startGame() {
    stopRun();
    Astro.stopConfetti($('confetti'));
    $('win').classList.add('hidden');
    updateToggles();
    $('fact').classList.add('hidden');
    state.angle = 300;
    state.total = 0;
    state.node = NODE0;
    state.nodeShift = 0;
    state.dragging = false;
    state.solved = false;
    state.hintUntil = 0;
    state.open = true;
    state.task = 0;
    lastPhase = -1;
    updateTaskCard();
    showTask();
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // Shows where the Moon should go for a moment.
  function hint() {
    if (state.solved) return;
    sfx.pick();
    state.hintUntil = performance.now() + 1600;
    update();
    setTimeout(update, 1650);
  }

  function win() {
    $('fact').classList.add('hidden');
    sfx.win();
    $('win').classList.remove('hidden');
    Astro.startConfetti($('confetti'));
  }

  // ---------------------------------------------------------------------------
  // Buttons
  // ---------------------------------------------------------------------------

  $('againBtn').addEventListener('click', startGame);
  $('nextBtn').addEventListener('click', next);
  $('hintBtn').addEventListener('click', hint);
  $('taskBtn').addEventListener('click', toggleTask);
  $('laterBtn').addEventListener('click', toggleTask);
  $('runBtn').addEventListener('click', () => {
    sfx.pick();
    if (state.running) stopRun();
    else startRun();
  });
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  buildSpace();
  Astro.setupLanguage(TEXT, () => {
    showTaskText();
    fitTaskCard();
    update();
  });
  window.addEventListener('resize', fitTaskCard);
  // measured again with the right font
  if (document.fonts) document.fonts.ready.then(fitTaskCard);
  startGame();
})();
