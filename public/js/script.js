var returnLatitude;
var returnLongitude;

$(document).on('click', "#menubuttonsvg", function() {
    $('.mobileNavWrapper').toggleClass('showNav')
});

$(document).on('click', "#backsvg", function() {
  $('.mobileNavWrapper').removeClass('showNav')
});

////////////////Rendering bussesView based on the stop entered//////////////////
$(document).on('click', "#submit", function(event){
    event.preventDefault();
    $(".buses").html("");
    var stopId = $("#bus-search").val()
    var url = "https://ancient-peak-2424.herokuapp.com/busstop/" + stopId;
    $.ajax({
      url: url,
      type: "GET",
      dataType: "json"
    }).done(function(response){
      stopName = response.StopName; // From API
      predictions = response.Predictions; // From API
      //for loop goes through all the busses coming to the chosen stop for the next hour
      for(var i=0; i<predictions.length; i++){
        bus = new BusView(predictions[i])
        bus.render()//renders each bus number and arrival time.
      }
    }).fail(function(){ //closes ajax done function
      console.log("Oh noooo! It failed!");
    })
////////////////////////////////////////////////////////////////////////////////
   // THIS IS FOR MATCHING USER VAL TO DATABASE VAL
    var request = "https://ancient-peak-2424.herokuapp.com/busstops/";
    $.ajax({
      url: request,
      type: "GET",
      dataType: "json"
    })
    .done(function(response) {
      console.log(response.length);
      for (var index = 0; index < response.length; index++) {
        if (response[index].StopID === stopId) {
          console.log("The entry matches ")
          returnLatitude = response[index].Lat;
          returnLongitude = response[index].Lon;
          break
        }
      }//end of inner for loop
      return {
        returnLatitude:returnLatitude,
        returnLongitude:returnLongitude
      };
    })

    .then(function(latlon){
          var urlWeather = "https://ancient-peak-2424.herokuapp.com/weather/" + returnLatitude + '/' + returnLongitude;

          $.ajax({
            url: urlWeather,
            type: "GET",
            dataType: "json"
          })
          .done(function(response){
            latitude = response.latitude;

            console.log(response);
            console.log("latlon:"+latlon)

            weather = new WeatherView(response)
            weather.render()//renders each bus number and arrival time.
            weather.renderFlash()

          })
          .fail(function(){ //closes ajax done function
            console.log("Oh noooo! It failed!");
          })


      }) //END OF .FAIL AND END OF AJAX CALL

    .fail(function(response){
        console.log("js failed to load");
      });

    $(".weather").html("");
});//closes document.ready
