//-----------------------------------------Angular JS----------------------------------------------------
angular.module('airStatusApp', [])
.controller('AirStatusController', ['$scope', '$http', function($scope, $http) {
    $scope.airData = {};
    $scope.errorMessage = '';
    $scope.dayOfWeek = '';
    $scope.cities = '';
    $scope.cityName = '';

    // Function to determine air quality status and color
    function getAirQualityStatus(value, pollutant) {
        let status = '';
        let color = '';

        switch (pollutant) {
            case 'PM2.5':
                if (value <= 10) { status = 'Good'; color = 'green'; }
                else if (value <= 20) { status = 'Fair'; color = 'blue'; }
                else if (value <= 25) { status = 'Moderate'; color = 'orange'; }
                else if (value <= 50) { status = 'Poor'; color = 'darkorange'; }
                else if (value <= 75) { status = 'Very Poor'; color = 'red'; }
                else { status = 'Extremely Poor'; color = 'darkred'; }
                break;
            case 'PM10':
                if (value <= 20) { status = 'Good'; color = 'green'; }
                else if (value <= 40) { status = 'Fair'; color = 'blue'; }
                else if (value <= 50) { status = 'Moderate'; color = 'orange'; }
                else if (value <= 100) { status = 'Poor'; color = 'darkorange'; }
                else if (value <= 150) { status = 'Very Poor'; color = 'red'; }
                else { status = 'Extremely Poor'; color = 'darkred'; }
                break;
            case 'NO2':
                if (value <= 40) { status = 'Good'; color = 'green'; }
                else if (value <= 90) { status = 'Fair'; color = 'blue'; }
                else if (value <= 120) { status = 'Moderate'; color = 'orange'; }
                else if (value <= 230) { status = 'Poor'; color = 'darkorange'; }
                else if (value <= 340) { status = 'Very Poor'; color = 'red'; }
                else { status = 'Extremely Poor'; color = 'darkred'; }
                break;
            case 'O3':
                if (value <= 50) { status = 'Good'; color = 'green'; }
                else if (value <= 100) { status = 'Fair'; color = 'blue'; }
                else if (value <= 130) { status = 'Moderate'; color = 'orange'; }
                else if (value <= 240) { status = 'Poor'; color = 'darkorange'; }
                else if (value <= 380) { status = 'Very Poor'; color = 'red'; }
                else { status = 'Extremely Poor'; color = 'darkred'; }
                break;
            case 'SO2':
                if (value <= 100) { status = 'Good'; color = 'green'; }
                else if (value <= 200) { status = 'Fair'; color = 'blue'; }
                else if (value <= 350) { status = 'Moderate'; color = 'orange'; }
                else if (value <= 500) { status = 'Poor'; color = 'darkorange'; }
                else if (value <= 750) { status = 'Very Poor'; color = 'red'; }
                else { status = 'Extremely Poor'; color = 'darkred'; }
                break;
        }

        return { status, color };
    }

    // Fetch Air Quality Data
    $scope.getAirQuality = function(lat, lon) {
        const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=dust&hourly=european_aqi,european_aqi_pm2_5,european_aqi_pm10,european_aqi_nitrogen_dioxide,european_aqi_ozone,european_aqi_sulphur_dioxide&timezone=auto&forecast_days=1`;

        $http.get(airQualityUrl).then(function(response) {
            const data = response.data;
            $scope.airData = {
                date: data.current.time.split('T')[0],
                currentAQI: Math.round(data.hourly.european_aqi[0]),
                PM2_5: Math.round(data.hourly.european_aqi_pm2_5[0]),
                PM10: Math.round(data.hourly.european_aqi_pm10[0]),
                NO2: Math.round(data.hourly.european_aqi_nitrogen_dioxide[0]),
                O3: Math.round(data.hourly.european_aqi_ozone[0]),
                SO2: Math.round(data.hourly.european_aqi_sulphur_dioxide[0]),
            };

            $scope.airData.statuses = {
                PM2_5: getAirQualityStatus($scope.airData.PM2_5, 'PM2.5'),
                PM10: getAirQualityStatus($scope.airData.PM10, 'PM10'),
                NO2: getAirQualityStatus($scope.airData.NO2, 'NO2'),
                O3: getAirQualityStatus($scope.airData.O3, 'O3'),
                SO2: getAirQualityStatus($scope.airData.SO2, 'SO2'),
            };

            const date = new Date($scope.airData.date);
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $scope.dayOfWeek = daysOfWeek[date.getDay()];
            $scope.errorMessage = '';
            console.log('Air quality data loaded:', $scope.airData);
        }).catch(function(error) {
            console.error('Error fetching air quality:', error);
            $scope.errorMessage = 'Failed to load air quality data. Please try again.';
        });
    };

    // Fetch coordinates based on city name
    $scope.searchCity = function(city) {
        // Validate input
        if (!city || city.trim() === '') {
            $scope.errorMessage = 'Please enter a city name.';
            return;
        }

        console.log('Searching for city:', city);
        $scope.errorMessage = ''; // Clear previous errors

        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        
        $http.get(geoUrl).then(function(response) {
            const data = response.data.results;

            if (!data || data.length === 0) {
                $scope.errorMessage = 'City not found. Please try another city.';
                console.warn('No results found for city:', city);
                return;
            }

            const lat = data[0].latitude;
            const lon = data[0].longitude;
            const country = data[0].country;
            const cityName = data[0].name;

            $scope.cities = `${cityName}, ${country}`;
            console.log('City found:', cityName, country, `(${lat}, ${lon})`);

            // Save to sessionStorage so weather page can access it
            sessionStorage.setItem("currentLat", lat);
            sessionStorage.setItem("currentLon", lon);

            $scope.getAirQuality(lat, lon);
        }).catch(function(error) {
            console.error('Error fetching coordinates:', error);
            $scope.errorMessage = 'Failed to find the city. Please check your internet connection and try again.';
        });
    };

    // Initialize with Islamabad as default
    function initializeController() {
        console.log('Initializing air quality controller...');
        // Always load Islamabad on page load
        $scope.searchCity('Islamabad');
    }

    // Load data on controller initialization
    initializeController();
}]);
//---------------------------------------------------------------------------------------------------