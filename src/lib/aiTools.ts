/**
 * The AI tool names stored in prompts.ai_tool.
 *
 * Single source of truth on purpose. Upload and the edit modal used to keep
 * separate lists, and they disagreed: upload saved "NANO BANANA" while the
 * edit modal only knew "NANO BANANA (Gemini)". Editing such a prompt fell
 * through to "Other" and dumped the tool name into the custom-tool field.
 *
 * Anything not in this list is treated as a custom tool, so the exact strings
 * here are what gets written to the database. Changing one orphans existing
 * rows that still hold the old spelling.
 */
export const FEATURED_AI_TOOL = "NANO BANANA (Gemini)";

export const AI_TOOLS = [
  FEATURED_AI_TOOL,
  "DALL-E 3 (ChatGPT)",
  "Meta AI",
  "Midjourney",
  "Stable Diffusion",
  "Leonardo AI",
  "Firefly",
  "Other",
];

/** The list minus the featured tool, which both pickers render separately. */
export const OTHER_AI_TOOLS = AI_TOOLS.filter((tool) => tool !== FEATURED_AI_TOOL);
