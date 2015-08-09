Template.post.events({

    // Translates a word
	'click .word':function(event){
		
		var word = clean($(event.target).text());
        console.log("Starting translation for word: " + word);

        // Check database for word
        var wordId = Words.findOne({word: word});

        if(typeof wordId == 'undefined'){
            // If word does not exist, yandex it
    		Meteor.call('yandexCall', word, function(err, res){
    			if (err){
    				console.log("error");
    			} else {
                    // Set translation
    				var translation = res.text[0];
    				console.log(word + " " + translation);
    				$(event.target).prev().text(translation);

                    // Word does not exist, create it
                    Meteor.call('createWord', word, translation, function(err, res){
                        if (err){
                            console.log(err);
                        }
                        console.log("Word did not exist. Created Word: " + word);
                        Meteor.call('createTranslation', res);
                    });

    			}
    		});
        } else {
            // The word exists in the database, so pull that data
            var translation = wordId.translation[0].trans;
            console.log("This word exists in the database with translation: " + translation);
            $(event.target).prev().text(translation);
        }

        // Check if translation exists
        console.log("Word: " + word + "exists already!");
        var translationId = Translations.findOne({word: word});

        if (typeof translationId == 'undefined'){

            // If translation doesn't exists 
            // (user hasn't translated that word yet), create it

            console.log("Translation doesn't exist yet");
            Meteor.call('createTranslation', wordId);
            // +1 to users using that translation
            Meteor.call('incrementUsersOnWord', wordId);
        } else{
            // Translation already exists
            console.log("Translation already exist for this user");
        }
	},


    // Deletes a post
    'click .delete-post':function(event){
        event.preventDefault();
        var id = this._id;
        var confirm = window.confirm("Delete this post?");
        if(confirm){
            Meteor.call('deletePost', id);
            Router.go('home');
        }
    }

});


Template.post.helpers({

    // Converts text into word divs
    'textAfterLoad': function(){
        console.log("ere");
        var post = Posts.findOne(this._id);
        var text = post.text;
        var text_array = text.split(" ");
        var text_string = "";

        for (var i = 0; i< text_array.length; i++){
            var word = text_array[i];

        	text_string += '<div class="word-wrap">';
        	text_string += '<div class="translation"></div>'
        	text_string += '<div class="word">';
        	text_string += word;
        	text_string += "</div></div>";
        }
        return text_string;
    }
});

function clean(word){
    var word = word.replace(/[(),!?'".]/g,'');
    return word;
}

// function yandexCall(text, el, callback){
//   l("starting yandex call");
//   // Make AJAX call to translate API
//   var APIkey = 'trnsl.1.1.20150613T055546Z.e427180336dd7a33.8c5577f75ca831698eb10dac240a7bfa66bc4620';
//   var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + APIkey + '&lang=de-en&text=' + encodeURIComponent(text) ;

//   $.ajax({
//     url: url,
//     method: 'GET',
//     error: function(error) {
//       console.log(error);
//     },
//     success: callback
//   });
// }