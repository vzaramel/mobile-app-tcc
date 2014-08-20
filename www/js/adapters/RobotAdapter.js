app.Robot = (function () {
    
        running = false,
        
        initialize  = function(){
            try {
                //if (!app.debug)
                lastSpeed ="V3030";
                speed_cmd = "V3030";
                    rotina_leitura_sensores();
                if (app.AudioType == "DTMF") {
                    app.Robot.Control.initialize();
                } else if ( app.AudioType == "Serial") {
                    app.Robot.Communication.initialize();
                    rotina_de_comunicacao();
                    rotina_set_speed();
                }
                running = true;
                
            } catch(err) {
                
                alert("Robot:" + err.message);
                app.Robot.destroy();
            }

        },
    

        Def = null,
        speed_cmd = "V3030",
        lastSpeed ="V3030",
        //sendBuffer = "",
          
/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Movimentos Sequenciais e finitos
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        virar_angulo = function(params){
           
            try {
                //lastSpeed = speed_cmd;
                var angulo = params[0];
                var dir = params[1];
                app.Logger.log('virar_angulo');
                //alert('virar_angulo');
                if (app.AudioType == "DTMF") {
                    if (dir == 'esquerda') {
                       // return app.Robot.Control.turn_control(angulo, DTMF.TONE_6);
                    } else {
                       // return app.Robot.Control.turn_control(angulo, DTMF.TONE_9);
                    }
                } else if ( app.AudioType == "Serial") {
                    var turn = dir == 'esquerda' ? 'E' : 'D';
                    Def = $.Deferred();
                    var str = "T" + turn + angulo.toString();
                    //angulo = dir=='esquerda'? -angulo: angulo;
                    //Def =  turn_control(angulo);
                    app.Robot.Communication.sendString(str);
                    return Def.promise();
                } else if ( app.debug){
                    Def = $.Deferred();
                    window.setTimeout(function(){Def.resolve();},1000);
                    return Def.promise();
                }
            } catch(err) {
                alert(err.message);
            }

        },
		mov_ms = function(params){
		   
            try {
                var tempo = params[0];
                var sentido = params[1];
                app.Logger.log('mov_ms');
                //alert('mov_ms');
                if (app.AudioType == "DTMF") {
                    if (sentido == 'frente') {
                        return app.Robot.Control.move_control(tempo, DTMF.TONE_0);
                    } else {
                        return app.Robot.Control.move_control(tempo, DTMF.TONE_5);
                    }
                }else if ( app.AudioType == "Serial") {
                    //Def = $.Deferred();
                    var sent = sentido == 'frente' ? 'F' : 'T';
                    var str = "M"+ sent;// + tempo.toString();
                    app.Robot.Communication.sendString(str);
                    Def = app.Robot.Control.move_control_ms(tempo);
                    return Def.promise();
                }else if ( app.debug){
                    Def = $.Deferred();
                    window.setTimeout(function(){Def.resolve();},1000);
                    return Def.promise();
                }
            } catch(err) {
                alert('Err mov_ms: '+err.message);
            }
        },

        
        mov_cm = function(params){
            
            try {
                var distancia = params[0];
                var dir = params[1];
                app.Logger.log('mov_cm');
                //alert('mov_cm');
                if (app.AudioType == "DTMF") {
                    if (sentido == 'frente') {
                        return app.Robot.Control.move_control(distancia * 100, DTMF.TONE_A);
                    } else {
                        return app.Robot.Control.move_control(distancia * 100, DTMF.TONE_5);
                    }
                } else if ( app.AudioType == "Serial") {
                    Def = $.Deferred();
                    var sentido = dir == 'frente' ? 'F' : 'T';
                    var str = "m" + sentido + distancia.toString();
                    app.Robot.Communication.sendString(str);
                    
                    //Def = app.Robot.Control.move_control_cm(distancia*10);
                    return Def.promise();
                    
                } else if ( app.debug){
                    Def = $.Deferred();
                    window.setTimeout(function(){Def.resolve();},1000);
                    return Def.promise();
                }
            } catch(err) {
                alert(err.message);
            }


        },
        
        
        parar_ms = function(params){
            var tempo = params[0];
            app.Logger.log('parar_ms'); 
            //alert('parar_ms');
            try {
                if (app.AudioType == "DTMF") {
                    return app.Robot.Control.move_control(tempo, DTMF.TONE_0);
                } else if ( app.AudioType == "Serial") {
                    Def = $.Deferred();
                    var str = "P" + tempo.toString();
                    app.Robot.Communication.sendString(str);
                    return Def.promise();
                } else if ( app.debug){
                    Def = $.Deferred();
                    window.setTimeout(function(){Def.resolve();},1000);
                    return Def.promise();
                }
            } catch(err) {
                alert('Err parar_ms: '+err.message);
            }

        },
        
/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Movimentos Infinitos
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        
        mov = function(sentido){
            app.Logger.log('mov');
            //alert('mov');
            try{
                if (app.AudioType == "DTMF") {
                    if (sentido == 'frente') {
                        app.Robot.Control.tone = DTMF.TONE_A;
                        app.Robot.Control.speed = 20;
                    } else {
                        app.Robot.Control.tone = DTMF.TONE_5;
                        app.Robot.Control.speed = 20;
                    }
                    app.Robot.Control.generate_pwm();
                } 
                else if ( app.AudioType == "Serial") {
                    var sent = sentido=='frente'?'F':'T';
                    var str = "M"+sent;
                    app.Robot.Communication.sendString(str);
                }
            }catch(err){
                alert(err.message);
            }
        },
        
        virar = function(dir){
            app.Logger.log('virar');
            //alert('virar');
            try{
                
                if (app.AudioType == "DTMF") {
                    if (sentido == 'frente') {
                        app.Robot.Control.tone = DTMF.TONE_6;
                    } else {
                        app.Robot.Control.tone = DTMF.TONE_9;
                    }
                } else if ( app.AudioType == "Serial") {
                    
                    var turn = dir == 'esquerda' ? 'E' : 'D';
                    var str = "T" + turn;
                    app.Robot.Communication.sendString(str);
                }

            }catch(err){
                alert(err.message);
            }
            
        },
        
        parar = function(){
           
            app.Logger.log('parar');
            //alert('parar');
            try {
                if (app.AudioType == "DTMF") {
                    app.Robot.Control.tone = DTMF.TONE_0;
                } else if ( app.AudioType == "Serial") {
                    var str = "P";
                    app.Robot.Communication.sendString(str);
                }
            } catch(err) {
                alert(err.message);
            }


        },
        
        set_speed = function(esq, dir){
            
            try{
                esq = esq.toFixed();
                dir = dir.toFixed();
                
                if( esq > 50) esq = 50;
                if( esq < 0  ) esq =  0;
                if( dir > 50) dir = 50;
                if( dir < 0 ) dir =   0;
                
                if (app.AudioType == "DTMF") {
                    app.Robot.Control.speed = (esq+dir)/2;
                } else if ( app.AudioType == "Serial") {
                    //alert('1');
                    var str = "V"+ (esq<10?"0":"") + esq.toString() + (dir<10?"0":"") +dir.toString();
                    //alert('str: ' + str);
                    if ( speed_cmd != str){
                        //app.Logger.log('Set Speed: '+str);
                        speed_cmd = str;
                        //app.Robot.Communication.sendString(str);
                    }
                    
                    
                }
            }catch(err){
                alert(err.message);
            }
        },
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Variáveis utilizadas para as ações de movimentação
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
    
        ActionList = [],
        CurrentAction = parar,
        LastInfiniteAction = [parar,[]],
        loopInterval = null,
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Controloador de Ações do robô
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/       
        
        action_finished = function(data){
           
            try {
                if (CurrentAction == mov_ms || CurrentAction == mov_cm || CurrentAction == virar_angulo || CurrentAction == parar_ms){
                    set_speed(parseInt(lastSpeed.substr(1,2)), parseInt(lastSpeed.substr(3,2)));
                }
                //console.log(ActionList);
                //console.log(CurrentAction);
                if (ActionList.length > 0) {
                    //alert(ActionList);
                	var list = [];
                    var aux = ActionList.splice(1);
                    CurrentAction = ActionList[0][0];
                    var params = ActionList[0][1];
                    ActionList = aux;
                   	
                   
                    if (params[0] == 'loop') {
                        app.Logger.log('loop');
                        loopInterval = window.setInterval(function(params) {
                            
                            try {
                                var func = params[0];
                                var condition = params[1];
                                var funcAfter = params[2];

                                var val = eval(condition);
                                //alert('loop: '+ val);
                                if (val) {
                                    func();
                                } else {
                                    window.clearInterval(loopInterval);
                                    app.Logger.log('finished loop');
                                    loop_finished = null;
                                    funcAfter();
                                }
                            } catch(err) {
                                alert(err.message);
                            }
                        }, 30, [CurrentAction, params[2], params[3]]);
                        CurrentAction = LastInfiniteAction[0];
                    }
                    else if (CurrentAction == mov_ms || CurrentAction == mov_cm || CurrentAction == virar_angulo || CurrentAction == parar_ms){
                        lastSpeed = speed_cmd;
                        CurrentAction(params).done(action_finished);
                    }
                    else if (CurrentAction == set_speed){
                        CurrentAction(params[0],params[1]);
                        action_finished();
                    }
                    else{
                        CurrentAction(params);
                        LastInfiniteAction = [CurrentAction,params];
                        action_finished();
                    }
                    
                    
                } 
            } catch(err) {
                alert(err.message);
            }
        },
        
		assign_action = function(func, params){
            try {
                
                if( func == mov || func == virar || func == parar){
                    if ( !(LastInfiniteAction[0] == func && LastInfiniteAction[1].toString() == params.toString()) ){
                        ActionList.push([func, params]);
                    }
                }else if ( func == set_speed){
                    if (CurrentAction == parar || CurrentAction == mov || CurrentAction == virar){
                        func(params[0],params[1]);
                    }else
                    {
                        ActionList.push([func,params]);
                    }
                }
                else{
                    ActionList.push([func, params]);
                }
                
                if ( CurrentAction == parar || CurrentAction == mov || CurrentAction == virar) {
                    action_finished();
                }
               
            } catch(err) {
                alert(err.message);
            }

        },
        assign_loop = function(type, condition, func, funcAfter){
            try {
            	//alert('assigned_loop: ' + funcAfter );
                ActionList.push([func, ['loop',type, condition, funcAfter]]);
                
                if ( CurrentAction == parar || CurrentAction == mov || CurrentAction == virar){
                    action_finished();
                }
           }catch(err){
                alert(err.message);
            }
        },

/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Variáveis Utilizadas para a interface com os sensores
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        acelerometro = null,
        infrared = null,
        bussola = null,
        refletancia = [0,0,0,0,0];
        speed_left = 0;
        speed_right = 0;
        distance = 0;
        timer_interpret_comm = null,
        timer_leitura_sensores = null,
        timer_set_speed = null,
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *         Funções de leitura dos sensores (getters)
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/       
        ler_acelerometro = function(eixo){
            var response = 0;
            try{
                 if ( typeof acelerometro != "undefined" && acelerometro){
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
                alert(err.message);
            }
            return response; 
        },
        
        ler_bussola = function(){
           var response = 0;
           
           try{
               if ( typeof bussola != "undefined" && bussola)
                response = bussola.magneticHeading;
           }catch(err){
               alert(err.message);
           }
           return response;
        },
        
        ler_infrared = function(){
           var response = 0;
            
           try{
                response = infrared;
           }catch(err){
               alert(err.message);
           }
           return response;
        },
        
        ler_distancia = function(){
           var response = 0;
            
           try{
                response = distance;
                
           }catch(err){
               alert(err.message);
           }
           if (isNaN(response)) response = 0;
           return response;
        },
        
        ler_speed_left = function(){
           var response = 0;
            
           try{
                response = speed_left;
           }catch(err){
               alert(err.message);
           }
           return response;
        },
        
        ler_speed_right = function(){
           var response = 0;
            
           try{
                response = speed_right;
           }catch(err){
               alert(err.message);
           }
           return response;
        },
        
        ler_refletancia = function(){
           var response = 0;
            
           try{
                response = refletancia;
           }catch(err){
               alert(err.message);
           }
           return response;
        },
        
        ler_gps = function(dado){
            var leitura = 0;
            return  leitura;
        },
        ler_encoder = function(){
            
        },
        
        
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Rotina para leitura dos sensores imbutidos no smartphone
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/       
        
        rotina_leitura_sensores = function(){
            timer_leitura_sensores = window.setInterval(function(){
                try{
                
                   navigator.accelerometer.getCurrentAcceleration( 
                   function(acc){
                        acelerometro = acc;
                        //console.log('Acelerometro: ' + acc.x  +','+ acc.y+','+ acc.y);
                   }, function() {
                        alert('Erro ao ler Accelerometro!');
                   }); 
                
                
                    navigator.compass.getCurrentHeading(function(heading) {
                        bussola = heading;
                        //console.log('Bussola: ' + heading.magneticHeading);
                    },  function(error) {
                        alert('Erro ao ler Compass: ' + error.code);
                    });
                
                }catch(err){
                    alert('Err leitura sensores: ' + err.message);
                }
            },30);
            
                
        },
        
/* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *  Rotina de interpretação dos commandos recebidos pela comunicação serial com o robô
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        lastSpeedSent = "",
        
        rotina_set_speed = function(){
            timer_set_speed = window.setInterval(function(){
                try {
                    if ( speed_cmd != lastSpeedSent){
                        //alert("Speed: " + speed_cmd);
                        app.Robot.Communication.sendString(speed_cmd);
                        lastSpeedSent = speed_cmd;
                    }
                }catch(err){
                    alert(err.message);
                }
            }, 50);
        },
        rotina_de_comunicacao = function(){
            timer_interpret_comm = window.setInterval(function(){
                try {
                    //alert(Commands);
                    
                    //app.Robot.Communication.sendString(speed_cmd);
                    var cmd = '';
                    if (Commands.length > 0) {
                        while(Commands.length >0)
                        {
                            cmd = Commands.pop();
                            var size = cmd.length;
                            
                            switch(cmd.charAt(0)) {
                                case "I":
                                    //formato Ixxx onde xxx é a distância encontrada pelos sensores
                                    infrared = cmd.charCodeAt(size-1);//parseInt(cmd.substr(1,size-1));
                                    //console.log('Infrared: '+ infrared);
                                    break;
                                case "P":
                                
                                    distance = (cmd.charCodeAt(size-2)<<8) + cmd.charCodeAt(size-1);//parseInt(cmd.substr(1,size-1));
                                    //console.log('Distancia: '+ distance);
                                    break;
                                case "V":
                                    //alert('Velocidade');
                                    //console.log('cmd: '+cmd+'   cmd length: ' + cmd.length);
                                    speed_left = cmd.length >= 2? cmd.charCodeAt(1):0 ;
                                    speed_right =  cmd.length == 3? cmd.charCodeAt(2): 0;
                                    //console.log('Vel: '+ speed_left + ' ' + speed_right);
                                    break;
                                case 'R':
                                    var aux = cmd.charCodeAt(size-1) - 32;
                                    //alert('Ref: ' + aux);
                                    var aux2 = aux;
                                    for( var i = 4; i >= 0; i--){
                                        if (aux/Math.pow(2,i) >= 1 ){
                                            aux -= Math.pow(i,2);
                                            refletancia[i] = 1;
                                        }else
                                        {
                                            refletancia[i] = 0;
                                        }
                                    }
                                    //console.log('Refletancia:'+ refletancia);
                                    //alert('')
                                    break;
                                case 'F':
                                    //console.log('Resolve');
                                    app.Logger.log(cmd);
                                    Def.resolve();
                                    break;
                            }
                            

                        }

                    }
                } catch(err) {
                    alert(err.message);
                }

            },30);
        },
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 *          Destrutor 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
        destroy = function(){
          
            try {
                window.clearInterval(timer_leitura_sensores);
                window.clearInterval(timer_interpret_comm);
                window.clearInterval(timer_set_speed);
                
                if (loopInterval) window.clearInterval(loopInterval);
                ActionList = [];
                CurrentAction = parar;
                LastInfiniteAction = [parar, []];
                //parar();

                if (app.AudioType == 'DTMF') {
                    //Control.destroy();
                } else if (app.AudioType == 'Serial'){
                    app.Robot.Communication.sendString("P");
                    app.Robot.Communication.destroy();
                    app.Robot.Control.destroy();
                } 

                acelerometro = null;
                bussola = null;
                infrared = null;

                acc_ativo = false;
                bussola_ativa = false;
                infrared_ativo = false;

                running = false;
            } catch(err) {
                alert(err.message);
            }
        };
        
        
 /* * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * *
 * 
 *          Definição do que poderá ser acessado por outros arquivos no código
 * 
 * 
 ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * * ** * * * * * * **/
    return{
        //ActionList: ActionList,
        initialize: initialize,
        destroy : destroy,
        
        virar_angulo : virar_angulo,
        virar : virar,
        mov_ms : mov_ms,
        mov_cm : mov_cm,
        mov : mov,
        parar : parar,
        parar_ms : parar_ms,
        set_speed : set_speed,
        
        ler_acelerometro : ler_acelerometro,
        ler_bussola : ler_bussola,
        ler_infrared : ler_infrared,
        ler_distancia : ler_distancia,
        ler_refletancia : ler_refletancia,
        ler_speed_left : ler_speed_left,
        ler_speed_right : ler_speed_right,
        ler_gps: ler_gps,
        ler_encoder:ler_encoder,
        
        assign_action:assign_action,
        assign_loop : assign_loop
    };
}());