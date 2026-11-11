// About page: renders from content.js (S.aboutPage) using the same styles as the main site.
(function () {
  "use strict";
  var S = window.SITE;
  if (!S || !S.aboutPage) return;
  var A = S.aboutPage;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  $("logo").textContent = S.brand;
  S.nav.forEach(function (item) {
    var a = el("a", null, item.label);
    a.href = item.href || "index.html#" + item.id;
    if (item.href === "about.html") a.setAttribute("aria-current", "page");
    $("nav").appendChild(a);
  });

  $("ap-eyebrow").textContent = A.eyebrow;
  $("ap-title").textContent = A.title;
  $("ap-lead").textContent = A.lead;
  var img = $("ap-img"); img.src = A.portrait.image; img.alt = A.portrait.alt;
  A.story.forEach(function (p) { $("ap-story").appendChild(el("p", null, p)); });
  S.about.stats.forEach(function (s) {
    var ym = /^\{years:(\d{4})\}$/.exec(s.value);
    var row = el("div", "stat");
    row.appendChild(el("dd", "stat-value", ym ? String(Math.max(0, new Date().getFullYear() - parseInt(ym[1], 10))) : s.value));
    row.appendChild(el("dt", "stat-label", s.label));
    $("ap-stats").appendChild(row);
  });
  $("ap-do-title").textContent = A.doTitle;
  A.does.forEach(function (d) {
    var li = el("li", "do-card");
    li.appendChild(el("h3", "card-title", d.title)); li.appendChild(el("p", null, d.text));
    $("ap-do").appendChild(li);
  });
  $("ap-tl-title").textContent = A.timelineTitle;
  A.timeline.forEach(function (t) {
    var li = el("li", "tl-item");
    li.appendChild(el("span", "tl-year", t.year)); li.appendChild(el("p", null, t.text));
    $("ap-tl").appendChild(li);
  });
  var cta = $("ap-cta"); cta.textContent = A.cta; cta.href = A.ctaHref || "index.html#contact";
  $("footer-text").textContent = S.footer;
})();
