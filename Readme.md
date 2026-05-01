# 🌤️ Mausam - Weather & Air Quality App

A beautiful, feature-rich weather and air quality application built with vanilla JavaScript, jQuery, and AngularJS. Get real-time weather forecasts, hourly data, and detailed air quality information for any city in the world.

## ✨ Features

### 🌡️ Weather Information
- **Current Weather**: Real-time temperature, humidity, wind speed, visibility, and weather conditions
- **Daily Forecast**: 14-day weather forecast with min/max temperatures and weather icons
- **Hourly Forecast**: Detailed hourly weather data with precipitation probability
- **Sunrise/Sunset Times**: Track daylight hours for any location
- **Dynamic Weather Videos**: Background videos that change based on current weather conditions
- **Real-time Clock**: Displays current time and day in the selected timezone

### 💨 Air Quality Monitoring
- **Current AQI**: Real-time Air Quality Index
- **Pollutant Levels**: Detailed measurements for:
  - PM2.5 (Fine Particulate Matter)
  - PM10 (Particulate Matter)
  - NO₂ (Nitrogen Dioxide)
  - O₃ (Ozone)
  - SO₂ (Sulfur Dioxide)
- **Color-Coded Status**: Visual indicators (Good/Fair/Moderate/Poor/Very Poor/Extremely Poor)
- **Air Quality Scale Reference**: Easy-to-understand chart for pollution levels

### 🔍 Search Functionality
- Search weather and air quality data for any city worldwide
- Auto-complete city suggestions
- Instant data updates

### 📱 Responsive Design
- Mobile-friendly interface
- Works seamlessly on desktop, tablet, and mobile devices
- Smooth animations and transitions

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Libraries**: 
  - jQuery 3.7.1 - DOM manipulation
  - AngularJS 1.8.2 - Data binding for air quality page
- **APIs**:
  - [Open-Meteo Weather API](https://open-meteo.com/) - Free weather forecasts
  - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) - City coordinates
  - [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) - Air pollution data
- **Media**: MP4 videos for weather backgrounds

## 📋 Project Structure

```
weather-app/
├── index.html              # Main weather page
├── air-status-page.html    # Air quality page
├── weather.js              # Weather functionality
├── airquality.js           # Air quality functionality
├── weather.css             # Styling
├── photos/                 # Weather icons and videos
│   ├── sun.png
│   ├── cloud.png
│   ├── rain.mp4
│   └── ...
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for API calls)
- No backend server required!

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

2. **Open in browser**
```bash
# Simply open index.html in your web browser
# Or use a local server (recommended)
python -m http.server 8000
# Then visit http://localhost:8000
```

3. **No build process needed!**
All files are ready to use - just open and start using the app.

## 📖 Usage

### Weather Page
1. **Default View**: Opens with Islamabad weather by default
2. **Search City**: 
   - Type city name in search bar
   - Click search button
   - Data updates instantly
3. **View Forecasts**:
   - Scroll through daily forecast cards
   - Click a daily card to see hourly weather for that day
   - Use arrow buttons to scroll forecast sections

### Air Quality Page
1. **Link**: Click "Air Quality" in the navbar
2. **Default View**: Shows Islamabad air quality
3. **Search City**: Enter city name and search
4. **View Details**: See pollutant levels with color-coded status indicators

## 🎨 Features in Detail

### Weather Display
- **Left Panel**: 
  - Current temperature
  - "Feels like" temperature
  - Humidity percentage
  - Wind speed
  - Visibility
  - Sunrise/Sunset times
  - Current weather condition

- **Daily Forecast Cards**:
  - Day of week
  - Date
  - Min/Max temperatures
  - Weather icon

- **Hourly Forecast**:
  - Time
  - Temperature
  - Precipitation probability
  - Weather icon

### Air Quality Display
- **Current AQI Score**: Prominently displayed with color indicator
- **Pollutant Table**: Shows levels for all 5 major pollutants
- **Reference Scale**: Easy-to-read table showing health impact thresholds
- **Detailed Descriptions**: Health information for each pollutant

## 🔧 API Integration

### Open-Meteo Weather API
```javascript
// Example: Current weather + daily/hourly forecast
https://api.open-meteo.com/v1/forecast
  ?latitude={lat}
  &longitude={lon}
  &current=temperature_2m,relative_humidity_2m,weather_code
  &daily=weather_code,temperature_2m_max,temperature_2m_min
  &hourly=temperature_2m,precipitation_probability,weather_code
  &timezone=auto
```

### Open-Meteo Air Quality API
```javascript
// Example: Air quality measurements
https://air-quality-api.open-meteo.com/v1/air-quality
  ?latitude={lat}
  &longitude={lon}
  &hourly=european_aqi,european_aqi_pm2_5,european_aqi_pm10
  &timezone=auto
