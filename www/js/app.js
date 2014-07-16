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
            app.adapters.webdb.create();
            app.adapters.webdb.configuration.insert('LastLogged','');
            app.router = new app.routers.AppRouter();
            Backbone.history.start();
            //app.serverAddr = "http://hnrqer-001-site1.myasp.net:80";
            app.serverAddr = "http://192.168.25.23:8080";
            //app.AudioType = "DTMF";
            app.AudioType = "Serial";
        });    
       
});

