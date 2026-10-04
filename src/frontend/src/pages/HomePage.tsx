import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useImpact } from "@/hooks/use-impact";
import { formatNumber } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  HeartHandshake,
  Leaf,
  Recycle,
  Sparkles,
} from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Publica",
    description:
      "Sube una foto de la prenda que ya no usas, con su talla, estado y modalidad.",
    Icon: Sparkles,
  },
  {
    number: "02",
    title: "Conecta",
    description:
      "Otras personas la descubren en el catálogo y se ponen en contacto contigo.",
    Icon: HeartHandshake,
  },
  {
    number: "03",
    title: "Da una segunda oportunidad",
    description:
      "La prenda encuentra un nuevo hogar y tú generas un impacto real.",
    Icon: Recycle,
  },
] as const;

export function HomePage() {
  const { data: impact } = useImpact();

  const metrics = [
    {
      label: "Prendas reutilizadas",
      value: impact ? formatNumber(impact.garmentsReused) : "—",
    },
    {
      label: "Donaciones realizadas",
      value: impact ? formatNumber(impact.donationsMade) : "—",
    },
    {
      label: "Personas beneficiadas",
      value: impact ? formatNumber(impact.peopleBenefited) : "—",
    },
  ];

  return (
    <div>
      <section
        data-ocid="home.hero_section"
        className="relative overflow-hidden bg-gradient-subtle"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-bloom animate-bloom-pulse"
        />
        <div className="container relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div className="animate-fade-up space-y-6">
            <Badge
              variant="secondary"
              className="rounded-full border-transparent bg-accent px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-accent-foreground"
            >
              Ropa con una segunda historia
            </Badge>
            <h1 className="font-display text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              ReVístete
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Dale una segunda oportunidad a tu ropa. Dona, intercambia o
              encuentra prendas a precios accesibles y ayuda a que cada prenda
              siga contando historias.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full shadow-soft transition-smooth hover:shadow-elevated"
              >
                <Link to="/donar" data-ocid="home.donar_button">
                  Donar ropa
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary/30 bg-card transition-smooth hover:bg-accent"
              >
                <Link
                  to="/catalogo"
                  search={{}}
                  data-ocid="home.catalogo_button"
                >
                  Ver catálogo
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full transition-smooth"
              >
                <Link to="/intercambiar" data-ocid="home.intercambiar_button">
                  Intercambiar
                </Link>
              </Button>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="relative mx-auto max-w-md">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-[2.5rem] bg-bloom"
              />
              <img
                src="/assets/generated/hero-ropa.dim_1200x900.jpg"
                alt="Prendas de ropa dobladas en tonos rosados y suaves sobre una mesa de madera clara"
                width={1200}
                height={900}
                loading="eager"
                className="relative w-full rounded-[2rem] border border-border object-cover shadow-elevated animate-float-slow"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        data-ocid="home.como_funciona_section"
        className="py-16 md:py-24"
      >
        <div className="container space-y-12">
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Cómo funciona
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Tres pasos para dar una segunda vida
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              ReVístete nació para que la ropa que ya no usas llegue a quien la
              necesita, sin complicaciones y con un impacto positivo para el
              planeta.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map(({ number, title, description, Icon }) => (
              <Card
                key={number}
                data-ocid={`home.step_card.${number}`}
                className="rounded-2xl border-border bg-card shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elevated"
              >
                <CardContent className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-2xl font-bold text-primary/30">
                      {number}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        data-ocid="home.impacto_section"
        className="bg-muted/40 py-16 md:py-24"
      >
        <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              Impacto social y ambiental
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Cada prenda cuenta
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Reutilizar ropa reduce residuos textiles y ayuda a familias y
              estudiantes a vestirse con dignidad. Estas son las cifras que
              nuestra comunidad ha construido.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full shadow-soft transition-smooth hover:shadow-elevated"
              >
                <Link to="/impacto" data-ocid="home.ver_impacto_button">
                  Ver nuestro impacto
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-primary/30 bg-card transition-smooth hover:bg-accent"
              >
                <Link to="/historias" data-ocid="home.ver_historias_button">
                  Leer historias
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {metrics.map((metric) => (
              <Card
                key={metric.label}
                className="rounded-2xl border-border bg-card text-center shadow-soft"
              >
                <CardContent className="space-y-2 pt-2">
                  <p className="font-display text-4xl font-bold text-primary">
                    {metric.value}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {metric.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section data-ocid="home.cta_section" className="py-16 md:py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 text-center shadow-soft md:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-bloom"
            />
            <div className="relative mx-auto max-w-2xl space-y-5">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Leaf className="size-5" aria-hidden="true" />
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                ¿Tienes ropa que ya no usas?
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                Publícala en minutos y deja que alguien más le dé una segunda
                oportunidad.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full shadow-soft transition-smooth hover:shadow-elevated"
              >
                <Link to="/donar" data-ocid="home.cta_donar_button">
                  Publicar una prenda
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
