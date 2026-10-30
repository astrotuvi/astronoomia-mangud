# Taevakaart (the star map)

A game idea for ages 8–10, idea 26 in [IDEAS.md](IDEAS.md). For how a new
game should look and work, see [DESIGN.md](DESIGN.md). It goes well with
Tähest täheni, which shows the sky as it is seen looking one way and
teaches the hops from star to star; this game teaches the tool to take
outside, the turning star map (pööratav tähekaart, a planisphere), and
how to find out with it what is in the sky on any night.

A turning star map is a round map of the whole sky, with Põhjanael in the
middle, under a cover with a window. The window shows only the part of the
sky that is above the horizon. Turning the map until the date is at the
hour shows the sky of that night. The player learns three things:

1. to set the map to a date and an hour, and that the sky makes one turn a
   day, and a little more each night
2. to hold the map against the sky: overhead, with the side one looks
   towards at the bottom. On a sky map east is to the left of north, as we
   look up at the sky, not down at the ground as on a map of the land
3. to answer questions with it: what is up tonight, when Orion rises, and
   whether Arktuurus can be seen in January

## The map

Drawn on a `<canvas>`, so that dark mode on phones leaves it alone.

- **The disc:** the stars from Põhjanael in the middle out to −40°, in the
  stereographic projection round the pole. The star data of Tähest täheni
  already stops at −40°, so the edge of the disc is where the stars end.
  The figures are drawn as faint lines, with their names.
- **The ring of dates** round the edge of the disc, with the months and a
  tick for each day, and the **ring of hours** on the cover, fixed. The
  hours are on winter time, as in Tähest täheni, with summer time in
  brackets in the caption.
- **The window** for Tõrva (58° N). In the stereographic projection the
  horizon is a true circle, not the squashed oval of cardboard maps, so it
  is easy to draw. It runs from 32° south of the equator in the south to
  32° north of it beyond Põhjanael, so that the stars north of 32° never
  leave the window: they never set in Estonia. Outside the window the
  disc is dimmed, but its stars can still be seen and tapped, as they are
  only silmapiiri taga (below the horizon).
- **The directions** P, I, L and O on the edge of the window, and the
  zenith marked with a small cross.
- **The caption** under the map, as in Tähest täheni, e.g. "Talveõhtu, 15.
  jaanuar kell 20".
- **The light:** when the Sun is up, the window is the blue of the day
  sky; in twilight it is a lighter night, using the twilight of Tähest
  täheni. On a light June night only the bright stars show in it.

As the hours go on, the disc turns counterclockwise, as the real sky does
round Põhjanael when one faces north.

The whole disc on a 360 px wide phone is small: the stars at the end of
Suure Vanker's bowl, Suure Vankri tagumised rattad, are only about 5 px
apart there, as the projection draws the north smaller than the south. So
the map zooms, and the names show only when there is room for them: the
names of the figures first, and those of the bright stars when zoomed in
further.

## The sky

A second view, **Taevas**, shows the same moment as Tähest täheni does:
the sky above Tõrva, with the trees and the horizon, looking one way. It
is opened by tapping a direction on the edge of the window, or by
**Vaata taevast** (look at the sky) in the top bar, and it looks the way
the map is held, see Kuhu vaatad? below. ⬅️ in the sky view goes back to
the map. The view is made to link the map to the real sky: what is in
the lower half of the window is what one sees when looking that way.

## Moves

- **Keera (turn):** drag the disc round its middle, and it turns with the
  finger, while the caption counts the dates and the hours. The date and
  hour sliders under the map do the same, for those who find them easier.
  A drag on the cover pans the map when it is zoomed in.
- **Praegu (now):** a button that sets the map to the device's date and
  time, so that the game is of use outdoors, e.g. at a club evening.
- **Puuduta (tap):** tap a star or a figure. As in Tähest täheni, a tap
  picks the brightest star near the finger, not the nearest one. The star
  gets its name and a short fact, and its figure lights up. Stars without
  a name used in Estonia are named by their figure, e.g. "See täht on Lohe
  tähtkujus", never by their Arabic names. A tap between the stars of a
  figure picks the figure.
- **Suumi (zoom):** pinch, or + and − in the top bar, from the whole disc
  to about six times bigger.
- **Kuhu vaatad? (which way are you looking?):** four buttons, P, I, L and
  O, turn the whole map so that that side of the window is at the bottom,
  as when the map is held overhead facing that way. North at the bottom
  is how a map for the northern sky is held; south at the bottom, for the
  winter sky of Orion.
