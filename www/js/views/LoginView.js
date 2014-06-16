app.views.LoginView = Backbone.View.extend({

    initialize : function() {
        this.info = new app.models.UserModel();
        var userInfo = this.info;
        this.info.fetch({reset: true}).done(function(data)
        {
            if( userInfo.get("LoggedIn")){
                Backbone.$("#txt_username").attr("value",userInfo.get("Username"));
                Backbone.$("#txt_password").attr("value","*********");
            }
        });
    },

    render : function() {
        this.$el.html(this.template());
        return this;
    },

    events : {
        "click #btn_login" : "loginEvent",
        "click #btn_registry" : "registerEvent",
        "click #btn_offline" : "offlineEvent",
        "keyup #txt_username" : "setUsername",
    },

   
    
    loginEvent: function(event) {

        var username = this.info.get("Username");
        var password = Backbone.$("#txt_password").val();
        
        
        if ( app.LastLogged && this.info.get("LoggedIn") && app.LastLogged == username ){
             app.router.Authenticated = true;
             Backbone.history.navigate('home', true);
        }
        else{
            $.post(app.serverAddr+"/Account/LoginS", {
                username : username,
                password : password,
                RememberMe:  true
            }, function(data, text, xhr) {
                if (data.success == true) {
                    app.loginView.info.set("LoggedIn", true);
                    app.loginView.info.set("PasswordHash", data.passwordHash);
                    app.loginView.info.save().done(function(){
                        app.router.Authenticated = true;
                        Backbone.history.navigate('home', true);
                    });
                
                }
                else{
                    alert('Uuário não cadastrado');
                }
            });
        }
    },
    
    registerEvent: function(event) {
        alert('Não implementado!', Error);
        return this;
    },

    
    setUsername: function(event)
    {
        this.info.set("Username", Backbone.$("#txt_username").val());
    },
    
    offlineEvent: function(event){
        this.info = null;
        app.router.Authenticated = false;
        Backbone.history.navigate('home', true);
        
    }
    
    
}); 
