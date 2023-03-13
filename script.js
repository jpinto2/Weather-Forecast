function initPage() {
//API variables
const apiKey = 'a9a518b266a91371c0d1a381501364f0';
const baseUrl = 'https://api.openweathermap.org';


var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// document elements
const searchBtn = $('#searchBtn');
const recent = $('#recent');
const citySearch = $('#citySearch');
const currentDay = $('#currentDay');
const forecast = $('#forecast');

function getCoord(searchItem) {
    var apiUrl = `${baseUrl}/geo/1.0/direct?q=${searchItem}&limit=5&appid=${apiKey}`;

    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
            searchHistory.push(searchItem);
            localStorage.setItem("search", JSON.stringify(searchHistory));
            renderSearchHistory();
            getWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
}

function getWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
  
    var apiUrl = `${baseUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  
    fetch(apiUrl)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        renderCurrent(city, data[0]);
        // renderForecast(data);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

function renderCurrent(city, data) {
    var currentDate = dayjs().format('M/D/YYYY');
    var temp = data.main.temp;
    var wind = data.main.wind;
    var humidity = data.main.humidity;


    var heading = document.createElement('h2');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');
   
    heading.textContent = `${city} (${currentDate})`;
    tempEl.textContent = `Temp: ${tempF}°F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

    currentDay.append(heading, tempEl, windEl, humidityEl);
}

function renderForecast(data) {
    
}

function renderSearchHistory() {
    recent.innerHTML = "";
    for (var i=recent.length-1; i>=0; i--) {
        var newSearch = document.createElement("button");
        newSearch.setAttribute("type", "button");
        newSearch.setAttribute("class", "btn m-2");
        newSearch.setAttribute("value", searchHistory[i]);
        newSearch.addEventListener("click", function () {
            getCoord(newSearch.value);
        })
        recent.append(newSearch);
    }
}

searchBtn.click((event) => {
    event.preventDefault();

    const city = citySearch.value;
    getCoord(city);
    searchHistory.push(city);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    renderSearchHistory();
})

}

initPage();
