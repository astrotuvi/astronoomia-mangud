# Kosmiline võrk (cosmic web)

A game idea for teenagers and adults, idea 37 in [IDEAS.md](IDEAS.md). For
how a new game should look and work, see [DESIGN.md](DESIGN.md).

Galaxies are not spread evenly but lie along filaments and walls that meet
in clusters, with huge empty voids between them, like foam. The player
finds this pattern in real galaxy data, as astronomers did, and then
watches it form.

## The Estonian story

Told in short facts between the levels. To be checked against a source
before use.

- In 1974 Jaan Einasto, Ants Kaasik and Enn Saar showed that galaxies sit
  in large, heavy coronas of unseen matter, now called dark matter haloes.
- At a symposium in Tallinn in 1977, Einasto, Mihkel Jõeveer and Enn Saar
  described a "cellular" structure of chains and holes. Many doubted it at
  first, and it was confirmed in the 1980s.
- Today Elmo Tempel's group in Tartu has a catalogue of the filaments in
  the Sloan Digital Sky Survey (SDSS), which the game can check the player
  against.

## Levels

1. **Taevas ja sügavus (the sky and the depth):** a few thousand galaxies
   are dots where they are on the sky, and they look random. A slider adds
   their distances from redshift, and the dots slide out into a wedge with
   the Earth at its tip, showing filaments and voids. This is the main
   surprise, and how the web was really found: the pattern shows only once
   the distances are known.
2. **Leia filamendid (find the filaments):** drag a finger along chains of
   galaxies. Each stroke snaps to the nearest filament in the catalogue and
   turns gold. The level is done when most of the main filaments are
   found, with generous tolerance and no penalty.
3. **Leia tühimikud (find the voids):** place bubbles in the empty places.
   A bubble grows until it touches galaxies, and bigger voids give more
   points.
4. **Parved (clusters):** tap the thick knots where filaments meet. They
   look stretched towards the Earth, the "fingers of God", as their
   galaxies move fast inside them, which changes their redshifts. Squeeze
   them back into round clusters to see why.
5. **Meie kodu (our home):** zoom out from the Milky Way to the Local
   Group, the Virgo cluster and the Laniakea supercluster (Hawaiian for
   "immeasurable heaven"), ending with our place as one dot on one
   filament.
6. **Ehita universum (build a universe):** start from a nearly smooth early
   Universe with the tiny ripples seen in the cosmic microwave background,
   and let gravity work. A slider sets the amount of dark matter: with too
   little, the web does not form in time, and with the right amount it
   looks like the real one from level 1. This shows why Einasto needed
   dark matter.

## What it needs

- **Data:** one slice of SDSS galaxies, 3,000–5,000 of them with their
  place on the sky and redshift, as 100–200 KB of JSON made once with a
  small Python script. SDSS data are free to use with a credit, and
  Tempel's filament catalogue is public at the CDS.
- **Drawing:** dots on a `<canvas>`, which dark mode leaves alone, turned
  in 3D by dragging, with no library.
- **Scoring:** how far the stroke's points are from the catalogue's
  filament spines, with the tolerance tuned for fingers on a phone.
- **Simulation:** the Zeldovich approximation, which moves about 128 × 128
  particles on a grid along a random field made with an FFT. It is fast
  enough in plain JavaScript, in about 150 lines.

## Effort

The biggest of the ideas, about 1,200–1,500 lines and the data script.
Levels 1, 3 and 5 are easy, while the work is in making the filaments
readable on a small screen (level 2) and in the simulation (level 6). A
first version could be levels 1 and 2 with one SDSS slice.

Levels 1 and 5 could work from age 11, and the game would also suit a
public evening at the club.
