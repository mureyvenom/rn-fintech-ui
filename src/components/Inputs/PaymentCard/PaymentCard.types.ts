import type { CardScheme } from '../../../utils/card';

export type PaymentCardConfig = {
  width?: number;
  height?: number;
  borderRadius?: number;
  fontSize?: number;
};

export type PaymentCardProps = {
  /** Last 4 digits OR full masked number */
  cardNumber: string;
  cardholderName: string;
  expiry: string; // 'MM/YY'
  /** Override auto-detected scheme */
  scheme?: CardScheme;
  /** Override the scheme's default background color */
  backgroundColor?: string;
  /** Second color — creates a subtle diagonal gradient feel via two Views */
  backgroundColorSecondary?: string;
  /** Show the full masked number or just last 4 */
  showFullNumber?: boolean;
  /** Called when the card is tapped */
  onPress?: () => void;
  testID?: string;
};
