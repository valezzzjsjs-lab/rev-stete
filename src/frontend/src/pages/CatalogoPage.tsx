import type { Condition, GarmentFilter, Modality } from "@/backend";
import { GarmentCard } from "@/components/GarmentCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGarments } from "@/hooks/use-garments";
import {
  CONDITION_OPTIONS,
  GARMENT_TYPES,
  SIZE_OPTIONS,
  modalityKind,
} from "@/lib/format";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { PackageOpen, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo } from "react";

const MODALITY_OPTIONS = [
  { value: "donacion", label: "Donación" },
  { value: "intercambio", label: "Intercambio" },
  { value: "venta", label: "Venta" },
] as const;

const ALL = "todas";

function toModality(value: string | undefined): Modality | undefined {
  if (value === "donacion") return { __kind__: "donacion", donacion: null };
  if (value === "intercambio")
    return { __kind__: "intercambio", intercambio: null };
  if (value === "venta") return { __kind__: "venta", venta: 0n };
  return undefined;
}

function toCondition(value: string | undefined): Condition | undefined {
  if (!value) return undefined;
  return CONDITION_OPTIONS.find((option) => option.value === value)?.value;
}

export function CatalogoPage() {
  const search = useSearch({ from: "/catalogo" });
  const navigate = useNavigate({ from: "/catalogo" });

  const filter = useMemo<GarmentFilter>(
    () => ({
      modality: toModality(search.modalidad),
      size: search.talla || undefined,
      condition: toCondition(search.estado),
      garmentType: search.tipo || undefined,
      search: search.q || undefined,
    }),
    [search.modalidad, search.talla, search.estado, search.tipo, search.q],
  );

  const { data: garments, isLoading, isError, refetch } = useGarments(filter);

  const updateSearch = (patch: Record<string, string | undefined>) => {
    const next = {
      modalidad: search.modalidad,
      talla: search.talla,
      estado: search.estado,
      tipo: search.tipo,
      q: search.q,
      ...patch,
    };
    void navigate({ search: next, replace: true });
  };

  const hasFilters = Boolean(
    search.modalidad ||
      search.talla ||
      search.estado ||
      search.tipo ||
      search.q,
  );

  const clearFilters = () => {
    void navigate({
      search: {
        modalidad: undefined,
        talla: undefined,
        estado: undefined,
        tipo: undefined,
        q: undefined,
      },
      replace: true,
    });
  };

  return (
    <div className="container py-12 md:py-16">
      <header className="mb-10 max-w-2xl space-y-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Catálogo
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Prendas con una segunda oportunidad
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Explora la ropa disponible para donación, intercambio o venta. Usa los
          filtros para encontrar justo lo que buscas.
        </p>
      </header>

      <Card
        data-ocid="catalogo.filtros_panel"
        className="mb-8 rounded-2xl border-border bg-card shadow-soft"
      >
        <CardContent className="space-y-5 pt-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <SlidersHorizontal
              className="size-4 text-primary"
              aria-hidden="true"
            />
            Filtros
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="catalogo-busqueda">Buscar</Label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="catalogo-busqueda"
                  data-ocid="catalogo.search_input"
                  value={search.q ?? ""}
                  onChange={(event) =>
                    updateSearch({ q: event.target.value || undefined })
                  }
                  placeholder="Camiseta, vestido, abrigo…"
                  className="rounded-full pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catalogo-modalidad">Modalidad</Label>
              <Select
                value={search.modalidad ?? ALL}
                onValueChange={(value) =>
                  updateSearch({ modalidad: value === ALL ? undefined : value })
                }
              >
                <SelectTrigger
                  id="catalogo-modalidad"
                  data-ocid="catalogo.modalidad_select"
                  className="w-full rounded-full"
                >
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas</SelectItem>
                  {MODALITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catalogo-talla">Talla</Label>
              <Select
                value={search.talla ?? ALL}
                onValueChange={(value) =>
                  updateSearch({ talla: value === ALL ? undefined : value })
                }
              >
                <SelectTrigger
                  id="catalogo-talla"
                  data-ocid="catalogo.talla_select"
                  className="w-full rounded-full"
                >
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todas</SelectItem>
                  {SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="catalogo-estado">Estado</Label>
              <Select
                value={search.estado ?? ALL}
                onValueChange={(value) =>
                  updateSearch({ estado: value === ALL ? undefined : value })
                }
              >
                <SelectTrigger
                  id="catalogo-estado"
                  data-ocid="catalogo.estado_select"
                  className="w-full rounded-full"
                >
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos</SelectItem>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="catalogo-tipo">Tipo de prenda</Label>
              <Select
                value={search.tipo ?? ALL}
                onValueChange={(value) =>
                  updateSearch({ tipo: value === ALL ? undefined : value })
                }
              >
                <SelectTrigger
                  id="catalogo-tipo"
                  data-ocid="catalogo.tipo_select"
                  className="w-full rounded-full"
                >
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Todos</SelectItem>
                  {GARMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasFilters ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              data-ocid="catalogo.limpiar_button"
              className="rounded-full text-muted-foreground"
            >
              <X className="size-4" aria-hidden="true" />
              Limpiar filtros
            </Button>
          ) : null}
        </CardContent>
      </Card>

      {isLoading ? (
        <div
          data-ocid="catalogo.loading_state"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, i) => `catalogo-skeleton-${i}`).map(
            (id) => (
              <div
                key={id}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
              >
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ),
          )}
        </div>
      ) : isError ? (
        <Card
          data-ocid="catalogo.error_state"
          className="rounded-2xl border-border bg-card shadow-soft"
        >
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              No pudimos cargar el catálogo
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Ocurrió un problema al conectar con el servidor. Inténtalo de
              nuevo.
            </p>
            <Button
              type="button"
              onClick={() => void refetch()}
              data-ocid="catalogo.retry_button"
              className="rounded-full"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : garments && garments.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {garments.map((garment, index) => (
            <GarmentCard
              key={garment.id.toString()}
              garment={garment}
              index={index}
            />
          ))}
        </div>
      ) : (
        <Card
          data-ocid="catalogo.empty_state"
          className="rounded-2xl border-border bg-card shadow-soft"
        >
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <PackageOpen className="size-6" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {hasFilters
                ? "No encontramos prendas con esos filtros"
                : "Todavía no hay prendas publicadas"}
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              {hasFilters
                ? "Prueba con otros criterios o limpia los filtros para ver todo el catálogo."
                : "Sé la primera persona en publicar una prenda y dale una segunda oportunidad."}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {hasFilters ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearFilters}
                  data-ocid="catalogo.empty_limpiar_button"
                  className="rounded-full"
                >
                  Limpiar filtros
                </Button>
              ) : null}
              <Button asChild className="rounded-full">
                <Link to="/donar" data-ocid="catalogo.empty_donar_button">
                  Publicar una prenda
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
