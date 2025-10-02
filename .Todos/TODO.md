# WigShop v1.0 – Remaining TODO

## Compliance & Legal

- [x] Verify GDPR banner and consent.js gating works across all browsers (test with cookies cleared).
- [x] Confirm translations for consent banner exist in all supported locales.
- [x] Ensure Privacy Policy and Cookie Policy links in footer resolve correctly.

## SEO & Feeds

- [x] Investigate and fix Google Merchant Center feed image mapping.
   Ensure product main images (hero shots) are always used as the primary `image_link`.
   Note: the old "Google & YouTube" app option to set the image has been deprecated.
- [x] Validate JSON-LD structured data in Google’s Rich Results Test (Product schema).
- [x] Confirm OG/Twitter tags render correctly on product and non-product pages.

## UX / Storefront

- [x] QA test: Search bar is always visible and centered on all page templates.
- [x] QA test: Alt text captions under product images show correctly, with fallback to product title or variant option1.
- [x] QA test: Map and Reviews embeds toggle correctly via Theme Editor settings.
- [x] QA test: Logo width setting scales correctly up to new max (360px).

## Release Validation

- [x] Run full Theme Check (no errors/warnings).
- [x] Cross-browser QA (Chrome, Firefox, Safari, Edge).
- [x] Mobile responsiveness check for new embeds and search bar.
- [x] Finalize version tag `v1.0` after successful full run.

## JSON‑LD

- [x] Validate new `snippets/json-ld.liquid` in Google Search Console
- [x] Once validated, remove Shopify’s default JSON‑LD emit from `meta-tags.liquid` to avoid duplication
- [x] Audit all meta/OG tags for duplication or outdated logic
- [x] Optimize OG image sizes (1200px wide, compressed) for faster load
- [x] Confirm canonical tags always point to product root, not variant URLs

## TODO — Page Load Optimization

- [x] Audit all Liquid includes for duplication (e.g., meta-tags vs. json-ld) and remove redundant logic
- [x] Split large monolithic snippets (e.g., meta-tags.liquid) into modular, conditional includes to reduce payload
- [x] Remove unused legacy snippets, CSS, and JS assets from theme bundle
- [x] Inline critical CSS for above-the-fold content; defer non-critical CSS
- [x] Defer or async-load non-essential JavaScript (analytics, reviews, maps) until after user interaction or consent
- [x] Optimize image delivery:
  - [x] Ensure OG/structured data images are compressed and max 1200px wide
  - [x] Use `srcset` and `sizes` for responsive images
  - [x] Lazy-load below-the-fold media
- [x] Minify and combine CSS/JS where possible without breaking modularity
- [x] Confirm canonical and OG tags are emitted once (avoid duplicate meta payloads)
- [x] Validate with Lighthouse and Shopify Analyzer for render-blocking resources
- [x] Document all removed/disabled logic for audit hygiene

## TODO — Mobile‑First & Responsive Audit

- [x] Verify predictive search dropdown adapts: side‑by‑side on desktop, stacked on mobile
- [x] Ensure tap targets meet 44px minimum height/width on all interactive elements
- [x] Test variant swatches + dropdown sync on touch devices (no hover dependency)
- [x] Confirm product images scale fluidly with `max-width: 100%` and maintain aspect ratio
- [x] Validate captions (“Available in …”) wrap gracefully on narrow screens
- [x] Adjust section headings (Products vs. Colors) font size and spacing for <600px widths
- [x] Confirm Add to Cart button remains disabled until variant selection on mobile
- [x] Test sticky/always‑visible search bar placement on small screens (no overlap with logo/nav)
- [x] Audit Sale badge and inventory styling (strikeout, yellow border) for readability on mobile
- [x] Validate GDPR banner is responsive, non‑blocking, and dismissible on small screens
- [x] Check embedded map and reviews iframes scale responsively with `width:100%`
- [x] Run Lighthouse mobile audit for performance, accessibility, and best practices

### SEO / Title Logic

- [x] Refactor `<title>` logic for product pages:
- Format: **"Wig Name" by "Mfg" | "Wig Fiber" | "Cap Construction" | Optional {New, Closeout, Discontinued, etc.}**
- Pull values from product metafields or tags (Mfg, Fiber, Cap Construction, Status).
- Ensure optional status flag only appears if present.
- [x] Conditional logic by product type:
- If product type = **Accessory Items**, use a standard title format (e.g., `"{{ product.title }} – {{ shop.name }}"`).
- Otherwise, apply the detailed wig title format above.
- [x] Confirm canonical still points to product root URL.
- [x] Verify meta description continues to use stripped/truncated product description.
- [x] Test with multiple product types to ensure fallback works correctly.

## Speed cleanup

- [ ] Parse the repository and identify abandoned, deprecated, or non-working code (search for `deprecated`, `DEPRECATED`, `TODO:`, `FIXME`, and stray `console.log`).
- [ ] Create a prioritized candidate list of assets and snippets to remove, comment out, or refactor (include reason and risk level).
- [ ] Split JS/CSS logically by page type:
  - Move swatch/variant logic into product-only assets and load them conditionally for templates/sections that need them.
  - Defer analytics/reviews/maps scripts until user interaction or consent (already gated by consent system; flag any remaining non-gated loaders).
  - Inline critical CSS and defer non-critical styles where safe.
- [ ] Run a pass to minify and combine remaining page-critical CSS/JS where it doesn't break modular loading.
- [ ] Run Lighthouse/profile smoke checks and document before/after improvement estimates.

## High / Medium risk work

- [ ] Implement split of `global.js` (High risk)
  - Break `global.js` into `global-core.js` (utilities used across pages) and `global-components.js` (UI components like menu drawer, focus-trap, quantity input, product helpers).
  - Migrate includes incrementally and run Theme Check + manual QA after each step.
- [ ] Minify/combine critical CSS/JS + inline critical CSS (Medium risk)
  - Create a safe bundling plan that inlines above-the-fold CSS, bundles/minifies critical JS, and defers non-critical assets. Capture Lighthouse baseline and after metrics.
- [ ] Consolidate SVG/icon assets into sprite or inline critical icons (Medium risk)
  - Audit icon usage and consolidate repeated SVGs into a sprite or inline the most-used icons to reduce requests and improve rendering. Verify across templates.

## Swatch settings

- [ ] Add theme settings for swatch size (small/medium/large) and shape (circle/square).
- [ ] Add a toggle for tooltip behavior: hover-only / hover+tap / tap-to-open on mobile.
- [ ] Add low-stock threshold setting to control "Only X left" labels for swatched variants.
- [ ] Document default swatch fallback behavior (variant image -> swatch image -> color swatch -> text label).
