// Count-up for the stat numbers (e.g. 300+): runs once when a number scrolls into view. Skipped for reduced motion.
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = [].slice.call(document.querySelectorAll(".stat-value"));
  if (!els.length || reduce || !("IntersectionObserver" in window)) return;
  // Park every number on 0 straight away, so the final value never shows before the count starts.
  els.forEach(function (el) {
    var m = /^(\d+)(\D*)$/.exec(el.textContent.trim());
    if (!m) return;
    el.dataset.end = m[1]; el.dataset.tail = m[2];
    el.setAttribute("aria-label", el.textContent.trim());           // screen readers get the final value, not the counting
    el.style.fontVariantNumeric = "tabular-nums";
    el.textContent = "0" + m[2];
  });
  function run(el) {
    if (el.dataset.end == null) return;
    var end = parseInt(el.dataset.end, 10), tail = el.dataset.tail, t0 = 0, dur = 1700;
    function frame(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * e) + tail;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var io = new IntersectionObserver(function (en) {
    en.forEach(function (x) { if (x.isIntersecting) { io.unobserve(x.target); run(x.target); } });
  }, { threshold: .6 });
  els.forEach(function (e) { io.observe(e); });
})();
