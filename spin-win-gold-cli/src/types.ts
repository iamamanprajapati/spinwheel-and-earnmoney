export enum View {
  HOME = 'home',
  WHEEL = 'wheel',
  WALLET = 'wallet',
  TASKS = 'tasks',
  LEADERBOARD = 'leaderboard',
  PROFILE = 'profile'
}

export interface UserStats {
  balance: number;
  diamonds: number;
  level: number;
  exp: number;
  spinsLeft: number;
  lastCheckIn: string | null;
  checkInStreak: number;
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  type: 'watch_ad' | 'invite' | 'follow' | 'install';
  completed: boolean;
  icon: string;
}

export interface RewardItem {
  id: number;
  label: string;
  value: number;
  type: 'coins' | 'diamonds' | 'empty';
  color: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'earn' | 'withdraw';
  description: string;
  date: string;
}

