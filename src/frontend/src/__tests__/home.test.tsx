import { makeFakeActor, makeImpact, renderApp } from "@/__tests__/test-utils";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useActorMock = vi.fn();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: (...args: unknown[]) => useActorMock(...args),
}));

describe("HomePage", () => {
  beforeEach(() => {
    useActorMock.mockReset();
    useActorMock.mockReturnValue({ actor: makeFakeActor(), isFetching: false });
  });

  it("renders the hero with the name, slogan and reuse image", async () => {
    renderApp("/");

    const hero = await screen.findByTestId("home.hero_section");
    expect(
      within(hero).getByRole("heading", { level: 1, name: "ReVístete" }),
    ).toBeInTheDocument();
    expect(
      within(hero).getByText(/Dale una segunda oportunidad a tu ropa\./),
    ).toBeInTheDocument();
    expect(
      within(hero).getByAltText(/Prendas de ropa dobladas en tonos rosados/i),
    ).toBeInTheDocument();
  });

  it("shows the three-step explanation of the project", async () => {
    renderApp("/");

    expect(
      await screen.findByRole("heading", {
        name: "Tres pasos para dar una segunda vida",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Publica" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Conecta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Da una segunda oportunidad" }),
    ).toBeInTheDocument();
  });

  it("shows the impact metrics from the backend", async () => {
    useActorMock.mockReturnValue({
      actor: makeFakeActor({
        getImpactMetrics: async () => makeImpact(),
      }),
      isFetching: false,
    });

    renderApp("/");

    await waitFor(() => {
      expect(screen.getByText("42")).toBeInTheDocument();
    });
    expect(screen.getByText("17")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Prendas reutilizadas")).toBeInTheDocument();
    expect(screen.getByText("Donaciones realizadas")).toBeInTheDocument();
    expect(screen.getByText("Personas beneficiadas")).toBeInTheDocument();
  });

  it("navigates to the donation section from the hero button", async () => {
    const user = userEvent.setup();
    const { router } = renderApp("/");

    await user.click(await screen.findByTestId("home.donar_button"));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/donar");
    });
    expect(
      await screen.findByRole("heading", { name: "Dona tu ropa" }),
    ).toBeInTheDocument();
  });

  it("navigates to the catalog from the hero button", async () => {
    const user = userEvent.setup();
    const { router } = renderApp("/");

    await user.click(await screen.findByTestId("home.catalogo_button"));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/catalogo");
    });
  });

  it("navigates to the exchange section from the hero button", async () => {
    const user = userEvent.setup();
    const { router } = renderApp("/");

    await user.click(await screen.findByTestId("home.intercambiar_button"));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/intercambiar");
    });
    expect(
      await screen.findByRole("heading", { name: "Intercambia tu ropa" }),
    ).toBeInTheDocument();
  });
});
