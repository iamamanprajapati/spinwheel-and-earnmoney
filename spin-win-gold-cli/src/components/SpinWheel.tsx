import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import Svg, { Path, Text as SvgText, Circle, G } from 'react-native-svg';
import { REWARDS, REWARD_WEIGHTS } from '../constants';
import { RewardItem } from '../types';
import { COLORS } from '../constants';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.85;

interface SpinWheelProps {
  onResult: (reward: RewardItem) => void;
  disabled: boolean;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ onResult, disabled }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);

  // Weighted random selection based on probability weights
  const getWeightedRandomReward = (): number => {
    const totalWeight = REWARD_WEIGHTS.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < REWARD_WEIGHTS.length; i++) {
      random -= REWARD_WEIGHTS[i];
      if (random <= 0) {
        return i;
      }
    }
    return REWARD_WEIGHTS.length - 1; // Fallback to last item
  };

  const spin = () => {
    if (disabled || isSpinning) return;

    setIsSpinning(true);
    
    // Select reward using weighted probability
    const selectedIndex = getWeightedRandomReward();
    
    // Calculate rotation to land on the selected segment
    const segmentSize = 360 / REWARDS.length;
    const targetAngle = selectedIndex * segmentSize + segmentSize / 2; // Center of segment
    
    // Add some randomness within the segment (±segmentSize/3) and multiple spins
    const segmentRandomness = (Math.random() - 0.5) * (segmentSize / 3);
    const totalSpins = 5;
    const extraDegrees = Math.floor(Math.random() * 360);
    
    // Calculate final rotation: multiple spins + extra + target angle + small randomness
    const newRotation = currentRotation.current + (totalSpins * 360) + extraDegrees + (360 - targetAngle) + segmentRandomness;
    
    Animated.timing(spinValue, {
      toValue: newRotation,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsSpinning(false);
      currentRotation.current = newRotation;
      onResult(REWARDS[selectedIndex]);
    });
  };

  const segmentAngle = 360 / REWARDS.length;

  const rotateInterpolation = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const renderWheelSegments = () => {
    return REWARDS.map((reward, i) => {
      const startAngle = i * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      
      const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
      const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
      const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
      const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);
      
      const textAngle = startAngle + segmentAngle / 2;
      const textX = 50 + 30 * Math.cos((Math.PI * (textAngle - 90)) / 180);
      const textY = 50 + 30 * Math.sin((Math.PI * (textAngle - 90)) / 180);
      
      return (
        <G key={reward.id}>
          <Path
            d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
            fill={reward.color}
            stroke={COLORS.slate800}
            strokeWidth="0.5"
          />
          <SvgText
            x={textX}
            y={textY}
            fill="white"
            fontSize="4"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="middle"
            rotation={textAngle}
            origin={`${textX}, ${textY}`}
          >
            {reward.label}
          </SvgText>
        </G>
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Pointer */}
      <View style={styles.pointerContainer}>
        <View style={styles.pointer} />
      </View>

      {/* Wheel */}
      <View style={styles.wheelContainer}>
        <Animated.View
          style={[
            styles.wheel,
            {
              transform: [{ rotate: rotateInterpolation }],
            },
          ]}
        >
          <Svg viewBox="0 0 100 100" width={WHEEL_SIZE - 16} height={WHEEL_SIZE - 16}>
            {renderWheelSegments()}
            <Circle cx="50" cy="50" r="8" fill={COLORS.slate800} stroke="white" strokeWidth="1" />
          </Svg>
        </Animated.View>
      </View>

      {/* Spin Button */}
      <TouchableOpacity
        onPress={spin}
        disabled={disabled || isSpinning}
        activeOpacity={0.8}
        style={[
          styles.spinButton,
          (disabled || isSpinning) && styles.spinButtonDisabled,
        ]}
      >
        <Text style={[styles.spinButtonText, (disabled || isSpinning) && styles.spinButtonTextDisabled]}>
          {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
        </Text>
      </TouchableOpacity>

      {disabled && !isSpinning && (
        <Text style={styles.noSpinsText}>Out of spins! Complete tasks to earn more.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pointerContainer: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -15,
    zIndex: 10,
  },
  pointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 25,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: COLORS.red500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  wheelContainer: {
    width: WHEEL_SIZE,
    height: WHEEL_SIZE,
    borderRadius: WHEEL_SIZE / 2,
    borderWidth: 8,
    borderColor: COLORS.slate800,
    overflow: 'hidden',
    shadowColor: COLORS.yellow400,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 10,
    backgroundColor: COLORS.slate900,
  },
  wheel: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinButton: {
    marginTop: 40,
    paddingHorizontal: 50,
    paddingVertical: 18,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: COLORS.yellow400,
  },
  spinButtonDisabled: {
    backgroundColor: COLORS.slate600,
    shadowOpacity: 0,
  },
  spinButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.slate950,
    letterSpacing: 1,
  },
  spinButtonTextDisabled: {
    color: COLORS.slate400,
  },
  noSpinsText: {
    marginTop: 16,
    color: COLORS.red400,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default SpinWheel;

