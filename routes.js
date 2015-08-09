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

Router.route('/login');
Router.route('/profile');
Router.route('/words');

Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/users/:_id',{
  name: 'user',
  template: 'user',
  data: function(){
    return Meteor.users.findOne({_id: this.params._id});
  }
});

Router.route('/post/edit/:_id', {
  name: 'editPost',
  template: 'addPost',
  data: function(){
    return Posts.findOne(this.params._id);
  }
});

Router.route('/post/:_id', {
  name: 'post',
  template: 'post',
  data: function(){
    var currentPost = this.params._id;
    return Posts.findOne({ _id: currentPost});
  },
  onBeforeAction: function(){
    var currentUser = Meteor.userId();
    // Check if user is logged in
    this.next();
    // if (currentUser){
    //   console.log("logged");
    //   this.next();
    // } else{
    //   this.render("login");
    // }
  },
  waitOn: function(){
    var currentPost = this.params._id;
    Meteor.subscribe('todos', currentPost);
  }
});