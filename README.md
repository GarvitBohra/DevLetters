# DevLetters

A quiet place to read and write. DevLetters is a blogging platform where people sign up, write, publish and read.

> **Status: early development.** Accounts, profiles and an AI chat work. The editor, publishing and database-backed articles are next. The articles on the home page are still sample content.

## What works today

- Warm editorial design with light and dark themes
- Email and password sign-up, login and logout (Supabase Auth)
- Profile settings (display name, handle, bio) and public profile pages at `/u/<handle>`
- Show/hide password toggle on the login and sign-up forms
- AI chat at `/chat` (Google Gemini), for logged-in users only
- Protected routes, open-redirect protection and row level security on the database

## Tech stack

| Part | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Database and auth | Supabase (Postgres, Auth, Row Level Security) |
| AI chat | Google Gemini API (called from the server only) |
| Hosting (planned) | Vercel |

## Project layout

```
web/                 Next.js app
  src/app/           Pages, server actions and API routes
  src/components/    Shared UI components
  src/lib/           Supabase clients and helpers
supabase/migrations/ SQL to run in the Supabase SQL editor
```

## Run it locally

You need Node.js 20+ and a free [Supabase](https://supabase.com) project.

1. Install dependencies:
   ```bash
   cd web
   npm install
   ```
2. Create the database tables. In the Supabase dashboard open **SQL Editor** and run the contents of `supabase/migrations/0001_profiles.sql`. It is safe to run more than once.
3. Create `web/.env.local` from the template and fill it in:
   ```bash
   cp .env.example .env.local
   ```
   | Variable | Where to get it |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API (the **publishable / anon** key) |
   | `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey), only needed for `/chat` |
   | `GEMINI_MODEL` | Optional. Defaults to `gemini-flash-lite-latest` |
   | `DEV_LOGIN_EMAIL`, `DEV_LOGIN_PASSWORD` | Optional. Prefills the login form in development only |
4. In Supabase, under **Authentication → URL Configuration**, set the site URL to `http://localhost:3000` and add `http://localhost:3000/auth/callback` as a redirect URL.
5. While developing, you can turn off **Confirm email** (Authentication → Providers → Email) so sign-up logs you in directly. Turn it back on before real users join.
6. Start the app:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

## Security notes

- Use only the Supabase **publishable/anon** key in the app. Never use the `service_role` or secret key.
- `GEMINI_API_KEY` is server-only. Never prefix it with `NEXT_PUBLIC_`.
- `.env.local` and any password files are gitignored. Do not commit secrets.
- The dev login prefill only runs under `npm run dev`, never in a production build.

## Roadmap

1. Editor (Tiptap), autosave drafts, image upload, publish and unpublish
2. Article pages from the database, SEO, RSS, tags
3. Feeds and search
4. Safety and legal: report button, admin tools, rate limits, privacy policy and terms
5. Likes, bookmarks and comments
6. Error tracking, backups, tests, private beta, public launch
