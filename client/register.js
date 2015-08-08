Template.register.events({

  'submit form': function(){
    event.preventDefault();

    var username = $('[name=username]').val();
    var email = $('[name=email]').val();
    var password = $('[name=password]').val();

    Accounts.createUser({
      username: username,
      email: email,
      password: password
    }, function(error){
      if(error){
        console.log(error);
      } else{
        Router.go("home");
      }
    });

    Router.go('home');
  },

  

});