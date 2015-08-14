Template.post.events({

    // Translates a word
	'click .unselected':function(event){

        $(event.target).prev().html("<img src='/images/loading.gif'>");

        // Get session variables
		var startLang = Session.get("startLang");
        var endLang = Session.get("endLang");

        // Get actual word
		var word = clean($(event.target).text());
        console.log("Starting translation for word: " + word + " from " +startLang + endLang);

        var context = getContext($(event.target));

        var translation = "";

        // Check if word exists using word and languagae

        var wordObj = Words.findOne({word: word, language: startLang});

        if(typeof wordObj === 'undefined' || typeof wordObj[endLang] === 'undefined'){
            // If word does not exist, or de does not exist yandex it

            console.log("Word/translation does not exist. Making Yandex CAll");
                
            Meteor.call('yandexCall', word, startLang, endLang, function(err, res){
                if (err){
                    console.log("error");
                } else {
                    // Set translation for Word
                    translation = res.text[0];
                    console.log("response: " + translation);
                    var wordId = "";

                    if(typeof wordObj === 'undefined'){
                        console.log("Word does not exist. Creating");
                        // Word does not exist, create it
                        Meteor.call('createWord', word, translation, startLang, endLang, function(err, res){
                            if (!err){
                                wordId = res;
                                // This can't move: No translation exists, so create it
                                console.log("Creating Translation" + wordId + translation + context);
                                Meteor.call('createTranslation', wordId, translation, context);
                            }
                        });                    
                    } else {
                        // Word exists, but need to append translation
                        console.log("Word exists, but need to append translation");
                        wordId = wordObj._id;
                        Meteor.call('addTranslationToWord', wordId, translation, endLang); 

                        console.log("Creating Translation" + wordId + translation + context);
                        Meteor.call('createTranslation', wordId, translation, context);                   
                    }

                    // Display translation
                    console.log("Trying to display translation" + translation);
                    $(event.target).prev().text(translation);
                    $(event.target).removeClass("unselected").addClass("selected");
                }
            });
        } else {
            // Word and translation both exists
            var wordId = wordObj._id;
            console.log("word id" + wordId);
            var transObj = Translations.findOne({word: wordId });
            if (typeof transObj === 'undefined'){
                // User does not have a translation, must pull from word data
                console.log("User does not have own translation. Pulling data from word");
                translation = wordObj.endLang;
                console.log(translation);

                // Create translation
                console.log("Creating Translation" + wordId + translation + context);
                Meteor.call('createTranslation', wordId, translation, context);

            } else {
                console.log(transObj);
                translation = transObj.translation;
            }

            // Display translation
            console.log("Trying to display translation" + translation);
            $(event.target).prev().text(translation);
            $(event.target).removeClass("unselected").addClass("selected");
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
            Meteor.call('deletePost', id, function(err, res){
                if (!err){
                    Router.go('home');
                    Meteor.call('deleteReadingForPost', id);
                }
                
            });
            
        }
    },


    // Prevents disabled buttons from being clicked
    'click .disabled': function(event){
        console.log("clicked disabled");
        event.preventDefault();
    }

});


Template.post.helpers({

    'selected': function(){
        // Set starting select
        var startLang = this.post.language;
        document.getElementById(startLang).attr("selected", true);

        // Set ending select
        var readingList = Readinglists.findOne({
            createdBy: Meteor.userId(),
            post: this.post._id
        });
        console.log(readingList);

        var endLang = readingList.language;
        $('#' + endLang).attr("selected", true);

        console.log(startLang + endLang);
    },

    'startLang': function(){
        var startLang = this.post.language;
        console.log("rhis post");
        console.log(this.post);
        Session.set("startLang", startLang);
        return startLang;
    },

    'endLang': function(){
        var readingList = Readinglists.findOne({post: this.post._id});
        var endLang = readingList.language;
        Session.set("endLang", endLang);
        return endLang;
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

    'disableNext': function(){
        return Session.get('disableNext');
    },

    // Converts text into word divs
    'textAfterLoad': function(){

        Session.set('disableNext', "");

        // Calculate pages
        var WORDS_PER_PAGE = 150;
        var start = (parseInt(this.page) - 1) * WORDS_PER_PAGE;

        // End is the smallest: full end or word count
        var end = Math.min(start + WORDS_PER_PAGE, this.post.wordCount);

        // If on last page, disable next button
        if (end == this.post.wordCount){
            console.log("Next page disabled");
            Session.set('disableNext', "disabled");
        }
        else{
            Session.set('disableNext', "");
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

    // Check end before and after
    var endBefore = false;
    var endAfter = false;

    // Grab words before
    var i = 0;
    var el = element.parent().prev();
    while (i < 4 && el.attr("class") == "word-wrap"){
        if (endsWithPunctuation( el.find(".word").text() )){
            endBefore = true;
            break;
        }
        context.unshift( el.find(".word").text() );
        // Add ... if interrupted
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
                endAfter = true;
                break;
            }
            el = el.next();
            i++;
        }
    }

    var contextStr = context.join(" ")

    if (!endBefore){
        context.shift();
        contextStr = "... " + contextStr;
    }
    if (!endAfter) {
        context.pop();
        contextStr = contextStr + " ...";
    }
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