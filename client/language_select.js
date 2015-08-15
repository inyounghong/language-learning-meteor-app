Template.langSelect.helpers({
    

    
});

Template.startSelect.helpers({
    'setLanguages': function(){
        console.log("this");
        console.log(this);
        console.log(Session.get("postId"));
        var post = Posts.findOne(Session.get("postId"));
        Session.set("startLanguage", post.language);

        var readingList = Readinglists.findOne({post: post._id, createdBy: Meteor.userId()});
        Session.set("endLanguage", readingList.language);

    },
    
    'enSelected': function(){
        if (Session.get("startLanguage") == "en") return "true";
    },

    'deSelected': function(){
        if (Session.get("startLanguage") == "de") return "true";
    },

    'esSelected': function(){
        if (Session.get("startLanguage") == "es") return "true";
    },
});

Template.endSelect.helpers({
    'enSelected': function(){
        if (Session.get("endLanguage") == "en") return "true";
    },

    'deSelected': function(){
        if (Session.get("endLanguage") == "de") return "true";
    },

    'esSelected': function(){
        if (Session.get("endLanguage") == "es") return "true";
    },
})