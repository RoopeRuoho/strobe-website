# Strobe Corp Portfolio Website: Brief

Build a portfolio website for Strobe Corp, a lighting designer, operator and technician business. English only. Work in stages, keep messages short, and stop after each stage for feedback. Edit existing files instead of rewriting them.

## CONCEPT
The website behaves like a lighting rig. It starts in blackout and a moving head fixture brings the site to life. Creativity must show through interaction, not just visuals. Mood: dark, cinematic, technical, with a personal touch.

## STACK
Plain HTML, CSS and vanilla JavaScript. No framework, no build step, no external libraries. Files: index.html, style.css, script.js, content.js, and an /img folder with placeholder images. Must run by opening index.html and be deployable to Netlify or GitHub Pages.

## INTRO SEQUENCE (the signature moment, build with care)
The camera sees a moving head fixture from a distance and then flies into the spot it projects. The website lives inside the pool of light.
1. Pure black screen. A small moving head fixture (inline SVG: base, yoke, head with lens) hangs at the top centre of the frame, facing away.
2. After about one second it powers on: faint lens glow, then the head tilts and pans toward the viewer with a small mechanical overshoot (CSS transforms with perspective).
3. The beam fires with soft haze and lands as a circular pool of light in the middle of the screen, with a soft feathered edge. Outside the pool the screen stays black. The pool drifts slightly toward the cursor.
4. Inside the pool the website is visible at a small scale, as if projected by the spot: the Strobe Corp name, role line and navigation. This must be the real hero element, not a copy. It sits inside a circular mask (CSS mask or clip path with a radial gradient).
5. An "ENTER THE LIGHT" button appears below the pool. On click (or after about 4 seconds of idle), the camera pushes in: scale the pool and the hero together while the mask radius grows past the viewport edges, so the real page ends up at normal size with the light fading out at the edges. Use transform and opacity transitions for 60 fps, will-change: transform, and do not animate font size. Duration about 2 seconds, ease in out. No white flash, no hard cut.
6. A small "SKIP" button is always visible during the intro. Remember in sessionStorage that the intro was seen, so reloads in the same session skip it.
7. With prefers-reduced-motion, skip the animation and show the page normally.
8. On mobile the same sequence runs, with the pool sized to fit the screen width.

## SECTIONS (single page, each labelled as a cue, e.g. "CUE 1 / ABOUT")
1. Hero: Strobe Corp name and role line (revealed by the intro).
2. About: short personal text about me as designer, operator and technician.
3. Work: project grid with filter buttons (All, Design, Operation, Tech). Each card has image, event or venue, date, my role. On hover the image lights up like a profile spot while the rest dims. Click opens a simple lightbox.
4. Skills and rig: consoles, software, fixtures, protocols shown as DMX style faders or channel bars that animate in on scroll.
5. Gel picker: a row of colour swatches that live changes the site's accent colour (CSS variable). Save the choice in localStorage.
6. Contact: styled like a patch sheet with email, phone, location, availability. A working mailto link.

Also: a fixed small "BLACKOUT" button that dims the whole page, and a fake DMX channel readout in a corner that follows scroll position. Optional playful extra: a small opt in "STROBE" toggle (see safety rules).

## DESIGN
Near black background, high contrast, one accent colour driven by a CSS variable (default warm amber). Condensed technical font for labels, expressive display font for headings (Google Fonts via link, with system fallbacks). Light effects with CSS gradients, blend modes and a small canvas where needed. Smooth but restrained motion. Avoid generic template looks.

## ACCESSIBILITY AND SAFETY
- Respect prefers-reduced-motion everywhere.
- Any strobe or flash effect must be opt in only, behind a clear warning, max 3 flashes per second, never auto play.
- Good colour contrast for text, keyboard navigable, alt text on images, semantic HTML.
- Fully responsive, mobile first.

## PERFORMANCE
Lazy load images, small JS, no heavy dependencies, 60 fps on a mid range phone. Page content is in the HTML from the start and only hidden visually until the intro reveals it.

## CONTENT
Use clearly marked placeholders in content.js: [CITY], [EMAIL], [PHONE], plus 6 sample projects. Brand name is Strobe Corp.

## STAGES (stop after each for feedback)
1. Structure and styling with all sections static
2. The intro sequence
3. Work filter, lightbox and hover lighting
4. Faders, gel picker, blackout button and DMX readout
5. Polish, accessibility check, README with how to edit content and deploy
