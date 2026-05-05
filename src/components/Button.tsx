import { TouchableOpacity } from 'react-native';
import Text from './Text';

export const Button = ({ label }: { label: string }) => {
  return (
    <TouchableOpacity>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};
