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
      className={cn("h-4 w-4 shrink-0 text-gold", className)}
    />
  );
}
