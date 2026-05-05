export type BalanceDisplayConfig = {
  fontSize?: number;
  currencyFontSize?: number;
  fontFamily?: string;
};

export type BalanceDisplayProps = {
  value: number;
  currencyCode?: string;
  currencySymbol?: string;
  /** When true digits are blurred/hidden */
  isHidden?: boolean;
  /** Called when the eye icon is pressed */
  onToggleHidden?: () => void;
  /** Shows skeleton loader instead of value */
  isLoading?: boolean;
  /** Small label above the balance e.g. "Total Balance" */
  label?: string;
  /** Secondary line below balance e.g. "Available: ₦12,000" */
  subtext?: string;
  size?: 'small' | 'medium' | 'large';
  testID?: string;
};
