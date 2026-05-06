import { useState, useCallback } from 'react';
import { ScrollView, Alert } from 'react-native';
import { Box, Text, PinPad } from 'react-native-fintech-kit';

// The correct PIN for the demo — in a real app this check
// happens on the server, never on-device like this
const CORRECT_PIN = '1234';
const MAX_ATTEMPTS = 3;

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    variant="medium"
    color="textMuted"
    style={{
      fontSize: 11,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 20,
      marginTop: 32,
    }}
  >
    {children}
  </Text>
);

const Divider = () => (
  <Box height={1} backgroundColor="borderDefault" marginVertical="l" />
);

// ─── Example 1 — Basic 4-digit PIN ────────────────────────────────────────────

const BasicPinExample = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleComplete = useCallback(
    (value: string) => {
      if (value === CORRECT_PIN) {
        setVerified(true);
        setError(false);
        setAttempts(0);
      } else {
        const next = attempts + 1;
        setAttempts(next);
        setError(true);
        if (next >= MAX_ATTEMPTS) {
          setLocked(true);
        }
      }
    },
    [attempts]
  );

  const handleReset = useCallback(() => {
    setPin('');
    setError(false);
    setAttempts(0);
    setLocked(false);
    setVerified(false);
  }, []);

  if (verified) {
    return (
      <Box alignItems="center" padding="xl">
        <Text style={{ fontSize: 48 }}>✅</Text>
        <Text
          variant="bold"
          color="success"
          style={{ fontSize: 18, marginTop: 12, textAlign: 'center' }}
        >
          PIN verified
        </Text>
        <Text
          variant="regular"
          color="textMuted"
          style={{ fontSize: 13, marginTop: 6, textAlign: 'center' }}
        >
          Correct PIN was: {CORRECT_PIN}
        </Text>
        <Box marginTop="l">
          <Text
            variant="medium"
            color="primary"
            style={{ fontSize: 14 }}
            onPress={handleReset}
          >
            Try again →
          </Text>
        </Box>
      </Box>
    );
  }

  if (locked) {
    return (
      <Box alignItems="center" padding="xl">
        <Text style={{ fontSize: 48 }}>🔒</Text>
        <Text
          variant="bold"
          color="danger"
          style={{ fontSize: 18, marginTop: 12, textAlign: 'center' }}
        >
          Account locked
        </Text>
        <Text
          variant="regular"
          color="textMuted"
          style={{ fontSize: 13, marginTop: 6, textAlign: 'center' }}
        >
          Too many incorrect attempts
        </Text>
        <Box marginTop="l">
          <Text
            variant="medium"
            color="primary"
            style={{ fontSize: 14 }}
            onPress={handleReset}
          >
            Reset demo →
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <PinPad
      length={4}
      value={pin}
      onChange={setPin}
      onComplete={handleComplete}
      error={error}
      disabled={locked}
      title="Enter your PIN"
      subtitle={
        attempts > 0
          ? `Incorrect PIN. ${MAX_ATTEMPTS - attempts} attempt${MAX_ATTEMPTS - attempts === 1 ? '' : 's'} remaining`
          : 'Hint: try 1234'
      }
      testID="basic-pinpad"
    />
  );
};

// ─── Example 2 — 6-digit PIN ──────────────────────────────────────────────────

const SixDigitPinExample = () => {
  const [pin, setPin] = useState('');
  const [complete, setComplete] = useState(false);

  return complete ? (
    <Box alignItems="center" padding="l">
      <Text style={{ fontSize: 36 }}>✅</Text>
      <Text
        variant="bold"
        color="textPrimary"
        style={{ fontSize: 16, marginTop: 8 }}
      >
        6-digit PIN received
      </Text>
      <Text
        variant="medium"
        color="primary"
        style={{ fontSize: 13, marginTop: 12 }}
        onPress={() => {
          setPin('');
          setComplete(false);
        }}
      >
        Reset →
      </Text>
    </Box>
  ) : (
    <PinPad
      length={6}
      value={pin}
      onChange={setPin}
      onComplete={() => {
        setComplete(true);
      }}
      title="Enter 6-digit PIN"
      subtitle="Longer PIN, better security"
      testID="six-digit-pinpad"
    />
  );
};

// ─── Example 3 — Payment confirmation with context ────────────────────────────

const PaymentPinExample = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleComplete = useCallback((value: string) => {
    if (value === CORRECT_PIN) {
      Alert.alert(
        'Payment confirmed',
        'Transfer of ₦25,000 to Access Bank was successful.'
      );
      setPin('');
      setError(false);
    } else {
      setError(true);
    }
  }, []);

  return (
    <PinPad
      length={4}
      value={pin}
      onChange={setPin}
      onComplete={handleComplete}
      error={error}
      title="Confirm payment"
      subtitle="₦25,000 → Access Bank ····4521"
      testID="payment-pinpad"
    />
  );
};

// ─── Example 4 — Randomized keys ─────────────────────────────────────────────

const RandomizedPinExample = () => {
  const [pin, setPin] = useState('');

  return (
    <PinPad
      length={4}
      value={pin}
      onChange={setPin}
      onComplete={() => {
        Alert.alert('PIN received', 'Keys were randomized each render.');
        setPin('');
      }}
      randomizeKeys
      title="Randomized keypad"
      subtitle="Keys shuffle on every render for security"
      testID="randomized-pinpad"
    />
  );
};

// ─── Example 5 — Biometric ────────────────────────────────────────────────────

const BiometricPinExample = () => {
  const [pin, setPin] = useState('');

  const handleBiometric = useCallback(() => {
    // In a real app, call react-native-biometrics or expo-local-authentication here
    Alert.alert(
      'Biometric triggered',
      'Call your biometric authentication library here.\n\nThis component fires the callback — your app handles the auth.'
    );
  }, []);

  return (
    <PinPad
      length={4}
      value={pin}
      onChange={setPin}
      onComplete={() => {
        Alert.alert('Complete', 'PIN entered manually');
        setPin('');
      }}
      biometricType="faceId"
      onBiometricPress={handleBiometric}
      title="Welcome back"
      subtitle="Use Face ID or enter your PIN"
      testID="biometric-pinpad"
    />
  );
};

// ─── Example 6 — Disabled ─────────────────────────────────────────────────────

const DisabledPinExample = () => (
  <PinPad
    length={4}
    value=""
    onChange={() => {}}
    disabled
    title="Account locked"
    subtitle="Contact support to unlock your account"
    testID="disabled-pinpad"
  />
);

// ─── Main screen ──────────────────────────────────────────────────────────────

export const PinPadScreen = () => (
  <ScrollView
    contentContainerStyle={{ padding: 20, paddingBottom: 80 }}
    showsVerticalScrollIndicator={false}
  >
    <SectionLabel>Basic — 4 digit with error and lockout</SectionLabel>
    <BasicPinExample />

    <Divider />

    <SectionLabel>6-digit PIN</SectionLabel>
    <SixDigitPinExample />

    <Divider />

    <SectionLabel>Payment confirmation context</SectionLabel>
    <PaymentPinExample />

    <Divider />

    <SectionLabel>Randomized keys — security mode</SectionLabel>
    <RandomizedPinExample />

    <Divider />

    <SectionLabel>With biometric trigger</SectionLabel>
    <BiometricPinExample />

    <Divider />

    <SectionLabel>Disabled state</SectionLabel>
    <DisabledPinExample />
  </ScrollView>
);
