# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static marketing site for "Aires del Rosario", an air-conditioning install/repair business in Rosario, Argentina. Astro 5 + Tailwind CSS v4, sin framework de UI. All user-facing content is in Spanish (Rioplatense: "calculá", "necesitás") — keep new copy in the same register.

## Commands

```bash
npm run dev        # dev server at localhost:4321
npm run build      # static build to ./dist/
npm run typecheck  # astro check — the ONLY thing that type-checks .astro files
npm run lint       # eslint
npm run preview    # serve the built output
npx prettier --write .   # format (single quotes, 2 spaces, semi, es5 trailing commas)
```

There is no test suite.

**`npm run build` does not type-check.** Astro's build strips types without checking them, and ESLint does not type-check either, so a `.astro` file can be full of type errors and still build and deploy clean — the errors only surface in the editor. `<script>` blocks inside `.astro` files _are_ type-checked, and they are the usual offender: `querySelector` returns `Element | null`, and narrowing from an `instanceof` guard **does not cross into nested closures**, so DOM handles need explicit types at the declaration. Run `npm run typecheck` before calling any change done.

## Architecture

**Rendering**: fully static/prerendered. `astro.config.mjs` sets `site: 'https://airesdelrosario.com.ar'` and enables `@astrojs/sitemap` — the site URL matters for sitemap output.

**Layout**: every page wraps its content in `src/layouts/Layout.astro`, which takes `title`, `description` and optional `image` props and owns the entire `<head>` (canonical, OG/Twitter, fonts, Font Awesome CDN, `LocalBusinessSchema`), plus `Navbar`, `WhatsappButton`, and `Footer`. Pages never emit their own `<head>` markup — to inject per-page structured data, pass an element with `slot="head"` (see `faq.astro`). **Every page must pass a unique `title` and `description`**; duplicated meta descriptions across pages were a real SEO problem here once.

**SEO data**: `src/data/business.ts` is the single source of truth for the NAP (name/address/phone). It feeds the visible Footer _and_ the `HVACBusiness` JSON-LD in `src/components/LocalBusinessSchema.astro` — Google penalizes mismatches between the two, so never hardcode the phone, email or locality anywhere else. Street address, opening hours and the Google Business Profile link are still missing and are the highest-value local-SEO items left.

**Content collections** (`src/content.config.ts`): uses the _legacy_ schema-only API (no `loader`), so entries expose `.slug` — `src/pages/libro/[id].astro` and `Services.astro` both rely on `book.slug`. If these are migrated to `glob()` loaders, `.slug` becomes `.id` at every call site.

- `books` — the five services (`src/content/books/*.md`: instalacion, preinstalacion, reparacion, mantenimiento, cargadegas). Frontmatter: `title`, `subtitle`, `img`, `imgPosition`, `description`, `order`. `order` drives the homepage carousel sort. `imgPosition` is optional and is the `background-position` of the carousel card only (default `center`) — it exists because the masters are taller than the 1152×500 slot they are shown in — between 148px and 268px of height get cropped depending on the master — and some subjects need the crop raised or lowered. No service uses it right now: every current master frames well centred. `img` uses the `image()` schema helper, so it must be a path **relative to the markdown file** (`../../assets/foo.jpg`) and resolves to `ImageMetadata`, not a string. `description` is reused verbatim as the page's meta description. Adding a markdown file here automatically adds a carousel card, a `/libro/<slug>` page and an entry in the JSON-LD offer catalog — no code change needed.
- FAQs live in `src/data/faqs.ts`, not in a collection. Both the accordion markup and the `FAQPage` JSON-LD render from that array; Google requires the schema text to match the visible text, so they must stay coupled. An entry may add an optional `cta` (`before`/`linkText`/`href`/`after`) for a closing paragraph with an internal link — the answer strings themselves render as plain text, and the CTA's words are appended to the schema text too so the two keep matching.

**Gallery** (`/galeria`, `src/components/GaleriaGrid.astro`): auto-discovers every image in `src/assets/galeria/` with `import.meta.glob(..., { eager: true })`, so adding a photo is dropping a file — no code change. The filename carries two meanings: it sets the order (alphabetical with `numeric: true`, so `10-` sorts after `9-`) and it generates the `alt` (extension and leading order digits stripped, dashes to spaces). That derived `alt` is only the fallback: `src/data/galeria.ts` maps filename → hand-written alt text, and wins when present — filenames can't carry the tildes and ñ that a real Spanish description needs. `src/assets/galeria/README.md` documents that convention for whoever uploads the photos.

**The rows are computed in the frontmatter, not by CSS.** It is the justified layout Flickr and Google Photos use, but resolved at build time because the real dimensions of every photo are known there. Photos are appended to a row until the sum of their aspect ratios is closest to a target, cycling through `OBJETIVOS = [1.9, 2.9, 2.3, 3.3, 2.1, 2.7]`; then each photo's width is emitted as `flex-basis: calc((100% - <gaps>) * ar/Σar)`. Three consequences, all load-bearing:

