//                     </div>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAQITextColor(station.aqi)}`}>AQI {station.aqi}</span>
//                   </div>
//                   <div className="flex gap-2 text-xs text-gray-400">
//                     <span>PM2.5: {station.pm25}</span>
//                     <span>•</span>
//                     <span>PM10: {station.pm10}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
// //           if (sa && sa.sources) {
// //             sources = Object.entries(sa.sources).map(([k, v]) => ({ name: k.charAt(0).toUpperCase() + k.slice(1), percentage: Number(v) || 0, icon: k === 'vehicles' ? <Car className="text-blue-500" size={16} /> : (k === 'biomass' ? <Flame className="text-orange-500" size={16} /> : <Factory className="text-gray-500" size={16} />) }));
// //           }
// //         } catch (e) {
// //           console.warn('No source-analysis available', e);
// //         }

// //         // fetch forecast for graph
// //         let forecastSeries = [];
// //         try {
// //           const f = await citizenApi.getForecast({ station: selectedLocation });
// //           if (f && f.forecast) {
// //             forecastSeries = f.forecast.map(item => ({ time: item.datetime || item.hour, aqi: item.aqi }));
// //           }
// //         } catch (e) {
// //           console.warn('Forecast not available', e);
// //         }

// //         if (station) {
// //           const normalized = {
// //             current: {
// //               aqi: station.aqi ?? 0,
// //               category: station.category ?? 'Unknown',
// //               pm25: station.pollutants?.pm25 ?? 0,
// //               pm10: station.pollutants?.pm10 ?? 0,
// //               no2: station.pollutants?.no2 ?? 0,
// //               co: station.pollutants?.co ?? 0,
// //               o3: station.pollutants?.o3 ?? 0
// //             },
// //             hourly: forecastSeries.length ? forecastSeries : (json || []).slice(0, 12).map((s, i) => ({ time: s.datetime ?? `T+${i}`, aqi: s.aqi ?? s.dominant_percent ?? 0 })),
// //             sources: sources,
// //             nearbyStations: (json || []).map(s => ({ name: s.station, aqi: s.aqi ?? s.dominant_percent ?? 0, pm25: s.pollutants?.pm25 ?? 0, pm10: s.pollutants?.pm10 ?? 0, alert: s.alert }))
// //           };

// //           setAqiData(normalized);
// //         } else if ((json || []).length) {
// //           const first = json[0];
// //           const normalized = {
// //             current: {
// //               aqi: first.aqi ?? first.dominant_percent ?? 0,
// //               category: first.category ?? 'Unknown',
// //               pm25: first.pollutants?.pm25 ?? 0,
// //               pm10: first.pollutants?.pm10 ?? 0,
// //               no2: first.pollutants?.no2 ?? 0,
// //               co: first.pollutants?.co ?? 0,
// //               o3: first.pollutants?.o3 ?? 0
// //             },
// //             hourly: forecastSeries.length ? forecastSeries : (json || []).slice(0, 12).map((s, i) => ({ time: s.datetime ?? `T+${i}`, aqi: s.aqi ?? s.dominant_percent ?? 0 })),
// //             sources: sources,
// //             nearbyStations: (json || []).slice(0, 6).map(s => ({ name: s.station, aqi: s.aqi ?? s.dominant_percent ?? 0, pm25: s.pollutants?.pm25 ?? 0, pm10: s.pollutants?.pm10 ?? 0, alert: s.alert }))
// //           };

// //           setAqiData(normalized);
// //         } else {
// //           setAqiData(mockAQIData);
// //           setDataSource('mock');
// //         }

// //         // alert banner if any station has alert true
// //         const anyAlert = (json || []).some(s => s.alert === true);
// //         setAlertBanner(anyAlert ? 'High pollution alert active in some stations' : null);

// //         setLoading(false);
// //       } catch (err) {
// //         console.error('Failed to fetch dashboard data', err);
// //         setAqiData(mockAQIData);
// //         setLoading(false);
// //         setDataSource('mock');
// //       }
// //     };

// //     loadStations();
// //     loadData();
// //     const id = setInterval(() => { loadData(); }, 30_000);

// //     return () => {
// //       mounted = false;
// //       clearInterval(id);
// //     };
// //   }, [selectedLocation]);

// //   const getAQIColomr = (aqi) => {
// //     if (aqi <= 50) return 'bg-green-500';
// //     if (aqi <= 100) return 'bg-yellow-500';
// //     if (aqi <= 200) return 'bg-orange-500';
// //     if (aqi <= 300) return 'bg-red-500';
// //     if (aqi <= 400) return 'bg-purple-500';
// //     return 'bg-maroon-500';
// //   };

// //   const getAQITextColor = (aqi) => {
// //     if (aqi <= 50) return 'text-green-600';
// //     if (aqi <= 100) return 'text-yellow-600';
// //     if (aqi <= 200) return 'text-orange-600';
// //     if (aqi <= 300) return 'text-red-600';
// //     if (aqi <= 400) return 'text-purple-600';
// //     return 'text-maroon-600';
// //   };

// //   const getAQIBgLight = (aqi) => {
// //     if (aqi <= 50) return 'bg-green-50';
// //     if (aqi <= 100) return 'bg-yellow-50';
// //     if (aqi <= 200) return 'bg-orange-50';
// //     if (aqi <= 300) return 'bg-red-50';
// //     if (aqi <= 400) return 'bg-purple-50';
// //     return 'bg-red-100';
// //   };

// //   const getAQIMessage = (aqi) => {
// //     if (aqi <= 50) return 'Air quality is satisfactory, no health risk.';
// //     if (aqi <= 100) return 'Air quality is acceptable. Sensitive individuals should limit outdoor activity.';
// //     if (aqi <= 200) return 'Sensitive groups may experience health effects. General public less likely affected.';
// //     if (aqi <= 300) return 'Health alert: Everyone may experience serious health effects.';
// //     if (aqi <= 400) return 'Health emergency: Everyone likely affected seriously.';
// //     return 'Hazardous conditions: Stay indoors, keep windows closed.';
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-[60vh]">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-accent mx-auto"></div>
// //           <p className="mt-4 text-gray-300">Loading air quality data...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Use fetched data if available, otherwise fallback to mock
// //   const data = aqiData || mockAQIData;

// //   return (
// //     <div>
// //       {/* Header with Location Selector */}
// //       <div className="sticky top-0 z-10 backdrop-blur-sm bg-black/40 border-b border-blue-medium">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
// //           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
// //             <div>
// //               <h1 className="text-2xl font-bold text-white">AQI Dashboard</h1>
// //               <p className="text-sm text-gray-300">Real-time air quality monitoring for Delhi-NCR</p>
// //             </div>

