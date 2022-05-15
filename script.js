const formSearch = document.getElementById('form-search');
const inputCity = document.getElementById('input-city');
const spanCurrentTemp = document.getElementById('span-current-temp'); 
const spanCurrentWind = document.getElementById('span-current-wind'); 
const spanCurrentHumidity = document.getElementById('span-current-humidity');
const spanCurrentUvi = document.getElementById('span-current-uvi');
const weatherCards = document.getElementById("weather-cards")
const spanCity = document.getElementById('span-city');
const spanDate = document.getElementById('span-date');

// My API Key
const APIKey = "1ee853b9d4b8634e0da07c960626cf95";

function getCityWeather(city) {
    
    // FYI
    // const url = "api.openweathermap.org/data/2.5/weather?q=" + city + "&appid={APIKey}";
    
    //String literal
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
    
    // promise
    return fetch(url)   
        .then(function(response) {
            console.log(response)
            return response.json();
        })
}        

function oneCall(lon, lat) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`;
    return fetch(url).then(function(response) {
        return response.json();
    });
        
}
    

function kelvinToCelcius(kelvin){
    return kelvin - 273.15;
}

spanDate.textContent = moment().format("D/M/YY");

// What would happen when the user enter a city?   
formSearch.addEventListener("submit", function(event){
    event.preventDefault();
    const city = inputCity.value;
    getCityWeather(city)
    .then(function(data){
        // show the current weather data
        console.log('data is', data);
        spanCity.textContent = data.name
        spanCurrentHumidity.textContent = data.main.humidity
        spanCurrentWind.textContent = data.wind.speed
        spanCurrentTemp.textContent = kelvinToCelcius(data.main.temp).toFixed(2);

        // call the one api to get the uvi index
        return oneCall(data.coord.lon, data.coord.lat)
             

    }).then(function(oneCallData){

            // < 4 green

            // < 4-8 -- yellow

            //  >9 -- red

        const uvi = oneCallData.current.uvi
        
        spanCurrentUvi.textContent = uvi

// when I look to the UV index, 
// I see a different colors according to the condition (favorable, moderate and severe)        

            if(uvi < 4) {
                spanCurrentUvi.setAttribute("class", "green")
            }
            if(uvi >= 4 && uvi <= 8) {
                spanCurrentUvi.setAttribute("class", "yellow")
            }
            if(uvi > 9) {
                spanCurrentUvi.setAttribute("class", "red")
                                      
    }; 

    // localStorage.setItem('current-data', textContent);
    // localStorage.getItem('data')
    //     JSON.stringify({'spanCity': textContent})
    //     console.log(data);


    const next5Days = oneCallData.daily.slice(0, 5);

    weatherCards.textContent = "";
    for (let index = 0; index < next5Days.length; index++) {
        const forecast = next5Days[index];
        //use moment to convert unix into human time Unix Timestamp =	token X	= output 1360013296

        // const icon = src=" http://openweathermap.org/img/wn/10d@2x.png" //TODO: My attempt to get icon into the cards.
        // icon = data.weather.icon
        
        const col = createWeatherCol(forecast.dt, '', forecast.temp.day) // TODO: Add humidity and icon (empty string)
        weatherCards.appendChild(col);

        // TODO: convert icon into URL check the API documentation
        
    }
    //show the 5 forecast cards

})        
/* <div class = "col">
<div class="card">
  <div class="card-body">
    <h4 class="card-title">20/01/2022</h4>
    <i>Icon</i> 
    <p class="card-text">
      <ul>
        <li>Temp: 30</li>
        <li>>Wind: 10</li>
        <li>Humidity: 29</li>
      </ul>
    </p>
  </div>
</div>
</div>        */

function createWeatherCol(date, icon, wind, humidity) {

    const col = document.createElement('div')
    col.setAttribute('class','col-2');

    const card = document.createElement('div')
    card.setAttribute('class','card');
    col.appendChild(card);
    
    const cardBody = document.createElement('div');
    cardBody.setAttribute("class","card-body");
    card.appendChild(cardBody);

    const dateHeading = document.createElement("h4");
    dateHeading.setAttribute("class", "card-title");
    cardBody.appendChild(dateHeading);
    
    dateHeading.textContent = date;
    // moment(timestamp, 'X').format("D/M/YYYY"); 
    // var date = moment.unix(value).format("D/M/YYYY");//TODO:CONVERTIR unix  to format D/M/YYYY
    
    const iconEl = document.createElement("img");
    iconEl.setAttribute("src", icon);
    cardBody.appendChild(iconEl);

    const p = document.createElement('p');
    const ul = document.createElement('ul');

    const tempEl = document.createElement('li');
    tempEl.textContent = tempEl;
    
    //TODO: add humidity and wind
    const humidityEl = document.createElement('li');
    humidityEl.textContent = humidityEl;
    
    const windEl = document.createElement('li');
    windEl.textContent = windEl;
     
    ul.appendChild(tempEl);

    p.appendChild(ul);

    return col;

}
 
// the city I have looked up for is saved to LS
// and its shown under the search button as a list

// when I start a new search 
// I am able to see the same information for the new city i have searched for
})
