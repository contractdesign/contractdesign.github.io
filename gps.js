function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;

      /*
        reference links for Google map URLs
        - https://stackoverflow.com/questions/2660201/what-parameters-should-i-use-in-a-google-maps-url-to-go-to-a-lat-lon
        - https://developers.google.com/maps/documentation/urls/guide
      */
      var url = document.createElement('a');
      url.innerHTML = 'google maps: ' + latitude + ', ' + longitude;
      var url_string = 'https://www.google.com/maps/search/?api=1&query=' + latitude + "," + longitude;
      url.setAttribute('href', url_string );
      output.appendChild(url);

      // add link to copy buffer
      navigator.clipboard.writeText(url_string).then(function() {},
                                                     function() {} );
  }



  function error() {
    output.innerHTML = "Unable to retrieve your location";
  }


  navigator.geolocation.getCurrentPosition(success, error);
}
