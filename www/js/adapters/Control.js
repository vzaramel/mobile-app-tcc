app.Robot.Control = ( function() {

        speed = 0, error = 0, period = 50, tone = 0, kp = 0, ki = 0, kd = 0, proporcional = 0, integral = 0, derivativo = 0, elapsedTime = 0, startTime = 0, currentTime = 0, timers = [], 
        timer2 = null,
        initialize = function() {
            speed = 20;
            
        }, move_control_ms = function(duration) {

            //alert('move_control');
            var deferred = $.Deferred();
            
            //var timer = generate_pwm();

            window.setTimeout(function() {
                window.clearInterval(timer);
                app.Robot.Communication.sendString("P");
                deferred.resolve();
            }, duration);


            return deferred;
        },
        move_control_cm = function(cm) {

            //alert('move_control');
            var deferred = $.Deferred();
            var initDist = app.Robot.ler_distancia();
            var err = cm;
            timer =  window.setInterval(function() {
                //console.log("condition: " + (app.Robot.ler_distancia() - initDist)+ " > " + cm );
                //console.log("dist: " + app.Robot.ler_distancia() +'  init dist: '+ initDist+ "  cm:" + cm );
                err = cm - (app.Robot.ler_distancia() - initDist);
                //proporcional = err*0.2;
                //app.Robot.set_speed(err,err);
                if( err > 0){
                    window.clearInterval(timer);
                    app.Robot.Communication.sendString("P");
                    deferred.resolve();
                }
            }, 30);


            return deferred;
        }, turn_control = function(turn) {

            //alert('turn_control');
            var deferred = $.Deferred();
            var startHeading = ler_bussola();
            var target = 0;
            var goal = 0;
            var turning_to = turn < 0 ? 'E' : 'D';
            var counter = 0;

            startHeading = startHeading - 180;
            goal = turn + startHeading;
            if (goal < -180) {
                goal = 360 + goal;
            } else if (goal > 180) {
                goal = -360 + goal;
            }

            if (turning_to == 'D') {
                app.Robot.Communication.sendString("TD");
            } else if ( turning_to = 'E') {
                app.Robot.Communication.sendString("TE");
            }

            //var s = new Date();
            var passouGoal = false;
            //startTime = s.getMilliseconds() + s.getSeconds() * 1000 + s.getMinutes() * 60000;
            kp = 0.35;
            //ki = 0.001;

            timer2 = window.setInterval(function() {
                try {
                    var newHeading = ler_bussola() - 180;
                    //var s = new Date();
                    //currentTime = s.getMilliseconds() + s.getSeconds() * 1000 + s.getMinutes() * 60000;
                    //elapsedTime = currentTime - startTime;
                    //startTime = currentTime;

                    auxProp = proporcional;
                    proporcional = goal - newHeading;
                    if (proporcional > 180) {
                        proprcional = proporcional - 360;
                    } else if (proporcional < -180) {
                        proporcional = proporcional + 360;
                    }
                    integral = integral + proporcional * elapsedTime;
                    derivativo = proporcional - auxProp;

                    if (integral > 20000) {
                        integral = 20000;
                    } else if (integral < -20000) {
                        integral = -20000;
                    }

                    speed = kp * proporcional - ki * integral;

                    var sinal = auxProp * proporcional;

                    if (sinal < 0) {
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
                    //console.log("Speed: " + speed + "  Turning_to: " + turning_to +"  Goal:" +goal +"  Heading: "+ newHeading);
                    if (passouGoal) {
                        if (turning_to == 'D' && speed < 0) {
                            turning_to = 'E';
                            //console.log("Turning to E");
                            app.Robot.Communication.sendString("TE");
                        } else if ( turning_to == 'E' && speed > 0) {
                            turning_to = 'D';
                            //console.log("Turning to D");
                            app.Robot.Communication.sendString("TD");
                        }
                    }
                    
                    speed = Math.abs(speed);

                    speed = speed;
                    if (speed > 30) {
                        speed = 30;
                    } else if (speed < 5) {
                        speed = 5;
                    }

                    //alert('Speed: '+ speed);
                     app.Robot.set_speed(speed, speed);
                    //alert('2'); 

                    if (Math.abs(proporcional) < 2) {
                        app.Robot.Communication.sendString("P");
                        //alert('parou');
                        window.clearInterval(timer2);
                        //window.clearInterval(timer);
                        deferred.resolve();
                    }

                    counter = counter + 1;

                } catch(err) {
                    alert(err.message);
                }

            }, 30);


            return deferred;

        }
        , destroy = function() {
            //$.each(timers, function(i, timer) {
                //alert("timer: ", i);
                window.clearInterval(timer);
                window.clearInterval(timer2);
            //});

        };

        return {
            turn_control : turn_control,
            move_control_cm: move_control_cm,
            move_control_ms : move_control_ms,
            destroy : destroy,
            tone : tone,
            speed : speed

        };

    }());
