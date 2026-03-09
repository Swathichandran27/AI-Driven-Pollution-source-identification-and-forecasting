// import React, { useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const SourceIdentification = () => {
//   const [station, setStation] = useState("");
//   const [result, setResult] = useState(null);

//   const stations = [
//     "Anand Vihar",
//     "RK Puram",
//     "Punjabi Bagh",
//     "ITO",
//     "Dwarka Sector 8",
//     "Okhla Phase 2",
//     "Mandir Marg",
//     "Bawana",
//     "Wazirpur",
//     "Jahangirpuri",
//   ];

//   const handleAnalyze = () => {
//     setResult({
//       dominant: "Traffic",
//       traffic: 52,
//       industry: 18,
//       dust: 20,
//       biomass: 10,
//       explanation:
//         "High NO2 and CO levels indicate vehicular emissions as dominant.",
//     });
//   };

//   const chartData = result
//     ? [
//         { name: "Traffic", value: result.traffic },
//         { name: "Industry", value: result.industry },
//         { name: "Dust", value: result.dust },
//         { name: "Biomass", value: result.biomass },
//       ]
//     : [];

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <h1 className="text-3xl font-bold mb-6 text-gray-700">
//         Source Identification
//       </h1>

//       {/* Dropdown */}
//       <div className="bg-white p-6 rounded-xl shadow mb-6">
//         <div className="grid md:grid-cols-2 gap-4">
//           <select
//             value={station}
//             onChange={(e) => setStation(e.target.value)}
//             className="border p-3 rounded-lg"
//           >
//             <option>Select Monitoring Station</option>
//             {stations.map((s, i) => (
//               <option key={i}>{s}</option>
//             ))}
//           </select>

//           <button
//             onClick={handleAnalyze}
//             className="bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Analyze Source
//           </button>
//         </div>
//       </div>

//       {result && (
//         <>
//           {/* Result Text */}
//           <div className="bg-white p-6 rounded-xl shadow mb-6">
//             <h2 className="text-xl font-semibold mb-2">
//               Dominant Source: {result.dominant}
//             </h2>
//             <p>{result.explanation}</p>
//           </div>

//           {/* Charts */}
//           <div className="grid md:grid-cols-2 gap-6">

//             {/* Pie Chart */}
//             <div className="bg-white p-6 rounded-xl shadow">
//               <h3 className="font-semibold mb-4">
//                 Source Contribution (Pie)
//               </h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <PieChart>
//                   <Pie
//                     data={chartData}
//                     dataKey="value"
//                     outerRadius={100}
//                     label
//                   >
//                     {chartData.map((_, i) => (
//                       <Cell key={i} />
//                     ))}
//                   </Pie>
//                   <Legend />
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             {/* Bar Graph */}
//             <div className="bg-white p-6 rounded-xl shadow">
//               <h3 className="font-semibold mb-4">
//                 Pollution Distribution (Bar)
//               </h3>
//               <ResponsiveContainer width="100%" height={300}>
//                 <BarChart data={chartData}>
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="value" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default SourceIdentification;








import React, { useState } from 'react';
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
  Satellite
} from 'lucide-react';
import PolicySidebar from '../../components/Layout/PolicySidebar';

