"use client";

import { useEffect, useRef, useMemo } from 'react';
import { SPEED_TEST_CONFIG } from '@/constants/speed-test.constants';

type SpeedometerType = 'ping' | 'download' | 'upload';
type StatusType = 'good' | 'ok' | 'warning';

type SpeedometerProps = {
  value: number;
  type: SpeedometerType;
  isActive?: boolean;
  className?: string;
};

export function Speedometer({ value, type, isActive = false, className = '' }: SpeedometerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const currentValue = useRef(0);
  
  // Destructure config with default values
  const { speedometer } = SPEED_TEST_CONFIG;
  const { ranges, colors, size, arc } = speedometer;
  const range = ranges[type];
  
  // Get status based on value and range
  const getStatus = (val: number): StatusType => {
    if (type === 'ping') {
      // For ping, lower is better
      return val <= range.good ? 'good' : val <= range.ok ? 'ok' : 'warning';
    } else {
      // For download/upload, higher is better
      return val >= range.good ? 'good' : val >= range.ok ? 'ok' : 'warning';
    }
  };
  
  // Memoize derived values
  const { normalizedValue, status } = useMemo(() => {
    const normalized = Math.min(Math.max((value - range.min) / (range.max - range.min), 0), 1);
    return {
      normalizedValue: normalized,
      status: getStatus(value)
    };
  }, [value, range]);

  // Get color based on type and status
  const getTypeColor = (status: StatusType) => {
    const typeColors = {
      ping: {
        good: '#ef4444',    // red-500
        ok: '#f87171',      // red-400
        warning: '#fca5a5'  // red-300
      },
      download: {
        good: '#10b981',    // emerald-500
        ok: '#34d399',      // emerald-400
        warning: '#6ee7b7'  // emerald-300
      },
      upload: {
        good: '#3b82f6',    // blue-500
        ok: '#60a5fa',      // blue-400
        warning: '#93c5fd'  // blue-300
      }
    };
    return typeColors[type][status];
  };
  
  // Calculate angle based on value (in radians)
  const getAngle = (val: number) => {
    const angleRange = arc.endAngle - arc.startAngle;
    return (val * angleRange + arc.startAngle) * (Math.PI / 180);
  };
  
  // Draw the speedometer arc
  const drawArc = useMemo(() => {
    return (ctx: CanvasRenderingContext2D, progress: number) => {
      const { width, height } = ctx.canvas;
      const centerX = width / 2;
      const radius = Math.min(width, height * 1.8) * 0.4; // Adjusted for better aspect ratio
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw background arc
      ctx.beginPath();
      ctx.arc(centerX, height * 0.9, radius, Math.PI, 0, false);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = size.strokeWidth + 4;
      ctx.stroke();
      
      // Draw value arc with type-based color
      const startAngle = Math.PI;
      const endAngle = startAngle + (Math.PI * progress);
      
      // Create gradient for the arc
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, getTypeColor('good'));
      gradient.addColorStop(0.5, getTypeColor('ok'));
      gradient.addColorStop(1, getTypeColor('warning'));
      
      ctx.beginPath();
      ctx.arc(centerX, height * 0.9, radius, startAngle, endAngle, false);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = size.strokeWidth;
      ctx.stroke();
      
      // Draw needle
      const drawNeedle = (ctx: CanvasRenderingContext2D, prog: number) => {
        const needleAngle = getAngle(prog);
        
        ctx.save();
        ctx.translate(centerX, height * 0.9);
        ctx.rotate(needleAngle);
        
        // Draw needle
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, -radius + 25);
        ctx.lineTo(10, -radius + 25);
        ctx.closePath();
        ctx.fillStyle = getTypeColor(status);
        ctx.fill();
        
        // Center circle
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 5;
        ctx.fill();
        
        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fillStyle = getTypeColor(status);
        ctx.shadowBlur = 0;
        ctx.fill();
        
        ctx.restore();
      };
      
      drawNeedle(ctx, progress);
    };
  }, [arc, size, status, type]);
  
  // Animate the speedometer when value changes
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    let startTime: number | null = null;
    const duration = speedometer.animation.duration;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuart)
      const easedProgress = 1 - Math.pow(1 - progress, 4);
      
      // Update current value
      currentValue.current = easedProgress * normalizedValue;
      
      // Draw the speedometer with current progress
      drawArc(ctx, currentValue.current);
      
      // Continue animation if not complete
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    // Start animation
    if (isActive) {
      currentValue.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // Draw static state if not active
      drawArc(ctx, normalizedValue);
    }
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [normalizedValue, isActive, drawArc]);
  
  // Initial draw
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    drawArc(ctx, normalizedValue);
  }, [drawArc, normalizedValue]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      drawArc(ctx, currentValue.current);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawArc]);
  
  return (
    <div className={`flex flex-col items-center py-4 ${className}`}>
      <div className="relative w-full flex justify-center mb-2" style={{ height: size.height * 1.1 }}>
        <canvas
          ref={canvasRef}
          width={size.width}
          height={size.height}
          className="mx-auto"
          style={{
            width: '90%',
            height: '100%',
            maxWidth: '360px',
            aspectRatio: '2/1',
            objectFit: 'contain',
            margin: '0 auto',
            padding: '0 5%'
          }}
          aria-label={`${type} speedometer`}
        />
      </div>
      <div className="w-full text-center space-y-1.5 px-2">
        <div 
          className="text-xl font-bold tracking-tight transition-all duration-500 mb-1" 
          style={{ color: getTypeColor(status) }}
        >
          {type === 'ping' ? Math.round(value) : value.toFixed(1)}
          <span className="text-[11px] text-gray-400 ml-1.5">
            {type === 'ping' ? 'ms' : 'Mbps'}
          </span>
        </div>
        <div 
          className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all duration-300 inline-block`}
          style={{
            backgroundColor: `${getTypeColor(status)}15`,
            color: getTypeColor(status),
          }}
        >
          {status === 'good' ? 'Excellent' : status === 'ok' ? 'Good' : 'Poor'}
        </div>
      </div>
    </div>
  );
}
