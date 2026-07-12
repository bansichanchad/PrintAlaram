# Website Build Prompt — "Printalaram" (Shagun Lifafa eCommerce)

Use this prompt to fully recreate the Printalaram website from scratch.

## 1. Project Overview
Build **Printalaram**, a premium eCommerce website for personalized Indian wedding/devotional
money envelopes ("Shagun Lifafa"). Customers browse envelope designs, personalize one live
(name, family name, optional photo), checkout (online payment or Cash on Delivery), and the
complete order + customization details are automatically forwarded to the store owner via a
WhatsApp deep link (`wa.me`) — no admin dashboard needed, WhatsApp IS the order management tool.

Brand identity: royal Indian wedding aesthetic — deep plum/maroon (#3a0a2a), antique gold
(#c9a961 / #f0d68c), and cream/ivory backgrounds. Elegant serif display font for headings,
clean sans-serif for body text. Micro-animations on hover/entrance throughout.

## 2. Tech Stack
- **Frontend**: Next.js 15 (App Router), React 18, Tailwind CSS, Framer Motion (animations),
  Lucide icons, shadcn/ui components, `sonner` for toasts.
- **Backend**: FastAPI (Python), MongoDB (via Motor async driver), all routes prefixed `/api`.
- **No authentication** — fully public storefront, no login/accounts.
- **Payment**: Razorpay (India) — order creation + signature verification; gracefully falls back
  to a SIMULATED test-mode flow when no real API keys are configured, so checkout is always
  demoable end-to-end.
- **WhatsApp**: no API needed — pure `https://wa.me/<number>?text=<encoded message>` deep link.

## 3. Product Catalog
Each product is a static entry (no admin/DB catalog) with:
```
id, name, slug, image, gallery[], price, originalPrice, discount,
category, categoryName, rating, reviewCount, bestSeller, featured, inStock,
photoUploadEnabled (bool),
layout: {
  photo: { top, left, width, height } | null,   // CSS % — rectangle where uploaded photo is composited
  name:  { top, left?, width?, align?, color, size? },
  family:{ top, left?, width?, align?, color, size? },
}
```
`photoUploadEnabled` and `layout` let each card design have its own precise text/photo placement
matching that specific artwork (some designs have a couple-photo slot, others — e.g. a devotional
design with a fixed deity figure — do not and hide the photo upload UI entirely).

## 4. Tiered Quantity Pricing
Single global pricing rule applied to every product:
- Base rate: ₹15 per envelope
- 200+ quantity: ₹14 per envelope
- 500+ quantity: ₹13 per envelope
- Quantity presets shown as buttons: 100 / 200 / 500 (200 pre-selected by default)
- +/- steppers move in increments of 50, floor of 100
- Free shipping above ₹999 subtotal (else ₹49) — computed dynamically once address is known

## 5. Pages & Flows

**Homepage (`/`)**
- Hero with 3 floating decorative envelope images (main + 2 cropped accent cards, animated
  float/rotate loop), premium copy, CTA to shop
- Scrolling marquee band of trust badges ("Premium Quality Paper", "Free Digital Proof on
  WhatsApp", "Pan-India Delivery", etc.)
- Categories grid, "All Shagun Lifafa" product grid (cards show image, name, rating, price with
  strikethrough original price and discount badge)
- FAQ accordion, Footer with WhatsApp/contact info
- Persistent floating WhatsApp pill button (bottom-right, all pages): brand name + pulsing
  "ONLINE" badge + bold CTA text, real WhatsApp logo icon, opens `wa.me` with a pre-filled inquiry
  message

**Product Detail (`/products/[id]`)**
- Image area with a 2-way toggle: "Original" (plain envelope photo) vs "With Your Name (Preview)"
  (same artwork with a sample name/family composited on top at the correct position, using the
  product's `layout` config) — lets customers see how customization will look before ordering
- Price (updates live per quantity tier), quantity selector (presets + steppers), trust badges,
  "Customize Now" and "Buy Now" CTAs
- No product description/feature bullet list — clean, minimal info design

**Customize (`/customize/[id]`)**
- Split layout: live preview (left, sticky) + form (right)
- Form fields: Name, Family Name (optional), Photo upload (optional, ONLY shown if that
  product's `photoUploadEnabled` is true)
- Live preview composites Name/Family/Photo onto the actual envelope artwork in real time at
  the exact position defined by that product's `layout` config (no generic overlay — text sits
  precisely in that design's empty printable area, e.g. between decorative pillars, below a
  header line, avoiding any baked-in static text)
- "Save & Proceed to Checkout" → POST `/api/customizations` → redirect to checkout with the
  customization id in the URL

**Checkout (`/checkout`) — 2-step flow (Shopify-style)**
- Step 1 "Contact + Delivery": Email + marketing checkbox; Country (fixed "India"), First Name,
  Last Name, Address, Apartment (optional), City, State (dropdown of Indian states), PIN code,
  Phone, WhatsApp Number, "save info"/"SMS offers" checkboxes (cosmetic only) → "Continue" button
  with required-field validation
- Step 2 "Payment": shows entered address summary with a "Change" link back to step 1, Payment
  Method radio (Razorpay test-mode / Cash on Delivery), dynamic "Place Order" button
- Order Summary side panel: product thumbnail + qty badge, subtotal, shipping (shows "Enter
  shipping address" until city/state/pincode filled, then FREE or ₹49), total — **no discount/
  coupon code field anywhere**
- On order placement: POST `/api/orders` → for Razorpay, POST `/api/payments/create-order` (falls
  back to simulated response without real keys) → open Razorpay checkout widget (or auto-simulate
  payment success) → POST `/api/payments/verify` (or `/api/payments/simulate`) → build a detailed
  WhatsApp message (order #, product, qty, price, total, payment status, customer details,
  customization details, photo link) → open `wa.me` with that message in a new tab → **redirect
  straight to the homepage** (no separate order-success page/order-ID display needed since
  WhatsApp already has everything)

## 6. Backend API (all prefixed `/api`)
```
GET  /api/health
GET  /api/products                 (filters: ?category=, ?featured=true, ?bestSeller=true)
GET  /api/products/{id}
GET  /api/categories
POST /api/customizations            { productId, name, familyName, couplePhoto(base64) }
GET  /api/customizations/{id}
POST /api/orders                    { productId, productName, productImage, customization,
                                       quantity, price, total, customerName, mobile, whatsapp,
                                       email, address, city, state, pincode, paymentMethod }
GET  /api/orders/{id}
POST /api/payments/create-order     { orderId, amount } → { razorpayOrderId, amount, currency, keyId, simulated }
POST /api/payments/simulate         { orderId } → marks order paid (test mode)
POST /api/payments/verify           { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId }
GET  /api/uploads/{filename}        (serves uploaded customization photos saved to disk)
```
Uploaded photos: base64 data URI → decoded and saved to a local `uploads/` folder → served back
via `/api/uploads/<file>` so the URL works regardless of which service instance handles the
request (needed since photo URLs are also embedded in the WhatsApp message).

## 7. Design Details
- Envelope card aspect ratio: 3:4, rounded corners, white border, soft shadow
- Text on customization overlay uses a subtle dark text-shadow for legibility over varied
  artwork backgrounds; Name typically white/cream bold, Family Name gold italic script style
- Framer Motion entrance animations (fade+slide) on preview text updates, staggered reveals on
  page load, floating/rotating hero decorative cards
- Every interactive element has a `data-testid` attribute for QA automation

## 8. Sample Product Set (to seed the catalog)
1. A devotional design with a fixed religious figure (photo upload disabled) — Name + Family
   Name positioned in the empty panel above the figure
2-4. Three wedding-themed designs, each with a couple-photo illustration placeholder (photo
   upload enabled) in a different position per design, plus "With Warm Regards" style
   decorative header/footer text baked into the artwork
