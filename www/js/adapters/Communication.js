//Todos os comandos possuem um K como startbyte e um K como stopbyte 
//e no meio o commando que está sendo transmitido
app.Robot.Communication = (function () {
    Commands = [],
    buffer = "",
    active = false,
    timer,
    hasChar = true,
    startByteFound = false,
    
    initialize = function(){
        SerialAudio.startReading(function(){
            
            SerialAudio.sendByte(null, function(err){
                alert("Error Initializing:", err.message);  
            },"KIK");//I é o comando de inicialização
            
            
        }, function(err){
            alert(err.message);
        });
        
        timer = window.setInterval(function(){
                 while (hasChar) {
                    SerialAudio.receiveByte(function(data) {
                        if ( buffer.length > 5){
                                startByteFound = false;
                                buffer = "";
                        }
                        if( startByteFound){
                            if ( data == 'K'){
                                startByteFound = false;
                                Commands.push(buffer);
                                buffer = "";
                            }else 
                            {
                                buffer = buffer + data;
                            }
                        }else{
                            if ( data == 'K'){
                                startByteFound;
                            }
                        }
                    }, function(err) {
                        hasChar = false;
                    });
                }
        },10);
    },
    
    
    destroy = function(){
        SerialAudio.stopReading(function(){}, function(){});
        window.clearInterval(timer);
    };
    return{
        initialize : initialize,
        destroy : destroy,
        Commands : Commands
    };
}());