// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Policy Maker Imports
// import Dashboard from "./pages/PolicyMaker/dashboard";
// import SourceIdentification from "./pages/PolicyMaker/sourceidentification";

// // Citizen Dashboard Imports (create these files)
// import CitizenHome from "./pages/Citizen/Home";
// import LiveAQIMap from "./pages/Citizen/LiveAQIMap";
// import AQIDashboard from "./pages/Citizen/AQIDashboard";
// import SourceAnalysis from "./pages/Citizen/SourceAnalysis";
// import ForecastAlerts from "./pages/Citizen/ForecastAlerts";
// import HealthAdvisory from "./pages/Citizen/HealthAdvisory";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Citizen Routes - Main user facing pages */}
//         <Route path="/" element={<CitizenHome />} />
//         <Route path="/live-map" element={<LiveAQIMap />} />
//         <Route path="/aqi-dashboard" element={<AQIDashboard />} />
//         <Route path="/source-analysis" element={<SourceAnalysis />} />
//         <Route path="/forecast-alerts" element={<ForecastAlerts />} />
//         <Route path="/health-advisory" element={<HealthAdvisory />} />

//         {/* Policy Maker Routes - Admin/Government facing pages */}
//         <Route path="/policy/dashboard" element={<Dashboard />} />
//         <Route path="/policy/source-identification" element={<SourceIdentification />} />
//         {/* Add more policy routes as needed */}
//         <Route path="/policy/interventions" element={<div>Interventions Page</div>} />
//         <Route path="/policy/reports" element={<div>Reports Page</div>} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// // Policy Maker Imports
// import PolicyOverview from "./pages/PolicyMaker/PolicyOverview";
// import SourceIdentification from "./pages/PolicyMaker/sourceidentification";
// import ForecastTrends from "./pages/PolicyMaker/forecasttrends";
// import PolicyRecommendations from "./pages/PolicyMaker/PolicyRecommendations";

// // Citizen Dashboard Imports
// import CitizenHome from "./pages/Citizen/Home";
// import LiveAQIMap from "./pages/Citizen/LiveAQIMap";
// import AQIDashboard from "./pages/Citizen/AQIDashboard";
// import SourceAnalysis from "./pages/Citizen/SourceAnalysis";
// import ForecastAlerts from "./pages/Citizen/ForecastAlerts";
// import HealthAdvisory from "./pages/Citizen/HealthAdvisory";
// import Home from "./pages/Home/HomePage"; 

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Default Route */}
//         <Route path="/" element={<PolicyOverview />} />
        
//         {/* Policy Maker Routes - Admin/Government facing pages */}
//         <Route path="/policy" element={<PolicyOverview />} />
//         <Route path="/policy/overview" element={<PolicyOverview />} />
//         <Route path="/policy/source-identification" element={<SourceIdentification />} />
//         <Route path="/policy/forecast" element={<ForecastTrends />} />
//         <Route path="/policy/recommendations" element={<PolicyRecommendations />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Policy Maker Imports
import PolicyOverview from "./pages/PolicyMaker/PolicyOverview";
import SourceIdentification from "./pages/PolicyMaker/sourceidentification";
import ForecastTrends from "./pages/PolicyMaker/forecasttrends";
import PolicyRecommendations from "./pages/PolicyMaker/PolicyRecommendations";

// Citizen Dashboard Imports
import CitizenHome from "./pages/Citizen/Home";
import LiveAQIMap from "./pages/Citizen/LiveAQIMap";
import AQIDashboard from "./pages/Citizen/AQIDashboard";
import SourceAnalysis from "./pages/Citizen/SourceAnalysis";
import ForecastAlerts from "./pages/Citizen/ForecastAlerts";
import HealthAdvisory from "./pages/Citizen/HealthAdvisory";

// Homepage
import Home from "./pages/Home/HomePage";
import Login from "./pages/Home/Login";
import Signup from "./pages/Home/Sign";
import RoutePlanner from "./pages/PolicyMaker/routeplanner";

function App() {
  return (
    <Router>
      <Routes>

        {/* ✅ Homepage */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Citizen Routes */}
        <Route path="/citizen" element={<CitizenHome />} />
        <Route path="/live-map" element={<LiveAQIMap />} />
        <Route path="/aqi-dashboard" element={<AQIDashboard />} />
        <Route path="/source-analysis" element={<SourceAnalysis />} />
        <Route path="/forecast-alerts" element={<ForecastAlerts />} />
        <Route path="/health-advisory" element={<HealthAdvisory />} />

        {/* Policy Maker Routes */}
        <Route path="/policy" element={<PolicyOverview />} />
        <Route path="/policy/overview" element={<PolicyOverview />} />
        <Route path="/policy/source-identification" element={<SourceIdentification />} />
        <Route path="/policy/forecast" element={<ForecastTrends />} />
        <Route path="/policy/recommendations" element={<PolicyRecommendations />} />
        <Route path="/policy/route-planner" element={<RoutePlanner />} /> {/* Placeholder for Route Planner */}

      </Routes>
    </Router>
  );
}

export default App;