import { GarmentForm } from "@/components/GarmentForm";

export function DonarPage() {
  return (
    <div className="container py-12 md:py-16">
      <GarmentForm
        defaultModality="donacion"
        heading="Dona tu ropa"
        intro="Publica una prenda que ya no usas y dale una segunda oportunidad. Completa los datos y aparecerá de inmediato en el catálogo."
      />
    </div>
  );
}
