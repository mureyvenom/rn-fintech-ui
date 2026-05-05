// @ts-ignore
import { Pressable, ActivityIndicator } from 'react-native';
import Box from '../Box';
import Text from '../Text';
import { buttonVariants, buttonSizes } from './ButtonBase.styles';
import type { ButtonBaseProps } from './ButtonBase.types';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Haptic from 'react-native-haptic-feedback';
import type theme from '../../../theme';

export const ButtonBase = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
}: ButtonBaseProps) => {
  const variantStyle = buttonVariants[variant];
  const sizeStyle = buttonSizes[size];
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={() => {
        Haptic.trigger('impactLight');
        onPress?.();
      }}
      onPressIn={() => (scale.value = withSpring(0.96))}
      onPressOut={() => (scale.value = withSpring(1))}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
    >
      {({ pressed }) => {
        const bg = (
          disabled
            ? 'stateDisabled'
            : pressed
              ? 'statePressed'
              : variantStyle.backgroundColor
        ) as keyof typeof theme.colors;

        return (
          <Animated.View style={animatedStyle}>
            <Box
              backgroundColor={bg}
              paddingVertical={
                sizeStyle.paddingVertical as keyof typeof theme.spacing
              }
              paddingHorizontal={
                sizeStyle.paddingHorizontal as keyof typeof theme.spacing
              }
              borderRadius={16}
              alignItems="center"
              justifyContent="center"
            >
              {loading ? (
                <ActivityIndicator />
              ) : typeof children === 'string' ? (
                <Text
                  color={variantStyle.textColor as keyof typeof theme.colors}
                >
                  {children}
                </Text>
              ) : (
                children
              )}
            </Box>
          </Animated.View>
        );
      }}
    </Pressable>
  );
};
