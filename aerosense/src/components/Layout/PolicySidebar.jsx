import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  TrendingUp, 
  Target, 
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PolicySidebar = () => {
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/policy/overview', icon: LayoutDashboard, label: 'Overview' },
    { path: '/policy/source-identification', icon: Map, label: 'Source ID' },
    { path: '/policy/forecast', icon: TrendingUp, label: 'Forecast' },
    { path: '/policy/recommendations', icon: Target, label: 'Recommendations' },
    
  ];

  return (
    <aside className="w-64 bg-blue-deep border-r border-blue-medium flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-blue-medium">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-blue-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-white font-bold text-lg">Policy Dashboard</h1>
            <p className="text-xs text-gray-500">Delhi-NCR</p>
          </div>
        </div>
      </div>

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
    </aside>
  );
};

export default PolicySidebar;