@AGENTS.md

# Captain Farmery — Full Codebase Notes

## Overview

Captain Farmery is a **premium agricultural D2C e-commerce platform** built with Next.js 16 (App Router). It sells farm products like raw honey, stone-ground spices, and organic grains. The brand identity is "Rooted in Tradition, Driven by Purity" — earthy, green, premium.

---

## Tech Stack

| Layer             | Tech                                    |
|-------------------|-----------------------------------------|
| Framework         | Next.js 16.3.5 (App Router, RSC)        |
| Language          | TypeScript 5                            |
| Styling           | Tailwind CSS v4 + `tw-animate-css`      |
| UI Primitives     | `@base-ui/react` (Button), Shadcn v4    |
| State Management  | Zustand (persisted cart + wishlist)      |
| Database          | PostgreSQL via Prisma v5                 |
| Auth              | NextAuth v5 (beta-32) + Prisma Adapter  |
| Payments          | Razorpay                                |
| Storage           | Vercel Blob (`@vercel/blob`)            |
| Email             | Resend (`resend`)                       |
| Animations        | Framer Motion                           |
| Icons             | Lucide React                            |
| Toasts            | Sonner                                  |
| Fonts             | Google Fonts — Inter (sans), Playfair Display (serif) |

---

## Project Structure

