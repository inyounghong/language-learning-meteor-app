Template.addPost.events({

  // Create/Update new post

  'submit form':function(event){
    event.preventDefault();

    var postTitle = $('[name=postTitle]').val();
    var postText = $('[name=postText]').val();

    // Updating existing post
    if (this._id){
      var id = this._id;
      var post = Posts.findOne(id);

      Meteor.call('updatePost', this._id, postTitle, postText, function(error, results){
        if(error) {
          console.log(error.reason);
        } else {
          Router.go('post', {_id: id}, {query: 'page=' + post.page});
        }
      });

    } else {
      // Make new Post

      Meteor.call('createNewPost', postTitle, postText, function(error, res){
        if(error){
          console.log(error.reason);
        } else {
          //Router.go('postPage', { _id: results });
          $('[name=postTitle]').val('');
          $('[name=postText]').val('');
          console.log(res);
          Meteor.call('createNewReadingList', res, function(error, results){
            if (error){
              console.log(error.reason);
            } else{
              console.log(results);
            }
          });
        }
      });

    }

  }
});

Template.posts.events({

    // When a post is clicked, check whether to store for user
    'click .post':function(event){
        console.log("clicking on" + this._id);

        var currentUser = Meteor.userId();
        if (!match(currentUser, this._id)){

            var list = Readinglists.findOne({createdBy: currentUser, post: this._id});
            
            // Add record if no record exists
            if (typeof list === "undefined"){
                console.log("Adding this post to bookshelf.");
                Meteor.call('createNewReadingList', this._id, function(error, results){
                    if (error){
                        console.log(error.reason);
                    } else{
                        console.log(results);
                    }
                });
            } else {
                // Just update the updatedAt record
                console.log("Updating this post.");
                Meteor.call('updateReadingList', this._id);
            }

            
        }
    }
});


Template.posts.helpers({

  'post': function(){
    // If browsing all
    if (this.all){
      return Posts.find({}, {sort: {createdAt: -1}});
    }
    // If browsing user's own texts
    var currentUser = Meteor.userId();
    //return Posts.find({createdBy: currentUser}, {sort: {createdAt: -1}});
    
    var readinglists = Readinglists.find({createdBy: currentUser}).fetch();
    var post_array = [];
    for (i = 0; i < readinglists.length; i++){
      var postId = readinglists[i].post;
      var post = Posts.findOne(postId);
      post_array.push(post);
    }
    console.log(post_array);
    return post_array;

    // Going to make local Meteor collection
    // ReadingList = new Mongo.Collection(null);
    // var users = Posts.find({};
    // console.log(users);
    // for (var i = 0; i < users.length; i++){
    //     ReadingList.insert(users[i]);
    // }
    // return ReadingList.find({user: currentUser});
  },

    'userCount': function(){
        return Readinglists.find({post: this._id}).count();
    },

  'sampleText': function(){
    var CHARACTER_LIMIT = 200;
    // Get post
    var post = Posts.findOne(this._id);

    // Make array of characters
    var text_array = post.text.split('');
    var end = Math.min(CHARACTER_LIMIT, text_array.length);

    // Loop through array
    var text_string = "";
    for (var i = 0; i < end; i++){
        text_string += text_array[i];
    }
    if (end == CHARACTER_LIMIT){
      text_string += '...';
    }
    return text_string;
  },

  // Post information

  // 'createdByName': function(){
  //   var user = Meteor.users.findOne(this.createdBy);
  //   return user.profile.name;
  // },

  'pageCount': function(){
    var post = Posts.findOne(this._id);
    var pageCount = Math.ceil(post.wordCount / 150);
    return pageCount;
  }

});

// Returns true if post  is owned by given user id
function match(userId, postId){
    var post = Posts.findOne(postId);
    return post.createdBy == userId;
}
