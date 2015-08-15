Template.settings.helpers({

    'setLanguageSession': function(){
        var user = Meteor.users.findOne(Meteor.userId());
        // Set session variables
        Session.set("startLanguage", user.profile.startLang);
        Session.set("endLanguage", user.profile.endLang);
    },

});

Template.startSelect.events({
    // When category is selected under browse
    'change #startLanguage': function(event){
        if (Router.current().route._path == "/browse"){
            var lang = $(event.target).val();
            Router.go('/browse?lang=' + lang);
        }
    }
})

Template.startSelect.helpers({
    'setLanguages': function(){

        console.log(Session.get("postId"));
        var post = Posts.findOne(Session.get("postId"));
        Session.set("startLanguage", post.language);

        var readingList = Readinglists.findOne({post: post._id, createdBy: Meteor.userId()});
        Session.set("endLanguage", readingList.language);

    },

    'enSelected': function(){
        if (Session.get("startLanguage") == "en") return "true";
    },
    'zhSelected': function(){
        if (Session.get("startLanguage") == "zh") return "true";
    },
    'frSelected': function(){
        if (Session.get("startLanguage") == "fr") return "true";
    },
    'deSelected': function(){
        if (Session.get("startLanguage") == "de") return "true";
    },
    'itSelected': function(){
        if (Session.get("startLanguage") == "it") return "true";
    },
    'jaSelected': function(){
        if (Session.get("startLanguage") == "ja") return "true";
    },
    'koSelected': function(){
        if (Session.get("startLanguage") == "ko") return "true";
    },
    'ruSelected': function(){
        if (Session.get("startLanguage") == "ru") return "true";
    },
    'esSelected': function(){
        if (Session.get("startLanguage") == "es") return "true";
    },
});

Template.endSelect.helpers({
    'enSelected': function(){
        if (Session.get("endLanguage") == "en") return "true";
    },
    'zhSelected': function(){
        if (Session.get("endLanguage") == "zh") return "true";
    },
    'frSelected': function(){
        if (Session.get("endLanguage") == "fr") return "true";
    },
    'deSelected': function(){
        if (Session.get("endLanguage") == "de") return "true";
    },
    'itSelected': function(){
        if (Session.get("endLanguage") == "it") return "true";
    },
    'jaSelected': function(){
        if (Session.get("endLanguage") == "ja") return "true";
    },
    'koSelected': function(){
        if (Session.get("endLanguage") == "ko") return "true";
    },
    'ruSelected': function(){
        if (Session.get("endLanguage") == "ru") return "true";
    },
    'esSelected': function(){
        if (Session.get("endLanguage") == "es") return "true";
    },
});

