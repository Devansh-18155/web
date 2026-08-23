
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

export interface PromptWithDetails {
  id: string;
  title: string;
  promptText: string;
  imageUrl: string;
  toolUsed: string;
  viewCount: number;
  copyCount: number;
  createdAt: string;
  tags: string[];
  creator: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  likeCount: number;
  isLiked: boolean;
  isSaved: boolean;
}

export function usePrompts(options?: {
  selectedTags?: string[];
  searchQuery?: string;
  sortBy?: "trending" | "newest" | "most_copied";
  limit?: number;
}) {
  const { user, loading } = useAuth();
  const { selectedTags = [], searchQuery = "", sortBy = "trending", limit = 50 } = options || {};

  return useQuery({
    // Stable key - only includes search params, not auth state
    queryKey: ["prompts", selectedTags, searchQuery, sortBy, limit],
    queryFn: async () => {
      // Get all prompts from Supabase
      const { getAllPrompts } = await import('@/services/supabase/prompts');
      const { prompts: allPrompts, error } = await getAllPrompts(limit * 2); // Get more for filtering
      
      if (error) {
        console.error('Error fetching prompts:', error);
        return [];
      }

      // Filter by Search Query
      let filtered = allPrompts;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(query) ||
          p.prompt.toLowerCase().includes(query) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
        );
      }

      // Filter by Tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter(p =>
          p.tags && selectedTags.some(tag => p.tags!.includes(tag))
        );
      }

      // Sort
      filtered.sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        } else if (sortBy === "most_copied") {
          return (b.copy_count || 0) - (a.copy_count || 0);
        } else {
          // Trending: View count for now
          return (b.view_count || 0) - (a.view_count || 0);
        }
      });

      // Limit
      filtered = filtered.slice(0, limit);

      // Enrich in bulk. Doing this per prompt meant 4 extra round trips each —
      // 200+ requests for a 50-prompt feed. These four run once, in parallel,
      // regardless of how many prompts came back.
      const { getProfilesByIds } = await import('@/services/supabase/profiles');
      const { getLikeCounts, getLikedPromptIds } = await import('@/services/supabase/likes');
      const { getSavedPromptIds } = await import('@/services/supabase/saves');

      const promptIds = filtered.map(p => p.id);
      const creatorIds = filtered.map(p => p.user_id);

      const [profiles, likeCounts, likedIds, savedIds] = await Promise.all([
        getProfilesByIds(creatorIds),
        getLikeCounts(promptIds),
        user ? getLikedPromptIds(user.id, promptIds) : Promise.resolve(new Set<string>()),
        user ? getSavedPromptIds(user.id, promptIds) : Promise.resolve(new Set<string>()),
      ]);

      const enrichedPrompts: PromptWithDetails[] = filtered.map((p) => {
        const profile = profiles.get(p.user_id) ?? null;

        return {
          id: p.id,
          title: p.title,
          promptText: p.prompt,
          imageUrl: p.image_url,
          toolUsed: p.ai_tool,
          viewCount: p.view_count || 0,
          copyCount: p.copy_count || 0,
          createdAt: p.created_at || new Date().toISOString(),
          tags: p.tags || [],
          creator: profile ? {
            id: profile.id,
            username: profile.username || 'unknown',
            displayName: profile.full_name || profile.username || 'Unknown',
            avatarUrl: profile.avatar_url
          } : {
            id: p.user_id,
            username: 'unknown',
            displayName: 'Unknown User',
            avatarUrl: null
          },
          likeCount: likeCounts.get(p.id) ?? 0,
          isLiked: likedIds.has(p.id),
          isSaved: savedIds.has(p.id)
        };
      });

      return enrichedPrompts;
    },
    // Wait for auth to stabilize before running query
    enabled: !loading,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      // Get all prompts and extract unique tags
      const { getAllPrompts } = await import('@/services/supabase/prompts');
      const { prompts, error } = await getAllPrompts(100);
      
      if (error || !prompts) return [];
      
      const tagsSet = new Set<string>();
      prompts.forEach(p => {
        p.tags?.forEach(tag => tagsSet.add(tag));
      });
      
      return Array.from(tagsSet).sort();
    },
  });
}

export function useTopCreators(limit = 6) {
  return useQuery({
    queryKey: ["top-creators", limit],
    queryFn: async () => {
      const { getAllPrompts } = await import('@/services/supabase/prompts');
      const { getProfilesByIds } = await import('@/services/supabase/profiles');
      const { getFollowerCounts } = await import('@/services/supabase/follows');
      const { prompts, error } = await getAllPrompts(200); // Get more prompts to find top creators

      if (error || !prompts) {
        console.error('Error fetching prompts for top creators:', error);
        return [];
      }

      const creatorIds = Array.from(new Set(prompts.map(p => p.user_id)));

      // Two queries total, rather than two per creator.
      const [profiles, followerCounts] = await Promise.all([
        getProfilesByIds(creatorIds),
        getFollowerCounts(creatorIds),
      ]);

      const promptCounts = new Map<string, number>();
      for (const p of prompts) {
        promptCounts.set(p.user_id, (promptCounts.get(p.user_id) ?? 0) + 1);
      }

      return creatorIds
        .map((id) => {
          const profile = profiles.get(id);
          if (!profile) return null;

          return {
            id: profile.id,
            username: profile.username || 'unknown',
            displayName: profile.full_name || profile.username || 'Unknown',
            avatarUrl: profile.avatar_url,
            promptCount: promptCounts.get(id) ?? 0,
            followerCount: followerCounts.get(id) ?? 0,
          };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null)
        .sort((a, b) => b.followerCount - a.followerCount || b.promptCount - a.promptCount)
        .slice(0, limit);
    },
  });
}

