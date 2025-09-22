'use client';

import { cn } from '@/lib/utils';

interface FrameWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function FrameWrapper({ children, className }: FrameWrapperProps) {
  return (
    <div className={cn(
      'min-h-screen bg-dark-bg text-dark-text',
      'max-w-full px-lg py-lg',
      'font-sans',
      className
    )}>
      <div className="max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
}
