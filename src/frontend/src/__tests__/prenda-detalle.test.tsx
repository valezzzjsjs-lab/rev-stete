import {
  makeFakeActor,
  makeGarment,
  modality,
  renderApp,
} from "@/__tests__/test-utils";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useActorMock = vi.fn();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: (...args: unknown[]) => useActorMock(...args),
}));

describe("PrendaDetallePage", () => {
  beforeEach(() => {
    useActorMock.mockReset();
  });

  it("shows the full garment information and a contact button", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({
        getGarment: async () =>
          makeGarment({
            id: 5n,
            garmentType: "Vestidos",
            size: "S",
            description: "Vestido de lino rosa",
            modality: modality("venta", 1500n),
          }),
      }),
      isFetching: false,
    });

    renderApp("/prenda/5");

    expect(
      await screen.findByRole("heading", { level: 1, name: "Vestidos" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Vestido de lino rosa")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();
    expect(screen.getByText("Buen estado")).toBeInTheDocument();
    expect(screen.getByText("15,00 €")).toBeInTheDocument();

    const contact = screen.getByRole("link", {
      name: /Solicitar esta prenda/i,
    });
    expect(contact).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:hola@revistete.org"),
    );
  });

  it("shows a not-found state for an unknown garment", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ getGarment: async () => null }),
      isFetching: false,
    });

    renderApp("/prenda/999");

    expect(
      await screen.findByText("No encontramos esta prenda"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Volver al catálogo/i }),
    ).toBeInTheDocument();
  });

  it("does not query the backend for a non-numeric id", async () => {
    const getGarment = vi.fn(async () => null);
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ getGarment }),
      isFetching: false,
    });

    renderApp("/prenda/abc");

    await waitFor(() => {
      expect(
        screen.getByText("No encontramos esta prenda"),
      ).toBeInTheDocument();
    });
    expect(getGarment).not.toHaveBeenCalled();
  });
});
