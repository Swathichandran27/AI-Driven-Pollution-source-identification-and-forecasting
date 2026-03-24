// src/pages/Citizen/ForecastAlerts.jsx
import React, { useState, useEffect } from 'react';
// Replaced `Card` usages with plain `div` wrappers to keep JSX balanced in this file
import { 
  ArrowLeft,
  Bell,
  BellRing,
  Clock,
  Calendar,
  Settings,
  Share2,
  Download,
  XCircle,
  TrendingUp,
  Sun,
  AlertTriangle,
  Info,
  CheckCircle,
  Shield,
  Activity,
  Wind
} from 'lucide-react';
import { Link } from 'react-router-dom';
import citizenApi from '../../api/citizenApi';

const ForecastAlerts = () => {
  const [prefs, setPrefs] = useState({ smsAlerts: false, threshold: 150 });
  const [showSettings, setShowSettings] = useState(false);
  const [current, setCurrent] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [backendAlerts, setBackendAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [localAlerts, setLocalAlerts] = useState([]);
  const [forecast7, setForecast7] = useState([]);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState(null);
  const [sourceData, setSourceData] = useState(null);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [sourceError, setSourceError] = useState(null);
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [alertSettings, setAlertSettings] = useState({ pushNotifications: true, emailAlerts: true, smsAlerts: false, threshold: 150 });

  // Forecast and alerts will come from backend; initial empty arrays
  // forecast7: 7-day summary entries
  // backendAlerts: array of structured alert objects from backend

  const displayCurrent = current || (forecast7 && forecast7.length ? ({ station: selectedStation, aqi: forecast7[0].aqi, category: forecast7[0].category, pm25: forecast7[0].pm25, pm10: forecast7[0].pm10 }) : null);

  // map structured backend alerts into localAlerts (for read/unread handling)
  useEffect(() => {
    if (backendAlerts && backendAlerts.length) {
      const mapped = backendAlerts.map((a, i) => ({ id: a.id ?? `b-${i}`, type: a.type ?? 'info', title: a.title ?? a.summary ?? '', message: a.message ?? a.body ?? '', time: a.timestamp ?? a.time ?? 'just now', severity: a.severity ?? 'medium', read: a.read ?? false }));
      setLocalAlerts(mapped);
    } else {
      setLocalAlerts([]);
    }
  }, [backendAlerts]);

  // chosenDay uses forecast7 if available, otherwise falls back to hourlyForecast/displayCurrent
  const chosenDay = forecast7[selectedDay] || { hourly: hourlyForecast, pm25: displayCurrent?.pm25, pm10: displayCurrent?.pm10, no2: displayCurrent?.no2, o3: displayCurrent?.o3, aqi: displayCurrent?.aqi, category: displayCurrent?.category, high: displayCurrent?.high, low: displayCurrent?.low, day: 'N/A', date: '' };

  const alertsToShow = localAlerts;

  // Fetch backend data: stations, forecast, source-analysis, and dashboard where needed
  useEffect(() => {
    let mounted = true;

    const loadStations = async () => {
      try {
        const st = await citizenApi.getStations();
        if (!mounted) return;
        const list = Array.isArray(st) ? st : [];
        setStations(list.map(s => (s.station || s)));
        if (!selectedStation && list[0]) setSelectedStation(list[0].station || list[0]);
      } catch (e) {
        console.error('Failed to fetch stations', e);
      }
    };

    const loadForStation = async (stationName) => {
      if (!stationName) return;
      setForecastLoading(true); setForecastError(null);
      setSourceLoading(true); setSourceError(null);
      setDashboardLoading(true); setDashboardError(null);

      try {
        const [forecastRes, sourceRes, dashboardRes] = await Promise.allSettled([
          citizenApi.getForecast({ station: stationName }),
          citizenApi.getSourceAnalysis({ station: stationName }),
          citizenApi.getDashboard()
        ]);

        // Forecast handling
        if (forecastRes.status === 'fulfilled' && forecastRes.value) {
          const f = forecastRes.value;
          const seven = f.forecast || f.daily || [];
          setForecast7(seven.map(item => ({
            day: item.day || item.date || item.datetime || item.hour || '',
            date: item.date || item.datetime || '',
            aqi: item.aqi ?? null,
            category: item.category ?? item.category_name ?? '',
            high: item.high ?? null,
            low: item.low ?? null,
            pm25: item.pm25 ?? item.pollutants?.pm25 ?? null,
            pm10: item.pm10 ?? item.pollutants?.pm10 ?? null,
            no2: item.no2 ?? item.pollutants?.no2 ?? null,
            o3: item.o3 ?? item.pollutants?.o3 ?? null,
            hourly: item.hourly || []
          })));

          // hourly forecast for selected day or overall
          setHourlyForecast((f.forecast || []).map(ft => ({ time: ft.hour || ft.datetime, aqi: ft.aqi })));

          // structured alerts from forecast response
          setBackendAlerts(f.alerts || []);

          // current snapshot if provided
          if (f.current) {
            setCurrent({
              station: stationName,
              aqi: f.current.aqi,
              category: f.current.category,
              pm25: f.current.pm25 ?? f.current.pollutants?.pm25,
              pm10: f.current.pm10 ?? f.current.pollutants?.pm10,
              no2: f.current.no2 ?? f.current.pollutants?.no2,
              co: f.current.co ?? f.current.pollutants?.co
            });
          }

          setLastUpdated(f.updated_at || new Date().toISOString());
        } else {
          setForecastError('Forecast unavailable');
        }

        // Source analysis
        if (sourceRes.status === 'fulfilled' && sourceRes.value) {
          setSourceData(sourceRes.value);
        } else {
          setSourceError('Source analysis unavailable');
        }

        // Dashboard (for nearby stations & fallback current)
        if (dashboardRes.status === 'fulfilled' && Array.isArray(dashboardRes.value)) {
          setDashboardData(dashboardRes.value);
          // if current not set from forecast, try to set from dashboard
          if (!forecastRes.value?.current) {
            const match = (dashboardRes.value || []).find(s => s.station === stationName);
            if (match) {
              setCurrent({ station: match.station, aqi: match.aqi, category: match.category, pm25: match.pollutants?.pm25, pm10: match.pollutants?.pm10, no2: match.pollutants?.no2, co: match.pollutants?.co });
            }
          }
        } else {
          setDashboardError('Dashboard unavailable');
        }

      } catch (e) {
        console.error('Failed to load station data', e);
        setForecastError('Failed to load forecast');
        setSourceError('Failed to load source analysis');
        setDashboardError('Failed to load dashboard');
      } finally {
        if (mounted) {
          setForecastLoading(false);
          setSourceLoading(false);
          setDashboardLoading(false);
        }
      }
    };

    loadStations().then(() => loadForStation(selectedStation));
    const id = setInterval(() => loadForStation(selectedStation), 30_000);
    return () => { mounted = false; clearInterval(id); };
  }, [selectedStation]);

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

  const formatNumber = (v, digits = 0) => {
    if (v === null || v === undefined || Number.isNaN(Number(v))) return '—';
    try {
      return new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(Number(v));
    } catch (e) {
      return String(Math.round(Number(v)));
    }
  };

  const barWidthPct = (val, max = 500) => `${(Math.min(Math.max(Number(val) || 0, 0), max) / max) * 100}%`;

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
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      <main className="p-6 w-full">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-sm bg-black/40 border-b border-[#071526] mb-4">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/" className="p-2 rounded-lg">
                  <ArrowLeft size={20} className="text-gray-300" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">Forecast & Alerts</h1>
                  <p className="text-sm text-gray-400">24-72 hour predictions and real-time alerts</p>
                </div>
                <div className="ml-6">
                  <label className="text-sm text-gray-300 mr-2">Station</label>
                  <select aria-label="Select station" value={selectedStation} onChange={(e)=>setSelectedStation(e.target.value)} className="px-3 py-2 rounded bg-[#071526] text-gray-200 focus:ring-2 focus:ring-[#2563EB]">
                    {stations.length ? stations.map((st, i)=>(<option key={i} value={st}>{st}</option>)) : (<option>Loading stations...</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  aria-label="Alert settings"
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg relative focus:outline-none"
                >
                  <Settings size={20} className="text-gray-300 cursor-pointer" />
                  {alertSettings.pushNotifications && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>
                <button aria-label="Share forecast" className="p-2 rounded-lg">
                  <Share2 size={20} className="text-gray-300 cursor-pointer" />
                </button>
                <button aria-label="Download forecast" className="p-2 rounded-lg">
                  <Download size={20} className="text-gray-300 cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Settings Panel */}
        {showSettings && (
          <div className="mb-4">
            <div className="bg-[#111827] rounded-xl p-6 border border-[#071526]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">Alert Preferences</h3>
                <button onClick={() => setShowSettings(false)}>
                  <XCircle size={20} className="text-gray-400 hover:text-gray-300" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">Notification Channels</h4>
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Push Notifications</span>
                    <button
                      onClick={() => setAlertSettings({...alertSettings, pushNotifications: !alertSettings.pushNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        alertSettings.pushNotifications ? 'bg-[#2563EB]' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          alertSettings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </label>

                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-4">Alert Threshold</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Notify when AQI exceeds:</span>
                        <span className="font-medium text-white">{alertSettings.threshold}</span>
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
          </div>
        )}

        <div>
        {(!forecast7.length && !(backendAlerts && backendAlerts.length) && !forecastLoading) && (
          <div className="mb-4">
            <div className="rounded-md bg-yellow-50 border-l-4 border-yellow-400 p-3 text-yellow-800">
              <strong>Mock data:</strong> Forecast/alerts panel currently showing fallback/mock data.
            </div>
          </div>
        )}
        {/* Current Conditions & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-2 p-6 text-white bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm">Current Conditions</p>
                <h2 className="text-2xl font-bold">{selectedStation || displayCurrent?.station || '—'}</h2>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Live</span>
            </div>
            
            <div className="flex items-end gap-4 mb-4">
              <div>
                <span className="text-5xl font-bold">{displayCurrent?.aqi !== undefined ? formatNumber(displayCurrent?.aqi) : '—'}</span>
                <span className="text-blue-100 ml-2">AQI</span>
              </div>
              <div className="mb-1">
                <span className="text-xl">{displayCurrent?.category ?? displayCurrent?.category ?? '—'}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400 mb-2">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : '—' } {lastUpdated && <span className="inline-block ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Live</span>}</div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-blue-100 text-xs">Temperature</p>
                <p className="text-xl font-semibold">{displayCurrent?.high ?? '—'}°C</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs">Wind Speed</p>
                <p className="text-xl font-semibold">{displayCurrent?.windSpeed ?? '—'} km/h</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs">Humidity</p>
                <p className="text-xl font-semibold">{displayCurrent?.humidity ?? '—'}%</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BellRing className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-900">Active Alerts</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{alertsToShow.filter(a => !a.read).length}</div>
            <p className="text-sm text-gray-500">Unread notifications</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">{alertsToShow.filter(a=>a.severity==='high').length} High</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">{alertsToShow.filter(a=>a.severity==='medium').length} Medium</span>
            </div>
          </div>

          <div className="p-6">
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
        <div className="p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">7-Day Forecast</h2>
            <div className="flex gap-2 items-center">
              {forecastLoading && <span className="text-sm text-gray-500 mr-2">Loading forecast...</span>}
              {forecastError && <span className="text-sm text-red-600 mr-2">{forecastError}</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => {
                // download current + hourly + alerts as JSON
                const payload = { current: displayCurrent, hourly: hourlyForecast, alerts: alertsToShow };
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = `forecast_${(displayCurrent?.station||selectedStation||'station').replace(/[^a-z0-9]/gi,'_')}_${new Date().toISOString()}.json`;
                document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
              }} className="text-sm text-blue-600 hover:text-blue-700">Export</button>
              <button onClick={async ()=>{
                const payloadText = `AQI ${displayCurrent?.aqi !== undefined ? formatNumber(displayCurrent?.aqi) : '—'} at ${displayCurrent?.station}\nSee hourly forecast.`;
                if (navigator.share) {
                  try { await navigator.share({ title: 'AQI Forecast', text: payloadText, url: window.location.href }); }
                  catch(e){ console.warn('Share failed', e); }
                } else if (navigator.clipboard) {
                  await navigator.clipboard.writeText(`${payloadText}\n${window.location.href}`);
                  alert('Forecast link copied to clipboard');
                } else { alert('Share not supported'); }
              }} className="text-sm text-gray-600 hover:text-gray-700">Share</button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {(forecast7.length ? forecast7 : Array.from({length:7}).map(()=>({day:'—',date:'',aqi:0,category:'—',high:'—',low:'—'}))).map((day, index) => (
              <button
                key={index}
                onClick={() => setSelectedDay(index)}
                className={`p-4 rounded-xl transition-all flex flex-col justify-between min-h-[110px] ${
                  selectedDay === index 
                    ? getAQIBgLight(day.aqi) + ' ring-2 ring-offset-2 ' + getAQITextColor(day.aqi).replace('text', 'ring')
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{day.day}</p>
                  <p className="text-xs text-gray-500 truncate">{day.date}</p>
                </div>

                <div className="mt-2">
                  <div className={`text-xl font-bold mb-1 ${getAQITextColor(day.aqi)}`}>
                    {formatNumber(day.aqi)}
                  </div>
                  <p className="text-xs text-gray-600 mb-2 truncate">{day.category}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                    <span>↑{day.high ?? '—'}°</span>
                    <span>↓{day.low ?? '—'}°</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div
                      className={`${getAQIColor(day.aqi)} rounded-full h-1`}
                      style={{ width: barWidthPct(day.aqi, 500) }}
                    ></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Forecast for Selected Day */}
        {selectedDay !== null && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Hourly Forecast */}
            <div className="lg:col-span-2 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {chosenDay.day}'s Hourly Forecast
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>All times IST</span>
                </div>
              </div>

              <div className="space-y-3">
                {(hourlyForecast.length ? hourlyForecast : (chosenDay.hourly || [
                  { time: '6 AM', aqi: 280, temp: 24 },
                  { time: '9 AM', aqi: 295, temp: 27 },
                  { time: '12 PM', aqi: 325, temp: 31 },
                  { time: '3 PM', aqi: 330, temp: 32 },
                  { time: '6 PM', aqi: 315, temp: 29 },
                  { time: '9 PM', aqi: 305, temp: 26 }
                ])).map((hour, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                    <span className="w-16 text-sm font-medium text-gray-700">{hour.time}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-semibold ${getAQITextColor(hour.aqi)}`}>
                            AQI {formatNumber(hour.aqi)}
                          </span>
                        </div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full ml-3 mr-3">
                          <div
                            className={`${getAQIColor(hour.aqi)} rounded-full h-2`}
                            style={{ width: barWidthPct(hour.aqi, 500) }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{hour.temp !== undefined ? `${formatNumber(hour.temp)}°C` : '—'}</span>
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
                        AQI expected to reach high levels between 12 PM - 4 PM. Avoid outdoor activities during these hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pollutants Breakdown */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Pollutants</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">PM2.5</span>
                    <span className="font-medium text-gray-900">{chosenDay.pm25 !== undefined ? formatNumber(chosenDay.pm25) : '—'} µg/m³</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 rounded-full h-2" style={{ width: barWidthPct(chosenDay.pm25, 250) }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">PM10</span>
                    <span className="font-medium text-gray-900">{chosenDay.pm10 !== undefined ? formatNumber(chosenDay.pm10) : '—'} µg/m³</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 rounded-full h-2" style={{ width: barWidthPct(chosenDay.pm10, 350) }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">NO₂</span>
                    <span className="font-medium text-gray-900">{chosenDay.no2 !== undefined ? formatNumber(chosenDay.no2) : '—'} ppb</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 rounded-full h-2" style={{ width: barWidthPct(chosenDay.no2, 200) }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">O₃</span>
                    <span className="font-medium text-gray-900">{chosenDay.o3 !== undefined ? formatNumber(chosenDay.o3) : '—'} ppb</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: barWidthPct(chosenDay.o3, 100) }}></div>
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
                    {sourceLoading && <p className="text-xs text-gray-500 mt-2">Loading source analysis...</p>}
                    {sourceError && <p className="text-xs text-red-600 mt-2">{sourceError}</p>}
                    {sourceData && sourceData.dominant_source && (
                      <p className="text-xs text-blue-700 mt-2">Source analysis: {sourceData.dominant_source} contributing {sourceData.dominant_percent ?? '—'}%.</p>
                    )}
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
              <div className="flex justify-end mb-2">
                <button onClick={() => setLocalAlerts(localAlerts.map(a=>({...a, read:true})))} className="text-sm text-blue-600">Mark all as read</button>
              </div>
              {alertsToShow.map((alert) => (
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
                    <div className="flex flex-col items-end gap-2">
                      <div>
                        {!alert.read && (
                          <button onClick={() => setLocalAlerts(localAlerts.map(a => a.id===alert.id ? {...a, read:true} : a))} className="text-xs text-blue-600 mr-2">Mark read</button>
                        )}
                      </div>
                      {!alert.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
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
      </main>
    </div>
  );
};

export default ForecastAlerts;