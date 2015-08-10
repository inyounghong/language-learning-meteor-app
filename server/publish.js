Meteor.publish('posts', function(){
  var currentUser = this.userId;
  return Posts.find({});
});

Meteor.publish('words', function(){
  return Words.find({});
});

Meteor.publish('readinglists', function(){
  return Readinglists.find({});
});

Meteor.publish('translations', function(){
  var currentUser = this.userId;
  return Translations.find({ createdBy: currentUser});
});

Meteor.publish('todos', function(currentPost){
  var currentUser = this.userId;
  return Todos.find({createdBy: currentUser, postId: currentPost});
});