// //             <div className="flex items-center gap-3 w-full sm:w-auto">
// //               <div className="relative flex-1 sm:flex-initial">
// //                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
// //                 <select 
// //                   aria-label="Select monitoring station"
// //                   className="pl-10 pr-8 py-2 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-accent appearance-none bg-transparent text-gray-200"
// //                   value={selectedLocation}
// //                   onChange={(e) => setSelectedLocation(e.target.value)}
// //                 >
// //                   <option>Anand Vihar, Delhi</option>
// //                   <option>RK Puram, Delhi</option>
// //                   <option>Dwarka, Delhi</option>
// //                   <option>Noida Sector 62</option>
// //                   <option>Gurugram Sector 51</option>
// //                   <option>Faridabad Sector 16</option>
// //                 </select>
// //                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
// //               </div>

// //               <div className="flex bg-transparent rounded-lg p-1">
// //                 <button 
// //                   className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '24h' ? 'bg-blue-accent text-black' : 'text-gray-300'}`}
// //                   onClick={() => setTimeRange('24h')}
// //                 >
// //                   24H
// //                 </button>
// //                 <button 
// //                   className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '7d' ? 'bg-blue-accent text-black' : 'text-gray-300'}`}
// //                   onClick={() => setTimeRange('7d')}
// //                 >
// //                   7D
// //                 </button>
// //                 <button 
// //                   className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '30d' ? 'bg-blue-accent text-black' : 'text-gray-300'}`}
// //                   onClick={() => setTimeRange('30d')}
// //                 >
// //                   30D
// //                 </button>
// //               </div>
// //             </div>
// //         </div>

// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// //         {dataSource === 'mock' && (
// //           <div className="mb-4">
// //             <div className="rounded-md bg-yellow-50 border-l-4 border-yellow-400 p-3 text-yellow-800">
// //               <strong>Mock data:</strong> This view is displaying fallback/mock data for development/testing.
// //             </div>
// //           </div>
// //         )}
// //         {/* Main AQI Card */}
// //         <div className={`mb-6 transition-colors duration-500 ${getAQIBgLight(data.current.aqi)}`}>
// //           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
// //             <div>
// //               <div className="flex items-center gap-2 mb-2">
// //                 <Gauge className={getAQITextColor(data.current.aqi)} size={24} />
// //                 <span className="text-sm font-medium text-gray-600">Current AQI</span>
// //               </div>
// //               <div className="flex items-baseline gap-3">
// //                 <span className={`text-6xl font-bold ${getAQITextColor(data.current.aqi)}`}>
// //                   {data.current.aqi}
// //                 </span>
// //                 <span className="text-xl text-gray-600">/ 500</span>
// //               </div>
// //               <div className="mt-2 flex items-center gap-3">
// //                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAQIBgLight(data.current.aqi)} ${getAQITextColor(data.current.aqi)}`}>
// //                   {data.current.category}
// //                 </span>
// //                 <span className={`ml-2 px-2 py-1 rounded text-xs ${dataSource==='live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{dataSource === 'live' ? 'Live' : 'Mock'}</span>
// //               </div>
// //               <p className="mt-4 text-gray-700 max-w-2xl">
// //                 {getAQIMessage(data.current.aqi)}
// //               </p>
// //             </div>
            
// //               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
// //               <div className="card p-4 rounded-xl min-w-[120px]">
// //                 <div className="flex items-center gap-2 mb-2">
// //                   <Wind className="text-blue-400" size={20} />
// //                   <span className="text-sm text-gray-200">PM2.5</span>
// //                 </div>
// //                 <span className="text-2xl font-bold text-white">{data.current.pm25}</span>
// //                 <span className="text-sm text-gray-300 ml-1">µg/m³</span>
// //               </div>
              
// //               <div className="card p-4 rounded-xl">
// //                 <div className="flex items-center gap-2 mb-2">
// //                   <Wind className="text-blue-400" size={20} />
// //                   <span className="text-sm text-gray-200">PM10</span>
// //                 </div>
// //                 <span className="text-2xl font-bold text-white">{data.current.pm10}</span>
// //                 <span className="text-sm text-gray-300 ml-1">µg/m³</span>
// //               </div>
              
// //               <div className="card p-4 rounded-xl">
// //                 <div className="flex items-center gap-2 mb-2">
// //                   <Wind className="text-blue-400" size={20} />
// //                   <span className="text-sm text-gray-200">NO₂</span>
// //                 </div>
// //                 <span className="text-2xl font-bold text-white">{data.current.no2}</span>
// //                 <span className="text-sm text-gray-300 ml-1">ppb</span>
// //               </div>
              
// //               <div className="card p-4 rounded-xl">
// //                 <div className="flex items-center gap-2 mb-2">
// //                   <Wind className="text-blue-400" size={20} />
// //                   <span className="text-sm text-gray-200">CO</span>
// //                 </div>
// //                 <span className="text-2xl font-bold text-white">{data.current.co ?? '—'}</span>
// //                 <span className="text-sm text-gray-300 ml-1">ppb</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* AQI Timeline and Health Impact */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
// //           {/* Timeline Chart */}
// //           <div className="lg:col-span-2">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-lg font-semibold text-gray-100">24-Hour AQI Trend</h2>
// //               <div className="flex items-center gap-2 text-sm text-gray-400">
// //                 <Clock size={16} />
// //                 <span>Updated hourly</span>
// //               </div>
// //             </div>

// //             <div style={{ height: 220 }}>
// //               <ResponsiveContainer width="100%" height="100%">
// //                 <LineChart data={hourlyData.length ? hourlyData : data.hourly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
// //                   <XAxis dataKey="time" tick={{ fontSize: 12 }} />
// //                   <YAxis domain={[0, 'dataMax']} />
// //                   <Tooltip />
// //                   <Line type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
// //                 </LineChart>
// //               </ResponsiveContainer>
// //             </div>

// //             <div className="flex justify-between mt-4 text-xs text-gray-500">
// //               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Good</span>
// //               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded"></span> Moderate</span>
// //               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span> Unhealthy (S)</span>
// //               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Unhealthy</span>
// //               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded"></span> Very Unhealthy</span>
// //               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-maroon-500 rounded"></span> Hazardous</span>
// //             </div>
// //           </div>

// //           {/* Health Impact Summary */}
// //           <div className="p-6">
// //             <h2 className="text-lg font-semibold text-gray-100 mb-4">Health Impact</h2>
// //             <div className="space-y-4">
// //               <div className="flex items-start gap-3">
// //                 <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
// //                   <AlertTriangle className="text-red-600" size={18} />
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium text-gray-100">Sensitive Groups</p>
// //                   <p className="text-sm text-gray-300">Children, elderly, and those with respiratory issues should avoid outdoor activities.</p>
// //                 </div>
// //               </div>

