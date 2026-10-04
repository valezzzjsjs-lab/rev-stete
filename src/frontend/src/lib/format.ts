import { Condition, type Modality } from "@/backend";

/** Motoko `Time.now()` values are nanosecond bigints. */
export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  if (!date) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatNumber(value: bigint | number): string {
  return new Intl.NumberFormat("es-ES").format(Number(value));
}

export function formatPrice(centavos: bigint): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(Number(centavos) / 100);
}

export const CONDITION_LABELS: Record<Condition, string> = {
  [Condition.nueva]: "Nueva",
  [Condition.comoNueva]: "Como nueva",
  [Condition.buenEstado]: "Buen estado",
  [Condition.usada]: "Usada",
};

export const CONDITION_OPTIONS: { value: Condition; label: string }[] = [
  { value: Condition.nueva, label: "Nueva" },
  { value: Condition.comoNueva, label: "Como nueva" },
  { value: Condition.buenEstado, label: "Buen estado" },
  { value: Condition.usada, label: "Usada" },
];

export function conditionLabel(condition: Condition): string {
  return CONDITION_LABELS[condition] ?? "Sin especificar";
}

export type ModalityKind = "donacion" | "intercambio" | "venta";

export function modalityKind(modality: Modality): ModalityKind {
  return modality.__kind__;
}

export const MODALITY_LABELS: Record<ModalityKind, string> = {
  donacion: "Donación",
  intercambio: "Intercambio",
  venta: "Venta",
};

export function modalityLabel(modality: Modality): string {
  return MODALITY_LABELS[modalityKind(modality)];
}

export function modalityPrice(modality: Modality): bigint | null {
  return modality.__kind__ === "venta" ? modality.venta : null;
}

export const GARMENT_TYPES = [
  "Camisetas",
  "Camisas",
  "Sudaderas",
  "Chaquetas y abrigos",
  "Pantalones",
  "Vestidos",
  "Faldas",
  "Ropa infantil",
  "Calzado",
  "Accesorios",
] as const;

export const SIZE_OPTIONS = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "Única",
  "Niños",
] as const;
