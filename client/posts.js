Template.addPost.events({
  'submit form':function(event){
    event.preventDefault();

    var postTitle = $('[name=postTitle]').val();
    var postText = $('[name=postText]').val();

    // Updating existing post
    if (this._id){
      var id = this._id;

      Meteor.call('updatePost', this._id, postTitle, postText, function(error, results){
        if(error) {
          console.log(error.reason);
        } else {
          Router.go('post', {_id: id});
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
  }
});
