jQuery(document).ready(function($){
  
  var mor = {};
  
  mor.isMobile = (/Android|webOS|CUPCAKE|BB10|froyo|iPhone|iPad|iPod|webmate|dream|incognito|BlackBerry|bada|s8000|IEMobile/i.test(navigator.userAgent)) ? true:false;
  
  mor.do_x = mor.do_y = mor.do_z = mor.do_pitch = 0;
  mor.portait = window.orientation == 0 ? true : false;
  mor.landscape1 = window.orientation == 90 ? true : false;
  mor.landscape2 = window.orientation == -90 ? true : false;
  mor.schema = 0; // 1 or 2
  
  mor.menu = $('#menu');
  mor.menu_items = mor.menu.find('.menu_item');
  mor.allow_orientation = false;
  
  mor.map_view = false;
  
  mor.map_wrapper = $('#map_wrapper');
  mor.map = $('#MOR');
  mor.map_links = mor.map.find('a');
  
  mor.first_pano = $( mor.map_links[0] ).attr('data-map'); // start with the first pano on the map
  
  mor.map_wrapper.css({opacity:0,display:'none'});
  
  mor.map_links.bind({
    'click' : function(e){
      this_link = $(this); // store area link
      
      this_map =  this_link.attr('data-map');           // store panoid
      this_heading =  parseInt(this_link.attr('data-heading')); // store heading
      this_pitch =  parseInt(this_link.attr('data-pitch'));   // store pitch
      this_zoom =   parseInt(this_link.attr('data-zoom'));    // store zoom


      mor.pano = new google.maps.StreetViewPanorama( document.getElementById('map-canvas'), mor.gmap_options )
        mor.pano.setPano( this_map ); // map key
        mor.pano.setVisible(true);
        
      mor.pano.setPov({
        heading: this_heading,
        pitch: this_pitch
        });
      
        mor.map_wrapper.animate({opacity: 0,}, 400, function() {
        mor.map_wrapper.css({opacity:0,display:'none'});
        mor.menu_items.find('icon-map').removeClass('active');
        mor.map_view = false;
      });
      
      return false; // do not follow the area location
    }, // end area click
    
    'mouseenter' : function(e){
    },
    
    'mouseleave' : function(e){
    },
    
  }); // end binding map areas
  

  mor.menu_items.bind({
    'click' : function(){
      this_item = $(this).find('.faicon');
      
      if( this_item.hasClass('icon-fs') ){
        toggleFullScreen()
      }
      
      if( this_item.hasClass('icon-switch') ){
        mor.allow_orientation = mor.allow_orientation ? false:true;
        if( mor.allow_orientation ) $(this).addClass('active');
        else $(this).removeClass('active');
      }
      
      if( this_item.hasClass('icon-zoomin') ){
        
        //mor.allow_orientation = mor.allow_orientation ? false:true;
        mor.pano.setZoom( mor.pano.getZoom() +1 );
      }
      
      if( this_item.hasClass('icon-zoomout') ){
        
        mor.pano.setZoom( mor.pano.getZoom() -1 );
        
        //mor.allow_orientation = mor.allow_orientation ? false:true;
      }
      
      if( this_item.hasClass('icon-map') ){
        toggleMapView();
      }
    }
  })
  
  function toggleMapView(){
    if(mor.map_view){
      turnOffMapView();
    }else{
      turnOnMapView(); 
    }
  }
  
  function turnOnMapView(){
    $(this).addClass('active');
    mor.map_wrapper.css({opacity:0,display:'block'});
    $('img[usemap]').rwdImageMaps(); // re-calculate map coords
    mor.map_wrapper.animate({opacity: 1,}, 200, function(){});
    //mor.map_background.animate({opacity: 1,}, 200, function(){});
    mor.map_view = true;
  }
  
  function turnOffMapView(){
    $(this).removeClass('active');
    mor.map_wrapper.animate({opacity: 0,}, 200, function(){
      mor.map_wrapper.css({opacity:0,display:'none'});
    })
	mor.map_view = false;
  }
  //mor.log.text( window.orientation );
  
  mor.gmap_options={
    addressControl:false,
    clickToGo:true,
    disableDefaultUI:false,
    scrollwheel:true,
    linksControl:false,
    panControl:false,
    // panControlOptions:{position:google.maps.ControlPosition.RIGHT_TOP},
    zoomControl:false,
    zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL,position:google.maps.ControlPosition.LEFT_TOP},
    enableCloseButton:false,
    pov: {
      heading: 15, // 360 rotation degree
      pitch: -8  // 0 = horizontal axis ( -90 +90 )
    },
    zoom: 0,
    	mode:detectMode()
  };
  
  
if(mor.isMobile)
mor.gmap_options={ 
	  addressControl:false,
	  clickToGo:true,
	  disableDefaultUI:false,
	  scrollwheel:true,
	  linksControl:true,
	  panControl:false,
	  zoomControl:false,
	  zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL,position:google.maps.ControlPosition.LEFT_TOP},
	  enableCloseButton:false,
	  pov: {
		heading: 15, // 360 rotation degree
		pitch: -8  // 0 = horizontal axis ( -90 +90 )
	  },
	  zoom: 0,
    	  mode:detectMode()
 };
	
  
  mor.pano = new google.maps.StreetViewPanorama( document.getElementById('map-canvas'), mor.gmap_options )
    mor.pano.setPano( mor.first_pano ); // map key
    mor.pano.setVisible(true);
    
