// Sidebar.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/recordings', icon: 'fa-solid fa-microphone', label: 'Translator Assistant' },
  { path: '/appointments', icon: 'fa-solid fa-calendar-check', label: 'Appointments' },
  { path: '/documents', icon: 'fa-solid fa-file-lines', label: 'Documents' },
  { path: '/notifications', icon: 'fa-solid fa-bell', label: 'Notifications' },
  { path: '/settings', icon: 'fa-solid fa-gear', label: 'Settings' }
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('sidebarState');
    setIsCollapsed(saved === 'collapsed');
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarState', newState ? 'collapsed' : 'expanded');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="top-section">
        <div className="logo-row">
        {!isCollapsed && <img src="/med_Bridge_AI_Logo.png" className="logo" alt="logo" />}
        {!isCollapsed && (
          <Link to="/main" style={{ textDecoration: 'none', color: 'white' }} className="logo-text">
            BridgeMed-AI
          </Link>
        )}

        <button className="toggle" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>

        </div>

        <div className="search-bar">
          <i className="fa-solid fa-magnifying-glass"></i>
          {!isCollapsed && <input type="text" placeholder="Search..." />}
        </div>

        <div className="section-title">{!isCollapsed && 'Navigation'}</div>
        <div className="nav-items">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`nav-link ${isActive(item.path) ? 'active' : ''}`}>
              <i className={item.icon}></i>
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && <span className="tooltip">{item.label}</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
