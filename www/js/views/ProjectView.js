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
                    "Updated" : "true",
                    "LastSaved": data.LastSaved
                }); 

                model.save();
                
                alert('Projeto Atualizado.');

            });
        }else{
             alert('Fazer Login Antes de Atualizar o Projeto!');
        }
        
    },

    events: {
        "click .back-button": "back",
        "click .start-button":"start",
        "click .stop-button": "stop",
        "click .update-button": "update",
        "click .trash"      :  "onDelete"
    },
    
    onDelete: function(event){
        var response = confirm("Certeza que deseja deletar o projeto?");
        if( response){
            //+this.model.get("id")
            this.model.destroy();
            window.history.back();
            //this = undefined;
        }
    },
    
    start: function(event){
        try{
            this.stop();
            app.Robot.initialize();
            var that = this;
            alert('Projeto Iniciado.');
            window.setTimeout(function(){
                eval(that.model.get("BlocklyCode"));
            },1000);
            //alert(this.model.get("BlocklyCode"));
        }catch(err){
            alert("ProjectView: "+ err.message);
        }
    },
    stop: function(event){
        try{
            if( running){
                app.Robot.destroy();
                alert('Execução Parada');
            }
        }catch(err){
            alert("ProjectView: "+ err.message);
        }

    },
    back: function(event) {
        this.stop();
        window.history.back();
        return false;
    }

});