import type {
  GarmentFilter,
  GarmentView,
  ImpactMetrics,
  Modality,
  NewGarment,
  StoryView,
} from "@/backend";
import { Condition } from "@/backend";
import { Layout } from "@/components/Layout";
import { CatalogoPage } from "@/pages/CatalogoPage";
import { DonarPage } from "@/pages/DonarPage";
import { HistoriaDetallePage } from "@/pages/HistoriaDetallePage";
import { HistoriasPage } from "@/pages/HistoriasPage";
import { HomePage } from "@/pages/HomePage";
import { ImpactoPage } from "@/pages/ImpactoPage";
import { IntercambiarPage } from "@/pages/IntercambiarPage";
import { PrendaDetallePage } from "@/pages/PrendaDetallePage";
import { RedesPage } from "@/pages/RedesPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactElement } from "react";

/**
 * The subset of the generated `Backend` actor the pages actually call. Tests
 * provide a typed fake so a page's observable behavior can be asserted without
 * a replica; the real canister is exercised by the PocketIC lane instead.
 */
export interface FakeActor {
  listGarments(filter: GarmentFilter): Promise<GarmentView[]>;
  getGarment(id: bigint): Promise<GarmentView | null>;
  addGarment(input: NewGarment): Promise<GarmentView>;
  listStories(): Promise<StoryView[]>;
  getStory(id: bigint): Promise<StoryView | null>;
  getImpactMetrics(): Promise<ImpactMetrics>;
}

export function makeGarment(overrides: Partial<GarmentView> = {}): GarmentView {
  return {
    id: 1n,
    createdAt: 1_700_000_000_000_000_000n,
    size: "M",
    description: "Camiseta de algodón en buen estado",
    photoUrl: "https://example.test/prenda.jpg",
    garmentType: "Camisetas",
    modality: { __kind__: "donacion", donacion: null },
    condition: Condition.buenEstado,
    ...overrides,
  };
}

export function makeStory(overrides: Partial<StoryView> = {}): StoryView {
  return {
    id: 1n,
    title: "Campaña de invierno",
    description: "Abrigos entregados a familias del barrio.",
    photoUrl: "https://example.test/historia.jpg",
    garmentsDelivered: 12n,
    deliveredAt: 1_700_000_000_000_000_000n,
    ...overrides,
  };
}

export function makeImpact(
  overrides: Partial<ImpactMetrics> = {},
): ImpactMetrics {
  return {
    garmentsReused: 42n,
    donationsMade: 17n,
    peopleBenefited: 30n,
    ...overrides,
  };
}

export function modality(
  kind: "donacion" | "intercambio" | "venta",
  price = 0n,
): Modality {
  if (kind === "venta") return { __kind__: "venta", venta: price };
  if (kind === "intercambio")
    return { __kind__: "intercambio", intercambio: null };
  return { __kind__: "donacion", donacion: null };
}

/** A fake actor whose methods resolve to the supplied fixtures. */
export function makeFakeActor(overrides: Partial<FakeActor> = {}): FakeActor {
  return {
    listGarments: async () => [],
    getGarment: async () => null,
    addGarment: async (input) => makeGarment({ ...input, id: 99n }),
    listStories: async () => [],
    getStory: async () => null,
    getImpactMetrics: async () => makeImpact(),
    ...overrides,
  };
}

function buildTestRouter(initialPath: string) {
  const rootRoute = createRootRoute({
    component: () => (
      <Layout>
        <Outlet />
      </Layout>
    ),
  });

  const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: HomePage,
  });
  const catalogoRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/catalogo",
    validateSearch: (
      search: Record<string, unknown>,
    ): {
      modalidad?: string;
      talla?: string;
      estado?: string;
      tipo?: string;
      q?: string;
    } => ({
      modalidad:
        typeof search.modalidad === "string" ? search.modalidad : undefined,
      talla: typeof search.talla === "string" ? search.talla : undefined,
      estado: typeof search.estado === "string" ? search.estado : undefined,
      tipo: typeof search.tipo === "string" ? search.tipo : undefined,
      q: typeof search.q === "string" ? search.q : undefined,
    }),
    component: CatalogoPage,
  });
  const prendaRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/prenda/$prendaId",
    component: PrendaDetallePage,
  });
  const donarRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/donar",
    component: DonarPage,
  });
  const intercambiarRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/intercambiar",
    component: IntercambiarPage,
  });
  const historiasRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/historias",
    component: HistoriasPage,
  });
  const historiaRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/historias/$historiaId",
    component: HistoriaDetallePage,
  });
  const impactoRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/impacto",
    component: ImpactoPage,
  });
  const redesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/redes",
    component: RedesPage,
  });

  const routeTree = rootRoute.addChildren([
    homeRoute,
    catalogoRoute,
    prendaRoute,
    donarRoute,
    intercambiarRoute,
    historiasRoute,
    historiaRoute,
    impactoRoute,
    redesRoute,
  ]);

  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

export interface RenderAppResult extends RenderResult {
  router: ReturnType<typeof buildTestRouter>;
}

/**
 * Renders the real page components inside the real router and a fresh query
 * client. `initialPath` selects the route under test.
 */
export function renderApp(initialPath = "/"): RenderAppResult {
  const router = buildTestRouter(initialPath);
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return { ...result, router };
}

/** Renders a bare element with a fresh query client (for component-level tests). */
export function renderWithQueryClient(ui: ReactElement): RenderResult {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}
