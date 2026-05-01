// ============================================
// GLOBAL VARIABLES (Declared once at top)
// ============================================
let currentLat = null;
let currentLon = null;
let hourlyWeatherData = [];

// ============================================
// WEATHER DESCRIPTION MAPPER
// ============================================
function getWeatherDescription(code) {
    switch (code) {
        case 0: return "Clear";
        case 1:
        case 2: return "Partly Cloudy";
        case 3: return "Cloudy";
        case 45:
        case 48: return "Foggy";
        case 51:
        case 53:
        case 55: return "Drizzle";
        case 61:
        case 63:
        case 65: return "Rain";
        case 71:
        case 73:
        case 75: return "Snow";
        case 80:
        case 81:
        case 82: return "Rain Showers";
        case 95:
        case 96:
        case 99: return "Thunderstorm";
        default: return "Clear";
    }
}

// ============================================
// WEATHER ICON MAPPER (HOURLY)
// ============================================
function getWeatherIcon(weatherCode, isday) {
    let icon = "";
    switch (weatherCode) {
        case 0:
            icon = isday ? "photos/sun" : "photos/full-moon";
            break;
        case 1:
        case 2:
            icon = isday ? "photos/sun (1)" : "photos/moon";
            break;
        case 3:
            icon = "photos/cloudy (1)";
            break;
        case 45:
        case 48:
            icon = isday ? "photos/foggy" : "photos/foggy-night";
            break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            icon = isday ? "photos/cloudy" : "photos/rain";
            break;
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            icon = "photos/heavy-rain";
            break;
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            icon = isday ? 'photos/snow' : 'photos/snow (1)';
            break;
        case 95:
        case 96:
        case 99:
            icon = "photos/thunderstorm";
            break;
        default:
            icon = "photos/sun";
    }
    return icon;
}

// ============================================
// WEATHER ICON MAPPER (DAILY)
// ============================================
function getdailyWeatherIcon(weatherCode) {
    switch (weatherCode) {
        case 0:
            return 'photos/sun';
        case 1:
        case 2:
            return 'photos/sun (1)';
        case 3:
            return 'photos/cloudy (1)';
        case 45:
        case 48:
            return 'photos/foggy';
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            return 'photos/cloudy';
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
            return 'photos/heavy-rain';
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return 'photos/snow';
        case 95:
        case 96:
        case 99:
            return 'photos/thunderstorm';
        default:
            return 'photos/sun';
    }
}

// ============================================
// WEATHER VIDEO MAPPER
// ============================================
const weatherVideos = {
    '0': 'photos/sunfields.mp4',
    '1': 'photos/sunny.mp4',
    '2': 'photos/sunny.mp4',
    '3': 'photos/blackclouds.mp4',
    '45': 'photos/fog.mp4',
    '48': 'photos/fog.mp4',
    '51': 'photos/side.mp4',
    '53': 'photos/side.mp4',
    '55': 'photos/side.mp4',
    '61': 'photos/rain2.mp4',
    '63': 'photos/rain2.mp4',
    '71': 'photos/snnow.mp4',
    '95': 'photos/light.mp4',
    '96': 'photos/light.mp4',
    '99': 'photos/light.mp4'
};

function updateWeatherVideo(weatherCode) {
    const videoElement = document.getElementById('weatherVideo');
    if (!videoElement) {
        console.warn('Video element not found');
        return;
    }
    const videoSource = weatherVideos[weatherCode] || 'photos/nightskyclouds.mp4';
    videoElement.src = videoSource;
    videoElement.load();
}

// ============================================
// UPDATE HOURLY DATA FOR SELECTED DAY
// ============================================
function updateHourlyDataForDay(selectedDate) {
    const selectedDayHours = hourlyWeatherData.time
        .map((time, index) => ({
            time,
            temp: hourlyWeatherData.temperature_2m[index],
            precipitation: hourlyWeatherData.precipitation_probability[index],
            weatherCode: hourlyWeatherData.weather_code[index],
            isDay: hourlyWeatherData.is_day[index]
        }))
        .filter(entry => entry.time.startsWith(selectedDate));

    const img = document.querySelector('.main-pic img');
    const hourlyCards = document.querySelectorAll('.hourly-card ul li');

    selectedDayHours.forEach((entry, index) => {
        if (hourlyCards[index]) {
            const timePart = entry.time.split('T')[1];
            const timeElement = hourlyCards[index].querySelector('.time');
            const tempElement = hourlyCards[index].querySelector('.temp');
            const precipElement = hourlyCards[index].querySelector('.precipitation');
            const imgElement = hourlyCards[index].querySelector('img');

            if (timeElement) timeElement.innerHTML = timePart;
            if (tempElement) tempElement.innerHTML = `${Math.round(entry.temp)}°C`;
            if (precipElement) precipElement.innerHTML = `${entry.precipitation}%`;

            const weatherIcon = getWeatherIcon(entry.weatherCode, entry.isDay);
            if (imgElement) imgElement.src = `${weatherIcon}.png`;
            if (img) img.src = `${weatherIcon}.png`;
        }
    });
}

