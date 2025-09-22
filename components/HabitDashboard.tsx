'use client';

import { useState, useEffect } from 'react';
import { Habit, StreakLog, Badge } from '@/lib/types';
import { HabitCard } from './HabitCard';
import { StreakCounter } from './StreakCounter';
import { BadgeIcon } from './BadgeIcon';
import { CallToActionButton } from './CallToActionButton';
import { SocialShareButton } from './SocialShareButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SAMPLE_HABITS, DEFAULT_BADGES, MOTIVATIONAL_MESSAGES } from '@/lib/constants';
import { isToday } from '@/lib/utils';
import { Plus, Trophy, Target, TrendingUp } from 'lucide-react';

interface HabitDashboardProps {
  userId?: string;
}

export function HabitDashboard({ userId = 'user1' }: HabitDashboardProps) {
  const [habits, setHabits] = useState<Habit[]>(SAMPLE_HABITS);
  const [streakLogs, setStreakLogs] = useState<StreakLog[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>(['first-step']);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    // Set random motivational message
    const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setMotivationalMessage(randomMessage);
  }, []);

  const handleLogHabit = (habitId: string, completed: boolean) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Create new log entry
    const newLog: StreakLog = {
      id: `log-${Date.now()}`,
      habitId,
      logDate: today,
      isAdherent: completed,
      streakLengthAtLog: 0, // Will be calculated
      notes: ''
    };

    // Update habits
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newStreak = completed 
            ? habit.streakMetadata.currentStreak + 1 
            : 0;
          
          return {
            ...habit,
            streakMetadata: {
              ...habit.streakMetadata,
              currentStreak: newStreak,
              longestStreak: Math.max(habit.streakMetadata.longestStreak, newStreak),
              lastLoggedDate: today
            }
          };
        }
        return habit;
      })
    );

    // Add log entry
    setStreakLogs(prev => [...prev, { ...newLog, streakLengthAtLog: completed ? 1 : 0 }]);

    // Check for new badges
    checkForNewBadges(habitId, completed);
  };

  const checkForNewBadges = (habitId: string, completed: boolean) => {
    if (!completed) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newStreak = habit.streakMetadata.currentStreak + 1;

    DEFAULT_BADGES.forEach(badge => {
      if (earnedBadges.includes(badge.id)) return;

      if (badge.unlockCriteria.type === 'streak' && newStreak >= badge.unlockCriteria.value) {
        setEarnedBadges(prev => [...prev, badge.id]);
      }
    });
  };

  const getTotalActiveStreak = () => {
    return habits.reduce((total, habit) => total + habit.streakMetadata.currentStreak, 0);
  };

  const getHabitsLoggedToday = () => {
    return habits.filter(habit => 
      habit.streakMetadata.lastLoggedDate && isToday(habit.streakMetadata.lastLoggedDate)
    ).length;
  };

  const isHabitLoggedToday = (habit: Habit) => {
    return habit.streakMetadata.lastLoggedDate && isToday(habit.streakMetadata.lastLoggedDate);
  };

  const getHabitVariant = (habit: Habit) => {
    if (isHabitLoggedToday(habit)) {
      return habit.streakMetadata.currentStreak > 0 ? 'completed' : 'missed';
    }
    return 'active';
  };

  return (
    <div className="space-y-lg">
      {/* Header */}
      <div className="text-center space-y-sm">
        <h1 className="text-3xl font-bold gradient-text">HabitFlow</h1>
        <p className="text-gray-400">{motivationalMessage}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-sm">
        <Card>
          <CardContent className="p-md text-center">
            <div className="text-2xl font-bold text-accent">{getTotalActiveStreak()}</div>
            <div className="text-xs text-gray-400">Total Streak Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-md text-center">
            <div className="text-2xl font-bold text-primary">{getHabitsLoggedToday()}/{habits.length}</div>
            <div className="text-xs text-gray-400">Today's Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Streak Counter */}
      {habits.length > 0 && (
        <StreakCounter 
          streak={Math.max(...habits.map(h => h.streakMetadata.currentStreak))} 
          size="lg"
        />
      )}

      {/* Habits List */}
      <div className="space-y-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Habits</h2>
          <CallToActionButton
            variant="secondary"
            className="w-auto px-md py-sm text-sm"
            icon={<Plus className="w-4 h-4" />}
          >
            Add Habit
          </CallToActionButton>
        </div>

        <div className="space-y-md">
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              variant={getHabitVariant(habit)}
              onLogHabit={handleLogHabit}
              isLoggedToday={isHabitLoggedToday(habit)}
            />
          ))}
        </div>
      </div>

      {/* Badges Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-accent" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-md">
            {DEFAULT_BADGES.map(badge => (
              <div key={badge.id} className="text-center space-y-xs">
                <BadgeIcon
                  badge={badge}
                  variant={earnedBadges.includes(badge.id) ? 'earned' : 'default'}
                  size="md"
                />
                <div className="text-xs text-gray-400">{badge.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Share */}
      {habits.some(h => h.streakMetadata.currentStreak >= 7) && (
        <div className="text-center space-y-md">
          <p className="text-sm text-gray-400">Share your progress with friends!</p>
          <SocialShareButton
            streak={Math.max(...habits.map(h => h.streakMetadata.currentStreak))}
            habitName={habits.find(h => h.streakMetadata.currentStreak === Math.max(...habits.map(h => h.streakMetadata.currentStreak)))?.name || 'habits'}
            className="w-full"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-sm">
        <CallToActionButton
          icon={<Target className="w-5 h-5" />}
        >
          Set New Goal
        </CallToActionButton>
        
        <CallToActionButton
          variant="secondary"
          icon={<TrendingUp className="w-5 h-5" />}
        >
          View Analytics
        </CallToActionButton>
      </div>
    </div>
  );
}
