// "Under construction" first screen: a notice with an "Understood" button (hard hat). It is shown on every page until the button is
// pressed; it is remembered for this browser tab (sessionStorage), so a visitor sees it once per visit.
// Remove the gate (and the <script src="gate.js"> line in each page) before launch.
(function () {
  "use strict";
  var KEY = "strobe-gate-ok";
  try { if (sessionStorage.getItem(KEY) === "1") return; } catch (e) {}
  var root = document.documentElement;
  root.classList.add("gated");

  var css = document.createElement("style");
  css.textContent =
    "html.gated{background:#050505}" +
    "html.gated body>*:not(.gate){display:none!important}" +
    ".gate{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;padding:24px;text-align:center;" +
      "background:#050505;color:#f3f1ec;overflow:hidden;transition:opacity .6s ease}" +
    ".gate.out{opacity:0}" +
    ".gate::before{content:'';position:absolute;left:50%;top:-10%;width:140vmax;height:140vmax;margin-left:-70vmax;pointer-events:none;" +
      "background:conic-gradient(from 168deg at 50% 0%,transparent 0deg,rgba(255,179,71,.10) 6deg,transparent 14deg);transform-origin:50% 0;animation:gateSweep 11s ease-in-out infinite alternate}" +
    "@keyframes gateSweep{from{transform:rotate(-24deg)}to{transform:rotate(24deg)}}" +
    ".gate>*{position:relative;z-index:1}" +
    ".gate>.gate-beam{position:absolute;z-index:0;top:-10%;width:140vmax;height:140vmax;pointer-events:none;transform-origin:50% 0}" +
    ".gate-beam.b2{left:22%;margin-left:-70vmax;background:conic-gradient(from 170deg at 50% 0%,transparent 0deg,rgba(255,179,71,.08) 5deg,transparent 12deg);animation:gateSweep 15s ease-in-out -4s infinite alternate-reverse}" +
    ".gate-beam.b3{left:78%;margin-left:-70vmax;background:conic-gradient(from 166deg at 50% 0%,transparent 0deg,rgba(255,200,120,.07) 6deg,transparent 14deg);animation:gateSweep 13s ease-in-out -8s infinite alternate}" +
    ".gate-lamp{position:relative;width:56px;height:56px;border-radius:50%;background:radial-gradient(circle,#ffd9a0 0 18%,#ffb347 40%,rgba(255,179,71,.0) 72%);" +
      "box-shadow:0 0 60px 12px rgba(255,179,71,.28);animation:gatePulse 2.4s ease-in-out infinite}" +
    "@keyframes gatePulse{0%,100%{opacity:.55;transform:scale(.92)}50%{opacity:1;transform:scale(1.04)}}" +
    ".gate-brand{font:800 clamp(2.2rem,8vw,5rem)/1 'Syne',system-ui,sans-serif;letter-spacing:-.01em;text-transform:uppercase;margin:0}" +
    ".gate-title{font:600 1rem/1.2 'Barlow Condensed',system-ui,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#ffb347;margin:0}" +
    ".gate-text{font:400 1rem/1.5 'Barlow',system-ui,sans-serif;color:#9a9aa2;max-width:34ch;margin:0}" +
    ".gate-btn{display:inline-flex;align-items:center;gap:12px;min-height:60px;padding:8px 28px;margin-top:6px;border:0;border-radius:2px;cursor:pointer;" +
      "background:#ffb347;color:#000;font:600 1rem/1 'Barlow Condensed',system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;" +
      "touch-action:manipulation;-webkit-tap-highlight-color:transparent;transition:transform .2s ease,box-shadow .2s ease}" +
    ".gate-btn:hover{transform:translateY(-2px);box-shadow:0 8px 30px -8px #ffb347}" +
    ".gate-btn:focus-visible{outline:2px solid #fff;outline-offset:4px}" +
    ".gate-btn svg{width:26px;height:26px;flex:none;fill:currentColor}" +
    ".gate.ok .gate-lamp{animation:none;opacity:1;transform:scale(1.6);transition:transform .5s ease;box-shadow:0 0 120px 40px rgba(255,179,71,.6)}" +
    ".gate-lang{position:absolute;top:14px;right:14px;z-index:2;min-height:40px;padding:0 12px;background:rgba(5,5,5,.6);color:#9a9aa2;border:1px solid rgba(255,255,255,.14);border-radius:2px;" +
      "font:600 .85rem/1 'Barlow Condensed',system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;touch-action:manipulation}" +
    ".gate-lang:hover{color:#f3f1ec;border-color:#9a9aa2}" +
    ".gate-btn-w{display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center}" +
    ".gate-note{font:500 .66rem/1.2 'Barlow Condensed',system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:rgba(0,0,0,.62)}" +
    "@media (prefers-reduced-motion:reduce){.gate::before,.gate-beam,.gate-lamp{animation:none}}";
  document.head.appendChild(css);

  // A hard hat: dome, ridge, brim.
  var HAT = '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">' +
    '<path d="M4 23C4 15.5 9 10.5 13.5 9.4V8h5v1.4C23 10.5 28 15.5 28 23z"/>' +
    '<rect x="1" y="23.5" width="30" height="3.2" rx="1.6"/>' +
    '<path d="M12.4 10v12.2M19.6 10v12.2" stroke="#ffb347" stroke-width="1.3" fill="none"/></svg>';   // dome with the ridge grooves, and the brim

  function build() {
    var G = (window.SITE && window.SITE.gate) || {};
    var brand = (window.SITE && window.SITE.brand) || "Strobe Corp";
    var g = document.createElement("div");
    g.className = "gate"; g.setAttribute("role", "main");
    g.innerHTML = '<div class="gate-beam b2" aria-hidden="true"></div><div class="gate-beam b3" aria-hidden="true"></div>' +
      '<div class="gate-lamp" aria-hidden="true"></div>' +
      '<button type="button" class="gate-lang" data-lang-switch></button>' +
      '<h1 class="gate-brand"></h1><p class="gate-title"></p><p class="gate-text"></p>' +
      '<button type="button" class="gate-btn">' + HAT + '<span class="gate-btn-w"><span class="gate-btn-t"></span><small class="gate-note"></small></span>' + HAT + '</button>';
    g.querySelector(".gate-brand").textContent = brand;
    g.querySelector(".gate-title").textContent = G.title || "Under construction";
    g.querySelector(".gate-text").textContent = G.text || "The new site is being built. Back soon.";
    g.querySelector(".gate-btn-t").textContent = G.button || "Understood, enter";
    g.querySelector(".gate-note").textContent = G.note || "";
    document.body.appendChild(g);
    if (window.paintLangButtons) window.paintLangButtons();
    document.title = (G.title || "Under construction") + " | " + brand;

    var btn = g.querySelector(".gate-btn"), done = false;
    btn.addEventListener("click", function () {
      if (done) return; done = true;
      try { sessionStorage.setItem(KEY, "1"); } catch (e) {}
      g.classList.add("ok");
      setTimeout(function () { g.classList.add("out"); }, 350);
      setTimeout(function () { location.reload(); }, 900);            // reload so the real page (and its intro) starts clean
    });
    try { btn.focus({ preventScroll: true }); } catch (e) {}           // Enter or Space works straight away
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
