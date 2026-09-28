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
| State Management  | Zustand (persisted cart)                 |
| Database          | PostgreSQL via Prisma v5                 |
| Auth              | NextAuth v5 (beta-32) + Prisma Adapter  |
| Payments          | Razorpay                                |
| Animations        | Framer Motion                           |
| Icons             | Lucide React                            |
| Toasts            | Sonner                                  |
| Fonts             | Google Fonts — Inter (sans), Playfair Display (serif) |

---

## Project Structure

```
captain-farmery/
├── prisma/
│   ├── schema.prisma          # Full DB schema (609 lines, 30+ models)
│   └── seed.ts                # Seeds categories (honey, spices) + 2 products with variants
├── scripts/
│   └── check-admin.ts         # Creates/upgrades admin user (admin@captainfarmery.com / admin123)
├── public/                    # Default Next.js SVGs only — no product images stored here
├── src/
│   ├── auth.ts                # NextAuth config — Credentials provider, JWT strategy, role in token
│   ├── middleware.ts          # Route protection: /account → login, /admin → ADMIN role, auth pages redirect if logged in
│   ├── app/
│   │   ├── layout.tsx         # Root layout — Inter + Playfair fonts, Sonner toaster
│   │   ├── globals.css        # Tailwind v4 theme (brand greens, custom shadows, radii, marquee animation)
│   │   ├── sitemap.ts         # Dynamic sitemap from products + categories
│   │   ├── robots.ts          # Disallows /admin/, /account/, /checkout/
│   │   ├── (auth)/            # Auth route group (no header/footer)
│   │   │   ├── login/page.tsx       # Login form (static HTML, NOT wired to signIn)
│   │   │   └── register/page.tsx    # Register form (static HTML, NOT wired to API)
│   │   ├── (storefront)/     # Public storefront with header/footer/cart drawer
│   │   │   ├── layout.tsx           # AnnouncementBar → Header → PageTransition → Footer → CartDrawer
│   │   │   ├── page.tsx             # Homepage — hero, category placeholders, benefits
│   │   │   ├── shop/page.tsx        # Server component, fetches ACTIVE products, renders ProductCard grid
│   │   │   ├── product/[slug]/page.tsx  # PDP — fetches product+variants, shows images, variant selector, add-to-cart
│   │   │   ├── category/[slug]/page.tsx # Category listing — fetches category + active products
│   │   │   ├── checkout/page.tsx    # Client-side checkout with Razorpay SDK integration
│   │   │   ├── checkout/success/page.tsx  # Order confirmation page
│   │   │   ├── account/layout.tsx   # Sidebar with Profile/Orders/Addresses/SignOut
│   │   │   ├── account/page.tsx     # Profile form (server component, reads user from DB)
│   │   │   ├── account/orders/page.tsx    # Order history (fetches user's orders)
│   │   │   ├── account/addresses/page.tsx # Placeholder — always shows empty
│   │   │   ├── about/page.tsx       # Static about page with Unsplash image
│   │   │   ├── contact/             # Exists as directory (not inspected, likely placeholder)
│   │   │   ├── privacy/             # Exists (likely static legal page)
│   │   │   └── terms/               # Exists (likely static legal page)
│   │   ├── admin/
│   │   │   ├── layout.tsx           # Admin sidebar layout (Dashboard/Orders/Products/Customers/Settings)
│   │   │   ├── page.tsx             # Dashboard — hardcoded stats + recent orders from DB
│   │   │   ├── orders/page.tsx      # Orders list table
│   │   │   ├── orders/[id]/         # Exists (order detail, not inspected)
│   │   │   ├── products/page.tsx    # Products list table with edit/delete buttons
│   │   │   ├── products/new/        # New product form page
│   │   │   ├── products/[slug]/     # Edit product page
│   │   │   └── products/ProductForm.tsx  # Shared create/edit product form component
│   │   └── api/
│   │       ├── auth/[...nextauth]/  # NextAuth catch-all route handler
│   │       ├── search/route.ts      # GET — product search (name/desc, case-insensitive, top 5)
│   │       ├── checkout/
│   │       │   ├── create-order/route.ts   # POST — creates Razorpay order + DB order+payment records
│   │       │   └── verify-payment/route.ts # POST — verifies Razorpay HMAC signature (DB update COMMENTED OUT)
│   │       └── admin/
│   │           ├── products/route.ts       # POST — create product (admin-only auth check)
│   │           ├── products/[slug]/        # PUT — edit product (not inspected)
│   │           └── orders/[id]/            # Order management API (not inspected)
│   ├── components/
│   │   ├── ui/button.tsx            # Shadcn v4 Button using @base-ui/react + CVA variants
│   │   ├── layout/
│   │   │   ├── AnnouncementBar.tsx  # Scrolling marquee banner (hardcoded promos)
│   │   │   ├── Header.tsx           # Sticky header — logo, nav (Shop/Honey/Spices/Deals/About), search, user/wishlist/admin/cart icons
│   │   │   ├── Footer.tsx           # 4-column footer — brand, quick links, legal, contact
│   │   │   ├── SearchBar.tsx        # Client component — debounced autocomplete search with dropdown
│   │   │   └── PageTransition.tsx   # Framer Motion page transition wrapper
│   │   ├── cart/
│   │   │   ├── CartButton.tsx       # Header cart icon with badge (client, hydration-safe)
│   │   │   ├── CartDrawer.tsx       # Slide-out cart drawer (client, hydration-safe)
│   │   │   └── AddToCartButton.tsx  # "icon" or "full" variant add-to-cart button with toast
│   │   ├── product/
│   │   │   └── ProductCard.tsx      # Product card — image, badges, price, wishlist, add-to-cart
│   │   ├── catalog/                 # Empty directory
│   │   └── admin/                   # Empty directory
│   ├── store/
│   │   └── useCartStore.ts          # Zustand store — cart items, add/remove/update/clear, persisted to localStorage
│   ├── hooks/
│   │   └── useDebounce.ts           # Generic debounce hook
│   ├── lib/
│   │   ├── prisma.ts                # Prisma singleton (globalThis pattern)
│   │   └── utils.ts                 # Re-exports `cn` from the `cn` package
│   ├── types/
│   │   └── next-auth.d.ts           # Augments NextAuth Session/User with `id` + `role`
│   ├── config/                      # Empty directory
│   ├── services/                    # Empty directory
│   ├── features/                    # Empty directory
│   └── validations/                 # Empty directory
```

