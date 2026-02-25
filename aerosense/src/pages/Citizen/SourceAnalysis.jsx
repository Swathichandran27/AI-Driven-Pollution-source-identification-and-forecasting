// import React, { useState } from "react";

// const pollutionData = [
//   {
//     station: "Anand Vihar",
//     location: "Delhi",
//     date: "10 Jan 2024",
//     aqi: 312,
//     dominantSource: "Traffic",
//     sources: {
//       Traffic: 52,
//       Industry: 18,
//       Dust: 20,
//       Biomass: 10,
//     },
//     explanation: "High NO2 and CO indicate vehicular emissions.",
//   },
//   {
//     station: "RK Puram",
//     location: "Delhi",
//     date: "10 Jan 2024",
//     aqi: 248,
//     dominantSource: "Dust",
//     sources: {
//       Traffic: 30,
//       Industry: 22,
//       Dust: 38,
//       Biomass: 10,
//     },
//     explanation: "Elevated PM10 levels indicate dust contribution.",
//   },
// ];

// const getAQIColor = (aqi) => {
//   if (aqi <= 50) return "bg-green-500";
//   if (aqi <= 100) return "bg-yellow-400";
//   if (aqi <= 200) return "bg-orange-400";
//   if (aqi <= 300) return "bg-red-500";
//   return "bg-purple-700";
// };

// const SourceAnalysis = () => {
//   const [selectedStation, setSelectedStation] = useState(
//     pollutionData[0].station
//   );

//   const selectedData = pollutionData.find(
//     (item) => item.station === selectedStation
//   );

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-6">
//           Pollution Source Analysis Dashboard
//         </h1>

//         {/* Station Filter */}
//         <div className="mb-6">
//           <label className="block text-gray-600 font-medium mb-2">
//             Select Monitoring Station
//           </label>
//           <select
//             value={selectedStation}
//             onChange={(e) => setSelectedStation(e.target.value)}
//             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
//           >
//             {pollutionData.map((data) => (
//               <option key={data.station} value={data.station}>
//                 {data.station}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Basic Info */}
//         <div className="grid grid-cols-2 gap-6 mb-6">
//           <div>
//             <p className="text-gray-500">Location</p>
//             <p className="font-semibold">{selectedData.location}</p>
//           </div>
//           <div>
//             <p className="text-gray-500">Date</p>
//             <p className="font-semibold">{selectedData.date}</p>
//           </div>
//           <div>
//             <p className="text-gray-500">Dominant Source</p>
//             <p className="font-semibold text-red-500">
//               {selectedData.dominantSource}
//             </p>
//           </div>
//           <div>
//             <p className="text-gray-500">AQI</p>
//             <div
//               className={`text-white px-4 py-2 rounded-lg font-bold w-fit ${getAQIColor(
//                 selectedData.aqi
//               )}`}
//             >
//               {selectedData.aqi}
//             </div>
//           </div>
//         </div>

//         {/* Source Contribution */}
//         <div className="mb-6">
//           <h2 className="text-xl font-semibold mb-4 text-gray-700">
//             Source Contribution (%)
//           </h2>

//           {Object.entries(selectedData.sources).map(([key, value]) => (
//             <div key={key} className="mb-4">
//               <div className="flex justify-between text-sm mb-1">
//                 <span>{key}</span>
//                 <span>{value}%</span>
//               </div>

//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div
//                   className="bg-blue-500 h-3 rounded-full"
//                   style={{ width: `${value}%` }}
//                 ></div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Explanation */}
//         <div className="bg-gray-50 p-4 rounded-lg border">
//           <h3 className="font-semibold text-gray-700 mb-2">
//             Model Explanation
//           </h3>
//           <p className="text-gray-600">{selectedData.explanation}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SourceAnalysis;





// src/pages/Citizen/SourceAnalysis.jsx
import React, { useState } from 'react';
import { 
  ArrowLeft,
  Flame,
  Car,
  Factory,
  Wind,
  Building,
  Truck,
  Leaf,
  AlertCircle,
  Info,
  Calendar,
  MapPin,
  TrendingUp,
  PieChart,
  BarChart3,
  Layers,
  Download,
  Share2,
  Maximize2,
  ChevronRight
} from 'lucide-react';

