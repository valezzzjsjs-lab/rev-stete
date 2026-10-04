import { makeFakeActor, makeImpact, renderApp } from "@/__tests__/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useActorMock = vi.fn();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: (...args: unknown[]) => useActorMock(...args),
}));

describe("ImpactoPage", () => {
  beforeEach(() => {
    useActorMock.mockReset();
  });

  it("shows reused garments, donations and people benefited", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({
        getImpactMetrics: async () =>
          makeImpact({
            garmentsReused: 120n,
            donationsMade: 45n,
            peopleBenefited: 80n,
          }),
      }),
      isFetching: false,
    });

    renderApp("/impacto");

    await waitFor(() => {
      expect(screen.getByText("120")).toBeInTheDocument();
    });
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("Prendas reutilizadas")).toBeInTheDocument();
    expect(screen.getByText("Donaciones realizadas")).toBeInTheDocument();
    expect(screen.getByText("Personas beneficiadas")).toBeInTheDocument();
  });

  it("shows a retry state when the metrics fail to load", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({
        getImpactMetrics: async () => {
          throw new Error("network down");
        },
      }),
      isFetching: false,
    });

    renderApp("/impacto");

    expect(
      await screen.findByText("No pudimos cargar las métricas"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Reintentar/i }),
    ).toBeInTheDocument();
  });
});
