import { NAV_ITEMS } from "@/components/Header";
import { SocialLinks } from "@/components/SocialLinks";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <Link
            to="/"
            data-ocid="footer.logo"
            className="inline-flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft">
              <Heart className="size-4" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-foreground">
              ReVístete
            </span>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Dale una segunda oportunidad a tu ropa. Dona, intercambia o
            encuentra prendas a precios accesibles y ayuda a que cada prenda
            siga contando historias.
          </p>
          <SocialLinks />
        </div>

        <nav aria-label="Navegación del pie de página" className="space-y-3">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Explora
          </h2>
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  data-ocid={`footer.link.${item.to === "/" ? "inicio" : item.to.slice(1)}`}
                  className="text-sm text-foreground/80 transition-smooth hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Nuestro compromiso
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Publicamos historias sin datos personales, direcciones ni
            información que identifique a las personas beneficiadas.
          </p>
          <Link
            to="/impacto"
            data-ocid="footer.impacto_link"
            className="inline-flex text-sm font-semibold text-primary transition-smooth hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Ver nuestro impacto
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
          <p>© {currentYear} ReVístete. Ropa con una segunda historia.</p>
          <p>
            © {currentYear}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== "undefined" ? window.location.hostname : "",
              )}`}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary transition-smooth hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