- **Vali (choose):** two big buttons under the task, e.g. Jah and Ei, as in
  Tähest täheni. The right one turns golden; the wrong one wiggles, and the
  player tries again.

A move done right gets `snap()` and a fact; a wrong star or figure only
wiggles and says its name. 💡 shows the answer: the date and hour to turn
to as a pulsing mark on the rings, or the figure to tap ringed. If nothing
happens for a few seconds, a 👆 shows where to start.

## Levels

Five short levels to learn the map, and then the free map. The texts say
"teeb tiire" for how the sky turns round Põhjanael, and "silmapiiri taga"
for what is below the horizon.

1. **Sea kaart (set the map):**
   - "Keera kaarti nii, et 15. jaanuari kohal oleks kell 20." ("Turn the
     map so that 15 January is at 20:00.") The disc snaps to it when near.
     Orion is high in the south.
   - "Nüüd keera kell 23 peale." ("Now turn it to 23:00.") Orion moves west.
   - "Vajuta „Praegu“, ja kaart näitab tänast taevast." ("Press Now, and the
     map shows tonight's sky.")
   - Fact: "Taevas teeb ööpäevas ühe tiiru ümber Põhjanaela. Iga õhtu on
     tähed samal kellaajal veidi edasi jõudnud, kuu ajaga koguni kahe
     tunni jagu." ("The sky makes one turn round the North Star a day.
     Every evening the stars have gone a little further at the same hour,
     by two hours in a month.")
2. **Mis on üleval? (what is up?):** on a September evening.
   - "Puuduta kolme tähtkuju, mis praegu taevas paistavad." ("Tap three
     constellations that can be seen in the sky now.") Any three in the
     window count, each lighting up when found.
   - "Puuduta tähtkuju, mis on praegu silmapiiri taga." ("Tap a
     constellation that is below the horizon now.") Orion, the Kaksikud or
     Lõvi.
   - Fact: "Aknast välja jäävad tähed on silmapiiri taga. Mõne tunni või
     mõne kuu pärast tõusevad nad jälle." ("The stars outside the window
     are below the horizon. In a few hours or a few months they rise
     again.")
3. **Millal? (when?):**
   - "Millal tõuseb Orion 1. novembril? Keera kella, kuni Orioni vöö
     jõuab akna idaservale." ("When does Orion rise on 1 November? Turn
     the clock until Orion's belt reaches the eastern edge of the
     window.") It rises at about 21:20.
   - "Ja 1. detsembril?" ("And on 1 December?") At about 19:20.
   - Fact: "Orion tõuseb iga kuuga kaks tundi varem. Novembri alguses
     tõuseb ta kella üheksa paiku õhtul, detsembri alguses juba kella
     seitsme paiku." ("Orion rises two hours earlier every month. At the
     start of November he rises at about nine in the evening, at the start
     of December already at about seven.")
   - "Kassiopeia on vahel peaaegu otse pea kohal. Mis kuus on ta kell 20
     kõige kõrgemal?" ("Cassiopeia is sometimes almost straight
     overhead. In which month is she highest at 20:00?") The hour stays
     at 20:00 and the player turns the dates; the answer is December, on
     9 December 87° up, and any day of December counts.
4. **Kas näeb? (can it be seen?):** each task has Jah and Ei, and the map
   to find the answer on.
   - "Kas Arktuurust näeb 15. jaanuaril kell 20?" ("Can Arcturus be seen on
     15 January at 20:00?") Ei: he is 11° below the horizon and rises at
     about 22:40.
   - "Kas Põhjanaela näeb igal selgel ööl?" ("Can the North Star be seen on
     every clear night?") Jah: "Põhjanael ei lahku kunagi aknast. Ta on
     alati 58 kraadi kõrgusel, sama kõrgel, kui Eesti on ekvaatorist
     põhjas." ("The North Star never leaves the window. It is always 58
     degrees up, as high as Estonia is north of the equator.")
   - "Kas Lõunaristi näeb Eestist?" ("Can the Southern Cross be seen from
     Estonia?") Ei: "Lõunarist on nii kaugel lõunas, et teda pole sellel
     kaardil üldse. Teda näeb alles ekvaatori lähedalt ja lõuna poolt."
     ("The Southern Cross is so far south that it is not on this map at
     all. It can be seen only from near the equator and further south.")
5. **Hoia taeva poole (hold it to the sky):**
   - The map has north up. "Kummal pool on taevakaardil ida?" ("Which side
     is east on a sky map?") Two buttons, Vasakul and Paremal; the answer
     is Vasakul. Fact: "Taevakaardil on ida vasakul, mitte paremal nagu
     maakaardil. Maakaarti vaatame ülevalt alla, taevast aga altpoolt
     üles." ("On a sky map east is on the left, not on the right as on a
     map of the land. We look down at a map of the land, but up at the
     sky.")
   - "Sa vaatad lõunasse. Pööra kaart nii, et lõuna oleks all." ("You are
     looking south. Turn the map so that south is at the bottom.") With
     Kuhu vaatad?.
   - "Vaata taevasse ja puuduta seal tähtkuju, mis on kaardil akna
     alumises servas." ("Look at the sky and tap the constellation there
     that is at the bottom edge of the window on the map.") The sky view
     opens looking south, and the figure is low over the trees.
6. **Vaba kaart (the free map):** everything open, with no tasks: the
   rings and the sliders, Praegu, the zoom, Kuhu vaatad?, the sky view,
   and the layers (below). It opens on tonight.

Levels 1 to 5 are on a dark night, to magnitude 4.5, as in a small town,
as in Tähest täheni, so that the figures stand out. A 🌟 in the menu marks
the levels done. The win screen of each shows the map as it was set at
the end, with the figures found named.

## The free map

- **Layers:** buttons for the lines of the figures, their names, the names
  of the stars, and Linnutee (the Milky Way), each on or off.
- **Punane valgus (red light):** a button that turns the whole page dark
  red, so that the eyes stay used to the dark outdoors. White light
  blinds the eyes for many minutes, red light much less, which is why
  astronomers use red torches. It is a filter over the page in CSS.
- **Tähtkuju otsing (find a figure):** a list of the figures; picking one
  rings it on the disc and says when tonight it is highest, or that it is
  below the horizon all night.

The free map is also the "Vaata taevast" extra planned for the win screen
of level 10 of Tähest täheni: that button can open Taevakaart on the same
night.

## What it needs

- **A shared sky file:** what both games need goes from
  `taheretked/app.js` into `shared/sky.js`, and `taheretked/stars.js` into
  `shared/stars.js`:
  - the sidereal time (`siderealTime`) and the height and direction of a
    star (`horizon`)
  - the projection, the trees (`TREES`) and the horizon (`drawHorizon`)
  - the twilight
  - the tap that picks the brightest star near the finger
  - the figures (`FIGURES`) and the Estonian names of the stars

  This is a commit of its own before the new game, checked by playing all
  levels of Tähest täheni.
- **The figures:** those of Tähest täheni, and the others of Tähtkujud
  that can be seen from Estonia, so that the map has all 22 of them. They
  share the lines' order and the names in the list of Tähtkujud. The tail
  of Skorpion reaches past −40°, beyond the edge of the disc; it never
  rises in Estonia, so the figure is drawn to the edge and cut there.
- **The map:** the polar stereographic projection, `r = tan((90° − δ) / 2)`,
  with the right ascension round the disc and the disc turned by the
  sidereal time. The window is the circle through the points of the
  horizon, worked out from three of them.
- **Linnutee:** an outline of the band, as a few dozen points (RA, Dec),
  drawn as a soft glow.
- **Texts and data:** the levels, the tasks and the facts in lists at the
  top of `app.js`, under `et` and `en`.
- **Records:** the levels done, with `Astro.makeStore('taevakaart.')`.
- **Sounds:** a soft tick for each day or hour the disc turns past, as on
  a real dial, `pick()` when a drag starts, `snap()` when the map is set
  right or a figure is found, `oops()` on a wrong one, and `win()` at the
  end of a level.

## Effort

About 1,000–1,500 lines once the sky code is shared, most of them for the
disc, the rings and the window, turning the disc with the finger, and the
zoom. The sky view and the stars come from Tähest täheni. A first version
could be levels 1 and 6, in a folder `taevakaart/` not yet linked from the
main page.

## Later

- **The planets and the Moon**, which a printed map cannot show but the
  sky has. They need the planets' places for the date, from their orbits,
  which could reuse the Kepler orbits of Kosmoserakett.
- **Pointing the phone at the sky**, with its compass, to turn the map the
  way one looks. It needs a permission and works badly on some phones.
- **Print your own map:** a page to print and cut out, with the disc and
  the cover, to make a cardboard map at a club evening.
