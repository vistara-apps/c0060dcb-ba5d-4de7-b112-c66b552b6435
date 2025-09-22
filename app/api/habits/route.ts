import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const habits = await prisma.habit.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        streakLogs: {
          orderBy: { logDate: 'desc' },
          take: 30 // Last 30 days
        }
      }
    })

    return NextResponse.json(habits)
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, description, goal, category, icon } = body

    if (!userId || !name || !category) {
      return NextResponse.json({
        error: 'userId, name, and category are required'
      }, { status: 400 })
    }

    const habit = await prisma.habit.create({
      data: {
        userId,
        name,
        description: description || '',
        goal: goal || '',
        category,
        icon: icon || '🎯',
        startDate: new Date(),
        streakMetadata: JSON.stringify({
          currentStreak: 0,
          longestStreak: 0,
          lastLoggedDate: null
        })
      }
    })

    // Update user's active habits
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user) {
      const activeHabits = JSON.parse(user.activeHabits || '[]')
      activeHabits.push(habit.id)

      await prisma.user.update({
        where: { id: userId },
        data: {
          activeHabits: JSON.stringify(activeHabits)
        }
      })
    }

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, goal, category, icon, isActive } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const habit = await prisma.habit.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(goal !== undefined && { goal }),
        ...(category !== undefined && { category }),
        ...(icon !== undefined && { icon }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date()
      }
    })

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error updating habit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    // Soft delete by setting isActive to false
    const habit = await prisma.habit.update({
      where: { id },
      data: { isActive: false }
    })

    // Remove from user's active habits
    const user = await prisma.user.findUnique({
      where: { id: habit.userId }
    })

    if (user) {
      const activeHabits = JSON.parse(user.activeHabits || '[]')
      const updatedActiveHabits = activeHabits.filter((habitId: string) => habitId !== id)

      await prisma.user.update({
        where: { id: habit.userId },
        data: {
          activeHabits: JSON.stringify(updatedActiveHabits)
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting habit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

