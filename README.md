# OHAS Boulangerie & Café — website

A one-page, cinematic bakery-café site for OHAS on the corner of Beach Road & Orchid Street, Garapan, Saipan.
Built from the master prompt (research dated Nov 18, 2026). **Not published** — everything runs locally.

- **Stack:** Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS 4 · Three.js / React Three Fiber · GSAP + ScrollTrigger + SplitText · Lenis smooth scroll
- **Output:** plain HTML/CSS/JS in `out/` — can be hosted on any static host when OHAS is ready.

## Run it

```bash
npm install
npm run dev            # http://localhost:3000 (live editing)
npm run build          # writes the static site to out/
npm run preview        # serves out/ at http://localhost:4173
```

## Sections

| Anchor | Section | Notes |
|---|---|---|
| `#top` | Hero | Loader (the "O" drawn as a croissant curl, < 2 s), giant OHAS wordmark, real-time 3D croissant, "See What's Fresh" / "Order a Cake" |
| `#story` | Our Story | Name, "French, Fresh, Fit.", "Freshness is our recipe.", 2020 → 2023 journey, key numbers |
| `#freshness` | From dough to counter | Scroll-driven sequence: dough → low-temperature fermentation → oven → counter |
| `#signatures` | Signatures | Pinned horizontal journey on desktop, stacked on phones; images open out of an "O" mask |
| `#menu` | Menu | Category tabs (keyboard accessible), editorial feature item + list; every item is real text |
| `#cakes` | Cakes & Orders | Two sizes drawn to scale, how to order, seasonal collection, order-request form |
| `#cafe` | The Café | Gallery with full-screen viewer (arrow keys, swipe, Esc) |
| `#visit` | Visit Us | Address, directions, hours, the space, lazy-loaded Google Map |
| `#contact` | Contact + footer | Big tap-to-call, Facebook, Instagram, © line |

Phones get a persistent **Call OHAS / Directions** bar.

## Editing content (no code needed)

Everything OHAS might change lives in `src/content/`:

| File | What it holds |
|---|---|
| `settings.json` | Name, phone, address, map links, social links, **hours**, building facts, services (online ordering etc.), cake-form switch, story options |
| `menu.json` | Categories and items. `available: false` hides an item; `todaysBake: true` adds the "Today's bake" tag; `signature: true` features it |
| `cakes.json` | Sizes, regular-cake prices, ordering details, seasonal collections (`current: true` = in the case now) |
| `gallery.json` | Gallery frames, alt text and the photographer's shot list |

### Rules the site enforces

- **Prices** show only when a price has a `confirmedOn` date (`"2026-12-01"`), and the date is shown next to it. Posted prices are kept with their `postedOn` date for reference.
- **Hours** show only when `hours.confirmed` is `true`. Until then visitors see "Opening hours are being confirmed. Please call before you visit." Once confirmed, an "Open now" indicator (Saipan time) appears and hours are added to the structured data.
- **Allergen notes** show only when `allergens.confirmed` is `true`.
- **Online ordering, delivery, catering, reservations** appear only when `enabled` is `true` *and* a real `url` is set.
- **Amenities** (Wi-Fi, parking, payment, accessibility) stay hidden until `confirmed: true`.

### Review mode

Add `?review=1` to the URL to see everything waiting for OHAS — the four conflicting hours sources, posted prices with dates, draft allergen notes, unconfirmed amenities, switched-off items — each outlined and tagged **Pending**. `?review=0` (or the Exit button) turns it off. The live site never shows these.

### Photos

53 product and shop photos in `public/photos/` come from OHAS's **own** Facebook page and Instagram (Sept 2023 – May 2026). Each was cropped to the product, with promo text and prices removed, and converted to WebP. `src/content/photo-sources.json` lists the post each one came from. No customer or Google-review photos were used.

