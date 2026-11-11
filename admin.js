// Admin panel: UI only. It is filled from content.js so the layout looks real, but nothing is saved yet.
(function () {
  "use strict";
  var S = window.SITE;
  if (!S) return;

  var $ = function (id) { return document.getElementById(id); };
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function svg(path) {
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true");
    s.innerHTML = path;
    return s;
  }
  var ICON = {
    up: '<path d="M6 14l6-6 6 6"/>', down: '<path d="M6 10l6 6 6-6"/>', edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
    grip: '<circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/><circle cx="9" cy="12" r="1.6"/><circle cx="15" cy="12" r="1.6"/><circle cx="9" cy="18" r="1.6"/><circle cx="15" cy="18" r="1.6"/>'
  };
  function iconBtn(path, label, cls) {
    var b = el("button", "icon-btn" + (cls ? " " + cls : ""));
    b.type = "button"; b.setAttribute("aria-label", label); b.appendChild(svg(path));
    return b;
  }

  /* ---------- toast, dirty state ---------- */
  var toastT;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("show"); }, 3200);
  }
  var dirty = false;
  function markDirty() {
    if (dirty) return;
    dirty = true;
    $("dirty").hidden = false; $("save").disabled = false; $("discard").disabled = false;
  }
  function clearDirty() {
    dirty = false;
    $("dirty").hidden = true; $("save").disabled = true; $("discard").disabled = true;
  }
  $("save").addEventListener("click", function () { toast("Saving isn't connected yet. This is the UI only."); });
  $("discard").addEventListener("click", function () { renderAll(); clearDirty(); toast("Changes discarded."); });
  document.addEventListener("input", function (ev) { if (ev.target.closest("#panel-main")) markDirty(); });

  /* ---------- panels ---------- */
  var PANELS = {
    projects: ["Projects", "Add, edit and reorder the work shown on your site."],
    contact: ["Contact & availability", "The details in the patch sheet at the bottom of the site."],
    about: ["About", "Your story and the three numbers next to it."],
    rig: ["Skills & rig", "Consoles, software, fixtures and protocols, each with a fader level."],
    gels: ["Gel colours", "The accent colours visitors can switch between."],
    publish: ["Publish", "Get your changes onto the live site."]
  };
  var nav = $("adminNav");
  function show(name) {
    if (!PANELS[name]) name = "projects";
    [].forEach.call(document.querySelectorAll(".panel"), function (p) { p.hidden = p.id !== "panel-" + name; });
    [].forEach.call(nav.querySelectorAll("button"), function (b) {
      if (b.dataset.panel === name) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    $("panelTitle").textContent = PANELS[name][0];
    $("panelSub").textContent = PANELS[name][1];
    document.title = PANELS[name][0] + " | Strobe Corp Admin (UI preview)";
    if (location.hash !== "#" + name) history.replaceState(null, "", "#" + name);
  }
  nav.addEventListener("click", function (ev) { var b = ev.target.closest("button"); if (b) show(b.dataset.panel); });
  window.addEventListener("hashchange", function () { show(location.hash.slice(1)); });

  /* ---------- projects ---------- */
  var list = $("pList"), catSel = $("pCat"), search = $("pSearch");
  function cats() { return S.work.filters.filter(function (f) { return f !== "All"; }); }
  cats().forEach(function (c) { var o = el("option", null, c); o.value = c; catSel.appendChild(o); });
  var dragged = null;

  function row(p) {
    var li = el("li", "prow");
    li.dataset.id = p.id; li.dataset.cat = p.category; li.draggable = true;
    var grip = el("span", "grip"); grip.setAttribute("aria-hidden", "true"); grip.appendChild(svg(ICON.grip));
    var img = el("img", "thumb"); img.src = p.image; img.alt = ""; img.width = 96; img.height = 60; img.loading = "lazy";
    var info = el("div", "pinfo");
    var h = el("h3", null, p.title);
    var meta = el("p");
    meta.appendChild(el("span", "badge", p.category));
    meta.appendChild(document.createTextNode(p.venue + " · " + p.date));
    info.appendChild(h); info.appendChild(meta);
    var btns = el("div", "pbtns");
    var up = iconBtn(ICON.up, "Move " + p.title + " up"), dn = iconBtn(ICON.down, "Move " + p.title + " down");
    var ed = iconBtn(ICON.edit, "Edit " + p.title), del = iconBtn(ICON.trash, "Delete " + p.title, "danger");
    [up, dn, ed, del].forEach(function (b) { btns.appendChild(b); });
    li.appendChild(grip); li.appendChild(img); li.appendChild(info); li.appendChild(btns);

    function flash() { li.classList.add("moved"); setTimeout(function () { li.classList.remove("moved"); }, 700); markDirty(); updateCount(); }
    up.addEventListener("click", function () { var prev = li.previousElementSibling; if (prev) { list.insertBefore(li, prev); flash(); up.focus(); } });
    dn.addEventListener("click", function () { var next = li.nextElementSibling; if (next) { list.insertBefore(next, li); flash(); dn.focus(); } });
    ed.addEventListener("click", function () { openSheet(p); });
    del.addEventListener("click", function () { toast("Delete isn't connected yet. This is the UI only."); });
    li.addEventListener("dblclick", function () { openSheet(p); });
    li.addEventListener("dragstart", function (ev) { dragged = li; li.style.opacity = ".45"; ev.dataTransfer.effectAllowed = "move"; try { ev.dataTransfer.setData("text/plain", p.id); } catch (e) {} });
    li.addEventListener("dragend", function () { li.style.opacity = ""; dragged = null; });
    li.addEventListener("dragover", function (ev) {
      if (!dragged || dragged === li) return;
      ev.preventDefault();
      var r = li.getBoundingClientRect();
      list.insertBefore(dragged, ev.clientY < r.top + r.height / 2 ? li : li.nextSibling);
    });
    li.addEventListener("drop", function (ev) { ev.preventDefault(); markDirty(); });
    return li;
  }
  function filterRows() {
    var q = search.value.trim().toLowerCase(), c = catSel.value, n = 0;
    [].forEach.call(list.children, function (li) {
      if (!li.classList.contains("prow")) return;
      var ok = (c === "All" || li.dataset.cat === c) && (!q || li.textContent.toLowerCase().indexOf(q) !== -1);
      li.hidden = !ok; if (ok) n++;
    });
    var empty = list.querySelector(".empty");
    if (!n && !empty) { var e = el("li", "empty", "No projects match."); list.appendChild(e); }
    if (n && empty) empty.remove();
    $("pCount").textContent = n + (n === 1 ? " project" : " projects");
  }
  function updateCount() { filterRows(); }
  search.addEventListener("input", filterRows);
  catSel.addEventListener("change", filterRows);
  $("pAdd").addEventListener("click", function () { openSheet(null); });

  /* ---------- project editor sheet ---------- */
  var sheet = $("sheet"), drop = $("drop"), file = $("pFile"), current = null;
  var catField = $("pCategory");
  cats().forEach(function (c) { var o = el("option", null, c); o.value = c; catField.appendChild(o); });

  function setPreview(src, alt) {
    var img = $("dropImg");
    if (src) { img.src = src; img.alt = alt || ""; drop.classList.add("has"); $("dropMsg").querySelector("strong").textContent = "Replace photo"; }
    else { img.removeAttribute("src"); img.alt = ""; drop.classList.remove("has"); $("dropMsg").querySelector("strong").textContent = "Drop a photo here"; }
  }
  function openSheet(p) {
    current = p;
    $("sheetTitle").textContent = p ? "Edit project" : "New project";
    $("pTitle").value = p ? p.title : "";
    catField.value = p ? p.category : cats()[0];
    $("pDate").value = p ? p.date : "";
    $("pVenue").value = p ? p.venue : "";
    $("pRole").value = p ? p.role : "";
    $("pBlurb").value = p ? (p.blurb || "") : "";
    $("pAlt").value = p ? p.alt : "";
    file.value = "";
    setPreview(p ? p.image : "", p ? p.alt : "");
    $("pDelete").hidden = !p;
    sheet.showModal();
    $("pTitle").focus();
  }
  function closeSheet() { sheet.close(); }
  $("sheetClose").addEventListener("click", closeSheet);
  $("pCancel").addEventListener("click", closeSheet);
  sheet.addEventListener("click", function (ev) { if (ev.target === sheet) closeSheet(); });
  $("pSave").addEventListener("click", function () { toast("Saving isn't connected yet. This is the UI only."); });
  $("pDelete").addEventListener("click", function () { toast("Delete isn't connected yet. This is the UI only."); });

  function takeFile(f) {
    if (!f || !/^image\//.test(f.type)) { toast("Please choose an image file."); return; }
    setPreview(URL.createObjectURL(f), $("pAlt").value);
    markDirty();
    toast(f.name + " added to the preview. Uploading isn't connected yet.");
  }
  file.addEventListener("change", function () { takeFile(file.files[0]); });
  ["dragenter", "dragover"].forEach(function (t) { drop.addEventListener(t, function (ev) { ev.preventDefault(); drop.classList.add("over"); }); });
  ["dragleave", "drop"].forEach(function (t) { drop.addEventListener(t, function (ev) { ev.preventDefault(); drop.classList.remove("over"); }); });
  drop.addEventListener("drop", function (ev) { takeFile(ev.dataTransfer.files[0]); });
  sheet.addEventListener("input", function () { markDirty(); });

  /* ---------- contact ---------- */
  function renderContact() {
    var box = $("contactFields"); box.innerHTML = "";
    var C = S.contact, by = {};
    C.rows.forEach(function (r) { by[r.label] = r; });
    [["Email", "email", "email"], ["Phone", "tel", "tel"], ["City", "text", "Location"]].forEach(function (f) {
      var label = el("label", "field"), span = el("span", null, f[0]);
      var inp = el("input"); inp.type = f[1] === "text" ? "text" : f[1]; inp.value = (by[f[2]] || {}).value || ""; inp.autocomplete = "off";
      label.appendChild(span); label.appendChild(inp); box.appendChild(label);
    });
    $("cAvail").value = (by.Availability || {}).value || "";
    $("cBtn").value = C.button || "";
    var m = /subject=([^&]*)/.exec(C.buttonHref || "");
    $("cSubject").value = m ? decodeURIComponent(m[1]) : "";
  }

  /* ---------- about ---------- */
  function paraRow(text) {
    var r = el("div", "row-edit");
    var ta = el("textarea"); ta.rows = 3; ta.value = text; ta.setAttribute("aria-label", "Paragraph");
    var rm = iconBtn(ICON.x, "Remove paragraph", "danger");
    rm.addEventListener("click", function () { r.remove(); markDirty(); });
    r.appendChild(ta); r.appendChild(rm);
    return r;
  }
  function renderAbout() {
    $("aTitle").value = S.about.title;
    var box = $("aParas"); box.innerHTML = "";
    S.about.paragraphs.forEach(function (p) { box.appendChild(paraRow(p)); });
    var st = $("aStats"); st.innerHTML = "";
    S.about.stats.forEach(function (s) {
      var r = el("div", "row-edit stat");
      var v = el("input"); v.type = "text"; v.value = s.value; v.setAttribute("aria-label", "Number");
      var l = el("input"); l.type = "text"; l.value = s.label; l.setAttribute("aria-label", "Label");
      r.appendChild(v); r.appendChild(l); st.appendChild(r);
    });
  }
  $("aAdd").addEventListener("click", function () { var r = paraRow(""); $("aParas").appendChild(r); r.querySelector("textarea").focus(); markDirty(); });

  /* ---------- skills & rig ---------- */
  function rigItem(it) {
    var r = el("div", "rig-item");
    var name = el("input"); name.type = "text"; name.value = it.label; name.setAttribute("aria-label", "Name");
    var lv = el("div", "lvl");
    var rng = el("input"); rng.type = "range"; rng.min = 0; rng.max = 100; rng.value = it.level; rng.setAttribute("aria-label", it.label + " level");
    var out = el("output", null, String(it.level));
    rng.addEventListener("input", function () { out.textContent = rng.value; });
    var rm = iconBtn(ICON.x, "Remove " + it.label, "danger");
    rm.addEventListener("click", function () { r.remove(); markDirty(); });
    lv.appendChild(rng); lv.appendChild(out); lv.appendChild(rm);
    r.appendChild(name); r.appendChild(lv);
    return r;
  }
  function renderRig() {
    var box = $("rigGroups"); box.innerHTML = "";
    S.rig.groups.forEach(function (g) {
      var card = el("div", "card-form");
      var h = el("h2", null, g.name);
      var items = el("div");
      g.items.forEach(function (it) { items.appendChild(rigItem(it)); });
      var add = el("button", "btn ghost"); add.type = "button"; add.appendChild(svg('<path d="M12 5v14M5 12h14"/>')); add.appendChild(document.createTextNode("Add item"));
      add.addEventListener("click", function () { var r = rigItem({ label: "", level: 50 }); items.appendChild(r); r.querySelector("input").focus(); markDirty(); });
      card.appendChild(h); card.appendChild(items); card.appendChild(add);
      box.appendChild(card);
    });
  }

  /* ---------- gels ---------- */
  function gelRow(sw, i) {
    var li = el("li", "gel-row");
    var col = el("input"); col.type = "color"; col.value = sw.value; col.setAttribute("aria-label", "Colour");
    var name = el("input"); name.type = "text"; name.value = sw.name; name.setAttribute("aria-label", "Colour name");
    var hex = el("span", "hex", sw.value);
    col.addEventListener("input", function () { hex.textContent = col.value; });
    var end = el("div", "pbtns");
    if (i === 0) end.appendChild(el("span", "gel-default", "Default"));
    var rm = iconBtn(ICON.x, "Remove " + sw.name, "danger");
    rm.addEventListener("click", function () { li.remove(); markDirty(); });
    end.appendChild(rm);
    li.appendChild(col); li.appendChild(name); li.appendChild(hex); li.appendChild(end);
    return li;
  }
  function renderGels() {
    var ul = $("gelList"); ul.innerHTML = "";
    S.gel.swatches.forEach(function (sw, i) { ul.appendChild(gelRow(sw, i)); });
  }
  $("gelAdd").addEventListener("click", function () {
    var li = gelRow({ name: "New colour", value: "#ffffff" }, 1);
    $("gelList").appendChild(li); li.querySelector("input[type=text]").select(); markDirty();
  });

  /* ---------- go ---------- */
  function renderAll() {
    list.innerHTML = "";
    S.work.projects.forEach(function (p) { list.appendChild(row(p)); });
    search.value = ""; catSel.value = "All";
    filterRows();
    renderContact(); renderAbout(); renderRig(); renderGels();
  }
  renderAll();
  show(location.hash.slice(1) || "projects");
})();
