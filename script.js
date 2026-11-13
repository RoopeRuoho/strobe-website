// TEMP: "Replay intro" dev button. Remove with the button in index.html before launch.
(function () {
  var b = document.getElementById("replayTemp");
  if (!b) return;
  b.addEventListener("click", function () {
    try { sessionStorage.removeItem("strobe-intro-seen"); } catch (err) {}
    window.scrollTo(0, 0);
    location.reload();
  });
})();

// Heavy work (loading and decoding the project pictures) waits until the intro is over, so it cannot make the intro stutter.
window.__afterIntro = (function () {
  var root = document.documentElement, queue = [], watching = false;
  function flush() { var q = queue; queue = []; q.forEach(function (fn) { fn(); }); }
  return function (fn) {
    if (!root.classList.contains("intro-pending")) { fn(); return; }
    queue.push(fn);
    if (watching) return;
    watching = true;
    var mo = new MutationObserver(function () { if (!root.classList.contains("intro-pending")) { mo.disconnect(); flush(); } });
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
  };
})();

// Renders everything from content.js, then runs the intro (second block below).
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;

  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function setText(id, text) { $(id).textContent = text; }

  // Header and hero
  $("logo").textContent = S.brand;
  var nav = $("nav");
  S.nav.forEach(function (item) {
    var a = el("a", null, item.label);
    a.href = item.href || "#" + item.id;
    nav.appendChild(a);
  });
  // The hero title is built from letters so they can light up one by one like a cue (see .ch in style.css).
  var ht = $("hero-title"), idx = 0;
  var oAt = S.brand.replace(/\s/g, "").toLowerCase().indexOf("o");      // the first "o": the intro dive lands on it
  ht.setAttribute("aria-label", S.brand);
  S.brand.split(" ").forEach(function (word, wi, all) {
    var w = el("span", "w");
    w.setAttribute("aria-hidden", "true");
    word.split("").forEach(function (chr) {
      var c = el("span", "ch", chr);
      c.style.setProperty("--i", Math.abs(idx - Math.max(oAt, 0)));      // the letters light up outward from the "o"
      if (idx === oAt) c.className += " o-focus";
      idx++;
      w.appendChild(c);
    });
    ht.appendChild(w);
    if (wi < all.length - 1) ht.appendChild(document.createTextNode(" "));
  });
  window.__heroLive = function (base) {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.style.setProperty("--hbase", base);
    document.documentElement.classList.add("hero-live");
  };
  if (!document.documentElement.classList.contains("intro-pending")) requestAnimationFrame(function () { window.__heroLive(".35s"); });
  setText("hero-role", S.role);
  setText("hero-tagline", S.tagline);

  // About
  setText("about-cue", S.about.cue);
  setText("about-title", S.about.title);
  S.about.paragraphs.forEach(function (p) { $("about-text").appendChild(el("p", null, p)); });
  S.about.stats.forEach(function (s) {
    var row = el("div", "stat");
    // "{years:2022}" = this year minus 2022, so the number grows on its own
    var ym = /^\{years:(\d{4})\}$/.exec(s.value);
    var shown = ym ? String(Math.max(0, new Date().getFullYear() - parseInt(ym[1], 10))) : s.value;
    row.appendChild(el("dd", "stat-value", shown));
    row.appendChild(el("dt", "stat-label", s.label));
    $("about-stats").appendChild(row);
  });

  if (S.about.more) setText("about-more", S.about.more);

  // Work
  setText("work-cue", S.work.cue);
  setText("work-title", S.work.title);
  S.work.filters.forEach(function (f, i) {
    var b = el("button", "filter", f);
    b.type = "button";
    b.dataset.filter = f;
    b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    $("work-filters").appendChild(b);
  });
  S.work.projects.forEach(function (p) {
    var li = el("li", "card");
    li.dataset.category = p.category;
    li.dataset.id = p.id;
    var fig = el("div", "card-media");
    var img = el("img");
    img.alt = p.alt;
    img.width = 800;
    img.height = 500;
    img.loading = "lazy"; img.decoding = "async";
    window.__afterIntro(function () { img.src = p.image; });
    fig.appendChild(img);
    var body = el("div", "card-body");
    body.appendChild(el("p", "card-tag", p.category));
    body.appendChild(el("h3", "card-title", p.title));
    body.appendChild(el("p", "card-meta", p.venue + " · " + p.date));
    body.appendChild(el("p", "card-role", p.role));
    // the whole card is one button that opens the lightbox
    var btn = el("button", "card-btn");
    btn.type = "button";
    btn.setAttribute("aria-haspopup", "dialog");
    btn.setAttribute("aria-label", "Open " + p.title + ", " + p.venue);
    btn.appendChild(fig);
    btn.appendChild(body);
    li.appendChild(btn);
    $("work-grid").appendChild(li);
  });

  // Rig (static faders)
  setText("rig-cue", S.rig.cue);
  setText("rig-title", S.rig.title);
  S.rig.groups.forEach(function (g) {
    var wrap = el("div", "rig-group");
    wrap.appendChild(el("h3", "rig-name", g.name));
    var ul = el("ul", "faders");
    g.items.forEach(function (it) {
      var li = el("li", "fader");
      li.style.setProperty("--level", it.level + "%");
      li.appendChild(el("span", "fader-label", it.label));
      var track = el("span", "fader-track");
      track.setAttribute("aria-hidden", "true");
      track.appendChild(el("span", "fader-fill"));
      li.appendChild(track);
      li.appendChild(el("span", "fader-val", String(it.level)));
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    $("rig-groups").appendChild(wrap);
  });

  // Gel picker (static markup, no behaviour yet)
  setText("gel-cue", S.gel.cue);
  setText("gel-title", S.gel.title);
  setText("gel-text", S.gel.text);
  S.gel.swatches.forEach(function (s, i) {
    var b = el("button", "swatch");
    b.type = "button";
    b.style.setProperty("--gel", s.value);
    b.setAttribute("aria-label", s.name);
    b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    b.title = s.name;
    $("gel-swatches").appendChild(b);
  });

  // Contact
  setText("contact-cue", S.contact.cue);
  setText("contact-title", S.contact.title);
  setText("contact-text", S.contact.text);
  var tbody = $("contact-table").querySelector("tbody");
  S.contact.rows.forEach(function (r) {
    var tr = el("tr");
    tr.appendChild(el("td", "patch-ch", r.channel));
    tr.appendChild(el("th", "patch-label", r.label));
    tr.firstChild.nextSibling.scope = "row";
    var td = el("td", "patch-val");
    if (r.href) {
      var a = el("a", null, r.value);
      a.href = r.href;
      td.appendChild(a);
    } else {
      td.textContent = r.value;
    }
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
  var btn = $("contact-btn");
  btn.textContent = S.contact.button;
  btn.href = S.contact.buttonHref;

  setText("footer-text", S.footer);
})();

// Stage 3: Work filter, lightbox and hover lighting.
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;
  var grid = document.getElementById("work-grid"), filtersEl = document.getElementById("work-filters");
  var status = document.getElementById("work-status"), dlg = document.getElementById("lightbox");
  var cards = [].slice.call(grid.children);
  var T = S.work.lightbox || {};
  var byId = {};
  S.work.projects.forEach(function (p) { byId[p.id] = p; });

  /* ----- filter ----- */
  function matches(card, f) { return f === "All" || card.dataset.category === f; }
  function visibleCards() { return cards.filter(function (c) { return !c.hidden && !c.classList.contains("is-out"); }); }

  function applyFilter(f) {
    var shown = 0;
    cards.forEach(function (card) {
      if (matches(card, f)) {
        shown++;
        if (card.hidden) {
          card.classList.add("is-out");
          card.hidden = false;
          void card.offsetWidth;                       // let the browser register the start state, then fade in
          card.classList.remove("is-out");
        } else {
          card.classList.remove("is-out");
        }
      } else if (!card.hidden) {
        card.classList.add("is-out");
        setTimeout(function () { if (card.classList.contains("is-out")) card.hidden = true; }, 260);
      }
    });
    if (status && S.work.status) status.textContent = S.work.status.replace("{n}", shown).replace("{filter}", f === "All" ? "" : f.toLowerCase()).replace("  ", " ");
  }
  filtersEl.addEventListener("click", function (ev) {
    var b = ev.target.closest(".filter");
    if (!b) return;
    [].forEach.call(filtersEl.querySelectorAll(".filter"), function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
    applyFilter(b.dataset.filter);
  });

  /* ----- lightbox ----- */
  var els = {
    img: document.getElementById("lb-img"), cat: document.getElementById("lb-cat"), title: document.getElementById("lb-title"),
    meta: document.getElementById("lb-meta"), blurb: document.getElementById("lb-blurb"), count: document.getElementById("lb-count"),
    prev: document.getElementById("lb-prev"), next: document.getElementById("lb-next"), close: document.getElementById("lb-close")
  };
  var current = null, opener = null;

  function fill(card) {
    var p = byId[card.dataset.id];
    current = card;
    opener = card.querySelector(".card-btn");       // focus returns to the card you last looked at
    els.img.classList.remove("in");
    els.img.src = p.image;
    els.img.alt = p.alt;
    els.cat.textContent = p.category;
    els.title.textContent = p.title;
    els.meta.innerHTML = "";
    [[T.venue || "Venue", p.venue], [T.date || "Date", p.date], [T.role || "Role", p.role]].forEach(function (row) {
      var dt = document.createElement("dt"), dd = document.createElement("dd");
      dt.textContent = row[0]; dd.textContent = row[1];
      els.meta.appendChild(dt); els.meta.appendChild(dd);
    });
    els.blurb.textContent = p.blurb || "";
    var vis = visibleCards(), i = vis.indexOf(card);
    els.count.textContent = (T.count || "{n} / {m}").replace("{n}", i + 1).replace("{m}", vis.length);
    els.prev.disabled = vis.length < 2;
    els.next.disabled = vis.length < 2;
    requestAnimationFrame(function () { els.img.classList.add("in"); });
  }
  function open(card) {
    opener = card.querySelector(".card-btn");
    fill(card);
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function step(dir) {
    var vis = visibleCards();
    if (vis.length < 2) return;
    var i = vis.indexOf(current);
    fill(vis[(i + dir + vis.length) % vis.length]);
  }
  grid.addEventListener("click", function (ev) {
    var btn = ev.target.closest(".card-btn");
    if (btn) open(btn.parentNode);
  });
  els.close.addEventListener("click", function () { dlg.close(); });
  els.prev.addEventListener("click", function () { step(-1); });
  els.next.addEventListener("click", function () { step(1); });
  dlg.addEventListener("click", function (ev) { if (ev.target === dlg) dlg.close(); });     // click on the backdrop
  dlg.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowLeft") { ev.preventDefault(); step(-1); }
    if (ev.key === "ArrowRight") { ev.preventDefault(); step(1); }
  });
  dlg.addEventListener("close", function () { if (opener) opener.focus(); });
  els.close.setAttribute("aria-label", T.close || "Close");
  els.prev.setAttribute("aria-label", T.prev || "Previous project");
  els.next.setAttribute("aria-label", T.next || "Next project");

  /* ----- hover lighting: the card under the cursor is lit like a profile spot, the others dim ----- */
  grid.addEventListener("pointermove", function (ev) {
    var card = ev.target.closest(".card");
    if (!card) return;
    var r = card.querySelector(".card-media").getBoundingClientRect();
    card.style.setProperty("--mx", (ev.clientX - r.left).toFixed(0) + "px");
    card.style.setProperty("--my", (ev.clientY - r.top).toFixed(0) + "px");
  }, { passive: true });
})();

// Stage 4: faders, gel picker, blackout and DMX readout.
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function pad(n, w) { n = String(n); while (n.length < w) n = "0" + n; return n; }

  /* ----- faders: slide up to their level (and count up) when they scroll into view ----- */
  var groups = [].slice.call(document.querySelectorAll(".rig-group"));
  function runFaders(group) {
    if (group.classList.contains("in")) return;
    group.classList.add("in");
    [].forEach.call(group.querySelectorAll(".fader"), function (f, i) {
      var target = parseInt(f.querySelector(".fader-val").textContent, 10) || 0, out = f.querySelector(".fader-val");
      if (reduce) { out.textContent = target; return; }
      var t0 = null, delay = i * 90, dur = 1100;
      function step(now) {
        if (t0 === null) t0 = now;
        var p = Math.min(1, Math.max(0, (now - t0 - delay) / dur));
        out.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      out.textContent = 0;
      requestAnimationFrame(step);
    });
  }
  [].forEach.call(document.querySelectorAll(".fader"), function (f, i) { f.style.setProperty("--d", ((i % 4) * 90) + "ms"); });
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { runFaders(en.target); io.unobserve(en.target); } });
    }, { threshold: .35 });
    groups.forEach(function (g) { io.observe(g); });
  } else {
    groups.forEach(runFaders);
  }

  /* ----- gel picker: swap the accent colour live, remember it ----- */
  var KEY = "strobe-gel", wrap = $("gel-swatches"), nameEl = $("gel-name");
  var swatches = [].slice.call(wrap.querySelectorAll(".swatch"));
  function setGel(i, save) {
    var sw = S.gel.swatches[i];
    if (!sw) return;
    if (!reduce) { root.classList.add("gel-shift"); clearTimeout(setGel.t); setGel.t = setTimeout(function () { root.classList.remove("gel-shift"); }, 800); }
    root.style.setProperty("--accent", sw.value);
    swatches.forEach(function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });
    nameEl.textContent = (S.gel.current || "{name}").replace("{name}", sw.name);
    if (save) { try { localStorage.setItem(KEY, sw.value); } catch (e) {} }
  }
  wrap.addEventListener("click", function (ev) {
    var b = ev.target.closest(".swatch");
    if (b) setGel(swatches.indexOf(b), true);
  });
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  var start = 0;
  S.gel.swatches.forEach(function (sw, i) { if (saved && sw.value.toLowerCase() === saved.toLowerCase()) start = i; });
  setGel(start, false);
  if (!saved) root.style.removeProperty("--accent");           // nothing chosen yet: keep the stylesheet default

  /* ----- blackout: all the lights go out, the switch stays ----- */
  var btn = $("blackout"), C = S.console || {};
  btn.textContent = C.blackout || "Blackout";
  btn.addEventListener("click", function () {
    var on = root.classList.toggle("is-blackout");
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  });
  $("dmx-u").textContent = C.universe || "U1";
  $("dmx-c").textContent = C.channel || "CH";

  /* ----- DMX readout: channel follows scroll position, level follows scroll speed ----- */
  var chEl = $("dmx-ch"), valEl = $("dmx-val"), fill = $("dmx-fill");
  var lastY = window.scrollY, lvl = 0, raf = 0;
  function frame() {
    var y = window.scrollY, max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    chEl.textContent = pad(1 + Math.round(Math.min(1, Math.max(0, y / max)) * 511), 3);
    var dv = Math.abs(y - lastY);
    lastY = y;
    lvl = Math.max(lvl * .9, Math.min(255, dv * 5));
    valEl.textContent = pad(Math.round(lvl), 3);
    fill.style.transform = "scaleX(" + (lvl / 255).toFixed(3) + ")";
    raf = (lvl > .5 || dv > 0) ? requestAnimationFrame(frame) : 0;
  }
  window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(frame); }, { passive: true });
  window.addEventListener("resize", function () { if (!raf) raf = requestAnimationFrame(frame); });
  frame();
})();

