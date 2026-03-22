import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Wind, 
  Droplets, 
  ThermometerSun, 
  Gauge,
  AlertTriangle,
  Info,
  ChevronDown,
  Clock,
  Calendar,
  Activity,
  Leaf,
  Factory,
  Car,
  Flame
} from 'lucide-react';
import HeatMap from "../../components/Map/HeatMap";

const AQIDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState('Anand Vihar, Delhi');
  const [timeRange, setTimeRange] = useState('24h');
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - In production, this would come from your API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAqiData(mockAQIData);
      setLoading(false);
    }, 1000);
  }, [selectedLocation]);

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
    return 'text-maroon-600';
  };

  const getAQIBgLight = (aqi) => {
    if (aqi <= 50) return 'bg-green-50';
    if (aqi <= 100) return 'bg-yellow-50';
    if (aqi <= 200) return 'bg-orange-50';
    if (aqi <= 300) return 'bg-red-50';
    if (aqi <= 400) return 'bg-purple-50';
    return 'bg-red-100';
  };

  const getAQIMessage = (aqi) => {
    if (aqi <= 50) return 'Air quality is satisfactory, no health risk.';
    if (aqi <= 100) return 'Air quality is acceptable. Sensitive individuals should limit outdoor activity.';
    if (aqi <= 200) return 'Sensitive groups may experience health effects. General public less likely affected.';
    if (aqi <= 300) return 'Health alert: Everyone may experience serious health effects.';
    if (aqi <= 400) return 'Health emergency: Everyone likely affected seriously.';
    return 'Hazardous conditions: Stay indoors, keep windows closed.';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading air quality data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Location Selector */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AQI Dashboard</h1>
              <p className="text-sm text-gray-500">Real-time air quality monitoring for Delhi-NCR</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white w-full"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option>Anand Vihar, Delhi</option>
                  <option>RK Puram, Delhi</option>
                  <option>Dwarka, Delhi</option>
                  <option>Noida Sector 62</option>
                  <option>Gurugram Sector 51</option>
                  <option>Faridabad Sector 16</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button 
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '24h' ? 'bg-white shadow' : 'text-gray-600'}`}
                  onClick={() => setTimeRange('24h')}
                >
                  24H
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '7d' ? 'bg-white shadow' : 'text-gray-600'}`}
                  onClick={() => setTimeRange('7d')}
                >
                  7D
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '30d' ? 'bg-white shadow' : 'text-gray-600'}`}
                  onClick={() => setTimeRange('30d')}
                >
                  30D
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main AQI Card */}
        <div className={`${getAQIBgLight(mockAQIData.current.aqi)} rounded-2xl p-6 mb-6 transition-colors duration-500`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gauge className={getAQITextColor(mockAQIData.current.aqi)} size={24} />
                <span className="text-sm font-medium text-gray-600">Current AQI</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-6xl font-bold ${getAQITextColor(mockAQIData.current.aqi)}`}>
                  {mockAQIData.current.aqi}
                </span>
                <span className="text-xl text-gray-600">/ 500</span>
              </div>
              <div className="mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAQIBgLight(mockAQIData.current.aqi)} ${getAQITextColor(mockAQIData.current.aqi)}`}>
                  {mockAQIData.current.category}
                </span>
              </div>
              <p className="mt-4 text-gray-700 max-w-2xl">
                {getAQIMessage(mockAQIData.current.aqi)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 min-w-[120px]">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-blue-600" size={20} />
                  <span className="text-sm text-gray-600">PM2.5</span>
                </div>
                <span className="text-2xl font-bold">{mockAQIData.current.pm25}</span>
                <span className="text-sm text-gray-500 ml-1">µg/m³</span>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-blue-600" size={20} />
                  <span className="text-sm text-gray-600">PM10</span>
                </div>
                <span className="text-2xl font-bold">{mockAQIData.current.pm10}</span>
                <span className="text-sm text-gray-500 ml-1">µg/m³</span>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-blue-600" size={20} />
                  <span className="text-sm text-gray-600">NO₂</span>
                </div>
                <span className="text-2xl font-bold">{mockAQIData.current.no2}</span>
                <span className="text-sm text-gray-500 ml-1">ppb</span>
              </div>
              
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-blue-600" size={20} />
                  <span className="text-sm text-gray-600">O₃</span>
                </div>
                <span className="text-2xl font-bold">{mockAQIData.current.o3}</span>
                <span className="text-sm text-gray-500 ml-1">ppb</span>
              </div>
            </div>
          </div>
        </div>

        {/* AQI Timeline and Health Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Timeline Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">24-Hour AQI Trend</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={16} />
                <span>Updated hourly</span>
              </div>
            </div>
            
            <div className="h-48 flex items-end justify-between gap-1">
              {mockAQIData.hourly.map((hour, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="w-full relative">
                    <div 
                      className={`${getAQIColor(hour.aqi)} rounded-t-lg transition-all duration-300 group-hover:opacity-80`}
                      style={{ height: `${(hour.aqi / 500) * 150}px` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        AQI: {hour.aqi}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{hour.time}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Good</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded"></span> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span> Unhealthy (S)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Unhealthy</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded"></span> Very Unhealthy</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-maroon-500 rounded"></span> Hazardous</span>
            </div>
          </div>

          {/* Health Impact Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Impact</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="text-red-600" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sensitive Groups</p>
                  <p className="text-sm text-gray-600">Children, elderly, and those with respiratory issues should avoid outdoor activities.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="text-yellow-600" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">General Public</p>
                  <p className="text-sm text-gray-600">Reduce prolonged or heavy exertion outdoors.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="text-green-600" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Recommended</p>
                  <p className="text-sm text-gray-600">Wear N95 mask outdoors. Use air purifiers indoors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Source Contribution and Weather Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Contribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pollution Sources</h2>
              <span className="text-xs text-gray-500">Today's estimate</span>
            </div>
            
            <div className="space-y-4">
              {mockAQIData.sources.map((source, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      {source.icon}
                      <span className="text-sm font-medium text-gray-700">{source.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{source.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <span className="font-semibold">AI Analysis:</span> Stubble burning in Punjab/Haryana contributing to 40% of today's pollution. Consider reducing outdoor exposure.
              </p>
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Weather Conditions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ThermometerSun className="text-orange-500" size={20} />
                  <span className="text-sm text-gray-600">Temperature</span>
                </div>
                <span className="text-2xl font-bold">32°C</span>
                <span className="text-sm text-gray-500 ml-1">Feels like 34°</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-600">Humidity</span>
                </div>
                <span className="text-2xl font-bold">65%</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-gray-500" size={20} />
                  <span className="text-sm text-gray-600">Wind Speed</span>
                </div>
                <span className="text-2xl font-bold">12</span>
                <span className="text-sm text-gray-500 ml-1">km/h</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-purple-500" size={20} />
                  <span className="text-sm text-gray-600">Pressure</span>
                </div>
                <span className="text-2xl font-bold">1012</span>
                <span className="text-sm text-gray-500 ml-1">hPa</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-700">
                <span className="font-semibold">Weather Alert:</span> Low wind speed and high humidity may trap pollutants near ground level.
              </p>
            </div>
          </div>
        </div>
        <HeatMap />

        {/* Nearby Stations */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nearby Monitoring Stations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockAQIData.nearbyStations.map((station, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{station.name}</h3>
                    <p className="text-xs text-gray-500">{station.distance} km away</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAQIBgLight(station.aqi)} ${getAQITextColor(station.aqi)}`}>
                    AQI {station.aqi}
                  </span>
                </div>
                <div className="flex gap-2 text-xs text-gray-600">
                  <span>PM2.5: {station.pm25}</span>
                  <span>•</span>
                  <span>PM10: {station.pm10}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock Data
const mockAQIData = {
  current: {
    aqi: 312,
    category: 'Very Unhealthy',
    pm25: 185,
    pm10: 245,
    no2: 45,
    o3: 28
  },
  hourly: [
    { time: '00:00', aqi: 245 },
    { time: '02:00', aqi: 258 },
    { time: '04:00', aqi: 275 },
    { time: '06:00', aqi: 298 },
    { time: '08:00', aqi: 312 },
    { time: '10:00', aqi: 325 },
    { time: '12:00', aqi: 318 },
    { time: '14:00', aqi: 305 },
    { time: '16:00', aqi: 295 },
    { time: '18:00', aqi: 302 },
    { time: '20:00', aqi: 312 },
    { time: '22:00', aqi: 308 }
  ],
  sources: [
    { name: 'Stubble Burning', percentage: 40, icon: <Flame className="text-orange-500" size={16} /> },
    { name: 'Vehicle Emissions', percentage: 25, icon: <Car className="text-blue-500" size={16} /> },
    { name: 'Industrial', percentage: 20, icon: <Factory className="text-gray-500" size={16} /> },
    { name: 'Dust & Construction', percentage: 15, icon: <Wind className="text-yellow-500" size={16} /> }
  ],
  nearbyStations: [
    { name: 'Anand Vihar', distance: 0.5, aqi: 312, pm25: 185, pm10: 245 },
    { name: 'ITO', distance: 2.3, aqi: 298, pm25: 172, pm10: 230 },
    { name: 'RK Puram', distance: 4.1, aqi: 278, pm25: 158, pm10: 215 }
  ]
};

export default AQIDashboard;