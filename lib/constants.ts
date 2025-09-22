import { Badge, Habit } from './types';

export const HABIT_CATEGORIES = {
  health: { icon: '💪', color: 'bg-green-500' },
  productivity: { icon: '⚡', color: 'bg-blue-500' },
  learning: { icon: '📚', color: 'bg-purple-500' },
  social: { icon: '👥', color: 'bg-pink-500' },
  creative: { icon: '🎨', color: 'bg-orange-500' },
} as const;

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-step',
    name: 'First Step',
    description: 'Log your first habit',
    iconUrl: '🌱',
    unlockCriteria: { type: 'milestone', value: 1 },
    rarity: 'common'
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    iconUrl: '🌟',
    unlockCriteria: { type: 'streak', value: 7 },
    rarity: 'common'
  },
  {
    id: 'month-master',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    iconUrl: '🔥',
    unlockCriteria: { type: 'streak', value: 30 },
    rarity: 'rare'
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Maintain a 100-day streak',
    iconUrl: '💎',
    unlockCriteria: { type: 'streak', value: 100 },
    rarity: 'epic'
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Maintain a 365-day streak',
    iconUrl: '🏆',
    unlockCriteria: { type: 'streak', value: 365 },
    rarity: 'legendary'
  }
];

export const SAMPLE_HABITS: Habit[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Drink Water',
    description: 'Drink 8 glasses of water daily',
    goal: '8 glasses',
    startDate: '2024-01-01',
    isActive: true,
    streakMetadata: {
      currentStreak: 12,
      longestStreak: 15,
      lastLoggedDate: '2024-01-12'
    },
    category: 'health',
    icon: '💧'
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Read',
    description: 'Read for 30 minutes',
    goal: '30 minutes',
    startDate: '2024-01-01',
    isActive: true,
    streakMetadata: {
      currentStreak: 8,
      longestStreak: 10,
      lastLoggedDate: '2024-01-11'
    },
    category: 'learning',
    icon: '📚'
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Exercise',
    description: 'Do 30 minutes of exercise',
    goal: '30 minutes',
    startDate: '2024-01-01',
    isActive: true,
    streakMetadata: {
      currentStreak: 5,
      longestStreak: 7,
      lastLoggedDate: '2024-01-10'
    },
    category: 'health',
    icon: '🏃'
  }
];

export const MOTIVATIONAL_MESSAGES = [
  "You're building something amazing! 🌟",
  "Every day counts towards your goal! 💪",
  "Consistency is the key to success! 🔑",
  "You're stronger than you think! 💎",
  "Keep the momentum going! ⚡",
  "Small steps lead to big changes! 🚀",
  "You've got this! 🎯",
  "Progress over perfection! 📈"
];
