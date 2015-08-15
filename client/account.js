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

	'currentuser': function(){
		console.log(this)
		return (Meteor.userId() == this.id);
	}
});


Template.settings.helpers({

	// Returns current user
	'user': function(){
		var userId = Meteor.userId();
		return user = Meteor.users.findOne(userId);
	},

    'setLanguageSession': function(){

        var user = Meteor.users.findOne(Meteor.userId());
        // Set session variables
        Session.set("startLanguage", user.profile.startLang);
		Session.set("endLanguage", user.profile.endLang);
    },

});

// Update account
Template.user.events({

	'blur .username': function(event){
		event.preventDefault();
	    var name = $(event.target).val();

		console.log(name);
		Meteor.call('updateAccountName', name, function(error, result){
			if(error){
				console.log(error);
			}
			console.log(result);
		});
	}
});

// Update account
Template.settings.events({

	'submit form': function(event){
		event.preventDefault();
	    var currentUser = Meteor.userId();

	    // Get input values
		var startLang = $('[name="startLanguage"]').val();
		var endLang = $('[name="endLanguage"]').val();

		console.log(name);
		Meteor.call('updateAccount', startLang, endLang, function(error, result){
			if(error){
				console.log(error);
			}
			console.log(result);
			Router.go('bookshelf');
		});
	}
});