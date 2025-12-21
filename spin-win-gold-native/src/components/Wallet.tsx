import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Transaction } from '../types';
import { COLORS } from '../constants';

interface WalletProps {
  balance: number;
  diamonds: number;
  transactions: Transaction[];
  onWithdraw: (amount: number, method: string, details: string) => void;
}

const Wallet: React.FC<WalletProps> = ({ balance, diamonds, transactions, onWithdraw }) => {
  const [paytmNumber, setPaytmNumber] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState(10000);
  const [error, setError] = useState('');

  const withdrawOptions = [
    { amount: 10000, cash: '₹10' },
    { amount: 50000, cash: '₹50' },
    { amount: 100000, cash: '₹100' },
    { amount: 250000, cash: '₹250' },
  ];

  const handleRedeemClick = () => {
    if (paytmNumber.length !== 10 || !/^\d+$/.test(paytmNumber)) {
      setError('Please enter a valid 10-digit Paytm number');
      return;
    }
    setError('');
    onWithdraw(withdrawAmount, 'Paytm', paytmNumber);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Balance Card */}
      <LinearGradient
        colors={[COLORS.indigo600, COLORS.purple700]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceDecor}>
          <FontAwesome5 name="coins" size={100} color="white" />
        </View>
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceValue}>{balance.toLocaleString()}</Text>
            <Text style={styles.balanceCurrency}>COINS</Text>
          </View>
          <View style={styles.diamondBadge}>
            <Ionicons name="diamond" size={18} color={COLORS.blue400} />
            <Text style={styles.diamondText}>{diamonds} Diamonds</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Redemption Section */}
      <View style={styles.redeemCard}>
        <View style={styles.redeemHeader}>
          <View style={styles.redeemTitleRow}>
            <MaterialCommunityIcons name="bank-transfer-out" size={22} color={COLORS.green400} />
            <Text style={styles.redeemTitle}>Redeem via Paytm</Text>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>PAYTM PHONE NUMBER</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit number"
            placeholderTextColor={COLORS.slate600}
            keyboardType="phone-pad"
            maxLength={10}
            value={paytmNumber}
            onChangeText={(text) => {
              const val = text.replace(/\D/g, '');
              setPaytmNumber(val);
              if (error) setError('');
            }}
          />
          {error ? (
            <View style={styles.errorRow}>
              <Ionicons name="warning" size={14} color={COLORS.red400} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.optionsGrid}>
          {withdrawOptions.map((opt) => (
            <TouchableOpacity
              key={opt.amount}
              onPress={() => setWithdrawAmount(opt.amount)}
              activeOpacity={0.7}
              style={[
                styles.optionCard,
                withdrawAmount === opt.amount && styles.optionCardSelected,
              ]}
            >
              <Text style={styles.optionCash}>{opt.cash}</Text>
              <Text style={styles.optionCoins}>{opt.amount.toLocaleString()} Coins</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleRedeemClick}
          disabled={balance < withdrawAmount}
          activeOpacity={0.8}
          style={styles.redeemButtonContainer}
        >
          {balance >= withdrawAmount ? (
            <LinearGradient
              colors={[COLORS.blue500, COLORS.indigo600]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.redeemButton}
            >
              <Text style={styles.redeemButtonText}>REDEEM TO PAYTM</Text>
            </LinearGradient>
          ) : (
            <View style={styles.redeemButtonDisabled}>
              <Text style={styles.redeemButtonTextDisabled}>NOT ENOUGH COINS</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Recent History */}
      <View style={styles.historyCard}>
        <View style={styles.historyTitleRow}>
          <Ionicons name="time-outline" size={20} color={COLORS.slate400} />
          <Text style={styles.historyTitle}>History</Text>
        </View>
        <View style={styles.historyList}>
          {transactions.length === 0 ? (
            <Text style={styles.noTransactions}>No transactions yet.</Text>
          ) : (
            transactions.map((t) => (
              <View key={t.id} style={styles.transactionItem}>
                <View>
                  <Text style={styles.transactionDesc}>{t.description}</Text>
                  <Text style={styles.transactionDate}>{t.date}</Text>
                </View>
                <Text
                  style={[
                    styles.transactionAmount,
                    t.type === 'earn' ? styles.amountEarn : styles.amountWithdraw,
                  ]}
                >
                  {t.type === 'earn' ? '+' : '-'}{t.amount.toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceCard: {
    padding: 30,
    borderRadius: 32,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  balanceDecor: {
    position: 'absolute',
    top: -20,
    right: -20,
    opacity: 0.1,
    transform: [{ rotate: '12deg' }],
  },
  balanceDecorEmoji: {
    fontSize: 120,
  },
  balanceContent: {
    position: 'relative',
    zIndex: 10,
  },
  balanceLabel: {
    color: 'rgba(199, 210, 254, 0.8)',
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 14,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  balanceValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  balanceCurrency: {
    color: COLORS.yellow400,
    fontWeight: 'bold',
    fontSize: 16,
  },
  diamondBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
  diamondText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  redeemCard: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.slate700,
    marginBottom: 20,
  },
  redeemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  redeemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  redeemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.slate400,
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.slate900,
    borderWidth: 1,
    borderColor: COLORS.slate700,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  errorText: {
    color: COLORS.red400,
    fontSize: 12,
    fontWeight: '600',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.slate700,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    marginBottom: 12,
    opacity: 0.7,
  },
  optionCardSelected: {
    borderColor: COLORS.blue500,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    opacity: 1,
  },
  optionCash: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  optionCoins: {
    fontSize: 10,
    color: COLORS.slate400,
    marginTop: 4,
  },
  redeemButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  redeemButton: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  redeemButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  redeemButtonDisabled: {
    backgroundColor: COLORS.slate700,
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  redeemButtonTextDisabled: {
    color: COLORS.slate500,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  historyCard: {
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.slate700,
    marginBottom: 140,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  historyList: {
    gap: 12,
  },
  noTransactions: {
    color: COLORS.slate500,
    textAlign: 'center',
    paddingVertical: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  transactionDesc: {
    fontWeight: '600',
    color: COLORS.white,
    fontSize: 14,
  },
  transactionDate: {
    fontSize: 11,
    color: COLORS.slate500,
    marginTop: 2,
  },
  transactionAmount: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  amountEarn: {
    color: COLORS.green400,
  },
  amountWithdraw: {
    color: COLORS.red400,
  },
});

export default Wallet;

