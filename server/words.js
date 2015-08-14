Meteor.methods({

    'createWord': function(word, translation, startLang, endLang){
        var currentUser = Meteor.userId();

        if (!word || !translation){
            throw new Meteor.Error("invalid-word-parameters");
        }

        // Insert into Words
        var data = {
            word: word,
            language: startLang,
        }
        data[endLang] = translation;
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

    'addTranslationToWord': function(wordId, trans, endLang){

        var data = { 
          _id: wordId
        }
        var set = {};
        set[endLang] = trans;
        return Words.update(data, {$set: set } );

    },

    'changeTranslation': function(translationId, trans){
        var currentUser = Meteor.userId();
        var data = { 
          _id: translationId,
          createdBy: currentUser
        }
        Translations.update(data, {$set: {translation: trans}});
    },

    // Create translation
    'createTranslation': function(wordId, startLang, endLang, translation, context){
        var currentUser = Meteor.userId();

        //Insert into Translations
        var data = {
            createdBy: currentUser,
            word: wordId,
            language: endLang,
            translation: translation,
            startLang: startLang,
            context: context,
            learned: false,
            createdAt: new Date(),
            tests: 0
        }

        return Translations.insert(data);
    },

    'incrementTests': function(wordId){
        var currentUser = Meteor.userId();
        var data = { 
          _id: wordId,
          createdBy: currentUser
        }
        Translations.update(data, {$inc: {tests: 1}});
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