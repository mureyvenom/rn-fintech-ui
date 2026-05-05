// src/components/BalanceDisplay/BalanceDisplay.tsx
import React, { useRef } from 'react';
import { Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Box from '../Box';
import Text from '../Text';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import { formatAmount, getDecimalsForCurrency } from '../../utils/currency';
import { useComponentConfig } from '../../theme/FintechKitProvider';
import type { Theme } from '../../theme';
import type { BalanceDisplayProps } from './BalanceDisplay.types';

// ─── Size config ──────────────────────────────────────────────────────────────

const SIZE_MAP = {
  small: { fontSize: 22, currencySize: 14, subtextSize: 11 },
  medium: { fontSize: 32, currencySize: 18, subtextSize: 12 },
  large: { fontSize: 42, currencySize: 22, subtextSize: 13 },
};

const ANIMATION_DURATION = 280;

// ─── Eye icon ─────────────────────────────────────────────────────────────────

const EyeIcon = ({ hidden, color }: { hidden: boolean; color: string }) => (
  <Text style={{ fontSize: 18, color }}>{hidden ? '🙈' : '👁️'}</Text>
);

// ─── Component ───────────────────────────────────────────────────────────────

const BalanceDisplay = ({
  value,
  currencyCode = 'NGN',
  currencySymbol = '₦',
  isHidden = false,
  onToggleHidden,
  isLoading = false,
  label,
  subtext,
  size = 'medium',
  testID,
}: BalanceDisplayProps) => {
  const theme = useTheme<Theme>();
  const { balanceDisplay: overrides = {} } = useComponentConfig();

  const sizeConfig = SIZE_MAP[size];
  const fontSize = overrides.fontSize ?? sizeConfig.fontSize;
  const currencyFontSize =
    overrides.currencyFontSize ?? sizeConfig.currencySize;
  const fontFamily = overrides.fontFamily ?? 'Onest-Bold';

  // ── Animation values ──────────────────────────────────────────────────────
  // visibilityAnim: 0 = visible, 1 = hidden
  const visibilityAnim = useRef(new Animated.Value(isHidden ? 1 : 0)).current;

  // Track previous isHidden to detect changes
  const prevHidden = useRef(isHidden);

  React.useEffect(() => {
    if (prevHidden.current !== isHidden) {
      prevHidden.current = isHidden;
      Animated.timing(visibilityAnim, {
        toValue: isHidden ? 1 : 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: false, // letterSpacing needs false
      }).start();
    }
  }, [isHidden, visibilityAnim]);

  // ── Interpolations ────────────────────────────────────────────────────────

  // Real value fades out as hidden increases
  const realValueOpacity = visibilityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  // Bullets fade in as hidden increases
  const bulletsOpacity = visibilityAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.4, 1],
  });

  // Bullet letterSpacing expands — simulates blur spreading
  const bulletsLetterSpacing = visibilityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 10],
  });

  // Subtle scale on bullets as they appear
  const bulletsScale = visibilityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  // ── Formatted value ───────────────────────────────────────────────────────

  const decimals = getDecimalsForCurrency(currencyCode);
  const formatted = formatAmount(value, { decimals });

  // Generate bullets matching the character count of the formatted value
  // preserving the separator positions so width doesn't jump
  const bulletString = formatted
    .split('')
    .map((char) => (char === ',' || char === '.' ? char : '•'))
    .join('');

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Box testID={testID}>
        <SkeletonLoader variant="balance" showLabel={!!label} />
      </Box>
    );
  }

  return (
    <Box testID={testID}>
      {/* Label */}
      {label && (
        <Text
          variant="regular"
          color="textMuted"
          style={{ fontSize: sizeConfig.subtextSize, marginBottom: 4 }}
        >
          {label}
        </Text>
      )}

      {/* Balance row */}
      <Box flexDirection="row" alignItems="center">
        {/* Currency symbol */}
        <Text
          style={[
            styles.currency,
            {
              fontSize: currencyFontSize,
              fontFamily,
              color: theme.colors.textSecondary,
              marginTop: (fontSize - currencyFontSize) * 0.4, // baseline align
            },
          ]}
        >
          {currencySymbol}
        </Text>

        {/* Stacked value + bullets */}
        <Box style={styles.valueContainer}>
          {/* Real value — fades out */}
          <Animated.Text
            style={[
              styles.value,
              {
                fontSize,
                fontFamily,
                color: theme.colors.textPrimary,
                opacity: realValueOpacity,
              },
            ]}
            accessibilityLabel={`Balance: ${currencySymbol}${formatted}`}
          >
            {formatted}
          </Animated.Text>

          {/* Bullets — fades + expands in */}
          <Animated.Text
            style={[
              StyleSheet.absoluteFill,
              styles.value,
              {
                fontSize,
                fontFamily,
                color: theme.colors.textPrimary,
                opacity: bulletsOpacity,
                letterSpacing: bulletsLetterSpacing,
                transform: [{ scale: bulletsScale }],
              },
            ]}
            accessibilityLabel="Balance hidden"
            accessibilityHint="Tap the eye icon to reveal"
          >
            {bulletString}
          </Animated.Text>
        </Box>

        {/* Eye toggle */}
        {onToggleHidden && (
          <TouchableOpacity
            onPress={onToggleHidden}
            hitSlop={12}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={isHidden ? 'Show balance' : 'Hide balance'}
            testID={`${testID}-toggle`}
          >
            <EyeIcon hidden={isHidden} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </Box>

      {/* Subtext */}
      {subtext && (
        <Text
          variant="regular"
          color="textMuted"
          style={{ fontSize: sizeConfig.subtextSize, marginTop: 4 }}
        >
          {subtext}
        </Text>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  currency: {
    marginRight: 3,
  },
  valueContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  value: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  eyeButton: {
    marginLeft: 10,
    justifyContent: 'center',
  },
});

export default BalanceDisplay;
