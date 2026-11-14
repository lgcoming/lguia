import type {} from "@testing-library/jest-dom/vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";
import { afterEach, expect, vi } from "vitest";

// Registered explicitly: the side-effect entry ("jest-dom/vitest") can extend a different copy
// of `expect` depending on how the runtime resolves the package.
expect.extend(matchers);

// Animations finish instantly so tests assert on end states, not timing.
MotionGlobalConfig.skipAnimations = true;

// jsdom has no matchMedia; Motion reads prefers-reduced-motion through it.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
