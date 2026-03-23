// src/pages/Citizen/HealthAdvisory.jsx
import React, { useState, useEffect } from 'react';
// import { 
//   ArrowLeft,
//   Heart,
//   Activity,
//   Moon,
//   Sun,
//   Wind,
//   Droplets,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   Info,
//   Shield,
//   Users,
//   Baby,
//   HeartPulse,
//   Lungs,
//   Eye,
//   Headphones,
//   Leaf,
//   Apple,
//   Coffee,
//   Home,
//   Car,
//   Footprints,
//   Bike,
//   Clock,
//   Calendar,
//   MapPin,
//   ChevronRight,
//   Download,
//   Share2,
//   Edit2,
//   Save,
//   Bell,
//   MessageCircle
// } from 'lucide-react';

import { 
  ArrowLeft,
  Heart,
  Activity,
  Moon,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Users,
  Baby,
  HeartPulse,
  Eye,
  Headphones,
  Leaf,
  Apple,
  Coffee,
  Home,
  Car,
  Footprints,
  Bike,
  Clock,
  Calendar,
  MapPin,
  ChevronRight,
  Download,
  Share2,
  Edit2,
  Save,
  Bell,
  MessageCircle
} from 'lucide-react';

import { Link } from 'react-router-dom';
import api from '../../api/citizenApi';
import Card from '../../components/UI/Card';

