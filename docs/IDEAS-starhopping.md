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
oktoober kell 21" ("An autumn evening, 15 October at 21:00").

## Moves

- **Hüpe (a hop):** press near the first star, drag through the second and
  let go. The drag is loose: it is enough to start near the first star and
  pass near the second, and the line snaps onto them. The line then goes
  on as a dashed arrow to the edge of the sky, not stopping at the star to
  find, so that it does not give the answer away. A drag from other stars
  also makes an arrow; it is no mistake, it just leads somewhere else. On
  level 1 the arrow has a tick at every gap between the two stars, so that
  "five times as far" can be counted.
- **Osa teest (part of the way):** drag from one star to another, and a
  ring marks the place on the line, e.g. a third of the way from
  Arktuurus to Veega for Põhjakroon (not on level 1 of Suur Vanker).
- **Kaar (an arc):** drag along the three stars of the handle of Suur
  Vanker, and the curve goes on as a dashed arc. The arc is drawn from
  points kept in the data: a circle through the three handle stars bends
  far too much and misses Arktuurus.
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
  wiggles, and on levels 1 and 2 says its name if it has one used in
  Estonia, e.g. "See on Veega", or else its figure, e.g. "See täht on Lohe
  tähtkujus". The Arabic names of the stars, such as Merak and Dubhe, are
  not used in Estonia, so the game does not show them: the tasks name the
  stars by where they are, e.g. Suure Vankri tagumised rattad.

Each star found becomes a start for the next task, so the tasks of a level
are one chain across the sky. 💡 shows the arrow to follow, or on level 1,
where the guide stars already pulse, the star to tap. If nothing happens
for a few seconds, a 👆 shows where to start.

## Seasons and hours

The sky turns round Põhjanael once a day, and a little further each night,
so that at the same hour it is turned by a quarter of a circle three months
later. Suur Vanker never sets in Estonia, so it is always in the north, but
in a different place round Põhjanael:

| Evening | Suur Vanker | Arktuurus |
|---|---|---|
| spring, 15 April 23:00 | almost overhead, upside down, with the bowl open downwards | 40° up in the east-south-east |
| summer, 15 August 23:00 | in the north-west, sinking, with the handle up | 23° up in the west |
| autumn, 15 October 21:00 | low in the north-north-west, right side up | 8° up in the west-north-west, setting |
| winter, 15 January 20:00 | in the north-east, standing on its handle | 11° below the horizon |

The hours are clock times, with summer time from April to October. They are
late in summer, as Estonian summer nights are light.

When a level goes from one season to the next, the sky does not jump: it
turns round Põhjanael for a couple of seconds while the caption counts the
months. So the child sees one sky turning, not four different pictures,
and that the hops stay the same: Merak → Dubhe points to Põhjanael also
when it points down or sideways on the screen.

Arktuurus and Põhjakroon do not stay up all year. On a winter evening the
arc from the handle runs under the horizon, and instead of hiding this the
game shows the arrow going into the ground: "Arktuurus on praegu horisondi
all. Kevadel ja suvel on ta õhtuti taevas." ("Arcturus is below the horizon
now. In spring and summer it is in the evening sky.") Each season's tasks
ask only for stars that are up then. Väike Vanker, Lohe and Veega never set
in Estonia.

The sky also turns about 15° an hour, so six hours later on the same night
it is turned as much as three months later at the same hour. On level 2 one
task keeps the date and moves the clock: from 20:00 on 15 January to 02:00,
when Suur Vanker stands as it does at 22:00 in the middle of March.

Orion is in the evening sky only in winter, so his part changes the hour,
not the season. On 15 January at 19:00 he is low in the south-east, lying
on his side, at about 22:00 he stands upright in the south, and at 03:00
he is low in the south-west, tilted the other way. The belt points to
Siirius at every hour, but at 19:00 Siirius has not risen yet: "Siirius
tõuseb natuke hiljem. Oota!" ("Siirius rises a little later. Wait!"), and
the clock moves on until he does.

## How dark the sky is

How many stars can be seen depends on the lights around:

