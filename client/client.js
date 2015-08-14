Meteor.subscribe('posts');
Meteor.subscribe('translations');
Meteor.subscribe('words');
Meteor.subscribe('readinglists');
Meteor.subscribe('facebookEmail');

Template.todos.helpers({
  'todo': function(){
    var currentPost = this._id
    var currentUser = Meteor.userId();
    return Todos.find({ postId: currentPost, createdBy: currentUser }, {sort: {createdAt: -1}});
  }
});

Template.addTodo.events({
  'submit form':function(event){
    event.preventDefault();
    var currentPost = this._id;
    var todoName = $('[name="todoName"]').val();
    Meteor.call('createPostItem', todoName, currentPost, function(error){
      console.log("here now");
      if(error){
        console.log(error.reason);
      } else{
        $('[name="todoName"]').val('');
      }
    });
  }
});

Template.todoItem.helpers({
  'checked': function(){
    var isCompleted = this.completed;
    if (isCompleted){
      return "checked";
    }
    return "";
  }
})

Template.todoItem.events({
  'keyup [name=todoItem]': function(event){
    if(event.which == 13 || event.which == 27){
      $(event.target).blur();
    }
    else{
      var documentId = this._id;
      var todoItem = $(event.target).val();
      Meteor.call('updatePostItem', documentId, todoItem);
    }
  },

  'click .delete-todo': function(event){
    event.preventDefault();
    var documentId = this._id;
    var confirm = window.confirm("Delete this task?");
    if(confirm){
      Meteor.call('removePostItem', documentId);
    }
  },

  'change [type=checkbox]':function(){
    var documentId = this._id;
    var isCompleted = this.completed;
    console.log(isCompleted);
    Meteor.call('changeItemStatus', documentId, !isCompleted);
  }

  
});

Template.todosCount.helpers({
  'totalTodos': function(){
    var currentPost = this._id;
    return Todos.find({postId: currentPost}).count();
  },
  'completedTodos': function(){
    var currentPost = this._id;
    return Todos.find({postId: currentPost, completed: true}).count();
  }
});



