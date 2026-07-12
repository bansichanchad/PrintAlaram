# Printalaram — Product Requirements Document

## Original Problem Statement
User asked to import their existing private GitHub repo `bansichanchad/alaramweb` and continue
development on it (bug fixes + new features, specifics to be shared by user after initial import).
Repo was shared as a ZIP export since it is private (`alaramweb-main.zip`).

## What The App Is
**Printalaram** — a premium eCommerce site for personalized Indian wedding money envelopes
("Shagun Lifafa"). Customers browse 21 handcrafted envelope designs, personalize an envelope
live (groom/bride name, wedding date, family name, message, couple photo), checkout (Razorpay or
COD), and the order + customization details are auto-forwarded to the store owner via a WhatsApp
`wa.me` deep link.

## Architecture
- Originally built as a **Next.js 15 monolith** (App Router, co-located `/app/api/[[...path]]/route.js`
  API using the `mongodb` Node driver directly).
- **Ported to fit the Emergent platform's two-service architecture**:
  - `/app/frontend` — Next.js 15 app (unchanged UI/pages/components), served via `next dev` on port 3000
    (package.json `start` script mapped to `next dev --hostname 0.0.0.0 --port 3000`).
  - `/app/backend` — FastAPI (Python) reimplementation of the original Node API logic:
    - `server.py` — all routes (`/api/health`, `/api/products`, `/api/categories`,
      `/api/customizations`, `/api/orders`, `/api/payments/*`, `/api/uploads/{filename}`)
    - `catalog.py` — static 21-product catalog + 4 categories (matches original generator logic)
    - `models.py` — Pydantic models for Customization/Order (MongoDB persistence, `_id` excluded)
    - `payments.py` — Razorpay order-create + signature verification, with a **SIMULATED fallback**
      when `RAZORPAY_KEY_ID` is a placeholder (no real keys configured yet)
  - MongoDB (`printalaram` db) stores `customizations` and `orders` collections. Product/category
    catalog is static (not DB-backed), matching original design.
  - No authentication in this app.

## Key Integrations
- **Razorpay** (payments) — currently running in SIMULATED test mode (no real
  `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` configured in `/app/backend/.env`). COD is fully functional.
  To enable real payments, user must provide Razorpay live/test API keys.
- **WhatsApp** `wa.me` deep link — no API key needed, pure URL scheme
  (`NEXT_PUBLIC_WHATSAPP_NUMBER` in `/app/frontend/.env`, currently `919904551144`).

## Updates (2026-07-02, later)
- Removed all "foil-stamped" marketing text sitewide (hero, marquee, footer, FAQ, order-success, shipping-returns, SEO meta, hidden dead-code sections).
- Removed product description paragraph + features bullet list from product detail page (now clean price/qty/CTA layout).
- Simplified loading state: replaced 3D rotating-envelope loader with a simple spinner (`PremiumLoader.js`), used across all `loading.js` route files.
- Fixed product gallery to show only the product's own single image (removed cross-product duplicate/unrelated thumbnails caused by old modulo-based gallery generator in `catalog.py`).
- Redesigned floating WhatsApp button into a persistent wide green pill (icon + "Printalaram · ONLINE" badge + bold "Contact For Customization" text), replacing the old small circular hover-tooltip button. Later swapped generic icon for the actual official WhatsApp logo SVG.
- Full regression tested by testing agent (iteration_2, 100% pass, 20/20 backend pytest + full e2e frontend flow).

## Updates (2026-07-02, catalog + pricing + checkout overhaul)
- **Catalog pivot**: replaced the 21-design wedding-Shagun catalog with a SINGLE product — "Swaminarayan Lifafa" (devotional/religious design, user-supplied image at `/cards/swaminarayan-1.jpg`). More devotional designs will be added later by the user; `catalog.py` is now a plain explicit list (not a generator loop) for easy future appends. No description/features text on this product per user's explicit request.
- **Tiered quantity pricing** (`/app/frontend/lib/pricing.js`): ₹15/envelope base, ₹14/envelope at 200+ qty, ₹13/envelope at 500+ qty. Quantity presets changed to 100/200/500 with 200 pre-selected by default; +/- steppers move by 50 with a floor of 100. Applied consistently across product page, customize page, and checkout.
- **Checkout redesigned into a 2-step flow** matching a Shopify-style reference: Step 1 "Contact" (email + cosmetic marketing checkbox) + "Delivery" (Country fixed to India, First/Last Name, Address, optional Apartment, City, State dropdown, PIN code, Phone, WhatsApp Number, cosmetic save-info/SMS checkboxes) → "Continue" button with validation. Step 2 shows an editable address summary ("Change" link back to step 1) + Payment Method (Razorpay test-mode / COD) + Place Order. No discount/coupon code field exists anywhere (explicitly excluded per user request).
- Full regression tested by testing agent (iteration_3, 100% pass — 16/16 backend pytest + complete e2e: pricing tiers, checkout step transitions, COD & simulated-Razorpay order placement, mobile responsive).