| Sky | Faintest star | What is seen |
|---|---|---|
| 🏙️ linn (a city) | about 3 | Suur Vanker, with Megrez (3.3) barely there. Of Väike Vanker only Põhjanael, Kochab and Pherkad, so it does not look like a dipper. Of Lohe a few stars, without Thuban (3.7). Of Põhjakroon only Alphecca (2.2). Of Orion the belt and the four corners |
| 🏘️ alevik (a small town) | about 4.5 | all the figures, with few other stars round them |
| 🌲 maa (the countryside) | about 6 | hundreds of stars, among which the figures are hard to see; the sword of Orion with the Orion Nebula |

A darker sky makes the figures harder to find, not easier, which children
do not expect. The level sets how dark the sky is, rather than a free
slider, so that the stars a task needs are always there:

- Levels 1 and 2 are a small-town sky, to magnitude 4.5. The stars of the
  figures always show, also the fainter ones, such as η UMi (5.0) in Väike
  Vanker, and they are drawn a little bigger.
- On level 2, in one task a slider with three stops
  (🏙️ 🏘️ 🌲) appears. In the Suur Vanker part: "Linnas paistab Väikesest
  Vankrist ainult kolm tähte. Vii liugur maale, et näha teda tervet." ("In
  a city only three stars of Väike Vanker can be seen. Move the slider to
  the countryside to see all of it.") In the Orion part, the same for the
  sword with the Orion Nebula.
- Levels 3 and 4 are a countryside sky.

When the slider moves, the stars fade in and out smoothly. Stars near the
horizon are dimmer, as in Püüa langev täht. Faint stars are drawn dimmer
rather than smaller, with a smallest dot that still shows on a phone.

## Levels

Each part has four levels, and a 🌟 in the menu marks the ones done.

1. **Õpi teed (learn the way):** one sky that does not turn, the guide
   stars pulse, and the hops have ticks. The texts say which way to go,
   e.g. left or down.
2. **Taevas pöörleb (the sky turns):** the same hops, two or three in each
   season (Suur Vanker) or hour (Orion), with the turning between them,
   the hour task and the slider task. The texts name only the stars, not
   left or right, as those change when the sky turns.
3. **Päris taevas (a real sky):** a countryside sky on a random date or
   hour. The task still names the stars to start from, but they do not
   pulse.
4. **Ilma abita (without help):** the task names only the star to find.
   The player picks the stars to hop from, or taps the star straight away
   if they know it.

The win screen shows the whole chain as a map: the arrows of all the hops
over the sky, with the figures and the names of the stars found. Its
button "Vaata taevast" ("Look at the sky") opens the same sky without
tasks, with the slider and a control for the season (Suur Vanker) or the
hour (Orion), to play with.

## The hops

The distances and how far off the line each star is were checked against
the star positions. The drag is loose enough for all of them.

### Suur Vanker

The game starts with the chain of level 1, on an autumn evening, 15
October at 21:00. Suur Vanker is low in the north-north-west, right side up
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
   - Fact: "Väike Vanker on palju tuhmim kui Suur Vanker. Linnas paistavad
     temast ainult Põhjanael ja vankri kaks tagumist ratast." ("The Little
     Dipper is much fainter than the Big Dipper. In a city only the North
     Star and the two stars at the end of the bowl can be seen.")
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

On level 2, the sky turns on from the autumn evening of level 1, and the
seasons each take a few of these: autumn Põhjanael and Arktuurus setting,
winter Lohe and Arktuurus below the horizon, then the hour task (from 20:00
to 02:00), spring Veega and Arktuurus high in the east, and summer
Väike Vanker (the slider task) and Põhjakroon. So the sky always turns
forwards, as it does.

### Orion

The chain of level 1, on a winter evening, 15 January at 22:00, with Orion
nearly upright in the south:

1. **Siirius:** "Leia Siirius. Jätka Orioni vöö kolme tähe joont vasakule
   alla." ("Find Sirius. Carry the line of the three stars of Orion's belt
   on, down to the left.") Siirius is about eight belt lengths beyond
   Alnitak, 3° off the line.
   - Fact: "Siirius on kogu öötaeva kõige heledam täht. Ta on meist ainult
     8,6 valgusaasta kaugusel, üks meie lähimaid naabreid." ("Sirius is the
     brightest star of the whole night sky. It is only 8.6 light years
     away, one of our nearest neighbours.")
