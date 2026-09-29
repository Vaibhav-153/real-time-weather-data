const WEATHER_API_ENDPOINT = '/api/weather';

const weatherForm = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const loading = document.getElementById('loading');
const errorBox = document.getElementById('error');
const weatherSection = document.getElementById('weatherSection');
const cityNameEl = document.getElementById('cityName');
const weatherIconEl = document.getElementById('weatherIcon');
const temperatureEl = document.getElementById('temperature');
const descriptionEl = document.getElementById('description');
const windSpeedEl = document.getElementById('windSpeed');
const humidityEl = document.getElementById('humidity');

function setLoading(isLoading) {
    loading.classList.toggle('hidden', !isLoading);
    weatherForm.setAttribute('aria-busy', String(isLoading));
    searchBtn.disabled = isLoading;
    geoBtn.disabled = isLoading;
    cityInput.disabled = isLoading;
}

function hideError() {
    errorBox.textContent = '';
    errorBox.classList.add('hidden');
}

function showError(message) {
    setLoading(false);
    hideWeather();
    errorBox.textContent = message;
    errorBox.classList.remove('hidden');
}

function hideWeather() {
    weatherSection.classList.add('hidden');
}

function isWeatherResponse(data) {
    return Boolean(
        data
        && data.name
        && data.sys?.country
        && Number.isFinite(data.main?.temp)
        && Number.isFinite(data.main?.humidity)
        && Number.isFinite(data.wind?.speed)
        && data.weather?.[0]?.icon
        && data.weather?.[0]?.description
    );
}

async function fetchWeather(params) {
    const query = new URLSearchParams(params);
    const response = await fetch(`${WEATHER_API_ENDPOINT}?${query.toString()}`);

    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error('Weather service returned an invalid response.');
    }

    if (!response.ok) {
        throw new Error(data.error || data.message || 'Unable to fetch weather data.');
    }

    if (!isWeatherResponse(data)) {
        throw new Error('Weather service returned incomplete data.');
    }

    return data;
}

function displayWeather(data) {
    const weather = data.weather[0];

    cityNameEl.textContent = `${data.name}, ${data.sys.country}`;
    weatherIconEl.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    weatherIconEl.alt = weather.description;
    temperatureEl.textContent = `${Math.round(data.main.temp)}°C`;
    descriptionEl.textContent = weather.description;
    windSpeedEl.textContent = `${data.wind.speed} m/s`;
    humidityEl.textContent = `${data.main.humidity}%`;

    hideError();
    setLoading(false);
    weatherSection.classList.remove('hidden');
}

weatherForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name.');
        return;
    }

    hideError();
    hideWeather();
    setLoading(true);

    try {
        const data = await fetchWeather({ city });
        displayWeather(data);
    } catch (error) {
        showError(error.message);
    }
});

geoBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by this browser.');
        return;
    }

    hideError();
    hideWeather();
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
            try {
                const data = await fetchWeather({
                    lat: coords.latitude,
                    lon: coords.longitude,
                });
                displayWeather(data);
            } catch (error) {
                showError(error.message);
            }
        },
        (error) => {
            const messages = {
                [error.PERMISSION_DENIED]: 'Location access was denied.',
                [error.POSITION_UNAVAILABLE]: 'Your location is currently unavailable.',
                [error.TIMEOUT]: 'Location request timed out.',
            };
            showError(messages[error.code] || 'Unable to get your location.');
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000,
        },
    );
});

hideWeather();
hideError();
setLoading(false);
