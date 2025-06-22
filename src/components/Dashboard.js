import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Dashboard = () => {
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  const closeNotificationsPanel = () => {
    setShowNotificationsPanel(false);
  };

  const closeSettingsPanel = () => {
    setShowSettingsPanel(false);
  };

  return (
    <>
      <Sidebar />
      
      <div className="main">
        <div className="header">Hello, Username</div>

        <div className="appointment-grid">
          <div className="appointment-card">
            <img src="https://i.pravatar.cc/100?img=34" alt="Appointment" />
            <div className="name">INITIAL CHECKUP<br />Dr. Emily Smith</div>
            <div className="time">10:00 AM, Tuesday, June 10, 2025</div>
            <div className="location">123 Main St, Anytown, USA</div>
          </div>
          <div className="appointment-card">
            <img src="https://i.pravatar.cc/100?img=34" alt="Appointment" />
            <div className="name">PHYSICAL<br />Dr. Emily Smith</div>
            <div className="time">1:00 PM, Monday, June 23, 2025</div>
            <div className="location">123 Main St, Anytown, USA</div>
          </div>
          <div className="appointment-card">
            <img src="https://i.pravatar.cc/150?img=34" alt="Appointment" />
            <div className="name">Appointment Name<br />Doctor Name</div>
            <div className="time">Time, Day, Month, Year</div>
            <div className="location">Location</div>
          </div>
          <div className="appointment-card">
            <img src="https://i.pravatar.cc/100?img=34" alt="Appointment" />
            <div className="name">Appointment Name<br />Doctor Name</div>
            <div className="time">Time, Day, Month, Year</div>
            <div className="location">Location</div>
          </div>
          <div className="appointment-card">
            <img src="https://i.pravatar.cc/100?img=34" alt="Appointment" />
            <div className="name">Appointment Name<br />Doctor Name</div>
            <div className="time">Time, Day, Month, Year</div>
            <div className="location">Location</div>
          </div>
        </div>

        {/* Notification Panel */}
        <div className={`panel ${showNotificationsPanel ? 'visible' : ''}`} id="notifications-panel">
          <div className="panel-header">
            <h3>Notifications</h3>
            <button className="close-btn" onClick={closeNotificationsPanel}>&times;</button>
          </div>
          <div className="panel-body">
            <ul>
              <li>Your appointment with Dr. Smith is confirmed for tomorrow at 10 AM.</li>
              <li>New lab results are available in your documents.</li>
              <li>A new message from your provider is waiting for you.</li>
              <li>Reminder: Annual check-up due next month.</li>
            </ul>
          </div>
        </div>

        {/* Settings Menu */}
        <div className={`panel ${showSettingsPanel ? 'visible' : ''}`} id="settings-panel">
          <div className="panel-header">
            <h3>Settings</h3>
            <button className="close-btn" onClick={closeSettingsPanel}>&times;</button>
          </div>
          <div className="panel-body">
            <ul>
              <li><button className="link-button">Manage Profile</button></li>
              <li><button className="link-button">Security & Password</button></li>
              <li><button className="link-button">Notification Preferences</button></li>
              <li><button className="link-button">Appearance</button></li>
              <li><button className="link-button">Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 