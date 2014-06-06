app.views.LoginView = Backbone.View.extend({

    initialize : function() {
        this.info = new app.models.UserModel();
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

        var username = this.info.get("username");
        var password = Backbone.$("#txt_password").val();

        $.post(app.serverAddr+"/Account/LoginS", {
            username : username,
            password : password,
            RememberMe:  true
        }, function(data, text, xhr) {
            if (data.success == true) {
                app.loginView.info.set("logged_in", true);
                app.loginView.info.set("passwordHash", data.passwordHash);
                app.router.Authenticated = true;
                Backbone.history.navigate('home', true);
                
            }
            else{
                alert('Uuário não cadastrado');
            }
            
        });
    },
    
    registerEvent: function(event) {
        alert('Não implementado!', Error);
        return this;
    },

    
    setUsername: function(event)
    {
        this.info.set("username", Backbone.$("#txt_username").val());
    },
    
    offlineEvent: function(event){
        Backbone.history.navigate('home', true);
        
    }
    
    
}); 