// //               <div className="flex items-start gap-3">
// //                 <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
// //                   <Activity className="text-yellow-600" size={18} />
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium text-gray-100">General Public</p>
// //                   <p className="text-sm text-gray-300">Reduce prolonged or heavy exertion outdoors.</p>
// //                 </div>
// //               </div>

// //               <div className="flex items-start gap-3">
// //                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
// //                   <Info className="text-green-600" size={18} />
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium text-gray-100">Recommended</p>
// //                   <p className="text-sm text-gray-300">Wear N95 mask outdoors. Use air purifiers indoors.</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //         </div>

// //         {/* Source Contribution and Weather Info */}
// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //           {/* Source Contribution */}
// //           <div className="p-6">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-lg font-semibold text-gray-100">Pollution Sources</h2>
// //               <span className="text-xs text-gray-300">Today's estimate</span>
// //             </div>
            
// //             <div className="space-y-4">
// //               {data.sources.map((source, index) => (
// //                 <div key={index}>
// //                   <div className="flex justify-between items-center mb-1">
// //                     <div className="flex items-center gap-2">
// //                       {source.icon}
// //                       <span className="text-sm font-medium text-gray-200">{source.name}</span>
// //                     </div>
// //                     <span className="text-sm font-semibold text-white">{source.percentage}%</span>
// //                   </div>
// //                   <div className="w-full bg-gray-800/40 rounded-full h-2">
// //                     <div 
// //                       className="bg-blue-500 rounded-full h-2 transition-all duration-500"
// //                       style={{ width: `${source.percentage}%` }}
// //                     ></div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
            
// //             <div className="mt-4 p-3 bg-blue-50 rounded-lg">
// //               <p className="text-xs text-blue-700">
// //                 <span className="font-semibold">AI Analysis:</span> Stubble burning in Punjab/Haryana contributing to 40% of today's pollution. Consider reducing outdoor exposure.
// //               </p>
// //             </div>
// //           </div>

// //           {/* Weather Conditions */}
// //           <div className="p-6">
// //             <h2 className="text-lg font-semibold text-gray-900 mb-4">Weather Conditions</h2>
            
// //             <div className="grid grid-cols-2 gap-4">
// //               <div className="bg-gray-50 rounded-xl p-4">
// //                 <div className="flex items-center gap-2 mb-2">
// //                   <ThermometerSun className="text-orange-500" size={20} />
// //                   <span className="text-sm text-gray-600">Temperature</span>
// //                 </div>
// //                 <span className="text-2xl font-bold">32°C</span>
// //                 <span className="text-sm text-gray-500 ml-1">Feels like 34°</span>
// //               </div>
              
// //               <div className="bg-gray-50 rounded-xl p-4">
// //                 <div className="flex items-center gap-2 mb-2">
// //                   <Droplets className="text-blue-500" size={20} />
// //                   <span className="text-sm text-gray-600">Humidity</span>
// //                 </div>
// //                 <span className="text-2xl font-bold">65%</span>
// //               </div>
              
// //               <div className="bg-gray-50 rounded-xl p-4">
// //                 <div className="flex items-center gap-2 mb-2">
// //                   <Wind className="text-gray-500" size={20} />
// //                   <span className="text-sm text-gray-600">Wind Speed</span>
// //                 </div>
// //                 <span className="text-2xl font-bold">12</span>
// //                 <span className="text-sm text-gray-500 ml-1">km/h</span>
// //               </div>
              
// //               <div className="bg-gray-50 rounded-xl p-4">
// //                 <div className="flex items-center gap-2 mb-2">
// //                   <Calendar className="text-purple-500" size={20} />
// //                   <span className="text-sm text-gray-600">Pressure</span>
// //                 </div>
// //                 <span className="text-2xl font-bold">1012</span>
// //                 <span className="text-sm text-gray-500 ml-1">hPa</span>
// //               </div>
// //             </div>
            
// //             <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
// //               <p className="text-xs text-yellow-700">
// //                 <span className="font-semibold">Weather Alert:</span> Low wind speed and high humidity may trap pollutants near ground level.
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //         <HeatMap />

// //         {/* Nearby Stations */}
// //         <div className="mt-6 card p-6">
// //           <h2 className="text-lg font-semibold text-gray-100 mb-4">Nearby Monitoring Stations</h2>
          
// //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //             {data.nearbyStations.map((station, index) => (
// //               <div key={index} className="card hover:shadow-md transition-shadow p-4">
// //                 <div className="flex justify-between items-start mb-2">
// //                   <div>
// //                     <h3 className="font-medium text-gray-100">{station.name}</h3>
// //                     <p className="text-xs text-gray-300">{station.distance} km away</p>
// //                   </div>
// //                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAQIBgLight(station.aqi)} ${getAQITextColor(station.aqi)}`}>
// //                     AQI {station.aqi}
// //                   </span>
// //                 </div>
// //                 <div className="flex gap-2 text-xs text-gray-300">
// //                   <span>PM2.5: {station.pm25}</span>
// //                   <span>•</span>
// //                   <span>PM10: {station.pm10}</span>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Mock Data
// // const mockAQIData = {
// //   current: {
// //     aqi: 312,
// //     category: 'Very Unhealthy',
// //     pm25: 185,
// //     pm10: 245,
// //     no2: 45,
// //     o3: 28
// //   },
// //   hourly: [
// //     { time: '00:00', aqi: 245 },
// //     { time: '02:00', aqi: 258 },
// //     { time: '04:00', aqi: 275 },
// //     { time: '06:00', aqi: 298 },
// //     { time: '08:00', aqi: 312 },
// //     { time: '10:00', aqi: 325 },
// //     { time: '12:00', aqi: 318 },
// //     { time: '14:00', aqi: 305 },
// //     { time: '16:00', aqi: 295 },
// //     { time: '18:00', aqi: 302 },
// //     { time: '20:00', aqi: 312 },
// //     { time: '22:00', aqi: 308 }
// //   ],
// //   sources: [
// //     { name: 'Stubble Burning', percentage: 40, icon: <Flame className="text-orange-500" size={16} /> },
// //     { name: 'Vehicle Emissions', percentage: 25, icon: <Car className="text-blue-500" size={16} /> },
// //     { name: 'Industrial', percentage: 20, icon: <Factory className="text-gray-500" size={16} /> },
// //     { name: 'Dust & Construction', percentage: 15, icon: <Wind className="text-yellow-500" size={16} /> }
// //   ],
// //   nearbyStations: [
// //     { name: 'Anand Vihar', distance: 0.5, aqi: 312, pm25: 185, pm10: 245 },
// //     { name: 'ITO', distance: 2.3, aqi: 298, pm25: 172, pm10: 230 },
// //     { name: 'RK Puram', distance: 4.1, aqi: 278, pm25: 158, pm10: 215 }
// //   ]
// // };

