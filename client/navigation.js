// Logout user
Template.navigation.events({
  'click .logout': function(event){
    event.preventDefault();
    Meteor.logout();
    Router.go('login');
  }
});

Template.navigation.helpers({
	// Returns current user
	'user': function(){
		var userId = Meteor.userId();
		return user = Meteor.users.findOne(userId);
	}
});