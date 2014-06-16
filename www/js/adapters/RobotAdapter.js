app.Robot = (function () {

        mov_virar = function(angulo, dir){
            
            
		},
		mov_ms = function(tempo, sentido){
		    if ( sentido == 'frente'){
		        
		    }else
		    {
		        
		    }
            
        },
        mov_cm = function(distancia, sentido){
            
        },
        mov_infinitamente = function(sentido){
            
        },
        
        //leituras
        sensor_ler_acelerometro = function(eixo){
            var num = 0;
            return num;
        },
        sensor_verificar_acelerometro = function(){
            return true;
        },
        sensor_verificar_bussola = function(){
            return true;
        },
        sensor_ler_bussola = function(){
            var leitura = 0;
            return leitura;
        },
        
        sensor_verificar_gps = function(){
            return true;
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