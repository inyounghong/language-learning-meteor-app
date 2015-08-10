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
      wordCount: getWordCount(postText),
      page: 1,
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
        text: postText,
        wordCount: getWordCount(postText)
      }
    });
  },

  // 'addUserToPost': function(userId, postId){
  //   var data = {
  //     _id: postId
  //   }
  //   return Posts.update(data, {$push: 
  //     {
  //       users: {
  //         user: userId,
  //         updatedAt: new Date()
  //       }
  //     }
  //   });
  // },

  // Updated stored page count
  'updatePostPage': function(postId, page){
    var currentUser = Meteor.userId();
    var data = {
      _id: postId,
      createdBy: currentUser
    }
    // Update count 
    return Posts.update(data, {$set:
      {
        page: page
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
  },

  // Reading lists

  'createNewReadingList': function(postId){
    var currentUser = Meteor.userId();

    var data = {
      post: postId,
      page: 1,
      createdBy: currentUser,
      updatedAt: new Date()
    }
    if(!currentUser){
      throw new Meteor.Error("not-logged-in", "You aren't logged in");
    }
    return Readinglists.insert(data);
  },

  'updateReadingList': function(postId){
    var data = {
      _id: postId,
      createdBy: Meteor.userId()
    }
    return Readinglists.update(data, {$set: 
      {
        updatedAt: new Date()
      }
    });
  }

});


// Get word count
function getWordCount(text){
  text_array = text.split(" ");
  return text_array.length;
}