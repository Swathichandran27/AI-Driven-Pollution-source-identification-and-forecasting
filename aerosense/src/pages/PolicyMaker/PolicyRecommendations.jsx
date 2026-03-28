// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Target, Car, Factory, Wind, Flame, TrendingDown,
//   CheckCircle, Info, BarChart3, AlertCircle, ArrowRight, Zap
// } from 'lucide-react';
// import {
//   ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
//   CartesianGrid, Tooltip, Cell
// } from 'recharts';
// import PolicySidebar from '../../components/Layout/PolicySidebar';

// const iconMap = { traffic: Car, industry: Factory, dust: Wind, biomass: Flame };
// const colorMap = {
//   traffic:  { bg: 'from-blue-900/40 to-blue-800/20',  border: 'border-blue-600/40',  accent: '#3b82f6', badge: 'bg-blue-500/20 text-blue-300' },
//   industry: { bg: 'from-orange-900/40 to-orange-800/20', border: 'border-orange-600/40', accent: '#f97316', badge: 'bg-orange-500/20 text-orange-300' },
//   dust:     { bg: 'from-yellow-900/40 to-yellow-800/20', border: 'border-yellow-600/40', accent: '#eab308', badge: 'bg-yellow-500/20 text-yellow-300' },
//   biomass:  { bg: 'from-green-900/40 to-green-800/20',  border: 'border-green-600/40',  accent: '#22c55e', badge: 'bg-green-500/20 text-green-300' },
// };

// const PolicyRecommendations = () => {
//   const [policies, setPolicies] = useState({});
//   const [selected, setSelected] = useState('traffic');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('http://localhost:5000/api/policy/recommendations')
//       .then(res => {
//         setPolicies(res.data);
//         // Select the policy with highest impact by default
//         const dominant = Object.entries(res.data).reduce((a, b) => a[1].impact > b[1].impact ? a : b)[0];
//         setSelected(dominant);
//       })
//       .catch(err => console.error(err))
//       .finally(() => setLoading(false));
//   }, []);

//   const policy = policies[selected];
//   const Icon = iconMap[selected] || Target;
//   const colors = colorMap[selected] || colorMap.traffic;

//   const combinedImpact = Object.values(policies).reduce((s, p) => s + (p.impact || 0), 0);
//   const avgConfidence = Object.values(policies).length
//     ? Math.round(Object.values(policies).reduce((s, p) => s + (p.confidence || 0), 0) / Object.values(policies).length)
//     : 0;
//   const firstPolicy = Object.values(policies)[0];
//   const beforeAqi = firstPolicy?.beforeAfter?.before || 0;
//   const bestAfter = Object.values(policies).reduce((min, p) => Math.min(min, p.beforeAfter?.after || 999), 999);

//   const barData = Object.entries(policies).map(([key, p]) => ({
//     name: p.title?.split(' ')[0],
//     impact: p.impact,
//     color: colorMap[key]?.accent || '#4c8a71'
//   }));

//   if (loading) return (
//     <div className="flex min-h-screen bg-slate-900">
//       <PolicySidebar />
//       <main className="flex-1 flex items-center justify-center">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-slate-400 text-sm">Loading recommendations...</p>
//         </div>
//       </main>
//     </div>
//   );

//   return (
//     <div className="flex min-h-screen bg-slate-900">
//       <PolicySidebar />
//       <main className="flex-1 p-8 overflow-y-auto">
//         <div className="max-w-7xl mx-auto space-y-6">

//           {/* HEADER */}
//           <div>
//             <h1 className="text-2xl font-black text-white flex items-center gap-2">
//               <Target className="h-6 w-6 text-emerald-400" />
//               Policy Recommendations
//             </h1>
//             <p className="text-slate-400 text-sm mt-1">AI-driven intervention strategies based on current pollution data</p>
//           </div>

