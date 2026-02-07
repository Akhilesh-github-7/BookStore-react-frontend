import React from 'react';

const Logo = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
          <stop offset="100%" stopColor="#3B82F6" /> {/* Blue-500 */}
        </linearGradient>
      </defs>
      <path
        d="M12 6.042V20.25C12 20.6642 11.6642 21 11.25 21H4.5C3.67157 21 3 20.3284 3 19.5V5.25C3 4.42157 3.67157 3.75 4.5 3.75H9.75C10.9926 3.75 12 4.75736 12 6V6.042Z"
        fill="url(#logoGradient)"
        className="opacity-90"
      />
      <path
        d="M12 6.042V20.25C12 20.6642 12.3358 21 12.75 21H19.5C20.3284 21 21 20.3284 21 19.5V5.25C21 4.42157 20.3284 3.75 19.5 3.75H14.25C13.0074 3.75 12 4.75736 12 6V6.042Z"
        fill="url(#logoGradient)"
      />
      <path
        d="M9 3.75V21"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M15 3.75V21"
        stroke="white"
        strokeOpacity="0.2"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Logo;
