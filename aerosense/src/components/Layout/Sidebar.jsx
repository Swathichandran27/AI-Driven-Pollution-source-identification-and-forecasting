import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Map,
  Activity,
  BarChart2,
  Heart,
  Layers,
  Settings,
  Menu,
  //import React from 'react';
  //import { NavLink } from 'react-router-dom';
  //import {
    //Home,
  //   Map,
  //   Activity,
  //   BarChart2,
  //   Heart,
  //   Layers,
  //   Settings,
  //   Menu,
     ChevronLeft
  } from 'lucide-react';

  const items = [
    { to: '/', label: 'Dashboard', icon: <Home size={16} /> },
    { to: '/live-map', label: 'Live Map', icon: <Map size={16} /> },
    { to: '/aqi-dashboard', label: 'AQI', icon: <BarChart2 size={16} /> },
    { to: '/source-analysis', label: 'Source Analysis', icon: <Layers size={16} /> },
    { to: '/forecast-alerts', label: 'Forecast', icon: <Activity size={16} /> },
    { to: '/health-advisory', label: 'Health Advisory', icon: <Heart size={16} /> },
    { to: '/policy/overview', label: 'Policy', icon: <Settings size={16} /> }
  ];

  export default function Sidebar({ collapsed, onToggle }) {
    return (
      <aside className={`h-screen sticky top-0 z-20 flex-shrink-0 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-56'} bg-blue-medium text-white shadow-lg`}>
        <div className="h-16 flex items-center px-4 border-b border-blue-medium">
          <div className="flex items-center justify-between w-full">
            {!collapsed && <div className="text-lg font-semibold">AeroSense</div>}
            <button onClick={onToggle} className="p-2 rounded hover:bg-blue-700">
              {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
        </div>

        <nav className="mt-4 px-2">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 mb-1 rounded-lg transition-colors ${isActive ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'}`}
            >
              <div className="w-6 h-6 flex items-center justify-center text-blue-accent">{it.icon}</div>
              {!collapsed && <span className="text-sm font-medium">{it.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto p-4 text-xs text-gray-300 border-t border-blue-medium">
          <div>AeroSense — v1.0</div>
        </div>
      </aside>
    );
  }
// //         <NavItem icon={<FaDollarSign />} text="Pricing" />

// //       </nav>

// //     </div>

// //   )

// // }



// // function NavItem({ icon, text, active }) {

// //   return (

// //     <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition 

// //       ${active ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}>

