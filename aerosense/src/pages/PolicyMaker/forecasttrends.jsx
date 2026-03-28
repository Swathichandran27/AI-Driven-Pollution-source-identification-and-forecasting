import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TrendingUp, TrendingDown, AlertTriangle,
  MapPin, ChevronDown, RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ReferenceLine
} from 'recharts';
import PolicySidebar from '../../components/Layout/PolicySidebar';

// Reusing your Overview Dashboard Constants for UI consistency
const aqiInfo = (v) => {
  if (v <= 50) return { label: "Good", color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)" };
  if (v <= 100) return { label: "Satisfactory", color: "#84cc16", bg: "rgba(132, 204, 22, 0.1)" };
  if (v <= 200) return { label: "Moderate", color: "#eab308", bg: "rgba(234, 179, 8, 0.1)" };
  if (v <= 300) return { label: "Poor", color: "#f97316", bg: "rgba(249, 115, 22, 0.1)" };
  if (v <= 400) return { label: "Very Poor", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
  return { label: "Severe", color: "#dc2626", bg: "rgba(220, 38, 38, 0.1)" };
};

const cardStyle = {
  background: "rgba(15, 23, 42, 0.6)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(59, 130, 246, 0.2)",
  borderRadius: "16px",
  padding: "1.25rem",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const aqi = payload[0].value;
    const info = aqiInfo(aqi);
    return (
      <div style={{ background: "#0f172a", border: "1px solid #334155", padding: "10px", borderRadius: "8px" }}>
        <p style={{ color: "#94a3b8", fontSize: "0.7rem", margin: 0 }}>{label}</p>
        <p style={{ color: "#fff", fontWeight: 800, fontSize: "1rem", margin: "4px 0" }}>AQI {aqi}</p>
        <p style={{ color: info.color, fontSize: "0.7rem", fontWeight: 700, margin: 0 }}>{info.label.toUpperCase()}</p>
      </div>
    );
  }
  return null;
};

