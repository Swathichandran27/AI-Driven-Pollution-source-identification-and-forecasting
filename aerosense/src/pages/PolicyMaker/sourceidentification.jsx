import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Flame,
  Car,
  Factory,
  Wind,
  Info,
  Download,
  ChevronDown,
  PieChart,
  BarChart3,
  TrendingUp
} from "lucide-react";
import axios from "axios";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";
import PolicySidebar from "../../components/Layout/PolicySidebar";

const SourceIdentification = () => {
  const [selectedDate, setSelectedDate] = useState("2024-11-15");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sourceData, setSourceData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [activeView, setActiveView] = useState("bars");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/policy/stations")
      .then((res) => {
        setLocations(res.data);
        if (res.data.length > 0) setSelectedLocation(res.data[0]);
      })
      .catch((err) => console.error("Failed to fetch stations:", err));
  }, []);

  useEffect(() => {
    const fetchSourceData = async () => {
      if (!selectedLocation) return;
      setIsLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/policy/source-identification",
          { params: { location: selectedLocation, date: selectedDate } }
        );
        const data = response.data;
        if (!data || !data.contributions) return;

        const total = Object.values(data.contributions).reduce((a, b) => a + b, 0);
        const chartData = [
          { name: "Traffic",  value: data.contributions.traffic  || 0, color: "#3B82F6" },
          { name: "Industry", value: data.contributions.industry || 0, color: "#8B5CF6" },
          { name: "Dust",     value: data.contributions.dust     || 0, color: "#EAB308" },
          { name: "Biomass",  value: data.contributions.biomass  || 0, color: "#F97316" }
        ];

        setSourceData({
          dominant: data.dominant_source,
          total,
          contributions: [
            { name: "Traffic",        value: data.contributions.traffic,  icon: Car,     color: "#3B82F6", source: "Vehicular emissions"  },
            { name: "Industry",       value: data.contributions.industry, icon: Factory, color: "#8B5CF6", source: "Industrial emissions"  },
            { name: "Dust",           value: data.contributions.dust,     icon: Wind,    color: "#EAB308", source: "Construction dust"     },
            { name: "Biomass Burning",value: data.contributions.biomass,  icon: Flame,   color: "#F97316", source: "Crop burning"          }
          ],
          aiExplanation: data.ai_explanation,
          chartData
        });
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSourceData();
  }, [selectedLocation, selectedDate]);

  const renderChart = () => {
    if (!sourceData?.chartData || isLoading) return null;
    return (
      <ResponsiveContainer width="100%" height={300}>
        {activeView === "pie" ? (
          <RePieChart>
            <Pie data={sourceData.chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name">
              {sourceData.chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 12, color: "#fff" }} />
            <Legend wrapperStyle={{ color: "#94a3b8" }} />
          </RePieChart>
        ) : (
          <BarChart data={sourceData.chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.07)" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={13} />
            <YAxis stroke="#64748b" fontSize={12} />
            <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 12, color: "#fff" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {sourceData.chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "linear-gradient(135deg, #030712 0%, #0f172a 60%, #1e293b 100%)" }}>
      <PolicySidebar />

      <main style={{ marginLeft: 10, flex: 1, overflowY: "auto", padding: "2rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>

          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, background: "linear-gradient(to right, #fff, #93c5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "0.4rem" }}>
                Source Identification
              </h1>
              <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>AI-powered pollution source analysis</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              {/* DATE */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(15,23,42,0.9)", border: "1px solid #1e3a5f", borderRadius: 14, padding: "0.6rem 1rem" }}>
                <Calendar size={16} color="#64748b" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ background: "transparent", border: "none", outline: "none", color: "#e2e8f0", fontSize: "0.9rem", fontWeight: 600 }}
                />
              </div>

              {/* LOCATION */}
              <div style={{ position: "relative" }}>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  style={{
                    appearance: "none",
                    background: "rgba(15,23,42,0.95)",
                    border: "1px solid #1e3a5f",
                    borderRadius: 14,
                    color: "#e2e8f0",
                    padding: "0.6rem 2.5rem 0.6rem 1rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    outline: "none",
                    cursor: "pointer",
                    minWidth: 220
                  }}
                >
                  <option value="" disabled style={{ background: "#0f172a", color: "#94a3b8" }}>Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc} style={{ background: "#0f172a", color: "#e2e8f0" }}>{loc}</option>
                  ))}
                </select>
                <ChevronDown size={16} color="#64748b" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
              </div>

              <button style={{ padding: "0.6rem 0.9rem", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.4)", borderRadius: 14, color: "#60a5fa", cursor: "pointer" }}>
                <Download size={18} />
              </button>
            </div>
          </div>

          {/* LOCATION BAR */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", background: "rgba(15,23,42,0.6)", border: "1px solid #1e3a5f", borderRadius: 14, padding: "0.75rem 1.25rem", marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1" }}>
              <MapPin size={16} color="#3b82f6" />
              <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{selectedLocation || "Loading..."}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#cbd5e1" }}>
              <Calendar size={16} color="#3b82f6" />
              <span style={{ fontSize: "0.9rem" }}>{selectedDate}</span>
            </div>
            {sourceData && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#60a5fa", fontWeight: 700, fontSize: "0.9rem" }}>
                <TrendingUp size={15} />
                <span>{sourceData.total?.toFixed(1)}% sources identified</span>
              </div>
            )}
          </div>

          {/* LOADING */}
          {isLoading && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
              <div style={{ width: 48, height: 48, border: "3px solid transparent", borderTop: "3px solid #3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            </div>
          )}

          {/* MAIN GRID */}
          {!isLoading && sourceData && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

              {/* LEFT — Chart */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* TABS */}
                <div style={{ display: "flex", gap: "0.5rem", background: "rgba(15,23,42,0.8)", border: "1px solid #1e3a5f", borderRadius: 14, padding: "0.4rem" }}>
                  {[{ key: "bars", icon: BarChart3, label: "Bar Chart" }, { key: "pie", icon: PieChart, label: "Pie Chart" }].map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveView(key)}
                      style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                        padding: "0.55rem 1rem", borderRadius: 10, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.2s",
                        background: activeView === key ? "linear-gradient(to right, #3b82f6, #2563eb)" : "transparent",
                        color: activeView === key ? "#fff" : "#64748b"
                      }}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* CHART CARD */}
                <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid #1e3a5f", borderRadius: 20, padding: "1.5rem", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h2 style={{ color: "#f1f5f9", fontWeight: 800, fontSize: "1.1rem" }}>Source Breakdown</h2>
                    <span style={{ color: "#64748b", fontSize: "0.8rem" }}>{sourceData.total?.toFixed(1)}% total</span>
                  </div>
                  {renderChart()}
                </div>

                {/* AI INSIGHTS */}
                <div style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 20, padding: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
                    <Info size={18} color="#3b82f6" />
                    <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.95rem" }}>AI Analysis</h3>
                  </div>
                  <p style={{ color: "#cbd5e1", fontSize: "0.875rem", lineHeight: 1.7 }}>{sourceData.aiExplanation}</p>
                </div>
              </div>

              {/* RIGHT — Stats */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* DOMINANT SOURCE */}
                <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 20, padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ background: "rgba(249,115,22,0.2)", borderRadius: 14, padding: "0.9rem", flexShrink: 0 }}>
                    <Flame size={28} color="#fb923c" />
                  </div>
                  <div>
                    <p style={{ color: "#fb923c", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>Dominant Source</p>
                    <p style={{ color: "#fff", fontSize: "1.75rem", fontWeight: 900, textTransform: "capitalize" }}>{sourceData.dominant}</p>
                  </div>
                </div>

                {/* CONTRIBUTION LIST */}
                <div style={{ background: "rgba(15,23,42,0.9)", border: "1px solid #1e3a5f", borderRadius: 20, padding: "1.25rem", flex: 1 }}>
                  <h3 style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.95rem", marginBottom: "1rem" }}>Contribution Summary</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {sourceData.contributions.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "0.75rem 1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            <div style={{ background: `${s.color}22`, border: `1px solid ${s.color}55`, borderRadius: 10, padding: "0.5rem" }}>
                              <Icon size={18} color={s.color} />
                            </div>
                            <div>
                              <p style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</p>
                              <p style={{ color: "#64748b", fontSize: "0.75rem" }}>{s.source}</p>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ color: s.color, fontWeight: 800, fontSize: "1.2rem" }}>{s.value?.toFixed(1)}%</p>
                            <div style={{ width: 80, height: 4, background: "#1e293b", borderRadius: 4, marginTop: 4 }}>
                              <div style={{ width: `${Math.min(s.value, 100)}%`, height: "100%", background: s.color, borderRadius: 4 }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
      `}</style>
    </div>
  );
};

export default SourceIdentification;
