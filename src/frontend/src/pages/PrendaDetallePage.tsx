import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGarment } from "@/hooks/use-garments";
import {
  conditionLabel,
  formatDate,
  formatPrice,
  modalityKind,
  modalityLabel,
  modalityPrice,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  ImageOff,
  Mail,
  Ruler,
  Shirt,
  Sparkles,
} from "lucide-react";

const MODALITY_BADGE: Record<string, string> = {
  donacion: "border-transparent bg-success text-success-foreground",
  intercambio: "border-transparent bg-warning text-warning-foreground",
  venta: "border-transparent bg-primary text-primary-foreground",
};

export function PrendaDetallePage() {
  const { prendaId } = useParams({ from: "/prenda/$prendaId" });
  const id = /^\d+$/.test(prendaId) ? BigInt(prendaId) : null;
  const { data: garment, isLoading, isError, refetch } = useGarment(id);

  if (isLoading) {
    return (
      <div
        data-ocid="prenda.loading_state"
        className="container grid gap-10 py-12 md:py-16 lg:grid-cols-2"
      >
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-48 rounded-full" />
        </div>
      </div>
    );
  }

  if (isError || !garment) {
    return (
      <div className="container py-20">
        <Card
          data-ocid="prenda.error_state"
          className="mx-auto max-w-lg rounded-2xl border-border bg-card text-center shadow-soft"
        >
          <CardContent className="flex flex-col items-center gap-4 py-14">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <ImageOff className="size-6" aria-hidden="true" />
            </span>
            <h1 className="font-display text-2xl font-bold text-foreground">
              No encontramos esta prenda
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              Puede que ya no esté disponible o que el enlace sea incorrecto.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => void refetch()}
                data-ocid="prenda.retry_button"
                className="rounded-full"
              >
                Reintentar
              </Button>
              <Button asChild className="rounded-full">
                <Link
                  to="/catalogo"
                  search={{}}
                  data-ocid="prenda.volver_button"
                >
                  Volver al catálogo
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const kind = modalityKind(garment.modality);
  const price = modalityPrice(garment.modality);
  const contactSubject = encodeURIComponent(
    `Interés en la prenda: ${garment.garmentType} (talla ${garment.size})`,
  );
  const contactBody = encodeURIComponent(
    `Hola, me interesa la prenda "${garment.garmentType}" (talla ${garment.size}) que vi en ReVístete. ¿Sigue disponible?`,
  );

  return (
    <div className="container py-12 md:py-16">
      <Button
        asChild
        variant="ghost"
        className="mb-8 rounded-full text-muted-foreground"
      >
        <Link to="/catalogo" search={{}} data-ocid="prenda.volver_link">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al catálogo
        </Link>
      </Button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-border bg-muted shadow-soft">
          {garment.photoUrl ? (
            <img
              src={garment.photoUrl}
              alt={`${garment.garmentType} en talla ${garment.size}`}
              className="aspect-[4/3] w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center text-muted-foreground">
              <ImageOff className="size-10" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <Badge
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold",
                MODALITY_BADGE[kind],
              )}
            >
              {modalityLabel(garment.modality)}
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              {garment.garmentType}
            </h1>
            {price !== null ? (
              <p className="font-display text-3xl font-bold text-primary">
                {formatPrice(price)}
              </p>
            ) : null}
          </div>

          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {garment.description}
          </p>

          <Separator />

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Ruler className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Talla
                </dt>
                <dd className="font-semibold text-foreground">
                  {garment.size}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Estado
                </dt>
                <dd className="font-semibold text-foreground">
                  {conditionLabel(garment.condition)}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Shirt className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Tipo de prenda
                </dt>
                <dd className="font-semibold text-foreground">
                  {garment.garmentType}
                </dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <CalendarDays className="size-4" aria-hidden="true" />
              </span>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Publicada
                </dt>
                <dd className="font-semibold text-foreground">
                  {formatDate(garment.createdAt)}
                </dd>
              </div>
            </div>
          </dl>

          <Card className="rounded-2xl border-border bg-card shadow-soft">
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-1">
                <h2 className="font-display text-lg font-bold text-foreground">
                  ¿Te interesa esta prenda?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Escríbenos para coordinar la entrega o el intercambio. No
                  compartimos datos personales en el sitio.
                </p>
              </div>
              <Button asChild className="w-full rounded-full shadow-soft">
                <a
                  href={`mailto:hola@revistete.org?subject=${contactSubject}&body=${contactBody}`}
                  data-ocid="prenda.contactar_button"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Solicitar esta prenda
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
