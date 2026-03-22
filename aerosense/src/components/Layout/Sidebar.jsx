// // import { FaTachometerAlt, FaMapMarkedAlt, FaChartLine, FaHeartbeat, FaDollarSign } from "react-icons/fa"

// // export default function Sidebar() {
// //   return (
// //     <div className="w-64 bg-white shadow-lg p-6 hidden md:block">
// //       <h1 className="text-2xl font-bold text-blue-600 mb-10">AeroSense</h1>

// //       <nav className="space-y-4 text-gray-600">
// //         <NavItem icon={<FaTachometerAlt />} text="Dashboard" active />
// //         <NavItem icon={<FaMapMarkedAlt />} text="Map View" />
// //         <NavItem icon={<FaChartLine />} text="Forecasts" />
// //         <NavItem icon={<FaHeartbeat />} text="Health Insights" />
// //         <NavItem icon={<FaDollarSign />} text="Pricing" />
// //       </nav>
// //     </div>
// //   )
// // }

// // function NavItem({ icon, text, active }) {
// //   return (
// //     <div className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition 
// //       ${active ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}>
// //       {icon}
// //       <span>{text}</span>
// //     </div>
// //   )
// // }


import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Target, 
  Wind,
  LogOut,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { path: '/overview', icon: LayoutDashboard, label: 'Policy Overview' },
    { path: '/source-identification', icon: Map, label: 'Source Identification' },
    { path: '/forecast', icon: TrendingUp, label: 'Forecast & Trends' },
    { path: '/recommendations', icon: Target, label: 'Policy Recommendations' },
  ];

  return (
    <aside className="w-64 bg-blue-deep border-r border-blue-medium flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-blue-medium">
        <div className="flex items-center space-x-2">
          <Wind className="h-8 w-8 text-blue-accent" />
          <div>
            <h1 className="text-white font-bold text-lg">PolluTrack</h1>
            <p className="text-xs text-gray-500">Delhi-NCR</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-accent/20 text-blue-accent border-l-4 border-blue-accent'
                  : 'text-gray-400 hover:bg-blue-medium hover:text-white'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-medium space-y-2">
        <button className="flex items-center space-x-3 px-4 py-2 w-full text-gray-400 hover:text-white hover:bg-blue-medium rounded-lg transition-colors">
          <Settings className="h-5 w-5" />
          <span className="text-sm">Settings</span>
        </button>
        <button className="flex items-center space-x-3 px-4 py-2 w-full text-gray-400 hover:text-white hover:bg-blue-medium rounded-lg transition-colors">
          <LogOut className="h-5 w-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;










