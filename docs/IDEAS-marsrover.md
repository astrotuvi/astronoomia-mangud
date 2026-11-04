# Marsikulgur (Mars rover)

A game idea for ages 8–10, idea 13 in [IDEAS.md](IDEAS.md), not made yet.
For how a new game should look and work, see [DESIGN.md](DESIGN.md).

The player is the rover's driver on Earth. A signal takes 3–22 minutes to
reach Mars, so a rover can't be steered live: it is given a plan and carries
it out alone. The player writes a plan of moves on a map, sends it, and only
then sees what happens. It is also a first taste of coding: order, repeats,
and finding and fixing a mistake.

## The screen

The usual top bar, with the levels as the progress, then 💡 and 🔊. Below it
two parts, side by side on a wide screen (map at the left) and one above the
other on a tall one (map on top):

- **The map:** the ground seen straight from above, like a picture from an
  orbiter, as a grid of 6×6 to 8×8 squares. The rover has a clear front, and
  points the way it will drive. On the map are:
  - the target, a glowing ring with a flag
  - boulders, which the rover can't drive over
  - sand and small craters, for looks only
- **The plan:** the list of steps, the buttons that add steps, and the big
  green **📡 Saada** (Send). The steps are small chips that wrap on to new
  rows, because on a 360 px phone in portrait there is only about 200 px of
  height under the map.

The map itself is not tapped, so its squares may be smaller than 52 px. The
buttons are not.

## Writing a plan

| Button | Step | Comes in |
|---|---|---|
| ⬆️ | Edasi (forward) one square | level 1 |
| ↰ | Vasakule (turn left), on the spot | level 2 |
| ↱ | Paremale (turn right), on the spot | level 2 |
| 📷 | Pildista (take a picture) | level 4 |
| 🔩 | Puuri (drill) | level 5 |
| 🔁 | Korda (repeat) | level 8 |

- Tapping a button adds a step to the end of the plan. Forward steps in a row
  merge into one chip, "Edasi 3".
- Tapping a chip takes one step off it, or removes it.
- Tapping 🔁 opens a block, and the steps tapped next go into it until
  "Valmis" (Done). Tapping its number changes it: 2×, 3×, 4×. Blocks don't go
  inside each other.
- The arrows on the turn buttons bend the way the rover turns, as seen from
  the rover. When it drives towards the player, its left is on the player's
  right. Level 3 makes this the challenge on purpose.

## Sending a plan

1. **The signal:** after 📡 Saada, a dot flies from the Earth to Mars in about
   3 seconds, on a small diagram with the Sun and the two orbits. A label says
   "Signal on teel: 12 minutit" ("The signal is on its way: 12 minutes"). A
   tap skips this after the first send of a level.
2. **The drive:** the rover carries out the plan, and each step lights up as
   it runs. There is no steering now.
3. **🛑 during the drive:** it doesn't stop the rover. It shows "Käsk jõuab
   kohale 12 minuti pärast" ("The order will arrive in 12 minutes"), so that
   the player feels the delay. ⬅️ in the top bar still leaves the level.
4. **The end:** on the target, the rover sends back a postcard and a fact on
   the win screen. Otherwise the steps done leave the plan, the rest stays, and
   the player carries on from where the rover stands.

**Alusta otsast** (start over), small and beside the plan, puts the rover back
at the start of the level.

Each level has its own true delay, from 5 to 20 minutes, in the `LEVELS` list.
The diagram works out where to draw the two planets from the delay. With
round orbits the delay can only be about 4–21 minutes, so the levels stay
within that, even though the facts say 3–22, which comes from the real orbits
not being quite round.

## No punishment

The rover never breaks, and there are no lives.

