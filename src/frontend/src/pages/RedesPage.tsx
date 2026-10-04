import { SocialLinks } from "@/components/SocialLinks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart, Share2 } from "lucide-react";

export function RedesPage() {
  return (
    <div className="container py-12 md:py-16">
      <header className="mx-auto mb-12 max-w-2xl space-y-4 text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
          Redes sociales
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Síguenos y comparte
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
          Publicamos nuevas prendas, campañas de donación e historias de
          impacto. Únete a la comunidad ReVístete en tus redes favoritas.
        </p>
      </header>

      <SocialLinks variant="cards" className="mx-auto max-w-3xl" />

      <Card className="mx-auto mt-12 max-w-3xl rounded-2xl border-border bg-muted/40 shadow-none">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Share2 className="size-5" aria-hidden="true" />
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Ayúdanos a llegar a más personas
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Comparte ReVístete con quien pueda necesitar ropa o quiera donar la
            que ya no usa. Cada persona que se suma multiplica el impacto.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full shadow-soft">
              <Link to="/donar" data-ocid="redes.donar_button">
                Donar ropa
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-primary/30 bg-card"
            >
              <Link
                to="/catalogo"
                search={{}}
                data-ocid="redes.catalogo_button"
              >
                Ver catálogo
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
        <Heart className="size-4 text-primary" aria-hidden="true" />
        Gracias por dar una segunda oportunidad a tu ropa.
      </p>
    </div>
  );
}
