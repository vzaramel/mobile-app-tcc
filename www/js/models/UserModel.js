app.models.UserModel = Backbone.Model.extend({
       initialize:function () {
            
       },
       defaults:{
           username: '',
           logged_in: false,
           passwordHash:''
       }
});