import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { Task } from '../types';
import { COLORS } from '../constants';

const getTaskIcon = (type: string, icon: string) => {
  switch (type) {
    case 'watch_ad':
      return <Icon name="play-circle" size={24} color={COLORS.blue400} />;
    case 'follow':
      return <Icon name="heart" size={24} color={COLORS.pink500} />;
    case 'invite':
      return <Icon name="people" size={24} color={COLORS.green400} />;
    case 'install':
      return <Icon name="star" size={24} color={COLORS.yellow400} />;
    default:
      return <Icon name="gift" size={24} color={COLORS.purple600} />;
  }
};

interface TaskCenterProps {
  tasks: Task[];
  onComplete: (id: string) => void;
}

const TaskCenter: React.FC<TaskCenterProps> = ({ tasks, onComplete }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Banner */}
      <LinearGradient
        colors={[COLORS.yellow500, COLORS.orange600]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.headerBanner}
      >
        <Text style={styles.headerTitle}>Earning Center</Text>
        <Text style={styles.headerSubtitle}>
          Complete simple tasks to unlock more lucky spins and earn thousands of coins!
        </Text>
      </LinearGradient>

      {/* Tasks List */}
      <View style={styles.tasksList}>
        {tasks.map((task) => (
          <View
            key={task.id}
            style={[
              styles.taskCard,
              task.completed && styles.taskCardCompleted,
            ]}
          >
            <View style={styles.taskContent}>
              <View style={styles.taskIconContainer}>
                {getTaskIcon(task.type, task.icon)}
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={styles.taskReward}>
                  <FontAwesome5 name="coins" size={12} color={COLORS.yellow400} />
                  <Text style={styles.taskRewardText}>+{task.reward} Coins</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => onComplete(task.id)}
              disabled={task.completed}
              activeOpacity={0.7}
              style={[
                styles.taskButton,
                task.completed && styles.taskButtonCompleted,
              ]}
            >
              <Text
                style={[
                  styles.taskButtonText,
                  task.completed && styles.taskButtonTextCompleted,
                ]}
              >
                {task.completed ? 'CLAIMED' : 'EARN'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Coming Soon Section */}
      <View style={styles.comingSoon}>
        <Text style={styles.comingSoonText}>More tasks coming soon...</Text>
        <View style={styles.comingSoonIcons}>
          <Icon name="rocket-outline" size={28} color={COLORS.slate600} />
          <Icon name="game-controller-outline" size={28} color={COLORS.slate600} />
          <Feather name="package" size={28} color={COLORS.slate600} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBanner: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
  tasksList: {
    gap: 16,
  },
  taskCard: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.slate700,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskCardCompleted: {
    backgroundColor: 'rgba(51, 65, 85, 0.3)',
    opacity: 0.6,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIconContainer: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.slate700,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: COLORS.white,
    marginBottom: 4,
  },
  taskReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskRewardText: {
    color: COLORS.yellow400,
    fontWeight: 'bold',
    fontSize: 14,
  },
  taskButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.blue600,
  },
  taskButtonCompleted: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  taskButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  taskButtonTextCompleted: {
    color: COLORS.green400,
  },
  comingSoon: {
    padding: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.slate700,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 140,
  },
  comingSoonText: {
    color: COLORS.slate500,
    marginBottom: 12,
    fontSize: 14,
  },
  comingSoonIcons: {
    flexDirection: 'row',
    gap: 16,
    opacity: 0.4,
  },
});

export default TaskCenter;

