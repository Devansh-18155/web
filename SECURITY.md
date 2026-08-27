# Security Policy

## Reporting a vulnerability

**Please do not open a public issue for a security problem.** A public issue
tells everyone about the hole before there's a fix.

Report it privately using [GitHub Security Advisories][advisory]. Use the
"Report a vulnerability" button on the Security tab. That opens a private
thread visible only to the maintainers.

[advisory]: https://github.com/aashu2006/PARO-STUDIO/security/advisories/new

Please include:

- What the issue is and roughly how severe you think it is
- Steps to reproduce, or a proof of concept
- Which version or commit you tested against

You can expect an initial response within a few days. Please give us a
reasonable chance to ship a fix before disclosing publicly. We're happy to
credit you in the advisory unless you'd rather stay anonymous.

## Scope

In scope:

- The application code in this repository
- Authentication and session handling
- Row Level Security policy gaps that expose data across users
- Anything allowing a user to read or modify another user's data

Out of scope:

- The `VITE_SUPABASE_ANON_KEY` being visible in the client bundle. **This is
  by design.** The anon key is a public identifier, not a secret. It ships in
  the JavaScript of every Supabase frontend app. Access control is enforced by
  Row Level Security policies in the database, not by hiding the key.
  A report that amounts to "the anon key is exposed" is not a vulnerability.
  A report that a specific table or bucket is *readable or writable when it
  shouldn't be* absolutely is. That is an RLS gap, and we want to hear about it.
- Vulnerabilities in third-party dependencies with no demonstrated impact here.
  Report those upstream; we track them via Dependabot.
- Findings from automated scanners with no working proof of concept.
- Social engineering, physical attacks, and denial of service.

## Supported versions

This project deploys continuously from `main`. Only the currently deployed
version is supported. There are no maintained release branches.
