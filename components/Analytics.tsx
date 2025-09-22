'use client';

import { useState, useEffect } from 'react';
import { Habit, StreakLog } from '@/lib/types';
import { getStreakLogs } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ProgressRing } from './ProgressRing';
import { TrendingUp, Calendar, Target, Flame } from 'lucide-react';

interface AnalyticsProps {
  habits: Habit[];
}

export function Analytics({ habits }: AnalyticsProps) {
  const [streakLogs, setStreakLogs] = useState<StreakLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [habits]);

  const loadAnalyticsData = async () => {
    if (habits.length === 0) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const allLogs = await Promise.all(
        habits.map(habit => getStreakLogs(habit.id))
      );
      setStreakLogs(allLogs.flat());
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeeklyProgress = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyLogs = streakLogs.filter(log =>
      new Date(log.logDate) >= weekAgo && new Date(log.logDate) <= today
    );

    const totalPossible = habits.length * 7;
    const totalCompleted = weeklyLogs.filter(log => log.isAdherent).length;

    return {
      completed: totalCompleted,
      total: totalPossible,
      percentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
    };
  };

  const getMonthlyProgress = () => {
    const today = new Date();
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate() + 1);

    const monthlyLogs = streakLogs.filter(log =>
      new Date(log.logDate) >= monthAgo && new Date(log.logDate) <= today
    );

    const daysInMonth = Math.ceil((today.getTime() - monthAgo.getTime()) / (1000 * 60 * 60 * 24));
    const totalPossible = habits.length * daysInMonth;
    const totalCompleted = monthlyLogs.filter(log => log.isAdherent).length;

    return {
      completed: totalCompleted,
      total: totalPossible,
      percentage: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0
    };
  };

  const getBestStreak = () => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map(habit => {
      const metadata = JSON.parse(habit.streakMetadata);
      return metadata.longestStreak || 0;
    }));
  };

  const getAverageConsistency = () => {
    if (habits.length === 0) return 0;

    const totalConsistency = habits.reduce((sum, habit) => {
      const metadata = JSON.parse(habit.streakMetadata);
      return sum + (metadata.currentStreak > 0 ? 1 : 0);
    }, 0);

    return Math.round((totalConsistency / habits.length) * 100);
  };

  const weekly = getWeeklyProgress();
  const monthly = getMonthlyProgress();
  const bestStreak = getBestStreak();
  const consistency = getAverageConsistency();

  if (isLoading) {
    return (
      <div className="space-y-md">
        <div className="h-6 bg-dark-surface rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-md">
          <div className="h-24 bg-dark-surface rounded animate-pulse" />
          <div className="h-24 bg-dark-surface rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      <div className="text-center space-y-sm">
        <h2 className="text-2xl font-bold gradient-text">Your Progress Analytics</h2>
        <p className="text-gray-400">Track your habit-building journey</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-md">
        <Card>
          <CardContent className="p-md text-center">
            <Flame className="w-8 h-8 mx-auto text-accent mb-sm" />
            <div className="text-2xl font-bold text-accent">{bestStreak}</div>
            <div className="text-xs text-gray-400">Best Streak</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-md text-center">
            <Target className="w-8 h-8 mx-auto text-primary mb-sm" />
            <div className="text-2xl font-bold text-primary">{consistency}%</div>
            <div className="text-xs text-gray-400">Consistency</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Rings */}
      <div className="grid grid-cols-2 gap-md">
        <Card>
          <CardHeader className="pb-sm">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-md">
              <ProgressRing
                progress={weekly.percentage}
                size="md"
                className="flex-shrink-0"
              />
              <div className="text-center">
                <div className="text-lg font-bold">{weekly.completed}/{weekly.total}</div>
                <div className="text-xs text-gray-400">habits logged</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-sm">
            <CardTitle className="text-sm flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>This Month</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center space-x-md">
              <ProgressRing
                progress={monthly.percentage}
                size="md"
                className="flex-shrink-0"
              />
              <div className="text-center">
                <div className="text-lg font-bold">{monthly.completed}/{monthly.total}</div>
                <div className="text-xs text-gray-400">habits logged</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habit Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Habit Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-md">
            {habits.map(habit => {
              const metadata = JSON.parse(habit.streakMetadata);
              const habitLogs = streakLogs.filter(log => log.habitId === habit.id);
              const completedLogs = habitLogs.filter(log => log.isAdherent).length;
              const totalLogs = habitLogs.length;
              const completionRate = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0;

              return (
                <div key={habit.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-sm">
                    <span className="text-lg">{habit.icon}</span>
                    <div>
                      <div className="font-medium">{habit.name}</div>
                      <div className="text-xs text-gray-400">
                        {metadata.currentStreak} day streak • {completionRate}% completion
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-accent">
                      {metadata.longestStreak}
                    </div>
                    <div className="text-xs text-gray-400">best</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Insights & Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-sm text-sm">
            {consistency >= 80 && (
              <div className="flex items-start space-x-sm">
                <span className="text-green-400 mt-0.5">✓</span>
                <span>Excellent consistency! You're building strong habits.</span>
              </div>
            )}
            {bestStreak >= 30 && (
              <div className="flex items-start space-x-sm">
                <span className="text-accent mt-0.5">🏆</span>
                <span>Impressive dedication! Your longest streak shows real commitment.</span>
              </div>
            )}
            {weekly.percentage < 50 && (
              <div className="flex items-start space-x-sm">
                <span className="text-yellow-400 mt-0.5">💡</span>
                <span>Try logging your habits right after waking up to build consistency.</span>
              </div>
            )}
            {habits.length === 0 && (
              <div className="flex items-start space-x-sm">
                <span className="text-blue-400 mt-0.5">🎯</span>
                <span>Start with 1-2 habits. Quality over quantity leads to better results.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
