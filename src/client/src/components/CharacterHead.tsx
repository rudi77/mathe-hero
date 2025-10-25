import React from 'react';

interface CharacterHeadProps {
  className?: string;
}

/**
 * Custom SVG character head for child-friendly UX
 * Gender-neutral, simple design with friendly expression
 * Designed to work with emoji accessory overlays
 */
export default function CharacterHead({ className = '' }: CharacterHeadProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Head - rounded friendly shape */}
      <defs>
        <radialGradient id="headGradient" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#FFF5E6" />
          <stop offset="100%" stopColor="#FFE4B5" />
        </radialGradient>
      </defs>

      {/* Main head circle */}
      <circle
        cx="100"
        cy="100"
        r="80"
        fill="url(#headGradient)"
        stroke="#FFD700"
        strokeWidth="3"
      />

      {/* Left ear */}
      <circle
        cx="40"
        cy="100"
        r="20"
        fill="url(#headGradient)"
        stroke="#FFD700"
        strokeWidth="2"
      />

      {/* Right ear */}
      <circle
        cx="160"
        cy="100"
        r="20"
        fill="url(#headGradient)"
        stroke="#FFD700"
        strokeWidth="2"
      />

      {/* Left eye white */}
      <ellipse
        cx="75"
        cy="85"
        rx="12"
        ry="16"
        fill="white"
        stroke="#333"
        strokeWidth="2"
      />

      {/* Right eye white */}
      <ellipse
        cx="125"
        cy="85"
        rx="12"
        ry="16"
        fill="white"
        stroke="#333"
        strokeWidth="2"
      />

      {/* Left pupil */}
      <circle
        cx="75"
        cy="88"
        r="6"
        fill="#333"
      />

      {/* Right pupil */}
      <circle
        cx="125"
        cy="88"
        r="6"
        fill="#333"
      />

      {/* Left eye shine */}
      <circle
        cx="77"
        cy="85"
        r="2"
        fill="white"
      />

      {/* Right eye shine */}
      <circle
        cx="127"
        cy="85"
        r="2"
        fill="white"
      />

      {/* Friendly smile - curved path */}
      <path
        d="M 70 120 Q 100 140 130 120"
        stroke="#333"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Rosy cheeks */}
      <circle
        cx="55"
        cy="110"
        r="8"
        fill="#FFB6C1"
        opacity="0.6"
      />
      <circle
        cx="145"
        cy="110"
        r="8"
        fill="#FFB6C1"
        opacity="0.6"
      />
    </svg>
  );
}