import { Link } from 'react-router-dom';

const SourceAnalysis = () => {
  const [selectedSource, setSelectedSource] = useState('all');
  const [timeRange, setTimeRange] = useState('today');
  const [viewMode, setViewMode] = useState('chart'); // chart or map

  // Mock data for pollution sources
  const sourceData = [
    { 
      id: 'stubble',
      name: 'Stubble Burning', 
      percentage: 40, 
      value: 124,
      trend: '+5%',
      trendUp: true,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      icon: <Flame size={20} />,
      description: 'Crop residue burning in Punjab & Haryana',
      regions: ['Punjab', 'Haryana', 'Western UP'],
      peakSeason: 'Oct-Nov & Apr-May'
    },
    { 
      id: 'vehicles',
      name: 'Vehicle Emissions', 
      percentage: 25, 
      value: 78,
      trend: '-2%',
      trendUp: false,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      icon: <Car size={20} />,
      description: 'Cars, trucks, and two-wheelers',
      regions: ['All Delhi-NCR', 'Major roads'],
      peakSeason: 'Year-round, peak during rush hours'
    },
    { 
      id: 'industrial',
      name: 'Industrial Activity', 
      percentage: 20, 
      value: 62,
      trend: '+3%',
      trendUp: true,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      icon: <Factory size={20} />,
      description: 'Factories, power plants, and industries',
      regions: ['Faridabad', 'Ghaziabad', 'Noida', 'Gurugram'],
      peakSeason: 'Year-round'
    },
    { 
      id: 'dust',
      name: 'Construction & Dust', 
      percentage: 15, 
      value: 46,
      trend: '-1%',
      trendUp: false,
      color: 'bg-yellow-500',
      lightColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      icon: <Building size={20} />,
      description: 'Construction sites, road dust, and demolition',
      regions: ['New Delhi', 'Gurugram', 'Noida'],
      peakSeason: 'Dry months (Mar-Jun)'
    }
  ];

  // Historical data for trends
  const historicalData = {
    stubble: [35, 38, 42, 45, 40, 38, 42, 45, 48, 52, 55, 50],
    vehicles: [28, 27, 26, 25, 24, 25, 26, 27, 28, 27, 26, 25],
    industrial: [18, 18, 19, 20, 21, 22, 21, 20, 19, 20, 21, 22],
    dust: [19, 17, 13, 10, 15, 15, 11, 8, 5, 3, 2, 3]
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const totalPollution = sourceData.reduce((acc, source) => acc + source.value, 0);

  const getSourceById = (id) => {
    return sourceData.find(source => source.id === id);
  };

  const selectedSourceData = selectedSource !== 'all' ? getSourceById(selectedSource) : null;

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
                <h1 className="text-2xl font-bold text-gray-900">Pollution Source Analysis</h1>
                <p className="text-sm text-gray-500">Understand what's causing Delhi-NCR's air pollution</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={20} className="text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Range Selector */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex bg-white rounded-lg shadow-sm p-1">
            {['today', 'week', 'month', 'year'].map((range) => (
              <button
                key={range}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setTimeRange(range)}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex bg-white rounded-lg shadow-sm p-1">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
                viewMode === 'chart' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('chart')}
            >
              <BarChart3 size={16} />
              Chart View
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 ${
                viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setViewMode('map')}
            >
              <Layers size={16} />
              Map View
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Source Breakdown */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Source Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Source Breakdown</h2>
                <span className="text-xs text-gray-500">Today's estimate</span>
              </div>
              
              <div className="space-y-4">
                {sourceData.map((source) => (
                  <div 
                    key={source.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedSource === source.id ? source.lightColor + ' border-2 border-' + source.color.replace('bg-', '') : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedSource(source.id === selectedSource ? 'all' : source.id)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className={source.textColor}>{source.icon}</span>
                        <span className="font-medium text-gray-900">{source.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{source.percentage}%</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`${source.color} rounded-full h-2 transition-all duration-500`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">{source.value} µg/m³</span>
                      <span className={source.trendUp ? 'text-red-600' : 'text-green-600'}>
                        {source.trend} vs yesterday
                      </span>
                    </div>
                    
                    {selectedSource === source.id && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">{source.description}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-start gap-2">
                            <MapPin size={12} className="text-gray-400 mt-0.5" />
                            <span className="text-gray-600">Affected regions: {source.regions.join(', ')}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar size={12} className="text-gray-400 mt-0.5" />
                            <span className="text-gray-600">Peak season: {source.peakSeason}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">AI Insight</p>
                    <p className="text-xs text-blue-700">
                      Stubble burning contribution has increased by 5% this week due to ongoing harvesting in Punjab. 
                      {selectedSource === 'stubble' && ' Consider reducing outdoor activities, especially in the evening when smoke settles.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Impact */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Regional Impact</h2>
              <div className="space-y-3">
                {['North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Central Delhi', 'Noida', 'Gurugram', 'Faridabad'].map((region, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{region}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="bg-red-500 rounded-full h-2"
                          style={{ width: `${Math.random() * 40 + 30}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {Math.floor(Math.random() * 100 + 200)} AQI
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Charts and Maps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Visualization */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  {viewMode === 'chart' ? 'Historical Trends' : 'Source Map'}
                </h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Maximize2 size={16} className="text-gray-500" />
                </button>
              </div>

              {viewMode === 'chart' ? (
                <div>
                  {/* Source Trend Chart */}
                  <div className="h-64 relative mb-4">
                    <div className="absolute inset-0 flex items-end">
                      {months.map((month, idx) => {
                        let height = 0;
                        if (selectedSource === 'all') {
                          height = (historicalData.stubble[idx] + historicalData.vehicles[idx] + 
                                   historicalData.industrial[idx] + historicalData.dust[idx]) / 2;
                        } else if (selectedSource === 'stubble') {
                          height = historicalData.stubble[idx];
                        } else if (selectedSource === 'vehicles') {
                          height = historicalData.vehicles[idx];
                        } else if (selectedSource === 'industrial') {
                          height = historicalData.industrial[idx];
                        } else if (selectedSource === 'dust') {
                          height = historicalData.dust[idx];
                        }
                        
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center group">
                            <div className="w-full px-1">
                              <div className="relative">
                                <div 
                                  className={`${
                                    selectedSource === 'all' ? 'bg-gradient-to-t from-orange-500 via-blue-500 to-purple-500' :
                                    selectedSource === 'stubble' ? 'bg-orange-500' :
                                    selectedSource === 'vehicles' ? 'bg-blue-500' :
                                    selectedSource === 'industrial' ? 'bg-purple-500' : 'bg-yellow-500'
                                  } rounded-t transition-all duration-300 group-hover:opacity-80`}
                                  style={{ height: `${height}px` }}
                                >
                                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                    {month}: {Math.round(height * 5)} µg/m³
                                  </div>
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500 mt-2">{month}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                    {sourceData.map((source) => (
                      <div key={source.id} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${source.color.replace('bg-', '')}`}></div>
                        <span className="text-xs text-gray-600">{source.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Mock Map View
                <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src="/api/placeholder/800/400" 
                    alt="Delhi-NCR Map" 
                    className="w-full h-full object-cover opacity-50"
                  />
                  {/* Mock heatmap overlay */}
                  <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-orange-500 rounded-full opacity-30 blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-red-500 rounded-full opacity-30 blur-3xl"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-purple-500 rounded-full opacity-30 blur-3xl"></div>
                  </div>
                  
                  {/* Map Markers */}
                  <div className="absolute top-1/4 left-1/3">
                    <div className="relative">
                      <div className="w-4 h-4 bg-orange-500 rounded-full animate-ping absolute"></div>
                      <div className="w-4 h-4 bg-orange-500 rounded-full relative"></div>
                      <span className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-2 py-1 rounded shadow whitespace-nowrap">
                        Stubble Hotspot
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2">
                    <div className="relative">
                      <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping absolute"></div>
                      <div className="w-4 h-4 bg-blue-500 rounded-full relative"></div>
                      <span className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-2 py-1 rounded shadow whitespace-nowrap">
                        Traffic Dense
                      </span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-1/3 right-1/4">
                    <div className="relative">
                      <div className="w-4 h-4 bg-purple-500 rounded-full animate-ping absolute"></div>
                      <div className="w-4 h-4 bg-purple-500 rounded-full relative"></div>
                      <span className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-2 py-1 rounded shadow whitespace-nowrap">
                        Industrial Cluster
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Source Details and Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Real-time Source Tracking */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Real-time Source Tracking</h2>
                
                {selectedSource === 'all' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame size={16} className="text-orange-500" />
                        <span className="text-sm text-gray-700">Stubble burning (active fires)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">247</span>
                        <span className="text-xs text-red-600">+12</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car size={16} className="text-blue-500" />
                        <span className="text-sm text-gray-700">Traffic congestion (roads)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">156</span>
                        <span className="text-xs text-green-600">-8</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Factory size={16} className="text-purple-500" />
                        <span className="text-sm text-gray-700">Industrial emissions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">89</span>
                        <span className="text-xs text-red-600">+3</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building size={16} className="text-yellow-500" />
                        <span className="text-sm text-gray-700">Construction sites</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">34</span>
                        <span className="text-xs text-green-600">-2</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Current contribution</p>
                      <p className="text-3xl font-bold text-gray-900">{selectedSourceData.percentage}%</p>
                      <p className="text-sm text-gray-500">of total pollution</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">24h average</span>
                        <span className="font-medium">{selectedSourceData.value} µg/m³</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Peak time</span>
                        <span className="font-medium">
                          {selectedSource === 'stubble' ? 'Evening (6-10 PM)' : 
                           selectedSource === 'vehicles' ? 'Morning (8-10 AM) & Evening (6-8 PM)' :
                           selectedSource === 'industrial' ? 'Daytime (10 AM-4 PM)' : 'Afternoon (2-5 PM)'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Affected area</span>
                        <span className="font-medium">{selectedSourceData.regions[0]} +{selectedSourceData.regions.length-1} more</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
                
                <div className="space-y-3">
                  {selectedSource === 'all' ? (
                    <>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Flame size={16} className="text-orange-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-orange-800">Stubble Burning Peak</p>
                            <p className="text-xs text-orange-700">Avoid evening walks. Keep windows closed from 6-10 PM.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Car size={16} className="text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">High Traffic Hours</p>
                            <p className="text-xs text-blue-700">Use metro during peak hours. Avoid main roads.</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Factory size={16} className="text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-purple-800">Industrial Emissions</p>
                            <p className="text-xs text-purple-700">Areas near Faridabad, Noida have higher pollution.</p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Personal Protection</p>
                        <p className="text-xs text-blue-700 mt-1">
                          {selectedSource === 'stubble' && 'Wear N95 mask when outdoors, especially in evening. Use air purifier indoors.'}
                          {selectedSource === 'vehicles' && 'Avoid roads with heavy traffic. Use public transport to reduce contribution.'}
                          {selectedSource === 'industrial' && 'If living near industrial areas, keep windows closed and use air purifier.'}
                          {selectedSource === 'dust' && 'Wear mask near construction sites. Keep windows closed on windy days.'}
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Community Action</p>
                        <p className="text-xs text-green-700 mt-1">
                          {selectedSource === 'stubble' && 'Support farmers with stubble management alternatives.'}
                          {selectedSource === 'vehicles' && 'Carpool or use metro today. Every vehicle off the road helps.'}
                          {selectedSource === 'industrial' && 'Report violations to pollution control board.'}
                          {selectedSource === 'dust' && 'Ensure construction sites near you follow dust control measures.'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Cross-Border Pollution */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cross-Border Pollution Impact</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Punjab</p>
                  <p className="text-2xl font-bold text-gray-900">45%</p>
                  <p className="text-xs text-gray-500">of stubble burning</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-orange-500 rounded-full h-1.5" style={{ width: '45%' }}></div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Haryana</p>
                  <p className="text-2xl font-bold text-gray-900">35%</p>
                  <p className="text-xs text-gray-500">of stubble burning</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-orange-500 rounded-full h-1.5" style={{ width: '35%' }}></div>
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">UP</p>
                  <p className="text-2xl font-bold text-gray-900">20%</p>
                  <p className="text-xs text-gray-500">of stubble burning</p>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-orange-500 rounded-full h-1.5" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Wind direction: North-westerly. Transport of pollutants from Punjab/Haryana affects Delhi-NCR.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceAnalysis;