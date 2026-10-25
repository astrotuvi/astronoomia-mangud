# Astronoomia mängud / Astronomy games

Simple astronomy games for children aged 5–6, Kuu faasid and Kosmoseviktoriin for ages 8–10, and Avasta eksoplaneet for ages 11–12, in Estonian (default) or English.
They work with mouse and touch screens (tablets), in landscape and portrait.

| Game | Folder | What to do |
|---|---|---|
| Tähepusle / Star Puzzle | [`pusle/`](pusle/) | Put together a jigsaw puzzle of an astronomy photo |
| Tähtkujud / Constellations | [`tahtkujud/`](tahtkujud/) | Join the stars of a constellation in order 1, 2, 3 … |
| Mälumäng / Memory | [`malumang/`](malumang/) | Turn cards over and find the pairs of astronomy photos |
| Kosmoserakett / Space Rocket | [`rakett/`](rakett/) | Build a rocket and fly it to the Moon, Mars, Jupiter or Saturn |
| Hüppa planeedil / Planet Jump | [`hupe/`](hupe/) | Jump on the Earth, the Moon, Mars and Jupiter and catch a star on each |
| Planeetide rivi / Line Up the Planets | [`planeedid/`](planeedid/) | Drag the planets into order from the Sun outwards |
| Kuu faasid / Moon Phases | [`kuufaasid/`](kuufaasid/) | Move the Moon round the Earth and see why its shape changes |
| Püüa langev täht / Catch a Shooting Star | [`meteoor/`](meteoor/) | Tap shooting stars to catch them in a jar during one night |
| Avasta eksoplaneet / Discover an Exoplanet | [`eksoplaneet/`](eksoplaneet/) | Find the dips in a star's light and work out the planet's year, size and whether it could have water |
| Kosmoseviktoriin / Space Quiz | [`viktoriin/`](viktoriin/) | Answer questions about what the other games teach, alone or two players on one phone |

The language and sound settings are shared by all games.

## Running

No build step and no server needed. Open `index.html` in a browser, or serve the folder with any static web server, e.g.

```sh
python3 -m http.server
```

## Layout

- `index.html`: the start page with links to the games
- `shared/`: the theme, menu, top bar and win screen (`common.css`), settings, language, sounds and star confetti (`common.js`), and the drawn pictures of the planets, among them Mars and the Earth seen from space (`planets.js`)
- one folder per game, each with its own `index.html`, `app.js` and `style.css`

To add a game, make a new folder that loads `../shared/common.css` and `../shared/common.js`, and add a card for it to `index.html`. Follow [DESIGN.md](DESIGN.md), so that it looks and works like the other games, also on phones in dark mode.

## Tähepusle

- Pick a picture and the number of pieces (4, 9, 16, 25, 36 or 49).
- Drag pieces onto the board. A piece snaps into place when it is close to its spot.
- 👁️ turns the faint hint picture on the board on or off. 🔊 turns sounds on or off.

To add a picture, put a **square** image (about 1200×1200 px) in `pusle/images/` and add an entry to the `IMAGES` list at the top of `pusle/app.js`.

## Tähtkujud

- Pick one of 23 constellations, listed from the fewest stars (5) to the most (14), and last Lõunarist (Southern Cross), which cannot be seen from Estonia:
  - all year: Suur Vanker (Big Dipper), Väike Vanker (Little Dipper), Kassiopeia, Kefeus (Cepheus), Lohe (Draco)
  - winter: Orion, Suur Peni (Canis Major), Kaksikud (Gemini), Sõnn (Taurus), Perseus, Veomees (Auriga)
  - spring: Lõvi (Leo), Karjane (Boötes), Neitsi (Virgo)
  - summer: Luik (Cygnus), Lüüra (Lyra), Kotkas (Aquila), Põhjakroon (Corona Borealis), Herkules (Hercules), Skorpion (Scorpius)
  - autumn: Pegasus, Andromeeda (Andromeda)
  - not seen from Estonia: Lõunarist (Southern Cross)
- Tap the numbered stars in order, or slide a finger from star to star. Each star plays the next note of a tune, and a golden line joins it to the figure.
- A star tapped out of turn only wiggles. If nothing happens for a few seconds, the next star starts to pulse.
- 👁️ shows the whole figure as faint dashed lines. Finished constellations get a 🌟 in the menu.
- The win screen tells a short fact. The stars it mentions are ringed and labelled in the picture, e.g. "1 Deeneb". The Orion Nebula, the Andromeda Galaxy and the M13 star cluster are drawn where they are in the sky.

