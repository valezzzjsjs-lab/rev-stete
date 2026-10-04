import { type StoryView, createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";

export function useStories() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["stories"],
    queryFn: async (): Promise<StoryView[]> => {
      if (!actor) return [];
      return actor.listStories();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStory(id: bigint | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["story", id?.toString() ?? "none"],
    queryFn: async (): Promise<StoryView | null> => {
      if (!actor || id === null) return null;
      return actor.getStory(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}
