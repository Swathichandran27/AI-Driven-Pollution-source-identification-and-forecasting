// pages/Citizen/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, AlertTriangle, Activity, Leaf, ArrowRight } from 'lucide-react';

const CitizenHome = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Wind className="text-blue-600" size={28} />
              <h1 className="text-xl font-bold text-gray-900">Delhi-NCR Air Quality</h1>
            </div>
            <div className="text-sm text-gray-500">Citizen Dashboard</div>
          </div>
        </div>
      </div>

      {/* Hero Section with Current AQI */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-lg mb-2">Current AQI in Anand Vihar</p>
            <div className="text-7xl font-bold mb-2">312</div>
            <p className="text-xl mb-4">Very Unhealthy</p>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Sensitive groups should avoid outdoor activities. Wear mask if going out.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AQI Dashboard Card */}
          <Link to="/aqi-dashboard" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Wind className="text-blue-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">AQI Dashboard</h2>
            <p className="text-sm text-gray-500 mb-4">Real-time air quality data, pollutants, and trends</p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              Check AQI <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* Source Analysis Card */}
          <Link to="/source-analysis" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Activity className="text-orange-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Source Analysis</h2>
            <p className="text-sm text-gray-500 mb-4">Understand what's causing pollution: stubble, traffic, etc.</p>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              View Sources <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* Forecast & Alerts Card */}
          <Link to="/forecast-alerts" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Forecast & Alerts</h2>
            <p className="text-sm text-gray-500 mb-4">24-72 hour predictions and health alerts</p>
            <div className="flex items-center text-red-600 text-sm font-medium">
              See Forecast <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>

          {/* Health Advisory Card */}
          <Link to="/health-advisory" className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Leaf className="text-green-600" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Health Advisory</h2>
            <p className="text-sm text-gray-500 mb-4">Personalized health tips and safe route suggestions</p>
            <div className="flex items-center text-green-600 text-sm font-medium">
              Get Advice <ArrowRight size={16} className="ml-1" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CitizenHome;










