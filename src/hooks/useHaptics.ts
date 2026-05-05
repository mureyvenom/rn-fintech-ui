import Haptic from 'react-native-haptic-feedback';

export const useHaptics = () => {
  const impact = () => Haptic.trigger('impactLight');
  const success = () => Haptic.trigger('notificationSuccess');

  return { impact, success };
};
