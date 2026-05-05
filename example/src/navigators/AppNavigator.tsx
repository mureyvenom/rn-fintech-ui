import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens';
import BaseButtonScreen from '../screens/BaseButtonScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { PaymentScreen } from '../screens/AmountInputScreen';

export type ParamList = {
  Home: undefined;
  ButtonScreen: undefined;
  OtpScreen: undefined;
  AmountInputScreen: undefined;
};

const Stack = createNativeStackNavigator<ParamList>();

const AppNavigator = () => {
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ButtonScreen" component={BaseButtonScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="AmountInputScreen" component={PaymentScreen} />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
