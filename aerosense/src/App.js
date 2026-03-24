import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutWrapper from "./components/Layout/Layout";

// 🔹 Homepage + Auth
import Home from "./pages/Home/HomePage";
import Login from "./pages/Home/Login";
import Signup from "./pages/Home/Sign";

// 🔹 Citizen Dashboard
import CitizenHome from "./pages/Citizen/Home";
import LiveAQIMap from "./pages/Citizen/LiveAQIMap";
import AQIDashboard from "./pages/Citizen/AQIDashboard";
import SourceAnalysis from "./pages/Citizen/SourceAnalysis";
import ForecastAlerts from "./pages/Citizen/ForecastAlerts";
import HealthAdvisory from "./pages/Citizen/HealthAdvisory";

// 🔹 Policy Maker Dashboard
import PolicyOverview from "./pages/PolicyMaker/PolicyOverview";
import SourceIdentification from "./pages/PolicyMaker/sourceidentification";
import ForecastTrends from "./pages/PolicyMaker/forecasttrends";
import PolicyRecommendations from "./pages/PolicyMaker/PolicyRecommendations";
import RoutePlanner from "./pages/PolicyMaker/routeplanner";

function App() {
  return (
    <Router>
      <Routes>

        {/* ===================== */}
        {/* 🌐 PUBLIC ROUTES */}
        {/* ===================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ===================== */}
        {/* 👤 CITIZEN DASHBOARD */}
        {/* ===================== */}
        <Route path='citizen' element={<LayoutWrapper />}>
          <Route index element={<CitizenHome />} />
          <Route path="/citizen/live-map" element={<LiveAQIMap />} />
            <Route path="/citizen/aqi-dashboard" element={<AQIDashboard />} />
            <Route path="/citizen/source-analysis" element={<SourceAnalysis />} />
            <Route path="/citizen/forecast-alerts" element={<ForecastAlerts />} />
            <Route path="/citizen/health-advisory" element={<HealthAdvisory />} /> 
        </Route>

        {/* ===================== */}
        {/* 🏛 POLICY MAKER DASHBOARD */}
        {/* ===================== */}
        <Route path="/policy" element={<LayoutWrapper />}>
          <Route index element={<PolicyOverview />} />
          <Route path="overview" element={<PolicyOverview />} />
          <Route path="source-identification" element={<SourceIdentification />} />
          <Route path="forecast" element={<ForecastTrends />} />
          <Route path="recommendations" element={<PolicyRecommendations />} />

        </Route>

        {/* ===================== */}
        {/* ❌ FALLBACK ROUTE */}
        {/* ===================== */}
        <Route path="*" element={<Home />} />

      </Routes>
    </Router>
  );
}

export default App;