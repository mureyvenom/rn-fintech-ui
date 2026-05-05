import React, { useRef, useState, useCallback } from 'react';
import {
  TextInput,
  Animated,
  type NativeSyntheticEvent,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { useComponentConfig } from '../../../theme/provider/FintechKitProvider';

interface TextInputKeyPressEventData {
  key: string;
}

import Box from '../../Core/Box';
import type { Theme } from '../../../theme';
import type { OtpInputConfig } from '../../../theme/config';
import { useHaptics } from '../../../hooks/useHaptics';

export type OtpInputProps = {
  /** Number of OTP digits. Defaults to 6. */
  length?: number;
  /** Controlled value string e.g. "123" for a 6-digit OTP partially filled */
  value: string;
  /** Called with the full updated value string on every change */
  onChange: (value: string) => void;
  /** Show error state with red border and shake animation */
  error?: boolean;
  /** Hide entered digits like a PIN field */
  secureTextEntry?: boolean;
  /** Disables all inputs */
  disabled?: boolean;
  /** Called when all digits are filled */
  onComplete?: (value: string) => void;
  /** Test ID for automation */
  testID?: string;
};

const OTP_DEFAULTS: Required<OtpInputConfig> = {
  cellSize: { width: 52, height: 60 },
  cellBorderRadius: 16,
  cellBorderWidth: 1,
  fontSize: 22,
  fontFamily: 'Onest-Bold',
  gap: 'm',
  activeBorderColor: 'primary',
  filledBorderColor: 'borderStrong',
  errorBorderColor: 'danger',
  defaultBorderColor: 'borderDefault',
  backgroundColor: 'backgroundSecondary',
};

const OtpInput = ({
  length = 6,
  value,
  onChange,
  error = false,
  secureTextEntry = false,
  disabled = false,
  onComplete,
  testID,
}: OtpInputProps) => {
  const theme = useTheme<Theme>();
  type TextInputRef = React.ElementRef<typeof TextInput>;
  const { impact } = useHaptics();

  const inputs = useRef<Array<TextInputRef | null>>([]);
  const { otpInput: overrides = {} } = useComponentConfig();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Merge defaults with consumer overrides — consumer always wins
  const config = { ...OTP_DEFAULTS, ...overrides };

  // Now use config values throughout instead of hardcoded values

  // One shared value per cell — created unconditionally at top level
  const scales = useRef(
    Array.from({ length }, () => new Animated.Value(1))
  ).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Shake the whole row on error
  React.useEffect(() => {
    if (error) {
      Animated.sequence([
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
          toValue: 6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -6,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error, shakeAnim]);

  const animateCellIn = useCallback(
    (index: number) => {
      Animated.spring(scales[index]!, {
        toValue: 1.08,
        useNativeDriver: true,
        speed: 300,
        bounciness: 8,
      }).start();
    },
    [scales]
  );

  const animateCellOut = useCallback(
    (index: number) => {
      Animated.spring(scales[index]!, {
        toValue: 1,
        useNativeDriver: true,
        speed: 300,
        bounciness: 8,
      }).start();
    },
    [scales]
  );

  const handleChange = useCallback(
    (text: string, index: number) => {
      // Handle paste — works regardless of which cell is focused
      if (text.length > 1) {
        const pasted = text.replace(/\D/g, '').slice(0, length);
        onChange(pasted);
        impact();
        const nextIndex = Math.min(pasted.length, length - 1);
        inputs.current[nextIndex]?.focus();

        if (pasted.length === length) onComplete?.(pasted);
        return;
      }

      // Only accept digits
      if (text && !/^\d$/.test(text)) return;

      const chars = value.padEnd(length, '').split('');
      chars[index] = text;
      const newValue = chars.join('').trimEnd();
      onChange(newValue);
      impact();

      if (text && index < length - 1) {
        inputs.current[index + 1]?.focus();
      }

      if (text && index === length - 1 && newValue.length === length) {
        onComplete?.(newValue);
        impact();
        inputs.current[index]?.blur();
      }
    },
    [value, length, onChange, onComplete, impact]
  );

  const handleKeyPress = useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (e.nativeEvent.key === 'Backspace') {
        const chars = value.padEnd(length, '').split('');

        if (!chars[index] && index > 0) {
          // Current cell empty — clear previous and move back
          chars[index - 1] = '';
          onChange(chars.join('').trimEnd());
          inputs.current[index - 1]?.focus();
        } else {
          // Clear current cell
          chars[index] = '';
          onChange(chars.join('').trimEnd());
        }
      }
    },
    [value, length, onChange]
  );

  const getBorderColor = (index: number): keyof Theme['colors'] => {
    if (error) return 'danger';
    if (focusedIndex === index) return 'primary';
    if (value[index]) return 'borderStrong';
    return 'borderDefault';
  };

  return (
    <Animated.View
      style={{ transform: [{ translateX: shakeAnim }] }}
      testID={testID}
    >
      <Box flexDirection="row" gap="m" justifyContent="center">
        {Array.from({ length }).map((_, index) => (
          <Animated.View
            key={index}
            style={{
              transform: [{ scale: scales[index] }],
            }}
          >
            <Box
              alignItems="center"
              justifyContent="center"
              width={config.cellSize.width}
              height={config.cellSize.height}
              borderRadius={config.cellBorderRadius}
              borderWidth={
                focusedIndex === index
                  ? config.cellBorderWidth + 1
                  : config.cellBorderWidth
              }
              borderColor={getBorderColor(index)}
              gap={config.gap}
              backgroundColor={
                disabled ? 'stateDisabled' : config.backgroundColor
              }
              style={styles.cell}
            >
              <TextInput
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                value={
                  secureTextEntry && value[index] ? '•' : value[index] || ''
                }
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => {
                  setFocusedIndex(index);
                  animateCellIn(index);
                }}
                onBlur={() => {
                  setFocusedIndex(null);
                  animateCellOut(index);
                }}
                keyboardType="number-pad"
                maxLength={index === 0 ? length : 1}
                textAlign="center"
                editable={!disabled}
                // iOS SMS autofill — only on first cell
                textContentType={index === 0 ? 'oneTimeCode' : 'none'}
                autoComplete={index === 0 ? 'sms-otp' : 'off'}
                style={[
                  styles.input,
                  {
                    fontSize: config.fontSize,
                    fontFamily: config.fontFamily,
                    color: error
                      ? theme.colors.danger
                      : theme.colors.textPrimary,
                  },
                ]}
                accessibilityLabel={`OTP digit ${index + 1} of ${length}`}
                accessibilityRole="text"
                accessibilityState={{ disabled }}
                testID={`${testID}-cell-${index}`}
                // Suppress Android autofill suggestions on individual cells
                importantForAutofill={index === 0 ? 'yes' : 'no'}
                // Prevent system password suggestions on Android
                autoCorrect={false}
                spellCheck={false}
                selectTextOnFocus
              />
            </Box>
          </Animated.View>
        ))}
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cell: {
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: 22,
    fontFamily: 'Onest-Bold',
    padding: 0, // Android adds default padding — kill it
  },
});

export default OtpInput;
