# Contributing to PARO Studio

Thanks for wanting to help. This is a small project and contributions are
genuinely welcome — bug fixes, features, docs, tests, all of it.

## Before you start

For anything beyond a small fix, **open an issue first** and say what you plan
to do. It's much better to agree on an approach up front than to have a
finished PR turned down over a design decision.

Good first contributions are labelled [`good first issue`][gfi].

[gfi]: https://github.com/aashu2006/PARO-STUDIO/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22

## Setup

```bash
git clone https://github.com/aashu2006/PARO-STUDIO.git
cd PARO-STUDIO
npm install
cp .env.example .env.local   # fill in your own Supabase credentials
npm run dev                  # http://localhost:8080
```

You need your own Supabase project — see **Backend requirements** in the
[README](README.md) for the tables, buckets, and auth setup the app expects.
Never commit `.env.local`, and never put a service-role key anywhere in this
repo.

## Before you open a PR

Run all four. CI runs the same ones and will block the PR if any fail.

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run build` does **not** typecheck — that's why `typecheck` is separate.
Don't skip it.

## Conventions

- **Data flow is one-way and the boundary matters.** `services/supabase/*`
  returns raw `snake_case` rows → hooks and pages normalize to `camelCase` →
  components only ever see `camelCase`. Mixing the two is the single most
  common bug in this codebase. Keep the boundary sharp.
- Match the style of the file you're editing. There's no separate formatter
  step; ESLint is the source of truth.
- Keep PRs focused. One concern per PR is much easier to review than five.
- Write a commit message that explains *why*, not just *what*.

## A note on file paths

Anything referenced by a root-relative URL (`/favicon.png`, `/logo.png`) must
live in `public/`. Files in `src/assets/` are only reachable if something
`import`s them — otherwise they're never bundled and the URL silently falls
through to the SPA rewrite, returning HTML instead of an image.

## Contributor License Agreement

By opening a pull request against this repository, you agree that:

1. You wrote the contribution yourself, or otherwise have the right to submit
   it under the terms below.
2. You grant Paro Studio a perpetual, worldwide, irrevocable, royalty-free
   license to use, reproduce, modify, sublicense, and distribute your
   contribution as part of this project, including under a different license
   should the project be relicensed in future.
3. You retain copyright to your contribution. This grant is non-exclusive —
   you are free to do whatever else you like with your own work.

This keeps the project's licensing clean and means we're never in a position
where we have to track down past contributors to make a change. If you're not
able to agree to this, please say so in the PR and we'll work something out.

## Licensing and branding

Code in this repository is licensed under [AGPL-3.0](LICENSE). Note that the
Paro Studio **name and logo are not covered by that license** — see [NOTICE](NOTICE).
If you fork the project and deploy it publicly, you must rebrand it and publish
your source.

## Reporting security issues

Please don't open a public issue for a security problem. See
[SECURITY.md](SECURITY.md).
