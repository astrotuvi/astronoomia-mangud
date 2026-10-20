# Astronoomiamängud / Astronomy games

Simple astronomy games for children aged 5–6, in Estonian (default) or English.
They work with mouse and touch screens (tablets), in landscape and portrait.

| Game | Folder | What to do |
|---|---|---|
| Tähepusle / Star Puzzle | [`pusle/`](pusle/) | Put together a jigsaw puzzle of an astronomy photo |
| Tähtkujud / Constellations | [`tahtkujud/`](tahtkujud/) | Join the stars of a constellation in order 1, 2, 3 … |
| Mälumäng / Memory | [`malumang/`](malumang/) | Turn cards over and find the pairs of astronomy photos |
| Kosmoserakett / Space Rocket | [`rakett/`](rakett/) | Build a rocket and fly it to the Moon, Mars, Jupiter or Saturn |

The language and sound settings are shared by all games.

## Running

No build step and no server needed. Open `index.html` in a browser, or serve the folder with any static web server, e.g.

```sh
python3 -m http.server
```

## Layout

- `index.html`: the start page with links to the games
- `shared/`: the theme, menu, top bar and win screen (`common.css`), and settings, language, sounds and star confetti (`common.js`)
- one folder per game, each with its own `index.html`, `app.js` and `style.css`

To add a game, make a new folder that loads `../shared/common.css` and `../shared/common.js`, and add a card for it to `index.html`.

## Tähepusle

- Pick a picture and the number of pieces (4, 9, 16, 25, 36 or 49).
- Drag pieces onto the board. A piece snaps into place when it is close to its spot.
- 👁️ turns the faint hint picture on the board on or off. 🔊 turns sounds on or off.

To add a picture, put a **square** image (about 1200×1200 px) in `pusle/images/` and add an entry to the `IMAGES` list at the top of `pusle/app.js`.

## Tähtkujud

- Pick one of 15 constellations, listed from the fewest stars (5) to the most (14), with three or four for each season:
  - all year: Suur Vanker (Big Dipper), Väike Vanker (Little Dipper), Kassiopeia
  - winter: Orion, Kaksikud (Gemini), Sõnn (Taurus), Perseus
  - spring: Lõvi (Leo), Karjane (Boötes)
  - summer: Luik (Cygnus), Lüüra (Lyra), Kotkas (Aquila), Põhjakroon (Corona Borealis)
  - autumn: Pegasus, Andromeeda (Andromeda)
- Tap the numbered stars in order, or slide a finger from star to star. Each star plays the next note of a tune, and a golden line joins it to the figure.
- A star tapped out of turn only wiggles. If nothing happens for a few seconds, the next star starts to pulse.
- 👁️ shows the whole figure as faint dashed lines. Finished constellations get a 🌟 in the menu.
- The win screen tells a short fact. The stars it mentions are ringed and labelled in the picture, e.g. "1 Deeneb". The Orion Nebula and the Andromeda Galaxy are drawn where they are in the sky.

Star positions are J2000 coordinates, drawn as on a sky chart with north up and east to the left. To add a constellation, add an entry to the `CONSTELLATIONS` list at the top of `tahtkujud/app.js`. The comment there explains how the stars are joined.

## Mälumäng

- Pick the number of pairs (3, 4, 6, 8 or 10). Each game uses a different random set of the puzzle's photos.
- Turn two cards over. A matching pair stays open and shows the object's name. Two different cards turn back after a moment, or at once when the next card is tapped.
- 👁️ shows all cards for a moment. The win screen shows all the pairs found and the number of tries.

The game uses the photos in `pusle/images/`. The list of photos is at the top of `malumang/app.js`.

## Kosmoserakett

- Pick where to fly and who flies (a cat, dog, bear, rabbit or astronaut). The farther away, the more fuel tanks the rocket needs: 1 for the Moon, 2 for Mars, 3 for Jupiter and 4 for Saturn.
- Drag the parts from the tray onto the dashed outlines: engine, fuel tanks, body with a window, nose and two fins. A part snaps into the nearest free spot of its kind.
- Tapping a part in the tray makes its spot glow. If nothing happens for a few seconds, the next empty spot glows and its part wiggles. Tapping a part on the rocket changes its colour.
- When the rocket is complete, press **Start!** for a countdown and the flight, which goes as on a real trip:
  - The rocket lifts off and turns as it climbs, and the sky turns from blue to black.
  - The view zooms out to show the whole Earth, and the rocket goes once round the Earth with its engine off.
  - The engine fires again and the rocket leaves along a curved path. The Earth falls behind and the goal grows until the rocket lands.
  - Getting into orbit takes the first tank, or half of it when there is only one. The other tanks are used to leave orbit. Each tank drops off when it is empty.
- The win screen shows the photo with the rocket and a short fact. Places visited get a 🌟 in the menu.

The destinations are in the `DESTS` list at the top of `rakett/app.js`. Mars has no photo, so the game draws it, and the Earth seen from space is drawn too.

## Credits

All photos are by **Tõrva Astronoomiaklubi** and come from their AstroBin gallery,
<https://app.astrobin.com/u/Astronoomiaklubi>. They are licensed
[CC BY-NC-SA](https://creativecommons.org/licenses/by-nc-sa/4.0/) (Attribution–NonCommercial–ShareAlike).
The files in `pusle/images/` are square crops, scaled to 1200×1200 px, and are shared under the same licence.

| File | Object | AstroBin |
|---|---|---|
| `pleiades.jpg` | Pleiades (M45) | <https://www.astrobin.com/qirtxe/> |
| `moon.jpg` | Moon in colour | <https://www.astrobin.com/oy5di6/> |
| `saturn.jpg` | Saturn | <https://www.astrobin.com/fu9tbu/> |
| `jupiter.jpg` | Jupiter (Ganymede transit) | <https://www.astrobin.com/gnc57p/> |
| `eclipse.jpg` | Solar eclipse, 10 June 2021 | <https://www.astrobin.com/ytu8fs/> |
| `orion.jpg` | Orion Nebula (M42) | <https://www.astrobin.com/uu55w0/> |
| `horsehead.jpg` | Horsehead and Flame Nebulae | <https://www.astrobin.com/4yxzcw/> |
| `rosette.jpg` | Rosette Nebula | <https://www.astrobin.com/61be3g/> |
| `andromeda.jpg` | Andromeda Galaxy (M31) | <https://www.astrobin.com/4ocaul/> |
| `whirlpool.jpg` | Whirlpool Galaxy (M51) | <https://www.astrobin.com/ymu58n/> |
