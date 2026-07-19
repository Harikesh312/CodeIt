import React from 'react';

export default function Logo({ size = 24, className = "" }) {
  const id = React.useId().replace(/:/g, '');
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={`lg1_${id}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F8BFF" />
          <stop offset="1" stopColor="#7C5CFF" />
        </linearGradient>
        <linearGradient id={`lg2_${id}`} x1="0" y1="40" x2="40" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C5CFF" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>
        <linearGradient id={`lg3_${id}`} x1="20" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F8BFF" />
          <stop offset="0.5" stopColor="#7C5CFF" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>
      </defs>

      {/* Hexagonal outer frame - tech feel */}
      <path 
        d="M20 3L35.32 11.5V28.5L20 37L4.68 28.5V11.5L20 3Z" 
        stroke={`url(#lg3_${id})`}
        strokeWidth="1.8" 
        strokeLinejoin="round"
        fill="none"
        opacity="0.4"
      />

      {/* Left code bracket < */}
      <path 
        d="M16 13L9 20L16 27" 
        stroke={`url(#lg1_${id})`}
        strokeWidth="3.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />

      {/* Right code bracket > */}
      <path 
        d="M24 13L31 20L24 27" 
        stroke={`url(#lg1_${id})`}
        strokeWidth="3.2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Central slash - represents code/forward */}
      <path 
        d="M22.5 11L17.5 29" 
        stroke={`url(#lg2_${id})`}
        strokeWidth="2.8" 
        strokeLinecap="round"
      />

      {/* Circuit nodes - AI/tech accent */}
      <circle cx="9" cy="20" r="1.5" fill={`url(#lg2_${id})`} />
      <circle cx="31" cy="20" r="1.5" fill={`url(#lg2_${id})`} />
    </svg>
  );
}
