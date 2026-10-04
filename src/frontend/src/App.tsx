import { Layout } from "@/components/Layout";
import { Toaster } from "@/components/ui/sonner";
import { CatalogoPage } from "@/pages/CatalogoPage";
import { DonarPage } from "@/pages/DonarPage";
import { HistoriaDetallePage } from "@/pages/HistoriaDetallePage";
import { HistoriasPage } from "@/pages/HistoriasPage";
import { HomePage } from "@/pages/HomePage";
import { ImpactoPage } from "@/pages/ImpactoPage";
import { IntercambiarPage } from "@/pages/IntercambiarPage";
import { PrendaDetallePage } from "@/pages/PrendaDetallePage";
import { RedesPage } from "@/pages/RedesPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

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

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </>
  );
}
