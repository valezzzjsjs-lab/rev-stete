import Common "common";

module {
  public type StoryId = Common.StoryId;
  public type Timestamp = Common.Timestamp;

  // Caso de ayuda de "Historias ReVístete". Sin datos personales.
  public type Story = {
    id : StoryId;
    title : Text;
    description : Text;
    photoUrl : Text;
    garmentsDelivered : Nat;
    deliveredAt : Timestamp;
  };

  public type StoryView = {
    id : StoryId;
    title : Text;
    description : Text;
    photoUrl : Text;
    garmentsDelivered : Nat;
    deliveredAt : Timestamp;
  };

  public type NewStory = {
    title : Text;
    description : Text;
    photoUrl : Text;
    garmentsDelivered : Nat;
    deliveredAt : Timestamp;
  };
};
