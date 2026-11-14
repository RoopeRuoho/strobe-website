// All site text and projects live here. Edit this file to change the site.
// Placeholders in [BRACKETS] must be replaced with real details.
window.SITE = {
  brand: "Strobe Corp",
  role: "Lighting Designer · Operator · Technician",
  tagline: "Shaping rooms with light.",

  nav: [
    { id: "work", label: "Portfolio" },
    { id: "rig", label: "Rig" },
    { id: "contact", label: "Contact" },
    { id: "gear", label: "Gear", href: "gear.html" },
    { id: "about", label: "About", href: "about.html" },
  ],

  about: {
    cue: "CUE 1 / ABOUT",
    title: "Design it. Build it. Run it.",
    paragraphs: [
      "I'm a lighting designer, operator and technician based in Finland. I draw the look on paper, programme it on the desk and rig the fixtures myself, so nothing gets lost between the idea and the show.",
      "From small club nights to festival stages, I care about the same things: clean cues, a calm rig and light that supports the music instead of fighting it.",
      "Even off the clock, you'll usually find me refining a design or tidying up a cue list."
    ],
    more: "More about me",
    stats: [
      { value: "{years:2021}", label: "Years on the road" },
      { value: "300+", label: "Shows delivered" },
      { value: "200+", label: "Venues & festivals" }
    ]
  },

  // The separate About page (about.html)
  aboutPage: {
    eyebrow: "ABOUT ME",
    title: "Hi, I'm Roope.",
    lead: "Lighting designer, operator and technician based in Finland.",
    portrait: { image: "img/about-portrait.jpg", alt: "Black and white portrait of Roope, smiling with arms crossed, wearing a beanie and a leather jacket on a balcony by the water." },
    story: [
      "I hit the road in 2021, became a full-time professional in 2022, and I have been designing, programming and rigging light ever since. [Tell your story here.]",
      "I like being involved from the first sketch to the last load-out, because the best shows are the ones where nothing gets lost in between. [Replace with your own text.]",
      "When I'm not working I'm testing fixtures, building cue lists in the visualiser or looking for the next venue with a good rig. [Replace with your own text.]"
    ],
    doTitle: "What I do",
    does: [
      { title: "Design", text: "Concept, plot and visualisation for stages, tours and installations." },
      { title: "Operate", text: "Programming and running shows live on grandMA and ChamSys." },
      { title: "Tech", text: "Rigging, patching, networks and fixture maintenance." }
    ],
    timelineTitle: "On the road",
    timeline: [
      { year: "2022", text: "Started as a full-time professional." },
      { year: "2023", text: "" },
      { year: "2024", text: "" },
      { year: "2025", text: "" },
      { year: "2026", text: "" }
    ],
    cta: "Let's work together",
    ctaHref: "mailto:Roope@strobe.fi?subject=Booking%20enquiry"
  },

  work: {
    cue: "CUE 2 / PORTFOLIO",
    title: "Selected work",
    filters: ["All", "Design", "Operation", "Tech"],
    lightbox: {
      close: "Close",
      prev: "Previous project",
      next: "Next project",
      count: "Project {n} of {m}",
      venue: "Venue",
      date: "Date",
      role: "Role"
    },
    labels: { All: "All", Design: "Design", Operation: "Operation", Tech: "Tech" },   // how the filter and category keys are shown (the keys themselves stay English)
    statusAll: "Showing {n} projects",
    status: "Showing {n} {filter} projects",
    gobo: { aspect: "16 / 9", label: "Selected work, rotating", pause: "Pause", play: "Play", prev: "Previous", next: "Next", open: "Open" },
    projects: [
      { id: 1, title: "Sample Festival Main Stage", venue: "[VENUE], Finland", date: "Jul 2025", role: "Lighting Designer", category: "Design", image: "img/project-1.svg", alt: "Placeholder: festival main stage lit with amber beams", blurb: "Full lighting design for the main stage: a 60-fixture rig, a bold colour story and cues built around the headline set. [Replace with your own project description.]" },
      { id: 2, title: "Sample Club Residency", venue: "[CLUB], Finland", date: "2024–2025", role: "Lighting Operator", category: "Operation", image: "img/project-2.svg", alt: "Placeholder: club dance floor with cyan spots", blurb: "Weekly residency programming and operating on a compact club rig. Fast, musical busking with tight accents. [Replace with your own project description.]" },
      { id: 3, title: "Sample Theatre Production", venue: "[THEATRE], Finland", date: "Mar 2025", role: "Designer & Operator", category: "Design", image: "img/project-3.svg", alt: "Placeholder: theatre stage with warm wash", blurb: "Designed and operated a drama production: motivated light, slow fades and a palette that follows the story. [Replace with your own project description.]" },
      { id: 4, title: "Sample Arena Tour Support", venue: "[ARENA], Finland", date: "Nov 2024", role: "Rigging & Tech", category: "Tech", image: "img/project-4.svg", alt: "Placeholder: arena truss with magenta fixtures", blurb: "Rigging, patching and fixture checks for an arena tour support crew. Safe, quick load-in and clean cabling. [Replace with your own project description.]" },
      { id: 5, title: "Sample Corporate Launch", venue: "[VENUE], Finland", date: "Sep 2024", role: "Lighting Operator", category: "Operation", image: "img/project-5.svg", alt: "Placeholder: corporate stage with white beams", blurb: "Clean, bright and on-brand lighting for a product launch, programmed and operated live. [Replace with your own project description.]" },
      { id: 6, title: "Sample Installation Retrofit", venue: "[VENUE], Finland", date: "May 2024", role: "Systems Technician", category: "Tech", image: "img/project-6.svg", alt: "Placeholder: venue ceiling with installed fixtures", blurb: "Retrofit of a venue's house lighting: new fixtures, network and DMX distribution, commissioned and documented. [Replace with your own project description.]" }
    ]
  },

  gear: {
    cue: "EQUIPMENT RENTAL",
    title: "Gear for hire",
    text: "Equipment I own and rent out, with or without a technician. Rates on request.",
    button: "Ask about rental",
    subject: "Rental enquiry",
    items: [
      { name: "grandMA3 onPC in Pelican case", category: "Control", specs: ["grandMA3 onPC", "Pelican case", "Ready to run"], image: "img/gear-ma3-onpc.png", images: ["img/gear-ma3-onpc.png", "img/gear-pelican-case.png"], fit: "contain", alt: "grandMA3 compact console next to the black Pelican case it travels in." },
      { name: "LumiNode 12", category: "Network", specs: ["12 DMX ports", "Art-Net / sACN"], image: "img/gear-luminode-12.png", fit: "contain", alt: "Luminex LumiNode 12, a 1U rack-mount network node with a display, a rotary knob and twelve DMX ports." },
      { name: "Swisson 4-port node", category: "Network", specs: ["4 DMX ports", "Art-Net / sACN"], image: "img/gear-swisson-xnd4.png", fit: "contain", alt: "Swisson XND-4, a 1U rack-mount four-port Ethernet to DMX node with a display, a rotary knob and four DMX ports." },
      { name: "grandMA3 Viz-Key", category: "Software", specs: ["grandMA3 Viz-Key", "Visualiser dongle", "For hire"], image: "img/gear-viz-key.png", fit: "contain", scale: 0.55, alt: "grandMA3 viz-key, a small black USB dongle with the MA logo." },
      { name: "Resolume Arena licence", category: "Software", specs: ["Resolume Arena", "Licence for hire"], image: "img/gear-resolume-arena.svg", fit: "contain", scale: 0.55, alt: "Resolume Arena logo." },
      { name: "Capture licence", category: "Software", specs: ["Capture", "Licence for hire"], image: "img/gear-capture.png", fit: "contain", scale: 0.4, alt: "Capture logo, a ring of colourful swirls." },
      { name: "ProPlex IQ Tester LV", category: "Tools", specs: ["ProPlex IQ Tester LV", "Network and timecode tester"], image: "img/gear-proplex-iq-tester.png", fit: "contain", scale: 0.4, alt: "ProPlex IQ Tester LV, a handheld blue and black tester with a colour display showing timecode." },
      { name: "Look Solutions Cobra 3.1", category: "Effects", specs: ["Look Solutions", "Cobra 3.1 hazer"], image: "img/gear-cobra-31.png", fit: "contain", scale: 0.6, alt: "Look Solutions Cobra 3.1 hazer in a blue and black case with a fluid canister at the back." },
      { name: "Martin Sceptrons", category: "Fixtures", specs: ["LED batten", "Pixel mappable"], image: "img/gear-1.svg", alt: "Placeholder: Martin Sceptron LED battens" },
      { name: "Martin VDO Atomic CLD", category: "Fixtures", specs: ["Martin VDO", "Atomic CLD"], image: "img/gear-2.svg", alt: "Placeholder: Martin VDO Atomic CLD fixtures" },
      { name: "Martin P3 PowerPort 1500", category: "Power", specs: ["Martin P3", "1500 W power supply"], image: "img/gear-5.svg", alt: "Placeholder: Martin P3 PowerPort 1500" },
      { name: "Martin P3 PowerPort 375", category: "Power", specs: ["Martin P3", "375 W power supply"], image: "img/gear-5.svg", alt: "Placeholder: Martin P3 PowerPort 375" },
      { name: "Martin P3-150 System Controller", category: "Control", specs: ["Martin P3", "System controller"], image: "img/gear-4.svg", alt: "Placeholder: Martin P3-150 System Controller" },
      { name: "Martin P3-050 System Controller", category: "Control", specs: ["Martin P3", "System controller"], image: "img/gear-4.svg", alt: "Placeholder: Martin P3-050 System Controller" }
    ]
  },

  rig: {
    cue: "CUE 3 / SKILLS & RIG",
    title: "What's in the rig",
    // level is 0-100, shown as a fader position
    groups: [
      { name: "Consoles", items: [
        { label: "grandMA3", level: 90 },
        { label: "grandMA2", level: 85 },
        { label: "Chamsys MagicQ", level: 100 },
        //{ label: "", level: 75 }
      ]},
      { name: "Software", items: [
        { label: "Capture", level: 95 },
        { label: "Resolume", level: 75 },
        { label: "Cuepoints", level: 85 },
        { label: "Vectorworks", level: 35 }
      ]},
      { name: "Fixtures", items: [
        { label: "Moving heads", level: 95 },
        { label: "LED battens", level: 85 },
        { label: "Followspots", level: 70 },
        { label: "Conventionals", level: 80 }
      ]},
      { name: "Protocols", items: [
        { label: "DMX512", level: 98 },
        { label: "Art-Net / sACN", level: 90 },
        { label: "RDM", level: 75 },
        { label: "Timecode / MIDI", level: 70 }
      ]}
    ]
  },



  contact: {
    cue: "CUE 4 / CONTACT",
    title: "Patch sheet",
    text: "Booking a show, a tour or a rig check? Get in touch.",
    rows: [
      { channel: "01", label: "Email", value: "Roope@strobe.fi", href: "mailto:Roope@strobe.fi" },
      { channel: "02", label: "Phone", value: "+358401402505", href: "tel:+358401402505" },
      { channel: "03", label: "Location", value: "Finland" },
      { channel: "04", label: "Availability", value: "Open for bookings" }
    ],
    button: "Send an email",
    buttonHref: "mailto:Roope@strobe.fi?subject=Booking%20enquiry"
  },
  gel: {
    cue: "CUE 5 / GEL PICKER",
    title: "Pick a gel",
    text: "Change the colour of the whole site. Your choice is remembered.",
    current: "Gel: {name}",
    swatches: [
      { name: "Warm Amber", value: "#ffb347" },
      { name: "Congo Blue", value: "#4d7cff" },
      { name: "Magenta", value: "#ff3fa4" },
      { name: "Lime", value: "#b6ff3c" },
      { name: "Cyan", value: "#3df2ff" },
      { name: "Red", value: "#ff4d4d" },
      { name: "Lavender", value: "#b79cff" }
    ]
  },
  console: {
    blackout: "Blackout",
    blackoutOn: "Lights on",
    locked: "Console locked",
    universe: "U1",
    channel: "CH"
  },

  // The first screen shown on every page until the secret word is typed (see gate.js)
  gate: {
    title: "Under construction",
    text: "The new Strobe Corp site is being built. Back soon.",
    button: "Understood, enter",
    note: "Must wear a hard hat on a construction site."
  },

  footer: "© Strobe Corp. All rights reserved."
};


