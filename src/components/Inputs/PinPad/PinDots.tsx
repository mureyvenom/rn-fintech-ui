import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Box from '../../Core/Box';
import type { Theme } from '../../../theme';

type PinDotsProps = {
  length: number;
  filled: number;
  error: boolean;
  dotSize: number;
  dotSpacing: number;
};

export const PinDots = ({
  length,
  filled,
  error,
  dotSize,
  dotSpacing,
}: PinDotsProps) => {
  const theme = useTheme<Theme>();

  // Each dot gets its own scale animation
  const scales = useRef(
    Array.from({ length }, () => new Animated.Value(1))
  ).current;

  // Animate the most recently filled dot
  useEffect(() => {
    if (filled > 0) {
      const idx = filled - 1;
      Animated.sequence([
        Animated.spring(scales[idx]!, {
          toValue: 1.35,
          useNativeDriver: true,
          speed: 400,
          bounciness: 12,
        }),
        Animated.spring(scales[idx]!, {
          toValue: 1,
          useNativeDriver: true,
          speed: 300,
          bounciness: 6,
        }),
      ]).start();
    }
  }, [filled, scales]);

  return (
    <Box
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      style={{ gap: dotSpacing }}
    >
      {Array.from({ length }).map((_, i) => {
        const isFilled = i < filled;

        return (
          <Animated.View key={i} style={{ transform: [{ scale: scales[i]! }] }}>
            <Box
              style={{
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 2,
                backgroundColor: error
                  ? theme.colors.danger
                  : isFilled
                    ? theme.colors.primary
                    : 'transparent',
                borderWidth: 2,
                borderColor: error
                  ? theme.colors.danger
                  : isFilled
                    ? theme.colors.primary
                    : theme.colors.borderStrong,
              }}
            />
          </Animated.View>
        );
      })}
    </Box>
  );
};
