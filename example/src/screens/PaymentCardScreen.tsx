import { useState } from 'react';
import { ScrollView, Switch } from 'react-native';
import {
  Box,
  Text,
  PaymentCard,
  SkeletonLoader,
} from 'react-native-fintech-kit';

type CardData = {
  id: string;
  label: string;
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  backgroundColor: string;
  backgroundColorSecondary?: string;
};

const EXAMPLE_CARDS: CardData[] = [
  {
    id: '1',
    label: 'Visa — auto-detected',
    cardNumber: '4111111111111111',
    cardholderName: 'Oluwamurewa Alao',
    expiry: '08/27',
    backgroundColor: '#1A1F71',
    backgroundColorSecondary: '#4A00E0',
  },
  {
    id: '2',
    label: 'Mastercard — auto-detected',
    cardNumber: '5399123456789010',
    cardholderName: 'Oluwamurewa Alao',
    expiry: '12/26',
    backgroundColor: '#1A1A1A',
    backgroundColorSecondary: '#EB001B',
  },
  {
    id: '3',
    label: 'Verve — auto-detected',
    cardNumber: '5061234567890123',
    cardholderName: 'Oluwamurewa Alao',
    expiry: '03/28',
    backgroundColor: '#00425F',
    backgroundColorSecondary: '#009A44',
  },
  {
    id: '4',
    label: 'Custom color — dark purple',
    cardNumber: '4000000000000002',
    cardholderName: 'Oluwamurewa Alao',
    expiry: '06/29',
    backgroundColor: '#2D1B69',
    backgroundColorSecondary: '#7B2FBE',
  },
];

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    variant="medium"
    color="textMuted"
    style={{
      fontSize: 11,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 12,
      marginTop: 28,
    }}
  >
    {children}
  </Text>
);

export const PaymentCardScreen = () => {
  const [showFullNumber, setShowFullNumber] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Controls */}
      <Box
        backgroundColor="backgroundSecondary"
        borderRadius={12}
        padding="m"
        marginBottom="l"
      >
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="s"
        >
          <Text
            variant="regular"
            color="textSecondary"
            style={{ fontSize: 14 }}
          >
            Show full card number
          </Text>
          <Switch value={showFullNumber} onValueChange={setShowFullNumber} />
        </Box>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text
            variant="regular"
            color="textSecondary"
            style={{ fontSize: 14 }}
          >
            Simulate loading state
          </Text>
          <Switch value={isLoading} onValueChange={setIsLoading} />
        </Box>
      </Box>

      {/* Loading state */}
      <SectionLabel>Loading state</SectionLabel>
      {isLoading ? (
        <SkeletonLoader
          variant="block"
          width={327}
          height={200}
          borderRadius={20}
        />
      ) : (
        <Text variant="regular" color="textMuted" style={{ fontSize: 13 }}>
          Toggle "Simulate loading" above to see the skeleton
        </Text>
      )}

      {/* Card variants */}
      <SectionLabel>Card scheme auto-detection</SectionLabel>
      <Text
        variant="regular"
        color="textMuted"
        style={{ fontSize: 13, marginBottom: 16 }}
      >
        Scheme is detected from the card number prefix. Tap a card to select it.
      </Text>

      {EXAMPLE_CARDS.map((card) => (
        <Box key={card.id} marginBottom="l">
          <Text
            variant="medium"
            color="textSecondary"
            style={{ fontSize: 12, marginBottom: 8 }}
          >
            {card.label}
          </Text>
          <PaymentCard
            cardNumber={card.cardNumber}
            cardholderName={card.cardholderName}
            expiry={card.expiry}
            backgroundColor={card.backgroundColor}
            backgroundColorSecondary={card.backgroundColorSecondary}
            showFullNumber={showFullNumber}
            onPress={() =>
              setSelectedId((prev) => (prev === card.id ? null : card.id))
            }
            testID={`payment-card-${card.id}`}
          />
          {selectedId === card.id && (
            <Box
              marginTop="s"
              padding="s"
              backgroundColor="backgroundTertiary"
              borderRadius={8}
            >
              <Text
                variant="regular"
                color="textSecondary"
                style={{ fontSize: 12 }}
              >
                onPress fired ✓ — navigate or show card details here
              </Text>
            </Box>
          )}
        </Box>
      ))}

      {/* Last 4 only */}
      <SectionLabel>Last 4 digits only</SectionLabel>
      <Text
        variant="regular"
        color="textMuted"
        style={{ fontSize: 13, marginBottom: 16 }}
      >
        Pass only the last 4 digits when you don't have the full PAN.
      </Text>
      <PaymentCard
        cardNumber="1234"
        cardholderName="Oluwamurewa Alao"
        expiry="09/27"
        backgroundColor="#1B3A4B"
        testID="payment-card-last4"
      />

      {/* No press handler */}
      <SectionLabel>Static — no tap interaction</SectionLabel>
      <Text
        variant="regular"
        color="textMuted"
        style={{ fontSize: 13, marginBottom: 16 }}
      >
        Omit onPress to render a non-interactive display card.
      </Text>
      <PaymentCard
        cardNumber="4000000000001234"
        cardholderName="Oluwamurewa Alao"
        expiry="11/28"
        backgroundColor="#0D3349"
        backgroundColorSecondary="#1B8A6B"
        testID="payment-card-static"
      />
    </ScrollView>
  );
};
