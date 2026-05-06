import type { Theme } from '../index';
import type {
  AmountInputConfig,
  TransactionCardConfig,
  PaymentCardConfig,
} from '../../components';

export type OtpInputConfig = {
  cellSize?: { width: number; height: number };
  cellBorderRadius?: number;
  cellBorderWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  gap?: keyof Theme['spacing'];
  activeBorderColor?: keyof Theme['colors'];
  filledBorderColor?: keyof Theme['colors'];
  errorBorderColor?: keyof Theme['colors'];
  defaultBorderColor?: keyof Theme['colors'];
  backgroundColor?: keyof Theme['colors'];
};

export type ButtonConfig = {
  borderRadius?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
};

export type BalanceDisplayConfig = {
  fontSize?: number;
  currencyFontSize?: number;
  fontFamily?: string;
};

// Grow this as you add components
export type FintechKitConfig = {
  otpInput?: OtpInputConfig;
  button?: ButtonConfig;
  amountInput?: AmountInputConfig;
  balanceDisplay?: BalanceDisplayConfig;
  transactionCard?: TransactionCardConfig;
  paymentCard?: PaymentCardConfig;
  // pinPad?: PinPadConfig;
};
