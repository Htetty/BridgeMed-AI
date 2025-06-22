import React from 'react';
import './Background.css';

const Background = () => {
  // Create an array with 36 elements to map over
  const spans = Array.from({ length: 36 }, (_, i) => i);

  return (
    <div className="background">
      {spans.map(index => (
        <span key={index}></span>
      ))}
    </div>
  );
};

export default Background; 