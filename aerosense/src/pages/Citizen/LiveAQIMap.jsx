// pages/Citizen/LiveAQIMap.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../components/UI/Card';
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker, 
  Popup, 
  LayerGroup,
  useMap 
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  RefreshCw, 
  Thermometer, 
  Wind, 
  Droplets,
  TrendingUp,
  Map as MapIcon,
  Layers,
  Activity,
  AlertTriangle,
  ChevronDown,
  Download,
  Share2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const HARD_CODED_COORDS = {
  'Anand Vihar': [28.6500, 77.3150],
  'RK Puram': [28.5500, 77.1800],
  'IIT Delhi': [28.5450, 77.1928],
  'Punjabi Bagh': [28.6619, 77.1400],
  'Dwarka': [28.5915, 77.0200],
  'Lodhi Road': [28.5934, 77.2287],
  'Patparganj': [28.6315, 77.2910],
  'Anand Vihar Delhi': [28.6500, 77.3150]
};

const LiveAQIMap = () => {
  // State Management
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [mapCenter] = useState([28.6139, 77.2090]); // Delhi center
  const [mapZoom] = useState(11);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [trendData, setTrendData] = useState(null);

  // Fetch real-time data
//   const fetchLiveData = useCallback(async () => {
//     try {
//       setLoading(true);
      
//       // Mock API call - Replace with actual CPCB API
//       const response = await fetch('/api/cpcb/stations');
//       const data = await response.json();
      
//       setStations(data);
//       setLastUpdated(new Date());
//       calculateTopStations(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);


const fetchLiveData = useCallback(async () => {
  try {
    setLoading(true);
    // call backend dashboard endpoint
    const res = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5000'}/dashboard`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();

    // map backend dashboard items to station objects with coords
    const transformed = data.map((row, idx) => {
      const name = row.station;
      const coords = HARD_CODED_COORDS[name] || HARD_CODED_COORDS[`${name}`] || null;
      const lat = coords ? coords[0] : (mapCenter[0] + (Math.random() - 0.5) * 0.1);
      const lng = coords ? coords[1] : (mapCenter[1] + (Math.random() - 0.5) * 0.1);

      return {
        id: `${name}-${idx}`,
        name: name,
        city: row.city,
        aqi: Number(row.aqi) || 0,
        category: row.category || '',
        dominant_source: row.dominant_source || row.dominant_pollutant || '',
        pollutants: row.pollutants || {},
        datetime: row.datetime,
        lat,
        lng
      };
    });

    setStations(transformed);
    setLastUpdated(new Date());
    calculateTopStations(transformed);
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    setStations([]);
  } finally {
    setLoading(false);
  }
}, [mapCenter]);

  // Fetch trend data for selected station
  const fetchTrendData = useCallback(async (stationName) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5000'}/forecast?station=${encodeURIComponent(stationName)}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      // Expect json.forecast = [{hour, datetime, aqi, category}, ...]
      const labels = (json.forecast || []).map((f) => String(f.datetime || f.hour));
      const values = (json.forecast || []).map((f) => Number(f.aqi) || 0);
      setTrendData({ labels, values });
    } catch (error) {
      console.error('Error fetching trend:', error);
      setTrendData(null);
    }
  }, [timeRange]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  // Fetch trend data when station selected
  useEffect(() => {
    if (selectedStation) {
      fetchTrendData(selectedStation.id);
    }
  }, [selectedStation, fetchTrendData]);

  // AQI Helpers
  const getAQIColor = (aqi) => {
    if (aqi <= 50) return '#10B981'; // Green
    if (aqi <= 100) return '#FBBF24'; // Yellow
    if (aqi <= 200) return '#F97316'; // Orange
    if (aqi <= 300) return '#EF4444'; // Red
    if (aqi <= 400) return '#8B5CF6'; // Purple
    return '#7F1D1D'; // Maroon
  };

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Satisfactory';
    if (aqi <= 200) return 'Moderate';
    if (aqi <= 300) return 'Poor';
    if (aqi <= 400) return 'Very Poor';
    return 'Severe';
  };

  const getAQIBgClass = (aqi) => {
    if (aqi <= 50) return 'bg-green-100 text-green-700';
    if (aqi <= 100) return 'bg-yellow-100 text-yellow-700';
    if (aqi <= 200) return 'bg-orange-100 text-orange-700';
    if (aqi <= 300) return 'bg-red-100 text-red-700';
    if (aqi <= 400) return 'bg-purple-100 text-purple-700';
    return 'bg-red-200 text-red-800';
  };

  // Calculate top stations
  const [topStations, setTopStations] = useState({
    highest: null,
    lowest: null,
    average: 0,
    critical: []
  });

  const calculateTopStations = (stationsData) => {
    if (!stationsData.length) return;

    const sorted = [...stationsData].sort((a, b) => b.aqi - a.aqi);
    const critical = stationsData.filter(s => s.aqi > 300);
    const avg = Math.round(stationsData.reduce((acc, s) => acc + s.aqi, 0) / stationsData.length);

    setTopStations({
      highest: sorted[0],
      lowest: sorted[sorted.length - 1],
      average: avg,
      critical: critical.slice(0, 3)
    });
  };

  // Map Controller Component
  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      if (selectedStation) {
        map.setView([selectedStation.lat, selectedStation.lng], 13);
      }
    }, [selectedStation, map]);

    return null;
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : ''} min-h-screen bg-[#0B0F19] text-gray-200`}>
      <main className="p-6 w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-black/40 border-b border-[#071526] mb-4">
        <div className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Live AQI Monitor</h1>
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <span>Real-time data from CPCB monitoring stations</span>
                {lastUpdated && (
                  <span className="text-xs bg-transparent px-2 py-1 rounded text-gray-300">
                    Last: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </button>
              <button
                onClick={fetchLiveData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-accent text-black rounded-lg hover:brightness-95 disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* ✅ Top AQI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Average AQI Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Average AQI</span>
              <Activity size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{topStations.average}</p>
            <p className="text-xs text-gray-500">Across {stations.length} stations</p>
          </Card>

          {/* Highest AQI Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Highest AQI</span>
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            {topStations.highest && (
              <>
                <p className="text-2xl font-bold text-red-400">{topStations.highest.aqi}</p>
                <p className="text-xs text-gray-300 truncate">{topStations.highest.name}</p>
              </>
            )}
          </Card>

          {/* Lowest AQI Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Lowest AQI</span>
              <Wind size={18} className="text-green-500" />
            </div>
            {topStations.lowest && (
              <>
                <p className="text-2xl font-bold text-green-400">{topStations.lowest.aqi}</p>
                <p className="text-xs text-gray-300 truncate">{topStations.lowest.name}</p>
              </>
            )}
          </Card>

          {/* Critical Stations Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Critical Stations</span>
              <span className="text-xs font-bold text-red-600">{topStations.critical.length}</span>
            </div>
            <div className="space-y-1">
              {topStations.critical.map((s, idx) => (
                <p key={idx} className="text-xs text-gray-300 truncate">
                  • {s.name}: {s.aqi}
                </p>
              ))}
            </div>
          </Card>
        </div>

        {/* Controls Bar */}
        <div className="bg-[#1e293b] rounded-xl shadow-md p-4 mb-6 border border-white/5 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* ✅ Heatmap Toggle */}
              <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showHeatmap ? 'bg-blue-600 text-white' : 'bg-[#243447] text-gray-200 hover:bg-[#2b3b4a]'
              }`}
            >
              <Layers size={16} />
              {showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}
            </button>

            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-[#243447] text-gray-200"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            {/* Station Count */}
            <span className="text-sm text-gray-500 ml-auto">
              {stations.length} active stations
            </span>
          </div>
        </div>

        {/* Main Grid: Map + Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ✅ Map with Colored AQI Bubbles */}
          <div className="lg:col-span-2 bg-[#1e293b] rounded-xl shadow-md p-4 border border-white/5 backdrop-blur-sm">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                
                <MapController />

                {/* Station Markers */}
                <LayerGroup>
                  {stations.map((station) => (
                    <CircleMarker
                      key={station.id}
                      center={[station.lat, station.lng]}
                      radius={8 + (station.aqi / 500) * 15}
                      fillColor={getAQIColor(station.aqi)}
                      color="#ffffff"
                      weight={2}
                      opacity={1}
                      fillOpacity={0.7}
                      eventHandlers={{
                        click: () => setSelectedStation(station)
                      }}
                    >
                      {/* ✅ Popup on Click */}
                      <Popup>
                        <div className="p-3 min-w-[250px]">
                          <h3 className="font-bold text-lg mb-1">{station.name}</h3>
                          
                          <div className={`inline-block px-2 py-1 rounded-full text-sm font-medium mb-3 ${getAQIBgClass(station.aqi)}`}>
                            AQI: {station.aqi} - {getAQICategory(station.aqi)}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">PM2.5</p>
                              <p className="font-medium">{station.pollutants?.pm25 ?? '–'} µg/m³</p>
                            </div>
                            <div>
                              <p className="text-gray-500">PM10</p>
                              <p className="font-medium">{station.pollutants?.pm10 ?? '–'} µg/m³</p>
                            </div>
                            <div>
                              <p className="text-gray-500">NO₂</p>
                              <p className="font-medium">{station.pollutants?.no2 ?? '–'}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">CO</p>
                              <p className="font-medium">{station.pollutants?.co ?? '–'}</p>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                            <p>Last updated: {station.lastUpdated}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Thermometer size={12} /> {station.temp}°C
                              <Wind size={12} /> {station.windSpeed} km/h
                              <Droplets size={12} /> {station.humidity}%
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </LayerGroup>

                {/* ✅ Heatmap Layer */}
                {showHeatmap && (
                  <LayerGroup>
                    {stations.map((station) => (
                      <CircleMarker
                        key={`heat-${station.id}`}
                        center={[station.lat, station.lng]}
                        radius={50}
                        fillColor={getAQIColor(station.aqi)}
                        fillOpacity={0.15}
                        weight={0}
                      />
                    ))}
                  </LayerGroup>
                )}
              </MapContainer>
            </div>
          </div>

          {/* ✅ Trend Chart Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Station Info */}
            {selectedStation ? (
              <>
                <div className="bg-[#1e293b] rounded-xl shadow-md p-4 border border-white/5 backdrop-blur-sm">
                  <h2 className="font-semibold text-gray-900 mb-3">Selected Station</h2>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{selectedStation.name}</p>
                      <p className={`text-2xl font-bold mt-1 ${getAQIBgClass(selectedStation.aqi).split(' ')[1]}`}>
                        {selectedStation.aqi}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedStation(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Trend Chart */}
                <div className="bg-[#1e293b] rounded-xl shadow-md p-4 border border-white/5 backdrop-blur-sm">
                  <h2 className="font-semibold text-gray-900 mb-4">AQI Trend ({timeRange})</h2>
                  {trendData ? (
                    <div className="h-[300px]">
                      <Line
                        data={{
                          labels: trendData.labels,
                          datasets: [
                            {
                              label: 'AQI',
                              data: trendData.values,
                              borderColor: '#3B82F6',
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              fill: true,
                              tension: 0.4
                            }
                          ]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: { color: 'rgba(0,0,0,0.05)' }
                            },
                            x: {
                              grid: { display: false }
                            }
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-gray-400">
                      Loading trend data...
                    </div>
                  )}
                </div>

                {/* Pollutant Breakdown */}
                <div className="bg-[#1e293b] rounded-xl shadow-md p-4 border border-white/5 backdrop-blur-sm">
                  <h2 className="font-semibold text-gray-900 mb-3">Pollutant Levels</h2>
                  <div className="space-y-3">
                    {[
                      { name: 'PM2.5', value: selectedStation.pollutants?.pm25 ?? 0, max: 250, color: 'bg-red-500' },
                      { name: 'PM10', value: selectedStation.pollutants?.pm10 ?? 0, max: 350, color: 'bg-orange-500' },
                      { name: 'NO₂', value: selectedStation.pollutants?.no2 ?? 0, max: 200, color: 'bg-yellow-500' },
                      { name: 'CO', value: selectedStation.pollutants?.co ?? 0, max: 50, color: 'bg-green-500' }
                    ].map((pollutant) => (
                      <div key={pollutant.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{pollutant.name}</span>
                          <span className="font-medium">{pollutant.value} µg/m³</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${pollutant.color} rounded-full h-2`}
                            style={{ width: `${(pollutant.value / pollutant.max) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-[#243447] rounded-xl shadow-md p-8 text-center text-gray-300 border border-white/5 backdrop-blur-sm">
                <MapIcon size={48} className="mx-auto mb-3 opacity-50" />
                <p>Click on any station marker to view detailed trends and pollutant data</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default LiveAQIMap;