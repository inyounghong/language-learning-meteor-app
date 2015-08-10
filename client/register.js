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
                Router.go("home");
            }
        });

        Router.go('home');
    },


});