# Captain Farmery - E-Commerce Platform

A premium, full-stack e-commerce platform built for agricultural D2C products. This application delivers a "Wow" factor through rich aesthetics, dynamic animations, and seamless user experiences.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 (Inline Theme)
- **Database ORM:** Prisma v5
- **Authentication:** Auth.js (NextAuth v5)
- **State Management:** Zustand (Persisted Cart)
- **Animations:** Framer Motion
- **Payments:** Razorpay Integration
- **Icons:** Lucide React

## Features
- **Storefront:** Dynamic Homepage, Category Filtering, Autocomplete Search, Product Detail Pages.
- **Shopping Cart:** Persistent slide-out cart powered by Zustand.
- **Checkout:** Seamless Razorpay integration with secure signature verification.
- **User Dashboard:** Order tracking, Profile Management, Saved Addresses.
- **Admin Panel:** Complete Role-Based Access Control (RBAC) dashboard for managing Orders and Products.
- **SEO Optimized:** Dynamic `sitemap.xml`, `robots.txt`, and OpenGraph tags.

## Getting Started

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables (`.env`):
   ```env
   DATABASE_URL="your_database_connection_string"
   AUTH_SECRET="your_nextauth_secret"
   NEXT_PUBLIC_RAZORPAY_KEY_ID="your_razorpay_key"
   RAZORPAY_KEY_SECRET="your_razorpay_secret"
   ```

3. Run Prisma migrations and seed the database:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Access
To access the admin panel (`/admin`), you must log in with an account whose `role` is set to `ADMIN` in the database.
