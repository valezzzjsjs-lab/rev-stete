import {
  makeFakeActor,
  makeGarment,
  modality,
  renderApp,
} from "@/__tests__/test-utils";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useActorMock = vi.fn();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: (...args: unknown[]) => useActorMock(...args),
}));

describe("CatalogoPage", () => {
  beforeEach(() => {
    useActorMock.mockReset();
  });

  it("renders garments with type, size, condition, description and modality", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({
        listGarments: async () => [
          makeGarment({
            id: 7n,
            garmentType: "Chaquetas y abrigos",
            size: "L",
            description: "Abrigo de lana azul",
            modality: modality("intercambio"),
          }),
        ],
      }),
      isFetching: false,
    });

    renderApp("/catalogo");

    const card = await screen.findByRole("link", {
      name: /Chaquetas y abrigos/i,
    });
    expect(within(card).getByText("Abrigo de lana azul")).toBeInTheDocument();
    expect(within(card).getByText("Talla L")).toBeInTheDocument();
    expect(within(card).getByText("Buen estado")).toBeInTheDocument();
    expect(within(card).getByText("Intercambio")).toBeInTheDocument();
    expect(within(card).getByRole("img")).toHaveAttribute(
      "src",
      "https://example.test/prenda.jpg",
    );
  });

  it("shows the empty state when there are no garments", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ listGarments: async () => [] }),
      isFetching: false,
    });

    renderApp("/catalogo");

    expect(
      await screen.findByText("Todavía no hay prendas publicadas"),
    ).toBeInTheDocument();
  });

  it("writes the modality filter to the URL and passes it to the actor", async () => {
    const user = userEvent.setup();
    const listGarments = vi.fn(async () => [makeGarment()]);
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ listGarments }),
      isFetching: false,
    });

    const { router } = renderApp("/catalogo");
    await screen.findByRole("link", { name: /Camisetas/i });

    await user.click(screen.getByRole("combobox", { name: "Modalidad" }));
    await user.click(await screen.findByRole("option", { name: "Donación" }));

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({
        modalidad: "donacion",
      });
    });
    await waitFor(() => {
      expect(listGarments).toHaveBeenLastCalledWith(
        expect.objectContaining({
          modality: { __kind__: "donacion", donacion: null },
        }),
      );
    });
  });

  it("writes the size filter to the URL", async () => {
    const user = userEvent.setup();
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ listGarments: async () => [makeGarment()] }),
      isFetching: false,
    });

    const { router } = renderApp("/catalogo");
    await screen.findByRole("link", { name: /Camisetas/i });

    await user.click(screen.getByRole("combobox", { name: "Talla" }));
    await user.click(await screen.findByRole("option", { name: "XL" }));

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({ talla: "XL" });
    });
  });

  it("writes the condition filter to the URL", async () => {
    const user = userEvent.setup();
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ listGarments: async () => [makeGarment()] }),
      isFetching: false,
    });

    const { router } = renderApp("/catalogo");
    await screen.findByRole("link", { name: /Camisetas/i });

    await user.click(screen.getByRole("combobox", { name: "Estado" }));
    await user.click(await screen.findByRole("option", { name: "Nueva" }));

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({ estado: "nueva" });
    });
  });

  it("writes the garment type filter to the URL and passes it to the actor", async () => {
    const user = userEvent.setup();
    const listGarments = vi.fn(async () => [makeGarment()]);
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ listGarments }),
      isFetching: false,
    });

    const { router } = renderApp("/catalogo");
    await screen.findByRole("link", { name: /Camisetas/i });

    await user.click(screen.getByRole("combobox", { name: "Tipo de prenda" }));
    await user.click(await screen.findByRole("option", { name: "Vestidos" }));

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({ tipo: "Vestidos" });
    });
    await waitFor(() => {
      expect(listGarments).toHaveBeenLastCalledWith(
        expect.objectContaining({ garmentType: "Vestidos" }),
      );
    });
  });

  it("writes the text search to the URL and passes it to the actor", async () => {
    const user = userEvent.setup();
    const listGarments = vi.fn(async () => [makeGarment()]);
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ listGarments }),
      isFetching: false,
    });

    const { router } = renderApp("/catalogo");
    await screen.findByRole("link", { name: /Camisetas/i });

    await user.type(screen.getByLabelText("Buscar"), "abrigo");

    await waitFor(() => {
      expect(router.state.location.search).toMatchObject({ q: "abrigo" });
    });
    await waitFor(() => {
      expect(listGarments).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: "abrigo" }),
      );
    });
  });

  it("restores filters from the URL on load", async () => {
    const listGarments = vi.fn(async () => [makeGarment()]);
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ listGarments }),
      isFetching: false,
    });

    renderApp(
      "/catalogo?modalidad=venta&talla=S&estado=nueva&tipo=Vestidos&q=lino",
    );

    await waitFor(() => {
      expect(listGarments).toHaveBeenCalledWith(
        expect.objectContaining({
          modality: { __kind__: "venta", venta: 0n },
          size: "S",
          condition: "nueva",
          garmentType: "Vestidos",
          search: "lino",
        }),
      );
    });
  });

  it("clears all filters from the URL", async () => {
    const user = userEvent.setup();
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ listGarments: async () => [makeGarment()] }),
      isFetching: false,
    });

    const { router } = renderApp("/catalogo?modalidad=donacion&talla=M");
    await screen.findByRole("link", { name: /Camisetas/i });

    await user.click(screen.getByRole("button", { name: /Limpiar filtros/i }));

    await waitFor(() => {
      expect(router.state.location.search).toEqual({
        modalidad: undefined,
        talla: undefined,
        estado: undefined,
        tipo: undefined,
        q: undefined,
      });
    });
  });
});
