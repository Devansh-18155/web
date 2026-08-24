/**
 * Supabase Database Types
 *
 * Describes the `public` schema so `supabase.from(...)` and `supabase.rpc(...)`
 * return typed results instead of `any`.
 *
 * These were reconstructed from the live schema (column names, value types and
 * observed nullability) rather than generated, because the Supabase CLI was not
 * authenticated. They are accurate as of the current schema, but regenerate
 * them from the source of truth whenever you change the database:
 *
 *   npx supabase login
 *   npx supabase gen types typescript --project-id <your-project-id> \
 *     > src/services/supabase/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          cover_url: string | null
          bio: string | null
          website: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          cover_url?: string | null
          bio?: string | null
          website?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          cover_url?: string | null
          bio?: string | null
          website?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          id: string
          user_id: string
          title: string
          prompt: string
          image_url: string
          ai_tool: string
          tags: string[] | null
          view_count: number
          copy_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          prompt: string
          image_url: string
          ai_tool: string
          tags?: string[] | null
          view_count?: number
          copy_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          prompt?: string
          image_url?: string
          ai_tool?: string
          tags?: string[] | null
          view_count?: number
          copy_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      saves: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saves_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      increment_copy_count: {
        Args: { prompt_id: string }
        Returns: undefined
      }
      increment_view_count: {
        Args: { prompt_id: string }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
