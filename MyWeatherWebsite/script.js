const apiKey = '31a4963b4d90c19d8c055e36606bf5a3'; 

document.addEventListener('DOMContentLoaded', () => {
   updateDateTime();
   loadSearchHistory();
   document.getElementById('searchBtn').addEventListener('click', getWeather);
   document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
});

function updateDateTime() {
   const now = new Date();
   const formattedTime = now.toLocaleString();
   document.getElementById('currentDateTime').textContent = `Current Time: ${formattedTime}`;
   setTimeout(updateDateTime, 1000);
}

async function getWeather() {
   const city = document.getElementById('cityInput').value.trim();
   if (!city) {
       alert("Please enter a city name.");
       return;
   }
   
   showLoader();
   saveSearch(city);
   
   try {
       const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
       const data = await response.json();
       
       if (response.ok) {
           displayWeather(data);
       } else {
           alert(data.message);
       }
       
   } catch (error) {
       alert("Something went wrong, please try again.");
   }
}

function displayWeather(data) {
   document.getElementById('weatherInfo').classList.remove('hidden');
   document.getElementById('cityName').textContent = data.name;
   document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
   document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
   document.getElementById('windSpeed').textContent = `Wind Speed: ${data.wind.speed} m/s`;
   document.getElementById('weatherDescription').textContent = `Description: ${data.weather[0].description}`;
   document.getElementById('sunrise').textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
   document.getElementById('sunset').textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
   document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
   
   hideLoader();
}

function showLoader() {
   document.getElementById('loader').classList.remove('hidden');
}

function hideLoader() {
   document.getElementById('loader').classList.add('hidden');
}

function saveSearch(city) {
   let history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
   if (!history.includes(city)) history.push(city);
   localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
   loadSearchHistory();
}

function loadSearchHistory() {
   const history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
   const historyList = document.getElementById('historyList');
   historyList.innerHTML = '';
   
   history.forEach(city => {
       const li = document.createElement('li');
       li.textContent = city;
       li.addEventListener('click', () => {
           document.getElementById('cityInput').value = city;
           getWeather();
       });
       historyList.appendChild(li);
   });
}

function clearHistory() {
   localStorage.removeItem('weatherSearchHistory');
   document.getElementById('historyList').innerHTML = '';
}