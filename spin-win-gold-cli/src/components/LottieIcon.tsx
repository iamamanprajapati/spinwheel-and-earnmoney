import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

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

