import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View as ViewEnum, UserStats, RewardItem, Task, Transaction } from './src/types';
import { TASKS, COLORS } from './src/constants';
import { SpinWheel, DailyReward, Wallet, TaskCenter } from './src/components';
import { getFortuneAdvice } from './src/services/geminiService';

const STORAGE_KEY = 'spin_win_stats';

const getTaskIcon = (type: string) => {
  switch (type) {
    case 'watch_ad':
      return <Icon name="play-circle" size={22} color={COLORS.blue400} />;
    case 'follow':
      return <Icon name="heart" size={22} color={COLORS.pink500} />;
    case 'invite':
      return <Icon name="people" size={22} color={COLORS.green400} />;
    case 'install':
      return <Icon name="star" size={22} color={COLORS.yellow400} />;
    default:
      return <Icon name="gift" size={22} color={COLORS.purple600} />;
  }
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewEnum>(ViewEnum.WHEEL);
  const [stats, setStats] = useState<UserStats>({
    balance: 250,
    diamonds: 0,
    level: 1,
    exp: 20,
    spinsLeft: 5,
    lastCheckIn: null,
    checkInStreak: 0
  });
  
  // Animation states for balance changes
  const [pointsAdded, setPointsAdded] = useState<number | null>(null);
  const balanceScaleAnim = useRef(new Animated.Value(1)).current;
  const floatingTextAnim = useRef(new Animated.Value(0)).current;
  const floatingOpacityAnim = useRef(new Animated.Value(0)).current;
  const prevBalanceRef = useRef(stats.balance);

  // Animate when balance increases
  useEffect(() => {
    const diff = stats.balance - prevBalanceRef.current;
    if (diff > 0) {
      setPointsAdded(diff);
      
      // Reset animations
      floatingTextAnim.setValue(0);
      floatingOpacityAnim.setValue(1);
      balanceScaleAnim.setValue(1);
      
      // Run animations
      Animated.parallel([
        // Pulse the balance badge
        Animated.sequence([
          Animated.timing(balanceScaleAnim, {
            toValue: 1.15,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(balanceScaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        // Float up the +X text
        Animated.timing(floatingTextAnim, {
          toValue: -40,
          duration: 800,
          useNativeDriver: true,
        }),
        // Fade out the floating text
        Animated.timing(floatingOpacityAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setPointsAdded(null);
      });
    }
    prevBalanceRef.current = stats.balance;
  }, [stats.balance]);
  const [userTasks, setUserTasks] = useState<Task[]>(TASKS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fortune, setFortune] = useState<string>("Touch the wheel of fate...");
  const [isLuckLoading, setIsLuckLoading] = useState(false);

  // Load saved stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setStats(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

  // Save stats
  useEffect(() => {
    const saveStats = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
      } catch (error) {
        console.error('Error saving stats:', error);
      }
    };
    saveStats();
  }, [stats]);

  const addTransaction = (amount: number, type: 'earn' | 'withdraw', desc: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      amount,
      type,
      description: desc,
      date: new Date().toLocaleDateString()
    };
    setTransactions(prev => [newTx, ...prev].slice(0, 10));
  };

  const fetchLuck = async () => {
    setIsLuckLoading(true);
    const advice = await getFortuneAdvice(stats.balance, stats.checkInStreak);
    setFortune(advice);
    setIsLuckLoading(false);
  };

  const handleWheelResult = (reward: RewardItem) => {
    const coinsToAdd = reward.type === 'coins' ? reward.value : 0;
    
    setStats(prev => ({
      ...prev,
      balance: prev.balance + coinsToAdd,
      spinsLeft: prev.spinsLeft - 1,
      exp: prev.exp + 10
    }));

    if (reward.value > 0) {
      addTransaction(reward.value, 'earn', `Lucky Spin: ${reward.label} Coins`);
    }
    
    fetchLuck();
  };

  const handleCheckIn = () => {
    const rewards = [10, 20, 50, 100, 150, 250, 1000];
    const amount = rewards[stats.checkInStreak % 7];
    
    setStats(prev => ({
      ...prev,
      balance: prev.balance + amount,
      checkInStreak: prev.checkInStreak + 1,
      lastCheckIn: new Date().toDateString(),
      spinsLeft: prev.spinsLeft + 2
    }));

    addTransaction(amount, 'earn', 'Daily Check-in Reward');
    Alert.alert('Success!', `You earned ${amount} coins and 2 bonus spins!`);
  };

  const handleTaskComplete = (taskId: string) => {
    const task = userTasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    setUserTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: true } : t));
    setStats(prev => ({
      ...prev,
      balance: prev.balance + task.reward,
      spinsLeft: prev.spinsLeft + 1
    }));
    addTransaction(task.reward, 'earn', `Task: ${task.title}`);
  };

  const handleWithdraw = (amount: number, method: string, details: string) => {
    if (stats.balance < amount) return;
    setStats(prev => ({ ...prev, balance: prev.balance - amount }));
    addTransaction(amount, 'withdraw', `${method} payout to ${details}`);
    Alert.alert(
      'Success!',
      `Redemption request for ₹${amount/1000} successfully submitted for Paytm number ${details}. Processing takes 24-48 hours.`
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case ViewEnum.HOME:
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScroll}>
            {/* Welcome Banner */}
            <LinearGradient
              colors={[COLORS.indigo600, COLORS.purple600, COLORS.pink500]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.welcomeBanner}
            >
              <View style={styles.bannerDecor}>
                <MaterialCommunityIcons name="slot-machine" size={100} color="white" />
              </View>
              <Text style={styles.welcomeTitle}>SPIN YOUR{'\n'}WAY TO GOLD</Text>
              <Text style={styles.welcomeSubtitle}>You have {stats.spinsLeft} free spins left today!</Text>
              <TouchableOpacity
                onPress={() => setActiveView(ViewEnum.WHEEL)}
                activeOpacity={0.9}
                style={styles.playButton}
              >
                <View style={styles.playButtonContent}>
                  <Icon name="play" size={16} color={COLORS.indigo600} />
                  <Text style={styles.playButtonText}>PLAY NOW</Text>
                </View>
              </TouchableOpacity>
            </LinearGradient>

            <View style={styles.sectionSpacing}>
              <DailyReward 
                streak={stats.checkInStreak} 
                lastCheckIn={stats.lastCheckIn} 
                onCheckIn={handleCheckIn} 
              />
            </View>

            {/* Popular Tasks Section */}
            <View style={styles.popularTasksCard}>
              <View style={styles.sectionTitleRow}>
                <Icon name="flame" size={20} color={COLORS.orange500} />
                <Text style={styles.sectionTitle}>Popular Tasks</Text>
              </View>
              {userTasks.slice(0, 2).map(task => (
                <View key={task.id} style={styles.miniTaskCard}>
                  <View style={styles.miniTaskContent}>
                    <View style={styles.miniTaskIconContainer}>
                      {getTaskIcon(task.type)}
                    </View>
                    <View>
                      <Text style={styles.miniTaskTitle}>{task.title}</Text>
                      <View style={styles.miniTaskRewardRow}>
                        <FontAwesome5 name="coins" size={10} color={COLORS.yellow500} />
                        <Text style={styles.miniTaskReward}>+{task.reward} Coins</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleTaskComplete(task.id)}
                    disabled={task.completed}
                    style={[styles.miniTaskButtonContainer, task.completed && styles.miniTaskButtonContainerClaimed]}
                  >
                    {task.completed ? (
                      <Icon name="checkmark-circle" size={16} color={COLORS.green400} />
                    ) : (
                      <Feather name="arrow-right" size={16} color={COLORS.blue400} />
                    )}
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity onPress={() => setActiveView(ViewEnum.TASKS)} style={styles.viewAllButton}>
                <Text style={styles.viewAllText}>VIEW ALL TASKS</Text>
                <Feather name="chevron-right" size={14} color={COLORS.slate500} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        );

      case ViewEnum.WHEEL:
        return (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.wheelContent}>
            {/* Fortune Section */}
            <View style={styles.fortuneSection}>
              <View style={styles.fortuneBadge}>
                <Text style={styles.fortuneBadgeText}>LUCKY FORTUNE</Text>
              </View>
              <View style={styles.fortuneCard}>
                <Text style={styles.fortuneText}>
                  {isLuckLoading ? 'Consulting the stars...' : `"${fortune}"`}
                </Text>
                <View style={styles.fortunePointer} />
              </View>
            </View>
            
            <SpinWheel 
              disabled={stats.spinsLeft <= 0} 
              onResult={handleWheelResult} 
            />

            {/* Stats Cards */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>FREE SPINS</Text>
                <Text style={styles.statValue}>{stats.spinsLeft}</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statLabel}>TOTAL EARNED</Text>
                <Text style={[styles.statValue, styles.statValueGreen]}>
                  {transactions.filter(t => t.type === 'earn').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
                </Text>
              </View>
            </View>
          </ScrollView>
        );

      case ViewEnum.WALLET:
        return (
          <Wallet 
            balance={stats.balance} 
            diamonds={0} 
            transactions={transactions}
            onWithdraw={handleWithdraw}
          />
        );

      case ViewEnum.TASKS:
        return (
          <TaskCenter 
            tasks={userTasks} 
            onComplete={handleTaskComplete} 
          />
        );

      case ViewEnum.LEADERBOARD:
        return (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.contentScroll}>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.leaderboardTitle}>TOP EARNERS</Text>
              <Text style={styles.leaderboardSubtitle}>Weekly rankings update every Sunday</Text>
            </View>
            
            {[
              { name: 'Alex_Pro', score: 1250000, rank: 1 },
              { name: 'SpinnMaster', score: 980000, rank: 2 },
              { name: 'LuckyLady', score: 850000, rank: 3 },
              { name: 'CoinKing', score: 420000, rank: 4 },
              { name: 'FortuneSeeker', score: 150000, rank: 5 },
            ].map(user => (
              <View key={user.rank} style={styles.leaderboardCard}>
                <View style={styles.leaderboardUser}>
                  <Text style={[
                    styles.leaderboardRank,
                    user.rank === 1 && styles.rankGold,
                    user.rank === 2 && styles.rankSilver,
                    user.rank === 3 && styles.rankBronze,
                  ]}>
                    #{user.rank}
                  </Text>
                  <View style={styles.leaderboardAvatar}>
                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                  </View>
                  <Text style={styles.leaderboardName}>{user.name}</Text>
                </View>
                <View style={styles.leaderboardScoreRow}>
                  <Text style={styles.leaderboardScore}>{user.score.toLocaleString()}</Text>
                  <FontAwesome5 name="coins" size={12} color={COLORS.yellow500} />
                </View>
              </View>
            ))}
            
            <View style={styles.yourRankCard}>
              <Text style={styles.yourRankLabel}>YOU ARE CURRENTLY</Text>
              <Text style={styles.yourRankValue}>#4,291</Text>
              <Text style={styles.yourRankHint}>Keep spinning to climb the ladder!</Text>
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.slate950} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{stats.level}</Text>
          </View>
          <View>
            <Text style={styles.levelLabel}>LEVEL</Text>
            <View style={styles.expBar}>
              <View style={[styles.expProgress, { width: `${stats.exp % 100}%` }]} />
            </View>
          </View>
        </View>
        
        <View style={styles.balanceWrapper}>
          {/* Floating +X animation */}
          {pointsAdded !== null && (
            <Animated.View
              style={[
                styles.floatingPoints,
                {
                  transform: [{ translateY: floatingTextAnim }],
                  opacity: floatingOpacityAnim,
                },
              ]}
            >
              <Text style={styles.floatingPointsText}>+{pointsAdded}</Text>
            </Animated.View>
          )}
          
          <Animated.View
            style={[
              styles.balanceBadge,
              { transform: [{ scale: balanceScaleAnim }] },
            ]}
          >
            <FontAwesome5 name="coins" size={16} color={COLORS.yellow400} />
            <Text style={styles.balanceText}>{stats.balance.toLocaleString()}</Text>
          </Animated.View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {renderContent()}
      </View>

      {/* Modern Floating Bottom Navigation */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.bottomNav}>
        <NavBtn 
          active={activeView === ViewEnum.HOME} 
          onPress={() => setActiveView(ViewEnum.HOME)} 
          iconName="home" 
          label="Home" 
        />
        <NavBtn 
          active={activeView === ViewEnum.TASKS} 
          onPress={() => setActiveView(ViewEnum.TASKS)} 
          iconName="list" 
          label="Tasks" 
        />
          
          {/* Centered Spin Button with Glow */}
          <View style={styles.spinNavWrapper}>
            <View style={styles.spinNavGlow} />
            <TouchableOpacity 
              onPress={() => setActiveView(ViewEnum.WHEEL)}
              activeOpacity={0.9}
              style={styles.spinNavButtonContainer}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF8C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.spinNavButton,
                  activeView === ViewEnum.WHEEL && styles.spinNavButtonActive
                ]}
              >
                <MaterialCommunityIcons name="tire" size={28} color={COLORS.slate950} style={styles.spinNavIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
        <NavBtn 
          active={activeView === ViewEnum.WALLET} 
          onPress={() => setActiveView(ViewEnum.WALLET)} 
          iconName="wallet" 
          label="Wallet" 
        />
        <NavBtn 
          active={activeView === ViewEnum.LEADERBOARD} 
          onPress={() => setActiveView(ViewEnum.LEADERBOARD)} 
          iconName="trophy" 
          label="Ranks" 
        />
        </View>
      </View>
    </SafeAreaView>
  );
};

