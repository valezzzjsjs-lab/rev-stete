import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/prendas";

module {
  // Convierte una prenda interna en su vista pública.
  public func toView(garment : Types.Garment) : Types.GarmentView {
    {
      id = garment.id;
      garmentType = garment.garmentType;
      size = garment.size;
      condition = garment.condition;
      description = garment.description;
      modality = garment.modality;
      photoUrl = garment.photoUrl;
      createdAt = garment.createdAt;
    };
  };

  // Comprueba si una prenda cumple todos los filtros activos.
  func matches(garment : Types.Garment, filter : Types.GarmentFilter) : Bool {
    let modalityOk = switch (filter.modality) {
      case (?m) { modalityEqual(garment.modality, m) };
      case null { true };
    };
    let sizeOk = switch (filter.size) {
      case (?s) { garment.size.toLower() == s.toLower() };
      case null { true };
    };
    let conditionOk = switch (filter.condition) {
      case (?c) { conditionEqual(garment.condition, c) };
      case null { true };
    };
    let typeOk = switch (filter.garmentType) {
      case (?t) { garment.garmentType.toLower().contains(#text (t.toLower())) };
      case null { true };
    };
    let searchOk = switch (filter.search) {
      case (?q) {
        let term = q.toLower();
        term == "" or garment.description.toLower().contains(#text term) or garment.garmentType.toLower().contains(#text term);
      };
      case null { true };
    };
    modalityOk and sizeOk and conditionOk and typeOk and searchOk;
  };

  // Igualdad de modalidad (incluye el precio de la venta).
  func modalityEqual(a : Types.Modality, b : Types.Modality) : Bool {
    switch (a, b) {
      case (#donacion, #donacion) { true };
      case (#intercambio, #intercambio) { true };
      case (#venta pa, #venta pb) { pa == pb };
      case _ { false };
    };
  };

  // Igualdad de estado de conservación.
  func conditionEqual(a : Types.Condition, b : Types.Condition) : Bool {
    switch (a, b) {
      case (#nueva, #nueva) { true };
      case (#comoNueva, #comoNueva) { true };
      case (#buenEstado, #buenEstado) { true };
      case (#usada, #usada) { true };
      case _ { false };
    };
  };

  // Lista las prendas que cumplen el filtro, de la más reciente a la más antigua.
  public func listGarments(
    garments : Map.Map<Types.GarmentId, Types.Garment>,
    filter : Types.GarmentFilter,
  ) : [Types.GarmentView] {
    let all = garments.values().toArray();
    let filtered = all.filter(func g = matches(g, filter));
    let sorted = filtered.sort(func(a, b) = Int.compare(b.createdAt, a.createdAt));
    sorted.map(func g = toView(g));
  };

  // Obtiene una prenda por su identificador.
  public func getGarment(
    garments : Map.Map<Types.GarmentId, Types.Garment>,
    id : Types.GarmentId,
  ) : ?Types.GarmentView {
    switch (garments.get(id)) {
      case (?g) { ?toView(g) };
      case null { null };
    };
  };

  // Registra una nueva prenda y devuelve su vista pública.
  public func addGarment(
    garments : Map.Map<Types.GarmentId, Types.Garment>,
    state : { var nextGarmentId : Nat },
    input : Types.NewGarment,
  ) : Types.GarmentView {
    let id = state.nextGarmentId;
    state.nextGarmentId := id + 1;
    let garment : Types.Garment = {
      id = id;
      garmentType = input.garmentType;
      size = input.size;
      condition = input.condition;
      description = input.description;
      modality = input.modality;
      photoUrl = input.photoUrl;
      createdAt = Time.now();
    };
    garments.add(id, garment);
    toView(garment);
  };
};
