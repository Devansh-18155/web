import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PromptDetail from "./PromptDetail";
import { supabase } from "@/services/supabase/client";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, profile: null, loading: false }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/services/supabase/client", () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

const prompt = {
  id: "prompt-1",
  user_id: "user-1",
  title: "Test prompt",
  prompt: "A test prompt",
  image_url: "https://example.test/prompt.png",
  ai_tool: "Test tool",
  tags: [],
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  view_count: 0,
  copy_count: 0,
};

const profile = {
  id: "user-1",
  username: "official",
  full_name: "PARO",
  avatar_url: null,
  cover_url: null,
  bio: null,
  created_at: null,
  updated_at: null,
  verified: true,
  website: null,
};

let activeProfile = profile;

function createQueryBuilder(table: string) {
  const builder = {
    select: () => builder,
    eq: () => builder,
    match: () => builder,
    order: () => builder,
    limit: () => builder,
    single: async () => ({
      data: table === "prompts" ? prompt : activeProfile,
      error: null,
    }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
      Promise.resolve(
        table === "likes"
          ? { count: 0, error: null }
          : { data: [], error: null },
      ).then(resolve, reject),
  };

  return builder;
}

function renderPromptDetail() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/prompt/prompt-1"]}>
        <Routes>
          <Route path="/prompt/:id" element={<PromptDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("PromptDetail", () => {
  beforeEach(() => {
    activeProfile = profile;
    vi.mocked(supabase.from).mockImplementation((table) => createQueryBuilder(table));
    vi.mocked(supabase.rpc).mockResolvedValue({ data: null, error: null });
  });

  it("shows the verified badge for a verified creator", async () => {
    renderPromptDetail();

    expect(await screen.findByLabelText("Verified account")).toBeInTheDocument();
  });

  it("does not show the badge for an unverified creator", async () => {
    activeProfile = { ...profile, verified: false };
    renderPromptDetail();

    await screen.findByText("Test prompt");
    expect(screen.queryByLabelText("Verified account")).not.toBeInTheDocument();
  });
});
