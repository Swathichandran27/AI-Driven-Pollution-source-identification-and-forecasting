import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-6">Policy Panel</h2>

        <nav className="space-y-4">
          <Link to="/policy/dashboard" className="block hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/policy/source-identification" className="block hover:text-gray-300">
            Source Identification
          </Link>
          <Link to="/policy/forecast-trends" className="block hover:text-gray-300">
            Forecast Trends
          </Link>
          <Link to="/policy/policy-recommendation" className="block hover:text-gray-300">
            Policy Recommendation
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">

        {/* Navbar */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700">
            Policy Maker Dashboard
          </h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Logout
          </button>
        </header>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h3 className="text-gray-500">Average AQI</h3>
            <p className="text-3xl font-bold text-blue-700">210</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h3 className="text-gray-500">Pollution Sources</h3>
            <p className="text-3xl font-bold text-green-600">12</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h3 className="text-gray-500">Active Alerts</h3>
            <p className="text-3xl font-bold text-red-600">5</p>
          </div>

          <div className="bg-white shadow-lg p-6 rounded-xl">
            <h3 className="text-gray-500">Policies Implemented</h3>
            <p className="text-3xl font-bold text-purple-600">8</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Pollution Trend Overview
          </h2>
          <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
            Chart Placeholder (Add Chart.js/Recharts later)
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Recent Pollution Alerts
          </h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Area</th>
                <th>Severity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="py-2">Industrial Zone</td>
                <td className="text-red-600 font-semibold">High</td>
                <td>Today</td>
                <td>Action Taken</td>
              </tr>

              <tr className="border-b">
                <td className="py-2">City Center</td>
                <td className="text-yellow-600 font-semibold">Moderate</td>
                <td>Yesterday</td>
                <td>Monitoring</td>
              </tr>

              <tr>
                <td className="py-2">Suburban Area</td>
                <td className="text-green-600 font-semibold">Low</td>
                <td>2 Days Ago</td>
                <td>Stable</td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
};

export default Dashboard;
