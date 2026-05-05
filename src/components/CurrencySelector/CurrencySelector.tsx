import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@shopify/restyle';

import Box from '../Box';
import Text from '../Text';
import type { Theme } from '../../theme';
import type { Currency } from '../../types';

export type CurrencySelectorProps = {
  isOpen: boolean;
  currencies: Currency[];
  selectedCode: string;
  onSelect: (currency: Currency) => void;
  onClose: () => void;
  /** Sheet snap point. Defaults to '55%' */
  snapPoint?: string;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  testID?: string;
};

const CurrencySelector = ({
  isOpen,
  currencies,
  selectedCode,
  onSelect,
  onClose,
  snapPoint = '55%',
  searchPlaceholder = 'Search currency...',
  testID,
}: CurrencySelectorProps) => {
  const theme = useTheme<Theme>();
  const sheetRef = useRef<BottomSheet>(null);
  const [query, setQuery] = useState('');
  console.log('isOpen', isOpen);
  // Open/close sheet in response to isOpen prop
  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
      setQuery(''); // clear search on close
    }
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return currencies;
    return currencies.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.symbol.includes(q)
    );
  }, [query, currencies]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        onPress={onClose}
      />
    ),
    [onClose]
  );

  const renderItem = useCallback(
    ({ item }: { item: Currency }) => {
      const isSelected = item.code === selectedCode;

      return (
        <TouchableOpacity
          onPress={() => onSelect(item)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Select ${item.name}`}
          accessibilityState={{ selected: isSelected }}
          testID={`${testID}-option-${item.code}`}
        >
          <Box
            flexDirection="row"
            alignItems="center"
            paddingHorizontal="m"
            paddingVertical="s"
            backgroundColor={
              isSelected ? 'backgroundTertiary' : 'backgroundPrimary'
            }
          >
            {/* Emoji flag */}
            {item.flag ? (
              <Text style={styles.flag}>{item.flag}</Text>
            ) : (
              // Fallback — coloured circle with currency code initials
              <Box
                width={36}
                height={36}
                borderRadius={18}
                backgroundColor="backgroundSecondary"
                alignItems="center"
                justifyContent="center"
                marginRight="m"
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Onest-Bold',
                    color: theme.colors.textSecondary,
                  }}
                >
                  {item.code.slice(0, 2)}
                </Text>
              </Box>
            )}

            {/* Name + code */}
            <Box flex={1}>
              <Text
                variant="medium"
                color={isSelected ? 'primary' : 'textPrimary'}
                style={{ fontSize: 15 }}
              >
                {item.name}
              </Text>
              <Text
                variant="regular"
                color="textMuted"
                style={{ fontSize: 12 }}
              >
                {item.code} · {item.symbol}
              </Text>
            </Box>

            {/* Selected check */}
            {isSelected && (
              <Box
                width={20}
                height={20}
                borderRadius={10}
                backgroundColor="primary"
                alignItems="center"
                justifyContent="center"
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: theme.colors.textInverse,
                    fontFamily: 'Onest-Bold',
                  }}
                >
                  ✓
                </Text>
              </Box>
            )}
          </Box>
        </TouchableOpacity>
      );
    },
    [selectedCode, onSelect, theme, testID]
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={isOpen ? 0 : -1}
      enableDynamicSizing={false}
      snapPoints={[snapPoint]}
      enablePanDownToClose
      onClose={onClose}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.borderStrong,
        width: 40,
      }}
      backgroundStyle={{
        backgroundColor: theme.colors.backgroundPrimary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
    >
      {/* Header */}
      <Box
        paddingHorizontal="m"
        paddingBottom="s"
        borderBottomWidth={1}
        borderColor="borderDefault"
      >
        <Text
          variant="bold"
          color="textPrimary"
          style={{ fontSize: 17 }}
          marginBottom="s"
        >
          Select Currency
        </Text>

        {/* Search */}
        <Box
          flexDirection="row"
          alignItems="center"
          backgroundColor="backgroundSecondary"
          borderRadius={12}
          paddingHorizontal="m"
          height={44}
          borderWidth={1}
          borderColor="borderDefault"
        >
          <Text style={{ fontSize: 15, marginRight: 8 }}>🔍</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.colors.textMuted}
            autoCorrect={false}
            autoCapitalize="none"
            style={[
              styles.searchInput,
              {
                color: theme.colors.textPrimary,
                fontFamily: 'Onest-Regular',
                fontSize: 14,
              },
            ]}
            testID={`${testID}-search`}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </Box>
      </Box>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <Box padding="xl" alignItems="center">
            <Text variant="regular" color="textMuted">
              No currencies found for "{query}"
            </Text>
          </Box>
        }
        ItemSeparatorComponent={() => (
          <Box
            height={1}
            backgroundColor="borderDefault"
            marginHorizontal="m"
          />
        )}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
        style={{
          marginBottom: 60,
        }}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  flag: {
    fontSize: 28,
    marginRight: 12,
    lineHeight: Platform.OS === 'android' ? 36 : 32,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    includeFontPadding: false,
  },
});

export default CurrencySelector;
