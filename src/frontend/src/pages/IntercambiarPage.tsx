import { GarmentForm } from "@/components/GarmentForm";

export function IntercambiarPage() {
  return (
    <div className="container py-12 md:py-16">
      <GarmentForm
        defaultModality="intercambio"
        heading="Intercambia tu ropa"
        intro="¿Buscas algo nuevo sin gastar? Publica una prenda en modalidad de intercambio y encuentra a alguien que quiera cambiarla contigo."
      />
    </div>
  );
}
