(function( $ ){

    $.fn.pullToRefresh = function( options ) {

        var isTouch = !!('ontouchstart' in window),
            cfg = $.extend(true, {
              message: {
                pull: 'Pull to refresh',
                release: 'Release to refresh',
                loading: 'Loading...'
                }
            }, options);
            
        return this.each(function() {
            if (!isTouch) {
                //console.log("Event Not Touch.");
                return;
            }
            //console.log("Event is Touc");

            var e = $(this),
                content = e.find('.wrap'),
                ptr = e.find('.pull-to-refresh'),
                arrow = e.find('.arrow'),
                spinner = e.find('.spinner'),
                pull = e.find('.pull'),
                release = e.find('.release'),
                loading = e.find('.loading'),
                ptrHeight = 50,
                arrowDelay = ptrHeight / 3 * 2,
                isActivated = false,
                isLoading = false;
                contentStartY = 130;
                startY = 0;
                track = false;
                refresh = false;
                
           
            
               content.css('-webkit-transition-duration',0);
            var moved = false;
            var turnoff = false;
            content.on('touchstart', function (ev) {
               var evo = ev.originalEvent;
               var scroll = e.scrollTop();
                if ( scroll > 0)
                {
                   turnoff = true;
                   return true;
                }
                turnoff = false;
                moved = false;
               //console.log("touchstart");
              
               startY = evo.touches[0].screenY;
            }).on('touchmove', function (ev) {
                
                var evo = ev.originalEvent;
                
                if (turnoff) return true;
                
                if ( !moved){
                    if ( startY - evo.touches[0].screenY > 0){
                        e.css('overflow', "auto");
                        moved = true;
                        return true;
                    }
                    else{
                        e.css('overflow', "visible");
                        moved = true;
                    }
                }
                
                ev.preventDefault();
                //console.log("touchmove");
                var top =  (startY - evo.touches[0].screenY)/2,
                    deg = 180 - (top < -ptrHeight ? 180 : // degrees to move for the arrow (starts at 180° and decreases)
                          (top < -arrowDelay ? Math.round(180 / (ptrHeight - arrowDelay) * (-top - arrowDelay)) 
                          : 0));
    
                if (isLoading) { // if is already loading -> do nothing
                    //console.log("isLoading");
                    return true;
                }
                if (-top > 0)
                 e.css('top',(-top + 130));

                arrow.show();
                arrow.css('transform', 'rotate('+ deg + 'deg)'); // move arrow

                spinner.hide();

                if (-top > ptrHeight) { // release state
                    release.css('opacity', 1);
                    pull.css('opacity', 0);
                    loading.css('opacity', 0);
                    //console.log("release state");

                    isActivated = true;
                } else if (top > -ptrHeight) { // pull state
                    release.css('opacity', 0);
                    loading.css('opacity', 0);
                    pull.css('opacity', 1);
                    
                    //console.log("pull state");
                    
                    isActivated = false;
                }
            }).on('touchend', function(ev) {
                //ev.preventDefault();
                if (turnoff) return true;
                e.scrollTop(0);
                
                //console.log("touchend");
                if (isActivated) { // loading state
                    
                    
                    isLoading = true;
                    isActivated = false;

                    release.css('opacity', 0);;
                    pull.css('opacity', 0);
                    loading.css('opacity', 1);
                    arrow.hide();
                    spinner.show();

                    //ptr.css('position', 'static');
    
                    cfg.callback().done(function() {
                        e.animate({
                                top:130
                        }, 'fast', 'linear', function () {
                            e.css({
                                top:'130px'
                            });
                            isLoading = false;
                        });
                    });
                }
                else{
                    
                        e.animate({
                            top:130
                        }, 'fast', 'linear', function () {
                            e.css({
                                top:'130px'
                            });
                            isLoading = false;
                        });
                    
                }
                
                e.css('overflow', "auto");
            });
            
        //return true;
        });
    };
})( jQuery );