import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useStory } from "@/hooks/use-stories";
import { formatDate, formatNumber } from "@/lib/format";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, ImageOff, Package } from "lucide-react";

export function HistoriaDetallePage() {
  const { historiaId } = useParams({ from: "/historias/$historiaId" });
  const id = /^\d+$/.test(historiaId) ? BigInt(historiaId) : null;
  const { data: story, isLoading, isError, refetch } = useStory(id);

  if (isLoading) {
    return (
      <div
        data-ocid="historia.loading_state"
        className="container max-w-3xl space-y-6 py-12 md:py-16"
      >
        <Skeleton className="h-8 w-40" />
        <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError || !story) {
    return (
      <div className="container py-20">
        <Card
          data-ocid="historia.error_state"
          className="mx-auto max-w-lg rounded-2xl border-border bg-card text-center shadow-soft"
        >
          <CardContent className="flex flex-col items-center gap-4 py-14">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <ImageOff className="size-6" aria-hidden="true" />
            </span>
            <h1 className="font-display text-2xl font-bold text-foreground">
              No encontramos esta historia
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              Puede que ya no esté disponible o que el enlace sea incorrecto.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetch()}
                data-ocid="historia.retry_button"
                className="rounded-full"
              >
                Reintentar
              </Button>
              <Button asChild className="rounded-full">
                <Link to="/historias" data-ocid="historia.volver_button">
                  Volver a historias
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <article className="container max-w-3xl py-12 md:py-16">
      <Button
        asChild
        variant="ghost"
        className="mb-8 rounded-full text-muted-foreground"
      >
        <Link to="/historias" data-ocid="historia.volver_link">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a historias
        </Link>
      </Button>

      <div className="space-y-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-soft">
          {story.photoUrl ? (
            <img
              src={story.photoUrl}
              alt={story.title}
              className="aspect-[16/9] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-10" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge className="rounded-full border-transparent bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            <Package className="size-3" aria-hidden="true" />
            {formatNumber(story.garmentsDelivered)} prendas entregadas
          </Badge>
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <CalendarDays className="size-3.5" aria-hidden="true" />
            {formatDate(story.deliveredAt)}
          </span>
        </div>

        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {story.title}
        </h1>

        <Separator />

        <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">
          {story.description}
        </p>

        <Card className="rounded-2xl border-border bg-muted/40 shadow-none">
          <CardContent className="pt-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Por respeto a la privacidad de las personas beneficiadas, esta
              historia no incluye datos personales, direcciones ni información
              que permita identificarlas.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild className="rounded-full shadow-soft">
            <Link to="/donar" data-ocid="historia.donar_button">
              Donar ropa
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-primary/30 bg-card"
          >
            <Link to="/impacto" data-ocid="historia.impacto_button">
              Ver nuestro impacto
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