//           {/* POLICY SELECTOR TABS */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {Object.entries(policies)
//               .sort((a, b) => b[1].impact - a[1].impact)
//               .map(([key, p]) => {
//               const IconBtn = iconMap[key] || Target;
//               const c = colorMap[key];
//               const isSelected = selected === key;
//               return (
//                 <button
//                   key={key}
//                   onClick={() => setSelected(key)}
//                   className={`p-4 rounded-xl border transition-all text-left ${
//                     isSelected
//                       ? `bg-gradient-to-br ${c.bg} ${c.border} shadow-lg`
//                       : 'bg-slate-800/60 border-slate-700/50 hover:border-slate-500'
//                   }`}
//                 >
//                   <IconBtn className="h-5 w-5 mb-2" style={{ color: isSelected ? c.accent : '#94a3b8' }} />
//                   <p className="text-sm font-bold" style={{ color: isSelected ? c.accent : '#cbd5e1' }}>{p.title}</p>
//                   <p className="text-xs text-slate-400 mt-1">{p.source_pct}% of total pollution</p>
//                   <div className="mt-2 h-1 rounded-full bg-slate-700">
//                     <div className="h-1 rounded-full" style={{ width: `${p.source_pct}%`, backgroundColor: c.accent }} />
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* MAIN CONTENT */}
//           {policy && (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

//               {/* LEFT - POLICY DETAILS */}
//               <div className={`lg:col-span-2 bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-6 space-y-5`}>

//                 {/* Title Row */}
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="p-3 rounded-xl bg-slate-800/60">
//                       <Icon className="h-7 w-7" style={{ color: colors.accent }} />
//                     </div>
//                     <div>
//                       <h2 className="text-xl font-black text-white">{policy.title}</h2>
//                       <p className="text-slate-400 text-sm">{policy.description}</p>
//                     </div>
//                   </div>
//                   <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
//                     {policy.confidence}% Confidence
//                   </span>
//                 </div>

//                 {/* Stats Row */}
//                 <div className="grid grid-cols-3 gap-3">
//                   {[
//                     { label: 'Source Contribution', value: `${policy.source_pct}%`, color: colors.accent },
//                     { label: 'Timeline', value: policy.timeline, color: '#f59e0b' },
//                     { label: 'Cost', value: policy.cost, color: '#a78bfa' },
//                   ].map((s) => (
//                     <div key={s.label} className="bg-slate-800/60 rounded-xl p-3 text-center">
//                       <p className="text-slate-400 text-xs mb-1">{s.label}</p>
//                       <p className="font-black text-sm" style={{ color: s.color }}>{s.value}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Implementation Steps */}
//                 <div>
//                   <p className="text-slate-300 text-sm font-bold mb-3">Implementation Steps</p>
//                   <div className="space-y-2">
//                     {policy.implementation?.map((step, i) => (
//                       <div key={i} className="flex items-center gap-3 bg-slate-800/40 rounded-lg p-2.5">
//                         <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
//                           style={{ backgroundColor: colors.accent + '30', color: colors.accent }}>
//                           {i + 1}
//                         </div>
//                         <span className="text-sm text-slate-300">{step}</span>
//                         <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* RIGHT PANEL */}
//               <div className="space-y-4">

//                 {/* Why this recommendation */}
//                 <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <Info className="h-4 w-4 text-blue-400" />
//                     <h3 className="text-blue-400 font-bold text-sm">Why this recommendation?</h3>
//                   </div>
//                   <p className="text-slate-300 text-sm leading-relaxed">{policy.explanation}</p>
//                 </div>

//                 {/* Risk Factors */}
//                 <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-2xl p-4">
//                   <div className="flex items-center gap-2 mb-3">
//                     <AlertCircle className="h-4 w-4 text-yellow-400" />
//                     <h3 className="text-yellow-400 font-bold text-sm">Risk Factors</h3>
//                   </div>
//                   <ul className="space-y-1.5">
//                     {policy.risks?.map((r, i) => (
//                       <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
//                         <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
//                         {r}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>

