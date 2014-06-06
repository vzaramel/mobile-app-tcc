app.models.Project = Backbone.Model.extend({

    initialize:function () {
    },

    defaults:{
        Updated: false,
        Name: '',
        Description: '',
        CreatedOn: null,
        LastSaved: null,
        BlocklyData: null,
        BlocklyCode: null
    },
    sync: function(method, model, options) {
        if (method === "read") {
            app.adapters.project.findById(parseInt(this.id)).done(function (data) {
                options.success(data);
            });
        }
        else if ( method === "update"){
            app.adapters.project.update(this);
        }
        
    }

});

app.models.ProjectCollection = Backbone.Collection.extend({

    model: app.models.Project,
     
    sync: function(method, model, options) {
        if (method === "read") {
            app.adapters.project.findAll().done(function (data) {
                options.success(data);
            });
        }
        
    },
    save: function(model){
        app.adapters.project.insert(model);
    }
});