Star positions are J2000 coordinates, drawn as on a sky chart with north up and east to the left. Only Skorpion's menu card is turned to stand upright, so that it does not reach under the 🌟 in the corner. To add a constellation, add an entry to the `CONSTELLATIONS` list at the top of `tahtkujud/app.js`. The comment there explains how the stars are joined.

## Mälumäng

- Pick the number of pairs (3, 4, 6, 8, 10, 12, 15 or 18). Each game uses a different random set of the puzzle's photos.
- Turn two cards over. A matching pair stays open and shows the object's name. Two different cards turn back after a moment, or at once when the next card is tapped.
- 👁️ shows all cards for a moment. The win screen shows all the pairs found and the number of tries, unless 👁️ was used: then the tries don't count.
- The fewest tries for each number of pairs is kept as the best score, shown in the menu under the number of pairs ("🏆 Parim: 5 katset") and on the win screen. **🗑️ Kustuta parim tulemus** under it clears the best score for that number of pairs after a second tap.

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

## Planeetide rivi

- Pick 4 planets (Mercury to Mars, the rocky ones), 6 (to Saturn, the ones seen without a telescope) or 8. A 🌟 marks the levels done.
- The Sun is at the left (at the top on a tall screen) with an empty place for each planet on its orbit, numbered 1, 2, 3 … The planets wait mixed up in a tray beside them.
- Drag a planet to its place, or tap it and then tap the place. Picking one up shows its name.
- In the right place it stays, its name appears under it and a short fact is shown. In a wrong place it goes back to the tray, and the message says whether it is farther from the Sun or closer. After two misses with the same planet, its place pulses.
- The places are the size of their planets, so they hint at which planet goes where. 👁️ shows faint pictures of the planets in the empty places.
- The win screen shows the whole row with names.

The planets are drawn pixel by pixel in `shared/planets.js` rather than taken from photos: the Earth and Mars are the ones from Kosmoserakett, and the others are in the `LOOKS` list there, with Saturn's and Uranus's rings. Their sizes in the game, in the `PLANETS` list at the top of `planeedid/app.js`, are not to scale (Jupiter would be 28 times as wide as Mercury), but they are bigger and smaller in the right order.

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

## Püüa langev täht

- Pick a level. Level 1 is an ordinary night of the Perseids. Level 2 has twice as many shooting stars and two fireballs, and level 3 three times as many and three fireballs, with a meteor storm (tähesadu) from 00:00 to 02:00 that brings three times more again.
- One night, from 22:00 to 04:00, lasts a minute. The top bar shows a clock and how much of the night is left. In the last ten seconds the sky gets light, most of all low in the north-east, where the Sun is below the horizon.
- The sky is the real one above Tõrva (58° N) on the night of the Perseids, 12 August, looking north-east. As the night goes on it turns round the North Star (Põhjanael): Cassiopeia climbs over the top, Perseus rises higher, and Capella, the Pleiades (Sõel) and Aldebaran come up from behind the trees. Stars low down are fainter.
- Shooting stars flash across the sky, sometimes three in quick succession. They come more often as Perseus rises, on level 1 from about one every two seconds in the evening to one every 1.2 seconds at dawn, as there are more after midnight in reality. Tap one, or its tail, to catch it: it turns into a ⭐ that flies into the jar at the bottom. A star still counts if it is tapped just after it fades. Each catch plays the next note of a tune.
- Once a night (on level 1) a slow, bright green fireball (boliid) crosses the sky. It counts as two stars.
- All shooting stars fly away from one spot between Perseus and Cassiopeia, which moves with the sky, as the Perseids do in August.
- A plane (red and green lights blinking in turn) crosses the sky to the left or right, and satellites (slow, steady dots), one every few seconds, cross it in any direction. Tapping them never costs anything: the first tap explains what they are, later taps only name them.
- If nothing is caught for five seconds, a 👆 follows the next shooting star. A caption points out the Pleiades when they are up, and four short facts are shown during the night.
- The most stars caught in one night is kept as the record for each level. It is shown in the menu with a jar of that many stars, and the win screen says when it is beaten. **🗑️ Kustuta rekord** under it clears the record after a second tap.
- Within three days of the best night of the Perseids (12 August) or the Geminids (14 December), the menu says that there is a real meteor shower tonight.