// Gobo wheel: the selected work rides on a slowly turning wheel above the grid.
(function () {
  "use strict";
  var S = window.SITE;
  var stage = document.getElementById("goboStage"), wheel = document.getElementById("goboWheel");
  if (!S || !stage || !wheel) return;
  var capEl = document.getElementById("goboCap"), playBtn = document.getElementById("goboPlay");
  var prevBtn = document.getElementById("goboPrev"), nextBtn = document.getElementById("goboNext"), box = document.getElementById("gobo");
  var P = S.work.projects, L = S.work.gobo || {};
  var screen = document.getElementById("goboScreen"), layers = [document.getElementById("goboLayerA"), document.getElementById("goboLayerB")];
  var beamEl = document.getElementById("goboBeam"), layerOn = 0, shownId = null, activeProj = P[0];
  var dustDpr = 1, hole = { x: 0, y: 0, r: 0 }, holeDrawn = { x: 1e9, y: 0, r: 0 }, bg = 1, bgPrev = 1, bu0 = 0, bu1 = 1, beamCols = null, BEAM_H = 170, beamDw = 110, beamTimer = 0, posterImg = null, lastBest = 0, angPrev = 0, dirNow = 1;
  var sCv = document.createElement("canvas"); sCv.width = 48; sCv.height = 27;
  var sCtx = sCv.getContext("2d", { willReadFrequently: true });
  if (L.aspect) screen.style.setProperty("--aspect", L.aspect);
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var total = P.length * Math.max(1, Math.ceil(12 / P.length)), step = 360 / total, SPEED = 4.2, manual = false;   // degrees per second
  var discs = [], ang = 0, target = 0, playing = !reduce, hover = false, visible = true, raf = 0, last = 0, W = 0, R = 0, size = 0, dsz = 0, activeI = -1;
  box.setAttribute("aria-label", L.label || "Selected work");
  prevBtn.setAttribute("aria-label", L.prev || "Previous");
  nextBtn.setAttribute("aria-label", L.next || "Next");

  P.forEach(function () {});
  for (var i = 0; i < total; i++) (function (i) {
    var p = P[i % P.length];
    var b = document.createElement("button");
    b.type = "button"; b.className = "gobo-disc";
    b.setAttribute("aria-label", (L.open || "Open") + " " + p.title);
    if (i >= P.length) { b.setAttribute("aria-hidden", "true"); b.tabIndex = -1; }       // repeats are for show only
    var im = document.createElement("img");
    im.alt = ""; im.width = 400; im.height = 400; im.loading = "lazy"; im.decoding = "async"; im.draggable = false;
    window.__afterIntro(function () { im.src = p.image; });
    b.appendChild(im);
    b.addEventListener("click", function () { if (justDragged) return; openProject(p.id); });
    wheel.appendChild(b);
    discs.push(b);
  })(i);

  function openProject(id) {
    var card = document.querySelector('.card[data-id="' + id + '"]');
    if (!card) return;
    function go() { var cb = card.querySelector(".card-btn"); if (cb) cb.click(); }
    if (card.hidden || card.classList.contains("is-out")) {         // a filter is hiding it: show all, then open
      var all = document.querySelector('.filter[data-filter="All"]');
      if (all) all.click();
      setTimeout(go, 320);
    } else go();
  }

  function layout() {
    W = stage.clientWidth;
    dsz = Math.max(130, Math.min(240, W * .21));
    R = Math.max(W * .66, 480);
    size = 2 * (R + dsz * .8);
    stage.style.height = Math.round(dsz * 1.7 + 32) + "px";
    wheel.style.width = wheel.style.height = size + "px";
    wheel.style.left = (W / 2 - size / 2) + "px";
    wheel.style.top = (dsz * .85 + 14 + R - size / 2) + "px";
    box.style.setProperty("--ov", Math.round(dsz * .85 + 14) + "px");   // the haze beam reaches down to the active disc
    beamDw = dsz * 1.15;                                            // the beam leaves the lens: as wide as the gobo
    var bw = Math.max(200, Math.round(screen.getBoundingClientRect().width || stage.clientWidth * .64)), dpr = Math.min(1.5, window.devicePixelRatio || 1);
    // The beam is drawn at 0.4 of its size and scaled up smoothly by the browser: that is its softness. (A CSS blur filter on this canvas
    // was shown at the wrong place by some browsers, which left a dark gap beside the disc.)
    beamEl.width = Math.max(40, Math.round(bw * .4)); beamEl.height = Math.max(20, Math.round(BEAM_H * .4));
    dustDpr = dpr;
    beamEl.style.height = BEAM_H + "px";
    paintBeam();
    discs.forEach(function (d, i) {
      var a = i * step * Math.PI / 180;
      d.style.width = d.style.height = dsz + "px";
      d.style.left = (size / 2 + R * Math.sin(a) - dsz / 2) + "px";
      d.style.top = (size / 2 - R * Math.cos(a) - dsz / 2) + "px";
    });
    draw();
  }

  function draw() {
    wheel.style.transform = "rotate(" + ang.toFixed(3) + "deg)";
    var best = 1e9, bi = 0, bSigned = 0;
    discs.forEach(function (d, i) {
      var da = ((i * step + ang) % 360 + 540) % 360 - 180;          // angle from the top, -180..180
      var near = Math.max(0, 1 - Math.abs(da) / (step * 1.1));
      d.style.transform = "rotate(" + (-ang).toFixed(3) + "deg) scale(" + (1 + .28 * near * near).toFixed(3) + ")";
      d.style.opacity = (Math.abs(da) > 62 ? 0 : 1 - Math.max(0, Math.abs(da) - 42) / 20).toFixed(2);
      if (Math.abs(da) < best) { best = Math.abs(da); bi = i; bSigned = da; }
    });
    var dAng = ang - angPrev; if (Math.abs(dAng) > .01) dirNow = dAng > 0 ? 1 : -1; angPrev = ang;   // which way the wheel is turning
    // The plate pushes the picture to black. Light only passes where a disc overlaps the fixed aperture: as the disc
    // leaves, its edge sweeps across the picture (in the direction the wheel moves) and the beam is cut by the same edge.
    lastBest = best;
    var spacing = step * Math.PI / 180 * R, apr = Math.min(.9 * dsz, Math.max(.25 * dsz, .8 * (spacing - dsz)));
    var off = bSigned * Math.PI / 180 * R, lo = Math.max(-apr / 2, off - dsz / 2), hi = Math.min(apr / 2, off + dsz / 2), u0 = .5, u1 = .5;
    if (hi > lo) { u0 = (lo + apr / 2) / apr; u1 = (hi + apr / 2) / apr; }
    // A lens turns the picture round: the picture is mirrored left to right relative to the gobo. So the plate edge that leaves with the
    // wheel pushes the light to black from the side the wheel is heading to, and the picture slides the opposite way to the wheel.
    var uT = u0; u0 = 1 - u1; u1 = 1 - uT;
    var gw = Math.min(1, Math.max(0, (u1 - u0 - .04) / .16)); bg = gw * gw * (3 - 2 * gw);   // a sliver of light between two gobos is shut off completely
    box.style.setProperty("--g", bg.toFixed(3));
    box.style.setProperty("--sh", (-off / spacing * .3 * (screen.clientWidth || 600)).toFixed(1) + "px");   // the picture travels with the wheel, continuously
    beamDw = apr;                                                    // rays start at the lit window, the same width as the aperture
    var F = .1, m0 = u0 - F * (1 - u0), m1 = u1 - F * (1 - u1);   // soft feather on the pushing edge (none when fully open)
    box.style.setProperty("--m0", (m0 * 100).toFixed(2) + "%");
    box.style.setProperty("--m0e", ((m0 + F) * 100).toFixed(2) + "%");
    box.style.setProperty("--m1", (m1 * 100).toFixed(2) + "%");
    box.style.setProperty("--m1e", ((m1 + F) * 100).toFixed(2) + "%");
    // The lamp is behind the wheel: the beam is only visible beyond the disc that is lined up with it. The disc's outline (its real
    // position, size and ring) is cut out of the beam, so the light seems to come from behind the disc and out past its top edge.
    var nearB = Math.max(0, 1 - best / (step * 1.1)), hx = off, hy = R * (1 - Math.cos(bSigned * Math.PI / 180)), hr = dsz / 2 * (1 + .28 * nearB * nearB);
    // Compared with what was DRAWN last (not with the previous frame: at a slow turn the disc moves a fraction of a pixel per frame, so a
    // frame-to-frame check never fires and the beam would be left behind, then jump).
    var holeMoved = Math.abs(hx - holeDrawn.x) > .3 || Math.abs(hy - holeDrawn.y) > .3 || Math.abs(hr - holeDrawn.r) > .3;
    hole.x = hx; hole.y = hy; hole.r = hr;
    if (holeMoved || Math.abs(u0 - bu0) > .003 || Math.abs(u1 - bu1) > .003 || Math.abs(bg - bgPrev) > .01) { bu0 = u0; bu1 = u1; bgPrev = bg; holeDrawn.x = hx; holeDrawn.y = hy; holeDrawn.r = hr; renderBeam(); }
    box.style.setProperty("--open", Math.max(0, u1 - u0).toFixed(3));
    if (bi !== activeI) {
      if (activeI >= 0) discs[activeI].classList.remove("is-on");
      activeI = bi; discs[bi].classList.add("is-on");
      var p = P[bi % P.length];
      capEl.textContent = p.title + " · " + p.category;
      project(p);
    }
  }

  // The haze beam shows what is on the screen: the picture (or the current video frame) is sampled into columns
  // and every column becomes a ray from the disc to the screen, so colour and brightness follow the content.
  function mediaNow() {
    var m = layers[layerOn].firstChild;
    if (m && m.tagName === "VIDEO" && m.readyState < 2) return posterImg && posterImg.complete ? posterImg : null;
    if (m && m.tagName === "IMG" && !m.complete) return null;
    return m;
  }
  function paintBeam() {
    var N = 48, i, cols = null, m = mediaNow();
    if (m) {
      try {
        sCtx.drawImage(m, 0, 0, 48, 27);
        var d = sCtx.getImageData(0, 0, 48, 27).data, x, y, r, g, b, o, per = 48 / N;
        cols = [];
        for (i = 0; i < N; i++) {
          r = g = b = 0;
          for (x = Math.floor(i * per); x < Math.floor((i + 1) * per); x++) for (y = 0; y < 27; y++) { o = (y * 48 + x) * 4; r += d[o]; g += d[o + 1]; b += d[o + 2]; }
          var n = per * 27; cols.push([r / n, g / n, b / n]);
        }
      } catch (e) { cols = null; }                                  // e.g. a file:// page: the image can't be read, use a plain glow
    }
    beamCols = cols; renderBeam();
  }
  // The beam is a cone of lit haze. Its picture is a 1 x N strip of colour (one pixel per column of the screen image). Every row of
  // the cone is that strip stretched across the width of the cone at that height, so colour blends smoothly between columns instead
  // of showing 48 hard-edged bars. Near the lamp the strip is sharp; further away it is a blurred copy, because haze scatters the
  // pattern as the light travels. Brightness falls off with distance from the lamp, and the sides of the cone are soft.
  // Four strips: sharp and scattered, each with the plate window applied (what reaches the screen) and without it (the light right at
  // the lamp, which is lit all over the gobo). A row blends between the two, so the cone is whole at the disc and is shaped by the
  // moving plate edge only further out. That keeps the beam glued to the disc while the wheel turns.
  var stripA = document.createElement("canvas"), stripB = document.createElement("canvas"), stripC = document.createElement("canvas"), stripD = document.createElement("canvas");
  stripA.width = stripB.width = stripC.width = stripD.width = 48; stripA.height = stripB.height = stripC.height = stripD.height = 1;
  var glowCol = [255, 190, 80, 0], hazeCv = document.createElement("canvas");
  function ss(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * (3 - 2 * x); }
  function buildStrips() {
    var N = 48, i, cols = beamCols, F2 = .1, A = stripA.getContext("2d").createImageData(N, 1);
    var full = Math.min(1, .35 + .65 * Math.max(0, bu1 - bu0));       // the whole cone gets dimmer as the plate covers more of the lamp
    function makeP(useWin) {
      var P = [];
      for (i = 0; i < N; i++) {
        var c = cols ? cols[i] : null, lum = c ? (.2126 * c[0] + .7152 * c[1] + .0722 * c[2]) / 255 : .5;
        var rr = c ? Math.min(255, c[0] * 1.6 + 24) : 255, gg = c ? Math.min(255, c[1] * 1.6 + 24) : 190, bb = c ? Math.min(255, c[2] * 1.6 + 24) : 80;
        var cc = (i + .5) / N, wl = useWin ? ss((cc - bu0) / F2 + .5) : 1, wr = useWin ? ss((bu1 - cc) / F2 + .5) : 1;
        var edge = ss(cc / .07) * ss((1 - cc) / .07);                  // the sides of the cone are soft
        var a = Math.min(1, .16 + .8 * Math.pow(lum, .7)) * wl * wr * bg * edge * (useWin ? 1 : full);
        P.push([rr * a, gg * a, bb * a, a]);                           // premultiplied, so it can be blurred without dark fringes
      }
      return P;
    }
    function blurOf(P) {
      var out = [], k, n, j, q;
      for (i = 0; i < N; i++) {
        var t = [0, 0, 0, 0]; n = 0;
        for (j = -4; j <= 4; j++) { k = i + j; if (k < 0 || k >= N) continue; var wgt = 1 - Math.abs(j) / 5; for (q = 0; q < 4; q++) t[q] += P[k][q] * wgt; n += wgt; }
        out.push([t[0] / n, t[1] / n, t[2] / n, t[3] / n]);
      }
      return out;
    }
    function put(cv, arr) {
      var d = A.data;
      for (var x = 0; x < N; x++) { var p = arr[x], al = p[3]; d[x * 4] = al > .001 ? Math.min(255, p[0] / al) : 0; d[x * 4 + 1] = al > .001 ? Math.min(255, p[1] / al) : 0; d[x * 4 + 2] = al > .001 ? Math.min(255, p[2] / al) : 0; d[x * 4 + 3] = Math.min(255, al * 255); }
      cv.getContext("2d").putImageData(A, 0, 0);
    }
    var PW = makeP(true), PF = makeP(false), sa = 0, sr = 0, sg = 0, sb = 0;
    for (i = 0; i < N; i++) { sr += PW[i][0]; sg += PW[i][1]; sb += PW[i][2]; sa += PW[i][3]; }
    glowCol = sa > .001 ? [sr / sa, sg / sa, sb / sa, Math.min(1, sa / N * 1.7)] : [255, 190, 80, 0];   // average colour and strength of the lit window
    put(stripA, PW); put(stripB, blurOf(PW)); put(stripC, PF); put(stripD, blurOf(PF));
  }
  function renderBeam() {
    var ctx = beamEl.getContext("2d"), W2 = beamEl.width, H2 = beamEl.height;
    if (!ctx || !W2) return;
    ctx.clearRect(0, 0, W2, H2);
    var scale = W2 / (beamEl.clientWidth || W2), apex = Math.max(beamDw, hole.r * 1.6) * scale, cx = W2 / 2, cxa = cx + hole.x * scale, ROW = Math.max(1, Math.round(2 * scale)), y;
    if (bg > .004 && bu1 > bu0) {
      buildStrips();
      ctx.globalCompositeOperation = "lighter";
      ctx.imageSmoothingEnabled = true;
      for (y = 0; y < H2; y += ROW) {
        var sN = (y + ROW / 2) / H2;                               // 0 at the screen, 1 at the lamp
        var left = sN * (cxa - apex / 2), right = (1 - sN) * W2 + sN * (cxa + apex / 2);
        var al = 1.45 * (.5 + .95 * Math.pow(sN, 1.2));                // falls off with distance from the lamp (a pass can be at most 1, so strong rows draw twice)
        var sharp = ss(sN * 1.35);                                     // sharp near the lamp, scattered far away
        var wW = 1, wF = 0;                                             // the beam is only where the screen is lit: it takes the shape of the plate window along its whole length
        var rw = right - left;
        for (var pass = 0; pass < 2 && al > 0; pass++, al -= 1) {
          var pa = Math.min(1, al);
          if (wW * sharp > .01) { ctx.globalAlpha = pa * sharp * wW; ctx.drawImage(stripA, 0, 0, 48, 1, left, y, rw, ROW); }
          if (wW * (1 - sharp) > .01) { ctx.globalAlpha = pa * (1 - sharp) * wW; ctx.drawImage(stripB, 0, 0, 48, 1, left, y, rw, ROW); }
          if (wF * sharp > .01) { ctx.globalAlpha = pa * sharp * wF; ctx.drawImage(stripC, 0, 0, 48, 1, left, y, rw, ROW); }
          if (wF * (1 - sharp) > .01) { ctx.globalAlpha = pa * (1 - sharp) * wF; ctx.drawImage(stripD, 0, 0, 48, 1, left, y, rw, ROW); }
        }
      }
      ctx.globalAlpha = 1;
    }
    // The air right around the lamp is lit too (haze scatters light in every direction), so no black gap is left between the disc and the cone.
    if (bg > .004 && bu1 > bu0 && glowCol[3] > .01) {
      var hz = hazeCv, hc, gx = cx + hole.x * scale, gy = H2 + hole.y * scale, gr = Math.max(1, hole.r * 1.75 * scale);
      if (hz.width !== W2 || hz.height !== H2) { hz.width = W2; hz.height = H2; }
      hc = hz.getContext("2d"); hc.globalCompositeOperation = "source-over"; hc.clearRect(0, 0, W2, H2);
      var rg = hc.createRadialGradient(gx, gy, Math.min(hole.r * .8 * scale, gr - .5), gx, gy, gr), rgb = (glowCol[0] | 0) + "," + (glowCol[1] | 0) + "," + (glowCol[2] | 0), ga = glowCol[3] * bg * Math.pow(Math.max(0, bu1 - bu0), 2);
      rg.addColorStop(0, "rgba(" + rgb + "," + (.5 * ga).toFixed(3) + ")"); rg.addColorStop(.4, "rgba(" + rgb + "," + (.22 * ga).toFixed(3) + ")"); rg.addColorStop(1, "rgba(" + rgb + ",0)");
      hc.fillStyle = rg; hc.fillRect(0, 0, W2, H2);
      hc.globalCompositeOperation = "destination-in";                  // it fades out towards the lower edge, where the wheel's plate takes over
      var vg = hc.createLinearGradient(0, 0, 0, H2); vg.addColorStop(0, "rgba(0,0,0,1)"); vg.addColorStop(.7, "rgba(0,0,0,1)"); vg.addColorStop(1, "rgba(0,0,0,0)");
      hc.fillStyle = vg; hc.fillRect(0, 0, W2, H2);
      ctx.globalCompositeOperation = "lighter"; ctx.drawImage(hz, 0, 0);
    }
    ctx.globalCompositeOperation = "destination-out";                 // the disc is in front of the lamp: nothing shines over it
    ctx.fillStyle = "#000";
    var hx = cx + hole.x * scale, hy = H2 + hole.y * scale, hg = ctx.createRadialGradient(hx, hy, Math.max(0, hole.r - 9) * scale, hx, hy, Math.max(.5, hole.r - 1) * scale);   // radii must never be negative (hole.r is 0 before the first layout)
    hg.addColorStop(0, "rgba(0,0,0,1)"); hg.addColorStop(1, "rgba(0,0,0,0)");   // the light wraps over the dark ring a little: no black gap round the glass
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.arc(hx, hy, Math.max(.5, hole.r - 1) * scale, 0, 6.2832); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  // Dust and haze particles drifting through the beam: they are only visible where the light is, and they make the cone read as air.
  var dustEl = document.createElement("canvas"), dust = [], dustT = 0, dustRaf = 0;
  dustEl.className = "gobo-dust"; dustEl.setAttribute("aria-hidden", "true");
  beamEl.parentNode.appendChild(dustEl);
  // The motes hang in the air (they have a fixed place in the room): the cone of light sweeps over them as the wheel turns, so they
  // light up and go dark instead of travelling with the beam.
  for (var di = 0; di < 46; di++) dust.push({ x: Math.random(), s: Math.random(), v: .014 + Math.random() * .03, r: .5 + Math.random() * 1.1, ph: Math.random() * 6.28, sw: .004 + Math.random() * .012, tw: .6 + Math.random() * 1.4 });
  function dustFrame(now) {
    dustRaf = 0;
    if (!visible || document.hidden) return;
    var W2 = Math.max(40, Math.round((beamEl.clientWidth || 300) * dustDpr)), H2 = Math.max(20, Math.round(BEAM_H * dustDpr));
    if (dustEl.width !== W2) dustEl.width = W2;
    if (dustEl.height !== H2) dustEl.height = H2;
    var ctx = dustEl.getContext("2d");
    ctx.clearRect(0, 0, W2, H2);
    var dt = Math.min(.1, (now - (dustT || now)) / 1000); dustT = now;
    if (bg > .02 && bu1 > bu0) {
      var scale = W2 / (beamEl.clientWidth || W2), apex = Math.max(beamDw, hole.r * 1.6) * scale, cx = W2 / 2, cxa = cx + hole.x * scale, F2 = .1;
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < dust.length; i++) {
        var p = dust[i];
        p.s -= p.v * dt;                                               // a slow draught carries the motes up towards the screen
        if (p.s < 0) { p.s = 1; p.x = Math.random(); }
        var px = (p.x + Math.sin(now / 1000 * p.tw + p.ph) * p.sw) * W2, py = p.s * H2;
        var left = p.s * (cxa - apex / 2), right = (1 - p.s) * W2 + p.s * (cxa + apex / 2), xn = (px - left) / (right - left);
        if (xn < 0 || xn > 1) continue;                                // outside the cone of light: not lit
        var dx = px - cxa, dy = py - (H2 + hole.y * scale);
        if (dx * dx + dy * dy < (hole.r * scale) * (hole.r * scale)) continue;
        var wl = ss((xn - bu0) / F2 + .5), wr = ss((bu1 - xn) / F2 + .5), wm = (wl * wr) * ss(xn / .07) * ss((1 - xn) / .07);
        var ci = Math.max(0, Math.min(47, Math.floor(xn * 48))), c = beamCols ? beamCols[ci] : null;
        var rr = c ? Math.min(255, c[0] * 1.4 + 70) : 255, gg = c ? Math.min(255, c[1] * 1.4 + 70) : 215, bb = c ? Math.min(255, c[2] * 1.4 + 70) : 150;
        var tw = .55 + .45 * Math.sin(now / 1000 * p.tw * 2.1 + p.ph * 1.7);
        var a = wm * bg * tw * ss(p.s * 6) * ss((1 - p.s) * 8) * (.3 + .5 * (1 - p.s));
        if (a < .01) continue;
        ctx.fillStyle = "rgba(" + (rr | 0) + "," + (gg | 0) + "," + (bb | 0) + "," + Math.min(.8, a).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(px, py, p.r * scale, 0, 6.2832); ctx.fill();
      }
    }
    dustRaf = requestAnimationFrame(dustFrame);
  }
  function startDust() { if (!dustRaf && !reduce) { dustT = 0; dustRaf = requestAnimationFrame(dustFrame); } }
  document.addEventListener("visibilitychange", startDust);
  setInterval(startDust, 1000);                                        // cheap safety net: restarts after the wheel scrolls back into view

  function beamLoop() {                                              // videos change every frame: repaint a few times a second
    beamTimer = 0;
    var m = layers[layerOn].firstChild;
    if (!visible || !m || m.tagName !== "VIDEO" || m.paused) return;
    paintBeam();
    beamTimer = setTimeout(beamLoop, 90);
  }

  // The active disc "projects" its image onto the screen above the wheel, at a standard aspect ratio.
  // A project can carry a `video` (mp4/webm path) next to its `image`; the image is then the poster.
  function project(p) {
    if (shownId === p.id) return;
    shownId = p.id; activeProj = p;
    var next = layers[1 - layerOn], prev = layers[layerOn], m;
    next.innerHTML = "";
    if (p.video) {
      m = document.createElement("video");
      m.src = p.video; m.poster = p.image; m.muted = true; m.loop = true; m.playsInline = true; m.preload = "metadata";
      m.setAttribute("aria-label", p.alt || p.title);
      if (!reduce) m.autoplay = true;
      if (!reduce) { var pl = m.play(); if (pl && pl.catch) pl.catch(function () {}); }
    } else {
      m = document.createElement("img");
      m.src = p.image; m.alt = p.alt || p.title; m.draggable = false;
    }
    posterImg = new Image(); posterImg.src = p.image;
    next.appendChild(m);
    next.classList.add("on"); prev.classList.remove("on");          // the swap is instant: the plate has already shut the light off
    paintBeam();
    m.addEventListener("load", paintBeam); m.addEventListener("loadeddata", function () { paintBeam(); clearTimeout(beamTimer); beamLoop(); });
    posterImg.onload = paintBeam;
    layerOn = 1 - layerOn;
    screen.setAttribute("aria-label", (L.open || "Open") + " " + p.title);
    prev.innerHTML = "";
  }
  screen.addEventListener("click", function () { if (justDragged) return; openProject(activeProj.id); });

  function holdOff() { return hover && !(encBox && !encBox.hidden); }   // hovering pauses the wheel, unless the speed encoder is open
  function tick(now) {
    raf = 0;
    if (!visible) return;
    var dt = Math.min(64, now - (last || now)); last = now;
    // dwell on each gobo (slow while it is lined up), then pass quickly through the dark between two gobos
    var gu = Math.min(1, lastBest / (step / 2)), dwell = manual ? 1 : .25 + 1.75 * gu * gu;   // once the encoder has been used the wheel keeps a constant speed
    if (playing && !holdOff()) target -= SPEED * dwell * dt / 1000;       // the wheel turns counter-clockwise: projects come round in order
    ang += (target - ang) * (1 - Math.exp(-dt / 160));
    draw();
    if (playing && !holdOff() || Math.abs(target - ang) > .02) raf = requestAnimationFrame(tick); else last = 0;
  }
  function kick() { if (!raf && visible) { last = 0; raf = requestAnimationFrame(tick); } }

  function setPlaying(v) {
    playing = v;
    playBtn.textContent = v ? (L.pause || "Pause") : (L.play || "Play");
    playBtn.removeAttribute("aria-pressed");
    kick();
  }
  function stepBy(dir) {
    target = Math.round(target / step) * step - dir * step;
    kick();
  }
  // Drag (mouse, pen or finger) to turn the wheel by hand; let go and it coasts to the nearest project.
  var dragging = false, captured = false, moved = 0, lastX = 0, lastT = 0, vel = 0, justDragged = false;
  box.addEventListener("pointerdown", function (ev) {
    if (ev.button > 0 || ev.target.closest(".gobo-bar")) return;
    dragging = true; captured = false; moved = 0; lastX = ev.clientX; lastT = ev.timeStamp; vel = 0; hover = true;
  });
  box.addEventListener("pointermove", function (ev) {
    if (!dragging) return;
    var dx = ev.clientX - lastX;
    moved += Math.abs(dx); lastX = ev.clientX;
    if (!captured && moved > 6) { captured = true; try { box.setPointerCapture(ev.pointerId); } catch (e) {} stage.classList.add("is-drag"); }
    if (!captured) return;
    var dDeg = dx / R * 180 / Math.PI, dt = Math.max(1, ev.timeStamp - lastT);
    lastT = ev.timeStamp;
    ang += dDeg; target = ang;
    vel = vel * .7 + (dDeg / dt * 1000) * .3;
    draw();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; stage.classList.remove("is-drag");
    if (captured) {
      justDragged = true; setTimeout(function () { justDragged = false; }, 0);
      target = Math.round((ang + Math.max(-260, Math.min(260, vel)) * .35) / step) * step;
    }
    kick();
  }
  box.addEventListener("pointerup", endDrag);
  box.addEventListener("pointercancel", endDrag);
  playBtn.addEventListener("click", function (ev) {
    var now = Date.now();
    clicks = now - lastClick < 700 ? clicks + 1 : 1; lastClick = now;     // 700 ms: three taps on a phone take longer than three clicks
    if (clicks === 3) { clicks = 0; toggleEnc(); return; }           // triple click: show or hide the speed encoder (the first two clicks cancel each other out)
    setPlaying(!playing);
  });
  // Speed encoder: a rotary knob. Drag round it, scroll on it or use the arrow keys. 1 to 10 maps to 1 to 12 degrees per second.
  var clicks = 0, lastClick = 0, encBox = document.getElementById("goboEnc"), knob = document.getElementById("goboKnob"), encV = document.getElementById("goboEncV"), encPos = 5;
  // Positions 1 to 12 run on an exponential scale. 12 is "ridiculous" but safe: never more than about 2.5 gobo changes a second.
  var SMIN = 1.2, SMAX = Math.max(30, 2.5 * step);
  function setEnc(v, user) {
    if (user) manual = true;
    encPos = Math.min(12, Math.max(1, v));
    SPEED = SMIN * Math.pow(SMAX / SMIN, (encPos - 1) / 11);
    knob.style.setProperty("--rot", ((encPos - 6.5) / 5.5 * 135).toFixed(1) + "deg");
    knob.setAttribute("aria-valuenow", encPos.toFixed(1));
    encV.textContent = encPos.toFixed(1);
  }
  var ENC0 = 1 + 11 * Math.log(4.2 / SMIN) / Math.log(SMAX / SMIN);
  function toggleEnc() {
    encBox.hidden = !encBox.hidden;
    if (encBox.hidden) { setEnc(ENC0); manual = false; }              // hiding the encoder puts the wheel back to its original speed and pacing
  }
  setEnc(ENC0);
  var encDrag = null;
  ["pointerdown", "pointermove", "pointerup", "pointercancel"].forEach(function (t) { encBox.addEventListener(t, function (ev) { ev.stopPropagation(); }); });   // the wheel's drag must not see the encoder
  knob.addEventListener("pointerdown", function (ev) { encDrag = { y: ev.clientY, v: encPos }; try { knob.setPointerCapture(ev.pointerId); } catch (e) {} ev.preventDefault(); });
  knob.addEventListener("pointermove", function (ev) { if (encDrag) setEnc(encDrag.v + (encDrag.y - ev.clientY) / 18, true); });
  knob.addEventListener("pointerup", function () { encDrag = null; });
  knob.addEventListener("pointercancel", function () { encDrag = null; });
  knob.addEventListener("wheel", function (ev) { ev.preventDefault(); setEnc(encPos - Math.sign(ev.deltaY) * .25, true); }, { passive: false });
  knob.addEventListener("keydown", function (ev) {
    var d = ev.key === "ArrowUp" || ev.key === "ArrowRight" ? .5 : ev.key === "ArrowDown" || ev.key === "ArrowLeft" ? -.5 : 0;
    if (d) { ev.preventDefault(); setEnc(encPos + d, true); }
  });
  prevBtn.addEventListener("click", function () { stepBy(-1); });
  nextBtn.addEventListener("click", function () { stepBy(1); });
  box.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowLeft") { ev.preventDefault(); stepBy(-1); }
    if (ev.key === "ArrowRight") { ev.preventDefault(); stepBy(1); }
  });
  stage.addEventListener("pointerenter", function () { hover = true; });
  stage.addEventListener("pointerleave", function () { hover = false; kick(); });
  box.addEventListener("focusin", function () { hover = true; });
  box.addEventListener("focusout", function () { hover = false; kick(); });
  // The first time the wheel scrolls into view it gives itself a flick, so a visitor notices it moves (and can be dragged).
  if ("IntersectionObserver" in window && !reduce) {
    var flick = new IntersectionObserver(function (en) {
      if (!en[0].isIntersecting) return;
      flick.disconnect();
      target = Math.round(target / step) * step - step; kick();
    }, { threshold: .6 });
    flick.observe(stage);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }, { threshold: 0 }).observe(box);
  }
  window.addEventListener("resize", layout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  setPlaying(playing);
  layout();
  kick();
})();

