// pages/Citizen/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, AlertTriangle, Activity, Leaf, ArrowRight } from 'lucide-react';

const CitizenHome = () => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      <main className="p-6 w-full">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wind className="text-[#3B82F6]" size={28} />
              <h1 className="text-xl font-bold text-white">Delhi-NCR Air Quality</h1>
            </div>
            <div className="text-sm text-gray-400">Citizen Dashboard</div>
          </div>
        </div>

        {/* Hero Section with Current AQI */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#1e3a8a] text-white rounded-xl p-6 mb-6">
          <div className="text-center">
            <p className="text-lg mb-2">Current AQI in Anand Vihar</p>
            <div className="text-7xl font-bold mb-2">312</div>
            <p className="text-xl mb-4">Very Unhealthy</p>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Sensitive groups should avoid outdoor activities. Wear mask if going out.
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/aqi-dashboard" className="bg-[#111827] rounded-xl hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-[#071526] rounded-lg flex items-center justify-center mb-4">
              <Wind className="text-[#3B82F6]" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">AQI Dashboard</h2>
            <p className="text-sm text-gray-400 mb-4">Real-time air quality data, pollutants, and trends</p>
            <div className="flex items-center text-[#3B82F6] text-sm font-medium">
              Check AQI <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          <Link to="/source-analysis" className="bg-[#111827] rounded-xl hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-[#071526] rounded-lg flex items-center justify-center mb-4">
              <Activity className="text-[#f59e0b]" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Source Analysis</h2>
            <p className="text-sm text-gray-400 mb-4">Understand what's causing pollution: stubble, traffic, etc.</p>
            <div className="flex items-center text-[#f59e0b] text-sm font-medium">
              View Sources <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          <Link to="/forecast-alerts" className="bg-[#111827] rounded-xl hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-[#071526] rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="text-[#ef4444]" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Forecast & Alerts</h2>
            <p className="text-sm text-gray-400 mb-4">24-72 hour predictions and health alerts</p>
            <div className="flex items-center text-[#ef4444] text-sm font-medium">
              See Forecast <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          <Link to="/health-advisory" className="bg-[#111827] rounded-xl hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-[#071526] rounded-lg flex items-center justify-center mb-4">
              <Leaf className="text-[#10B981]" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">Health Advisory</h2>
            <p className="text-sm text-gray-400 mb-4">Personalized health tips and safe route suggestions</p>
            <div className="flex items-center text-[#10B981] text-sm font-medium">
              Get Advice <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default CitizenHome;