```
captain-farmery/
├── prisma/
│   ├── schema.prisma          # Full DB schema (620+ lines, 30+ models)
│   └── seed.ts                # Seeds categories (honey, spices) + 2 products with variants
├── scripts/
│   └── check-admin.ts         # Creates/upgrades admin user (admin@captainfarmery.com / admin123)
├── public/
│   └── logo.png               # Captain Farmery brand logo
├── src/
│   ├── auth.ts                # NextAuth config — Credentials provider, JWT strategy, role in token
│   ├── middleware.ts          # Route protection: /account → login, /admin → ADMIN role, auth pages redirect if logged in
│   ├── app/
│   │   ├── layout.tsx         # Root layout — Inter + Playfair fonts, Sonner, CookieBanner, BackToTop, ScrollProgress
│   │   ├── globals.css        # Tailwind v4 theme (brand greens, custom shadows, radii, overflow-x-hidden)
│   │   ├── not-found.tsx      # Custom 404 page
│   │   ├── sitemap.ts         # Dynamic sitemap from products + categories
│   │   ├── robots.ts          # Disallows /admin/, /account/, /checkout/
│   │   ├── (auth)/            # Auth route group (no header/footer)
│   │   │   ├── login/page.tsx       # Login form — wired to NextAuth signIn()
│   │   │   └── register/page.tsx    # Register form — wired to /api/auth/register
│   │   ├── (storefront)/     # Public storefront with header/footer/cart drawer
│   │   │   ├── layout.tsx           # AnnouncementBar → Header → PageTransition → Footer → CartDrawer
│   │   │   ├── page.tsx             # Homepage — hero, category grid, featured products, benefits, FAQ, reviews
│   │   │   ├── shop/page.tsx        # Server component, fetches ACTIVE products, filtering & sorting, revalidate=0
│   │   │   ├── product/[slug]/page.tsx  # PDP — images, variant selector, reviews, add-to-cart, revalidate=0
│   │   │   ├── category/[slug]/page.tsx # Category listing — filtering & sorting, revalidate=0
│   │   │   ├── about/page.tsx       # About page
│   │   │   ├── contact/page.tsx     # Contact page with form
│   │   │   ├── privacy/page.tsx     # Privacy policy
│   │   │   ├── terms/page.tsx       # Terms of service
│   │   │   ├── refund-policy/page.tsx   # Refund policy
│   │   │   ├── shipping-policy/page.tsx # Shipping policy
│   │   │   ├── cookie-policy/page.tsx   # Cookie policy
│   │   │   ├── account/layout.tsx   # Sidebar with Profile/Orders/Addresses/SignOut
│   │   │   ├── account/page.tsx     # Profile form (server component, reads user from DB)
│   │   │   ├── account/orders/page.tsx    # Order history with timeline tracking
│   │   │   └── account/addresses/page.tsx # Address CRUD
│   │   ├── checkout/
│   │   │   ├── page.tsx             # Client-side checkout — address selection, Razorpay integration
│   │   │   └── success/page.tsx     # Order confirmation page
│   │   ├── admin/
│   │   │   ├── layout.tsx           # Admin sidebar + mobile drawer menu
│   │   │   ├── AdminMobileMenu.tsx  # Slide-out mobile admin navigation
│   │   │   ├── page.tsx             # Dashboard — stats + recent orders from DB
│   │   │   ├── orders/page.tsx      # Orders list table with overflow-x-auto
│   │   │   ├── orders/[id]/page.tsx # Order detail with status management + timeline
│   │   │   ├── products/page.tsx    # Products list table with edit/delete
│   │   │   ├── products/new/page.tsx# New product form page
│   │   │   ├── products/[slug]/page.tsx # Edit product page
│   │   │   ├── products/ProductForm.tsx # Shared create/edit form — images (Vercel Blob upload), variants, inventory, SEO tabs
│   │   │   ├── categories/page.tsx  # Categories list with inline delete
│   │   │   ├── categories/new/page.tsx  # New category form
│   │   │   ├── customers/page.tsx   # Customer list from DB
│   │   │   ├── reviews/page.tsx     # Review moderation (approve/delete)
│   │   │   ├── faqs/page.tsx        # FAQ management
│   │   │   ├── faqs/new/page.tsx    # New FAQ form
│   │   │   ├── faqs/[id]/page.tsx   # Edit FAQ form
│   │   │   └── settings/page.tsx    # Store settings UI
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── [...nextauth]/   # NextAuth catch-all route handler
│   │       │   └── register/route.ts # POST — user registration with bcrypt
│   │       ├── search/route.ts      # GET — product search (name/desc, case-insensitive, top 5)
│   │       ├── upload/route.ts      # POST — image upload to Vercel Blob
│   │       ├── reviews/route.ts     # POST — create review (verified purchase check) + revalidatePath
│   │       ├── account/
│   │       │   ├── addresses/route.ts # GET/POST/DELETE — address CRUD
│   │       │   └── profile/route.ts   # PUT — profile update
│   │       ├── checkout/
│   │       │   ├── create-order/route.ts   # POST — secure price calc, inventory check, Razorpay order, DB order+items
│   │       │   └── verify-payment/route.ts # POST — HMAC verification, inventory deduction, email, revalidatePath
│   │       └── admin/
│   │           ├── products/route.ts       # POST — create product + inventory + revalidatePath
│   │           ├── products/[slug]/route.ts # PUT/DELETE — edit/delete product + inventory + revalidatePath
│   │           ├── orders/[id]/route.ts    # PATCH — update order status + timeline + revalidatePath
│   │           ├── faqs/route.ts           # POST — create FAQ + revalidatePath
│   │           └── faqs/[id]/route.ts      # PUT — update FAQ + revalidatePath
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx            # Shadcn v4 Button using @base-ui/react + CVA variants
│   │   │   ├── FAQItem.tsx           # Expandable FAQ accordion item
│   │   │   ├── BackToTop.tsx         # Floating scroll-to-top button
│   │   │   ├── ScrollProgress.tsx    # Scroll progress bar at top of page
│   │   │   └── CookieBanner.tsx      # Cookie consent banner
│   │   ├── layout/
│   │   │   ├── AnnouncementBar.tsx  # Scrolling marquee banner (hardcoded promos)
│   │   │   ├── Header.tsx           # Sticky header — logo, nav, search, dark mode, mobile drawer
│   │   │   ├── Footer.tsx           # 4-column footer — brand, quick links, legal, contact
│   │   │   ├── SearchBar.tsx        # Client component — debounced autocomplete search
│   │   │   └── PageTransition.tsx   # Framer Motion page transition wrapper
│   │   ├── cart/
│   │   │   ├── CartButton.tsx       # Header cart icon with badge
│   │   │   ├── CartDrawer.tsx       # Slide-out cart drawer
│   │   │   └── AddToCartButton.tsx  # "icon" or "full" variant add-to-cart button with toast
│   │   ├── product/
│   │   │   ├── ProductCard.tsx      # Product card — image, badges, price, wishlist, add-to-cart
│   │   │   ├── VariantSelector.tsx  # Client-side variant selector with add-to-cart
│   │   │   ├── ReviewSection.tsx    # Review display + submission form
│   │   │   └── WishlistButton.tsx   # Wishlist toggle button
│   │   ├── catalog/
│   │   │   └── ShopControls.tsx     # Sort + category filter controls
│   │   └── account/
│   │       └── ProfileForm.tsx      # Client-side profile edit form
│   ├── store/
│   │   ├── useCartStore.ts          # Zustand — cart items, add/remove/update/clear, persisted to localStorage
│   │   └── useWishlistStore.ts      # Zustand — wishlist items, toggle, persisted to localStorage
│   ├── hooks/
│   │   └── useDebounce.ts           # Generic debounce hook
│   ├── lib/
│   │   ├── prisma.ts                # Prisma singleton (globalThis pattern)
│   │   ├── email.ts                 # Resend email helper (order confirmation)
│   │   └── utils.ts                 # Re-exports `cn` from the `cn` package
│   └── types/
│       └── next-auth.d.ts           # Augments NextAuth Session/User with `id` + `role`
```

---

## Database Schema (Prisma) — Key Models

The schema is **enterprise-grade** with 30+ models:

