import { makeFakeActor, makeStory, renderApp } from "@/__tests__/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useActorMock = vi.fn();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: (...args: unknown[]) => useActorMock(...args),
}));

describe("HistoriasPage", () => {
  beforeEach(() => {
    useActorMock.mockReset();
  });

  it("shows help cases with delivered garments and date, without personal data", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({
        listStories: async () => [
          makeStory({
            id: 3n,
            title: "Campaña de invierno",
            garmentsDelivered: 25n,
            deliveredAt: 1_700_000_000_000_000_000n,
          }),
        ],
      }),
      isFetching: false,
    });

    renderApp("/historias");

    expect(
      await screen.findByRole("heading", { name: "Campaña de invierno" }),
    ).toBeInTheDocument();
    expect(screen.getByText("25 prendas")).toBeInTheDocument();
    expect(screen.getByText(/14 de noviembre de 2023/)).toBeInTheDocument();
    expect(
      screen.getByText(/sin datos personales ni información/i),
    ).toBeInTheDocument();
  });

  it("shows the empty state when there are no stories", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ listStories: async () => [] }),
      isFetching: false,
    });

    renderApp("/historias");

    expect(
      await screen.findByText("Aún no hay historias publicadas"),
    ).toBeInTheDocument();
  });

  it("opens a story detail with delivered count and date", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({
        getStory: async () =>
          makeStory({
            id: 3n,
            title: "Campaña de invierno",
            garmentsDelivered: 25n,
          }),
      }),
      isFetching: false,
    });

    renderApp("/historias/3");

    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: "Campaña de invierno",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("25 prendas entregadas")).toBeInTheDocument();
    expect(
      screen.getByText(/no incluye datos personales, direcciones/i),
    ).toBeInTheDocument();
  });

  it("shows a not-found state for an unknown story", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ getStory: async () => null }),
      isFetching: false,
    });

    renderApp("/historias/999");

    await waitFor(() => {
      expect(
        screen.getByText("No encontramos esta historia"),
      ).toBeInTheDocument();
    });
  });
});
