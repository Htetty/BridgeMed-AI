import React from 'react';

const Documents = () => {
  return (
    <>
      
      <div className="main">
        <div className="header">Documents</div>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '10px', 
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#666'
        }}>
          <h3>Documents Section</h3>
          <p>This section will contain medical documents, lab results, and other important files.</p>
        </div>
      </div>
    </>
  );
};

export default Documents; 