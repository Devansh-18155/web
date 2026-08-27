import { describe, it, expect } from "vitest";
import { AI_TOOLS, OTHER_AI_TOOLS, FEATURED_AI_TOOL } from "./aiTools";

describe("aiTools", () => {
  it("pins the exact strings written to prompts.ai_tool", () => {
    // These values live in the database. Renaming one here orphans every
    // existing row holding the old spelling — the prompt falls through to
    // "Other" and its tool name lands in the custom-tool field instead.
    // That regression already happened once; this locks it down.
    //
    // If you are changing this list, you also need a migration.
    expect(AI_TOOLS).toEqual([
      "NANO BANANA (Gemini)",
      "DALL-E 3 (ChatGPT)",
      "Meta AI",
      "Midjourney",
      "Stable Diffusion",
      "Leonardo AI",
      "Firefly",
      "Other",
    ]);
  });

  it("features a tool that is actually in the list", () => {
    expect(AI_TOOLS).toContain(FEATURED_AI_TOOL);
  });

  it("excludes exactly the featured tool from OTHER_AI_TOOLS", () => {
    expect(OTHER_AI_TOOLS).not.toContain(FEATURED_AI_TOOL);
    expect(OTHER_AI_TOOLS).toHaveLength(AI_TOOLS.length - 1);
  });

  it("loses nothing when the two lists are recombined", () => {
    // Guards against a picker silently dropping an option.
    expect([FEATURED_AI_TOOL, ...OTHER_AI_TOOLS].sort()).toEqual(
      [...AI_TOOLS].sort(),
    );
  });

  it("has no duplicates", () => {
    // A duplicate renders twice in the picker and breaks React keys.
    expect(new Set(AI_TOOLS).size).toBe(AI_TOOLS.length);
  });

  it("keeps 'Other' last, since it is the custom-tool escape hatch", () => {
    expect(AI_TOOLS[AI_TOOLS.length - 1]).toBe("Other");
  });

  it("has no entries with stray whitespace", () => {
    // A trailing space would be invisible in the UI but a distinct value in
    // the database, splitting one tool into two.
    for (const tool of AI_TOOLS) {
      expect(tool).toBe(tool.trim());
      expect(tool).not.toBe("");
    }
  });
});
