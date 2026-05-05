import { NavigationContainer } from '@react-navigation/native';

import { FintechKitProvider } from 'react-native-fintech-kit';
import { AppNavigator } from './navigators';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const AppInner = () => {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FintechKitProvider>
          <AppInner />
        </FintechKitProvider>
      </GestureHandlerRootView>
    </>
  );
}