| Domain            | Models                                                                 | Status          |
|-------------------|------------------------------------------------------------------------|-----------------|
| Users & Auth      | `User`, `Address`                                                      | ✅ Implemented  |
| Catalog           | `Category`, `Product`, `ProductVariant`, `ProductImage`, `ProductVideo`, `ProductAttribute`, `Tag` | ✅ Implemented (images via Vercel Blob, variants fully functional) |
| Inventory         | `Inventory`, `InventoryMovement`, `Warehouse`                          | ✅ Implemented (stock tracking, auto-deduction on order) |
| Cart & Wishlist   | `Cart`, `CartItem`, `Wishlist`, `WishlistItem`                         | ⚠️ Client-side Zustand handles cart + wishlist (DB models unused) |
| Orders            | `Order`, `OrderItem`, `Payment`, `Shipment`, `OrderTimeline`, `ReturnRequest` | ✅ Implemented (full order lifecycle, timeline, status management) |
| Marketing & CMS   | `Coupon`, `Review`, `Banner`, `Page`, `HomepageSection`, `FAQ`        | ⚠️ Partial (Reviews ✅, FAQ ✅, Coupons basic, Banner/Page/Section unused) |
| System            | `AuditLog`, `Notification`, `SearchHistory`, `ProductView`            | ❌ Not wired    |

---

## Authentication Flow

- **Strategy:** JWT (no DB sessions)
- **Provider:** Credentials only (email + bcrypt password hash)
- **Custom Fields:** `role` and `id` injected into JWT token and session
- **Middleware:** Protects `/account` (login required), `/admin` (ADMIN role required), redirects logged-in users away from `/login` and `/register`
- **Registration:** Fully wired via `/api/auth/register`

---

## Cart System

- **Implementation:** Client-side only via Zustand (`useCartStore`)
- **Persistence:** `localStorage` via Zustand's `persist` middleware (key: `captain-farmery-cart`)
- **ID Generation:** `${productId}-${variantId || 'default'}`
- **Hydration:** All cart components use `mounted` state guard to prevent hydration mismatch
- **DB Cart:** The Prisma schema has `Cart`/`CartItem` models but they are NOT used — everything is client-side

---

## Checkout & Payments

1. **Cart items** sent to `/api/checkout/create-order` → secure server-side price calculation from DB, inventory stock check, creates Razorpay order + DB `Order` + `OrderItem` + `Payment` records
2. **Razorpay Checkout SDK** opens client-side modal
3. On success, handler calls `/api/checkout/verify-payment` → HMAC signature verification → marks order PAID/CONFIRMED → deducts inventory → logs inventory movement → sends confirmation email → triggers `revalidatePath`
4. **Guest Checkout:** Supported — orders are created without user association if not logged in
5. **Shipping:** ₹50 flat rate, free above ₹999 (calculated server-side)
6. **Coupons:** Basic support (WELCOME10 = 10% off)

---

## Admin Panel

- **Protected by:** Middleware RBAC (must have `role === 'ADMIN'`)
- **Dashboard:** Stats + recent orders from DB
- **Products:** Full CRUD with multi-tab `ProductForm` — Basic Info, Images (Vercel Blob upload), Variants & Pricing, Inventory, SEO, Shipping & Tax
- **Orders:** List view + detail page with status management (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED) + automatic timeline entries
- **Categories:** Create + delete with inline server actions
- **Customers:** List view from DB
- **Reviews:** Approve/delete moderation
- **FAQs:** Full CRUD (create, edit, delete)
- **Settings:** Store settings UI
- **Mobile:** Responsive with slide-out `AdminMobileMenu` drawer

---

## Real-Time Revalidation

Every admin mutation triggers `revalidatePath("/", "layout")` to instantly flush the storefront cache:

| Action | API Route | Revalidates |
|--------|-----------|-------------|
| Create product | `POST /api/admin/products` | ✅ Entire site |
| Update product | `PUT /api/admin/products/[slug]` | ✅ Entire site |
| Delete product | `DELETE /api/admin/products/[slug]` | ✅ Entire site |
| Create FAQ | `POST /api/admin/faqs` | ✅ Entire site |
| Update FAQ | `PUT /api/admin/faqs/[id]` | ✅ Entire site |
| Update order status | `PATCH /api/admin/orders/[id]` | ✅ Entire site |
| Create/delete category | Server actions | ✅ Entire site |
| Approve/delete review | Server actions | ✅ Entire site |
| Delete FAQ | Server actions | ✅ Entire site |
| Submit review | `POST /api/reviews` | ✅ Entire site |
| Verify payment | `POST /api/checkout/verify-payment` | ✅ Entire site |

All storefront pages use `revalidate = 0` for always-fresh data.

---

## SEO