//                 {/* Impact Chart */}
//                 <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
//                   <p className="text-slate-300 text-sm font-bold mb-3 flex items-center gap-2">
//                     <BarChart3 className="h-4 w-4 text-emerald-400" />
//                     Policy Impact Comparison
//                   </p>
//                   <ResponsiveContainer width="100%" height={150}>
//                     <BarChart data={barData} barSize={28}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
//                       <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
//                       <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} unit="%" />
//                       <Tooltip
//                         formatter={(v) => [`${v}%`, 'AQI Reduction']}
//                         contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
//                         labelStyle={{ color: '#94a3b8' }}
//                       />
//                       <Bar dataKey="impact" radius={[4, 4, 0, 0]}>
//                         {barData.map((entry, i) => (
//                           <Cell key={i} fill={entry.color} />
//                         ))}
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* COMBINED IMPACT SUMMARY */}
//           <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-white font-black flex items-center gap-2">
//                 <Zap className="h-5 w-5 text-emerald-400" />
//                 Combined Policy Impact
//               </h2>
//               <span className="text-xs text-slate-400">If all policies implemented together</span>
//             </div>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="text-center bg-slate-700/40 rounded-xl p-4">
//                 <p className="text-3xl font-black text-blue-400">{combinedImpact}%</p>
//                 <p className="text-slate-400 text-xs mt-1">Total Impact</p>
//               </div>
//               <div className="text-center bg-slate-700/40 rounded-xl p-4">
//                 <p className="text-2xl font-black text-emerald-400">{beforeAqi} → {bestAfter}</p>
//                 <p className="text-slate-400 text-xs mt-1">AQI Reduction</p>
//               </div>
//               <div className="text-center bg-slate-700/40 rounded-xl p-4">
//                 <p className="text-3xl font-black text-yellow-400">{avgConfidence}%</p>
//                 <p className="text-slate-400 text-xs mt-1">Avg Confidence</p>
//               </div>
//               <div className="text-center bg-slate-700/40 rounded-xl p-4">
//                 <p className="text-3xl font-black text-purple-400">2 Wks</p>
//                 <p className="text-slate-400 text-xs mt-1">Est. Timeline</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </main>
//     </div>
//   );
// };

// export default PolicyRecommendations;




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Target, Car, Factory, Wind, Flame,
  CheckCircle, Info, BarChart3, AlertCircle, Zap
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts';
import PolicySidebar from '../../components/Layout/PolicySidebar';

const iconMap = { traffic: Car, industry: Factory, dust: Wind, biomass: Flame };
const colorMap = {
  traffic:  { bg: 'from-blue-900/40 to-blue-800/20',   border: 'border-blue-600/40',   accent: '#3b82f6', badge: 'bg-blue-500/20 text-blue-300' },
  industry: { bg: 'from-orange-900/40 to-orange-800/20', border: 'border-orange-600/40', accent: '#f97316', badge: 'bg-orange-500/20 text-orange-300' },
  dust:     { bg: 'from-yellow-900/40 to-yellow-800/20', border: 'border-yellow-600/40', accent: '#eab308', badge: 'bg-yellow-500/20 text-yellow-300' },
  biomass:  { bg: 'from-green-900/40 to-green-800/20',  border: 'border-green-600/40',  accent: '#22c55e', badge: 'bg-green-500/20 text-green-300' },
};

