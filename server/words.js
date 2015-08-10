Meteor.methods({

    'createWord': function(word, translation){
        var currentUser = Meteor.userId();

        // Insert into Words
        var data = {
            word: word,
            translation: [
                { trans: translation, users: 1}
            ]
        }
        // Return wordId
        return Words.insert(data); 

        
    },

    'incrementUsersOnWord': function(wordId){
        var currentUser = Meteor.userId();
        var data = { 
          _id: wordId
        }
        // User should be logged in
        if(currentUser){
            Words.update(data, {$inc: {users: 1}});
        }
    },

    // Create translation
    'createTranslation': function(wordId, context){
        var currentUser = Meteor.userId();
        var word = Words.findOne(wordId).word;
        //Insert into Translations
        var data = {
            createdBy: currentUser,
            word: word,
            translationIndex: 0,
            context: context,
            learned: false,
            createdAt: new Date()
        }

        return Translations.insert(data);
    },

    // Delete translation
    'deleteTranslation': function(translationId) {
        var currentUser = Meteor.userId();
        var data = {
            createdBy: currentUser,
            _id: translationId
        }
        Translations.remove(data);
    },

    'updateLearned': function(isLearned, translationId){
        var currentUser = Meteor.userId();
        var data = { 
          _id: translationId,
          createdBy: currentUser
        }
        Translations.update(data, {$set: {learned: isLearned}});
    },

});