'use client';

import { Badge, BadgeVariant } from '@/lib/types';
import { cn, getBadgeColor } from '@/lib/utils';

interface BadgeIconProps {
  badge: Badge;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BadgeIcon({ 
  badge, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeIconProps) {
  const gradientColor = getBadgeColor(badge.rarity);
  
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl'
  };

  const variants = {
    default: 'opacity-40 grayscale',
    earned: 'opacity-100 grayscale-0 animate-bounce-subtle'
  };

  return (
    <div className={cn(
      'relative rounded-full flex items-center justify-center',
      'bg-gradient-to-br',
      gradientColor,
      sizes[size],
      variants[variant],
      'transition-all duration-300',
      className
    )}>
      <div className="absolute inset-0.5 bg-dark-surface rounded-full flex items-center justify-center">
        <span>{badge.iconUrl}</span>
      </div>
      
      {variant === 'earned' && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
          <span className="text-xs">✨</span>
        </div>
      )}
    </div>
  );
}
