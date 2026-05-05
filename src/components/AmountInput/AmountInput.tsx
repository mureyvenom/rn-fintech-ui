import { useRef, useState, useCallback, useEffect } from 'react';
import {
  TextInput,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Platform,
  type NativeSyntheticEvent,
  type TargetedEvent,
} from 'react-native';
import { useTheme } from '@shopify/restyle';

import Box from '../Box';
import Text from '../Text';
import type { Theme } from '../../theme';
import { useComponentConfig } from '../../theme/FintechKitProvider';
import {
  formatInputString,
  parseFormattedAmount,
  validateAmount,
} from '../../utils/currency';
import type { AmountInputProps } from './AmountInput.types';
type TextInputRef = React.ElementRef<typeof TextInput>;

interface TextInputSelectionChangeEventData extends TargetedEvent {
  selection: {
    start: number;
    end: number;
  };
}

const DEFAULTS = {
  height: 64,
  borderRadius: 16,
  borderWidth: 1,
  fontSize: 28,
  fontFamily: 'Onest-Bold',
  currencyFontSize: 18,
  currencyFontFamily: 'Onest-Medium',
};

const AmountInput = ({
  value,
  onChange,
  currency = '₦',
  decimals = 2,
  min,
  max,
  minErrorMessage,
  maxErrorMessage,
  errorMessage: externalError,
  onCurrencyPress,
  label,
  placeholder = '0',
  disabled = false,
  testID,
  onValidChange,
}: AmountInputProps) => {
  const theme = useTheme<Theme>();
  const { amountInput: overrides = {} } = useComponentConfig();
  const config = { ...DEFAULTS, ...overrides };

  const inputRef = useRef<TextInputRef | null>(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const cursorPosRef = useRef(0);

  const formatOptions = {
    decimals,
    thousandSeparator: ',',
    decimalSeparator: '.',
  };

  // Derive the initial display value from the numeric value prop
  const getDisplayFromValue = useCallback(
    (num: number) => {
      if (!num) return '';
      const { formatted } = formatInputString(
        String(num),
        String(num).length,
        formatOptions
      );
      return formatted;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [decimals]
  );

  const [displayValue, setDisplayValue] = useState(() =>
    getDisplayFromValue(value)
  );
  const [isFocused, setIsFocused] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync display value if value prop changes externally
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(getDisplayFromValue(value));
    }
  }, [value, isFocused, getDisplayFromValue]);

  const shake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
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
    ]).start();
  }, [shakeAnim]);

  const handleSelectionChange = useCallback(
    (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
      cursorPosRef.current = e.nativeEvent.selection.start;
    },
    []
  );

  const handleChange = useCallback(
    (raw: string) => {
      const { formatted, nextCursor } = formatInputString(
        raw,
        cursorPosRef.current,
        formatOptions
      );

      setDisplayValue(formatted);

      // Restore cursor position after formatting
      requestAnimationFrame(() => {
        (inputRef.current as any)?.setNativeProps({
          selection: { start: nextCursor, end: nextCursor },
        });
      });

      const numeric = parseFormattedAmount(formatted);
      onChange(numeric);

      // Validate and notify
      const error = validateAmount(numeric, {
        min,
        max,
        minErrorMessage,
        maxErrorMessage,
      });

      setValidationError(error);

      if (error) {
        shake();
      } else {
        onValidChange?.(numeric);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      min,
      max,
      minErrorMessage,
      maxErrorMessage,
      decimals,
      onChange,
      onValidChange,
      shake,
    ]
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);

    // On blur — if there's a decimal, pad it to full decimal places
    if (decimals > 0 && displayValue.includes('.')) {
      const numeric = parseFormattedAmount(displayValue);
      setDisplayValue(getDisplayFromValue(numeric));
    }
  }, [displayValue, decimals, getDisplayFromValue]);

  const activeError = externalError ?? validationError;

  const borderColor = (): keyof Theme['colors'] => {
    if (activeError) return 'danger';
    if (isFocused) return 'primary';
    return 'borderDefault';
  };

  return (
    <Box testID={testID}>
      {/* Label */}
      {label && (
        <Text variant="medium" color="textSecondary" marginBottom="xs">
          {label}
        </Text>
      )}

      {/* Input row */}
      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        <Box
          flexDirection="row"
          alignItems="center"
          height={config.height}
          borderWidth={isFocused ? config.borderWidth + 1 : config.borderWidth}
          borderColor={borderColor()}
          borderRadius={config.borderRadius}
          backgroundColor={disabled ? 'stateDisabled' : 'backgroundSecondary'}
          paddingHorizontal="m"
          style={styles.container}
        >
          {/* Currency prefix — tappable if onCurrencyPress is provided */}
          {onCurrencyPress ? (
            <TouchableOpacity
              onPress={onCurrencyPress}
              disabled={disabled}
              accessibilityLabel="Select currency"
              accessibilityRole="button"
              style={styles.currencyButton}
            >
              <Box flexDirection="row" alignItems="center" marginRight="s">
                <Text
                  style={{
                    fontSize: config.currencyFontSize,
                    fontFamily: config.currencyFontFamily,
                    color: isFocused
                      ? theme.colors.primary
                      : theme.colors.textSecondary,
                  }}
                >
                  {currency}
                </Text>
                {/* Dropdown caret */}
                <Text
                  style={{
                    fontSize: 10,
                    color: theme.colors.textMuted,
                    marginLeft: 2,
                    marginTop: 2,
                  }}
                >
                  ▾
                </Text>
              </Box>
            </TouchableOpacity>
          ) : (
            <Box marginRight="s">
              <Text
                style={{
                  fontSize: config.currencyFontSize,
                  fontFamily: config.currencyFontFamily,
                  color: isFocused
                    ? theme.colors.primary
                    : theme.colors.textSecondary,
                }}
              >
                {currency}
              </Text>
            </Box>
          )}

          {/* Divider between prefix and input */}
          <Box
            width={1}
            height={24}
            backgroundColor="borderDefault"
            marginRight="s"
          />

          {/* The actual input */}
          <TextInput
            ref={inputRef}
            value={displayValue}
            onChangeText={handleChange}
            onSelectionChange={handleSelectionChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textMuted}
            keyboardType="decimal-pad"
            editable={!disabled}
            style={[
              styles.input,
              {
                fontSize: config.fontSize,
                fontFamily: config.fontFamily,
                color: activeError
                  ? theme.colors.danger
                  : disabled
                    ? theme.colors.textMuted
                    : theme.colors.textPrimary,
              },
            ]}
            accessibilityLabel={label ?? 'Amount input'}
            accessibilityRole="text"
            accessibilityState={{ disabled }}
            testID={`${testID}-input`}
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="done"
          />
        </Box>
      </Animated.View>

      {/* Error message */}
      {activeError && (
        <Box marginTop="xs" marginLeft="xs">
          <Text
            variant="regular"
            style={{
              fontSize: 12,
              color: theme.colors.danger,
            }}
          >
            {activeError}
          </Text>
        </Box>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  currencyButton: {
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    padding: 0, // Kill Android default padding
    margin: 0,
    includeFontPadding: false, // Android — prevents extra top padding
    textAlignVertical: 'center',
  },
});

export default AmountInput;
