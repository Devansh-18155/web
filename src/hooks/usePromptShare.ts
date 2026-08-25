import { useToast } from "@/hooks/use-toast";

/**
 * Sharing behaviour for a prompt, shared by the feed cards and the detail page.
 *
 * `sharePrompt` opens the native share sheet where one exists (mobile, some
 * desktop browsers) and falls back to copying the link everywhere else.
 */
/**
 * The origin shared links are built from.
 *
 * Falls back to wherever the app is running, but in development that produces
 * `http://localhost:8080/...` — a link no recipient can open, and one that
 * Facebook, LinkedIn and Pinterest refuse outright because they cannot fetch
 * it. Set VITE_SITE_URL to the deployed origin to share real links from a dev
 * server.
 */
const SITE_ORIGIN =
  import.meta.env.VITE_SITE_URL?.replace(/\/+$/, "") || window.location.origin;

export function usePromptShare() {
  const { toast } = useToast();

  const promptUrl = (id: string) => `${SITE_ORIGIN}/prompt/${id}`;

  const copyPromptLink = async (id: string) => {
    const url = promptUrl(id);

    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied" });
      return true;
    } catch (error) {
      // Clipboard is blocked on insecure origins and when permission is denied -
      // show the link so it can still be copied by hand.
      console.error("Copy link error:", error);
      toast({
        title: "Couldn't copy link",
        description: url,
        variant: "destructive",
      });
      return false;
    }
  };

  const sharePrompt = async (id: string, title: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `${title} — a prompt on Paro Studio`,
          url: promptUrl(id),
        });
        return;
      } catch (error) {
        // Dismissing the share sheet isn't a failure worth reporting.
        if (error instanceof Error && error.name === "AbortError") return;
        console.error("Share error:", error);
      }
    }

    await copyPromptLink(id);
  };

  return { promptUrl, copyPromptLink, sharePrompt };
}
