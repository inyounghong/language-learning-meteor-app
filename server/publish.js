Meteor.publish('posts', function(){
  var currentUser = this.userId;
  return Posts.find({ createdBy: currentUser});
});

Meteor.publish('todos', function(currentPost){
  var currentUser = this.userId;
  return Todos.find({createdBy: currentUser, postId: currentPost});
});