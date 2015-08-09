Template.words.helpers({
  'translation': function(){
    var currentUser = Meteor.userId();
    return Translations.find({createdBy: currentUser}/*, {sort: {createdAt: -1}}*/);
  },



 	'trans': function(){
 		index = this.translationIndex;
 		var word = this.word;
 		var wordObj = Words.findOne({word: word});
 		console.log(wordObj);
 		return wordObj.translation[0].trans;
 	}
});