---

## Database Schema (Prisma) — Key Models

The schema is **enterprise-grade** — far more comprehensive than what the UI currently uses:

| Domain            | Models                                                                 | Status          |
|-------------------|------------------------------------------------------------------------|-----------------|
| Users & Auth      | `User`, `Address`                                                      | ✅ Implemented  |
| Catalog           | `Category`, `Product`, `ProductVariant`, `ProductImage`, `ProductVideo`, `ProductAttribute`, `Tag` | ⚠️ Partial (images/videos/attributes/tags unused in UI) |
| Inventory         | `Inventory`, `InventoryMovement`, `Warehouse`                          | ❌ Not wired    |
| Cart & Wishlist   | `Cart`, `CartItem`, `Wishlist`, `WishlistItem`                         | ❌ DB cart unused — Zustand handles client-side cart |
| Orders            | `Order`, `OrderItem`, `Payment`, `Shipment`, `OrderTimeline`, `ReturnRequest` | ⚠️ Partial (Order + Payment created, but OrderItems NOT saved, timeline/shipment/returns unused) |
| Marketing & CMS   | `Coupon`, `Review`, `Banner`, `Page`, `HomepageSection`               | ❌ Not wired    |
| System            | `AuditLog`, `Notification`, `SearchHistory`, `ProductView`            | ❌ Not wired    |

