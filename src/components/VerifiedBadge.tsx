import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  className?: string;
}

/**
 * Shown next to a creator's name when profiles.verified is true.
 *
 * Not self-serve: UPDATE on profiles.verified is revoked from authenticated
 * and anon, so the flag can only be set from the dashboard.
 */
export function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <BadgeCheck
      aria-label="Verified account"
      // Instagram-style: solid blue seal, check and outline knocked out in
      // white. text-white sets currentColor, which is what lucide strokes with.
      className={cn(
        "h-4 w-4 shrink-0 fill-[#0095F6] text-white",
        className,
      )}
    />
  );
}
