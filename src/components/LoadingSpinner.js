import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary', fullScreen = false }) => {
  const sizes = {
    small: '24px',
    medium: '40px',
    large: '60px'
  };

  const colors = {
    primary: 'var(--primary)',
    secondary: 'var(--secondary)',
    white: 'white',
    dark: 'var(--text-primary)'
  };

  const spinner = (
    <div 
      style={{
        width: sizes[size],
        height: sizes[size],
        border: `3px solid ${colors[color]}20`,
        borderTop: `3px solid ${colors[color]}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;