var searchInput = $("#search-input");
console.log(searchInput);
var searchButton = $("#search-button");
console.log(searchButton);
var APIkey = "fbc2d5bbada0f27cef0820ef96772def";

var sectionToday = $("#today");
var forecastTitle = $("#forecasted")
var forecastSection = $("#forecast");
var historyBtns = $(".history")

searchButton.on("click", function (event) {
    event.preventDefault()
    var cityName = searchInput.val()
    if(cityName === "") {
        return
    }
    currentWeather(cityName)
    saveHistory(cityName)
})

function saveHistory(cityName) {
    var storage = JSON.parse(localStorage.getItem('searchHistory'))

    if (storage === null) {
        storage = []
    }
    storage.push(cityName)
    localStorage.setItem('searchHistory', JSON.stringify(storage))
    getHistory()
}

function getHistory() {
    var storage = JSON.parse(localStorage.getItem('searchHistory'))
    historyBtns.text("")
    if (storage === null) {
        historyBtns.text("No Weather Search History")
    } else {
        historyBtns.text("")
        for (var i = 0; i < storage.length; i++) {
            var historyBtn = document.createElement('button')
            historyBtn.textContent = storage[i]
            historyBtns.append(historyBtn)

            historyBtn.addEventListener('click', function(event) {
                currentWeather(event.target.textContent)
            })
        }
    }
}

getHistory()

function currentWeather(city) {
    // searchButton.on("click", function(event) {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + APIkey

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            console.log(response)
            sectionToday.text("")
            sectionToday.addClass("today")
            var todayDate = moment.unix(response.dt).format("MM/DD/YYYY");
            var todayWeather = $("<h2>").text(response.name + " " + todayDate)

            sectionToday.append(todayWeather);
            todayWeather.append($("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png"))
            sectionToday.append($("<p>").text("Temp:" + " " + response.main.temp + "°C"))
            sectionToday.append($("<p>").text("Wind:" + " " + response.wind.speed + " " + "mps"))
            sectionToday.append($("<p>").text("Humidity:" + " " + response.main.humidity + "%"))

            $.ajax({

                url: `https://api.openweathermap.org/data/2.5/forecast?lat=${response.coord.lat}&lon=${response.coord.lon}&appid=${APIkey}`,
                method: "GET"
            })
                .then(function (response) {
                    console.log(response)
                    forecastSection.text("")
                    var ftitle = ($("<h4>").text("5-day Forecast:")).attr("id", "forecast-section")
                    forecastTitle.append(ftitle)
                    console.log(ftitle)

                    for (var i = 0; i < response.list.length; i += 8) {
                        console.log(response.list[i]);
                        var upcomingDate = moment.unix(response.list[i].dt).format("MM/DD/YYYY");
                        var upcomingWeather = $("<p>").text(upcomingDate)

                        var forecastDiv = $("<div>").addClass("card-div")
                        forecastSection.append(forecastDiv)
                        forecastDiv.append(upcomingWeather);
                        forecastDiv.append($("<img>").attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + "@2x.png"))
                        forecastDiv.append($("<p>").text("Temp:" + " " + response.list[i].main.temp + "°C"))
                        forecastDiv.append($("<p>").text("Wind:" + " " + response.list[i].wind.speed + " " + "mps"))
                        forecastDiv.append($("<p>").text("Humidity:" + " " + response.list[i].main.humidity + "%"))




                    }
                });
        });
    //   });
}
currentWeather();