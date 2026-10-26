# Design notes

Rules for new games, so that they look and work like the others. For the
folder layout, see [README.md](README.md#layout). The shared parts are in
`shared/common.css` and `shared/common.js`; use them rather than making new
ones.

## Who the games are for

- Most games are for children aged 5–6, who may not read yet. Kuu faasid and
  Kosmoseviktoriin are for ages 8–10, and Avasta eksoplaneet and Leia
  asteroid for 11–12. Say in the README which age a new game is for.
- Estonian is the default language and English the second.
- The games work with a finger on a tablet or phone as well as with a mouse,
  in landscape and in portrait, down to a 360 px wide phone.
- Plain HTML, CSS and JavaScript: no build step, no server, no libraries,
  and no files to download except the Nunito font and the photos.

## Screens

Each game has up to three screens, all from `common.css`:

1. **Menu** (`.screen.menu` > `.menu-inner`): a header with 🏠 back to all
   games (`.icon`), the title with a wiggling emoji logo (`h1` >
   `.logo`), and the EST/ENG buttons (`.lang`). Then one or two
   short lines saying what to do, the choices, and the big green Play
   button (`.play-row` > `.play`). Photo credits go at the bottom (`.credit`).
   Some games, like Kuu faasid, open straight into the game instead.
2. **Game** (`.screen.game`): a top bar (`.bar`), 68 px high, with ⬅️ back to
   the menu at the left. Then the progress (`.progress` with `.track`,
   `.fill` and a count such as "2 / 6"), and then 💡 or 👁️ for a hint and
   🔊 for sound at the right. Below the bar, the playing area (`.area`) fills
   the rest of the screen.
3. **Win** (`.overlay`): star confetti (`#confetti`), and a card (`.win-card`)
   with a big yellow heading such as "Tubli! 🎉", a name and a short fact,
   and buttons (`.win-buttons` with `.btn`, `.btn.alt`) to play again, go
   on to the next level, or go back to the menu. When there is a finished
   picture (`.win-pic`), it goes beside the card on a wide screen and above
   it on a tall one, never under it.

Screens are shown and hidden with the `hidden` class. Wide and tall screens
may lay the playing area out differently (e.g. the Sun at the left or at the
top in Planeetide rivi), using `@media (min-aspect-ratio: 1/1)`.

## Look

- **Colours:** use the variables in `:root` of `common.css` rather than new
  colours:
  - `--bg1`, `--bg2`: the night-sky background
  - `--text`, `--muted`: text, and quieter text
  - `--card`, `--card-hover`: see-through white for cards and buttons
  - `--accent`: yellow, for titles, selected things and stars
  - `--sky`: light blue, for numbers, names and second buttons
  - `--go`, `--go-dark`: green, for Play and the main button
  - `--ink`: dark text on yellow or blue
- **Background:** the body has the night-sky gradient, and every page has
  `<div class="sky" aria-hidden="true"></div>` for the twinkling stars.
- **Font:** Nunito, weights 600, 800 and 900, from Google Fonts. Text is
  bold (800) by default. Use 600 for longer texts such as facts and
  credits, and 900 for titles and the Play button.
- **Text sizes** are in `rem` (or `clamp()` with a `rem` minimum), not
  `px`, so that `common.css` can make all text a little smaller on a
  phone.
- **Shapes:** everything is round. Cards have a 22–28 px radius, buttons are
  pill-shaped (`border-radius: 999px`) or circles, and nothing has sharp
  corners.
- **Choices in the menu:** picture cards (`.pictures` > `.pic`) or number
  buttons (`.counts` > `.count`). The chosen one gets a yellow border,
  grows a little and glows (`.selected`). A yellow fill would hide yellow
  emoji and pictures, such as 🧑, ✨ and 🌠. A numbered blue circle
  (`.step`) in front of an `h2` shows the order when there are several
  choices to make. A 🌟 marks a level that is done.
- **Buttons to press** have a coloured "edge" under them (a
  `box-shadow` with no blur) and sink when pressed (`:active`). The
  Play button also breathes slowly, to show where to tap next.
- **Things that clear a record or progress** are small, grey and quiet
  (`.clear-best`), and need a second tap, so that they are not pressed by
  mistake.
- **Motion:** things pop in (`pop`), wiggle when wrong, and pulse when they
  are the hint. Keep animations short and soft.
- **Pictures:**
  - Photos are by Tõrva Astronoomiaklubi, in `pusle/images/`, licensed CC
    BY-NC-SA. Credit them on the menu (`.credit`) and list them in the README.
  - The planets are drawn by `shared/planets.js`, so they look the same in
    every game.
  - Small pictures such as characters, rockets and jars are inline SVG
    with flat colours.
  - The objects need not be to scale, but bigger and smaller should be in
    the right order, and the README says what is not to scale.

## Play

- **Big targets:** buttons are at least 52 px, and things to tap or drag are
  as big as the screen allows. Hits may be a little generous: a shooting star
  still counts just after it fades.
- **Drag or tap:** wherever something is dragged, it can also be tapped and
  then its place tapped. Use pointer events (`pointerdown`, `pointermove`,
  `pointerup`, `pointercancel`) so that mouse and touch work the same, and
  `touch-action: none` on the playing area.
- **No punishment:** a wrong move does not cost points or lives. The piece
  goes back, a soft `sfx.oops()` plays, and a short message says why ("Marss
  on Päikesest kaugemal."). After two misses with the same thing, its right
  place pulses. If nothing happens for a few seconds, a 👆 shows what to do.
- **Hints:** 💡 or 👁️ in the top bar shows the answer faintly or for a moment.
  It is always allowed.
- **Learning:** each right step or finished level shows one short true fact,
  in words a child understands. The facts teach what the game is about.
- **Sounds** are made in code by `Astro.sfx`, with no sound files:
  - `pick()` when something is picked up or chosen
  - `snap()` when it goes into its right place
  - `oops()` when it is wrong
  - `note(i)` for the next note of a tune, e.g. for each catch in a row
  - `win()` on the win screen, together with `Astro.startConfetti()`
  - others for one game, such as `jump()`, `clink()` and `rumble()`
  
  The 🔊 button toggles `Astro.sfx.on`, which all games share.
- **Records** (best score, levels done) are kept with
  `Astro.makeStore('<game>.')`, with the game's folder as the prefix. The
  language and sound settings are shared and kept by `common.js`.

## Texts

- All texts are in a `TEXT` object at the top of `app.js`, with the same keys
  under `et` and `en`. Texts that depend on a number or name are functions:
  ``level: (n) => `${n} planeeti` ``.
- In the HTML, `data-t="key"` fills an element's text and `data-t-label="key"`
  its `aria-label`. Call `Astro.setupLanguage(TEXT, onChange)` once, and
  redraw any texts the game sets itself in `onChange`.
- Write short sentences in plain words, as one would speak to a child, with
  the names children know: Põhjanael, Suur Vanker, Sõel. Each fact is one to
  three sentences.
- Estonian names of games and things are proper Estonian, e.g. "Planeetide
  rivi", not a word-for-word translation of the English.
- Data the game is built from, such as levels, planets and questions, goes
  in a list at the top of `app.js`, so that it can be changed without
  reading the code. The README says where it is.

## Adding a game

1. Make a folder with `index.html`, `style.css` and `app.js`. Copy the
   `<head>` of an existing game, which has the viewport, the `color-scheme`
   tag, the font and `../shared/common.css`. Load `../shared/common.js`
   before `app.js`.
2. Put only what is special to the game in its `style.css`, and say at its
   top that the rest is in `shared/common.css`.
3. Add a card to the start page `index.html`. Its picture is a 100×100 SVG
   drawn from the game itself, with a few white dots for stars. Add its
   name and one line in both languages to the `TEXT` there.
4. Add the game to the table in the README and a section saying how it is
   played and where its data is.
5. Check it on a phone in portrait, a tablet in landscape and in dark mode
   (below).

## Dark mode on phones

The games are dark already, but phone browsers in dark mode still recolour
them. Some of them ignore `<meta name="color-scheme" content="dark">` and
`color-scheme: dark`, and there is no way for a page to opt out. Left alone,
this turns the Sun and other bright things dark, and small dark photos white.

What the recolouring does:

| Drawn as | In dark mode |
|---|---|
| CSS background colours, gradients, borders, shadows | darkened: yellow turns brown |
| SVG gradients (`radialGradient`, `linearGradient`) | lightness flipped: a bright centre turns dark |
| SVG shapes with a flat `fill` or `stroke`, also with `opacity` or a blur `filter` | kept |
| SVG shapes with a flat `fill` or `stroke`, in Samsung Internet | dark ones lightened and light ones dimmed, also with `opacity` |
| SVG pictures shown with `<img>`, in Samsung Internet | dimmed: a QR code turns grey |
| Text and emoji | kept |
| `<canvas>` | kept |
| PNG or JPEG pictures 80 px or larger | kept |
| Smaller pictures that are mostly dark or transparent, including SVG pictures used as `url(...)` | turned white |

### Rules

1. Every page has `<meta name="color-scheme" content="dark">`. It does not
   stop the recolouring everywhere, but it does in some browsers.
2. Draw the Sun, stars, glows, flames and anything else that must stay
   bright in SVG, a canvas or a picture, never with a CSS `background`,
   `radial-gradient` or `box-shadow`. CSS colours are fine for the menu,
   buttons and cards, which are darkened in the same way in every game.
   - Mark an SVG picture, or a single shape, with `data-ink`, as the
     pictures on the start page, the jar and the night pictures of Püüa
     langev täht, and the dark side of the Moon and the shadows in Kuu
     faasid are. `shared/common.js` then gives each shape in it a filter
     that paints it in its own colour, so that it keeps its colour however
     the browser recolours it. A shape with both a fill and a stroke is
     split in two, and a blur filter on it is kept. `opacity` still works,
     and shapes added later are handled too, but a colour the game changes
     later is not followed, so don't use it on those.
   - Show a picture such as the QR code as a PNG, not as an SVG file.
3. SVG gradients may be used freely. `shared/common.js` swaps each one for a
   `<pattern>` of the same id holding a PNG picture of it, so shapes that use
   `fill="url(#id)"` keep their look. Gradients the game adds later, e.g.
   with `innerHTML`, are swapped too.
   - The swap handles gradients in the units of the shape they fill (the
     default), with `cx`, `cy`, `r`, `fx`, `fy` or `x1`…`y2`. It skips
     `gradientUnits="userSpaceOnUse"` and `gradientTransform`, so don't use
     these for bright things.
   - A gradient whose stops the game changes while it runs (the sky in
     Kosmoserakett) must have the `data-live` attribute, or the game
     cannot find its stops. Such a gradient is darkened in dark mode, so use
     it only for things that may go darker, such as a sky.
   - A gradient that fades to see-through (a glow, a tail) on a shape under
     80 px on a phone becomes a small, mostly see-through picture, which
     phones turn white. Draw such things as flat shapes with `opacity` and
     a blur `filter` instead, as the glows and the shooting-star tails on
     the start page do.
4. Show photos at 80 px or larger. If one must be smaller, draw it at twice
   the size and shrink it with `transform: scale(0.5)` (in SVG,
   `transform="scale(0.5)"`), as the Saturn photos on the start page do.
5. Pictures drawn on a canvas and turned into PNGs (as `shared/planets.js`
   does for the planets) are safe at any size.

### Checking

Desktop Chrome can recolour pages the way phones do:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --enable-features=WebContentsForceDark --user-data-dir=/tmp/forcedark
```

Open the new game in that window and in a normal one. The Sun, stars, glows
and photos should look the same in both. Buttons, borders and selected
cards may be darker in the forced-dark window.
