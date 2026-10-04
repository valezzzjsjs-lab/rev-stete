import Map "mo:core/Map";
import PrendasTypes "../types/prendas";
import HistoriasTypes "../types/historias";
import Types "../types/impacto";
import ImpactoLib "../lib/impacto";

mixin (
  garments : Map.Map<PrendasTypes.GarmentId, PrendasTypes.Garment>,
  stories : Map.Map<HistoriasTypes.StoryId, HistoriasTypes.Story>,
) {
  // Métricas del proyecto: prendas reutilizadas, donaciones y personas beneficiadas.
  public query func getImpactMetrics() : async Types.ImpactMetrics {
    ImpactoLib.getMetrics(garments, stories);
  };
};
