document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cityForm');
  const locationBtn = document.getElementById('locationBtn');
  const pageContent = document.querySelector('.page-content');
  const apiKey = 'bcea0a9e3129809c0730d2c96d86ef36';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const city = document.getElementById('city').value;
    getWeatherByCity(city);
  });

  locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon);
      }, showError);
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  });

  function getWeatherByCity(city) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        displayCurrentWeather(data);
        return fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
      })
      .then((response) => response.json())
      .then((data) => displayForecast(data))
      .catch((error) => console.error('Error:', error));
  }

  function getWeatherByLocation(lat, lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        displayCurrentWeather(data);
        return fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
      })
      .then((response) => response.json())
      .then((data) => displayForecast(data))
      .catch((error) => console.error('Error:', error));
  }

  function displayCurrentWeather(data) {
    const weatherHtml = `
            <div class="weather-card current-weather">
                <h2>${data.name}, ${data.sys.country}</h2>
                <h3>${data.weather[0].description}</h3>
                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
                <h3>${data.main.temp} &deg;C</h3>
                <h4>Umiditate: ${data.main.humidity}%</h4>
                <h4>Viteza vantului: ${data.wind.speed} m/s</h4>
            </div>
        `;
    pageContent.innerHTML = weatherHtml;
  }

  function displayForecast(data) {
    const forecastHtml = data.list
      .filter((_, index) => index % 8 === 0 && index > 0)
      .slice(0, 5)
      .map(
        (forecast) => `
            <div class="weather-card forecast-weather">
                <h4>${new Date(forecast.dt_txt).toLocaleDateString()}</h4>
                <img src="http://openweathermap.org/img/wn/${
                  forecast.weather[0].icon
                }@2x.png" alt="weather icon">
                <p>${forecast.weather[0].description}</p>
                <p>${forecast.main.temp} &deg;C</p>
            </div>
        `
      )
      .join('');
    pageContent.innerHTML += `<div class="forecast-container">${forecastHtml}</div>`;
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert('User denied the request for Geolocation.');
        break;
      case error.POSITION_UNAVAILABLE:
        alert('Location information is unavailable.');
        break;
      case error.TIMEOUT:
        alert('The request to get user location timed out.');
        break;
      case error.UNKNOWN_ERROR:
        alert('An unknown error occurred.');
        break;
    }
  }
});
