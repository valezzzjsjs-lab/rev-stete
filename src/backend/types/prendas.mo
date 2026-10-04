import Common "common";

module {
  public type GarmentId = Common.GarmentId;
  public type Timestamp = Common.Timestamp;

  // Modalidad de la prenda: donación, intercambio o venta.
  public type Modality = {
    #donacion;
    #intercambio;
    #venta : Nat; // precio accesible en unidades enteras
  };

  // Estado de conservación de la prenda.
  public type Condition = {
    #nueva;
    #comoNueva;
    #buenEstado;
    #usada;
  };

  // Prenda tal como se almacena internamente.
  public type Garment = {
    id : GarmentId;
    garmentType : Text;
    size : Text;
    condition : Condition;
    description : Text;
    modality : Modality;
    photoUrl : Text;
    createdAt : Timestamp;
  };

  // Prenda expuesta en la API pública (tipo compartido).
  public type GarmentView = {
    id : GarmentId;
    garmentType : Text;
    size : Text;
    condition : Condition;
    description : Text;
    modality : Modality;
    photoUrl : Text;
    createdAt : Timestamp;
  };

  // Filtros del catálogo.
  public type GarmentFilter = {
    modality : ?Modality;
    size : ?Text;
    condition : ?Condition;
    garmentType : ?Text;
    search : ?Text;
  };

  // Datos para registrar una prenda.
  public type NewGarment = {
    garmentType : Text;
    size : Text;
    condition : Condition;
    description : Text;
    modality : Modality;
    photoUrl : Text;
  };
};
