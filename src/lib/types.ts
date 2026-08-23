/**
 * Shared TypeScript types for the application
 */

/**
 * User profile type compatible with Supabase profiles table
 */
export interface UserProfile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  bio: string | null;
}

/**
 * A raw `prompts` row as it comes back from a Supabase nested select
 * (e.g. `likes -> prompts (...)`). Still snake_case, straight from the table.
 */
export interface PromptJoinRow {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  image_url: string;
  ai_tool: string;
  tags: string[] | null;
  created_at: string;
}

/**
 * A prompt row after the Supabase services normalize it out of the raw
 * snake_case table columns. Returned by `getUserLikes` and `getUserSaves`.
 */
export interface NormalizedPrompt {
  id: string;
  userId: string;
  title: string;
  promptText: string;
  imageUrl: string;
  toolUsed: string;
  tags: string[];
  createdAt: string;
}
