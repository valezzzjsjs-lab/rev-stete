import { Condition, type Modality, type NewGarment } from "@/backend";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateGarment } from "@/hooks/use-garments";
import { MAX_PHOTO_BYTES, isImageFile, readFileAsDataUrl } from "@/lib/backend";
import { CONDITION_OPTIONS, GARMENT_TYPES, SIZE_OPTIONS } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type ModalityChoice = "donacion" | "intercambio" | "venta";

const MODALITY_OPTIONS: { value: ModalityChoice; label: string }[] = [
  { value: "donacion", label: "Donación" },
  { value: "intercambio", label: "Intercambio" },
  { value: "venta", label: "Venta" },
];

function buildModality(choice: ModalityChoice, price: string): Modality {
  if (choice === "donacion") return { __kind__: "donacion", donacion: null };
  if (choice === "intercambio")
    return { __kind__: "intercambio", intercambio: null };
  const parsed = Number.parseFloat(price.replace(",", "."));
  const centavos = Number.isFinite(parsed)
    ? BigInt(Math.round(parsed * 100))
    : 0n;
  return { __kind__: "venta", venta: centavos };
}

export function GarmentForm({
  defaultModality = "donacion",
  heading,
  intro,
}: {
  defaultModality?: ModalityChoice;
  heading: string;
  intro: string;
}) {
  const createGarment = useCreateGarment();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [garmentType, setGarmentType] = useState("");
  const [size, setSize] = useState("");
  const [condition, setCondition] = useState<Condition>(Condition.buenEstado);
  const [description, setDescription] = useState("");
  const [modality, setModality] = useState<ModalityChoice>(defaultModality);
  const [price, setPrice] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const resetForm = () => {
    setGarmentType("");
    setSize("");
    setCondition(Condition.buenEstado);
    setDescription("");
    setModality(defaultModality);
    setPrice("");
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePhotoChange = async (file: File | undefined) => {
    if (!file) return;
    if (!isImageFile(file)) {
      setFormError("El archivo debe ser una imagen (JPG, PNG o WEBP).");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setFormError("La imagen no puede superar los 8 MB.");
      return;
    }
    setFormError(null);
    setPhotoFile(file);
    try {
      setPhotoPreview(await readFileAsDataUrl(file));
    } catch {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!garmentType) {
      setFormError("Selecciona el tipo de prenda.");
      return;
    }
    if (!size) {
      setFormError("Selecciona la talla.");
      return;
    }
    if (!description.trim()) {
      setFormError("Añade una descripción de la prenda.");
      return;
    }
    if (!photoFile) {
      setFormError("Sube una fotografía de la prenda.");
      return;
    }
    if (modality === "venta") {
      const parsed = Number.parseFloat(price.replace(",", "."));
      if (!Number.isFinite(parsed) || parsed <= 0) {
        setFormError("Indica un precio accesible mayor que cero.");
        return;
      }
    }

    try {
      const photoUrl = await readFileAsDataUrl(photoFile);
      const input: NewGarment = {
        garmentType,
        size,
        condition,
        description: description.trim(),
        modality: buildModality(modality, price),
        photoUrl,
      };
      await createGarment.mutateAsync(input);
      resetForm();
      setPublished(true);
      toast.success("¡Prenda publicada! Ya aparece en el catálogo.");
    } catch {
      setFormError(
        "No pudimos publicar la prenda. Revisa tu conexión e inténtalo de nuevo.",
      );
    }
  };

  if (published) {
    return (
      <Card
        data-ocid="publicar.success_state"
        className="mx-auto max-w-xl rounded-2xl border-border bg-card text-center shadow-soft"
      >
        <CardContent className="flex flex-col items-center gap-4 py-14">
          <span className="flex size-14 items-center justify-center rounded-full bg-success text-success-foreground">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground">
            ¡Gracias por dar una segunda oportunidad!
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Tu prenda ya está publicada y visible en el catálogo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full">
              <Link
                to="/catalogo"
                search={{}}
                data-ocid="publicar.ver_catalogo_button"
              >
                Ver en el catálogo
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPublished(false)}
              data-ocid="publicar.otra_button"
              className="rounded-full"
            >
              Publicar otra prenda
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      data-ocid="publicar.form_card"
      className="mx-auto max-w-3xl rounded-2xl border-border bg-card shadow-soft"
    >
      <CardContent className="space-y-6 pt-2">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {heading}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {intro}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="space-y-2">
            <Label htmlFor="prenda-foto">Fotografía de la prenda</Label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex aspect-[4/3] w-full max-w-[14rem] items-center justify-center overflow-hidden rounded-2xl border border-dashed border-input bg-muted">
                {photoPreview ? (
                  <>
                    <img
                      src={photoPreview}
                      alt="Vista previa de la prenda"
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreview(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      aria-label="Quitar fotografía"
                      data-ocid="publicar.quitar_foto_button"
                      className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-card/90 text-foreground shadow-soft transition-smooth hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4 text-center text-muted-foreground">
                    <ImagePlus className="size-7" aria-hidden="true" />
                    <span className="text-xs">Sin imagen</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  id="prenda-foto"
                  type="file"
                  accept="image/*"
                  data-ocid="publicar.upload_button"
                  onChange={(event) =>
                    void handlePhotoChange(event.target.files?.[0])
                  }
                  className="sr-only"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="publicar.seleccionar_foto_button"
                  className="rounded-full"
                >
                  <Upload className="size-4" aria-hidden="true" />
                  {photoFile ? "Cambiar fotografía" : "Subir fotografía"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG o WEBP · máximo 8 MB
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenda-tipo">Tipo de prenda</Label>
              <Select value={garmentType} onValueChange={setGarmentType}>
                <SelectTrigger
                  id="prenda-tipo"
                  data-ocid="publicar.tipo_select"
                  className="w-full rounded-full"
                >
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {GARMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenda-talla">Talla</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger
                  id="prenda-talla"
                  data-ocid="publicar.talla_select"
                  className="w-full rounded-full"
                >
                  <SelectValue placeholder="Selecciona una talla" />
                </SelectTrigger>
                <SelectContent>
                  {SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenda-estado">Estado</Label>
              <Select
                value={condition}
                onValueChange={(value) => setCondition(value as Condition)}
              >
                <SelectTrigger
                  id="prenda-estado"
                  data-ocid="publicar.estado_select"
                  className="w-full rounded-full"
                >
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenda-modalidad">Modalidad</Label>
              <Select
                value={modality}
                onValueChange={(value) => setModality(value as ModalityChoice)}
              >
                <SelectTrigger
                  id="prenda-modalidad"
                  data-ocid="publicar.modalidad_select"
                  className="w-full rounded-full"
                >
                  <SelectValue placeholder="Selecciona la modalidad" />
                </SelectTrigger>
                <SelectContent>
                  {MODALITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {modality === "venta" ? (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="prenda-precio">Precio accesible (€)</Label>
                <Input
                  id="prenda-precio"
                  data-ocid="publicar.precio_input"
                  type="number"
                  min="0"
                  step="0.5"
                  inputMode="decimal"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="Ej. 8"
                  className="rounded-full"
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="prenda-descripcion">Descripción</Label>
            <Textarea
              id="prenda-descripcion"
              data-ocid="publicar.descripcion_textarea"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Cuéntanos sobre la prenda: color, marca, detalles de uso…"
              rows={4}
              className="rounded-2xl"
            />
          </div>

          {formError ? (
            <p
              role="alert"
              data-ocid="publicar.error_state"
              className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {formError}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={createGarment.isPending}
              data-ocid="publicar.submit_button"
              className="rounded-full shadow-soft transition-smooth hover:shadow-elevated"
            >
              {createGarment.isPending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : null}
              {createGarment.isPending ? "Publicando…" : "Publicar prenda"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              data-ocid="publicar.limpiar_button"
              className="rounded-full text-muted-foreground"
            >
              Limpiar formulario
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
