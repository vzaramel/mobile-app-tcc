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
            app.adapters.webdb.project.findById(parseInt(this.id)).done(function (data) {
                options.success(data);
            });
        }
        else if ( method === "update"){
            app.adapters.webdb.project.update(this);
        }
        
    }

});

app.models.ProjectCollection = Backbone.Collection.extend({

    model: app.models.Project,
     
    sync: function(method, model, options) {
        if (method === "read") {
            if (app.loginView.info) {
                var userId = app.loginView.info.get("id");
                app.adapters.webdb.userProject.findByUserId(userId).done(function(data) {
                    options.success(data);
                });
            }
            else{
                app.adapters.webdb.project.findAllWithCode().done(function(data) {
                    options.success(data);
                });
            }
        }
        
    },
    
    fetchItem: function(item){
        
    },
    save: function(model){
        app.adapters.webdb.project.insert(model);
        var userId = app.loginView.info.get("id");
        app.adapters.webdb.userProject.insert(userId, model.get("id"));
    },
    
    getListFromServer: function(info) {
        
        var list = this;
        if (app.router.Authenticated) {
            $.get(app.serverAddr + "/Smartphone/LoadProjectList", {
                username : info.get('Username'),
                passwordHash : info.get('PasswordHash')
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
            var userId = app.homeView.info.get("id");
            app.adapters.webdb.userProject.find( userId ,item.ProjectId).done( function(data){
                list.addOrUpdate(data,item);
            });
    },
    
    addOrUpdate: function(data, item) {

        var proj = data;
        var list = this;
        var lastSaved = item.LastSaved;
        var createdOn = item.CreatedOn;
        if (proj === null || proj.length == 0) {
            proj = new app.models.Project({
                id : item.ProjectId,
                Name : item.Name,
                Description : item.Description,
                LastSaved : lastSaved,
                CreatedOn : createdOn
            });
            list.add(proj);
            list.save(proj);
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