// // export default AQIDashboard;














// import React, { useState, useEffect } from 'react';
// import { 
//   MapPin, 
//   Wind, 
//   Droplets, 
//   ThermometerSun, 
//   Gauge,
//   AlertTriangle,
//   Info,
//   ChevronDown,
//   Clock,
//   Calendar,
//   Activity,
//   Leaf,
//   Factory,
//   Car,
//   Flame
// } from 'lucide-react';
// import HeatMap from "../../components/Map/HeatMap";
// import citizenApi from '../../api/citizenApi';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer
// } from 'recharts';

// const AQIDashboard = () => {
//   const [selectedLocation, setSelectedLocation] = useState('');
//   const [timeRange, setTimeRange] = useState('24h');
//   const [aqiData, setAqiData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [dataSource, setDataSource] = useState('mock');
//   const [hourlyData, setHourlyData] = useState([]);
//   const [stationsList, setStationsList] = useState([]);
//   const [alertBanner, setAlertBanner] = useState(null);

//   const getAQIColor = (aqi) => {
//     if (aqi <= 50) return "green";
//     if (aqi <= 100) return "yellow";
//     if (aqi <= 150) return "orange";
//     if (aqi <= 200) return "red";
//     if (aqi <= 300) return "purple";
//     return "maroon";
//   };

//   // Fetch real-time data from backend `/dashboard`, `/stations`, `/source-analysis`, `/forecast`
//   useEffect(() => {
//     let mounted = true;

//     const loadStations = async () => {
//       try {
//         const st = await citizenApi.getStations();
//         if (!mounted) return;
//         setStationsList(st || []);
//         // default select first station if none selected
//         if (st && st.length && !selectedLocation) {
//           setSelectedLocation(st[0].station);
//         }
//       } catch (e) {
//         console.error('Failed to load stations', e);
//       }
//     };

//     const loadData = async () => {
//       if (!selectedLocation) return;
//       try {
//         setLoading(true);
//         const json = await citizenApi.getDashboard();
//         if (!mounted) return;
//         setDataSource('live');

//         // exact match by station name
//         const station = (json || []).find(s => s.station === selectedLocation);

//         // fetch source breakdown
//         let sources = [];
//         try {
//           const sa = await citizenApi.getSourceAnalysis({ station: selectedLocation });
//           if (sa && sa.sources) {
//             sources = Object.entries(sa.sources).map(([k, v]) => ({ 
//               name: k.charAt(0).toUpperCase() + k.slice(1), 
//               percentage: Number(v) || 0, 
//               icon: k === 'vehicles' ? <Car className="text-blue-500" size={16} /> : 
//                     (k === 'biomass' ? <Flame className="text-orange-500" size={16} /> : 
//                     <Factory className="text-gray-500" size={16} />) 
//             }));
//           }
//         } catch (e) {
//           console.warn('No source-analysis available', e);
//         }

//         // fetch forecast for graph
//         let forecastSeries = [];
//         try {
//           const f = await citizenApi.getForecast({ station: selectedLocation });
//           if (f && f.forecast) {
//             forecastSeries = f.forecast.map(item => ({ time: item.datetime || item.hour, aqi: item.aqi }));
//           }
//         } catch (e) {
//           console.warn('Forecast not available', e);
//         }

//         if (station) {
//           const normalized = {
//             current: {
//               aqi: station.aqi ?? 0,
//               category: station.category ?? 'Unknown',
//               pm25: station.pollutants?.pm25 ?? 0,
//               pm10: station.pollutants?.pm10 ?? 0,
//               no2: station.pollutants?.no2 ?? 0,
//               co: station.pollutants?.co ?? 0,
//               o3: station.pollutants?.o3 ?? 0
//             },
//             hourly: forecastSeries.length ? forecastSeries : (json || []).slice(0, 12).map((s, i) => ({ time: s.datetime ?? `T+${i}`, aqi: s.aqi ?? s.dominant_percent ?? 0 })),
//             sources: sources,
//             nearbyStations: (json || []).map(s => ({ name: s.station, aqi: s.aqi ?? s.dominant_percent ?? 0, pm25: s.pollutants?.pm25 ?? 0, pm10: s.pollutants?.pm10 ?? 0, alert: s.alert }))
//           };

//           setAqiData(normalized);
//         } else if ((json || []).length) {
//           const first = json[0];
//           const normalized = {
//             current: {
//               aqi: first.aqi ?? first.dominant_percent ?? 0,
//               category: first.category ?? 'Unknown',
//               pm25: first.pollutants?.pm25 ?? 0,
//               pm10: first.pollutants?.pm10 ?? 0,
//               no2: first.pollutants?.no2 ?? 0,
//               co: first.pollutants?.co ?? 0,
//               o3: first.pollutants?.o3 ?? 0
//             },
//             hourly: forecastSeries.length ? forecastSeries : (json || []).slice(0, 12).map((s, i) => ({ time: s.datetime ?? `T+${i}`, aqi: s.aqi ?? s.dominant_percent ?? 0 })),
//             sources: sources,
//             nearbyStations: (json || []).slice(0, 6).map(s => ({ name: s.station, aqi: s.aqi ?? s.dominant_percent ?? 0, pm25: s.pollutants?.pm25 ?? 0, pm10: s.pollutants?.pm10 ?? 0, alert: s.alert }))
//           };

//           setAqiData(normalized);
//         } else {
//           setAqiData(mockAQIData);
//           setDataSource('mock');
//         }

//         // alert banner if any station has alert true
//         const anyAlert = (json || []).some(s => s.alert === true);
//         setAlertBanner(anyAlert ? 'High pollution alert active in some stations' : null);

//         setLoading(false);
//       } catch (err) {
//         console.error('Failed to fetch dashboard data', err);
//         setAqiData(mockAQIData);
//         setLoading(false);
//         setDataSource('mock');
//       }
//     };

//     loadStations();
//     loadData();
//     const id = setInterval(() => { loadData(); }, 30000);

//     return () => {
//       mounted = false;
//       clearInterval(id);
//     };
//   }, [selectedLocation]);

//   const getAQIColomr = (aqi) => {
//     if (aqi <= 50) return 'bg-green-500';
//     if (aqi <= 100) return 'bg-yellow-500';
//     if (aqi <= 200) return 'bg-orange-500';
//     if (aqi <= 300) return 'bg-red-500';
//     if (aqi <= 400) return 'bg-purple-500';
//     return 'bg-maroon-500';
//   };

