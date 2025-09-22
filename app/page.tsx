'use client';

import { FrameWrapper } from '@/components/FrameWrapper';
import { HabitDashboard } from '@/components/HabitDashboard';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <FrameWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-md">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-accent to-primary animate-pulse" />
            <div className="space-y-sm">
              <div className="h-4 bg-dark-surface rounded w-32 mx-auto animate-pulse" />
              <div className="h-3 bg-dark-surface rounded w-24 mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </FrameWrapper>
    );
  }

  return (
    <FrameWrapper>
      <HabitDashboard />
    </FrameWrapper>
  );
}