- Widths within a row are exactly proportional to the aspect ratios, so **nothing is cropped** — `aspect-ratio: var(--ar)` gives each item its height and every photo in a row lands on the same height without `cover` cutting anything. Measured on the current 90 photos: 0% crop on every one, every row exactly 1152/1152 px.
- Each row gets a **different height** (measured: 326 to 673 px, eight distinct heights), which is what makes tiles differ in size. That was the point of the design — with a fixed row height every photo comes out the same size.
- The greedy loop closes a row at whichever sum is _closest_ to the target, above or below. Closing only when the target is exceeded let one landscape photo (ratio 1.78, three portraits' worth) overshoot a low target and squeeze its neighbours to 136 px wide.

Two edge cases are handled explicitly, and both bit once before being fixed. A last row left with one or two orphans is merged with the previous row and the two are **split evenly** — dumping them all into the previous row instead gave a seven-photo row 158 px wide. And a last row only divides by the target instead of its own sum when its ratio sum is under `SUMA_MINIMA_PARA_ESTIRAR` (1.6, about three portrait photos); applying that rule to any last row left three legitimate photos occupying half the width.

Below `640px` all of that is dissolved with `.galeria-fila { display: contents }` and the container becomes `columns: 2` masonry — the same DOM serves both layouts, so the markup is never duplicated per breakpoint.

The **reveal on scroll** hides items from CSS gated on `html.js` (set by an inline `<head>` script in `Layout.astro` before first paint) and inside `@media (prefers-reduced-motion: no-preference)`. The script only adds `.visible` through an `IntersectionObserver`. Doing it that way is deliberate: adding the hiding class from JS causes a visible flash (photos appear, vanish, fade back in), and hiding from CSS unconditionally risks a permanently blank gallery. For the same reason the script reveals everything if `IntersectionObserver` is missing, if it throws, or if nothing got revealed after 1.2s.

**Navigation**: Astro's `<ClientRouter />` (View Transitions), mounted once in `Layout.astro`, is the only router. Because bundled module scripts execute only on the first page load, **any client script that touches the DOM must initialize inside a `document.addEventListener('astro:page-load', ...)` handler** — that event fires on the initial load _and_ after every view transition. See `Services.astro` (carousel) and `Navbar.astro` (hamburger toggle). Binding on `DOMContentLoaded` alone will silently break after the first in-site navigation.

**Styling**: Tailwind v4 via the `@tailwindcss/vite` plugin — **all** configuration lives in `src/styles/global.css`, now deliberately small: a `@theme` block with `--color-brand` / `--color-brand-accent`, the `animate-slide` utility, and a few base resets. There is no `tailwind.config.*` file and none should be added; no `@tailwind` directives either (v3 syntax). Component-scoped CSS in `<style>` blocks is used heavily alongside utility classes — Astro scopes those with `[data-astro-cid-*]` attributes, which raises their specificity.

All brand colors are tokens now — **no hex literal for a brand color should reappear anywhere outside `@theme`**:

| Token                       | Value       | Use                                                  |
| --------------------------- | ----------- | ---------------------------------------------------- |
| `--color-brand`             | `#124f90`   | solid brand blue (`bg-brand`, `bg-brand/90`)         |
| `--color-brand-accent`      | `#378ba4`   | hover/active accent                                  |
| `--color-brand-translucent` | `#124f90ca` | over backdrop-blur surfaces (navbar, CTAs on photos) |
| `--color-page`              | `#0a112ecb` | page background, set once in `Layout.astro`          |

`brand-translucent` and `page` keep their original alpha channels deliberately — they are not `brand/79` approximations, so don't "simplify" them into opacity modifiers without checking the rendered value.

`--spacing-navbar: 6rem` encodes the fixed navbar's real footprint (`top-4` = 1rem + `h-20` = 5rem). `Layout.astro`'s `<body>` reserves exactly that via `pt-navbar`; change one and the other follows.

**Images**: all imagery lives in `src/assets/` and goes through `astro:assets` — `<Image />` for `<img>` tags, `getImage()` when the result feeds a CSS `background-image` (`CalculadoraSection.astro`, `Services.astro`, `libro/[id].astro`). Gallery photos are **pre-edited, not camera originals**: `scripts/editar-fotos-galeria.mjs` deskews each one (projection-based tilt estimation, capped at 4.5° because beyond that it is perspective rather than camera roll, and the rotation is followed by the largest same-aspect inscribed crop) and normalises tone (black/white point by percentile, then brightness corrected halfway to a 150 target — the square root is deliberate, forcing all photos to one brightness would turn a night shot into a day shot). Measured over the 89: brightness spread dropped from σ 26.8 to 15.7 and median contrast rose 49 → 54, with 41 photos straightened. The caps each come from a real photo that broke without them, and they are documented in the script. A raw photo dropped into `src/assets/galeria/` will visibly not match the rest — run the script instead. Output is capped at 1800px on the long edge (one Lanczos pass, `q88`, metadata stripped — phone EXIF carries the GPS of the client's home). Their `sizes` and `widths` are computed **per photo** from the tile width the row algorithm gave it, because the container is stepped rather than fluid: portrait tiles (185-380px) get `[400, 800]`, the few landscape ones (up to 1152px) get `[800, 1400]`. Asking for a large variant on every photo made Astro emit 80 files of ~125 KB that no browser ever requests — 10 MB of build for nothing. `public/` holds only `favicon.png`, `og-aires-del-rosario.png` and `robots.txt`, which need stable unhashed URLs. **Do not add images to `public/`** — they bypass optimization entirely, which is how the homepage once shipped 3 MB of images. Everything except the navbar logo is `loading="lazy"`.

The five service photos (`carga-de-gas`, `reparacion`, `instalacion`, `mantenimiento`, `preinstalacion`) are **pre-processed masters**, all 1152px wide — the real width of the carousel's main slot — with a Lanczos3 + unsharp-mask pass. Three of them (`carga-de-gas`, `reparacion`, `mantenimiento`) came from vertical phone photos capped at 1600px, cropped to 3:2 and upscaled, and the first two are mirrored so every photo faces the same way. `instalacion` and `preinstalacion` come from landscape 16:9 sources and are 1152×648: closer to the 1152×500 slot, so `cover` throws away 148px of height instead of 268px. Mixed master heights are fine — the component only pins the width — but `imgPosition` is calibrated against a specific master, so re-cropping one means rechecking its framing. Re-exporting any of them from a raw source without redoing that pass will visibly soften it. They are CSS backgrounds and therefore cannot be deferred, so all five land on the homepage critical path (~570 KB at `quality: 82`, which was picked by measuring — below it compression eats the sharpening, above it the weight grows for no visible gain). Below `1280px` the inactive items are `display: none`, so mobile only fetches one.

**No UI framework**: there is no React/Vue/Svelte integration and no `client:*` directive anywhere — every component is `.astro`, and interactivity is small vanilla scripts. The only JS the site ships is the 14.8 KB `ClientRouter` plus a few KB of inlined per-page script. Reach for a framework only if something genuinely needs it; the frigorías wizard (`FrigoriasWizard.astro`) was deliberately rewritten off React to get there.

**Frigorías wizard** (`src/components/FrigoriasWizard.astro`): 6-step form. The thermal coefficients live in the frontmatter and reach the script through `data-factor` on each `<option>` and `data-fg-*` on the form, so **the frontmatter is the single source of truth — never re-declare a coefficient inside the `<script>`**. The multipliers are conservative rules of thumb (base formula taken from the site's own FAQ), not a normalized heat-load calculation; they are pending validation by a técnico matriculado.

**shadcn/ui was removed** along with React — no `components.json`, no `src/components/ui/`, no oklch token block, no `.dark` variant. Reintroducing it means bringing back React and ~211 KB of JS, so treat that as a deliberate decision rather than a default. The `@/*` → `src/*` alias still exists in `tsconfig.json` but nothing uses it; imports are relative.

## Conventions

- Page width uses a repeated responsive clamp: `max-w-sm sm:max-w-md md:max-w-3xl lg:max-w-6xl mx-auto`.
- The carousel has exactly **four positioned slots**: `nth-child(1)`/`(2)` are the full-size card (1 sits behind 2, which is the visible one), `(3)` is the near thumbnail at `+220px` and `(4)` the far one at `+440px`. `nth-child(n + 4)` used to catch _every_ remaining card, so with five services the 5th stacked on top of the 4th at the same `left` and hid it — advancing made a thumbnail vanish instead of moving up a slot. `(5)` and beyond are now `display: none` and wait their turn. A fifth slot at `+660px` is not an option: it would overflow the viewport at 1280px (see below).
- `1279.98px` is the project's one horizontal-overflow breakpoint, in `global.css` and `Services.astro`. It is derived, not arbitrary: the carousel's farthest item sits at `left: calc(50% + 440px)` and is 200px wide, so its right edge lands at `50% + 640px` and overflows below 1280px. **Both rules must move together** — they used to be 1270 and 1290, which left a 20px band with horizontal scroll.
- `Navbar.astro` builds both menus (desktop row and mobile dropdown) from one `LINKS` array. They used to be two hand-written copies of the same four links, which had already drifted — desktop said "Preguntas freq." where mobile said "FAQ". Adding a page to the menu is one entry in that array.
- The `<nav>` has `backdrop-filter`, which makes it the containing block for its `position: fixed` descendants. The mobile menu's `top` is therefore relative to the nav, not the viewport (`top-[calc(100%+0.5rem)]`).
- Anchor navigation (`/#servicios`, used by the back button on `/libro/*`) is handled by an explicit `scrollIntoView` on `astro:page-load` in `Layout.astro`, not by the browser's native hash jump — with `scroll-behavior: smooth` the native animation is unreliable across a `ClientRouter` navigation. Targets need `scroll-mt-navbar` so they clear the fixed navbar.
- Commit messages in this repo are written in Spanish.
