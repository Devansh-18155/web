import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import CommunityGuidelines from "./CommunityGuidelines";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    signOut: vi.fn(),
    loading: false,
  }),
}));

describe("CommunityGuidelines Page", () => {
  it("renders page header and main title", () => {
    render(
      <MemoryRouter>
        <CommunityGuidelines />
      </MemoryRouter>
    );

    expect(screen.getByText("Paro Community Guidelines")).toBeInTheDocument();
    expect(screen.getByText("Welcome to Paro! 👋")).toBeInTheDocument();
  });

  it("renders all 11 guidelines sections from array mapping", () => {
    render(
      <MemoryRouter>
        <CommunityGuidelines />
      </MemoryRouter>
    );

    const expectedTitles = [
      "1. Be Respectful",
      "2. Keep Content Safe & Appropriate",
      "3. Don't Spam",
      "4. Respect Privacy",
      "5. Share Original & Honest Content",
      "6. Use AI Responsibly",
      "7. Keep Discussions Constructive",
      "8. Don't Manipulate the Community",
      "9. Report Problems",
      "10. Enforcement",
      "11. Help Us Build Paro",
    ];

    expectedTitles.forEach((title) => {
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    });
  });

  it("renders section 11 with corrected typo space", () => {
    render(
      <MemoryRouter>
        <CommunityGuidelines />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Community guidelines aren't just about rules, they're about the kind of community we want to create."
      )
    ).toBeInTheDocument();
  });

  it("renders feedback link and discord link at the bottom", () => {
    render(
      <MemoryRouter>
        <CommunityGuidelines />
      </MemoryRouter>
    );

    const feedbackLink = screen.getByRole("link", { name: /send feedback/i });
    expect(feedbackLink).toBeInTheDocument();
    expect(feedbackLink).toHaveAttribute("href", "/feedback");

    const discordLink = screen.getByRole("link", { name: /join discord/i });
    expect(discordLink).toBeInTheDocument();
    expect(discordLink).toHaveAttribute("href", "https://discord.com/invite/zNZ3TAwy73");
  });
});
