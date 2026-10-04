import type { GarmentView } from "@/backend";
import { Badge } from "@/components/ui/badge";
import {
  conditionLabel,
  formatPrice,
  modalityKind,
  modalityLabel,
  modalityPrice,
} from "@/lib/format";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { ImageOff } from "lucide-react";

const MODALITY_BADGE: Record<string, string> = {
  donacion: "border-transparent bg-success text-success-foreground",
  intercambio: "border-transparent bg-warning text-warning-foreground",
  venta: "border-transparent bg-primary text-primary-foreground",
};

export function GarmentCard({
  garment,
  index,
}: {
  garment: GarmentView;
  index: number;
}) {
  const kind = modalityKind(garment.modality);
  const price = modalityPrice(garment.modality);

  return (
    <Link
      to="/prenda/$prendaId"
      params={{ prendaId: garment.id.toString() }}
      data-ocid={`catalogo.item.${index + 1}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {garment.photoUrl ? (
          <img
            src={garment.photoUrl}
            alt={`${garment.garmentType} en talla ${garment.size}`}
            loading="lazy"
            className="size-full object-cover transition-smooth group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageOff className="size-8" aria-hidden="true" />
          </div>
        )}
        <Badge
          className={cn(
            "absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold",
            MODALITY_BADGE[kind],
          )}
        >
          {modalityLabel(garment.modality)}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-bold leading-tight text-foreground">
            {garment.garmentType}
          </h3>
          {price !== null ? (
            <span className="shrink-0 font-display text-lg font-bold text-primary">
              {formatPrice(price)}
            </span>
          ) : null}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {garment.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Badge variant="outline" className="rounded-full text-xs">
            Talla {garment.size}
          </Badge>
          <Badge variant="outline" className="rounded-full text-xs">
            {conditionLabel(garment.condition)}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
