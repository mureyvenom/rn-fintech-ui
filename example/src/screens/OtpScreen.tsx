import { useState } from 'react';
import { Box } from 'react-native-fintech-kit';
import { OtpInput } from 'react-native-fintech-kit';

export const OtpScreen = () => {
  const [otp, setOtp] = useState('');

  return (
    <Box flex={1} justifyContent="center" alignItems="center" padding="l">
      <Box>
        <OtpInput
          length={6}
          value={otp}
          error={otp.length === 6}
          onChange={setOtp}
        />
      </Box>
    </Box>
  );
};
