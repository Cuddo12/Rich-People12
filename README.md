# HEEMS — Luxury Men's Fashion Atelier (Bangladesh)

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)]()

> **"Premium quality at a fair price."**  
> Complete full-stack production e-commerce platform for Bangladeshi men's fashion brand **HEEMS**, specializing in handcrafted **Men's Shirts** and **Men's Panjabis**, featuring manual **bKash/Nagad ৳200 advance payment verification**, live order tracking, and a comprehensive administrative command center.

---

## Table of Contents

1. [How to Install](#1-how-to-install)
2. [Dependencies Installation](#2-dependencies-installation)
3. [Environment Variables](#3-environment-variables)
4. [Supabase & PostgreSQL Setup](#4-supabase--postgresql-setup)
5. [Database Migration](#5-database-migration)
6. [Database Seeding](#6-database-seeding)
7. [Admin Credentials & Authentication](#7-admin-credentials--authentication)
8. [Run Development Server](#8-run-development-server)
9. [Build Production](#9-build-production)
10. [Deployment (Cloud Run / VPS / Vercel)](#10-deployment)
11. [Configure bKash Send Money](#11-configure-bkash-send-money)
12. [Configure Nagad Send Money](#12-configure-nagad-send-money)
13. [Configure Shipping Rates](#13-configure-shipping-rates)
14. [Product Catalog Management](#14-product-catalog-management)
15. [Order & Payment Verification Workflow](#15-order--payment-verification-workflow)

---

## 1. How to Install

Clone the repository to your local workstation or server:

```bash
git clone https://github.com/your-org/heems-menswear.git
cd heems-menswear
```

Ensure Node.js 18.x or 20.x is installed.

---

## 2. Dependencies Installation

Install the required packages using npm:

```bash
npm install
```

Core dependencies installed:
- `react`, `react-dom`
- `express` (full-stack API backend)
- `@tailwindcss/vite`, `tailwindcss`
- `lucide-react` (icons)
- `dotenv`, `tsx` (TypeScript Node runtime)

---

## 3. Environment Variables

Create a `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

Key variables configured in `.env`:

```env
PORT=3000
ADMIN_USERNAME=Miljar
ADMIN_PASSWORD=Miljar12
ADMIN_JWT_SECRET=heems_luxury_fashion_secret_key_2026_jwt_token_security

DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT].supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]

DEFAULT_BKASH_NUMBER=01712-345678
DEFAULT_NAGAD_NUMBER=01812-345678
DEFAULT_ADVANCE_AMOUNT=200
```

---

## 4. Supabase & PostgreSQL Setup

1. Create a project on [Supabase.com](https://supabase.com).
2. Go to **Project Settings → Database** to obtain your connection string URI (`DATABASE_URL`).
3. Under **API Settings**, copy the `Project URL` (`SUPABASE_URL`) and `anon public` key (`SUPABASE_ANON_KEY`).

---

## 5. Database Migration

The full relational schema is located in `supabase/schema.sql`.

Execute the schema using the Supabase SQL Editor or `psql`:

```bash
psql $DATABASE_URL -f supabase/schema.sql
```

The schema creates:
- `admins` (secure hashed admin credentials)
- `products` (sizes, fabrics, images, inventory, pricing)
- `orders` (bKash/Nagad advance payment, transaction tracking, status history)
- `inventory_logs` (audit history of stock changes)
- `coupons` & `offers` (discount rules & usage tracking)
- `site_settings` (configurable Send Money numbers, shipping fees)

---

## 6. Database Seeding

By default, the internal file database (`data/database.json`) automatically seeds itself with:
- 10+ handcrafted Luxury Shirt products with realistic BDT pricing
- 10+ bespoke Luxury Panjabi products (Giza cotton, silk-blend, embroidery)
- Categories & collections (Royal Heritage 2026, Signature Monochrome, etc.)
- Coupons (`WELCOME10`, `EID20`, `HEEMS500`, `FREESHIP`, `VIP15`)
- Active sample orders across various payment and fulfillment stages.

---

## 7. Admin Credentials & Authentication

Initial admin credentials:

- **Username:** `Miljar`
- **Password:** `Miljar12`

To access the Admin Portal:
1. Click the **ADMIN** button in the top navigation or navigate to `/admin`.
2. Log in with the seed credentials.
3. Once logged in, go to **Admin Security** in the sidebar to change the password or update your contact email.

---

## 8. Run Development Server

Start the full-stack server (runs Express API on port 3000 with Vite middleware):

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 9. Build Production

Compile the TypeScript and Vite assets for production:

```bash
npm run build
```

This compiles client-side assets into `dist/`.

---

## 10. Deployment

Run the production full-stack server:

```bash
npm run start
```

Or deploy to Google Cloud Run / Docker container:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

## 11. Configure bKash Send Money

HEEMS implements the authentic Bangladeshi manual Send Money verification workflow:

1. Log in to the Admin Dashboard (`/admin`).
2. Navigate to **Site & bKash Settings**.
3. Under **bKash Send Money Number**, input your personal or merchant bKash mobile number (e.g. `01712-345678`).
4. Click **Save Configuration**.
5. During checkout, customers will see this exact number with instructions to send ৳200 via Send Money.

---

## 12. Configure Nagad Send Money

1. In the Admin Dashboard (`/admin`), go to **Site & bKash Settings**.
2. Under **Nagad Send Money Number**, input your designated Nagad number (e.g. `01812-345678`).
3. Click **Save Configuration**.
4. Customers selecting Nagad at checkout will see this number and submit their Nagad Transaction ID.

---

## 13. Configure Shipping Rates

From **Site & bKash Settings**:
- **Inside Dhaka Charge:** Default ৳80 (24–48 hours delivery).
- **Outside Dhaka Charge:** Default ৳150 (2–4 days courier).
- **Free Shipping Threshold:** Default ৳5,000 (orders equal to or above this get free delivery).
- **Advance Payment Amount:** Default ৳200.

---

## 14. Product Catalog Management

From **Products Catalog** (`/admin`):
- **Add Product:** Set title, SKU, category (Shirts, Panjabi, Cuban Collar, etc.), sizes (S, M, L, XL, XXL), fabric, price, compare-at price, stock quantity, and images.
- **Duplicate Product:** Duplicate an existing blueprint in 1 click.
- **Edit Product:** Update specifications, prices, and imagery.
- **Delete Product:** Permanently remove discontinued items.
- **Stock Alert:** Automatically alerts when stock falls below the low-stock threshold.

---

## 15. Order & Payment Verification Workflow

1. **Customer Places Order:**
   - Selects garment, enters delivery address, and chooses delivery method (Inside/Outside Dhaka).
   - Pays ৳200 advance via bKash or Nagad Send Money.
   - Enters Transaction ID (TrxID) and Sender Mobile Number.
   - Order is created as `Payment Under Review` with payment status `PENDING_VERIFICATION`.

2. **Admin Verification (`/admin → Orders & Payments`):**
   - Admin cross-references TrxID with bKash/Nagad statement.
   - **Approve Payment:** Sets payment to `PAID`, order to `CONFIRMED`.
   - **Reject Payment:** Sets payment to `REJECTED`. The customer tracking page immediately offers a self-service form to re-enter corrected TrxID.
   - **Request New TrxID:** Requests customer to verify details.
   - **Order Lifecycle:** Update status to `Processing` → `Packed` → `Shipped` → `Delivered`.
   - **Invoice:** Generate and print official printable invoice with HEEMS branding.

---

© 2026 HEEMS Menswear Atelier. Handcrafted in Bangladesh. All rights reserved.
