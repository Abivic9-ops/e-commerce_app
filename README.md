# E-Commerce App (Storefront & Admin Dashboard)

A Next.js e-commerce application targeting the Kenyan/African market. It integrates role-based login (Buyer vs. Admin/Seller), lightweight client and server-side authentication with Supabase SSR, custom animations with Framer Motion, and mobile payment checks using the Safaricom M-Pesa Daraja API.

## Tech Stack & Pin Versions
- **Framework**: Next.js 16.2.9 (App Router)
- **UI Logic**: React 19.2.4 & TypeScript 5
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Animation**: Framer Motion 12.40.0
- **Authentication**: Supabase Auth via `@supabase/ssr` (100% Cookie-based sessions)
- **Database**: MongoDB Atlas accessed via Mongoose 9.7.0 (with a cached connection utility)
- **Form / Schema Validation**: Zod 4.4.3 & React Hook Form 7.79.0

---

## Service Account Creation Guides

To run this application locally, you must sign up for and configure the following services:

### 1. Supabase Project (Authentication Only)
- Go to [Supabase](https://supabase.com) and create a free project.
- In the dashboard, navigate to **Project Settings -> API** and copy:
  - `Project URL` (maps to `NEXT_PUBLIC_SUPABASE_URL`)
  - `anon public` key (maps to `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
  - `service_role` key (maps to `SUPABASE_SERVICE_ROLE_KEY` - keep this server-only!)
- In **Authentication -> Providers -> Email**, ensure Email signup is enabled.

### 2. MongoDB Atlas (Business Data)
- Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free M0 Cluster.
- Once created, click **Connect -> Drivers**, and copy your connection string.
- Update the connection string with your username and password, mapping it to `MONGODB_URI` (ensure it specifies database `ecommerce_db`).

### 3. Safaricom Daraja Developer Account (M-Pesa Sandbox Payments)
- Go to the [Safaricom Daraja Developer Portal](https://developer.safaricom.co.ke/) and create an account.
- Navigate to **My Apps** and create a new sandbox app. Enable the **Lipa Na M-Pesa Sandbox** API for your app.
- Once approved, copy your **Consumer Key** and **Consumer Secret**.
- For development testing, you can use the default test credentials:
  - **Shortcode**: `174379`
  - **Passkey**: `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
- Get a tunneling tool (like [ngrok](https://ngrok.com/)) to expose your localhost to a public callback URL (e.g. `https://<subdomain>.ngrok-free.app/api/mpesa/callback`).

### 4. Vercel Account (Deployment)
- Create a free account on [Vercel](https://vercel.com).
- Connect your GitHub repository to deploy.

---

## Local Development Setup

1. **Clone the repository and go into directory**:
   ```bash
   cd e-commerce_app
   ```

2. **Set up Environment Variables**:
   Create a `.env.local` file by copying the example:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your actual API keys.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the storefront placeholder page.

5. **Lint and Build Validation**:
   ```bash
   npm run lint
   npm run build
   ```
