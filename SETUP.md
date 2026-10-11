# NOAH GIBBS Photography — deployment

## Features
- Minimal black/white portfolio with live 24-hour clock and date.
- No placeholder photographs: galleries remain empty until you publish your own images.
- Cars, Homes, Nature and Archive sections, image lightbox, contact enquiry form.
- Separate admin host (for example `admin.yourdomain.com`) routed to the protected admin area.
- Server-checked login with an HttpOnly session cookie. Credentials are environment variables and are not committed to GitHub.
- Project metadata is stored in Supabase. This starter stores uploaded images as data URLs in the database, so keep uploads modest; for a production gallery with many/high-resolution images, switch to Supabase Storage.

## 1. Create Supabase database
Create a Supabase project, then run this SQL in its SQL Editor:

```sql
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  category text not null,
  images jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.projects enable row level security;
-- This application accesses the table through a server-only service-role key.
-- Never expose SUPABASE_SERVICE_ROLE_KEY in a NEXT_PUBLIC_ variable.
```

Find your project URL and anon key in Supabase project settings. Keep the service-role key private.

## 2. Configure environment variables
Copy `.env.example` to `.env.local` for local testing and fill in values. Set the same variables in Vercel → Project → Settings → Environment Variables:
- `ADMIN_USERNAME` = `Noah`
- `ADMIN_PASSWORD` = choose a strong unique password (do not commit it to GitHub)
- `SESSION_SECRET` = a long random secret
- `ADMIN_DOMAIN` = the exact admin hostname, e.g. `admin.example.com`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side secret only)

The password previously shared in chat should be treated as exposed; use a new unique password before deployment.

## 3. GitHub and Vercel
1. Create a private or public GitHub repository and upload this folder's contents (not the ZIP itself).
2. In Vercel, import that repository. Framework should be detected as Next.js.
3. Add the environment variables above in Vercel before deploying, then deploy.
4. In Vercel → Settings → Domains, add both your public domain and the admin subdomain to the same deployment. Set `ADMIN_DOMAIN` to the admin hostname and redeploy.
5. Public domain serves the portfolio. Visiting the admin hostname redirects unauthenticated visitors to `/admin/login`.

## 4. Run locally
```bash
npm install
cp .env.example .env.local
# edit .env.local
npm run dev
```
Open http://localhost:3000 and http://localhost:3000/admin/login.

## Important security/production notes
- The credentials are not hardcoded in client code; they are read only on the server from environment variables.
- Change the example session secret and use a unique password before going live. Enable multi-factor authentication on GitHub, Vercel and Supabase.
- Configure Supabase backups and restrict access to your Vercel project. The service-role key bypasses Supabase RLS and must never be exposed to the browser.
- Large image uploads as data URLs can exceed request/database limits. Supabase Storage is recommended for real full-resolution photography portfolios.
- The contact form prepares an email in the visitor's mail app; it does not silently send email. To accept messages without their email app, connect an email service such as Resend via a server API route.
