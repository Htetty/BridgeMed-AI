import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    syncAcrossDevices: false,
    autoSaveRecordings: true
  });

  const handleToggleChange = (settingName) => {
    setSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
  };

  return (
    <>
      <Sidebar />
      
      <div className="main">
        <div className="header">Settings</div>
        <ul className="settings-list">
          <li className="setting-item">
            <span>Dark Mode</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.darkMode}
                onChange={() => handleToggleChange('darkMode')}
              />
              <span className="slider"></span>
            </label>
          </li>
          <li className="setting-item">
            <span>Email Notifications</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.emailNotifications}
                onChange={() => handleToggleChange('emailNotifications')}
              />
              <span className="slider"></span>
            </label>
          </li>
          <li className="setting-item">
            <span>Push Notifications</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.pushNotifications}
                onChange={() => handleToggleChange('pushNotifications')}
              />
              <span className="slider"></span>
            </label>
          </li>
          <li className="setting-item">
            <span>Sync Across Devices</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.syncAcrossDevices}
                onChange={() => handleToggleChange('syncAcrossDevices')}
              />
              <span className="slider"></span>
            </label>
          </li>
          <li className="setting-item">
            <span>Auto-Save Recordings</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={settings.autoSaveRecordings}
                onChange={() => handleToggleChange('autoSaveRecordings')}
              />
              <span className="slider"></span>
            </label>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Settings; 