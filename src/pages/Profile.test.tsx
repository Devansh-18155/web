import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Profile from "./Profile";
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

const mockProfile = {
  id: "user-1",
  username: "creator_jane",
  full_name: "Jane Doe",
  avatar_url: "https://example.test/avatar.png",
  cover_url: "https://example.test/cover.png",
  bio: "Prompt engineer & creator",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  verified: true,
  website: null,
};

const mockPrompts = [
  {
    id: "prompt-1",
    user_id: "user-1",
    title: "Futuristic Cyberpunk City",
    prompt: "Cyberpunk cityscape neon lights 8k",
    image_url: "https://example.test/cyberpunk.png",
    ai_tool: "Midjourney",
    tags: ["cyberpunk", "city"],
    created_at: "2026-01-02T00:00:00.000Z",
    updated_at: "2026-01-02T00:00:00.000Z",
    view_count: 42,
    copy_count: 7,
  },
];

function createQueryBuilder(table: string) {
  const builder = {
    select: () => builder,
    eq: () => builder,
    in: () => builder,
    match: () => builder,
    order: () => builder,
    limit: () => builder,
    single: async () => ({
      data: table === "profiles" ? mockProfile : mockPrompts[0],
      error: null,
    }),
    maybeSingle: async () => ({ data: null, error: null }),
    then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
      Promise.resolve(
        table === "prompts"
          ? { data: mockPrompts, error: null }
          : table === "profiles"
          ? { data: [mockProfile], error: null }
          : { data: [], count: 0, error: null },
      ).then(resolve, reject),
  };

  return builder;
}

function renderProfile() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/profile/user-1"]}>
        <Routes>
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Profile Page", () => {
  beforeEach(() => {
    vi.mocked(supabase.from).mockImplementation((table) => createQueryBuilder(table));
    vi.mocked(supabase.rpc).mockResolvedValue({ data: null, error: null });
  });

  it("renders prompt cards with the correct image URL instead of broken images", async () => {
    renderProfile();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(await screen.findByText("Futuristic Cyberpunk City")).toBeInTheDocument();

    const promptImage = await screen.findByAltText("Futuristic Cyberpunk City");
    expect(promptImage).toBeInTheDocument();
    expect(promptImage).toHaveAttribute("src", "https://example.test/cyberpunk.png");
  });
});
