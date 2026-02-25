

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Policy Maker Imports
import Dashboard from "./pages/PolicyMaker/dashboard";
import SourceIdentification from "./pages/PolicyMaker/sourceidentification";

// Citizen Dashboard Imports (create these files)
import CitizenHome from "./pages/Citizen/Home";
import LiveAQIMap from "./pages/Citizen/LiveAQIMap";
import AQIDashboard from "./pages/Citizen/AQIDashboard";
import SourceAnalysis from "./pages/Citizen/SourceAnalysis";
import ForecastAlerts from "./pages/Citizen/ForecastAlerts";
import HealthAdvisory from "./pages/Citizen/HealthAdvisory";

function App() {
  return (
    <Router>
      <Routes>
        {/* Citizen Routes - Main user facing pages */}
        <Route path="/" element={<CitizenHome />} />
        <Route path="/live-map" element={<LiveAQIMap />} />
        <Route path="/aqi-dashboard" element={<AQIDashboard />} />
        <Route path="/source-analysis" element={<SourceAnalysis />} />
        <Route path="/forecast-alerts" element={<ForecastAlerts />} />
        <Route path="/health-advisory" element={<HealthAdvisory />} />

        {/* Policy Maker Routes - Admin/Government facing pages */}
        <Route path="/policy/dashboard" element={<Dashboard />} />
        <Route path="/policy/source-identification" element={<SourceIdentification />} />
        {/* Add more policy routes as needed */}
        <Route path="/policy/interventions" element={<div>Interventions Page</div>} />
        <Route path="/policy/reports" element={<div>Reports Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;