import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'dashboard'

  let svg = ''

  switch (type) {
    case 'dashboard':
      const habits = parseInt(searchParams.get('habits') || '0')
      const totalStreak = parseInt(searchParams.get('totalStreak') || '0')
      svg = generateDashboardImage(habits, totalStreak)
      break

    case 'onboarding':
      svg = generateOnboardingImage()
      break

    case 'select-habit':
      const habitNames = JSON.parse(searchParams.get('habits') || '[]')
      svg = generateHabitSelectionImage(habitNames)
      break

    case 'streak-update':
      const habit = searchParams.get('habit') || ''
      const streak = parseInt(searchParams.get('streak') || '0')
      svg = generateStreakUpdateImage(habit, streak)
      break

    case 'already-logged':
      const loggedHabit = searchParams.get('habit') || ''
      svg = generateAlreadyLoggedImage(loggedHabit)
      break

    case 'habit-created':
      const newHabit = searchParams.get('habit') || ''
      svg = generateHabitCreatedImage(newHabit)
      break

    case 'habits-overview':
      const habitsData = JSON.parse(searchParams.get('habits') || '[]')
      const overviewTotalStreak = parseInt(searchParams.get('totalStreak') || '0')
      svg = generateHabitsOverviewImage(habitsData, overviewTotalStreak)
      break

    case 'add-habit':
      svg = generateAddHabitImage()
      break

    case 'share-progress':
      const shareHabit = searchParams.get('habit') || ''
      const shareStreak = parseInt(searchParams.get('streak') || '0')
      svg = generateShareProgressImage(shareHabit, shareStreak)
      break

    default:
      svg = generateDashboardImage(0, 0)
  }

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=300'
    }
  })
}

function generateDashboardImage(habitsCount: number, totalStreak: number): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="48" font-weight="bold" fill="#82aaff">
        🌟 HabitFlow
      </text>
      <text x="600" y="220" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" fill="#c792ea">
        Build habits that stick. Gamified for life.
      </text>
      <text x="600" y="320" text-anchor="middle" font-family="Inter, sans-serif" font-size="36" fill="#ffffff">
        ${habitsCount} Active Habits
      </text>
      <text x="600" y="380" text-anchor="middle" font-family="Inter, sans-serif" font-size="32" fill="#ffcb6b">
        🔥 ${totalStreak} Day Streak
      </text>
      <text x="600" y="500" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" fill="#89ddff">
        Log your habits daily and watch your streaks grow!
      </text>
    </svg>
  `
}

function generateOnboardingImage(): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2d1b69;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#11998e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
        🎯 Welcome to HabitFlow!
      </text>
      <text x="600" y="220" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" fill="#ffcb6b">
        Your journey to better habits starts here
      </text>
      <text x="600" y="320" text-anchor="middle" font-family="Inter, sans-serif" font-size="32" fill="#82aaff">
        🌱 Create your first habit
      </text>
      <text x="600" y="380" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#c792ea">
        Start small, stay consistent, achieve big!
      </text>
    </svg>
  `
}

function generateHabitSelectionImage(habitNames: string[]): string {
  const habitsText = habitNames.length > 0
    ? `Your habits: ${habitNames.join(', ')}`
    : 'No habits yet. Add your first one!'

  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="42" font-weight="bold" fill="#82aaff">
        📝 Log Your Habit
      </text>
      <text x="600" y="220" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" fill="#c792ea">
        Which habit did you complete today?
      </text>
      <text x="600" y="320" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#ffffff">
        ${habitsText}
      </text>
      <text x="600" y="420" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" fill="#89ddff">
        Enter the habit name in the input field below
      </text>
    </svg>
  `
}

function generateStreakUpdateImage(habit: string, streak: number): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ffa500;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
        🔥 Streak Updated!
      </text>
      <text x="600" y="220" text-anchor="middle" font-family="Inter, sans-serif" font-size="32" fill="#ffffff">
        ${habit}
      </text>
      <text x="600" y="300" text-anchor="middle" font-family="Inter, sans-serif" font-size="64" font-weight="bold" fill="#ffffff">
        ${streak} Days
      </text>
      <text x="600" y="380" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" fill="#ffffff">
        Keep the momentum going! 💪
      </text>
    </svg>
  `
}

function generateAlreadyLoggedImage(habit: string): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4ecdc4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#44a08d;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="42" font-weight="bold" fill="#ffffff">
        ✅ Already Logged Today
      </text>
      <text x="600" y="220" text-anchor="middle" font-family="Inter, sans-serif" font-size="28" fill="#ffffff">
        ${habit}
      </text>
      <text x="600" y="300" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" fill="#ffffff">
        Great job staying consistent!
      </text>
      <text x="600" y="380" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#82aaff">
        Come back tomorrow to keep your streak alive 🔥
      </text>
    </svg>
  `
}

function generateHabitCreatedImage(habit: string): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
        🎉 New Habit Created!
      </text>
      <text x="600" y="240" text-anchor="middle" font-family="Inter, sans-serif" font-size="36" fill="#ffffff">
        ${habit}
      </text>
      <text x="600" y="320" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" fill="#ffcb6b">
        Your journey begins now
      </text>
      <text x="600" y="380" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#82aaff">
        Start logging daily to build your streak! 🔥
      </text>
    </svg>
  `
}

function generateHabitsOverviewImage(habits: any[], totalStreak: number): string {
  const habitsList = habits.slice(0, 3).map(h => {
    const metadata = JSON.parse(h.streakMetadata)
    return `${h.icon} ${h.name}: ${metadata.currentStreak} days`
  }).join(' • ')

  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="120" text-anchor="middle" font-family="Inter, sans-serif" font-size="42" font-weight="bold" fill="#82aaff">
        📊 Your Habits Overview
      </text>
      <text x="600" y="180" text-anchor="middle" font-family="Inter, sans-serif" font-size="28" fill="#ffcb6b">
        🔥 Total Streak: ${totalStreak} days
      </text>
      <text x="600" y="240" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#ffffff">
        ${habitsList}
      </text>
      <text x="600" y="320" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" fill="#c792ea">
        Keep up the great work! Every day counts.
      </text>
    </svg>
  `
}

function generateAddHabitImage(): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
        ➕ Add New Habit
      </text>
      <text x="600" y="220" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" fill="#ffcb6b">
        What habit would you like to build?
      </text>
      <text x="600" y="320" text-anchor="middle" font-family="Inter, sans-serif" font-size="20" fill="#ffffff">
        Enter your habit name below
      </text>
      <text x="600" y="380" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" fill="#82aaff">
        Examples: Exercise, Read, Meditate, Drink Water
      </text>
    </svg>
  `
}

function generateShareProgressImage(habit: string, streak: number): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <text x="600" y="150" text-anchor="middle" font-family="Inter, sans-serif" font-size="42" font-weight="bold" fill="#ffffff">
        🌟 Share Your Achievement!
      </text>
      <text x="600" y="220" text-anchor="middle" font-family="Inter, sans-serif" font-size="32" fill="#ffffff">
        ${habit}
      </text>
      <text x="600" y="280" text-anchor="middle" font-family="Inter, sans-serif" font-size="48" font-weight="bold" fill="#ffffff">
        🔥 ${streak} Day Streak! 🔥
      </text>
      <text x="600" y="360" text-anchor="middle" font-family="Inter, sans-serif" font-size="24" fill="#ffffff">
        Inspire others with your consistency
      </text>
      <text x="600" y="420" text-anchor="middle" font-family="Inter, sans-serif" font-size="18" fill="#82aaff">
        Share this milestone on Farcaster!
      </text>
    </svg>
  `
}

