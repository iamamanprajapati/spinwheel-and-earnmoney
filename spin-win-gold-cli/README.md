# Spin & Win Gold - React Native CLI

This is a React Native CLI version of the Spin & Win Gold app, identical in UI/UX to the Expo version.

## Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- CocoaPods (for iOS)

## Initial Setup

**Important:** This project needs native Android and iOS folders. You have two options:

### Option 1: Initialize Native Projects (Recommended)

1. First, install dependencies:
```bash
npm install
```

2. Initialize the native projects:
```bash
# For a fresh React Native CLI project structure
npx @react-native-community/cli init SpinWinGoldCLI --skip-install
# Then copy the android/ and ios/ folders from the generated project to this directory
```

### Option 2: Manual Setup

If you already have a React Native CLI project, you can use its android/ and ios/ folders.

## Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS, install CocoaPods:
```bash
cd ios && pod install && cd ..
```

3. For vector icons setup:
   - **Android**: Add to `android/app/build.gradle`:
     ```gradle
     apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
     ```
   - **iOS**: The fonts should be automatically linked, but verify in Xcode that fonts are included in "Copy Bundle Resources"

4. For react-native-linear-gradient:
   - **Android**: Should auto-link
   - **iOS**: Run `cd ios && pod install`

5. For @react-native-community/blur:
   - **Android**: Should auto-link
   - **iOS**: Run `cd ios && pod install`

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

### Start Metro Bundler
```bash
npm start
```

## Project Structure

```
spin-win-gold-cli/
├── src/
│   ├── components/      # React components
│   ├── services/       # API services (Gemini AI)
│   ├── assets/         # Images, Lottie animations
│   ├── constants.ts   # App constants
│   └── types.ts        # TypeScript types
├── App.tsx             # Main app component
├── index.js            # Entry point
└── package.json        # Dependencies
```

## Key Dependencies

- `react-native-linear-gradient` - For gradient backgrounds
- `@react-native-community/blur` - For blur effects
- `react-native-vector-icons` - For icons
- `lottie-react-native` - For Lottie animations
- `react-native-svg` - For SVG graphics (spin wheel)
- `@react-native-async-storage/async-storage` - For local storage
- `@google/generative-ai` - For Gemini AI fortune advice

## Environment Variables

Create a `.env` file in the root directory and add:
```
GEMINI_API_KEY=your_api_key_here
```

## Notes

- This app uses React Native CLI, not Expo
- All UI/UX is identical to the Expo version
- Native modules may require additional setup for vector icons on iOS/Android

