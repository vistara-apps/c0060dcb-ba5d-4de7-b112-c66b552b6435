import { Habit, StreakLog, User, Badge } from './types'

const API_BASE = '/api'

export async function getUser(farcasterId: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/users?farcasterId=${farcasterId}`)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export async function createUser(userData: Partial<User>): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function getHabits(userId: string): Promise<Habit[]> {
  try {
    const response = await fetch(`${API_BASE}/habits?userId=${userId}`)
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error('Error fetching habits:', error)
    return []
  }
}

export async function createHabit(habitData: Partial<Habit>): Promise<Habit | null> {
  try {
    const response = await fetch(`${API_BASE}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(habitData)
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Error creating habit:', error)
    return null
  }
}

export async function updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | null> {
  try {
    const response = await fetch(`${API_BASE}/habits`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Error updating habit:', error)
    return null
  }
}

export async function deleteHabit(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/habits?id=${id}`, {
      method: 'DELETE'
    })
    return response.ok
  } catch (error) {
    console.error('Error deleting habit:', error)
    return false
  }
}

export async function logStreak(streakData: {
  habitId: string
  logDate: string
  isAdherent: boolean
  notes?: string
}): Promise<{ streakLog: StreakLog; newStreak: number; badgesUnlocked: Badge[] } | null> {
  try {
    const response = await fetch(`${API_BASE}/streaks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(streakData)
    })
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    console.error('Error logging streak:', error)
    return null
  }
}

export async function getStreakLogs(habitId: string): Promise<StreakLog[]> {
  try {
    const response = await fetch(`${API_BASE}/streaks?habitId=${habitId}`)
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error('Error fetching streak logs:', error)
    return []
  }
}

