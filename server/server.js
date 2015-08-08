Meteor.methods({
  'createNewPost': function(postTitle, postText){
    var currentUser = Meteor.userId();
    check(postTitle, String);
    check(postText, String);

    if(postTitle == ""){
      postTitle = defaultName(currentUser);
    }
    var data = {
      title: postTitle,
      text: postText,
      createdBy: currentUser,
      createdAt: new Date()
    }
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You aren't logged in");
    }
    return Posts.insert(data);
  },

  'createPostItem': function(todoName, currentPost){
    console.log("here");
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

  // User account
  'updateAccount': function(name, email){
    var currentUser = Meteor.userId();
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    Meteor.users.update({ _id: currentUser }, {$set: {
      "profile.name": name, 
      'emails.0.address': email
    }});
    return "done";
  }
});

function defaultName(currentUser) {
  var nextLetter = 'A'
  var nextName = 'Post ' + nextLetter;
  while (Posts.findOne({ name: nextName, createdBy: currentUser })) {
      nextLetter = String.fromCharCode(nextLetter.charCodeAt(0) + 1);
      nextName = 'Post ' + nextLetter;
  }
  return nextName;
}