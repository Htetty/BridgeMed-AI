import React, { useState } from 'react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      icon: 'fa-solid fa-calendar-check',
      message: 'Your appointment with <strong>Dr. Smith</strong> is confirmed for <strong>tomorrow at 10 AM.</strong>',
      time: '2 hours ago'
    },
    {
      id: 2,
      icon: 'fa-solid fa-file-waveform',
      message: 'New lab results are available in your documents.',
      time: '1 day ago'
    },
    {
      id: 3,
      icon: 'fa-solid fa-envelope',
      message: 'A new message from your provider is waiting for you.',
      time: '3 days ago'
    },
    {
      id: 4,
      icon: 'fa-solid fa-bell',
      message: 'Reminder: Annual check-up due next month.',
      time: '1 week ago'
    }
  ]);

  const [isClearing, setIsClearing] = useState(false);

  const handleClearAll = () => {
    setIsClearing(true);
    
    // Animate out notifications
    setTimeout(() => {
      setNotifications([]);
      setIsClearing(false);
    }, 300);
  };

  return (
    <>
      
      <div className="main">
        <div className="header">
          <span>Notifications</span>
          <button id="clear-all-btn" onClick={handleClearAll}>Clear All</button>
        </div>
        
        {notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                className="notification-item"
                style={{ opacity: isClearing ? 0 : 1 }}
              >
                <div className="notification-icon">
                  <i className={notification.icon}></i>
                </div>
                <div className="notification-content">
                  <p dangerouslySetInnerHTML={{ __html: notification.message }}></p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No new notifications.</p>
        )}
      </div>
    </>
  );
};

export default Notifications; 