Router.configure({
  layoutTemplate: 'main',
  loadingTemplate: 'loading'
});

Router.route('/register', {
  data: function(){
    return {
      formClass: "registerForm",
      header: "Register",
      username: "",
      email: "",
      buttonName: "Create Account"
    }
  }
});

Router.route('/learn');
Router.route('/login');
Router.route('/accountSettings');
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
    var currentPost = this.params._id;
    var page = this.params.query.page;
    return {
      post: Posts.findOne({_id: currentPost}),
      page: page
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
    console.log("storing???");
    Meteor.call('updatePostPage', this.params._id, parseInt(page));
  },
  waitOn: function(){
    var currentPost = this.params._id;
    Meteor.subscribe('todos', currentPost);
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