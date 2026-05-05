export type BaseProps = {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  testID?: string;
};

export type Currency = {
  code: string;
  symbol: string;
  name: string;
  flag: string;
};
