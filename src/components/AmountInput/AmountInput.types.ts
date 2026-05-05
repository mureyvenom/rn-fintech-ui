export type AmountInputConfig = {
  height?: number;
  borderRadius?: number;
  borderWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  currencyFontSize?: number;
  currencyFontFamily?: string;
};

export type AmountInputProps = {
  /** Raw numeric value — always a number, never a string */
  value: number;
  /** Called with the raw numeric value on every valid change */
  onChange: (value: number) => void;
  /** Currency symbol displayed as prefix. Defaults to '₦' */
  currency?: string;
  /** Decimal config — 0 for whole numbers, 2 for standard */
  decimals?: number;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Error shown when value < min */
  minErrorMessage?: string;
  /** Error shown when value > max */
  maxErrorMessage?: string;
  /** External error message — overrides validation errors */
  errorMessage?: string;
  /** When provided, the currency symbol becomes a tappable trigger */
  onCurrencyPress?: () => void;
  /** Label shown above the input */
  label?: string;
  /** Placeholder shown when value is 0 */
  placeholder?: string;
  disabled?: boolean;
  testID?: string;
  /** Called when validation passes after a change */
  onValidChange?: (value: number) => void;
};
