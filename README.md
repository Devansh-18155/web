# PARO Studio

[![CI](https://github.com/aashu2006/PARO-STUDIO/actions/workflows/ci.yml/badge.svg)](https://github.com/aashu2006/PARO-STUDIO/actions/workflows/ci.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](LICENSE)

A gallery for sharing AI image prompts — browse, like, save, and follow creators.
Built with React + TypeScript on Vite, styled with Tailwind and shadcn/ui, backed by Supabase.

Live at **[parostudios.in](https://www.parostudios.in)**.

Contributions are welcome — start with [CONTRIBUTING.md](CONTRIBUTING.md).

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase credentials
npm run dev                  # http://localhost:8080
```

## Environment

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

The anon key is meant to be public — it ships in the client bundle by design.
All access control is enforced by **Row Level Security policies in Supabase**,
not by hiding the key. If RLS is not enabled on a table, that table is wide open
to anyone who opens devtools.

`.env.local` is gitignored. Never commit a service-role key.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 8080 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm test` | Vitest (single run) |
| `npm run test:watch` | Vitest in watch mode |

Note that `npm run build` does **not** typecheck — that's why `typecheck` is a
separate script. CI runs `lint`, `typecheck`, `test`, and `build` on every PR.

## Backend requirements

The app expects this Supabase project layout.

**Tables** — `profiles`, `prompts`, `likes`, `saves`, `follows`

| Table | Key columns |
| --- | --- |
| `profiles` | `id` (= `auth.users.id`), `username`, `full_name`, `avatar_url`, `cover_url`, `bio` |
| `prompts` | `id`, `user_id`, `title`, `prompt`, `image_url`, `ai_tool`, `tags`, `view_count`, `copy_count`, `created_at` |
| `likes` | `id`, `user_id`, `prompt_id`, `created_at` |
| `saves` | `id`, `user_id`, `prompt_id`, `created_at` |
| `follows` | `follower_id`, `following_id` |

**Storage buckets** — `avatars`, `banners`, `prompt-images` (all public read).

**Auth** — email/password plus Google OAuth. New users are routed to
`/complete-profile` until they set a username.

### Generating database types

`src/services/supabase/database.types.ts` is currently a **placeholder** — it
declares no tables, so every query result widens to `any` and the service layer
loses its type safety. Replace it with real types:

```bash
npm install -g supabase
supabase gen types typescript --project-id YOUR_PROJECT_ID \
  > src/services/supabase/database.types.ts
```

Then parameterize the client in `src/services/supabase/client.ts`:

```ts
createClient<Database>(supabaseUrl, supabaseAnonKey, { ... })
```

This is the highest-value follow-up in the codebase — untyped query results
have already hidden real `snake_case`/`camelCase` mismatch bugs.

## Project structure

```
src/
├── components/
│   ├── auth/       AuthModal
│   ├── feed/       FeedCard, ImageCard, AdCard (ad slots are stubbed)
│   ├── layout/     Navbar, Footer
│   ├── prompts/    PromptCard, EditPromptModal, CreatorCard, TagFilter
│   ├── routing/    ProtectedRoute
│   └── ui/         shadcn/ui primitives
├── hooks/          useAuth (Supabase session + profile), usePrompts
├── lib/            shared types, error helpers, utils
├── pages/          one file per route
└── services/
    └── supabase/   client + auth, profiles, prompts, likes, saves, follows, storage
```

Data flows one way: `services/supabase/*` returns raw `snake_case` rows →
hooks and pages normalize to `camelCase` → components consume `camelCase`.
Keep that boundary sharp; mixing the two is the bug this codebase is most
prone to.

## Known follow-ups

- `database.types.ts` is a stub (see above)
- Single ~820 kB JS chunk — no route-level code splitting yet
- `react-router` v6 and `esbuild` (via Vite 5) carry moderate advisories that
  need major-version upgrades to clear
- Only a placeholder test exists; there is no real coverage

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, conventions, and the CLA.
For security issues, see [SECURITY.md](SECURITY.md) — please don't file those
as public issues.

## License

Licensed under the [GNU AGPL v3.0](LICENSE).

In short: you're free to use, modify, and share this code. If you run a
modified version as a public service, you must publish your source.

**The Paro Studio name and logo are not covered by that license.** Fork the
code if you like, but a public fork has to carry its own name and branding.
See [NOTICE](NOTICE) for details.
