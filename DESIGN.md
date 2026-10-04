# Design Brief

## Direction

Rosa Cálido — a warm, editorial pastel system that makes second-hand clothing feel like a gift, not a leftover.

## Tone

Soft/pastel executed with editorial confidence: airy rose washes, generous whitespace, and a deep raspberry accent that gives the page warmth and gravity instead of saccharine cuteness.

## Differentiation

A "bloom" signature — a soft radial rose glow with a fine grain overlay behind the hero and section headers — pairs with Fraunces' soft serif to make the page feel hand-made and human, echoing the reuse story.

## Color Palette

| Token      | OKLCH         | Role                                   |
| ---------- | ------------- | -------------------------------------- |
| background | 0.97 0.018 350 | Rose-tinted page wash, light mode      |
| foreground | 0.24 0.045 350 | Deep plum-rose body text               |
| card       | 1.0 0.004 350  | Near-white elevated surfaces           |
| primary    | 0.52 0.185 5   | Deep raspberry CTA (Donar ropa)        |
| accent     | 0.9 0.055 350  | Blush highlight, badges, soft buttons  |
| muted      | 0.94 0.022 350 | Section alternation, quiet panels      |
| success    | 0.6 0.14 155   | Donación / available state             |
| warning    | 0.74 0.14 82   | Intercambio state                      |

## Typography

- Display: Fraunces — hero name, section headings, impact numbers
- Body: Plus Jakarta Sans — paragraphs, labels, UI text
- Mono: JetBrains Mono — small uppercase micro-labels and data tags
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase font-mono`, body `text-base md:text-lg`

## Elevation & Depth

Two rose-tinted shadow tiers (`shadow-soft`, `shadow-elevated`) plus white cards on a rose wash create gentle, warm depth; the bloom radial gradient supplies atmospheric layering without flat backgrounds.

## Structural Zones

| Zone    | Background            | Border      | Notes                                             |
| ------- | --------------------- | ----------- | ------------------------------------------------- |
| Header  | bg-card/95 backdrop-blur | border-b | Sticky, soft shadow on scroll                     |
| Content | bg-background         | —           | Alternate `bg-muted/40` sections and bloom accents |
| Footer  | bg-muted/50           | border-t    | Slogan, nav, and social links                     |

## Spacing & Rhythm

Spacious section gaps (`py-16 md:py-24`), 4/8px micro-spacing, content max-width `container` with 2rem padding; cards use `gap-6` grids for an airy, browsable catalog.

## Component Patterns

- Buttons: pill (`rounded-full`), primary = gradient/solid raspberry with white text, secondary = white with rose border, hover lifts with `shadow-elevated`
- Cards: `rounded-2xl` white surfaces with `shadow-soft`, image area on `bg-muted`, hover scale 1.02
- Badges: pill, mode-coded — Donación (success), Intercambio (warning), Venta (primary)

## Motion

- Entrance: `animate-fade-up` staggered 0.6s ease for hero and section blocks
- Hover: 0.3s `transition-smooth` lift on buttons/cards
- Decorative: `animate-float-slow` on hero image, `animate-bloom-pulse` on the bloom orb

## Constraints

- Spanish-language UI throughout
- Pink must highlight actions without overloading the page — white and soft neutrals carry the layout
- No personal data, addresses, or identifying info in any story or catalog content

## Signature Detail

The "bloom" — a pulsing radial rose glow layered with fine grain behind the hero — a texture/atmosphere signature that makes the reuse story feel warm and crafted.