## Updates (2026-07-02, hero image cleanup + text-positioning fix)
- Homepage hero's 3-card decorative composition now uses the real product image (`/cards/swaminarayan-1.jpg`) in all 3 slots (cropped/zoomed variations for visual depth) instead of the old unused wedding-design images. Old unused card-*.jpg files deleted from `public/cards/`.
- **Card artwork-aware customization positioning**: added a shared `EnvelopePreview.js` component that composites Name (white, top:49%) and Family Name (gold italic, top:58%) text onto the actual envelope artwork at the correct printable area (between the temple pillars, above the deity figure) — matching the real product's actual layout, instead of a generic full-card overlay.
- **Photo upload removed** for this product: since the Swaminarayan card has a fixed devotional figure (not a user-photo placeholder), added a `photoUploadEnabled` flag to the product schema (`catalog.py`) — customize page now conditionally hides the photo upload UI entirely for this product. Ready for future products that do support a photo slot.
- Product detail page gallery replaced with a 2-way slide toggle: "Original" (blank envelope) and "With Your Name (Preview)" (same artwork with sample name/family text composited via `EnvelopePreview`), so customers can preview how their customization will look before ordering.
- Full regression tested by testing agent (iteration_6, 100% pass — 17/17 backend pytest + e2e).

## Updates (2026-07-02, catalog expansion to 4 products)
- **Added 3 new wedding-themed products**: card-2 "Royal Birdcage Lifafa" (green), card-3 "Palace Peacock Lifafa" (brown), card-4 "Kamdhenu Blessing Lifafa" (orange) — user-supplied artwork. Catalog now has 4 products total across 2 categories (Sacred Tradition, Wedding Royal).
- **Generic per-product customization layout**: `EnvelopePreview.js` rewritten to be fully data-driven via a `layout` config (photo rectangle position + name/family text position/color/alignment) stored per-product in `catalog.py`, instead of hardcoded positions — supports arbitrary future card designs.
- All 3 new products have `photoUploadEnabled: true` (they have a couple-photo illustration slot) unlike card-1 (fixed deity figure, no photo slot). Photo rectangle coordinates were iteratively re-measured via screenshot testing to fully mask each design's baked-in illustrated couple graphic (found & fixed a coverage gap during testing).
- A 4th user-provided design (cream/pink mandala) was excluded from the catalog — image analysis found its flap text ("Vitradiya Family", "Best Wishes & Blessings") was upside-down/mirrored; user needs to resend a corrected version before it can be added.
- Full regression tested by testing agent across iteration_7 (100% backend, found+iteration_8 confirmed fix for) the photo-rect coverage issue — now 100% pass on both backend and frontend.

## Known Gaps / Backlog
- P1: Razorpay is in simulated mode — needs real API keys from user to go live.
- **AI-generated new card design pending**: user requested a NEW wedding-themed Shagun envelope generated via GPT Image 1, but the Emergent Universal LLM Key budget was exhausted (budget_exceeded error) before generation could complete. Awaiting user's decision: add balance to Universal Key, provide own OpenAI key, or skip. Script ready at `/app/backend/scripts/generate_card_image.py`.
- **5th design (cream/pink mandala) pending**: excluded due to upside-down flap text defect in source image; awaiting corrected version from user.

## Updates (2026-07-02, post-order UX + customization simplification)
- **Post-order flow simplified**: after placing an order (COD or simulated Razorpay), the WhatsApp tab opens with full order details as before, but the app now redirects straight to the homepage (`/`) instead of a dedicated `/order-success` page — no visible Order ID badge anymore. `/order-success` route file left in place (unused/dead code, harmless) but no longer linked from the main flow.
- **Customization form simplified**: removed Wedding Date and Personal Message ("wishes") fields entirely. Only 3 fields remain — Name (single field, replaces old Groom/Bride split), Family Name (optional), Photo (optional). Backend `Customization`/`CustomizationCreate` models updated to match (`name`, `familyName`, `couplePhoto`). Live preview and WhatsApp message builder updated accordingly (still sends full order + customization details to WhatsApp).
- Fixed a minor homepage hero copy inconsistency (removed stale "sacred date"/"heartfelt message" references).
- Full regression tested by testing agent (iteration_4, 100% pass — 17/17 backend pytest + e2e flows for both COD and simulated-Razorpay order placement).

## What's Been Implemented (as of 2026-07-02)
- Imported and fully re-platformed the app (Next.js frontend + new FastAPI backend) preserving
  100% of original UI/UX and business logic.
- All flows verified end-to-end by testing agent (100% pass, 16/16 backend pytest + full manual
  frontend e2e): homepage → product detail → live customize preview + photo upload → checkout
  (COD & simulated Razorpay) → order-success → WhatsApp forward. Shipping/Returns static page,
  responsive mobile nav, WhatsApp float button all verified.
- Added `data-testid` attributes to all key interactive elements (product cards, header nav,
  quantity controls, customize form fields, checkout form fields, payment method options,
  place-order/WhatsApp buttons) for reliable future automated testing.

## Known Gaps / Backlog
- P1: Razorpay is in simulated mode — needs real API keys from user to go live.
- P2: `orderNumber` generation (`PRT########`) uses UUID-int truncation — low collision risk,
  could be hardened later with a proper sequence/hash generator.
- P2: No admin dashboard to view/manage orders (currently WhatsApp is the only order-management
  channel) — could be a valuable v2 feature.
- P3: No rate-limiting/abuse protection on public `/api/orders` and `/api/customizations` — fine
  for MVP, flag before scaling.

## Next Action Items
- Awaiting user's specific bug fix / feature request (user said "will tell after" seeing the
  import working).
