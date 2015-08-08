Template.profile.helpers({

	// Returns current user
	'user': function(){
		var userId = Meteor.userId();
		return user = Meteor.users.findOne(userId);
	},

	

});

// Update account
Template.updateAccount.events({

	'submit form': function(event){
		event.preventDefault();
	    var currentUser = Meteor.userId();

		var email = $('[name="email"]').val();
		var name = $('[name="name"]').val();
		console.log(name);
		Meteor.call('updateAccount', name, email, function(error, result){
			if(error){
				console.log(error);
			}
			console.log(result);
		});
	}
});