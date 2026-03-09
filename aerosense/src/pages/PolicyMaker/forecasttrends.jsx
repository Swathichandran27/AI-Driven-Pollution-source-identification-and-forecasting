import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import PolicySidebar from '../../components/Layout/PolicySidebar';

const ForecastTrends = () => {
  const forecast = [
    { day: 'Today', aqi: 287, condition: 'Poor', trend: 'up', confidence: 92 },
    { day: 'Tomorrow', aqi: 312, condition: 'Very Poor', trend: 'up', confidence: 88 },
    { day: 'Day 2', aqi: 298, condition: 'Poor', trend: 'down', confidence: 85 },
    { day: 'Day 3', aqi: 265, condition: 'Poor', trend: 'down', confidence: 82 },
  ];

  const peaks = [
    { time: 'Tomorrow 10:00 AM', aqi: 325, reason: 'Morning traffic + stable atmosphere' },
    { time: 'Day 2 6:00 PM', aqi: 312, reason: 'Evening rush hour' },
  ];

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-red-400" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-green-400" />;
      default: return <Minus className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 200) return 'text-green-400';
    if (aqi <= 300) return 'text-yellow-400';
    if (aqi <= 400) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <>
      <PolicySidebar />
      <main className="main-content">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-white">Forecast & Trends</h1>

          {/* Forecast Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {forecast.map((day, index) => (
              <div key={index} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm text-gray-400">{day.day}</p>
                    <p className={`text-3xl font-bold ${getAQIColor(day.aqi)}`}>{day.aqi}</p>
                  </div>
                  {getTrendIcon(day.trend)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Condition</span>
                    <span className="text-white">{day.condition}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-blue-accent">{day.confidence}%</span>
                  </div>
                  <div className="w-full bg-blue-medium rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-blue-accent h-1.5 rounded-full" 
                      style={{ width: `${day.confidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Predicted Peaks */}
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <h2 className="text-lg font-semibold">Predicted Pollution Peaks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {peaks.map((peak, index) => (
                <div key={index} className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium">{peak.time}</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-400">AQI {peak.aqi}</span>
                  </div>
                  <p className="text-sm text-gray-400">{peak.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">7-Day AQI Trend</h2>
              <div className="flex items-center space-x-2">
                <span className="text-axs text-gray-400">Confidence Score: 87%</span>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
            </div>
            
            {/* Simple trend visualization */}
            <div className="h-64 flex items-end justify-between space-x-2">
              {[287, 312, 298, 265, 245, 278, 302].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full">
                    <div 
                      className={`w-full ${getAQIColor(value)} bg-opacity-30 bg-current rounded-t-lg transition-all duration-300 group-hover:bg-opacity-50`}
                      style={{ height: `${value/4}px` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-deep px-2 py-1 rounded text-xs whitespace-nowrap border border-blue-medium">
                        AQI: {value}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">D{index + 1}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-blue-medium/30 rounded-lg">
                <p className="text-sm text-gray-400">Peak Day</p>
                <p className="text-lg font-bold text-white">Day 2</p>
                <p className="text-xs text-red-400">AQI 312</p>
              </div>
              <div className="text-center p-3 bg-blue-medium/30 rounded-lg">
                <p className="text-sm text-gray-400">Lowest Day</p>
                <p className="text-lg font-bold text-white">Day 5</p>
                <p className="text-xs text-green-400">AQI 245</p>
              </div>
              <div className="text-center p-3 bg-blue-medium/30 rounded-lg">
                <p className="text-sm text-gray-400">Average</p>
                <p className="text-lg font-bold text-white">281</p>
                <p className="text-xs text-yellow-400">Poor</p>
              </div>
            </div>
          </div>

          {/* Policy Planning */}
          <div className="card bg-gradient-to-r from-blue-accent/10 to-transparent border-blue-accent/30">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-accent/20 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Policy Planning Recommendation</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Based on forecast, implement GRAP Stage III from tomorrow morning. 
                  Expected peak at 10 AM suggests staggered office timings could reduce exposure by 15%.
                </p>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 bg-blue-accent text-white rounded-lg text-sm hover:bg-blue-600 transition-colors">
                    View Detailed Plan
                  </button>
                  <button className="px-4 py-2 border border-blue-accent text-blue-accent rounded-lg text-sm hover:bg-blue-accent/10 transition-colors">
                    Generate Alert
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ForecastTrends;