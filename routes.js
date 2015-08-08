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

Router.route('/', {
  name: 'home',
  template: 'home'
});

Router.route('/post/:_id', {
  name: 'post',
  template: 'post',
  data: function(){
    var currentPost = this.params._id;
    var currentUser = Meteor.userId();
    return Posts.findOne({ _id: currentPost, createdBy: currentUser});
  },
  onBeforeAction: function(){
    var currentUser = Meteor.userId();
    // Check if user is logged in
    if (currentUser){
      console.log("logged");
      this.next();
    } else{
      this.render("login");
    }
  },
  waitOn: function(){
    var currentPost = this.params._id;
    Meteor.subscribe('todos', currentPost);
  }
});