const AQIMeter = ({ aqi, label }) => {
  const info = aqiInfo(aqi);
  const pct = Math.min((aqi / 500) * 100, 100);
  return (
    <div style={{ position: "relative", width: "140px", height: "140px", margin: "0 auto" }}>
      <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={info.color} strokeWidth="8" 
          strokeDasharray={`${pct * 2.51} 251`} strokeLinecap="round" style={{ transition: 'all 1s ease' }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff" }}>{aqi?.toFixed(0)}</span>
        <span style={{ fontSize: "0.65rem", fontWeight: 700, color: info.color, textTransform: "uppercase" }}>{info.label}</span>
      </div>
    </div>
  );
};

const ForecastTrends = () => {
  const [forecastData, setForecastData] = useState([]);
  const [peak, setPeak] = useState(null);
  const [trend, setTrend] = useState('stable');
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);

  useEffect(() => { fetchStations(); }, []);
  useEffect(() => { if (selectedStation) fetchForecast(selectedStation); }, [selectedStation]);

  const fetchStations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/policy/stations');
      setStations(res.data);
      if (res.data.length > 0) setSelectedStation(res.data[0]);
    } catch { setError('Failed to load stations'); }
  };

  const fetchForecast = async (station) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/policy/forecast?location=${encodeURIComponent(station)}`);
      setForecastData(res.data.forecast || []);
      setPeak(res.data.expected_peak || null);
      setTrend(res.data.trend || 'stable');
    } catch { setError('Failed to load forecast data'); }
    finally { setLoading(false); }
  };

  const avgAqi = forecastData.length ? forecastData.reduce((s, d) => s + d.aqi, 0) / forecastData.length : 0;
  const maxAqi = forecastData.length ? Math.max(...forecastData.map(d => d.aqi)) : 0;
  const currentAqi = forecastData[0]?.aqi || 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#020617", color: "#f1f5f9" }}>
      <PolicySidebar />

      <main style={{ flex: 1, marginLeft: 256, padding: "2rem", maxWidth: "calc(100vw - 256px)", overflowX: "hidden" }}>
        <div style={{ maxWidth: "1300px", margin: "0 auto" }}>
          
          {/* HEADER */}
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>Forecast & Trends</h1>
              <p style={{ color: "#64748b", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={14} /> {selectedStation || 'Loading Station...'}
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "1rem" }}>
               <div style={{ position: "relative" }}>
                <select
                  value={selectedStation}
                  onChange={(e) => setSelectedStation(e.target.value)}
                  style={{ 
                    appearance: "none", background: "#1e293b", border: "1px solid #334155", 
                    padding: "0.6rem 2.5rem 0.6rem 1rem", borderRadius: "8px", color: "#fff", 
                    fontSize: "0.85rem", cursor: "pointer", outline: "none" 
                  }}
                >
                  {stations.map((s, i) => <option key={i} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: 12, top: 12, color: "#64748b", pointerEvents: "none" }} />
              </div>
              <button onClick={() => fetchForecast(selectedStation)} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px", padding: "0 1rem", color: "#cbd5e1" }}>
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </header>

          {loading ? (
             <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div className="loader"></div></div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.25rem" }}>
              
              {/* TOP ROW: KPIs */}
              <div style={{ gridColumn: "span 4", ...cardStyle }}>
                <p style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem" }}>Current Reading</p>
                <AQIMeter aqi={currentAqi} />
                <div style={{ textAlign: "center", marginTop: "1rem", color: aqiInfo(currentAqi).color, fontWeight: 700, fontSize: "0.8rem" }}>LIVE FEED</div>
              </div>

              <div style={{ gridColumn: "span 4", ...cardStyle }}>
                <p style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1rem" }}>Expected Peak</p>
                <AQIMeter aqi={peak?.aqi || 0} />
                <div style={{ textAlign: "center", marginTop: "1rem", color: "#64748b", fontSize: "0.75rem" }}>{peak?.date?.split(' ')[1] || 'TBD'} Today</div>
              </div>

              <div style={{ gridColumn: "span 4", ...cardStyle }}>
                <p style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", marginBottom: "1.5rem" }}>Trend Analysis</p>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                      <div style={{ background: trend === 'increasing' ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)", padding: "12px", borderRadius: "12px" }}>
                        {trend === 'increasing' ? <TrendingUp color="#ef4444" /> : <TrendingDown color="#22c55e" />}
                      </div>
                      <div>
                        <p style={{ fontSize: "1.25rem", fontWeight: 900, margin: 0, color: trend === 'increasing' ? "#ef4444" : "#22c55e" }}>
                          {trend === 'increasing' ? 'Rising' : 'Improving'}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>24h projected movement</p>
                      </div>
                   </div>
                   <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <p style={{ color: "#64748b", fontSize: "0.7rem", margin: 0 }}>AVERAGE</p>
                        <p style={{ fontWeight: 800, margin: 0 }}>{avgAqi.toFixed(1)}</p>
                      </div>
                      <div>
                        <p style={{ color: "#64748b", fontSize: "0.7rem", margin: 0 }}>MAX PEAK</p>
                        <p style={{ fontWeight: 800, color: "#ef4444", margin: 0 }}>{maxAqi.toFixed(1)}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* SCALE REFERENCE BAR */}
              <div style={{ gridColumn: "span 12", ...cardStyle, padding: "1rem" }}>
                <div style={{ display: "flex", height: "8px", borderRadius: "4px", overflow: "hidden", marginBottom: "8px" }}>
                  {["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444", "#dc2626"].map((c, i) => (
                    <div key={i} style={{ flex: 1, background: c }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "0.65rem", fontWeight: 600 }}>
                  <span>GOOD</span><span>SATISFACTORY</span><span>MODERATE</span><span>POOR</span><span>VERY POOR</span><span>SEVERE</span>
                </div>
              </div>

              {/* MAIN CHART */}
              <div style={{ gridColumn: "span 12", ...cardStyle, height: "400px" }}>
                <h3 style={{ fontSize: "0.9rem", marginBottom: "1.5rem", color: "#94a3b8" }}>24-Hour AQI Forecast Projection</h3>
                <div style={{ flex: 1 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={forecastData.map((d, i) => ({ ...d, hour: `H${i+1}` }))}>
                      <defs>
                        <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="hour" stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
                      <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine y={200} stroke="#ef4444" strokeDasharray="3 3" />
                      <Area type="monotone" dataKey="aqi" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* ALERT BOX */}
              {maxAqi > 200 && (
                <div style={{ gridColumn: "span 12", background: "rgba(220, 38, 38, 0.1)", border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "12px", padding: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                  <AlertTriangle color="#ef4444" size={24} />
                  <div>
                    <p style={{ color: "#ef4444", fontWeight: 800, margin: 0, fontSize: "0.9rem" }}>Health Advisory Alert</p>
                    <p style={{ color: "#94a3b8", fontSize: "0.8rem", margin: 0 }}>AQI predicted to exceed 200. Sensitive groups should avoid outdoor activity.</p>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </main>
      
      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .loader { width: 30px; height: 30px; border: 3px solid #1e293b; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};

export default ForecastTrends;