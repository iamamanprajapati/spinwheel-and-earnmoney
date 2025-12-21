# Spin & Win Gold - React Native

A React Native version of the Spin & Win Gold application - a gamified reward app with a spinning wheel, daily check-ins, tasks, wallet management, and leaderboards.

## Features

- 🎡 **Spin Wheel** - Animated spinning wheel with various rewards (coins, diamonds)
- 📅 **Daily Check-in** - Streak-based daily rewards system
- 📋 **Task Center** - Complete tasks to earn coins and bonus spins
- 💰 **Wallet** - View balance, diamonds, transaction history, and redeem via Paytm
- 🏆 **Leaderboard** - Weekly rankings of top earners
- 🔮 **Fortune Advice** - AI-powered mystical fortune messages (via Gemini API)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio (for Android emulator)
- Expo Go app on your physical device (optional)

## Installation

1. Navigate to the project directory:
```bash
cd spin-win-gold-native
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up Gemini API for fortune messages:
   - Copy `.env.example` to `.env`
   - Add your Gemini API key

```bash
cp .env.example .env
# Edit .env and add your EXPO_PUBLIC_GEMINI_API_KEY
```

## Running the App

### Start the development server:
```bash
npm start
# or
npx expo start
```

### Run on iOS:
```bash
npm run ios
# or press 'i' in the terminal after starting the dev server
```

### Run on Android:
```bash
npm run android
# or press 'a' in the terminal after starting the dev server
```

### Run on Web:
```bash
npm run web
# or press 'w' in the terminal after starting the dev server
```

## Project Structure

```
spin-win-gold-native/
├── App.tsx                    # Main application component
├── app.json                   # Expo configuration
├── babel.config.js            # Babel configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── assets/                    # App icons and splash screens
└── src/
    ├── types.ts               # TypeScript type definitions
    ├── constants.ts           # App constants (rewards, tasks, colors)
    ├── components/
    │   ├── index.ts           # Component exports
    │   ├── SpinWheel.tsx      # Animated spin wheel component
    │   ├── DailyReward.tsx    # Daily check-in component
    │   ├── Wallet.tsx         # Wallet and redemption component
    │   └── TaskCenter.tsx     # Task list component
    └── services/
        └── geminiService.ts   # Gemini AI integration
```

## Dependencies

- **expo** - Development framework
- **react-native** - Mobile app framework
- **react-native-svg** - SVG support for the wheel
- **expo-linear-gradient** - Gradient backgrounds
- **@react-native-async-storage/async-storage** - Persistent storage
- **@google/generative-ai** - Gemini AI for fortune messages

## Customization

### Modify Rewards
Edit `src/constants.ts` to change wheel rewards:
```typescript
export const REWARDS: RewardItem[] = [
  { id: 0, label: '50', value: 50, type: 'coins', color: '#fbbf24' },
  // Add or modify rewards...
];
```

### Modify Tasks
Edit `src/constants.ts` to change available tasks:
```typescript
export const TASKS: Task[] = [
  { id: '1', title: 'Watch Video Ad', reward: 50, type: 'watch_ad', completed: false, icon: '📺' },
  // Add or modify tasks...
];
```

### Modify Colors
Edit `src/constants.ts` to change the color palette:
```typescript
export const COLORS = {
  slate950: '#0f172a',
  // Modify colors...
};
```

## Building for Production

### Build for iOS:
```bash
npx expo build:ios
# or with EAS Build
eas build --platform ios
```

### Build for Android:
```bash
npx expo build:android
# or with EAS Build
eas build --platform android
```

## Notes

- The app uses AsyncStorage for persistent data storage
- Fortune advice requires a valid Gemini API key
- The redemption feature is a demo and doesn't process real payments

## License

MIT License

