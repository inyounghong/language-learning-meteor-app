Template.login.onRendered(function(){
  $('.login').validate({
    rules: {
      email:{
        email: true
      },
      password:{
        minlength: 6
      }
    }
  });
});

// Login user
Template.login.events({
  'submit form': function(event){
    event.preventDefault();
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();
    Meteor.loginWithPassword(email, password, function(error){
      if(error){
        console.log(error.reason);
      }
      else{
        var currentRoute = Router.current().route.getName();
        if (currentRoute == 'login'){
          Router.go("home");
        }
        
      }
    });
  },

  'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({
          requestPermissions: ['email']
        }, function(err, res){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            } else {
              console.log(res);
              Router.go("settings");
            }

        });
    },
 
    'click #logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
});