// Small interface texts (buttons, labels for screen readers, page titles) that are not part of a section above.
window.SITE.ui = {
  skipLink: "Skip to content",
  introSkip: "Skip intro",
  introEnter: "Enter the light",
  spotCentreOff: "Switch the centre spot off",
  spotLeftOn: "Switch on the left spot",
  spotRightOn: "Switch on the right spot",
  spotOn: "Switch the {name} spot on",
  spotOff: "Switch the {name} spot off",
  spotNames: { left: "left", centre: "centre", right: "right" },
  heroCue: "CUE 0 / HOUSE LIGHTS",
  seeWork: "See the work",
  speed: "Speed",
  wheelSpeed: "Wheel speed",
  filterAria: "Filter projects",
  contactCaption: "Contact details",
  thCh: "Ch",
  thLabel: "Label",
  thValue: "Value",
  accentAria: "Accent colour",
  storyAria: "My story",
  navAria: "Main",
  timecode: "Timecode clock",
  langCode: "FI",
  langAria: "Suomeksi",
  title: { index: "Strobe Corp | Lighting Designer, Operator, Technician", about: "About | Strobe Corp", gear: "Gear for hire | Strobe Corp" },
  description: { index: "Strobe Corp: lighting design, operation and technical services.", about: "About Strobe Corp: lighting designer, operator and technician.", gear: "Lighting equipment for hire from Strobe Corp." }
};


