'use client';

import { Habit, HabitCardVariant } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { cn } from '@/lib/utils';
import { getStreakEmoji, isToday } from '@/lib/utils';
import { HABIT_CATEGORIES } from '@/lib/constants';
import { CheckCircle, Circle, Clock, Lock } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  variant?: HabitCardVariant;
  onLogHabit?: (habitId: string, completed: boolean) => void;
  isLoggedToday?: boolean;
}

export function HabitCard({ 
  habit, 
  variant = 'active', 
  onLogHabit,
  isLoggedToday = false 
}: HabitCardProps) {
  const category = HABIT_CATEGORIES[habit.category];
  const metadata = JSON.parse(habit.streakMetadata);
  const streakEmoji = getStreakEmoji(metadata.currentStreak);
  
  const variants = {
    active: 'border-dark-border hover:border-accent/50 transition-colors duration-200',
    completed: 'border-accent bg-accent/5 animate-streak',
    missed: 'border-red-500/50 bg-red-500/5',
    locked: 'border-dark-border opacity-60'
  };

  const getProgressPercentage = () => {
    if (variant === 'completed') return 100;
    if (variant === 'missed') return 0;
    return isLoggedToday ? 100 : (metadata.currentStreak > 0 ? 75 : 25);
  };

  const getStatusIcon = () => {
    switch (variant) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-accent" />;
      case 'missed':
        return <Circle className="w-5 h-5 text-red-400" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <Card className={cn('relative overflow-hidden', variants[variant])}>
      <CardContent className="p-lg">
        <div className="flex items-start justify-between mb-md">
          <div className="flex items-center space-x-sm">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
              category.color
            )}>
              {habit.icon}
            </div>
            <div>
              <h3 className="font-semibold text-dark-text">{habit.name}</h3>
              <p className="text-sm text-gray-400">{habit.goal}</p>
            </div>
          </div>
          {getStatusIcon()}
        </div>

        <div className="flex items-center justify-between mb-lg">
          <div className="flex items-center space-x-md">
            <ProgressRing 
              progress={getProgressPercentage()} 
              size={60} 
              strokeWidth={6}
            >
              <span className="text-lg">{streakEmoji}</span>
            </ProgressRing>
            <div>
              <div className="text-2xl font-bold gradient-text">
                {metadata.currentStreak}
              </div>
              <div className="text-xs text-gray-400">day streak</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">Best</div>
            <div className="text-lg font-semibold text-dark-text">
              {metadata.longestStreak}
            </div>
          </div>
        </div>

        {variant === 'active' && !isLoggedToday && onLogHabit && (
          <div className="flex space-x-sm">
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => onLogHabit(habit.id, true)}
            >
              ✅ Done
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => onLogHabit(habit.id, false)}
            >
              ❌ Skip
            </Button>
          </div>
        )}

        {isLoggedToday && (
          <div className="text-center py-sm">
            <span className="text-accent font-medium">✨ Logged for today!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
