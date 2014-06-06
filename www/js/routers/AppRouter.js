
app.routers.AppRouter = Backbone.Router.extend({

    routes : {
        "" : "login",
        "home" : "home",
        "login" : "login",
        "project/:id" : "projectDetails"
    },

    initialize : function() {
        app.slider = new PageSlider($('body'));
        this.Authenticated = false;
    },

    login : function() {
        if (!app.loginView) {
            app.loginView = new app.views.LoginView();
            app.loginView.render();
        } else {
            console.log('reusing login view');
            app.loginView.delegateEvents();
        }
        app.slider.slidePage(app.loginView.$el);
    },

    home : function() {
       
            // Since the home view never changes, we instantiate it and render it only once
            if (!app.homeView) {
                app.homeView = new app.views.HomeView();
                app.homeView.render();
            } else {
                console.log('reusing home view');
                app.homeView.delegateEvents();
               
                // delegate events when the view is recycled
            }
            app.homeView.bindScrollScript();
            app.slider.slidePage(app.homeView.$el);
        
    },

    projectDetails : function(id) {
        var data = app.homeView.projectList.get(id);
        app.projectView = new app.views.ProjectView({model : data });
        app.projectView.requireData();
        app.slider.slidePage(app.projectView.render().$el);
        
    },

});
