APPID = 'b2a36377cec0c02671aae5e00cfcda14'


// Function to get weather using latitude and longitude from Open-Meteo
function getWeather(lat, lon) {
    const WeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=weather_code,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,cloud_cover,showers,snowfall,pressure_msl,surface_pressure,wind_speed_10m&daily&timezone=auto`;

    const WeatherUrldaily = ` https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_hours&forecast_days=14&daily=&timezone=auto`;

    const WeatherUrlhourly = ` https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=weather_code,temperature_2m,precipitation_probability,is_day,visibility&forecast_days=14&daily=&timezone=auto`;


    //-----------------------------------------current weather data------------------------------------
    fetch(WeatherUrl)
        .then(response => response.json())
        .then(weatherData => {
            console.log(weatherData);
            temp.innerHTML = Math.round(weatherData.current.temperature_2m) + '°C'
            document.querySelector(".humidity").innerHTML = weatherData.current.relative_humidity_2m + '%'
            document.querySelector(".feels_like").innerHTML = Math.round(weatherData.current.
                apparent_temperature) + '°C'
            document.querySelector(".current-precipitation").innerHTML = weatherData.current.cloud_cover + '%'
            document.querySelector(".wind").innerHTML = weatherData.current.wind_speed_10m + 'km/h'
        }).catch(error => console.error('Error fetching weather:', error));


    //-----------------------------------------daily weather data------------------------------------

    fetch(WeatherUrldaily).then(response => response.json()).then(dailydata => {
        console.log(dailydata);
        const dailyCards = document.querySelectorAll('.daily-card');
        dailydata.daily.weather_code.forEach((weathercode, index) => {
            if (dailyCards[index]) {
                const tempMax = Math.round(dailydata.daily.temperature_2m_max[index]);
                const tempMin = Math.round(dailydata.daily.temperature_2m_min[index]);
                const dateElement = dailyCards[index].querySelector('.date');
                const dayElement = dailyCards[index].querySelector('.day');
                const iconElement = dailyCards[index].querySelector('img');
                const dateString = dailydata.daily.time[index];
                const date = new Date(dateString);
                const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
                const dayOfWeek = daysOfWeek[date.getDay()];  
                dateElement.innerHTML = dateString;
                dayElement.innerHTML = dayOfWeek;

                // Display min/max temperature in each card
                dailyCards[index].querySelector('.max').innerHTML = `${tempMax}°C`;
                dailyCards[index].querySelector('.min').innerHTML = `${tempMin}°C`;
                const weatherIcon = getdailyWeatherIcon(weathercode);
                iconElement.src = `/${weatherIcon}.png`;

            }
        });
    }).catch(error => console.error('Error fetching weather:', error));

    const getdailyWeatherIcon = (weatherCode) => {
        switch (weatherCode) {
            case 0:
                return 'photos/sun'; // Clear day
            case 1:
            case 2:
                return 'photos/sun (1)'; // Clear night    
            case 3:
                return 'photos/cloudy (1)'; // Partly cloudy day
            case 45:
            case 48:
                return 'photos/foggy'; // Fog
            case 51:
            case 53:
            case 55:
            case 56:
            case 57:
                return 'photos/cloudy'; // Drizzle
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
            case 80:
            case 81:
            case 82:
                return 'photos/heavy-rain'; // Rain
            case 71:
            case 73:
            case 75:
            case 77:
            case 85:
            case 86:
                return 'photos/snow'; // Snow
            case 95:
            case 96:
            case 99:
                return 'photos/thunderstorm'; // Thunderstorm
            default:
                return 'photos/sun'; // Default icon
        }
    }
    //-----------------------------------------hourly weather data---------------------------------------

    // Fetch hourly data and save it globally
    let hourlyWeatherData = [];

    fetch(WeatherUrlhourly)
        .then(response => response.json())
        .then(data => {
            hourlyWeatherData = data.hourly;
            // Get the timezone offset (in milliseconds)
            const timezones = data.utc_offset_seconds * 1000;
            const timezone = data.utc_offset_seconds;
            // Calculate today's date in local timezone
            const currentDate = new Date(Date.now() + timezones).toISOString().split('T')[0];

            // Automatically display today's hourly data on load
            updateHourlyDataForDay(currentDate);
            displayCurrentTime(timezone);

            const currentWeatherCode = data.hourly.weather_code[0]; // Get the first weather code
            updateWeatherVideo(currentWeatherCode); // Update the video based on the weathe
        })
        .catch(error => console.error('Error fetching weather:', error));

    // Function to update hourly data based on selected day
    function updateHourlyDataForDay(selectedDate) {
        // Filter hourly data to only the hours matching the selected day
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
                hourlyCards[index].querySelector('.time').innerHTML = timePart;
                hourlyCards[index].querySelector('.temp').innerHTML = `${Math.round(entry.temp)}°C`;
                hourlyCards[index].querySelector('.precipitation').innerHTML = `${entry.precipitation}%`;
                const weatherIcon = getWeatherIcon(entry.weatherCode, entry.isDay);
                hourlyCards[index].querySelector('img').src = `/${weatherIcon}.png`;
                img.src = `/${weatherIcon}.png`;
            }
        });
    }
    // Function to display the current time in the sidebar
    function displayCurrentTime(timezones) {
        const currentTimeElement = document.getElementById('time');
        const currentDateElement = document.getElementById('day');

        function updateTimeAndDay() {
            const now = new Date(Date.now() + timezones);

            // Get current time
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            // Get current day
            const options = { weekday: 'long' };
            const dayString = now.toLocaleDateString([], options);

            // Update the HTML elements
            currentTimeElement.innerHTML = timeString;
            currentDateElement.innerHTML = dayString;
        }
        updateTimeAndDay();

        // Update the time and day every minute
        setInterval(updateTimeAndDay, 60000);
    }

    const weatherVideos = {
        '0': 'photos/sunfields.mp4',        // Clear day
        '1': 'photos/sunny.mp4',  // Clear night
        '2': 'photos/sunny.mp4',       // Partly cloudy
        '3': 'photos/blackclouds.mp4',
        '45': 'photos/fog.mp4',         // Fog
        '48': 'photos/fog.mp4',         // Fog
        '51': 'photos/side.mp4',  // Light rain
        '53': 'photos/side.mp4',  // Moderate rain
        '55': 'photos/side.mp4',  // Heavy rain
        '61': 'photos/rain2.mp4',  // Showers
        '63': 'photos/rain2.mp4',  // Heavy showers
        '71': 'photos/snnow.mp4',        // Snow
        '95': 'photos/light.mp4',     // Thunderstorm
        '96': 'photos/light.mp4',     // Thunderstorm
        '99': 'photos/light.mp4'      // Thunderstorm
    };

    // Function to update the video based on weather code
    function updateWeatherVideo(weatherCode) {
        const videoElement = document.getElementById('weatherVideo');
        const videoSource = weatherVideos[weatherCode] || 'photos/nightskyclouds.mp4'; // Default video if weather code not found
        videoElement.src = videoSource;
        videoElement.load(); // Load the new video
    }


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
                break;;
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
                break;   // Light rain
            case 61:
            case 63:
            case 65:
            case 66:
            case 67:
            case 80:
            case 81:
            case 82:
                icon = "photos/heavy-rain";
                break;     // Heavy rain
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
                return "photos/sun";
            // Default icon for unknown weather codes
        }
        return icon;
    }
    //----------------------------------------------------------------JQuery----------------------------------------------
    $(".daily-card").click(function () {
        const selectedDate = $(this).find(".date").text();
        $(".hourly-container").fadeToggle("slow");
        $(".loaders").show();
        setTimeout(function () {
            $(".loaders").hide();
            $(".hourly-container").fadeToggle("slow");
            updateHourlyDataForDay(selectedDate);
        }, 1000);

    });
    //-----------------------------------------------------------------------------------------------------------------------

}

//------------------------------------code for turning latitudes into longitudes to city-----------------------
// Function to get latitude and longitude using city name
function getCoordinates(city) {
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${APPID}`;
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&APPID=${APPID}`;
    fetch(geoUrl).then(response => response.json()).then(data => {
        if (data.length === 0) {
            document.querySelector('searchbtn').innerHTML = 'City not found';
            return;
        }
        const lat = data[0].lat;
        const lon = data[0].lon;
        const country = data[0].country;  // Country code (e.g., 'GB' for United Kingdom)
        const cityName = data[0].name;    // City name (e.g., 'London') 

        // Display the city and country name
        const citElement = document.querySelector(".cit");
        if (citElement) citElement.innerHTML = cityName + ', ' + country;
        const cityElement = document.querySelector(".cities");
        if (cityElement) cityElement.innerHTML = cityName + ', ' + country;

        fetch(weatherUrl)
            .then(response => response.json())
            .then((response) => {
                // Display cloud description
                const main = response.weather[0].main;
                const description = response.weather[0].description;
                const sunrise = response.sys.sunrise;
                const timezone = response.timezone;
                const sunset = response.sys.sunset;
                const visibility = response.visibility;
                const sunriseTime = moment.utc(sunrise, 'X').add(timezone, 'seconds').format('hh:mm A');
                document.querySelector(".sunrise").innerHTML = sunriseTime;
                const sunsetTime = moment.utc(sunset, 'X').add(timezone, 'seconds').format('hh:mm A');
                document.querySelector(".sunset").innerHTML = sunsetTime;
                document.querySelector(".visibility").innerHTML = visibility / 1000 + ' km';
                document.querySelector(".sky").innerHTML = main;

            }).catch((err) => console.log(err));
        // Call the function to get weather after getting the lat/lon

        getWeather(lat, lon);


    }).catch(error => console.error('Error fetching weather:', error));
}

// Event listener for the search button
submit.addEventListener("click", (e) => {
    e.preventDefault();
    getCoordinates(city.value);
});
getCoordinates("islamabad");

// const dailyslider = [...document.querySelectorAll('.daily-container, .hourly-container')];
// const prebtn = [...document.querySelectorAll('.pre-btn')];
// const nxtbtn = [...document.querySelectorAll('.nxt-btn')];

// dailyslider.forEach((items, i) => {
// let containerdimensions = items.getBoundingClientRect();
// let containerwidth = containerdimensions.width;

// nxtbtn[i].addEventListener('click', () => {
// items.scrollLeft += containerwidth;
// })
// prebtn[i].addEventListener('click', () => {
// items.scrollLeft -= containerwidth;
// })
// });

//----------------------------------------------------------------JQuery----------------------------------------------
$(document).ready(function () {
    // Toggle Daily Forecast
    $("#toggleDaily").click(function () {
        $(".daily-container").slideToggle("slow");
    });

    // Toggle Hourly Forecast
    $("#toggleHourly").click(function () {
        $(".hourly-container").fadeToggle("slow");
    });

    // Add active class to navbar items on click
    $(".navbar ul li a").click(function () {
        $(".navbar ul li a").removeClass("active");
        $(this).addClass("active");
    });

    // Smooth scrolling for daily/hourly sliders
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

    $(document).ready(function () {
        $("#submit").click(function () {
            $(".daily-container, .hourly-container").fadeToggle("slow");
            $(".loader").show();
            setTimeout(function () {
                $(".loader").hide();
                $(".daily-container, .hourly-container").fadeToggle("slow");
            }, 1000);
        });
    });

    let currentLat = null;
    let currentLon = null;

    $("#submit").click(function (e) {
        e.preventDefault();
        const city = $("#city").val().trim();
        if (city === "") {
            $("#error-message").text("Please enter a city name.").show();
            return;
        }

        $("#error-message").hide(); 

        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=b2a36377cec0c02671aae5e00cfcda14`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    throw new Error("City not found");
                }
                currentLat = data[0].lat;
                currentLon = data[0].lon;

                // Save the coordinates in sessionStorage for the Air Quality page
                sessionStorage.setItem("currentLat", currentLat);
                sessionStorage.setItem("currentLon", currentLon);


                // Call functions to fetch weather and air quality
                getWeather(currentLat, currentLon);
            })
            .catch(error => {
                $("#error-message").text(error.message).show();
            });
    });
}); 