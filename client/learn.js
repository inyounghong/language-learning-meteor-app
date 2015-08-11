Template.learn.helpers({
	'word': function(){
		var currentUser = Meteor.userId();
    	var word = Translations.findOne(
 			{
 				createdBy: currentUser, 
    			learned: false
    		}, {sort: {tests: 1}});
    	Session.set('word', word.word);
    	Session.set('wordId', word._id);
    	return word;
 	},

 	'trans': function(){
 		var word = Session.get('word');
 		var wordObj = Words.findOne({word: word});
 		return wordObj.translation[0].trans;
 	}
});

Template.learn.events({

	// Show translation
	'click #translation-button': function(event){

		// Display translation
		$('.flash-translation').css("opacity", "1");

		// Change button to next
		$(event.target).attr('id', 'next-button');
		$(event.target).text('Next Card');
	},

	// Get next card
	'click #next-button': function(event){
		$('.flash-translation').css("opacity", "0");

		// Change button to next
		$(event.target).attr('id', 'translation-button');
		$(event.target).text('Translate');

		// Increment tests
		var wordId = Session.get('wordId');
		Meteor.call('incrementTests', wordId, function(err, res){
			if(err){
				console.log(err.reason);
			}
		});
	},

	// Mark a card as learned
	'click .mark-learned': function(event){
		Meteor.call('updateLearned', true, Session.get('wordId'));
	}

});