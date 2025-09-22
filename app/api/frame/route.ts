import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { untrustedData } = body

    if (!untrustedData) {
      return NextResponse.json({ error: 'Invalid frame data' }, { status: 400 })
    }

    const { fid, buttonIndex, inputText } = untrustedData

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { farcasterId: fid.toString() }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          farcasterId: fid.toString(),
          activeHabits: '[]',
          achievedBadges: '[]'
        }
      })
    }

    // Handle different button actions
    switch (buttonIndex) {
      case 1: // Log today's habit
        return await handleLogHabit(user.id, inputText)
      case 2: // View habits
        return await handleViewHabits(user.id)
      case 3: // Add new habit
        return await handleAddHabit(user.id, inputText)
      case 4: // Share progress
        return await handleShareProgress(user.id)
      default:
        return await handleDefaultView(user.id)
    }
  } catch (error) {
    console.error('Frame action error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}

async function handleLogHabit(userId: string, habitName?: string) {
  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: 'desc' }
  })

  if (habits.length === 0) {
    return NextResponse.json({
      frames: {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?type=onboarding`,
        buttons: [
          {
            label: 'Add Your First Habit',
            action: 'post'
          }
        ],
        input: {
          text: 'Enter habit name'
        }
      }
    })
  }

  // If habit name provided, log it
  if (habitName) {
    const habit = habits.find(h => h.name.toLowerCase() === habitName.toLowerCase())
    if (habit) {
      const today = new Date().toISOString().split('T')[0]

      // Check if already logged today
      const existingLog = await prisma.streakLog.findUnique({
        where: {
          habitId_logDate: {
            habitId: habit.id,
            logDate: new Date(today)
          }
        }
      })

      if (existingLog) {
        return NextResponse.json({
          frames: {
            version: 'vNext',
            image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?type=already-logged&habit=${encodeURIComponent(habit.name)}`,
            buttons: [
              {
                label: 'View Progress',
                action: 'post'
              },
              {
                label: 'Log Another Habit',
                action: 'post'
              }
            ]
          }
        })
      }

      // Log the habit
      const streakMetadata = JSON.parse(habit.streakMetadata as string)
      const newStreak = streakMetadata.currentStreak + 1

      await prisma.streakLog.create({
        data: {
          habitId: habit.id,
          logDate: new Date(today),
          isAdherent: true,
          streakLengthAtLog: newStreak
        }
      })

      await prisma.habit.update({
        where: { id: habit.id },
        data: {
          streakMetadata: JSON.stringify({
            ...streakMetadata,
            currentStreak: newStreak,
            longestStreak: Math.max(streakMetadata.longestStreak, newStreak),
            lastLoggedDate: today
          })
        }
      })

      return NextResponse.json({
        frames: {
          version: 'vNext',
          image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?type=streak-update&habit=${encodeURIComponent(habit.name)}&streak=${newStreak}`,
          buttons: [
            {
              label: 'Continue Streaking! 🔥',
              action: 'post'
            },
            {
              label: 'Share Progress',
              action: 'post'
            }
          ]
        }
      })
    }
  }

  // Show habit selection
  return NextResponse.json({
    frames: {
      version: 'vNext',
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?type=select-habit&habits=${encodeURIComponent(JSON.stringify(habits.map(h => h.name)))}`,
      buttons: [
        {
          label: 'Log Habit',
          action: 'post'
        }
      ],
      input: {
        text: 'Enter habit name to log'
      }
    }
  })
}

async function handleViewHabits(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true },
    orderBy: { createdAt: 'desc' }
  })

  const totalStreak = habits.reduce((sum, habit) => {
    const metadata = JSON.parse(habit.streakMetadata as string)
    return sum + metadata.currentStreak
  }, 0)

  return NextResponse.json({
    frames: {
      version: 'vNext',
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?type=habits-overview&habits=${encodeURIComponent(JSON.stringify(habits))}&totalStreak=${totalStreak}`,
      buttons: [
        {
          label: 'Log Today\'s Habit',
          action: 'post'
        },
        {
          label: 'Add New Habit',
          action: 'post'
        }
      ]
    }
  })
}

async function handleAddHabit(userId: string, habitName?: string) {
  if (habitName) {
    const habit = await prisma.habit.create({
      data: {
        userId,
        name: habitName,
        description: `Stay consistent with ${habitName}`,
        goal: 'Daily practice',
        category: 'productivity',
        icon: '🎯',
        startDate: new Date(),
        streakMetadata: JSON.stringify({
          currentStreak: 0,
          longestStreak: 0,
          lastLoggedDate: null
        })
      }
    })

    // Update user's active habits
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user) {
      const activeHabits = JSON.parse(user.activeHabits || '[]')
      activeHabits.push(habit.id)
      await prisma.user.update({
        where: { id: userId },
        data: { activeHabits: JSON.stringify(activeHabits) }
      })
    }

    return NextResponse.json({
      frames: {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?type=habit-created&habit=${encodeURIComponent(habit.name)}`,
        buttons: [
          {
            label: 'Start Logging!',
            action: 'post'
          }
        ]
      }
    })
  }

  return NextResponse.json({
    frames: {
      version: 'vNext',
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?type=add-habit`,
      buttons: [
        {
          label: 'Create Habit',
          action: 'post'
        }
      ],
      input: {
        text: 'Enter habit name'
      }
    }
  })
}

async function handleShareProgress(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true }
  })

  const bestStreak = Math.max(...habits.map(h => {
    const metadata = JSON.parse(h.streakMetadata as string)
    return metadata.currentStreak
  }))

  const bestHabit = habits.find(h => {
    const metadata = JSON.parse(h.streakMetadata as string)
    return metadata.currentStreak === bestStreak
  })

  if (bestHabit) {
    return NextResponse.json({
      frames: {
        version: 'vNext',
        image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?type=share-progress&habit=${encodeURIComponent(bestHabit.name)}&streak=${bestStreak}`,
        buttons: [
          {
            label: 'Share on Farcaster',
            action: 'post'
          }
        ]
      }
    })
  }

  return handleDefaultView(userId)
}

async function handleDefaultView(userId: string) {
  const habits = await prisma.habit.findMany({
    where: { userId, isActive: true }
  })

  const totalStreak = habits.reduce((sum, habit) => {
    const metadata = JSON.parse(habit.streakMetadata as string)
    return sum + metadata.currentStreak
  }, 0)

  return NextResponse.json({
    frames: {
      version: 'vNext',
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame/image?type=dashboard&habits=${habits.length}&totalStreak=${totalStreak}`,
      buttons: [
        {
          label: 'Log Habit',
          action: 'post'
        },
        {
          label: 'View Habits',
          action: 'post'
        },
        {
          label: 'Add Habit',
          action: 'post'
        },
        {
          label: 'Share Progress',
          action: 'post'
        }
      ]
    }
  })
}