const HealthAdvisory = () => {
  const [userProfile, setUserProfile] = useState({
    age: 32,
    healthConditions: ['none'],
    outdoorActivity: 'moderate',
    useMask: true,
    hasAirPurifier: true,
    sensitiveGroup: false
  });

  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [savedAdvice, setSavedAdvice] = useState([]);

  // backend-driven state
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('Anand Vihar, Delhi');
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [backendAlerts, setBackendAlerts] = useState([]);

  // Mock AQI data (fallback) — replaced by backend when available
  const currentAQI = healthData?.aqi ?? 312;
  const currentCategory = healthData?.category ?? 'Very Unhealthy';

  // Health categories
  const healthCategories = [
    { id: 'all', name: 'All Advice', icon: <Heart size={16} /> },
    { id: 'sensitive', name: 'Sensitive Groups', icon: <Users size={16} /> },
    { id: 'children', name: 'Children', icon: <Baby size={16} /> },
    { id: 'elderly', name: 'Elderly', icon: <Users size={16} /> },
    { id: 'respiratory', name: 'Respiratory', icon: <Wind size={16} /> },
    { id: 'cardiac', name: 'Cardiac', icon: <HeartPulse size={16} /> }
  ];

  // Health recommendations based on AQI
  const recommendations = [
    {
      id: 1,
      category: 'general',
      title: 'Limit Outdoor Activities',
      description: 'Avoid prolonged or heavy exertion outdoors. Take frequent breaks indoors.',
      icon: <Footprints size={20} />,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-700',
      timeSensitive: true,
      bestTimes: ['Early morning (6-8 AM)', 'Late evening (after 9 PM)'],
      actions: [
        'Move workouts indoors',
        'Take breaks in air-conditioned spaces',
        'Keep windows closed during peak hours'
      ]
    },
    {
      id: 2,
      category: 'protection',
      title: 'Wear N95/KN95 Mask',
      description: 'Essential when stepping outside. Regular cloth masks are not sufficient.',
      icon: <Shield size={20} />,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
      duration: 'Until AQI drops below 200',
      actions: [
        'Ensure proper fit covering nose and chin',
        'Replace mask if damp or after 8 hours',
        'Carry extra mask when going out'
      ]
    },
    {
      id: 3,
      category: 'indoor',
      title: 'Indoor Air Quality',
      description: 'Keep indoor air clean. Use air purifiers and avoid indoor pollution sources.',
      icon: <Home size={20} />,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-700',
      actions: [
        'Run air purifier at maximum setting',
        'Keep windows and doors sealed',
        'Avoid burning candles or incense',
        'Use exhaust fans while cooking'
      ]
    },
    {
      id: 4,
      category: 'sensitive',
      title: 'Sensitive Groups Alert',
      description: 'Children, elderly, and those with respiratory conditions should stay indoors.',
      icon: <Users size={20} />,
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
      textColor: 'text-red-700',
      priority: 'high',
      groups: ['Children under 12', 'Adults over 65', 'Asthma patients', 'Heart patients'],
      actions: [
        'Stay indoors in a clean room',
        'Keep medications readily available',
        'Monitor symptoms closely',
        'Consult doctor if breathing difficulty'
      ]
    },
    {
      id: 5,
      category: 'nutrition',
      title: 'Dietary Recommendations',
      description: 'Certain foods can help combat the effects of pollution.',
      icon: <Apple size={20} />,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-700',
      foods: {
        eat: ['Vitamin C rich foods', 'Omega-3 fatty acids', 'Green tea', 'Turmeric milk'],
        avoid: ['Fried foods', 'Processed items', 'Alcohol', 'Caffeine']
      },
      actions: [
        'Stay hydrated - drink 8-10 glasses of water',
        'Eat fruits rich in antioxidants',
        'Include ginger and honey in diet',
        'Avoid street food during high pollution'
      ]
    },
    {
      id: 6,
      category: 'symptoms',
      title: 'Watch for Symptoms',
      description: 'Monitor these symptoms and seek medical help if they persist.',
      icon: <Activity size={20} />,
      color: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      symptoms: {
        mild: ['Cough', 'Throat irritation', 'Watery eyes', 'Mild headache'],
        severe: ['Difficulty breathing', 'Chest pain', 'Dizziness', 'Irregular heartbeat']
      },
      actions: [
        'Use saline spray for nasal irritation',
        'Gargle with warm salt water',
        'Use eye drops for irritation',
        'Seek immediate help for severe symptoms'
      ]
    }
  ];

  // Safe routes for commuting
  const safeRoutes = [
    {
      id: 1,
      from: 'Anand Vihar',
      to: 'Connaught Place',
      aqi: 245,
      duration: '35 mins',
      mode: 'Metro',
      route: 'Blue Line → Yellow Line',
      pollutionLevel: 'Moderate',
      tips: ['Avoid walking to station', 'Use mask in crowd']
    },
    {
      id: 2,
      from: 'Dwarka',
      to: 'Gurugram',
      aqi: 198,
      duration: '45 mins',
      mode: 'Car (AC)',
      route: 'Dwarka Expressway',
      pollutionLevel: 'Better',
      tips: ['Keep windows closed', 'Use recirculation mode']
    },
    {
      id: 3,
      from: 'Noida',
      to: 'Delhi',
      aqi: 278,
      duration: '50 mins',
      mode: 'Metro',
      route: 'Aqua Line → Blue Line',
      pollutionLevel: 'Moderate',
      tips: ['Travel after 10 AM', 'Avoid peak hours']
    }
  ];

  // Real-time health alerts
  const healthAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Respiratory Risk Alert',
      message: 'Current AQI levels may trigger asthma attacks. Keep inhaler handy.',
      time: '10 mins ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'info',
      title: 'Eye Irritation Reported',
      message: 'Many citizens reporting eye irritation. Use lubricating eye drops.',
      time: '1 hour ago',
      severity: 'medium'
    },
    {
      id: 3,
      type: 'success',
      title: 'Safe Window Opening',
      message: 'Air quality improving slightly. Safe to ventilate between 6-8 AM.',
      time: '2 hours ago',
      severity: 'low'
    }
  ];

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'bg-green-500';
    if (aqi <= 100) return 'bg-yellow-500';
    if (aqi <= 200) return 'bg-orange-500';
    if (aqi <= 300) return 'bg-red-500';
    if (aqi <= 400) return 'bg-purple-500';
    return 'bg-maroon-500';
  };

  const getAQITextColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600';
    if (aqi <= 100) return 'text-yellow-600';
    if (aqi <= 200) return 'text-orange-600';
    if (aqi <= 300) return 'text-red-600';
    if (aqi <= 400) return 'text-purple-600';
    return 'text-red-800';
  };

  const getAQIBgLight = (aqi) => {
    if (aqi <= 50) return 'bg-green-50';
    if (aqi <= 100) return 'bg-yellow-50';
    if (aqi <= 200) return 'bg-orange-50';
    if (aqi <= 300) return 'bg-red-50';
    if (aqi <= 400) return 'bg-purple-50';
    return 'bg-red-100';
  };

  const formatNumber = (v, digits = 0) => {
    if (v === null || v === undefined || Number.isNaN(Number(v))) return '—';
    try { return new Intl.NumberFormat('en-IN', { maximumFractionDigits: digits }).format(Number(v)); }
    catch (e) { return String(Math.round(Number(v))); }
  };

  const barWidthPct = (val, max = 500) => `${(Math.min(Math.max(Number(val) || 0, 0), max) / max) * 100}%`;

  // Fetch stations and health advisory from backend
  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    let mounted = true;

    const fetchStations = async () => {
      try {
        const res = await fetch(`${API_BASE}/stations`);
        const json = res.ok ? await res.json() : [];
        if (mounted) {
          setStations(json.map(s => s.station));
          if (!selectedStation && json[0]) setSelectedStation(json[0].station || json[0]);
        }
      } catch (e) {
        console.error('Failed to fetch stations', e);
      }
    };

    const fetchHealth = async (station) => {
      try {
        setLoading(true);

        let json = null;

        // Prefer POST with user profile if api helper available
        try {
          json = await api.postHealthAdvisory({ station: station || null, profile: userProfile });
        } catch (e) {
          // fallback to GET
          try {
            json = await api.getHealthAdvisory({ station: station || null });
          } catch (err) {
            console.warn('Health advisory GET fallback failed', err);
            json = null;
          }
        }

        if (mounted && json) {
          setHealthData(json);
        }

        // Dashboard pollutants fallback: merge if healthData missing pollutants
        try {
          const dbj = await api.getDashboard();
          if (mounted && dbj && station) {
            const match = dbj.find(s => s.station === station || (s.station && s.station.toLowerCase() === station.toLowerCase()));
            if (match && match.pollutants) {
              setHealthData(prev => ({ ...(prev||{}), pollutants: prev?.pollutants || match.pollutants }));
            }
          }
        } catch (e) {
          // ignore dashboard fallback errors
        }

        if (mounted) {
          if (json?.alerts && Array.isArray(json.alerts)) setBackendAlerts(json.alerts);
          setLastUpdated(json?.updated_at || new Date().toISOString());
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to fetch health advisory', e);
        if (mounted) setLoading(false);
      }
    };

    fetchStations().then(() => fetchHealth(selectedStation));
    const id = setInterval(() => fetchHealth(selectedStation), 30000);
    return () => { mounted = false; clearInterval(id); };
  }, [selectedStation]);

  const availableRecommendations = healthData?.recommendations && Array.isArray(healthData.recommendations)
    ? healthData.recommendations
    : recommendations;

  const filteredRecommendations = selectedCategory === 'all'
    ? availableRecommendations
    : availableRecommendations.filter(rec => rec.category === selectedCategory);

  const alertsToRender = (backendAlerts && backendAlerts.length)
    ? backendAlerts.map((a, i) => {
        if (typeof a === 'string') return { id: `b-${i}`, title: a.split('.')[0], message: a, time: 'just now', type: a.toLowerCase().includes('avoid') ? 'warning' : 'info' };
        return { id: a.id || `b-${i}`, type: a.type || 'info', title: a.title || a.message?.split?.('.')[0] || 'Alert', message: a.message || '', time: a.time || 'just now', severity: a.severity || a.level };
      })
    : healthAlerts;

  const routesToShow = (healthData && Array.isArray(healthData.routes)) ? healthData.routes : safeRoutes;
  const forecastToShow = (healthData && Array.isArray(healthData.forecast)) ? healthData.forecast : null;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-gray-200">
      <main className="p-6 w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-black/40 border-b border-[#071526] mb-4">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 rounded-lg">
                <ArrowLeft size={20} className="text-gray-300" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Health Advisory</h1>
                <p className="text-sm text-gray-300">Personalized recommendations based on AQI</p>
              </div>
              <div className="ml-6">
                <label className="text-sm text-gray-300 mr-2">Station</label>
                <select aria-label="Select station" value={selectedStation} onChange={(e)=>setSelectedStation(e.target.value)} className="px-3 py-2 border rounded bg-transparent text-gray-200 focus:ring-2 focus:ring-blue-accent">
                  {stations.length ? stations.map((st, i)=>(<option key={i} value={st}>{st}</option>)) : (<option>Loading stations...</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                aria-label="Edit profile"
                onClick={() => setShowProfileEdit(!showProfileEdit)}
                className="p-2 rounded-lg"
              >
                <Edit2 size={20} className="text-gray-300 cursor-pointer" />
              </button>
              <button aria-label="Notifications" className="p-2 rounded-lg">
                <Bell size={20} className="text-gray-300 cursor-pointer" />
              </button>
              <button aria-label="Share advisory" className="p-2 rounded-lg">
                <Share2 size={20} className="text-gray-300 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Panel */}
      {showProfileEdit && (
        <div className="mb-4">
          <Card className="bg-[#111827] p-6 border border-[#071526]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Your Health Profile</h3>
              <button 
                onClick={() => setShowProfileEdit(false)}
                className="text-blue-accent text-sm font-medium hover:brightness-95"
              >
                <Save size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={userProfile.age}
                  onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value)})}
                >
                  <option value={25}>Under 18</option>
                  <option value={32}>18-40</option>
                  <option value={55}>40-60</option>
                  <option value={68}>60+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Health Conditions</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={userProfile.healthConditions[0]}
                  onChange={(e) => setUserProfile({...userProfile, healthConditions: [e.target.value]})}
                >
                  <option value="none">No specific conditions</option>
                  <option value="asthma">Asthma/Respiratory</option>
                  <option value="cardiac">Heart Condition</option>
                  <option value="allergy">Allergies</option>
                  <option value="multiple">Multiple conditions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Outdoor Activity</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  value={userProfile.outdoorActivity}
                  onChange={(e) => setUserProfile({...userProfile, outdoorActivity: e.target.value})}
                >
                  <option value="minimal">Minimal (mostly indoors)</option>
                  <option value="moderate">Moderate (commute only)</option>
                  <option value="active">Active (exercise outdoors)</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={userProfile.useMask}
                    onChange={(e) => setUserProfile({...userProfile, useMask: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Use mask regularly</span>
                </label>

                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    checked={userProfile.hasAirPurifier}
                    onChange={(e) => setUserProfile({...userProfile, hasAirPurifier: e.target.checked})}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Have air purifier</span>
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div>
        {!lastUpdated && (
          <div className="mb-4">
            <div className="rounded-md bg-yellow-800/30 border-l-4 border-yellow-600 p-3 text-yellow-300">
              <strong>Mock data:</strong> Health advisory may be showing fallback/mock data until live backend responds.
            </div>
          </div>
        )}
        {/* Current Health Risk Banner */}
        <Card className={`${getAQIBgLight(currentAQI)} mb-6 p-6`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${getAQIBgLight(currentAQI)}`}>
                <HeartPulse size={32} className={getAQITextColor(currentAQI)} />
              </div>
              <div>
                <p className="text-sm text-gray-300 mb-1">Current Health Risk Level</p>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {currentCategory} - High Risk
                </h2>
                <p className="text-gray-300 max-w-2xl">
                  {healthData?.advisory ? (
                    healthData.advisory.general
                  ) : (userProfile.sensitiveGroup || userProfile.healthConditions[0] !== 'none'
                    ? 'You are in sensitive group. Please take extra precautions and limit outdoor exposure.'
                    : 'General population may experience health effects. Consider reducing outdoor activities.')}
                </p>
                <div className="text-xs text-gray-400 mt-2">Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : '—'} {lastUpdated && <span className="inline-block ml-2 px-2 py-0.5 bg-green-800 text-green-300 rounded text-xs">Live</span>}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-accent text-black rounded-lg hover:brightness-95">
                Set Reminder
              </button>
              <button className="px-4 py-2 border border-blue-medium rounded-lg hover:bg-black/10 text-gray-200">
                Share
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Health Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/20 rounded-lg">
                <Clock size={20} className="text-blue-accent" />
              </div>
              <div>
                <p className="text-xs text-gray-300">Safe Window Today</p>
                <p className="font-semibold text-white">6:00 - 8:00 AM</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/20 rounded-lg">
                <Wind size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-300">Mask Recommended</p>
                <p className="font-semibold text-green-400">N95 Required</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/20 rounded-lg">
                <Droplets size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-300">Hydration Needed</p>
                <p className="font-semibold text-white">8-10 glasses</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black/20 rounded-lg">
                <Activity size={20} className="text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-gray-300">Exercise Today</p>
                <p className="font-semibold text-orange-400">Indoor only</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 scrollbar-hide">
          {healthCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-accent text-black'
                  : 'bg-black/20 text-gray-300 hover:bg-black/30'
              }`}
            >
              {category.icon}
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recommendations */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Personalized Recommendations</h2>
            
            {filteredRecommendations.map((rec) => (
              <div key={rec.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${rec.bgLight} rounded-xl`}>
                    <span className={rec.textColor}>{rec.icon}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                      {rec.priority === 'high' && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Priority
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    
                    {/* Additional Info based on recommendation type */}
                    {rec.bestTimes && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">Best Times:</p>
                        <div className="flex gap-2">
                          {rec.bestTimes.map((time, idx) => (
                            <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {rec.groups && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-1">Affected Groups:</p>
                        <div className="flex flex-wrap gap-1">
                          {rec.groups.map((group, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {group}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {rec.foods && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs font-medium text-green-600 mb-1">Eat More:</p>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {rec.foods.eat.map((food, idx) => (
                              <li key={idx}>{food}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-red-600 mb-1">Avoid:</p>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {rec.foods.avoid.map((food, idx) => (
                              <li key={idx}>{food}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    {rec.symptoms && (
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="p-2 bg-yellow-50 rounded">
                          <p className="text-xs font-medium text-yellow-700 mb-1">Mild Symptoms:</p>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {rec.symptoms.mild.map((symptom, idx) => (
                              <li key={idx}>{symptom}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-2 bg-red-50 rounded">
                          <p className="text-xs font-medium text-red-700 mb-1">Severe Symptoms:</p>
                          <ul className="text-xs text-gray-600 list-disc list-inside">
                            {rec.symptoms.severe.map((symptom, idx) => (
                              <li key={idx}>{symptom}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Recommended Actions:</p>
                      <ul className="space-y-1">
                        {rec.actions.map((action, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <CheckCircle size={14} className="text-green-500 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center gap-1">
                      Save for later
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Real-time Health Alerts */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Alerts</h2>

              <div className="space-y-3">
                {alertsToRender.map((alert, idx) => (
                  <div key={alert.id || idx} className={`p-3 rounded-lg ${
                    alert.type === 'warning' ? 'bg-red-50' :
                    alert.type === 'info' ? 'bg-blue-50' : 'bg-green-50'
                  }`}>
                    <div className="flex items-start gap-2">
                      {alert.type === 'warning' ? (
                        <AlertTriangle size={16} className="text-red-600 mt-0.5" />
                      ) : alert.type === 'info' ? (
                        <Info size={16} className="text-blue-600 mt-0.5" />
                      ) : (
                        <CheckCircle size={16} className="text-green-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700">
                View all alerts
              </button>
            </div>

            {/* Safe Route Suggestions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Safe Routes Today</h2>
              
              <div className="space-y-3">
                {routesToShow.map((route) => (
                  <div key={route.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{route.from} → {route.to}</p>
                        <p className="text-xs text-gray-500">{route.mode} • {route.duration}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        route.pollutionLevel === 'Better' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        AQI {route.aqi}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Via: {route.route}</p>
                    <div className="flex gap-1">
                      {route.tips.map((tip, idx) => (
                        <span key={idx} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {tip}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 text-center text-sm text-blue-600 hover:text-blue-700">
                Plan your route
              </button>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-sm p-6 text-white">
              <AlertTriangle size={24} className="mb-3" />
              <h3 className="text-lg font-semibold mb-2">Emergency?</h3>
              <p className="text-sm text-red-100 mb-4">If experiencing severe symptoms, seek immediate help</p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Ambulance</span>
                  <span className="text-xl font-bold">102</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Poison Control</span>
                  <span className="text-xl font-bold">1066</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Health Helpline</span>
                  <span className="text-xl font-bold">1075</span>
                </div>
              </div>
            </div>

            {/* Daily Health Tip */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-sm p-6 text-white">
              <Leaf size={24} className="mb-3" />
              <h3 className="text-lg font-semibold mb-2">Daily Health Tip</h3>
              <p className="text-sm text-green-100 mb-3">
                Practice deep breathing exercises indoors. Try "Anulom Vilom" for 10 minutes to strengthen lungs.
              </p>
              <button className="w-full bg-white text-green-700 py-2 rounded-lg font-medium hover:bg-green-50">
                Get more tips
              </button>
            </div>
          </div>
        </div>

        {/* Weekly Health Plan */}
        <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Weekly Health Plan</h2>
            <button className="text-blue-600 text-sm font-medium">Customize</button>
          </div>
          
            <div className="grid grid-cols-7 gap-2">
            {forecastToShow && forecastToShow.length ? (
              forecastToShow.map((f, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-xs text-gray-500 mb-2">{f.day || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][idx]}</p>
                  <div className={`p-2 rounded-lg ${
                    (f.aqi || 0) > 300 ? 'bg-red-100' : (f.aqi || 0) > 200 ? 'bg-orange-100' : (f.aqi || 0) > 100 ? 'bg-yellow-100' : 'bg-green-100'
                  }`}>
                    <p className="text-xs font-medium">AQI {f.aqi ?? '—'}</p>
                  </div>
                  <div className="mt-2">
                    {f.advice ? (
                      <span className="text-xs text-gray-700">{f.advice}</span>
                    ) : (
                      (f.aqi || 0) > 200 ? <span className="text-xs text-red-600">🚫 Outdoor</span> : <span className="text-xs text-green-600">✅ Safe</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-xs text-gray-500 mb-2">{day}</p>
                  <div className={`p-2 rounded-lg ${
                    idx === 0 ? 'bg-red-100' : 
                    idx === 1 ? 'bg-orange-100' : 
                    idx === 2 ? 'bg-orange-100' : 
                    idx === 3 ? 'bg-yellow-100' : 
                    'bg-green-100'
                  }`}>
                    <p className="text-xs font-medium">
                      {idx === 0 ? 'AQI 312' : 
                       idx === 1 ? 'AQI 285' : 
                       idx === 2 ? 'AQI 245' : 
                       idx === 3 ? 'AQI 198' : 
                       'AQI 165'}
                    </p>
                  </div>
                  <div className="mt-2">
                    {idx === 0 ? (
                      <span className="text-xs text-red-600">🚫 Outdoor</span>
                    ) : idx === 1 ? (
                      <span className="text-xs text-orange-600">⚠️ Limited</span>
                    ) : (
                      <span className="text-xs text-green-600">✅ Safe</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        </div>
      </main>
    </div>
  );
};

export default HealthAdvisory;