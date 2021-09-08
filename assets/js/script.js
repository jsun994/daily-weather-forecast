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
        inputEl.value = "";
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
  
                var latitude = data.coord["lat"];
                var longitude = data.coord["lon"];
                
                cityEl.innerHTML = data.name +
                " (" + moment().format("M/D/YYYY") + ")";
                var icon = data.weather[0].icon;
                todayIcon.setAttribute("src",
                "http://openweathermap.org/img/wn/" + icon + ".png");
                
                apiCurrent(latitude, longitude);

                //if city list already exists, remove it
                if (document.querySelector(".cityList")) {
                    document.querySelector(".cityList").remove();
                }
                
                //save and load
                save(city);
                load();
            });
        } else {
            alert("Error: " + response.statusText);
            location.reload();
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
                
                //console.log(data);
                todayTemp.innerHTML = data.current.temp;
                todayWind.innerHTML = data.current.wind_speed + " ";
                todayHum.innerHTML = data.current.humidity;
                
                var currentUVI = data.current.uvi;
                //console.log(currentUVI);
                todayUV.innerHTML = currentUVI;
                
                switch (true) {
                    case (currentUVI <= 2):
                        todayUV.className = "badge green";
                        break;
                    case (currentUVI <= 5):
                        todayUV.className = "badge yellow";
                        break;
                    case (currentUVI <= 7):
                        todayUV.className = "badge orange";
                        break;
                    case (currentUVI <= 10):
                        todayUV.className = "badge red";
                        break;
                    case (currentUVI > 10):
                        todayUV.className = "badge purple";
                        break;
                    default:
                        break;
                }

                forecast(data);

            });
        } else {
            alert("Error: " + response.statusText);
            location.reload();
        }
    });
};

//5 day forecast
var forecast = function(data) {

    console.log(data);

    for (var i = 1; i < 6; i++) {

        var forecastDate = document.querySelector("#date" + i);
        forecastDate.innerHTML = moment().add(i, "days").format("M/D/YYYY");
        
        var forecastIcons = document.querySelector("#icon" + i);
        var fIcon = data.daily[i].weather[0].icon;
        forecastIcons.setAttribute("src",
        "http://openweathermap.org/img/wn/" + fIcon + ".png");

        var forecastTemp = document.querySelector("#temp" + i);
        forecastTemp.innerHTML = data.daily[i].temp.day;
        
        var forecastWind = document.querySelector("#wind" + i);
        forecastWind.innerHTML = data.daily[i].wind_speed + " ";

        var forecastHum = document.querySelector("#hum" + i);
        forecastHum.innerHTML = data.daily[i].humidity;
    }
};

var save = function(city) {

    //splice to prevent dulpicate saves
    for (var i = 0; i < storage.length; i++) {
        if (city === storage[i]) {
            //remove 1 element at index i
            storage.splice(i, 1);
        }
    }
    storage.push(city);
    localStorage.setItem("cities", JSON.stringify(storage));
    console.log(localStorage);
}

var load = function() {
    console.log(localStorage);
    storage = JSON.parse(localStorage.getItem("cities")) || [];

    var recent = document.querySelector("#recent");
    var list = document.createElement("p");
    list.className = "cityList";
    recent.appendChild(list);

    for (var i = 0; i < storage.length; i++) {
        var listItem = document.createElement("button");
        listItem.setAttribute("type", "button");
        listItem.setAttribute("value", storage[i]);
        listItem.innerHTML = storage[i];
        listItem.className = "btn-styles";
        list.prepend(listItem);
    }
    var listClick = document.querySelector(".cityList");
    listClick.addEventListener("click", searchRecent);
};

var searchRecent = function(event) {
    var clicked = event.target.getAttribute("value");
    apiCity(clicked);
};

load();
userFormEl.addEventListener("submit", inputHandler);