interface NavBtnProps {
  active: boolean;
  onPress: () => void;
  iconName: string;
  label: string;
}

const NavBtn: React.FC<NavBtnProps> = ({ active, onPress, iconName, label }) => {
  const getIconComponent = () => {
    const iconColor = active ? COLORS.indigo600 : COLORS.slate500;
    const iconSize = 22;
    
    switch (iconName) {
      case 'home':
        return <Icon name={active ? "home" : "home-outline"} size={iconSize} color={iconColor} />;
      case 'list':
        return <Icon name={active ? "checkbox" : "checkbox-outline"} size={iconSize} color={iconColor} />;
      case 'wallet':
        return <Icon name={active ? "wallet" : "wallet-outline"} size={iconSize} color={iconColor} />;
      case 'trophy':
        return <Icon name={active ? "trophy" : "trophy-outline"} size={iconSize} color={iconColor} />;
      default:
        return <Icon name="ellipse" size={iconSize} color={iconColor} />;
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.navButton}>
      <View style={[styles.navIconContainer, active && styles.navIconContainerActive]}>
        {getIconComponent()}
      </View>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.slate950,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    width: 42,
    height: 42,
    backgroundColor: COLORS.yellow400,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    color: COLORS.slate950,
    fontWeight: 'bold',
    fontSize: 16,
  },
  levelLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
  },
  expBar: {
    width: 80,
    height: 6,
    backgroundColor: COLORS.slate800,
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  expProgress: {
    height: '100%',
    backgroundColor: COLORS.yellow400,
    borderRadius: 3,
  },
  balanceWrapper: {
    position: 'relative',
  },
  floatingPoints: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  floatingPointsText: {
    color: COLORS.green400,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(74, 222, 128, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  balanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate900,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.slate800,
    gap: 8,
  },
  balanceIcon: {
    fontSize: 18,
  },
  balanceText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentScroll: {
    flex: 1,
  },
  wheelContent: {
    alignItems: 'center',
    paddingBottom: 140,
  },
  
  // Welcome Banner
  welcomeBanner: {
    padding: 28,
    borderRadius: 32,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerDecor: {
    position: 'absolute',
    top: -30,
    right: -30,
    opacity: 0.2,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    lineHeight: 34,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: 'rgba(199, 210, 254, 0.9)',
    fontSize: 14,
  },
  playButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  playButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  playButtonText: {
    color: COLORS.indigo600,
    fontWeight: 'bold',
    fontSize: 14,
  },
  sectionSpacing: {
    marginBottom: 24,
  },
  
  // Popular Tasks
  popularTasksCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.slate800,
    marginBottom: 140,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  miniTaskCard: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  miniTaskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniTaskIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(71, 85, 105, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTaskTitle: {
    fontWeight: '600',
    color: COLORS.white,
    fontSize: 14,
  },
  miniTaskRewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  miniTaskReward: {
    color: COLORS.yellow500,
    fontSize: 12,
    fontWeight: '600',
  },
  miniTaskButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTaskButtonContainerClaimed: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  viewAllButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  viewAllText: {
    color: COLORS.slate500,
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Fortune Section
  fortuneSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  fortuneBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.3)',
    borderRadius: 20,
    marginBottom: 16,
  },
  fortuneBadgeText: {
    color: COLORS.yellow500,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  fortuneCard: {
    backgroundColor: COLORS.slate900,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.slate800,
    minHeight: 80,
    justifyContent: 'center',
    maxWidth: 280,
  },
  fortuneText: {
    color: COLORS.white,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  fortunePointer: {
    position: 'absolute',
    bottom: -8,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 16,
    backgroundColor: COLORS.slate900,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.slate800,
    transform: [{ rotate: '45deg' }],
  },
  
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 40,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.slate800,
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.slate500,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statValueGreen: {
    color: COLORS.green400,
  },
  
  // Leaderboard
  leaderboardHeader: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  leaderboardTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.yellow500,
    marginBottom: 8,
  },
  leaderboardSubtitle: {
    color: COLORS.slate500,
    fontSize: 14,
  },
  leaderboardCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.slate800,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leaderboardUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leaderboardRank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.slate600,
    width: 35,
  },
  rankGold: {
    color: COLORS.yellow500,
  },
  rankSilver: {
    color: COLORS.slate400,
  },
  rankBronze: {
    color: COLORS.orange600,
  },
  leaderboardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.slate700,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.slate600,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  leaderboardName: {
    fontWeight: 'bold',
    color: COLORS.white,
    fontSize: 15,
  },
  leaderboardScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  leaderboardScore: {
    color: COLORS.yellow500,
    fontWeight: 'bold',
    fontSize: 14,
  },
  yourRankCard: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 140,
  },
  yourRankLabel: {
    color: COLORS.blue400,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  yourRankValue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  yourRankHint: {
    color: COLORS.slate500,
    fontSize: 12,
    marginTop: 8,
  },
  
  // Modern Floating Bottom Navigation
  bottomNavWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  bottomNav: {
    overflow: 'hidden',
    backgroundColor: Platform.OS === 'ios' ? 'rgba(30, 41, 59, 0.75)' : 'rgba(30, 41, 59, 0.95)',
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
  },
  navIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  navIconContainerActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.15)',
    transform: [{ scale: 1.1 }],
    borderRadius: 14,
  },
  navLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.slate500,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  navLabelActive: {
    color: COLORS.indigo600,
    fontWeight: '700',
  },
  spinNavWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
    marginHorizontal: 4,
    flex: 0,
  },
  spinNavGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.orange500,
    opacity: 0.25,
    transform: [{ scale: 1.2 }],
  },
  spinNavButtonContainer: {
    alignItems: 'center',
  },
  spinNavButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(30, 41, 59, 0.9)',
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 12,
  },
  spinNavIcon: {
    backgroundColor: 'transparent',
  },
  spinNavButtonActive: {
    transform: [{ scale: 1.05 }],
    shadowOpacity: 0.8,
    shadowRadius: 18,
  },
});

export default App;

