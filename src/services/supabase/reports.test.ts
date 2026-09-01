import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { submitReport } from "./reports";
import { supabase } from "./client";

vi.mock("./client", () => ({
  supabase: { from: vi.fn() },
}));

function mockInsert(result: { error: unknown }) {
  const insert = vi.fn().mockResolvedValue(result);
  vi.mocked(supabase.from).mockReturnValue({ insert } as never);
  return insert;
}

describe("submitReport", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("inserts into the prompt_reports table with correct payload", async () => {
    const insert = mockInsert({ error: null });

    await submitReport({
      user_id: "user-1",
      prompt_id: "prompt-100",
      reason: "spam",
      details: "  This is a duplicate prompt.  ",
    });

    expect(supabase.from).toHaveBeenCalledWith("prompt_reports");
    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      prompt_id: "prompt-100",
      reason: "spam",
      details: "This is a duplicate prompt.",
    });
  });

  it("sets details to null when omitted or empty", async () => {
    const insert = mockInsert({ error: null });

    await submitReport({
      user_id: "user-1",
      prompt_id: "prompt-100",
      reason: "inappropriate",
    });

    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      prompt_id: "prompt-100",
      reason: "inappropriate",
      details: null,
    });
  });

  it("returns no error on success", async () => {
    mockInsert({ error: null });

    const { error } = await submitReport({
      user_id: "user-1",
      prompt_id: "prompt-100",
      reason: "misleading",
    });

    expect(error).toBeNull();
  });

  it("handles duplicate reports by returning unique constraint violation error (code 23505)", async () => {
    const uniqueError = {
      code: "23505",
      message: 'duplicate key value violates unique constraint "prompt_reports_user_id_prompt_id_key"',
      details: "Key (user_id, prompt_id)=(user-1, prompt-100) already exists.",
      hint: "",
    };
    mockInsert({ error: uniqueError });

    const { error } = await submitReport({
      user_id: "user-1",
      prompt_id: "prompt-100",
      reason: "spam",
    });

    expect(error).toEqual(uniqueError);
    expect(error?.code).toBe("23505");
  });

  it("returns the error when insert fails with a database error", async () => {
    const failure = {
      code: "42501",
      message: "new row violates row-level security policy for table prompt_reports",
    };
    mockInsert({ error: failure });

    const { error } = await submitReport({
      user_id: "user-1",
      prompt_id: "prompt-100",
      reason: "copyright",
    });

    expect(error).toEqual(failure);
  });
});
