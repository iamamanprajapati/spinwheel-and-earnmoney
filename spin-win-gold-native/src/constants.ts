import { RewardItem, Task } from './types';

export const REWARDS: RewardItem[] = [
  { id: 0, label: '50', value: 50, type: 'coins', color: '#fbbf24' },
  { id: 1, label: '10', value: 10, type: 'diamonds', color: '#60a5fa' },
  { id: 2, label: '100', value: 100, type: 'coins', color: '#f59e0b' },
  { id: 3, label: 'Try Again', value: 0, type: 'empty', color: '#94a3b8' },
  { id: 4, label: '250', value: 250, type: 'coins', color: '#fcd34d' },
  { id: 5, label: '5', value: 5, type: 'diamonds', color: '#93c5fd' },
  { id: 6, label: '500', value: 500, type: 'coins', color: '#d97706' },
  { id: 7, label: 'JACKPOT', value: 2000, type: 'coins', color: '#ef4444' },
];

export const TASKS: Task[] = [
  { id: '1', title: 'Watch Video Ad', reward: 50, type: 'watch_ad', completed: false, icon: '📺' },
  { id: '2', title: 'Follow on Instagram', reward: 100, type: 'follow', completed: false, icon: '📸' },
  { id: '3', title: 'Invite 1 Friend', reward: 500, type: 'invite', completed: false, icon: '👥' },
  { id: '4', title: 'Rate 5 Stars', reward: 150, type: 'install', completed: false, icon: '⭐' },
  { id: '5', title: 'Join Telegram', reward: 100, type: 'follow', completed: false, icon: '✈️' },
];

export const DAILY_REWARDS = [10, 20, 50, 100, 150, 250, 1000];

// Colors
export const COLORS = {
  slate950: '#0f172a',
  slate900: '#1e293b',
  slate800: '#334155',
  slate700: '#475569',
  slate600: '#64748b',
  slate500: '#94a3b8',
  slate400: '#cbd5e1',
  yellow400: '#facc15',
  yellow500: '#eab308',
  orange500: '#f97316',
  orange600: '#ea580c',
  indigo600: '#4f46e5',
  purple600: '#9333ea',
  purple700: '#7c3aed',
  pink500: '#ec4899',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  green400: '#4ade80',
  green500: '#22c55e',
  red400: '#f87171',
  red500: '#ef4444',
  white: '#ffffff',
};

