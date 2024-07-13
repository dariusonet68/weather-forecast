const baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const weatherDiv = document.getElementById('weather');

document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const city = document.getElementById('cityInput').value;
  if (city) {
    getWeather(city);
  }
});

async function getWeather(city) {
  const apiUrl = `${baseUrl}?q=${city}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (response.ok) {
      displayWeather(data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Eroare la obținerea datelor meteo:', error);
  }
}

function displayWeather(data) {
  weatherDiv.innerHTML = '';

  const currentWeather = data.list[0];
  document.getElementById('currentCity').innerText = data.city.name;
  document.getElementById('currentCountry').innerText = data.city.country;
  document.getElementById(
    'currentTemp'
  ).innerText = `${currentWeather.main.temp}°C`;
  document.getElementById(
    'currentFeelsLike'
  ).innerText = `Se resimte ca ${currentWeather.main.feels_like}°C`;
  document.getElementById('currentWeatherImg').innerText =
    currentWeather.weather[0].description;

  // prognoza pentru 5 zile
  const days = {};
  data.list.forEach((forecast) => {
    const date = new Date(forecast.dt * 1000);
    const day = date.toLocaleDateString('ro-RO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });

    if (!days[day]) {
      days[day] = {
        date: date.toLocaleDateString('ro-RO'),
        temp: forecast.main.temp,
        feels_like: forecast.main.feels_like,
        description: forecast.weather[0].description,
      };
    }
  });

  for (const day in days) {
    const weatherCard = document.createElement('div');
    weatherCard.className = 'card d-flex mb-3';
    weatherCard.style.width = '900px';
    weatherCard.style.height = '100px';

    weatherCard.innerHTML = `
            <div class="card-body d-flex row-3 justify-content-around">
                <h5 class="card-title">${day}</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${days[day].date}</h6>
                <p class="card-text">${days[day].description}</p>
                <p class="card-text">${days[day].temp}°C</p>
                <h6 class="card-subtitle mb-2 text-body-secondary">Se resimte ca ${days[day].feels_like}°C</h6>
            </div>
        `;

    weatherDiv.appendChild(weatherCard);
  }
}

getWeather('Lugoj');
