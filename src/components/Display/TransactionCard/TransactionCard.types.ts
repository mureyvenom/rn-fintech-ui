export type TransactionStatus = 'completed' | 'pending' | 'failed';

export type TransactionType = 'debit' | 'credit';

export type Transaction = {
  id: string;
  merchantName: string;
  /** Emoji icon e.g. '🛒'. Falls back to first letter of merchantName */
  merchantIcon?: string;
  category?: string;
  amount: number;
  currencySymbol?: string;
  currencyCode?: string;
  type: TransactionType;
  status: TransactionStatus;
  /** ISO date string or Date object */
  date: string | Date;
  /** Optional reference number shown in subtext */
  reference?: string;
};

export type TransactionCardConfig = {
  borderRadius?: number;
  iconSize?: number;
  iconBorderRadius?: number;
  fontSize?: number;
  amountFontSize?: number;
  subtextFontSize?: number;
};

export type TransactionCardProps = {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
  /** Override the formatted date string */
  dateLabel?: string;
  testID?: string;
};