// ---------- Suomi ----------
// Same structure as window.SITE: only what is different in Finnish is written here. Lists are merged item by item (an empty
// {} keeps the English item as it is, for names that do not change).
window.SITE_FI = {
  role: "Valosuunnittelija · Operaattori · Teknikko",
  tagline: "Muotoilen tilaa valolla.",
  nav: [
    { label: "Portfolio" }, { label: "Osaaminen" }, { label: "Yhteys" }, { label: "Kalusto" }, { label: "Minusta" }
  ],
  about: {
    cue: "CUE 1 / MINUSTA",
    title: "Suunnittelen. Rakennan. Ajan.",
    paragraphs: [
      "Olen valosuunnittelija, operaattori ja teknikko Suomesta. Suunnittelen valoilmeen, ohjelmoin sen valopöytään ja ripustan valot itse, joten mikään ei huku matkalla ideasta valmiiseen showhun.",
      "Oli kyseessä klubi-ilta tai festarilava, tärkeintä on aina sama: selkeät cuet, rauhallinen rigi ja valo, joka tukee musiikkia eikä kilpaile sen kanssa.",
      "Vapaa-ajallakin hion usein suunnitelmia tai siistin cue-listoja."
    ],
    more: "Lue lisää minusta",
    stats: [{ label: "Vuotta keikoilla" }, { label: "Keikkaa takana" }, { label: "Keikkapaikkaa ja festaria" }]
  },
  aboutPage: {
    eyebrow: "MINUSTA",
    title: "Moi, olen Roope.",
    lead: "Valosuunnittelija, operaattori ja teknikko Suomesta.",
    portrait: { alt: "Mustavalkoinen kuva Roopesta: hän hymyilee kädet puuskassa pipo päässä ja nahkatakki päällä parvekkeella veden äärellä." },
    story: [
      "Lähdin keikoille vuonna 2021, siirryin alalle kokopäiväisesti vuonna 2022, ja siitä lähtien olen suunnitellut, ohjelmoinut ja ripustanut valoja. [Kerro tarinasi tähän.]",
      "Haluan olla mukana ensimmäisestä luonnoksesta viimeiseen purkuun asti, koska parhaat showt syntyvät silloin, kun mikään ei huku matkalla. [Korvaa omalla tekstilläsi.]",
      "Vapaa-ajalla testailen valaisimia, rakennan cue-listoja visualisaattorissa tai etsin seuraavaa paikkaa, jossa on hyvä rigi. [Korvaa omalla tekstilläsi.]"
    ],
    doTitle: "Mitä teen",
    does: [
      { title: "Suunnittelu", text: "Konseptit, valokartat ja visualisoinnit lavoille, kiertueille ja kiinteisiin asennuksiin." },
      { title: "Operointi", text: "Showjen ohjelmointi ja ajaminen livenä grandMA:lla ja ChamSysillä." },
      { title: "Tekniikka", text: "Ripustus, patchaus, verkot ja valaisinhuolto." }
    ],
    timelineTitle: "Keikoilla",
    timeline: [{ text: "Aloitin kokopäiväisenä ammattilaisena." }],
    cta: "Tehdään yhdessä",
    ctaHref: "mailto:Roope@strobe.fi?subject=Keikkatiedustelu"
  },
  work: {
    cue: "CUE 2 / PORTFOLIO",
    title: "Valikoituja töitä",
    labels: { All: "Kaikki", Design: "Suunnittelu", Operation: "Operointi", Tech: "Tekniikka" },
    lightbox: { close: "Sulje", prev: "Edellinen projekti", next: "Seuraava projekti", count: "Projekti {n} / {m}", venue: "Paikka", date: "Ajankohta", role: "Rooli" },
    statusAll: "Näytetään {n} projektia",
    status: "Näytetään {n} projektia ({filter})",
    gobo: { label: "Valikoituja töitä, pyörivä", pause: "Pysäytä", play: "Toista", prev: "Edellinen", next: "Seuraava", open: "Avaa" },
    projects: [
      { title: "Esimerkki: festivaalin päälava", venue: "[PAIKKA], Suomi", date: "Heinäkuu 2025", role: "Valosuunnittelija", alt: "Esimerkkikuva: festivaalin päälava kullanvärisissä valokeiloissa", blurb: "Päälavan koko valosuunnittelu: 60 valaisimen rigi, rohkea värimaailma ja pääesiintyjän settiin rakennetut cuet. [Korvaa omalla kuvauksellasi.]" },
      { title: "Esimerkki: klubiresidenssi", venue: "[KLUBI], Suomi", date: "2024–2025", role: "Operaattori", alt: "Esimerkkikuva: klubin tanssilattia ja turkoosit spotit", blurb: "Viikoittaista ohjelmointia ja ajoa pienellä klubirigillä. Nopeaa ja musikaalista live-ajoa ja tarkkoja aksentteja. [Korvaa omalla kuvauksellasi.]" },
      { title: "Esimerkki: teatteriesitys", venue: "[TEATTERI], Suomi", date: "Maaliskuu 2025", role: "Suunnittelija ja operaattori", alt: "Esimerkkikuva: teatterilava lämpimässä valossa", blurb: "Näytelmän valosuunnittelu ja ajo: tilanteista syntyvää valoa, hitaita häivytyksiä ja tarinaa seuraava väripaletti. [Korvaa omalla kuvauksellasi.]" },
      { title: "Esimerkki: areenakiertueen tuki", venue: "[AREENA], Suomi", date: "Marraskuu 2024", role: "Ripustus ja tekniikka", alt: "Esimerkkikuva: areenan trussi ja magentat valaisimet", blurb: "Ripustusta, patchausta ja valaisintarkastuksia areenakiertueen tukitiimissä. Turvallinen ja nopea pystytys sekä siisti kaapelointi. [Korvaa omalla kuvauksellasi.]" },
      { title: "Esimerkki: yrityksen lanseeraus", venue: "[PAIKKA], Suomi", date: "Syyskuu 2024", role: "Operaattori", alt: "Esimerkkikuva: yritystapahtuman lava ja valkoiset valokeilat", blurb: "Selkeää, kirkasta ja brändin mukaista valoa tuotelanseeraukseen, ohjelmoituna ja ajettuna livenä. [Korvaa omalla kuvauksellasi.]" },
      { title: "Esimerkki: valaistusuudistus", venue: "[PAIKKA], Suomi", date: "Toukokuu 2024", role: "Järjestelmäteknikko", alt: "Esimerkkikuva: tapahtumapaikan katto ja asennetut valaisimet", blurb: "Tapahtumapaikan kiinteän valaistuksen uudistus: uudet valaisimet, verkko ja DMX-jakelu, käyttöönotto ja dokumentointi. [Korvaa omalla kuvauksellasi.]" }
    ]
  },
  gear: {
    cue: "KALUSTOVUOKRAUS",
    title: "Vuokrattavaa kalustoa",
    text: "Omaa kalustoani vuokralle, teknikon kanssa tai ilman. Hinnat pyynnöstä.",
    button: "Kysy vuokrauksesta",
    subject: "Vuokraustiedustelu",
    items: [
      { name: "grandMA3 onPC Pelican-kotelossa", category: "Ohjaus", specs: ["grandMA3 onPC", "Pelican-kotelo", "Valmis käyttöön"], alt: "Kompakti grandMA3-valopöytä ja musta Pelican-kotelo, jossa se kulkee." },
      { category: "Verkko", specs: ["12 DMX-porttia", "Art-Net / sACN"], alt: "Luminex LumiNode 12: räkkiin asennettava 1U-verkkonode, jossa on näyttö, säätönuppi ja kaksitoista DMX-porttia." },
      { name: "Swisson 4-porttinen DMX-node", category: "Verkko", specs: ["4 DMX-porttia", "Art-Net / sACN"], alt: "Swisson XND-4: räkkiin asennettava 1U-node Ethernetistä DMX:ään, jossa on näyttö, säätönuppi ja neljä DMX-porttia." },
      { category: "Ohjelmisto", specs: ["grandMA3 Viz-Key", "Visualisointidongle", "Vuokralle"], alt: "grandMA3 viz-key: pieni musta USB-dongle, jossa on MA-logo." },
      { name: "Resolume Arena -lisenssi", category: "Ohjelmisto", specs: ["Resolume Arena", "Lisenssi vuokralle"], alt: "Resolume Arenan logo." },
      { name: "Capture-lisenssi", category: "Ohjelmisto", specs: ["Capture", "Lisenssi vuokralle"], alt: "Capturen logo: värikkäistä pyörteistä muodostuva rengas." },
      { category: "Mittalaitteet", specs: ["ProPlex IQ Tester LV", "Verkko- ja timecode-testeri"], alt: "ProPlex IQ Tester LV: sinimusta käsitesteri, jonka värinäytöllä näkyy timecode." },
      { category: "Efektit", specs: ["Look Solutions", "Cobra 3.1 -hazer"], alt: "Look Solutions Cobra 3.1 -hazer sinimustassa kotelossa, takana nestekanisteri." },
      { category: "Valaisimet", specs: ["LED-palkki", "Pikselimapattava"], alt: "Esimerkkikuva: Martin Sceptron -LED-palkit" },
      { category: "Valaisimet", specs: ["Martin VDO", "Atomic CLD"], alt: "Esimerkkikuva: Martin VDO Atomic CLD -valaisimet" },
      { category: "Virransyöttö", specs: ["Martin P3", "1500 W:n virtalähde"], alt: "Esimerkkikuva: Martin P3 PowerPort 1500" },
      { category: "Virransyöttö", specs: ["Martin P3", "375 W:n virtalähde"], alt: "Esimerkkikuva: Martin P3 PowerPort 375" },
      { name: "Martin P3-150 -järjestelmäohjain", category: "Ohjaus", specs: ["Martin P3", "Järjestelmäohjain"], alt: "Esimerkkikuva: Martin P3-150 -järjestelmäohjain" },
      { name: "Martin P3-050 -järjestelmäohjain", category: "Ohjaus", specs: ["Martin P3", "Järjestelmäohjain"], alt: "Esimerkkikuva: Martin P3-050 -järjestelmäohjain" }
    ]
  },
  rig: {
    cue: "CUE 3 / OSAAMINEN JA KALUSTO",
    title: "Mitä rigistä löytyy",
    groups: [
      { name: "Valopöydät" },
      { name: "Ohjelmistot" },
      { name: "Valaisimet", items: [{ label: "Liikkuvat valaisimet" }, { label: "LED-palkit" }, { label: "Seurantavalot" }, { label: "Perinteiset heittimet" }] },
      { name: "Protokollat" }
    ]
  },
  contact: {
    cue: "CUE 4 / YHTEYSTIEDOT",
    title: "Patch-lista",
    text: "Keikka, kiertue tai rigin tarkistus mielessä? Ota yhteyttä.",
    rows: [{ label: "Sähköposti" }, { label: "Puhelin" }, { label: "Sijainti", value: "Suomi" }, { label: "Saatavuus", value: "Vapaa keikoille" }],
    button: "Lähetä sähköpostia",
    buttonHref: "mailto:Roope@strobe.fi?subject=Keikkatiedustelu"
  },
  gel: {
    cue: "CUE 5 / KALVOVALITSIN",
    title: "Valitse kalvo",
    text: "Vaihda koko sivuston väri. Valintasi muistetaan.",
    current: "Kalvo: {name}",
    swatches: [{ name: "Lämmin amber" }, { name: "Kongonsininen" }, {}, {}, { name: "Syaani" }, { name: "Punainen" }, { name: "Laventeli" }]
  },
  console: { blackoutOn: "Valot päälle", locked: "Valopöytä lukittu" },
  gate: {
    title: "Rakenteilla",
    text: "Strobe Corpin uusi sivusto on vielä työn alla. Palaamme pian.",
    button: "Selvä, sisään",
    note: "Työmaalla suojakypärä on pakollinen."
  },
  footer: "© Strobe Corp. Kaikki oikeudet pidätetään.",
  ui: {
    skipLink: "Siirry sisältöön",
    introSkip: "Ohita intro",
    introEnter: "Astu valoon",
    spotCentreOff: "Sammuta keskimmäinen valo",
    spotLeftOn: "Sytytä vasen valo",
    spotRightOn: "Sytytä oikea valo",
    spotOn: "Sytytä {name} valo",
    spotOff: "Sammuta {name} valo",
    spotNames: { left: "vasen", centre: "keskimmäinen", right: "oikea" },
    heroCue: "CUE 0 / SALIVALOT",
    seeWork: "Katso työni",
    speed: "Nopeus",
    wheelSpeed: "Pyörän nopeus",
    filterAria: "Suodata projekteja",
    contactCaption: "Yhteystiedot",
    thCh: "Kan.",
    thLabel: "Tyyppi",
    thValue: "Tieto",
    accentAria: "Korostusväri",
    storyAria: "Tarinani",
    navAria: "Päävalikko",
    timecode: "Timecode-kello",
    langCode: "EN",
    langAria: "In English",
    title: { index: "Strobe Corp | Valosuunnittelija, operaattori, teknikko", about: "Minusta | Strobe Corp", gear: "Vuokrattavaa kalustoa | Strobe Corp" },
    description: { index: "Strobe Corp: valosuunnittelua, valojen ohjelmointia ja ajoa sekä valotekniikkaa.", about: "Strobe Corp: valosuunnittelija, operaattori ja teknikko Suomesta.", gear: "Vuokrattavaa valokalustoa Strobe Corpilta." }
  }
};

