// scripts.js

async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) {
        alert('Please enter a city name');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/weather?city=${city}`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('weatherResult').innerHTML = `
                <h3 class="text-xl font-semibold mt-4">Weather in ${data.city}</h3>
                <p class="mt-2">Temperature: ${data.temperature}°C</p>
                <p>Description: ${data.description}</p>
                <p>Humidity: ${data.humidity}%</p>
                <p>Wind Speed: ${data.windSpeed} m/s</p>
            `;
            changeBackground(data.description);
        } else {
            document.getElementById('weatherResult').innerHTML = `<p class="mt-2 text-red-500">${data.error}</p>`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        document.getElementById('weatherResult').innerHTML = `<p class="mt-2 text-red-500">Error fetching weather data</p>`;
    }
}

async function getGeocode() {
    const location = document.getElementById('locationInput').value;
    if (!location) {
        alert('Please enter a location');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/geocode/${location}`);
        const data = await response.json();

        if (response.ok) {
            document.getElementById('geocodeResult').innerHTML = `
                <h3 class="text-xl font-semibold mt-4">Geocode for ${location}</h3>
                <p class="mt-2">Latitude: ${data.lat}</p>
                <p>Longitude: ${data.long}</p>
                <p>Elevation: ${data.elevation} meters</p>
            `;
        } else {
            document.getElementById('geocodeResult').innerHTML = `<p class="mt-2 text-red-500">${data.error}</p>`;
        }
    } catch (error) {
        console.error('Error fetching geocode data:', error);
        document.getElementById('geocodeResult').innerHTML = `<p class="mt-2 text-red-500">Error fetching geocode data</p>`;
    }
}

function changeBackground(description) {
    const body = document.querySelector('body');
    body.classList.remove('bg-clear', 'bg-cloudy', 'bg-rainy', 'bg-snowy', 'bg-custom');
    switch (description.toLowerCase()) {
        case 'clear sky':
            body.classList.add('bg-clear');
            break;
        case 'few clouds':
        case 'scattered clouds':
        case 'broken clouds':
        case 'overcast clouds':
            body.classList.add('bg-cloudy');
            break;
        case 'shower rain':
        case 'rain':
        case 'thunderstorm':
            body.classList.add('bg-rainy');
            break;
        case 'snow':
            body.classList.add('bg-snowy');
            break;
        default:
            body.classList.add('bg-custom');
            break;
    }
    console.log(`Changed background to: ${description}`);
}