The levels, the meteor storm, the length of the night, the place, the direction of the view and the other timings are at the top of `meteoor/app.js`, with the positions of the named stars. The sky is drawn with a stereographic projection, which keeps the shapes of the figures.

## Avasta eksoplaneet

- Pick one of four kinds of star, each harder than the one before. The first time each is a real star; after that it is a new made-up star of the same kind every time (named EKSO- and a number), with planets of other sizes and years:
  1. Selge varjutus: deep, clear dips from a big planet (first HD 209458 with a hot Jupiter)
  2. Väike varjutus: small dips in the noise from an Earth-sized planet or a super-Earth (first Kepler-22 b in the habitable zone)
  3. Kaks planeeti: an orange or red dwarf with two planets whose dips differ in depth, the inner one going round three or four times for each turn of the outer one (first LHS 1140)
  4. Rahutu täht: a red dwarf with spots that make its light wobble, and flares (first Kepler-1649)
- The telescope records the star's brightness for about 18 seconds. On the first two kinds of star the recording holds three to five dips, a different number each time, and on the others three of the outer planet. Tap each dip; a tap on noise, a starspot's wobble or a flare says what it is instead. At least three dips of each planet are needed.
- − and + under the graph zoom in on the days, up to 16 times, and the strip between them shows the part of the recording on the graph: drag it or tap it to move. On the graph, a drag moves along the days (except in Kui tihti? and Kui suur?, where it moves the ruler), two fingers pinch to zoom, and the mouse wheel zooms at the pointer. 💡 moves the graph to the dip it points at.
- One made-up star in five (but never on Kaks planeeti) has no planet passing in front of it, as is so for most real stars. Once the recording is done, 🚫 Siin pole planeeti says so: on such a star the star counts as checked and goes into the catalogue, and on a star with a planet it asks to look again.
- Then, for each planet:
  - **Kui tihti?** The days of the dips show above them, and a pink ruler with a line at each end measures the days between them: a drag moves the nearer line, which snaps onto a dip when close. Pick how many days apart two dips in a row are, which is the planet's year
  - **Kui suur?** Drag the pink line to the bottom of a dip. A scale under the question shows where its depth falls among Maa-suurune, super-Maa, Neptuuni-suurune and Jupiteri-suurune, and the player picks that size without reading any percentages. The scale changes with the star, so the same planet makes a deeper dip in front of a small star
  - **Kas seal võiks olla vett?** The planet's year shows as a line on the bar of the star's zones, named after the water there: aur (steam), vedel vesi (liquid water) or jää (ice)
- 💡 points at a dip not found yet, shows faintly on the scale where the dip's depth is, or explains the question again.
- The win screen shows the star from above, with the hot zone, the habitable zone as a green ring and the cold zone round it, and the planets going round on their orbits: the inner one faster. The orbits are on a log scale of the year, so that a planet close to the star and a zone far out both fit, and the scheme says it is not to scale. Below it is each planet found with a picture of what it could look like and a fact, with 🔭 Uus täht for another star of the same kind and ▶ Järgmine tase. Every planet found goes into **Sinu avastused** in the menu, and a 🌟 marks the kinds whose real star is found. 🗑️ Kustuta kõik avastused under the list clears them, after asking, so each level starts again with its real star.

The real stars and planets are in the `LEVELS` list at the top of `eksoplaneet/app.js`, and `makeLevel` makes up the new ones. The real planets' sizes and periods and the stars' sizes are real, but the light curves are made up from them, with made-up noise, spots and flares, and the dips are drawn wider than they are (a few hours), so that they show. The habitable zones of the real stars are rough, and those of the made-up ones are worked out from the star's size and temperature. A made-up planet's year and size are always well inside one answer, so that the answers are clear. The pictures are the planets of `shared/planets.js` in other colours, and the facts of the made-up planets depend on their size and zone.

## Kosmoseviktoriin

