app.views.ProjectListView = Backbone.View.extend({

    tagName:'ul',

    attributes: {class: 'topcoat-list list'},

    initialize: function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (project) {
            self.$el.append(new app.views.ProjectListItemView({model:project}).render().el);
        });
        this.model.on("remove", function(project){
            //self.$el.remove();
        });
        
    },

    render:function () {
        this.$el.empty();
        _.each(this.model.models, function (project) {
            this.$el.append(new app.views.ProjectListItemView({model:project}).render().el);
        }, this);
        return this;
    }
});

app.views.ProjectListItemView = Backbone.View.extend({

    tagName:"li",

    className:"topcoat-list__item",

    initialize:function () {
        this.model.on("change", this.render, this);
        this.model.on("destroy", this.close, this);
    },
    
    events: {
        
        "keyup .search-key":    "search",
        "keypress .search-key": "onkeypress",
        "click .trash": "onDelete",
       
    },
    
    onDelete: function(){
        
        var response = confirm("Certeza que deseja deletar o projeto?");
        if( response){
            //+this.model.get("id")
            this.$el.remove();
            this.model.destroy();
            //this = undefined;
        }
        
    },

    render:function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});