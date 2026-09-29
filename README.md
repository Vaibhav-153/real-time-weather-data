# Dynamic Weather Dashboard

A small weather app built with HTML, CSS, and JavaScript. It shows current weather for a searched city or the user's browser location.

The browser sends requests to a Vercel serverless function, which adds the OpenWeather API key on the server. The key is not stored in frontend code.

**Live demo:** https://dynamicweatherdashboard.vercel.app/

![Weather dashboard showing current conditions](screenshot.png)

## Features

- Search current weather by city name
- Use browser geolocation to check weather for the current position
- Display temperature, condition, humidity, and wind speed
- Responsive layout for desktop and mobile
- Loading and error states
- Server-side OpenWeather API key handling through Vercel

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Vercel Serverless Functions
- OpenWeather Current Weather API

## Project Structure

```text
real-time-weather-data/
├── api/
│   └── weather.js
├── .env.example
├── .gitignore
├── index.html
├── LICENSE
├── README.md
├── screenshot.png
├── script.js
├── style.css
└── weather_icon.png
```

## How It Works

1. The user searches for a city or allows browser location access.
2. `script.js` sends the city or coordinates to `/api/weather`.
3. The Vercel function reads `API_KEY` from the deployment environment.
4. The function requests current conditions from OpenWeather using metric units.
5. The browser displays the returned temperature, condition, humidity, and wind speed.

## Run Locally

### Requirements

- Node.js
- Vercel CLI
- OpenWeather API key

Clone the repository:

```bash
git clone https://github.com/Vaibhav-153/real-time-weather-data.git
cd real-time-weather-data
```

Install the Vercel CLI if needed:

```bash
npm install -g vercel
```

Create a local environment file from `.env.example`:

```text
API_KEY=your_openweathermap_api_key
```

Save it as `.env`, then start the local Vercel environment:

```bash
vercel dev
```

Open the local URL printed by Vercel, normally `http://localhost:3000`.

## Deployment

The app is deployed on Vercel. The deployment needs one environment variable:

```text
API_KEY
```

Its value should be a valid OpenWeather API key. The frontend does not need direct access to the key.

## Error Handling

The serverless function checks for:

- missing API configuration
- missing city or coordinates
- invalid latitude or longitude
- unsupported HTTP methods
- upstream OpenWeather errors

The frontend displays API and geolocation errors without exposing the API key.

## Limitations

- The app shows current conditions only; it does not include hourly or multi-day forecasts.
- Weather availability and update frequency depend on OpenWeather.
- Browser geolocation requires user permission and HTTPS in deployed environments.
- The project does not store search history or user preferences.

## Future Work

- Add forecast data
- Add Celsius/Fahrenheit switching
- Save recent searches locally
- Add more weather details such as pressure and visibility

## License

MIT License. See `LICENSE`.
