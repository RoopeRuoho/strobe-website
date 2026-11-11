// "Under construction" first screen. It is on every page until the secret word is typed (just type it, no box is shown).
// On a phone, tap the little light to bring up the keyboard. The word is remembered in this browser (localStorage).
// NOTE: this is a courtesy screen, not real security. Anyone who reads this file can find the word. Remove the gate (and the
// <script src="gate.js"> line in each page) before launch.
(function () {
  "use strict";
  var WORD = "strobe", KEY = "strobe-unlocked";
  try { if (localStorage.getItem(KEY) === "1") return; } catch (e) {}
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
    ".gate-lamp{position:relative;width:56px;height:56px;border-radius:50%;border:0;padding:0;cursor:default;background:radial-gradient(circle,#ffd9a0 0 18%,#ffb347 40%,rgba(255,179,71,.0) 72%);" +
      "box-shadow:0 0 60px 12px rgba(255,179,71,.28);animation:gatePulse 2.4s ease-in-out infinite;-webkit-tap-highlight-color:transparent}" +
    "@keyframes gatePulse{0%,100%{opacity:.55;transform:scale(.92)}50%{opacity:1;transform:scale(1.04)}}" +
    ".gate-brand{font:800 clamp(2.2rem,8vw,5rem)/1 'Syne',system-ui,sans-serif;letter-spacing:-.01em;text-transform:uppercase;margin:0}" +
    ".gate-title{font:600 1rem/1.2 'Barlow Condensed',system-ui,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#ffb347;margin:0}" +
    ".gate-text{font:400 1rem/1.5 'Barlow',system-ui,sans-serif;color:#9a9aa2;max-width:34ch;margin:0}" +
    ".gate-in{position:absolute;left:50%;top:50%;width:56px;height:56px;margin:-28px 0 0 -28px;opacity:0;border:0;padding:0;font-size:16px}" +
    ".gate.ok .gate-lamp{animation:none;opacity:1;transform:scale(1.6);transition:transform .5s ease;box-shadow:0 0 120px 40px rgba(255,179,71,.6)}" +
    "@media (prefers-reduced-motion:reduce){.gate::before,.gate-lamp{animation:none}}";
  document.head.appendChild(css);

  function build() {
    var G = (window.SITE && window.SITE.gate) || {};
    var brand = (window.SITE && window.SITE.brand) || "Strobe Corp";
    var g = document.createElement("div");
    g.className = "gate"; g.setAttribute("role", "main");
    g.innerHTML = '<button type="button" class="gate-lamp" tabindex="-1" aria-hidden="true"></button>' +
      '<h1 class="gate-brand"></h1><p class="gate-title"></p><p class="gate-text"></p>' +
      '<input class="gate-in" type="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="Access code">';
    g.querySelector(".gate-brand").textContent = brand;
    g.querySelector(".gate-title").textContent = G.title || "Under construction";
    g.querySelector(".gate-text").textContent = G.text || "The new site is being built. Back soon.";
    document.body.appendChild(g);
    document.title = (G.title || "Under construction") + " | " + brand;

    var input = g.querySelector(".gate-in"), buf = "", done = false;
    function open() {
      if (done) return; done = true;
      try { localStorage.setItem(KEY, "1"); } catch (e) {}
      g.classList.add("ok");
      setTimeout(function () { g.classList.add("out"); }, 350);
      setTimeout(function () { location.reload(); }, 900);            // reload so the real page (and its intro) starts clean
    }
    function check(s) { if (s.toLowerCase().indexOf(WORD) !== -1) { open(); return true; } return false; }
    document.addEventListener("keydown", function (e) {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      buf = (buf + e.key).slice(-WORD.length); check(buf);
    });
    input.addEventListener("input", function () { if (!check(input.value)) { if (input.value.length > 24) input.value = ""; } });
    g.querySelector(".gate-lamp").addEventListener("click", function () { input.focus(); });   // phones: tap the light to type
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
