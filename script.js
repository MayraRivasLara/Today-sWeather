$(document).ready(function () {
  //My Open Weather API Key
  const APIKey = "1ee853b9d4b8634e0da07c960626cf95";

  // Search variables - search bar functionality.
  const formSearch = document.getElementById("form-search");
  const inputCity = document.getElementById("input-city");
  const citiesList = $("ul");

  // Today's forecast variables
  const spanCity = document.getElementById("span-current-city");
  const currentIcon = document.getElementById("current-icon");
  const spanDate = document.getElementById("span-current-date");
  const spanCurrentTemp = document.getElementById("span-current-temp");
  const spanCurrentWind = document.getElementById("span-current-wind");
  const spanCurrentHumidity = document.getElementById("span-current-humidity");
  const spanCurrentUvi = document.getElementById("span-current-uvi");

  // Next 5 days weather cards - variable
  const weatherCards = document.getElementById("weather-cards");

  displayPreSearch();

  let previousSearches = [];

  let citySearches = JSON.parse(localStorage.getItem("previousSearches")) || [];

  // getting data from API - today's City Weather
  function getCityWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;

    return fetch(url).then(function (response) {
      console.log(response);
      return response.json();
    });
  }

  // getting UVI from API.
  function oneCall(lon, lat) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    return fetch(url).then(function (response) {
      return response.json();
    });
  }

  // function to convert kelvin to celcius.
  function kelvinToCelsius(kelvin) {
    return kelvin - 273.15;
  }

  function getCities() {
    let previousCities =
      JSON.parse(localStorage.getItem("previousSearches")) || [];
    if (!previousCities) {
      previousCities = [];
    }
    return previousCities;
  }

  function saveToLocalStorage(name) {
    let previousCities = getCities();

    // getting the name of previous cities searched.
    const found = previousCities.find(
      (city) => city.toLowerCase() === name.toLowerCase()
    );

    if (found) {
      return;
    }

    // adding city to existing list.
    previousCities.push(name);

    // save updated data to LS.
    previousCities = JSON.stringify(previousCities);
    localStorage.setItem("previousSearches", previousCities);
  }

  function displayPreSearch() {
    // fetching all cities from LS.
    let cities = getCities();
    console.log(cities);
    citiesList.text("");

    // "for" loop to create an element that will be displayed in the list.
    for (let index = 0; index < cities.length; index++) {
      const city = cities[index];
      const historyEl = document.createElement("input");
      historyEl.setAttribute("type", "text");
      historyEl.setAttribute("readonly", true);
      historyEl.setAttribute("value", city);

      //on click of the displayed searched item
      historyEl.addEventListener("click", function (event) {
        searchWeather(historyEl.value);
      });

      // append element to the list.
      citiesList.append(historyEl);
    }
  }

  function searchWeather(city) {
    getCityWeather(city)
      .then(function (data) {
        saveToLocalStorage(data.name);
        displayPreSearch();
        spanCity.textContent = data.name;
        spanDate.textContent = moment.unix(data.dt).format("| ddd,MMM Do YYY");
        spanCurrentTemp.textContent =
          kelvinToCelsius(data.main.temp).toFixed(2) + "°C";
        spanCurrentWind.textContent = data.wind.speed + "km/h";
        spanCurrentHumidity.textContent = data.main.humidity + "%";
        return oneCall(data.coord.lon, data.coord.lat);
      })

      // Set color-indicator for UVI level.
      .then(function (oneCallData) {
        const uvi = oneCallData.current.uvi;
        spanCurrentUvi.textContent = uvi;
        if (uvi <= 4) {
          spanCurrentUvi.setAttribute("class", "low");
        }
        if (uvi > 4 && uvi <= 7) {
          spanCurrentUvi.setAttribute("class", "moderate");
        }
        if (uvi > 7 && uv <= 11) {
          spanCurrentUvi.setAttribute("class", "high");
        }

        const nxt5daysForecast = oneCallData.daily.slice(0, 5);
        weatherCards.textContent = "";
        for (let index = 0; index < nxt5daysForecast.length; index++) {
          const forecast = nxt5daysForecast[index];
          const col = futureForecast(
            forecast.dt,
            forecast.weather[0].icon,
            forecast.temp.day,
            forecast.humidity,
            forecast.wind_speed
          );
          weatherCards.appendChild(col);
        }
      });
  }

  // When the user enters a city - submit btn - display information on the right side.
  formSearch.addEventListener("submit", function (event) {
    event.preventDefault();
    const city = inputCity.value;
    searchWeather(city);
  });

  // Display data in cards.
  function futureForecast(date, icon, temp, wind, humidity) {
    const col = document.createElement("div");
    col.setAttribute("class", "col-2");

    const card = document.createElement("div");
    card.setAttribute("class", "card");
    col.appendChild(card);

    const cardBody = document.createElement("div");
    cardBody.setAttribute("class", "card-body");
    card.appendChild(cardBody);

    const dateHeading = document.createElement("h5");
    dateHeading.setAttribute("class", "card-title");
    cardBody.appendChild(dateHeading);

    dateHeading.textContent = moment.unix(date).add(1, "d").format("dddd");

    const currentIcon = document.createElement("img");
    currentIcon.setAttribute(
      "src",
      "http://openweathermap.org/img/wn/" + icon + ".png"
    );

    const p = document.createElement("p");
    cardBody.appendChild(p);
    const ul = document.createElement("ul");
    cardBody.appendChild(ul);

    const tempEl = document.createElement("p");
    tempEl.setAttribute("class", "card-title");
    tempEl.textContent = "Temp:" + kelvinToCelsius(temp).toFixed(2) + "°C";
    ul.appendChild(tempEl);

    const humidityEl = document.createElement("p");
    humidityEl.setAttribute("class", "card-title");
    humidityEl.textContent = "Humidity:" + humidity + "%";
    ul.appendChild(humidityEl);
    p.appendChild(ul);

    const windEl = document.createElement("p");
    windEl.setAttribute("class", "card-title");
    windEl.textContent = "Wind: " + wind + "km/h";
    ul.appendChild(windEl);

    return col;
  }
});
