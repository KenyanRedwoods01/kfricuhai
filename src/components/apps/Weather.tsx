'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface WeatherData {
  location: string;
  current: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    pressure: number;
    uv: number;
    visibility: number;
    icon: string;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    humidity: number;
    windSpeed: number;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
  }>;
}

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState('New York, NY');
  const [isLoading, setIsLoading] = useState(false);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>('fahrenheit');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('12h');

  // Sample weather data for demonstration
  const sampleWeather: WeatherData = {
    location: 'New York, NY',
    current: {
      temperature: 72,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 8,
      pressure: 30.15,
      uv: 6,
      visibility: 10,
      icon: '⛅',
    },
    forecast: [
      {
        day: 'Today',
        high: 75,
        low: 62,
        condition: 'Partly Cloudy',
        icon: '⛅',
        humidity: 65,
        windSpeed: 8,
      },
      {
        day: 'Tomorrow',
        high: 78,
        low: 64,
        condition: 'Sunny',
        icon: '☀️',
        humidity: 55,
        windSpeed: 5,
      },
      {
        day: 'Thursday',
        high: 72,
        low: 58,
        condition: 'Light Rain',
        icon: '🌦️',
        humidity: 85,
        windSpeed: 12,
      },
      {
        day: 'Friday',
        high: 70,
        low: 55,
        condition: 'Cloudy',
        icon: '☁️',
        humidity: 70,
        windSpeed: 7,
      },
      {
        day: 'Saturday',
        high: 73,
        low: 59,
        condition: 'Partly Cloudy',
        icon: '⛅',
        humidity: 60,
        windSpeed: 6,
      },
      {
        day: 'Sunday',
        high: 76,
        low: 62,
        condition: 'Sunny',
        icon: '☀️',
        humidity: 55,
        windSpeed: 4,
      },
      {
        day: 'Monday',
        high: 74,
        low: 61,
        condition: 'Partly Cloudy',
        icon: '⛅',
        humidity: 62,
        windSpeed: 9,
      },
    ],
    alerts: [
      {
        type: 'Air Quality',
        message: 'Moderate air quality. Sensitive individuals should limit outdoor activities.',
        severity: 'medium',
      },
    ],
  };

  useEffect(() => {
    // Simulate weather data loading
    setIsLoading(true);
    setTimeout(() => {
      setWeather(sampleWeather);
      setIsLoading(false);
    }, 1000);
  }, []);

  const searchWeather = async (location: string) => {
    if (!location.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setWeather({
        ...sampleWeather,
        location: location,
        current: {
          ...sampleWeather.current,
          temperature: Math.floor(Math.random() * 30) + 50, // Random temp 50-80
        }
      });
      setCurrentLocation(location);
      setSearchLocation('');
      setIsLoading(false);
    }, 1000);
  };

  const getLocationWeather = () => {
    // Simulate getting user's current location
    setCurrentLocation('Current Location');
    searchWeather('Current Location');
  };

  const toggleUnit = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  const convertTemp = (temp: number) => {
    if (unit === 'celsius') {
      return Math.round((temp - 32) * 5/9);
    }
    return temp;
  };

  const currentTemp = weather ? convertTemp(weather.current.temperature) : 0;
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';

  const WeatherCard = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Weather</h1>
          <div className="flex gap-2">
            <motion.button
              onClick={toggleUnit}
              className="px-3 py-1 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {unitSymbol}
            </motion.button>
            <motion.button
              onClick={getLocationWeather}
              className="px-3 py-1 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📍
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchWeather(searchLocation);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Search for a location..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-white/30 text-white rounded-lg hover:bg-white/40 disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? '⏳' : '🔍'}
          </motion.button>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              className="text-white text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-xl">Loading weather...</p>
            </motion.div>
          </div>
        ) : weather ? (
          <div className="space-y-6">
            {/* Current Weather */}
            <WeatherCard>
              <div className="text-center">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{weather.location}</h2>
                    <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <div className="text-6xl">{weather.current.icon}</div>
                </div>
                
                <div className="text-6xl font-light text-gray-900 mb-2">
                  {currentTemp}{unitSymbol}
                </div>
                
                <p className="text-xl text-gray-600 mb-4">{weather.current.condition}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-500">Humidity</p>
                    <p className="text-lg font-semibold text-gray-900">{weather.current.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Wind</p>
                    <p className="text-lg font-semibold text-gray-900">{weather.current.windSpeed} mph</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pressure</p>
                    <p className="text-lg font-semibold text-gray-900">{weather.current.pressure} in</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">UV Index</p>
                    <p className="text-lg font-semibold text-gray-900">{weather.current.uv}/10</p>
                  </div>
                </div>
              </div>
            </WeatherCard>

            {/* Weather Alerts */}
            {weather.alerts.length > 0 && (
              <div className="space-y-2">
                {weather.alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.severity === 'high' 
                        ? 'bg-red-50 border-red-500 text-red-800'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
                        : 'bg-blue-50 border-blue-500 text-blue-800'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">⚠️ {alert.type}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-current bg-opacity-20">
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* 7-Day Forecast */}
            <WeatherCard>
              <h3 className="text-xl font-bold text-gray-900 mb-4">7-Day Forecast</h3>
              <div className="space-y-3">
                {weather.forecast.map((day, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-16 text-center">
                        <p className="font-medium text-gray-900">{day.day}</p>
                      </div>
                      
                      <div className="text-2xl">{day.icon}</div>
                      
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{day.condition}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>💧 {day.humidity}%</span>
                          <span>💨 {day.windSpeed} mph</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {convertTemp(day.high)}{unitSymbol}
                        </p>
                        <p className="text-sm text-gray-600">
                          {convertTemp(day.low)}{unitSymbol}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </WeatherCard>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WeatherCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sunrise & Sunset</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunrise</span>
                    <span className="font-semibold text-gray-900">6:32 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunset</span>
                    <span className="font-semibold text-gray-900">7:45 PM</span>
                  </div>
                </div>
              </WeatherCard>

              <WeatherCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Visibility & Air Quality</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Visibility</span>
                    <span className="font-semibold text-gray-900">{weather.current.visibility} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Air Quality</span>
                    <span className="font-semibold text-yellow-600">Moderate</span>
                  </div>
                </div>
              </WeatherCard>
            </div>

            {/* Weather Map Placeholder */}
            <WeatherCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Map</h3>
              <div className="h-48 bg-gradient-to-br from-green-200 to-blue-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="text-4xl mb-2">🗺️</div>
                  <p>Interactive weather radar would appear here</p>
                  <p className="text-sm">Showing precipitation, temperature, and wind patterns</p>
                </div>
              </div>
            </WeatherCard>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🌤️</div>
              <h3 className="text-xl font-bold mb-2">Weather App</h3>
              <p className="text-lg opacity-90 mb-4">
                Search for a location to view current weather conditions and forecasts
              </p>
              <motion.button
                onClick={() => searchWeather('New York, NY')}
                className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Show Weather for New York
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;