import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Heart, Menu } from "lucide-react";
import { useState } from "react";

export const NAV_ITEMS = [
  { label: "Inicio", to: "/" },
  { label: "Catálogo", to: "/catalogo" },
  { label: "Dona tu ropa", to: "/donar" },
  { label: "Intercambia", to: "/intercambiar" },
  { label: "Historias", to: "/historias" },
  { label: "Impacto", to: "/impacto" },
  { label: "Redes sociales", to: "/redes" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 shadow-soft backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          data-ocid="nav.logo"
          className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-soft">
            <Heart className="size-4" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            ReVístete
          </span>
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              data-ocid={`nav.link.${item.to === "/" ? "inicio" : item.to.slice(1)}`}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="hidden rounded-full shadow-soft transition-smooth hover:shadow-elevated sm:inline-flex"
          >
            <Link to="/donar" data-ocid="nav.donar_button">
              Donar ropa
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Abrir menú de navegación"
                data-ocid="nav.menu_button"
                className="rounded-full lg:hidden"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle className="font-display text-xl">
                  ReVístete
                </SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Navegación móvil"
                className="flex flex-col gap-1 px-4"
              >
                {NAV_ITEMS.map((item) => (
                  <SheetClose asChild key={item.to}>
                    <Link
                      to={item.to}
                      data-ocid={`nav.mobile_link.${item.to === "/" ? "inicio" : item.to.slice(1)}`}
                      activeOptions={{ exact: item.to === "/" }}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-base font-medium text-muted-foreground transition-smooth hover:bg-accent hover:text-accent-foreground",
                      )}
                      activeProps={{
                        className: "bg-accent text-accent-foreground",
                      }}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <SheetClose asChild>
                  <Button asChild className="w-full rounded-full">
                    <Link to="/donar" data-ocid="nav.mobile_donar_button">
                      Donar ropa
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
