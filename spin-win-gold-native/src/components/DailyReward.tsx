import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';
import { DAILY_REWARDS, COLORS } from '../constants';

interface DailyRewardProps {
  streak: number;
  lastCheckIn: string | null;
  onCheckIn: () => void;
}

const DailyReward: React.FC<DailyRewardProps> = ({ streak, lastCheckIn, onCheckIn }) => {
  const today = new Date().toDateString();
  const canCheckIn = lastCheckIn !== today;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (canCheckIn) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [canCheckIn]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="calendar" size={20} color={COLORS.blue400} />
          <Text style={styles.title}>Daily Check-in</Text>
        </View>
        <View style={styles.streakBadge}>
          <Feather name="zap" size={12} color={COLORS.blue400} />
          <Text style={styles.streakText}>{streak} Day Streak</Text>
        </View>
      </View>

      <View style={styles.rewardsGrid}>
        {DAILY_REWARDS.map((reward, i) => {
          const isClaimed = i < streak;
          const isCurrent = i === streak && canCheckIn;

          return (
            <Animated.View
              key={i}
              style={[
                styles.rewardItem,
                isClaimed && styles.rewardItemClaimed,
                isCurrent && styles.rewardItemCurrent,
                isCurrent && { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.dayText}>Day {i + 1}</Text>
              <Text style={styles.rewardValue}>+{reward}</Text>
              {isClaimed ? (
                <Ionicons name="checkmark-circle" size={14} color={COLORS.green400} style={styles.statusIcon} />
              ) : (
                <FontAwesome5 name="coins" size={10} color={COLORS.yellow400} style={styles.statusIcon} />
              )}
            </Animated.View>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={onCheckIn}
        disabled={!canCheckIn}
        activeOpacity={0.8}
        style={styles.claimButton}
      >
        {canCheckIn ? (
          <LinearGradient
            colors={[COLORS.blue500, COLORS.indigo600]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.claimButtonGradient}
          >
            <Text style={styles.claimButtonText}>Claim Today's Reward</Text>
          </LinearGradient>
        ) : (
          <View style={styles.claimButtonDisabled}>
            <Text style={styles.claimButtonTextDisabled}>Come back tomorrow!</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.slate700,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  streakText: {
    color: COLORS.blue400,
    fontSize: 12,
    fontWeight: '600',
  },
  rewardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rewardItem: {
    width: '23%',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(71, 85, 105, 0.5)',
    borderWidth: 1,
    borderColor: COLORS.slate600,
    marginBottom: 10,
  },
  rewardItemClaimed: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  rewardItemCurrent: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    borderWidth: 2,
    borderColor: COLORS.yellow500,
  },
  dayText: {
    fontSize: 10,
    color: COLORS.slate400,
    marginBottom: 4,
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.yellow400,
  },
  statusIcon: {
    marginTop: 4,
  },
  claimButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  claimButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.blue500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  claimButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  claimButtonDisabled: {
    backgroundColor: COLORS.slate700,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
  },
  claimButtonTextDisabled: {
    color: COLORS.slate500,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DailyReward;

