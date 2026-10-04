import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import OQL "mo:caffeineai-oql";
import Entity "mo:caffeineai-oql/Entity";
import Expose "mo:caffeineai-oql/Expose";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import IntValue "mo:caffeineai-oql/IntValue";
import Map "mo:core/Map";
import PrendasTypes "types/prendas";
import HistoriasTypes "types/historias";
import PrendasApi "mixins/prendas-api";
import HistoriasApi "mixins/historias-api";
import ImpactoApi "mixins/impacto-api";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let garments : Map.Map<PrendasTypes.GarmentId, PrendasTypes.Garment>;
  let stories : Map.Map<HistoriasTypes.StoryId, HistoriasTypes.Story>;
  let garmentState : { var nextGarmentId : Nat };
  let storyState : { var nextStoryId : Nat };

  include MixinAuthorization(accessControlState, null);
  include PrendasApi(garments, garmentState);
  include HistoriasApi(stories, storyState);
  include ImpactoApi(garments, stories);
  include Expose({
    entities = [
      // Catálogo público de prendas. Los campos variante (estado y modalidad)
      // se exponen como texto para que la tabla sea consultable.
      OQL.Entity.manual<PrendasTypes.Garment>(
        "garment",
        func () = garments.values(),
        "Garment",
        "id",
      )
        .sample({
          id = 0;
          garmentType = "";
          size = "";
          condition = #nueva;
          description = "";
          modality = #donacion;
          photoUrl = "";
          createdAt = 0;
        })
        .payload("id", func g = g.id)
        .payload("garmentType", func g = g.garmentType)
        .payload("size", func g = g.size)
        .payload("condition", func g = switch (g.condition) {
          case (#nueva) { "nueva" };
          case (#comoNueva) { "comoNueva" };
          case (#buenEstado) { "buenEstado" };
          case (#usada) { "usada" };
        })
        .payload("description", func g = g.description)
        .payload("modality", func g = switch (g.modality) {
          case (#donacion) { "donacion" };
          case (#intercambio) { "intercambio" };
          case (#venta _) { "venta" };
        })
        .payload("photoUrl", func g = g.photoUrl)
        .payload("createdAt", func g = g.createdAt)
        .public_()
        .build(),
      // Historias ReVístete: contenido público sin datos personales.
      OQL.Entity.manual<HistoriasTypes.Story>(
        "story",
        func () = stories.values(),
        "Story",
        "id",
      )
        .sample({
          id = 0;
          title = "";
          description = "";
          photoUrl = "";
          garmentsDelivered = 0;
          deliveredAt = 0;
        })
        .payload("id", func s = s.id)
        .payload("title", func s = s.title)
        .payload("description", func s = s.description)
        .payload("photoUrl", func s = s.photoUrl)
        .payload("garmentsDelivered", func s = s.garmentsDelivered)
        .payload("deliveredAt", func s = s.deliveredAt)
        .public_()
        .build(),
    ];
  });
};
