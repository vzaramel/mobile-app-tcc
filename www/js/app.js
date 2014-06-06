var app = {
    views: {},
    models: {},
    routers: {},
    utils: {},
    adapters: {},
    router: null
};



$(document).on("ready", function () {
    app.router = new app.routers.AppRouter();
    app.utils.templates.load(["LoginView","HomeView", "ProjectView", "ProjectListItemView"],
        function () {
            app.router = new app.routers.AppRouter();
            Backbone.history.start();
            app.serverAddr = "http://192.168.25.23:8080";
            app.adapters.project.create();
        });
       
});

