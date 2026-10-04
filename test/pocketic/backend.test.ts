import { PocketIc } from "@dfinity/pic";
import type { Actor, CanisterFixture } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";
// Set only on a converted project: the last pre-EM revision, whose schema this
// app's migration chain replays from. Installing the current wasm onto an empty
// canister there traps IC0503 before any test runs.
const BASELINE_WASM = process.env.BACKEND_WASM_BASELINE;

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;
let canisterId: CanisterFixture<_SERVICE>["canisterId"];

// `GarmentFilter` is a Candid record whose fields are all `opt`; the raw
// `@dfinity/pic` actor encodes records literally, so every field must be
// present (`[]` means "no filter"). The generated frontend wrapper fills these
// in, but this lane talks to `idlFactory` directly.
const EMPTY_FILTER = {
  size: [],
  search: [],
  garmentType: [],
  modality: [],
  condition: [],
} as const;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  if (BASELINE_WASM === undefined) {
    ({ actor, canisterId } = await pic.setupCanister<_SERVICE>({
      idlFactory,
      wasm: BACKEND_WASM,
    }));
    return;
  }
  // `[baseline, current]`, the same install contract the hosted deploy uses for
  // a converted project. The upgrade replays the chain from the legacy schema.
  const installed = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BASELINE_WASM,
  });
  await pic.upgradeCanister({
    canisterId: installed.canisterId,
    wasm: BACKEND_WASM,
    arg: new Uint8Array(),
  });
  ({ actor, canisterId } = installed);
});

afterAll(async () => {
  // `?.` because `beforeAll` may not have got that far. A failed
  // `PocketIc.create` otherwise stacks "Cannot read properties of undefined"
  // on top of the real error and buries the one line that explains the run.
  await pic?.tearDown();
});

it("answers empty-state reads instead of trapping", async () => {
  await expect(actor.listGarments(EMPTY_FILTER)).resolves.toEqual([]);
  await expect(actor.listStories()).resolves.toEqual([]);
  await expect(actor.getImpactMetrics()).resolves.toEqual({
    garmentsReused: 0n,
    donationsMade: 0n,
    peopleBenefited: 0n,
  });
});

it("round-trips a garment through the real canister and filters it", async () => {
  const created = await actor.addGarment({
    garmentType: "Camisetas",
    size: "M",
    condition: { buenEstado: null },
    description: "Camiseta de algodón rosa",
    modality: { donacion: null },
    photoUrl: "https://example.test/foto.jpg",
  });
  expect(created.id).toBe(0n);
  expect(created.garmentType).toBe("Camisetas");

  const all = await actor.listGarments(EMPTY_FILTER);
  expect(all).toHaveLength(1);
  expect(all[0]).toMatchObject({ id: 0n, size: "M", garmentType: "Camisetas" });

  const byModality = await actor.listGarments({
    ...EMPTY_FILTER,
    modality: [{ donacion: null }],
  });
  expect(byModality).toHaveLength(1);
  const byOtherModality = await actor.listGarments({
    ...EMPTY_FILTER,
    modality: [{ intercambio: null }],
  });
  expect(byOtherModality).toEqual([]);

  // The remaining accepted filters: size, condition, garment type and text.
  // The raw actor encodes `opt text` literally, so each value is a one-element
  // array (`[]` means "no filter").
  const bySize = await actor.listGarments({ ...EMPTY_FILTER, size: ["m"] });
  expect(bySize).toHaveLength(1);
  const byOtherSize = await actor.listGarments({ ...EMPTY_FILTER, size: ["XL"] });
  expect(byOtherSize).toEqual([]);

  const byCondition = await actor.listGarments({
    ...EMPTY_FILTER,
    condition: [{ buenEstado: null }],
  });
  expect(byCondition).toHaveLength(1);
  const byOtherCondition = await actor.listGarments({
    ...EMPTY_FILTER,
    condition: [{ nueva: null }],
  });
  expect(byOtherCondition).toEqual([]);

  const byType = await actor.listGarments({
    ...EMPTY_FILTER,
    garmentType: ["camis"],
  });
  expect(byType).toHaveLength(1);
  const byOtherType = await actor.listGarments({
    ...EMPTY_FILTER,
    garmentType: ["Vestidos"],
  });
  expect(byOtherType).toEqual([]);

  const bySearch = await actor.listGarments({
    ...EMPTY_FILTER,
    search: ["algodón"],
  });
  expect(bySearch).toHaveLength(1);
  const byOtherSearch = await actor.listGarments({
    ...EMPTY_FILTER,
    search: ["lino"],
  });
  expect(byOtherSearch).toEqual([]);

  const detail = await actor.getGarment(0n);
  expect(detail).toHaveLength(1);
  expect(detail[0]).toMatchObject({ id: 0n, description: "Camiseta de algodón rosa" });

  const missing = await actor.getGarment(99n);
  expect(missing).toEqual([]);
});

it("round-trips a story and reflects it in the impact metrics", async () => {
  const story = await actor.addStory({
    title: "Campaña de invierno",
    description: "Abrigos entregados a familias del barrio.",
    photoUrl: "https://example.test/historia.jpg",
    garmentsDelivered: 12n,
    deliveredAt: 1_700_000_000_000_000_000n,
  });
  expect(story.id).toBe(0n);

  const stories = await actor.listStories();
  expect(stories).toHaveLength(1);
  expect(stories[0]).toMatchObject({ title: "Campaña de invierno", garmentsDelivered: 12n });

  const detail = await actor.getStory(0n);
  expect(detail).toHaveLength(1);
  expect(detail[0]).toMatchObject({ id: 0n, title: "Campaña de invierno" });
  const missing = await actor.getStory(99n);
  expect(missing).toEqual([]);

  const metrics = await actor.getImpactMetrics();
  expect(metrics.peopleBenefited).toBe(12n);
  expect(metrics.garmentsReused).toBe(1n);
  expect(metrics.donationsMade).toBe(1n);
});
