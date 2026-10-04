import Map "mo:core/Map";
import PrendasTypes "../types/prendas";
import HistoriasTypes "../types/historias";
import Types "../types/impacto";

module {
  // Calcula las métricas del proyecto a partir de las prendas y las historias.
  public func getMetrics(
    garments : Map.Map<PrendasTypes.GarmentId, PrendasTypes.Garment>,
    stories : Map.Map<HistoriasTypes.StoryId, HistoriasTypes.Story>,
  ) : Types.ImpactMetrics {
    var donations = 0;
    for (garment in garments.values()) {
      switch (garment.modality) {
        case (#donacion) { donations += 1 };
        case _ {};
      };
    };
    var delivered = 0;
    for (story in stories.values()) {
      delivered += story.garmentsDelivered;
    };
    {
      garmentsReused = garments.size();
      donationsMade = donations;
      peopleBenefited = delivered;
    };
  };
};