- **A boulder ahead:** the rover stops by itself, as real rovers can, and the
  step that could not be done shakes. "Kivi on ees. Kulgur peatus ise." ("There
  is a rock ahead. The rover stopped by itself.")
- **The edge of the map:** the rover stops in the same way. "Siit kaart lõpeb."
  ("The map ends here.")
- **📷 or 🔩 in the wrong place:** a soft `sfx.oops()`, and the rover stops.
  "Siin pole midagi uurida." ("There is nothing to study here.")
- **Stopping short of the target:** "Sihtmärgini on veel maad." ("The target is
  still some way off.")
- **After two stops** in the same level, the next right step pulses in the
  buttons. If nothing happens for a few seconds, a 👆 shows what to do.

## The hint

💡 runs the plan on a faint test rover. It takes no time, needs no signal and
uses no Sol, and the real rover stays where it is. Real teams try risky moves
on a twin rover on Earth in the same way, and a line on the first use says so.

It is always allowed and doesn't count against the record, because testing is
part of a driver's job. The test rover knows only what is on the map, so on
level 9 it drives straight through the hidden rocks.

## Levels

The levels are all open from the start, and a 🌟 marks the ones done. Each ends
with one short fact. The facts should be checked against a source before use.

### Esimesed sõidud (first drives)

1. **Otse (straight on):** forward only, to a flag ahead. Delay 5 minutes.
   - Fact: "Signaal on Maalt Marsile teel 3 kuni 22 minutit. Nii kaugelt ei saa
     kulgurit roolida, seepärast saab ta käsud korraga." ("A signal takes 3 to
     22 minutes from the Earth to Mars. A rover can't be steered from so far
     away, so it gets its orders all at once.")
2. **Esimene pööre (first turn):** one turn on the way to the flag. Delay 8
   minutes.
   - Fact: "Kulgurid sõidavad väga aeglaselt. Perseverance läbib tunnis kõige
     rohkem umbes 150 meetrit." ("Rovers drive very slowly. Perseverance covers
     about 150 metres an hour at most.")
3. **Kivid teel (rocks in the way):** boulders to go round, with the rover
   starting towards the player, so that left and right are swapped. Delay 12
   minutes.
   - Fact: "Kulgur vaatab kaameratega ette ja oskab ohtliku kivi ees ise
     peatuda." ("A rover looks ahead with its cameras and can stop by itself
     in front of a dangerous rock.")

### Teadustöö (science)

4. **Pildista (take a picture):** drive to a rock and take its picture. Delay 15
   minutes.
   - Fact: "Marss on punane, sest tema pinnases on roostes rauda." ("Mars is
     red because there is rusty iron in its soil.")
5. **Puuri (drill):** on the same square, first the picture and then the drill.
   Drilling first gets "Kõigepealt pildista, et teaks, kuhu puurida." ("Take a
   picture first, to know where to drill.") Delay 20 minutes.
   - Fact: "Perseverance uurib kraatrit, kus oli kunagi järv. Ta puurib kividest
     proove ja otsib märke sellest, kas seal võis olla elu." ("Perseverance is
     exploring a crater that once held a lake. It drills samples from rocks and
     looks for signs of whether there could have been life.")

### Päikese jõul (on solar power)

Every step uses one unit of the battery, shown as a bar. When it is empty the
Sun goes down, the rover sleeps, and a new Sol begins with a full battery. The
steps not done stay in the plan, ready to be sent again, or changed. The
fewer Sols the better, but a level can always be finished.

6. **Akuga sõit (driving on a battery):** the target is too far for one Sol.
   Delay 10 minutes.
   - Fact: "Marsi ööpäev on Sol. See on 24 tundi ja 39 minutit, nii et peaaegu
     sama pikk kui meie ööpäev." ("A day on Mars is called a Sol. It is 24 hours
     and 39 minutes, so almost as long as ours.")
7. **Pikk teekond (a long way):** a straight but long way or a short way past
   many turns, so that the player compares them. Delay 14 minutes.
   - Fact: "Opportunity pidi töötama 90 Soli, aga töötas umbes 15 aastat, kuni
     tolmutorm 2018. aastal Päikese varjas ja aku tühjaks jäi." ("Opportunity
     was meant to work for 90 Sols, but it worked for about 15 years, until a
     dust storm in 2018 hid the Sun and its battery ran out.")

### Targad plaanid (smart plans)

8. **Korda (repeat):** a staircase of boulders, and a limit on the plan: "Sõnumisse
   mahub 4 käsku" ("The message holds 4 orders"). A plan over the limit can't be
   sent, and 🔁 is pointed out. A block counts as one order. Delay 18 minutes.
   - Fact: "Kulgur saadab pildid enamasti Marsi ümber tiirleva satelliidi kaudu.
     Nii jõuab Maale palju rohkem andmeid." ("A rover mostly sends its pictures
     through a satellite going round Mars. That gets far more data to the
     Earth.")
9. **Peidus kivid (hidden rocks):** some rocks are not on the map. They appear
   only when the rover is next to them, it stops, and the player carries on.
   Delay 16 minutes.
   - Fact: "Perseverance'il on 23 kaamerat. Nendega vaatavad inimesed Maal,
     kuhu järgmisel Solil sõita." ("Perseverance has 23 cameras. With them,
     people on the Earth see where to drive on the next Sol.")
10. **Jää (ice):** everything together, with the battery and hidden rocks, ending
    with 🔩 on a pale patch of ground. Delay 20 minutes.
    - Fact: "Marsi pinna all on jääd. Maandur Phoenix kaevas selle 2008. aastal
      välja." ("There is ice under the surface of Mars. The Phoenix lander
      dug it up in 2008.")

Finding ice with a rover is made up for the game. Say so in the README, as no
rover has dug up ice yet.

## Postcards

The win screen's `.win-pic` is the rover's view at ground level, drawn in code:
dark rocks on rusty ground, under a butterscotch sky. The last one, level 10, is
the blue sunset, which is true for Mars: the sky is reddish by day and blue
around the Sun as it sets.

- First drives: the rover's own tracks running back behind it
- Science: the rock, then the same rock with a round hole drilled in it
- Solar power: the Sun small and low, about two thirds as wide as seen from the
  Earth
- Smart plans: the plain with a distant crater rim, then the sunset

## Records

Kept with `Astro.makeStore('kulgur.')`, for each level:

- done, for the 🌟
- the shortest plan, counting all steps sent, with a block as one step and each
  repeat send counting again
- on levels 6, 7 and 10, the fewest Sols

The menu shows them as "🏆 Parim: 6 käsku" or "🏆 Parim: 2 Soli" under the
level. Alusta otsast clears the count of the current try, not the record.

## Pictures

- **Ground:** on a `<canvas>`, which stays the same in dark mode, with the
  rust colours of `drawMars` in `shared/planets.js`. That file doesn't export
  its noise, so either export it or make a small one in the game.
- **Rover:** inline SVG in flat colours with `data-ink`, turned with
  `transform`: a body, six wheels, a mast and **solar panels**. The battery
  levels fit only solar rovers such as Opportunity, because Curiosity and
  Perseverance run on nuclear power. So the rover is made up, not a copy of a
  real one, and the facts name the real ones only for what is true of them.
- **Menu and start page card:** the rover on rusty ground under a small Mars
  from `drawMars`, with a few white stars. No NASA photos.

## Sounds

`sfx.pick()` for adding a step, `snap()` for a step done, `oops()` for a stop,
`win()` with `Astro.startConfetti()` on the win screen. Made for this game: a
rising beep for the signal leaving and a soft whirr while driving.

## Data

At the top of `kulgur/app.js`:

- `TEXT`, with the same keys under `et` and `en`
- `LEVELS`, each with the map as rows of characters, so that it is easy to draw
  and change, the rover's start and direction, the steps it may use, the delay,
  the battery, the limit on the plan, the fact and the postcard

```js
{
  id: 'kivid',
  map: [
    '......',
    '.#..F.',
    '.#.##.',
    '.R....',   // # boulder, r hidden rock, F flag, R rover
  ],
  face: 'S',
  steps: ['forward', 'left', 'right'],
  delay: 12,        // minutes, one way
  battery: null,    // units for one Sol
  limit: null,      // longest plan
}
```

The maps have to be solved once by hand or by a small check, so that no level
is impossible and the limits leave at least one way through.

## What the game needs

Building it follows "Adding a game" in [DESIGN.md](DESIGN.md), so it also needs:

- a folder `kulgur/`, and a card and texts on the start page
- a row in the README's table and a section there, with the ages at the top of
  the README and of `DESIGN.md` updated
- this idea taken off the list in [IDEAS.md](IDEAS.md), and this file changed to
  say that it is now the game
- a few questions in `viktoriin/questions.js`, about the delay, the Sol and why
  Mars is red
- a check on a 360 px phone in portrait, a tablet in landscape and in dark mode

## Left out on purpose

- **"If" steps** ("if there's a rock, turn"), which would be too much for ages
  8–10
- **A slanted 3D view**, which is harder to read on a phone, and makes left and
  right less clear
- **Steering live**, which would take away the point of the game
