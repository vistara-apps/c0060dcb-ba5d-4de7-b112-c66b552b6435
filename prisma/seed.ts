import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Seed badges
  const badges = [
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
    },
    {
      id: 'consistency-king',
      name: 'Consistency King',
      description: 'Log habits for 30 consecutive days',
      iconUrl: '👑',
      unlockCriteria: { type: 'consistency', value: 30 },
      rarity: 'epic'
    },
    {
      id: 'habit-collector',
      name: 'Habit Collector',
      description: 'Create and maintain 5 active habits',
      iconUrl: '🎯',
      unlockCriteria: { type: 'milestone', value: 5 },
      rarity: 'rare'
    }
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { id: badge.id },
      update: badge,
      create: badge
    })
  }

  console.log('Database seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

