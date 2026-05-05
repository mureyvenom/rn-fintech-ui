import Haptic from 'react-native-haptic-feedback';

export const useHaptics = () => {
  const impact = () => {
    try {
      Haptic.trigger('impactLight', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    } catch {}
  };
  const success = () => Haptic.trigger('notificationSuccess');

  return { impact, success };
};
