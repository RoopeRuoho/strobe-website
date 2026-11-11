# Strobe Corp portfolio

A one-page portfolio that behaves like a lighting rig: it opens in blackout, a hanging line-art spot
(and two more in the dark) bring the site to life, and the page is lit from inside the lens.
Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no installs.

## Files

```
index.html     page structure (sections, lightbox, console)
style.css      all styling
script.js      renders content, work filter + lightbox, faders, gel picker, blackout, DMX readout, intro
content.js     ALL site text and projects: edit this file
img/           project images (placeholder SVGs for now)
BRIEF.md       the original brief
admin.html      admin panel, UI preview only (admin.css, admin.js): saving is not wired up yet
```

Open `index.html` in a browser to run it. No server needed.

## Edit the content (content.js)

Everything you read on the page comes from `content.js`. Change the text there and reload.

1. **Placeholders to replace** (search the file for `[`):
   `[CITY]`, `[EMAIL]`, `[PHONE]`, `[VENUE]`, `[CLUB]`, `[THEATRE]`, `[ARENA]`, `[MONTH YEAR]`
   and the "[Replace with your own project description.]" notes on each project.
2. **Brand and hero:** `brand`, `role`, `tagline`.
3. **About:** `about.paragraphs` (one string per paragraph) and `about.stats` (the `[00]`, `[000]` values are
   placeholders for your years on the road, shows delivered and so on).
4. **Projects:** each entry in `work.projects` has `title`, `venue`, `date`, `role`, `category`
   (must be one of `Design`, `Operation`, `Tech`), `image`, `alt` and `blurb`. Add or remove entries freely;
   the filter and lightbox pick them up automatically. Give every project a unique `id`.
5. **Rig / skills:** `rig.groups`, each with `items` of `{ label, level }` (level is 0 to 100).
6. **Gels:** `gel.swatches` are the accent colours (`name` and a hex `value`). The first one is the default.
7. **Contact:** `contact.rows` (add `href` to make a value a link) and `contact.buttonHref`
   (for example `mailto:you@example.com?subject=Booking%20enquiry`).

### Gobo wheel and videos

The wheel above the work grid "projects" the active project onto a 16:9 screen (change the ratio with
`work.gobo.aspect` in `content.js`). To show a video instead of a still, add `video: "img/my-show.mp4"` to a project.
The `image` is then used as the poster. Videos play muted and looped, and only the active one is loaded.

### Project images

Put images in `img/` and point `image` at them (for example `img/my-show.jpg`). Use about 1600x1000 px
(8:5), JPEG or WebP, under about 300 KB each. Always write a real `alt` description.

## Behaviour worth knowing

- **Intro:** plays once per browser session (remembered in `sessionStorage`). "Skip intro" (or Escape)
  skips it. It is turned off automatically if the visitor prefers reduced motion.
- **Gel colour:** saved in `localStorage` under `strobe-gel`.
- **Blackout:** dims the whole page; the switch stays available.
- **DMX readout:** the channel follows scroll position, the level follows scroll speed. It is decorative.

## Before launch

- [ ] **Do not publish the admin panel yet.** `admin.html`, `admin.css` and `admin.js` are a UI-only preview with no
      login and no saving. Leave them out of the deploy (or delete them) until the real admin is built.

- [ ] Replace every placeholder in `content.js` and the project images.
- [ ] **Remove the temporary "Replay intro" button.** It is marked `TEMP` in three places:
      the `<button class="replay-temp">` in `index.html`, the `.replay-temp` rules in `style.css`,
      and the handler at the top of `script.js`.
- [ ] Update the page `<title>` and the description / `og:` tags in the `<head>` of `index.html`.
- [ ] Optional: replace the inline favicon in the `<head>` with your own.

## Deploy

It is a static site, so any static host works. There is nothing to build.

**Netlify (drag and drop)**
1. Open <https://app.netlify.com/drop>.
2. Drag the whole project folder onto the page. You get a live URL straight away.
3. To update, drag the folder again (or connect a Git repository and leave the build command and
   publish directory empty / set to `.`).

**GitHub Pages**
1. Create a repository and push these files to the `main` branch (the files must be at the repository root).
2. In the repository, open *Settings > Pages*.
3. Under *Build and deployment* choose *Deploy from a branch*, select `main` and `/ (root)`, then save.
4. After a minute the site is live at `https://<user>.github.io/<repository>/`.

Everything uses relative paths, so it works both at a domain root and in a repository sub-path.

## Accessibility and performance notes

- Honours `prefers-reduced-motion` everywhere (intro skipped, no count-ups, no wipes).
- Skip link, semantic landmarks and headings, visible focus rings, keyboard-operable filter, lightbox
  (native `<dialog>`: Escape and focus return built in), gel picker and blackout switch.
- All text and controls meet WCAG AA contrast on the dark background; touch targets are at least 44 px.
- Images are lazy-loaded and have explicit sizes; no external libraries. The only external request is the
  Google Fonts stylesheet (with system fallbacks if it is blocked).
- The page content is rendered by `script.js` from `content.js`. With JavaScript off, visitors see a short
  notice instead.
- The optional "STROBE" toggle from the brief is not included. If you add one, it must be opt-in, behind
  a clear warning, and stay under 3 flashes per second.
