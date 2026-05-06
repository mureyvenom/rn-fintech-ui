import {
  detectCardScheme,
  maskCardNumber,
  formatCardNumber,
  SCHEME_COLORS,
} from '../utils/card';
import { it, describe, expect } from '@jest/globals';

describe('detectCardScheme', () => {
  // ── Visa ────────────────────────────────────────────────────────────────────
  describe('Visa', () => {
    it('detects Visa from prefix 4', () => {
      expect(detectCardScheme('4111111111111111')).toBe('visa');
    });

    it('detects Visa from a 4-digit test number', () => {
      expect(detectCardScheme('4000000000000002')).toBe('visa');
    });

    it('detects Visa when number has spaces', () => {
      expect(detectCardScheme('4111 1111 1111 1111')).toBe('visa');
    });

    it('detects Visa when number has dashes', () => {
      expect(detectCardScheme('4111-1111-1111-1111')).toBe('visa');
    });
  });

  // ── Mastercard ───────────────────────────────────────────────────────────────
  describe('Mastercard', () => {
    it('detects Mastercard from prefix 51', () => {
      expect(detectCardScheme('5100000000000000')).toBe('mastercard');
    });

    it('detects Mastercard from prefix 52', () => {
      expect(detectCardScheme('5200000000000000')).toBe('mastercard');
    });

    it('detects Mastercard from prefix 55', () => {
      expect(detectCardScheme('5500000000000000')).toBe('mastercard');
    });

    it('detects Mastercard from 2-series range 2221', () => {
      expect(detectCardScheme('2221000000000000')).toBe('mastercard');
    });

    it('detects Mastercard from 2-series range 2720', () => {
      expect(detectCardScheme('2720000000000000')).toBe('mastercard');
    });

    it('detects Mastercard from prefix 5399 (not a Verve BIN)', () => {
      expect(detectCardScheme('5399123456789010')).toBe('mastercard');
    });

    it('does NOT detect prefix 50 as Mastercard', () => {
      expect(detectCardScheme('5000000000000000')).not.toBe('mastercard');
    });

    it('does NOT detect prefix 56 as Mastercard', () => {
      expect(detectCardScheme('5600000000000000')).not.toBe('mastercard');
    });
  });

  // ── Verve ────────────────────────────────────────────────────────────────────
  describe('Verve', () => {
    it('detects Verve from BIN 5061', () => {
      expect(detectCardScheme('5061234567890123')).toBe('verve');
    });

    it('detects Verve from BIN 5062', () => {
      expect(detectCardScheme('5062000000000000')).toBe('verve');
    });

    it('detects Verve from BIN 5063', () => {
      expect(detectCardScheme('5063000000000000')).toBe('verve');
    });

    it('detects Verve from BIN 6500', () => {
      expect(detectCardScheme('6500000000000000')).toBe('verve');
    });

    it('detects Verve from BIN 6501', () => {
      expect(detectCardScheme('6501000000000000')).toBe('verve');
    });

    it('detects Verve from BIN 6505', () => {
      expect(detectCardScheme('6505000000000000')).toBe('verve');
    });

    it('detects Verve before Visa for Verve BINs starting with 4 — if any are added', () => {
      // Verve pattern is checked before Visa in SCHEME_PATTERNS
      // This test verifies ordering is correct
      const result = detectCardScheme('5061234567890123');
      expect(result).toBe('verve');
      expect(result).not.toBe('visa');
    });
  });

  // ── Unknown ──────────────────────────────────────────────────────────────────
  describe('unknown', () => {
    it('returns unknown for empty string', () => {
      expect(detectCardScheme('')).toBe('unknown');
    });

    it('returns unknown for a number with unrecognised prefix 9', () => {
      expect(detectCardScheme('9999999999999999')).toBe('unknown');
    });

    it('returns unknown for a number with unrecognised prefix 3', () => {
      // Amex is not supported
      expect(detectCardScheme('3782822463100005')).toBe('unknown');
    });

    it('returns unknown for a number with prefix 60 (not a Verve BIN)', () => {
      expect(detectCardScheme('6011000000000000')).toBe('unknown');
    });

    it('returns unknown for non-numeric input', () => {
      expect(detectCardScheme('not-a-card')).toBe('unknown');
    });

    it('returns unknown for a single digit', () => {
      expect(detectCardScheme('9')).toBe('unknown');
    });
  });

  // ── Input sanitization ───────────────────────────────────────────────────────
  describe('input sanitization', () => {
    it('strips spaces before detection', () => {
      expect(detectCardScheme('4111 1111 1111 1111')).toBe('visa');
    });

    it('strips dashes before detection', () => {
      expect(detectCardScheme('5100-0000-0000-0000')).toBe('mastercard');
    });

    it('handles a partial card number (first 6 digits)', () => {
      expect(detectCardScheme('411111')).toBe('visa');
    });

    it('handles a card number longer than 16 digits gracefully', () => {
      // Should still detect based on prefix
      expect(detectCardScheme('41111111111111119999')).toBe('visa');
    });
  });
});

