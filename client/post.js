Template.post.events({
	'click .word':function(event){
		console.log("working");
		var word = $(event.target).text();
		alert(word);
	}
});


Template.post.helpers({
  'textAfterLoad': function(){
    console.log("ere");
    var post = Posts.findOne(this._id);
    var text = post.text;
    var text_array = text.split(" ");
    var text_string = "";

    for (var i = 0; i< text_array.length; i++){
    	text_string += '<div class="word">';
    	text_string += '<div class="translation"></div>'
    	text_string += text_array[i];
    	text_string += "</div>";
    }
    return text_string;
  }
});


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