- Pick who plays, alone or two players, and the topic: all games together, one of the games, or Pildid (the photos of Tähepusle and Mälumäng). A round has 10 questions. With all topics, they come from each game in turn, and questions not asked lately come first.
- Each question is first shown alone, for 5–14 seconds depending on its length. Then the answers appear and 30 seconds start to run down. Alone, **Olen valmis ▶** skips the reading time.
- The answers are four coloured buttons with shapes (▲ ◆ ● ■), with text or pictures:
  - photos from the puzzle, and pictures of the Earth, the Moon, Mars, Jupiter and Saturn
  - the Moon as seen from the Earth, and the Sun, the Earth and the Moon from above the North Pole, as in Kuu faasid
  - the stars of a constellation without lines
  - short animations of a plane, a satellite and a shooting star, as in Püüa langev täht
  - true or false
  - putting 4 pictures in order, by tapping them into numbered places (alone only)
- A right answer gets 1000 points at once, down to 500 at the last moment. From the third right answer in a row on, each gets 🔥 200 more.
- After each answer the right one is marked and one sentence explains it.
- **Alone:** the end screen shows the number of right answers and the points, and links to the games of the questions answered wrong. The most points for each topic are kept as the record, with **🗑️ Kustuta rekord** to clear it after a second tap.
- **Two players:** each picks a different animal. The phone lies sideways on the table and each player answers on their own half. An answer cannot be changed, and the other player only sees ✔ until both have answered or the time is up. If the phone is held upright, the game asks to turn it sideways and the clock waits. The end screen shows both scores side by side and the winner.

The questions are in `viktoriin/questions.js`, by topic, with the right answer first. The comment at the top explains the kinds of questions and pictures.

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
| `tsuchinshan.jpg` | Comet C/2023 A3 (Tsuchinshan–ATLAS) | <https://www.astrobin.com/9k85ql/> |
| `ponsbrooks.jpg` | Comet 12P/Pons–Brooks | <https://www.astrobin.com/0tbdac/> |
| `orion.jpg` | Orion Nebula (M42) | <https://www.astrobin.com/uu55w0/> |
| `horsehead.jpg` | Horsehead and Flame Nebulae | <https://www.astrobin.com/4yxzcw/> |
| `rosette.jpg` | Rosette Nebula | <https://www.astrobin.com/61be3g/> |
| `bubble.jpg` | Bubble Nebula (NGC 7635) | <https://www.astrobin.com/s8kr1m/> |
| `california.jpg` | California Nebula (NGC 1499) | <https://www.astrobin.com/q8ho3d/> |
| `crescent.jpg` | Crescent Nebula (NGC 6888) | <https://www.astrobin.com/h4lzn6/> |
| `cygnusloop.jpg` | Cygnus Loop | <https://www.astrobin.com/wgllu0/> |
| `dumbbell.jpg` | Dumbbell Nebula (M27) | <https://www.astrobin.com/7uonbx/> |
| `elephant.jpg` | Elephant’s Trunk Nebula (IC 1396) | <https://www.astrobin.com/t3aagk/> |
| `iris.jpg` | Iris Nebula (NGC 7023) | <https://www.astrobin.com/oay737/> |
| `northamerica.jpg` | North America Nebula (NGC 7000) | <https://www.astrobin.com/wl3iuw/> |
| `spider.jpg` | Spider and Fly Nebulae (IC 417, NGC 1931) | <https://www.astrobin.com/ur6xpe/> |
| `questionmark.jpg` | Question Mark Nebula (NGC 7822) | <https://www.astrobin.com/jnx2hb/> |
| `heart.jpg` | Heart Nebula (IC 1805) | <https://www.astrobin.com/daq9v5/> |
| `crab.jpg` | Crab Nebula (M1) | <https://www.astrobin.com/9msc3y/> |
| `andromeda.jpg` | Andromeda Galaxy (M31) | <https://www.astrobin.com/4ocaul/> |
| `whirlpool.jpg` | Whirlpool Galaxy (M51) | <https://www.astrobin.com/ymu58n/> |
| `pinwheel.jpg` | Pinwheel Galaxy (M101) | <https://www.astrobin.com/aqmyzp/> |
| `triangulum.jpg` | Triangulum Galaxy (M33) | <https://www.astrobin.com/yvvd54/> |
| `bode.jpg` | Bode’s and Cigar Galaxies (M81, M82) | <https://www.astrobin.com/xcthwy/> |
| `triplet.jpg` | Leo Triplet (M65, M66, NGC 3628) | <https://www.astrobin.com/3frqwu/> |
