import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

// Lottie animation sources from LottieFiles CDN
export const LOTTIE_ICONS = {
  home: 'https://lottie.host/embed/e9ec8d82-7c3c-4c3e-8a58-7fb95fff1d5e/ZKH0K0QoXj.json',
  tasks: 'https://lottie.host/embed/8c6e5d40-7e5c-4d46-8c8e-2b5f3d1d8f9c/checklist.json',
  spin: 'https://lottie.host/embed/b8e3c4f5-9e4d-4c5a-8b7e-1c2d3e4f5a6b/wheel.json',
  wallet: 'https://lottie.host/embed/f5e4d3c2-1b0a-9c8d-7e6f-5a4b3c2d1e0f/wallet.json',
  trophy: 'https://lottie.host/embed/1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d/trophy.json',
  coin: 'https://lottie.host/embed/2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e/coin.json',
  diamond: 'https://lottie.host/embed/3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f/diamond.json',
  check: 'https://lottie.host/embed/4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a/check.json',
  star: 'https://lottie.host/embed/5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b/star.json',
  gift: 'https://lottie.host/embed/6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c/gift.json',
};

// Local Lottie JSON animations (bundled with app for better performance)
export const LOTTIE_ANIMATIONS = {
  // Home icon animation
  home: require('../assets/lottie/home.json'),
  // Tasks/Clipboard animation
  tasks: require('../assets/lottie/tasks.json'),
  // Spin wheel animation
  spin: require('../assets/lottie/spin.json'),
  // Wallet animation
  wallet: require('../assets/lottie/wallet.json'),
  // Trophy animation
  trophy: require('../assets/lottie/trophy.json'),
  // Coin animation
  coin: require('../assets/lottie/coin.json'),
  // Success check animation
  success: require('../assets/lottie/success.json'),
  // Gift/Reward animation
  gift: require('../assets/lottie/gift.json'),
  // Confetti celebration
  confetti: require('../assets/lottie/confetti.json'),
  // Loading spinner
  loading: require('../assets/lottie/loading.json'),
};

interface LottieIconProps {
  name: keyof typeof LOTTIE_ANIMATIONS;
  size?: number;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  style?: any;
}

const LottieIcon: React.FC<LottieIconProps> = ({
  name,
  size = 32,
  autoPlay = true,
  loop = true,
  speed = 1,
  style,
}) => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (autoPlay && animationRef.current) {
      animationRef.current.play();
    }
  }, [autoPlay]);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <LottieView
        ref={animationRef}
        source={LOTTIE_ANIMATIONS[name]}
        style={{ width: size, height: size }}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LottieIcon;

