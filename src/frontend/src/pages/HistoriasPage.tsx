import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useStories } from "@/hooks/use-stories";
import { formatDate, formatNumber } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { CalendarDays, HeartHandshake, ImageOff, Package } from "lucide-react";

export function HistoriasPage() {
  const { data: stories, isLoading, isError, refetch } = useStories();

  return (
    <div className="container py-12 md:py-16">
      <header className="mb-10 max-w-2xl space-y-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Historias ReVístete
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Casos que nos inspiran
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Campañas de donación, prendas entregadas y testimonios de nuestra
          comunidad. Publicamos cada caso sin datos personales ni información
          que identifique a las personas beneficiadas.
        </p>
      </header>

      {isLoading ? (
        <div
          data-ocid="historias.loading_state"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 6 }, (_, i) => `historia-skeleton-${i}`).map(
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
          data-ocid="historias.error_state"
          className="rounded-2xl border-border bg-card shadow-soft"
        >
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              No pudimos cargar las historias
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Ocurrió un problema al conectar con el servidor. Inténtalo de
              nuevo.
            </p>
            <Button
              type="button"
              onClick={() => void refetch()}
              data-ocid="historias.retry_button"
              className="rounded-full"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : stories && stories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story, index) => (
            <Link
              key={story.id.toString()}
              to="/historias/$historiaId"
              params={{ historiaId: story.id.toString() }}
              data-ocid={`historias.item.${index + 1}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {story.photoUrl ? (
                  <img
                    src={story.photoUrl}
                    alt={story.title}
                    loading="lazy"
                    className="size-full object-cover transition-smooth group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <ImageOff className="size-8" aria-hidden="true" />
                  </div>
                )}
                <Badge className="absolute left-3 top-3 rounded-full border-transparent bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  <Package className="size-3" aria-hidden="true" />
                  {formatNumber(story.garmentsDelivered)} prendas
                </Badge>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h2 className="font-display text-lg font-bold leading-tight text-foreground">
                  {story.title}
                </h2>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {story.description}
                </p>
                <p className="mt-auto flex items-center gap-2 pt-1 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="size-3.5" aria-hidden="true" />
                  {formatDate(story.deliveredAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Card
          data-ocid="historias.empty_state"
          className="rounded-2xl border-border bg-card shadow-soft"
        >
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <HeartHandshake className="size-6" aria-hidden="true" />
            </span>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Aún no hay historias publicadas
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Muy pronto compartiremos aquí los casos de ayuda de nuestra
              comunidad.
            </p>
            <Button asChild className="rounded-full">
              <Link to="/donar" data-ocid="historias.empty_donar_button">
                Donar ropa
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
