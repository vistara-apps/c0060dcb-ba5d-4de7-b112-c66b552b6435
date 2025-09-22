'use client';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { Share2 } from 'lucide-react';

interface SocialShareButtonProps {
  streak: number;
  habitName: string;
  className?: string;
  onShare?: () => void;
}

export function SocialShareButton({ 
  streak, 
  habitName, 
  className,
  onShare 
}: SocialShareButtonProps) {
  const handleShare = () => {
    const message = `🔥 ${streak} day streak on ${habitName}! Building habits that stick with HabitFlow 💪`;
    
    if (navigator.share) {
      navigator.share({
        title: 'HabitFlow Streak',
        text: message,
        url: window.location.href
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(message);
    }
    
    onShare?.();
  };

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={handleShare}
      className={cn(
        'flex items-center space-x-2',
        'hover:bg-accent/10 hover:border-accent/50',
        className
      )}
    >
      <Share2 className="w-4 h-4" />
      <span>Share Streak</span>
    </Button>
  );
}
