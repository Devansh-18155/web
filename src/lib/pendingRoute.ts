const STORAGE_KEY = "paro:pending-route";

/**
 * Where a signed-out visitor was headed before we bounced them to the feed.
 *
 * Router state alone isn't enough: Google sign-in leaves the app entirely and
 * returns to `/`, so anything held in memory or in `location.state` is gone by
 * the time they come back. sessionStorage survives that round trip.
 */
export function setPendingRoute(path: string) {
  try {
    // Never park the feed itself - that would bounce them right back here.
    if (path === "/") return;
    sessionStorage.setItem(STORAGE_KEY, path);
  } catch {
    // Private browsing can refuse storage; resuming is a nicety, not a must.
  }
}

export function peekPendingRoute(): string | null {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearPendingRoute() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored means nothing to clear.
  }
}
