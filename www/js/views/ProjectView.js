app.views.ProjectView = Backbone.View.extend({

    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    
    requireData: function(){
        if ( this.model.get("Updated") === "false"){
            this.update();        
        }       
    },
    
    update: function(){
        $.get(app.serverAddr + "/Smartphone/LoadProjectCode", {
                username : app.homeView.info.get('username'),
                passwordHash : app.homeView.info.get('passwordHash'),
                projectID : this.model.get("id")
        }, function(data){
            var model = app.projectView.model;
            model.set({"BlocklyCode" : data.BlocklyCode}, {"BlocklyData": data.BlocklyData}, {"Updated":"true"});
            model.save();
            
        }); 
         
    },

    events: {
        "click .back-button": "back",
        "click .start-button": "start",
        "click .update-button": "update"
    },
    
    start: function(event){
        eval(this.model.get("BlocklyCode"))
    },
    back: function(event) {
        window.history.back();
        return false;
    }

});