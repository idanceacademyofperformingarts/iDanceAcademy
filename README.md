# iDance Academy of Performing Arts — Website

A single-page marketing/registration site for an Indian dance school (Kathak, Bollywood,
Folk/Semi-Classical) in Bambleton. Plain HTML/CSS/JS, no build step, no framework,
no dependencies. Open `index.html` in a browser or serve the folder statically — nothing
to install.

This README is written for whoever (human or AI agent) picks this project up next. It
explains *why* things are structured the way they are, not just what's in each file, so
you can extend it without re-deriving decisions that were already made deliberately.

## Intent

The brief was: one scrolling page, sections for Home / About Us / Classes / Schedule &
Fees / Workshops & Events / Gallery / Testimonials / Registration / Contact Us, and a nav
that smooth-scrolls to each section rather than navigating to separate pages. No CMS, no
backend — this is a static brochure site meant to be cheap to host (GitHub Pages, Netlify
drag-and-drop, etc.) and easy for a non-developer owner to hand-edit later.

Design direction came from the provided logo: black background, gold foil dancer
illustration, serif wordmark ("iDance Academy" / "Performing Arts"). The whole site's
palette and type system were built to match that logo rather than the other way around —
see [Design system](#design-system) below.

## File map

```
index.html      All markup, all 9 sections + nav + footer, in source order = scroll order
styles.css      All styling, organized top-to-bottom in the same order as index.html
script.js       All behavior: mobile nav, active-link tracking, scroll reveal, form, footer year
assets/images/  Drop-in image slots (see Image placeholders below)
```

There is deliberately **no** JS framework, bundler, or CSS preprocessor. Anyone with a
text editor and a browser can modify this. If you're an agent considering introducing
React/Vite/Tailwind/etc. here: don't, unless the human has explicitly asked for that
migration — it would contradict the reason this stack was chosen.

## Design system

Defined as CSS custom properties at the top of `styles.css` (`:root`):

- `--gold` / `--gold-light` / `--gold-dark` — sampled to match the logo's foil gradient
- `--black` / `--black-soft` — near-black backgrounds (not pure `#000` — pure black next
  to gold reads harsh; `#0b0906` / `#14100b` are warmer)
- `--cream` / `--cream-dim` — off-white section backgrounds, alternated with black
  sections (see below) so the page has visual rhythm on scroll
- `--maroon` — secondary accent, used sparingly (fee cards, contact icons, table header)
  so gold doesn't get monotonous
- `--font-display` (Playfair Display) for all headings, matching the logo's serif
  wordmark; `--font-body` (Poppins) for everything else, for readability at small sizes

**Section alternation pattern**: sections alternate `cream` background / `black
(.section-alt)` background going down the page (Home=black, About=cream, Classes=black,
Schedule=cream, Events=black, Gallery=cream, Testimonials=black, Registration=cream,
Contact=black, Footer=black). This is what makes a very long single-page site not feel
monotonous while scrolling. If you add/reorder sections, keep alternating or the page
will feel flat — don't make two adjacent sections the same background.

**Why inline `<style>` isn't used**: everything is one external `styles.css` so the
cascade and custom properties stay in one place. Don't split into per-section CSS files;
the token system depends on being defined once at the root.

## Behavior (`script.js`)

Four independent, small pieces — no framework, no state management, because there's no
real app state beyond "which section is the user near" and "is the mobile menu open":

1. **Mobile nav toggle** — hamburger below 900px (see `.nav-links` media query in
   `styles.css`), closes automatically when a link is clicked.
2. **Active-link tracking on scroll** — `IntersectionObserver` is *not* used here
   deliberately; it's a scroll-position calculation (`section.offsetTop` vs
   `window.scrollY + 120`) because sections vary hugely in height and an
   IntersectionObserver-based "which section is active" gets flickery with very tall
   sections. If you refactor this, test scrolling slowly through the long `#schedule`
   and `#register` sections specifically — that's where naive approaches break.
3. **Reveal-on-scroll** — this one *does* use `IntersectionObserver` (`.reveal` /
   `.in-view` classes), because here we only care about "has this element entered the
   viewport once," which is exactly what IO is good at. Elements unobserve themselves
   after revealing (one-shot, not re-triggered on scroll-back) — that's intentional,
   re-triggering reads as gimmicky on a repeated scroll.
4. **Registration form** — `preventDefault()` + show a `.form-success` banner + reset the
   form. **This does not send data anywhere.** See [Known stubs](#known-stubs-not-bugs).

## Known stubs (not bugs)

If you're an agent auditing this repo for bugs, the following are *intentional*
placeholders, not defects:

- **`assets/images/logo.png`** — real file, provided by the site owner. If missing, every
  `<img>` referencing it has `onerror="this.style.display='none'"` so the layout degrades
  gracefully (text-only brand mark) instead of showing a broken-image icon. Any new image
  tag added to this page should follow the same pattern unless the image is essential
  content (e.g. a real gallery photo, once added, should NOT have a silent-fail fallback).
- **`assets/images/hero-bg.jpg`**, **`assets/images/founder.jpg`** — not yet supplied.
  Hero falls back to the radial-gradient black background; About falls back to a maroon
  placeholder box with literal text "Photo of Founder or Studio." Replace the placeholder
  `<div class="about-photo">` with a real `<img>` once a photo exists — don't leave both.
- **Gallery grid** — currently emoji in `<div class="gallery-item">` blocks, not real
  photos. Swap each for `<img src="..." alt="...">` once performance/student photos are
  available; the CSS (`object-fit: cover`, `aspect-ratio: 1`) already expects real images.
- **Contact details** (address, phone, email, social links) — placeholder values
  (`123 Main Street, Bambleton, VA 20000`, `(555) 123-4567`, `info@idanceacademy.com`,
  social icons linking to `#`). Replace with the studio's real info before launch.
- **Map embed** — Google Maps iframe currently queries the literal string "Bambleton"
  with no specific address, so it centers on the town, not the studio. Update the `src`
  query once a real address exists.
- **Schedule table & fee cards** — plausible placeholder class times/prices, not real
  data. Confirm with the studio owner before treating these as accurate.
- **Registration form has no backend.** It's client-side only (shows a fake success
  message). Before this goes live, wire `#registerForm`'s submit handler to a real
  endpoint — a form backend service (e.g. Formspree, Netlify Forms) is the natural fit
  given there's no server in this project; a custom backend would be overkill for a
  static brochure site unless the owner already has one.

## Local preview

No build step. Any static file server works, e.g.:

```bash
python -m http.server 5184
```

then open `http://localhost:5184`. (Opening `index.html` directly via `file://` also
mostly works, but some browser preview tooling treats `file://` pages as static snapshots
and won't apply the stylesheet correctly — serve it over HTTP if styling looks broken.)

## Extending this site

- **Adding a new section**: add a `<section id="...">` in `index.html` in scroll order,
  add a matching `<li><a href="#...">` in the nav, alternate the background (cream vs
  `.section-alt`) from its neighbors, and add its styles to `styles.css` in the same
  vertical order as the HTML — the whole codebase is intentionally ordered
  top-to-bottom to match reading/scroll order, don't break that convention by appending
  new styles at the end of the file out of order.
- **Changing colors**: edit the custom properties in `:root` only — don't hardcode new
  hex values in component rules, or the theme will drift out of sync across sections.
- **Don't** introduce a CSS framework, JS framework, or bundler without the owner asking
  — the entire point of this stack is that a non-technical site owner (or a future agent
  with no Node toolchain available) can open two files and understand everything.
