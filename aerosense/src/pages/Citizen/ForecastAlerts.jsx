// src/pages/Citizen/ForecastAlerts.jsx
import React, { useState } from 'react';
import { 
  ArrowLeft,
  Bell,
  BellRing,
  Clock,
  Calendar,
  AlertTriangle,
  Wind,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Sunrise,
  Sunset,
  Gauge,
  MapPin,
  ChevronRight,
  Settings,
  CheckCircle,
  XCircle,
  Info,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  MessageCircle,
  Share2,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ForecastAlerts = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [alertSettings, setAlertSettings] = useState({
    pushNotifications: true,
    emailAlerts: false,
    smsAlerts: false,
    threshold: 150
  });
  const [showSettings, setShowSettings] = useState(false);

  // Mock forecast data
  const forecastData = [
    { 
      day: 'Today', 
      date: 'Feb 17', 
      aqi: 312,
      category: 'Very Unhealthy',
      high: 32,
      low: 24,
      condition: 'Hazy',
      windSpeed: 8,
      humidity: 65,
      pm25: 185,
      pm10: 245,
      no2: 45,
      o3: 28,
      hourly: [
        { time: '6 AM', aqi: 280, temp: 24 },
        { time: '9 AM', aqi: 295, temp: 27 },
        { time: '12 PM', aqi: 325, temp: 31 },
        { time: '3 PM', aqi: 330, temp: 32 },
        { time: '6 PM', aqi: 315, temp: 29 },
        { time: '9 PM', aqi: 305, temp: 26 }
      ]
    },
    { 
      day: 'Tomorrow', 
      date: 'Feb 18', 
      aqi: 285,
      category: 'Unhealthy',
      high: 31,
      low: 23,
      condition: 'Partly Cloudy',
      windSpeed: 12,
      humidity: 58,
      pm25: 165,
      pm10: 220,
      no2: 42,
      o3: 32
    },
    { 
      day: 'Wed', 
      date: 'Feb 19', 
      aqi: 245,
      category: 'Unhealthy',
      high: 30,
      low: 22,
      condition: 'Sunny',
      windSpeed: 15,
      humidity: 52,
      pm25: 142,
      pm10: 195,
      no2: 38,
      o3: 35
    },
    { 
      day: 'Thu', 
      date: 'Feb 20', 
      aqi: 198,
      category: 'Unhealthy for Sensitive',
      high: 29,
      low: 21,
      condition: 'Sunny',
      windSpeed: 18,
      humidity: 48,
      pm25: 118,
      pm10: 165,
      no2: 35,
      o3: 38
    },
    { 
      day: 'Fri', 
      date: 'Feb 21', 
      aqi: 165,
      category: 'Moderate',
      high: 28,
      low: 20,
      condition: 'Clear',
      windSpeed: 20,
      humidity: 45,
      pm25: 95,
      pm10: 140,
      no2: 32,
      o3: 40
    },
    { 
      day: 'Sat', 
      date: 'Feb 22', 
      aqi: 142,
      category: 'Moderate',
      high: 27,
      low: 19,
      condition: 'Clear',
      windSpeed: 22,
      humidity: 42,
      pm25: 82,
      pm10: 125,
      no2: 30,
      o3: 42
    },
    { 
      day: 'Sun', 
      date: 'Feb 23', 
      aqi: 128,
      category: 'Moderate',
      high: 27,
      low: 19,
      condition: 'Clear',
      windSpeed: 24,
      humidity: 40,
      pm25: 75,
      pm10: 115,
      no2: 28,
      o3: 43
    }
  ];

  // Mock alerts data
  const alertsData = [
    {
      id: 1,
      type: 'warning',
      title: 'Severe AQI Alert',
      message: 'AQI expected to reach 330+ this afternoon. Avoid outdoor activities between 12 PM - 4 PM.',
      time: '2 hours ago',
      severity: 'high',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Stubble Burning Peak',
      message: 'Increased stubble burning activity detected. Evening AQI may worsen.',
      time: '5 hours ago',
      severity: 'medium',
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Better Air Quality Expected',
      message: 'Wind speeds increasing tomorrow. Air quality expected to improve by 15%.',
      time: '1 day ago',
      severity: 'low',
      read: true
    },
    {
      id: 4,
      type: 'warning',
      title: 'Construction Ban in Effect',
      message: 'Construction activities halted in NCR until further notice due to high pollution.',
      time: '2 days ago',
      severity: 'medium',
      read: true
    }
  ];

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 200) return 'bg-orange-500';
    if (aqi <= 300) return 'bg-red-500';
    if (aqi <= 400) return 'bg-purple-500';
    return 'bg-maroon-500';
  };

  const getAQITextColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 200) return 'text-orange-600';
    if (aqi <= 300) return 'text-red-600';
    if (aqi <= 400) return 'text-purple-600';
    return 'text-red-800';
  };

  const getAQIBgLight = (aqi) => {
    if (aqi <= 50) return 'bg-green-50';
    if (aqi <= 100) return 'bg-yellow-50';
    if (aqi <= 200) return 'bg-orange-50';
    if (aqi <= 300) return 'bg-red-50';
    if (aqi <= 400) return 'bg-purple-50';
    return 'bg-red-100';
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="text-red-500" size={20} />;
      case 'info': return <Info className="text-blue-500" size={20} />;
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'high':
        return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Info</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Forecast & Alerts</h1>
                <p className="text-sm text-gray-500">24-72 hour predictions and real-time alerts</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <Settings size={20} className="text-gray-600" />
                {alertSettings.pushNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Settings Panel */}
      {showSettings && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Alert Preferences</h3>
              <button onClick={() => setShowSettings(false)}>
                <XCircle size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Notification Channels</h4>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Push Notifications</span>
                  <button
                    onClick={() => setAlertSettings({...alertSettings, pushNotifications: !alertSettings.pushNotifications})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      alertSettings.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        alertSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Alerts</span>
                  <button
                    onClick={() => setAlertSettings({...alertSettings, emailAlerts: !alertSettings.emailAlerts})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      alertSettings.emailAlerts ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        alertSettings.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SMS Alerts</span>
                  <button
                    onClick={() => setAlertSettings({...alertSettings, smsAlerts: !alertSettings.smsAlerts})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      alertSettings.smsAlerts ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        alertSettings.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Alert Threshold</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Notify when AQI exceeds:</span>
                    <span className="font-medium text-gray-900">{alertSettings.threshold}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="400"
                    step="10"
                    value={alertSettings.threshold}
                    onChange={(e) => setAlertSettings({...alertSettings, threshold: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Good (50)</span>
                    <span>Moderate (100)</span>
                    <span>Unhealthy (200)</span>
                    <span>Hazardous (300)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Conditions & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-sm p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm">Current Conditions</p>
                <h2 className="text-2xl font-bold">Anand Vihar, Delhi</h2>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Live</span>
            </div>
            
            <div className="flex items-end gap-4 mb-4">
              <div>
                <span className="text-5xl font-bold">{forecastData[0].aqi}</span>
                <span className="text-blue-100 ml-2">AQI</span>
              </div>
              <div className="mb-1">
                <span className="text-xl">{forecastData[0].category}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-blue-100 text-xs">Temperature</p>
                <p className="text-xl font-semibold">{forecastData[0].high}°C</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs">Wind Speed</p>
                <p className="text-xl font-semibold">{forecastData[0].windSpeed} km/h</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs">Humidity</p>
                <p className="text-xl font-semibold">{forecastData[0].humidity}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BellRing className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-900">Active Alerts</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{alertsData.filter(a => !a.read).length}</div>
            <p className="text-sm text-gray-500">Unread notifications</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">2 High</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">1 Medium</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-green-600" size={20} />
              <h3 className="font-semibold text-gray-900">7-Day Trend</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">↓ 15%</div>
            <p className="text-sm text-gray-500">Expected improvement</p>
            <div className="mt-4 flex items-center gap-2">
              <Sun size={16} className="text-yellow-500" />
              <span className="text-xs text-gray-600">Better air by weekend</span>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">7-Day Forecast</h2>
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700">Export</button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {forecastData.map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`p-4 rounded-xl transition-all ${
                  selectedDay === index 
                    ? getAQIBgLight(day.aqi) + ' ring-2 ring-offset-2 ' + getAQITextColor(day.aqi).replace('text', 'ring')
                    : 'hover:bg-gray-50'
                }`}
              >
                <p className="text-sm font-medium text-gray-900">{day.day}</p>
                <p className="text-xs text-gray-500 mb-2">{day.date}</p>
                <div className={`text-2xl font-bold mb-1 ${getAQITextColor(day.aqi)}`}>
                  {day.aqi}
                </div>
                <p className="text-xs text-gray-600 mb-2">{day.category}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>↑{day.high}°</span>
                  <span>↓{day.low}°</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`${getAQIColor(day.aqi)} rounded-full h-1`}
                    style={{ width: `${(day.aqi / 500) * 100}%` }}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Forecast for Selected Day */}
        {selectedDay !== null && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Hourly Forecast */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {forecastData[selectedDay].day}'s Hourly Forecast
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>All times IST</span>
                </div>
              </div>

              <div className="space-y-3">
                {(forecastData[selectedDay].hourly || [
                  { time: '6 AM', aqi: 280, temp: 24 },
                  { time: '9 AM', aqi: 295, temp: 27 },
                  { time: '12 PM', aqi: 325, temp: 31 },
                  { time: '3 PM', aqi: 330, temp: 32 },
                  { time: '6 PM', aqi: 315, temp: 29 },
                  { time: '9 PM', aqi: 305, temp: 26 }
                ]).map((hour, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                    <span className="w-16 text-sm font-medium text-gray-700">{hour.time}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${getAQITextColor(hour.aqi)}`}>
                          AQI {hour.aqi}
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div 
                            className={`${getAQIColor(hour.aqi)} rounded-full h-2`}
                            style={{ width: `${(hour.aqi / 500) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{hour.temp}°C</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Peak Pollution Warning */}
              {selectedDay === 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-600 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium text-red-800">Peak Pollution Warning</p>
                      <p className="text-xs text-red-700">
                        AQI expected to reach 330 between 12 PM - 4 PM. Avoid outdoor activities during these hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pollutants Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Pollutants</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">PM2.5</span>
                    <span className="font-medium text-gray-900">{forecastData[selectedDay].pm25} µg/m³</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 rounded-full h-2" style={{ width: `${(forecastData[selectedDay].pm25 / 250) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">PM10</span>
                    <span className="font-medium text-gray-900">{forecastData[selectedDay].pm10} µg/m³</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 rounded-full h-2" style={{ width: `${(forecastData[selectedDay].pm10 / 350) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">NO₂</span>
                    <span className="font-medium text-gray-900">{forecastData[selectedDay].no2} ppb</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 rounded-full h-2" style={{ width: `${(forecastData[selectedDay].no2 / 200) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">O₃</span>
                    <span className="font-medium text-gray-900">{forecastData[selectedDay].o3} ppb</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: `${(forecastData[selectedDay].o3 / 100) * 100}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-800">AI Forecast Note</p>
                    <p className="text-xs text-blue-700">
                      {selectedDay === 0 && "High PM2.5 levels due to stubble burning. Consider wearing mask."}
                      {selectedDay === 1 && "Wind speed increasing tomorrow, slight improvement expected."}
                      {selectedDay === 2 && "Better air quality by evening. Good time for outdoor activities."}
                      {selectedDay >= 3 && "Significant improvement expected. Air quality becoming moderate."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts and Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Alerts */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Alerts</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">Mark all as read</button>
            </div>

            <div className="space-y-3">
              {alertsData.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'warning' ? 'border-l-red-500 bg-red-50' :
                    alert.type === 'info' ? 'border-l-blue-500 bg-blue-50' :
                    'border-l-green-500 bg-green-50'
                  } ${!alert.read ? 'opacity-100' : 'opacity-70'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{alert.title}</h3>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                    {!alert.read && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Times & Recommendations */}
          <div className="space-y-6">
            {/* Safe Window */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Best Time for Outdoor</h2>
              
              <div className="text-center p-4 bg-green-50 rounded-lg mb-4">
                <Sun className="mx-auto text-yellow-500 mb-2" size={32} />
                <p className="text-2xl font-bold text-green-700">6 AM - 9 AM</p>
                <p className="text-sm text-gray-600 mt-1">Lowest pollution expected</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Morning (6-9 AM)</span>
                  <span className="font-medium text-green-600">Good</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Afternoon (12-4 PM)</span>
                  <span className="font-medium text-red-600">Avoid</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Evening (6-9 PM)</span>
                  <span className="font-medium text-orange-600">Moderate</span>
                </div>
              </div>
            </div>

            {/* Health Recommendations */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Advisory</h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Shield size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Wear N95 Mask</p>
                    <p className="text-xs text-gray-600">Especially during peak hours (12-4 PM)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Activity size={18} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Indoor Exercise</p>
                    <p className="text-xs text-gray-600">Move workouts indoors today</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Wind size={18} className="text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Use Air Purifier</p>
                    <p className="text-xs text-gray-600">Keep windows closed, run purifier at max</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscribe to Alerts */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
              <Bell size={24} className="mb-3" />
              <h3 className="text-lg font-semibold mb-2">Get Instant Alerts</h3>
              <p className="text-sm text-blue-100 mb-4">Receive notifications when AQI exceeds your threshold</p>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Enable Notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastAlerts;