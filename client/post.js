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

                    // Display translation
    				$(event.target).prev().text(translation);

                    // Word does not exist, create it
                    Meteor.call('createWord', word, translation, function(err, res){
                        if (err){
                            console.log(err);
                        }
                        console.log("Word did not exist. Created Word: " + word);
                        Meteor.call('createTranslation', res, context);
                    });

    			}
    		});
        } else {
            // The word exists in the database, so pull that data
            var translation = wordId.translation[0].trans;
            console.log("This word exists in the database with translation: " + translation);
            
            // Display translation
            $(event.target).prev().text(translation);
        }

        var context = getContext($(event.target));

        // Check if translation exists
        console.log("Word: " + word + " exists in Words already!");
        var translationId = Translations.findOne({word: word});

        if (typeof translationId == 'undefined'){

            // If translation doesn't exists 
            // (user hasn't translated that word yet), create it

            console.log("Translation doesn't exist yet. Creating and incrementing");
            Meteor.call('createTranslation', wordId, context);
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

function endsWithPunctuation(word){
    var letter = word.slice(-1);
    return ['.', '!', '"', '?'].indexOf(letter) !== -1
}

function getContext(element){
    var context = [];
    var word = element.text();

    // Grab words before
    var i = 0;
    var el = element.parent().prev();
    while (i < 4 && el.attr("class") == "word-wrap"){
        if (endsWithPunctuation( el.find(".word").text() )){
            break;
        }
        context.unshift( el.find(".word").text() );
        el = el.prev();
        i++;
    }

    // Add the word itself
    context.push( "<b>" + word + "</b> ");

    // Grab words after
    if (!endsWithPunctuation(word)){
        i = 0;
        el = element.parent().next();
        while (i < 4 && el.attr("class") == "word-wrap" ){
            context.push( el.find(".word").text() );
            if (endsWithPunctuation( el.find(".word").text() )){
                break;
            }
            el = el.next();
            i++;
        }
    }

    // Shorted array if needed
    if (context.length > 6){
        context.shift();
        context.pop();
        if (context.length > 6){
            context.shift();
        }
        console.log(context);
    }
    var contextStr = context.join(" ");
    console.log("context is: " + contextStr);
    return contextStr;
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