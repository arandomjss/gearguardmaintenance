# gearguardmaintenance

This is the frontend for the GearGuard Maintenance demo app — a Vite + React + TypeScript project that demonstrates a maintenance request dashboard wired to Supabase.

## Quick start (development)

Prerequisites:

- Node.js 18+ or a compatible runtime
- npm (or pnpm/yarn) installed

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open your browser at `http://localhost:5173` (Vite default) and you should see the app.

## Environment

The project reads the Supabase project URL and anon key from `src/lib/supabase.ts`. For local testing replace those values with your Supabase project's values (Settings → API → Project URL & anon/public key).

If your Supabase project uses Row-Level Security (RLS) on private tables (for example `profiles`), either:

- Ensure the front-end signs in an authenticated user (and your policies allow `authenticated` role to SELECT), or
- Temporarily grant SELECT to the `anon` or `authenticated` role in the Supabase SQL editor for development, or
- Use a small server-side endpoint that performs the join using the service_role key and returns only allowed fields.

## Demo account (for testing)

You can use this demo account to sign in during local testing (only use for development/demo):

- Email: testingwosbots@gmail.com
- Password: test123

Note: This is a demo credential for local/testing purposes only. Do not use it in production.

## Building for production

```bash
npm run build
npm run preview
```

## Other notes

- The Supabase client is initialized in `src/lib/supabase.ts`.
- If profile names do not appear in the UI, check browser console logs for `useMaintenanceRequests: profiles raw` — this debug log shows the raw response and error returned by PostgREST and will help you diagnose RLS/permission issues.

---

If you want, I can add an authentication/sign-in flow to the app or a small server endpoint to safely expose joined maintenance request data. Tell me which you prefer.