const SourceIdentification = () => {
  const [selectedDate, setSelectedDate] = useState('2024-11-15');
  const [selectedLocation, setSelectedLocation] = useState('Delhi-NCR');

  const locations = ['Delhi-NCR', 'Anand Vihar', 'Rohini', 'Dwarka', 'Noida', 'Gurugram'];

  const sourceData = {
    dominant: 'Biomass Burning',
    contributions: [
      { name: 'Biomass Burning', value: 42, color: 'bg-orange-500', icon: Flame, source: 'Stubble burning in Punjab/Haryana' },
      { name: 'Traffic', value: 28, color: 'bg-blue-500', icon: Car, source: 'Vehicular emissions' },
      { name: 'Industry', value: 18, color: 'bg-purple-500', icon: Factory, source: 'Industrial emissions' },
      { name: 'Construction Dust', value: 12, color: 'bg-yellow-500', icon: Wind, source: 'Construction activities' },
    ],
    aiExplanation: "Analysis of satellite data (NASA MODIS) shows active fire counts 300% above normal in Punjab/Haryana. Combined with wind patterns from NW, biomass burning contributes 42% to Delhi's current AQI. Traffic congestion during peak hours adds to local accumulation.",
    satelliteData: {
      modis: "Fire count: 1,247 active fires in Punjab region",
      isro: "Aerosol Optical Depth: 1.2 (Very High)",
      windPattern: "NW winds at 15 km/h carrying smoke plume",
    }
  };

  return (
    <>
      <PolicySidebar />
      <main className="main-content">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Source Identification</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-deep rounded-lg border border-blue-medium px-4 py-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm text-gray-300 focus:outline-none"
            />
          </div>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="appearance-none bg-blue-deep border border-blue-medium text-gray-300 px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:border-blue-accent"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          <button className="p-2 bg-blue-accent/20 text-blue-accent rounded-lg hover:bg-blue-accent/30 transition-colors">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Location and Date Display */}
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center space-x-1">
          <MapPin className="h-4 w-4" />
          <span>{selectedLocation}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Calendar className="h-4 w-4" />
          <span>{new Date(selectedDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Contribution Chart */}
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Source Contribution Breakdown</h2>
          
          {/* Dominant Source Highlight */}
          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-full">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Dominant Source</p>
                <p className="text-xl font-bold text-white">{sourceData.dominant}</p>
                <p className="text-sm text-orange-400">42% of total pollution</p>
              </div>
            </div>
          </div>

          {/* Contribution Bars */}
          <div className="space-y-6">
            {sourceData.contributions.map((source) => {
              const Icon = source.icon;
              return (
                <div key={source.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{source.name}</span>
                      <span className="text-xs text-gray-500">({source.source})</span>
                    </div>
                    <span className="text-lg font-bold text-blue-accent">{source.value}%</span>
                  </div>
                  <div className="w-full bg-blue-medium rounded-full h-3">
                    <div 
                      className={`${source.color} h-3 rounded-full transition-all duration-500`} 
                      style={{ width: `${source.value}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Explanation */}
          <div className="mt-6 p-4 bg-blue-accent/10 rounded-lg border border-blue-accent/30">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-accent mb-1">AI Analysis</p>
                <p className="text-sm text-gray-300">{sourceData.aiExplanation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Satellite Data & References */}
        <div className="card lg:col-span-1">
          <div className="flex items-center space-x-2 mb-4">
            <Satellite className="h-5 w-5 text-blue-accent" />
            <h2 className="text-lg font-semibold">Satellite Data</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-blue-medium/30 rounded-lg">
              <p className="text-sm font-medium text-blue-accent mb-1">NASA MODIS</p>
              <p className="text-sm text-gray-300">{sourceData.satelliteData.modis}</p>
              <p className="text-xs text-gray-500 mt-1">Updated: 2 hours ago</p>
            </div>
            
            <div className="p-3 bg-blue-medium/30 rounded-lg">
              <p className="text-sm font-medium text-blue-accent mb-1">ISRO</p>
              <p className="text-sm text-gray-300">{sourceData.satelliteData.isro}</p>
              <p className="text-xs text-gray-500 mt-1">AOD measurement</p>
            </div>
            
            <div className="p-3 bg-blue-medium/30 rounded-lg">
              <p className="text-sm font-medium text-blue-accent mb-1">Wind Pattern</p>
              <p className="text-sm text-gray-300">{sourceData.satelliteData.windPattern}</p>
              <div className="mt-2 h-16 bg-blue-medium/50 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">Wind direction map</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-medium">
            <h3 className="text-sm font-medium mb-2">Agency References</h3>
            <div className="space-y-2">
              <a href="#" className="block text-xs text-blue-accent hover:underline">CPCB Monitoring Data - Nov 2024</a>
              <a href="#" className="block text-xs text-blue-accent hover:underline">NASA FIRMS Fire Data - Active Fires</a>
              <a href="#" className="block text-xs text-blue-accent hover:underline">ISRO SAFAR - Aerosol Analysis</a>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Comparison */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Source Pattern History (Last 7 Days)</h2>
        <div className="h-48 flex items-end justify-between space-x-2">
          {[65, 58, 72, 68, 82, 75, 42].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg" style={{ height: `${value}%` }}>
                <div className="text-center text-xs text-white pt-1">{value}%</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">D{index + 1}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-4">
          Biomass burning contribution trend - Peak on Day 5 (82%) due to increased stubble burning activity
        </p>
      </div>
        </div>
      </main>
    </>
  );
};

export default SourceIdentification;












