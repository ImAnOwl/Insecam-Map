<?php header('Access-Control-Allow-Origin: *'); ?>
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="content-type" content="text/html; charset=ANSI" />
  <title>Insecam Map</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
   
  
  <style>
   /* Always set the map height explicitly to define the size of the div
    * element that contains the map. */
   #map {
     height: 100%;
   }
   /* Optional: Makes the sample page fill the window. */
   html, body {
     height: 100%;
     margin: 0;
     padding: 0;
   }

    
 </style>
</head>
<body>

        <div id="map"></div>
        
<!-- code -->
 <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB1aJErZr-YTlhTvvxHGUUfNRTUMty__Y4"
   type="text/javascript"></script>
  <script type="text/javascript">
      
var map = new google.maps.Map(document.getElementById("map"), {
zoom: 5,
center: new google.maps.LatLng(51.54376, 9.910419999999931),
mapTypeId: google.maps.MapTypeId.ROADMAP
});
     if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(function(position) {
         var pos = {
           lat: position.coords.latitude,
           lng: position.coords.longitude
         };
                     map.setZoom(11);
         map.setCenter(pos);
       }, function() {
         handleLocationError(true, infoWindow, map.getCenter());
       });
     } else {
       handleLocationError(false, infoWindow, map.getCenter());
     }



$(document).ready(function(){

  function marker(x, data_json){
    var marker = new google.maps.Marker({
            position: new google.maps.LatLng(data_json[x].lat, data_json[x].lon),
            map: map,
            url: data_json[x].source
            });


            

            marker.addListener('click', function() {
              var contents = "<a href='" + data_json[x].source + "'><img id='image0' src='" + data_json[x].source + "' alt='' height='420' width='420'/><br><b>" + data_json[x].city + "</b></a>";
              var infowindow = new google.maps.InfoWindow({
              content: contents
              });
              infowindow.open(map, marker);
            });
  }

    $.get('https://api.oliverczempas.de/inseccam/points/', function(data) {
      
      var data_raw = data;
      var data_json = JSON.parse(data_raw);
      for(x in data_json){
          //console.log(data_json[x].city);
            
          marker(x, data_json);
         }

    });
});

  </script>
</body>
</html>