2. **Aldebaran:** "Leia Aldebaran. Jätka vöö joont teisele poole, paremale
   üles." ("Find Aldebaran. Carry the line of the belt the other way, up to
   the right.") About as far as Siirius, 5° off the line.
   - Fact: "Aldebaran on Sõnni punakas silm. Ta on oranž hiidtäht, meist 65
     valgusaasta kaugusel." ("Aldebaran is the reddish eye of the Bull. It
     is an orange giant, 65 light years away.")
3. **Sõel:** "Jätka sama joont veel edasi ja leia Sõel." ("Carry the same
   line on further and find the Pleiades.") About two thirds as far again
   beyond Aldebaran, 3° off the line.
   - Fact: "Sõel on täheparv. Silmaga näeb temast kuut või seitset tähte,
     aga tegelikult on seal umbes tuhat tähte." ("The Pleiades are a star
     cluster. With the eye one sees six or seven of its stars, but there
     are about a thousand.")
4. **Prooküon:** "Leia Prooküon. Tõmba joon Bellatrixist läbi Betelgeuse
   ja jätka seda vasakule." ("Find Procyon. Draw a line from Bellatrix
   through Betelgeuse and carry it on to the left.") About three and a half
   gaps beyond Betelgeuse, 5° off the line.
   - Fact: "Betelgeuse, Siirius ja Prooküon on Talvekolmnurk. Neid kolme
     heledat tähte on talveõhtul lõunataevas kerge leida." ("Betelgeuse,
     Sirius and Procyon are the Winter Triangle. These three bright stars
     are easy to find in the southern sky on a winter evening.") The
     triangle is drawn in.
5. **Kastor ja Polluks:** "Leia Kaksikud. Tõmba joon Rigelist läbi
   Betelgeuse ja jätka seda üles." ("Find the Twins. Draw a line from Rigel
   through Betelgeuse and carry it on upwards.") Almost twice the gap
   beyond Betelgeuse, Kastor 4° off the line and Polluks 8°.
   - Fact: "Kastor ja Polluks on Kaksikute kaks heledat tähte, nagu kaks
     venda. Polluks on oranžikas ja natuke heledam." ("Castor and Pollux
     are the two bright stars of the Twins, like two brothers. Pollux is
     orange and a little brighter.")
6. **Orioni udu:** "Leia Orioni udu. Vöö all ripub mõõk, ja selle keskel
   on udune täht." ("Find the Orion Nebula. Below the belt hangs the sword,
   and in its middle is a fuzzy star.")
   - Fact: "Orioni udu on hiiglaslik gaasipilv, kus sünnivad uued tähed.
     Ta on meist umbes 1300 valgusaasta kaugusel." ("The Orion Nebula is a
     huge cloud of gas where new stars are born. It is about 1,300 light
     years away.")

On level 2, the hours of 15 January each take a few of these: 19:00 with
Orion rising and Siirius not up yet, 22:00 upright, and 03:00 setting, with
the Orion Nebula as the slider task.

## Extras

Left out of the first version, but easy to add as more hops:

- **Spiika:** the arc from the handle, carried on beyond Arktuurus, reaches
  Spiika, low in the south-east on a spring evening (16° up). The arc
  bends: Spiika is 17° off the straight line from Alkaid through Arktuurus.
- **Kassiopeia:** from Miitsar through Põhjanael, as far again
- **Kapella:** from Megrez through Dubhe, about five gaps beyond Dubhe
- **Lõvi (Leo):** the back of the bowl, Dubhe → Merak, carried on the
  other way, to Regulus
- **Miitsar ja Alkor:** a test for the eyes, a faint star next to Miitsar

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
- **Sounds:** `pick()` when a drag starts on a star, `snap()` when the line
  snaps onto two stars, `oops()` on a wrong star, a note of a tune on each
  star found, and `win()` at the end.

## Effort

About 1,200–1,500 lines and the star data, like Püüa langev täht, whose
projection and horizon it can reuse. Most of the work is in the moves,
making the loose drag snap the way the child means it, and in the panning
and the turning of the view. A first version could be level 1 of the Suur
Vanker part, in a folder `taheretked/` not yet linked from the main page.