// ---------- Language: pick it, merge the Finnish over the English, translate the fixed texts in the page ----------
(function () {
  "use strict";
  var lang = "";
  try { lang = localStorage.getItem("strobe-lang") || ""; } catch (e) {}
  if (lang !== "fi" && lang !== "en") lang = "en";   // English unless the visitor has picked Finnish
  window.LANG = lang;
  document.documentElement.lang = lang;

  function merge(t, s) {
    var k, v, i, x;
    for (k in s) {
      v = s[k];
      if (Array.isArray(v) && Array.isArray(t[k])) {
        for (i = 0; i < v.length; i++) {
          x = v[i];
          if (x && typeof x === "object" && !Array.isArray(x) && t[k][i] && typeof t[k][i] === "object") merge(t[k][i], x);
          else if (x !== undefined && x !== null) t[k][i] = x;
        }
      } else if (v && typeof v === "object" && !Array.isArray(v) && t[k] && typeof t[k] === "object") merge(t[k], v);
      else t[k] = v;
    }
  }
  if (lang === "fi") merge(window.SITE, window.SITE_FI);

  window.setLang = function (l) {
    try { localStorage.setItem("strobe-lang", l); } catch (e) {}
    location.reload();                      // every script builds its page from SITE when it loads, so a reload is the cleanest switch
  };
  // A ready-made "FI / EN" button (it shows the language you would switch to).
  window.langButton = function () {
    var b = document.createElement("button");
    b.type = "button"; b.className = "lang-btn"; b.setAttribute("data-lang-switch", "");
    return b;
  };
  function paintLangButtons() {
    var U = window.SITE.ui;
    [].forEach.call(document.querySelectorAll("[data-lang-switch]"), function (b) {
      b.textContent = U.langCode; b.setAttribute("aria-label", U.langAria); b.setAttribute("lang", lang === "fi" ? "en" : "fi"); b.title = U.langAria;
    });
  }
  window.paintLangButtons = paintLangButtons;
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest && ev.target.closest("[data-lang-switch]");
    if (b) window.setLang(lang === "fi" ? "en" : "fi");
  });

  function get(path) {
    var o = window.SITE, p = path.split("."), i;
    for (i = 0; i < p.length && o != null; i++) o = o[p[i]];
    return typeof o === "string" ? o : null;
  }
  [].forEach.call(document.querySelectorAll("[data-i18n]"), function (e) { var t = get(e.getAttribute("data-i18n")); if (t != null) e.textContent = t; });
  [].forEach.call(document.querySelectorAll("[data-i18n-aria]"), function (e) { var t = get(e.getAttribute("data-i18n-aria")); if (t != null) e.setAttribute("aria-label", t); });
  var page = (location.pathname.split("/").pop() || "index.html").replace(/\.html$/, "") || "index";
  if (page !== "index" && page !== "about" && page !== "gear") page = "index";
  var U = window.SITE.ui;
  if (U.title && U.title[page]) document.title = U.title[page];
  var md = document.querySelector('meta[name="description"]');
  if (md && U.description && U.description[page]) md.setAttribute("content", U.description[page]);
  paintLangButtons();
})();
