// PinPad.types.ts
export type BiometricType = 'faceId' | 'fingerprint' | 'none';

export type PinPadConfig = {
  dotSize?: number;
  dotSpacing?: number;
  keySize?: number;
  keyBorderRadius?: number;
  keyFontSize?: number;
  keyFontFamily?: string;
};

export type PinPadProps = {
  length?: number; // 4 or 6. Default: 4
  value: string;
  onChange: (value: string) => void;
  onComplete?: (pin: string) => void;
  error?: boolean; // shake + auto-clear after 600ms
  disabled?: boolean;
  biometricType?: BiometricType;
  onBiometricPress?: () => void;
  randomizeKeys?: boolean; // security option
  title?: string;
  subtitle?: string;
  testID?: string;
};
