
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
        return this;   
    },
    
    bindScrollScript: function(){
        
        var def = $.Deferred();
        var home = this;
        $('.scrollable', this.el).pullToRefresh({
            callback: function() {
                setTimeout( function(){ 
                    home.projectList.getListFromServer(home.info);
                    def.resolve(); 
                }, 200);
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
    

