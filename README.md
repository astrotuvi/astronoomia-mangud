# Astronoomia mängud / Astronomy games

Simple astronomy games for children aged 5–6, and Kuu faasid for ages 8–10, in Estonian (default) or English.
They work with mouse and touch screens (tablets), in landscape and portrait.

| Game | Folder | What to do |
|---|---|---|
| Tähepusle / Star Puzzle | [`pusle/`](pusle/) | Put together a jigsaw puzzle of an astronomy photo |
| Tähtkujud / Constellations | [`tahtkujud/`](tahtkujud/) | Join the stars of a constellation in order 1, 2, 3 … |
| Mälumäng / Memory | [`malumang/`](malumang/) | Turn cards over and find the pairs of astronomy photos |
| Kosmoserakett / Space Rocket | [`rakett/`](rakett/) | Build a rocket and fly it to the Moon, Mars, Jupiter or Saturn |
| Kuu faasid / Moon Phases | [`kuufaasid/`](kuufaasid/) | Move the Moon round the Earth and see why its shape changes |
| Hüppa planeedil / Planet Jump | [`hupe/`](hupe/) | Jump on the Earth, the Moon, Mars and Jupiter and catch a star on each |
| Püüa langev täht / Catch a Shooting Star | [`meteoor/`](meteoor/) | Tap shooting stars to catch them in a jar during one night |

The language and sound settings are shared by all games.

## Running

No build step and no server needed. Open `index.html` in a browser, or serve the folder with any static web server, e.g.

```sh
python3 -m http.server
```

## Layout

- `index.html`: the start page with links to the games
- `shared/`: the theme, menu, top bar and win screen (`common.css`), settings, language, sounds and star confetti (`common.js`), and the drawn pictures of Mars and the Earth seen from space (`planets.js`)
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
- 👁️ shows all cards for a moment. The win screen shows all the pairs found and the number of tries, unless 👁️ was used: then the tries don't count.
- The fewest tries for each number of pairs is kept as the best score, shown in the menu under the number of pairs ("🏆 Parim: 5 katset") and on the win screen.

The game uses the photos in `pusle/images/`. The list of photos is at the top of `malumang/app.js`.

## Kosmoserakett

- Pick where to fly and who flies (a cat, dog, bear, rabbit or astronaut). The farther away, the more fuel tanks the rocket needs: 1 for the Moon, 2 for Mars, 3 for Jupiter and 4 for Saturn.
- Drag the parts from the tray onto the dashed outlines: engine, fuel tanks, body with a window, nose and two fins. A part snaps into the nearest free spot of its kind.
- Tapping a part in the tray makes its spot glow. If nothing happens for a few seconds, the next empty spot glows and its part wiggles. Tapping a part on the rocket changes its colour.
- When the rocket is complete, press **Start!** for a countdown and the flight, which goes as on a real trip:
  - The rocket lifts off and turns as it climbs, and the sky turns from blue to black.
  - The view zooms out to show the whole Earth, and the rocket goes twice round the Earth with its engine off.
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
- Drag the Moon anywhere along its path. Each new phase plays a note. ▶️ plays a whole month in 20 seconds. The view from the Earth also says how many days have passed since new moon.
- As the Moon goes round, the nodes turn about 31 degrees a month relative to the Sun (as the Earth goes round the Sun), so they point towards the Sun about every six months. Then "Varjutuste aeg / Eclipse season" is shown.
- The game opens straight into the views, with 10 tasks: first the four main phases (full moon, first quarter, new moon, last quarter), then the phases in between from pictures, both not in the order they come, and last a solar and a lunar eclipse.
  - The top bar shows all the tasks as a row of small pictures. The current one is ringed, and solved ones get a ⭐ (on a phone the row is under the buttons).
  - The current task is at the top right of the view from the Earth: its picture and a short text such as "Leia täiskuu", with a tip or a message below it.
  - A task is solved when the Moon is let go in the right place. Then a short fact is shown under the Moon, with a button to go on.
  - The eclipses work only in eclipse season, so the child has to play months forward with ▶️ until it comes. When the solar eclipse task starts, the nodes turn so that the next new moon passes by the Sun and the one after it, one or two months away, makes an eclipse, with a lunar eclipse two weeks later. A new or full moon that misses says so.
  - 👁️ shows for a moment where the Moon should go.
