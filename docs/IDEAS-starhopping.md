# Tähest täheni (Star hopping)

A game idea for ages 8–10, idea 14 in [IDEAS.md](IDEAS.md). For how a new
game should look and work, see [DESIGN.md](DESIGN.md). It goes well with
Tähtkujud, which teaches the figures one at a time; this game teaches how
to find them in the sky, from the ones that are easy to find.

Few children know where to look for Põhjanael, though most know Suur
Vanker. Astronomers find their way across the sky by hops: a line through
two known stars, carried on, leads to the next one. The player learns two
sets of hops, from Suur Vanker in the northern sky and from Orion in the
winter sky, and sees that they work in every season and at every hour,
however the sky has turned.

## The screen

The sky as seen from Tõrva (58° N), as in Püüa langev täht, drawn on a
`<canvas>` with the same stereographic projection, which keeps the shapes
of the figures. Trees and the horizon are along the bottom, with the
directions marked on it (P, KO, L …). The stars are at their real
positions (J2000) and brightness, worked out for the date and the hour of
the task.

- **Suur Vanker** looks north, with Põhjanael 58° up. Põhjanael is always
  in the view, at the same place.
- **Orion** looks south, at a winter evening sky.

The view shows about 70° of sky across its shorter side, so that the stars
are far enough apart to tap on a phone (Merak and Dubhe are only 5°
apart). A whole round sky, as on a planisphere, would put them about 10 px
apart. Each task shows the stars it is about, and the view pans to them.
The first tasks, Põhjanael and Väike Vanker, show less sky, about 40° and
35°, so that the other figures do not get in the way, and the Arktuurus
task shows only as much as Suur Vanker and Karjane need. The view looks at
the middle of the outline of the stars a task is about.

