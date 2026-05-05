import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Box from '../Box';
import type { Theme } from '../../theme';
import type {
  SkeletonBalanceProps,
  SkeletonBlockProps,
  SkeletonLoaderProps,
} from './SkeletonLoader.types';

// ─── Shimmer hook ─────────────────────────────────────────────────────────────
// Returns an animated translateX value cycling left → right forever

const useShimmer = () => {
  const anim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();

    return () => anim.stopAnimation();
  }, [anim]);

  return anim;
};

// ─── Single shimmer block ─────────────────────────────────────────────────────

const ShimmerBlock = ({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonBlockProps) => {
  const theme = useTheme<Theme>();
  const shimmer = useShimmer();

  // translateX goes from -width to +width
  // We use a fixed 300 as reference since DimensionValue can be a string
  const translateX = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-300, 300],
  });

  const isDark = theme.colors.backgroundPrimary === '#0F1115';

  const baseColor = isDark
    ? theme.colors.backgroundTertiary
    : theme.colors.backgroundSecondary;

  const shimmerColor = isDark
    ? 'rgba(255,255,255,0.07)'
    : 'rgba(255,255,255,0.75)';

  return (
    <Box
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {/* Moving shimmer overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.shimmerOverlay,
          {
            backgroundColor: shimmerColor,
            transform: [{ translateX }],
          },
        ]}
      />
    </Box>
  );
};

// ─── Balance variant ──────────────────────────────────────────────────────────

const SkeletonBalance = ({ showLabel = true }: SkeletonBalanceProps) => (
  <Box>
    {showLabel && (
      <ShimmerBlock
        width={80}
        height={12}
        borderRadius={6}
        style={styles.labelBlock}
      />
    )}
    {/* Main balance figure */}
    <ShimmerBlock
      width={180}
      height={38}
      borderRadius={10}
      style={styles.balanceBlock}
    />
    {/* Subtext — e.g. "Available balance" */}
    <ShimmerBlock
      width={120}
      height={10}
      borderRadius={5}
      style={styles.subtextBlock}
    />
  </Box>
);

// ─── Main export ──────────────────────────────────────────────────────────────

export const SkeletonLoader = (props: SkeletonLoaderProps) => {
  if (props.variant === 'balance') {
    const { variant: _, ...rest } = props;
    _;
    return <SkeletonBalance {...rest} />;
  }

  const { variant: _, ...rest } = props;
  _;
  return <ShimmerBlock {...rest} />;
};

const styles = StyleSheet.create({
  shimmerOverlay: {
    width: '40%', // shimmer strip width
    opacity: 0.9,
    borderRadius: 4,
  },
  labelBlock: {
    marginBottom: 10,
  },
  balanceBlock: {
    marginBottom: 8,
  },
  subtextBlock: {},
});

export default SkeletonLoader;
