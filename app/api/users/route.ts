import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const farcasterId = searchParams.get('farcasterId')

    if (!farcasterId) {
      return NextResponse.json({ error: 'farcasterId is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { farcasterId },
      include: {
        habits: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse JSON strings back to arrays
    const userWithParsedData = {
      ...user,
      activeHabits: JSON.parse(user.activeHabits || '[]'),
      achievedBadges: JSON.parse(user.achievedBadges || '[]')
    }

    return NextResponse.json(userWithParsedData)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { farcasterId, displayName, profilePicture } = body

    if (!farcasterId) {
      return NextResponse.json({ error: 'farcasterId is required' }, { status: 400 })
    }

    const user = await prisma.user.upsert({
      where: { farcasterId },
      update: {
        displayName,
        profilePicture,
        updatedAt: new Date()
      },
      create: {
        farcasterId,
        displayName,
        profilePicture,
        activeHabits: '[]',
        achievedBadges: '[]'
      }
    })

    // Parse JSON strings back to arrays
    const userWithParsedData = {
      ...user,
      activeHabits: JSON.parse(user.activeHabits),
      achievedBadges: JSON.parse(user.achievedBadges)
    }

    return NextResponse.json(userWithParsedData)
  } catch (error) {
    console.error('Error creating/updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

