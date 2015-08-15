// Methods for managing users

Meteor.methods({

  'updateAccount': function(startLang, endLang){
    var currentUser = Meteor.userId();
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    return Meteor.users.update({ _id: currentUser }, {$set: {
      "profile.startLang": startLang,
      "profile.endLang": endLang
      // 'emails.0.address': email
    }});
  },

  'updateAccountName': function(name){
    var currentUser = Meteor.userId();
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    return Meteor.users.update({ _id: currentUser }, {$set: {
      "profile.name": name,
      // 'emails.0.address': email
    }});
  }



});