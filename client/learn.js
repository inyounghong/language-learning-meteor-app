Template.learn.helpers({
	'word': function(){
		var currentUser = Meteor.userId();
    	var word = Translations.findOne(
 			{
 				createdBy: currentUser, 
    			learned: false
    		}, {sort: {tests: 1}});
    	Session.set('word', word.word);
    	Session.set('translationId', word._id);

    	return word;
 	},

 	'origWord': function(){
		word = Words.findOne(Session.get("word"));
		return word.word;
	},

 	'trans': function(){
 		var word = Session.get('word');
 		var wordObj = Words.findOne({word: word});
 		return wordObj.translation[0].trans;
 	},

 	// Returns number of learned words
 	'learnedWords': function(){
 		return Translations.find({
 			createdBy: Meteor.userId(),
 			learned: true
 		}).count();
 	},

 	// Returns a user's total number of words
 	'totalWords': function(){
 		return Translations.find({
 			createdBy: Meteor.userId()
 		}).count();
 	},
});

Template.learn.events({

	'click .more-info': function(event){
		$('#trans-box').prepend("<img src='/images/loading.gif' id='loading'>");
		var word = Words.findOne(Session.get('word'));

		Meteor.call('infoCall', word.word, function(err, res){
			var page = res;
			$('#temp-container').html(page);

			
			var transSet = new Set();
			// Get translations
			// $('#temp-container .rom').children('.translations').each(function(){

			// 	// Get first of each translation
			// 	var trans = $(this).find('.target').first().text();
			// 	transSet.push(cleanTrans(trans));
			// });
			$('#temp-container .sense_list_item').each(function(){
				if (legitDef( $(this) )){
					var trans = $(this).find('.cit').first().text();
					transSet.add(trans);
				}
			})
			console.log(transSet);
			displayTrans(transSet);
		});

		
	},

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

		$('#trans-info').html("");


		// Increment tests
		var translationId = Session.get('translationId');
		Meteor.call('incrementTests', translationId, function(err, res){
			if(err){
				console.log(err.reason);
			}
		});
	},

	// Mark a card as learned
	'click .mark-learned': function(event){
		Meteor.call('updateLearned', true, Session.get('translationId'));
	},

	// Mark a card as learned
	'click .delete-word': function(event){
		Meteor.call('deleteTranslation', Session.get('translationId'));
	},

	'click .change-translation': function(event){
		var newTrans = $(event.target).prev().text();
		var word = Words.findOne({word: Session.get('word')});
		console.log(Session.get('word'));
		// Add translation to alts
		Meteor.call('addTranslationToWord', word._id, newTrans);
		Meteor.call('changeTranslation', Session.get('translationId'), newTrans);
	},

	'blur .flash-translation': function(event){
		var newTrans = $(event.target).val();
		Meteor.call('changeTranslation', Session.get('translationId'), newTrans);
	}

});

function displayTrans(set){
	// display alt translatins
	set.forEach(function(value){
		$('#trans-info').append('<li><div class="alt">' + value + '</div><div class="change-translation">Use this translation</div></li>');
	});
	// Remove loading
	$('#loading').remove();
}

function cleanTrans(trans){
	var trans = trans.trim().replace(/(\[[^\]]+\]| sb| sth)/g, "");
	console.log(trans);
	return trans;
}

function legitDef(el){
	var prev = el.find('.cit').first().prev();
	if (typeof prev.attr("class") === 'undefined'){
		console.log('undefined');
		return true;
	}
	if (prev.attr("class").indexOf("lbl") != -1){
		return true;
	}
	
}

// function getPart(text){
// 	var last = text.slice(-1);
// 	var partArray = {
// 		"N": "noun",
// 		"B": "verb"
// 	}
// 	return partArray[last];
// }

// function getGender(text){
// 	var last = text.slice(-1);
// 	var genderArray = {
// 		"t": "nt",
// 		"f": "f",
// 		"m": "m"
// 	}
// 	return genderArray[last];
// }