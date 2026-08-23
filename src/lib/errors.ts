/**
 * Narrow an unknown thrown value to a human-readable message.
 *
 * `catch` bindings are `unknown` — anything can be thrown, not just `Error`.
 * This walks the common shapes (Error, string, Supabase's `{ message }`) and
 * falls back to a caller-supplied default.
 */
export function getErrorMessage(error: unknown, fallback = "Unknown error"): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;

  if (error && typeof error === "object" && "message" in error) {
    const { message } = error as { message?: unknown };
    if (typeof message === "string" && message) return message;
  }

  return fallback;
}
