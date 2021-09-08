var userFormEl = document.querySelector("#user-form");
var inputEl = document.querySelector("#input");
var cityEl = document.querySelector("#city-name");

var todayIcon = document.querySelector("#today-icon");
var todayTemp = document.querySelector("#today-temp");
var todayWind = document.querySelector("#today-wind");
var todayHum = document.querySelector("#today-hum");
var todayUV = document.querySelector("#today-uv");

var key = "bd049a07fbe50fe7d3fdc4b706ec6bdf";
var storage = [];

var inputHandler = function(event) {
    event.preventDefault();

    var cityValue = inputEl.value.trim();

    if (cityValue) {
        apiCity(cityValue);
    } else {
        alert("Please enter a city!");
    }
};

//city api call
var apiCity = function(city) {
    var weatherApi = "https://api.openweathermap.org/data/2.5/weather?q="
    + city + "&units=imperial&APPID=" + key;

    fetch(weatherApi).then(function(response) {
        //console.log(response);
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                var latitude = data.coord["lat"];
                var longitude = data.coord["lon"];
                
                cityEl.innerHTML = data.name + " (" + moment().format("M-D-YYYY") + ")";
                var icon = data.weather[0].icon;
                todayIcon.setAttribute("src", "http://openweathermap.org/img/wn/" + icon + ".png");
                
                apiCurrent(latitude, longitude);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

//one call using lat & lon
var apiCurrent = function(lat, lon) {
    
    var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat="
    + lat + "&lon=" + lon +
    "&exclude=minutely,hourly&units=imperial&APPID="
    + key;

    fetch(oneCall).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                
                console.log(data);
                todayTemp.innerHTML = data.current.temp;
                todayWind.innerHTML = data.current.wind_speed + " ";
                todayHum.innerHTML = data.current.humidity;
                todayUV.innerHTML = data.current.uvi;

            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

userFormEl.addEventListener("submit", inputHandler);