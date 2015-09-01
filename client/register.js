// Create new user -> Settings

Template.register.events({

    'submit form': function(){
        event.preventDefault();

        var name = $('[name=name]').val();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();

        Accounts.createUser({
            profile:{
                name: name
            },
            email: email,
            password: password
        }, function(error){
            if(error){
                console.log(error);
            } else{
                console.log("going to settings");
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


});

Template.home.helpers({
    'currentuser' : function(){
        if (Meteor.userId()){
            return true;
        }
    }
})