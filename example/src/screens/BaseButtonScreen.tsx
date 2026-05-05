import { Box, ButtonBase } from 'react-native-fintech-kit';

const BaseButtonScreen = () => {
  return (
    <Box flex={1} padding="l" gap="s">
      <ButtonBase>Primary</ButtonBase>
      <ButtonBase variant="secondary">Secondary</ButtonBase>
      <ButtonBase variant="ghost">Ghost</ButtonBase>

      <ButtonBase loading>Loading</ButtonBase>
      <ButtonBase disabled>Disabled</ButtonBase>

      <ButtonBase size="sm">Small</ButtonBase>
      <ButtonBase size="lg">Large</ButtonBase>
    </Box>
  );
};

export default BaseButtonScreen;
