import type { DimensionValue, ViewStyle } from 'react-native';

export type SkeletonBlockProps = {
  width: DimensionValue;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export type SkeletonBalanceProps = {
  showLabel?: boolean;
};

export type SkeletonLoaderProps =
  | ({ variant: 'block' } & SkeletonBlockProps)
  | ({ variant: 'balance' } & SkeletonBalanceProps);
