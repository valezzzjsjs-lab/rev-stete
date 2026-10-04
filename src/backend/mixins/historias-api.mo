import Map "mo:core/Map";
import Types "../types/historias";
import HistoriasLib "../lib/historias";

mixin (
  stories : Map.Map<Types.StoryId, Types.Story>,
  state : { var nextStoryId : Nat },
) {
  // Galería de casos de ayuda de "Historias ReVístete".
  public query func listStories() : async [Types.StoryView] {
    HistoriasLib.listStories(stories);
  };

  // Detalle de una historia por su identificador.
  public query func getStory(id : Types.StoryId) : async ?Types.StoryView {
    HistoriasLib.getStory(stories, id);
  };

  // Registra un caso de ayuda (sin datos personales).
  public shared ({ caller }) func addStory(input : Types.NewStory) : async Types.StoryView {
    ignore caller;
    HistoriasLib.addStory(stories, state, input);
  };
};
