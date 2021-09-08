var input = document.querySelector("#input");
var search = document.querySelector("#search");
var cityName = document.querySelector("#city-name");

var key = "bd049a07fbe50fe7d3fdc4b706ec6bdf";
var storage = [];

var inputHandler = function() {
    var cityValue = input.value.trim();

    if (cityValue) {
        console.log(typeof(cityValue));
        cityName.innerHTML = cityValue;
    } else {
        alert("Please enter a city");
    }
};

//get coordinates
var coordinates = function(city) {
    var weatherApi = "api.openweathermap.org/data/2.5/weather?q="
    + city + "&appid=" + key;

    fetch(weatherApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {

            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
};

search.addEventListener("click", inputHandler);