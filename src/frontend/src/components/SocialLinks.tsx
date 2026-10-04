import { cn } from "@/lib/utils";
import { Facebook, Instagram, Music2 } from "lucide-react";

export const SOCIAL_PROFILES = [
  {
    name: "Instagram",
    handle: "@revistete",
    href: "https://www.instagram.com/",
    Icon: Instagram,
  },
  {
    name: "TikTok",
    handle: "@revistete",
    href: "https://www.tiktok.com/",
    Icon: Music2,
  },
  {
    name: "Facebook",
    handle: "ReVístete",
    href: "https://www.facebook.com/",
    Icon: Facebook,
  },
] as const;

type SocialLinksProps = {
  variant?: "icons" | "cards";
  className?: string;
};

export function SocialLinks({
  variant = "icons",
  className,
}: SocialLinksProps) {
  if (variant === "cards") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
        {SOCIAL_PROFILES.map(({ name, handle, href, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noreferrer"
            data-ocid={`social.link.${name.toLowerCase()}`}
            className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-smooth group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-foreground">
                {name}
              </span>
              <span className="block truncate text-sm text-muted-foreground">
                {handle}
              </span>
            </span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {SOCIAL_PROFILES.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={`ReVístete en ${name}`}
          data-ocid={`social.link.${name.toLowerCase()}`}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-smooth hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Icon className="size-4" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
