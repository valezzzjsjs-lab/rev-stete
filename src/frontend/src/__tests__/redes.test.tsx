import { makeFakeActor, renderApp } from "@/__tests__/test-utils";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useActorMock = vi.fn();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: (...args: unknown[]) => useActorMock(...args),
}));

describe("RedesPage", () => {
  beforeEach(() => {
    useActorMock.mockReset();
    useActorMock.mockReturnValue({ actor: makeFakeActor(), isFetching: false });
  });

  it("shows clickable Instagram, TikTok and Facebook links", async () => {
    renderApp("/redes");

    // Both the page cards and the footer icons carry the same `data-ocid`, so
    // pick the card variant (the one that renders the visible handle text).
    const cardLink = (ocid: string) =>
      screen
        .getAllByTestId(ocid)
        .find(
          (el) =>
            el.textContent?.includes("@revistete") ||
            el.textContent?.includes("ReVístete"),
        )!;

    const instagram = await screen.findByText("Instagram");
    const tiktok = cardLink("social.link.tiktok");
    const facebook = cardLink("social.link.facebook");

    expect(instagram.closest("a")).toHaveAttribute(
      "href",
      "https://www.instagram.com/",
    );
    expect(tiktok).toHaveAttribute("href", "https://www.tiktok.com/");
    expect(facebook).toHaveAttribute("href", "https://www.facebook.com/");
    for (const link of [instagram.closest("a"), tiktok, facebook]) {
      expect(link).toHaveAttribute("target", "_blank");
    }
  });
});
