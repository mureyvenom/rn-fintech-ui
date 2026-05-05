import { useState, useCallback } from 'react';
import {
  AmountInput,
  CurrencySelector,
  Box,
  type Currency,
  getDecimalsForCurrency,
} from 'react-native-fintech-kit';

// Flags live here since they're app data, not library concern
const CURRENCIES: Currency[] = [
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', flag: '🇳🇬' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GHS', symbol: '₵', name: 'Ghana Cedi', flag: '🇬🇭' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', flag: '🇰🇪' },
];

const MIN_AMOUNTS: Record<string, number> = {
  NGN: 100,
  USD: 1,
  GBP: 1,
  EUR: 1,
  GHS: 5,
  KES: 100,
};

const MAX_AMOUNTS: Record<string, number> = {
  NGN: 10_000_000,
  USD: 10_000,
  GBP: 10_000,
  EUR: 10_000,
  GHS: 50_000,
  KES: 1_000_000,
};

export const PaymentScreen = () => {
  const [amount, setAmount] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    CURRENCIES[0]!
  );
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const handleCurrencySelect = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
    setIsSelectorOpen(false);
    setAmount(0); // reset on currency change
  }, []);

  const handleAmountChange = useCallback((value: number) => {
    setAmount(value);
  }, []);

  const code = selectedCurrency.code;
  const min = MIN_AMOUNTS[code] ?? 1;
  const max = MAX_AMOUNTS[code] ?? 100_000;

  return (
    <Box flex={1} backgroundColor="backgroundPrimary" padding="pad">
      <AmountInput
        value={amount}
        onChange={handleAmountChange}
        currency={selectedCurrency.symbol}
        decimals={getDecimalsForCurrency(code)}
        min={min}
        max={max}
        minErrorMessage={`Minimum is ${selectedCurrency.symbol}${min.toLocaleString()}`}
        maxErrorMessage={`Maximum is ${selectedCurrency.symbol}${max.toLocaleString()}`}
        label="Enter amount"
        onCurrencyPress={() => setIsSelectorOpen(true)}
      />

      <CurrencySelector
        isOpen={isSelectorOpen}
        currencies={CURRENCIES}
        selectedCode={selectedCurrency.code}
        onSelect={handleCurrencySelect}
        onClose={() => setIsSelectorOpen(false)}
      />
    </Box>
  );
};
