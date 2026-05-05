import {
  formatAmount,
  parseFormattedAmount,
  validateAmount,
} from '../utils/currency';
import { it, describe, expect } from '@jest/globals';

describe('formatAmount', () => {
  it('formats NGN with no decimals', () => {
    expect(formatAmount(1250000, { decimals: 0 })).toBe('1,250,000');
  });
  it('formats USD with 2 decimals', () => {
    expect(formatAmount(1250.5, { decimals: 2 })).toBe('1,250.50');
  });
  it('returns empty string for NaN', () => {
    expect(formatAmount(NaN)).toBe('');
  });
});

describe('validateAmount', () => {
  it('returns null when valid', () => {
    expect(validateAmount(500, { min: 100, max: 1000 })).toBeNull();
  });
  it('returns min error when below minimum', () => {
    expect(validateAmount(50, { min: 100, minErrorMessage: 'Too low' })).toBe(
      'Too low'
    );
  });
  it('returns max error when above maximum', () => {
    expect(
      validateAmount(2000, { max: 1000, maxErrorMessage: 'Too high' })
    ).toBe('Too high');
  });
});

describe('parseFormattedAmount', () => {
  it('strips thousand separators and returns number', () => {
    expect(parseFormattedAmount('1,250,000')).toBe(1250000);
  });
  it('handles decimals', () => {
    expect(parseFormattedAmount('1,250.50')).toBe(1250.5);
  });
});
