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
    },
    
    getListFromServer: function(info) {
        
        var list = this;
        if (info.get("logged_in")) {
            $.get(app.serverAddr + "/Smartphone/LoadProjectList", {
                username : info.get('username'),
                passwordHash : info.get('passwordHash')
                }, function(data){
                    $.each(data, function(i,item){
                        list.verifyItem(item);
                    });
                }
            );
        } else {
            alert('Fazer Login Antes de atualizar lista');
        }

    },
    
    verifyItem:  function(item) {
            var list = this;
            app.adapters.project.findById(item.ProjectId).done( function(data){
                list.addOrUpdate(data,item);
            });
    },
    
    addOrUpdate: function(data, item) {

        var proj = data;
        var list = this;
        var lastSaved = item.LastSaved;
        var createdOn = item.CreatedOn;
        if (proj === null) {
            proj = new app.models.Project({
                id : item.ProjectId,
                Name : item.Name,
                Description : item.Description,
                LastSaved : lastSaved,
                CreatedOn : createdOn
            });
            list.add(proj);
        } else {
            proj = list.get(item.ProjectId);
            if (lastSaved != proj.get("LastSaved")) {
                if (proj.get("Updated") === "true") {
                    proj.set("Updated", "false");
                    proj.save();
                }
            }
        }
    }


});
