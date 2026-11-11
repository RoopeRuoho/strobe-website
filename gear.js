// Gear page: renders from content.js (S.gear) using the same styles as the main site.
(function () {
  "use strict";
  var S = window.SITE;
  if (!S || !S.gear) return;
  var G = S.gear;
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  $("logo").textContent = S.brand;
  S.nav.forEach(function (item) {
    var a = el("a", null, item.label);
    a.href = item.href || "index.html#" + item.id;
    if (item.href === "gear.html") a.setAttribute("aria-current", "page");
    $("nav").appendChild(a);
  });
  $("gear-cue").textContent = G.cue;
  $("gear-title").textContent = G.title;
  $("gear-text").textContent = G.text;
  var mail = "";
  S.contact.rows.forEach(function (r) { if (r.label === "Email") mail = r.value; });
  G.items.forEach(function (g) {
    var li = el("li", "gear-card");
    var fig = el("div", "gear-media" + (g.fit === "contain" ? " contain" : ""));   // fit: "contain" shows a product shot whole instead of cropped
    (g.images && g.images.length ? g.images : [g.image]).forEach(function (src, k) {      // `images` shows several pictures side by side
      var gi = el("img"); gi.src = src; gi.alt = k ? "" : g.alt; gi.width = 800; gi.height = 500; gi.loading = "lazy";
      if (g.scale && !g.images) { gi.style.width = Math.round(g.scale * 100) + "%"; gi.style.margin = "0 auto"; }   // `scale` shrinks a picture inside its card
      fig.appendChild(gi);
    });
    var body = el("div", "gear-body"), top = el("div", "gear-top");
    top.appendChild(el("p", "card-tag", g.category));
    if (g.qty) top.appendChild(el("span", "gear-qty", "\u00d7 " + g.qty));      // quantity is optional
    body.appendChild(top);
    body.appendChild(el("h3", "card-title", g.name));
    var ul = el("ul", "gear-specs");
    g.specs.forEach(function (sp) { ul.appendChild(el("li", null, sp)); });
    body.appendChild(ul);
    var l = el("a", "gear-link", G.button);
    l.href = "mailto:" + mail + "?subject=" + encodeURIComponent((G.subject || "Rental enquiry") + ": " + g.name);
    body.appendChild(l);
    li.appendChild(fig); li.appendChild(body);
    $("gear-grid").appendChild(li);
  });
  $("footer-text").textContent = S.footer;
})();