```

### Geocoding API
```javascript
// Example: Get coordinates from city name
https://geocoding-api.open-meteo.com/v1/search
  ?name={cityName}
  &count=1
```

## 📊 Weather Code Reference

The app uses WMO Weather Code standards:
- `0` - Clear sky
- `1-2` - Partly cloudy
- `3` - Overcast
- `45-48` - Foggy
- `51-55` - Drizzle
- `61-65` - Rain
- `71-75` - Snow
- `80-82` - Rain showers
- `95-99` - Thunderstorm

## 🎯 Air Quality Index Scale

| Level | Range | Color | Health Impact |
|-------|-------|-------|---|
| Good | 0-50 | 🟢 Green | No impact |
| Fair | 50-100 | 🔵 Blue | Minimal impact |
| Moderate | 100-150 | 🟠 Orange | Sensitive groups affected |
| Poor | 150-200 | 🟠 Dark Orange | General health effects |
| Very Poor | 200-300 | 🔴 Red | Serious health effects |
| Extremely Poor | 300+ | 🔴 Dark Red | Emergency conditions |

## 🐛 Known Issues & Limitations

- **Photo Paths**: File paths use backslashes (`\`) which may need adjustment on some systems
- **Time Seconds**: Sunrise/Sunset times don't show seconds (by design - cleaner UI)
- **Cloud Cover**: Not available from free API tier for current weather
- **Offline Mode**: App requires internet connection for API calls

## 🔄 How It Works

### Data Flow
```
User Input (City Search)
    ↓
Geocoding API (Get coordinates)
    ↓
Weather API (Fetch forecast data)
    ↓
Air Quality API (Fetch pollution data)
    ↓
Update DOM (Display to user)
```

### Browser Storage
- **SessionStorage**: Saves current coordinates and city info
- **Timezone Detection**: Automatic based on location

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔐 Privacy & Data

- **No Data Storage**: All data is temporary and stored only in browser memory/session
- **No Tracking**: No analytics or user tracking
- **API Data**: Uses free, non-commercial Open-Meteo APIs
- **Coordinates**: Only used for current session, not stored on servers

## 📝 Code Structure

### Main Functions

**weather.js:**
- `getWeather(lat, lon)` - Fetch weather data
- `getCoordinates(city)` - Convert city name to coordinates
- `updateHourlyDataForDay(date)` - Update hourly forecast
- `getWeatherIcon(code, isday)` - Get appropriate weather icon
- `updateWeatherVideo(code)` - Change background video based on weather

**airquality.js:**
- `searchCity(city)` - Search for city and get air quality
- `getAirQuality(lat, lon)` - Fetch air quality data
- `getAirQualityStatus(value, pollutant)` - Determine status and color

## 🎓 Learning Resources

This project demonstrates:
- RESTful API integration
- DOM manipulation with vanilla JS
- Data binding with AngularJS
- Responsive web design
- Time/timezone handling
- Data visualization
- Error handling

Perfect for learning modern web development practices!

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

### Ideas for Contributions
- Add weather alerts
- Implement offline caching
- Add more languages
- Improve mobile responsiveness
- Add historical weather data
- Weather comparison between cities
- Dark/Light theme toggle

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) - Free weather and air quality APIs
- [jQuery](https://jquery.com/) - DOM manipulation library
- [AngularJS](https://angularjs.org/) - Web framework
- Weather icons from various open-source collections
- Community for feedback and suggestions

## 📞 Support

If you encounter any issues:
1. Check the browser console (F12) for error messages
2. Verify you have an active internet connection
3. Clear browser cache and refresh
4. Open a GitHub issue with details

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Push notifications for severe weather
- [ ] Weather alerts and warnings
- [ ] Historical weather data
- [ ] UV index information
- [ ] Pollen count data
- [ ] Favorite cities/bookmarks
- [ ] Dark mode theme
- [ ] PWA support (offline functionality)
- [ ] Mobile app version

## 💡 Tips & Tricks

### Better Weather Icons
- Replace PNG icons with SVG for crisp display on all devices
- Add custom icon packs for different themes

### Performance Optimization
- Cache API responses to reduce requests
- Lazy load weather videos
- Implement service workers for offline support

### Features to Add
- Compare weather between multiple cities
- Historical weather trends
- Weather maps overlay
- Severe weather alerts

## ⭐ Show Your Support

If you found this project helpful, please consider:
- ⭐ Starring the repository
- 🍴 Forking it
- 📢 Sharing with others
- 💬 Providing feedback

---

*Last Updated: May 2026*