# Kuidas tekivad aastaajad? (What causes the seasons?)

A game idea for ages 8–10, which is now the game in `aastaajad/`, described
in the [README](README.md#kuidas-tekivad-aastaajad). The extras and the
simpler version below are not made yet. It goes well with Kuu faasid. For
how a new game should look and work, see [DESIGN.md](DESIGN.md).

Many children, and many adults, think it is summer when the Earth is closer
to the Sun. In fact the Earth is closest in early January. The seasons come
from the tilt of the Earth's axis, which changes how high the Sun climbs and
how long the day lasts. The player moves the Earth round the Sun and sees
what a child in Estonia sees on each day, and so finds the cause.

## The screen

Two parts side by side on a wide screen, or one above the other on a tall
one, both drawn on a `<canvas>`:

- **The orbit:** the Sun in the middle and the Earth's orbit round it, seen
  at a slant, with the months marked faintly along it. The Earth's axis
  always points the same way, towards Põhjanael, and a small flag marks
  Estonia on the globe. The half of the Earth away from the Sun is dark.
  The player drags the Earth along the orbit, or taps a place on it.
- **Eesti täna (Estonia today):** a yard with a child, a tree and the
  horizon. Over it, the Sun's path for that day is an arc from sunrise to
  sunset, with the Sun at its noon height. Below it:
  - the child's noon shadow, long in winter and short in summer
  - a bar for the day and the night, e.g. "Päev 18 h 20 min"
  - the tree and the ground: green leaves, yellow leaves, bare branches
    and snow, with blossom in spring

The orbit shows the cause, and the yard shows what it does. The game is
about linking the two.

## Levels

Each level ends with one short fact. Wherever a task asks for a place on
the orbit, a wrong place is not a mistake: the yard just shows that day,
with a line such as "Siin on Eestis sügis" ("Here it is autumn in
Estonia"), and the player can move on from there. The target is generous,
about two weeks either side.

1. **Jaanipäev (Midsummer Day):** "Vii Maa sinna, kus Eestis on jaanipäev."
   ("Move the Earth to where it is Midsummer Day in Estonia.")
   - Fact: "Jaanipäeva paiku on Maa telje põhjapoolne ots Päikese poole
     kaldu. Päike tõuseb Eestis kõrgele ja päev kestab üle 18 tunni."
     ("Around Midsummer Day, the north end of the Earth's axis leans
     towards the Sun. The Sun climbs high over Estonia and the day lasts
     over 18 hours.")
2. **Jõulud (Christmas):** "Vii Maa sinna, kus Eestis on jõulud." ("Move
   the Earth to where it is Christmas in Estonia.")
   - Fact: "Talvel on põhjapoolne ots Päikesest eemale kaldu. Keskpäeval
     tõuseb Päike Tartus vaid 8 kraadi kõrgusele ja päev kestab natuke üle
     6 tunni." ("In winter, the north end leans away from the Sun. At noon
     the Sun climbs only 8 degrees over Tartu, and the day lasts just over
     6 hours.")
3. **Päev ja öö on võrdsed (day and night are the same length):** "Leia
   kaks kohta, kus päev ja öö on ühepikkused." ("Find the two places where
   day and night are the same length.") Both must be found, and the day bar
   shows 12 h and 12 h.
   - Fact: "Märtsis ja septembris ei ole telg kaldu Päikese poole ega
     sellest eemale. Siis on päev ja öö kogu Maal umbes 12 tundi pikad."
     ("In March and September the axis leans neither towards the Sun nor
     away from it. Then day and night are about 12 hours long all over the
     Earth.")
4. **Austraalia:** a second flag on the globe and a second yard, with a
   kangaroo. "Kas Austraalias on jõulude ajal soe või külm?" ("Is it warm
   or cold in Australia at Christmas?"), with two buttons. The player can
   first move the Earth to Christmas to look.
   - Fact: "Kui põhjapoolne ots on Päikese poole kaldu, on lõunapoolne
     sellest eemale. Austraalias on jõulude ajal suvi ja jaanipäeval talv."
     ("When the north end leans towards the Sun, the south end leans away.
     In Australia it is summer at Christmas and winter at Midsummer.")
5. **Lähemal või kaugemal? (closer or farther?):** the orbit is drawn a
   little stretched, with the closest place marked. "Siin on Maa Päikesele
   kõige lähemal. Mis aastaaeg on siis Eestis?" ("Here the Earth is closest
   to the Sun. What season is it in Estonia then?"), with four buttons for
   the seasons. The answer is winter, which breaks the common belief head
   on.
   - Fact: "Maa on Päikesele kõige lähemal jaanuari alguses, kui Eestis on
     talv. Kaugus muutub aasta jooksul vaid umbes 5 miljonit kilomeetrit,
     ja see ei too aastaaegu." ("The Earth is closest to the Sun in early
     January, when it is winter in Estonia. The distance changes by only
     about 5 million kilometres in a year, and that does not bring the
     seasons.")
6. **Püstine Maa (an upright Earth):** a slider sets the tilt, from 0° to
   40°. "Keera telg püsti ja vii Maa ümber Päikese. Mis juhtub?" ("Stand the
   axis upright and move the Earth round the Sun. What happens?") At 0°
   every day of the year looks the same in the yard, with 12-hour days. At
   40° the summers and winters are much stronger.
   - Fact: "Ilma kaldeta poleks aastaaegu: iga päev oleks nagu märtsis. Maa
     telg on kaldu umbes 23 kraadi." ("Without the tilt there would be no
     seasons: every day would be like a day in March. The Earth's axis is
     tilted by about 23 degrees.")

The win screen shows the orbit with the four seasons marked, and the yard
in all four.

## Extras

- **Kesköine päike (the midnight Sun):** a third flag in the far north,
  e.g. in Lapland. "Leia koht, kus Päike ei looju." ("Find the place where
  the Sun doesn't set.") The arc in the yard becomes a full circle.
- **Teised planeedid (other planets):** the slider level could end with
  Uranus, which lies on its side, tilted 98°. Each of its poles has about
  42 years of light and then 42 years of darkness. Mars is tilted about
  25° and has seasons like ours, and Jupiter, at 3°, has almost none.
- **Kell (the clock):** in the yard, the player could also drag the Sun
  along the arc and read the time, which leads to idea 15, Päikesekell, in
  [IDEAS.md](IDEAS.md).

## A simpler version for ages 5–6

Four pictures of the same yard, with no orbit. The player drags the Sun
up or down to its noon height for each one: high for the summer yard and
low for the snowy one. The shadow of a child or a snowman grows and
shrinks as the Sun moves. This keeps only the link between the height of
the Sun and the season, and could be one level at the start of the main
game.

## What it needs

- **Data:** none to download. The levels, the target dates, the places
  (Tartu at 58.4° N, Sydney at 33.9° S, Lapland at about 68° N) and the
  texts go in a list at the top of `app.js`.
- **The Sun's position**, worked out from the day of the year `d` and the
  latitude `φ`:
  - the Sun's declination: `δ ≈ −23.44° · cos(360° · (d + 10) / 365)`
  - its noon height: `h = 90° − φ + δ`, e.g. 55° in June and 8° in
    December in Tartu
  - the day length, from `cos H = (sin(−0.83°) − sin φ sin δ) / (cos φ
    cos δ)` and `2H / 15°` hours, e.g. 18 h 20 min in June and 6 h 20 min
    in December. When `cos H` is below −1, the Sun does not set, and above
    1 it does not rise.
  - the arc in the yard, from the height and direction at each hour
    angle: `sin a = sin φ sin δ + cos φ cos δ cos t`
  - the shadow's length: the child's height divided by `tan h`
  - for level 6, the slider's tilt replaces the 23.44°
- **Drawing:** the Sun, its glow, the arc and the globe on a canvas, so
  dark mode on phones leaves them alone. The orbit is an ellipse, and the
  globe is a circle with its lit half and the flag placed by the tilt and
  the Earth's place on the orbit.
- **Sounds:** `pick()` on picking up the Earth, `snap()` on a right place,
  `oops()` on a wrong answer button, and `win()` at the end.

## Effort

About 800–1,000 lines, like Kuu faasid and Planeetide rivi. The formulas
are short, and most of the work is in drawing the yard so that its
seasons are clear and fit both a phone in portrait and a tablet in
landscape. A first version could be levels 1, 2, 3 and 5, with the slider
added later.
