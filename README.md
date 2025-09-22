# HabitFlow - Base Mini App

Build habits that stick. Gamified for life.

## Features

- **Streak Tracking & Visualization**: Visual representation of consecutive days maintaining habits
- **Personalized Habit Guidance**: Tailored tips and motivational messages based on performance
- **Reward & Badge System**: Gamified experience with points, badges, and milestones
- **Social Accountability**: Share progress and compete with friends within Farcaster

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Blockchain**: Base network integration via OnchainKit
- **Mini App**: MiniKit for Farcaster frame integration
- **TypeScript**: Full type safety throughout

## Getting Started

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd habitflow-miniapp
npm install
```

2. **Set up environment variables**:
```bash
cp .env.local.example .env.local
```

Add your OnchainKit API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/).

3. **Run the development server**:
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard page
│   ├── loading.tsx        # Loading UI
│   ├── error.tsx          # Error boundary
│   ├── globals.css        # Global styles
│   └── providers.tsx      # MiniKit & OnchainKit providers
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── HabitCard.tsx     # Individual habit display
│   ├── StreakCounter.tsx # Streak visualization
│   ├── BadgeIcon.tsx     # Achievement badges
│   └── ...
├── lib/                  # Utilities and types
│   ├── types.ts          # TypeScript definitions
│   ├── utils.ts          # Helper functions
│   └── constants.ts      # App constants
└── public/               # Static assets
```

## Key Components

### HabitCard
Displays individual habits with streak progress, completion status, and action buttons.

### StreakCounter
Visual representation of current streak with emoji indicators and progress rings.

### BadgeIcon
Achievement badges with different rarities and unlock animations.

### HabitDashboard
Main dashboard orchestrating all habit tracking functionality.

## Design System

- **Colors**: Dark theme with accent colors for gamification
- **Typography**: Inter font family with consistent sizing
- **Spacing**: Systematic spacing scale (xs, sm, md, lg, xl, xxl)
- **Components**: Reusable UI components with variant support

## Data Model

- **User**: Farcaster identity with habits and badges
- **Habit**: Individual habit with streak metadata and goals
- **StreakLog**: Daily logging entries for habit adherence
- **Badge**: Achievement system with unlock criteria

## Deployment

The app is optimized for deployment on Vercel or similar platforms supporting Next.js 15.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
