let refreshBtn = document.querySelector("#js-new-quote");
let searchBtn = document.querySelector("#search-btn");
let cityInput = document.querySelector("#city-input");
let preciseRadio = document.querySelector("#precise-radio");
let cityRadio = document.querySelector("#city-radio");
let manualRadio = document.querySelector("#manual-radio");
let searchSection = document.querySelector("#search-section");

let currentPrivacyLevel = "city";
let lastLat = null;
let lastLon = null;
let lastCityName = null;

preciseRadio.addEventListener('change', handlePrivacyChange);
cityRadio.addEventListener('change', handlePrivacyChange);
manualRadio.addEventListener('change', handlePrivacyChange);
refreshBtn.addEventListener('click', getWeather);
searchBtn.addEventListener('click', getWeatherManual);

function handlePrivacyChange(event) {
    currentPrivacyLevel = event.target.value;
    
    if (currentPrivacyLevel === "manual") {
        searchSection.classList.add('show');
    } else {
        searchSection.classList.remove('show');
    }
}

function getWeather() {
    if (currentPrivacyLevel === "manual") {
        alert("Please enter a city name and click 'Get Weather'");
        return;
    }
    
    showLoading();
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                lastLat = lat;
                lastLon = lon;
                
                if (currentPrivacyLevel === "precise") {
                    fetchWeatherByCoords(lat, lon, "precise");
                } else if (currentPrivacyLevel === "city") {
                    getCityFromCoords(lat, lon);
                }
            },
            function(error) {
                console.log(error);
                alert("Unable to get your location. Please enable location services or use manual entry.");
                hideLoading();
            }
        );
    } else {
        alert("Your Location is not supported by your browser. Please use manual entry.");
        hideLoading();
    }
}

function getWeatherManual() {
    const cityName = cityInput.value.trim();
    
    if (cityName === "") {
        alert("Please enter a city name");
        return;
    }
    
    showLoading();
    getCoordsFromCity(cityName);
}

function getCityFromCoords(lat, lon) {
    const geocodeUrl = "https://nominatim.openstreetmap.org/reverse?lat=" + lat + "&lon=" + lon + "&format=json";
    
    fetch(geocodeUrl, {
        headers: {
            'User-Agent': 'WeatherDashboard/1.0'
        }
    })
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            const city = data.address.city || data.address.town || data.address.village || "Unknown";
            const state = data.address.state || "";
            lastCityName = city + ", " + state;
            
            fetchWeatherByCity(city, state);
        })
        .catch(function(err) {
            console.log(err);
            fetchWeatherByCoords(lat, lon, "city");
        });
}

function getCoordsFromCity(cityName) {
    const geocodeUrl = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(cityName) + "&format=json&limit=1";
    
    fetch(geocodeUrl, {
        headers: {
            'User-Agent': 'WeatherDashboard/1.0'
        }
    })
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                lastLat = lat;
                lastLon = lon;
                lastCityName = cityName;
                fetchWeatherByCoords(lat, lon, "manual");
            } else {
                alert("City not found. Please try again.");
                hideLoading();
            }
        })
        .catch(function(err) {
            console.log(err);
            alert("Failed to find city. Please check the name and try again.");
            hideLoading();
        });
}

function fetchWeatherByCity(city, state) {
    const searchQuery = city + ", " + state + ", USA";
    const geocodeUrl = "https://nominatim.openstreetmap.org/search?q=" + encodeURIComponent(searchQuery) + "&format=json&limit=1";
    
    fetch(geocodeUrl, {
        headers: {
            'User-Agent': 'WeatherDashboard/1.0'
        }
    })
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            if (data.length > 0) {
                const lat = data[0].lat;
                const lon = data[0].lon;
                fetchWeatherByCoords(lat, lon, "city");
            } else {
                fetchWeatherByCoords(lastLat, lastLon, "city");
            }
        })
        .catch(function(err) {
            console.log(err);
            fetchWeatherByCoords(lastLat, lastLon, "city");
        });
}

function fetchWeatherByCoords(lat, lon, privacyUsed) {
    const pointsUrl = "https://api.weather.gov/points/" + lat + "," + lon;
    
    fetch(pointsUrl, {
        headers: {
            'User-Agent': 'WeatherDashboard/1.0'
        }
    })
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            const forecastUrl = data.properties.forecast;
            const city = data.properties.relativeLocation.properties.city;
            const state = data.properties.relativeLocation.properties.state;
            
            if (privacyUsed === "city" && !lastCityName) {
                lastCityName = city + ", " + state;
            }
            
            return fetch(forecastUrl, {
                headers: {
                    'User-Agent': 'WeatherDashboard/1.0'
                }
            });
        })
        .then(function(response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .then(function(data) {
            displayWeather(data, lat, lon, privacyUsed);
            hideLoading();
        })
        .catch(function(err) {
            console.log(err);
            alert("Failed to get weather data. The National Weather Service API only works for US locations.");
            hideLoading();
        });
}

function displayWeather(data, lat, lon, privacyUsed) {
    const weatherDisplay = document.querySelector('#weather-display');
    const locationName = document.querySelector('#location-name');
    const tempDisplay = document.querySelector('#temp-display');
    const weatherDesc = document.querySelector('#weather-desc');
    const weatherDetails = document.querySelector('#weather-details');
    const dataNotice = document.querySelector('#data-notice');
    
    const currentPeriod = data.properties.periods[0];
    
    locationName.textContent = lastCityName || "Current Location";
    tempDisplay.textContent = currentPeriod.temperature + "°" + currentPeriod.temperatureUnit;
    weatherDesc.textContent = currentPeriod.shortForecast;
    
    weatherDetails.innerHTML = 
        "<div><strong>" + currentPeriod.name + ":</strong> " + currentPeriod.detailedForecast + "</div>";
    
    let noticeText = "";
    if (privacyUsed === "precise") {
        noticeText = " Data sent: Your exact Location (lat: " + lat.toFixed(4) + ", lon: " + lon.toFixed(4) + ")";
    } else if (privacyUsed === "city") {
        noticeText = " Data sent: City-level coordinates only (" + lastCityName + ")";
    } else {
        noticeText = " Data sent: Coordinates from city you entered (" + lastCityName + ")";
    }
    
    dataNotice.textContent = noticeText;
    weatherDisplay.classList.add('show');
}

function showLoading() {
    const loading = document.querySelector('#js-loading');
    const weatherDisplay = document.querySelector('#weather-display');
    loading.classList.add('show');
    weatherDisplay.classList.remove('show');
    refreshBtn.disabled = true;
}

function hideLoading() {
    const loading = document.querySelector('#js-loading');
    loading.classList.remove('show');
    refreshBtn.disabled = false;
}