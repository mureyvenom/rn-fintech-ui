import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens';
import BaseButtonScreen from '../screens/BaseButtonScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { PaymentScreen } from '../screens/AmountInputScreen';
import { BalanceDisplayScreen } from '../screens/BalanceDisplayScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { PinPadScreen } from '../screens/PinPadScreen';

export type ParamList = {
  Home: undefined;
  ButtonScreen: undefined;
  OtpScreen: undefined;
  AmountInputScreen: undefined;
  BalanceDisplayScreen: undefined;
  TransactionCardScreen: undefined;
  PinPadScreen: undefined;
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
        <Stack.Screen
          name="BalanceDisplayScreen"
          component={BalanceDisplayScreen}
        />
        <Stack.Screen
          name="TransactionCardScreen"
          component={TransactionsScreen}
        />
        <Stack.Screen name="PinPadScreen" component={PinPadScreen} />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
