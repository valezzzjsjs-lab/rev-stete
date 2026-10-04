import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

// Generated components expose `data-ocid` hooks; use them only when no
// semantic selector exists.
configure({ testIdAttribute: "data-ocid" });

// `main.tsx` installs this at runtime so React Query can hash query keys that
// contain the backend's `bigint` fields (e.g. a `venta` modality price).
// Tests render pages without `main.tsx`, so mirror it here.
BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// jsdom does not implement the Pointer Capture API that Radix UI's Select
// relies on when opening its listbox.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false;
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = () => undefined;
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = () => undefined;
}

// Radix Select scrolls the highlighted option into view when its listbox opens.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => undefined;
}

// `globals: false` means Testing Library's automatic cleanup is not registered,
// so each test would otherwise render into the previous test's DOM.
afterEach(() => {
  cleanup();
});
