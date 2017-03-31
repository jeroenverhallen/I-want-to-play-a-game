// googlemaps

function geoFindMe() {
  var output = document.getElementById("out")

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>"
    return
  }

  function success(position) {
    var latitude  = Math.round(100 * position.coords.latitude)/100
    var longitude = Math.round(100 * position.coords.longitude)/100

    output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>'
  }

  function error() {
    output.innerHTML = "Unable to retrieve your location"
  }

  output.innerHTML = "<p>Locating…</p>"

  navigator.geolocation.getCurrentPosition(success, error)
}

// $('#ex1').slider({
// 	formatter: function(value) {
// 		return 'Current value: ' + value;
// 	}
// }).onChange( f => {
//   console.log(value)
// })

// var slider = new Slider('#ex1', {} ) 


//datepicker
// $(function () {
//   $('#datetimepicker8').datetimepicker({
//     icons: {
//       time: "fa fa-clock-o",
//       date: "fa fa-calendar",
//       up: "fa fa-arrow-up",
//       down: "fa fa-arrow-down"
//     }
//   })
// })