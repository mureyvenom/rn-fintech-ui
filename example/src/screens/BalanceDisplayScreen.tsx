import { useState } from 'react';
import { ScrollView } from 'react-native';

import {
  BalanceDisplay,
  SkeletonLoader,
  Box,
  Text,
} from 'react-native-fintech-kit';

export const BalanceDisplayScreen = () => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Box gap="l">
        {/* Section: Loading */}
        <Box gap="s">
          <Text variant="semibold">Loading State</Text>

          <BalanceDisplay value={0} isLoading label="Total Balance" />
        </Box>

        {/* Section: Loaded */}
        <Box gap="s">
          <Text variant="semibold">Loaded State</Text>

          <BalanceDisplay
            value={1250000}
            currencyCode="NGN"
            currencySymbol="₦"
            isHidden={isHidden}
            onToggleHidden={() => setIsHidden((p) => !p)}
            label="Total Balance"
            subtext="Available: ₦1,100,000"
            size="large"
          />
        </Box>

        {/* Section: Hidden */}
        <Box gap="s">
          <Text variant="semibold">Hidden State</Text>

          <BalanceDisplay
            value={12500000}
            currencyCode="NGN"
            currencySymbol="₦"
            isHidden
            label="Total Balance"
            size="large"
          />
        </Box>

        {/* Section: Sizes */}
        <Box gap="s">
          <Text variant="semibold">Sizes</Text>

          <BalanceDisplay
            value={25000}
            currencySymbol="₦"
            size="small"
            label="Small"
          />

          <BalanceDisplay
            value={25000}
            currencySymbol="₦"
            size="medium"
            label="Medium"
          />

          <BalanceDisplay
            value={25000}
            currencySymbol="₦"
            size="large"
            label="Large"
          />
        </Box>

        {/* Section: Skeletons */}
        <Box gap="s">
          <Text variant="semibold">Skeleton Loader</Text>

          <SkeletonLoader
            variant="block"
            width="100%"
            height={56}
            borderRadius={16}
          />

          <SkeletonLoader
            variant="block"
            width={140}
            height={14}
            borderRadius={7}
          />
        </Box>
      </Box>
    </ScrollView>
  );
};
