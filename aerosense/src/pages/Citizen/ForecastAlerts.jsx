// src/pages/Citizen/ForecastAlerts.jsx
import React, { useState, useEffect, useRef } from 'react';
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
import citizenApi from '../../api/citizenApi';

const ForecastAlerts = () => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [stations, setStations] = useState([]);
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metric, setMetric] = useState('aqi'); // 'aqi' or 'temp'
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, label: '', value: null });
  const [alertSettings, setAlertSettings] = useState({
    pushNotifications: true,
    emailAlerts: false,
    smsAlerts: false,
    threshold: 150
  });
  const [showSettings, setShowSettings] = useState(false);

  // Mock forecast data (stored in state so we can replace it with backend data)
  const [forecastData, setForecastData] = useState([
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
  ]);

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
    if (aqi <= 300) return 'bg-aqi-red';
    if (aqi <= 400) return 'bg-purple-500';
    return 'bg-maroon-500';
  };

  const getChartColor = (metricView) => {
    return metricView === 'aqi' ? '#60a5fa' : '#fb923c';
  };

  const getAQITextColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 200) return 'text-orange-600';
    if (aqi <= 300) return 'text-aqi-red-dark';
    if (aqi <= 400) return 'text-purple-600';
    return 'text-red-800';
  };

  const getAQIBgLight = (aqi) => {
    if (aqi <= 50) return 'bg-green-50';
    if (aqi <= 100) return 'bg-yellow-50';
    if (aqi <= 200) return 'bg-orange-50';
    if (aqi <= 300) return 'bg-aqi-red-light';
    if (aqi <= 400) return 'bg-purple-50';
    return 'bg-aqi-red-100';
  };

  // Return a hex color matching the AQI band for inline styles
  const getAQIHex = (aqi) => {
    if (aqi == null) return '#94a3b8';
    if (aqi <= 50) return '#10B981'; // green-500
    if (aqi <= 100) return '#F59E0B'; // yellow-500
    if (aqi <= 200) return '#F97316'; // orange-500
    if (aqi <= 300) return '#ef6b6b'; // softer red aligned with theme
    if (aqi <= 400) return '#7C3AED'; // purple-600
    return '#7F1D1D'; // maroon/dark red
  };

  const getAQILabel = (aqi) => {
    if (aqi == null) return 'Unknown';
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="text-aqi-red" size={20} />;
      case 'info': return <Info className="text-blue-500" size={20} />;
      case 'success': return <CheckCircle className="text-green-500" size={20} />;
      default: return <Bell className="text-gray-500" size={20} />;
    }
  };

  // Expand or interpolate hourly data to 24 points if backend returns fewer
  const expandTo24Hours = (hourly) => {
    if (!hourly || hourly.length === 0) return [];
    if (hourly.length >= 24) return hourly.slice(0, 24);

    // Create target 24-hour labels starting from first provided hour index
    const result = [];
    const n = hourly.length;
    for (let i = 0; i < 24; i++) {
      const t = Math.round((i / 23) * (n - 1));
      const next = Math.min(t + 1, n - 1);
      const frac = (i / 23) * (n - 1) - t;
      const aqi = Math.round(hourly[t].aqi + (hourly[next].aqi - hourly[t].aqi) * frac);
      const temp = Math.round(hourly[t].temp + (hourly[next].temp - hourly[t].temp) * frac);
      const hourLabel = `${i}:00`;
      result.push({ time: hourLabel, aqi, temp });
    }
    return result;
  };

  // Normalize various backend forecast payload shapes into component `forecastData` days array
  const normalizeForecastPayload = (fc) => {
    if (!fc) return [];
    // If backend returns days array (multi-day structure)
    if (Array.isArray(fc.days) && fc.days.length) return fc.days.map(d => ({
      day: d.day || d.label || 'Day',
      date: d.date || '',
      aqi: d.aqi || d.meanAQI || 0,
      category: d.category || '',
      high: d.high || d.maxTemp || 0,
      low: d.low || d.minTemp || 0,
      condition: d.condition || '',
      windSpeed: d.windSpeed || 0,
      humidity: d.humidity || 0,
      pm25: d.pm25 || 0,
      pm10: d.pm10 || 0,
      no2: d.no2 || 0,
      o3: d.o3 || 0,
      hourly: Array.isArray(d.hourly) ? d.hourly.map(h => ({ time: h.time || h.label || h.hour || h.datetime, aqi: h.aqi || h.value || h.predicted_aqi || 0, temp: h.temp || h.t || null })) : []
    }));

    // If backend returns a flat forecast array (24 hourly predictions)
    if (Array.isArray(fc.forecast) && fc.forecast.length) {
      const hourly = fc.forecast.map(h => ({ time: h.time || h.hour || h.label || h.datetime || '', aqi: h.aqi || h.value || h.predicted_aqi || 0, temp: h.temp || h.t || null }));
      const mean = hourly.length ? Math.round(hourly.reduce((s, x) => s + (x.aqi || 0), 0) / hourly.length) : 0;
      return [{ day: fc.station || 'Today', date: '', aqi: mean, category: '', high: 0, low: 0, condition: '', windSpeed: 0, humidity: 0, pm25: 0, pm10: 0, no2: 0, o3: 0, hourly }];
    }

    // Fallback: if fc itself is an array of hourly objects
    if (Array.isArray(fc) && fc.length) {
      const hourly = fc.map(h => ({ time: h.time || h.hour || h.label || h.datetime || '', aqi: h.aqi || h.value || h.predicted_aqi || 0, temp: h.temp || h.t || null }));
      const mean = hourly.length ? Math.round(hourly.reduce((s, x) => s + (x.aqi || 0), 0) / hourly.length) : 0;
      return [{ day: 'Today', date: '', aqi: mean, category: '', high: 0, low: 0, condition: '', windSpeed: 0, humidity: 0, pm25: 0, pm10: 0, no2: 0, o3: 0, hourly }];
    }

    return [];
  };

  // Hourly helper for selected day
  const getHourlyForDay = (dayIndex) => (forecastData[dayIndex] && forecastData[dayIndex].hourly) ? forecastData[dayIndex].hourly : [
    { time: '6 AM', aqi: 280, temp: 24 },
    { time: '9 AM', aqi: 295, temp: 27 },
    { time: '12 PM', aqi: 325, temp: 31 },
    { time: '3 PM', aqi: 330, temp: 32 },
    { time: '6 PM', aqi: 315, temp: 29 },
    { time: '9 PM', aqi: 305, temp: 26 }
  ];

  const renderAreaLineChart = (hourly, metricView = 'aqi') => {
    const values = hourly.map(h => metricView === 'aqi' ? h.aqi : h.temp);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const w = 600, h = 140;
    const stepX = values.length > 1 ? w / (values.length - 1) : w;
    const points = values.map((v, i) => {
      const x = Math.round(i * stepX);
      const y = Math.round(h - ((v - min) / (max - min || 1)) * (h - 20));
      return `${x},${y}`;
    });
    const linePath = `M${points.join(' L ')}`;
    const areaPath = `M0,${h} L${points.join(' L ')} L${w},${h} Z`;

    const stroke = metricView === 'aqi' ? '#60a5fa' : '#fb923c';
    const gradId = metricView === 'aqi' ? 'aqiGrad' : 'tempGrad';
    const stopA = metricView === 'aqi' ? '#0ea5e9' : '#fdba74';
    const stopB = '#071026';

    if (svgRef.current) {
      svgRef.current._points = points;
      svgRef.current._hourly = hourly;
    }

    const ticks = 4;
    const tickValues = Array.from({ length: ticks + 1 }, (_, i) => Math.round(min + (i / ticks) * (max - min)));

    return (
      <div className="relative">
        <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} className="w-full h-36" onMouseMove={handleSvgMouseMove} onMouseLeave={handleSvgMouseLeave}>
          <defs>
            <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={stopA} stopOpacity="0.9" />
              <stop offset="100%" stopColor={stopB} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {tickValues.map((tv, i) => {
            const yVal = Math.round(h - ((tv - min) / (max - min || 1)) * (h - 20));
            return (
              <g key={i}>
                <line x1={0} x2={w} y1={yVal} y2={yVal} stroke="#0f172a" strokeOpacity={0.12} />
                <text x={6} y={yVal - 4} fontSize="10" fill="#94a3b8">{tv}</text>
              </g>
            );
          })}

          <path d={areaPath} fill={`url(#${gradId})`} />
          <path d={linePath} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((pt, i) => {
            const [x, y] = pt.split(',');
            return <circle key={i} cx={x} cy={y} r={3.5} fill={stroke} opacity={0.95} />;
          })}

          {hourly.map((hobj, i) => {
            if (i % 3 !== 0) return null;
            const x = Math.round(i * stepX);
            const label = hobj.time || `${i}:00`;
            return <text key={i} x={x} y={h - 2} textAnchor="middle" fontSize="10" fill="#94a3b8">{label}</text>;
          })}
        </svg>

        {tooltip.visible && (
          <div style={{ position: 'fixed', left: tooltip.x + 10, top: tooltip.y - 30, background: 'rgba(2,6,23,0.95)', color: '#fff', padding: '6px 8px', borderRadius: 6, fontSize: 12, boxShadow: '0 6px 20px rgba(2,6,23,0.6)' }}>
            <div style={{ fontSize: 12, opacity: 0.9 }}>{tooltip.label}</div>
            <div style={{ fontWeight: 700 }}>{metric === 'aqi' ? `AQI ${tooltip.value}` : `${tooltip.value}°C`}</div>
          </div>
        )}
      </div>
    );
  };

  // hourly data for currently selected day (used in chart + strip)
  const hourlyForSelected = selectedDay !== null ? expandTo24Hours(getHourlyForDay(selectedDay)) : [];

  // Fetch stations and forecast from backend
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    const ac = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const st = await citizenApi.getStations(ac.signal);
        if (!mountedRef.current) return;
        setStations(st || []);
        if (st && st.length) {
          const first = st[0];
          const id = (first && (first.station || first.id || (typeof first === 'string' ? first : null)));
          if (id) setStation(id);
        }

        // fetch forecast for selected station (normalize multiple backend shapes)
        const fc = await citizenApi.getForecast({ station: st && st.length ? (st[0].station || st[0].id || (typeof st[0] === 'string' ? st[0] : null)) : null }, ac.signal);
        if (!mountedRef.current) return;
        const mapped = normalizeForecastPayload(fc);
        if (mapped && mapped.length) {
          setForecastData(mapped);
          setSelectedDay(0);
        }
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || String(err));
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    load();
    return () => { mountedRef.current = false; ac.abort(); };
  }, []);

  // refetch forecast when station changes
  useEffect(() => {
    if (!station) return;
    const ac = new AbortController();
    const loadForecast = async () => {
      try {
        setLoading(true);
        const fc = await citizenApi.getForecast({ station }, ac.signal);
        if (!mountedRef.current) return;
        const mapped = normalizeForecastPayload(fc);
        if (mapped && mapped.length) {
          setForecastData(mapped);
          setSelectedDay(0);
        }
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || String(err));
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    };
    loadForecast();
    return () => ac.abort();
  }, [station]);

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'high':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Info</span>;
      default:
        return null;
    }
  };

  const exportHourlyCSV = (rows) => {
    if (!rows || !rows.length) return;
    const header = ['time','aqi','temp'];
    const csv = [header.join(',')].concat(rows.map(r => `${r.time},${r.aqi},${r.temp}`)).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hourly-${forecastData[selectedDay].day || 'day'}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSvgMouseMove = (e) => {
    const svg = svgRef.current;
    if (!svg || !svg._points) return;
    const rect = svg.getBoundingClientRect();
    const w = 600, h = 140;
    const mouseX = ((e.clientX - rect.left) / rect.width) * w;
    let nearestIdx = 0;
    let nearestDist = Infinity;
    svg._points.forEach((pt, i) => {
      const [x] = pt.split(',').map(Number);
      const d = Math.abs(x - mouseX);
      if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
    });
    const [nx, ny] = svg._points[nearestIdx].split(',').map(Number);
    const hourly = svg._hourly || [];
    const data = hourly[nearestIdx] || {};
    setTooltip({ visible: true, x: (nx / w) * rect.width + rect.left, y: (ny / h) * rect.height + rect.top, label: data.time || '', value: metric === 'aqi' ? data.aqi : data.temp });
  };

  const handleSvgMouseLeave = () => setTooltip({ ...tooltip, visible: false });

  return (
    <div className="min-h-screen bg-neutral-900 text-gray-100">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft size={20} className="text-gray-200" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-[#e2e8f0]">Forecast & Alerts</h1>
                <p className="text-sm text-gray-400">24-72 hour predictions and real-time alerts</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors relative"
              >
                <Settings size={20} className="text-gray-200" />
                {alertSettings.pushNotifications && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 size={20} className="text-gray-200" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Download size={20} className="text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Settings Panel */}
      {showSettings && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-100">Alert Preferences</h3>
              <button onClick={() => setShowSettings(false)}>
                <XCircle size={20} className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-200">Notification Channels</h4>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Push Notifications</span>
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
                  <span className="text-sm text-gray-300">Email Alerts</span>
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
                  <span className="text-sm text-gray-300">SMS Alerts</span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Current Conditions & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-6">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-sm p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm">Current Conditions</p>
                <h2 className="text-2xl font-bold text-[#e2e8f0]">Anand Vihar, Delhi</h2>
              </div>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200">Live</span>
            </div>
            
              <div className="flex items-end gap-4 mb-4">
              <div>
                <span className="text-5xl font-bold text-[#e2e8f0]">{Math.round(forecastData[0].aqi || 0)}</span>
                <span className="text-blue-100 ml-2">AQI</span>
                <div className="text-sm text-gray-300 mt-1">{getAQILabel(Math.round(forecastData[0].aqi || 0))}</div>
              </div>
              <div className="mb-1">
                <span className="text-xl text-blue-100">{forecastData[0].category || ''}</span>
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

          <div className="bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <BellRing className="text-blue-600" size={20} />
              <h3 className="font-semibold text-gray-100">Active Alerts</h3>
            </div>
            <div className="text-3xl font-bold text-[#e2e8f0] mb-2">{alertsData.filter(a => !a.read).length}</div>
            <p className="text-sm text-gray-300">Unread notifications</p>
            <div className="mt-4 flex gap-2">
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">2 High</span>
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">1 Medium</span>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-xl shadow-md p-6 border border-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-green-600" size={20} />
              <h3 className="font-semibold text-white">7-Day Trend</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">↓ 15%</div>
            <p className="text-sm text-gray-300">Expected improvement</p>
            <div className="mt-4 flex items-center gap-2">
              <Sun size={16} className="text-yellow-500" />
              <span className="text-xs text-gray-300">Better air by weekend</span>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast removed as requested */}

        {/* Detailed Forecast for Selected Day */}
        {selectedDay !== null && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
            {/* Hourly Forecast */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-100">
                  {forecastData[selectedDay].day}'s Hourly Forecast
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={16} />
                  <span>All times IST</span>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-gray-800 rounded-xl shadow-sm p-6">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-300">Station</label>
                        <select
                          value={station || ''}
                          onChange={(e) => { setStation(e.target.value); setSelectedDay(0); }}
                          className="bg-gray-700 text-gray-100 border border-gray-600 rounded-md px-3 py-1 text-sm"
                        >
                          {stations.length === 0 && <option value="">Default</option>}
                          {stations.map((s, i) => {
                            const val = (s && (s.station || s.id || (typeof s === 'string' ? s : JSON.stringify(s))));
                            const label = (s && (s.station || s.name || (s.city ? `${s.city} — ${s.station || ''}` : (typeof s === 'string' ? s : JSON.stringify(s)))));
                            return <option key={i} value={val}>{label}</option>;
                          })}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-300 mr-2">View</div>
                        <button onClick={() => setMetric('aqi')} className={`px-3 py-1 rounded-md text-sm ${metric === 'aqi' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>AQI</button>
                        <button onClick={() => setMetric('temp')} className={`px-3 py-1 rounded-md text-sm ${metric === 'temp' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'}`}>Temp</button>
                        <button onClick={() => exportHourlyCSV(hourlyForSelected)} className="ml-3 px-3 py-1 rounded-md text-sm bg-gray-700 border border-gray-600 text-gray-100">Export CSV</button>
                      </div>
                    </div>

                    {/* Area / Line Chart for hourly AQI/Temp */}
                    <div className="w-full">{renderAreaLineChart(hourlyForSelected, metric)}</div>
                  </div>

                  <div className="mt-6 bg-gray-800 rounded-xl shadow-sm p-5">
                    <style>{`.hourly-scroll::-webkit-scrollbar { height: 8px; } .hourly-scroll::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.28); border-radius: 999px; } .hourly-scroll { scrollbar-color: rgba(148,163,184,0.28) transparent; scrollbar-width: thin; }`}</style>
                    <div className="overflow-x-auto py-3 flex gap-4 hourly-scroll">
                      {hourlyForSelected.map((hour, idx) => {
                        const roundedAqi = Math.round(hour.aqi || 0);
                        const tempText = (hour.temp === null || hour.temp === undefined) ? '-- °C' : `${Math.round(hour.temp)}°C`;
                        return (
                          <div key={idx} className="min-w-[160px] bg-neutral-900 text-gray-100 p-5 rounded-lg flex flex-col items-center text-center shadow-sm transform transition-transform hover:-translate-y-1 hover:shadow-lg">
                            <span className="text-sm text-gray-400">{hour.time}</span>
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-lg font-semibold text-white">{metric === 'aqi' ? `AQI ${roundedAqi}` : tempText}</span>
                              {metric === 'aqi' && <span className="text-xs text-gray-400">{getAQILabel(roundedAqi)}</span>}
                            </div>
                            <div className="mt-3 w-full h-2 rounded-full bg-gray-700">
                              <div className="h-2 rounded-full" style={{ width: `${(roundedAqi / 500) * 100}%`, background: '#3b82f6' }} />
                            </div>
                            <span className="text-xs text-gray-400 mt-3">{metric === 'aqi' ? tempText : `AQI ${roundedAqi}`}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Peak Pollution Warning */}
              {selectedDay === 0 && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-orange-600 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium text-orange-800">Peak Pollution Warning</p>
                      <p className="text-xs text-orange-700">
                        AQI expected to reach 330 between 12 PM - 4 PM. Avoid outdoor activities during these hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Pollutants Breakdown */}
            <div className="bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Key Pollutants</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">PM2.5</span>
                    <span className="font-medium text-gray-900">{forecastData[selectedDay].pm25} µg/m³</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 rounded-full h-2" style={{ width: `${(forecastData[selectedDay].pm25 / 250) * 100}%` }}></div>
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

              <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-blue-200">AI Forecast Note</p>
                    <p className="text-xs text-blue-200">
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
          <div className="lg:col-span-2 bg-[#1e293b] rounded-xl shadow-md p-6 border border-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Alerts</h2>
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
            <div className="bg-[#1e293b] rounded-xl shadow-md p-6 border border-white/5 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Best Time for Outdoor</h2>
              
              <div className="text-center p-4 bg-green-50 rounded-lg mb-4">
                <Sun className="mx-auto text-yellow-500 mb-2" size={32} />
                <p className="text-2xl font-bold text-green-700">6 AM - 9 AM</p>
                <p className="text-sm text-gray-600 mt-1">Lowest pollution expected</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Morning (6-9 AM)</span>
                  <span className="font-medium text-green-600">Good</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Afternoon (12-4 PM)</span>
                  <span className="font-medium text-red-600">Avoid</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-300">Evening (6-9 PM)</span>
                  <span className="font-medium text-orange-600">Moderate</span>
                </div>
              </div>
            </div>

            {/* Health Recommendations */}
            <div className="bg-[#1e293b] rounded-xl shadow-md p-6 border border-white/5 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-white mb-4">Health Advisory</h2>
              
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
              <button className="w-full bg-[#243447] text-blue-400 py-2 rounded-lg font-medium hover:bg-[#2b3b4a] transition-colors">
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