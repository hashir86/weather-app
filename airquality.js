APPID = 'b2a36377cec0c02671aae5e00cfcda14'

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
                currentAQI: data.hourly.european_aqi[0],
                PM2_5: data.hourly.european_aqi_pm2_5[0],
                PM10: data.hourly.european_aqi_pm10[0],
                NO2: data.hourly.european_aqi_nitrogen_dioxide[0],
                O3: data.hourly.european_aqi_ozone[0],
                SO2: data.hourly.european_aqi_sulphur_dioxide[0],
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
        }).catch(function(error) {
            console.error('Error fetching air quality:', error);
            $scope.errorMessage = 'Failed to load air quality data. Please try again.';
        });
    };

    // Fetch coordinates based on city name
    $scope.searchCity = function(city) {
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city || $scope.cityName}&limit=1&appid=${APPID}`;

        $http.get(geoUrl).then(function(response) {
            const data = response.data;
            if (data.length === 0) {
                $scope.errorMessage = 'City not found. Please enter a valid city name.';
                return;
            }

            const lat = data[0].lat;
            const lon = data[0].lon;
            const country = data[0].country;
            const cityName = data[0].name;
            $scope.cities = `${cityName}, ${country}`;

            // Fetch air quality for the selected city
            $scope.getAirQuality(lat, lon);
        }).catch(function(error) {
            console.error('Error fetching coordinates:', error);
            $scope.errorMessage = 'Failed to find the city. Please try again.';
        });
    };

    // Load default data for Islamabad
    $scope.searchCity('Islamabad');
}]);
//---------------------------------------------------------------------------------------------------
