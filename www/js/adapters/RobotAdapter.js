app.Robot = (function () {
    
    /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Variáveis utilizadas para as ações de movimentação
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
    
        ActionList = [],
        CurrentAction = parar,
        LastInfiniteAction = [parar,[]],
        Def = null,
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Controloador de Ações do robô
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/       
        
        action_finished = function(data){
            if ( ActionList.length > 0) {
                var aux = a.splice(1);
                CurrentAction = a[0][0];
                var params = a[0][1];
                a = aux;
                
                CurrentAction(params).done(action_finished);
                
            }else{
                CurrentAction = LastInfiniteAction[0];
                CurrentAction(LastInfiniteAction[1]);
            }
        },
        assign_action = function(func, params){
            
            if (CurrentAction == virar_angulo || CurrentAction == mov_ms || CurrentAction == mov_cm || CurrentAction == parar_ms) {
                if (func == virar_angulo || func == mov_ms || func == mov_cm) {
                    ActionList.push([func, params]);
                } else {
                    if ( func == parar){
                        func();
                    }
                    LastInfiniteAction = [func,params];
                }
            } else {
                CurrentAction = func;
                if (CurrentAction == virar_angulo || CurrentAction == mov_ms || CurrentAction == mov_cm || CurrentAction == parar_ms) {
                    CurrentAction(params).done(action_finished);
                } else {
                    CurrentAction(params);//executa função
                    LastInfiniteAction = [func,params];
                }

            }

        },

        
/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Movimentos Sequenciais e finitos
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        virar_angulo = function(params){
            var angulo = params[0];
            var dir = params[1];
            //alert('mov_virar');  
            
            if (app.AudioType == "DTMF") {
                if (dir == 'esquerda') {
                    return app.Robot.Control.turn_control(angulo, DTMF.TONE_6);
                } else {
                    return app.Robot.Control.turn_control(angulo, DTMF.TONE_9);
                }
            }else
            {
               var turn = dir=='esquerda'?'E':'D';
               def = $.Deferred();
               SerialAudio.sendByte(function(){},function(){},"KT"+turn+angulo.toString()+"K");
               
               return def.promise();
            }
        },
		mov_ms = function(params){
		    var tempo = params[0];
		    var sentido = params[1]);
		    //alert('mov_ms');
		    if (app.AudioType == "DTMF") {
                if (sentido == 'frente') {
                    return app.Robot.Control.move_control(tempo, DTMF.TONE_0);
                } else {
                    return app.Robot.Control.move_control(tempo, DTMF.TONE_5);
                }
            } else {
                var sent = sentido == 'frente' ? 'F' : 'T';
                SerialAudio.sendByte("KM" + sentido + tempo.toString() + "K");
            }
        },
        mov_cm = function(params){
            var distancia = params[0];
            var sentido = params[1;
           //alert('mov_cm'); 
            
            if (app.AudioType == "DTMF") {
                if (sentido == 'frente') {
                    return app.Robot.Control.move_control(distancia * 100, DTMF.TONE_A);
                } else {
                    return app.Robot.Control.move_control(distancia * 100, DTMF.TONE_5);
                }
            } else {
                var sentido = dir == 'frente' ? 'F' : 'T';
                SerialAudio.sendByte("Km" + sentido + distancia.toString() + "K");
            }

        },
        
        
        parar_ms = function(ms){
            var tempo = params[0];
           //alert('mov_cm'); 
            
            if (app.AudioType == "DTMF") {
                return app.Robot.Control.move_control(tempo, DTMF.TONE_0);
            } else {
                var sentido = dir == 'frente' ? 'F' : 'T';
                SerialAudio.sendByte("Km" + sentido + distancia.toString() + "K");
            }
        },
        
/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Movimentos Infinitos
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        
        mov = function(sentido){
            //alert('mov_infinit');
           try{
                var sent = sentido=='frente'?'F':'T';
                SerialAudio.sendByte(function(){},function(){},"KM"+sent+"K");
            }catch(err){
                alert(err.message);
            }
        },
        
        virar = function(dir){
            try{
                var turn = dir=='esquerda'?'E':'D';
                SerialAudio.sendByte(function(){},function(){},"KT"+turn+"K");
            }catch(err){
                alert(err.message);
            }
            
        },
        
        parar = function(){
            if ( def != null ){
                def.resolve();
                def = null;
            }
            ActionList = [];
            
        },
        
/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Variáveis Utilizadas para a interface com os sensores
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        acelerometro,
        acc_ativo = false,
        bussola_ativa = false,
        infrared_ativo = false,
        infrared,
        bussola,
        timer_interpret_comm,
        timer_leitura_sensores
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *         Funções de leitura dos sensores (getters)
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/       
        ler_acelerometro = function(eixo){
            var response = 0;
            try{
                if (acc_ativo) {
                    if (eixo == 'x') {
                        response = acelerometro.x;
                    } else if (eixo == 'y') {
                        response = acelerometro.y;
                    } else {
                        response = acelerometro.z;
                    }
                }
            }
            catch(err){
                if ( verifica_acelerometro()){
                    ativa_acelerometro();
                    //response = ler_acelerometro(eixo);
                }
            }
            return response; 
        },
        
        ler_bussola = function(){
           var response = 0;
           
           try{
               if ( bussola_ativa)
                response = bussola.magneticHeading;
           }catch(err){
               if ( verifica_bussola){
                   ativa_bussola();
               }
           }
           return response;
        },
        
        ler_infrared = function(){
           var response = 0;
            
           try{
               if ( infrared_ativo)
                response = infrared;
           }catch(err){
               alert(err.message);
           }
           return response;
        },
        ler_gps = function(dado){
            var leitura = 0;
            return  leitura;
        };
        ler_encoder = function(){
            
        },
        
        
/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Funções de Ativação dos sensores
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        ativa_acelerometro = function(){
            acc_ativo = true;
        },
        ativa_bussola = function(){
            bussola_ativa = true;
        },
        ativa_infravermelho = function(){
            infrared_ativo = true;
        },
        
/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Funções de verificação dos sensores
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        verificar_acelerometro = function(){
            return true;
        },
        verificar_bussola = function(){
            return true;
        },
        verificar_infravermelho = function(){
            return true;
        },
        verificar_gps = function(){
            return false;
        },
        
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Rotina para leitura dos sensores imbutidos no smartphone
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/       
        
        rotina_leitura_sensores = function(){
            timer_leitura_sensores = window.setInterval(function(){
                if (acc_ativo){
                   navigator.accelerometer.getCurrentAcceleration( 
                   function(acc){
                        acelerometro = acc;
                   }, function() {
                        alert('Erro ao ler Accelerometro!');
                   }); 
                }
                if (bussola_ativa){
                    navigator.compass.getCurrentHeading(function(heading) {
                    bussola = heading;
                   
                    },  function(error) {
                        alert('Erro ao ler Compass: ' + error.code);
                    });
                }
                
        },
        
/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *  Rotina de interpretação dos commandos recebidos pela comunicação serial com o robô
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        rotina_de_comunicacao = function(){
            timer_interpret_comm = window.setInterval(function(){
                var commands = app.Robot.Communication.Commands;
                if ( commands.length > 0){
                    $.each( commands, function(i, command){
                        switch(command.charAt(0))
                        {
                               case "D": //formato Ixxx onde xxx é a distância encontrada pelos sensores
                                    if( infrared_ativo){
                                        infrared = parseInt(command.substr(1,3));
                                    }
                                    break;
                               case "R":
                                    break;
                               case "S":
                                    break;
                               case "O":
                                    break;
                               case "F":
                                            
                                        Def.resolve();
                                    break;
                        }
                        app.Robot.Communication.Commands = app.Robot.Communication.Commands.splice(1);
                        
                    });
                        
                    
                }
            },10);
        },
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 *          Destrutor 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        destroy = function(){
          window.clearInterval(timer_leitura_sensores);
          window.clearInterval(timer_interpret_comm);
          acelerometro = null;
          bussola = null;
          
          acc_ativo = false;
          bussola_ativa = false;
        };
        
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Definição do que poderá ser acessado por outros arquivos no código
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
    return{
        
        virar_angulo : virar_angulo,
        virar : virar,
        mov_ms : mov_ms,
        mov_cm : mov_cm,
        mov : mov,
        parar : parar,
        parar_ms : parar_ms,
        
        rotina_leitura_sensores: rotina_leitura_sensores,
        ler_acelerometro : ler_acelerometro,
        verificar_acelerometro : verificar_acelerometro ,
        verificar_bussola : verificar_bussola,
        ler_bussola : ler_bussola,
        verificar_gps : verificar_gps, 
        ler_gps: ler_gps,
        ler_encoder:ler_encoder
    };
}());