import Map "mo:core/Map";
import Types "../types/historias";

module {
  // Convierte una historia interna en su vista pública.
  public func toView(story : Types.Story) : Types.StoryView {
    {
      id = story.id;
      title = story.title;
      description = story.description;
      photoUrl = story.photoUrl;
      garmentsDelivered = story.garmentsDelivered;
      deliveredAt = story.deliveredAt;
    };
  };

  // Lista las historias, de la más reciente a la más antigua.
  public func listStories(
    stories : Map.Map<Types.StoryId, Types.Story>,
  ) : [Types.StoryView] {
    let all = stories.values().toArray();
    let sorted = all.sort(func(a, b) = Int.compare(b.deliveredAt, a.deliveredAt));
    sorted.map(func s = toView(s));
  };

  // Obtiene una historia por su identificador.
  public func getStory(
    stories : Map.Map<Types.StoryId, Types.Story>,
    id : Types.StoryId,
  ) : ?Types.StoryView {
    switch (stories.get(id)) {
      case (?s) { ?toView(s) };
      case null { null };
    };
  };

  // Registra una nueva historia y devuelve su vista pública.
  public func addStory(
    stories : Map.Map<Types.StoryId, Types.Story>,
    state : { var nextStoryId : Nat },
    input : Types.NewStory,
  ) : Types.StoryView {
    let id = state.nextStoryId;
    state.nextStoryId := id + 1;
    let story : Types.Story = {
      id = id;
      title = input.title;
      description = input.description;
      photoUrl = input.photoUrl;
      garmentsDelivered = input.garmentsDelivered;
      deliveredAt = input.deliveredAt;
    };
    stories.add(id, story);
    toView(story);
  };
};
