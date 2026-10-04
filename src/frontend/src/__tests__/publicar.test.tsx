import { makeFakeActor, makeGarment, renderApp } from "@/__tests__/test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useActorMock = vi.fn();

vi.mock("@caffeineai/core-infrastructure", () => ({
  useActor: (...args: unknown[]) => useActorMock(...args),
}));

vi.mock("@/lib/backend", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/backend")>();
  return {
    ...actual,
    readFileAsDataUrl: async () => "data:image/png;base64,AAAA",
  };
});

function imageFile() {
  return new File(["fake-bytes"], "prenda.png", { type: "image/png" });
}

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("combobox", { name: "Tipo de prenda" }));
  await user.click(await screen.findByRole("option", { name: "Camisetas" }));

  await user.click(screen.getByRole("combobox", { name: "Talla" }));
  await user.click(await screen.findByRole("option", { name: "M" }));

  await user.type(
    screen.getByLabelText("Descripción"),
    "Camiseta rosa de algodón",
  );

  await user.upload(
    screen.getByLabelText("Fotografía de la prenda"),
    imageFile(),
  );
}

describe("GarmentForm", () => {
  beforeEach(() => {
    useActorMock.mockReset();
  });

  it("publishes a donation garment and shows it in the catalog", async () => {
    const user = userEvent.setup();
    const addGarment = vi.fn(async (input) =>
      makeGarment({ ...input, id: 42n }),
    );
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ addGarment }),
      isFetching: false,
    });

    renderApp("/donar");
    await screen.findByRole("heading", { name: "Dona tu ropa" });

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /Publicar prenda/i }));

    await waitFor(() => {
      expect(addGarment).toHaveBeenCalledTimes(1);
    });
    expect(addGarment).toHaveBeenCalledWith(
      expect.objectContaining({
        garmentType: "Camisetas",
        size: "M",
        description: "Camiseta rosa de algodón",
        modality: { __kind__: "donacion", donacion: null },
        photoUrl: "data:image/png;base64,AAAA",
      }),
    );
    expect(
      await screen.findByText("¡Gracias por dar una segunda oportunidad!"),
    ).toBeInTheDocument();
  });

  it("preselects the exchange modality on the Intercambia section", async () => {
    const user = userEvent.setup();
    const addGarment = vi.fn(async (input) =>
      makeGarment({ ...input, id: 43n }),
    );
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ addGarment }),
      isFetching: false,
    });

    renderApp("/intercambiar");
    await screen.findByRole("heading", { name: "Intercambia tu ropa" });

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /Publicar prenda/i }));

    await waitFor(() => {
      expect(addGarment).toHaveBeenCalledWith(
        expect.objectContaining({
          modality: { __kind__: "intercambio", intercambio: null },
        }),
      );
    });
  });

  it("blocks submission and shows an error when required fields are missing", async () => {
    const user = userEvent.setup();
    const addGarment = vi.fn();
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ addGarment }),
      isFetching: false,
    });

    renderApp("/donar");
    await screen.findByRole("heading", { name: "Dona tu ropa" });

    await user.click(screen.getByRole("button", { name: /Publicar prenda/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Selecciona el tipo de prenda.",
    );
    expect(addGarment).not.toHaveBeenCalled();
  });

  it("requires a price when the sale modality is selected", async () => {
    const user = userEvent.setup();
    const addGarment = vi.fn();
    useActorMock.mockReturnValue({
      actor: makeFakeActor({ addGarment }),
      isFetching: false,
    });

    renderApp("/donar");
    await screen.findByRole("heading", { name: "Dona tu ropa" });

    await fillRequiredFields(user);
    await user.click(screen.getByRole("combobox", { name: "Modalidad" }));
    await user.click(await screen.findByRole("option", { name: "Venta" }));
    await user.click(screen.getByRole("button", { name: /Publicar prenda/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Indica un precio accesible mayor que cero.",
    );
    expect(addGarment).not.toHaveBeenCalled();
  });

  it("rejects a non-image file", async () => {
    // The file input declares `accept="image/*"`, so user-event would silently
    // drop a text file before `onChange` fires. Disable that filter to exercise
    // the component's own validation branch.
    const user = userEvent.setup({ applyAccept: false });
    useActorMock.mockReturnValue({
      actor: makeFakeActor(),
      isFetching: false,
    });

    renderApp("/donar");
    await screen.findByRole("heading", { name: "Dona tu ropa" });

    await user.upload(
      screen.getByLabelText("Fotografía de la prenda"),
      new File(["x"], "notas.txt", { type: "text/plain" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "El archivo debe ser una imagen",
    );
  });

  it("rejects an image larger than 8 MB", async () => {
    const user = userEvent.setup();
    useActorMock.mockReturnValue({
      actor: makeFakeActor(),
      isFetching: false,
    });

    renderApp("/donar");
    await screen.findByRole("heading", { name: "Dona tu ropa" });

    // 8 MB + 1 byte, so the component's own size guard fires.
    const oversized = new File(
      [new Uint8Array(8 * 1024 * 1024 + 1)],
      "enorme.png",
      { type: "image/png" },
    );
    await user.upload(
      screen.getByLabelText("Fotografía de la prenda"),
      oversized,
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "La imagen no puede superar los 8 MB.",
    );
  });

  it("shows a freshly published garment in the catalog", async () => {
    const user = userEvent.setup();
    // A stateful fake: `addGarment` stores the record and `listGarments`
    // returns it, so the catalog reflects the publication without a replica.
    const stored: ReturnType<typeof makeGarment>[] = [];
    const actor = makeFakeActor({
      addGarment: async (input) => {
        const garment = makeGarment({ ...input, id: 42n });
        stored.push(garment);
        return garment;
      },
      listGarments: async () => stored,
    });
    useActorMock.mockReturnValue({ actor, isFetching: false });

    const { router } = renderApp("/donar");
    await screen.findByRole("heading", { name: "Dona tu ropa" });

    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: /Publicar prenda/i }));

    await screen.findByText("¡Gracias por dar una segunda oportunidad!");
    await user.click(screen.getByRole("link", { name: /Ver en el catálogo/i }));

    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/catalogo");
    });
    expect(
      await screen.findByRole("link", { name: /Camisetas/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Camiseta rosa de algodón")).toBeInTheDocument();
  });
});
