app.views.ProjectListView = Backbone.View.extend({

    tagName:'ul',

    attributes: {class: 'topcoat-list list'},

    initialize: function () {
        var self = this;
        this.model.on("reset", this.render, this);
        this.model.on("add", function (project) {
            self.$el.append(new app.views.ProjectListItemView({model:project}).render().el);
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
        "click .project-item": "onClick",
        "click #btn_teste": "teste"
       
    },

    render:function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    }

});