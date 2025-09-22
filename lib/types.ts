export interface User {
  id: string;
  farcasterId: string;
  displayName: string;
  profilePicture?: string;
  activeHabits: string[];
  achievedBadges: string; // JSON string containing badge IDs
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description: string;
  goal: string;
  startDate: string;
  isActive: boolean;
  streakMetadata: string; // JSON string containing streak data
  category: 'health' | 'productivity' | 'learning' | 'social' | 'creative';
  icon: string;
}

export interface StreakLog {
  id: string;
  habitId: string;
  logDate: string;
  isAdherent: boolean;
  notes?: string;
  streakLengthAtLog: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockCriteria: {
    type: 'streak' | 'consistency' | 'milestone';
    value: number;
    category?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export type HabitCardVariant = 'active' | 'completed' | 'missed' | 'locked';
export type BadgeVariant = 'default' | 'earned';
export type ButtonVariant = 'primary' | 'secondary';
