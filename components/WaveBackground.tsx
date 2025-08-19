"use client";

import React from 'react';

export default function WaveBackground() {
  return (
    <div className="absolute bottom-0 left-0 w-full h-32 overflow-hidden">
      <svg
        className="absolute bottom-0 w-full h-32"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.6 0.2 180 / 0.3)" />
            <stop offset="50%" stopColor="oklch(0.65 0.2 180 / 0.4)" />
            <stop offset="100%" stopColor="oklch(0.6 0.2 180 / 0.3)" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.6 0.2 180 / 0.2)" />
            <stop offset="50%" stopColor="oklch(0.65 0.2 180 / 0.3)" />
            <stop offset="100%" stopColor="oklch(0.6 0.2 180 / 0.2)" />
          </linearGradient>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.6 0.2 180 / 0.15)" />
            <stop offset="50%" stopColor="oklch(0.65 0.2 180 / 0.25)" />
            <stop offset="100%" stopColor="oklch(0.6 0.2 180 / 0.15)" />
          </linearGradient>
        </defs>

        <path
          d="M-100,60 C200,120 1000,0 1300,60 L1300,120 L-100,120 Z"
          fill="url(#waveGradient1)"
          className="wave-layer-1"
        />
        <path
          d="M-100,80 C200,40 1000,120 1300,80 L1300,120 L-100,120 Z"
          fill="url(#waveGradient2)"
          className="wave-layer-2"
        />
        <path
          d="M-100,100 C300,60 900,140 1300,100 L1300,120 L-100,120 Z"
          fill="url(#waveGradient3)"
          className="wave-layer-3"
        />
      </svg>

      <style jsx>{`
        .wave-layer-1 {
          animation: waveMove1 6s ease-in-out infinite;
          transform-origin: center;
        }
        .wave-layer-2 {
          animation: waveMove2 8s ease-in-out infinite;
          transform-origin: center;
          animation-delay: 0.5s;
        }
        .wave-layer-3 {
          animation: waveMove3 10s ease-in-out infinite;
          transform-origin: center;
          animation-delay: 1s;
        }

        @keyframes waveMove1 {
          0%, 100% {
            transform: translate(0, 5px);
          }
          50% {
            transform: translate(-20px, -5px);
          }
        }

        @keyframes waveMove2 {
          0%, 100% {
            transform: translate(0, -3px);
          }
          50% {
            transform: translate(20px, 3px);
          }
        }

        @keyframes waveMove3 {
          0%, 100% {
            transform: translate(0, 2px);
          }
          50% {
            transform: translate(-10px, -2px);
          }
        }
      `}</style>
    </div>
  );
}
