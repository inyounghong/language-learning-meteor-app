Template.words.helpers({

	// Return all of user's translations for each loop
	'translation': function(){
		var currentUser = Meteor.userId();
		return Translations.find({createdBy: currentUser}, {sort: {createdAt: -1}});
	},

	// returns a translation for table
 	'trans': function(){
 		index = this.translationIndex;
 		var word = this.word;
 		var wordObj = Words.findOne({word: word});
 		console.log(wordObj);
 		return wordObj.translation[0].trans;
 	},

 	'totalWords': function(){
 		var currentUser = Meteor.userId();
    	return Translations.find({createdBy: currentUser}).count();
 	}
});

Template.words.events({

	'click .delete-translation':function(){
		Meteor.call('deleteTranslation', this._id);
	}
});