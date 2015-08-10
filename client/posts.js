Template.editPost.events({

    'submit form': function(event){
        event.preventDefault();

        var postTitle = $('[name=postTitle]').val();
        var postText = $('[name=postText]').val();

        // Update existing post
        var id = this._id;
        var post = Posts.findOne(id);

        Meteor.call('updatePost', this._id, postTitle, postText, function(error, results){
            if(error) {
                console.log(error.reason);
            } else {
                Router.go('post', {_id: id}, {query: 'page=' + post.page});
            }
        });
    }
    
});

Template.addPost.events({

  // Create/Update new post

  'submit form':function(event){
    event.preventDefault();

    var postTitle = $('[name=postTitle]').val();
    var postText = $('[name=postText]').val();

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
                Meteor.call('updateReadingList', list._id);
            }

            
        }
    }
});

Template.postItem.helpers({
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
})


Template.posts.helpers({

    'allPosts': function(){

        // If browsing all, just return all posts
        if (this.all){
          return Posts.find({}, {sort: {createdAt: -1}});
        }

    },

    'todayPost': function(){
        var currentUser = Meteor.userId();

        // Query for today's posts onlu
        var readinglists = Readinglists.find(
            {
                createdBy: currentUser, 
                updatedAt: { $gte : new Date(new Date().setHours(0,0,0,0))}
            }, 
            {sort: {updatedAt: -1}}).fetch();

        // Push into post_array
        var post_array = [];
        for (i = 0; i < readinglists.length; i++){
            var post = Posts.findOne(readinglists[i].post);
            post_array.push(post);
        }
        return post_array;
    },

    'yesterdayPost': function(){
        var currentUser = Meteor.userId();

        // Query for today's posts onlu
        var readinglists = Readinglists.find(
            {
                createdBy: currentUser, 
                updatedAt: { 
                    $gte : new Date(new Date().setHours(0,0,0,0) - 86400000),
                    $lt : new Date(new Date().setHours(0,0,0,0))
                }
            }, 
            {sort: {updatedAt: -1}}).fetch();

        // Push into post_array
        var post_array = [];
        for (i = 0; i < readinglists.length; i++){
            var post = Posts.findOne(readinglists[i].post);
            post_array.push(post);
        }
        return post_array;
    },

    'oneWeekPost': function(){
        var currentUser = Meteor.userId();

        // Query for today's posts onlu
        var readinglists = Readinglists.find(
            {
                createdBy: currentUser, 
                updatedAt: { 
                    $gte : new Date(new Date().setHours(0,0,0,0) - (86400000 * 7)),
                    $lt : new Date(new Date().setHours(0,0,0,0) - 86400000)
                }
            }, 
            {sort: {updatedAt: -1}}).fetch();

        // Push into post_array
        var post_array = [];
        for (i = 0; i < readinglists.length; i++){
            var post = Posts.findOne(readinglists[i].post);
            post_array.push(post);
        }
        return post_array;
    },

    'oldPost': function(){
        var currentUser = Meteor.userId();

        // Query for today's posts onlu
        var readinglists = Readinglists.find(
            {
                createdBy: currentUser, 
                updatedAt: { 
                    $lt : new Date(new Date().setHours(0,0,0,0) - (86400000 * 7)),
                }
            }, 
            {sort: {updatedAt: -1}}).fetch();

        // Push into post_array
        var post_array = [];
        for (i = 0; i < readinglists.length; i++){
            var post = Posts.findOne(readinglists[i].post);
            post_array.push(post);
        }
        return post_array;
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

