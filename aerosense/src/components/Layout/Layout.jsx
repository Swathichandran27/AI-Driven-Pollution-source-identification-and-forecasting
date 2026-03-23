import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-blue-deep text-white flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className={`flex-1 transition-all duration-300`}>
        <Navbar onHamburger={() => setCollapsed(!collapsed)} />
        <main className="main-content">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
