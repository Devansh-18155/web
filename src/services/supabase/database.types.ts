/**
 * Supabase Database Types
 * 
 * This file contains TypeScript types for your Supabase database schema.
 * 
 * To generate these types automatically:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Run: supabase gen types typescript --project-id YOUR_PROJECT_ID > src/services/supabase/database.types.ts
 * 
 * For now, we export a placeholder type that will be replaced during migration.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * NOTE: This is still a placeholder — no table shapes are declared, so
 * `supabase.from(...)` queries are untyped and every result widens to `any`.
 * Run the `supabase gen types` command above against the real project to
 * replace it; that is what makes the service layer type-safe end to end.
 */
export interface Database {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
