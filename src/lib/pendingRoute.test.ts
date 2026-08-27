import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  setPendingRoute,
  peekPendingRoute,
  clearPendingRoute,
} from "./pendingRoute";

describe("pendingRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("round-trips a route", () => {
    setPendingRoute("/prompt/abc123");
    expect(peekPendingRoute()).toBe("/prompt/abc123");
  });

  it("peek does not consume the route", () => {
    // Sign-in reads this more than once; peeking must not be destructive.
    setPendingRoute("/prompt/abc123");
    expect(peekPendingRoute()).toBe("/prompt/abc123");
    expect(peekPendingRoute()).toBe("/prompt/abc123");
  });

  it("returns null when nothing is stored", () => {
    expect(peekPendingRoute()).toBeNull();
  });

  it("clears a stored route", () => {
    setPendingRoute("/settings");
    clearPendingRoute();
    expect(peekPendingRoute()).toBeNull();
  });

  it("refuses to park the feed itself", () => {
    // Storing "/" would bounce the user back to where they already are.
    setPendingRoute("/");
    expect(peekPendingRoute()).toBeNull();
  });

  it("overwrites a previously stored route", () => {
    setPendingRoute("/first");
    setPendingRoute("/second");
    expect(peekPendingRoute()).toBe("/second");
  });

  it("survives storage being unavailable", () => {
    // Private browsing can refuse sessionStorage. Resuming a route is a
    // nicety — it must never take the app down with it.
    // jsdom's sessionStorage does not dispatch through Storage.prototype, so
    // spying there has no effect — replace the global outright.
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
      removeItem: () => {
        throw new Error("SecurityError");
      },
    });

    expect(() => setPendingRoute("/prompt/abc123")).not.toThrow();
    expect(peekPendingRoute()).toBeNull();
    expect(() => clearPendingRoute()).not.toThrow();
  });
});