// ============================================
// DISPLAY CURRENT TIME & DAY
// ============================================
function displayCurrentTime(timezoneOffset) {
    const currentTimeElement = document.getElementById('time');
    const currentDateElement = document.getElementById('day');

    function updateTimeAndDay() {
        const now = new Date(Date.now() + timezoneOffset * 1000);

        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const options = { weekday: 'long' };
        const dayString = now.toLocaleDateString([], options);

        if (currentTimeElement) currentTimeElement.innerHTML = timeString;
        if (currentDateElement) currentDateElement.innerHTML = dayString;
    }

    updateTimeAndDay();
    setInterval(updateTimeAndDay, 60000);
}

// ============================================
// MAIN WEATHER FUNCTION
// ============================================
function getWeather(lat, lon) {
    console.log(`Fetching weather for lat: ${lat}, lon: ${lon}`);

    // ===== CURRENT WEATHER =====
    const WeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,visibility,weather_code,cloudcover&daily=sunrise,sunset&timezone=auto`;

    fetch(WeatherUrl)
        .then(response => response.json())
        .then(weatherData => {
            console.log('Current weather data:', weatherData);

            // Update left panel - NOTE: Your HTML uses #temp (not .temp)
            const tempEl = document.getElementById("temp");
            const feelsEl = document.querySelector(".feels_like");
            const humidityEl = document.querySelector(".humidity");
            const windEl = document.querySelector(".wind");
            const visibilityEl = document.querySelector(".visibility");
            const sunriseEl = document.querySelector(".sunrise");
            const sunsetEl = document.querySelector(".sunset");
            const skyEl = document.querySelector(".sky");
            const cloudsEl = document.querySelector(".current-precipitation");

            if (tempEl) tempEl.innerHTML = Math.round(weatherData.current.temperature_2m) + "°C";
            if (feelsEl) feelsEl.innerHTML = Math.round(weatherData.current.apparent_temperature) + "°C";
            if (humidityEl) humidityEl.innerHTML = weatherData.current.relative_humidity_2m + "%";
            if (windEl) windEl.innerHTML = weatherData.current.wind_speed_10m + " km/h";
            if (visibilityEl) visibilityEl.innerHTML = (weatherData.current.visibility / 1000).toFixed(1) + " km";
            if (sunriseEl) sunriseEl.innerHTML = new Date(weatherData.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (sunsetEl) sunsetEl.innerHTML = new Date(weatherData.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Cloud cover - will be updated from hourly data later
            // For now set to 0, it will be updated when hourly data loads
            // Cloud cover - use API data or default to 0
            const cloudCover = weatherData.current.cloudcover || 0;
            if (cloudsEl) cloudsEl.innerHTML = cloudCover;

            // Weather description
            const weatherCode = weatherData.current.weather_code || 0;
            if (skyEl) skyEl.innerHTML = getWeatherDescription(weatherCode);

            // Update main picture
            const mainImg = document.querySelector('.main-pic img');
            if (mainImg) {
                const weatherIcon = getWeatherIcon(weatherCode, true);
                mainImg.src = `${weatherIcon}.png`;
            }

            updateWeatherVideo(weatherCode);
        })
        .catch(error => console.error('Error fetching current weather:', error));

    // ===== DAILY WEATHER =====
    // NOTE: cloudcover is NOT a valid daily parameter - use weather_code, temp_max/min, and time only
    const WeatherUrldaily = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_hours&forecast_days=14&daily=&timezone=auto`;
    fetch(WeatherUrldaily)
        .then(response => response.json())
        .then(dailydata => {
            console.log('Daily weather data:', dailydata);
            const dailyCards = document.querySelectorAll('.daily-card');

            if (!dailydata.daily || !dailydata.daily.weather_code) {
                console.error('Invalid daily data structure:', dailydata);
                return;
            }

            dailydata.daily.weather_code.forEach((weathercode, index) => {
                if (dailyCards[index]) {
                    const tempMax = Math.round(dailydata.daily.temperature_2m_max[index]);
                    const tempMin = Math.round(dailydata.daily.temperature_2m_min[index]);
                    const dateString = dailydata.daily.time[index];
                    const date = new Date(dateString);
                    const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                    const dayOfWeek = daysOfWeek[date.getDay()];
                    
                    // Get the container
                    const container = dailyCards[index].querySelector('.container');
                    if (!container) {
                        console.warn(`No container found in daily card ${index}`);
                        return;
                    }
                    
                    // Update all elements
                    const dateEl = container.querySelector('.date');
                    const dayEl = container.querySelector('.day');
                    const maxEl = container.querySelector('.max');
                    const minEl = container.querySelector('.min');
                    const imgEl = container.querySelector('img');
                    
                    if (dateEl) dateEl.innerHTML = dateString;
                    if (dayEl) dayEl.innerHTML = dayOfWeek;
                    if (maxEl) maxEl.innerHTML = `${tempMax}°C`;
                    if (minEl) minEl.innerHTML = `${tempMin}°C`;
                    
                    const weatherIcon = getdailyWeatherIcon(weathercode);
                    if (imgEl) imgEl.src = `${weatherIcon}.png`;
                    
                    console.log(`Daily card ${index}: ${dayOfWeek} ${dateString} - ${tempMax}°/${tempMin}°`);
                }
            });
        })
        .catch(error => console.error('Error fetching daily weather:', error));

    // ===== HOURLY WEATHER =====
    const WeatherUrlhourly = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=weather_code,temperature_2m,precipitation_probability,is_day,visibility&forecast_days=14&timezone=auto`;

    fetch(WeatherUrlhourly)
        .then(response => response.json())
        .then(data => {
            console.log('Hourly weather data:', data);
            hourlyWeatherData = data.hourly;
            const timezone = data.utc_offset_seconds;

            const timezones = data.utc_offset_seconds * 1000;
            const currentDate = new Date(Date.now() + timezones).toISOString().split('T')[0];

            updateHourlyDataForDay(currentDate);
            displayCurrentTime(timezone);

            const currentWeatherCode = data.hourly.weather_code[0];
            updateWeatherVideo(currentWeatherCode);
        })
        .catch(error => console.error('Error fetching hourly weather:', error));
}

// ============================================
// GET COORDINATES FROM CITY NAME
// ============================================
function getCoordinates(city) {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

    fetch(geoUrl)
        .then(response => response.json())
        .then(data => {
            if (!data.results || data.results.length === 0) {
                throw new Error("City not found");
            }

            currentLat = data.results[0].latitude;
            currentLon = data.results[0].longitude;
            const country = data.results[0].country;
            const cityName = data.results[0].name;

            // Update city display
            const citEl = document.querySelector(".cit");
            const citiesEl = document.querySelector(".cities");
            if (citEl) citEl.innerHTML = cityName + ', ' + country;
            if (citiesEl) citiesEl.innerHTML = cityName + ', ' + country;

            // Save to session
            sessionStorage.setItem("currentLat", currentLat);
            sessionStorage.setItem("currentLon", currentLon);

            // Fetch weather
            getWeather(currentLat, currentLon);
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
            alert('City not found. Please try another city.');
        });
}

// ============================================
// JQUERY - DOM READY
// ============================================
$(document).ready(function () {
    // Toggle Daily Forecast
    $("#toggleDaily").click(function () {
        $(".daily-container").slideToggle("slow");
    });

    // Toggle Hourly Forecast
    $("#toggleHourly").click(function () {
        $(".hourly-container").fadeToggle("slow");
    });

    // Active navbar item
    $(".navbar ul li a").click(function () {
        $(".navbar ul li a").removeClass("active");
        $(this).addClass("active");
    });

    // Scroll animations
    $(".nxt-btn").click(function () {
        $(this).closest("section").find(".daily-container, .hourly-container").animate({
            scrollLeft: "+=750px"
        }, 100, "swing");
    });

    $(".pre-btn").click(function () {
        $(this).closest("section").find(".daily-container, .hourly-container").animate({
            scrollLeft: "-=750px"
        }, 100, "swing");
    });

    // Click daily card to show hourly data
    $(document).on('click', '.daily-card', function () {
        const selectedDate = $(this).find(".container .date").text();
        console.log('Selected date:', selectedDate);
        $(".hourly-container").fadeToggle("slow");
        $(".loaders").show();
        setTimeout(function () {
            $(".loaders").hide();
            $(".hourly-container").fadeToggle("slow");
            updateHourlyDataForDay(selectedDate);
        }, 1000);
    });

    // Search button handler
    $("#submit").click(function (e) {
        e.preventDefault();
        const city = $("#city").val().trim();

        if (city === "") {
            $("#error-message").text("Please enter a city name.").show();
            return;
        }

        $("#error-message").hide();
        $(".daily-container, .hourly-container").fadeToggle("slow");
        $(".loader").show();

        // Fetch coordinates and weather
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

        fetch(geoUrl)
            .then(response => response.json())
            .then(data => {
                if (!data.results || data.results.length === 0) {
                    throw new Error("City not found");
                }

                currentLat = data.results[0].latitude;
                currentLon = data.results[0].longitude;
                const country = data.results[0].country;
                const cityName = data.results[0].name;

                // Update city display
                const citEl = document.querySelector(".cit");
                const citiesEl = document.querySelector(".cities");
                if (citEl) citEl.innerHTML = cityName + ', ' + country;
                if (citiesEl) citiesEl.innerHTML = cityName + ', ' + country;

                // Save to session
                sessionStorage.setItem("currentLat", currentLat);
                sessionStorage.setItem("currentLon", currentLon);

                setTimeout(function () {
                    $(".loader").hide();
                    $(".daily-container, .hourly-container").fadeToggle("slow");
                    getWeather(currentLat, currentLon);
                }, 1000);
            })
            .catch(error => {
                $(".loader").hide();
                $(".daily-container, .hourly-container").fadeToggle("slow");
                $("#error-message").text(error.message).show();
                console.error('Error:', error);
            });
    });

    // Initial load - get Islamabad weather
    getCoordinates("Islamabad");
});