- **Menu:** 34 of 39 items have photos, and every category leads with a photographed item. Items OHAS hasn't posted a photo of (Assorted Macarons, Avocado Coffee, Double Cube Latte, Peanut Butter Coffee, Strawberry Coconut Smoothie, Ice Cream Affogato) appear as plain menu lines with no image.
- **Cakes:** all 8 Premium Cakes and all 6 February 2026 cakes.
- **Gallery:** shows the 7 real photos. The upstairs and terrace frames still need photos; they only appear (as labelled placeholders with a shot list) in review mode.
- **Signatures:** all 6 use real photos — Apple Bread, Tinian Baguette, Croissants, Ube Cream Latte, Pain au Chocolat, Coconut Series & Bingsu. (Avocado Coffee and Double Cube Latte were swapped out for lack of photos; they stay on the menu. Confirm the final six with OHAS.)
- **Quality:** most are 1,000–2,000 px. A few came from small social graphics (Real Strawberry Latte, Smoked Salmon Croissant, Croque Monsieur, the cut-out Premium Cakes) and will look soft at large sizes — ask OHAS for the originals.

**Before launch, get OHAS's permission to use these photos, or their original files.**

To add or replace a photo, export a WebP/AVIF (about 2000 px on the long side), put it in `public/photos/`, and set the item's `photo`:

```json
"photo": { "src": "/photos/apple-bread.webp", "width": 2000, "height": 1500 }
```

Optional: `"fit": "contain"` with `"bg": "#f0ece4"` shows the whole photo on a colour (used for the cut-out cake shots). Only real photos of OHAS belong here — no stock or AI-generated images presented as OHAS.

### New facts from OHAS's own posts (still marked pending)

