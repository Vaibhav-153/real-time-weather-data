const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

function parseCoordinate(value, min, max) {
    const number = Number(value);
    return Number.isFinite(number) && number >= min && number <= max ? number : null;
}

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        response.setHeader('Allow', 'GET');
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return response.status(500).json({ error: 'Weather API is not configured' });
    }

    const city = typeof request.query.city === 'string'
        ? request.query.city.trim()
        : '';
    const lat = parseCoordinate(request.query.lat, -90, 90);
    const lon = parseCoordinate(request.query.lon, -180, 180);

    if (!city && (lat === null || lon === null)) {
        return response.status(400).json({ error: 'City or valid coordinates are required' });
    }

    if (city.length > 100) {
        return response.status(400).json({ error: 'City name is too long' });
    }

    const url = new URL(OPENWEATHER_URL);
    if (city) {
        url.searchParams.set('q', city);
    } else {
        url.searchParams.set('lat', String(lat));
        url.searchParams.set('lon', String(lon));
    }
    url.searchParams.set('appid', apiKey);
    url.searchParams.set('units', 'metric');

    try {
        const weatherResponse = await fetch(url);
        const data = await weatherResponse.json();

        if (!weatherResponse.ok) {
            const message = data.message || 'Weather service request failed';
            return response.status(weatherResponse.status).json({ error: message });
        }

        response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
        return response.status(200).json(data);
    } catch (error) {
        console.error('Weather request failed:', error);
        return response.status(502).json({ error: 'Unable to reach the weather service' });
    }
}