### Critical Schema Note
- `User` has NO auth-related tables (`Account`, `Session`, `VerificationToken`) that NextAuth's PrismaAdapter typically expects. The app uses JWT strategy, so this works, but the `PrismaAdapter` is still configured, which may cause issues if OAuth providers are added.

---

## Authentication Flow

- **Strategy:** JWT (no DB sessions)
- **Provider:** Credentials only (email + bcrypt password hash)
- **Custom Fields:** `role` and `id` injected into JWT token and session
- **Middleware:** Protects `/account` (login required), `/admin` (ADMIN role required), redirects logged-in users away from `/login` and `/register`

### ⚠️ Auth Issues
1. **Login form is NOT wired** — it's a plain HTML `<form action="#" method="POST">`. There's no `signIn()` call from `next-auth`.
2. **Register form is NOT wired** — no API endpoint for registration exists.
3. **Google OAuth button exists** in the login form but is non-functional (no Google provider configured in `auth.ts`).
4. **Sign Out** forms in account/admin layouts POST to `/api/auth/signout` which may not match NextAuth v5's API.

---

## Cart System

- **Implementation:** Client-side only via Zustand (`useCartStore`)
- **Persistence:** `localStorage` via Zustand's `persist` middleware (key: `captain-farmery-cart`)
- **ID Generation:** `${productId}-${variantId || 'default'}`
- **Hydration:** All cart components use `mounted` state guard to prevent hydration mismatch
- **DB Cart:** The Prisma schema has `Cart`/`CartItem` models but they are NOT used — everything is client-side

---

## Checkout & Payments

1. **Cart items** sent to `/api/checkout/create-order` → creates Razorpay order + DB `Order` + `Payment` records
2. **Razorpay Checkout SDK** opens client-side modal
3. On success, handler calls `/api/checkout/verify-payment` → HMAC verification
4. **⚠️ Critical:** The `verify-payment` route has the DB update **COMMENTED OUT** — orders are never marked as PAID
5. **⚠️ Missing:** `OrderItem` records are never created — the order has no line items in the DB
6. **⚠️ Missing:** Shipping cost is calculated on frontend but NOT sent to the order creation API
7. **⚠️ Missing:** Checkout form data (address) is NOT saved to DB or sent to order API

---

## Admin Panel

- **Protected by:** Middleware RBAC (must have `role === 'ADMIN'`)
- **Dashboard:** Hardcoded stats (not real aggregations from DB) + recent orders table
- **Products:** Full CRUD with `ProductForm` component, creates via `/api/admin/products`
- **Orders:** List view with manage links to `/admin/orders/[id]`
- **⚠️ Missing:** Product delete API, bulk actions, image upload, variant management via UI
- **⚠️ Missing:** Customers/Settings pages (linked in sidebar but no pages exist)

---

## SEO

- ✅ Dynamic `sitemap.ts` — products, categories, static pages
- ✅ `robots.ts` — disallows admin/account/checkout
- ✅ OpenGraph metadata in root layout
- ✅ Per-page metadata on About page
- ⚠️ No `<title>` override on most pages (Shop, Product, Category, etc.)

---

## Design System

- **Color Palette:** Green-centric brand (`#2E7D32` primary, `#43A047` secondary)
- **Backgrounds:** Warm off-whites (`#FAFAF7`, `#F5F5F0`)
- **Dark Mode:** CSS variables defined but NO toggle exists
- **Border Radius:** Large/rounded (12px–40px, pill buttons)
- **Shadows:** Custom `shadow-subtle`, `shadow-card`, `shadow-lift`
- **Fonts:** Inter (body) + Playfair Display (headings)
- **Button:** Custom Shadcn v4 button using `@base-ui/react` + CVA

---

## Known Issues & Bugs

