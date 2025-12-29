import {
  Box,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { useState } from 'react';

import AuthInput from '../../components/common/AuthInput';
import AuthButton from '../../components/common/AuthButton';
import { resetPassword, verifyOtp } from '../../services/authService';
import OtpDialog from './OtpDialog';
import { useNavigate } from 'react-router-dom';


const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9\W]).{8,}$/;

const ForgotPassword = () => {
  // STEP CONTROL
  // 1 = enter email
  // 2 = enter otp
  // 3 = reset password
  const [step, setStep] = useState(1);

  // FORM STATES
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI STATES
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate= useNavigate()


  /* =========================
     STEP 1: SEND OTP
  ========================== */
  const handleSendOtp = async () => {
    setError('');

    setLoading(true);

    if (!email) {
      setError('Username or Email is required');
      setLoading(false);
      return;
    }

    try {
      // move to OTP step
      setStep(2);

      // reset resend timer
      setResendTimer(60);
      setCanResend(false);

      // start countdown
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  /* =========================
     STEP 2: VERIFY OTP (UI ONLY)
  ========================== */
  const handleVerifyOtp = async () => {
    setError('');
    setLoading(true);

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      setLoading(false);
      return;
    }

    try {
      await verifyOtp({
        email,
        otp,
      });

      // ✅ OTP is valid → move forward
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };


  /* =========================
     STEP 3: RESET PASSWORD (BACKEND)
  ========================== */
  const handleResetPassword = async () => {
    setError('');
    setLoading(true);

    if (!newPassword || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (!passwordRegex.test(newPassword)) {
    setError(
      'Password must be at least 8 characters long and contain 1 uppercase letter and 1 number or special character'
    );
    setLoading(false);
    return;
  }


    try {
      await resetPassword({
        token: otp,
        newPassword,
      });
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
    >
      <Box width={420} bgcolor="#fff" p={4} borderRadius={2} boxShadow={3}>
        <Typography variant="h4" textAlign="center" mb={1}>
          Forgot Password
        </Typography>

        <Typography variant="body2" textAlign="center" mb={3}>
          Reset your password securely
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {step === 1 && (
          <>
            <AuthInput
              label="Username / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <AuthButton onClick={handleSendOtp} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </AuthButton>
          </>
        )}

        <OtpDialog
          open={step === 2}
          otp={otp}
          setOtp={setOtp}
          loading={loading}
          onVerify={handleVerifyOtp}
          onResend={handleSendOtp}
          resendTimer={resendTimer}
          canResend={canResend}
          error={error}
          clearError={() => setError('')}
        />



        {step === 3 && (
          <>
            <AuthInput
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <AuthInput
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <AuthButton onClick={handleResetPassword} disabled={loading}>
              Reset Password
            </AuthButton>
          </>
        )}

        <Typography variant="body2" textAlign="center" mt={3}>
          Back to{' '}
          <Link href="/" underline="none">
            Login
          </Link>
        </Typography>
      </Box>


    </Box>
  );
};

export default ForgotPassword;