- Near new moon the Sun appears behind the Moon. Usually the Moon passes above or below it, but in eclipse season it covers the Sun partly or completely. Near full moon the Earth's shadow likewise passes above or below the Moon, or in eclipse season crosses it and turns it copper red.

The phases and their names are in the `PHASES` list at the top of `kuufaasid/app.js`, and the tasks in the `TASKS` list. The sizes and distances are not to scale.

## Hüppa planeedil

- Pick who jumps (a cat, dog, bear, rabbit or astronaut). The game starts on the Earth.
- Tap anywhere, or press the space bar, to jump. The jumper always leaves the ground equally fast, so only the world's pull (gravity) changes the jump:
  - on the Earth 34 cm in half a second
  - on the Moon 2.1 m (six times higher) in more than three seconds; the view follows the jumper up
  - on Mars 91 cm
  - on Jupiter 14 cm in a fifth of a second
- A star hangs just within reach on each world. When it is caught, a short fact is shown after landing, with a button to fly to the next world. The round pictures at the bottom go to any world, and a ⭐ marks the worlds whose star is caught.
- A pole beside the jumper fills up during the jump, and the highest jump on each world is marked on it with a small picture of that world.
- Landing raises a puff of dust, which flies far on the Moon and hardly at all on Jupiter. If nothing happens for a few seconds, a 👆 shows where to tap.
- The win screen shows the four jumps side by side at the same scale.

The worlds and their pull are in the `WORLDS` list at the top of `hupe/app.js`. Jupiter has no ground, so the game stands on its cloud tops, as the fact says.

## Püüa langev täht

- One night, from 22:00 to 04:00, lasts a minute. The top bar shows a clock and how much of the night is left. In the last ten seconds the sky gets light, most of all low in the north-east, where the Sun is below the horizon.
- The sky is the real one above Tõrva (58° N) on the night of the Perseids, 12 August, looking north-east. As the night goes on it turns round the North Star (Põhjanael): Cassiopeia climbs over the top, Perseus rises higher, and Capella, the Pleiades (Sõel) and Aldebaran come up from behind the trees. Stars low down are dimmer.
- Shooting stars flash across the sky, sometimes three in quick succession. They come more often as Perseus rises, from about one every two seconds in the evening to one every 1.2 seconds at dawn, as there are more after midnight in reality. Tap one, or its tail, to catch it: it turns into a ⭐ that flies into the jar at the bottom. A star still counts if it is tapped just after it fades. Each catch plays the next note of a tune.
- Once a night a slow, bright green fireball (boliid) crosses the sky. It counts as two stars.
- All shooting stars fly away from one spot between Perseus and Cassiopeia, which moves with the sky, as the Perseids do in August.
- A plane (red and green lights blinking in turn) and a satellite (a slow, steady dot) cross the sky too. Tapping them never costs anything: the first tap explains what they are, later taps only name them.
- If nothing is caught for five seconds, a 👆 follows the next shooting star. A caption points out the Pleiades when they are up, and four short facts are shown during the night.
- The most stars caught in one night is kept as the record. It is shown in the menu with a jar of that many stars, and the win screen says when it is beaten.
- Within three days of the best night of the Perseids (12 August) or the Geminids (14 December), the menu says that there is a real meteor shower tonight.

The length of the night, the place, the direction of the view and the other timings are at the top of `meteoor/app.js`, with the positions of the named stars. The sky is drawn with a stereographic projection, which keeps the shapes of the figures.

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
