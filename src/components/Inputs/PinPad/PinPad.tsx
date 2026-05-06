import { useRef, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';

import Box from '../../Core/Box';
import Text from '../../Core/Text';
import { useComponentConfig } from '../../../theme/provider/FintechKitProvider';
import { PinDots } from './PinDots';
import { KeypadGrid } from './KeypadGrid';
import type { PinPadProps } from './PinPad.types';

const DEFAULTS = {
  dotSize: 14,
  dotSpacing: 18,
  keySize: 72,
  keyBorderRadius: 36, // circle
  keyFontSize: 26,
  keyFontFamily: 'Onest-Regular',
};

const PinPad = ({
  length = 4,
  value,
  onChange,
  onComplete,
  error = false,
  disabled = false,
  biometricType = 'none',
  onBiometricPress,
  randomizeKeys = false,
  title,
  subtitle,
  testID,
}: PinPadProps) => {
  const { pinPad: overrides = {} } = useComponentConfig();
  const config = { ...DEFAULTS, ...overrides };

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const prevError = useRef(error);

  // Shake + auto-clear on error
  useEffect(() => {
    if (error && !prevError.current) {
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 12,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -12,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 8,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -8,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Auto-clear PIN after shake completes
        setTimeout(() => onChange(''), 100);
      });
    }
    prevError.current = error;
  }, [error, shakeAnim, onChange]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (value.length >= length) return;
      const next = value + key;
      onChange(next);
      if (next.length === length) onComplete?.(next);
    },
    [value, length, onChange, onComplete]
  );

  const handleDelete = useCallback(() => {
    if (!value.length) return;
    onChange(value.slice(0, -1));
  }, [value, onChange]);

  return (
    <Box alignItems="center" testID={testID}>
      {/* Title */}
      {title && (
        <Text
          variant="bold"
          color="textPrimary"
          style={{ fontSize: 22, marginBottom: 8, textAlign: 'center' }}
        >
          {title}
        </Text>
      )}

      {/* Subtitle */}
      {subtitle && (
        <Text
          variant="regular"
          color="textMuted"
          style={{ fontSize: 14, marginBottom: 32, textAlign: 'center' }}
        >
          {subtitle}
        </Text>
      )}

      {/* Dots */}
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <PinDots
          length={length}
          filled={value.length}
          error={error}
          dotSize={config.dotSize}
          dotSpacing={config.dotSpacing}
        />
      </Animated.View>

      {/* Keypad */}
      <Box marginTop="xl">
        <KeypadGrid
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onBiometric={onBiometricPress}
          biometricType={biometricType}
          disabled={disabled}
          randomize={randomizeKeys}
          keySize={config.keySize}
          keyBorderRadius={config.keyBorderRadius}
          keyFontSize={config.keyFontSize}
          keyFontFamily={config.keyFontFamily}
        />
      </Box>
    </Box>
  );
};

export default PinPad;