// Stage 2: intro sequence. Only runs when index.html's head script set html.intro-pending
// (first visit in this session, no reduced-motion preference).
// A floor-standing line-art spot moving head is drawn from a tiny 3D model. The head turns
// (pan and tilt) until the lens faces the viewer, and the website lives inside that lens.
(function () {
  "use strict";
  var root = document.documentElement;
  if (!root.classList.contains("intro-pending")) return;
  window.__introStarted = true;

  var $ = function (id) { return document.getElementById(id); };
  var stage = $("stage"), box = $("intro"), maskCv = $("introMask"), glow = $("introGlow");
  var holeFx = $("holeFx"), fixture = $("fixture"), fxG = $("fxG");
  var vignette = $("introVignette"), lastAmb = -1, trussAmb = $("trussAmb"), lensLight = $("lensLight"), fxTruss = $("fxTruss"), maskBeams2 = $("maskBeams2"), fxDark = $("fxDark"), fxDefs = $("fxDefs"), maskBeams = $("maskBeams"), beamSvg = $("introBeam"), beamDefs = $("beamDefs");
  var aim = { x: 0, y: 0 };           // smoothed head aim toward the cursor, -1..1
  var enter = $("introEnter"), skip = $("introSkip"), nav = $("nav");
  var KEY = "strobe-intro-seen";
  var PUSH_MS = 3300, SKIP_MS = 450, IDLE_MS = 4000;

  /* ---------- tiny wireframe 3D engine (orthographic, painter's algorithm) ---------- */
  var D2R = Math.PI / 180;
  // The fixture hangs from a roof truss: the model is mirrored top-to-bottom and the camera looks slightly up.
  var PITCH = -14 * D2R, BODY_YAW = 0;                         // base faces the viewer squarely
  var PIVOT = 190, RH = 62, LRAD = 58, LENSZ = 112;            // model units
  var PAN0 = 115 * D2R, PANF = -BODY_YAW, TILT0 = 35 * D2R, TILTF = -PITCH;   // PANF = -BODY_YAW: lens ends facing the viewer
  var cam = { cx: 0, cy: 0, k: 1 }, prevCam = { cx: 0, cy: 0, k: 1 };
  var pose = { pan: PAN0, tilt: TILT0 };
  var lens = { c: [0, 0], e1: [1, 0], e2: [0, 1] };
  var I3 = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

  function Rx(a) { var c = Math.cos(a), s = Math.sin(a); return [[1, 0, 0], [0, c, -s], [0, s, c]]; }
  function Ry(a) { var c = Math.cos(a), s = Math.sin(a); return [[c, 0, s], [0, 1, 0], [-s, 0, c]]; }
  function mv(M, p) { return [M[0][0] * p[0] + M[0][1] * p[1] + M[0][2] * p[2], M[1][0] * p[0] + M[1][1] * p[1] + M[1][2] * p[2], M[2][0] * p[0] + M[2][1] * p[1] + M[2][2] * p[2]]; }
  function mm(A, B) {
    var R = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], i, j, k;
    for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) for (k = 0; k < 3; k++) R[i][j] += A[i][k] * B[k][j];
    return R;
  }
  function chain(A, B) { var t = mv(A.R, B.t); return { R: mm(A.R, B.R), t: [t[0] + A.t[0], t[1] + A.t[1], t[2] + A.t[2]] }; }
  function app(F, p) { var q = mv(F.R, p); return [q[0] + F.t[0], q[1] + F.t[1], q[2] + F.t[2]]; }
  function view(p) {
    var c = Math.cos(PITCH), s = Math.sin(PITCH);
    return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
  }
  function scr(v) { return [cam.cx + cam.k * v[0], cam.cy - cam.k * (v[1] + PIVOT * Math.cos(PITCH))]; }   // pivot hangs 190 below the roof
  function S(F, p) { return scr(view(app(F, p))); }
  function Z(F, p) { return view(app(F, p))[2]; }
  function sub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  function pstr(pts, cls, close) {
    var d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1), i;
    for (i = 1; i < pts.length; i++) d += "L" + pts[i][0].toFixed(1) + " " + pts[i][1].toFixed(1);
    return '<path class="' + cls + '" d="' + d + (close ? "Z" : "") + '"/>';
  }
  function hull(pts) {
    pts = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [], i;
    for (i = 0; i < pts.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], pts[i]) <= 0) lo.pop(); lo.push(pts[i]); }
    for (i = pts.length - 1; i >= 0; i--) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], pts[i]) <= 0) up.pop(); up.push(pts[i]); }
    up.pop(); lo.pop();
    return lo.concat(up);
  }
  // Decoration primitives in a face's local (a,b) coordinates.
  function prims(P, list) {
    var s = "", i, it, k, pts, th;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      if (it[0] === "r") s += pstr([P(it[1], it[2]), P(it[3], it[2]), P(it[3], it[4]), P(it[1], it[4])], "", true);
      else if (it[0] === "l") s += pstr([P(it[1], it[2]), P(it[3], it[4])], "", false);
      else if (it[0] === "c") {
        pts = [];
        for (k = 0; k < 24; k++) { th = k / 24 * Math.PI * 2; pts.push(P(it[1] + Math.cos(th) * it[3], it[2] + Math.sin(th) * it[3])); }
        s += pstr(pts, "", true);
      }
    }
    return s;
  }

  function box3(F, c, h, decor) {
    var cen = Z(F, c), s = "";
    var faces = [
      ["pz", [0, 0, h[2]], [1, 0, 0], [0, 1, 0], h[0], h[1], [0, 0, 1]],
      ["nz", [0, 0, -h[2]], [-1, 0, 0], [0, 1, 0], h[0], h[1], [0, 0, -1]],
      ["px", [h[0], 0, 0], [0, 0, -1], [0, 1, 0], h[2], h[1], [1, 0, 0]],
      ["nx", [-h[0], 0, 0], [0, 0, 1], [0, 1, 0], h[2], h[1], [-1, 0, 0]],
      ["py", [0, h[1], 0], [1, 0, 0], [0, 0, -1], h[0], h[2], [0, 1, 0]],
      ["ny", [0, -h[1], 0], [1, 0, 0], [0, 0, 1], h[0], h[2], [0, -1, 0]]
    ];
    faces.forEach(function (f) {
      var n = f[6];
      if (Z(F, [c[0] + n[0], c[1] + n[1], c[2] + n[2]]) - cen <= 0) return;
      var O = [c[0] + f[1][0], c[1] + f[1][1], c[2] + f[1][2]], u = f[2], v = f[3], uw = f[4], vw = f[5];
      var P = function (a, b) { return S(F, [O[0] + u[0] * a + v[0] * b, O[1] + u[1] * a + v[1] * b, O[2] + u[2] * a + v[2] * b]); };
      s += pstr([P(-uw, -vw), P(uw, -vw), P(uw, vw), P(-uw, vw)], "s hv", true);
      if (decor && decor[f[0]]) s += prims(P, decor[f[0]]);
    });
    return { d: cen, s: s };
  }

  // Line-art drawn on a flat patch of any solid (screws, windows); only shown when the patch faces the camera.
  function decal(F, c, n, u, v, list) {
    if (Z(F, [c[0] + n[0], c[1] + n[1], c[2] + n[2]]) - Z(F, c) <= 0) return "";
    var P = function (a, b) { return S(F, [c[0] + u[0] * a + v[0] * b, c[1] + u[1] * a + v[1] * b, c[2] + u[2] * a + v[2] * b]); };
    return prims(P, list);
  }

  // Extruded convex profile (profile points are [z,y]); used for the yoke arms.
  function prism(F, prof, x0, x1, decOut, decIn) {
    var n = prof.length, cz = 0, cy = 0, s = "";
    prof.forEach(function (p) { cz += p[0]; cy += p[1]; });
    var cl = [(x0 + x1) / 2, cy / n, cz / n], cenV = view(app(F, cl)), cen = cenV[2];
    function face(pts, dec) {
      var V = pts.map(function (p) { return view(app(F, p)); });
      var nrm = cross(sub(V[1], V[0]), sub(V[2], V[0]));
      var mid = [0, 0, 0];
      V.forEach(function (v) { mid[0] += v[0] / V.length; mid[1] += v[1] / V.length; mid[2] += v[2] / V.length; });
      if (dot(nrm, sub(mid, cenV)) < 0) nrm = [-nrm[0], -nrm[1], -nrm[2]];
      if (nrm[2] <= 0.0001) return "";
      return pstr(V.map(scr), "s hv", true) + (dec || "");
    }
    var capP = function (x) { return function (a, b) { return S(F, [x, b, a]); }; };
    s += face(prof.map(function (p) { return [x1, p[1], p[0]]; }), decOut ? prims(capP(x1), decOut) : "");
    s += face(prof.map(function (p) { return [x0, p[1], p[0]]; }), decIn ? prims(capP(x0), decIn) : "");
    prof.forEach(function (p, i) {
      var q = prof[(i + 1) % n];
      s += face([[x0, p[1], p[0]], [x1, p[1], p[0]], [x1, q[1], q[0]], [x0, q[1], q[0]]]);
    });
    return { d: cen, s: s };
  }

  // Cylinder along local z (or x): silhouette hull, visible cap, ribs and surface lines.
  function cyl(F, o) {
    var ax = o.axis === "x" ? [1, 0, 0] : o.axis === "y" ? [0, 1, 0] : [0, 0, 1];
    var e1 = o.axis === "x" ? [0, 1, 0] : [1, 0, 0];
    var e2 = o.axis === "x" ? [0, 0, 1] : o.axis === "y" ? [0, 0, 1] : [0, 1, 0];
    var c = o.c || [0, 0, 0], r = o.r, N = 40, i, th;
    function pt(s, t, rr) {
      var ca = Math.cos(t) * (rr == null ? r : rr), sa = Math.sin(t) * (rr == null ? r : rr);
      return [c[0] + ax[0] * s + e1[0] * ca + e2[0] * sa, c[1] + ax[1] * s + e1[1] * ca + e2[1] * sa, c[2] + ax[2] * s + e1[2] * ca + e2[2] * sa];
    }
    var cen = Z(F, pt((o.a0 + o.a1) / 2, 0, 0));
    var av = Z(F, pt(o.a1, 0, 0)) - Z(F, pt(o.a0, 0, 0));
    var hp = [];
    for (i = 0; i < N; i++) { th = i / N * Math.PI * 2; hp.push(S(F, pt(o.a0, th))); hp.push(S(F, pt(o.a1, th))); }
    var s = pstr(hull(hp), "s hv", true);

    // visible cap decoration
    var capS = av > 0 ? o.a1 : o.a0, dec = av > 0 ? o.cap1 : o.cap0;
    (dec || []).forEach(function (it) {
      var pts = [], k, m;
      if (it[0] === "c" || it[0] === "fill") {
        for (k = 0; k < 48; k++) pts.push(S(F, pt(capS, k / 48 * Math.PI * 2, it[1])));
        s += pstr(pts, it[0] === "fill" ? "lf" : (it[2] || ""), true);
      } else if (it[0] === "scr") {
        for (m = 0; m < it[2]; m++) {
          pts = [];
          for (k = 0; k < 12; k++) {
            var a = m / it[2] * Math.PI * 2 + 0.3;
            var cx0 = it[1] * Math.cos(a), cy0 = it[1] * Math.sin(a);
            pts.push(S(F, [c[0] + ax[0] * capS + e1[0] * (cx0 + Math.cos(k / 12 * 6.2832) * it[3]) + e2[0] * (cy0 + Math.sin(k / 12 * 6.2832) * it[3]),
                           c[1] + ax[1] * capS + e1[1] * (cx0 + Math.cos(k / 12 * 6.2832) * it[3]) + e2[1] * (cy0 + Math.sin(k / 12 * 6.2832) * it[3]),
                           c[2] + ax[2] * capS + e1[2] * (cx0 + Math.cos(k / 12 * 6.2832) * it[3]) + e2[2] * (cy0 + Math.sin(k / 12 * 6.2832) * it[3])]));
          }
          s += pstr(pts, "", true);
        }
      } else if (it[0] === "tk") {
        for (m = 0; m < it[3]; m++) {
          var t2 = m / it[3] * Math.PI * 2;
          s += pstr([S(F, pt(capS, t2, it[1])), S(F, pt(capS, t2, it[2]))], "dm", false);
        }
      }
    });

    // ribs: only the half of each ring that faces the camera
    (o.rings || []).forEach(function (s0) {
      var M = 72, vis = [], pts = [], first = -1, k;
      for (k = 0; k < M; k++) {
        th = k / M * Math.PI * 2;
        vis.push(Z(F, pt(s0, th, r)) - Z(F, pt(s0, th, 0)) > 0);
        pts.push(S(F, pt(s0, th, r)));
        if (!vis[k] && first < 0) first = k;
      }
      if (first < 0) first = 0;
      var run = [];
      for (k = 1; k <= M; k++) {
        var idx = (first + k) % M;
        if (vis[idx]) run.push(pts[idx]);
        else { if (run.length > 1) s += pstr(run, "", false); run = []; }
      }
      if (run.length > 1) s += pstr(run, "", false);
    });
    (o.lines || []).forEach(function (deg) {
      th = deg * D2R;
      if (Z(F, pt(o.a0, th, r)) - Z(F, pt(o.a0, th, 0)) > 0.0001)
        s += pstr([S(F, pt(o.a0 + 3, th)), S(F, pt(o.a1 - 3, th))], "dm", false);
    });
    return { d: cen, s: s };
  }

  /* ---------- the rig: roof truss and three spots ---------- */
  var SP = 460, PARK = 90 * D2R, STARE = 0;         // spot spacing (model units); parked = head hanging straight down
  var UP = 334;                            // pivot to top of truss
  var ARM = (function () {
    var p = [[-30, 64], [30, 64], [30, 190]], t;
    for (t = 1; t <= 10; t++) p.push([30 * Math.cos(t / 10 * Math.PI), 190 + 30 * Math.sin(t / 10 * Math.PI)]);
    return p;
  })();
  var BR = [[-30, 34], [30, 34], [40, 44], [40, 54], [30, 64], [-30, 64], [-40, 54], [-40, 44]];
  var SPOTS = [
    { x: -SP, on: false, p: 0, aim: { x: 0, y: 0 }, hit: $("spotL"), lens: { c: [0, 0], e1: [1, 0], e2: [0, 1] }, cache: null },
    { x: 0, on: true, p: 1, aim: aim, hit: $("spotC"), lens: lens, cache: null },
    { x: SP, on: false, p: 0, aim: { x: 0, y: 0 }, hit: $("spotR"), lens: { c: [0, 0], e1: [1, 0], e2: [0, 1] }, cache: null }
  ];

  // Roof truss: a real box truss (about 0.65x the width of a fixture yoke per side), lattice on the front and underside.
  function trussObjs() {
    var F0 = { R: I3, t: [0, 0, 0] }, X = 1100, i, zig = [], rails = [["l", -X, 50, X, 50], ["l", -X, -50, X, -50]];
    for (i = -X; i < X; i += 100) { zig.push(["l", i, -50, i + 50, 50]); zig.push(["l", i + 50, 50, i + 100, -50]); }
    return [box3(F0, [0, 82, 0], [X, 62, 62], { pz: rails.concat(zig), ny: rails.concat(zig) })];
  }

  // One moving head, hung from the truss at x = sp.x, with the given pan and tilt.
  function spotObjs(i, p, lit) {
    var sp = SPOTS[i];
    var bodyF = { R: mm([[1, 0, 0], [0, -1, 0], [0, 0, 1]], Ry(BODY_YAW)), t: [sp.x, 0, 0] };   // mirrored: hangs under the truss
    var yokeF = chain(bodyF, { R: Ry(p.pan), t: [0, 0, 0] });
    var headF = chain(yokeF, chain({ R: I3, t: [0, PIVOT, 0] }, { R: Rx(-p.tilt), t: [0, 0, 0] }));
    var objs = [];

    // hook clamp and safety wire
    var Fc = { R: I3, t: [sp.x, 0, 0] };
    objs.push(box3(Fc, [0, 10, 0], [16, 10, 16], { pz: [["c", 0, 0, 5], ["l", -16, 4, 16, 4]], px: [["l", -8, -6, 8, -6]] }));
    objs.push({ d: 0, s: pstr([S(Fc, [70, 0, 30]), S(Fc, [86, 10, 30]), S(Fc, [70, 20, 30])], "dm", false) });

    // base: rubber feet, low body with control panel, vents, carry handles on both ends
    [[-98, -54], [98, -54], [-98, 54], [98, 54]].forEach(function (f) {
      objs.push(cyl(bodyF, { axis: "y", c: [f[0], 0, f[1]], a0: -13, a1: 0, r: 11, rings: [-8] }));
    });
    var baseDec = {
      pz: [["r", -82, -12, -2, 12], ["r", -79, -9, -5, 9],
           ["c", -64, 0, 9], ["c", -64, 0, 3.5], ["l", -64, 3.5, -64, 7], ["l", -64, -3.5, -64, -7], ["l", -67.5, 0, -71, 0], ["l", -60.5, 0, -57, 0],
           ["r", -48, -8, -22, 8], ["r", -46, -6, -24, 6],
           ["c", -13, 6, 1.8], ["c", -13, 0, 1.8], ["c", -13, -6, 1.8],
           ["c", -80, -10.5, 1.3], ["c", -80, 10.5, 1.3], ["c", -4, -10.5, 1.3], ["c", -4, 10.5, 1.3],
           ["l", 24, -9, 104, -9], ["l", 24, -4, 104, -4], ["l", 24, 1, 104, 1], ["l", 24, 6, 104, 6]],
      px: [["r", -30, -6, 30, 6], ["l", -44, 10, 44, 10], ["l", -44, -10, 44, -10]],
      nx: [["r", -30, -6, 30, 6]],
      nz: [["r", -20, -5, 20, 5], ["c", -70, 0, 5], ["c", 70, 0, 5]]
    };
    objs.push(box3(bodyF, [0, 17, 0], [118, 17, 72], baseDec));
    objs.push(box3(bodyF, [-130, 15, 0], [11, 10, 42], { nx: [["r", -30, -3.5, 30, 3.5]], pz: [["r", -8, -4, 8, 4]], nz: [["r", -8, -4, 8, 4]] }));
    objs.push(box3(bodyF, [130, 15, 0], [11, 10, 42], { px: [["r", -30, -3.5, 30, 3.5]], pz: [["r", -8, -4, 8, 4]], nz: [["r", -8, -4, 8, 4]] }));

    // yoke bridge
    var bridge = prism(yokeF, BR, -92, 92, null, null);
    bridge.s += decal(yokeF, [0, 49, 40], [0, 0, 1], [1, 0, 0], [0, 1, 0],
      [["r", -28, -4.5, 28, 4.5], ["c", -80, 0, 2.6], ["c", 80, 0, 2.6], ["c", -40, 0, 1.6], ["c", 40, 0, 1.6]]);
    objs.push(bridge);

    // yoke arms
    [1, -1].forEach(function (sg) {
      objs.push(prism(yokeF, ARM, sg * 72, sg * 92,
        [["c", 0, 190, 17], ["c", 0, 190, 11], ["c", 0, 190, 4], ["c", 0, 168, 2], ["c", 0, 212, 2], ["c", -21, 190, 2], ["c", 21, 190, 2],
         ["r", -4, 96, 4, 150], ["l", -18, 78, 18, 78], ["l", -18, 84, 18, 84], ["l", -18, 90, 18, 90]],
        [["c", 0, 190, 14], ["c", 0, 190, 6]]));
    });

    // head: rear cap, barrel, hood, front rim with lens ring
    var lensCls = lit ? "lens" : "";
    var glowFill = lit && i !== 1 ? [["fill", LRAD]] : [];       // side spots show lit glass; the centre lens is a window to the page
    objs.push(cyl(headF, { axis: "z", a0: -130, a1: -98, r: 50, rings: [-122, -114, -106],
      cap0: [["c", 40], ["c", 30], ["c", 18], ["tk", 42, 47, 18]] }));
    objs.push(cyl(headF, { axis: "z", a0: -98, a1: 42, r: RH, rings: [-90, -82, -22, -14, 0, 28],
      lines: [30, 60, 90, 120, 150, 210, 240, 270, 300, 330] }));
    objs.push(cyl(headF, { axis: "z", a0: 42, a1: 104, r: 66, rings: [54, 68, 92] }));
    objs.push(cyl(headF, { axis: "z", a0: 104, a1: LENSZ, r: 70,
      cap1: glowFill.concat([["c", 66], ["c", 62], ["c", LRAD + 2, lensCls], ["scr", 64.5, 8, 1.4], ["tk", 60, 62, 48]]) }));
    [1, -1].forEach(function (sg) {
      objs.push(cyl(headF, { axis: "x", a0: sg > 0 ? 56 : -72, a1: sg > 0 ? 72 : -56, r: 20, rings: [sg * 64],
        cap0: sg < 0 ? [["c", 13], ["c", 7]] : null, cap1: sg > 0 ? [["c", 13], ["c", 7]] : null }));
    });
    objs.push(box3(headF, [0, RH + 7, -45], [6, 7, 34], { py: [["r", -2.5, -22, 2.5, 22]], px: [["r", -20, -2, 20, 2]], nx: [["r", -20, -2, 20, 2]] }));

    // lens window (front circle projected as an ellipse) and a click box around the whole spot
    var c0 = S(headF, [0, 0, LENSZ]), p1 = S(headF, [LRAD, 0, LENSZ]), p2 = S(headF, [0, LRAD, LENSZ]);
    var top = S(bodyF, [0, 0, 0])[1] - 28 * cam.k, bot = S(bodyF, [0, PIVOT, 0])[1] + 92 * cam.k, mid = S(bodyF, [0, 17, 0])[0];
    return {
      objs: objs,
      lens: { c: c0, e1: [p1[0] - c0[0], p1[1] - c0[1]], e2: [p2[0] - c0[0], p2[1] - c0[1]] },
      box: { x: mid - 128 * cam.k, y: top, w: 256 * cam.k, h: bot - top }
    };
  }

  function spotPose(i, t) {
    var sp = SPOTS[i];
    if (i === 1) return { pan: pose.pan, tilt: pose.tilt };
    // Powering up swings the head down-to-forward with a little overshoot; powering down eases it back smoothly.
    var te = sp.on && !(push && push.blind) ? easeBack(sp.p, 1.4) : easeInOut(sp.p);
    var aw = cl((sp.p - .3) / .5);        // aiming fades in and out with the power instead of switching
    return {
      pan: sp.aim.x * 26 * D2R * (1 - e) * aw * (1 - cl(flare * 1.5)),
      tilt: PARK + (TILTF - PARK) * te + sp.aim.y * (sp.aim.y > 0 ? 38 : 19) * D2R * (1 - e) * aw * (1 - cl(flare * 1.5))
    };
  }

  // Neighbouring plain line paths (no fill) are merged into one element: the picture is identical, but there are about 2.5x fewer
  // elements to build and paint every frame, which matters a lot in Safari. Filled paths stay separate (they hide the lines behind them).
  var MERGE = { "": 1, dm: 1, gr: 1 };
  function mergeRuns(s) {
    var re = /<path class="([^"]*)" d="([^"]*)"\/>/g, out = "", last = 0, m, cls = null, ds = "";
    function flush() { if (cls !== null) { out += '<path class="' + cls + '" d="' + ds + '"/>'; cls = null; ds = ""; } }
    while ((m = re.exec(s))) {
      out += s.slice(last, m.index) === "" ? "" : (flush(), s.slice(last, m.index));
      last = re.lastIndex;
      if (MERGE[m[1]]) { if (cls !== m[1]) { flush(); cls = m[1]; } ds += m[2]; }
      else { flush(); out += m[0]; }
    }
    flush();
    return out + s.slice(last);
  }
  function sortJoin(list) {
    list.sort(function (a, b) { return a.d - b.d; });
    var s = "", k;
    for (k = 0; k < list.length; k++) s += list[k].s;
    return mergeRuns(s);
  }

  function drawFixture(t) {
    var darkS = "", litS = "", i, sp, p, lit, res, key, a, str;
    for (i = 0; i < 3; i++) {
      sp = SPOTS[i];
      if (i !== 1 && e > .12) continue;          // during the dolly the side spots are already off-screen
      p = spotPose(i, t);
      lit = sp.p > .001;
      key = p.pan.toFixed(4) + "|" + p.tilt.toFixed(4) + "|" + cam.k.toFixed(3) + "|" + cam.cx.toFixed(1) + "|" + cam.cy.toFixed(1) + "|" + (lit ? 1 : 0);
      if (!sp.cache || sp.cache.key !== key) { res = spotObjs(i, p, lit); res.key = key; sp.cache = res; }
      res = sp.cache;
      sp.lens.c = res.lens.c; sp.lens.e1 = res.lens.e1; sp.lens.e2 = res.lens.e2;
      // A spot that is powering up or down is drawn in both worlds and cross-faded, so nothing ever pops.
      a = easeInOut(sp.p);
      str = sortJoin(res.objs);
      if (a < .999) darkS += a > .001 ? '<g opacity="' + (1 - a).toFixed(3) + '">' + str + "</g>" : str;
      if (a > .001) litS += a < .999 ? '<g opacity="' + a.toFixed(3) + '">' + str + "</g>" : str;
      if (sp.hit) {
        sp.hit.style.left = res.box.x.toFixed(1) + "px"; sp.hit.style.top = res.box.y.toFixed(1) + "px";
        sp.hit.style.width = res.box.w.toFixed(1) + "px"; sp.hit.style.height = res.box.h.toFixed(1) + "px";
      }
    }
    fxTruss.innerHTML = sortJoin(trussObjs());
    fxDark.innerHTML = darkS;
    fxG.innerHTML = litS;
  }

  /* ---------- beams: each lit spot throws a beam to the cursor; the beam reveals the dark rig ---------- */
  var NS = "http://www.w3.org/2000/svg", BEAM_LAYERS = 20, BEAM_SEG = 14, beamStep = 1, perfAcc = 0, perfN = 0, perfGood = 0, floorStep = 1, stepUpAt = 0, dtSeen = [];
  function mk(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag), k;
    for (k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n);
    return n;
  }
  // How the beam fades along its length: strong at the lens, dissolving into the dark well before its far end.
  function beamFall(t) { return Math.pow(1 - t, 1.8); }
  // How its half-width grows: it flares quickly, then eases. A curved edge reads as light, straight edges read as a triangle.
  function beamFlare(t) { return 1 - Math.pow(1 - t, 1.35); }
  function profileStops(gd, color, peak, power) {
    var k, t;
    for (k = 0; k <= 12; k++) {
      t = k / 12;
      mk("stop", { offset: t, "stop-color": color, "stop-opacity": (peak * Math.pow(1 - t, power)).toFixed(4) }, gd);
    }
  }
  var beams = [0, 1, 2].map(function (i) {
    var gd = mk("linearGradient", { id: "bg" + i, gradientUnits: "userSpaceOnUse", x1: 0, y1: 0, x2: 0, y2: 1 }, beamDefs);
    profileStops(gd, "currentColor", .62, 1.8);
    var mg = mk("linearGradient", { id: "mg" + i, gradientUnits: "userSpaceOnUse", x1: 0, y1: 0, x2: 0, y2: 1 }, fxDefs);
    profileStops(mg, "#fff", 1, 1.1);
    // The beam is a stack of thin, nested curved cones: many faint layers read as one smooth glow (bright core,
    // soft edges). Each beam and each pool blends additively with the others, so overlaps glow brighter.
    var grp = mk("g", {}, beamSvg), layers = [], k;
    for (k = 0; k < BEAM_LAYERS; k++) layers.push(mk("polygon", { fill: "url(#bg" + i + ")", visibility: "hidden" }, grp));
    return { gd: gd, mg: mg, layers: layers,
      m: mk("polygon", { fill: "url(#mg" + i + ")", visibility: "hidden" }, maskBeams),
      m2: mk("polygon", { fill: "url(#mg" + i + ")", visibility: "hidden" }, maskBeams2) };
  });
  beamSvg.style.opacity = 1;
  // Dazzle: when the visitor enters, every spot swings to face them and its lens blooms with glare.
  var bloomGrad = mk("radialGradient", { id: "bloomGrad" }, beamDefs);
  mk("stop", { offset: 0, "stop-color": "#fff6e2", "stop-opacity": .85 }, bloomGrad);
  mk("stop", { offset: .3, style: "stop-color: var(--accent); stop-opacity: .5" }, bloomGrad);
  mk("stop", { offset: .65, style: "stop-color: var(--accent); stop-opacity: .14" }, bloomGrad);
  mk("stop", { offset: 1, style: "stop-color: var(--accent); stop-opacity: 0" }, bloomGrad);
  var faceS = [0, 0, 0], lastBT = 0;      // smoothed 'pointing at this lens' amounts
  var bloomG = mk("g", { style: "mix-blend-mode: screen" }, beamSvg);
  var blooms = [0, 1, 2].map(function () {
    return mk("circle", { r: 1, fill: "url(#bloomGrad)", opacity: 0, transform: "matrix(.001 0 0 .001 0 0)" }, bloomG);
  });
  // Lens glass lights sit on top of the beams so every lens is evenly bright, whichever way its beam points.
  var lights = [null, lensLight, null];
  [0, 2].forEach(function (i) {
    lights[i] = mk("circle", { r: 1, fill: "url(#lensLightGrad)", opacity: 0, transform: "matrix(.001 0 0 .001 0 0)" }, beamSvg);
  });
  beamSvg.appendChild(lensLight);

  function hideBeam(b) {
    var k;
    for (k = 0; k < b.layers.length; k++) b.layers[k].setAttribute("visibility", "hidden");
    b.m.setAttribute("visibility", "hidden");
    b.m2.setAttribute("visibility", "hidden");
    b.geo = null;
  }
  // Returns true when a beam is actually being drawn.
  function drawBeam(b, ox, oy, R, T, s) {
    var dx = T.x - ox, dy = T.y - oy, len = Math.hypot(dx, dy);
    if (len < R * 1.2) { hideBeam(b); return false; }
    var ux = dx / len, uy = dy / len, px = -uy, py = ux;
    var sx = ox, sy = oy;                     // the beam is born in the middle of the lens glass
    var span = len * 1.25, w0 = R * .62, w1 = w0 + span * .3;
    var ex = sx + ux * span, ey = sy + uy * span;
    function shape(f) {
      var Lp = [], Rp = [], q, tt, wt, cx, cy;
      for (q = 0; q <= BEAM_SEG; q++) {
        tt = q / BEAM_SEG;
        wt = (w0 + (w1 - w0) * beamFlare(tt)) * f;
        cx = sx + ux * span * tt; cy = sy + uy * span * tt;
        Lp.push((cx + px * wt).toFixed(1) + "," + (cy + py * wt).toFixed(1));
        Rp.push((cx - px * wt).toFixed(1) + "," + (cy - py * wt).toFixed(1));
      }
      return Lp.concat(Rp.reverse()).join(" ");
    }
    function poly(el, f, op) {
      el.setAttribute("points", shape(f));
      el.setAttribute("opacity", (op * s).toFixed(3));
      el.setAttribute("visibility", "visible");
    }
    var q;
    // beamStep > 1 is the automatic "lite" mode for slow screens: draw every 2nd or 4th layer, each one proportionally stronger.
    for (q = 0; q < BEAM_LAYERS; q++) {
      if (q % beamStep) { b.layers[q].setAttribute("visibility", "hidden"); continue; }
      poly(b.layers[q], 1.3 * Math.pow(1 - q / BEAM_LAYERS, 1.3) + .05, .08 * beamStep);
    }
    poly(b.m, 1.5, 1); poly(b.m2, 1.5, 1);
    [b.gd, b.mg].forEach(function (gr) {
      gr.setAttribute("x1", sx.toFixed(1)); gr.setAttribute("y1", sy.toFixed(1));
      gr.setAttribute("x2", ex.toFixed(1)); gr.setAttribute("y2", ey.toFixed(1));
    });
    b.geo = { sx: sx, sy: sy, ux: ux, uy: uy, L: span, w0: w0, w1: w1, s: s };
    return true;
  }

  /* ---------- timeline and geometry ---------- */
  var g = {};
  var drift = { x: 0, y: 0 }, pointer = null;
  var pool = 0;                       // lens window opening, px of radius
  var push = null, e = 0, tNow = 0, prevNow = 0, anyBeam = false, nBeams = 0, lastBeams = 0;
  var fxOn = false, lensOn = false, btnOn = false, lastInput = 0, done = false, raf = 0;
  var start = performance.now();
  var lastKey = "";

  function cl(v) { return Math.max(0, Math.min(1, v)); }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOutQuad(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function easeInOut(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeBack(x, c1) { var c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }

  stage.setAttribute("inert", "");

  function poseAt(t) {
    var u = cl((t - 1300) / 1800), v = cl((t - 1500) / 1500);
    var pe = easeBack(u, 1.1), te = easeBack(v, 1.8);
    pose.pan = PAN0 + (PANF - PAN0) * pe;
    pose.tilt = TILT0 + (TILTF - TILT0) * te;
    // Once settled, the head aims toward the cursor (and eases back to centre during the push-in).
    var lock = 1 - cl(flare * 1.5);          // while dazzling, the cursor aim is released so every head ends up looking dead at the camera
    pose.pan += aim.x * 26 * D2R * (1 - e) * lock;
    pose.tilt += aim.y * (aim.y > 0 ? 38 : 19) * D2R * (1 - e) * lock;
    // Switched off, the centre head swings back down to its parked position like the others.
    var cp = easeInOut(SPOTS[1].p);
    pose.pan *= cp;
    pose.tilt = PARK + (pose.tilt - PARK) * cp;
    var z = easeInOut(u);       // the camera dollies in and re-centres as the head turns
    cam.k = g.k0 + (g.kf - g.k0) * z;
    cam.cx = g.cx0 + (g.cx - g.cx0) * z;
    cam.cy = g.cy0 + (g.cy - g.cy0) * z;
    // Push-in: a true camera dolly into the lens. The rig is re-rendered larger (so its lines stay crisp, never fat)
    // and glides toward the page centre while the light floods outward.
    if (push && e > 0) {
      // Fly into the lens itself, wherever the head is aimed: the lens centre travels from where it was when the dive
      // began to the page centre, and the zoom grows around it (so it always ends dead centre in the lens).
      if (!push.lens0) push.lens0 = lens.c.slice();
      var kNew = cam.k * Math.pow(g.Rend / g.R, e), sc = kNew / Math.max(prevCam.k, 1e-6);
      var vx = (lens.c[0] - prevCam.cx) * sc, vy = (lens.c[1] - prevCam.cy) * sc;
      var Px = push.lens0[0] * (1 - e) + g.hx * e, Py = push.lens0[1] * (1 - e) + g.hy * e;
      cam.k = kNew; cam.cx = Px - vx; cam.cy = Py - vy;
    }
    prevCam.cx = cam.cx; prevCam.cy = cam.cy; prevCam.k = cam.k;
  }

  // Where the lit spots point: the cursor, or a slow sweep until the visitor moves it.
  function target(t) {
    if (pointer) return pointer;
    if (!lensOn) return null;
    return { x: g.cx + Math.sin(t / 1500) * g.vw * .34, y: g.cy + g.vh * (.3 + .12 * Math.cos(t / 1100)) };
  }

  // The black screen with the feathered lens window. It is a canvas, not an SVG mask: WebKit (Safari) redrew the whole SVG mask
  // every frame the lens moved, which was by far the slowest part of the intro. The maths is the same (unit circle mapped by a
  // matrix, clear in the middle, feathering to black between 86% and 100% of the radius).
  var maskCtx = maskCv.getContext("2d"), maskGrad = null, maskKey = "", maskW = 0, maskH = 0;
  function sizeMask(vw, vh) {
    if (maskCv.width !== vw || maskCv.height !== vh) { maskCv.width = vw; maskCv.height = vh; }
    maskCv.style.width = vw + "px"; maskCv.style.height = vh + "px";
    maskW = vw; maskH = vh; maskKey = "";
  }
  function drawHole(a, b, c, d, e0, f0) {
    var key = a.toFixed(2) + "|" + b.toFixed(2) + "|" + c.toFixed(2) + "|" + d.toFixed(2) + "|" + e0.toFixed(1) + "|" + f0.toFixed(1);
    if (key === maskKey) return;                                   // nothing changed: no redraw
    maskKey = key;
    maskCtx.setTransform(1, 0, 0, 1, 0, 0);
    maskCtx.globalCompositeOperation = "source-over";
    maskCtx.clearRect(0, 0, maskW, maskH);
    maskCtx.fillStyle = "#050505";
    maskCtx.fillRect(0, 0, maskW, maskH);
    if (Math.hypot(a, b) < .6 && Math.hypot(c, d) < .6) return;    // the window has not opened yet
    if (!maskGrad) {
      maskGrad = maskCtx.createRadialGradient(0, 0, 0, 0, 0, 1);
      maskGrad.addColorStop(0, "rgba(0,0,0,1)"); maskGrad.addColorStop(.86, "rgba(0,0,0,1)"); maskGrad.addColorStop(1, "rgba(0,0,0,0)");
    }
    maskCtx.globalCompositeOperation = "destination-out";
    maskCtx.setTransform(a, b, c, d, e0, f0);
    maskCtx.fillStyle = maskGrad;
    maskCtx.beginPath(); maskCtx.arc(0, 0, 1, 0, Math.PI * 2); maskCtx.fill();
    maskCtx.setTransform(1, 0, 0, 1, 0, 0);
  }
  sizeMask(window.innerWidth, window.innerHeight); drawHole(0, 0, 0, 0, 0, 0);      // black from the very first frame
  sizeMask(window.innerWidth, window.innerHeight); drawHole(0, 0, 0, 0, 0, 0);      // black from the very first frame
  function measure() {
    var vw = window.innerWidth, vh = window.innerHeight;
    stage.style.transform = "none";
    nav.style.transform = "none";
    var t = $("hero-title").getBoundingClientRect();
    var r = $("hero-role").getBoundingClientRect();
    var n = nav.getBoundingClientRect();
    var left = Math.min(t.left, r.left), right = Math.max(t.right, r.right);
    var gap = 28;
    var w = Math.max(right - left, n.width);
    var h = (r.bottom - t.top) + gap + n.height;
    g.hx = (left + right) / 2;
    g.hy = t.top + h / 2;
    // The dive lands on the "o" of the title: the lens window opens around it, so the round lens and the round letter line up.
    var oEl = document.querySelector(".hero-title .o-focus");
    if (oEl) { var ob = oEl.getBoundingClientRect(); g.hx = ob.left + ob.width / 2; g.hy = ob.top + ob.height / 2; }
    g.nx = g.hx - (n.left + n.width / 2);
    g.ny = (r.bottom + gap + n.height / 2) - (n.top + n.height / 2);
    g.vw = vw; g.vh = vh;

    // The camera stays pulled back (all three spots and the truss in view) until the visitor presses the button.
    var kf = Math.min(Math.min((vh - 100) / (UP + 78), vw * .94 / 240) * .36, vw * .96 / (2 * (SP + 100)));
    g.kf = kf;
    g.k0 = kf * .68;                      // opens extra wide, eases in a little while the head turns
    g.cx = vw / 2;
    g.cy = Math.max(vh * .25, UP * kf + 28);   // the centre light hangs ~a quarter of the way down; truss along the top
    g.cx0 = g.cx;
    g.cy0 = g.cy - UP * (kf - g.k0);      // keeps the truss in the same place while the camera eases in
    g.R = LRAD * kf;
    g.s = Math.max(.03, Math.min(.7, 2 * .74 * g.R / Math.hypot(w, h)));
    g.Rend = Math.max(Math.hypot(g.hx, g.hy), Math.hypot(vw - g.hx, g.hy),
                      Math.hypot(g.hx, vh - g.hy), Math.hypot(vw - g.hx, vh - g.hy)) / .86 * 1.04 + 40;
    g.fscale = g.Rend / g.R - 1;
    stage.style.transformOrigin = g.hx + "px " + g.hy + "px";
    fixture.style.transformOrigin = g.cx + "px " + g.cy + "px";

    sizeMask(vw, vh);
    SPOTS.forEach(function (sp) { sp.cache = null; });
    lastKey = "";   // force a redraw at the new size
  }

  function matrix(el, sc, c) {
    el.setAttribute("transform", "matrix(" + [sc * lens.e1[0], sc * lens.e1[1], sc * lens.e2[0], sc * lens.e2[1], c[0], c[1]].map(function (v) { return v.toFixed(3); }).join(" ") + ")");
  }

  function render(t) {
    poseAt(t);
    var key = pose.pan.toFixed(4) + "|" + pose.tilt.toFixed(4) + "|" + cam.k.toFixed(3) + "|" + cam.cx.toFixed(1) + "|" + cam.cy.toFixed(1) +
      "|" + SPOTS[0].p.toFixed(3) + SPOTS[0].aim.x.toFixed(3) + SPOTS[0].aim.y.toFixed(3) +
      "|" + SPOTS[2].p.toFixed(3) + SPOTS[2].aim.x.toFixed(3) + SPOTS[2].aim.y.toFixed(3) + "|" + e.toFixed(2);
    if (key !== lastKey) { lastKey = key; drawFixture(t); }

    // Lens window of the centre spot. w = opening (0..1). The page behind is never moved or scaled:
    // during the push-in the window just grows (exponentially, like a real dolly) until the light covers the screen.
    var poolE = pool * easeInOut(SPOTS[1].p);      // switching the centre spot off closes its window
    var w = poolE / g.R;
    var Rcur = Math.max(Math.hypot(lens.e1[0], lens.e1[1]), 1);   // lens radius as drawn (already zoomed by the dolly)
    var p0 = Math.max(poolE, 1), r = p0 * Math.pow(g.Rend / p0, e), Sx = r / Rcur;
    var mx = lens.c[0], my = lens.c[1];
    // a tilted, elliptical window turns into a circle as the camera arrives
    drawHole(Sx * (lens.e1[0] * (1 - e) + Rcur * e), Sx * lens.e1[1] * (1 - e),
      Sx * lens.e2[0] * (1 - e), Sx * (lens.e2[1] * (1 - e) + Rcur * e), mx, my);
    matrix(holeFx, Math.max(w, .001), lens.c);
    matrix(lensLight, Math.max(w * .97, .001), lens.c);
    lensLight.setAttribute("opacity", (cl(w) * (1 - cl(e * 1.6))).toFixed(3));
    [0, 2].forEach(function (i) {
      var sl = SPOTS[i], ln = sl.lens;
      lights[i].setAttribute("transform", "matrix(" + [ln.e1[0] * .97, ln.e1[1] * .97, ln.e2[0] * .97, ln.e2[1] * .97, ln.c[0], ln.c[1]].map(function (v) { return v.toFixed(3); }).join(" ") + ")");
      // the side spots are left behind as the camera dives into the centre lens: their glass lights vanish immediately
      lights[i].setAttribute("opacity", (easeInOut(sl.p) * (1 - cl(e / .06))).toFixed(3));
    });

    // glare around each lens while the spots face the visitor (the side ones are left behind once the dive starts)
    var faceMax = 0, dtr = Math.min(.1, Math.max(0, (tNow - lastBT) / 1000));
    lastBT = tNow;
    for (var bi = 0; bi < 3; bi++) {
      var bl = SPOTS[bi].lens, h1 = Math.hypot(bl.e1[0], bl.e1[1]), h2 = Math.hypot(bl.e2[0], bl.e2[1]), brad = Math.max(h1, h2) * 3.4;
      // how squarely this head faces the camera: the lens circle's minor/major axis ratio is the cosine of the angle off-axis
      var face = lensOn ? cl((Math.min(h1, h2) / Math.max(h1, h2, 1) - .93) / .06) : 0;
      // with the mouse, the glow only appears when the cursor is actually pointing at this lens
      var cn = pointer ? 1 - cl((Math.hypot(pointer.x - bl.c[0], pointer.y - bl.c[1]) - Math.max(h1, h2) * .9) / (Math.max(h1, h2) * 1.2)) : 0;
      face *= cn;
      // fade in gently and out more slowly, so sweeping the cursor across a lens never makes the glow flash
      var tau = face > faceS[bi] ? .24 : .55;
      faceS[bi] += (face - faceS[bi]) * (1 - Math.exp(-dtr / tau));
      face = faceS[bi];
      faceMax = Math.max(faceMax, face * easeInOut(SPOTS[bi].p) * (bi === 1 ? 1 - cl(e * 1.4) : 1 - cl(e / .06)));
      var bop = Math.max(flare, face * .85) * .9 * easeInOut(SPOTS[bi].p) * (bi === 1 ? 1 - cl(e * 1.4) : 1 - cl(e / .06));
      blooms[bi].setAttribute("transform", "matrix(" + [brad, 0, 0, brad, bl.c[0], bl.c[1]].map(function (v) { return v.toFixed(2); }).join(" ") + ")");
      blooms[bi].setAttribute("opacity", bop.toFixed(3));
    }

    // a subtle glow in the lamp colour along the screen edges while the spots dazzle, fading as the dive begins
    vignette.style.opacity = (Math.max(flare, faceMax * .8) * .55 * (1 - cl(e * 1.3))).toFixed(3);

    // The truss is faintly visible while any light is on, and fully in the dark once every spot is off.
    var anyOn = Math.max(easeInOut(SPOTS[0].p), easeInOut(SPOTS[1].p), easeInOut(SPOTS[2].p));
    var amb = Math.round(3 + 39 * anyOn);
    if (amb !== lastAmb) { lastAmb = amb; trussAmb.setAttribute("fill", "rgb(" + amb + "," + amb + "," + amb + ")"); }

    var gl = poolE > 2 && e < .7 ? .8 * (poolE / g.R) * (1 - e / .7) : 0;
    glow.style.opacity = gl.toFixed(3);
    if (gl > 0) {
      var gr = r * 1.6;
      glow.style.transform = "translate(" + (mx - gr).toFixed(1) + "px," + (my - gr).toFixed(1) + "px) scale(" + (2 * gr / 200).toFixed(3) + ")";
    }

    // The rig fades out as the camera flies into the lens.
    fixture.style.opacity = (1 - cl(e * 1.4)).toFixed(3);

    // beams
    var T = target(t), i, s, sp, R;
    anyBeam = false; nBeams = 0;
    for (i = 0; i < 3; i++) {
      sp = SPOTS[i];
      s = (i === 1 ? cl((poolE / g.R - .6) / .4) * (1 - cl(e * 2)) : easeInOut(sp.p) * (1 - cl(e / .06)));
      s *= 1 - cl(flare * 2);                    // the beams swing round to face the visitor: glare replaces them
      if (!T || s <= .01) { hideBeam(beams[i]); continue; }
      R = Math.hypot(sp.lens.e1[0], sp.lens.e1[1]) * (i === 1 ? poolE / g.R : 1);
      if (i === 1 ? drawBeam(beams[i], mx, my, R, T, s) : drawBeam(beams[i], sp.lens.c[0], sp.lens.c[1], R, T, s)) { anyBeam = true; nBeams++; }
    }

    // The enter button lives in the dark. Each part of the box is lit by the beam that actually falls on it, so it
    // lights up from the side the light comes from. In complete darkness (all spots off) it cannot be used.
    if (!push && lensOn) {
      var br = enter.getBoundingClientRect(), N = 9, q, stops = [], maxLit = 0, a;
      for (q = 0; q < N; q++) {
        a = cl(beamLight(br.left + br.width * q / (N - 1), br.top + br.height / 2) * 3.5);
        if (a > maxLit) maxLit = a;
        stops.push("rgba(0,0,0," + a.toFixed(3) + ") " + (q / (N - 1) * 100).toFixed(1) + "%");
      }
      var mask = "linear-gradient(90deg," + stops.join(",") + ")";
      enter.style.opacity = 1;
      enter.style.webkitMaskImage = mask;
      enter.style.maskImage = mask;
      enter.disabled = maxLit < .12;
    }
  }

  // How much beam light falls on a screen point (0..1), from the beams drawn this frame.
  function beamLight(x, y) {
    var best = 0, i, gm, dx, dy, t, d, hw, v;
    for (i = 0; i < 3; i++) {
      gm = beams[i].geo;
      if (!gm) continue;
      dx = x - gm.sx; dy = y - gm.sy;
      t = (dx * gm.ux + dy * gm.uy) / gm.L;
      if (t >= 0 && t <= 1) {
        d = Math.abs(-dx * gm.uy + dy * gm.ux);
        hw = (gm.w0 + (gm.w1 - gm.w0) * beamFlare(t)) * .95;
        if (d < hw) {
          v = 1.4 * gm.s * Math.pow(1 - t, 1.05) * (1 - Math.pow(d / hw, 1.5));   // reveals a bit further than the beam is visibly bright
          if (v > best) best = v;
        }
      }
    }
    return best;
  }

  var BLIND_MS = 250, blindT0 = 0, flare = 0, released = false;
  function beginPush(ms) {
    if (push || done) return;
    var blind = ms >= 1000, now0 = performance.now();
    // Entering: first every spot powers up and turns to face the visitor in a wash of glare, then the camera dives in.
    push = { t0: now0 + (blind ? BLIND_MS : 0), dur: ms, blind: blind };
    if (blind) {
      blindT0 = now0;
      // Lights stay as the visitor left them, unless the centre one is off: then everything comes on.
      if (!SPOTS[1].on) SPOTS.forEach(function (sp) { sp.on = true; if (sp.hit) sp.hit.setAttribute("aria-pressed", "true"); });
    } else {
      released = true;
      root.classList.add("intro-release", "intro-fast");      // skipping: no dazzle, no staged fade-ins
      if (window.__heroLive) window.__heroLive(".5s");
    }
    enter.style.opacity = 0;
    enter.disabled = true;
    skip.style.transition = "opacity .35s ease";
    skip.style.opacity = 0;
    skip.style.pointerEvents = "none";
    enter.blur();
  }

  function finish() {
    done = true;
    cancelAnimationFrame(raf);
    try { sessionStorage.setItem(KEY, "1"); } catch (err) {}
    var focusInIntro = box.contains(document.activeElement);
    stage.style.transform = "";
    stage.style.transformOrigin = "";
    nav.style.transform = "";
    stage.removeAttribute("inert");
    root.classList.remove("intro-pending", "intro-release", "intro-fast");
    window.scrollTo(0, 0);
    if (focusInIntro || document.activeElement === document.body) {
      var hero = $("hero");
      hero.setAttribute("tabindex", "-1");
      hero.focus({ preventScroll: true });
    }
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointer);
  }

  function tick(now) {
    if (done) return;
    var t = now - start, dt = Math.min(64, now - (prevNow || now - 16));
    prevNow = now; tNow = t;
    // Adaptive quality. Under 30 fps (most frames slower than ~33 ms) the beams step down (20 -> 10 -> 5 -> 3 layers, each
    // stronger) and the screen blend is dropped. When the frame rate is good again (nearly all frames under ~22 ms, i.e. 45+ fps,
    // held over ~2 s) they step back up. A level that failed right after a step up is not tried again, so it cannot flicker.
    // Long stalls (>250 ms) and hidden tabs are ignored.
    // Fewer lights on means less work: when a light is switched off, start again from full quality and let the checks
    // below step down again only if the device still cannot keep up.
    if (nBeams < lastBeams && beamStep > 1) {
      beamStep = 1; floorStep = 1; stepUpAt = 0; perfAcc = 0; perfN = 0; perfGood = 0;
      root.classList.remove("intro-lite"); bloomG.style.mixBlendMode = "screen";
    }
    lastBeams = nBeams;
    if (anyBeam && !document.hidden && dt < 250) {
      perfN++; if (dt > 33.4) perfAcc++; if (dt < 22) perfGood++;
      if (perfN >= 40 && beamStep < 7 && perfAcc > perfN * .6) {
        if (stepUpAt && tNow - stepUpAt < 6000) floorStep = beamStep === 1 ? 2 : beamStep === 2 ? 4 : 7;
        beamStep = beamStep === 1 ? 2 : beamStep === 2 ? 4 : 7;
        root.classList.add("intro-lite"); bloomG.style.mixBlendMode = "normal";
        perfAcc = 0; perfN = 0; perfGood = 0;
      } else if (perfN >= 120) {
        var up = beamStep === 7 ? 4 : beamStep === 4 ? 2 : beamStep === 2 ? 1 : 0;
        if (up && up >= floorStep && perfGood > perfN * .95) {
          beamStep = up; stepUpAt = tNow;
          if (up === 1) { root.classList.remove("intro-lite"); bloomG.style.mixBlendMode = "screen"; }
        }
        perfAcc = 0; perfN = 0; perfGood = 0;
      }
    } else if (document.hidden || !anyBeam) { perfAcc = 0; perfN = 0; perfGood = 0; }
    if (!fxOn && t >= 1300) { fxOn = true; fixture.classList.add("fx-on"); }
    if (!lensOn && t >= 3000) { lensOn = true; fixture.classList.add("lens-on"); box.classList.add("armed"); }
    if (!push) {
      pool = g.R * easeOut(cl((t - 3000) / 1300));
      if (!btnOn && t >= 4200) { btnOn = true; lastInput = now; }
      // "Enter the light" sits in the dark and only shows where a beam shines on it (see render).
      // There is no idle auto-enter any more: the visitor has to find the button. Skip is always available.
    }
    var nx = pointer ? (pointer.x / g.vw - .5) * 2 : Math.sin(t / 1700) * .3;
    var ny = pointer ? (pointer.y / g.vh - .5) * 2 : Math.cos(t / 2100) * .25;
    // Every lit spot swings its head toward the target; parked spots ease their power up or down.
    var T = target(t), i, sp, tx, ty;
    for (i = 0; i < 3; i++) {
      sp = SPOTS[i];
      if (i !== 1 || lensOn) sp.p = cl(sp.p + (sp.on ? dt / (push && push.blind ? 2200 : 1300) : -dt / 2000));   // power-down is slower and eases out
      var live = sp.p > .5 && !(push && push.blind);     // while dazzling, every head looks straight at the visitor
      tx = live && T ? Math.max(-1, Math.min(1, (T.x - sp.lens.c[0]) / (g.vw * .5))) : 0;
      ty = live && T ? Math.max(-1, Math.min(1, (T.y - sp.lens.c[1]) / (T.y > sp.lens.c[1] ? Math.max(g.vh - sp.lens.c[1], 1) * .8 : g.vh * .5))) : 0;   // bottom of the screen = full downward tilt
      var ak = push && push.blind ? .032 : .08;      // heads turn back to face the visitor slowly while dazzling
      var ake = 1 - Math.pow(1 - ak, dt / 8.333);    // time-based (tuned at 120 fps), so the heads keep up with the beam when frames are slow
      sp.aim.x += (tx - sp.aim.x) * ake;
      sp.aim.y += (ty - sp.aim.y) * ake;
    }
    var dke = 1 - Math.pow(1 - .06, dt / 8.333);
    drift.x += (nx * Math.min(36, g.vw * .06) - drift.x) * dke;
    drift.y += (ny * Math.min(26, g.vh * .04) - drift.y) * dke;

    flare = push && push.blind ? easeInOut(cl((now - blindT0) / 1700)) : 0;   // the glare rises slowly
    if (push && !released && now >= push.t0) { released = true; root.classList.add("intro-release"); if (window.__heroLive) window.__heroLive("1.15s"); }
    if (push) {
      var p = cl((now - push.t0) / push.dur);
      e = easeInOut(p);                // a cubic: the zoom fades in gently from rest, then speeds up
      if (p >= 1) { e = 1; render(t); finish(); return; }
    }
    render(t);
    raf = requestAnimationFrame(tick);
  }

  function onResize() { if (!push) measure(); }
  function onPointer(ev) { pointer = { x: ev.clientX, y: ev.clientY }; lastInput = performance.now(); }

  enter.addEventListener("click", function () { beginPush(PUSH_MS); });
  skip.addEventListener("click", function () { beginPush(SKIP_MS); });
  [0, 1, 2].forEach(function (i) {
    var sp = SPOTS[i], names = ["left", "centre", "right"];
    sp.hit.addEventListener("click", function () {
      sp.on = !sp.on;
      sp.hit.setAttribute("aria-pressed", sp.on ? "true" : "false");
      sp.hit.setAttribute("aria-label", "Switch the " + names[i] + " spot " + (sp.on ? "off" : "on"));
      lastInput = performance.now();
    });
  });
  document.addEventListener("keydown", function (ev) {
    lastInput = performance.now();
    if (ev.key === "Escape" && !done) beginPush(SKIP_MS);
  });
  window.addEventListener("touchstart", function () { lastInput = performance.now(); }, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("resize", onResize);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (!push && !done) measure(); });

  enter.disabled = true;      // the button is dead until a beam actually lights it
  var began = false;
  function begin() {
    if (began || done) return; began = true;
    measure();
    render(0);
    raf = requestAnimationFrame(function (now) { start = now; tick(now); });
  }
  // Start once the web fonts have arrived (or after 1.2 s on a slow connection): a font swap in the middle of the intro re-lays out the page and makes it stutter.
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(begin); setTimeout(begin, 1200); } else begin();
})();

