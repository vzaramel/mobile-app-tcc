app.views.ProjectView = Backbone.View.extend({
    
    initialize: function () {
        var self = this;
        this.model.on("change", this.render,this);
        this.model.on("destroy", this.close, this);
    },
    render: function () {
        this.$el.html(this.template(this.model.attributes));
        return this;
    },
    
    requireData: function(){
        if ( app.router.Authenticated){
            if ( this.model.get("Updated") == "false"){
                this.update();        
            }       
        }
    },
    
    update: function(){
        
        if ( app.router.Authenticated) {
            $.get(app.serverAddr + "/Smartphone/LoadProjectCode", {
                username : app.homeView.info.get('Username'),
                passwordHash : app.homeView.info.get('PasswordHash'),
                projectID : this.model.get("id")
            }, function(data) {
                var model = app.projectView.model;
                
                model.set({
                    "BlocklyCode" : data.BlocklyCode,
                    "BlocklyData" : data.BlocklyData,
                    "Updated" : "true"
                }); 

                model.save();

            });
        }else{
             alert('Fazer Login Antes de Atualizar o Projeto!');
        }
        
    },

    events: {
        "click .back-button": "back",
        "click .start-button": "start",
        "click .update-button": "update"
    },
    
    start: function(event){
        eval(this.model.get("BlocklyCode"));
    },
    back: function(event) {
        window.history.back();
        return false;
    }

});