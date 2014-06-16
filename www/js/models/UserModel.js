app.models.UserModel = Backbone.Model.extend({
    initialize:function () {
           
    },
    
    defaults:{
           Username: '',
           LoggedIn: false,
           PasswordHash:''
    }, 
    
    sync: function(method, model, options) {
        var deferred = $.Deferred();
        if (method === "read") {
            var user = this; 
            app.adapters.webdb.configuration.findLastLogged().done( function(data){
               if( data.length != 0 && data[0].Value != ""){
                   app.LastLogged =  data[0].Username;
                   user.set("Username", data[0].Username);
                   user.set("PasswordHash", data[0].PasswordHash);
                   user.set("LoggedIn", true);
                   user.set("id", data[0].id);
               }
               deferred.resolve();
            });
        } 
        else if (method == "create" || method == "update") {
            var clModel = model;
            app.adapters.webdb.user.findByUsername(model.get("Username")).done(function(data){
               if( data.length == 0){
                    app.adapters.webdb.user.insert(clModel);
                    app.adapters.webdb.user.findByUsername(clModel.get("Username"))
                        .done(function(data){
                            clModel.set("id", data[0].id);
                            deferred.resolve();
                        }
                    );
               }
               else{
                    clModel.set("id", data[0].id);
                    deferred.resolve();
               }
               app.adapters.webdb.configuration.update("LastLogged", clModel.get("Username")); 
               app.LastLogged = clModel.get("Username");
               
            });
            
        }
        
        return deferred.promise();
    }
});