const PolicyRecommendations = () => {
  // ✅ ALL useState hooks inside the component
  const [policies, setPolicies] = useState({});
  const [selected, setSelected] = useState('traffic');
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [insightsLoading, setInsightsLoading] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/policy/recommendations')
      .then(res => {
        setPolicies(res.data);
        const dominant = Object.entries(res.data).reduce((a, b) =>
          a[1].impact > b[1].impact ? a : b
        )[0];
        setSelected(dominant);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const fetchInsights = async () => {
    setInsightsLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/policy/ai-insights');
      setInsights(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setInsightsLoading(false);
    }
  };

  const policy   = policies[selected];
  const Icon     = iconMap[selected] || Target;
  const colors   = colorMap[selected] || colorMap.traffic;

  const combinedImpact = Object.values(policies).reduce((s, p) => s + (p.impact || 0), 0);
  const avgConfidence  = Object.values(policies).length
    ? Math.round(Object.values(policies).reduce((s, p) => s + (p.confidence || 0), 0) / Object.values(policies).length)
    : 0;
  const firstPolicy = Object.values(policies)[0];
  const beforeAqi   = firstPolicy?.beforeAfter?.before || 0;
  const bestAfter   = Object.values(policies).reduce((min, p) => Math.min(min, p.beforeAfter?.after || 999), 999);

  const barData = Object.entries(policies).map(([key, p]) => ({
    name:   p.title?.split(' ')[0],
    impact: p.impact,
    color:  colorMap[key]?.accent || '#4c8a71'
  }));

  if (loading) return (
    <div className="flex min-h-screen bg-slate-900">
      <PolicySidebar />
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading recommendations...</p>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-900">
      <PolicySidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Target className="h-6 w-6 text-emerald-400" />
              Policy Recommendations
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              AI-driven intervention strategies based on current pollution data
            </p>
          </div>

          {/* POLICY SELECTOR TABS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(policies)
              .sort((a, b) => b[1].impact - a[1].impact)
              .map(([key, p]) => {
                const IconBtn  = iconMap[key] || Target;
                const c        = colorMap[key];
                const isSelected = selected === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      isSelected
                        ? `bg-gradient-to-br ${c.bg} ${c.border} shadow-lg`
                        : 'bg-slate-800/60 border-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <IconBtn className="h-5 w-5 mb-2" style={{ color: isSelected ? c.accent : '#94a3b8' }} />
                    <p className="text-sm font-bold" style={{ color: isSelected ? c.accent : '#cbd5e1' }}>{p.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{p.source_pct}% of total pollution</p>
                    <div className="mt-2 h-1 rounded-full bg-slate-700">
                      <div className="h-1 rounded-full" style={{ width: `${p.source_pct}%`, backgroundColor: c.accent }} />
                    </div>
                  </button>
                );
              })}
          </div>

          {/* MAIN CONTENT */}
          {policy && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* LEFT - POLICY DETAILS */}
              <div className={`lg:col-span-2 bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-6 space-y-5`}>

                {/* Title Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-slate-800/60">
                      <Icon className="h-7 w-7" style={{ color: colors.accent }} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white">{policy.title}</h2>
                      <p className="text-slate-400 text-sm">{policy.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors.badge}`}>
                    {policy.confidence}% Confidence
                  </span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Source Contribution', value: `${policy.source_pct}%`, color: colors.accent },
                    { label: 'Timeline',             value: policy.timeline,         color: '#f59e0b' },
                    { label: 'Cost',                 value: policy.cost,             color: '#a78bfa' },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-800/60 rounded-xl p-3 text-center">
                      <p className="text-slate-400 text-xs mb-1">{s.label}</p>
                      <p className="font-black text-sm" style={{ color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Implementation Steps */}
                <div>
                  <p className="text-slate-300 text-sm font-bold mb-3">Implementation Steps</p>
                  <div className="space-y-2">
                    {policy.implementation?.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-800/40 rounded-lg p-2.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ backgroundColor: colors.accent + '30', color: colors.accent }}
                        >
                          {i + 1}
                        </div>
                        <span className="text-sm text-slate-300">{step}</span>
                        <CheckCircle className="h-4 w-4 text-emerald-500 ml-auto shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="space-y-4">

                {/* Why this recommendation */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-blue-400" />
                    <h3 className="text-blue-400 font-bold text-sm">Why this recommendation?</h3>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{policy.explanation}</p>
                </div>

                {/* Risk Factors */}
                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                    <h3 className="text-yellow-400 font-bold text-sm">Risk Factors</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {policy.risks?.map((r, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Impact Chart */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
                  <p className="text-slate-300 text-sm font-bold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-emerald-400" />
                    Policy Impact Comparison
                  </p>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={barData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} unit="%" />
                      <Tooltip
                        formatter={(v) => [`${v}%`, 'AQI Reduction']}
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                        labelStyle={{ color: '#94a3b8' }}
                      />
                      <Bar dataKey="impact" radius={[4, 4, 0, 0]}>
                        {barData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* COMBINED IMPACT SUMMARY */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-black flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-400" />
                Combined Policy Impact
              </h2>
              <span className="text-xs text-slate-400">If all policies implemented together</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center bg-slate-700/40 rounded-xl p-4">
                <p className="text-3xl font-black text-blue-400">{combinedImpact}%</p>
                <p className="text-slate-400 text-xs mt-1">Total Impact</p>
              </div>
              <div className="text-center bg-slate-700/40 rounded-xl p-4">
                <p className="text-2xl font-black text-emerald-400">{beforeAqi} → {bestAfter}</p>
                <p className="text-slate-400 text-xs mt-1">AQI Reduction</p>
              </div>
              <div className="text-center bg-slate-700/40 rounded-xl p-4">
                <p className="text-3xl font-black text-yellow-400">{avgConfidence}%</p>
                <p className="text-slate-400 text-xs mt-1">Avg Confidence</p>
              </div>
              <div className="text-center bg-slate-700/40 rounded-xl p-4">
                <p className="text-3xl font-black text-purple-400">2 Wks</p>
                <p className="text-slate-400 text-xs mt-1">Est. Timeline</p>
              </div>
            </div>
          </div>

          {/* AI INSIGHTS SECTION */}
          <div className="bg-slate-800/60 border border-emerald-700/40 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-black flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-400" />
                AI-Generated Insights
              </h2>
              <button
                onClick={fetchInsights}
                disabled={insightsLoading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700
                           disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-all"
              >
                {insightsLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Generate Insights
                  </>
                )}
              </button>
            </div>

            {!insights && !insightsLoading && (
              <div className="text-center py-8 text-slate-400 text-sm">
                Click "Generate Insights" to get AI-powered policy recommendations
                based on your live pollution data
              </div>
            )}

            {insights && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Summary */}
                <div className="md:col-span-2 bg-blue-900/20 border border-blue-700/40 rounded-xl p-4">
                  <p className="text-blue-400 font-bold text-sm mb-2">📋 Situation Summary</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{insights.summary}</p>
                </div>

                {/* Policy Interventions */}
                <div className="bg-red-900/20 border border-red-700/40 rounded-xl p-4">
                  <p className="text-red-400 font-bold text-sm mb-3">🏛️ Policy Interventions</p>
                  <div className="space-y-2">
                    {insights.policy_interventions?.map((item, i) => (
                      <div key={i} className="flex gap-2 bg-slate-800/60 rounded-lg p-2.5">
                        <span className="text-red-400 font-bold text-xs shrink-0">{i + 1}.</span>
                        <span className="text-slate-300 text-xs">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Citizen Advisories */}
                <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-4">
                  <p className="text-yellow-400 font-bold text-sm mb-3">👥 Citizen Advisories</p>
                  <div className="space-y-2">
                    {insights.citizen_advisories?.map((item, i) => (
                      <div key={i} className="flex gap-2 bg-slate-800/60 rounded-lg p-2.5">
                        <span className="text-yellow-400 text-xs shrink-0">⚠️</span>
                        <span className="text-slate-300 text-xs">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* High Risk Window */}
                <div className="bg-orange-900/20 border border-orange-700/40 rounded-xl p-4">
                  <p className="text-orange-400 font-bold text-sm mb-2">⏰ High Risk Window</p>
                  <p className="text-slate-300 text-sm">{insights.high_risk_window}</p>
                </div>

                {/* Intervention Effectiveness */}
                <div className="bg-green-900/20 border border-green-700/40 rounded-xl p-4">
                  <p className="text-green-400 font-bold text-sm mb-3">📊 Intervention Effectiveness</p>
                  <div className="space-y-2">
                    {insights.intervention_effectiveness &&
                      Object.entries(insights.intervention_effectiveness).map(([key, val]) => (
                        <div key={key} className="flex justify-between bg-slate-800/60 rounded-lg p-2.5">
                          <span className="text-slate-400 text-xs capitalize">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="text-green-400 text-xs font-bold">{val}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default PolicyRecommendations;