// Rig faders are for show: touching one pops up "Console locked" for a couple of seconds.
(function () {
  "use strict";
  var rig = document.getElementById("rig");
  if (!rig) return;
  var C = (window.SITE && window.SITE.console) || {};
  var pop = document.createElement("div");
  pop.className = "locked"; pop.setAttribute("role", "status"); pop.setAttribute("aria-live", "polite");
  pop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path class="shackle" d="M8 11V8a4 4 0 018 0v3"/></svg><span class="locked-t"></span>';
  pop.querySelector(".locked-t").textContent = C.locked || "Console locked";
  document.body.appendChild(pop);
  var timer = 0;
  function show() {
    pop.classList.remove("show"); void pop.offsetWidth; pop.classList.add("show");   // restart the animation on every attempt
    clearTimeout(timer);
    timer = setTimeout(function () { pop.classList.remove("show"); }, 2600);
  }
  rig.addEventListener("pointerdown", function (ev) { if (ev.target.closest && ev.target.closest(".fader")) show(); });
  function hide() { clearTimeout(timer); pop.classList.remove("show"); }
  window.addEventListener("scroll", function () { if (pop.classList.contains("show")) hide(); }, { passive: true });   // scrolling dismisses it
  window.addEventListener("wheel", function () { if (pop.classList.contains("show")) hide(); }, { passive: true });
})();

