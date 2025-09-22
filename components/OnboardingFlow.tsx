'use client';

import { useState } from 'react';
import { CallToActionButton } from './CallToActionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createUser, createHabit } from '@/lib/api';
import { Loader2, Sparkles, Target, Users } from 'lucide-react';

interface OnboardingFlowProps {
  farcasterId: string;
  onComplete: () => void;
}

export function OnboardingFlow({ farcasterId, onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const suggestedHabits = [
    { name: 'Drink Water', category: 'health', icon: '💧' },
    { name: 'Exercise', category: 'health', icon: '🏃' },
    { name: 'Read', category: 'learning', icon: '📚' },
    { name: 'Meditate', category: 'health', icon: '🧘' },
    { name: 'Write', category: 'creative', icon: '✍️' },
    { name: 'Learn Language', category: 'learning', icon: '🌍' },
  ];

  const handleHabitToggle = (habitName: string) => {
    setSelectedHabits(prev =>
      prev.includes(habitName)
        ? prev.filter(h => h !== habitName)
        : [...prev, habitName]
    );
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Create user
      const user = await createUser({ farcasterId });

      if (user && selectedHabits.length > 0) {
        // Create selected habits
        await Promise.all(
          selectedHabits.map(async (habitName) => {
            const habitData = suggestedHabits.find(h => h.name === habitName);
            if (habitData) {
              return createHabit({
                userId: user.id,
                name: habitData.name,
                description: `Stay consistent with ${habitData.name}`,
                goal: 'Daily practice',
                category: habitData.category as any,
                icon: habitData.icon
              });
            }
          })
        );
      }

      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="space-y-lg">
        <div className="text-center space-y-md">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Welcome to HabitFlow!</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            Build habits that stick with gamified tracking, streaks, and social accountability.
          </p>
        </div>

        <Card>
          <CardContent className="p-lg text-center space-y-md">
            <Target className="w-12 h-12 mx-auto text-accent" />
            <h2 className="text-xl font-semibold">Your Habit Journey Starts Here</h2>
            <p className="text-gray-400">
              We'll help you create meaningful habits and stay consistent with daily reminders and progress tracking.
            </p>
          </CardContent>
        </Card>

        <CallToActionButton onClick={() => setStep(2)} className="w-full">
          Get Started
        </CallToActionButton>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-lg">
        <div className="text-center space-y-sm">
          <h1 className="text-2xl font-bold">Choose Your Starting Habits</h1>
          <p className="text-gray-400">
            Select 1-3 habits you'd like to focus on. You can always add more later!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-md">
          {suggestedHabits.map((habit) => (
            <Card
              key={habit.name}
              className={`cursor-pointer transition-all ${
                selectedHabits.includes(habit.name)
                  ? 'ring-2 ring-primary bg-primary/10'
                  : 'hover:bg-dark-surface/50'
              }`}
              onClick={() => handleHabitToggle(habit.name)}
            >
              <CardContent className="p-md text-center space-y-sm">
                <div className="text-2xl">{habit.icon}</div>
                <div className="font-medium">{habit.name}</div>
                <div className="text-xs text-gray-400 capitalize">{habit.category}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex space-x-sm">
          <CallToActionButton
            variant="secondary"
            onClick={() => setStep(1)}
            className="flex-1"
          >
            Back
          </CallToActionButton>
          <CallToActionButton
            onClick={() => setStep(3)}
            disabled={selectedHabits.length === 0}
            className="flex-1"
          >
            Continue
          </CallToActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      <div className="text-center space-y-md">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold">You're All Set!</h1>
        <p className="text-gray-400">
          Ready to start building habits that stick? Let's begin your journey!
        </p>
      </div>

      <Card>
        <CardContent className="p-lg space-y-md">
          <div className="text-center">
            <h3 className="font-semibold mb-sm">Your Selected Habits:</h3>
            <div className="flex flex-wrap justify-center gap-sm">
              {selectedHabits.map((habitName) => {
                const habit = suggestedHabits.find(h => h.name === habitName);
                return (
                  <div key={habitName} className="flex items-center space-x-xs bg-dark-surface px-sm py-xs rounded-full">
                    <span>{habit?.icon}</span>
                    <span className="text-sm">{habitName}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center text-sm text-gray-400">
            💡 Tip: Log your habits daily to build streaks and unlock achievements!
          </div>
        </CardContent>
      </Card>

      <CallToActionButton
        onClick={handleComplete}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-sm" />
            Setting up your account...
          </>
        ) : (
          'Start My Habit Journey!'
        )}
      </CallToActionButton>
    </div>
  );
}

