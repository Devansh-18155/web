import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { submitFeedback } from "./feedback";
import { supabase } from "./client";

vi.mock("./client", () => ({
  supabase: { from: vi.fn() },
}));

function mockInsert(result: { error: unknown }) {
  const insert = vi.fn().mockResolvedValue(result);
  vi.mocked(supabase.from).mockReturnValue({ insert } as never);
  return insert;
}

describe("submitFeedback", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("inserts into the feedback table", async () => {
    const insert = mockInsert({ error: null });

    await submitFeedback({
      user_id: "user-1",
      subject: "Great site",
      message: "Really enjoying the prompt gallery.",
    });

    expect(supabase.from).toHaveBeenCalledWith("feedback");
    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      subject: "Great site",
      message: "Really enjoying the prompt gallery.",
    });
  });

  it("returns no error on success", async () => {
    mockInsert({ error: null });

    const { error } = await submitFeedback({
      user_id: "user-1",
      subject: "Subject",
      message: "A long enough message.",
    });

    expect(error).toBeNull();
  });

  it("returns the error when the insert fails", async () => {
    // This is the case that matters. The old form always claimed success, so
    // a failed submission still told the user their feedback was sent.
    const failure = { message: "new row violates row-level security policy" };
    mockInsert({ error: failure });

    const { error } = await submitFeedback({
      user_id: "user-1",
      subject: "Subject",
      message: "A long enough message.",
    });

    expect(error).toBe(failure);
  });

  it("trims whitespace off both fields", async () => {
    const insert = mockInsert({ error: null });

    await submitFeedback({
      user_id: "user-1",
      subject: "   Padded subject   ",
      message: "\n  Padded message.  \n",
    });

    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      subject: "Padded subject",
      message: "Padded message.",
    });
  });
});
