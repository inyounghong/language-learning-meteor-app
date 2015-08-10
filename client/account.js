Template.user.helpers({

	// Returns the number of text the user has
	'postCount': function(){
		var userId = Meteor.userId();
		return Posts.find({createdBy: userId}).count();
	},

	'learnedWordCount': function(){
		var userId = Meteor.userId();
		return Translations.find({createdBy: userId, learned: true}).count();
	},

	'totalWordCount': function(){
		var userId = Meteor.userId();
		return Translations.find({createdBy: userId}).count();
	},


});


Template.accountSettings.helpers({

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