// turn map tip on and off
  $(".icon-map").hover(
      function(){
        //alert("in area");
        $(".map-tip").css('visibility', 'visible'); 
      },
      function(){
        $(".map-tip").css('visibility', 'hidden');
      }
  );
   
  $(".icon-fs").hover(
      function(){
        //alert("in area");
        $(".fullscreen-tip").css('visibility', 'visible'); 
      },
      function(){
        $(".fullscreen-tip").css('visibility', 'hidden');
      }
  );
    
  $(document).click(function(event){
    if($(event.target).closest(mor.map_wrapper).length !== 0){
      if(mor.map_wrapper.css('display') === 'block'){
        turnOffMapView();
      }
    }
  })
  
  turnOnMapView();
  if(mor.isMobile)
    setupMobileViewing(mor);
	
}) // end jQuery wrapper


function toggleFullScreen(){
  if(!document.fullscreenElement&&!document.mozFullScreenElement&&!document.webkitFullscreenElement&&!document.msFullscreenElement){
    if(document.documentElement.requestFullscreen){
      document.documentElement.requestFullscreen()
    }else if(document.documentElement.mozRequestFullScreen){
      document.documentElement.mozRequestFullScreen()
    }else if(document.documentElement.webkitRequestFullscreen){
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
    }else if(document.documentElement.msRequestFullscreen){
      document.body.msRequestFullscreen()
    }
    //document.addEventListener("mozfullscreenchange",fullscreenEvent,false);
    //document.addEventListener("webkitfullscreenchange",fullscreenEvent,false);
    //document.addEventListener("msfullscreenchange",fullscreenEvent,false)
  }else{
    if(document.CancelFullScreen){document.CancelFullScreen()
    }else if(document.mozCancelFullScreen){
      document.mozCancelFullScreen()
    }else if(document.webkitCancelFullScreen){
      document.webkitCancelFullScreen()
    }else if(document.msExitFullscreen){document.msExitFullscreen()}}google.maps.event.trigger(panorama,"resize");pov_changed()}
  

function supportsCanvas(){var e=document.createElement("canvas");return!(!e.getContext||!e.getContext("2d"))}

function supportsWebGL(){if(!window.WebGLRenderingContext)return!1;var e=document.createElement("canvas"),t=["webgl","experimental-webgl","moz-webgl","webkit-3d"];for(var n in t)if(gl=e.getContext(t[n]))return!0;return!1}

function detectMode(){return supportsCanvas()?supportsWebGL()?"webgl":"html5":"html4"}

