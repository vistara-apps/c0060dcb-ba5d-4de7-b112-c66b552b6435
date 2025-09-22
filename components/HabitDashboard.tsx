'use client';

import { useState, useEffect } from 'react';
import { Habit, StreakLog, Badge, User } from '@/lib/types';
import { HabitCard } from './HabitCard';
import { StreakCounter } from './StreakCounter';
import { BadgeIcon } from './BadgeIcon';
import { CallToActionButton } from './CallToActionButton';
import { SocialShareButton } from './SocialShareButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { DEFAULT_BADGES, MOTIVATIONAL_MESSAGES } from '@/lib/constants';
import { isToday } from '@/lib/utils';
import { getUser, getHabits, createHabit, logStreak } from '@/lib/api';
import { OnboardingFlow } from './OnboardingFlow';
import { Analytics } from './Analytics';
import { Plus, Trophy, Target, TrendingUp, Loader2, BarChart3 } from 'lucide-react';

interface HabitDashboardProps {
  userId?: string;
}

export function HabitDashboard({ userId }: HabitDashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingHabit, setIsCreatingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics'>('dashboard');

  useEffect(() => {
    if (userId) {
      loadUserData(userId);
    }
  }, [userId]);

  useEffect(() => {
    // Set random motivational message
    const randomMessage = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    setMotivationalMessage(randomMessage);
  }, []);

  const loadUserData = async (fid: string) => {
    setIsLoading(true);
    try {
      let userData = await getUser(fid);
      if (!userData) {
        // New user - will show onboarding
        setUser(null);
        setHabits([]);
        setEarnedBadges([]);
      } else {
        setUser(userData);
        setEarnedBadges(JSON.parse(userData.achievedBadges || '[]'));

        // Load habits
        const habitsData = await getHabits(userData.id);
        setHabits(habitsData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    // Reload user data after onboarding
    if (userId) {
      loadUserData(userId);
    }
  };

  const handleLogHabit = async (habitId: string, completed: boolean) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    try {
      const result = await logStreak({
        habitId,
        logDate: today,
        isAdherent: completed
      });

      if (result) {
        // Update local habits state
        setHabits(prevHabits =>
          prevHabits.map(habit => {
            if (habit.id === habitId) {
              return {
                ...habit,
                streakMetadata: JSON.stringify({
                  ...JSON.parse(habit.streakMetadata),
                  currentStreak: result.newStreak,
                  lastLoggedDate: today
                })
              };
            }
            return habit;
          })
        );

        // Update earned badges
        if (result.badgesUnlocked.length > 0) {
          const newBadgeIds = result.badgesUnlocked.map(badge => badge.id);
          setEarnedBadges(prev => [...prev, ...newBadgeIds]);
        }
      }
    } catch (error) {
      console.error('Error logging habit:', error);
    }
  };

  const handleCreateHabit = async () => {
    if (!user || !newHabitName.trim()) return;

    setIsCreatingHabit(true);
    try {
      const newHabit = await createHabit({
        userId: user.id,
        name: newHabitName.trim(),
        description: `Stay consistent with ${newHabitName.trim()}`,
        goal: 'Daily practice',
        category: 'productivity',
        icon: '🎯'
      });

      if (newHabit) {
        setHabits(prev => [...prev, newHabit]);
        setNewHabitName('');

        // Check for first habit badge
        if (habits.length === 0 && !earnedBadges.includes('first-step')) {
          setEarnedBadges(prev => [...prev, 'first-step']);
        }
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    } finally {
      setIsCreatingHabit(false);
    }
  };

  const getTotalActiveStreak = () => {
    return habits.reduce((total, habit) => {
      const metadata = JSON.parse(habit.streakMetadata);
      return total + metadata.currentStreak;
    }, 0);
  };

  const getHabitsLoggedToday = () => {
    return habits.filter(habit => {
      const metadata = JSON.parse(habit.streakMetadata);
      return metadata.lastLoggedDate && isToday(metadata.lastLoggedDate);
    }).length;
  };

  const isHabitLoggedToday = (habit: Habit) => {
    const metadata = JSON.parse(habit.streakMetadata);
    return metadata.lastLoggedDate && isToday(metadata.lastLoggedDate);
  };

  const getHabitVariant = (habit: Habit) => {
    if (isHabitLoggedToday(habit)) {
      const metadata = JSON.parse(habit.streakMetadata);
      return metadata.currentStreak > 0 ? 'completed' : 'missed';
    }
    return 'active';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-md">
          <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
          <div className="space-y-sm">
            <div className="h-4 bg-dark-surface rounded w-32 mx-auto animate-pulse" />
            <div className="h-3 bg-dark-surface rounded w-24 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Show onboarding for new users
  if (!user && userId && userId !== 'anonymous') {
    return <OnboardingFlow farcasterId={userId} onComplete={handleOnboardingComplete} />;
  }

  if (currentView === 'analytics') {
    return <Analytics habits={habits} />;
  }

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
          streak={Math.max(...habits.map(h => {
            const metadata = JSON.parse(h.streakMetadata);
            return metadata.currentStreak;
          }))}
          size="lg"
        />
      )}

      {/* Add New Habit Form */}
      <Card>
        <CardContent className="p-md">
          <div className="flex space-x-sm">
            <input
              type="text"
              placeholder="Enter new habit name..."
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="flex-1 px-md py-sm bg-dark-surface border border-dark-border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateHabit()}
            />
            <CallToActionButton
              onClick={handleCreateHabit}
              disabled={isCreatingHabit || !newHabitName.trim()}
              className="px-md py-sm"
            >
              {isCreatingHabit ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </CallToActionButton>
          </div>
        </CardContent>
      </Card>

      {/* Habits List */}
      <div className="space-y-md">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Habits</h2>
          <div className="text-sm text-gray-400">
            {habits.length} habit{habits.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="space-y-md">
          {habits.length === 0 ? (
            <Card>
              <CardContent className="p-lg text-center">
                <Target className="w-16 h-16 mx-auto text-gray-400 mb-md" />
                <h3 className="text-lg font-semibold mb-sm">No habits yet</h3>
                <p className="text-gray-400 mb-md">
                  Start building your first habit to begin your journey!
                </p>
                <p className="text-sm text-accent">
                  💡 Try: "Drink Water", "Exercise", "Read", or "Meditate"
                </p>
              </CardContent>
            </Card>
          ) : (
            habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                variant={getHabitVariant(habit)}
                onLogHabit={handleLogHabit}
                isLoggedToday={isHabitLoggedToday(habit)}
              />
            ))
          )}
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
      {habits.some(h => {
        const metadata = JSON.parse(h.streakMetadata);
        return metadata.currentStreak >= 7;
      }) && (
        <div className="text-center space-y-md">
          <p className="text-sm text-gray-400">Share your progress with friends!</p>
          <SocialShareButton
            streak={Math.max(...habits.map(h => {
              const metadata = JSON.parse(h.streakMetadata);
              return metadata.currentStreak;
            }))}
            habitName={habits.find(h => {
              const metadata = JSON.parse(h.streakMetadata);
              return metadata.currentStreak === Math.max(...habits.map(h2 => {
                const metadata2 = JSON.parse(h2.streakMetadata);
                return metadata2.currentStreak;
              }));
            })?.name || 'habits'}
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
          variant={currentView === 'dashboard' ? 'secondary' : 'primary'}
          icon={<BarChart3 className="w-5 h-5" />}
          onClick={() => setCurrentView(currentView === 'dashboard' ? 'analytics' : 'dashboard')}
        >
          {currentView === 'dashboard' ? 'View Analytics' : 'Back to Dashboard'}
        </CallToActionButton>
      </div>
    </div>
  );
}
