import { useMemo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Box from '../../Core/Box';
import Text from '../../Core/Text';
import type { Theme } from '../../../theme';
import type { BiometricType } from './PinPad.types';

type KeypadGridProps = {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onBiometric?: () => void;
  biometricType: BiometricType;
  disabled: boolean;
  randomize: boolean;
  keySize: number;
  keyBorderRadius: number;
  keyFontSize: number;
  keyFontFamily: string;
};

const BIOMETRIC_ICON: Record<BiometricType, string> = {
  faceId: '󠀠Face\nID',
  fingerprint: '👆',
  none: '',
};

export const KeypadGrid = ({
  onKeyPress,
  onDelete,
  onBiometric,
  biometricType,
  disabled,
  randomize,
  keySize,
  keyBorderRadius,
  keyFontSize,
  keyFontFamily,
}: KeypadGridProps) => {
  const theme = useTheme<Theme>();

  const digits = useMemo(() => {
    const base = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    return randomize ? [...base].sort(() => Math.random() - 0.5) : base;
  }, [randomize]);

  // Bottom row: biometric (or empty), 0, delete
  const rows = [
    digits.slice(0, 3),
    digits.slice(3, 6),
    digits.slice(6, 9),
    [
      biometricType !== 'none' && onBiometric ? '__bio__' : '__empty__',
      '0',
      '__del__',
    ],
  ];

  const renderKey = (key: string, idx: number) => {
    const isEmpty = key === '__empty__';
    const isBio = key === '__bio__';
    const isDel = key === '__del__';
    const isSpecial = isEmpty || isBio || isDel;

    return (
      <TouchableOpacity
        key={`${key}-${idx}`}
        disabled={disabled || isEmpty}
        onPress={() => {
          if (isDel) return onDelete();
          if (isBio) return onBiometric?.();
          onKeyPress(key);
        }}
        activeOpacity={0.6}
        accessibilityRole="button"
        accessibilityLabel={isDel ? 'Delete' : isBio ? 'Use biometrics' : key}
        style={[
          styles.key,
          {
            width: keySize,
            height: keySize,
            borderRadius: keyBorderRadius,
            backgroundColor: isSpecial
              ? 'transparent'
              : theme.colors.backgroundSecondary,
            borderWidth: isSpecial ? 0 : 1,
            borderColor: theme.colors.borderDefault,
            opacity: disabled ? 0.4 : 1,
          },
        ]}
      >
        {isDel ? (
          <Text
            style={{
              fontSize: keyFontSize + 2,
              color: theme.colors.textPrimary,
              fontFamily: keyFontFamily,
            }}
          >
            ⌫
          </Text>
        ) : isBio ? (
          <Text
            style={{
              fontSize: biometricType === 'fingerprint' ? keyFontSize + 4 : 11,
              color: theme.colors.textSecondary,
              fontFamily: keyFontFamily,
              textAlign: 'center',
              lineHeight: 14,
            }}
          >
            {BIOMETRIC_ICON[biometricType]}
          </Text>
        ) : isEmpty ? null : (
          <Text
            style={{
              fontSize: keyFontSize,
              fontFamily: keyFontFamily,
              color: theme.colors.textPrimary,
            }}
          >
            {key}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Box>
      {rows.map((row, rowIdx) => (
        <Box
          key={rowIdx}
          flexDirection="row"
          justifyContent="center"
          style={{ gap: 16, marginBottom: rowIdx < rows.length - 1 ? 16 : 0 }}
        >
          {row.map((key, keyIdx) => renderKey(key, keyIdx))}
        </Box>
      ))}
    </Box>
  );
};

const styles = StyleSheet.create({
  key: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
