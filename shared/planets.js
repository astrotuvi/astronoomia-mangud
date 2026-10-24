'use strict';

// Planets drawn pixel by pixel: Mars and the Earth seen from space for
// Kosmoserakett and Hüppa planeedil, and all eight for Planeetide rivi.
window.AstroPlanets = (() => {
  const { clamp } = Astro;

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
  // It sits in a starry black square, or with onlyBall alone filling the
  // picture on a clear background.
  function drawMars(size, onlyBall) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = size;
    const g = cv.getContext('2d');
    if (!onlyBall) {
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
    }

    const c = size / 2;
    const r = onlyBall ? size / 2 - 1 : size * 0.4;
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
  // The other planets, drawn like Mars but with less detail
  // ---------------------------------------------------------------------------

  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  // Stripes by latitude: each [edge, colour] reaches up to its edge (from -1
  // at the south pole to 1 at the north pole), blending softly into the next.
  function bands(v, list, soft) {
    let col = list[0][1];
    for (let k = 0; k < list.length - 1; k++) col = mix(col, list[k + 1][1], sstep(list[k][0] - soft, list[k][0] + soft, v));
    return col;
  }

  // A soft oval spot on a planet, 1 inside and 0 outside.
  function spot(lat, lon, lat0, lon0, h, w) {
    const e = ((lon - lon0) / w) ** 2 + ((lat - lat0) / h) ** 2;
    return 1 - sstep(0.6, 1, e);
  }

  // Mercury's craters: where they are and how big (in radians), always the same.
  const CRATERS = (() => {
    let seed = 11;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    return Array.from({ length: 70 }, () => {
      const u = 2 * rnd() - 1;
      const f = 2 * Math.PI * rnd();
      const q = Math.sqrt(1 - u * u);
      return { c: [q * Math.cos(f), u, q * Math.sin(f)], r: 0.03 + 0.15 * rnd() ** 3 };
    });
  })();

  // How each planet looks. surface(x, y, z, lat, lon) gives the colour at a
  // point on the planet, with y towards its north pole. tilt leans the north
  // pole towards us, roll turns the whole planet in the picture (Uranus lies
  // on its side), and haze is a thin glow at the edge. ring(radius) gives
  // the colour and opacity of the rings, in planet radii from the centre;
  // wide and tall are how much bigger than the ball the picture is.
  const LOOKS = {
    mercury: {
      tilt: 0.1,
      surface(x, y, z) {
        let k = 0.78 + 0.4 * fbm(x * 3 + 2, y * 3, z * 3) + 0.12 * (fbm(x * 12, y * 12 + 5, z * 12, 4) - 0.5);
        for (const cr of CRATERS) {
          const dot = x * cr.c[0] + y * cr.c[1] + z * cr.c[2];
          const t = Math.sqrt(Math.max(0, 2 - 2 * dot)) / cr.r;
          if (t > 1.7) continue;
          // a darker floor, a bright rim and a pale splash round it
          k *= 1 - 0.16 * (1 - sstep(0.65, 0.85, t)) + 0.2 * Math.exp(-(((t - 0.95) / 0.1) ** 2)) +
            0.08 * sstep(0.95, 1.1, t) * (1 - sstep(1.1, 1.7, t));
        }
        return [158 * k, 148 * k, 138 * k];
      }
    },
    venus: {
      tilt: 0.2,
      haze: [255, 244, 215], hazeAmount: 0.7, hazePower: 2,
      surface(x, y, z) {
        const q = fbm(x * 2 + 1, y * 6, z * 2, 4);
        const v = fbm(x * 1.5 + 2 * q, y * 5 + 2 * q, z * 1.5, 4);
        return mix([212, 176, 116], [246, 230, 190], sstep(0.3, 0.7, v));
      }
    },
    jupiter: {
      tilt: 0.05,
      surface(x, y, z, lat, lon) {
        const v = y + 0.05 * (fbm(x * 3, y * 10, z * 3, 4) - 0.5) + 0.012 * Math.sin(lon * 7 + y * 30);
        let col = bands(v, [
          [-0.75, [172, 158, 140]], [-0.6, [214, 194, 168]], [-0.45, [190, 146, 110]], [-0.32, [236, 224, 204]],
          [-0.1, [182, 118, 80]], [0.12, [232, 212, 178]], [0.3, [172, 110, 74]], [0.4, [232, 218, 195]],
          [0.55, [186, 140, 104]], [0.75, [212, 192, 166]], [2, [172, 158, 140]]
        ], 0.025);
        col = col.map((c) => c * (0.9 + 0.2 * fbm(x * 6 + 1, y * 24, z * 6, 4)));
        // the Great Red Spot with its pale ring, and a few white ovals
        const e = ((lon - 0.45) / 0.3) ** 2 + ((lat + 0.38) / 0.085) ** 2;
        col = mix(col, [238, 226, 206], (1 - sstep(1, 1.6, e)) * 0.7);
        col = mix(col, [204, 108, 72], 1 - sstep(0.6, 1, e));
        for (const l of [-0.5, -0.1, 0.3]) col = mix(col, [245, 240, 230], spot(lat, lon, -0.62, l, 0.04, 0.07) * 0.8);
        return col;
      }
    },
    saturn: {
      tilt: 0.22,
      wide: 2.0,
      surface(x, y, z) {
        const v = y + 0.02 * (fbm(x * 3, y * 10, z * 3, 4) - 0.5);
        const col = bands(v, [
          [-0.6, [200, 182, 142]], [-0.35, [226, 206, 162]], [-0.15, [206, 172, 122]], [0.15, [238, 218, 172]],
          [0.35, [202, 168, 118]], [0.6, [226, 206, 162]], [0.82, [204, 186, 146]], [2, [168, 168, 150]]
        ], 0.04);
        return col.map((c) => c * (0.94 + 0.12 * fbm(x * 5, y * 20, z * 5, 3)));
      },
      // the C, B and A rings, with the dark Cassini Division between B and A
      ring(d) {
        const q = d / 0.86;
        if (q < 1.24 || q > 2.27) return null;
        const ripple = 0.08 * Math.sin(q * 91) + 0.06 * Math.sin(q * 37);
        if (q < 1.53) return [[150, 132, 110], 0.25 + ripple];
        if (q < 1.95) return [[230, 210, 172].map((c) => c * (0.92 + ripple)), 0.9];
        if (q < 2.03) return [[90, 80, 70], 0.1];
        if (Math.abs(q - 2.21) < 0.008) return [[90, 80, 70], 0.15];
        return [[206, 188, 156].map((c) => c * (0.95 + ripple)), 0.72];
      }
    },
    uranus: {
      tilt: 0.36,
      roll: 1.42,
      tall: 1.66,
      wide: 1.04,
      haze: [220, 250, 255], hazeAmount: 0.35,
      surface(x, y, z) {
        const col = bands(y + 0.02 * (fbm(x * 3, y * 8, z * 3, 3) - 0.5), [
          [-0.2, [160, 214, 222]], [0.2, [172, 224, 230]], [0.55, [180, 230, 234]], [2, [205, 240, 242]]
        ], 0.08);
        return col;
      },
      // thin dark rings, the brightest one outermost
      ring(d) {
        if (Math.abs(d - 1.6) < 0.02) return [[175, 195, 205], 0.45];
        if (Math.abs(d - 1.52) < 0.008 || Math.abs(d - 1.47) < 0.006) return [[160, 180, 190], 0.25];
        return null;
      }
    },
    neptune: {
      tilt: 0.3,
      haze: [130, 175, 255], hazeAmount: 0.4,
      surface(x, y, z, lat, lon) {
        let col = bands(y, [[-0.6, [44, 74, 178]], [-0.15, [62, 98, 205]], [0.15, [84, 128, 225]], [0.6, [62, 98, 205]], [2, [46, 76, 180]]], 0.12);
        col = mix(col, [28, 48, 138], spot(lat, lon, -0.35, 0.3, 0.1, 0.25));
        // bright clouds streaked along the winds
        const streak = sstep(0.6, 0.78, fbm(x * 3 + 4, y * 16, z * 3, 4));
        const where = Math.exp(-(((lat + 0.5) / 0.12) ** 2)) + Math.exp(-(((lat - 0.35) / 0.1) ** 2)) + spot(lat, lon, -0.27, 0.35, 0.05, 0.2);
        return mix(col, [235, 242, 255], Math.min(1, streak * where) * 0.85);
      }
    }
  };

  // A planet from LOOKS, drawn pixel by pixel in small parts so the page does
  // not stop. done() gets the picture and its width and height in the same
  // units as the ball, whose radius is 50.
  function drawGlobe(look, size, done) {
    const W = Math.ceil(size * (look.wide || 1));
    const H = Math.ceil(size * (look.tall || 1));
    const cx = W / 2;
    const cy = H / 2;
    const r = size / 2 - 1;
    const cr = Math.cos(look.roll || 0);
    const sr = Math.sin(look.roll || 0);
    const ct = Math.cos(look.tilt || 0);
    const st = Math.sin(look.tilt || 0);
    // the sunlight from the upper left, turned with the planet
    const L0 = [-0.5, -0.3, 0.81];
    const ln = Math.hypot(...L0);
    const L = [(L0[0] * cr + L0[1] * sr) / ln, (-L0[0] * sr + L0[1] * cr) / ln, L0[2] / ln];
    const ring = look.ring;
    // how far the ring plane is from a point, along the line of sight and
    // towards the Sun (the plane holds the equator, and y is down)
    const planeZ = (y) => (y * ct) / st;
    const towardSun = L[1] * ct - L[2] * st;

    const cv = document.createElement('canvas');
    cv.width = W;
    cv.height = H;
    const g = cv.getContext('2d');
    const img = g.createImageData(W, H);
    const px = img.data;

    // a point of the rings as [colour, opacity], darkened in the planet's shadow
    function ringAt(x, y) {
      const z = planeZ(y);
      const hit = ring(Math.hypot(x, y, z));
      if (!hit) return null;
      const pl = x * L[0] + y * L[1] + z * L[2];
      const shadow = pl < 0 && x * x + y * y + z * z - pl * pl < 1;
      return [hit[0].map((c) => c * (shadow ? 0.2 : 1)), Math.max(0, Math.min(1, hit[1])), z];
    }

    function pixel(i, j) {
      const sx = (i + 0.5 - cx) / r;
      const sy = (j + 0.5 - cy) / r;
      const x = sx * cr + sy * sr;
      const y = -sx * sr + sy * cr;
      const d = Math.hypot(x, y);
      const ballA = clamp((1 - d) * r + 0.5, 0, 1);

      // the rings, smoothed over three points across the pixel
      let rc = null;
      let ra = 0;
      let rz = 0;
      if (ring && st > 0) {
        let n = 0;
        const sum = [0, 0, 0];
        for (const o of [-1 / 3, 0, 1 / 3]) {
          const yy = y + (o * cr) / r;
          const xx = x - (o * sr) / r;
          const h = ringAt(xx, yy);
          if (!h) continue;
          sum[0] += h[0][0] * h[1];
          sum[1] += h[0][1] * h[1];
          sum[2] += h[0][2] * h[1];
          ra += h[1] / 3;
          rz = h[2];
          n++;
        }
        if (n && ra > 0) rc = sum.map((v) => v / (ra * 3));
      }

      let out = [0, 0, 0, 0];
      const over = (col, a) => {
        const ao = a + out[3] * (1 - a);
        if (ao <= 0) return;
        out = [0, 1, 2].map((k) => (col[k] * a + out[k] * out[3] * (1 - a)) / ao).concat(ao);
      };
      let zBall = -Infinity;
      if (ballA > 0) zBall = Math.sqrt(Math.max(0, 1 - d * d));
      if (rc && rz < zBall) over(rc, ra);

      if (ballA > 0) {
        const z = zBall;
        // the point on the planet itself, with north up
        const bx = x;
        const by = -y * ct + z * st;
        const bz = y * st + z * ct;
        const lat = Math.asin(clamp(by, -1, 1));
        const lon = Math.atan2(bx, bz);
        let col = look.surface(bx, by, bz, lat, lon);
        let light = 0.04 + 0.96 * Math.pow(Math.max(0, x * L[0] + y * L[1] + z * L[2]), 0.8);
        // the shadow of the rings
        if (ring && st > 0 && towardSun !== 0) {
          const s = -(y * ct - z * st) / towardSun;
          if (s > 0) {
            const hit = ring(Math.hypot(x + s * L[0], y + s * L[1], z + s * L[2]));
            if (hit) light *= 1 - 0.45 * clamp(hit[1], 0, 1);
          }
        }
        const rim = look.haze ? Math.pow(1 - z, look.hazePower || 3) * look.hazeAmount * Math.max(0.15, light) : 0;
        col = col.map((v, k) => v * light + (rim ? look.haze[k] * rim : 0));
        over(col, ballA);
      }
      if (rc && rz >= zBall) over(rc, ra);

      const o = (j * W + i) * 4;
      px[o] = out[0];
      px[o + 1] = out[1];
      px[o + 2] = out[2];
      px[o + 3] = 255 * out[3];
    }

    let j = 0;
    (function rows() {
      const stop = Math.min(H, j + 24);
      for (; j < stop; j++) for (let i = 0; i < W; i++) pixel(i, j);
      if (j < H) {
        setTimeout(rows, 0);
        return;
      }
      g.putImageData(img, 0, 0);
      done({ url: cv.toDataURL('image/png'), w: (W / r) * 50, h: (H / r) * 50 });
    })();
  }

  // Any of the eight planets as a picture on a clear background, size pixels
  // across the ball. done() gets { url, w, h }, with w and h in the units of
  // a ball of radius 50.
  function drawPlanet(id, size, done) {
    if (id === 'mars') {
      setTimeout(() => done({ url: drawMars(size, true), w: (size / (size / 2 - 1)) * 50, h: (size / (size / 2 - 1)) * 50 }), 0);
    } else if (id === 'earth') {
      drawEarth(size, (url) => done({ url, w: (size / (size / 2 - 1)) * 50, h: (size / (size / 2 - 1)) * 50 }));
    } else {
      drawGlobe(LOOKS[id], size, done);
    }
  }

  return { drawMars, drawEarth, drawPlanet };
})();
