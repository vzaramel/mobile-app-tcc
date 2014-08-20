//Todos os comandos possuem um K como startbyte e um K como stopbyte 
//e no meio o commando que está sendo transmitido
app.Robot.Communication = (function () {
    Commands = [],
    buffer = "",
    active = false,
    timer = null,
    hasChar = true,
    startByteFound = false,
    startByte = 'K';
    stopByte = 'Z';
    initialize = function(){
            try {
                //alert('starting comm');
                SerialAudio.startReading(function() {

                    SerialAudio.sendByte(function() {
                    }, function(err) {
                        alert("Error sending initialization byte:", err.message);
                    }, "KIZ");
                    //I é o comando de inicialização

                }, function(err) {
                    alert('Error starting communication: ' + err.message);
                });

                timer = window.setInterval(function() {
                    try{
                        
                        hasChar = true;
                        while(hasChar){
                        SerialAudio.receiveByte(function(data) {
                            if (data == startByte) { 
                                    //alert('startByteFound');
                               startByteFound = true;
                               buffer = "";
                            }
                            else if (startByteFound) {
                                if (data == stopByte) {
                                    //alert('stopByteFound');
                                    startByteFound = false;
                                    Commands.push(buffer);
                                    buffer = "";
                                } else if (buffer.length < 10) {
                                //alert('command limit');
                                    buffer = buffer + data;
                                   
                                }else {
                                    //alert('CharFound: '+ data);
                                    startByteFound = false;
                                    buffer = "";
                                }
                            }
                        }, function(err) {
                           //alert('ASD: ', err.message);
                           hasChar= false;
                        });
                      }
                    	
                    }catch(err){
                        alert(err.message);
                    }
                }, 40);
            } catch(err) {
                alert(err.message);
            }
    },
    
    sendString = function(str){
        console.log('cmd: '+ str);
        var strToSend = startByte + str + stopByte;
        SerialAudio.sendByte(function(){
            
        }, function(){
            
        }, strToSend);
    },
    destroy = function(){
        Commands = [];
        buffer = "";
        hasChar = false;
        active = false;
        SerialAudio.stopReading(function(){}, function(){
            alert('Error stopping communication');
        });
        window.clearInterval(timer);
    };
    return{
        initialize : initialize,
        destroy : destroy,
        sendString: sendString,
        Commands : Commands
    };
}());