- **Hours:** Apr 28, 2026 reopening post and Instagram bio — Mon–Fri 8:00 a.m.–6:00 p.m., Sat–Sun 8:00 a.m.–7:00 p.m. Pre-filled in `settings.json → hours.schedule`; set `confirmed: true` once OHAS confirms.
- **Cake ordering (Aug 11, 2025 post):** sizes Small 7", Regular 8.5", Party 14×14"; regular cakes at least one day ahead, ordered by 6:00 PM; party-size at least three days ahead with a 50% deposit. In `cakes.json → ordering` (shown in review mode).
- **Menu items added from posts:** Pollock Roe Bread, French Sourdough Baguette (olives & garlic), Green Onion Bagel, OHAS AnPan, Focaccia, Jambon-Beurre, Avocado Chili Sandwich, Bánh Mì, Croque Monsieur, Scoop Up Tiramisu, Verrine Puddings, Passion Fruits Passion, Flower Blossom Cupcake, Ube Cream Latte, Ube Milk Tea, Thai Milk Tea. Each has its post date in `source`; some may be seasonal or retired — confirm the current menu.
- **Logo:** OHAS's real emblem (oval seal with a door, "by Kensington Hotel Saipan USA") was lifted from their Facebook logo card into `public/brand/emblem-light.webp` / `emblem-dark.webp` and shown in the footer. The header still uses the type wordmark. Ask OHAS for the vector logo files to replace both.
- **Map:** the embed now uses OHAS's Google Maps listing ID. An address search had landed in the wrong part of Saipan; verified that the listing embed pins Beach Road by Orchid Street and Garapan Elementary.
- **Cake sizes:** the size explorer draws all three published sizes (7", 8.5", 14×14") to scale.

### Logo, colours, fonts

- Logo: `src/components/layout/Wordmark.tsx` is a type-only stand-in. Replace its contents with the official SVG logo.
- Colours: tokens at the top of `src/app/globals.css` (cream/flour base, butter + crust accents, espresso text, ube as the one tropical accent).
- Fonts: Instrument Serif (headlines) + DM Sans (body), self-hosted via `next/font` in `src/app/layout.tsx`.

## The 3D hero

- The croissant is generated in code (`src/components/hero/croissantGeometry.ts`): rolled bands, layer lines at the creases, flattened base, baked-colour shading, a flaky bump texture. No model files are downloaded.
- Scene (`CroissantScene.tsx`): warm window light, studio light-formers for the glaze highlights, soft contact shadow, steam, flour dust drifting through a light beam, and a few crumbs. Scroll turns and lifts it; on desktop it follows the mouse a little.
- Three.js loads only after the page is shown, and rendering pauses when the hero is off screen.
- **Fallback:** without WebGL, with reduced motion, on save-data or low-memory devices, the hero shows `public/hero/croissant-still.webp` — a render of the same scene. Test with `?3d=0` (force still) or `?3d=1` (force 3D).
- To re-render the still and the share image after changing the scene: run `npm run dev -- -p 3210` in one terminal, then `npm run render:assets` (uses local Chrome/Edge in headless mode).

## Cake order-request form

Controlled by `settings.json → cakeOrderForm`:

- `enabled` — switch the form on/off (**confirm OHAS wants it**).
- `endpoint` empty (current): nothing is sent anywhere. The form checks the details and prepares a request the customer can read out on the phone, copy, or paste into a Facebook message.
- `endpoint` set to a form service URL that accepts JSON `POST`: the request is delivered there and the customer is told OHAS will call back.
- Both modes say clearly it is a request, not an order, and that no payment is taken. Spam protection: hidden honeypot field + minimum fill time.

## SEO

- Title, description, canonical, Open Graph and Twitter tags in `src/app/layout.tsx`; share image `public/og.png` (1200×630).
- `schema.org` `Bakery` + `CafeOrCoffeeShop` structured data from verified settings only (`src/lib/seo.ts`); opening hours are added automatically once confirmed.
- `robots.txt` and `sitemap.xml` are generated at build time.
- **Set `siteUrl` in `settings.json`** to the real domain before launch (currently the placeholder `https://ohas.example`).

## CONFIRM BEFORE LAUNCH

| # | Item | Where to change it |
|---|---|---|
| 1 | Opening hours (sources disagree: 7–9 daily / 7:30–8:30 / 7:00–20:30 / "Closes 6 PM") | `settings.json → hours` |
| 2 | Current menu, prices, which items rotate; review-sourced items (sandwich fillings, smoothie, affogato, croissant description) | `menu.json` |
| 3 | Cake orders: notice, sizes, messages/designs, deposit, pickup/delivery | `cakes.json → ordering` |
| 4 | Online ordering, delivery, catering, reservations (all off) | `settings.json → services` |
| 5 | Logo files, brand colours, fonts | `Wordmark.tsx`, `globals.css`, `layout.tsx` |
| 6 | Real photos and video of the shop, bakers, products, both floors | `photo` fields in the content files |
| 7 | Mention the Kensington Hotel café as a sister location? (off) | `settings.json → story.sisterLocation` |
| 8 | Preservative-free claim — not used anywhere on the site | — |
| 9 | Permission for any review quote, news quote or staff name — none are used | — |
| 10 | Payment methods, Wi-Fi, parking, accessibility (hidden) | `settings.json → space` |
| + | Whether OHAS wants the cake order-request form | `settings.json → cakeOrderForm.enabled` |
| + | Mention E-Land Group? (off) | `settings.json → story.mentionOperator` |
| + | Final signature selection | `src/components/sections/Signatures.tsx` |
| + | Real domain | `settings.json → siteUrl` |

## Quality checks done

- Desktop (1440×900) and phone (375×812) layouts checked section by section; no horizontal scrolling on phones.
- 3D hero renders; static fallback verified with `?3d=0`; reduced motion verified with Chrome's forced preference (no loader, still image, no scroll animations).
- Header links, mobile menu, menu tabs (click + arrow keys), "Find it on the menu", gallery viewer, and both form paths (validation errors, prepared request) tested in a real browser.
- Exported HTML checked: menu, cakes and contact details are real text; no unconfirmed price, hours or allergen note appears in the page source.
- `tsc` and `eslint` pass; production build passes.

- Map embed verified in headless Chrome (correct listing and pin).

Not verified here: performance on a real low-end phone.

## Project layout

```
src/
  app/            layout (fonts, SEO, JSON-LD), page, globals.css, icon, robots, sitemap, 404
  app/render/     dev-only pages used to render the still + share image (not in the build)
  content/        settings.json, menu.json, cakes.json, gallery.json  ← edit these
  components/
    hero/         Hero, HeroStage (fallback + loading), CroissantScene, croissantGeometry
    sections/     Story, Freshness, Signatures, Menu, Cakes, CakeOrderForm, Gallery, Visit, MapEmbed, SpaceList
    layout/       Header, Footer, Hours, MobileCallBar, Loader, Wordmark
    motion/       SmoothScroll (Lenis), MotionDirector (scroll choreography), CursorBadge
    ui/, art/     Media (photo or labelled placeholder), icons, line illustrations
  lib/            content helpers, review mode, GSAP setup, structured data
scripts/          render-assets.mjs, serve-out.mjs
```

## Sources

Marianas Variety (2023 opening coverage), Marianas Business Journal (Nov 6, 2023), Saipan Tribune (2020), OHAS Facebook and Instagram, Google Maps listing (checked Oct 27, 2026). See the master prompt for links.
