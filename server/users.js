// Methods for managing users

Meteor.methods({

  'updateAccount': function(name, email){
    var currentUser = Meteor.userId();
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    Meteor.users.update({ _id: currentUser }, {$set: {
      "profile.name": name, 
      'emails.0.address': email
    }});
    return "done";
  }

});