export type CardScheme = 'visa' | 'mastercard' | 'verve' | 'unknown';

// Based on actual BIN range specs
const SCHEME_PATTERNS: { scheme: CardScheme; pattern: RegExp }[] = [
  // Verve must come before Visa — some Verve BINs start with 4
  { scheme: 'verve', pattern: /^(5061|5062|5063|6500|6501|6505|650[2-4])/ },
  { scheme: 'visa', pattern: /^4/ },
  {
    scheme: 'mastercard',
    pattern: /^5[1-5]|^2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720)/,
  },
];

export const detectCardScheme = (cardNumber: string): CardScheme => {
  const digits = cardNumber.replace(/\D/g, '');
  if (!digits) return 'unknown';
  for (const { scheme, pattern } of SCHEME_PATTERNS) {
    if (pattern.test(digits)) return scheme;
  }
  return 'unknown';
};

export const maskCardNumber = (
  cardNumber: string,
  visibleDigits = 4,
  separator = ' '
): string => {
  const digits = cardNumber.replace(/\D/g, '');
  if (!digits) return '';
  const masked =
    digits
      .padEnd(visibleDigits || 16, '0')
      .replace(/\d(?=\d{4})/g, '•')
      .match(/.{1,4}/g)
      ?.join(separator) ?? '';
  return masked;
};

export const formatCardNumber = (raw: string): string =>
  raw
    .replace(/\D/g, '')
    .slice(0, 16)
    .match(/.{1,4}/g)
    ?.join(' ') ?? '';

// Scheme → default brand color
export const SCHEME_COLORS: Record<CardScheme, string> = {
  visa: '#1A1F71',
  mastercard: '#252525',
  verve: '#00425F',
  unknown: '#1A1A2E',
};

// Scheme → logo text (replace with SVGs later)
export const SCHEME_LABELS: Record<CardScheme, string> = {
  visa: 'VISA',
  mastercard: 'MC',
  verve: 'verve',
  unknown: '',
};