The task is at the top, with a short text, e.g. "Leia Põhjanael" ("Find the
North Star"), and on the first levels the names of the stars to start from.
The caption under it says the date and the hour, e.g. "Sügisõhtu, 15.
oktoober kell 20 (suveaja järgi kell 21)" ("An autumn evening, 15 October
at 20:00 (21:00 summer time)"). The clock is on winter time all the year
round, so that the hours do not jump in spring and autumn; when summer time
is on, the hour of summer time follows in brackets. In the free play with
the sliders, the minutes are always shown, also on the full hour, as "kell
18.00".

## Moves

- **Hüpe (a hop):** press near the first star, drag through the second and
  let go. The drag is loose: it is enough to start near the first star and
  pass near the second, and the line snaps onto them. The line then goes
  on as a dashed arrow to the edge of the sky, not stopping at the star to
  find, so that it does not give the answer away. A drag from other stars
  also makes an arrow; it is no mistake, it just leads somewhere else, and
  it fades out after a few seconds. On
  levels 1, 7 and 8 the arrow has a tick at every gap between the two stars,
  so that "five times as far" can be counted.
- **Osa teest (part of the way):** drag from one star to another, and the
  line is drawn between them, without a mark on it; the text says how far
  along it to look, e.g. a third of the way from Arktuurus to Veega for
  Põhjakroon (not on level 1). 💡 circles the whole figure to find.
- **Kaar (an arc):** drag along the last two stars of the handle of Suur
  Vanker, and the curve goes on as a dashed arc. A circle through the
  three handle stars alone bends far too much and misses Arktuurus, so the
  arc is the circle on the sky through Miitsar, Alkaid and Arktuurus: it
  starts at Miitsar, goes through the end of the handle and bends evenly
  on to Arktuurus. The arc stops about 5° past Arktuurus, not going on to
  Spiika. On level 1 a short curved arrow under Miitsar and Alkaid shows
  which way to slide. Alioth, the handle star next to the bowl, is left
  out: the arc does not pass through it.
- **Joonista (draw a figure):** as in Tähtkujud: the stars of the figure
  are numbered 1, 2, 3 …, and the player taps them in turn or slides a
  finger from star to star, also star 1, even when it was found already,
  such as Põhjanael for Väike Vanker. Each star joined turns golden and
  plays the next note of a tune, and a golden line grows to it. The next
  star pulses at the start and after a few seconds without progress, a
  star of the figure tapped out of turn wiggles, and 💡 shows the whole
  figure as faint dashed lines.
- **Puuduta (tap):** tap the star to find. A tap picks the brightest star
  near the finger, not the nearest one, so that a child aiming at Thuban
  in a sky full of faint stars gets Thuban. The right star lights up, gets
  its name and a short fact, and its figure is drawn in. A wrong star only
  wiggles, and on levels 1, 2 and 5 to 9 says its name if it has one used
  in Estonia, e.g. "See on Veega", or else its figure, e.g. "See täht on Lohe
  tähtkujus". The Arabic names of the stars, such as Merak and Dubhe, are
  not used in Estonia, so the game does not show them: the tasks name the
  stars by where they are, e.g. Suure Vankri tagumised rattad.
  On level 5 one task has three stars to tap, in any order, each lighting
  up as it is found.
- **Vali (choose):** two big buttons under the task, e.g. W and M, on
  level 6. The right one turns golden; the wrong one wiggles, and the
  player tries again.

Each star found becomes a start for the next task, so the tasks of a level
are one chain across the sky. 💡 shows the arrow to follow, or on levels 1
and 8, where the guide stars already pulse, the star to tap. If nothing
happens for a few seconds, a 👆 shows where to start.

## Seasons and hours

The sky turns round Põhjanael once a day, and a little further each night,
so that at the same hour it is turned by a quarter of a circle three months
later. Suur Vanker never sets in Estonia, so it is always in the north, but
in a different place round Põhjanael:

| Evening | Suur Vanker | Arktuurus |
|---|---|---|
| spring, 15 April 22:00 | almost overhead, upside down, with the bowl open downwards | 40° up in the east-south-east |
| summer, 15 August 22:00 | in the north-west, sinking, with the handle up | 23° up in the west |
| autumn, 15 October 20:00 | low in the north-north-west, right side up | 8° up in the west-north-west, setting |
| winter, 15 January 20:00 | in the north-east, standing on its handle | 11° below the horizon |

The hours are clock times, on winter time. They are late in summer, as
Estonian summer nights are light.

When a level goes from one season to the next, the sky does not jump: it
turns round Põhjanael, slowly enough to follow the stars, about six and a
half seconds for a quarter of a circle, while the caption counts the months. So the child sees one sky turning, not four different pictures,
and that the hops stay the same: Merak → Dubhe points to Põhjanael also
when it points down or sideways on the screen.

Arktuurus and Põhjakroon do not stay up all year. On a winter evening the
arc from the handle runs below the horizon, and instead of hiding this the
game shows the arc going on behind the horizon: "Arktuurus on praegu
allpool silmapiiri. Õhtuti on ta taevas kevadest sügiseni." ("Arcturus is
below the horizon now. It is in the evening sky from spring to autumn.")
The texts say "allpool silmapiiri", "silmapiiri taga" or "allpool
horisonti", never "maa all", as a star does not go into the ground. Each
season's tasks ask only for stars that are up then. Väike Vanker, Lohe and
Veega never set in Estonia.

The sky also turns about 15° an hour, so six hours later on the same night
it is turned as much as three months later at the same hour. On level 2 one
task keeps the date and moves the clock: from 20:00 on 15 January to 02:00,
when Suur Vanker stands as it does at 22:00 in the middle of March.

Orion is in the evening sky only in winter, so his levels change the hour,
not the season. On 15 December he rises in the east at about 18:20, lying
on his side, stands upright in the south at about 00:15, only 31° up, and
sets in the west at about 06:05, tilted the other way. The sky is dark all
that time, from 18:00 to 06:25, so his whole path can be watched in one
night; on 15 January he rises before the sky is dark. The belt points to
Siirius at every hour, but until about 21:20 Siirius has not risen yet:
"Siirius tõuseb natuke hiljem. Oota!" ("Siirius rises a little later.
Wait!"), and the clock moves on until he does.

## How bright the sky is

How many stars can be seen depends on how bright the sky is. The lights
of a city or a village make it brighter, and so do the Moon, the more the
fuller it is, and the twilight, which in Estonia lasts all night in June
and July. So the slider is not about places but goes smoothly from **hele
taevas** (a bright sky) at one end to **pime taevas** (a dark sky) at the
other, without stops. Some points along it:

| Sky | Faintest star | What is seen |
|---|---|---|
| hele: a city, the full Moon, a light summer night | about 3 | Suur Vanker, with Megrez (3.3) barely there. Of Väike Vanker only Põhjanael, Kochab and Pherkad, so it does not look like a dipper. Of Lohe a few stars, without Thuban (3.7). Of Põhjakroon only Alphecca (2.2). Of Orion the belt and the four corners |
| a small town, a half Moon | about 4.5 | all the figures, with few other stars round them |
| pime: the countryside on a dark night without the Moon | about 6 | hundreds of stars, among which the figures are hard to see; the sword of Orion with the Orion Nebula |

A darker sky makes the figures harder to find, not easier, which children
do not expect. The level sets how dark the sky is, rather than a free
slider, so that the stars a task needs are always there:

- Levels 1 to 3, 5, 6, 8 and 9 are a sky to magnitude 4.5, as in a small town.
  The stars of the figures always show, also the fainter ones, such as η UMi (5.0)
  in Väike Vanker, and they are drawn a little bigger.
- The twilight of the date and the hour is added to it, as on level 2: on
  a light May or July night only the brighter stars show.
- Level 4 is about the slider: "Kui
  paistab täiskuu või oled linnas, on taevas hele, ja Väikesest Vankrist
  paistab ainult kolm tähte. Vii liugur pimeda taeva poole, et näha teda
  tervenisti." ("When the full Moon is out, or you are in a city, the sky
  is bright, and only three stars of the Little Dipper show. Move the
  slider towards the dark sky to see all of it.") The Orion levels have
  no slider; his sword with the Orion Nebula (4.0) shows in the sky of
  level 8.
- Level 7 is a sky to magnitude 5.5, as Andromeeda galaktika needs a
  darker sky than a small town.
- Level 4 is a dark sky, to magnitude 6.
- Level 10 is a sky to magnitude 5, between the two: the figures are
  among more stars than on the other levels, but still stand out.

The slider sets the light of the Moon and of the lights round, and the
twilight is added on top of it. So on a July night at 23:00, even at the dark
end, only the brighter stars show, and the slider can make the sky only
brighter, not darker than the night really is. The game draws no Moon: the
slider stands for it.

When the slider moves, the stars fade in and out smoothly, with no steps.
Stars near the horizon are dimmer, as in Püüa langev täht. Faint stars are
drawn dimmer rather than smaller, with a smallest dot that still shows on a
phone.

## Levels

The game has ten levels, in one list under one heading in the menu, "Vali
teema" ("Pick a topic"), not split by constellation. The first four start
from Suur Vanker and teach how the sky turns through the year. The next
five go on from summer to winter: Suvekolmnurk, Kassiopeia and Andromeeda
galaktika, which start from stars learnt on the first levels, Veega, Suur
Vanker and Põhjanael, and then the two of Orion, the winter sky. The last,
Ilma abita, asks about the stars of all the levels before it. A 🌟 in the
menu marks the ones done.

1. **Suur Vanker näitab teed (the Big Dipper shows the way):** one sky
   that does not turn, the guide stars pulse, and the hops have ticks.
   The texts say which way to go, e.g. left or down.
2. **Taevas pöörleb (the sky turns):** only how the sky turns round
   Põhjanael, through the seasons and the hours. The texts name only the
   stars, not left or right, as those change when the sky turns.
3. **Arktuurus ja Veega (Arcturus and Vega):** Arktuurus rises and
   sets, while Veega does not, through a year of evenings and one winter
   night. The task still names the stars to start from, but they do not
   pulse.
4. **Hele ja pime taevas (bright and dark skies):** the slider of how
   bright the sky is, a figure in a dark sky full of stars, a light summer
   night, and the slider to play with at the end.
5. **Suvekolmnurk (the Summer Triangle):** a light midsummer night, when
   the three stars of the triangle are almost the only ones in the sky;
   then the sky turns on to a dark September evening, where they are found
   again among many stars, and a slider goes between the two nights.
6. **Kassiopeia (Cassiopeia):** the evening sky from autumn to spring,
   always two hours after sunset, with a date slider, which the player
   moves until Kassiopeia is where the task says: she and
   Suur Vanker are on opposite sides of Põhjanael, and she is an M when
   high and a W when low.
7. **Andromeeda galaktika (the Andromeda Galaxy):** an autumn evening that
   does not turn, from Põhjanael and Kassiopeia through the square of
   Pegasus and Andromeeda to the galaxy.
8. **Orion näitab teed (Orion shows the way):** as level 1, on a winter
   evening that does not turn, from Orion to the bright stars round him.
9. **Orion tõuseb ja loojub (Orion rises and sets):** the date and hour
   sliders from the start: the player sets them to three times, from
   autumn to spring, and finds Orion at each, further west every time.
10. **Ilma abita (without help):** a sky to magnitude 5, with the tasks of
   all the levels before it, from Suur Vanker through the summer and autumn
   sky to Orion, each on a night picked at random. The task names only
   the star to find. The player picks the stars to hop from, or taps the
   star straight away if they know it.

Level 10 picks a new dark night at random for each task, so that the
player sees the stars in all kinds of places: an hour from 18:00 to 05:00
on winter time (not midnight), with the Sun at least 15° below the
horizon, so never in June or July, and with the star to find at least 10°
up (Siirius 5°). Each night is later than the one before, by up to 200
days. The caption names it, e.g. "Kevadöö, 17. märts kell 1". The next
task's night is shown at once, without the sky turning on to it.

The tasks of Suur Vanker come first, in the north: Põhjanael,
Kassiopeia, Arktuurus and Põhjakroon (Veega is left out, as among all the
stars of a dark sky it is too hard to find alone, and so is Väike Vanker).
Põhjanael and Kassiopeia never set, so their nights can be any dark night,
with Suur Vanker low in the north on an autumn evening, on its side in the
east or the west, or high overhead. Kassiopeia is found by the hop from
the handle of Suur Vanker through Põhjanael, as on level 6, and any of her
stars counts. Arktuurus and Põhjakroon get nights from about February to
October, when they are up. Arktuurus below the horizon is only on level 3.

Then come the summer and autumn sky: Suvekolmnurk, by tapping its three
stars, which are still the brightest round them, with all three at least
10° up, and Andromeeda galaktika, at least 20° up, which the player finds
by the hops of level 7, on nights from about August to February. Unlike
level 7, its photo does not show.

Then the view turns along the horizon to the south, for the tasks of
Orion: Aldebaran, Sõel, the Kaksikud, Kapella and Siirius, on nights with
the belt of Orion at least 15° up. So they are mostly from November to
March, and sometimes an autumn morning, with Orion in the south before
dawn.

The task asks only, e.g., "Leia Arktuurus.", no figure is drawn at the
start, and the names of the stars to start from do not show. The view
is close round the stars of the task, but not in the middle of it: slid by
up to a fifth of the view each way, at random, as far as the stars stay on
the screen, so that it does not show where to look. The facts
are new, e.g. that Põhjanael is always about 58° up in Estonia, as high as
Estonia is north of the equator, that Sõel formed when dinosaurs lived,
that the Milky Way runs through Suvekolmnurk, that Andromeeda galaktika
will run into the Milky Way in about five billion years, or that Siirius
has a white dwarf beside it.

The win screen shows the whole chain as a map: the sky turned to the hour
when the most of the stars found are up at once, wide enough for all of
those, with the lines of all the hops, the figures and the names of the
stars found. Altair and Siirius are never up at once, so one of the
figures is always left out.

## The hops

The distances and how far off the line each star is were checked against
the star positions. The drag is loose enough for all of them.

### Suur Vanker

The game starts with the chain of level 1, on an autumn evening, 15
October at 20:00 (21:00 summer time). Suur Vanker is low in the north-north-west, right side up
with the handle to the left, as children see it at this time of year
before going to bed. All six stars to find are up: Väike Vanker and Lohe
above it, and Veega (57° up), Põhjakroon (24°) and Arktuurus (8°) to the
west, where the view pans to. The trees there are drawn low, so that
Arktuurus shows above them.

1. **Põhjanael**, in two steps, so that drawing the line and finding the
   star on it are learnt one at a time:
   - "Tõmba joon läbi Suure Vankri kahe tagumise ratta ja jätka seda."
     ("Draw a line through the two stars at the end of the Big Dipper's
     bowl and carry it on.") When the line has grown, the next step starts
     by itself. A tap on another star first says "Tõmba kõigepealt joon."
     ("Draw the line first.")
   - "Põhjanael on sellel joonel, viis korda nii kaugel, kui on kahe ratta
     vahe. Puuduta Põhjanaela." ("The North Star is on this line, five
     times as far as the gap between the two stars. Tap the North Star.")
     The line stays bright, with its ticks.

   The line goes from Merak through Dubhe, and Põhjanael is five times the
   gap between them beyond Dubhe (5.4° and 29°), 2° off the line.
   - Fact: "Põhjanael on peaaegu täpselt taevapooluse kohal. Kogu taevas
     pöörleb tema ümber, aga tema ise püsib paigal, alati põhjas."
     ("The North Star is almost exactly at the sky's pole. The whole sky
     turns round it, but it stays in place, always in the north.")
2. **Väike Vanker:** "Põhjanael on Väikese Vankri aisa ots. Joonista Väike
   Vanker." ("The North Star is the end of the Little Dipper's handle.
   Draw the Little Dipper.")
   - Fact: "Väikese Vankri tähed on Suure Vankri tähtedest nõrgemad.
     Linnas paistavad temast ainult Põhjanael ja vankri kaks tagumist
     ratast." ("The stars of the Little Dipper are fainter than those of
     the Big Dipper. In a city only the North Star and the two stars at the
     end of the bowl can be seen.")
3. **Lohe:** "Lohe saba ots on Suure Vankri ja Põhjanaela vahel. Joonista
   Lohe sabast peani." ("The tip of the Dragon's tail is between the Big
   Dipper and the North Star. Draw the Dragon from its tail to its head.")
   The tip, Giausar, is on the line of the first hop, one and a half gaps
   beyond Dubhe. The figure goes through Thuban, the pole star of 4,700
   years ago.
   - Fact: "Lohe looklev keha ümbritseb Väikest Vankrit. Tema pea on neli
     tähte, ja selle kõrval paistab hele Veega." ("The Dragon's winding body
     wraps round the Little Dipper. Its head is four stars, and next to it
     shines bright Vega.")
4. **Veega:** "Leia Veega, hele täht Lohe pea kõrval." ("Find Vega, the
   bright star next to the Dragon's head.") A pulsing blue arrow points
   from the head towards Veega, without reaching it.
   - Fact: "Veega on Lüüra tähtkuju kõige heledam täht, meist 25
     valgusaasta kaugusel. Eestis ta ei looju kunagi." ("Vega is the
     brightest star of Lyra, 25 light years away. In Estonia it never
     sets.")
5. **Arktuurus:** "Leia Arktuurus. Libista sõrme mööda Suure Vankri aisa ja
   jätka sama kaarega edasi." ("Find Arcturus. Slide your finger along the
   Big Dipper's handle and carry on along the same curve.") It is about
   31° beyond Alkaid, low above the trees in the west-north-west.
   - Fact: "Arktuurus on põhjataeva kõige heledam täht, oranž
     hiidtäht Karjase tähtkujus. Sügisõhtul on ta madalal ja loojub varsti,
     aga kevadel tõuseb ta õhtuti kõrgele." ("Arcturus is the brightest
     star in the northern half of the sky, an orange giant in Boötes. On an
     autumn evening it is low and soon sets, but in spring it climbs high in
     the evening.")
6. **Põhjakroon:** "Leia Põhjakroon. See on poolring tähti Karjasest
   vasakul." ("Find the Northern Crown. It is a half circle of stars to the
   left of Boötes.") The view stays close to Karjane, and a pulsing blue
   arrow points from Karjane's left side towards the Crown, without
   reaching it. On an autumn evening,
   low in the west, the Crown is to its left and a little higher; any of
   its stars counts. (In other seasons Karjane stands differently, and the
   hop from Arktuurus towards Veega, a third of the way, may serve better:
   Alphecca is at 0.33 of the way, 3° off the line.)
   - Fact: "Põhjakroon on poolring tähti nagu kuninga kroon. Tema kõige
     heledam täht on nagu kroonis särav pärl." ("The Northern Crown is a
     half circle of stars, like a king's crown. Its brightest star is like a
     shining pearl in it.")

Level 2 is only about how the sky turns. While the sky turns, the view is
wide and centred on Põhjanael, so that the sky turns round it; while the
player looks for Põhjanael, it zooms in to Suur Vanker and Põhjanael:

1. autumn, 6 October at 21:00: find Põhjanael from the two wheels. Then
   Väike Vanker draws itself in from Põhjanael.
2. the view zooms out a little, and the sky turns about a quarter of a
   circle (90°) to 5 January at 21:00. Väike Vanker is
   taken away while the sky turns, the name of Põhjanael is hidden, and
   the player finds Põhjanael again; then Väike Vanker draws itself again,
   as one smooth line without sounds.
3. about another quarter (99°), to 15 April at 21:00, and Põhjanael again
4. July, at 23:00 on 15 July, and Põhjanael again. At 21:00 the July
   sky would be light, so this turn is bigger, about 120°, and the sky is
   still in twilight, with only the brighter stars.
5. two sliders, for the date over the year and the time from 18:00 to
   06:00 by the minute, to turn the sky at one's own pace. On light summer
   nights the sky is lighter and only the brighter stars show, and when
   the Sun is up there are no stars: only the lines of Suur Vanker and
   Põhjanael stay, to show where they are, and the Sun is drawn where it
   is, behind the trees when it is low. The view looks at the pole itself,
   not at Põhjanael, which is 0.7° from it, so that the ground does not
   rock as the sky turns.

The first three skies are at the same hour, 21:00, so that the sky turns
only with the months; the July one is later, as the evenings are light.
The sky always turns forwards, and at each
time it is as light as it really is then.
Veega, Arktuurus and Põhjakroon are left to level 3, and the slider of how
bright the sky is to level 4.

Level 3 is about the stars that rise and set. Arktuurus is far from
Põhjanael, so it goes up and down: over the year it moves across the
evening sky from the east through the south to the west, and in winter it
is below the horizon. Veega is near enough to Põhjanael that in Estonia it
never sets (it stays at least 7° up), so it only goes low in the north in
winter and comes back almost overhead at the end of summer, as Suur Vanker
does. The level follows Arktuurus from rising to setting, and then a winter
night, when it comes back up by the morning. The positions are for Tõrva:

| | Caption | Sun | Arktuurus | Veega |
|---|---|---|---|---|
| 1 | Kevadõhtu, 15. märts kell 21 | −21° | E, 16°, just risen | NNE, 9° |
| 2 | Kevadöö, 15. mai kell 22.30 | −10° | S, 51°, as high as it gets | E, 41° |
| 3 | Sügisõhtu, 15. september kell 20 | −11° | W, 23°, going down | SSW, 69° |
| 4 | Talveõhtu, 5. jaanuar kell 21 | −40° | −11°, below the horizon | NNW, 13° |
| 5 | Talvehommik, 6. jaanuar kell 6 | −22° | SE, 48°, back up | ENE, 33° |

The spruces are at most 5.4° high, so Veega at 9° and Arktuurus at 16° show
above them (in mid-February Arktuurus is only 3° up, behind the trees). The
15 May sky is in twilight, with only the brighter stars. Suur Vanker is
drawn in at the start, and Lohe is given wherever Veega is asked for:

1. 15 March at 21:00:
   - **Arktuurus**, along the arc of the handle: "Leia Arktuurus Suure
     Vankri aisa kaare abil." ("Find Arcturus along the curve of the Big
     Dipper's handle.")
     - Fact: "Kevadõhtul on Arktuurus just idast tõusnud. Iga nädalaga on
       ta samal kellaajal natuke kõrgemal." ("On a spring evening Arcturus
       has just risen in the east. Every week it is a little higher at the
       same hour.")
   - **Veega:** "Leia Veega Lohe pea kõrval." ("Find Vega next to the
     Dragon's head.")
     - Fact: "Veega on praegu madalal põhjas, aga ta ei looju kunagi: nagu
       Suur Vanker, teeb ta tiire ümber Põhjanaela." ("Vega is low in the
       north now, but it never sets: like the Big Dipper, it goes round the
       North Star.")
2. 15 May at 22:30:
   - **Arktuurus**, along the arc again.
     - Fact: "Arktuurus on lõunas, nii kõrgel, kui ta Eestis üldse tõuseb:
       umbes 51 kraadi. Ta on oranž, sest ta on Päikesest jahedam."
       ("Arcturus is in the south, as high as it ever gets in Estonia:
       about 51 degrees. It is orange because it is cooler than the Sun.")
   - **Põhjakroon**, part of the way: "Põhjakroon on Arktuurusest Veega
     poole, umbes kolmandiku tee peal. Leia Põhjakroon." ("The Northern
     Crown is from Arcturus towards Vega, about a third of the way. Find the
     Northern Crown.") The first use of the part move. Alphecca is at 0.33
     of the way, 3° off the line, and any star of the Crown counts.
     - Fact: "Põhjakroon on poolring seitsmest tähest. Ta on Arktuuruse ja
       Veega vahel, nii et kui need kaks on taevas, leiad ka tema." ("The
       Northern Crown is a half circle of seven stars. It is between
       Arcturus and Vega, so when those two are in the sky, you can find it
       too.")
     - 💡 draws the line and circles the whole Crown, and when the Crown
       is found, a circle closes in round all of it.
3. 15 September at 20:00:
   - **Arktuurus**, along the arc.
     - Fact: "Sügisõhtul on Arktuurus läänes ja loojub iga nädalaga
       varem." ("On an autumn evening Arcturus is in the west and sets
       earlier every week.")
   - **Veega:** "Leia Veega." Lohe is given.
     - Fact: "Veega on peaaegu pea kohal. Hilissuvel ja sügise alguses on
       ta õhtuti kõige kõrgemal." ("Vega is almost overhead. In late summer
       and early autumn it is highest in the evening.")
4. 5 January at 21:00:
   - **Allpool silmapiiri**, only a text to read, with the button to go on,
     and no line to draw: "Kus on Arktuurus? Talveõhtul on ta allpool
     silmapiiri ega paista. Õhtuti on ta taevas kevadest sügiseni."
     ("Where is Arcturus? On a winter evening it is below the horizon and
     cannot be seen. It is in the evening sky from spring to autumn.")
     The horizon is drawn as a line, and the dashed curve along the handle
     grows on through it, over the ground, to a dashed circle with the name
     Arktuurus, 11° below the horizon. The view takes in that spot too.
   - **Veega:** "Leia Veega."
     - Fact: "Talveõhtul on Veega madalal põhjas, aga silmapiiri taha ta ei
       lähe." ("On a winter evening Vega is low in the north, but it does not
       go below the horizon.")
     - With the fact, a dashed line grows from the horizon straight up to
       Veega, with "13°" beside it, to show how high it is.
5. The clock moves on to 06:00 on the next morning, 6 January, and the sky
   turns by 135°.
   - **Arktuurus:** "Leia Arktuurus."
     - Fact: "Talvel on Arktuurus hommikutaevas. Üheksa tunniga pöördus
       taevas sama palju kui neli ja pool kuud õhtuti: jaanuari hommikul
       kell 6 on taevas nagu mai keskel kell 21." ("In winter Arcturus is in
       the morning sky. In nine hours the sky turned as much as it does in
       four and a half months of evenings: at 6 on a January morning the sky
       is as at 21:00 in the middle of May.")
The view cannot stay facing north as on level 2, because Arktuurus goes all
round the sky. The view always looks at a height of 30° and turns only
sideways, so that the ground stays level and the directions on the horizon
(ida, lõuna, lääs) slide past. Each date and hour has one view, which takes
in the stars of all its tasks, so that Arktuurus and Veega are marked in
the same picture, and the view does not swing from one to the other.
While the sky turns, the view turns at the same time the way the stars go,
from the east through the south to the west, even when the other way would
be shorter, and it ends on the view of the new date and hour, which then
stays put: it does not zoom or slide again when a task starts or is
done. (The room kept for the card at the top is the same for all the tasks
of a date and hour, the most any of their texts needs.) The
picture slides only up or down, never sideways, as a picture slid sideways
would tilt the horizon. The ground always stays in the view, to show how high the
stars are. While the sky turns, the names of the stars found and their
figures go, as they are to be found again in the new sky. The texts name
the stars, not left or right, but the facts name the directions, as that
is what the level is about. Põhjanael always has its name, as Suur Vanker
is always drawn, so that the north is always marked.

Level 4 is about how bright the sky is. It starts on the autumn evening of
level 1, 15 October at 20:00, with Suur Vanker upright, low in the north,
below Põhjanael and Väike Vanker, close up on the two of them:

1. **The slider**, starting at the bright end, with Põhjanael named. At
   the bright end only Põhjanael and the two stars at the end of Väike
   Vanker's bowl show. As the slider moves towards the dark sky, its other
   stars show. No figure lines are drawn until the slider has stayed near
   the dark end for a moment: then the task is done, and Suur Vanker and
   Väike Vanker are drawn in.
   - Fact: "Pimedas taevas paistab Väike Vanker tervenisti. Linnatuled ja
     Kuu valgustavad taevast, ja siis nõrgemaid tähti ei paista." ("In a
     dark sky the whole Little Dipper shows. City lights and the Moon light
     up the sky, and then the fainter stars do not show.")
2. **Lohe** in the dark sky: "Pimedas taevas on tähti nii palju, et
   tuttavaid kujusid on nende vahel raskem näha. Joonista Lohe sabast
   peani." ("In a dark sky there are so many stars that the figures you
   know are harder to see among them. Draw the Dragon from its tail to its
   head.")
   - Fact: "Lohe tähed on nõrgad: linnas teda peaaegu ei näe, aga pimedas
     taevas paistab ta tervenisti." ("The Dragon's stars are faint: in a
     city it can hardly be seen, but in a dark sky all of it shows.")
3. The sky goes straight to 23:00 on 15 July, without turning
   through the months, when the Sun is only about 9° below the horizon.
   The twilight comes on smoothly, in about 1.5 s, and only then **the
   slider** shows, starting at the bright end again:
   "Juulis kell 23. Vii liugur jälle pimeda taeva poole." ("At 23:00 in
   July. Move the slider towards the dark sky again.") Even at the dark end
   the twilight keeps the sky light, and the faintest stars do not show.
   - Fact: "Suveööl ei lähe taevas Eestis päris pimedaks, sest Päike on
     ainult natuke allpool silmapiiri. Ka maal, kus tulesid pole,
     paistavad siis ainult heledamad tähed." ("On a summer night the sky in
     Estonia never gets quite dark, as the Sun is only a little below the
     horizon. Even in the countryside, with no lights, only the brighter
     stars show then.")
   The view is wide, round Põhjanael, without zooming in.
4. The sky turns on to 15 October at 20:00 again, and **the slider is to
   play with**, starting at the dark end, with Valmis beside it: "Liiguta
   liugurit ise ja vaata, kuidas tähed heledas taevas kaovad ja pimedas
   taevas tagasi tulevad." ("Move the slider yourself and watch the stars
   fade in a bright sky and come back in a dark one.")

The first slider task shows Suur Vanker and Väike Vanker close up, sliding the
picture as on level 2. Even at the bright end, Põhjanael and the brightest
stars stay, so that the sky is never empty. The names of stars and figures
that do not show are left out. In the two slider tasks with a task to do,
the figures are drawn only once it is done; the slider to play with at the
end starts at the dark sky, with the figures drawn.

As on level 3, the view does not move when the text changes: the card at
the top keeps the room of the biggest text of the tasks in that sky, and
once a slider task is done, the slider goes out of sight but keeps its
room. The view moves only, smoothly, to the next task's view.

### Suvekolmnurk

**Level 5, Suvekolmnurk.** The level shows that on a light summer night
the three stars of the triangle are almost the only stars in the sky. It
starts on midsummer night, when Estonian children are up late: "Jaaniöö,
23. juuni kell 23 (suveaja järgi kesköö)". When the hour of summer time
is midnight, the caption says "kesköö" rather than "kell 24". The Sun is
7° below the horizon, so with the twilight on top of the small-town sky
only stars to about magnitude 2.35 show. In the southern half of the sky
that is Veega (63° up, east-south-east), Deeneb (52°, east), Altair (29°,
east-south-east), six faint stars of magnitude 2.1–2.3 scattered among
them, Arktuurus far off in the west-south-west, and Antares and Spiika, 6–10°
up, dimmed by the low sky. The view looks east-south-east, at the
triangle, and Arktuurus is not in it. On 15 September at 21:00 the same
part of the sky has about 227 stars.

1. **The three stars** (tap, three targets): "Suveööl on taevas hele ja
   tähti paistab vähe. Puuduta kolme kõige heledamat tähte." ("On a summer
   night the sky is light and few stars show. Tap the three brightest
   stars.") Each one lights up and gets its name; a fainter star wiggles.
   When all three are found, the triangle is drawn in, dashed.
   - Fact: "Need kolm tähte on Suvekolmnurk. Valgel suveööl on nad
     peaaegu ainsad tähed, mis paistavad." ("These three stars are the
     Summer Triangle. On a light summer night they are almost the only
     stars that show.")
2. The sky turns on to "Sügisõhtu, 15. september kell 21 (suveaja järgi
   kell 22)", about 53°, and the triangle moves from the east-south-east
   to the south. The sky darkens slowly as it turns, so that the player
   sees the stars come out round the triangle. As on level 3, the names
   and the triangle go while the sky turns, to be found again. The Sun is
   18° below the horizon, so the sky is fully dark. Veega is 64° up in the
   south-west, Deeneb 77° in the south-south-east, almost overhead, and
   Altair 40° in the south. This sky does not turn again, so the texts
   can say left and right. The view looks higher than on level 3, at
   about 50°, so that Deeneb fits in.
3. **Veega:** "Leia Veega, kõige heledam täht kõrgel edelas." ("Find Vega,
   the brightest star high in the south-west.") Lüüra is drawn in.
   - Fact: "Veega on Suvekolmnurga kõige heledam täht." ("Vega is the
     brightest star of the Summer Triangle.")
4. **Deeneb:** "Leia Deeneb. Ta on Veegast vasakul, veel kõrgemal,
   peaaegu pea kohal." ("Find Deneb. It is to the left of Vega, even
   higher, almost overhead.") A pulsing blue arrow points from Veega
   towards Deeneb, without reaching it. Then the next step: "Deeneb on
   Luige saba. Joonista Luik." ("Deneb is the Swan's tail. Draw the
   Swan.") The figure of Tähtkujud, from the tail to the head.
   - Fact: "Deeneb on Veegast umbes sada korda kaugemal, aga paistab ikka
     heledana. Ta on hiidtäht, umbes sada tuhat korda heledam kui Päike."
     ("Deneb is about a hundred times further away than Vega, but still
     looks bright. It is a giant star, about a hundred thousand times
     brighter than the Sun.")
5. **Altair:** "Leia Altair. Tõmba joon Veegast läbi Lüüra kõige kaugema
   tähe ja jätka seda." ("Find Altair. Draw a line from Vega through the
   furthest star of the Lyre and carry it on.") The furthest star is
   Sulafat, 7.6° from Veega. Altair is three and a half gaps beyond it,
   2.3° off the line. The hops along Luik miss Altair by 10–15°. Kotkas
   draws itself in.
   - Fact: "Altair on kolme tähe rea keskel. Ta pöörleb nii kiiresti, et
     on lapik nagu muna." ("Altair is in the middle of a row of three
     stars. It spins so fast that it is flattened like an egg.")
6. **Suvekolmnurk:** "Joonista Suvekolmnurk: Veegast Deenebini, Altairini
   ja tagasi." ("Draw the Summer Triangle: from Vega to Deneb, to Altair
   and back.") A trace, with Veega tapped again at the end, as star 4.
   The line of the hop to Altair goes, so that it is not in the way.
   - Fact: "Valgel suveööl oli kolmnurka kerge näha, sest muid tähti
     peaaegu ei paistnud. Pimedas taevas on tähti palju, aga Suvekolmnurga
     tähed on ikka kõige heledamad." ("On the light summer night the
     triangle was easy to see, as hardly any other stars showed. In a dark
     sky there are many stars, but the stars of the Summer Triangle are
     still the brightest.")
7. **The slider between the two nights:** one slider, with "juuni" at one
   end and "september" at the other. It moves the date from 23 June to 15
   September and the hour from 23:00 to 21:00 together, smoothly, so that
   the sky turns and the twilight follows the real Sun. The caption
   follows it, with the minutes, e.g. "Suveöö, 4. august kell 22.00
   (suveaja järgi kell 23.00)", and at the June end it is the jaaniöö
   caption again. The slider starts at the September end, with the
   triangle and the three figures drawn: "Vii liugur juuni poole ja vaata,
   kuidas tähed kaovad ja Suvekolmnurk jääb." ("Move the slider towards
   June and watch the stars go while the Summer Triangle stays.") The
   view does not move with the stars: it takes in the triangle on both
   nights, looking a little closer to the south than their middle, and
   can be dragged sideways. The triangle's lines stay all along; the figures of Lüüra, Luik and Kotkas
   fade with their stars, so that near the June end only the triangle is
   left. The task is done when the slider has stayed near the June end
   for a moment, as on level 4, and then the slider is to play with,
   with Valmis beside it.
   - Fact: "Eestis on suveööd valged kuni juuli lõpuni. Augustis läheb
     taevas õhtuti jälle pimedaks." ("In Estonia the summer nights are
     light until the end of July. In August the sky gets dark in the
     evening again.")

   Along the slider the faintest star stays about 2.3 until the middle of
   July, then goes steadily to 4.5 at the September end, so the light
   nights lasting into July show without being said.

The win map is the September sky with the triangle, Lüüra, Luik and Kotkas,
without the line of the Altair hop.

### Kassiopeia

**Level 6, Kassiopeia.** The evening sky from autumn to spring, always two
hours after sunset, when the sky has just got dark. Over those months
Kassiopeia makes half a turn round Põhjanael, from the north-east up to
almost overhead and down to low in the north, while Suur Vanker goes from
low in the north to high up.

The view looks north, at the pole, as in the free play of level 2, wide
enough for Kassiopeia overhead and Suur Vanker low: about 100°. Suur
Vanker is drawn at the start, and Põhjanael named. From the second task
there is a date slider, with September, Jaanuar and Mai along it, from 1 September to 31 May; the hour follows it,
two hours after that day's sunset, from about 17:30 in December to 22:30
in the middle of May. In June two hours after sunset is after 23:00, with
the Sun only 8° below the horizon, so the slider stops at May. The caption
follows it, with the minutes, e.g. "Talveõhtu, 15. jaanuar kell 18.02",
and the hour of summer time in brackets when it is on. The player does not
set a date given in the text, as on level 9, but moves the calendar until
the sky looks as the task says, so that they watch the sky while they move
it.

Two hours after sunset the Sun is 14–17° below the horizon from September
to April, so the sky is about as dark all along; only in May is it
lighter, 12° on 1 May and 10° on 15 May.

| Date | Hour | Kassiopeia | Suur Vanker |
|---|---|---|---|
| 15 September | 20:37 | 53° up, north-east, tilted | 36°, north-west |
| 15 November | 17:59 | 63°, north-east | 30° |
| 15 January | 18:01 | 84°, almost overhead, an M, level | 25°, low in the north; the end of the handle 17° |
| about 8 March | about 20:00 | about 48° | about 48° |
| 1–15 May | 22:04–22:34 | 28–29°, low in the north, a W, as low as she goes, tilted 22° on 1 May and 11° on 15 May | 76–82°, almost overhead |

Facing north in May, the first, third and fifth stars of the W are higher
than the second and the fourth, so it is a W; in January it is the other
way round. The end of Suur Vanker's handle is at least 17° up all along,
above the trees.

From September to December Kassiopeia hardly moves, from 53° to 67°, as
the evenings get earlier about as fast as the sky turns; from January to
May she moves fast. That is how it is in the sky, but not the rule of
level 2, where the same hour three months later is a quarter of a turn
on, so a fact says why.

1. **15 September, 20:37 (21:37 summer time):**
   - **Kassiopeia**, a hop: "Leia Kassiopeia. Tõmba joon Suure Vankri aisa
     keskmisest tähest läbi Põhjanaela ja jätka seda umbes sama kaugele."
     ("Find Cassiopeia. Draw a line from the middle star of the Big
     Dipper's handle through the North Star, and carry it on about as
     far.") From Miitsar, 35.8° to Põhjanael, and on 29.1° to the fourth
     star of the W, 0.1° off the line; any star of Kassiopeia counts.
     Miitsar is bright and easy to name; from Megrez, where the handle
     meets the bowl, the line hits the end of the W, 1.5° off, but Megrez
     is the faintest star of Suur Vanker. In the wide view the guide stars
     that pulse win a tap near them, so that a tap there is not taken for
     a brighter star beside them.
   - **Joonista Kassiopeia**, the figure of Tähtkujud, close up.
     - Fact: "Kassiopeia ja Suur Vanker on Põhjanaelast eri pool.
       Kassiopeia viis heledat tähte on nagu suur W- või M-täht."
       ("Cassiopeia and the Big Dipper are on opposite sides of the North
       Star. Cassiopeia's five bright stars are like a big letter W or
       M.")
2. **"Liiguta kalendrit, kuni Kassiopeia on pea kohal."** ("Move the
   calendar until Cassiopeia is overhead.") The text first says that the
   calendar shows the evenings always two hours after sunset. Done when
   the slider has stayed for a moment where she is at least 82° up, from
   about 31 December to 20 January; there it snaps to 15 January, as she
   is clearly an M only from about 14 January. On the way, from September
   to December, she hardly moves.
   - Fact: "Talvel läheb pimedaks varem, nii et sügisel paistab õhtune
     taevas pikka aega peaaegu samasugune." ("In winter it gets dark
     earlier, so in autumn the evening sky looks almost the same for a
     long time.")
   - **W või M:** "Kas Kassiopeia on praegu W või M?" ("Is Cassiopeia a W
     or an M now?") M, with two buttons in the card. The view zooms in on
     her, still facing north, and the calendar stays, still. A wrong
     answer shakes its button: "Vaata Kassiopeiat veel kord!" ("Look at
     Cassiopeia again!")
     - Fact: "Kui vaatad põhja poole, on pea kohal olev Kassiopeia nagu
       M." ("When you face north, Cassiopeia overhead looks like an M.")
3. **"Liiguta kalendrit, kuni Kassiopeia ja Suur Vanker on
   ühekõrgusel."** ("Move the calendar until Cassiopeia and the Big Dipper
   are equally high.") Done when the slider has stayed for a moment where
   they are within 6° of each other, from about 3 to 12 March; there it
   snaps to 8 March, when they are most alike, as on the slider the days
   are only a pixel or so apart.
   - Fact: "Nüüd on nad Põhjanaelast eri pool ühekõrgusel. Kui üks läheb
     kõrgemale, läheb teine madalamale." ("Now they are equally high, on
     either side of the North Star. When one goes higher, the other goes
     lower.")
4. **"Liiguta kalendrit, kuni Kassiopeia on madalal põhjas."** ("Move the
   calendar until Cassiopeia is low in the north.") Done when the slider
   has stayed for a moment from about 23 April to 19 May, when she is
   within 1° of her lowest; there it snaps to 15 May, as she is clearly a
   W only from about 8 May.
   - Fact: "Kassiopeia on nüüd peaaegu nii madalal, kui ta Eestis üldse
     käib." ("Cassiopeia is now almost as low as she ever goes in
     Estonia.")
   - **W või M:** "Kas Kassiopeia on nüüd W või M?" W, as before.
     - Fact: "Kui Kassiopeia on madalal, on Suur Vanker peaaegu pea
       kohal. Talvel oli vastupidi." ("When Cassiopeia is low, the Big
       Dipper is almost overhead. In winter it was the other way round.")
5. **The slider to play with**, from where it is, with Valmis beside it,
   and in its text: "Liiguta kalendrit ise. Kassiopeia ei looju Eestis
   kunagi: ka kõige madalamal on ta umbes 25 kraadi kõrgusel, puudest
   kõrgemal." ("Move the calendar yourself. Cassiopeia never sets in
   Estonia: even at her lowest she is about 25 degrees up, above the
   trees.") The sky can be dragged sideways here, all the way round the
   horizon, with the tip "Lohista taevast, et vaadata rohkem itta või
   läände."

The win map is the sky of a May evening, with faint grey copies of
Kassiopeia and Suur Vanker where they were on a January evening, so that
the two ends of their half turn are seen together across Põhjanael. The
dates, 15 May and 15 January, are above the two Kassiopeias.

### Andromeeda galaktika

**Level 7, Andromeeda galaktika.** An autumn evening, "Sügisõhtu, 1.
november kell 20", after summer time has ended, when the Sun is 28° below
the horizon. Kassiopeia is 71–77° up in the east-north-east, and the
galaxy 63° in the east-south-east. The sky does not turn. It is a sky to
magnitude 5.5, and the galaxy is drawn as a faint tilted oval, as the
`galaxy` decoration of Tähtkujud, tapped as one target, like Sõel.
Kassiopeia is drawn at the start, from level 6, and Põhjanael named.

The stars of Andromeeda and Pegasus have Arabic names, so the texts name
them by their place: the corner of the square, the middle one of
Andromeeda's three bright stars.

1. **The corner of the square**, a hop with ticks: "Tõmba joon
   Põhjanaelast läbi Kassiopeia W selle otsa, mis on Põhjanaelast
   kaugemal, ja jätka seda sama kaugele." ("Draw a line from the North
   Star through the end of Cassiopeia's W that is further from the North
   Star, and carry it on as far again.") From Põhjanael to Caph is 30.3°,
   the other end of the W 25.6°. The corner, Alpheratz, is exactly one
   gap beyond Caph, 0.3° off the line. The title is "Ruudu nurk!" ("A
   corner of the square!"), not the star's Arabic name.
   - Fact: "See täht on Pegasuse suure ruudu nurk ja ühtlasi Andromeeda
     pea." ("This star is a corner of the great square of Pegasus and
     Andromeda's head too.")
2. **Pegasuse ruut:** "Joonista Pegasuse ruut." ("Draw the square of
   Pegasus.") Four stars and the first again, from the corner just found,
   a figure of its own, like the Talvekuusnurk.
   - Fact: "Pegasuse ruut on sügisõhtuti kõrgel. Ta on nii suur, et tema
     ühe külje kõrvale mahuks ritta peaaegu 30 täiskuud." ("The square of
     Pegasus is high on autumn evenings. It is so big that almost 30 full
     Moons would fit in a row along one of its sides.") A side is about
     14°, and the Moon is half a degree across.
3. **Andromeeda:** "Joonista Andromeeda." The figure of Tähtkujud, from the
   corner along her two chains of stars, which brings in Mirach and the
   star beside it towards Kassiopeia (μ And).
   - Fact, from Tähtkujud: "Vanas loos oli Andromeeda printsess,
     Kassiopeia tütar. Taevas on nad teineteise lähedal." ("In the old
     story, Andromeda was a princess, Cassiopeia's daughter. In the sky
     they are close together.")
4. **Andromeeda galaktika**, a tap: "Leia Andromeeda galaktika. Alusta
   Andromeeda kolmest heledast tähest keskmisest ja loe tähti Kassiopeia
   poole: 1, 2, 3. Kolmanda tähe kõrval on galaktika." ("Find the
   Andromeda Galaxy. Start from the middle one of Andromeda's three bright
   stars and count the stars towards Cassiopeia: 1, 2, 3. The galaxy is
   next to the third star.") Mirach and μ And pulse, with a short arrow
   from Mirach up towards μ And and another from μ And towards the
   galaxy; Mirach, μ And and ν And, all drawn in the figure,
   answer a tap only with a soft sound, and the galaxy is 1.3° beside
   ν And. No line is needed: a hop from Mirach
   through μ And would be only 3.9° long, with the galaxy one gap beyond.
   - Fact: "Andromeeda galaktika on 2,5 miljoni valgusaasta kaugusel. See
     on kõige kaugem asi, mida saab palja silmaga näha. Tema valgus hakkas
     meie poole tulema siis, kui Maal elasid esimesed inimeste esivanemad."
     ("The Andromeda Galaxy is 2.5 million light years away. It is the
     furthest thing that can be seen with the eye alone. Its light set out
     towards us when the first ancestors of humans lived on Earth.")
   - Then the photo, as for Sõel and the Orion Nebula, the square crop of
     Pusle, with the eye line of the Orion Nebula: "Silmaga näed udust
     laiku …".
5. **Kolmnurga galaktika**, only to look at, as the Hobusepea udu: "Vaata,
   kuhu viib joon galaktikast läbi selle heleda tähe, kust lugema
   hakkasid." ("See where a line from the galaxy through the bright star
   you started counting from leads.") From the galaxy through Mirach, the Triangulum
   Galaxy (M33, magnitude 5.7) is 0.9 gaps beyond, 0.8° off. As it is too
   faint for the sky of the level, it is not drawn: a dashed line grows
   from the galaxy through Mirach to a dashed circle with its name, and
   then its photo fades in.
   - Fact: "Kolmnurga galaktika on Andromeeda galaktika väike naaber.
     Silmaga näeb teda ainult väga pimedas kohas, kui Kuud ei paista."
     ("The Triangulum Galaxy is a small neighbour of the Andromeda Galaxy.
     With the eye it can be seen only in a very dark place, when the Moon
     is not out.")

The win map is the chain Põhjanael → Kassiopeia → Pegasuse ruut →
Andromeeda → the galaxy, with the line of the hop from Põhjanael, and
frames on the two galaxies, which show their photos on a tap. The win
text: "Nüüd oskad sügisõhtul leida Põhjanaelast läbi
Kassiopeia Pegasuse ruudu, Andromeeda ja Andromeeda galaktika. Puuduta
kaardil galaktikate raame." ("Now you can find the Square of Pegasus,
Andromeda and the Andromeda Galaxy on an autumn evening, from the North
Star through Cassiopeia. Tap the frames of the galaxies on the map.")

### Orion

Betelgeuse, Bellatrix, Riigel and Aldebaran are named in the texts. The
other stars of Orion are named by their place: the belt, the sword and the
head. The three
stars of the belt are only 2.7° from end to end, about 15 px on a phone,
so a drag along the belt snaps onto the whole belt as one line, rather
than onto two of its stars.

**Level 8, Orion näitab teed.** A winter evening, 15 February at 20:00,
at the same hour as level 1, with Orion upright in the south (the
same sky as on 15 January at 22:00). The dashed lines of a task go when
the next task starts, so that only the one to follow is there:

1. **Orion:** "Joonista Orion: puuduta tähti järjest 1, 2, 3 … või libista
   sõrme tähest täheni." ("Draw Orion: tap the stars in turn 1, 2, 3 … or
   slide your finger from star to star.") No names while it is drawn;
   Betelgeuse, Bellatrix and Riigel get theirs with the fact. The figure
   of Tähtkujud, 13
   stars: from Betelgeuse over the head to Bellatrix, down along the belt
   to the left foot, Riigel from the right-hand end of the belt (the feet
   are not joined), the club and the shield. The tasks after it show
   Orion large, with only as much sky as their stars need, as on a
   computer screen a view of 70° makes him small.
2. **Siirius:** "Leia Siirius. Jätka Orioni vöö kolme tähe joont vasakule
   alla." ("Find Sirius. Carry the line of the three stars of Orion's belt
   on, down to the left.") Siirius is about eight belt lengths beyond the
   belt, 3° off the line, 14° up.
   - Fact: "Siirius on kogu öötaeva kõige heledam täht. Ta on meist ainult
     8,6 valgusaasta kaugusel, üks meie lähimaid naabreid." ("Sirius is the
     brightest star of the whole night sky. It is only 8.6 light years
     away, one of our nearest neighbours.")
   - Then Suur Peni draws itself, the figure of Tähtkujud, as Kaksikud.
     Its lower half is at most 3° up, behind the trees, and the tip of
     its tail (Aludra) is just below the horizon, so that line is left
     out.
3. **Aldebaran:** "Leia Aldebaran. Jätka vöö joont teisele poole, paremale
   üles." ("Find Aldebaran. Carry the line of the belt the other way, up to
   the right.") About as far as Siirius, 5° off the line.
   - Fact: "Aldebaran on Sõnni punakas silm. Ta on oranž hiidtäht, meist 65
     valgusaasta kaugusel." ("Aldebaran is the reddish eye of the Bull. It
     is an orange giant, 65 light years away.")
4. **Sõel:** "Jätka sama joont veel edasi ja leia Sõel." ("Carry the same
   line on further and find the Pleiades.") About half as far again
   beyond Aldebaran, 3° off the line. Sõel is tapped as one target, not as
   one of its stars.
   - Fact: "Sõel on täheparv. Silmaga näeb temast kuut või seitset tähte,
     aga tegelikult on seal umbes tuhat tähte." ("The Pleiades are a star
     cluster. With the eye one sees six or seven of its stars, but there
     are about a thousand.")
   - Then the photo of Sõel, as described below the list.
5. **Prooküon:** "Leia Prooküon. Tõmba joon Bellatrixist läbi
   Betelgeuse ja jätka seda vasakule." ("Find Procyon. Draw a line from
   Bellatrix through Betelgeuse and carry it on to the left.") About three
   and a half gaps beyond Betelgeuse, 5° off the line.
   - Fact: "Betelgeuse, Siirius ja Prooküon on Talvekolmnurk. Neid kolme
     heledat tähte on talveõhtul lõunataevas kerge leida." ("Betelgeuse,
     Sirius and Procyon are the Winter Triangle. These three bright stars
     are easy to find in the southern sky on a winter evening.") The
     triangle is drawn in, dashed, with the fact only, and goes when the
     next task starts.
6. **Kastor ja Polluks:** "Leia Kaksikud. Tõmba joon Riigelist läbi
   Betelgeuse ja jätka seda üles." ("Find the Twins. Draw a line from Rigel
   through Betelgeuse and carry it on upwards.") Almost twice the gap
   beyond Betelgeuse, Kastor 4° off the line and Polluks 8°.
   - Fact: "Kastor ja Polluks on Kaksikute kaks heledat tähte, nagu kaks
     venda. Polluks on oranžikas ja natuke heledam." ("Castor and Pollux
     are the two bright stars of the Twins, like two brothers. Pollux is
     orange and a little brighter.")
   - Then Kaksikud draws itself, the figure of Tähtkujud, at the pace of
     Väike Vanker on level 2.
7. **Kapella:** "Leia Kapella. Tõmba joon Orioni vasakpoolsest jalast
   läbi tema pea ja jätka seda üles." ("Find Capella. Draw a line from
   Orion's left-hand foot through his head and carry it on upwards.")
   About two gaps beyond the head, 2° off the line, 78° up, almost
   overhead. The foot is a corner of the figure just drawn, and the line
   is closer than one along the sword (3° off), whose bottom star is next
   to the nebula, which comes only in the next task.
   - Fact: "Kapella ei looju Eestis kunagi. Suveõhtul on ta madalal
     põhjas." ("Capella never sets in Estonia. On a summer evening she is
     low in the north.") At her lowest she is 14° up.
   - Then Veomees draws itself, the figure of Tähtkujud, as Kaksikud.
8. **Orioni udu:** "Leia Orioni udu. Vöö all ripub mõõk, ja selle keskel
   on udune täht." ("Find the Orion Nebula. Below the belt hangs the sword,
   and in its middle is a fuzzy star.") Tapped as one target, like Sõel.
   At magnitude 4.0 it shows in the sky of levels 8 and 9.
   - Fact: "Orioni udu on hiiglaslik gaasipilv, kus sünnivad uued tähed.
     Ta on meist umbes 1300 valgusaasta kaugusel." ("The Orion Nebula is a
     huge cloud of gas where new stars are born. It is about 1,300 light
     years away.")
   - Then the photo of the Orion Nebula, and the view moves on up the
     sword to the left-hand star of the belt (Alnitak). Here the player
     only looks and does not find anything: "Vaata veel vöö vasakpoolse
     tähe alla." ("Look also below the left-hand star of the belt.") The
     photo of the Hobusepea udu (Horsehead Nebula) fades in, only 0.5°
     below that star, with its fact: "Hobusepea udu on tume tolmupilv.
     Ta varjab enda taga helendavat gaasi, nii et paistab hobusepea
     kuju. Teda ei näe silmaga ega binokliga." ("The Horsehead Nebula
     is a dark cloud of dust. It hides the glowing gas behind it, so
     that the shape of a horse's head shows. It cannot be seen with the
     eye or with binoculars.") "Left-hand" is safe here, as the sky of
     level 8 does not turn.
9. **Talvekuusnurk:** "Joonista Talvekuusnurk: Kapellast Aldebarani,
   Riigeli, Siiriuse, Prooküoni ja Polluksini ning tagasi." ("Draw the
   Winter Hexagon: from Capella to Aldebaran, Rigel, Sirius, Procyon and
   Pollux, and back.") A trace, with the numbers of the next two stars,
   and Kapella tapped again at the end, as star 7, to close it. It is 66°
   from Siirius (14° up) to Kapella (78° up), so the view is as close as
   those stars let it be. While it is drawn, only Orion's lines show and
   no names, so that the numbers can be seen.
   - Fact: "Talvekuusnurk on kuus heledat tähte kuuest tähtkujust.
     Betelgeuse on peaaegu tema keskel." ("The Winter Hexagon is six bright
     stars from six constellations. Betelgeuse is almost in its middle.")
     The win map draws both the Talvekolmnurk and the Talvekuusnurk, one
     inside the other, and the figures, but not the dashed lines of the
     hops.

**Photos.** After the facts of Sõel and of the Orion Nebula, and for the
Hobusepea udu, the view zooms in on the spot, and a photo fades in over
the sky, lined up with it, so that its brightest stars sit on the star
dots. Then it fades back to the dots, after a few seconds or on a tap.
So the photo is tied to a place in the sky the player has just found,
rather than shown on a card of its own. Under each photo is its credit,
and one line on what the eye sees: "Silmaga näed udust täppi. Kaamera
kogub valgust kaua ja näeb värve, mida silm ei näe." ("With the eye you
see a fuzzy dot. The camera collects light for a long time and sees
colours the eye does not see.") For Sõel: "Silmaga näed kuut või seitset
tähte. Kaamera kogub valgust kaua ja näeb palju rohkem tähti ning
sinist udu nende ümber." ("With the eye you see six or seven stars. The
camera collects light for a long time and sees many more stars, and blue
haze round them.")

On the win map, the places of the three photos have a small frame, and a
tap on one shows its photo again.


**Level 9, Orion tõuseb ja loojub.** Orion at the same hour through the
months. The date and hour sliders of the free play are there from the
start, the date from 1 July to 30 June, so that the winter is in the
middle, and the hour from 18:00 to 06:00. The sliders start on 15 October
at 18:00.

Each task names a date and an hour, e.g. "Sea liugurid: 15. oktoober,
kesköö. Siis leia Orion." ("Set the sliders to 15 October, midnight. Then
find Orion."). Once the sliders are within 5 days and 15 minutes of it,
they snap to it, with a sound, and the tip says "Õige aeg! Nüüd leia
Orion." ("That's the time! Now find Orion."). A tap on a star before
that only says to set the sliders first. Then a tap on any star of Orion
finds him, and his figure is drawn in. His figure is not there at the
start of a task, so that he is found again each time.

The view is of the southern sky, from the horizon up to about 64°. On a
screen too narrow for all of it, as on a phone held upright, it is
dragged sideways, from 20° past the east to 20° past the west, where
Orion rises and sets. It starts looking south, so that it does not give
away where he is; a tap without a drag is a tap on a star.

1. **15 October, midnight:** the belt is 13° up in the east; it rose at
   about 22:40.
   - Fact: "Oktoobri keskel on Orion kesköö paiku madalal idas: ta on just
     tõusnud." ("In the middle of October Orion is low in the east about
     midnight: he has just risen.")
2. **1 February, 21:00:** the belt is 31° up, due south, as high as it
   gets.
   - Fact: "Veebruari alguses on Orion kell 21 otse lõunas, nii kõrgel, kui
     ta Eestis üldse tõuseb. Talveõhtud on parim aeg teda vaadata." ("At the
     start of February Orion is due south at 21:00, as high as he ever gets
     in Estonia. Winter evenings are the best time to look at him.")
3. **1 April, 21:00** (22:00 summer time): the belt is 16° up in the
   south-west, in the last twilight, and sets at about 23:00.
   - Fact: "Aprilli alguses on Orion õhtul madalal edelas ja loojub enne
     keskööd. Suvel on ta taevas päeval, koos Päikesega, ja teda ei
     paista." ("At the start of April Orion is low in the south-west in the
     evening and sets before midnight. In summer he is in the sky by day,
     with the Sun, and cannot be seen.")
4. **Free play** with the sliders, from where they are.

Where Orion was found, a faint grey copy of his figure stays, with the
date and hour above it, and the names of his stars go, so that he is
found again by his shape. The win map is the sky from a little past the
south-east to a little past the south-west (125°–235°), looking level, so
that the horizon is straight and low and the arcs bend up from it, with
Orion's figure at his highest, due south, the arc of his belt across the
sky dashed, and below it the lower arc of Siirius, grey, without the
copies or the names of stars.

Level 10, Ilma abita, with the tasks of all the levels, is under Levels
above.

## Extras

Left out of the first version, but easy to add as more hops:

- **Spiika:** the arc from the handle, carried on beyond Arktuurus, reaches
  Spiika, low in the south-east on a spring evening (16° up). The arc
  bends: Spiika is 17° off the straight line from Alkaid through Arktuurus.
- **Kapella:** from Megrez through Dubhe, about five gaps beyond Dubhe
- **Lõvi (Leo):** the back of the bowl, Dubhe → Merak, carried on the
  other way, to Regulus
- **Miitsar ja Alkor:** a test for the eyes, a faint star next to Miitsar
- **Photos in the free play:** on level 9, a tap on Sõel or the Orion
  Nebula shows its photo, as on level 8
- **Orion through one night:** on level 9, the clock running from his
  rising on a December evening to his setting in the morning, with a stop
  at each hour to find a star from him
- **Vaata taevast (look at the sky):** a button on the win screen of level
  10 that opens the same sky without tasks, with the slider and the date
  and hour sliders, to play with
- **Linnutee (the Milky Way):** on level 5, a faint band through the
  Summer Triangle in the dark September sky, with Luik flying along it,
  gone on the light midsummer night

## What it needs

- **Star data:** a catalogue of the stars to magnitude 6, the Yale Bright
  Star Catalogue (about 9,000 stars), without T CrB, a recurrent nova that
  the catalogue lists at its outburst brightness (2.0) beside Põhjakroon. Trimmed to the stars north of −40°
  and to RA, Dec, magnitude and colour (B−V, so that Arktuurus, Aldebaran
  and Betelgeuse are orange), that is about 4,000 stars and 80 kB, in a
  `stars.js` of its own.
- **The named stars, the figures, the hops and the levels** go in lists at
  the top of `app.js`: for each hop its kind, its stars, where the star to
  find is (e.g. five gaps, or a third of the way), the arc's points, and
  the texts.
- **Where the stars are:**
  - the sidereal time from the date and the hour, `GMST ≈ 18.697 h +
    24.06571 h · D`, where `D` is the days since 1 January 2000 at noon
    (UT), and `LST = GMST + λ / 15°` for Tõrva at λ = 26.0° E
  - the height `a` and direction of each star from its hour angle `t = LST
    − RA`: `sin a = sin φ sin δ + cos φ cos δ cos t`, with φ = 58.0°
  - the stereographic projection round the middle of the view, as in
    Püüa langev täht
  - the shift of the stars since 2000 can be left out, as it is too small
    to see
- **The turning between seasons:** the sidereal time changes smoothly from
  one task's to the next one's, always forwards, so that the sky turns the
  way it really does.
- **Drawing:** the stars, the arrows, the figures and the trees on a canvas,
  so that dark mode on phones leaves them alone.
- **Photos:** the photos of Sõel, the Orion Nebula, the Hobusepea udu, the
  Andromeda Galaxy and the Triangulum Galaxy,
  the square crops of Pusle by Tõrva Astronoomiaklubi (CC BY-NC-SA),
  each with its credit and with its middle (RA, Dec), its scale and its
  rotation, set by hand from two or three stars in it, so that it lines
  up with the sky. They are drawn on the canvas, fading in and out over
  the stars.
- **Sounds:** `pick()` when a drag starts on a star, `snap()` when the line
  snaps onto two stars, `oops()` on a wrong star, a note of a tune on each
  star found, and `win()` at the end.

## Effort

About 1,200–1,500 lines and the star data, like Püüa langev täht, whose
projection and horizon it can reuse. Most of the work is in the moves,
making the loose drag snap the way the child means it, and in the panning
and the turning of the view. A first version could be level 1, in a folder `taheretked/` not yet linked from the main page.
