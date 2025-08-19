"use client";

import { useEffect, useState } from "react";

export function Particles() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Jangan render apapun di server
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="particles-container">
        {Array.from({ length: 150 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 15}s`,
              opacity: 0.4 + Math.random() * 0.6,
              width: `${1 + Math.random() * 4}px`,
              height: `${1 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
