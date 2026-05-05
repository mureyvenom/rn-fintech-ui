import { useCallback } from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@shopify/restyle';

import Box from '../../Core/Box';
import Text from '../../Core/Text';
import { useComponentConfig } from '../../../theme/provider/FintechKitProvider';
import { formatAmount, getDecimalsForCurrency } from '../../../utils/currency';
import { formatTransactionDate } from '../../../utils/date';
import type { Theme } from '../../../theme';
import type {
  TransactionCardProps,
  TransactionStatus,
  TransactionType,
} from './TransactionCard.types';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULTS = {
  borderRadius: 16,
  iconSize: 44,
  iconBorderRadius: 12,
  fontSize: 14,
  amountFontSize: 14,
  subtextFontSize: 12,
};

// Status → { label, bg color token, text color token }
const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    bg: 'successBackground',
    color: 'success',
  },
  pending: {
    label: 'Pending',
    bg: 'warningBackground',
    color: 'warning',
  },
  failed: {
    label: 'Failed',
    bg: 'dangerBackground',
    color: 'danger',
  },
} as Record<
  TransactionStatus,
  { label: string; bg: keyof Theme['colors']; color: keyof Theme['colors'] }
>;

// Type → amount color token
const AMOUNT_COLOR: Record<TransactionType, keyof Theme['colors']> = {
  credit: 'success',
  debit: 'danger',
};

// Type → prefix
const AMOUNT_PREFIX: Record<TransactionType, string> = {
  credit: '+ ',
  debit: '- ',
};

// ─── Icon / Avatar ─────────────────────────────────────────────────────────────

type MerchantIconProps = {
  icon?: string;
  merchantName: string;
  size: number;
  borderRadius: number;
  status: TransactionStatus;
};

const MerchantIcon = ({
  icon,
  merchantName,
  size,
  borderRadius,
  status,
}: MerchantIconProps) => {
  const theme = useTheme<Theme>();

  // Icon background color keyed on status
  const bgColorMap: Record<TransactionStatus, keyof Theme['colors']> = {
    completed: 'backgroundTertiary',
    pending: 'warningBackground',
    failed: 'dangerBackground',
  };

  const initial = merchantName.trim().charAt(0).toUpperCase();

  return (
    <Box
      width={size}
      height={size}
      borderRadius={borderRadius}
      backgroundColor={bgColorMap[status]}
      alignItems="center"
      justifyContent="center"
      style={styles.iconContainer}
    >
      {icon ? (
        <Text style={{ fontSize: size * 0.45, lineHeight: size * 0.55 }}>
          {icon}
        </Text>
      ) : (
        <Text
          style={{
            fontSize: size * 0.38,
            fontFamily: 'Onest-Bold',
            color: theme.colors.textSecondary,
            lineHeight: size * 0.5,
          }}
        >
          {initial}
        </Text>
      )}
    </Box>
  );
};

// ─── Status badge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  const theme = useTheme<Theme>();
  const config = STATUS_CONFIG[status];

  return (
    <Box
      paddingHorizontal="xs"
      paddingVertical="xs"
      borderRadius={10}
      backgroundColor={config.bg}
      style={styles.badge}
    >
      <Text
        style={{
          fontSize: 10,
          fontFamily: 'Onest-Medium',
          color: theme.colors[config.color],
          lineHeight: 14,
        }}
      >
        {config.label}
      </Text>
    </Box>
  );
};

// ─── Main component ────────────────────────────────────────────────────────────

const TransactionCard = ({
  transaction,
  onPress,
  dateLabel,
  testID,
}: TransactionCardProps) => {
  const theme = useTheme<Theme>();
  const { transactionCard: overrides = {} } = useComponentConfig();
  const config = { ...DEFAULTS, ...overrides };

  const {
    merchantName,
    merchantIcon,
    category,
    amount,
    currencySymbol = '₦',
    currencyCode = 'NGN',
    type,
    status,
    date,
    reference,
  } = transaction;

  const handlePress = useCallback(() => {
    onPress?.(transaction);
  }, [onPress, transaction]);

  const formattedAmount = formatAmount(amount, {
    decimals: getDecimalsForCurrency(currencyCode),
  });

  const formattedDate = dateLabel ?? formatTransactionDate(date);

  const subtext = [
    category,
    formattedDate,
    reference ? `Ref: ${reference}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'none'}
      accessibilityLabel={`${merchantName} transaction, ${AMOUNT_PREFIX[type]}${currencySymbol}${formattedAmount}, ${status}`}
      testID={testID}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="backgroundPrimary"
        borderWidth={1}
        borderColor="borderDefault"
        borderRadius={config.borderRadius}
        padding="m"
        style={styles.card}
      >
        {/* Merchant icon */}
        <MerchantIcon
          icon={merchantIcon}
          merchantName={merchantName}
          size={config.iconSize}
          borderRadius={config.iconBorderRadius}
          status={status}
        />

        {/* Content */}
        <Box flex={1} marginLeft="m" style={styles.content}>
          {/* Top row — name + amount */}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Text
              style={{
                fontSize: config.fontSize,
                fontFamily: 'Onest-Medium',
                color: theme.colors.textPrimary,
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={1}
            >
              {merchantName}
            </Text>

            <Text
              style={{
                fontSize: config.amountFontSize,
                fontFamily: 'Onest-Bold',
                color:
                  status === 'failed'
                    ? theme.colors.textMuted
                    : theme.colors[AMOUNT_COLOR[type]],
                // Strike through on failed transactions
                textDecorationLine:
                  status === 'failed' ? 'line-through' : 'none',
              }}
            >
              {AMOUNT_PREFIX[type]}
              {currencySymbol}
              {formattedAmount}
            </Text>
          </Box>

          {/* Bottom row — subtext + status badge */}
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            marginTop="xs"
          >
            <Text
              style={{
                fontSize: config.subtextFontSize,
                fontFamily: 'Onest-Regular',
                color: theme.colors.textMuted,
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={1}
            >
              {subtext}
            </Text>

            <StatusBadge status={status} />
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  iconContainer: {
    flexShrink: 0,
  },
  content: {
    minWidth: 0, // prevents flex overflow on long merchant names
  },
  badge: {
    flexShrink: 0,
  },
});

export default TransactionCard;
