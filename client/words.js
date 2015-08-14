Template.words.helpers({

	// Return unknown words
	'trans': function(){
		var currentUser = Meteor.userId();
		console.log(this.learned);
		return Translations.find({createdBy: currentUser, learned: this.learned}, {sort: {createdAt: -1}});
	},

	'knowMessage': function(){
		if (this.learned){
			return "Don't know!";
		} else {
			return "Know it!";
		}
	},


	'origWord': function(){
		word = Words.findOne(this.word);
		return word.word;
	},

 	'totalLearnedWords': function(){
 		var currentUser = Meteor.userId();
    	return Translations.find({createdBy: currentUser, learned: true}).count();
 	},

 	'totalNewWords': function(){
 		var currentUser = Meteor.userId();
    	return Translations.find({createdBy: currentUser, learned: false}).count();
	
 	},
});

Template.words.events({

	'click .delete-translation':function(){
		Meteor.call('deleteTranslation', this._id);
	},

	'click .know-translation':function(event){
		Meteor.call('updateLearned', $(event.target).text() == "Know it!", this._id);
	}
});