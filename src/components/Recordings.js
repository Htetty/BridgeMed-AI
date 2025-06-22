import React from 'react';
import Sidebar from './Sidebar';

const Recordings = () => {
  return (
    <>
      <Sidebar />
      
      <div className="main">
        <div className="header">Recordings</div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#666'
        }}>
          <h3>Recordings Section</h3>
          <p>This section will contain voice recordings, transcriptions, and audio files.</p>
        </div>
      </div>
    </>
  );
};

export default Recordings; 