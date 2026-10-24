'use strict';

// The questions of Kosmoseviktoriin, by the game that teaches them.
//
// Each question has
//   q:    the question
//   pic:  a picture shown with it (optional, see below)
//   why:  one sentence shown after answering
// and one kind of answer:
//   answers: 2–4 answers, the right one FIRST (they are shuffled when shown).
//            An answer is a text { et, en } or a picture with an optional label.
//   tf:      true or false, for a statement to call right or wrong
//   order:   2–4 items in the right order, to put in order (only when
//            playing alone)
//
// Pictures:
//   { photo: 'saturn' }   a photo from pusle/images/
//   { world: 'mars' }     the Earth, the Moon, Mars, Jupiter or Saturn
//   { moon: 90 }          the Moon seen from the Earth, by its angle from new
//                         moon (0 new, 90 first quarter, 180 full, 270 last quarter)
//   { space: 90 }         the Sun, the Earth and the Moon from above the North
//                         Pole, the Moon at that angle, as in Kuu faasid
//   { con: 'orion' }      the stars of a constellation without lines
//   { anim: 'plane' }     a short animation of a plane, a satellite or a shooting star
// A picture may have a label: { photo: 'saturn', label: { et, en } }.
window.QUIZ = [
  {
    game: 'kuufaasid',
    questions: [
      {
        q: { et: 'Kosmosest vaadates on Kuu siin. Milline paistab Kuu Maalt?', en: 'Seen from space, the Moon is here. What does it look like from the Earth?' },
        pic: { space: 90 },
        answers: [{ moon: 90 }, { moon: 270 }, { moon: 180 }, { moon: 35 }],
        why: { et: 'See on esimene veerand: Kuu on teinud veerandi tiirust ja me näeme valgustatud poolest poolt, paremal pool.', en: 'This is the first quarter: the Moon has gone a quarter of the way round, and we see half of its lit half, on the right.' }
      },
      {
        q: { et: 'Kosmosest vaadates on Kuu siin. Milline paistab Kuu Maalt?', en: 'Seen from space, the Moon is here. What does it look like from the Earth?' },
        pic: { space: 270 },
        answers: [{ moon: 270 }, { moon: 90 }, { moon: 0 }, { moon: 325 }],
        why: { et: 'See on viimane veerand: Kuu on teinud kolm veerandit tiirust ja valgustatud on vasak pool.', en: 'This is the last quarter: the Moon has gone three quarters of the way round, and its left side is lit.' }
      },
      {
        q: { et: 'Kuu paistab Maalt nii. Kus on Kuu kosmosest vaadates?', en: 'This is how the Moon looks from the Earth. Where is it, seen from space?' },
        pic: { moon: 45 },
        answers: [{ space: 45 }, { space: 135 }, { space: 315 }, { space: 225 }],
        why: { et: 'Kasvav kuusirp on varsti pärast noorkuud, kui Kuu on Päikese poolt veidi edasi liikunud. Me näeme valgustatud poolest ainult kitsast serva.', en: 'A waxing crescent comes soon after new moon, when the Moon has moved a little on from the Sun’s side. We see only a thin edge of its lit half.' }
      },
      {
        q: { et: 'Kuu paistab Maalt nii. Kus on Kuu kosmosest vaadates?', en: 'This is how the Moon looks from the Earth. Where is it, seen from space?' },
        pic: { moon: 225 },
        answers: [{ space: 225 }, { space: 135 }, { space: 45 }, { space: 315 }],
        why: { et: 'See on kahanev kuu: täiskuust on möödas mõni päev ja valgustatud on üle poole, vasakul pool.', en: 'This is a waning gibbous moon: a few days after full moon, more than half is lit, on the left.' }
      },
      {
        q: { et: 'Miks Kuu kuju kuu jooksul muutub?', en: 'Why does the Moon’s shape change during a month?' },
        answers: [
          { et: 'Näeme valgest poolest eri osa', en: 'We see more or less of its lit half' },
          { et: 'Maa vari katab osa Kuust', en: 'The Earth’s shadow covers it' },
          { et: 'Pilved katavad osa Kuust', en: 'Clouds cover it' },
          { et: 'Kuu kasvab ja kahaneb päriselt', en: 'The Moon really grows and shrinks' }
        ],
        why: { et: 'Päike valgustab alati poolt Kuust. Kuu tiirleb ümber Maa ja me näeme sellest valgest poolest kord rohkem, kord vähem.', en: 'The Sun always lights half of the Moon. As the Moon goes round the Earth, we see more or less of that lit half.' }
      },
      {
        q: { et: 'Maalt paistab kitsas kuusirp. Kui suur osa Kuust on sel ajal Päikese poolt valgustatud?', en: 'From the Earth you see a thin crescent. How much of the Moon is lit by the Sun at that time?' },
        answers: [
          { et: 'Pool', en: 'Half' },
          { et: 'Ainult kitsas sirp', en: 'Only the thin crescent' },
          { et: 'Peaaegu kogu Kuu', en: 'Nearly all of the Moon' },
          { et: 'Mitte midagi', en: 'None of it' }
        ],
        why: { et: 'Kuu on alati pooleldi valgustatud. Sirbi ajal on valge pool peaaegu meist eemale pööratud.', en: 'The Moon is always half lit. At a crescent, the lit half is turned nearly away from us.' }
      },
      {
        q: { et: 'Täna on noorkuu. Milline on Kuu umbes ühe nädala pärast?', en: 'Today is new moon. What will the Moon be like in about a week?' },
        answers: [
          { moon: 90, label: { et: 'Esimene veerand', en: 'First quarter' } },
          { moon: 180, label: { et: 'Täiskuu', en: 'Full moon' } },
          { moon: 270, label: { et: 'Viimane veerand', en: 'Last quarter' } },
          { moon: 0, label: { et: 'Ikka noorkuu', en: 'Still new moon' } }
        ],
        why: { et: 'Ühe nädalaga teeb Kuu veerandi tiirust ümber Maa, nii et noorkuust saab esimene veerand.', en: 'In a week the Moon goes a quarter of the way round the Earth, so new moon becomes first quarter.' }
      },
      {
        q: { et: 'Kui palju aega kulub ühest noorkuust järgmiseni?', en: 'How long is it from one new moon to the next?' },
        answers: [
          { et: '29 ja pool päeva', en: '29 and a half days' },
          { et: '7 päeva', en: '7 days' },
          { et: '15 päeva', en: '15 days' },
          { et: 'Üks aasta', en: 'One year' }
        ],
        why: { et: 'Noorkuust noorkuuni kulub 29 ja pool päeva. Sellest tuleb ka sõna „kuu“ kalendris.', en: 'From new moon to new moon takes 29 and a half days. That is where the word “month” comes from.' }
      },
      {
        q: { et: 'Millal saab olla päikesevarjutus?', en: 'When can there be a solar eclipse?' },
        answers: [
          { moon: 0, label: { et: 'Noorkuu ajal', en: 'At new moon' } },
          { moon: 180, label: { et: 'Täiskuu ajal', en: 'At full moon' } },
          { moon: 90, label: { et: 'Esimese veerandi ajal', en: 'At first quarter' } },
          { moon: 270, label: { et: 'Viimase veerandi ajal', en: 'At last quarter' } }
        ],
        why: { et: 'Päikesevarjutuse ajal on Kuu Maa ja Päikese vahel. Nii on see ainult noorkuu ajal.', en: 'In a solar eclipse the Moon is between the Earth and the Sun. That happens only at new moon.' }
      },
      {
        q: { et: 'Millal saab olla kuuvarjutus?', en: 'When can there be a lunar eclipse?' },
        answers: [
          { moon: 180, label: { et: 'Täiskuu ajal', en: 'At full moon' } },
          { moon: 0, label: { et: 'Noorkuu ajal', en: 'At new moon' } },
          { moon: 90, label: { et: 'Esimese veerandi ajal', en: 'At first quarter' } },
          { moon: 270, label: { et: 'Viimase veerandi ajal', en: 'At last quarter' } }
        ],
        why: { et: 'Kuuvarjutuse ajal läheb Kuu Maa varju. Maa vari on Päikesest vastassuunas ja Kuu on seal täiskuu ajal.', en: 'In a lunar eclipse the Moon goes into the Earth’s shadow. The shadow points away from the Sun, where the Moon is at full moon.' }
      },
      {
        q: { et: 'Miks ei ole päikesevarjutust igal noorkuul?', en: 'Why is there not a solar eclipse at every new moon?' },
        answers: [
          { et: 'Kuu läheb ülalt või alt mööda', en: 'The Moon passes above or below' },
          { et: 'Päike on liiga hele', en: 'The Sun is too bright' },
          { et: 'Noorkuu on vahel öösel', en: 'New moon is sometimes at night' },
          { et: 'Kuu on liiga väike', en: 'The Moon is too small' }
        ],
        why: { et: 'Kuu tee on umbes 5 kraadi viltu. Varjutus tuleb ainult siis, kui noorkuu juhtub just sinna, kus Kuu tee Maa teed lõikab.', en: 'The Moon’s path is tilted by about 5 degrees. An eclipse comes only when new moon happens just where the Moon’s path crosses the Earth’s.' }
      },
      {
        q: { et: 'Mis juhtub Kuuga täieliku kuuvarjutuse ajal?', en: 'What happens to the Moon in a total lunar eclipse?' },
        answers: [
          { et: 'Ta muutub vaskpunaseks', en: 'It turns copper red' },
          { et: 'Ta kaob täiesti ära', en: 'It disappears completely' },
          { et: 'Ta muutub siniseks', en: 'It turns blue' },
          { et: 'Ta muutub sirbiks', en: 'It becomes a crescent' }
        ],
        why: { et: 'Maa õhk painutab natuke päikesevalgust Kuu peale. See valgus on punane nagu päikeseloojangul.', en: 'The Earth’s air bends a little sunlight onto the Moon. That light is red, like at sunset.' }
      },
      {
        q: { et: 'Millal ja kus näed kasvavat kuusirpi?', en: 'When and where can you see a waxing crescent?' },
        pic: { moon: 45 },
        answers: [
          { et: 'Õhtul läänes', en: 'In the evening in the west' },
          { et: 'Keskööl kõrgel lõunas', en: 'At midnight high in the south' },
          { et: 'Varahommikul idas', en: 'Early in the morning in the east' },
          { et: 'Ainult keskpäeval', en: 'Only at midday' }
        ],
        why: { et: 'Kasvav kuusirp on taevas Päikese lähedal ja jääb temast veidi maha. Teda näeb õhtul läänes, kui Päike on just loojunud.', en: 'A waxing crescent is close to the Sun in the sky, a little behind it. You see it in the west in the evening, just after the Sun has set.' }
      },
      {
        q: { et: 'Täiskuu tõuseb õhtul, kui Päike loojub.', en: 'The full moon rises in the evening, when the Sun sets.' },
        tf: true,
        why: { et: 'Täiskuu on Päikesest vastassuunas. Kui Päike loojub läänes, tõuseb täiskuu idas.', en: 'The full moon is on the opposite side from the Sun. When the Sun sets in the west, the full moon rises in the east.' }
      },
      {
        q: { et: 'Pane Kuu kujud järjekorda, alates noorkuust.', en: 'Put the Moon’s shapes in order, starting from new moon.' },
        order: [{ moon: 45 }, { moon: 90 }, { moon: 135 }, { moon: 180 }],
        why: { et: 'Pärast noorkuud valgustatud osa kasvab: sirp, esimene veerand, kasvav kuu ja lõpuks täiskuu.', en: 'After new moon the lit part grows: a crescent, the first quarter, a gibbous moon and at last the full moon.' }
      }
    ]
  },
  {
    game: 'hupe',
    questions: [
      {
        q: { et: 'Kus hüppad kõige kõrgemale?', en: 'Where do you jump highest?' },
        answers: [
          { world: 'moon', label: { et: 'Kuu', en: 'The Moon' } },
          { world: 'earth', label: { et: 'Maa', en: 'The Earth' } },
          { world: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { world: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } }
        ],
        why: { et: 'Kuu tõmbab kõige nõrgemalt, kuus korda nõrgemalt kui Maa. Seal hüppad kuus korda kõrgemale.', en: 'The Moon pulls most weakly, six times more weakly than the Earth. There you jump six times higher.' }
      },
      {
        q: { et: 'Kus hüppad kõige madalamalt?', en: 'Where is your jump lowest?' },
        answers: [
          { world: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } },
          { world: 'earth', label: { et: 'Maa', en: 'The Earth' } },
          { world: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { world: 'moon', label: { et: 'Kuu', en: 'The Moon' } }
        ],
        why: { et: 'Jupiter on palju suurem kui Maa ja tõmbab üle kahe korra tugevamalt. Seal saad vaevu hüpata.', en: 'Jupiter is much bigger than the Earth and pulls more than twice as strongly. There you can hardly jump.' }
      },
      {
        q: { et: 'Kass hüppab Maal 10 cm kõrgusele. Kui kõrgele hüppab ta Kuul?', en: 'A cat jumps 10 cm high on the Earth. How high does it jump on the Moon?' },
        answers: [
          { et: '60 cm', en: '60 cm' },
          { et: '10 cm', en: '10 cm' },
          { et: 'Umbes 2 cm', en: 'About 2 cm' },
          { et: 'Ta lendab kosmosesse', en: 'It flies off into space' }
        ],
        why: { et: 'Kuu tõmbab kuus korda nõrgemalt, nii et hüpe on kuus korda kõrgem: 6 × 10 cm = 60 cm. Kuu tõmbab kassi siiski tagasi.', en: 'The Moon pulls six times more weakly, so the jump is six times higher: 6 × 10 cm = 60 cm. The Moon still pulls the cat back down.' }
      },
      {
        q: { et: 'Koer hüppab Maal 10 cm kõrgusele. Kui kõrgele hüppab ta Marsil?', en: 'A dog jumps 10 cm high on the Earth. How high does it jump on Mars?' },
        answers: [
          { et: 'Peaaegu 30 cm', en: 'Nearly 30 cm' },
          { et: '10 cm', en: '10 cm' },
          { et: 'Umbes 4 cm', en: 'About 4 cm' },
          { et: '1 meeter', en: '1 metre' }
        ],
        why: { et: 'Marss tõmbab peaaegu kolm korda nõrgemalt kui Maa, nii et hüpe on peaaegu kolm korda kõrgem: peaaegu 30 cm.', en: 'Mars pulls nearly three times more weakly than the Earth, so the jump is nearly three times higher: nearly 30 cm.' }
      },
      {
        q: { et: 'Miks hüppad Kuul kõrgemale kui Maal?', en: 'Why do you jump higher on the Moon than on the Earth?' },
        answers: [
          { et: 'Kuu tõmbab nõrgemalt', en: 'The Moon pulls more weakly' },
          { et: 'Kuul ei ole õhku', en: 'There is no air on the Moon' },
          { et: 'Kuu on Maast kaugel', en: 'The Moon is far from the Earth' },
          { et: 'Kuul ei ole raskusjõudu', en: 'There is no gravity on the Moon' }
        ],
        why: { et: 'Mida väiksem on taevakeha, seda nõrgemalt ta tõmbab. Raskusjõud on Kuul olemas, ainult kuus korda nõrgem.', en: 'The smaller a world is, the more weakly it pulls. There is gravity on the Moon, only six times weaker.' }
      },
      {
        q: { et: 'Miks hüppad Jupiteril madalamalt kui Maal?', en: 'Why is your jump lower on Jupiter than on the Earth?' },
        answers: [
          { et: 'Jupiter tõmbab tugevamalt', en: 'Jupiter pulls more strongly' },
          { et: 'Jupiteril on tugev tuul', en: 'There are strong winds on Jupiter' },
          { et: 'Jupiteril on külm', en: 'It is cold on Jupiter' },
          { et: 'Jupiteri õhk on paks', en: 'Jupiter’s air is thick' }
        ],
        why: { et: 'Jupiter on kõige suurem planeet ja tõmbab üle kahe korra tugevamalt kui Maa.', en: 'Jupiter is the biggest planet and pulls more than twice as strongly as the Earth.' }
      },
      {
        q: { et: 'Kuul ei ole raskusjõudu.', en: 'There is no gravity on the Moon.' },
        tf: false,
        why: { et: 'Kuu tõmbab ka, ainult kuus korda nõrgemalt kui Maa. Seepärast tulid astronaudid pärast hüpet alati tagasi alla.', en: 'The Moon pulls too, only six times more weakly than the Earth. That is why the astronauts always came back down after a jump.' }
      },
      {
        q: { et: 'Kuul hüppad kuus korda kõrgemale kui Maal. Kas hüpe kestab ka kauem?', en: 'On the Moon you jump six times higher than on the Earth. Does the jump also last longer?' },
        answers: [
          { et: 'Jah, mitu korda kauem', en: 'Yes, several times longer' },
          { et: 'Ei, sama kaua', en: 'No, just as long' },
          { et: 'Ei, see on lühem', en: 'No, it is shorter' }
        ],
        why: { et: 'Nõrk tõmme pidurdab sind üles minnes aeglaselt ja tõmbab ka aeglaselt alla. Maal kestab hüpe pool sekundit, Kuul üle kolme sekundi.', en: 'A weak pull slows you down slowly on the way up and pulls you down slowly too. On the Earth a jump lasts half a second, on the Moon over three seconds.' }
      },
      {
        q: { et: 'Mis on raskusjõud?', en: 'What is gravity?' },
        answers: [
          { et: 'Taevakeha tõmme', en: 'The pull of a world' },
          { et: 'Õhk, mis surub alla', en: 'Air pressing us down' },
          { et: 'Maa magnet', en: 'The Earth’s magnet' },
          { et: 'Tuul, mis puhub ülevalt alla', en: 'Wind blowing from above' }
        ],
        why: { et: 'Raskusjõud tõmbab kõike taevakeha poole. Seepärast kukud pärast hüpet alati tagasi maha.', en: 'Gravity pulls everything towards a world. That is why you always fall back down after a jump.' }
      },
      {
        q: { et: 'Jupiteril saaks seista nagu Maal.', en: 'You could stand on Jupiter as on the Earth.' },
        tf: false,
        why: { et: 'Jupiteril pole maapinda, ainult pilved ja gaas. Mängus seisab hüppaja pilvede peal.', en: 'Jupiter has no ground, only clouds and gas. In the game the jumper stands on the cloud tops.' }
      },
      {
        q: { et: 'Pane järjekorda: kus hüppad kõige kõrgemale, kus kõige madalamale?', en: 'Put them in order: where do you jump highest, where lowest?' },
        order: [
          { world: 'moon', label: { et: 'Kuu', en: 'The Moon' } },
          { world: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { world: 'earth', label: { et: 'Maa', en: 'The Earth' } },
          { world: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } }
        ],
        why: { et: 'Kuu tõmbab kõige nõrgemalt, siis Marss, siis Maa. Jupiter tõmbab kõige tugevamalt.', en: 'The Moon pulls most weakly, then Mars, then the Earth. Jupiter pulls most strongly.' }
      }
    ]
  },
  {
    game: 'rakett',
    questions: [
      {
        q: { et: 'Kuhu lendamiseks on vaja kõige rohkem kütust?', en: 'Which trip needs the most fuel?' },
        answers: [
          { world: 'saturn', label: { et: 'Saturn', en: 'Saturn' } },
          { world: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } },
          { world: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { world: 'moon', label: { et: 'Kuu', en: 'The Moon' } }
        ],
        why: { et: 'Saturn on neist kõige kaugemal. Mängus vajab rakett sinna neli kütusepaaki.', en: 'Saturn is the farthest of them. In the game the rocket needs four fuel tanks to get there.' }
      },
      {
        q: { et: 'Miks vajab rakett Saturnile lendamiseks rohkem kütust kui Marsile?', en: 'Why does a rocket need more fuel to fly to Saturn than to Mars?' },
        answers: [
          { et: 'Saturn on palju kaugemal', en: 'Saturn is much farther away' },
          { et: 'Saturn on suurem', en: 'Saturn is bigger' },
          { et: 'Saturnil on rõngad', en: 'Saturn has rings' },
          { et: 'Kütus külmub seal', en: 'The fuel freezes there' }
        ],
        why: { et: 'Mida kaugemale lendad, seda rohkem kütust on vaja.', en: 'The farther you fly, the more fuel you need.' }
      },
      {
        q: { et: 'Pane järjekorda Maale kõige lähemast kõige kaugemani.', en: 'Put them in order from the nearest to the Earth to the farthest.' },
        order: [
          { world: 'moon', label: { et: 'Kuu', en: 'The Moon' } },
          { world: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { world: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } },
          { world: 'saturn', label: { et: 'Saturn', en: 'Saturn' } }
        ],
        why: { et: 'Kuu on meie lähim naaber. Planeetidest on Marss lähemal, Jupiter kaugemal ja Saturn veel kaugemal.', en: 'The Moon is our nearest neighbour. Of the planets, Mars is nearer, Jupiter farther and Saturn farther still.' }
      },
      {
        q: { et: 'Millist teed lendab rakett Maalt Marsile?', en: 'Which way does a rocket fly from the Earth to Mars?' },
        answers: [
          { et: 'Mööda kaart', en: 'Along a curve' },
          { et: 'Sirgelt Marsi poole', en: 'Straight towards Mars' },
          { et: 'Läbi Päikese', en: 'Through the Sun' },
          { et: 'Tiirutades ümber Maa', en: 'Round and round the Earth' }
        ],
        why: { et: 'Rakett tiirleb ümber Päikese nagu planeedid. Tema tee puudutab ühes otsas Maa orbiiti ja teises Marsi orbiiti.', en: 'The rocket goes round the Sun like the planets. Its path touches the Earth’s orbit at one end and Mars’s orbit at the other.' }
      },
      {
        q: { et: 'Rakett stardib Marsile. Kuhu poole peab ta lendama?', en: 'A rocket sets off to Mars. Where should it aim?' },
        answers: [
          { et: 'Sinna, kus Marss hiljem on', en: 'Where Mars will be later' },
          { et: 'Sinna, kus Marss praegu on', en: 'Where Mars is now' },
          { et: 'Päikese poole', en: 'Towards the Sun' },
          { et: 'Otse üles', en: 'Straight up' }
        ],
        why: { et: 'Marss liigub lennu ajal oma orbiidil edasi. Rakett ja Marss peavad jõudma kohtumispaika korraga.', en: 'Mars moves on along its orbit during the flight. The rocket and Mars must reach the meeting point at the same time.' }
      },
      {
        q: { et: 'Kumb tiirleb ümber Päikese kiiremini?', en: 'Which goes round the Sun faster?' },
        answers: [
          { world: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { world: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } }
        ],
        why: { et: 'Päikesele lähemal olevad planeedid liiguvad kiiremini. Marss on Päikesele lähemal kui Jupiter.', en: 'The planets nearer the Sun move faster. Mars is nearer the Sun than Jupiter is.' }
      },
      {
        q: { et: 'Vaatame Päikesesüsteemi ülevalt, Maa põhjapooluse kohalt. Kuidas tiirlevad planeedid?', en: 'We look at the Solar System from above the Earth’s North Pole. Which way do the planets go round?' },
        answers: [
          { et: 'Kõik vastupäeva', en: 'All anticlockwise' },
          { et: 'Kõik päripäeva', en: 'All clockwise' },
          { et: 'Mõned ühte, mõned teist pidi', en: 'Some one way, some the other' }
        ],
        why: { et: 'Kõik planeedid tiirlevad ümber Päikese samas suunas. Ülevalt vaadates on see vastupäeva.', en: 'All the planets go round the Sun the same way. Seen from above, that is anticlockwise.' }
      },
      {
        q: { et: 'Kuidas lendab rakett pärast starti?', en: 'How does a rocket fly after lift-off?' },
        answers: [
          { et: 'Pöörab tõustes itta', en: 'It turns east as it climbs' },
          { et: 'Lendab otse üles', en: 'It flies straight up' },
          { et: 'Pöörab tõustes läände', en: 'It turns west as it climbs' },
          { et: 'Lendab otse Kuu poole', en: 'It flies straight to the Moon' }
        ],
        why: { et: 'Maa pöörleb itta ja aitab niimoodi raketil kiirust koguda. Kõigepealt läheb rakett tiirlema ümber Maa.', en: 'The Earth turns eastwards, which helps the rocket gain speed. First the rocket goes into orbit round the Earth.' }
      },
      {
        q: { et: 'Miks kukuvad kütusepaagid lennu ajal raketi küljest ära?', en: 'Why do the fuel tanks drop off the rocket during the flight?' },
        answers: [
          { et: 'Tühi paak oleks asjata raske', en: 'An empty tank is extra weight' },
          { et: 'Et rakett pidurdaks', en: 'To slow the rocket down' },
          { et: 'Need lähevad katki', en: 'They break' },
          { et: 'Et teha ruumi astronaudile', en: 'To make room for the astronaut' }
        ],
        why: { et: 'Kui paak on tühi, viskab rakett selle ära. Kergemat raketti on lihtsam kiirendada.', en: 'When a tank is empty, the rocket drops it. A lighter rocket is easier to speed up.' }
      },
      {
        q: { et: 'Mis on Marsi ja Jupiteri orbiidi vahel?', en: 'What is between the orbits of Mars and Jupiter?' },
        answers: [
          { et: 'Asteroidide vöö', en: 'The asteroid belt' },
          { et: 'Saturn', en: 'Saturn' },
          { et: 'Kuu', en: 'The Moon' },
          { et: 'Mitte midagi', en: 'Nothing at all' }
        ],
        why: { et: 'Marsi ja Jupiteri vahel tiirleb ümber Päikese väga palju kivimürakaid. Seda nimetatakse asteroidide vööks.', en: 'Between Mars and Jupiter, lots of big rocks go round the Sun. This is called the asteroid belt.' }
      },
      {
        q: { et: 'Mis juhtub taevaga, kui rakett tõuseb aina kõrgemale?', en: 'What happens to the sky as the rocket climbs higher and higher?' },
        answers: [
          { et: 'Sinine taevas muutub mustaks', en: 'The blue sky turns black' },
          { et: 'Taevas muutub heledamaks', en: 'The sky gets brighter' },
          { et: 'Taevas muutub punaseks', en: 'The sky turns red' },
          { et: 'Taevas jääb samasuguseks', en: 'The sky stays the same' }
        ],
        why: { et: 'Taeva teeb siniseks õhk. Kosmoses õhku ei ole ja taevas on must ka päeval.', en: 'The air makes the sky blue. In space there is no air, so the sky is black even in the daytime.' }
      },
      {
        q: { et: 'Päris astronaudid on Kuul käinud.', en: 'Real astronauts have been to the Moon.' },
        tf: true,
        why: { et: 'Astronaudid käisid Kuul juba üle 50 aasta tagasi, aastatel 1969–1972.', en: 'Astronauts went to the Moon over 50 years ago, between 1969 and 1972.' }
      },
      {
        q: { et: 'Milline on kõige suurem planeet?', en: 'Which is the biggest planet?' },
        answers: [
          { world: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } },
          { world: 'saturn', label: { et: 'Saturn', en: 'Saturn' } },
          { world: 'earth', label: { et: 'Maa', en: 'The Earth' } },
          { world: 'mars', label: { et: 'Marss', en: 'Mars' } }
        ],
        why: { et: 'Jupiter on kõige suurem planeet. Selle sisse mahuks üle tuhande Maa!', en: 'Jupiter is the biggest planet. Over a thousand Earths would fit inside it!' }
      },
      {
        q: { et: 'Millest on tehtud Saturni rõngad?', en: 'What are Saturn’s rings made of?' },
        pic: { world: 'saturn' },
        answers: [
          { et: 'Jäätükkidest ja kivikestest', en: 'Bits of ice and rock' },
          { et: 'Ühest suurest kõvast kettast', en: 'One big solid disc' },
          { et: 'Valgusest', en: 'Light' },
          { et: 'Pilvedest', en: 'Clouds' }
        ],
        why: { et: 'Rõngad koosnevad lugematutest jäätükkidest ja kivikestest, mis kõik tiirlevad ümber Saturni.', en: 'The rings are countless bits of ice and rock, all going round Saturn.' }
      }
    ]
  },
  {
    game: 'meteoor',
    questions: [
      {
        q: { et: 'Mis see on?', en: 'What is this?' },
        pic: { anim: 'plane' },
        answers: [
          { et: 'Lennuk', en: 'A plane' },
          { et: 'Satelliit', en: 'A satellite' },
          { et: 'Langev täht', en: 'A shooting star' },
          { et: 'Täht', en: 'A star' }
        ],
        why: { et: 'Lennuki tuled vilguvad punaselt ja roheliselt.', en: 'A plane’s lights blink red and green.' }
      },
      {
        q: { et: 'Mis see on?', en: 'What is this?' },
        pic: { anim: 'satellite' },
        answers: [
          { et: 'Satelliit', en: 'A satellite' },
          { et: 'Lennuk', en: 'A plane' },
          { et: 'Langev täht', en: 'A shooting star' },
          { et: 'Täht', en: 'A star' }
        ],
        why: { et: 'Satelliit liigub aeglaselt ja ühtlaselt üle taeva ega vilgu.', en: 'A satellite moves slowly and steadily across the sky and does not blink.' }
      },
      {
        q: { et: 'Mis see on?', en: 'What is this?' },
        pic: { anim: 'meteor' },
        answers: [
          { et: 'Langev täht', en: 'A shooting star' },
          { et: 'Lennuk', en: 'A plane' },
          { et: 'Satelliit', en: 'A satellite' },
          { et: 'Täht', en: 'A star' }
        ],
        why: { et: 'Langev täht sähvatab väga kiiresti üle taeva ja kustub.', en: 'A shooting star flashes across the sky very fast and goes out.' }
      },
      {
        q: { et: 'Mis on langev täht?', en: 'What is a shooting star?' },
        answers: [
          { et: 'Kivike, mis põleb õhus', en: 'A tiny stone burning up' },
          { et: 'Täht, mis kukub taevast alla', en: 'A star falling from the sky' },
          { et: 'Satelliit, mis kukub alla', en: 'A satellite falling down' },
          { et: 'Täht, mis plahvatab', en: 'A star exploding' }
        ],
        why: { et: 'Langev täht ei ole päris täht. See on pisike kivike, mis lendab väga kiiresti Maa õhku ja põleb seal.', en: 'A shooting star is not a real star. It is a tiny stone that flies into the Earth’s air very fast and burns up there.' }
      },
      {
        q: { et: 'Langev täht on päris täht, mis kukub taevast alla.', en: 'A shooting star is a real star falling from the sky.' },
        tf: false,
        why: { et: 'Päris tähed on hiiglaslikud päikesed, mis on väga kaugel. Langev täht on liivatera suurune kivike.', en: 'Real stars are huge suns, very far away. A shooting star is a stone as small as a grain of sand.' }
      },
      {
        q: { et: 'Kui kiiresti lendab langev täht?', en: 'How fast does a shooting star fly?' },
        answers: [
          { et: '60 km sekundis', en: '60 km every second' },
          { et: 'Nagu auto', en: 'As fast as a car' },
          { et: 'Nagu lennuk', en: 'As fast as a plane' },
          { et: 'Nagu jalgratas', en: 'As fast as a bike' }
        ],
        why: { et: 'Langev täht lendab 60 km sekundis. Tartust Tallinna jõuaks ta 3 sekundiga!', en: 'A shooting star flies 60 km every second. That is over 2000 times faster than a car!' }
      },
      {
        q: { et: 'Augustis on perseiidide meteoorivool. Millal näeb öösel kõige rohkem langevaid tähti?', en: 'In August there is the Perseid meteor shower. When in the night do you see the most shooting stars?' },
        answers: [
          { et: 'Pärast südaööd', en: 'After midnight' },
          { et: 'Kohe kui läheb pimedaks', en: 'As soon as it gets dark' },
          { et: 'Keskpäeval', en: 'At midday' },
          { et: 'Kogu öö ühepalju', en: 'The same all night' }
        ],
        why: { et: 'Langevad tähed lendavad justkui Perseuse tähtkuju poolt. Pärast südaööd on Perseus kõrgemal ja neid näeb rohkem.', en: 'The shooting stars seem to fly from the constellation Perseus. After midnight Perseus is higher, so you see more of them.' }
      },
      {
        q: { et: 'Millal on perseiidide meteoorivool?', en: 'When is the Perseid meteor shower?' },
        answers: [
          { et: 'Augusti keskel', en: 'In the middle of August' },
          { et: 'Jaanipäeval', en: 'At midsummer' },
          { et: 'Aastavahetusel', en: 'At New Year' },
          { et: 'Märtsis', en: 'In March' }
        ],
        why: { et: 'Kõige tihedam on perseiidide meteoorivool umbes 12. augustil. Siis on ka ööd juba pimedad.', en: 'The Perseids are at their best around 12 August, when the nights are dark again.' }
      },
      {
        q: { et: 'Mis on boliid?', en: 'What is a fireball?' },
        answers: [
          { et: 'Väga hele langev täht', en: 'A very bright shooting star' },
          { et: 'Täht, mis plahvatab', en: 'A star exploding' },
          { et: 'Tuli maa peal', en: 'A fire on the ground' },
          { et: 'Lennuki tuli', en: 'A plane’s light' }
        ],
        why: { et: 'Boliid on väga hele langev täht. Teda tekitab tavalisest suurem kivike.', en: 'A fireball is a very bright shooting star. It comes from a bigger stone than usual.' }
      },
      {
        q: { et: 'Miks liiguvad tähed öö jooksul üle taeva?', en: 'Why do the stars move across the sky during the night?' },
        answers: [
          { et: 'Maa pöörleb', en: 'The Earth turns' },
          { et: 'Tähed lendavad kosmoses ringi', en: 'The stars fly round in space' },
          { et: 'Tuul kannab neid', en: 'The wind carries them' },
          { et: 'Maa tiirleb ümber Päikese', en: 'The Earth goes round the Sun' }
        ],
        why: { et: 'Tegelikult ei pöörle taevas, vaid Maa – nagu karussell. Seepärast tõusevad tähed idas ja loojuvad läänes.', en: 'The sky does not really turn, the Earth does, like a merry-go-round. That is why stars rise in the east and set in the west.' }
      }
    ]
  },
  {
    game: 'tahtkujud',
    questions: [
      {
        q: { et: 'Milline neist on Kassiopeia?', en: 'Which of these is Cassiopeia?' },
        answers: [{ con: 'cassiopeia' }, { con: 'orion' }, { con: 'bigdipper' }, { con: 'leo' }],
        why: { et: 'Kassiopeia viis heledat tähte moodustavad suure W- või M-tähe.', en: 'Cassiopeia’s five bright stars make a big letter W or M.' }
      },
      {
        q: { et: 'Milline neist on Suur Vanker?', en: 'Which of these is the Big Dipper?' },
        answers: [{ con: 'bigdipper' }, { con: 'cassiopeia' }, { con: 'cygnus' }, { con: 'pegasus' }],
        why: { et: 'Suure Vankri seitse tähte on nagu pika aisaga vanker.', en: 'The seven stars of the Big Dipper look like a ladle with a long handle.' }
      },
      {
        q: { et: 'Milline neist on Orion?', en: 'Which of these is Orion?' },
        answers: [{ con: 'orion' }, { con: 'leo' }, { con: 'cygnus' }, { con: 'bigdipper' }],
        why: { et: 'Orioni tunned ära kolmest tähest tema vöös, keskel nelja heleda tähe vahel.', en: 'You can tell Orion by the three stars of his belt, in the middle of four bright stars.' }
      },
      {
        q: { et: 'Mis tähtkuju see on?', en: 'Which constellation is this?' },
        pic: { con: 'cygnus' },
        answers: [
          { et: 'Luik', en: 'Cygnus, the Swan' },
          { et: 'Lõvi', en: 'Leo, the Lion' },
          { et: 'Kassiopeia', en: 'Cassiopeia' },
          { et: 'Suur Vanker', en: 'The Big Dipper' }
        ],
        why: { et: 'Luik on nagu suur rist: pikk kael, saba ja laiali sirutatud tiivad. Ta lendab suvel mööda Linnuteed.', en: 'The Swan is like a big cross: a long neck, a tail and wings spread wide. It flies along the Milky Way in summer.' }
      },
      {
        q: { et: 'Mis on Põhjanaelas erilist?', en: 'What is special about the North Star?' },
        answers: [
          { et: 'Ta peaaegu ei liigu', en: 'It hardly moves' },
          { et: 'Ta on kõige heledam', en: 'It is the brightest' },
          { et: 'Ta on kõige lähem täht', en: 'It is the nearest star' },
          { et: 'Ta on alati otse pea kohal', en: 'It is always straight overhead' }
        ],
        why: { et: 'Kõik tähed liiguvad ringiratast ümber Põhjanaela, aga tema ise jääb paigale. Kui vaatad Põhjanaela poole, tead, kus on põhi.', en: 'All the stars go round the North Star, but it stays still. When you face the North Star, you know where north is.' }
      },
      {
        q: { et: 'Põhjanael on taeva kõige heledam täht.', en: 'The North Star is the brightest star in the sky.' },
        tf: false,
        why: { et: 'Põhjanael ei ole eriti hele. Ta on eriline sellepärast, et on alati põhjas.', en: 'The North Star is not especially bright. It is special because it is always in the north.' }
      },
      {
        q: { et: 'Kuidas leida Põhjanaela?', en: 'How do you find the North Star?' },
        pic: { con: 'bigdipper' },
        answers: [
          { et: 'Suure Vankri abil', en: 'With the Big Dipper' },
          { et: 'Otsi kõige heledam täht', en: 'Find the brightest star' },
          { et: 'Vaata otse üles', en: 'Look straight up' },
          { et: 'Vaata itta, kus tähed tõusevad', en: 'Look east, where the stars rise' }
        ],
        why: { et: 'Kui jätkad joont läbi Suure Vankri kahe tagumise ratta, jõuad Põhjanaelani.', en: 'If you carry on the line through the two end stars of the Big Dipper’s bowl, you come to the North Star.' }
      },
      {
        q: { et: 'Millist tähtkuju näeb Eestis igal selgel ööl?', en: 'Which constellation can you see in Estonia on every clear night?' },
        answers: [
          { et: 'Suur Vanker', en: 'The Big Dipper' },
          { et: 'Orion', en: 'Orion' },
          { et: 'Luik', en: 'Cygnus, the Swan' },
          { et: 'Lõvi', en: 'Leo, the Lion' }
        ],
        why: { et: 'Suur Vanker on Põhjanaela lähedal ja ei looju Eestis kunagi. Teised tähtkujud on taevas ainult osa aastast.', en: 'The Big Dipper is near the North Star and never sets in Estonia. Other constellations are up only part of the year.' }
      },
      {
        q: { et: 'Millist tähtkuju näeb hästi talveõhtul?', en: 'Which constellation can you see well on a winter evening?' },
        answers: [
          { et: 'Orion', en: 'Orion' },
          { et: 'Luik', en: 'Cygnus, the Swan' },
          { et: 'Lõvi', en: 'Leo, the Lion' },
          { et: 'Kotkas', en: 'Aquila, the Eagle' }
        ],
        why: { et: 'Orion on talvine tähtkuju. Luik ja Kotkas on suvel taevas ning Lõvi kevadel.', en: 'Orion is a winter constellation. The Swan and the Eagle are up in summer, and Leo in spring.' }
      },
      {
        q: { et: 'Millised tähed moodustavad Suvekolmnurga?', en: 'Which stars make the Summer Triangle?' },
        answers: [
          { et: 'Veega, Deeneb ja Altair', en: 'Vega, Deneb and Altair' },
          { et: 'Siirius, Kapella ja Rigel', en: 'Sirius, Capella and Rigel' },
          { et: 'Orioni vöö kolm tähte', en: 'The three stars of Orion’s belt' },
          { et: 'Päike, Kuu ja Maa', en: 'The Sun, the Moon and the Earth' }
        ],
        why: { et: 'Veega Lüürast, Deeneb Luigest ja Altair Kotkast moodustavad suveöödel suure kolmnurga.', en: 'Vega in Lyra, Deneb in the Swan and Altair in the Eagle make a big triangle on summer nights.' }
      },
      {
        q: { et: 'Mis on Sõel?', en: 'What are the Pleiades?' },
        answers: [
          { et: 'Täheparv', en: 'A star cluster' },
          { et: 'Üks väga hele täht', en: 'One very bright star' },
          { et: 'Planeet', en: 'A planet' },
          { et: 'Galaktika', en: 'A galaxy' }
        ],
        why: { et: 'Sõel ehk Plejaadid on hulk noori kuumi tähti Sõnni tähtkujus.', en: 'The Pleiades are a group of young hot stars in Taurus.' }
      },
      {
        q: { et: 'Kus on Orioni udu?', en: 'Where is the Orion Nebula?' },
        pic: { con: 'orion' },
        answers: [
          { et: 'Orioni vöö all', en: 'Below Orion’s belt' },
          { et: 'Orioni vöö peal', en: 'On Orion’s belt' },
          { et: 'Põhjanaela kõrval', en: 'Next to the North Star' },
          { et: 'Kuu peal', en: 'On the Moon' }
        ],
        why: { et: 'Orioni vöö all on Orioni udu – gaasipilv, kus sünnivad uued tähed.', en: 'Below Orion’s belt is the Orion Nebula, a cloud of gas where new stars are born.' }
      },
      {
        q: { et: 'Milline neist on Skorpion?', en: 'Which of these is the Scorpion?' },
        answers: [{ con: 'scorpius' }, { con: 'cygnus' }, { con: 'leo' }, { con: 'pegasus' }],
        why: { et: 'Skorpionil on ees sõrad ja taga pikk kaardus saba. Tema südames on punane täht Antaares.', en: 'The Scorpion has claws in front and a long curved tail behind. In its heart is the red star Antares.' }
      },
      {
        q: { et: 'Milline neist on Lõunarist?', en: 'Which of these is the Southern Cross?' },
        answers: [{ con: 'crux' }, { con: 'cassiopeia' }, { con: 'cepheus' }, { con: 'bigdipper' }],
        why: { et: 'Lõunaristi neli heledat tähte moodustavad väikese risti. See on kõige väiksem tähtkuju.', en: 'The four bright stars of the Southern Cross make a small cross. It is the smallest constellation.' }
      },
      {
        q: { et: 'Mis tähtkuju see on?', en: 'Which constellation is this?' },
        pic: { con: 'cepheus' },
        answers: [
          { et: 'Kefeus', en: 'Cepheus' },
          { et: 'Kassiopeia', en: 'Cassiopeia' },
          { et: 'Skorpion', en: 'Scorpius, the Scorpion' },
          { et: 'Orion', en: 'Orion' }
        ],
        why: { et: 'Kefeuse tähed näevad välja nagu lapse joonistatud maja. Vanas loos oli Kefeus kuningas ja Kassiopeia mees.', en: 'The stars of Cepheus look like a house drawn by a child. In the old story, Cepheus was a king and Cassiopeia’s husband.' }
      },
      {
        q: { et: 'Mis on öötaeva kõige heledam täht?', en: 'What is the brightest star in the night sky?' },
        answers: [
          { et: 'Siirius', en: 'Sirius' },
          { et: 'Põhjanael', en: 'The North Star' },
          { et: 'Kapella', en: 'Capella' },
          { et: 'Antaares', en: 'Antares' }
        ],
        why: { et: 'Siirius on Suure Peni tähtkujus. Eestis paistab ta talvel madalal lõunas, Orioni vöö kolme tähe joone jätkul.', en: 'Sirius is in the Great Dog. In Estonia it shines low in the south in winter, on from the line of Orion’s three belt stars.' }
      },
      {
        q: { et: 'Lõunaristi näeb ka Eestist.', en: 'You can see the Southern Cross from Estonia.' },
        tf: false,
        why: { et: 'Lõunarist on lõunataevas ja Eestist teda ei näe. Lõunapoolkeral leitakse tema abil lõunasuund.', en: 'The Southern Cross is in the southern sky, so you cannot see it from Estonia. In the southern half of the Earth, people use it to find south.' }
      },
      {
        q: { et: 'Mis on Kapella?', en: 'What is Capella?' },
        answers: [
          { et: 'Kits, keda Veomees süles hoiab', en: 'The goat the Charioteer carries' },
          { et: 'Orioni koer', en: 'Orion’s dog' },
          { et: 'Lohe pea', en: 'The Dragon’s head' },
          { et: 'Skorpioni süda', en: 'The Scorpion’s heart' }
        ],
        why: { et: 'Kapella on Veomehe tähtkujus üks taeva heledamaid tähti. Talveõhtuti on ta peaaegu otse pea kohal.', en: 'Capella, in the Charioteer, is one of the brightest stars in the sky. On winter evenings it is almost straight overhead.' }
      }
    ]
  },
  {
    game: 'pildid',
    questions: [
      {
        q: { et: 'Mis on pildil?', en: 'What is in the picture?' },
        pic: { photo: 'saturn' },
        answers: [
          { et: 'Saturn', en: 'Saturn' },
          { et: 'Jupiter', en: 'Jupiter' },
          { et: 'Kuu', en: 'The Moon' },
          { et: 'Sõel', en: 'The Pleiades' }
        ],
        why: { et: 'Saturni tunned ära ilusate rõngaste järgi.', en: 'You can tell Saturn by its beautiful rings.' }
      },
      {
        q: { et: 'Mis on pildil?', en: 'What is in the picture?' },
        pic: { photo: 'jupiter' },
        answers: [
          { et: 'Jupiter', en: 'Jupiter' },
          { et: 'Saturn', en: 'Saturn' },
          { et: 'Kuu', en: 'The Moon' },
          { et: 'Päike', en: 'The Sun' }
        ],
        why: { et: 'Jupiteril on triibulised pilved ja punane laik, mis on hiiglaslik torm.', en: 'Jupiter has striped clouds and a red spot, which is a giant storm.' }
      },
      {
        q: { et: 'Mis on pildil?', en: 'What is in the picture?' },
        pic: { photo: 'andromeda' },
        answers: [
          { et: 'Galaktika', en: 'A galaxy' },
          { et: 'Udukogu', en: 'A nebula' },
          { et: 'Täheparv', en: 'A star cluster' },
          { et: 'Planeet', en: 'A planet' }
        ],
        why: { et: 'See on Andromeeda galaktika, meie Linnutee naaber. Selles on sadu miljardeid tähti!', en: 'This is the Andromeda Galaxy, the Milky Way’s neighbour. It has hundreds of billions of stars!' }
      },
      {
        q: { et: 'Mis on pildil?', en: 'What is in the picture?' },
        pic: { photo: 'orion' },
        answers: [
          { et: 'Udukogu', en: 'A nebula' },
          { et: 'Galaktika', en: 'A galaxy' },
          { et: 'Planeet', en: 'A planet' },
          { et: 'Täheparv', en: 'A star cluster' }
        ],
        why: { et: 'See on Orioni udu, suur gaasipilv, kus sünnivad uued tähed.', en: 'This is the Orion Nebula, a big cloud of gas where new stars are born.' }
      },
      {
        q: { et: 'Mis on pildil?', en: 'What is in the picture?' },
        pic: { photo: 'pleiades' },
        answers: [
          { et: 'Täheparv', en: 'A star cluster' },
          { et: 'Galaktika', en: 'A galaxy' },
          { et: 'Planeet', en: 'A planet' },
          { et: 'Langevad tähed', en: 'Shooting stars' }
        ],
        why: { et: 'See on Sõel ehk Plejaadid, hulk noori kuumi sinakaid tähti.', en: 'These are the Pleiades, a group of young hot bluish stars.' }
      },
      {
        q: { et: 'Mis on pildil?', en: 'What is in the picture?' },
        pic: { photo: 'eclipse' },
        answers: [
          { et: 'Päikesevarjutus', en: 'A solar eclipse' },
          { et: 'Kuuvarjutus', en: 'A lunar eclipse' },
          { et: 'Kuusirp', en: 'A crescent moon' },
          { et: 'Päikeseloojang', en: 'A sunset' }
        ],
        why: { et: 'Kuu liikus Päikese ette ja kattis osa sellest. Ära kunagi vaata Päikest ilma spetsiaalsete prillideta!', en: 'The Moon moved in front of the Sun and covered part of it. Never look at the Sun without special glasses!' }
      },
      {
        q: { et: 'Milline neist on galaktika?', en: 'Which of these is a galaxy?' },
        answers: [{ photo: 'whirlpool' }, { photo: 'rosette' }, { photo: 'pleiades' }, { photo: 'saturn' }],
        why: { et: 'Keerise galaktika spiraalharud keerlevad nagu vesi vannis.', en: 'The Whirlpool Galaxy’s spiral arms swirl like water in a bath.' }
      },
      {
        q: { et: 'Milline neist on udukogu?', en: 'Which of these is a nebula?' },
        answers: [{ photo: 'horsehead' }, { photo: 'andromeda' }, { photo: 'jupiter' }, { photo: 'moon' }],
        why: { et: 'Hobusepea udu on tume tolmupilv, mis näeb välja nagu hobuse pea.', en: 'The Horsehead Nebula is a dark cloud of dust that looks like a horse’s head.' }
      },
      {
        q: { et: 'Mis on Orioni udu?', en: 'What is the Orion Nebula?' },
        answers: [
          { et: 'Pilv, kus sünnivad tähed', en: 'A cloud where stars are born' },
          { et: 'Pilv Maa õhus', en: 'A cloud in the Earth’s air' },
          { et: 'Planeet', en: 'A planet' },
          { et: 'Suitsupilv', en: 'A cloud of smoke' }
        ],
        why: { et: 'Orioni udu on suur gaasipilv, kus sünnivad uued tähed. Talvel võid seda näha isegi binokliga.', en: 'The Orion Nebula is a big cloud of gas where new stars are born. In winter you can see it even with binoculars.' }
      },
      {
        q: { et: 'Mis on Jupiteri punane laik?', en: 'What is Jupiter’s red spot?' },
        pic: { photo: 'jupiter' },
        answers: [
          { et: 'Hiiglaslik torm', en: 'A giant storm' },
          { et: 'Vulkaan', en: 'A volcano' },
          { et: 'Meri', en: 'A sea' },
          { et: 'Jupiteri kuu', en: 'One of Jupiter’s moons' }
        ],
        why: { et: 'Punane laik on hiiglaslik torm, mis on suurem kui meie Maa!', en: 'The red spot is a giant storm, bigger than our Earth!' }
      },
      {
        q: { et: 'Mis on Andromeeda galaktika?', en: 'What is the Andromeda Galaxy?' },
        pic: { photo: 'andromeda' },
        answers: [
          { et: 'Sadu miljardeid tähti', en: 'Billions of stars' },
          { et: 'Üks suur täht', en: 'One big star' },
          { et: 'Gaasipilv', en: 'A cloud of gas' },
          { et: 'Planeet', en: 'A planet' }
        ],
        why: { et: 'Andromeeda galaktika on meie Linnutee naaber. Selles on sadu miljardeid tähti!', en: 'The Andromeda Galaxy is the Milky Way’s neighbour. It has hundreds of billions of stars!' }
      },
      {
        q: { et: 'Sõela tähti näeb ka ilma pikksilmata.', en: 'You can see the stars of the Pleiades without a telescope.' },
        tf: true,
        why: { et: 'Selgel talveõhtul näed Sõela tähti palja silmaga. Pikksilmaga paistab neid veel rohkem.', en: 'On a clear winter evening you can see the Pleiades with your own eyes. A telescope shows even more of them.' }
      },
      {
        q: { et: 'Mis on pildil?', en: 'What is in the picture?' },
        pic: { photo: 'tsuchinshan' },
        answers: [
          { et: 'Komeet', en: 'A comet' },
          { et: 'Langev täht', en: 'A shooting star' },
          { et: 'Galaktika', en: 'A galaxy' },
          { et: 'Lennuk', en: 'A plane' }
        ],
        why: { et: 'See on komeet Tsuchinshan-ATLAS. Komeet on suur jäine kivi, millel tekib Päikese lähedal pikk helendav saba.', en: 'This is Comet Tsuchinshan–ATLAS. A comet is a big lump of ice and rock that grows a long glowing tail near the Sun.' }
      },
      {
        q: { et: 'Milline neist on komeet?', en: 'Which of these is a comet?' },
        answers: [{ photo: 'ponsbrooks' }, { photo: 'pinwheel' }, { photo: 'heart' }, { photo: 'pleiades' }],
        why: { et: 'Komeet Pons-Brooks tuleb Päikese juurde tagasi umbes iga 71 aasta järel.', en: 'Comet Pons–Brooks comes back to the Sun about every 71 years.' }
      },
      {
        q: { et: 'Milline neist on galaktika?', en: 'Which of these is a galaxy?' },
        answers: [{ photo: 'triangulum' }, { photo: 'bubble' }, { photo: 'crab' }, { photo: 'tsuchinshan' }],
        why: { et: 'Kolmnurga galaktika on Andromeeda galaktika väike naaber. Väga pimedas kohas võib seda näha isegi palja silmaga.', en: 'The Triangulum Galaxy is a small neighbour of the Andromeda Galaxy. In a very dark place you can even see it without a telescope.' }
      },
      {
        q: { et: 'Mis kujuga on see udu?', en: 'What shape is this nebula?' },
        pic: { photo: 'heart' },
        answers: [
          { et: 'Süda', en: 'A heart' },
          { et: 'Küsimärk', en: 'A question mark' },
          { et: 'Hobuse pea', en: 'A horse’s head' },
          { et: 'Elevandi lont', en: 'An elephant’s trunk' }
        ],
        why: { et: 'Südame udu on südame kujuline punane gaasipilv. Selle keskel on noored tähed, mis panevad gaasi helendama.', en: 'The Heart Nebula is a red cloud of gas shaped like a heart. Young stars in its middle make the gas glow.' }
      },
      {
        q: { et: 'Mitu galaktikat on pildil?', en: 'How many galaxies are in the picture?' },
        pic: { photo: 'triplet' },
        answers: [
          { et: 'Kolm', en: 'Three' },
          { et: 'Üks', en: 'One' },
          { et: 'Kaks', en: 'Two' },
          { et: 'Sada', en: 'A hundred' }
        ],
        why: { et: 'See on Lõvi kolmik: kolm galaktikat, mis on Lõvi tähtkujus üksteise naabrid.', en: 'This is the Leo Triplet: three galaxies that are neighbours in the constellation Leo.' }
      },
      {
        q: { et: 'Mis on Krabi udu?', en: 'What is the Crab Nebula?' },
        pic: { photo: 'crab' },
        answers: [
          { et: 'Plahvatanud tähe jäänus', en: 'What is left of an exploded star' },
          { et: 'Krabi kujuline planeet', en: 'A planet shaped like a crab' },
          { et: 'Pilv Maa õhus', en: 'A cloud in the Earth’s air' },
          { et: 'Galaktika', en: 'A galaxy' }
        ],
        why: { et: 'Inimesed nägid seda plahvatust aastal 1054. See oli nii ere, et paistis isegi päeval!', en: 'People saw the explosion in the year 1054. It was so bright that it could be seen even in the daytime!' }
      },
      {
        q: { et: 'Kunagi heidab ka meie Päike oma välimised kihid minema, nagu see täht tegi.', en: 'One day our Sun too will throw off its outer layers, as this star did.' },
        pic: { photo: 'dumbbell' },
        tf: true,
        why: { et: 'Hantli udu tekkis, kui üks Päikese-sarnane täht oma välimised kihid minema heitis. Päikesega juhtub see alles miljardite aastate pärast.', en: 'The Dumbbell Nebula formed when a star like the Sun threw off its outer layers. This will happen to the Sun only billions of years from now.' }
      }
    ]
  }
];
