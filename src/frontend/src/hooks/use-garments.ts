import {
  type GarmentFilter,
  type GarmentView,
  type NewGarment,
  createActor,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const garmentsQueryKey = (filter: GarmentFilter) =>
  ["garments", filter] as const;

export function useGarments(filter: GarmentFilter) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: garmentsQueryKey(filter),
    queryFn: async (): Promise<GarmentView[]> => {
      if (!actor) return [];
      return actor.listGarments(filter);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGarment(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["garment", id?.toString() ?? "none"],
    queryFn: async (): Promise<GarmentView | null> => {
      if (!actor || id === null) return null;
      return actor.getGarment(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateGarment() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewGarment): Promise<GarmentView> => {
      if (!actor) throw new Error("El backend aún no está listo");
      return actor.addGarment(input);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["garments"] });
      void queryClient.invalidateQueries({ queryKey: ["impact"] });
    },
  });
}
