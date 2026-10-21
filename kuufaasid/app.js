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

  // Tasks: the four main phases, the phases in between from a picture (a
  // random angle in the range), both not in the order they come, and last a
  // solar and a lunar eclipse, which need eclipse season. All of them are
  // shown as a row of goals in the top bar, and the current one in the view
  // from the Earth with a short text (ask) and maybe a tip. A task is solved
  // when the Moon is let go in the right place, and then its fact is shown.
  const TASKS = [
    {
      phase: 4,
      ask: { et: 'Leia täiskuu', en: 'Find a full moon' },
      tip: { et: 'Lohista Kuud ümber Maa', en: 'Drag the Moon round the Earth' },
      fact: {
        et: 'Täiskuu ajal on Kuu Päikesest vastassuunas. Päike valgustab kogu Kuu poolt, mis on meie poole. Täiskuu tõuseb õhtul, kui Päike loojub, ja on kõige kõrgemal keskööl.',
        en: 'At full moon, the Moon is on the other side of the Earth from the Sun. The Sun lights all of the side that faces us. A full moon rises in the evening as the Sun sets, and is highest at midnight.'
      }
    },
    {
      phase: 2,
      ask: { et: 'Leia esimene veerand', en: 'Find a first quarter' },
      fact: {
        et: 'Kuu on teinud veerandi tiirust ümber Maa ja noorkuust on möödas umbes nädal. Kuu on ise alati pooleldi valgustatud, aga nüüd näeme valgustatud poolest ainult poolt.',
        en: 'The Moon has gone a quarter of the way round the Earth, about a week after new moon. Half of the Moon is always lit, but now we see only half of the lit half.'
      }
    },
    {
      phase: 0,
      ask: { et: 'Leia noorkuu', en: 'Find a new moon' },
      fact: {
        et: 'Noorkuu ajal on Kuu Maa ja Päikese vahel. Tema valgustatud pool on Päikese poole ja meie poole jääb tume pool. Kuu on siis päeval taevas koos Päikesega ning Päikese sära varjab ta ära.',
        en: 'At new moon, the Moon is between the Earth and the Sun. Its lit side faces the Sun, and its dark side faces us. The Moon is then in the daytime sky with the Sun, hidden in its glare.'
      }
    },
    {
      phase: 6,
      ask: { et: 'Leia viimane veerand', en: 'Find a last quarter' },
      fact: {
        et: 'Täiskuust on möödas umbes nädal. Viimane veerand tõuseb keskööl ja on hommikul kõrgel taevas, nii et seda näeb ka koolimineku ajal.',
        en: 'About a week has passed since full moon. The last quarter rises at midnight and is high in the sky in the morning, so you can see it on your way to school.'
      }
    },
    {
      pic: [210, 240],
      ask: { et: 'Leia selline Kuu', en: 'Find a Moon like this' },
      fact: {
        et: 'See on kahanev kuu. Iga päevaga liigub Kuu oma teel ümber Maa umbes 12 kraadi edasi, nii et ta tõuseb iga päev umbes 50 minutit hiljem.',
        en: 'This is a waning gibbous Moon. Every day the Moon moves about 12 degrees further round the Earth, so it rises about 50 minutes later each day.'
      }
    },
    {
      pic: [30, 60],
      ask: { et: 'Leia selline Kuu', en: 'Find a Moon like this' },
      fact: {
        et: 'See on kasvav kuusirp. Seda näeb õhtul läänes, varsti pärast päikeseloojangut. Vahel paistab nõrgalt ka Kuu tume osa: sinna jõuab valgus, mis on peegeldunud Maalt.',
        en: 'This is a waxing crescent. You can see it in the west in the evening, soon after sunset. Sometimes the dark part glows faintly too: it is lit by sunlight reflected from the Earth.'
      }
    },
    {
      pic: [300, 330],
      ask: { et: 'Leia selline Kuu', en: 'Find a Moon like this' },
      fact: {
        et: 'See on kahanev kuusirp. Seda näeb varahommikul idas, enne päikesetõusu. Mõne päeva pärast on jälle noorkuu ja kõik algab otsast peale. Noorkuust noorkuuni kulub 29 ja pool päeva.',
        en: 'This is a waning crescent. You can see it in the east early in the morning, before sunrise. In a few days there will be a new moon again, and it all starts over. From one new moon to the next takes 29 and a half days.'
      }
    },
    {
      pic: [120, 150],
      ask: { et: 'Leia selline Kuu', en: 'Find a Moon like this' },
      fact: {
        et: 'See on kasvav kuu: valgustatud on rohkem kui pool, aga täiskuuni on veel mõni päev. Teda näeb juba pärastlõunal, kui Päike on veel taevas.',
        en: 'This is a waxing gibbous Moon: more than half is lit, but full moon is still a few days away. You can see it already in the afternoon, while the Sun is still up.'
      }
    },
    {
      eclipse: 'solar',
      photo: true,
      ask: { et: 'Leia päikesevarjutus', en: 'Find a solar eclipse' },
      fact: {
        et: 'Kuu katab Päikese osaliselt või tervenisti. Tavaliselt läheb Kuu Päikesest mööda, sest tema orbiit on veidi viltu. Pildil on osaline päikesevarjutus 10. juunil 2021.',
        en: 'The Moon covers the Sun partly or completely. Usually the Moon passes by the Sun, because its orbit is a little tilted. The picture shows a partial solar eclipse on 10 June 2021.'
      }
    },
    {
      eclipse: 'lunar',
      ask: { et: 'Leia kuuvarjutus', en: 'Find a lunar eclipse' },
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
      season: '⭐ Varjutuste aeg',
      sun: 'Päike',
      next: 'Edasi',
      right: 'Õige! 🎉',
      missSolar: 'Kuu läks Päikesest mööda. Oota varjutuste aega!',
      missLunar: 'Kuu läks Maa varjust mööda. Oota varjutuste aega!',
      solar: 'päikesevarjutus',
      lunar: 'kuuvarjutus',
      age: (d) => `Noorkuust möödas ${d} ${d === 1 ? 'päev' : 'päeva'}`,
      wellDone: 'Tubli!',
      allSolved: `Lahendasid kõik ${TASKS.length} ülesannet!`,
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
      season: '⭐ Eclipse season',
      sun: 'Sun',
      next: 'Next',
      right: 'Correct! 🎉',
      missSolar: 'The Moon passed by the Sun. Wait for eclipse season!',
      missLunar: 'The Moon passed by the Earth\'s shadow. Wait for eclipse season!',
      solar: 'solar eclipse',
      lunar: 'lunar eclipse',
      age: (d) => `${d} ${d === 1 ? 'day' : 'days'} since new moon`,
      wellDone: 'Well done!',
      allSolved: `You solved all ${TASKS.length} tasks!`,
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
    task: 0,
    targets: [],        // the angle of each task, random for a picture
    target: 0,          // … of the current task
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

  // A goal's picture: the Moon at the angle, with a faint rim so that a new
  // moon shows too, or the Sun covered by the Moon, or the Moon in the
  // Earth's shadow.
  function drawGoal(svg, task, a) {
    if (task.eclipse === 'solar') {
      const id = 'gs' + uid++;
      svg.innerHTML = `
        <defs><radialGradient id="${id}"><stop offset="0.45" stop-color="#fff" stop-opacity="0.95"/><stop offset="0.6" stop-color="#cfe6ff" stop-opacity="0.5"/><stop offset="1" stop-color="#cfe6ff" stop-opacity="0"/></radialGradient></defs>
        <circle r="100" fill="url(#${id})"/>
        <circle r="56" fill="#ffc24a"/>
        <circle cx="8" cy="-5" r="56" fill="#06070f"/>`;
      return;
    }
    moonView(svg, false)(task.eclipse === 'lunar' ? 180 : a);
    if (task.eclipse === 'lunar') el('circle', { r: 80, fill: '#a8441e', opacity: 0.8, style: 'mix-blend-mode:multiply' }, svg);
    el('circle', { r: 80, fill: 'none', stroke: 'rgba(255,255,255,0.25)', 'stroke-width': 3 }, svg);
  }

  function update() {
    updateSpace();
    showView(state.angle);
    $('phaseName').textContent = nameOf(state.angle);
    const a = norm(state.angle);
    const days = Math.round((a / 360) * MONTH) % 30;
    $('phaseInfo').textContent = t('age')(days);
    $('phaseInfo').classList.toggle('hidden', state.solved);
    const hint = performance.now() < state.hintUntil;
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
    showFeedback('');
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
    check();
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
    if (task.eclipse) return task.eclipse === 'solar' ? 0 : 180;
    return PHASES[task.phase].at;
  }

  function showTask() {
    const task = TASKS[state.task];
    state.target = state.targets[state.task];
    state.solved = false;
    if (task.eclipse === 'solar') holdOffSeason();
    drawGoal($('goalPic'), task, state.target);
    $('fact').classList.add('hidden');
    showTaskText();
    updateGoals();
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
    showFeedback(state.solved ? t('right') : '');
  }

  // A message under the goal, or the task's tip.
  function showFeedback(msg) {
    const tip = TASKS[state.task].tip;
    $('feedback').textContent = msg || (tip ? tip[Astro.lang] : '');
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
      showFeedback(msg);
      return;
    }
    // a picture snaps exactly into place, and an eclipse too if it is
    // still there
    const snap = state.target;
    if (task.pic) setAngle(snap);
    else if (task.eclipse && (task.eclipse === 'solar' ? sunSep(snap) < 2 : shadowSep(snap) < 3.6)) setAngle(snap);
    state.solved = true;
    showFeedback(t('right'));
    $('factPic').classList.toggle('hidden', !task.photo);
    $('fact').classList.remove('hidden');
    sfx.snap();
    updateGoals();
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

  // The goals in the top bar: the current one ringed, the solved ones
  // with a star.
  function buildGoals() {
    const row = $('goals');
    row.innerHTML = '';
    TASKS.forEach((task, i) => {
      const g = document.createElement('span');
      g.className = 'goal-icon';
      drawGoal(el('svg', { viewBox: '-100 -100 200 200' }, g), task, state.targets[i]);
      row.appendChild(g);
    });
  }

  function updateGoals() {
    [...$('goals').children].forEach((g, i) => {
      g.classList.toggle('done', i < state.task || (i === state.task && state.solved));
      g.classList.toggle('now', i === state.task && !state.solved);
    });
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
    state.task = 0;
    state.targets = TASKS.map((task) => (task.pic ? Math.round(rand(task.pic[0], task.pic[1])) : taskTarget(task)));
    lastPhase = -1;
    buildGoals();
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
  // Stopping ▶ is a guess, like letting go of the Moon.
  $('runBtn').addEventListener('click', () => {
    sfx.pick();
    if (state.running) {
      stopRun();
      if (!state.solved) check();
    } else {
      if (!state.solved) showFeedback('');
      startRun();
    }
  });
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });

  buildSpace();
  Astro.setupLanguage(TEXT, () => {
    showTaskText();
    update();
  });
  startGame();
})();
