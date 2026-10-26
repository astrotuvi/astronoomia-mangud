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
//   { planet: 'uranus' }  any of the eight planets, or Ceres, drawn as in
//                         Planeetide rivi
//   { moon: 90 }          the Moon seen from the Earth, by its angle from new
//                         moon (0 new, 90 first quarter, 180 full, 270 last quarter)
//   { space: 90 }         the Sun, the Earth and the Moon from above the North
//                         Pole, the Moon at that angle, as in Kuu faasid
//   { con: 'orion' }      the stars of a constellation without lines
//   { anim: 'plane' }     a short animation of a plane, a satellite or a shooting star
//   { trails: 'a' }       shooting-star trails on a photo, as in Uuri meteoore,
//                         and with ring: k a yellow ring at the k-th of its
//                         rings (0 at the radiant); see TRAILS in app.js
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
        q: { et: 'Kass hüppab Maal 10 cm kõrgusele. Kui kõrgele hüppab ta Ceresel?', en: 'A cat jumps 10 cm high on the Earth. How high does it jump on Ceres?' },
        answers: [
          { et: '3,5 meetrit', en: '3.5 metres' },
          { et: '60 cm', en: '60 cm' },
          { et: '10 cm', en: '10 cm' },
          { et: 'Ta lendab kosmosesse', en: 'It flies off into space' }
        ],
        why: { et: 'Ceres tõmbab 35 korda nõrgemalt kui Maa, nii et hüpe on 35 korda kõrgem: 35 × 10 cm = 350 cm. Ceres tõmbab kassi siiski tagasi.', en: 'Ceres pulls 35 times more weakly than the Earth, so the jump is 35 times higher: 35 × 10 cm = 350 cm. Ceres still pulls the cat back down.' }
      },
      {
        q: { et: 'Kus hüppad kõrgemale: Ceresel või Kuul?', en: 'Where do you jump higher: on Ceres or on the Moon?' },
        answers: [
          { planet: 'ceres', label: { et: 'Ceres', en: 'Ceres' } },
          { world: 'moon', label: { et: 'Kuu', en: 'The Moon' } }
        ],
        why: { et: 'Ceres on Kuust palju väiksem ja tõmbab peaaegu kuus korda nõrgemalt. Seal hüppad 35 korda kõrgemale kui Maal.', en: 'Ceres is much smaller than the Moon and pulls almost six times more weakly. There you jump 35 times higher than on the Earth.' }
      },
      {
        q: { et: 'Mis on Ceres?', en: 'What is Ceres?' },
        pic: { planet: 'ceres' },
        answers: [
          { et: 'Kääbusplaneet asteroidide vöös', en: 'A dwarf planet in the asteroid belt' },
          { et: 'Jupiteri kuu', en: 'A moon of Jupiter' },
          { et: 'Komeet', en: 'A comet' },
          { et: 'Täht', en: 'A star' }
        ],
        why: { et: 'Ceres tiirleb ümber Päikese Marsi ja Jupiteri vahel, asteroidide seas. See on nii suur ja ümar, et seda peetakse kääbusplaneediks.', en: 'Ceres goes round the Sun between Mars and Jupiter, among the asteroids. It is so big and round that it is counted as a dwarf planet.' }
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
    game: 'planeedid',
    questions: [
      {
        q: { et: 'Milline planeet on Päikesele kõige lähem?', en: 'Which planet is closest to the Sun?' },
        answers: [
          { planet: 'mercury', label: { et: 'Merkuur', en: 'Mercury' } },
          { planet: 'venus', label: { et: 'Veenus', en: 'Venus' } },
          { planet: 'earth', label: { et: 'Maa', en: 'The Earth' } },
          { planet: 'mars', label: { et: 'Marss', en: 'Mars' } }
        ],
        why: { et: 'Merkuur on Päikesele kõige lähem. Ta teeb ümber Päikese tiiru vaid 88 päevaga.', en: 'Mercury is the closest. It goes round the Sun in only 88 days.' }
      },
      {
        q: { et: 'Milline planeet on Päikesest kõige kaugemal?', en: 'Which planet is farthest from the Sun?' },
        answers: [
          { planet: 'neptune', label: { et: 'Neptuun', en: 'Neptune' } },
          { planet: 'uranus', label: { et: 'Uraan', en: 'Uranus' } },
          { planet: 'saturn', label: { et: 'Saturn', en: 'Saturn' } },
          { planet: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } }
        ],
        why: { et: 'Neptuun on Päikesest kõige kaugem planeet. Seal puhuvad kõige tugevamad tuuled.', en: 'Neptune is the planet farthest from the Sun. It has the strongest winds.' }
      },
      {
        q: { et: 'Pane kivised planeedid järjekorda, Päikesest kaugemale.', en: 'Put the rocky planets in order, from the Sun outwards.' },
        order: [
          { planet: 'mercury', label: { et: 'Merkuur', en: 'Mercury' } },
          { planet: 'venus', label: { et: 'Veenus', en: 'Venus' } },
          { planet: 'earth', label: { et: 'Maa', en: 'The Earth' } },
          { planet: 'mars', label: { et: 'Marss', en: 'Mars' } }
        ],
        why: { et: 'Merkuur, Veenus, Maa ja Marss on Päikesele kõige lähemad planeedid. Kõik nad on kivised.', en: 'Mercury, Venus, the Earth and Mars are the planets closest to the Sun. They are all rocky.' }
      },
      {
        q: { et: 'Pane hiidplaneedid järjekorda, Päikesest kaugemale.', en: 'Put the giant planets in order, from the Sun outwards.' },
        order: [
          { planet: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } },
          { planet: 'saturn', label: { et: 'Saturn', en: 'Saturn' } },
          { planet: 'uranus', label: { et: 'Uraan', en: 'Uranus' } },
          { planet: 'neptune', label: { et: 'Neptuun', en: 'Neptune' } }
        ],
        why: { et: 'Marsi taga tulevad hiidplaneedid: Jupiter, Saturn, Uraan ja viimasena Neptuun.', en: 'Beyond Mars come the giant planets: Jupiter, Saturn, Uranus and last Neptune.' }
      },
      {
        q: { et: 'Pane planeedid järjekorda, väiksemast suuremaks.', en: 'Put the planets in order, from the smallest to the biggest.' },
        order: [
          { planet: 'mercury', label: { et: 'Merkuur', en: 'Mercury' } },
          { planet: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { planet: 'earth', label: { et: 'Maa', en: 'The Earth' } },
          { planet: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } }
        ],
        why: { et: 'Merkuur on kõige väiksem planeet. Marsi läbimõõt on umbes pool Maa omast ja Jupiteri oma üksteist korda suurem kui Maal.', en: 'Mercury is the smallest planet. Mars is about half as wide as the Earth, and Jupiter eleven times as wide.' }
      },
      {
        q: { et: 'Milline planeet on kõige suurem?', en: 'Which planet is the biggest?' },
        answers: [
          { planet: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } },
          { planet: 'saturn', label: { et: 'Saturn', en: 'Saturn' } },
          { planet: 'uranus', label: { et: 'Uraan', en: 'Uranus' } },
          { planet: 'earth', label: { et: 'Maa', en: 'The Earth' } }
        ],
        why: { et: 'Jupiter on kõige suurem planeet. Tema läbimõõt on üksteist korda suurem kui Maal.', en: 'Jupiter is the biggest planet, eleven times as wide as the Earth.' }
      },
      {
        q: { et: 'Milline planeet on kõige väiksem?', en: 'Which planet is the smallest?' },
        answers: [
          { planet: 'mercury', label: { et: 'Merkuur', en: 'Mercury' } },
          { planet: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { planet: 'venus', label: { et: 'Veenus', en: 'Venus' } },
          { planet: 'neptune', label: { et: 'Neptuun', en: 'Neptune' } }
        ],
        why: { et: 'Merkuur on kõige väiksem planeet. Maa läbimõõt on temast peaaegu kolm korda suurem.', en: 'Mercury is the smallest planet. The Earth is almost three times as wide.' }
      },
      {
        q: { et: 'Kumb on suurem, Uraan või Neptuun?', en: 'Which is bigger, Uranus or Neptune?' },
        answers: [
          { planet: 'uranus', label: { et: 'Uraan', en: 'Uranus' } },
          { planet: 'neptune', label: { et: 'Neptuun', en: 'Neptune' } }
        ],
        why: { et: 'Nad on peaaegu sama suured, aga Uraan on natuke suurem. Mõlema läbimõõt on umbes neli korda suurem kui Maal.', en: 'They are almost the same size, but Uranus is a little bigger. Both are about four times as wide as the Earth.' }
      },
      {
        q: { et: 'Milline planeet on peaaegu sama suur kui Maa?', en: 'Which planet is almost as big as the Earth?' },
        answers: [
          { planet: 'venus', label: { et: 'Veenus', en: 'Venus' } },
          { planet: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { planet: 'mercury', label: { et: 'Merkuur', en: 'Mercury' } },
          { planet: 'saturn', label: { et: 'Saturn', en: 'Saturn' } }
        ],
        why: { et: 'Veenus on peaaegu sama suur kui Maa, aga seal on nii kuum, et plii sulaks.', en: 'Venus is almost as big as the Earth, but it is so hot there that lead would melt.' }
      },
      {
        q: { et: 'Milline planeet on kõige kuumem?', en: 'Which planet is the hottest?' },
        answers: [
          { planet: 'venus', label: { et: 'Veenus', en: 'Venus' } },
          { planet: 'mercury', label: { et: 'Merkuur', en: 'Mercury' } },
          { planet: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { planet: 'jupiter', label: { et: 'Jupiter', en: 'Jupiter' } }
        ],
        why: { et: 'Merkuur on Päikesele lähemal, aga Veenuse paks pilvine õhk hoiab soojust kinni nagu tekk.', en: 'Mercury is closer to the Sun, but Venus’s thick cloudy air holds the heat in like a blanket.' }
      },
      {
        q: { et: 'Milline planeet on külili ja veereb nagu pall ümber Päikese?', en: 'Which planet lies on its side and rolls round the Sun like a ball?' },
        answers: [
          { planet: 'uranus', label: { et: 'Uraan', en: 'Uranus' } },
          { planet: 'saturn', label: { et: 'Saturn', en: 'Saturn' } },
          { planet: 'neptune', label: { et: 'Neptuun', en: 'Neptune' } },
          { planet: 'venus', label: { et: 'Veenus', en: 'Venus' } }
        ],
        why: { et: 'Uraan on külili. Võib-olla põrkas temaga ammu kokku mõni suur taevakeha ja lükkas ta ümber.', en: 'Uranus lies on its side. Perhaps something big crashed into it long ago and knocked it over.' }
      },
      {
        q: { et: 'Millisel planeedil on kõige kõrgem mägi?', en: 'Which planet has the tallest mountain?' },
        answers: [
          { planet: 'mars', label: { et: 'Marss', en: 'Mars' } },
          { planet: 'earth', label: { et: 'Maa', en: 'The Earth' } },
          { planet: 'venus', label: { et: 'Veenus', en: 'Venus' } },
          { planet: 'mercury', label: { et: 'Merkuur', en: 'Mercury' } }
        ],
        why: { et: 'Marsil on Olümpose mägi, mis on kaks ja pool korda kõrgem kui Maa kõrgeim mägi Everest.', en: 'Mars has Olympus Mons, two and a half times as tall as the Earth’s highest mountain, Everest.' }
      },
      {
        q: { et: 'Millest on tehtud Saturni rõngad?', en: 'What are Saturn’s rings made of?' },
        pic: { planet: 'saturn' },
        answers: [
          { et: 'Jää- ja kivitükkidest', en: 'Bits of ice and rock' },
          { et: 'Ühest kõvast kettast', en: 'One hard disc' },
          { et: 'Pilvedest', en: 'Clouds' },
          { et: 'Valgusest', en: 'Light' }
        ],
        why: { et: 'Rõngastes on lugematu hulk jää- ja kivitükke. Mõni on liivatera suurune, mõni suur nagu maja.', en: 'The rings are countless bits of ice and rock. Some are as small as grains of sand, some as big as a house.' }
      },
      {
        q: { et: 'Mitu Maad mahuks Jupiteri sisse?', en: 'How many Earths would fit inside Jupiter?' },
        pic: { planet: 'jupiter' },
        answers: [
          { et: 'Üle tuhande', en: 'Over a thousand' },
          { et: 'Umbes kümme', en: 'About ten' },
          { et: 'Umbes sada', en: 'About a hundred' },
          { et: 'Kaks', en: 'Two' }
        ],
        why: { et: 'Jupiteri läbimõõt on üksteist korda suurem kui Maal, nii et tema sisse mahuks üle tuhande Maa.', en: 'Jupiter is eleven times as wide as the Earth, so over a thousand Earths would fit inside it.' }
      },
      {
        q: { et: 'Mitu planeeti tiirleb ümber Päikese?', en: 'How many planets go round the Sun?' },
        answers: [
          { et: 'Kaheksa', en: 'Eight' },
          { et: 'Üheksa', en: 'Nine' },
          { et: 'Kuus', en: 'Six' },
          { et: 'Kümme', en: 'Ten' }
        ],
        why: { et: 'Merkuur, Veenus, Maa, Marss, Jupiter, Saturn, Uraan ja Neptuun. Pluuto on kääbusplaneet.', en: 'Mercury, Venus, the Earth, Mars, Jupiter, Saturn, Uranus and Neptune. Pluto is a dwarf planet.' }
      },
      {
        q: { et: 'Marss on Maast suurem.', en: 'Mars is bigger than the Earth.' },
        pic: { planet: 'mars' },
        tf: false,
        why: { et: 'Marss on väiksem: tema läbimõõt on umbes pool Maa omast.', en: 'Mars is smaller: it is about half as wide as the Earth.' }
      },
      {
        q: { et: 'Merkuuri, Veenust, Marssi, Jupiteri ja Saturni võib taevas näha palja silmaga.', en: 'You can see Mercury, Venus, Mars, Jupiter and Saturn in the sky with your own eyes.' },
        tf: true,
        why: { et: 'Need planeedid paistavad heledate tähtedena. Uraani ja Neptuuni leidmiseks on vaja binoklit või pikksilma.', en: 'These planets look like bright stars. To find Uranus and Neptune, you need binoculars or a telescope.' }
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
    game: 'radiant',
    questions: [
      {
        q: { et: 'Langevad tähed jätsid fotole jäljed. Kus on radiant?', en: 'The shooting stars left trails on the photo. Where is the radiant?' },
        pic: { trails: 'a' },
        answers: [{ trails: 'a', ring: 0 }, { trails: 'a', ring: 1 }, { trails: 'a', ring: 2 }, { trails: 'a', ring: 3 }],
        why: { et: 'Kui pikendad iga jälge heledast peast tagasi, saavad kõik jooned kokku ühes kohas. See ongi radiant.', en: 'If you draw each trail back from its bright head, all the lines meet in one spot. That is the radiant.' }
      },
      {
        q: { et: 'Üks jälg ei kuulu meteoorivoolu. Kus on voolu radiant?', en: 'One trail does not belong to the shower. Where is the shower’s radiant?' },
        pic: { trails: 'b' },
        answers: [{ trails: 'b', ring: 0 }, { trails: 'b', ring: 1 }, { trails: 'b', ring: 2 }, { trails: 'b', ring: 3 }],
        why: { et: 'Kuus jälge saavad kokku samas kohas. Jälg all vasakul on juhuslik langev täht, mis ei kuulu ühtegi voolu.', en: 'Six trails meet in the same spot. The trail at the bottom left is a stray shooting star that belongs to no shower.' }
      },
      {
        q: { et: 'Mis on radiant?', en: 'What is the radiant?' },
        answers: [
          { et: 'Koht taevas, kust voolu langevad tähed paistavad tulevat', en: 'The spot in the sky the shower’s shooting stars seem to come from' },
          { et: 'Kõige heledam langev täht', en: 'The brightest shooting star' },
          { et: 'Täht, mille ümber langevad tähed tiirlevad', en: 'A star the shooting stars go round' },
          { et: 'Koht, kuhu langevad tähed maha kukuvad', en: 'The place where shooting stars land' }
        ],
        why: { et: 'Ühe meteoorivoolu langevad tähed paistavad kõik lendavat välja ühest kohast taevas. Seda kohta nimetatakse radiandiks.', en: 'The shooting stars of one meteor shower all seem to fly out of one spot in the sky. That spot is called the radiant.' }
      },
      {
        q: { et: 'Miks paistavad ühe voolu langevad tähed tulevat ühest kohast?', en: 'Why do the shooting stars of one shower seem to come from one spot?' },
        answers: [
          { et: 'Nad lendavad rööbiti, aga kaugel paistavad kokku saavat', en: 'They fly side by side, but seem to meet far away' },
          { et: 'Nad tulevad kõik ühest tähest', en: 'They all come from one star' },
          { et: 'Seal on taevas auk', en: 'There is a hole in the sky there' },
          { et: 'Üks täht tõmbab neid enda poole', en: 'A star pulls them towards it' }
        ],
        why: { et: 'Langevad tähed lendavad kõik ühes suunas, rööbiti. Ühest kohast tulevad nad ainult näiliselt, nagu pikad raudteerööpad, mis kaugel justkui kokku saavad.', en: 'Shooting stars all fly the same way, side by side. They only seem to come from one spot, as long railway lines seem to meet far away.' }
      },
      {
        q: { et: 'Meteoorivoolu radiant on Lõvi tähtkujus. Kuidas seda voolu nimetatakse?', en: 'A meteor shower’s radiant is in the constellation Leo, the Lion. What is the shower called?' },
        pic: { con: 'leo' },
        answers: [
          { et: 'Leoniidid', en: 'The Leonids' },
          { et: 'Perseiidid', en: 'The Perseids' },
          { et: 'Geminiidid', en: 'The Geminids' },
          { et: 'Lüüriidid', en: 'The Lyrids' }
        ],
        why: { et: 'Lõvi on ladina keeles Leo. Meteoorivool saab nime tähtkuju järgi, kus on tema radiant.', en: 'A meteor shower is named after the constellation its radiant is in, and the Lion is Leo in Latin.' }
      },
      {
        q: { et: 'Meteoorivoolu radiant on Lohe tähtkujus. Kuidas seda voolu nimetatakse?', en: 'A meteor shower’s radiant is in the constellation Draco, the Dragon. What is the shower called?' },
        pic: { con: 'draco' },
        answers: [
          { et: 'Drakoniidid', en: 'The Draconids' },
          { et: 'Leoniidid', en: 'The Leonids' },
          { et: 'Ursiidid', en: 'The Ursids' },
          { et: 'Kvadrantiidid', en: 'The Quadrantids' }
        ],
        why: { et: 'Lohe on ladina keeles Draco. Drakoniide näeb 8. oktoobri paiku, kõige paremini õhtul.', en: 'The Dragon is Draco in Latin. The Draconids come around 8 October and are best seen in the evening.' }
      },
      {
        q: { et: 'Kust on kvadrantiidid saanud oma nime?', en: 'Where does the name of the Quadrantids come from?' },
        answers: [
          { et: 'Vanast tähtkujust, mida enam pole', en: 'An old constellation that is gone' },
          { et: 'Teadlasest, kes nad avastas', en: 'The scientist who found them' },
          { et: 'Neljast heledast langevast tähest', en: 'Four bright shooting stars' },
          { et: 'Kraatrist Kuu peal', en: 'A crater on the Moon' }
        ],
        why: { et: 'Nende radiant on seal, kus oli varem tähtkuju Müürikvadrant. Tänapäeva tähekaartidel seda enam pole, aga vool kannab tema nime edasi.', en: 'Their radiant is where the constellation the Mural Quadrant used to be. It is no longer on star maps, but the shower keeps its name alive.' }
      },
      {
        q: { et: 'Mõni jälg ei lähe radiandi poole. Mis see on?', en: 'Some trails don’t point back to the radiant. What are they?' },
        answers: [
          { et: 'Juhuslikud langevad tähed', en: 'Stray shooting stars' },
          { et: 'Lennukid', en: 'Planes' },
          { et: 'Teise galaktika tähed', en: 'Stars of another galaxy' },
          { et: 'Vead fotol', en: 'Mistakes on the photo' }
        ],
        why: { et: 'Igal pimedal ööl lendab tunnis mõni juhuslik langev täht, mis ei kuulu ühtegi voolu. Nende jäljed ei lähe radiandi poole.', en: 'On every dark night a few stray shooting stars an hour fly that belong to no shower. Their trails don’t point back to the radiant.' }
      },
      {
        q: { et: 'Miks tuleb meteoorivool igal aastal samal ajal?', en: 'Why does a meteor shower come at the same time every year?' },
        answers: [
          { et: 'Maa läbib siis kivikeste juga', en: 'The Earth passes through a stream of stones' },
          { et: 'Komeet tuleb siis tagasi', en: 'A comet comes back then' },
          { et: 'Siis on ööd kõige pimedamad', en: 'The nights are darkest then' },
          { et: 'Siis on Kuu kõige kaugemal', en: 'The Moon is farthest away then' }
        ],
        why: { et: 'Komeet või asteroid on jätnud oma teele kivikesi. Maa läbib seda kivikeste juga igal aastal samal ajal.', en: 'A comet or an asteroid has left little stones along its path. The Earth reaches that stream of stones at the same time every year.' }
      },
      {
        q: { et: 'Kust on pärit geminiidide kivikesed?', en: 'Where do the little stones of the Geminids come from?' },
        answers: [
          { et: 'Asteroidilt Phaethon', en: 'The asteroid Phaethon' },
          { et: 'Kaksikute tähtedelt', en: 'The stars of Gemini' },
          { et: 'Kuult', en: 'The Moon' },
          { et: 'Marsilt', en: 'Mars' }
        ],
        why: { et: 'Enamik meteoorivooludest on pärit komeetidelt, aga geminiidid asteroidilt Phaethon. Kaksikute tähtedega pole neil midagi pistmist, sealt paistavad nad ainult tulevat.', en: 'Most meteor showers come from comets, but the Geminids come from the asteroid Phaethon. They have nothing to do with the stars of Gemini: they only seem to come from there.' }
      },
      {
        q: { et: 'Mida kõrgemal on radiant taevas, seda rohkem langevaid tähti näeb.', en: 'The higher the radiant is in the sky, the more shooting stars you see.' },
        tf: true,
        why: { et: 'Kui radiant on madalal või silmapiiri all, jõuab vähem langevaid tähti meie taevasse. Seepärast on enamikku voolusid kõige parem vaadata pärast südaööd.', en: 'When the radiant is low or below the horizon, fewer shooting stars reach our sky. That is why most showers are best after midnight.' }
      },
      {
        q: { et: 'Pane meteoorivoolud aasta järjekorda, alates augustist.', en: 'Put the meteor showers in order through the year, starting from August.' },
        order: [
          { con: 'perseus', label: { et: 'Perseiidid', en: 'Perseids' } },
          { con: 'draco', label: { et: 'Drakoniidid', en: 'Draconids' } },
          { con: 'leo', label: { et: 'Leoniidid', en: 'Leonids' } },
          { con: 'gemini', label: { et: 'Geminiidid', en: 'Geminids' } }
        ],
        why: { et: 'Perseiidid on augustis, drakoniidid oktoobris, leoniidid novembris ja geminiidid detsembris.', en: 'The Perseids come in August, the Draconids in October, the Leonids in November and the Geminids in December.' }
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
    game: 'eksoplaneet',
    questions: [
      {
        q: { et: 'Mis on eksoplaneet?', en: 'What is an exoplanet?' },
        answers: [
          { et: 'Planeet, mis tiirleb ümber mõne muu tähe', en: 'A planet going round another star' },
          { et: 'Väga kauge täht', en: 'A very faraway star' },
          { et: 'Planeedi kuu', en: 'A planet’s moon' },
          { et: 'Planeet, kus on elu', en: 'A planet with life' }
        ],
        why: { et: 'Eksoplaneet tiirleb ümber mõne muu tähe kui Päike. Neid on leitud juba üle 6000.', en: 'An exoplanet goes round a star other than the Sun. More than 6000 have been found.' }
      },
      {
        q: { et: 'Mis juhtub tähe valgusega, kui planeet möödub tähe eest?', en: 'What happens to a star’s light when a planet passes in front of it?' },
        answers: [
          { et: 'See nõrgeneb natuke', en: 'It gets a little fainter' },
          { et: 'See kustub täiesti', en: 'It goes out completely' },
          { et: 'See muutub heledamaks', en: 'It gets brighter' },
          { et: 'See muudab värvi', en: 'It changes colour' }
        ],
        why: { et: 'Planeet katab tähest väikese osa, nii et tähe heleduse graafikule tekib väike lohk.', en: 'The planet covers a little of the star, so there is a small dip in the graph of the star’s brightness.' }
      },
      {
        q: { et: 'Kuidas tead, et tähe heleduse graafiku lohud tulevad planeedist?', en: 'How can you tell that the dips in the graph of a star’s brightness come from a planet?' },
        answers: [
          { et: 'Lohud korduvad sama aja tagant', en: 'The dips come again after the same time' },
          { et: 'Lohk on väga lai', en: 'The dip is very wide' },
          { et: 'Lohke on ainult üks', en: 'There is only one dip' },
          { et: 'Täht lööb vahel heledaks', en: 'The star sometimes flares up' }
        ],
        why: { et: 'Planeet tiirleb ümber tähe ja möödub tähe eest alati sama aja tagant. Müra ja plekid nii ei kordu.', en: 'A planet goes round its star and passes in front of it always after the same time. Noise and spots do not repeat like that.' }
      },
      {
        q: { et: 'Milline planeet teeb tähe heleduse graafikule kõige sügavama lohu?', en: 'Which planet makes the deepest dip in the graph of a star’s brightness?' },
        answers: [
          { et: 'Jupiteri-suurune', en: 'Jupiter-sized' },
          { et: 'Neptuuni-suurune', en: 'Neptune-sized' },
          { et: 'Super-Maa', en: 'Super-Earth' },
          { et: 'Maa-suurune', en: 'Earth-sized' }
        ],
        why: { et: 'Mida suurem planeet, seda suurema osa tähest ta katab ja seda sügavam on lohk.', en: 'The bigger the planet, the more of the star it covers, and the deeper the dip.' }
      },
      {
        q: { et: 'Planeedi varjutused on päevadel 3, 13 ja 23. Kui pikk on selle planeedi aasta?', en: 'A planet’s transits are on days 3, 13 and 23. How long is its year?' },
        answers: [
          { et: '10 päeva', en: '10 days' },
          { et: '3 päeva', en: '3 days' },
          { et: '13 päeva', en: '13 days' },
          { et: '23 päeva', en: '23 days' }
        ],
        why: { et: 'Ühest varjutusest järgmiseni teeb planeet ümber tähe ühe tiiru: 13 − 3 = 10 päeva.', en: 'From one transit to the next, the planet goes once round its star: 13 − 3 = 10 days.' }
      },
      {
        q: { et: 'Ühe planeedi aasta on 4 päeva, teise oma 300 päeva. Kumb on oma tähele lähemal?', en: 'One planet’s year is 4 days, another’s 300 days. Which is closer to its star?' },
        answers: [
          { et: 'See, mille aasta on 4 päeva', en: 'The one with a 4-day year' },
          { et: 'See, mille aasta on 300 päeva', en: 'The one with a 300-day year' }
        ],
        why: { et: 'Mida lähemal planeet tähele on, seda lühem on tema tiir ja seda lühem aasta.', en: 'The closer a planet is to its star, the shorter its way round, and the shorter its year.' }
      },
      {
        q: { et: 'Mis on elamiskõlblik vöönd?', en: 'What is the habitable zone?' },
        answers: [
          { et: 'Koht tähe ümber, kus vesi võiks olla vedel', en: 'Where water could be liquid round a star' },
          { et: 'Tähe kõige kuumem osa', en: 'The hottest part of a star' },
          { et: 'Planeet, kus elavad inimesed', en: 'A planet where people live' },
          { et: 'Tähtede vahel olev tühjus', en: 'The empty space between stars' }
        ],
        why: { et: 'Tähele lähemal oleks vesi aur, kaugemal jää. Elamiskõlblikus vööndis võiks see olla vedel nagu Maal.', en: 'Closer to the star water would be steam, farther away ice. In the habitable zone it could be liquid, as on the Earth.' }
      },
      {
        q: { et: 'Planeet tiirleb oma tähele väga lähedal. Milline oleks seal vesi?', en: 'A planet goes round very close to its star. What would water be like there?' },
        answers: [
          { et: 'Aur', en: 'Steam' },
          { et: 'Vedel vesi', en: 'Liquid water' },
          { et: 'Jää', en: 'Ice' }
        ],
        why: { et: 'Tähe lähedal on nii kuum, et vesi keeks ära.', en: 'Close to the star it is so hot that water would boil away.' }
      },
      {
        q: { et: 'Mis on super-Maa?', en: 'What is a super-Earth?' },
        answers: [
          { et: 'Maast suurem kiviplaneet', en: 'A rocky planet bigger than the Earth' },
          { et: 'Maast väiksem gaasiplaneet', en: 'A gas planet smaller than the Earth' },
          { et: 'Maa tulevikus', en: 'The Earth in the future' },
          { et: 'Maa-suurune täht', en: 'An Earth-sized star' }
        ],
        why: { et: 'Meie Päikesesüsteemis pole ühtegi super-Maad, aga teiste tähtede juures on neid väga palju.', en: 'There is no super-Earth in our Solar System, but other stars have very many.' }
      },
      {
        q: { et: 'Varjutus on nii madal, et seda on müra seest vaevu näha. Milline planeet selle teeb?', en: 'An eclipse is so shallow that you can hardly see it in the noise. What planet makes it?' },
        answers: [
          { et: 'Maa-suurune', en: 'Earth-sized' },
          { et: 'Super-Maa', en: 'Super-Earth' },
          { et: 'Neptuuni-suurune', en: 'Neptune-sized' },
          { et: 'Jupiteri-suurune', en: 'Jupiter-sized' }
        ],
        why: { et: 'Maa-suurune planeet katab tähest väga väikese osa, nii et tema varjutus on kõige madalam. Selliseid planeete on kõige raskem leida.', en: 'An Earth-sized planet covers very little of its star, so its eclipse is the shallowest. Such planets are the hardest to find.' }
      },
      {
        q: { et: 'Neptuuni-suurusel planeedil on kõva pind, kuhu astuda.', en: 'A Neptune-sized planet has hard ground to stand on.' },
        tf: false,
        why: { et: 'Neptuuni-suurune planeet on enamasti gaasist ja jääst, nii et sellel pole kõva pinda.', en: 'A Neptune-sized planet is mostly gas and ice, so it has no hard ground.' }
      },
      {
        q: { et: 'Milliseid planeete otsivad teadlased kõige rohkem?', en: 'Which planets do scientists most want to find?' },
        answers: [
          { et: 'Maa-suurusi elamiskõlblikus vööndis', en: 'Earth-sized ones in the habitable zone' },
          { et: 'Jupiteri-suurusi tähe kõrval', en: 'Jupiter-sized ones next to their star' },
          { et: 'Neptuuni-suurusi, kus vesi on jää', en: 'Neptune-sized ones where water is ice' },
          { et: 'Super-Maid, kus vesi keeks ära', en: 'Super-Earths where water would boil away' }
        ],
        why: { et: 'Maa-suurusel planeedil elamiskõlblikus vööndis võiks olla kivine pind ja vedel vesi nagu Maal.', en: 'An Earth-sized planet in the habitable zone could have rocky ground and liquid water, like the Earth.' }
      },
      {
        q: { et: 'Mis on kuum Jupiter?', en: 'What is a hot Jupiter?' },
        answers: [
          { et: 'Hiidplaneet oma tähe kõrval', en: 'A giant planet right next to its star' },
          { et: 'Jupiter suvel', en: 'Jupiter in summer' },
          { et: 'Väga kuum täht', en: 'A very hot star' },
          { et: 'Jupiteri punane laik', en: 'Jupiter’s red spot' }
        ],
        why: { et: 'Kuumi Jupitere leitakse kergesti, sest nende varjutused on sügavad ja korduvad tihti.', en: 'Hot Jupiters are easy to find, because their eclipses are deep and come often.' }
      },
      {
        q: { et: 'Täht lööb korraks heledamaks. Mis see on?', en: 'A star suddenly gets brighter for a moment. What is it?' },
        answers: [
          { et: 'Täheloide', en: 'A flare' },
          { et: 'Planeet möödub tähe eest', en: 'A planet passing in front' },
          { et: 'Planeedi kuu', en: 'A planet’s moon' },
          { et: 'Täht kustub', en: 'The star going out' }
        ],
        why: { et: 'Täheloide on võimas plahvatus tähe pinnal. Planeedi möödudes tähe valgus hoopis nõrgeneb.', en: 'A flare is a powerful burst on the star’s surface. When a planet passes, the star’s light gets fainter instead.' }
      },
      {
        q: { et: 'Tähe heledus kõigub aeglaselt üles ja alla. Mis seda teeb?', en: 'A star’s brightness slowly goes up and down. What makes it do that?' },
        answers: [
          { et: 'Plekid pöörleva tähe pinnal', en: 'Spots on the turning star' },
          { et: 'Kaks planeeti korraga', en: 'Two planets at once' },
          { et: 'Tähe kuu', en: 'The star’s moon' },
          { et: 'Täht kasvab ja kahaneb', en: 'The star grows and shrinks' }
        ],
        why: { et: 'Plekid on tähe pinnal tumedamad. Kui täht pöörleb, tulevad need nähtavale ja kaovad jälle.', en: 'Spots are darker parts of the star’s surface. As the star turns, they come into view and go again.' }
      },
      {
        q: { et: 'Sama planeet põhjustab väikese tähe ees sügavama varjutuse kui suure tähe ees.', en: 'The same planet causes a deeper eclipse in front of a small star than in front of a big one.' },
        tf: true,
        why: { et: 'Väikese tähe ees katab planeet tähest suurema osa, nii et valgus nõrgeneb rohkem.', en: 'In front of a small star the planet covers more of it, so the light gets fainter.' }
      },
      {
        q: { et: 'Iga tähe eest möödub mõni planeet, nii et igal tähel näeb varjutusi.', en: 'A planet passes in front of every star, so every star shows eclipses.' },
        tf: false,
        why: { et: 'Ka siis, kui tähel on planeete, ei pruugi nende tee meie poolt vaadates tähe eest läbi viia. Enamiku tähtedega on just nii.', en: 'Even when a star has planets, their paths may not take them in front of it as we see it. That is so for most stars.' }
      }
    ]
  },
  {
    game: 'asteroid',
    questions: [
      {
        q: { et: 'Mis on asteroid?', en: 'What is an asteroid?' },
        answers: [
          { et: 'Kivimürakas, mis tiirleb ümber Päikese', en: 'A lump of rock going round the Sun' },
          { et: 'Väike täht', en: 'A small star' },
          { et: 'Planeedi kuu', en: 'A planet’s moon' },
          { et: 'Langev täht', en: 'A shooting star' }
        ],
        why: { et: 'Asteroidid tiirlevad ümber Päikese nagu planeedid, aga on palju väiksemad. Teleskoobis paistavad nad täpselt nagu tähed.', en: 'Asteroids go round the Sun like the planets, but are much smaller. Through a telescope they look just like stars.' }
      },
      {
        q: { et: 'Kuidas leida pildilt asteroid, kui see paistab täpselt nagu täht?', en: 'How do you find an asteroid in a picture, when it looks just like a star?' },
        answers: [
          { et: 'Otsi täppi, mis liigub', en: 'Look for a dot that moves' },
          { et: 'Otsi kõige heledamat täppi', en: 'Look for the brightest dot' },
          { et: 'Otsi sabaga täppi', en: 'Look for a dot with a tail' },
          { et: 'Otsi punast täppi', en: 'Look for a red dot' }
        ],
        why: { et: 'Teleskoop pildistab sama taevalaiku mitmel ööl. Tähed püsivad paigal, aga asteroid hüppab paigast paika.', en: 'The telescope takes pictures of the same patch of sky on several nights. The stars stay put, but the asteroid jumps from place to place.' }
      },
      {
        q: { et: 'Miks paistavad tähed piltidel paigal, kuigi asteroid liigub?', en: 'Why do the stars seem to stand still in the pictures, though the asteroid moves?' },
        answers: [
          { et: 'Tähed on palju kaugemal', en: 'The stars are much farther away' },
          { et: 'Tähed on kinni taevas', en: 'The stars are fixed to the sky' },
          { et: 'Tähed on suuremad', en: 'The stars are bigger' },
          { et: 'Tähed magavad öösel', en: 'The stars sleep at night' }
        ],
        why: { et: 'Ka tähed liiguvad, aga nad on nii kaugel, et paari ööga ei näe me nende liikumist.', en: 'The stars move too, but they are so far away that we cannot see them move in a few nights.' }
      },
      {
        q: { et: 'Kus tiirleb enamik asteroide?', en: 'Where do most asteroids go round the Sun?' },
        answers: [
          { et: 'Marsi ja Jupiteri vahel', en: 'Between Mars and Jupiter' },
          { et: 'Maa ja Kuu vahel', en: 'Between the Earth and the Moon' },
          { et: 'Päikese ja Merkuuri vahel', en: 'Between the Sun and Mercury' },
          { et: 'Saturni rõngastes', en: 'In Saturn’s rings' }
        ],
        why: { et: 'Marsi ja Jupiteri vahel on asteroidide vöö. Asteroide on leitud üle miljoni, ja enamik neist tiirleb seal.', en: 'Between Mars and Jupiter is the asteroid belt. More than a million asteroids have been found, and most of them go round there.' }
      },
      {
        q: { et: 'Milline asteroid liigub tähtede vahel kõige kiiremini?', en: 'Which asteroid moves fastest among the stars?' },
        answers: [
          { et: 'See, mis on Maa lähedal', en: 'One near the Earth' },
          { et: 'See, mis on asteroidide vöös', en: 'One in the asteroid belt' },
          { et: 'See, mis on Neptuunist kaugemal', en: 'One beyond Neptune' }
        ],
        why: { et: 'Mida lähemal asteroid on, seda kiiremini paistab ta tähtede vahel liikuvat.', en: 'The nearer an asteroid is, the faster it seems to move among the stars.' }
      },
      {
        q: { et: 'Teleskoobi piltidel on väga nõrk asteroid, mis liigub tähtede vahel väga aeglaselt. Kus ta tiirleb?', en: 'In a telescope’s pictures, a very faint asteroid moves very slowly among the stars. Where does it go round the Sun?' },
        answers: [
          { et: 'Neptuunist kaugemal', en: 'Beyond Neptune' },
          { et: 'Asteroidide vöös', en: 'In the asteroid belt' },
          { et: 'Maa lähedal', en: 'Near the Earth' }
        ],
        why: { et: 'Neptuunist kaugemal on Päikese valgus nõrk ja kõik on jääs. Nii kaugel liigub keha tähtede vahel väga aeglaselt.', en: 'Beyond Neptune the sunlight is weak and everything is ice. So far away, a body moves very slowly among the stars.' }
      },
      {
        q: { et: 'Asteroid liikus 1. ööst 2. ööni natuke edasi. Kus on ta 3. ööl?', en: 'An asteroid moved on a little from night 1 to night 2. Where is it on night 3?' },
        answers: [
          { et: 'Sama palju edasi samas suunas', en: 'As far on again, the same way' },
          { et: 'Tagasi 1. öö kohas', en: 'Back where it was on night 1' },
          { et: 'Samas kohas kui 2. ööl', en: 'In the same place as on night 2' },
          { et: 'Ükskõik kus', en: 'Anywhere at all' }
        ],
        why: { et: 'Asteroid liigub iga ööga sama palju ja samas suunas. Nii arvutavad astronoomid ette, kus ta järgmisel ööl on, ja leiavad ta uuesti.', en: 'An asteroid moves the same distance in the same direction every night. So astronomers work out where it will be the next night, and find it again.' }
      },
      {
        q: { et: 'Teleskoop pildistas sama taevalaiku mitmel ööl. Üks täpp on ainult ühe öö pildil ja on tähtedest teravam. Mis see on?', en: 'A telescope took pictures of the same patch of sky on several nights. One dot is in the picture of only one night, and is sharper than the stars. What is it?' },
        answers: [
          { et: 'Kosmilise kiire jälg', en: 'The track of a cosmic ray' },
          { et: 'Asteroid', en: 'An asteroid' },
          { et: 'Täht, mis muudab heledust', en: 'A star that changes its brightness' },
          { et: 'Satelliit', en: 'A satellite' }
        ],
        why: { et: 'Kosmiline kiir tabab kaamerat ainult korra. Asteroid on igal pildil, aga iga kord eri kohas.', en: 'A cosmic ray hits the camera only once. An asteroid is in every picture, but in a different place each time.' }
      },
      {
        q: { et: 'Teleskoobi pildil taevast on pikk hele triip. Mis selle jättis?', en: 'A telescope’s picture of the sky has a long bright streak across it. What left it?' },
        answers: [
          { et: 'Satelliit', en: 'A satellite' },
          { et: 'Asteroidide vöö asteroid', en: 'An asteroid in the belt' },
          { et: 'Täht, mis muudab heledust', en: 'A star that changes its brightness' },
          { et: 'Kosmiline kiir', en: 'A cosmic ray' }
        ],
        why: { et: 'Satelliit lendab nii kiiresti, et jõuab pildistamise ajal üle taeva ja jätab triibu. Asteroid on täpp, mitte triip.', en: 'A satellite flies so fast that it crosses the sky while the picture is taken and leaves a streak. An asteroid is a dot, not a streak.' }
      },
      {
        q: { et: 'Teleskoop pildistab sama taevalaiku mitmel ööl. Täht, mis muudab heledust, on igal pildil samas kohas.', en: 'A telescope takes pictures of the same patch of sky on several nights. A star that changes its brightness is in the same place in each picture.' },
        tf: true,
        why: { et: 'Selline täht muudab heledust, aga ei liigu paigast. Igal pildil eri kohas on hoopis asteroid.', en: 'Such a star changes its brightness, but does not move. It is the asteroid that is in a different place in each picture.' }
      },
      {
        q: { et: 'Kes leidis 1930. aastal Pluuto, vilgutades kahte eri ööl tehtud fotot?', en: 'Who found Pluto in 1930 by flipping between two photos from different nights?' },
        answers: [
          { et: 'Clyde Tombaugh', en: 'Clyde Tombaugh' },
          { et: 'Galileo Galilei', en: 'Galileo Galilei' },
          { et: 'Giuseppe Piazzi', en: 'Giuseppe Piazzi' },
          { et: 'Ernst Öpik', en: 'Ernst Öpik' }
        ],
        why: { et: 'Clyde Tombaugh otsis täppi, mis liigub, täpselt nagu sina Leia asteroidi mängus.', en: 'Clyde Tombaugh looked for a dot that moves, just as you do in Find the Asteroid.' }
      },
      {
        q: { et: 'Mis on Pluuto ja Eris?', en: 'What are Pluto and Eris?' },
        answers: [
          { et: 'Kääbusplaneedid Neptuunist kaugemal', en: 'Dwarf planets beyond Neptune' },
          { et: 'Asteroidid Marsi ja Jupiteri vahel', en: 'Asteroids between Mars and Jupiter' },
          { et: 'Jupiteri kuud', en: 'Moons of Jupiter' },
          { et: 'Tähed', en: 'Stars' }
        ],
        why: { et: 'Neptuunist kaugemal tiirleb tuhandeid jäiseid kehi. Mõned neist, näiteks Pluuto ja Eris, on kääbusplaneedid.', en: 'Thousands of icy bodies go round the Sun beyond Neptune. Some of them, such as Pluto and Eris, are dwarf planets.' }
      },
      {
        q: { et: 'Mis oli esimene asteroid, mis leiti?', en: 'What was the first asteroid to be found?' },
        answers: [
          { et: 'Ceres', en: 'Ceres' },
          { et: 'Pluuto', en: 'Pluto' },
          { et: 'Estonia', en: 'Estonia' },
          { et: 'Dimorphos', en: 'Dimorphos' }
        ],
        why: { et: 'Cerese leidis Giuseppe Piazzi 1801. aastal. Nüüd peetakse Cerest kääbusplaneediks.', en: 'Ceres was found by Giuseppe Piazzi in 1801. Now Ceres is counted as a dwarf planet.' }
      },
      {
        q: { et: 'Asteroidid on tükid, mis jäid üle, kui planeedid tekkisid.', en: 'Asteroids are pieces left over from when the planets formed.' },
        tf: true,
        why: { et: 'Planeedid tekkisid 4,6 miljardit aastat tagasi. Asteroidid on sellest ajast üle jäänud tükid.', en: 'The planets formed 4.6 billion years ago. Asteroids are pieces left over from that time.' }
      },
      {
        q: { et: 'Mis on 2026 UA₁₂?', en: 'What is 2026 UA₁₂?' },
        answers: [
          { et: 'Asteroidi ajutine tähis', en: 'An asteroid’s temporary label' },
          { et: 'Asteroidi kaugus Päikesest', en: 'How far an asteroid is from the Sun' },
          { et: 'Teleskoobi nimi', en: 'The name of a telescope' },
          { et: 'Kosmosesondi nimi', en: 'The name of a space probe' }
        ],
        why: { et: 'Tähises on aasta, poolkuu täht ja järjekord. Hiljem pakub avastaja asteroidile nime.', en: 'The label has the year, a letter for the half of the month, and the order. Later the discoverer suggests a name for the asteroid.' }
      },
      {
        q: { et: 'Kui asteroidi tee ristub Maa teega, kukub ta kindlasti Maale.', en: 'If an asteroid’s path crosses the Earth’s path, it will surely fall on the Earth.' },
        tf: false,
        why: { et: 'Maa ja asteroid on väga harva samal ajal samas kohas. Astronoomid arvutavad asteroidide teed aastateks ette, ja praegu pole teada ühtki suurt asteroidi, mis lähema saja aasta jooksul Maale kukuks.', en: 'The Earth and an asteroid are very rarely in the same place at the same time. Astronomers work out asteroids’ paths years ahead, and no big asteroid is known that would fall on the Earth in the next hundred years.' }
      },
      {
        q: { et: 'Mida tegi kosmosesond DART 2022. aastal?', en: 'What did the DART space probe do in 2022?' },
        answers: [
          { et: 'Muutis asteroidi teed', en: 'Changed an asteroid’s path' },
          { et: 'Maandus Marsil', en: 'Landed on Mars' },
          { et: 'Tõi Kuult kive', en: 'Brought rocks from the Moon' },
          { et: 'Pildistas Pluutot', en: 'Took pictures of Pluto' }
        ],
        why: { et: 'DART põrkas asteroidi Dimorphos vastu ja muutis tema teed. Nii katsetati, kuidas asteroidi vajaduse korral eemale lükata.', en: 'DART crashed into the asteroid Dimorphos and changed its path. It tested how an asteroid could be pushed away if needed.' }
      },
      {
        q: { et: 'Asteroid 4227 Kaali on nime saanud Saaremaa kraatri järgi. Mis selle kraatri tekitas?', en: 'The asteroid 4227 Kaali is named after a crater on Saaremaa. What made the crater?' },
        answers: [
          { et: 'Meteoriit', en: 'A meteorite' },
          { et: 'Vulkaan', en: 'A volcano' },
          { et: 'Jõgi', en: 'A river' },
          { et: 'Inimesed kaevasid selle', en: 'People dug it' }
        ],
        why: { et: 'Meteoriit kukkus Kaali umbes 3500 aastat tagasi. Asteroidi 4227 Kaali leidis Soome astronoom Liisi Oterma.', en: 'A meteorite fell at Kaali about 3500 years ago. The asteroid 4227 Kaali was found by the Finnish astronomer Liisi Oterma.' }
      },
      {
        q: { et: 'Kelle järgi on nime saanud asteroid 2099 Öpik?', en: 'Who is the asteroid 2099 Öpik named after?' },
        answers: [
          { et: 'Eesti astronoomi järgi', en: 'An Estonian astronomer' },
          { et: 'Eesti laulja järgi', en: 'An Estonian singer' },
          { et: 'Eesti saare järgi', en: 'An Estonian island' },
          { et: 'Eesti helilooja järgi', en: 'An Estonian composer' }
        ],
        why: { et: 'Ernst Öpik töötas Tartus ja uuris meteoore, komeete ja asteroide. Oma asteroidi on saanud ka laulja Georg Ots ja helilooja Arvo Pärt.', en: 'Ernst Öpik worked in Tartu and studied meteors, comets and asteroids. The singer Georg Ots and the composer Arvo Pärt have asteroids of their own too.' }
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
      },
      {
        q: { et: 'Miks on see galaktika nii peenike?', en: 'Why is this galaxy so thin?' },
        pic: { photo: 'needle' },
        answers: [
          { et: 'Me näeme seda küljelt', en: 'We see it from the side' },
          { et: 'See on väga väike', en: 'It is very small' },
          { et: 'Selles on vähe tähti', en: 'It has few stars' },
          { et: 'See on väga kaugel', en: 'It is very far away' }
        ],
        why: { et: 'Nõela galaktika on lapik nagu pannkook ja me näeme seda täpselt küljelt. Küljelt vaadates näeks meie Linnutee välja umbes samasugune.', en: 'The Needle Galaxy is flat like a pancake, and we see it exactly from the side. Seen from the side, our Milky Way would look much the same.' }
      },
      {
        q: { et: 'Millise asja järgi on see galaktika nime saanud?', en: 'What is this galaxy named after?' },
        pic: { photo: 'sombrero' },
        answers: [
          { et: 'Kübar', en: 'A hat' },
          { et: 'Taldrik', en: 'A plate' },
          { et: 'Silm', en: 'An eye' },
          { et: 'Lendav taldrik', en: 'A flying saucer' }
        ],
        why: { et: 'Sombreero on laia äärega Mehhiko kübar. Tume triip galaktika keskel on tolm.', en: 'A sombrero is a Mexican hat with a wide brim. The dark stripe across the galaxy is dust.' }
      }
    ]
  }
];