- ✅ Dynamic `sitemap.ts` — products, categories, static pages
- ✅ `robots.ts` — disallows admin/account/checkout
- ✅ OpenGraph metadata in root layout
- ✅ Per-page metadata on all storefront pages (Shop, Product, Category, About, Contact, Privacy, Terms, etc.)
- ✅ Custom 404 page

---

## Design System

- **Color Palette:** Green-centric brand (`#2E7D32` primary, `#43A047` secondary)
- **Backgrounds:** Warm off-whites (`#FAFAF7`, `#F5F5F0`)
- **Dark Mode:** Toggle in header + mobile menu (CSS class toggle)
- **Border Radius:** Large/rounded (12px–40px, pill buttons)
- **Shadows:** Custom `shadow-subtle`, `shadow-card`, `shadow-lift`
- **Fonts:** Inter (body) + Playfair Display (headings)
- **Button:** Custom Shadcn v4 button using `@base-ui/react` + CVA
- **Mobile:** Fully responsive — all tables wrapped in `overflow-x-auto`, mobile drawer menus, responsive grids

---

## Environment Variables

| Variable                      | Purpose                           |
|-------------------------------|-----------------------------------|
| `DATABASE_URL`                | Prisma pooled connection          |
| `DIRECT_URL`                  | Prisma direct connection          |
| `AUTH_SECRET`                 | NextAuth JWT signing              |
| `RAZORPAY_KEY_ID`             | Razorpay server key               |
| `RAZORPAY_KEY_SECRET`         | Razorpay server secret            |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client-side Razorpay key          |
| `BLOB_READ_WRITE_TOKEN`       | Vercel Blob storage token         |
| `RESEND_API_KEY`              | Email sending via Resend          |

**Removed:** `AUTH_URL`, `NEXT_PUBLIC_APP_URL` (Next.js auto-detects), `SUPABASE_URL/KEY` (migrated to Vercel Blob)

---

## What's Actually Working E2E

1. ✅ Homepage renders with hero, category grid, featured products, benefits, FAQ, reviews
2. ✅ Shop page fetches and renders real products from DB with filtering & sorting
3. ✅ Product detail page — images, variant selector, reviews, add-to-cart
4. ✅ Category pages filter products by category with sorting
5. ✅ Search autocomplete queries DB and shows results
6. ✅ Add to cart (client-side, persisted)
7. ✅ Cart drawer opens, shows items, updates quantities
8. ✅ Checkout — address selection (saved or new), Razorpay payment, guest support
9. ✅ Payment verification — HMAC check, DB update, inventory deduction, email
10. ✅ Admin dashboard with real stats + recent orders
11. ✅ Admin product CRUD (create, edit, delete) with image upload (Vercel Blob)
12. ✅ Admin order management with status progression + timeline
13. ✅ Admin category create/delete
14. ✅ Admin customer list
15. ✅ Admin review moderation (approve/delete)
16. ✅ Admin FAQ management (create, edit, delete)
17. ✅ Admin settings UI
18. ✅ Route protection via middleware (login redirect, RBAC)
19. ✅ Account pages (profile update, orders with timeline, address CRUD)
20. ✅ Login/Register fully wired (Credentials + API)
21. ✅ Filtering and sorting on shop/category pages
22. ✅ Wishlist functionality (Zustand + UI)
23. ✅ Dark mode toggle (header + mobile menu)
24. ✅ Mobile navigation (storefront + admin)
25. ✅ Product variant selection on PDP (changes price + cart item)
26. ✅ Coupon/discount application (WELCOME10 = 10% off)
27. ✅ Inventory tracking (stock check at checkout, auto-deduction on payment)
28. ✅ Order confirmation email via Resend
29. ✅ Real-time revalidation (admin changes instantly reflected on storefront)
30. ✅ Cookie consent banner
31. ✅ Back-to-top button + scroll progress bar
32. ✅ All pages mobile responsive (tables have overflow-x-auto, mobile menus, responsive grids)
33. ✅ All navigation links working (no broken 404 links)
34. ✅ Legal pages: Privacy, Terms, Refund, Shipping, Cookie policies
35. ✅ Custom 404 page
36. ✅ DB-backed Cart & Wishlist (local Zustand state automatically syncs with Postgres on login/changes via `StoreSync` component)
37. ✅ Shipment Tracking (Admin UI to update tracking details, API route to auto-update order status, Customer UI to view carrier/tracking/link)

38. ✅ System Models tracking (AuditLog for product changes, Notification for shipment updates, SearchHistory for searches, ProductView for PDP hits)

39. ✅ Returns Request Processing (Customer UI to request returns on delivered orders, Admin UI to manage status, APIs for both)

40. ✅ Banner/HomepageSection CMS models (schema exists, wired to Homepage for Hero section, falling back to beautiful hardcoded design if DB is empty)

## What's NOT Working / Stubbed

1. ❌ Google OAuth (provider not configured, button exists in login form)


