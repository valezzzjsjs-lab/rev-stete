import Map "mo:core/Map";
import Types "../types/prendas";
import PrendasLib "../lib/prendas";

mixin (
  garments : Map.Map<Types.GarmentId, Types.Garment>,
  state : { var nextGarmentId : Nat },
) {
  // Catálogo de prendas con filtros por modalidad, talla, estado, tipo y búsqueda.
  public query func listGarments(filter : Types.GarmentFilter) : async [Types.GarmentView] {
    PrendasLib.listGarments(garments, filter);
  };

  // Detalle de una prenda por su identificador.
  public query func getGarment(id : Types.GarmentId) : async ?Types.GarmentView {
    PrendasLib.getGarment(garments, id);
  };

  // Registra una prenda para donación, intercambio o venta.
  public shared ({ caller }) func addGarment(input : Types.NewGarment) : async Types.GarmentView {
    ignore caller;
    PrendasLib.addGarment(garments, state, input);
  };
};
