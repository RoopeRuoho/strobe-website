// The stat numbers (years, shows, venues) are drawn as a timecode clock: lit seven-segment digits on a dark bezel.
// They count up once when they scroll into view (skipped for reduced motion).
// Easter egg: click any clock three times and they all go nuts for a few seconds, then lock back onto the real numbers.
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = [].slice.call(document.querySelectorAll(".stat-value"));
  if (!els.length) return;

  // Which of the seven segments (a top, b top right, c bottom right, d bottom, e bottom left, f top left, g middle) are lit per digit
  var LIT = { 0: "abcdef", 1: "bc", 2: "abdeg", 3: "abcdg", 4: "bcfg", 5: "acdfg", 6: "acdefg", 7: "abc", 8: "abcdefg", 9: "abcdfg" };
  var SEG = {
    a: "10,7 17,0 43,0 50,7 43,14 17,14", b: "53,9 60,16 60,44 53,51 46,44 46,16", c: "53,53 60,60 60,88 53,95 46,88 46,60",
    d: "10,97 17,90 43,90 50,97 43,104 17,104", e: "7,53 14,60 14,88 7,95 0,88 0,60", f: "7,9 14,16 14,44 7,51 0,44 0,16", g: "10,52 17,45 43,45 50,52 43,59 17,59"
  };
  var DIGIT = {};
  for (var d = 0; d <= 9; d++) {
    var h = '<svg class="tc-d" viewBox="0 0 60 104" aria-hidden="true" focusable="false">';
    "abcdefg".split("").forEach(function (k) { h += '<polygon class="' + (LIT[d].indexOf(k) > -1 ? "on" : "off") + '" points="' + SEG[k] + '"/>'; });
    DIGIT[d] = h + "</svg>";
  }
  var PLUS = '<svg class="tc-p" viewBox="0 0 40 104" aria-hidden="true" focusable="false"><polygon class="on" points="4,52 10,46 30,46 36,52 30,58 10,58"/><polygon class="on" points="14,36 20,30 26,36 26,68 20,74 14,68"/></svg>';

  function show(el, n, tail) {
    var s = String(n), html = "";
    while (s.length < 3) s = "0" + s;                               // a clock always shows a fixed number of digits
    for (var i = 0; i < s.length; i++) html += DIGIT[s.charAt(i)];
    if (tail.indexOf("+") > -1) html += PLUS;
    el.innerHTML = html;
  }

  // The three clocks together show ONE timecode HH:MM:SS:FF (8 digits, 3 colons) while they go nuts: the digits are split 3 + 3 + 2 over the
  // boxes, with the colons where they fall, so it reads HH:M | M:SS | :FF across the row.
  var COLON = '<span class="tc-c" aria-hidden="true"><i></i><i></i></span>';
  function showTC(el, box, c) {
    var D = function (i) { return DIGIT[c.charAt(i)]; };
    el.innerHTML = box === 0 ? D(0) + D(1) + COLON + D(2) : box === 1 ? D(3) + COLON + D(4) + D(5) : COLON + D(6) + D(7);
  }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  // An angry 8-bit face (11 x 11 pixels), shown in red on every clock at the end of the nuts
  var FACEMAP = ["00011111000", "00100000100", "01011011010", "10001110001", "10011011001", "10011011001", "10000000001", "10001110001", "01010001010", "00100000100", "00011111000"];   // angry, 11 x 11: V-shaped brows, glaring eyes, a frown
  var FACE = '<svg class="tc-f" viewBox="0 0 11 11" aria-hidden="true" focusable="false">';
  FACEMAP.forEach(function (row, y) { row.split("").forEach(function (v, x) { if (v === "1") FACE += '<rect x="' + (x + .06) + '" y="' + (y + .06) + '" width=".88" height=".88"/>'; }); });
  FACE += "</svg>";

  els.forEach(function (el) {
    var m = /^(\d+)(\D*)$/.exec(el.textContent.trim());
    if (!m) return;
    el.dataset.end = m[1]; el.dataset.tail = m[2];
    el.setAttribute("role", "text");
    el.setAttribute("aria-label", el.textContent.trim());           // screen readers get the final value, not the counting
    el.classList.add("tc");
    // Park on 0 straight away when it will count up, so the final value never shows before the count starts
    show(el, (reduce || !("IntersectionObserver" in window)) ? parseInt(m[1], 10) : 0, m[2]);
  });

  // Easter egg: click any clock three times and the three go nuts together as one timecode (HH:MM:SS:FF) for a few seconds, shaking and
  // flashing yellow and red, then end on red angry 8-bit faces before the real numbers come back.
  if (!reduce) {
    var clicks = 0, lastClick = 0, nuts = false;
    var goNuts = function () {
      if (nuts) return;
      nuts = true;
      // Together the three clocks are ONE timecode going nuts: racing, jumping, now and then backwards, then each box locks back (left to right)
      var live = els.filter(function (e) { return e.dataset.end != null; }), t0 = performance.now(), DUR = 3200, tick = 0, ms = Math.floor(Math.random() * 86400000), dir = 1;
      live.forEach(function (e) { e.classList.add("tc-nuts"); });
      tick = setInterval(function () {
        var p = Math.min(1, (performance.now() - t0) / DUR);
        if (Math.random() < .3) dir = -dir;
        var r = Math.random();                                           // mostly big leaps: seconds, minutes, hours, or anywhere at all
        ms = r < .2 ? Math.floor(Math.random() * 86400000) : (ms + dir * (r < .5 ? 4000 + Math.random() * 120000 : r < .8 ? 600000 + Math.random() * 3600000 : 7200000 + Math.random() * 28800000) + 86400000) % 86400000;
        var tc = two(Math.floor(ms / 3600000)) + two(Math.floor(ms / 60000) % 60) + two(Math.floor(ms / 1000) % 60) + two(Math.floor(Math.random() * 25));
        live.forEach(function (e, i) { showTC(e, i % 3, tc); });
        if (p >= 1) {
          clearInterval(tick);
          // the end: a red angry 8-bit face on every clock for a moment, then the real numbers come back
          live.forEach(function (e) { e.style.minWidth = e.offsetWidth + "px"; e.classList.remove("tc-nuts"); e.classList.add("tc-sad"); e.innerHTML = FACE; });
          setTimeout(function () {
            live.forEach(function (e) { e.classList.remove("tc-sad"); e.style.minWidth = ""; show(e, parseInt(e.dataset.end, 10), e.dataset.tail); });
            nuts = false;
          }, 1800);
        }
      }, 75);
    };
    els.forEach(function (e) {
      e.addEventListener("click", function () {
        var now = Date.now();
        clicks = now - lastClick < 650 ? clicks + 1 : 1; lastClick = now;
        if (clicks >= 3) { clicks = 0; goNuts(); }
      });
    });
  }
  if (reduce || !("IntersectionObserver" in window)) return;

  function run(el) {
    if (el.dataset.end == null) return;
    var end = parseInt(el.dataset.end, 10), tail = el.dataset.tail, t0 = 0, dur = 1700, last = -1;
    function frame(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3), v = Math.round(end * e);
      if (v !== last) { last = v; show(el, v, tail); }
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { io.unobserve(x.target); run(x.target); } });
  }, { threshold: .6 });
  els.forEach(function (e) { io.observe(e); });
})();
