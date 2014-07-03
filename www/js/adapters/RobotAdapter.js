app.Robot = (function () {

        mov_virar = function(angulo, dir){
            //alert('mov_virar');    
            if ( dir == 'esquerda'){
                return app.Robot.Control.turn_control(angulo, DTMF.TONE_6);
            }
            else {
                return app.Robot.Control.turn_control(angulo, DTMF.TONE_9);
            }
                   
        },
		mov_ms = function(tempo, sentido){
		    //alert('mov_ms');  
		    if ( sentido == 'frente'){
		        return app.Robot.Control.move_control(tempo, DTMF.TONE_0);
		    }else
		    {
		        return app.Robot.Control.move_control(tempo, DTMF.TONE_5);
		    }
            
        },
        mov_cm = function(distancia, sentido){
            //alert('mov_cm');  
            if ( sentido == 'frente'){
                return app.Robot.Control.move_control(distancia*100, DTMF.TONE_0);
            }else
            {
                return app.Robot.Control.move_control(distancia*100, DTMF.TONE_5);
            }
        },
        mov_infinitamente = function(sentido){
            alert('mov_infinit');
            var deferred = $.Deferred();
            deferred.resolve();
            return deferred. promise();
        },
        
        //leituras
        sensor_ler_acelerometro = function(eixo){
            var deferred = $.Deferred();
            var response = 0;
            
            
            try{
                  
            var func = function(acceleration) {
                 
                if (eixo == 'x') {
                    response =  acceleration.x;
                } else if (eixo == 'y') {
                    response = acceleration.y;
                } else {
                    response = acceleration.z;
                }

                deferred.resolve(response);
                
            };    
                navigator.accelerometer.getCurrentAcceleration( func, function() {
                    alert('onError!');
                });
            }catch(err){
                alert(err.message);
            }
            
            return deferred.promise(); 

        },
        sensor_verificar_acelerometro = function(){
            var deferred = $.Deferred();
            deferred.resolve(true);
            return deferred. promise();
        },
        sensor_verificar_bussola = function(){
            return true;
        },
        sensor_ler_bussola = function(){
           
            
            navigator.compass.getCurrentHeading(function(heading) {
                    var leitura = heading.magneticHeading;
                   
                },  function(error) {
                    alert('CompassError: ' + error.code);
                });
            
            //while(!done){}
            //alert(leitura);
            return true;
        },
        
        sensor_verificar_gps = function(){
            return false;
        },
        
        sensor_ler_gps = function(dado){
            var leitura = 0;
            return  leitura;
        };
        
        sensor_ler_encoder = function(){
            
        };
        
    // The public API
    return {
        mov_virar :mov_virar,
        mov_ms : mov_ms,
        mov_cm : mov_cm,
        mov_infinitamente : mov_infinitamente,
        sensor_ler_acelerometro : sensor_ler_acelerometro,
        sensor_verificar_acelerometro : sensor_verificar_acelerometro ,
        sensor_verificar_bussola : sensor_verificar_bussola,
        sensor_ler_bussola : sensor_ler_bussola,
        sensor_verificar_gps : sensor_verificar_gps, 
        sensor_ler_gps: sensor_ler_gps 
    };
    

}());