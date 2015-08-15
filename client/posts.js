Template.editPost.events({

    'submit form': function(event){
        event.preventDefault();

        // Get input data
        var postTitle = $('[name=postTitle]').val();
        var postText = $('[name=postText]').val();
        var startLang = $('[name=startLanguage]').val();
        var endLang = $('[name=endLanguage]').val();

        // Update existing post
        var postId = this._id;
        var post = Posts.findOne(postId);

        // Update post
        Meteor.call('updatePost', this._id, postTitle, postText, startLang, function(error, results){
            if(error) {
                console.log(error.reason);
            } else {

                // Update reading list with end language
                Meteor.call('updateReadingListLang', postId, endLang, function(err, res){
                    if(!err){
                        console.log("res: " + res);
                    } else{
                        console.log(err);
                    }
                });
                Router.go('post', {_id: postId}, {query: 'page=' + post.page});
            }
        });
        
    }
    
});

Template.addPost.events({

  // Create

  'submit form':function(event){
    event.preventDefault();

    var postTitle = $('[name=postTitle]').val();
    var postText = $('[name=postText]').val();
    var startLang = $('[name=startlanguage]').val();
    var endLang = $('[name=endlanguage]').val();

      // Make new Post

      Meteor.call('createNewPost', postTitle, postText, startLang, function(error, postId){
        if(error){
          console.log(error.reason);
        } else {
            var postId = postId;
          //Router.go('postPage', { _id: results });
          $('[name=postTitle]').val('');
          $('[name=postText]').val('');
          console.log(postId);
          // Create Reading list
          Meteor.call('createNewReadingList', postId, endLang, function(error, results){
            if (error){
              console.log(error.reason);
            } else{
              console.log(results);
              Router.go('/post/' + postId + '?page=1');
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

    // Returns true if there are no posts by the user.
    'noPost': function(){
        if (Readinglists.find({createdBy: Meteor.userId()}).count() == 0 && !this.all){
            return true;
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


Template.editPost.helpers({
    'setPostId': function(){
        Session.set("postId", this._id);
        console.log("set to " + this._id);
    }
});




// Returns true if post  is owned by given user id
function match(userId, postId){
    var post = Posts.findOne(postId);
    return post.createdBy == userId;
}

