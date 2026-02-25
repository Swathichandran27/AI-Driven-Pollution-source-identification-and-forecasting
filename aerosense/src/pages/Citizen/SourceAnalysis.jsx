import React, { useState } from "react";

const pollutionData = [
  {
    station: "Anand Vihar",
    location: "Delhi",
    date: "10 Jan 2024",
    aqi: 312,
    dominantSource: "Traffic",
    sources: {
      Traffic: 52,
      Industry: 18,
      Dust: 20,
      Biomass: 10,
    },
    explanation: "High NO2 and CO indicate vehicular emissions.",
  },
  {
    station: "RK Puram",
    location: "Delhi",
    date: "10 Jan 2024",
    aqi: 248,
    dominantSource: "Dust",
    sources: {
      Traffic: 30,
      Industry: 22,
      Dust: 38,
      Biomass: 10,
    },
    explanation: "Elevated PM10 levels indicate dust contribution.",
  },
];

const getAQIColor = (aqi) => {
  if (aqi <= 50) return "bg-green-500";
  if (aqi <= 100) return "bg-yellow-400";
  if (aqi <= 200) return "bg-orange-400";
  if (aqi <= 300) return "bg-red-500";
  return "bg-purple-700";
};

const SourceAnalysis = () => {
  const [selectedStation, setSelectedStation] = useState(
    pollutionData[0].station
  );

  const selectedData = pollutionData.find(
    (item) => item.station === selectedStation
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Pollution Source Analysis Dashboard
        </h1>

        {/* Station Filter */}
        <div className="mb-6">
          <label className="block text-gray-600 font-medium mb-2">
            Select Monitoring Station
          </label>
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            {pollutionData.map((data) => (
              <option key={data.station} value={data.station}>
                {data.station}
              </option>
            ))}
          </select>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-semibold">{selectedData.location}</p>
          </div>
          <div>
            <p className="text-gray-500">Date</p>
            <p className="font-semibold">{selectedData.date}</p>
          </div>
          <div>
            <p className="text-gray-500">Dominant Source</p>
            <p className="font-semibold text-red-500">
              {selectedData.dominantSource}
            </p>
          </div>
          <div>
            <p className="text-gray-500">AQI</p>
            <div
              className={`text-white px-4 py-2 rounded-lg font-bold w-fit ${getAQIColor(
                selectedData.aqi
              )}`}
            >
              {selectedData.aqi}
            </div>
          </div>
        </div>

        {/* Source Contribution */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Source Contribution (%)
          </h2>

          {Object.entries(selectedData.sources).map(([key, value]) => (
            <div key={key} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{key}</span>
                <span>{value}%</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full"
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-700 mb-2">
            Model Explanation
          </h3>
          <p className="text-gray-600">{selectedData.explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default SourceAnalysis;
