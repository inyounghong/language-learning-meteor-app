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

      Meteor.call('createNewPost', postTitle, postText, function(error, results){
        if(error){
          console.log(error.reason);
        } else {
          //Router.go('postPage', { _id: results });
          $('[name=postTitle]').val('');
          $('[name=postText]').val('');
        }
      });
    }

  }
});

Template.posts.helpers({
  'post': function(){
    var currentUser = Meteor.userId();
    return Posts.find({createdBy: currentUser}, {sort: {createdAt: -1}});
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

  'uploadedBy': function(){
    var user = Meteor.users.findOne(this.createdBy);
    return user.profile.name;
  },

  'pageCount': function(){
    var post = Posts.findOne(this._id);
    var pageCount = Math.ceil(post.wordCount / 150);
    return pageCount;
  }

});
