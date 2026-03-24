import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  MapPin, Factory, Wind, Car, Flame, AlertCircle, 
  RefreshCw, TrendingUp 
} from "lucide-react";
import PolicySidebar from "../../components/Layout/PolicySidebar";
import TrendChart from "../../components/Visuals/TrendChart";
import DonutChart from "../../components/Visuals/DonutChart";
import SimpleMap from "../../components/Visuals/SimpleMap";

const ICON_MAP = { Traffic: Car, Industry: Factory, Dust: Wind, Biomass: Flame };
const COLOR_MAP = { Traffic: "#3b82f6", Industry: "#8b5cf6", Dust: "#eab308", Biomass: "#f97316" };

const aqiInfo = (v) => {
  if (v <= 50) return { label: "Good", color: "#22c55e" };
  if (v <= 100) return { label: "Satisfactory", color: "#84cc16" };
  if (v <= 200) return { label: "Moderate", color: "#eab308" };
  if (v <= 300) return { label: "Poor", color: "#f97316" };
  if (v <= 400) return { label: "Very Poor", color: "#ef4444" };
  return { label: "Severe", color: "#dc2626" };
};

// Common glassmorphism style
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

const StatCard = ({ label, value, sub, color }) => (
  <div style={cardStyle}>
    <p style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{label}</p>
    <p style={{ color: color || "#f1f5f9", fontSize: "1.8rem", fontWeight: 900, lineHeight: 1 }}>{value ?? "—"}</p>
    {sub && <p style={{ color: "#64748b", fontSize: "0.75rem", marginTop: "0.25rem" }}>{sub}</p>}
  </div>
);

const PolicyOverview = () => {
  const [region] = useState("Delhi-NCR");
  const [stats, setStats] = useState(null);
  const [sources, setSources] = useState([]);
  const [highRiskZones, setHighRisk] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/policy/overview/dashboard", { params: { region } });
      setStats(data.stats);
      setSources(data.sources || []);
      setHighRisk(data.high_risk_zones || []);
      setTrend(Array.isArray(data.trend) ? data.trend : []);
    } catch (e) {
      console.error("Dashboard API Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [region]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#020617", color: "#f1f5f9", fontFamily: "Inter, sans-serif" }}>
      <PolicySidebar />

      <main style={{ 
        flex: 1, 
        marginLeft: 10, 
        padding: "2rem", 
        maxWidth: "calc(100vw - 256px)",
        overflowX: "hidden" 
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          
          {/* ── HEADER ── */}
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0, background: "linear-gradient(to right, #fff, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Policy Dashboard
              </h1>
              <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "4px" }}>{region} • Global Monitoring Station</p>
            </div>
            <button onClick={fetchData} style={{ 
              display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 1.25rem", 
              background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "10px", 
              color: "#60a5fa", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "0.2s"
            }}>
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
            </button>
          </header>

          {loading ? (
            <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="loader"></div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1.5rem" }}>
              
              {/* ── TOP ROW: KPI CARDS ── */}
              <div style={{ gridColumn: "span 4" }}><StatCard label="Average AQI" value={stats?.avgAQI} sub={aqiInfo(stats?.avgAQI).label} color={aqiInfo(stats?.avgAQI).color} /></div>
              <div style={{ gridColumn: "span 4" }}><StatCard label="24h Forecast" value={stats?.forecast24} sub="Projected Trend" color={aqiInfo(stats?.forecast24).color} /></div>
              <div style={{ gridColumn: "span 4" }}><StatCard label="Primary Source" value={stats?.dominantSource} sub={`${stats?.dominantPercentage}% Total Impact`} color="#3b82f6" /></div>

              {/* ── MIDDLE ROW: MAP & TREND ── */}
              <div style={{ gridColumn: "span 7", ...cardStyle, height: "420px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f1f5f9" }}>Station Concentration Map</h3>
                  <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{region} Sector</span>
                </div>
                <div style={{ flex: 1, borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <SimpleMap stations={highRiskZones} />
                </div>
              </div>

              <div style={{ gridColumn: "span 5", ...cardStyle, height: "420px" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "1rem", color: "#f1f5f9" }}>Hourly Trend Analytics</h3>
                <div style={{ flex: 1 }}>
                  <TrendChart data={trend} />
                </div>
              </div>

              {/* ── BOTTOM ROW: SOURCES & RISK (SYMMETRICAL) ── */}
              <div style={{ gridColumn: "span 5", ...cardStyle }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "1.5rem", color: "#f1f5f9" }}>Source Contribution</h3>
                <div style={{ height: "240px" }}>
                  <DonutChart data={sources} />
                </div>
                <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {sources.map(s => {
                    const Icon = ICON_MAP[s.name] || AlertCircle;
                    return (
                      <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.8rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <Icon size={14} color={COLOR_MAP[s.name]} />
                          <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>{s.name}</span>
                        </div>
                        <span style={{ fontWeight: 700, color: COLOR_MAP[s.name], fontSize: "0.85rem" }}>{s.value}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ gridColumn: "span 7", ...cardStyle }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#f1f5f9" }}>High Risk Zones (Top 5)</h3>
                  <TrendingUp size={16} color="#ef4444" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {highRiskZones.slice(0, 5).map((z, i) => (
                    <div key={i} style={{ 
                      padding: "1rem", 
                      background: "rgba(239, 68, 68, 0.05)", 
                      border: "1px solid rgba(239, 68, 68, 0.1)", 
                      borderRadius: "12px", 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(15, 23, 42, 0.5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: "0.9rem", color: "#f1f5f9", fontWeight: 500 }}>{z.name.split(',')[0]}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: aqiInfo(z.aqi).color }}>{z.aqi}</p>
                        <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase" }}>{aqiInfo(z.aqi).label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </main>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .loader { width: 40px; height: 40px; border: 3px solid rgba(59, 130, 246, 0.1); border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }
        
        /* Fixed Map Scaling */
        .leaflet-container { width: 100% !important; height: 100% !important; z-index: 1; background: #0f172a !important; }
        
        /* Scrollbar Styling */
        main::-webkit-scrollbar { width: 6px; }
        main::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default PolicyOverview;