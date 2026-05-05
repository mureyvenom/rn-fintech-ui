import type { buttonSizes } from './ButtonBase.styles';

export type ButtonBaseProps = {
  onPress?: () => void;
  children: React.ReactNode;

  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;

  loading?: boolean;

  accessibilityLabel?: string;
  size?: keyof typeof buttonSizes;
};
