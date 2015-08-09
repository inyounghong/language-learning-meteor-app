Meteor.methods({

  'createNewPost': function(postTitle, postText){
    var currentUser = Meteor.userId();
    check(postTitle, String);
    check(postText, String);

    if(postTitle == ""){
      postTitle = "Add a Title";
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

  'updatePost': function(postId, postTitle, postText){
    var currentUser = Meteor.userId();
    var data = {
      _id: postId,
      createdBy: currentUser
    }
    return Posts.update(data, {$set: 
      {
        title: postTitle,
        text: postText
      }
    });
  },

  'deletePost': function(postId){
    var currentUser = Meteor.userId();
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You're not logged-in.");
    }
    var data = {
      _id: postId,
      createdBy: currentUser
    }
    Posts.remove(data);
  }

});