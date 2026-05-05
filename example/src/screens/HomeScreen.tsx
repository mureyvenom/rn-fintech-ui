import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Box, Text } from 'react-native-fintech-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { componentRegistry } from '../utils/componentRegistry';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <Box flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <Box flex={1}>
          <FlatList
            data={componentRegistry}
            style={{ flex: 1 }}
            keyExtractor={(item) => item.title}
            renderItem={({ item }) => (
              <Box padding="l">
                <Text variant="bold">{item.title}</Text>

                {item.items.map((component) => (
                  <Box
                    key={component.name}
                    padding="m"
                    marginTop="s"
                    backgroundColor="surfacePrimary"
                    borderRadius={16}
                    onTouchEnd={() =>
                      navigation.navigate(component.route as never)
                    }
                  >
                    <Text>{component.name}</Text>
                  </Box>
                ))}
              </Box>
            )}
          />
        </Box>
      </SafeAreaView>
    </Box>
  );
};

export default HomeScreen;
