import { makeFakeActor, renderApp } from "@/__tests__/test-utils";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useActorMock = vi.fn();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: (...args: unknown[]) => useActorMock(...args),
}));

describe("Header navigation", () => {
  beforeEach(() => {
    useActorMock.mockReset();
    useActorMock.mockReturnValue({ actor: makeFakeActor(), isFetching: false });
  });

  it("renders the main navigation links", async () => {
    renderApp("/");

    const nav = await screen.findByRole("navigation", {
      name: "Navegación principal",
    });
    for (const label of [
      "Inicio",
      "Catálogo",
      "Dona tu ropa",
      "Intercambia",
      "Historias",
      "Impacto",
      "Redes sociales",
    ]) {
      expect(
        within(nav).getByRole("link", { name: label }),
      ).toBeInTheDocument();
    }
  });

  it("navigates to the catalog from the header", async () => {
    const user = userEvent.setup();
    const { router } = renderApp("/");

    const nav = await screen.findByRole("navigation", {
      name: "Navegación principal",
    });
    await user.click(within(nav).getByRole("link", { name: "Catálogo" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/catalogo");
    });
  });

  it("navigates to the impact section from the header", async () => {
    const user = userEvent.setup();
    const { router } = renderApp("/");

    const nav = await screen.findByRole("navigation", {
      name: "Navegación principal",
    });
    await user.click(within(nav).getByRole("link", { name: "Impacto" }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/impacto");
    });
  });
});
