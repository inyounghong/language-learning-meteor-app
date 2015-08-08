Template.addPost.events({
  'submit form':function(event){
    console.log("submitting");
    event.preventDefault();

    var postTitle = $('[name=postTitle]').val();
    var postText = $('[name=postText]').val();

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
});

Template.posts.helpers({
  'post': function(){
    var currentUser = Meteor.userId();
    return Posts.find({createdBy: currentUser}, {sort: {createdAt: -1}});
  }
});
