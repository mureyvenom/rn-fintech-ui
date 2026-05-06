import { useMemo } from 'react';
import { TouchableOpacity, StyleSheet, Platform, View } from 'react-native';

import Box from '../../Core/Box';
import Text from '../../Core/Text';
import { useComponentConfig } from '../../../theme/provider/FintechKitProvider';
import {
  detectCardScheme,
  maskCardNumber,
  SCHEME_COLORS,
  type CardScheme,
} from '../../../utils/card';
import type { PaymentCardProps } from './PaymentCard.types';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULTS = {
  width: 327,
  height: 200,
  borderRadius: 20,
  fontSize: 14,
};

// ─── Scheme logo ──────────────────────────────────────────────────────────────
// Text-based for now — swap for SVG components later

const SchemeLogo = ({ scheme }: { scheme: CardScheme }) => {
  if (scheme === 'mastercard') {
    return (
      <Box flexDirection="row" alignItems="center">
        {/* Two overlapping circles */}
        <Box
          width={28}
          height={28}
          borderRadius={14}
          style={[
            styles.mcCircle,
            { backgroundColor: '#EB001B', opacity: 0.9 },
          ]}
        />
        <Box
          width={28}
          height={28}
          borderRadius={14}
          style={[
            styles.mcCircle,
            { backgroundColor: '#F79E1B', opacity: 0.9, marginLeft: -12 },
          ]}
        />
      </Box>
    );
  }

  if (scheme === 'visa') {
    return (
      <Text
        style={{
          fontSize: 22,
          fontFamily: 'Onest-Bold',
          color: '#FFFFFF',
          letterSpacing: 2,
          fontStyle: 'italic',
        }}
      >
        VISA
      </Text>
    );
  }

  if (scheme === 'verve') {
    return (
      <Box
        paddingHorizontal="s"
        paddingVertical="xs"
        borderRadius={4}
        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
      >
        <Text
          style={{
            fontSize: 13,
            fontFamily: 'Onest-Bold',
            color: '#FFFFFF',
            letterSpacing: 1,
          }}
        >
          verve
        </Text>
      </Box>
    );
  }

  return null;
};

// ─── Chip ─────────────────────────────────────────────────────────────────────

const ChipIcon = () => (
  <Box width={42} height={32} borderRadius={6} style={styles.chip}>
    {/* Vertical line */}
    <Box style={[StyleSheet.absoluteFill, styles.chipLineV]} />
    {/* Horizontal line */}
    <Box style={[StyleSheet.absoluteFill, styles.chipLineH]} />
  </Box>
);

// ─── Main component ────────────────────────────────────────────────────────────

const PaymentCard = ({
  cardNumber,
  cardholderName,
  expiry,
  scheme: schemeProp,
  backgroundColor: bgProp,
  backgroundColorSecondary,
  showFullNumber = false,
  onPress,
  testID,
}: PaymentCardProps) => {
  const { paymentCard: overrides = {} } = useComponentConfig();
  const config = { ...DEFAULTS, ...overrides };

  const scheme = useMemo(
    () => schemeProp ?? detectCardScheme(cardNumber),
    [schemeProp, cardNumber]
  );

  const backgroundColor = bgProp ?? SCHEME_COLORS[scheme];

  const displayNumber = useMemo(() => {
    const digits = cardNumber.replace(/\D/g, '');
    if (showFullNumber) {
      return digits;
    } else if (showFullNumber || digits.length >= 15) {
      return maskCardNumber(digits);
    }
    // Only last 4 known — show •••• •••• •••• XXXX
    const last4 = digits.slice(-4).padStart(4, '0');
    return `•••• •••• •••• ${last4}`;
  }, [cardNumber, showFullNumber]);

  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress
    ? {
        onPress,
        activeOpacity: 0.92,
        accessibilityRole: 'button' as const,
        accessibilityLabel: `Payment card ending ${cardNumber.slice(-4)}`,
      }
    : {};

  return (
    <Wrapper
      testID={testID}
      {...wrapperProps}
      style={[
        styles.shadow,
        {
          width: config.width,
          height: config.height,
          borderRadius: config.borderRadius,
        },
      ]}
    >
      <Box
        style={[
          styles.card,
          {
            width: config.width,
            height: config.height,
            borderRadius: config.borderRadius,
            backgroundColor,
          },
        ]}
      >
        {/* Secondary color overlay — subtle depth without a gradient library */}
        {backgroundColorSecondary && (
          <Box
            style={[
              styles.secondaryOverlay,
              { backgroundColor: backgroundColorSecondary },
            ]}
          />
        )}

        {/* Decorative circles for depth */}
        <Box
          style={[
            styles.decorCircle,
            {
              width: config.height * 1.1,
              height: config.height * 1.1,
              borderRadius: config.height * 0.55,
              top: -config.height * 0.3,
              right: -config.height * 0.2,
              backgroundColor: 'rgba(255,255,255,0.07)',
            },
          ]}
        />
        <Box
          style={[
            styles.decorCircle,
            {
              width: config.height * 0.7,
              height: config.height * 0.7,
              borderRadius: config.height * 0.35,
              bottom: -config.height * 0.2,
              left: -config.height * 0.1,
              backgroundColor: 'rgba(255,255,255,0.05)',
            },
          ]}
        />

        {/* Content */}
        <Box
          style={[
            StyleSheet.absoluteFill,
            styles.content,
            { padding: config.width * 0.065 },
          ]}
        >
          {/* Top row — chip + scheme logo */}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <ChipIcon />
            <SchemeLogo scheme={scheme} />
          </Box>

          {/* Card number */}
          <Box marginTop="m">
            <Text
              style={{
                fontSize: 17,
                fontFamily: 'Onest-Bold',
                color: 'rgba(255,255,255,0.95)',
                letterSpacing: 2.5,
              }}
              accessibilityLabel={`Card number ending ${cardNumber.slice(-4)}`}
            >
              {displayNumber}
            </Text>
          </Box>

          {/* Bottom row — name + expiry */}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-end"
            style={{ marginTop: 'auto' }}
          >
            <Box style={{ flex: 1, marginRight: 16 }}>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Onest-Regular',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: 0.5,
                  marginBottom: 2,
                }}
              >
                CARD HOLDER
              </Text>
              <Text
                style={{
                  fontSize: config.fontSize,
                  fontFamily: 'Onest-Medium',
                  color: 'rgba(255,255,255,0.95)',
                  letterSpacing: 0.5,
                }}
                numberOfLines={1}
              >
                {cardholderName.toUpperCase()}
              </Text>
            </Box>

            <Box alignItems="flex-end">
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: 'Onest-Regular',
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: 0.5,
                  marginBottom: 2,
                }}
              >
                EXPIRES
              </Text>
              <Text
                style={{
                  fontSize: config.fontSize,
                  fontFamily: 'Onest-Medium',
                  color: 'rgba(255,255,255,0.95)',
                  letterSpacing: 1,
                }}
              >
                {expiry}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  card: {
    overflow: 'hidden',
  },
  secondaryOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '60%',
    height: '100%',
    opacity: 0.35,
  },
  decorCircle: {
    position: 'absolute',
  },
  content: {
    justifyContent: 'space-between',
  },
  chip: {
    backgroundColor: '#D4AF37',
    overflow: 'hidden',
  },
  chipLineV: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    marginHorizontal: 13,
  },
  chipLineH: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    marginVertical: 12,
  },
  mcCircle: {
    position: 'absolute',
  },
});

export default PaymentCard;
