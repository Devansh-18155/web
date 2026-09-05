/**
 * Builds supabase/schema.sql from supabase/migrations/.
 *
 * schema.sql is what a contributor pastes into a fresh Supabase project. It has
 * to agree with the migrations that production actually runs, and keeping the
 * two in sync by hand is exactly how the schema drifted from production before.
 * So it is generated instead.
 *
 *   npm run db:schema         rewrite supabase/schema.sql
 *   npm run db:schema:check   fail if it is out of date (used by CI)
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const migrationsDir = join(root, 'supabase', 'migrations');
const schemaPath = join(root, 'supabase', 'schema.sql');

const rule = '-- ' + '-'.repeat(74);

const header = `-- PARO Studio database schema
--
-- GENERATED FILE. Do not edit this by hand, your changes will be overwritten.
-- Built from supabase/migrations/ by \`npm run db:schema\`.
--
-- To change the schema, add a migration instead:
--   supabase migration new <name>
--   ...write your SQL...
--   npm run db:schema
-- See CONTRIBUTING.md.
--
-- Run this once against a fresh Supabase project to get a working local setup.
-- Supabase dashboard -> SQL Editor -> paste -> Run.
--
-- This creates structure only. It contains no data of any kind.
`;

const footer = `${rule}
-- After running this
${rule}
--
-- 1. Authentication -> Providers: enable Email. Enable Google if you want to
--    test Google sign in, otherwise email and password is enough.
-- 2. Settings -> API: copy the Project URL and the anon key into .env.local.
-- 3. npm run dev, create an account, and you should land on /complete-profile.
--
-- To set yourself as verified so the badge shows up, run this in the SQL
-- Editor. It is the only way, the app cannot write that column:
--   update public.profiles set verified = true where username = 'your_username';
`;

const migrations = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

if (migrations.length === 0) {
  console.error('No migrations found in supabase/migrations/');
  process.exit(1);
}

const body = migrations
  .map((file) => {
    const sql = readFileSync(join(migrationsDir, file), 'utf8').trim();
    return `${rule}\n-- ${file}\n${rule}\n\n${sql}\n`;
  })
  .join('\n');

const built = `${header}\n${body}\n${footer}`;

if (process.argv.includes('--check')) {
  let current;
  try {
    current = readFileSync(schemaPath, 'utf8');
  } catch {
    current = null;
  }

  if (current !== built) {
    console.error(
      'supabase/schema.sql is out of date.\n\n' +
        'It is generated from supabase/migrations/. Run:\n\n' +
        '  npm run db:schema\n\n' +
        'and commit the result.'
    );
    process.exit(1);
  }

  console.log(`supabase/schema.sql is up to date (${migrations.length} migrations).`);
  process.exit(0);
}

writeFileSync(schemaPath, built);
console.log(`Wrote supabase/schema.sql from ${migrations.length} migrations:`);
for (const file of migrations) console.log(`  ${file}`);
