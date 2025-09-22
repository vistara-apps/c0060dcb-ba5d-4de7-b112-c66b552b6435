import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { habitId, logDate, isAdherent, notes } = body

    if (!habitId || logDate === undefined || isAdherent === undefined) {
      return NextResponse.json({
        error: 'habitId, logDate, and isAdherent are required'
      }, { status: 400 })
    }

    // Check if log already exists for this date
    const existingLog = await prisma.streakLog.findUnique({
      where: {
        habitId_logDate: {
          habitId,
          logDate: new Date(logDate)
        }
      }
    })

    if (existingLog) {
      return NextResponse.json({
        error: 'Log already exists for this date'
      }, { status: 409 })
    }

    // Get habit to calculate streak
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      include: {
        streakLogs: {
          orderBy: { logDate: 'desc' },
          take: 30
        }
      }
    })

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    // Calculate new streak
    const streakMetadata = JSON.parse(habit.streakMetadata as string)
    let newStreak = isAdherent ? streakMetadata.currentStreak + 1 : 0
    let longestStreak = Math.max(streakMetadata.longestStreak, newStreak)

    // Create the log entry
    const streakLog = await prisma.streakLog.create({
      data: {
        habitId,
        logDate: new Date(logDate),
        isAdherent,
        notes: notes || null,
        streakLengthAtLog: newStreak
      }
    })

    // Update habit's streak metadata
    await prisma.habit.update({
      where: { id: habitId },
      data: {
        streakMetadata: JSON.stringify({
          currentStreak: newStreak,
          longestStreak,
          lastLoggedDate: logDate
        }),
        updatedAt: new Date()
      }
    })

    // Check for badge unlocks
    const badges = await checkBadgeUnlocks(habitId, newStreak)

    return NextResponse.json({
      streakLog,
      newStreak,
      badgesUnlocked: badges
    })
  } catch (error) {
    console.error('Error logging streak:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function checkBadgeUnlocks(habitId: string, newStreak: number) {
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
    include: { user: true }
  })

  if (!habit) return []

  const user = habit.user
  const achievedBadges = JSON.parse(user.achievedBadges || '[]')
  const badges = await prisma.badge.findMany()

  const newBadges = []

  for (const badge of badges) {
    if (achievedBadges.includes(badge.id)) continue

    const criteria = badge.unlockCriteria as any
    if (criteria.type === 'streak' && newStreak >= criteria.value) {
      achievedBadges.push(badge.id)
      newBadges.push(badge)
    }
  }

  if (newBadges.length > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        achievedBadges: JSON.stringify(achievedBadges)
      }
    })
  }

  return newBadges
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const habitId = searchParams.get('habitId')

    if (!habitId) {
      return NextResponse.json({ error: 'habitId is required' }, { status: 400 })
    }

    const streakLogs = await prisma.streakLog.findMany({
      where: { habitId },
      orderBy: { logDate: 'desc' },
      take: 90 // Last 90 days
    })

    return NextResponse.json(streakLogs)
  } catch (error) {
    console.error('Error fetching streak logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

