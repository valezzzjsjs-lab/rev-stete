# Project Guidance

## User Preferences

- Todo el sitio en español
- Diseño moderno, bonito, sencillo y fácil de usar, pensado para jóvenes, estudiantes y familias
- Paleta principal de tonos rosados (rosa pastel, rosa claro y rosa más intenso) combinada con blanco y tonos suaves
- El rosado destaca botones y elementos importantes sin recargar la página
- No publicar datos personales, direcciones ni información que identifique a las personas sin autorización

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Backend bindings expose English method names (listGarments, getGarment, addGarment, listStories, getStory, getImpactMetrics) even when the dispatch contract uses Spanish names; hooks must match backend.d.ts exactly.
- When the backend stores an image as a plain Text field, encode the file with FileReader.readAsDataURL and pass the data URL directly; do not route it through the object-storage StorageClient, whose update method may not be exposed on the deployed canister.
- TanStack Router routes declaring validateSearch require search={{...}} on every Link/navigate to that route; /catalogo is the only such route here.
- OQL manual-mode entities need .sample(...), per-field .payload(...) and a per-table authorization call (.public_()); the primary key must be declared as an explicit .payload column.
- When the deployed .most baseline is an empty actor and two migration files are pending with check-limit=1, fold the earlier pending file's fields into the latest pending file and set its OldActor to {}, then delete the earlier pending file.
- A global @media (prefers-reduced-motion: reduce) block collapsing animation/transition durations neutralizes Tailwind keyframe animations and custom transition utilities in one place.
- Parallel frontend page tasks can collide when the foundation task also writes pages; keep page tasks' file lists non-overlapping and have the foundation own App.tsx routing and nav.
