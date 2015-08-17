Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

function mustBeLoggedIn(){
  if (! Meteor.userId()) {
    Router.go('login');
  }
  this.next();
}

Router.onBeforeAction(mustBeLoggedIn, {except: ['register', 'home', 'login']});

Router.route('/register', {
  layoutTemplate: 'notLoggedIn',
  data: function(){
    return {
      formClass: "registerForm",
      header: "Register",
      username: "",
      email: "",
      buttonName: "Create Account"
    }
  },
  onBeforeAction: routeToBookshelf
});

Router.route('/learn');
Router.route('/login', {
  layoutTemplate: 'notLoggedIn',
  onBeforeAction: routeToBookshelf
});
Router.route('/settings');
Router.route('/bookshelf', {

});

Router.route('/credits');


Router.route('/browse',{
  name: 'browse',
  data: function(){
    return {all: true};
  }
});

Router.route('/words',{
  data: function(){
    return {learned: false};
  }
});

Router.route('/words/learned', {
  name: 'learned',
  template: 'words',
  data: function(){
    return {learned: true};
  }
});

Router.route('/', {
  name: 'home',
  template: 'home',
  layoutTemplate: 'notLoggedIn'
});

// When no id is specified, go to user's own page.
Router.route('/users',{
  template: 'user',
  data: function(){
    Router.go('user', {_id: Meteor.userId()});
  }
});

Router.route('/user/:_id',{
  name: 'user',
  template: 'user',
  data: function(){
    return Meteor.users.findOne(this.params._id);
  }
});


// Posts

Router.route('/new', {
  name: 'addPost',
  template: 'addPost'
})

Router.route('/post/edit/:_id', {
  name: 'editPost',
  template: 'editPost',
  data: function(){
    return Posts.findOne(this.params._id);
  }
});

Router.route('/post/:_id', {
  name: 'post',
  template: 'post',
  data: function(){
    var postId = this.params._id;
    var page = this.params.query.page;
    var post = Posts.findOne({_id: postId});

    return {
      post: post,
      page: page,
    }
  },
  onBeforeAction: function(){
    var currentUser = Meteor.userId();
    this.next();

    // Redirect invalid pages to the beginning
    var page = this.params.query.page;

    if (invalidPage(page)){
        Router.go('post', {_id: this.params._id}, {query:'page=1'})
    } 

    // Check if user is logged in
    
    // if (currentUser){
    //   console.log("logged");
    //   this.next();
    // } else{
    //   this.render("login");
    // }
  },
  onAfterAction: function(){
    var page = this.params.query.page;
    Meteor.call('updatePostPage', this.params._id, parseInt(page));
    if (Meteor.userId()){
      Meteor.call('updateReadingList', this.params._id);
    }
    
  },
  waitOn: function(){
    var currentPost = this.params._id;
    //Meteor.subscribe('todos', currentPost);
  }
});

// Pagination

function invalidPage(page){
    if (page < 1){
        console.log("Page " + page + " is invalid!");
        return true;
    }
    return false;
}

function routeToBookshelf(){
  if (Meteor.userId()){
    Router.go('bookshelf');
  }
}