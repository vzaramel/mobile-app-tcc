app.Robot.Control = (function () {
  
  speed_control = function(tone,  speed){
            window.setInterval(function(){
                DTMF.setDTMF(
                    function(){ 
                    //alert("ok");
                    }, 
                    function(){
                        alert("Error");
                    },
                    1, dutyCycle
                    );
                }, 
            100);
  },
  
  turn_control = function( turn, tone){
      window.setInterval(function(){
                    
                DTMF.setDTMF(
                    function(){ 
                    //alert("ok");
                    }, 
                    function(){
                        alert("Error");
                    },
                    1, dutyCycle
                    );
                }, 
            10);
      
  },
  distance_control = function(distance, tone){
            window.setInterval(function(){
                DTMF.setDTMF(
                    function(){ 
                    //alert("ok");
                    }, 
                    function(){
                        alert("Error");
                    },
                    1, dutyCycle
                    );
                }, 
            10);
  },
  position_control = function(x, y, tone, speed){
      
  };
  
  
  return {
        
  };
    
}());