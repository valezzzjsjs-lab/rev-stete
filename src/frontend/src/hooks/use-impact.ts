import { type ImpactMetrics, createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useImpact() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["impact"],
    queryFn: async (): Promise<ImpactMetrics | null> => {
      if (!actor) return null;
      return actor.getImpactMetrics();
    },
    enabled: !!actor && !isFetching,
  });
}