//   const getAQITextColor = (aqi) => {
//     if (aqi <= 50) return 'text-green-600';
//     if (aqi <= 100) return 'text-yellow-600';
//     if (aqi <= 200) return 'text-orange-600';
//     if (aqi <= 300) return 'text-red-600';
//     if (aqi <= 400) return 'text-purple-600';
//     return 'text-maroon-600';
//   };

//   const getAQIBgLight = (aqi) => {
//     if (aqi <= 50) return 'bg-green-50';
//     if (aqi <= 100) return 'bg-yellow-50';
//     if (aqi <= 200) return 'bg-orange-50';
//     if (aqi <= 300) return 'bg-red-50';
//     if (aqi <= 400) return 'bg-purple-50';
//     return 'bg-red-100';
//   };

//   const getAQIMessage = (aqi) => {
//     if (aqi <= 50) return 'Air quality is satisfactory, no health risk.';
//     if (aqi <= 100) return 'Air quality is acceptable. Sensitive individuals should limit outdoor activity.';
//     if (aqi <= 200) return 'Sensitive groups may experience health effects. General public less likely affected.';
//     if (aqi <= 300) return 'Health alert: Everyone may experience serious health effects.';
//     if (aqi <= 400) return 'Health emergency: Everyone likely affected seriously.';
//     return 'Hazardous conditions: Stay indoors, keep windows closed.';
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-accent mx-auto"></div>
//           <p className="mt-4 text-gray-300">Loading air quality data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Use fetched data if available, otherwise fallback to mock
//   const data = aqiData || mockAQIData;

//   return (
//     <div>
//       {/* Header with Location Selector */}
//       <div className="sticky top-0 z-10 backdrop-blur-sm bg-black/40 border-b border-blue-medium">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//             <div>
//               <h1 className="text-2xl font-bold text-white">AQI Dashboard</h1>
//               <p className="text-sm text-gray-300">Real-time air quality monitoring for Delhi-NCR</p>
//             </div>

//             <div className="flex items-center gap-3 w-full sm:w-auto">
//               <div className="relative flex-1 sm:flex-initial">
//                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                 <select 
//                   aria-label="Select monitoring station"
//                   className="pl-10 pr-8 py-2 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-accent appearance-none bg-transparent text-gray-200"
//                   value={selectedLocation}
//                   onChange={(e) => setSelectedLocation(e.target.value)}
//                 >
//                   {stationsList.length > 0 ? (
//                     stationsList.map((station, idx) => (
//                       <option key={idx} value={station.station || station}>{station.station || station}</option>
//                     ))
//                   ) : (
//                     <>
//                       <option>Anand Vihar, Delhi</option>
//                       <option>RK Puram, Delhi</option>
//                       <option>Dwarka, Delhi</option>
//                       <option>Noida Sector 62</option>
//                       <option>Gurugram Sector 51</option>
//                       <option>Faridabad Sector 16</option>
//                     </>
//                   )}
//                 </select>
//                 <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
//               </div>

