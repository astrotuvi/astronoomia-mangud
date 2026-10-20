'use strict';

(() => {
  const { $, rand, clamp, shuffle, sfx } = Astro;
  const SVGNS = 'http://www.w3.org/2000/svg';

  // ---------------------------------------------------------------------------
  // Content
  // ---------------------------------------------------------------------------

  // Where to fly. The farther away, the more fuel tanks the rocket needs.
  // Photos by Tõrva Astronoomiaklubi (AstroBin, CC BY-NC-SA); Mars is drawn.
  const DESTS = [
    {
      id: 'moon',
      tanks: 1,
      file: '../pusle/images/moon.jpg',
      url: 'https://www.astrobin.com/oy5di6/',
      name: { et: 'Kuu', en: 'The Moon' },
      to: { et: 'Kuule', en: 'the Moon' },
      fact: {
        et: 'Kuu on meie kõige lähem naaber kosmoses. Päris astronaudid käisid Kuul juba üle 50 aasta tagasi.',
        en: 'The Moon is our closest neighbour in space. Real astronauts walked on the Moon more than 50 years ago.'
      }
    },
    {
      id: 'mars',
      tanks: 2,
      file: null, // drawn by drawMars()
      name: { et: 'Marss', en: 'Mars' },
      to: { et: 'Marsile', en: 'Mars' },
      fact: {
        et: 'Marss on punane planeet, sest seal on punane liiv. Marsil sõidavad ringi robotautod, mida kutsutakse kulguriteks.',
        en: 'Mars is the red planet, because it is covered in red sand. Robot cars called rovers drive around on Mars.'
      }
    },
    {
      id: 'jupiter',
      tanks: 3,
      file: '../pusle/images/jupiter.jpg',
      url: 'https://www.astrobin.com/gnc57p/',
      name: { et: 'Jupiter', en: 'Jupiter' },
      to: { et: 'Jupiterile', en: 'Jupiter' },
      fact: {
        et: 'Jupiter on kõige suurem planeet. Selle sisse mahuks üle tuhande Maa!',
        en: 'Jupiter is the biggest planet. More than a thousand Earths would fit inside it!'
      }
    },
    {
      id: 'saturn',
      tanks: 4,
      file: '../pusle/images/saturn.jpg',
      url: 'https://www.astrobin.com/fu9tbu/',
      name: { et: 'Saturn', en: 'Saturn' },
      to: { et: 'Saturnile', en: 'Saturn' },
      fact: {
        et: 'Saturnil on ilusad rõngad. Need on tehtud lugematutest jäätükkidest ja kivikestest.',
        en: 'Saturn has beautiful rings. They are made of countless pieces of ice and rock.'
      }
    }
  ];

  const WHOS = ['🐱', '🐶', '🐻', '🐰', '🧑‍🚀'];

  // Tapping a part of the rocket gives it the next colour.
  const COLORS = ['#ff5a5f', '#ff9f1c', '#ffd34d', '#3ccf7e', '#4fa3ff', '#a66bff', '#ff7eb6', '#f4f6ff', '#9aa3b5'];
  const DEFAULT_COLOR = { nose: 0, body: 7, tank: 4, engine: 8, fin: 0 };

  const TEXT = {
    et: {
      title: 'Kosmoserakett',
      intro: 'Ehita rakett ja lenda kosmosesse! Mida kaugemale lendad, seda rohkem kütusepaake on vaja. Puuduta raketi osa, et selle värvi muuta.',
      chooseDest: 'Kuhu lendame?',
      chooseWho: 'Kes lendab?',
      play: 'Ehita',
      launch: 'Start!',
      liftoff: 'Start!',
      wellDone: 'Tubli!',
      again: 'Uuesti',
      other: 'Uus sõit',
      menu: 'Menüü',
      allGames: 'Kõik mängud',
      sound: 'Heli',
      reset: 'Eemalda kõik 🌟',
      resetAsk: 'Kas eemaldada 🌟 kõigilt külastatud kohtadelt?',
      credit: 'Fotod: Tõrva Astronoomiaklubi (AstroBin), litsents CC BY-NC-SA.',
      photo: 'Foto: Tõrva Astronoomiaklubi (AstroBin)',
      orbiting: 'Tiirleme ümber Maa 🌍',
      off: (to) => `Lendame ${to}!`,
      sunTrip: 'Lendame ümber Päikese ☀️',
      cross: (of) => `Lendame üle ${of} orbiidi`,
      arrived: (who, to) => `${who} jõudis ${to}!`
    },
    en: {
      title: 'Space Rocket',
      intro: 'Build a rocket and fly into space! The farther you fly, the more fuel tanks you need. Tap a part of the rocket to change its colour.',
      chooseDest: 'Where shall we fly?',
      chooseWho: 'Who is flying?',
      play: 'Build',
      launch: 'Launch!',
      liftoff: 'Liftoff!',
      wellDone: 'Well done!',
      again: 'Again',
      other: 'New trip',
      menu: 'Menu',
      allGames: 'All games',
      sound: 'Sound',
      reset: 'Clear all 🌟',
      resetAsk: 'Remove the 🌟 from all the places you have visited?',
      credit: 'Photos: Tõrva Astronoomiaklubi (AstroBin), licence CC BY-NC-SA.',
      photo: 'Photo: Tõrva Astronoomiaklubi (AstroBin)',
      orbiting: 'Going round the Earth 🌍',
      off: (to) => `Off to ${to}!`,
      sunTrip: 'Flying round the Sun ☀️',
      cross: (of) => `Crossing the orbit of ${of}`,
      arrived: (who, to) => `${who} made it to ${to}!`
    }
  };

  const HINT_MS = 5000;   // idle time before the next empty spot starts to glow
  // the flight, in seconds
  const ASCENT = 3.8;     // from liftoff up into space
  const ZOOM = 1.6;       // the view zooms out until the whole Earth is seen
  const ORBIT = 3.4;      // one lap around the Earth
  const BURN = 2.0;       // burning one fuel tank on the way to the goal
  const CRUISE = 2.6;     // to the Moon: from the last burn to landing
  const LEAVE = 1.8;      // to a planet: the view zooms out to the Sun
  const ARRIVE = 2.6;     // to a planet: the view zooms in to the planet

  // The planets seen from above, for the trip to a planet. r is the size of
  // the orbit (not to scale, but in the right order), a0 where the planet is
  // when the trip starts, dot its size on the screen, and fill how much of
  // the photo the planet fills.
  const PLANETS = [
    { id: 'mercury', r: 1, a0: 2.0, dot: 0.008, color: '#b9b2a8' },
    { id: 'venus', r: 1.5, a0: 4.2, dot: 0.012, color: '#f3d9a0' },
    { id: 'earth', r: 2.1, dot: 0.016 },
    { id: 'mars', r: 2.8, a0: 1.0, dot: 0.012, color: '#d0602f', fill: 0.8, of: { et: 'Marsi', en: 'Mars' } },
    { id: 'jupiter', r: 4.7, a0: 5.0, dot: 0.026, color: '#d9b48a', fill: 0.8, of: { et: 'Jupiteri', en: 'Jupiter' } },
    { id: 'saturn', r: 6, a0: 3.0, dot: 0.022, color: '#e6cf98', fill: 0.4 }
  ];
  const BELT = [3.5, 4.0];  // the asteroid belt between Mars and Jupiter
  const planet = (id) => PLANETS.find((p) => p.id === id);

  // ---------------------------------------------------------------------------
  // Rocket parts
  // ---------------------------------------------------------------------------

  // Each part is drawn from its top centre, in units where the body is 100
  // wide. x0 is its left edge. Fins are drawn for the right side.
  const SHAPES = {
    nose: { x0: -50, w: 100, h: 120 },
    body: { x0: -50, w: 100, h: 150 },
    tank: { x0: -50, w: 100, h: 80 },
    engine: { x0: -40, w: 80, h: 60 },
    fin: { x0: 0, w: 45, h: 105 }
  };

  function darker(hex, f = 0.72) {
    const v = parseInt(hex.slice(1), 16);
    const c = [v >> 16, (v >> 8) & 255, v & 255].map((x) => Math.round(x * f));
    return `rgb(${c.join(',')})`;
  }

  // SVG for one part. who is the astronaut in the window, fuel how full a tank is.
  function partSVG(kind, ci, who, fuel = 1) {
    const c = COLORS[ci];
    const d = darker(c);
    const o = 'stroke="#1a1440" stroke-width="4.5" stroke-linejoin="round"';
    switch (kind) {
      case 'nose': {
        const p = 'M-50 120C-50 60-25 20 0 0C25 20 50 60 50 120Z';
        return `<path d="${p}" fill="${c}" ${o}/><path class="shine" d="${p}" fill="url(#shine)"/>` +
          `<rect x="-50" y="104" width="100" height="16" fill="${d}" ${o}/>`;
      }
      case 'body': {
        const rivets = [-36, -18, 0, 18, 36]
          .map((x) => `<circle cx="${x}" cy="10" r="2.6" fill="${d}"/><circle cx="${x}" cy="140" r="2.6" fill="${d}"/>`)
          .join('');
        return `<rect x="-50" y="0" width="100" height="150" fill="${c}" ${o}/>` +
          '<rect class="shine" x="-50" y="0" width="100" height="150" fill="url(#shine)"/>' + rivets +
          `<circle cx="0" cy="70" r="33" fill="#d6deea" ${o}/>` +
          '<circle cx="0" cy="70" r="24" fill="#7fd3ff" stroke="#1a1440" stroke-width="3"/>' +
          `<text class="who" x="0" y="72" font-size="34" text-anchor="middle" dominant-baseline="central">${who}</text>` +
          '<ellipse class="shine" cx="-10" cy="58" rx="8" ry="4.5" fill="#fff" opacity="0.6"/>';
      }
      case 'tank':
        return `<rect x="-50" y="0" width="100" height="80" fill="${c}" ${o}/>` +
          '<rect class="shine" x="-50" y="0" width="100" height="80" fill="url(#shine)"/>' +
          `<rect x="-50" y="0" width="100" height="12" fill="${d}" ${o}/>` +
          `<rect x="-50" y="68" width="100" height="12" fill="${d}" ${o}/>` +
          '<rect x="-30" y="26" width="60" height="28" rx="9" fill="#2a2350" stroke="#1a1440" stroke-width="3"/>' +
          `<rect class="fuel" x="-26" y="30" width="${52 * fuel}" height="20" rx="6" fill="#ffb21c"/>`;
      case 'engine':
        return `<path d="M-22 18L22 18L38 60L-38 60Z" fill="url(#metal)" ${o}/>` +
          `<rect x="-40" y="0" width="80" height="20" rx="4" fill="${c}" ${o}/>`;
      case 'fin':
        return `<path d="M0 0L45 50L45 105L0 65Z" fill="${c}" ${o}/>` +
          `<path d="M4 44L41 82" stroke="${d}" stroke-width="7" stroke-linecap="round"/>`;
    }
    return '';
  }

  // Spots for the parts, from the bottom up, in the order they are hinted.
  // ax, ay: where the part's top centre goes; the ground is at y = 0.
  function rocketSlots(n) {
    const slots = [{ kind: 'engine', ax: 0, ay: -60 }];
    for (let i = 0; i < n; i++) slots.push({ kind: 'tank', ax: 0, ay: -60 - 80 * (i + 1), tank: i });
    const top = -60 - 80 * n;
    slots.push({ kind: 'body', ax: 0, ay: top - 150 });
    slots.push({ kind: 'nose', ax: 0, ay: top - 270 });
    slots.push({ kind: 'fin', ax: 50, ay: -125, flip: 1 });
    slots.push({ kind: 'fin', ax: -50, ay: -125, flip: -1 });
    return slots.map((s) => ({ flip: 1, part: null, ...s }));
  }
  const rocketHeight = (n) => 330 + 80 * n;

  // The finished rocket as a picture (win screen).
  function rocketPicture(svg) {
    const n = state.dest.tanks;
    const h = rocketHeight(n);
    const order = [...state.slots].sort((a, b) => (a.kind === 'fin' ? -1 : 0) - (b.kind === 'fin' ? -1 : 0));
    svg.setAttribute('viewBox', `-110 ${-h - 10} 220 ${h + 20}`);
    svg.innerHTML = order
      .map((s) => `<g transform="translate(${s.ax} ${s.ay}) scale(${s.flip} 1)">${partSVG(s.kind, s.part.color, state.who)}</g>`)
      .join('');
  }

  // Smooth random values in 3D, added up at finer and finer scales, for
  // drawing the ground and the clouds of Mars and the Earth.
  function hash3(x, y, z) {
    let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function sstep(a, b, x) { return smooth(clamp((x - a) / (b - a), 0, 1)); }
  function noise3(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    const u = smooth(x - xi), v = smooth(y - yi), w = smooth(z - zi);
    const l = (a, b, t) => a + (b - a) * t;
    const h = (i, j, k) => hash3(xi + i, yi + j, zi + k);
    return l(l(l(h(0, 0, 0), h(1, 0, 0), u), l(h(0, 1, 0), h(1, 1, 0), u), v),
      l(l(h(0, 0, 1), h(1, 0, 1), u), l(h(0, 1, 1), h(1, 1, 1), u), v), w);
  }
  function fbm(x, y, z, octaves = 5) {
    let s = 0;
    let a = 0.5;
    for (let i = 0; i < octaves; i++) {
      s += a * noise3(x, y, z);
      x *= 2.03; y *= 2.03; z *= 2.03;
      a *= 0.5;
    }
    return s / (1 - 2 * a);
  }

  // Mars has no photo, so it is drawn pixel by pixel as a ball lit from the
  // left: rusty ground with darker lands, a long canyon south of the
  // equator, a white polar cap and a thin hazy atmosphere at the edge.
  function drawMars(size) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const g = cv.getContext('2d');
    g.fillStyle = '#000';
    g.fillRect(0, 0, size, size);
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 60; i++) {
      g.fillStyle = `rgba(255,255,255,${0.2 + rnd() * 0.5})`;
      g.beginPath();
      g.arc(rnd() * size, rnd() * size, rnd() * size * 0.002 + 0.5, 0, Math.PI * 2);
      g.fill();
    }

    const c = size / 2;
    const r = size * 0.4;
    const tilt = 0.35;                       // the north pole leans towards us
    const L = [-0.5, -0.3, 0.81];            // where the sunlight comes from
    const bright = [212, 134, 86];
    const dark = [104, 58, 42];
    const ice = [248, 244, 240];
    const img = g.createImageData(size, size);
    const px = img.data;
    for (let j = Math.floor(c - r - 1); j <= Math.ceil(c + r + 1); j++) {
      for (let i = Math.floor(c - r - 1); i <= Math.ceil(c + r + 1); i++) {
        const x = (i + 0.5 - c) / r;
        const y = (j + 0.5 - c) / r;
        const d = Math.hypot(x, y);
        const alpha = clamp((1 - d) * r + 0.5, 0, 1);
        if (alpha <= 0) continue;
        const z = Math.sqrt(Math.max(0, 1 - d * d));
        // the point on Mars itself, with north up
        const bx = x;
        const by = -y * Math.cos(tilt) + z * Math.sin(tilt);
        const bz = y * Math.sin(tilt) + z * Math.cos(tilt);
        const lat = Math.asin(clamp(by, -1, 1));
        const lon = Math.atan2(bx, bz);
        const big = fbm(bx * 2.1 + 5, by * 2.1, bz * 2.1);
        const fine = fbm(bx * 9, by * 9 + 3, bz * 9);
        // darker lands, more of them south of the equator
        let k = sstep(0.54, 0.68, big + 0.06 * Math.max(0, -by)) * (0.55 + 0.4 * fine);
        // the long canyon
        const vm = Math.abs(lat - (-0.13 - 0.12 * lon + 0.04 * (big - 0.5)));
        const along = sstep(-0.75, -0.55, lon) * (1 - sstep(0.25, 0.45, lon));
        k = Math.max(k, (1 - sstep(0.007, 0.026, vm)) * (0.6 + 0.35 * fine) * along);
        const tone = 0.86 + 0.28 * fine;
        let col = bright.map((b, n) => (b + (dark[n] - b) * k) * tone);
        // polar caps with a ragged edge
        const cap = Math.max(sstep(1.2, 1.24, lat + 0.12 * (fine - 0.5)), sstep(1.28, 1.32, -lat + 0.12 * (fine - 0.5)));
        col = col.map((v, n) => v + (ice[n] - v) * cap);
        // sunlight, and a thin haze at the edge
        const light = 0.06 + 0.94 * Math.pow(Math.max(0, x * L[0] + y * L[1] + z * L[2]), 0.8);
        const rim = Math.pow(1 - z, 3) * 0.45 * Math.max(0.15, light);
        col = col.map((v, n) => v * light + [255, 196, 160][n] * rim);
        const o = (j * size + i) * 4;
        px[o] = col[0];
        px[o + 1] = col[1];
        px[o + 2] = col[2];
        px[o + 3] = 255 * alpha;
      }
    }
    const ball = document.createElement('canvas');
    ball.width = ball.height = size;
    ball.getContext('2d').putImageData(img, 0, 0);
    g.drawImage(ball, 0, 0);
    return cv.toDataURL('image/png');
  }
  DESTS.find((d) => d.id === 'mars').file = drawMars(600);

  // Rough outlines of the continents (longitude, latitude pairs), and of
  // the seas inside them, for drawing the Earth.
  const LANDS = [
    // Africa
    [-17, 15, -17, 21, -13, 27.5, -9.8, 30, -6, 35.8, 10, 37.2, 11, 33.5, 20, 30.8, 25, 31.6, 32, 31.2, 34.3, 31.3, 34.6, 29.5,
      34, 27.8, 35, 24, 38, 18, 43, 12.5, 51.2, 11.8, 51, 10, 48, 5, 42, -1, 40, -5, 40.5, -10.5, 40.5, -15, 35.5, -23,
      32.8, -26, 30.5, -31, 25.5, -34, 20, -34.8, 18.3, -32, 15, -26.5, 14.4, -23, 11.8, -17, 13.3, -12, 12, -5.5, 9, -1,
      9.5, 4, 5, 5.3, -2, 4.8, -8, 4.5, -13, 8, -15, 11, -17, 15],
    // Madagascar
    [44, -25, 47, -25.2, 50.2, -15.5, 49.3, -12, 44.5, -16.5, 43.3, -22],
    // Arabia
    [35, 28, 39, 22, 43, 13, 45, 12.8, 52, 16, 56, 18, 59.5, 22.5, 56.5, 26, 52, 24, 50.5, 26, 48, 29.8, 47, 30.5, 39, 32.5, 35, 32.5],
    // Europe and Asia
    [-9, 37, -9.3, 43, -1.5, 43.5, -1.2, 46, -4.7, 48.4, -1.5, 48.7, 1.5, 50.5, 4, 51.5, 5, 53.4, 8.5, 53.7, 8.3, 57, 10.5, 57.7,
      10.6, 54.5, 14, 54, 19, 54.4, 21, 57, 23.5, 59.3, 29.5, 60, 22, 60.3, 21.5, 63, 25.2, 65.2, 30, 70, 40, 67, 44, 68,
      55, 68.5, 60, 69.5, 66, 69, 69, 73, 73, 72, 80, 73, 87, 75, 100, 77, 112, 74, 130, 71, 140, 72, 150, 71, 160, 69.5,
      170, 70, 180, 69, 180, 65, 178, 63, 165, 60, 163, 57, 156, 51, 156, 57, 150, 59, 142, 59, 137, 54, 141, 52, 140, 48,
      135, 43.5, 130, 42.5, 129.4, 35.5, 126.5, 34.5, 126, 37.5, 122, 40, 119, 39, 121, 37, 122, 31.5, 122, 30, 119, 25,
      115, 22.5, 110, 21, 108, 21.5, 106, 19, 109, 15, 109, 12, 106, 9, 105, 8.6, 104.5, 10.5, 100, 13.5, 99.5, 10, 100.5, 7,
      103.5, 1.5, 101, 3, 98, 8, 98.5, 13, 97.5, 16.5, 94.5, 16, 94, 19, 92, 21.5, 90, 22, 87, 21.5, 86, 20, 80, 15.5,
      80, 10, 77.5, 8, 76, 10, 73, 16, 72.5, 21, 70, 22.5, 67, 24.8, 61.5, 25.2, 57.3, 25.8, 56.4, 27, 52, 28, 50, 30, 48, 30,
      44, 33, 35.8, 34.5, 35.9, 36.2, 36, 36.8, 32, 36.2, 28.5, 36.7, 26.5, 38.5, 26.2, 40.5, 28.8, 41, 26, 40.8, 23, 40.4,
      24, 38, 22.5, 36.5, 21, 38, 19.5, 41.5, 19, 42, 15.5, 44, 13.6, 45.6, 12.3, 45.3, 12.4, 44.2, 14, 42.5, 16, 41.5,
      18.5, 40.2, 17, 39, 16, 38, 15.6, 38.2, 16, 39.5, 15, 40.2, 12, 41.8, 10.5, 43, 8.8, 44.4, 7, 43.6, 3, 43.3, 3, 42,
      0.2, 40, -0.3, 39.5, -0.7, 37.6, -2, 36.7, -5.3, 36.1, -6.3, 36.8],
    // Scandinavia
    [5, 58, 5.5, 62, 10, 64, 14, 67.5, 18, 69.5, 25, 71, 31, 70, 28, 66, 25, 65.5, 21, 63, 17.5, 61, 18.5, 59.5, 16.5, 56.5,
      13, 55.5, 11, 58.5, 8, 58],
    // Britain and Ireland
    [-5.7, 50, 1.5, 51, 1.7, 52.7, 0, 53.5, -1.6, 55.5, -2, 57.5, -3.5, 58.6, -5, 58.6, -6.2, 56.5, -4.8, 55, -3, 54,
      -4.5, 53.3, -4.2, 52.2, -5.2, 51.7, -3, 51.4],
    [-6, 52, -6, 54, -7.5, 55.3, -10, 54, -10, 51.6],
    // Iceland, Greenland
    [-24, 65.5, -22, 66.5, -16, 66.5, -13.5, 65, -18, 63.4, -22.5, 63.8],
    [-73, 78, -60, 82, -30, 83.5, -20, 81, -18, 75, -22, 70, -32, 68, -40, 65, -43, 60, -48, 61, -52, 65, -54, 69, -58, 75, -68, 76.5],
    // North America
    [-168, 66, -163, 70, -156, 71.3, -141, 69.7, -128, 70.3, -117, 69, -108, 68, -96, 68, -90, 69, -82, 69.5, -81, 64,
      -76, 62.5, -70, 62, -65, 60, -62, 57, -56, 53, -56, 51.5, -60, 50, -66, 49.5, -64.5, 48.5, -61, 46, -65, 44,
      -70, 43.5, -70, 41.7, -74, 40.5, -76, 38, -76, 35, -81, 31.5, -80, 27, -80, 25.2, -81.5, 25.5, -82.7, 28, -84, 30,
      -89, 30.2, -94, 29.5, -97.5, 27.5, -97.5, 22, -95, 18.5, -91, 18.7, -90.5, 21, -87, 21.5, -88, 16, -84, 15.5,
      -83.5, 11, -81, 8.7, -79, 9.5, -77.5, 8.5, -80, 7.3, -83, 8.2, -85.7, 10, -87.5, 13, -92, 14.5, -95, 16, -100, 17,
      -105.5, 20, -105.5, 23, -109.5, 25.5, -112, 29, -114.8, 31.8, -117, 32.5, -120.5, 34.5, -123.7, 38.5, -124, 42,
      -124, 47, -123, 49, -127.5, 50.5, -131, 54, -135, 57.5, -140, 60, -146, 61, -152, 59, -158, 57, -163, 55,
      -158, 58.6, -162, 60, -165, 62.5, -164, 64.5],
    // Cuba
    [-85, 21.8, -80, 23.1, -74.1, 20.2, -77.5, 19.9, -82, 22.6],
    // South America
    [-77.5, 8.5, -72, 12, -67, 10.6, -61, 10.5, -58, 6.8, -52, 5, -50, 1, -44.5, -2.5, -38.5, -3.7, -35, -5.5, -35, -9,
      -39, -13.5, -39, -17.6, -41, -22, -44, -23, -48.5, -26, -48.6, -28.5, -53, -33.7, -58, -34.5, -57, -38, -62, -39,
      -65, -42, -67.5, -46, -66, -48, -69, -51.5, -68.5, -52.5, -70, -55, -74, -52, -75.5, -47, -73.5, -42, -73.7, -37,
      -71.6, -30, -70.3, -18.5, -75.5, -15, -80.6, -6, -81, -2.5, -80, 0.5, -78.7, 2, -77.3, 4, -77.8, 7.5],
    // Australia
    [113.5, -22, 114, -26.5, 115, -34, 118, -35, 123, -34, 129, -31.5, 134, -32.5, 138, -35, 141, -38.5, 146.5, -39,
      150, -37.5, 153, -31, 153, -25, 149, -20.5, 146, -18, 145, -15, 143, -11, 142, -10.7, 141.5, -13, 141.5, -17,
      140, -17.7, 136, -15, 136.7, -12, 132, -11.3, 130, -13, 129, -15, 126, -14, 122, -17.5, 119.5, -20, 116.5, -20.7],
    // Sumatra, Borneo
    [95.3, 5.6, 98, 4, 104, -2.5, 106, -6, 104.5, -5.9, 101, -3, 98, 0, 95, 4.5],
    [109, 1.5, 111, -3, 116, -4, 119, 1, 117.5, 6.8, 113, 3.5],
    // Antarctica
    [-180, -78, -150, -75, -120, -73, -100, -72, -75, -72, -62, -64, -58, -63.5, -60, -70, -45, -78, -30, -76, 0, -70,
      30, -69, 60, -67, 90, -66, 120, -66.5, 150, -68, 170, -71, 180, -78, 180, -90, -180, -90]
  ];
  const SEAS = [
    [28, 41, 41, 41, 41.5, 44, 37, 45.5, 30, 46.5, 28, 44],                           // Black Sea
    [47, 37, 54, 37, 53, 42, 51, 47, 47, 46, 49, 42],                                 // Caspian Sea
    [-95, 59, -94, 62, -87, 64.5, -80, 63.5, -78, 58, -80, 52, -87, 55.5, -92, 57]    // Hudson Bay
  ];
  // dry places, as [longitude, latitude, width, height, how dry]
  const DRY = [[10, 23, 24, 8, 1.3], [45, 22, 11, 7, 1.1], [60, 33, 15, 7, 0.8], [100, 42, 18, 6, 0.9], [18, -24, 8, 6, 0.8],
    [133, -25, 14, 8, 1.1], [-110, 33, 9, 6, 0.8], [-69, -25, 3, 10, 0.8], [-68, -45, 5, 5, 0.6]];

  // The Earth as seen from space, with Europe and Africa facing us, drawn
  // pixel by pixel in small parts so the page does not stop; done() gets it.
  function drawEarth(size, done) {
    const D = Math.PI / 180;
    // the continents on a flat map
    const mw = 1024;
    const mh = 512;
    const map = document.createElement('canvas');
    map.width = mw;
    map.height = mh;
    const m = map.getContext('2d');
    const poly = (pts, color) => {
      m.fillStyle = color;
      m.beginPath();
      for (let i = 0; i < pts.length; i += 2) m.lineTo(((pts[i] + 180) / 360) * mw, ((90 - pts[i + 1]) / 180) * mh);
      m.fill();
    };
    m.fillStyle = '#000';
    m.fillRect(0, 0, mw, mh);
    LANDS.forEach((p) => poly(p, '#fff'));
    SEAS.forEach((p) => poly(p, '#000'));
    const land = { d: m.getImageData(0, 0, mw, mh).data, w: mw, h: mh };
    // a blurred copy tells how near the coast the sea is
    let coast = null;
    const b = document.createElement('canvas');
    b.width = mw / 4;
    b.height = mh / 4;
    const bg = b.getContext('2d');
    if ('filter' in bg) {
      bg.filter = 'blur(3px)';
      bg.drawImage(map, 0, 0, b.width, b.height);
      coast = { d: bg.getImageData(0, 0, b.width, b.height).data, w: b.width, h: b.height };
    }
    const sample = (t, lon, lat) => {
      const x = ((((lon + 180) / 360) * t.w - 0.5) % t.w + t.w) % t.w;
      const y = clamp(((90 - lat) / 180) * t.h - 0.5, 0, t.h - 1);
      const x0 = Math.floor(x);
      const y0 = Math.floor(y);
      const fx = x - x0;
      const fy = y - y0;
      const x1 = (x0 + 1) % t.w;
      const y1 = Math.min(y0 + 1, t.h - 1);
      const v = (i, j) => t.d[(j * t.w + i) * 4] / 255;
      const top = v(x0, y0) + (v(x1, y0) - v(x0, y0)) * fx;
      const bot = v(x0, y1) + (v(x1, y1) - v(x0, y1)) * fx;
      return top + (bot - top) * fy;
    };
    const gauss = (v, mu, s) => Math.exp(-(((v - mu) / s) ** 2));
    const dryness = (lon, lat) => DRY.reduce((s, [x, y, w, h, k]) => {
      const dl = ((lon - x + 540) % 360) - 180;
      return s + k * Math.exp(-((dl / w) ** 2) - ((lat - y) / h) ** 2);
    }, 0);
    const mixc = (a, c, t) => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t];
    const FOREST = [44, 84, 40];
    const GRASS = [124, 124, 66];
    const DESERT = [208, 174, 122];
    const TUNDRA = [112, 110, 86];
    const ICE = [240, 244, 248];
    const DEEP = [8, 30, 84];
    const SHALLOW = [30, 96, 146];

    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const g = cv.getContext('2d');
    const img = g.createImageData(size, size);
    const px = img.data;
    const c = size / 2;
    const r = size / 2 - 1;
    const lat0 = 22 * D;                     // the middle of the picture
    const lon0 = 15 * D;
    const L = [-0.5, -0.3, 0.81];            // where the sunlight comes from
    const Hn = Math.hypot(L[0], L[1], L[2] + 1);
    const H = [L[0] / Hn, L[1] / Hn, (L[2] + 1) / Hn];

    function pixel(i, j) {
      const x = (i + 0.5 - c) / r;
      const yd = (j + 0.5 - c) / r;          // down
      const dd = Math.hypot(x, yd);
      const alpha = clamp((1 - dd) * r + 0.5, 0, 1);
      if (alpha <= 0) return;
      const z = Math.sqrt(Math.max(0, 1 - dd * dd));
      const lat = Math.asin(clamp(z * Math.sin(lat0) - yd * Math.cos(lat0), -1, 1));
      const lon = lon0 + Math.atan2(x, z * Math.cos(lat0) + yd * Math.sin(lat0));
      const P = [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
      const latD = lat / D;
      const lonD = lon / D;
      const aLat = Math.abs(latD);

      // ragged coasts
      const w1 = fbm(P[0] * 18, P[1] * 18, P[2] * 18, 4);
      const w2 = fbm(P[0] * 18 + 9, P[1] * 18, P[2] * 18, 4);
      const isLand = sstep(0.4, 0.6, sample(land, lonD + 6 * (w1 - 0.5), latD + 6 * (w2 - 0.5)));
      // green, grassy or sandy, with tundra and ice towards the poles
      const dryHere = dryness(lonD, latD);
      const dry = dryHere * (0.6 + 0.8 * fbm(P[0] * 5 + 3, P[1] * 5, P[2] * 5, 4)) +
        0.5 * (fbm(P[0] * 7 + 7, P[1] * 7, P[2] * 7, 4) - 0.5) + 0.3 * gauss(aLat, 15, 7);
      let ground = mixc(FOREST, GRASS, sstep(0.2, 0.5, dry));
      ground = mixc(ground, DESERT, sstep(0.55, 0.85, dry));
      ground = mixc(ground, TUNDRA, sstep(52, 66, aLat) * 0.8);
      const ice = latD < -62 || (latD > 59 && lonD > -75 && lonD < -25) || (latD > 69 && lonD < -15) ? 1 : sstep(72, 78, latD);
      ground = mixc(ground, ICE, ice);
      ground = ground.map((v) => v * (0.8 + 0.4 * w1));
      const near = coast ? sample(coast, lonD, latD) : 0;
      let sea = mixc(DEEP, SHALLOW, sstep(0.05, 0.5, near) * 0.7);
      sea = mixc(sea, ICE, sstep(76, 82, aLat) * 0.8);
      let col = mixc(sea, ground, isLand);

      // swirling clouds, more of them near the equator and far north and south
      const q = fbm(P[0] * 2.2 + 3, P[1] * 2.2 + 1, P[2] * 2.2, 4);
      const cl = fbm(P[0] * 3 + 2 * q, P[1] * 3 + 2 * q, P[2] * 3 + 2 * q, 5);
      const cloud = sstep(0.56, 0.84, cl + 0.18 * gauss(latD, 6, 6) + 0.12 * sstep(40, 60, aLat) - 0.35 * Math.min(1, dryHere));
      col = mixc(col, [250, 252, 255], cloud * 0.92);

      // sunlight, its glint on the sea, and the blue air at the edge
      const n = [x, yd, z];
      const ndl = Math.max(0, n[0] * L[0] + n[1] * L[1] + n[2] * L[2]);
      const light = 0.03 + 0.97 * Math.pow(ndl, 0.85);
      const spec = Math.pow(Math.max(0, n[0] * H[0] + n[1] * H[1] + n[2] * H[2]), 60) * 0.45 * (1 - isLand) * (1 - cloud);
      const haze = Math.pow(1 - z, 2.2) * 0.55 * Math.max(0.15, light);
      const o = (j * size + i) * 4;
      px[o] = col[0] * light + 110 * haze + 255 * spec;
      px[o + 1] = col[1] * light + 165 * haze + 255 * spec;
      px[o + 2] = col[2] * light + 255 * haze + 255 * spec;
      px[o + 3] = 255 * alpha;
    }

    let j = 0;
    (function rows() {
      const stop = Math.min(size, j + 32);
      for (; j < stop; j++) for (let i = 0; i < size; i++) pixel(i, j);
      if (j < size) {
        setTimeout(rows, 0);
        return;
      }
      g.putImageData(img, 0, 0);
      done(cv.toDataURL('image/png'));
    })();
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const store = Astro.makeStore('rakett.');
  const state = {
    dest: DESTS.find((d) => d.id === store.get('dest', 'moon')) || DESTS[0],
    who: WHOS.includes(store.get('who', '')) ? store.get('who', '') : WHOS[0],
    visited: store.get('visited', []),
    phase: 'menu',   // menu, build, ready, count, fly, done
    slots: [],
    parts: [],
    drag: null,
    hintTimer: 0,
    L: null,         // layout, see layout()
    fl: null,        // flight
    gen: 0           // bumped when a game starts or ends, to stop old timers
  };
  if (!Array.isArray(state.visited)) state.visited = [];

  const area = $('area');
  const scene = $('scene');
  const t = (key) => TEXT[Astro.lang][key];

  // The Earth seen from space, drawn with a radius of 100.
  // The Earth, with a radius of 100: a plain blue ball until its picture is drawn.
  const EARTH = '<circle r="116" fill="url(#earthGlow)"/><circle r="99" fill="#1d4f9a"/>' +
    '<image id="earthImg" x="-100" y="-100" width="200" height="200"/>';

  scene.innerHTML =
    '<rect width="100%" height="100%" fill="url(#skyGrad)"/>' +
    `<g id="starsL"></g><g id="solarL" style="display: none"></g><g id="earthL" style="display: none">${EARTH}</g>` +
    '<image id="destImg" mask="url(#soft)" style="mix-blend-mode: screen"/>' +
    '<g fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="6 10" stroke-linecap="round">' +
    '<circle id="orbitRing" opacity="0"/><path id="tripPath" opacity="0"/></g>' +
    '<g id="worldL"></g><g id="slotsL"></g><g id="trayL"></g><g id="flameL"></g><g id="partsL"></g>';
  const L$ = (id) => scene.querySelector('#' + id);
  const [starsL, solarL, earthL, destImg, orbitRing, tripPath, worldL, slotsL, trayL, flameL, partsL] =
    ['starsL', 'solarL', 'earthL', 'destImg', 'orbitRing', 'tripPath', 'worldL', 'slotsL', 'trayL', 'flameL', 'partsL'].map(L$);

  function svgEl(tag, attrs = {}, parent) {
    const el = document.createElementNS(SVGNS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  // ---------------------------------------------------------------------------
  // Menu
  // ---------------------------------------------------------------------------

  function buildMenu() {
    DESTS.forEach((d) => {
      const b = document.createElement('button');
      b.className = 'pic dest';
      b.innerHTML = `<img src="${d.file}" alt=""><span class="name"></span>` +
        `<span class="fuel-row">${'<i></i>'.repeat(d.tanks)}</span><b class="done-badge hidden">🌟</b>`;
      b.addEventListener('click', () => {
        state.dest = d;
        store.set('dest', d.id);
        sfx.pick();
        updateMenu();
      });
      $('dests').appendChild(b);
    });
    WHOS.forEach((w) => {
      const b = document.createElement('button');
      b.className = 'count who-btn';
      b.innerHTML = `<b>${w}</b>`;
      b.addEventListener('click', () => {
        state.who = w;
        store.set('who', w);
        sfx.pick();
        updateMenu();
      });
      $('whos').appendChild(b);
    });
  }

  function updateMenu() {
    [...$('dests').children].forEach((b, i) => {
      const d = DESTS[i];
      b.classList.toggle('selected', d === state.dest);
      b.querySelector('.name').textContent = d.name[Astro.lang];
      b.querySelector('.done-badge').classList.toggle('hidden', !state.visited.includes(d.id));
    });
    [...$('whos').children].forEach((b, i) => b.classList.toggle('selected', WHOS[i] === state.who));
    $('resetBtn').classList.toggle('hidden', !state.visited.length);
  }

  function stopAll() {
    state.gen++;
    clearTimeout(state.hintTimer);
    if (state.fl) cancelAnimationFrame(state.fl.raf);
    state.fl = null;
    state.drag = null;
    Astro.stopConfetti($('confetti'));
  }

  function showMenu() {
    stopAll();
    state.phase = 'menu';
    $('win').classList.add('hidden');
    $('game').classList.add('hidden');
    $('menu').classList.remove('hidden');
    updateMenu();
  }

  // ---------------------------------------------------------------------------
  // Building
  // ---------------------------------------------------------------------------

  function startGame() {
    stopAll();
    $('win').classList.add('hidden');
    $('menu').classList.add('hidden');
    $('game').classList.remove('hidden');
    $('launchBtn').classList.add('hidden');
    $('countdown').classList.add('hidden');
    updateToggles();
    state.phase = 'build';

    const n = state.dest.tanks;
    state.slots = rocketSlots(n);
    partsL.innerHTML = '';
    flameL.innerHTML = '';
    starsL.innerHTML = '';
    destImg.setAttribute('href', state.dest.file);
    destImg.setAttribute('opacity', 0);
    earthL.style.display = 'none';
    earthL.setAttribute('opacity', 1);
    solarL.style.display = 'none';
    solarL.innerHTML = '';
    orbitRing.setAttribute('opacity', 0);
    tripPath.setAttribute('opacity', 0);
    worldL.style.transform = '';
    worldL.style.display = '';
    $('caption').classList.remove('show');
    setSky(0);
    slotsL.style.display = '';
    trayL.style.display = '';

    // ghost outlines where the parts go
    slotsL.innerHTML = '';
    for (const s of state.slots) {
      const sh = SHAPES[s.kind];
      s.el = svgEl('g', { class: 'slot', 'data-kind': s.kind }, slotsL);
      s.el.innerHTML = `<g class="ghost" transform="translate(${-(sh.x0 + sh.w / 2)} ${-sh.h / 2})">${partSVG(s.kind, 7, '')}</g>`;
    }

    // loose parts in the tray, in a random order
    // one part for each spot; a fin is made for its own side (left or right)
    state.parts = shuffle(state.slots.map((s) => makePart(s.kind, s.flip)));
    state.parts.forEach((p, i) => { p.cell = i; });
    layout();
    updateProgress();
    poke();
  }

  function makePart(kind, side) {
    const el = svgEl('g', { class: 'part' }, partsL);
    const mid = svgEl('g', { class: 'mid' }, el);
    const sh = SHAPES[kind];
    const inner = svgEl('g', { transform: `translate(${-(sh.x0 + sh.w / 2)} ${-sh.h / 2})` }, mid);
    const p = { kind, color: DEFAULT_COLOR[kind], el, mid, inner, slot: null, cell: 0, x: 0, y: 0, s: 1, side, flip: side };
    el._part = p;
    drawPart(p);
    return p;
  }

  function drawPart(p, fuel = 1) {
    p.inner.innerHTML = partSVG(p.kind, p.color, state.who, fuel);
  }

  function setTransform(el, x, y, s, flip = 1, rot = 0) {
    el.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${s * flip}, ${s})`;
  }
  const place = (p) => setTransform(p.el, p.x, p.y, p.s, p.flip);

  // Sizes and positions for the current screen. During building the parts
  // tray is beside the rocket (wide screens) or below it (tall screens).
  function layout() {
    const W = area.clientWidth;
    const H = area.clientHeight;
    if (!W || !H) return;
    const n = state.dest.tanks;
    const withTray = state.phase === 'build';
    const groundH = Math.max(80, H * 0.15);
    let zone;
    let tray = null;
    if (withTray && W > H * 1.05) {
      zone = { x: 0, w: W * 0.55, gy: H - groundH };
      tray = { x: W * 0.55, y: 12, w: W * 0.45 - 12, h: H - 24 };
    } else if (withTray) {
      const th = H * 0.36;
      zone = { x: 0, w: W, gy: H - th - 6 };
      tray = { x: 12, y: H - th, w: W - 24, h: th - 12 };
    } else {
      zone = { x: 0, w: W, gy: H - groundH };
    }
    const k = Math.min((zone.gy - 16) / (rocketHeight(n) + 40), zone.w / 300);
    state.L = { W, H, k, gx: zone.x + zone.w / 2, gy: zone.gy, tray, cells: [] };

    // tray cells: as big as possible for the number of parts
    trayL.innerHTML = '';
    if (tray) {
      svgEl('rect', { x: tray.x, y: tray.y, width: tray.w, height: tray.h, rx: 24, class: 'tray' }, trayL);
      const m = state.parts.length;
      let best = null;
      for (let cols = 1; cols <= m; cols++) {
        const rows = Math.ceil(m / cols);
        const cw = tray.w / cols;
        const ch = tray.h / rows;
        const score = Math.min(cw, ch / 1.3);
        if (!best || score > best.score) best = { score, cols, rows, cw, ch };
      }
      for (let i = 0; i < m; i++) {
        const c = i % best.cols;
        const r = Math.floor(i / best.cols);
        state.L.cells.push({ x: tray.x + (c + 0.5) * best.cw, y: tray.y + (r + 0.5) * best.ch, w: best.cw, h: best.ch });
      }
    }

    drawWorld();
    for (const s of state.slots) {
      const q = slotPos(s);
      setTransform(s.el, q.x, q.y, k, s.flip);
    }
    if (state.phase === 'build' || state.phase === 'ready' || state.phase === 'count') {
      for (const p of state.parts) {
        if (p === state.drag?.p) continue;
        if (p.slot) Object.assign(p, slotPos(p.slot), { s: k });
        else trayPos(p);
        place(p);
      }
    }
  }

  function slotPos(s) {
    const { k, gx, gy } = state.L;
    const sh = SHAPES[s.kind];
    return { x: gx + k * (s.ax + s.flip * (sh.x0 + sh.w / 2)), y: gy + k * (s.ay + sh.h / 2) };
  }

  function trayPos(p) {
    const c = state.L.cells[p.cell];
    if (!c) return;
    const sh = SHAPES[p.kind];
    p.x = c.x;
    p.y = c.y;
    p.s = Math.min(state.L.k, (0.78 * c.w) / sh.w, (0.78 * c.h) / sh.h);
    p.flip = p.side;
  }

  // Ground, launch pad and tower; during a flight also clouds and smoke.
  function drawWorld() {
    const { W, H, k, gx, gy } = state.L;
    const towerH = rocketHeight(state.dest.tanks) * 0.8 * k;
    let s = `<rect x="${-W}" y="${gy + 14 * k}" width="${3 * W}" height="${H * 2}" fill="#5cc46a"/>` +
      `<rect x="${-W}" y="${gy + 14 * k}" width="${3 * W}" height="${8 * k}" fill="#3f9e4f"/>` +
      `<rect x="${gx - 150 * k}" y="${gy}" width="${300 * k}" height="${24 * k}" rx="${5 * k}" fill="#8a90a6" stroke="#1a1440" stroke-width="${3 * k}"/>`;
    // a lattice tower beside the rocket
    const tx = gx + 112 * k;
    const tw = 18 * k;
    s += `<g stroke="#e0533a" stroke-width="${3 * k}" fill="none"><rect x="${tx}" y="${gy - towerH}" width="${tw}" height="${towerH}"/>`;
    for (let y = gy; y > gy - towerH + 1; y -= tw) s += `<path d="M${tx} ${y}L${tx + tw} ${y - tw}M${tx} ${y - tw}L${tx + tw} ${y}"/>`;
    s += '</g>';
    if (state.fl) {
      for (const c of state.fl.clouds) {
        const x = c.x * W;
        const y = gy - c.y * H;
        const r = c.r * Math.min(W, H);
        s += `<g fill="#fff" opacity="0.92"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 0.45}"/>` +
          `<circle cx="${x - r * 0.35}" cy="${y - r * 0.2}" r="${r * 0.38}"/><circle cx="${x + r * 0.2}" cy="${y - r * 0.3}" r="${r * 0.45}"/></g>`;
      }
      s += '<g id="smokeL" fill="#eef1f8"></g>';
    }
    worldL.innerHTML = s;
  }

  // ---------------------------------------------------------------------------
  // Dragging
  // ---------------------------------------------------------------------------

  function pointerPos(e) {
    const r = scene.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  scene.addEventListener('pointerdown', (e) => {
    const el = e.target.closest('.part');
    if (!el || state.drag) return;
    const p = el._part;
    if (p.slot) {
      if (state.phase === 'build' || state.phase === 'ready') recolor(p);
      return;
    }
    if (state.phase !== 'build') return;
    e.preventDefault();
    const q = pointerPos(e);
    const dx = (q.x - p.x) / p.s;
    const dy = (q.y - p.y) / p.s;
    state.drag = { p, id: e.pointerId, dx, dy, x0: q.x, y0: q.y, moved: false };
    scene.setPointerCapture(e.pointerId);
    partsL.appendChild(p.el);
    p.el.classList.add('dragging', 'snap');
    p.el.classList.remove('wiggle');
    p.s = state.L.k;
    p.x = q.x - dx * p.s;
    p.y = q.y - dy * p.s;
    place(p);
    sfx.pick();
    poke();
  });

  scene.addEventListener('pointermove', (e) => {
    const d = state.drag;
    if (!d || e.pointerId !== d.id) return;
    const q = pointerPos(e);
    if (!d.moved && Math.hypot(q.x - d.x0, q.y - d.y0) > 8) {
      d.moved = true;
      d.p.el.classList.remove('snap');
    }
    d.p.x = q.x - d.dx * d.p.s;
    d.p.y = q.y - d.dy * d.p.s;
    place(d.p);
  });

  function endDrag(e) {
    const d = state.drag;
    if (!d || e.pointerId !== d.id) return;
    state.drag = null;
    const p = d.p;
    p.el.classList.remove('dragging');
    p.el.classList.add('snap');
    poke();

    // the nearest free spot for this kind of part
    let best = null;
    let bestDist = Infinity;
    for (const s of state.slots) {
      if (s.part || s.kind !== p.kind || s.flip !== p.side) continue;
      const q = slotPos(s);
      const dist = Math.hypot(q.x - p.x, q.y - p.y);
      if (dist < bestDist) {
        best = s;
        bestDist = dist;
      }
    }
    if (d.moved && best && bestDist < 220 * state.L.k) {
      putInSlot(p, best);
      return;
    }
    // back to the tray; a tap shows where the part goes
    trayPos(p);
    place(p);
    if (!d.moved && best) flashSlot(best);
    else sfx.oops();
  }
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);

  function putInSlot(p, s) {
    p.slot = s;
    s.part = p;
    p.flip = s.flip;
    p.s = state.L.k;
    Object.assign(p, slotPos(s));
    place(p);
    s.el.classList.remove('hint');
    restart(p.el, 'pop');
    sfx.snap();
    updateProgress();
    if (state.slots.every((x) => x.part)) ready();
  }

  // Run a CSS animation again from the start.
  function restart(el, cls) {
    el.classList.remove(cls);
    void el.getBoundingClientRect();
    el.classList.add(cls);
  }

  function flashSlot(s) {
    restart(s.el, 'hint');
    setTimeout(() => { if (!s.part) s.el.classList.remove('hint'); }, 1600);
  }

  function recolor(p) {
    p.color = (p.color + 1) % COLORS.length;
    drawPart(p);
    restart(p.el, 'pop');
    sfx.note(p.color);
    poke();
  }

  // Something happened: restart the wait before the next hint.
  function poke() {
    clearTimeout(state.hintTimer);
    if (state.phase !== 'build') return;
    state.hintTimer = setTimeout(() => {
      const s = state.slots.find((x) => !x.part);
      if (!s || state.drag) return poke();
      s.el.classList.add('hint');
      const p = state.parts.find((x) => !x.slot && x.kind === s.kind);
      if (p) restart(p.el, 'wiggle');
      poke();
    }, HINT_MS);
  }

  function updateProgress(frac) {
    const total = state.slots.length;
    const done = state.slots.filter((s) => s.part).length;
    if (frac === undefined) {
      $('progressFill').style.width = (100 * done) / total + '%';
      $('progressText').textContent = `🔧 ${done} / ${total}`;
    } else {
      $('progressFill').style.width = 100 * frac + '%';
      $('progressText').textContent = '🚀';
    }
  }

  function updateToggles() {
    $('soundBtn').textContent = sfx.on ? '🔊' : '🔇';
    $('soundBtn').classList.toggle('off', !sfx.on);
  }

  // ---------------------------------------------------------------------------
  // Launch
  // ---------------------------------------------------------------------------

  // All parts are on: the tray goes away, the rocket moves to the middle.
  function ready() {
    state.phase = 'ready';
    clearTimeout(state.hintTimer);
    slotsL.style.display = 'none';
    trayL.style.display = 'none';
    state.parts.forEach((p) => p.el.classList.add('move'));
    layout();
    const gen = state.gen;
    setTimeout(() => {
      if (gen !== state.gen || state.phase !== 'ready') return;
      [0, 2, 4].forEach((i, j) => setTimeout(() => sfx.note(i), j * 120));
      $('launchBtn').classList.remove('hidden');
    }, 500);
  }

  function countdown() {
    if (state.phase !== 'ready') return;
    state.phase = 'count';
    $('launchBtn').classList.add('hidden');
    const cd = $('countdown');
    const gen = state.gen;
    ['3', '2', '1', t('liftoff')].forEach((txt, i) => {
      setTimeout(() => {
        if (gen !== state.gen) return;
        cd.textContent = txt;
        cd.classList.remove('hidden');
        cd.classList.toggle('go', i === 3);
        restart(cd, 'tick');
        if (i < 3) sfx.note(4 - i);
        else fly();
      }, i * 900);
    });
    setTimeout(() => { if (gen === state.gen) cd.classList.add('hidden'); }, 3 * 900 + 1100);
  }

  // ---------------------------------------------------------------------------
  // Flight
  // ---------------------------------------------------------------------------

  // The flight, as on a real trip: up into space, the view zooms out to show
  // the whole Earth, one lap around the Earth with the engine off, then the
  // engine fires again and the rocket leaves for its goal. To a planet it
  // flies half way round the Sun, on an orbit that meets the planet's.

  const ease = (x) => x * x * (3 - 2 * x);
  const lerp = (a, b, x) => a + (b - a) * x;
  const mod = (a, b) => ((a % b) + b) % b;

  function mix(c1, c2, x) {
    const a = parseInt(c1.slice(1), 16);
    const b = parseInt(c2.slice(1), 16);
    const ch = (v, s) => (v >> s) & 255;
    const m = [16, 8, 0].map((s) => Math.round(lerp(ch(a, s), ch(b, s), x)));
    return `rgb(${m.join(',')})`;
  }

  // 0 = blue day sky, 1 = black space
  function setSky(x) {
    document.getElementById('skyTop').setAttribute('stop-color', mix('#3d9cf0', '#050822', clamp(x * 1.4, 0, 1)));
    document.getElementById('skyBottom').setAttribute('stop-color', mix('#bfe6ff', '#0d1440', x));
  }

  // When each part of the trip starts, and when the engine burns how much
  // fuel. Getting into orbit takes the first tank (half of it if there is
  // only one), leaving takes the rest; at a planet the last half tank is
  // kept for braking on arrival.
  function timeline(dest) {
    const n = dest.tanks;
    const A = Math.min(1, n / 2);
    const z0 = ASCENT + 0.2;
    const z1 = z0 + ZOOM;
    const dep = z1 + ORBIT;
    const burns = [{ t0: 0.3, dur: ASCENT - 0.3, fuel: A }];
    if (dest.id === 'moon') {
      burns.push({ t0: dep, dur: (n - A) * BURN, fuel: n - A });
      return { z0, z1, dep, burns, end: dep + (n - A) * BURN + CRUISE };
    }
    const away = n - A - 0.5;
    const trip0 = dep + LEAVE;
    const trip = 2.5 + 1.5 * (n - 1);
    const arrive = trip0 + trip;
    burns.push({ t0: dep, dur: away * BURN, fuel: away }, { t0: arrive, dur: 0.5 * BURN, fuel: 0.5 });
    return { z0, z1, dep, trip0, trip, arrive, burns, end: arrive + ARRIVE };
  }
  const fuelUsed = (T, t) => T.burns.reduce((sum, b) => sum + b.fuel * clamp((t - b.t0) / b.dur, 0, 1), 0);
  // when tank i is empty and drops off
  function dropTime(T, i) {
    let used = 0;
    for (const b of T.burns) {
      if (used + b.fuel >= i + 1 - 1e-9) return b.t0 + (b.dur * (i + 1 - used)) / b.fuel;
      used += b.fuel;
    }
    return Infinity;
  }
  // the rocket turns towards the left (east) while climbing (degrees)
  const pitchAt = (T, t) => -50 * ease(clamp((t - 2) / (T.z0 - 2), 0, 1));

  // a point on a curve, and the way the curve goes there (degrees, 0 = up)
  function bezier([a, b, c, d], s) {
    const u = 1 - s;
    const w = [u * u * u, 3 * u * u * s, 3 * u * s * s, s * s * s];
    const v = [u * u, 2 * u * s, s * s];
    const tx = v[0] * (b.x - a.x) + v[1] * (c.x - b.x) + v[2] * (d.x - c.x);
    const ty = v[0] * (b.y - a.y) + v[1] * (c.y - b.y) + v[2] * (d.y - c.y);
    return {
      x: w[0] * a.x + w[1] * b.x + w[2] * c.x + w[3] * d.x,
      y: w[0] * a.y + w[1] * b.y + w[2] * c.y + w[3] * d.y,
      rot: (Math.atan2(tx, -ty) * 180) / Math.PI
    };
  }

  // The Sun and the planets, seen from the north, so that they go round
  // anticlockwise. Angles go anticlockwise from the top. The Earth is
  // at the top when the trip starts; the planet is met at the bottom, half
  // way round the Sun, after moving along its own orbit. Planets nearer the
  // Sun go round faster (Kepler's third law).
  function solar(time) {
    const { W, H } = state.L;
    const T = state.fl.T;
    const m = Math.min(W, H);
    const rE = planet('earth').r;
    const rD = planet(state.dest.id).r;
    const u = (0.44 * m) / rD;       // pixels per orbit unit
    const S = { x: W / 2, y: H / 2 };
    const a = (rE + rD) / 2;          // the rocket's orbit: half an ellipse
    const e = (rD - rE) / (rD + rE);
    const w = (r) => (Math.PI / T.trip) * Math.pow(a / r, 1.5);
    const at = (r, ang) => ({ x: S.x - r * u * Math.sin(ang), y: S.y - r * u * Math.cos(ang) });
    const angle = (p) => (p.id === 'earth' ? w(rE) * (time - T.trip0)
      : p.id === state.dest.id ? Math.PI - w(rD) * (T.arrive - time)
      : p.a0 + w(p.r) * (time - T.trip0));
    return { m, u, S, a, e, rE, rD, w, at, angle };
  }

  // Where the rocket is on its way round the Sun (Kepler's equation, so it
  // goes faster near the Sun and slower far from it); tau is 0 to 1.
  function transfer(sv, tau) {
    const M = Math.PI * clamp(tau, 0, 1);
    let E = M;
    for (let i = 0; i < 8; i++) E -= (E - sv.e * Math.sin(E) - M) / (1 - sv.e * Math.cos(E));
    const nu = 2 * Math.atan(Math.sqrt((1 + sv.e) / (1 - sv.e)) * Math.tan(E / 2));
    return sv.at(sv.a * (1 - sv.e * Math.cos(E)), nu);
  }

  // When the rocket crosses the orbits of the planets on the way.
  function crossings(T) {
    const rE = planet('earth').r;
    const rD = planet(state.dest.id).r;
    const a = (rE + rD) / 2;
    const e = (rD - rE) / (rD + rE);
    const when = (r) => {
      const E = Math.acos((1 - r / a) / e);
      return T.trip0 + (T.trip * (E - e * Math.sin(E))) / Math.PI;
    };
    return PLANETS.filter((p) => p.r > rE && p.r < rD).map((p) => ({ t: when(p.r), p }));
  }

  // The camera for a trip to a planet: zooming out from the Earth to the
  // Sun, still while going round the Sun, zooming in to the planet. A point
  // p of the Sun's view is seen at C + (p - A) * Z.
  function solarView(time, sv) {
    const { W, H } = state.L;
    const T = state.fl.T;
    const Z0 = 0.2 / planet('earth').dot;     // the whole Earth, as in orbit
    if (time < T.trip0) {
      const Ep = sv.at(sv.rE, sv.angle(planet('earth')));
      const u = ease(clamp((time - T.dep) / LEAVE, 0, 1));
      return { u, z: 0, Z0, A: Ep, C: { x: lerp(W / 2, Ep.x, u), y: lerp(H / 2, Ep.y, u) }, Z: Math.pow(Z0, 1 - u), sys: clamp((u - 0.15) / 0.5, 0, 1) };
    }
    if (time < T.arrive) return { u: 1, z: 0, Z0, A: sv.S, C: sv.S, Z: 1, sys: 1 };
    const P = planet(state.dest.id);
    const Dp = sv.at(sv.rD, sv.angle(P));
    const z = ease(clamp((time - T.arrive) / ARRIVE, 0, 1));
    const Zend = (0.62 * P.fill) / (2 * P.dot);
    return { u: 1, z, Z0, A: Dp, C: { x: lerp(Dp.x, W / 2, z), y: lerp(Dp.y, H * 0.42, z) }, Z: Math.pow(Zend, z), sys: 1 - clamp(z * 1.6, 0, 1) };
  }

  // Draw the Sun, the orbits, the asteroid belt and the planets (in orbit
  // units times 100, the Sun at 0 0).
  function buildSolar() {
    const sv = solar(0);
    const px = 100 / sv.u;           // units per pixel
    const sun = Math.min(0.05 * sv.m, 0.6 * sv.u) * px;
    let s = `<circle r="${sun * 1.9}" fill="url(#sunGlow)"/><circle r="${sun}" fill="url(#sunGrad)"/>`;
    for (const p of PLANETS) if (p.r <= sv.rD) s += `<circle class="orbit" data-id="${p.id}" r="${p.r * 100}" vector-effect="non-scaling-stroke"/>`;
    if (sv.rD > BELT[1]) {
      s += '<g class="belt">';
      for (let i = 0; i < 160; i++) {
        const r = rand(BELT[0], BELT[1]) * 100;
        const ang = rand(0, Math.PI * 2);
        s += `<circle cx="${r * Math.sin(ang)}" cy="${-r * Math.cos(ang)}" r="${0.0035 * sv.m * px}" opacity="${rand(0.4, 0.9)}"/>`;
      }
      s += '</g>';
    }
    const b = Math.sqrt(sv.rE * sv.rD) * 100;
    s += `<path class="transfer" d="M0 ${-sv.rE * 100}A${b} ${sv.a * 100} 0 0 0 0 ${sv.rD * 100}" vector-effect="non-scaling-stroke"/>`;
    for (const p of PLANETS) {
      if (p.r < sv.rD && p.id !== 'earth') s += `<circle class="planet" data-id="${p.id}" r="${p.dot * sv.m * px}" fill="${p.color}"/>`;
    }
    solarL.innerHTML = s;
  }

  function updateSolar(time, sc) {
    const { sv, V } = sc;
    solarL.style.display = '';
    solarL.setAttribute('opacity', V.sys);
    solarL.setAttribute('transform',
      `translate(${V.C.x} ${V.C.y}) scale(${V.Z}) translate(${sv.S.x - V.A.x} ${sv.S.y - V.A.y}) scale(${sv.u / 100})`);
    solarL.querySelectorAll('.planet').forEach((el) => {
      const p = planet(el.dataset.id);
      const ang = sv.angle(p);
      el.setAttribute('cx', -100 * p.r * Math.sin(ang));
      el.setAttribute('cy', -100 * p.r * Math.cos(ang));
    });
    const belt = solarL.querySelector('.belt');
    if (belt) belt.setAttribute('transform', `rotate(${(-sv.w((BELT[0] + BELT[1]) / 2) * (time - state.fl.T.trip0) * 180) / Math.PI})`);
  }

  // Where the Earth, the goal and the rocket are at a flight time. The rocket
  // is given by its centre, turn (degrees, 0 = nose up) and scale.
  function scenery(time) {
    const { W, H, k, gx, gy } = state.L;
    const T = state.fl.T;
    const m = Math.min(W, H);
    const Hr = rocketHeight(state.dest.tanks);
    const re = m * 0.2;            // the whole Earth
    const ro = m * 0.3;            // the orbit around it
    const so = (m * 0.16) / Hr;    // the rocket's scale in space
    const mid = { x: W / 2, y: H / 2 };

    // climbing: the rocket rises to the middle, the world moves past
    const h = Hr * k;
    const rise = ease(clamp((time - 0.3) / 2.2, 0, 1));
    const bottom = gy - Math.max(0, gy - h / 2 - H * 0.58) * rise;
    const shake = time < 0.7 ? Math.sin(time * 80) * 2.5 * (1 - time / 0.7) : 0;
    // while turning it gets a little smaller if needed, to fit a narrow screen
    const rot = pitchAt(T, time);
    const fit = Math.min(k, (W * 0.85) / (Hr * Math.abs(Math.sin((rot * Math.PI) / 180)) + 200));
    const up = { x: gx + shake, y: bottom - h / 2, rot, sc: fit };
    if (time < T.z0) return { rocket: up };

    // zooming out: the Earth comes up from below and shrinks into a ball
    if (time < T.z1) {
      const z = ease((time - T.z0) / ZOOM);
      const r0 = Math.max(W, H) * 1.6;
      const r = r0 * Math.pow(re / r0, z);
      const top = lerp(H, H / 2 - re, z);
      return {
        earth: { x: W / 2, y: top + r, r },
        ring: { ...mid, r: ro, op: 0.5 * clamp((z - 0.6) / 0.4, 0, 1) },
        rocket: {
          x: lerp(up.x, mid.x, z),
          y: lerp(up.y, mid.y - ro, z),
          rot: lerp(up.rot, -90, z),
          sc: up.sc * Math.pow(so / up.sc, z)
        }
      };
    }

    // one lap around the Earth, anticlockwise from the top as seen from
    // above the North Pole, as rockets and planets go
    if (time < T.dep) {
      const phi = -Math.PI / 2 - (2 * Math.PI * (time - T.z1)) / ORBIT;
      return {
        earth: { ...mid, r: re },
        ring: { ...mid, r: ro, op: 0.5 },
        rocket: { x: mid.x + ro * Math.cos(phi), y: mid.y + ro * Math.sin(phi), rot: (phi * 180) / Math.PI, sc: so }
      };
    }

    if (T.trip) {
      // to a planet: out to the Sun's view, half way round the Sun, in to the planet
      const sv = solar(time);
      const V = solarView(time, sv);
      const map = (p) => ({ x: V.C.x + (p.x - V.A.x) * V.Z, y: V.C.y + (p.y - V.A.y) * V.Z });
      const P = planet(state.dest.id);
      const ssol = (m * 0.08) / Hr;   // the rocket's scale in the Sun's view
      const out = {
        sv,
        V,
        earth: { ...map(sv.at(sv.rE, sv.angle(planet('earth')))), r: planet('earth').dot * m * V.Z, op: 1 - clamp(V.z * 2, 0, 1) },
        dest: { ...map(sv.at(sv.rD, sv.angle(P))), size: ((2 * P.dot * m) / P.fill) * V.Z, op: time < T.trip0 ? V.sys : 1 }
      };
      if (time < T.trip0) {
        // leaving the Earth: speeding up along the orbit while the Earth shrinks
        const dt = time - T.dep;
        const f = (V.Z / V.Z0) * (1 - V.u);
        const lx = -((2 * Math.PI * ro) / ORBIT) * dt * (1 + dt);
        out.ring = { x: V.C.x, y: V.C.y, r: (ro * V.Z) / V.Z0, op: 0.5 * (1 - V.u) };
        out.rocket = { x: V.C.x + lx * f, y: V.C.y - ro * f, rot: -90, sc: so * Math.pow(ssol / so, V.u) };
      } else if (time < T.arrive) {
        const tau = (time - T.trip0) / T.trip;
        const q = transfer(sv, tau);
        const a = transfer(sv, tau - 0.002);
        const b = transfer(sv, tau + 0.002);
        out.rocket = { x: q.x, y: q.y, rot: (Math.atan2(b.x - a.x, a.y - b.y) * 180) / Math.PI, sc: ssol };
      } else {
        out.rocket = { x: V.C.x, y: V.C.y, rot: lerp(90, 20, V.z), sc: ssol * Math.pow((so * 0.45) / ssol, V.z) };
      }
      return out;
    }

    // off to the goal: the Earth falls behind, the goal comes closer
    const tau = clamp((time - T.dep) / (T.end - T.dep), 0, 1);
    const cam = ease(clamp(tau / 0.7, 0, 1));
    const f = lerp(1, 0.4, cam);
    const E = { x: lerp(mid.x, W * 0.88, cam), y: lerp(mid.y, H * 0.86, cam), r: re * f };
    const g = ease(tau);
    const size = m * 0.05 * Math.pow(0.62 / 0.05, g);
    const D = { x: lerp(W * 0.1, W * 0.4, g), y: lerp(H * 0.14, H * 0.4, g), size };
    const p0 = { x: E.x, y: E.y - ro * f };
    const path = [p0, { x: p0.x - W * 0.2, y: p0.y }, { x: D.x + size * 0.35, y: D.y + size * 0.55 }, D];
    const q = bezier(path, 1 - Math.pow(1 - tau, 1.6));
    return {
      earth: E,
      ring: { x: E.x, y: E.y, r: ro * f, op: 0.5 * (1 - clamp(tau / 0.25, 0, 1)) },
      dest: D,
      path,
      pathOp: 0.4 * clamp(tau / 0.1, 0, 1) * clamp((1 - tau) / 0.25, 0, 1),
      rocket: { x: q.x, y: q.y, rot: q.rot, sc: so * lerp(1, 0.45, ease(clamp((tau - 0.6) / 0.4, 0, 1))) }
    };
  }

  function fly() {
    state.phase = 'fly';
    const n = state.dest.tanks;
    const T = timeline(state.dest);
    state.parts.forEach((p) => {
      p.el.classList.remove('move', 'snap', 'pop');
      p.spin = rand(-1, 1) < 0 ? -1 : 1;
      p.drop = null;
    });
    const fl = {
      T,
      drops: Array.from({ length: n }, (_, i) => dropTime(T, i)),
      t0: performance.now(),
      last: 0,              // flight time of the previous frame
      alt: 0,               // how far the world has moved down and left
      side: 0,
      lit: 1,               // the next burn to start (for its sound)
      cross: T.trip ? crossings(T) : [],
      cap: '',
      clouds: Array.from({ length: 6 }, (_, i) => ({ x: rand(0.05, 0.95), y: 0.6 + i * 0.28 + rand(0, 0.1), r: rand(0.09, 0.16) })),
      stars: Array.from({ length: 80 }, () => ({ x: Math.random(), y: Math.random(), z: rand(0.3, 1) })),
      smoke: Array.from({ length: 10 }, () => ({ x: rand(-1, 1), v: rand(0.5, 1.2), r: rand(0.6, 1.2) })),
      raf: 0
    };
    state.fl = fl;
    // captions: the one started last is shown
    const off = () => TEXT[Astro.lang].off(state.dest.to[Astro.lang]);
    fl.caps = [{ t0: T.z1, t1: T.dep, text: () => t('orbiting') }];
    if (!T.trip) fl.caps.push({ t0: T.dep, t1: T.dep + 3, text: off });
    else {
      fl.caps.push({ t0: T.dep, t1: T.trip0, text: off }, { t0: T.trip0, t1: T.trip0 + 3, text: () => t('sunTrip') });
      fl.cross.forEach((c) => fl.caps.push({ t0: c.t, t1: c.t + 2.2, text: () => TEXT[Astro.lang].cross(c.p.of[Astro.lang]) }));
      buildSolar();
    }
    drawWorld();
    starsL.innerHTML = fl.stars.map(() => '<line stroke="#fff" stroke-linecap="round"/>').join('');
    fl.flame = svgEl('g', {}, flameL);
    fl.flame.innerHTML = '<path d="M-30 0Q-38 55 0 135Q38 55 30 0Z" fill="url(#flameGrad)"/>' +
      '<path d="M-16 0Q-20 32 0 78Q20 32 16 0Z" fill="#fff7c2"/>';
    sfx.rumble(ASCENT + 0.6);
    fl.raf = requestAnimationFrame(frame);
  }

  function frame(now) {
    const fl = state.fl;
    if (!fl) return;
    const { W, H, k, gx, gy } = state.L;
    const n = state.dest.tanks;
    const T = fl.T;
    const Hr = rocketHeight(n);
    const time = (now - fl.t0) / 1000;

    // climbing: speed up after liftoff, slow down when reaching orbit; added
    // up in small steps, so slow frames do not change how far the rocket gets
    const speed = (tt) => H * 1.5 * clamp((tt - 0.3) / 2.2, 0, 1) * (1 - ease(clamp((tt - T.z0 + 0.4) / 1.2, 0, 1)));
    for (let tt = fl.last; tt < time; tt += 1 / 60) {
      const d = speed(tt) * Math.min(1 / 60, time - tt);
      const a = (pitchAt(T, tt) * Math.PI) / 180;
      fl.alt += d * Math.cos(a);
      fl.side += d * Math.sin(a);
    }
    fl.last = time;
    const v = speed(time);
    const pa = (pitchAt(T, time) * Math.PI) / 180;
    setSky(clamp(fl.alt / (H * 3), 0, 1));
    worldL.style.transform = `translate(${-fl.side}px, ${fl.alt}px)`;
    worldL.style.display = time > T.z1 ? 'none' : '';

    // stars stream past while climbing, faster when near
    starsL.setAttribute('opacity', clamp((fl.alt / (H * 3) - 0.3) / 0.5, 0, 1));
    [...starsL.children].forEach((ln, i) => {
      const s = fl.stars[i];
      const x = mod(s.x * (W + 40) - fl.side * s.z * 0.5, W + 40) - 20;
      const y = mod(s.y * (H + 40) + fl.alt * s.z * 0.5, H + 40) - 20;
      const len = Math.min(40, v * s.z * 0.02);
      ln.setAttribute('x1', x);
      ln.setAttribute('y1', y);
      ln.setAttribute('x2', x + Math.sin(pa) * len);
      ln.setAttribute('y2', y - Math.cos(pa) * len);
      ln.setAttribute('stroke-width', 1 + 2 * s.z);
    });

    // smoke at the pad
    const smoke = worldL.querySelector('#smokeL');
    if (smoke && time < 4) {
      smoke.setAttribute('opacity', clamp(1 - time / 3.5, 0, 1));
      smoke.innerHTML = fl.smoke.map((s) => {
        const g = clamp(time - 0.2, 0, 4);
        return `<circle cx="${gx + (s.x * 60 + s.x * g * 140) * k}" cy="${gy - (10 + g * 20) * k}" r="${(25 + g * 60 * s.v) * s.r * k}"/>`;
      }).join('');
    }

    const sc = scenery(time);
    earthL.style.display = sc.earth ? '' : 'none';
    if (sc.earth) {
      earthL.setAttribute('transform', `translate(${sc.earth.x} ${sc.earth.y}) scale(${sc.earth.r / 100})`);
      earthL.setAttribute('opacity', sc.earth.op ?? 1);
    }
    if (sc.sv) updateSolar(time, sc);
    else solarL.style.display = 'none';
    orbitRing.setAttribute('opacity', sc.ring ? sc.ring.op : 0);
    if (sc.ring) {
      orbitRing.setAttribute('cx', sc.ring.x);
      orbitRing.setAttribute('cy', sc.ring.y);
      orbitRing.setAttribute('r', sc.ring.r);
    }
    tripPath.setAttribute('opacity', sc.path ? sc.pathOp : 0);
    if (sc.path) {
      const [a, b, c, d] = sc.path;
      tripPath.setAttribute('d', `M${a.x} ${a.y}C${b.x} ${b.y} ${c.x} ${c.y} ${d.x} ${d.y}`);
    }
    destImg.setAttribute('opacity', sc.dest ? sc.dest.op ?? 1 : 0);
    if (sc.dest) {
      const D = sc.dest;
      destImg.setAttribute('x', D.x - D.size / 2);
      destImg.setAttribute('y', D.y - D.size / 2);
      destImg.setAttribute('width', D.size);
      destImg.setAttribute('height', D.size);
    }

    const R = sc.rocket;
    const cos = Math.cos((R.rot * Math.PI) / 180);
    const sin = Math.sin((R.rot * Math.PI) / 180);
    // a point of the rocket, in units from its centre, on the screen
    const toScreen = (ux, uy) => ({ x: R.x + (ux * cos - uy * sin) * R.sc, y: R.y + (ux * sin + uy * cos) * R.sc });

    // the engine starts again; an orbit flashes when the rocket crosses it
    while (fl.lit < T.burns.length && time >= T.burns[fl.lit].t0) {
      sfx.rumble(T.burns[fl.lit].dur + 0.6);
      fl.lit++;
    }
    for (const c of fl.cross) {
      if (c.done || time < c.t) continue;
      c.done = true;
      const el = solarL.querySelector(`.orbit[data-id="${c.p.id}"]`);
      if (el) restart(el, 'flash');
      sfx.note(7);
    }

    // empty tanks drop off; the engine and fins move up to the next tank
    let lift = 0;
    for (let i = 0; i < n; i++) lift += 80 * ease(clamp((time - fl.drops[i]) / 0.35, 0, 1));
    const used = fuelUsed(T, time);

    for (const p of state.parts) {
      const s = p.slot;
      const sh = SHAPES[p.kind];
      let uy = s.ay + sh.h / 2 + Hr / 2;
      if (p.kind === 'engine' || p.kind === 'fin') uy -= lift;
      let pose = { ...toScreen(s.ax + s.flip * (sh.x0 + sh.w / 2), uy), rot: R.rot, sc: R.sc };
      let op = 1;
      if (p.kind === 'tank') {
        const i = s.tank;
        p.inner.querySelector('.fuel').setAttribute('width', 52 * (1 - clamp(used - i, 0, 1)));
        const dt = time - fl.drops[i];
        if (dt > 0) {
          if (!p.drop) {
            p.drop = pose;
            sfx.pick();
          }
          // falls behind the rocket, turning slowly
          const d = p.drop;
          const f = d.sc / k;
          const lx = dt * 40 * p.spin * f;
          const ly = dt * dt * H * 0.45 * f;
          const c = Math.cos((d.rot * Math.PI) / 180);
          const sn = Math.sin((d.rot * Math.PI) / 180);
          pose = { x: d.x + lx * c - ly * sn, y: d.y + lx * sn + ly * c, rot: d.rot + dt * 50 * p.spin, sc: d.sc };
          op = clamp(1 - dt / 1.4, 0, 1);
        }
      }
      setTransform(p.el, pose.x, pose.y, pose.sc, p.flip, pose.rot);
      p.el.style.opacity = op;
    }

    // flame below the engine, flickering, only while the engine burns
    const ramp = (a, b) => clamp((time - a) / 0.25, 0, 1) * clamp((b - time) / 0.25, 0, 1);
    const fire = Math.max(...T.burns.map((b, i) => ramp(i ? b.t0 : 0, b.t0 + b.dur + 0.15))) * rand(0.85, 1.15);
    const base = toScreen(0, Hr / 2 - lift);
    fl.flame.style.transform = `translate(${base.x}px, ${base.y}px) rotate(${R.rot}deg) scale(${R.sc}, ${R.sc * fire})`;

    // a line of text for the grown-ups reading along
    const shown = fl.caps.filter((c) => time >= c.t0 && time < c.t1).sort((x, y) => y.t0 - x.t0)[0];
    const cap = shown ? shown.text() : '';
    if (cap !== fl.cap) {
      fl.cap = cap;
      if (cap) $('caption').textContent = cap;
      $('caption').classList.toggle('show', !!cap);
    }

    updateProgress(clamp(time / T.end, 0, 1));
    if (time >= T.end + 0.4) {
      state.phase = 'done';
      win();
      return;
    }
    fl.raf = requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------------------
  // Winning
  // ---------------------------------------------------------------------------

  function win() {
    const d = state.dest;
    if (!state.visited.includes(d.id)) {
      state.visited.push(d.id);
      store.set('visited', state.visited);
    }
    sfx.win();
    $('winImg').src = d.file;
    rocketPicture($('winRocket'));
    updateWinText();
    $('win').classList.remove('hidden');
    Astro.startConfetti($('confetti'));
  }

  function updateWinText() {
    const d = state.dest;
    const lang = Astro.lang;
    $('winName').textContent = TEXT[lang].arrived(state.who, d.to[lang]);
    $('winFact').textContent = d.fact[lang];
    const cr = $('winCredit');
    cr.classList.toggle('hidden', !d.url);
    if (d.url) {
      cr.href = d.url;
      cr.textContent = t('photo');
    }
  }

  // ---------------------------------------------------------------------------
  // Buttons & resizing
  // ---------------------------------------------------------------------------

  new ResizeObserver(() => {
    if (!$('game').classList.contains('hidden') && state.phase !== 'menu') layout();
  }).observe(area);

  $('playBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', startGame);
  $('menuBtn').addEventListener('click', showMenu);
  $('homeBtn').addEventListener('click', showMenu);
  $('launchBtn').addEventListener('click', countdown);
  $('soundBtn').addEventListener('click', () => {
    sfx.on = !sfx.on;
    updateToggles();
    sfx.pick();
  });
  $('resetBtn').addEventListener('click', () => {
    if (!window.confirm(t('resetAsk'))) return;
    state.visited = [];
    store.set('visited', state.visited);
    updateMenu();
  });

  buildMenu();
  setTimeout(() => drawEarth(1024, (url) => scene.querySelector('#earthImg').setAttribute('href', url)), 100);
  Astro.setupLanguage(TEXT, () => {
    updateMenu();
    if (!$('win').classList.contains('hidden')) updateWinText();
  });
})();
