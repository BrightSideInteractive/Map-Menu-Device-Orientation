function setupMobileViewing(mor){  
  
  window.addEventListener('deviceorientation', handleOrientation);
  window.addEventListener('orientationchange', handleOrientationChange);
  
  function handleOrientationChange(){
    mor.portait = window.orientation == 0 ? true : false;
    mor.landscape1 = window.orientation == 90 ? true : false;
    mor.landscape2 = window.orientation == -90 ? true : false;
  }
  
  function handleOrientation(event){
    mor.do_x = event.beta;  // In degree in the range [-180,180]
    mor.do_y = event.gamma; // In degree in the range [-90,90]
    mor.do_z = event.alpha; // In degree in the range [0, 360]
    mor.do_absolute = event.absolute;
  }
  
  sid = setInterval(function(){
    if(!mor.allow_orientation)
      return false;
    //mor.do_z = Math.round( mor.do_z );
    //mor.do_z = Math.round( compassHeading( mor.do_z, mor.do_x, mor.do_y ) );
    mor.do_z_inverted = Math.round(compassHeading(mor.do_z, mor.do_x, mor.do_y)); // mor.do_z // mor.do_z * -1 + 360;
    
    if(mor.portait){
      mor.do_pitch = mor.do_x;
    }else{
      mor.do_pitch = Math.round(mor.do_y);
      if(mor.landscape1){
        if(mor.do_pitch < 0)
          mor.do_pitch = (mor.do_pitch * -1) - 90  // 0   90 90    0   // -90    090     0
        else
          mor.do_pitch = (mor.do_pitch * -1) + 90  
        //mor.do_pitch = mor.do_pitch < -90 ? -90 : mor.do_pitch;
        //mor.do_pitch = mor.do_pitch > 90  ?  90 : mor.do_pitch;   
      }else{ //landscape 2  
        if(mor.do_pitch < 0)
          mor.do_pitch = mor.do_pitch + 90  // 0   90 90    0   // -90    090     0
        else
          mor.do_pitch = mor.do_pitch - 90
      }
    } 
  
    //mor.log.html( 'wo: ' + window.orientation + '<br />pitch: ' + Math.round(mor.do_pitch) );
  
    //mor.landscape1
    //mor.landscape2  
    // -90   0    +90
    //mor.log.text( mor.do_z + ' - ' + mor.do_pitch );
    
    if(mor.do_z_inverted != mor.do_prev_z || mor.do_prev_v != mor.do_pitch){ 
      //mor.log.text( 'moving');
      mor.pano.setPov({
        heading: mor.do_z_inverted,
        pitch: mor.do_pitch
      });
    }else{
      //mor.log.text( 'steady');
    }
    mor.do_prev_z = mor.do_z_inverted;
    mor.do_prev_v = mor.do_pitch;
  }, 100);  // Frequency of POV updates
  
  var degtorad = Math.PI / 180; //Degree-to-Radian conversion

  function compassHeading(alpha, beta, gamma){
    var _x = beta  ? beta  * degtorad : 0; //beta value
    var _y = gamma ? gamma * degtorad : 0; //gamma value
    var _z = alpha ? alpha * degtorad : 0; //alpha value

    var cX = Math.cos(_x);
    var cY = Math.cos(_y);
    var cZ = Math.cos(_z);
    var sX = Math.sin(_x);
    var sY = Math.sin(_y);
    var sZ = Math.sin(_z);

    //Calculate Vx and Vy components
    var Vx = - cZ * sY - sZ * sX * cY;
    var Vy = - sZ * sY + cZ * sX * cY;

    //Calculate compass heading
    var compassHeading = Math.atan(Vx/Vy);

    //Convert compass heading to use whole unit circle
    if(Vy < 0){
      compassHeading += Math.PI;
    } else if(Vx < 0) {
      compassHeading += 2 * Math.PI;
    }

    return compassHeading * (180/Math.PI); // Compass Heading (in degrees)
  }
}
