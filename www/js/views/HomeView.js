
app.views.HomeView = Backbone.View.extend({

    initialize: function () {
        this.projectList = new app.models.ProjectCollection();
        this.resultsView = new app.views.ProjectListView({model: this.projectList});
        this.projectList.fetch({reset: true});
        this.info = app.loginView.info;
    },

    render: function () {
        this.$el.html(this.template());
        $('.list', this.el).append(this.resultsView.render().el);
        console.log("render");
        
        return this;   
    },
    
    bindScript: function(){
        
        var def = $.Deferred();
        
        var addProjects = function(data) {
            $.each(data, function(i, item){
                app.adapters.project.findById(item.ProjectId).done( function(data){
                    var proj = data;
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
                        app.homeView.projectList.add(proj);
                    }
                    else{
                        proj = app.homeView.projectList.get(item.ProjectId);
                        if ( lastSaved != proj.get("LastSaved")){
                            if ( proj.get("Updated") === "true"){
                                proj.set("Updated", "false");
                                proj.save();
                            }
                        }
                    }
                });
            });
            
        };
               
       
        var getList = function() {

            if (app.homeView.info.get("logged_in")) {
                $.get(app.serverAddr +"/Smartphone/LoadProjectList", {
                    username : app.homeView.info.get('username'),
                    passwordHash : app.homeView.info.get('passwordHash')
                }, addProjects);
            } else {
                alert('Fazer Login Antes de atualizar lista');
            }

            def.resolve();
        };
    
                       
        $('.scrollable', this.el).pullToRefresh({
            callback: function() {
                setTimeout( getList, 200);
                    return def.promise();
                }

        });
    },

    events: {
        
        "keyup .search-key":    "search",
        "keypress .search-key": "onkeypress",
        "click .project-item": "onClick",
        "click #btn_teste": "teste"
       
    },
    
    search: function (event) {
        console.log("search");
        var key = $('.search-key').val();
        this.projectList.fetch({reset: true, data: {Name: key}});
    },
});



    // Add x dummy items to the list
    

