import {
  TransactionCard,
  type Transaction,
  Box,
} from 'react-native-fintech-kit';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ParamList } from '../navigators/AppNavigator';

const transactions: Transaction[] = [
  {
    id: '1',
    merchantName: 'Shoprite Nigeria',
    merchantIcon: '🛒',
    category: 'Groceries',
    amount: 12500,
    currencySymbol: '₦',
    currencyCode: 'NGN',
    type: 'debit',
    status: 'completed',
    date: new Date(),
  },
  {
    id: '2',
    merchantName: 'GTBank',
    category: 'Income',
    amount: 450000,
    currencyCode: 'NGN',
    type: 'credit',
    status: 'completed',
    date: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    merchantName: 'Binance',
    merchantIcon: '₿',
    category: 'Crypto',
    amount: 85000,
    currencyCode: 'NGN',
    type: 'debit',
    status: 'pending',
    date: '2025-01-03T10:30:00Z',
    reference: 'BNB-4421',
  },
];

export const TransactionsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TransactionCard
          transaction={item}
          onPress={() => navigation.navigate('TransactionCardScreen')}
        />
      )}
      ItemSeparatorComponent={() => <Box height={8} />}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};
