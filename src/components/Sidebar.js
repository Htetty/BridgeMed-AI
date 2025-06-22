import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check localStorage on component mount
    const sidebarState = localStorage.getItem('sidebarState');
    if (sidebarState === 'collapsed') {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebarState', newState ? 'collapsed' : 'expanded');
  };

  const handleSearchClick = () => {
    if (!isCollapsed) {
      setIsCollapsed(true);
      localStorage.setItem('sidebarState', 'collapsed');
    }
    // Focus will be handled by the input element itself
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`} id="sidebar">
      <button className="toggle" onClick={toggleSidebar}>☰</button>
      
      <div className="company-logo">
        <img src="/med_Bridge_AI_Logo.png" style={{ width: '70px', height: '70px' }} alt="Company Logo" />
        <span className="logo-name">BridgeMed-AI</span>
      </div>
      
      <div className="search-bar" id="search-container" onClick={handleSearchClick}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <span className="icon-text">
          <input 
            type="text" 
            placeholder="Search.." 
            id="search-input" 
            onClick={(e) => e.stopPropagation()}
          />
        </span>
      </div>
      
      <Link 
        to="/recordings" 
        className={`icon ${isActive('/recordings') ? 'active' : ''}`}
      >
        <i className="fa-solid fa-microphone"></i>
        <span className="icon-text">Translator Assistant</span>
      </Link>
      
      <Link 
        to="/appointments" 
        className={`icon ${isActive('/appointments') ? 'active' : ''}`}
      >
        <i className="fa-solid fa-calendar"></i>
        <span className="icon-text">Appointments</span>
      </Link>
      
      <Link 
        to="/documents" 
        className={`icon ${isActive('/documents') ? 'active' : ''}`}
      >
        <i className="fa-solid fa-file"></i>
        <span className="icon-text">Documents</span>
      </Link>
      
      <Link 
        to="/notifications" 
        className={`icon ${isActive('/notifications') ? 'active' : ''}`}
      >
        <i className="fa-solid fa-bell"></i>
        <span className="icon-text">Notifications</span>
      </Link>
      
      <Link 
        to="/settings" 
        className={`icon ${isActive('/settings') ? 'active' : ''}`}
      >
        <i className="fa-solid fa-gear"></i>
        <span className="icon-text">Settings</span>
      </Link>
      
      <div className="profile">
        <img src="https://i.pravatar.cc/40?img=15" alt="Profile" />
        <span className="profile-name">Username</span>
      </div>
    </div>
  );
};

export default Sidebar; 