import React, { useState } from 'react';
import { 
  Target, 
  Car, 
  Factory, 
  Wind,
  Flame,
  TrendingDown,
  CheckCircle,
  XCircle,
  Info,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import PolicySidebar from '../../components/Layout/PolicySidebar';

const PolicyRecommendations = () => {
  const [selectedPolicy, setSelectedPolicy] = useState('traffic');

  const policies = {
    traffic: {
      icon: Car,
      title: 'Traffic Regulation',
      description: 'Implement odd-even scheme and restrict heavy vehicles',
      impact: 28,
      confidence: 85,
      timeline: 'Immediate',
      cost: 'Medium',
      beforeAfter: { before: 312, after: 225 },
      explanation: 'Based on historical data, odd-even scheme reduces traffic volume by 20%, leading to 28% reduction in vehicular emissions during peak hours.',
      implementation: [
        'Odd-even scheme from 8 AM to 8 PM',
        'Ban on heavy vehicles 6 AM - 10 PM',
        'Increase public transport frequency',
        'Deploy traffic police at key intersections'
      ]
    },
    industry: {
      icon: Factory,
      title: 'Industrial Emission Control',
      description: 'Temporary shutdown of highly polluting industries',
      impact: 18,
      confidence: 92,
      timeline: '24-48 hours',
      cost: 'High',
      beforeAfter: { before: 312, after: 256 },
      explanation: 'Hotspot industries in NCR contribute 18% to PM2.5. Selective shutdown can achieve significant reduction.',
      implementation: [
        'Identify top 50 polluting units',
        'Implement 72-hour shutdown',
        'Deploy monitoring teams',
        'Provide alternative power supply'
      ]
    },
    dust: {
      icon: Wind,
      title: 'Construction Dust Control',
      description: 'Halt construction activities and implement dust mitigation',
      impact: 12,
      confidence: 78,
      timeline: 'Immediate',
      cost: 'Low',
      beforeAfter: { before: 312, after: 275 },
      explanation: 'Construction dust contributes 12% to ambient PM2.5. Water sprinkling and site covers can reduce this by 60%.',
      implementation: [
        'Stop all construction',
        'Cover material stockpiles',
        'Water sprinkling on roads',
        'Anti-smog guns at sites'
      ]
    },
    biomass: {
      icon: Flame,
      title: 'Biomass Burning Control',
      description: 'Enforce stubble burning ban and promote alternatives',
      impact: 42,
      confidence: 88,
      timeline: 'Seasonal',
      cost: 'High',
      beforeAfter: { before: 312, after: 181 },
      explanation: 'Stubble burning is the largest contributor. Immediate ban with farmer compensation can reduce peak pollution.',
      implementation: [
        'Strict enforcement of burning ban',
        'Deploy satellite monitoring',
        'Provide crop residue machines',
        'Financial incentives for farmers'
      ]
    }
  };

  const currentPolicy = policies[selectedPolicy];

  return (
    <>
      <PolicySidebar />
      <main className="main-content">
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-white">Policy Recommendations</h1>

      {/* Policy Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(policies).map(([key, policy]) => {
          const Icon = policy.icon;
          const isSelected = selectedPolicy === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedPolicy(key)}
              className={`p-4 rounded-xl border transition-all ${
                isSelected 
                  ? 'bg-blue-accent/20 border-blue-accent shadow-lg shadow-blue-accent/10' 
                  : 'bg-blue-deep border-blue-medium hover:border-blue-light'
              }`}
            >
              <Icon className={`h-6 w-6 mb-2 ${isSelected ? 'text-blue-accent' : 'text-gray-400'}`} />
              <p className={`text-sm font-medium ${isSelected ? 'text-blue-accent' : 'text-gray-300'}`}>
                {policy.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">Impact: {policy.impact}%</p>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Policy Details */}
        <div className="card lg:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-accent/20 rounded-xl">
                <currentPolicy.icon className="h-8 w-8 text-blue-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentPolicy.title}</h2>
                <p className="text-sm text-gray-400">{currentPolicy.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Confidence:</span>
              <span className="text-lg font-bold text-blue-accent">{currentPolicy.confidence}%</span>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-blue-medium/30 rounded-lg">
              <p className="text-sm text-gray-400">Expected Impact</p>
              <p className="text-2xl font-bold text-green-400">-{currentPolicy.impact}%</p>
              <p className="text-xs text-gray-500">AQI reduction</p>
            </div>
            <div className="text-center p-3 bg-blue-medium/30 rounded-lg">
              <p className="text-sm text-gray-400">Timeline</p>
              <p className="text-lg font-bold text-white">{currentPolicy.timeline}</p>
            </div>
            <div className="text-center p-3 bg-blue-medium/30 rounded-lg">
              <p className="text-sm text-gray-400">Implementation Cost</p>
              <p className="text-lg font-bold text-yellow-400">{currentPolicy.cost}</p>
            </div>
          </div>

          {/* Before/After Comparison */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-300 mb-3">Expected AQI Impact</h3>
            <div className="flex items-center justify-between p-4 bg-blue-medium/30 rounded-lg">
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">Before</p>
                <p className="text-2xl font-bold text-red-400">{currentPolicy.beforeAfter.before}</p>
                <p className="text-xs text-gray-500">Current AQI</p>
              </div>
              <TrendingDown className="h-6 w-6 text-green-400 mx-4" />
              <div className="text-center flex-1">
                <p className="text-xs text-gray-400 mb-1">After</p>
                <p className="text-2xl font-bold text-green-400">{currentPolicy.beforeAfter.after}</p>
                <p className="text-xs text-gray-500">Expected AQI</p>
              </div>
            </div>
          </div>

          {/* Implementation Steps */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-3">Implementation Steps</h3>
            <div className="space-y-2">
              {currentPolicy.implementation.map((step, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 hover:bg-blue-medium/30 rounded-lg transition-colors">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Explanation & Sidebar */}
        <div className="space-y-6">
          {/* AI Explanation */}
          <div className="card">
            <div className="flex items-start space-x-3 mb-4">
              <Info className="h-5 w-5 text-blue-accent flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-accent mb-2">Why this recommendation?</h3>
                <p className="text-sm text-gray-300">{currentPolicy.explanation}</p>
              </div>
            </div>
          </div>

          {/* Historical Effectiveness */}
          <div className="card">
            <h3 className="text-sm font-medium mb-3">Historical Effectiveness</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Previous implementations</span>
                <span className="text-sm text-white">3 times</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Average success rate</span>
                <span className="text-sm text-green-400">76%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Best result</span>
                <span className="text-sm text-white">-32% AQI</span>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="card border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-yellow-400 mb-2">Risk Factors</h3>
                <ul className="space-y-1 text-xs text-gray-300">
                  <li>• Public compliance may vary</li>
                  <li>• Economic impact on businesses</li>
                  <li>• Enforcement challenges</li>
                  <li>• Weather conditions may affect outcome</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combined Impact Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Combined Policy Impact Analysis</h2>
          <BarChart3 className="h-5 w-5 text-blue-accent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-b from-blue-accent/20 to-transparent rounded-lg">
            <p className="text-3xl font-bold text-blue-accent mb-1">100%</p>
            <p className="text-sm text-gray-400">Combined Impact</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-green-500/20 to-transparent rounded-lg">
            <p className="text-3xl font-bold text-green-400 mb-1">312 → 156</p>
            <p className="text-sm text-gray-400">Projected AQI</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-yellow-500/20 to-transparent rounded-lg">
            <p className="text-3xl font-bold text-yellow-400 mb-1">84%</p>
            <p className="text-sm text-gray-400">Overall Confidence</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-purple-500/20 to-transparent rounded-lg">
            <p className="text-3xl font-bold text-purple-400 mb-1">3 Days</p>
            <p className="text-sm text-gray-400">Estimated Time</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          Implementing all policies simultaneously could reduce AQI by 50%, bringing it to "Poor" from "Very Poor" category
        </p>
      </div>
        </div>
      </main>
    </>
  );
};

export default PolicyRecommendations;