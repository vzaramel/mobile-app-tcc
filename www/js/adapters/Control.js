app.Robot.Control = (function () {
  
  speed = 0,
  error = 0,
  period = 50,
  tone = 0,
  kp = 0,
  ki = 0,
  kd = 0,
  proporcional = 0,
  integral = 0,
  derivativo = 0,
  elapsedTime = 0,
  startTime =0,
  currentTime =0,
  
  
  generate_pwm = function(){
      
      //alert('generate_pwm');
      
              
            var timer = window.setInterval(function(){
                //alert('interval PWM');
                DTMF.startTone(
                    function(){ 
                        //alert('speed' + speed);
                        //alert('period' + period);
                        //alert('OK');
                    }, 
                    function(){
                        alert("Error");
                    },
                    tone, speed
                    );
                }, 
            period);
            
            return timer;
  },
  
  move_control = function( duration, toneS){
      
      //alert('move_control');
      var deferred = $.Deferred();
      var startHeding = 0;
      
      speed = 20;
      period = 50;
      tone = toneS;
      var timer = generate_pwm();
      
      window.setTimeout(function(){
               
                    
                        window.clearInterval(timer);
                        deferred.resolve();   
                    
                     
      },
      duration);
      
      return deferred.promise();
  },
  
  turn_control = function( turn, toneS){
      
      //alert('turn_control');
      var deferred = $.Deferred();
      var startHeding = 0;
      var target = 0;
      var goal = 0; 
      if ( toneS == DTMF.TONE_6){
          turn = -turn;
      }
      tone = toneS;
      
      navigator.compass.getCurrentHeading( function(heading) {
                    startHeading = heading.magneticHeading;
                    startHeading = startHeading - 180;
                    goal = turn + startHeading;
                    if ( goal < -180){
                        goal = 360 - goal;
                    }
                    else if ( goal > 180){
                        goal = -360 + goal;   
                    }
                   
                    //alert('startHeading = ' + startHeading);
                    //alert('Goal = ' + goal);
                },  function(error) {
                    alert('CompassError: ' + error.code);
                });
      
      var s = new Date();
      var possouGoal = false;
      startTime = s.getMilliseconds() + s.getSeconds()*1000 + s.getMinutes()*60000;
      kp = 0.5;
      //ki = 0.001;
      
      var timer = generate_pwm();
      
      var timer2 = window.setInterval(function(){
                navigator.compass.getCurrentHeading(function(heading) {
                   
                    var newHeading = heading.magneticHeading -180;
                    var s = new Date();
                    currentTime = s.getMilliseconds() + s.getSeconds()*1000 + s.getMinutes()*60000;
                    elapsedTime = currentTime - startTime;
                    startTime = currentTime;
                    
                    auxProp = proporcional;
                    proporcional = goal - newHeading;
                    if ( proporcional > 180 ){
                        proprcional = proporcional -360;
                    }else if (proporcional < -180){
                        proporcional = proporcional +360;
                    }
                    integral = integral + proporcional*elapsedTime;
                    derivativo = proporcional - auxProp;
                    
                    if ( integral > 20000){
                        integral = 20000;
                    }else if( integral < -20000){
                        integral = -20000;
                    }
                    
                    speed = kp*proporcional - ki*integral;
                    
                    
                    
                    var sinal = auxProp*proporcional;
                   
                    if ( sinal < 0){
                        passouGoal = true;   
                    }
                    
                    //alert('currentTime = ' + currentTime);
                    //alert('elapsedTime = ' + elapsedTime);
                    //alert('startTime = ' + startTime);
                    //alert('auxProp = ' + auxProp);
                    //alert('goal = ' + goal);
                    //alert('heading = ' + newHeading);
                    //alert('proporcional = ' + proporcional);
                    //alert('integral = ' + integral);
                    //alert('derivativo = ' + derivativo);
                    //alert('speed = ' + speed);
                    if ( passouGoal){
                        if (speed < 0) {
                            tone = DTMF.TONE_9;
                        } else {
                            tone = DTMF.TONE_6;
                        }
                    }
                    speed = Math.abs(speed);
                    speed = speed/10 + 11;
                    if ( speed > 20 ){
                        speed = 20;
                    }else if( speed < 10){
                        speed = 10;
                    }
                    
                    
                    if ( Math.abs(proporcional) < 0.5){
                        //alert('parou');
                        window.clearInterval(timer2);
                        window.clearInterval(timer);
                        deferred.resolve();   
                    }
                },  function(error) {
                    alert('CompassError: ' + error.code);
                });     
        },
      5);
      
      return deferred.promise();
      
  },
  distance_control = function(distance, tone){
      
            var timer = window.setInterval(function(){
                    
                }, 
            10);
            
            clearInterval(timer);
  },
  position_control = function(x, y, tone, speed){
      
  };
  
  
  return {
      turn_control : turn_control,
      generate_pwm : generate_pwm,
      move_control : move_control
        
  };
    
}());