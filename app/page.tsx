'use client';

import { FrameWrapper } from '@/components/FrameWrapper';
import { HabitDashboard } from '@/components/HabitDashboard';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, we'll use a mock user ID
    // In a real Farcaster frame, this would come from MiniKit context
    const mockUserId = 'demo-user-123';
    setUserId(mockUserId);
    setIsLoading(false);
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
      <HabitDashboard userId={userId || 'anonymous'} />
    </FrameWrapper>
  );
}
