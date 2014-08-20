app.Logger = (function(){
    
    log = function(str, type, level){
        //if ( app.debug )
            console.log(str);
    }
    
    ;
    
    return{
        log : log
    };

}());
