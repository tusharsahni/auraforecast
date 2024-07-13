// backend/server.js

const express = require('express'); 
const axios = require('axios'); 
const cors = require('cors');

const app = express();
const PORT = 3000;

const API_KEY = '124b6398323f0751e7f6444a071ee8a5'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'; 

app.use(cors());

app.get('/weather', async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: 'City name is required' });
    }

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric'
            }
        });

        const weatherData = response.data;
        res.json({
            city: weatherData.name,
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed
        });

    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

const geoAPI = 'AIzaSyCprcSP7ak4FYOJk4iqSqNy_IXa7Y0eDms';
app.get('/geocode/:location', async (req, res) => {
    const location = req.params.location;
    const geo_URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${geoAPI}`;

    if (!location) {
        res.status(400).json({ error: 'City name is required' });
    }

    try {
        const response = await axios.get(geo_URL);

        const place = response.data;
        if (place.status === 'OK') {
            const lat = place.results[0].geometry.location.lat;
            const long = place.results[0].geometry.location.lng;

            const URL_ELEVATION = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${long}&key=${geoAPI}`;
            const elev_data = await axios.get(URL_ELEVATION);

            const final = elev_data.data;

            res.json({
                lat: lat,
                long: long,
                elevation: final.results[0].elevation
            });

        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching geocoding data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
