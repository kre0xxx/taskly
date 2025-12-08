import React from 'react';
import './Particles.css'; 

const Particles = () => {
  return (
    <div className="particles-container">
      {[...Array(15)].map((_, i) => (
        <div 
          key={i}
          className="particle"
          style={{
            '--i': i,
            '--x': Math.random() * 100,
            '--y': Math.random() * 100,
            '--size': Math.random() * 3 + 1,
            '--duration': Math.random() * 20 + 10,
            '--delay': Math.random() * 5,
            '--opacity': Math.random() * 0.3 + 0.1
          }}
        />
      ))}
    </div>
  );
};

export default Particles;