//               <div className="flex bg-transparent rounded-lg p-1">
//                 <button 
//                   className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '24h' ? 'bg-blue-accent text-black' : 'text-gray-300'}`}
//                   onClick={() => setTimeRange('24h')}
//                 >
//                   24H
//                 </button>
//                 <button 
//                   className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '7d' ? 'bg-blue-accent text-black' : 'text-gray-300'}`}
//                   onClick={() => setTimeRange('7d')}
//                 >
//                   7D
//                 </button>
//                 <button 
//                   className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '30d' ? 'bg-blue-accent text-black' : 'text-gray-300'}`}
//                   onClick={() => setTimeRange('30d')}
//                 >
//                   30D
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {dataSource === 'mock' && (
//           <div className="mb-4">
//             <div className="rounded-md bg-yellow-50 border-l-4 border-yellow-400 p-3 text-yellow-800">
//               <strong>Mock data:</strong> This view is displaying fallback/mock data for development/testing.
//             </div>
//           </div>
//         )}
        
//         {/* Main AQI Card */}
//         <div className={`mb-6 p-6 rounded-lg transition-colors duration-500 ${getAQIBgLight(data.current.aqi)}`}>
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
//             <div>
//               <div className="flex items-center gap-2 mb-2">
//                 <Gauge className={getAQITextColor(data.current.aqi)} size={24} />
//                 <span className="text-sm font-medium text-gray-600">Current AQI</span>
//               </div>
//               <div className="flex items-baseline gap-3">
//                 <span className={`text-6xl font-bold ${getAQITextColor(data.current.aqi)}`}>
//                   {data.current.aqi}
//                 </span>
//                 <span className="text-xl text-gray-600">/ 500</span>
//               </div>
//               <div className="mt-2 flex items-center gap-3">
//                 <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAQIBgLight(data.current.aqi)} ${getAQITextColor(data.current.aqi)}`}>
//                   {data.current.category}
//                 </span>
//                 <span className={`ml-2 px-2 py-1 rounded text-xs ${dataSource === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
//                   {dataSource === 'live' ? 'Live' : 'Mock'}
//                 </span>
//               </div>
//               <p className="mt-4 text-gray-700 max-w-2xl">
//                 {getAQIMessage(data.current.aqi)}
//               </p>
//             </div>
            
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
//               <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl min-w-[120px]">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Wind className="text-blue-400" size={20} />
//                   <span className="text-sm text-gray-200">PM2.5</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">{data.current.pm25}</span>
//                 <span className="text-sm text-gray-300 ml-1">µg/m³</span>
//               </div>
              
//               <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Wind className="text-blue-400" size={20} />
//                   <span className="text-sm text-gray-200">PM10</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">{data.current.pm10}</span>
//                 <span className="text-sm text-gray-300 ml-1">µg/m³</span>
//               </div>
              
//               <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Wind className="text-blue-400" size={20} />
//                   <span className="text-sm text-gray-200">NO₂</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">{data.current.no2}</span>
//                 <span className="text-sm text-gray-300 ml-1">ppb</span>
//               </div>
              
//               <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Wind className="text-blue-400" size={20} />
//                   <span className="text-sm text-gray-200">CO</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">{data.current.co ?? '—'}</span>
//                 <span className="text-sm text-gray-300 ml-1">ppb</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* AQI Timeline and Health Impact */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           {/* Timeline Chart */}
//           <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm p-6 rounded-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-100">24-Hour AQI Trend</h2>
//               <div className="flex items-center gap-2 text-sm text-gray-400">
//                 <Clock size={16} />
//                 <span>Updated hourly</span>
//               </div>
//             </div>

//             <div style={{ height: 220 }}>
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={hourlyData.length ? hourlyData : data.hourly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
//                   <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
//                   <YAxis domain={[0, 'dataMax']} stroke="#9CA3AF" />
//                   <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
//                   <Line type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="flex justify-between mt-4 text-xs text-gray-500">
//               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Good</span>
//               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded"></span> Moderate</span>
//               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span> Unhealthy (S)</span>
//               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Unhealthy</span>
//               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded"></span> Very Unhealthy</span>
//               <span className="flex items-center gap-1"><span className="w-3 h-3 bg-maroon-500 rounded"></span> Hazardous</span>
//             </div>
//           </div>

//           {/* Health Impact Summary */}
//           <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
//             <h2 className="text-lg font-semibold text-gray-100 mb-4">Health Impact</h2>
//             <div className="space-y-4">
//               <div className="flex items-start gap-3">
//                 <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <AlertTriangle className="text-red-600" size={18} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-100">Sensitive Groups</p>
//                   <p className="text-sm text-gray-300">Children, elderly, and those with respiratory issues should avoid outdoor activities.</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <Activity className="text-yellow-600" size={18} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-100">General Public</p>
//                   <p className="text-sm text-gray-300">Reduce prolonged or heavy exertion outdoors.</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                   <Info className="text-green-600" size={18} />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-100">Recommended</p>
//                   <p className="text-sm text-gray-300">Wear N95 mask outdoors. Use air purifiers indoors.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Source Contribution and Weather Info */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {/* Source Contribution */}
//           <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold text-gray-100">Pollution Sources</h2>
//               <span className="text-xs text-gray-300">Today's estimate</span>
//             </div>
            
//             <div className="space-y-4">
//               {data.sources.map((source, index) => (
//                 <div key={index}>
//                   <div className="flex justify-between items-center mb-1">
//                     <div className="flex items-center gap-2">
//                       {source.icon}
//                       <span className="text-sm font-medium text-gray-200">{source.name}</span>
//                     </div>
//                     <span className="text-sm font-semibold text-white">{source.percentage}%</span>
//                   </div>
//                   <div className="w-full bg-gray-800/40 rounded-full h-2">
//                     <div 
//                       className="bg-blue-500 rounded-full h-2 transition-all duration-500"
//                       style={{ width: `${source.percentage}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//               <p className="text-xs text-blue-700">
//                 <span className="font-semibold">AI Analysis:</span> Stubble burning in Punjab/Haryana contributing to 40% of today's pollution. Consider reducing outdoor exposure.
//               </p>
//             </div>
//           </div>

//           {/* Weather Conditions */}
//           <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
//             <h2 className="text-lg font-semibold text-gray-100 mb-4">Weather Conditions</h2>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div className="bg-gray-800/40 rounded-xl p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <ThermometerSun className="text-orange-500" size={20} />
//                   <span className="text-sm text-gray-300">Temperature</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">32°C</span>
//                 <span className="text-sm text-gray-400 ml-1">Feels like 34°</span>
//               </div>
              
//               <div className="bg-gray-800/40 rounded-xl p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Droplets className="text-blue-500" size={20} />
//                   <span className="text-sm text-gray-300">Humidity</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">65%</span>
//               </div>
              
//               <div className="bg-gray-800/40 rounded-xl p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Wind className="text-gray-400" size={20} />
//                   <span className="text-sm text-gray-300">Wind Speed</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">12</span>
//                 <span className="text-sm text-gray-400 ml-1">km/h</span>
//               </div>
              
//               <div className="bg-gray-800/40 rounded-xl p-4">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Calendar className="text-purple-500" size={20} />
//                   <span className="text-sm text-gray-300">Pressure</span>
//                 </div>
//                 <span className="text-2xl font-bold text-white">1012</span>
//                 <span className="text-sm text-gray-400 ml-1">hPa</span>
//               </div>
//             </div>
            
//             <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
//               <p className="text-xs text-yellow-700">
//                 <span className="font-semibold">Weather Alert:</span> Low wind speed and high humidity may trap pollutants near ground level.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Heat Map */}
//         <div className="mb-6">
//           <HeatMap />
//         </div>

//         {/* Nearby Stations */}
//         <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
//           <h2 className="text-lg font-semibold text-gray-100 mb-4">Nearby Monitoring Stations</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {data.nearbyStations.map((station, index) => (
//               <div key={index} className="bg-gray-800/40 hover:shadow-md transition-shadow p-4 rounded-lg">
//                 <div className="flex justify-between items-start mb-2">
//                   <div>
//                     <h3 className="font-medium text-gray-100">{station.name}</h3>
//                     <p className="text-xs text-gray-400">{station.distance || (index + 1)} km away</p>
//                   </div>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAQIBgLight(station.aqi)} ${getAQITextColor(station.aqi)}`}>
//                     AQI {station.aqi}
//                   </span>
//                 </div>
//                 <div className="flex gap-2 text-xs text-gray-400">
//                   <span>PM2.5: {station.pm25}</span>
//                   <span>•</span>
//                   <span>PM10: {station.pm10}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Mock Data
// const mockAQIData = {
//   current: {
//     aqi: 312,
//     category: 'Very Unhealthy',
//     pm25: 185,
//     pm10: 245,
//     no2: 45,
//     o3: 28,
//     co: 12
//   },
//   hourly: [
//     { time: '00:00', aqi: 245 },
//     { time: '02:00', aqi: 258 },
//     { time: '04:00', aqi: 275 },
//     { time: '06:00', aqi: 298 },
//     { time: '08:00', aqi: 312 },
//     { time: '10:00', aqi: 325 },
//     { time: '12:00', aqi: 318 },
//     { time: '14:00', aqi: 305 },
//     { time: '16:00', aqi: 295 },
//     { time: '18:00', aqi: 302 },
//     { time: '20:00', aqi: 312 },
//     { time: '22:00', aqi: 308 }
//   ],
//   sources: [
//     { name: 'Stubble Burning', percentage: 40, icon: <Flame className="text-orange-500" size={16} /> },
//     { name: 'Vehicle Emissions', percentage: 25, icon: <Car className="text-blue-500" size={16} /> },
//     { name: 'Industrial', percentage: 20, icon: <Factory className="text-gray-500" size={16} /> },
//     { name: 'Dust & Construction', percentage: 15, icon: <Wind className="text-yellow-500" size={16} /> }
//   ],
//   nearbyStations: [
//     { name: 'Anand Vihar', distance: 0.5, aqi: 312, pm25: 185, pm10: 245 },
//     { name: 'ITO', distance: 2.3, aqi: 298, pm25: 172, pm10: 230 },
//     { name: 'RK Puram', distance: 4.1, aqi: 278, pm25: 158, pm10: 215 }
//   ]
// };

// export default AQIDashboard;






























import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Wind, 
  Droplets, 
  ThermometerSun, 
  Gauge,
  AlertTriangle,
  Info,
  ChevronDown,
  Clock,
  Calendar,
  Activity,
  Factory,
  Car,
  Flame
} from 'lucide-react';
import HeatMap from "../../components/Map/HeatMap";
import citizenApi from '../../api/citizenApi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const AQIDashboard = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [timeRange, setTimeRange] = useState('24h');
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('mock');
  const [hourlyData, setHourlyData] = useState([]);
  const [stationsList, setStationsList] = useState([]);
  const [alertBanner, setAlertBanner] = useState(null);

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return "green";
    if (aqi <= 100) return "yellow";
    if (aqi <= 150) return "orange";
    if (aqi <= 200) return "red";
    if (aqi <= 300) return "purple";
    return "maroon";
  };

  // Fetch real-time data from backend
  useEffect(() => {
    let mounted = true;

    const loadStations = async () => {
      try {
        const st = await citizenApi.getStations();
        if (!mounted) return;
        setStationsList(st || []);
        if (st && st.length && !selectedLocation) {
          setSelectedLocation(st[0].station);
        }
      } catch (e) {
        console.error('Failed to load stations', e);
      }
    };

    const loadData = async () => {
      if (!selectedLocation) return;
      try {
        setLoading(true);
        const json = await citizenApi.getDashboard();
        if (!mounted) return;
        setDataSource('live');

        const station = (json || []).find(s => s.station === selectedLocation);

        let sources = [];
        try {
          const sa = await citizenApi.getSourceAnalysis({ station: selectedLocation });
          if (sa && sa.sources) {
            sources = Object.entries(sa.sources).map(([k, v]) => ({ 
              name: k.charAt(0).toUpperCase() + k.slice(1), 
              percentage: Number(v) || 0, 
              icon: k === 'vehicles' ? <Car className="text-blue-500" size={16} /> : 
                    (k === 'biomass' ? <Flame className="text-orange-500" size={16} /> : 
                    <Factory className="text-gray-500" size={16} />) 
            }));
          }
        } catch (e) {
          console.warn('No source-analysis available', e);
        }

        let forecastSeries = [];
        try {
          const f = await citizenApi.getForecast({ station: selectedLocation });
          if (f && f.forecast) {
            forecastSeries = f.forecast.map(item => ({ time: item.datetime || item.hour, aqi: item.aqi }));
          }
        } catch (e) {
          console.warn('Forecast not available', e);
        }

        if (station) {
          const normalized = {
            current: {
              aqi: station.aqi ?? 0,
              category: station.category ?? 'Unknown',
              pm25: station.pollutants?.pm25 ?? 0,
              pm10: station.pollutants?.pm10 ?? 0,
              no2: station.pollutants?.no2 ?? 0,
              co: station.pollutants?.co ?? 0,
              o3: station.pollutants?.o3 ?? 0
            },
            hourly: forecastSeries.length ? forecastSeries : (json || []).slice(0, 12).map((s, i) => ({ time: s.datetime ?? `T+${i}`, aqi: s.aqi ?? s.dominant_percent ?? 0 })),
            sources: sources,
            nearbyStations: (json || []).map(s => ({ name: s.station, aqi: s.aqi ?? s.dominant_percent ?? 0, pm25: s.pollutants?.pm25 ?? 0, pm10: s.pollutants?.pm10 ?? 0, alert: s.alert }))
          };
          setAqiData(normalized);
        } else if ((json || []).length) {
          const first = json[0];
          const normalized = {
            current: {
              aqi: first.aqi ?? first.dominant_percent ?? 0,
              category: first.category ?? 'Unknown',
              pm25: first.pollutants?.pm25 ?? 0,
              pm10: first.pollutants?.pm10 ?? 0,
              no2: first.pollutants?.no2 ?? 0,
              co: first.pollutants?.co ?? 0,
              o3: first.pollutants?.o3 ?? 0
            },
            hourly: forecastSeries.length ? forecastSeries : (json || []).slice(0, 12).map((s, i) => ({ time: s.datetime ?? `T+${i}`, aqi: s.aqi ?? s.dominant_percent ?? 0 })),
            sources: sources,
            nearbyStations: (json || []).slice(0, 6).map(s => ({ name: s.station, aqi: s.aqi ?? s.dominant_percent ?? 0, pm25: s.pollutants?.pm25 ?? 0, pm10: s.pollutants?.pm10 ?? 0, alert: s.alert }))
          };
          setAqiData(normalized);
        } else {
          setAqiData(mockAQIData);
          setDataSource('mock');
        }

        const anyAlert = (json || []).some(s => s.alert === true);
        setAlertBanner(anyAlert ? 'High pollution alert active in some stations' : null);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setAqiData(mockAQIData);
        setLoading(false);
        setDataSource('mock');
      }
    };

    loadStations();
    loadData();
    const id = setInterval(() => { loadData(); }, 30000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [selectedLocation]);

  const getAQITextColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 200) return 'text-orange-600';
    if (aqi <= 300) return 'text-red-600';
    if (aqi <= 400) return 'text-purple-600';
    return 'text-maroon-600';
  };

  const getAQIBgLight = (aqi) => {
    if (aqi <= 50) return 'bg-green-50';
    if (aqi <= 100) return 'bg-yellow-50';
    if (aqi <= 200) return 'bg-orange-50';
    if (aqi <= 300) return 'bg-red-50';
    if (aqi <= 400) return 'bg-purple-50';
    return 'bg-red-100';
  };

  const getAQIMessage = (aqi) => {
    if (aqi <= 50) return 'Air quality is satisfactory, no health risk.';
    if (aqi <= 100) return 'Air quality is acceptable. Sensitive individuals should limit outdoor activity.';
    if (aqi <= 200) return 'Sensitive groups may experience health effects. General public less likely affected.';
    if (aqi <= 300) return 'Health alert: Everyone may experience serious health effects.';
    if (aqi <= 400) return 'Health emergency: Everyone likely affected seriously.';
    return 'Hazardous conditions: Stay indoors, keep windows closed.';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading air quality data...</p>
        </div>
      </div>
    );
  }

  const data = aqiData || mockAQIData;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-800/90 backdrop-blur-sm border-b border-gray-700">
        <div className="w-full px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">AQI Dashboard</h1>
              <p className="text-sm text-gray-400">Real-time air quality monitoring for Delhi-NCR</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select 
                  aria-label="Select monitoring station"
                  className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none text-gray-200"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {stationsList.length > 0 ? (
                    stationsList.map((station, idx) => (
                      <option key={idx} value={station.station || station}>{station.station || station}</option>
                    ))
                  ) : (
                    <>
                      <option>Anand Vihar, Delhi</option>
                      <option>RK Puram, Delhi</option>
                      <option>Dwarka, Delhi</option>
                      <option>Noida Sector 62</option>
                      <option>Gurugram Sector 51</option>
                      <option>Faridabad Sector 16</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="flex bg-gray-700 rounded-lg p-1">
                <button 
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '24h' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setTimeRange('24h')}
                >
                  24H
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '7d' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setTimeRange('7d')}
                >
                  7D
                </button>
                <button 
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${timeRange === '30d' ? 'bg-blue-500 text-white' : 'text-gray-300 hover:text-white'}`}
                  onClick={() => setTimeRange('30d')}
                >
                  30D
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dataSource === 'mock' && (
          <div className="mb-4">
            <div className="rounded-md bg-yellow-900/50 border-l-4 border-yellow-400 p-3 text-yellow-200">
              <strong>Mock data:</strong> This view is displaying fallback/mock data for development/testing.
            </div>
          </div>
        )}
        
        {/* Main AQI Card */}
        <div className={`mb-6 p-6 rounded-lg transition-colors duration-500 ${getAQIBgLight(data.current.aqi)}`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gauge className={getAQITextColor(data.current.aqi)} size={24} />
                <span className="text-sm font-medium text-gray-600">Current AQI</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className={`text-6xl font-bold ${getAQITextColor(data.current.aqi)}`}>
                  {data.current.aqi}
                </span>
                <span className="text-xl text-gray-600">/ 500</span>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAQIBgLight(data.current.aqi)} ${getAQITextColor(data.current.aqi)}`}>
                  {data.current.category}
                </span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${dataSource === 'live' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                  {dataSource === 'live' ? 'Live' : 'Mock'}
                </span>
              </div>
              <p className="mt-4 text-gray-700 max-w-2xl">
                {getAQIMessage(data.current.aqi)}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl min-w-[120px]">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-blue-400" size={20} />
                  <span className="text-sm text-gray-200">PM2.5</span>
                </div>
                <span className="text-2xl font-bold text-white">{data.current.pm25}</span>
                <span className="text-sm text-gray-300 ml-1">µg/m³</span>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-blue-400" size={20} />
                  <span className="text-sm text-gray-200">PM10</span>
                </div>
                <span className="text-2xl font-bold text-white">{data.current.pm10}</span>
                <span className="text-sm text-gray-300 ml-1">µg/m³</span>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-blue-400" size={20} />
                  <span className="text-sm text-gray-200">NO₂</span>
                </div>
                <span className="text-2xl font-bold text-white">{data.current.no2}</span>
                <span className="text-sm text-gray-300 ml-1">ppb</span>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-blue-400" size={20} />
                  <span className="text-sm text-gray-200">CO</span>
                </div>
                <span className="text-2xl font-bold text-white">{data.current.co ?? '—'}</span>
                <span className="text-sm text-gray-300 ml-1">ppb</span>
              </div>
            </div>
          </div>
        </div>

        {/* AQI Timeline and Health Impact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">24-Hour AQI Trend</h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={16} />
                <span>Updated hourly</span>
              </div>
            </div>

            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData.length ? hourlyData : data.hourly} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                  <YAxis domain={[0, 'dataMax']} stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="aqi" stroke="#ef4444" strokeWidth={2} dot={{ r: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Good</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded"></span> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded"></span> Unhealthy (S)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Unhealthy</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-purple-500 rounded"></span> Very Unhealthy</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-maroon-500 rounded"></span> Hazardous</span>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Health Impact</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="text-red-400" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Sensitive Groups</p>
                  <p className="text-sm text-gray-400">Children, elderly, and those with respiratory issues should avoid outdoor activities.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="text-yellow-400" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">General Public</p>
                  <p className="text-sm text-gray-400">Reduce prolonged or heavy exertion outdoors.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="text-green-400" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Recommended</p>
                  <p className="text-sm text-gray-400">Wear N95 mask outdoors. Use air purifiers indoors.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Source Contribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Pollution Sources</h2>
              <span className="text-xs text-gray-400">Today's estimate</span>
            </div>
            
            <div className="space-y-4">
              {data.sources.map((source, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      {source.icon}
                      <span className="text-sm font-medium text-gray-300">{source.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-white">{source.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Conditions */}
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-4">Weather Conditions</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ThermometerSun className="text-orange-500" size={20} />
                  <span className="text-sm text-gray-400">Temperature</span>
                </div>
                <span className="text-2xl font-bold text-white">32°C</span>
                <span className="text-sm text-gray-500 ml-1">Feels like 34°</span>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="text-blue-500" size={20} />
                  <span className="text-sm text-gray-400">Humidity</span>
                </div>
                <span className="text-2xl font-bold text-white">65%</span>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wind className="text-gray-400" size={20} />
                  <span className="text-sm text-gray-400">Wind Speed</span>
                </div>
                <span className="text-2xl font-bold text-white">12</span>
                <span className="text-sm text-gray-500 ml-1">km/h</span>
              </div>
              
              <div className="bg-gray-700/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-purple-500" size={20} />
                  <span className="text-sm text-gray-400">Pressure</span>
                </div>
                <span className="text-2xl font-bold text-white">1012</span>
                <span className="text-sm text-gray-500 ml-1">hPa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heat Map */}
        <div className="mb-6">
          <HeatMap />
        </div>

      </div>
    </div>
  );
};
        

