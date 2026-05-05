export type FormatOptions = {
  decimals?: number; // 0 = whole numbers, 2 = standard. Default: 2
  thousandSeparator?: string; // Default: ','
  decimalSeparator?: string; // Default: '.'
};

/**
 * Strips everything except digits and the decimal separator from a raw string.
 * Used to sanitize user input before formatting.
 */
export const sanitizeInput = (
  raw: string,
  decimalSep = '.',
  allowDecimal = true
): string => {
  if (!allowDecimal) {
    return raw.replace(/\D/g, '');
  }

  // Escape the separator for use in regex
  const escaped = decimalSep.replace('.', '\\.');
  const cleaned = raw.replace(new RegExp(`[^0-9${escaped}]`, 'g'), '');

  // Only allow one decimal separator
  const parts = cleaned.split(decimalSep);
  if (parts.length > 2) {
    return parts[0] + decimalSep + parts.slice(1).join('');
  }
  return cleaned;
};

/**
 * Formats a raw input string (as the user types) into a display string
 * with thousand separators and bounded decimals.
 * Returns both the formatted string and the cursor offset delta
 * so the caller can reposition the cursor correctly.
 */
export const formatInputString = (
  raw: string,
  cursorPos: number,
  options: FormatOptions = {}
): { formatted: string; nextCursor: number } => {
  const {
    decimals = 2,
    thousandSeparator = ',',
    decimalSeparator = '.',
  } = options;

  if (!raw) return { formatted: '', nextCursor: 0 };

  const sanitized = sanitizeInput(raw, decimalSeparator, decimals > 0);

  // Split on decimal separator
  const [rawInt = '', rawDec] = sanitized.split(decimalSeparator);

  // Count separators before cursor in original string
  const sepsBeforeCursor = (
    raw.slice(0, cursorPos).match(new RegExp(`\\${thousandSeparator}`, 'g')) ||
    []
  ).length;

  // Format integer part
  const formattedInt = rawInt.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator
  );

  // Count separators before cursor in formatted string
  const newSepsBeforeCursor = (
    formattedInt
      .slice(
        0,
        cursorPos - sepsBeforeCursor + (formattedInt.length - rawInt.length)
      )
      .match(new RegExp(`\\${thousandSeparator}`, 'g')) || []
  ).length;

  const separatorDelta = newSepsBeforeCursor - sepsBeforeCursor;

  // Build final formatted string
  let formatted: string;
  if (decimals === 0) {
    formatted = formattedInt;
  } else if (rawDec !== undefined) {
    // User has typed the decimal separator — preserve it
    formatted = `${formattedInt}${decimalSeparator}${rawDec.slice(0, decimals)}`;
  } else {
    formatted = formattedInt;
  }

  const nextCursor = Math.min(cursorPos + separatorDelta, formatted.length);

  return { formatted, nextCursor };
};

/**
 * Parses a formatted display string back to a raw number.
 * Used to pass clean values to onChange.
 */
export const parseFormattedAmount = (
  formatted: string,
  thousandSeparator = ',',
  decimalSeparator = '.'
): number => {
  if (!formatted) return 0;
  const cleaned = formatted
    .replace(new RegExp(`\\${thousandSeparator}`, 'g'), '')
    .replace(decimalSeparator, '.');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formats a plain number to a display string.
 * Used by BalanceDisplay, TransactionCard etc.
 */
export const formatAmount = (
  value: number,
  options: FormatOptions = {}
): string => {
  const {
    decimals = 2,
    thousandSeparator = ',',
    decimalSeparator = '.',
  } = options;

  if (isNaN(value)) return '';

  const fixed = value.toFixed(decimals);
  const [intPart = '0', decPart] = fixed.split('.');
  const formattedInt = intPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator
  );

  return decimals > 0
    ? `${formattedInt}${decimalSeparator}${decPart}`
    : formattedInt;
};

/**
 * Validates an amount against min/max bounds.
 * Returns null if valid, error message string if not.
 */
export const validateAmount = (
  value: number,
  options: {
    min?: number;
    max?: number;
    minErrorMessage?: string;
    maxErrorMessage?: string;
  } = {}
): string | null => {
  const { min, max, minErrorMessage, maxErrorMessage } = options;

  if (min !== undefined && value < min) {
    return minErrorMessage ?? `Minimum amount is ${min}`;
  }
  if (max !== undefined && value > max) {
    return maxErrorMessage ?? `Maximum amount is ${max}`;
  }
  return null;
};

export const CURRENCY_DECIMAL_MAP: Record<string, number> = {
  NGN: 0,
  JPY: 0, // Yen also has no minor unit
  USD: 2,
  GBP: 2,
  EUR: 2,
  GHS: 2, // Ghana Cedi
  KES: 2, // Kenyan Shilling
};

export const getDecimalsForCurrency = (code: string): number =>
  CURRENCY_DECIMAL_MAP[code] ?? 2; // default to 2 if unknown