1. **`new PrismaClient()` instantiated multiple times** — `shop/page.tsx`, `product/[slug]/page.tsx`, `category/[slug]/page.tsx`, and `api/search/route.ts` each create a standalone `new PrismaClient()` instead of using the singleton from `@/lib/prisma`. This can exhaust DB connections.
2. **Payment verification doesn't update DB** — the Prisma update in `verify-payment/route.ts` is commented out.
3. **Auth forms are decorative** — Login and Register forms submit to `#`, not wired to any backend.
4. **Product images are all Unsplash placeholders** — `ProductImage` model exists but is never populated or fetched for display.
5. **Filters and sorting are non-functional** — the dropdowns and filter buttons on Shop/Category pages are static HTML with no logic.
6. **Wishlist button is non-functional** — Heart icon exists on ProductCard and PDP but has no handler or state.
7. **Mobile menu hamburger is non-functional** — Menu button in header does nothing.
8. **Admin dashboard stats are hardcoded** — not computed from actual order/user data.
9. **Address management is a stub** — always shows empty array.
10. **Account profile form doesn't save** — no `action` or `onSubmit` handler.
11. **Product variant selector is visual-only** — clicking a variant on PDP doesn't change price or cart item.

---

## Empty/Unused Directories

These directories exist but are empty — likely scaffolded for future use:
- `src/features/`
- `src/services/`
- `src/config/`
- `src/validations/`
- `src/components/catalog/`
- `src/components/admin/`

---

## Environment Variables

| Variable                      | Purpose                       |
|-------------------------------|-------------------------------|
| `DATABASE_URL`                | Prisma pooled connection      |
| `DIRECT_URL`                  | Prisma direct connection      |
| `AUTH_SECRET`                 | NextAuth JWT signing          |
| `AUTH_URL`                    | NextAuth base URL             |
| `AUTH_GOOGLE_ID/SECRET`       | Google OAuth (not implemented)|
| `RAZORPAY_KEY_ID`             | Razorpay public key           |
| `RAZORPAY_KEY_SECRET`         | Razorpay server secret        |
| `RAZORPAY_WEBHOOK_SECRET`     | Webhook verification (unused) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client-side Razorpay key      |
| `RESEND_API_KEY`              | Email sending (unused)        |
| `SUPABASE_URL/KEY`            | Storage (unused)              |

---

## What's Actually Working E2E

1. ✅ Homepage renders with hero, placeholder categories, benefits
2. ✅ Shop page fetches and renders real products from DB
3. ✅ Product detail page fetches product + variants from DB
4. ✅ Category pages filter products by category
5. ✅ Search autocomplete queries DB and shows results
6. ✅ Add to cart (client-side, persisted)
7. ✅ Cart drawer opens, shows items, updates quantities
8. ✅ Checkout page shows cart summary + shipping form
9. ✅ Razorpay order creation (if keys configured)
10. ✅ Admin dashboard shows recent orders from DB
11. ✅ Admin product list + create form
12. ✅ Admin orders list
13. ✅ Route protection via middleware (login redirect, RBAC)
14. ✅ Account pages (profile, orders) read from DB
15. ✅ Login/Register form submission (Wired with Credentials API)
16. ✅ Payment verification DB update (Status changes to PAID/CONFIRMED)
17. ✅ OrderItem creation during checkout
18. ✅ Filtering and sorting on shop/category pages
19. ✅ Wishlist functionality (Zustand + UI)
20. ✅ Address CRUD
21. ✅ Profile update
22. ✅ Dark mode toggle
23. ✅ Mobile navigation menu
24. ✅ Product variant selection on PDP
25. ✅ Coupon/discount application (WELCOME10)
26. ✅ Admin customer management
27. ✅ Admin settings UI
28. ✅ Product delete functionality

## What's NOT Working / Stubbed

1. ❌ Product image upload/management (requires storage)
2. ❌ Review system
3. ❌ Inventory tracking
4. ❌ Email notifications (requires Resend setup)
