var apiCall = function(apiUrl, callback) {
  try {
    var response = HTTP.get(apiUrl).data;
    callback(null, response);
  }
  catch (error){
    callback("error", null);
  }
}




Meteor.methods({
  'yandexCall': function(text, startLang, endLang) {
    this.unblock();
    var APIkey = 'trnsl.1.1.20150613T055546Z.e427180336dd7a33.8c5577f75ca831698eb10dac240a7bfa66bc4620';
    var apiUrl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + APIkey + '&lang=' + startLang + '-' + endLang + '&text=' + encodeURIComponent(text) ;
    var response = Meteor.wrapAsync(apiCall)(apiUrl);
    return response;
  },

  'infoCall': function(word) {
    console.log("making the call");
    this.unblock();
    var url = 'http://www.collinsdictionary.com/dictionary/german-english/' + encodeURIComponent(word) + '?showCookiePolicy=true';
    var page = HTTP.get(url).content;
    // page = page.split('<div class="results">')[1];
    // page = page.split('<div id="dict-example-sentences"')[0];
    page = page.split('_main">')[1];
    page = page.split('<div id="examples_box')[0];
    return page;
  },

  'createPostItem': function(todoName, currentPost){
    check(todoName, String);
    check(currentPost, String);

    var currentUser = Meteor.userId();
    
    var data = {
      name: todoName,
      completed: false,
      createdAt: new Date(),
      createdBy: currentUser,
      postId: currentPost
    }
    var currentPost = Posts.findOne(currentPost);
    if(currentPost.createdBy != currentUser){
      throw new Meteor.Error("invalid-user", "You don't own that post");
    }
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You aren't logged in");
    }
    
    console.log(data);
    return Todos.insert(data);

  },

  'updatePostItem': function(documentId, todoItem){
    check(todoItem, String);
    var currentUser = Meteor.userId();
    var data = { 
      _id: documentId, 
      createdBy: currentUser 
    }
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    Todos.update(data, {$set: {name: todoItem}});
  },

  'changeItemStatus': function(documentId, status){
    check(status, Boolean);
    var currentUser = Meteor.userId();
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    var data = {
      _id: documentId,
      createdBy: currentUser
    }
    Todos.update(data, {$set: {completed: status}});
  },

  'removePostItem': function(documentId){
    var currentUser = Meteor.userId();
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    var data = {
      _id: documentId,
      createdBy: currentUser
    }
    Todos.remove(data);
  },


});
