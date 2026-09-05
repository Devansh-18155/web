import { describe, expect, it } from "vitest";
import { fitWithin } from "./imageResize";

// resizeImage itself needs canvas and createImageBitmap, neither of which
// jsdom provides. fitWithin holds all the arithmetic, so that is what is
// worth testing.
describe("fitWithin", () => {
  it("leaves an image smaller than the bounds alone", () => {
    expect(fitWithin(300, 200, 512, 512)).toEqual({ width: 300, height: 200 });
  });

  it("does not upscale an image that fits in one dimension only", () => {
    expect(fitWithin(600, 100, 512, 512)).toEqual({ width: 512, height: 85 });
  });

  it("scales a wide image to the width bound", () => {
    expect(fitWithin(4000, 2000, 1600, 1600)).toEqual({ width: 1600, height: 800 });
  });

  it("scales a tall image to the height bound", () => {
    expect(fitWithin(2000, 4000, 1600, 1600)).toEqual({ width: 800, height: 1600 });
  });

  it("keeps the aspect ratio on a square bound", () => {
    const { width, height } = fitWithin(3000, 2000, 512, 512);
    expect(width / height).toBeCloseTo(3000 / 2000, 2);
  });

  it("rounds rather than truncates", () => {
    // 1000x667 at scale 0.5 is 333.5 high. Flooring would drift the ratio.
    expect(fitWithin(1000, 667, 500, 500)).toEqual({ width: 500, height: 334 });
  });

  it("never returns a zero dimension for an extreme aspect ratio", () => {
    const { width, height } = fitWithin(10000, 3, 512, 512);
    expect(width).toBeGreaterThan(0);
    expect(height).toBeGreaterThan(0);
  });

  it("handles a degenerate size without dividing by zero", () => {
    expect(fitWithin(0, 0, 512, 512)).toEqual({ width: 0, height: 0 });
  });
});
