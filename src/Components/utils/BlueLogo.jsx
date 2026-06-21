import React from 'react';

const BlueLogo = ({ className = "w-24 h-24" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
    >
      <g transform="rotate(45 50 50)">
        {/* Left T shape */}
        <rect x="32" y="20" width="12" height="60" rx="3" />
        <rect x="8" y="44" width="26" height="12" rx="3" />
        
        {/* Right T shape */}
        <rect x="56" y="20" width="12" height="60" rx="3" />
        <rect x="66" y="44" width="26" height="12" rx="3" />
      </g>
    </svg>
  );
};

export default BlueLogo;
