// All site text and projects live here. Edit this file to change the site.
// Placeholders in [BRACKETS] must be replaced with real details.
window.SITE = {
  brand: "Strobe Corp",
  role: "Lighting Designer · Operator · Technician",
  tagline: "Shaping rooms with light.",

  nav: [
    { id: "work", label: "Work" },
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
      "Off the clock I'm the one still re-focusing a fixture after the crowd has gone home."
    ],
    more: "More about me",
    stats: [
      { value: "{years:2022}", label: "Years on the road" },
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
      "I hit the road in 2022 as a full-time professional, and I have been designing, programming and rigging light ever since. [Tell your story here.]",
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
      { year: "2022", text: "Started on the road as a full-time professional lighting technician. [Replace]" },
      { year: "2023", text: "First festival season. [Replace]" },
      { year: "2024", text: "Arena tour support and club residency. [Replace]" },
      { year: "Now", text: "Designing, operating and renting out gear. [Replace]" }
    ],
    cta: "Let's work together",
    ctaHref: "mailto:Roope@strobe.fi?subject=Booking%20enquiry"
  },

  work: {
    cue: "CUE 2 / WORK",
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
    universe: "U1",
    channel: "CH"
  },

  // The first screen shown on every page until the secret word is typed (see gate.js)
  gate: {
    title: "Under construction",
    text: "The new Strobe Corp site is being built. Back soon."
  },

  footer: "© Strobe Corp. All rights reserved."
};
