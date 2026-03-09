import React, { useState } from "react";
import {
  MapPin,
  AlertTriangle,
  Wind,
  Factory,
  Car,
  Flame,
  AlertCircle,
  Calendar,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import PolicySidebar from "../../components/Layout/PolicySidebar";
import TrendChart from "../../components/Visuals/TrendChart";
import DonutChart from "../../components/Visuals/DonutChart";
import SimpleMap from "../../components/Visuals/SimpleMap";

const PolicyOverview = () => {
  const [region, setRegion] = useState("Delhi-NCR");

  const stats = {
    avgAQI: 287,
    avgAQITrend: "+12%",
    worstStation: "Anand Vihar",
    worstAQI: 412,
    dominantSource: "Biomass Burning",
    dominantPercentage: 42,
    highRiskZones: 8,
    activeAlerts: 3,
  };

  const sourceBreakdown = [
    { name: "Stubble Burning", value: 42, color: "#fb923c", icon: Flame },
    { name: "Traffic", value: 28, color: "#60a5fa", icon: Car },
    { name: "Industry", value: 18, color: "#a78bfa", icon: Factory },
    { name: "Dust", value: 12, color: "#facc15", icon: Wind },
  ];

  const highRiskZones = [
    { name: "Anand Vihar", aqi: 412, trend: "↑" },
    { name: "Okhla", aqi: 398, trend: "↑" },
    { name: "Rohini", aqi: 356, trend: "→" },
    { name: "Dwarka", aqi: 345, trend: "↓" },
  ];

  const alerts = [
    { level: "Severe", area: "East Delhi", message: "AQI exceeds 400", time: "10 min ago" },
    { level: "Severe", area: "Noida", message: "Stubble burning impact", time: "25 min ago" },
    { level: "Alert", area: "Gurugram", message: "Traffic congestion peak", time: "1 hour ago" },
  ];

  return (
    <>
      <PolicySidebar />
      <main className="main-content">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Policy Overview</h1>
              <p className="text-sm text-gray-400 mt-1">Last updated: {new Date().toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-blue-deep border border-blue-medium px-3 py-2 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-300 mr-2" />
                <span className="text-sm text-gray-300">{region}</span>
              </div>

              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="appearance-none bg-blue-deep border border-blue-medium text-gray-300 px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none"
                >
                  <option>Delhi-NCR</option>
                  <option>Gurugram</option>
                  <option>Noida</option>
                  <option>Faridabad</option>
                  <option>Ghaziabad</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <button className="px-3 py-2 bg-blue-accent/20 text-blue-accent rounded-lg hover:bg-blue-accent/30 transition-colors flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* KPI row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <p className="text-sm text-gray-400">Current Avg. AQI ({region})</p>
              <div className="flex items-center justify-between mt-3">
                <h2 className="text-3xl font-bold">{stats.avgAQI}</h2>
                <div className="text-sm text-red-400">Very Poor</div>
              </div>
            </div>

            <div className="card">
              <p className="text-sm text-gray-400">24h Forecast</p>
              <h3 className="mt-3 text-2xl font-semibold">365 <span className="text-sm text-gray-300">Very Poor</span></h3>
            </div>

            <div className="card">
              <p className="text-sm text-gray-400">72h Forecast</p>
              <h3 className="mt-3 text-2xl font-semibold">315 <span className="text-sm text-gray-300">Very Poor</span></h3>
            </div>

            <div className="card">
              <p className="text-sm text-gray-400">Predominant Source Today</p>
              <h3 className="mt-3 text-lg font-semibold">Stubble Burning <span className="text-sm text-gray-300">(42%)</span></h3>
            </div>
          </div>

          {/* Main grid: left (charts) + right (lists) */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-3">AQI Trend Map - {region}</h3>
                <div>
                  {/* Live map component */}
                  <div className="w-full">
                    <SimpleMap />
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-3">AQI Trend Chart (7d history + 3d forecast)</h3>
                <TrendChart />
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-3">Source Contribution</h3>
                <div className="flex items-start gap-4">
                  <div style={{ width: 120 }}>
                    <DonutChart />
                  </div>
                  <div className="flex-1">
                    {sourceBreakdown.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.name} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <Icon size={16} className="text-gray-300" />
                            <span className="text-sm text-gray-200">{s.name}</span>
                          </div>
                          <span className="text-sm">{s.value}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-3">High Risk Zones</h3>
                {highRiskZones.map((z) => (
                  <div key={z.name} className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium">{z.name}</p>
                      <p className="text-sm text-gray-400">AQI {z.aqi}</p>
                    </div>
                    <span className="text-sm text-red-400">{z.trend === "↑" ? "Rising" : z.trend === "↓" ? "Falling" : "Stable"}</span>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-3">Alerts</h3>
                {alerts.map((a, i) => (
                  <div key={i} className="py-2 border-l-4 border-red-500 pl-3">
                    <p className="font-medium">{a.area}</p>
                    <p className="text-sm text-gray-400">{a.message}</p>
                    <span className="text-xs text-gray-500">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Pollution Heat Map</h2>
            <div className="h-64 bg-blue-medium/30 rounded flex items-center justify-center">
              <p className="text-gray-400">Satellite map integration (NASA MODIS / ISRO)</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

/* CARD COMPONENT */
const StatCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="bg-[#1e293b] p-6 rounded-xl flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>

      <div className={`${color}`}>{icon}</div>
    </div>
  );
};

export default PolicyOverview;