// TEMP: Safari / slow-device diagnostic panel. Open index.html?diag=1 to get an fps counter and switches for the heavy parts of the
// intro, so we can see which one is slow on a given browser. Remove this block (and the ?diag use) before launch.
(function () {
  "use strict";
  if (!/[?&]diag\b/.test(location.search)) return;
  var $ = function (id) { return document.getElementById(id); };
  var panel = document.createElement("div");
  panel.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:2147483600;background:rgba(0,0,0,.85);color:#fff;font:12px/1.5 -apple-system,system-ui,sans-serif;padding:8px 10px;border:1px solid #555;border-radius:4px;max-width:260px";
  var fps = document.createElement("div"); fps.style.cssText = "font-weight:700;margin-bottom:4px"; fps.textContent = "fps ...";
  panel.appendChild(fps);
  function sw(label, off, on) {
    var l = document.createElement("label"); l.style.cssText = "display:block;cursor:pointer";
    var c = document.createElement("input"); c.type = "checkbox"; c.checked = true; c.style.marginRight = "6px";
    c.addEventListener("change", function () { c.checked ? on() : off(); });
    l.appendChild(c); l.appendChild(document.createTextNode(label)); panel.appendChild(l);
  }
  function el(id) { return $(id); }
  var blendEls = ["introBeam", "introVignette", "introGlow"];
  sw("Dark + truss reveal masks", function () { el("fxDark").removeAttribute("mask"); el("fxTruss").removeAttribute("mask"); }, function () { el("fxDark").setAttribute("mask", "url(#darkMask)"); el("fxTruss").setAttribute("mask", "url(#trussMask)"); });
  sw("Lit-spot lens mask", function () { el("fxG").removeAttribute("mask"); }, function () { el("fxG").setAttribute("mask", "url(#holeMaskFx)"); });
  sw("Black screen + lens window", function () { el("introMask").style.display = "none"; }, function () { el("introMask").style.display = ""; });
  sw("Blend modes (screen)", function () { blendEls.forEach(function (i) { el(i).style.mixBlendMode = "normal"; }); }, function () { blendEls.forEach(function (i) { el(i).style.mixBlendMode = ""; }); });
  sw("Beams + lens lights", function () { el("introBeam").style.display = "none"; }, function () { el("introBeam").style.display = ""; });
  sw("Edge glow", function () { el("introVignette").style.display = "none"; }, function () { el("introVignette").style.display = ""; });
  sw("Fixture drawings", function () { el("fixture").style.display = "none"; }, function () { el("fixture").style.display = ""; });
  var hint = document.createElement("div"); hint.style.cssText = "margin-top:4px;color:#aaa"; hint.textContent = "Move the mouse around, untick one box at a time, watch fps.";
  panel.appendChild(hint);
  document.body.appendChild(panel);
  var frames = 0, t0 = performance.now(), worst = 0, last = t0;
  (function loop(n) {
    frames++; worst = Math.max(worst, n - last); last = n;
    if (n - t0 >= 1000) { fps.textContent = Math.round(frames * 1000 / (n - t0)) + " fps (worst frame " + Math.round(worst) + " ms)"; frames = 0; worst = 0; t0 = n; }
    requestAnimationFrame(loop);
  })(performance.now());
})();
