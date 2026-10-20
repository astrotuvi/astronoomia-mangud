# Astronoomiamängud / Astronomy games

Simple astronomy games for children aged 5–6, and Kuu faasid for ages 8–10 (marked 8+ on the start page), in Estonian (default) or English.
They work with mouse and touch screens (tablets), in landscape and portrait.

| Game | Folder | What to do |
|---|---|---|
| Tähepusle / Star Puzzle | [`pusle/`](pusle/) | Put together a jigsaw puzzle of an astronomy photo |
| Tähtkujud / Constellations | [`tahtkujud/`](tahtkujud/) | Join the stars of a constellation in order 1, 2, 3 … |
| Mälumäng / Memory | [`malumang/`](malumang/) | Turn cards over and find the pairs of astronomy photos |
| Kosmoserakett / Space Rocket | [`rakett/`](rakett/) | Build a rocket and fly it to the Moon, Mars, Jupiter or Saturn |
| Kuu faasid / Moon Phases (8+) | [`kuufaasid/`](kuufaasid/) | Move the Moon round the Earth and see why its shape changes |

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
  - To the Moon: the engine fires again and the rocket leaves along a curved path. The Earth falls behind and the Moon grows until the rocket lands.
  - To a planet: the engine fires again and the view zooms out to the Sun and the orbits of the planets, with the asteroid belt between Mars and Jupiter. The rocket flies half way round the Sun on an orbit that touches the Earth's orbit at one end and the planet's at the other, as real spacecraft do. It goes faster near the Sun and slower far from it, and the planets nearer the Sun go round faster (Kepler's laws). When the rocket crosses another planet's orbit, the orbit flashes. The planet moves along its own orbit and arrives at the meeting point together with the rocket, which brakes and lands as the view zooms in. The orbits are not to scale.
  - Everything is seen from above the North Pole, so the rocket and the planets go round anticlockwise, as they do in reality. The rocket turns left (east) as it climbs.
  - Getting into orbit takes the first tank, or half of it when there is only one. The other tanks are used to leave orbit, except that on a trip to a planet the last half tank is kept for braking. Each tank drops off when it is empty.
  - A caption at the top says what is happening, e.g. "Tiirleme ümber Maa 🌍" or "Lendame üle Marsi orbiidi".
- The win screen shows the photo with the rocket and a short fact. Places visited get a 🌟 in the menu.

The destinations are in the `DESTS` list at the top of `rakett/app.js`, and the planets of the Sun's view in the `PLANETS` list. Mars has no photo, so the game draws it, and the Earth seen from space is drawn too.

## Kuu faasid

- Two views side by side (or one above the other on a tall screen):
  - **from space**, above the North Pole: the Sun's light comes from the right, and the Moon goes round the Earth anticlockwise. The Moon is always half lit, and a blue arc marks the half that faces the Earth. The shadows of the Earth and the Moon are drawn too. The Moon's path is tilted by about 5 degrees: on its bright half the Moon is a little higher than the Earth's path round the Sun, on its faint dashed half a little lower, and the two yellow dots (the nodes) are where the halves meet.
  - **from the Earth**: the Moon photo, lit to match, with its name below. The dark part glows faintly with light reflected from the Earth, except near new moon.
- Drag the Moon anywhere along its path. Each new phase plays a note.
- **Uuri / Explore**: the Moon can be moved freely, and the view from the Earth also says how many days have passed since new moon and when the Moon is highest in the sky. ▶️ plays a whole month in 20 seconds. As the Moon goes round, the nodes turn about 31 degrees a month relative to the Sun (as the Earth goes round the Sun), so they point towards the Sun about every six months. Then "Varjutuste aeg / Eclipse season" is shown.
- **Ülesanded / Tasks**: 11 tasks, e.g. make a full moon, make the Moon in a picture, say what the Moon looks like a week after full moon, put the Moon exactly between the Earth and the Sun (and find that there is no eclipse), and make a solar and a lunar eclipse in eclipse season. The view from the Earth is hidden while the Moon is dragged, and shown when it is let go, so the child has to think first. A wrong answer names the phase that was made. Each solved task shows a short fact. 👁️ shows for a moment where the Moon should go.
- Near new moon the Sun appears behind the Moon. Usually the Moon passes above or below it, but in eclipse season it covers the Sun partly or completely. Near full moon the Earth's shadow likewise passes above or below the Moon, or in eclipse season crosses it and turns it copper red.

The phases and their names are in the `PHASES` list at the top of `kuufaasid/app.js`, and the tasks in the `TASKS` list. The sizes and distances are not to scale.

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
