Template.words.helpers({

	// Return unknown words
	'trans': function(){
		var currentUser = Meteor.userId();
		console.log(this.learned);
		var data = {
			createdBy: currentUser, 
			learned: this.learned
		}

		// Get parameters
		var startLang = Session.get("startLangFilter");
		var endLang = Session.get("endLangFilter");



		// If language parameters are set
		if (startLang){
			data["startLang"] = startLang;
		}
		if (endLang){
			data["language"] = endLang;
		}
		console.log(data);
		// Return filtered results
		return Translations.find(data, {sort: {createdAt: -1}});
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
	},

	'change #startLanguage': function(event){
		var startLang = $(event.target).val();
		Session.set("startLangFilter", startLang);
	},

	'change #endLanguage': function(event){
		var endLang = $(event.target).val();
		Session.set("endLangFilter", endLang);
	}
});