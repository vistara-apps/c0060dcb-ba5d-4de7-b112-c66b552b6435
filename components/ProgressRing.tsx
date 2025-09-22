'use client';

import { useEffect, useState } from 'react';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressRing({ progress, size = 'md', className = '' }: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const sizeClasses = {
    sm: { width: 60, height: 60, strokeWidth: 4 },
    md: { width: 80, height: 80, strokeWidth: 6 },
    lg: { width: 120, height: 120, strokeWidth: 8 }
  };

  const { width, height, strokeWidth } = sizeClasses[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg
        width={width}
        height={height}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={width / 2}
          cy={height / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-primary">
          {Math.round(animatedProgress)}%
        </span>
      </div>
    </div>
  );
}

