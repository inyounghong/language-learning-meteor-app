Template.post.events({

    // Translates a word
	'click .unselected':function(event){

        $(event.target).prev().html("<img src='/images/loading.gif'>");
		
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
                    $(event.target).removeClass("unselected").addClass("selected");

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
            $(event.target).removeClass("unselected").addClass("selected");
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

    // Clicking an already selected words hides the translation
    'click .selected': function(event){
        $(event.target).prev().text("");
        $(event.target).addClass("unselected").removeClass("selected");
    },


    // Deletes a post
    'click .delete-post':function(event){
        event.preventDefault();
        var id = this.post._id;
        var confirm = window.confirm("Delete this post?");
        if(confirm){
            Meteor.call('deletePost', id);
            Router.go('home');
        }
    },


    // Prevents disabled buttons from being clicked
    'click .disabled': function(event){
        console.log("clicked disabled");
        event.preventDefault();
    }

});


Template.post.helpers({

    'readerCount': function(){

    },

    'prev': function(){
        return parseInt(this.page) - 1;
    },

    'next': function(){
        return parseInt(this.page) + 1;
    },

    'prevDisabled': function(){
        var currentPage = parseInt(this.page);
        if (currentPage == 1){
            return 'disabled';
        }
        else{
            return 'enabled';
        }
    },

    'nextDisabled': function(){

    },

    // Converts text into word divs
    'textAfterLoad': function(){

        // Calculate pages
        var WORDS_PER_PAGE = 150;
        var start = (parseInt(this.page) - 1) * WORDS_PER_PAGE;

        // End is the smallest: full end or word count
        var end = Math.min(start + WORDS_PER_PAGE, this.post.wordCount);

        // If on last page, disable next button
        if (end == this.post.wordCount){
            console.log("Next page disabled");
            $('#next-page').attr("class", "pagination disabled");
        }
        else{
            $('#next-page').attr("class", "pagination enabled");
        }

        // Grab and split text
        var text = this.post.text;
        var text_array = text.split(" ");
        var text_string = "";

        // Loop through a page's words
        for (var i = start; i < end; i++){
            var word = text_array[i];

            // Check if <br> should be added
            if (containsLineBreaks(word)){
                word = removeLineBreaks(word);
                text_string += '<br><br>';
            }
            // Continue if word is not empty
            if (!wordIsEmpty(word)){
                text_string += createWordElement(word);
            }
        	
        }
        return text_string;
    },

    'titleText': function(){
        var title = this.post.title;
        var title_array = title.split(" ");
        var text_string = "";

        for (var i = 0; i < title_array.length; i++){
            var word = title_array[i];

            // Continue if word is not empty
            if (!wordIsEmpty(word)){
                text_string += createWordElement(word);
            }
            
        }
        return text_string;
    },

    // Returns true if user is current user
    'userself': function(){
        console.log(this.post.createdBy);
        console.log(Meteor.userId());
        return this.post.createdBy == Meteor.userId();
    }
});

// Creates a word element
function createWordElement(word){
    var str = '';
    str += '<div class="word-wrap">';
    str += '<div class="translation"></div>'
    str += '<div class="word unselected">';
    str += word;
    str += "</div></div>";
    return str;
}
// Cleaning word

function clean(word){
    var word = word.replace(/[(),!?".\[\]~@#$%^&*<>:;}{\\\/}]/g,'');
    return word;
}

// Returns whether word contains line breaks
function containsLineBreaks(word){
    return /\r|\n/.exec(word);
}

// Returns word without line breaks
function removeLineBreaks(word){
    return word.replace(/(\r\n|\n|\r)/gm,"");
}

// Returns true if word is empty, and should not be displayed
function wordIsEmpty(word){
    if (word == '' || word == " "){
        return true;
    }
}

// Making text

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