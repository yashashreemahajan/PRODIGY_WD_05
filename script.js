const API_KEY = '2b1b8ee0796a404575504483ca164c35'; // Replace with your OpenWeatherMap API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput   = document.getElementById('cityInput');
const loading     = document.getElementById('loading');
const errorBox    = document.getElementById('error');
const weatherInfo = document.getElementById('weatherInfo');

/* Demo data used when the placeholder key is still present */
const demoData = {
  name: "Pune",
  main: {
    temp: 22,
    feels_like: 25,
    humidity: 65,
    pressure: 1013
  },
  weather: [{ description: "partly cloudy", main: "Clouds" }],
  wind: { speed: 3.5 }
};

/* ---------- UI helpers ---------- */
function showLoading() {
  loading.style.display = 'block';
  errorBox.style.display = 'none';
  weatherInfo.classList.remove('show');
}
function hideLoading() { loading.style.display = 'none'; }
function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
  hideLoading();
}

/* ---------- Render ---------- */
function displayWeather(data) {
  document.getElementById('cityName')   .textContent = data.name;
  document.getElementById('temperature').textContent = Math.round(data.main.temp) + '°C';
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('feelsLike')  .textContent = Math.round(data.main.feels_like) + '°C';
  document.getElementById('humidity')   .textContent = data.main.humidity + '%';
  document.getElementById('windSpeed')  .textContent = data.wind.speed + ' m/s';
  document.getElementById('pressure')   .textContent = data.main.pressure + ' hPa';

  hideLoading();
  weatherInfo.classList.add('show');
}

/* ---------- Fetch by city or coords ---------- */
async function fetchWeather(city) {
  showLoading();

  /* Use demo data when placeholder key is untouched */
  if (API_KEY === '2b1b8ee0796a404575504483ca164c35') {
    setTimeout(() => {
      displayWeather({ ...demoData, name: city || 'Demo City' });
    }, 1000);
    return;
  }

  try {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('City not found');
    displayWeather(await res.json());
  } catch {
    showError('Failed to fetch weather data. Please check the city name and try again.');
  }
}

async function fetchWeatherByCoords(lat, lon) {
  showLoading();

  /* Use demo data when placeholder key is untouched */
  if (API_KEY === '2b1b8ee0796a404575504483ca164c35') {
    setTimeout(() => {
      displayWeather({ ...demoData, name: 'Current Location' });
    }, 1000);
    return;
  }

  try {
    const res = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('Location not found');
    displayWeather(await res.json());
  } catch {
    showError('Failed to fetch weather data for your location.');
  }
}

/* ---------- Public handlers ---------- */
function searchWeather() {
  const city = cityInput.value.trim();
  city ? fetchWeather(city) : showError('Please enter a city name');
}

function getCurrentLocation() {
  if (!navigator.geolocation) return showError('Geolocation is not supported by this browser.');
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
    ()  => showError('Unable to retrieve your location. Please search for a city instead.')
  );
}

/* Enter key triggers search */
cityInput.addEventListener('keypress', e => e.key === 'Enter' && searchWeather());

/* Load default weather on page load */
window.addEventListener('load', () => fetchWeather('Pune'));
