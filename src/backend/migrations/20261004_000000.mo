import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";

module {
  type OldActor = {};

  type Garment = {
    id : Nat;
    garmentType : Text;
    size : Text;
    condition : {
      #nueva;
      #comoNueva;
      #buenEstado;
      #usada;
    };
    description : Text;
    modality : {
      #donacion;
      #intercambio;
      #venta : Nat;
    };
    photoUrl : Text;
    createdAt : Int;
  };

  type Story = {
    id : Nat;
    title : Text;
    description : Text;
    photoUrl : Text;
    garmentsDelivered : Nat;
    deliveredAt : Int;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    garments : Map.Map<Nat, Garment>;
    stories : Map.Map<Nat, Story>;
    garmentState : { var nextGarmentId : Nat };
    storyState : { var nextStoryId : Nat };
  };

  public func migration(_ : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      garments = Map.empty();
      stories = Map.empty();
      garmentState = { var nextGarmentId = 0 };
      storyState = { var nextStoryId = 0 };
    };
  };
};