// Mock Data
const mockAQIData = {
  current: {
    aqi: 312,
    category: 'Very Unhealthy',
    pm25: 185,
    pm10: 245,
    no2: 45,
    o3: 28,
    co: 12
  },
  hourly: [
    { time: '00:00', aqi: 245 },
    { time: '02:00', aqi: 258 },
    { time: '04:00', aqi: 275 },
    { time: '06:00', aqi: 298 },
    { time: '08:00', aqi: 312 },
    { time: '10:00', aqi: 325 },
    { time: '12:00', aqi: 318 },
    { time: '14:00', aqi: 305 },
    { time: '16:00', aqi: 295 },
    { time: '18:00', aqi: 302 },
    { time: '20:00', aqi: 312 },
    { time: '22:00', aqi: 308 }
  ],
  sources: [
    { name: 'Stubble Burning', percentage: 40, icon: <Flame className="text-orange-500" size={16} /> },
    { name: 'Vehicle Emissions', percentage: 25, icon: <Car className="text-blue-500" size={16} /> },
    { name: 'Industrial', percentage: 20, icon: <Factory className="text-gray-500" size={16} /> },
    { name: 'Dust & Construction', percentage: 15, icon: <Wind className="text-yellow-500" size={16} /> }
  ],
  nearbyStations: [
    { name: 'Anand Vihar', distance: 0.5, aqi: 312, pm25: 185, pm10: 245 },
    { name: 'ITO', distance: 2.3, aqi: 298, pm25: 172, pm10: 230 },
    { name: 'RK Puram', distance: 4.1, aqi: 278, pm25: 158, pm10: 215 }
  ]
};

export default AQIDashboard;