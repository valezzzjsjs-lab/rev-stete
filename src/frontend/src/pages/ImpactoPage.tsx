import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useImpact } from "@/hooks/use-impact";
import { formatNumber } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { HeartHandshake, Leaf, Recycle, Users } from "lucide-react";

export function ImpactoPage() {
  const { data: impact, isLoading, isError, refetch } = useImpact();

  const metrics = [
    {
      key: "prendas",
      label: "Prendas reutilizadas",
      description:
        "Cada prenda que encuentra un nuevo hogar evita convertirse en residuo textil.",
      value: impact ? formatNumber(impact.garmentsReused) : "—",
      Icon: Recycle,
    },
    {
      key: "donaciones",
      label: "Donaciones realizadas",
      description:
        "Prendas entregadas de forma solidaria a personas y familias de la comunidad.",
      value: impact ? formatNumber(impact.donationsMade) : "—",
      Icon: HeartHandshake,
    },
    {
      key: "personas",
      label: "Personas beneficiadas",
      description:
        "Estudiantes y familias que han encontrado ropa digna y accesible.",
      value: impact ? formatNumber(impact.peopleBenefited) : "—",
      Icon: Users,
    },
  ];

  return (
    <div className="container py-12 md:py-16">
      <header className="mb-12 max-w-2xl space-y-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Nuestro impacto
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Ropa que transforma
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Estas métricas se actualizan automáticamente a partir de las prendas y
          donaciones registradas en ReVístete.
        </p>
      </header>

      {isLoading ? (
        <div
          data-ocid="impacto.loading_state"
          className="grid gap-6 md:grid-cols-3"
        >
          {Array.from({ length: 3 }, (_, i) => `impacto-skeleton-${i}`).map(
            (id) => (
              <Card
                key={id}
                className="rounded-2xl border-border bg-card shadow-soft"
              >
                <CardContent className="space-y-4 pt-2">
                  <Skeleton className="size-12 rounded-full" />
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ),
          )}
        </div>
      ) : isError ? (
        <Card
          data-ocid="impacto.error_state"
          className="rounded-2xl border-border bg-card shadow-soft"
        >
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              No pudimos cargar las métricas
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Ocurrió un problema al conectar con el servidor. Inténtalo de
              nuevo.
            </p>
            <Button
              type="button"
              onClick={() => void refetch()}
              data-ocid="impacto.retry_button"
              className="rounded-full"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {metrics.map(({ key, label, description, value, Icon }) => (
            <Card
              key={key}
              data-ocid={`impacto.metric_card.${key}`}
              className="rounded-2xl border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elevated"
            >
              <CardContent className="space-y-4 pt-2">
                <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="font-display text-5xl font-bold text-primary">
                  {value}
                </p>
                <div className="space-y-1">
                  <h2 className="font-display text-lg font-bold text-foreground">
                    {label}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <section className="mt-16">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 text-center shadow-soft md:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -bottom-20 size-72 rounded-full bg-bloom"
          />
          <div className="relative mx-auto max-w-2xl space-y-5">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Leaf className="size-5" aria-hidden="true" />
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Suma tu prenda a estas cifras
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Cada donación cuenta. Publica una prenda y ayuda a que el impacto
              siga creciendo.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="rounded-full shadow-soft">
                <Link to="/donar" data-ocid="impacto.donar_button">
                  Donar ropa
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-primary/30 bg-card"
              >
                <Link to="/historias" data-ocid="impacto.historias_button">
                  Leer historias
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