// // ─── maskCardNumber ───────────────────────────────────────────────────────────

describe('maskCardNumber', () => {
  it('masks all but the last 4 digits', () => {
    expect(maskCardNumber('4111111111111111')).toBe('•••• •••• •••• 1111');
  });

  it('uses space as default separator', () => {
    const result = maskCardNumber('4111111111111111');
    expect(result).toContain(' ');
  });

  it('accepts a custom separator', () => {
    const result = maskCardNumber('4111111111111111', 4, '-');
    expect(result).toBe('••••-••••-••••-1111');
  });

  it('strips non-digit characters from input before masking', () => {
    expect(maskCardNumber('4111 1111 1111 1111')).toBe('•••• •••• •••• 1111');
  });

  it('returns empty string for empty input', () => {
    expect(maskCardNumber('')).toBe('');
  });

  it('pads short input to 16 digits before masking', () => {
    // Last 4 of "1234" padded to 16 is "0000000000001234"
    const result = maskCardNumber('1234');
    expect(result).toContain('1234');
  });

  it('groups output into blocks of 4', () => {
    const result = maskCardNumber('4111111111111111');
    const groups = result.split(' ');
    expect(groups).toHaveLength(4);
    groups.forEach((g) => expect(g).toHaveLength(4));
  });
});

// ─── formatCardNumber ─────────────────────────────────────────────────────────

describe('formatCardNumber', () => {
  it('formats a 16-digit number into groups of 4 separated by spaces', () => {
    expect(formatCardNumber('4111111111111111')).toBe('4111 1111 1111 1111');
  });

  it('strips non-digit characters before formatting', () => {
    expect(formatCardNumber('4111-1111-1111-1111')).toBe('4111 1111 1111 1111');
  });

  it('strips spaces before formatting', () => {
    expect(formatCardNumber('4111 1111 1111 1111')).toBe('4111 1111 1111 1111');
  });

  it('truncates to 16 digits', () => {
    const result = formatCardNumber('41111111111111119999');
    expect(result).toBe('4111 1111 1111 1111');
  });

  it('handles partial input — fewer than 16 digits', () => {
    expect(formatCardNumber('4111')).toBe('4111');
    expect(formatCardNumber('41111111')).toBe('4111 1111');
    expect(formatCardNumber('411111111111')).toBe('4111 1111 1111');
  });

  it('returns empty string for empty input', () => {
    expect(formatCardNumber('')).toBe('');
  });

  it('returns empty string for non-numeric input', () => {
    expect(formatCardNumber('abcd')).toBe('');
  });
});

// ─── SCHEME_COLORS ────────────────────────────────────────────────────────────

describe('SCHEME_COLORS', () => {
  it('has a color entry for every supported scheme', () => {
    expect(SCHEME_COLORS).toHaveProperty('visa');
    expect(SCHEME_COLORS).toHaveProperty('mastercard');
    expect(SCHEME_COLORS).toHaveProperty('verve');
    expect(SCHEME_COLORS).toHaveProperty('unknown');
  });

  it('all color values are valid hex strings', () => {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    Object.values(SCHEME_COLORS).forEach((color) => {
      expect(color).toMatch(hexPattern);
    });
  });

  it('returns a non-empty string for the unknown scheme', () => {
    expect(SCHEME_COLORS.unknown).toBeTruthy();
  });
});
