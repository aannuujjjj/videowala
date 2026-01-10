import {
  Box,
  Typography,
  Link,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthInput from '../../components/common/AuthInput';
import AuthButton from '../../components/common/AuthButton';
import { resetPassword, verifyOtp } from '../../services/authService';
import OtpDialog from './OtpDialog';
import Logo from '../../assets/Logo.png';

const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9\W]).{8,}$/;

const ForgotPassword = () => {
  // STEP CONTROL
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

  const navigate = useNavigate();

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
      setStep(2);

      setResendTimer(60);
      setCanResend(false);

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
     STEP 2: VERIFY OTP
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
      await verifyOtp({ email, otp });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STEP 3: RESET PASSWORD
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
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" bgcolor="#fff">
      {/* LEFT BRAND */}
      <Box
        flex={1}
        display={{ xs: 'none', md: 'flex' }}
        justifyContent="center"
        alignItems="center"
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: 320,
            maxWidth: '70%',
          }}
        />
      </Box>

      {/* RIGHT CONTENT */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={3}
      >
        <Box width="100%" maxWidth={420}>
          {/* MOBILE LOGO */}
          <Box
            display={{ xs: 'flex', md: 'none' }}
            justifyContent="center"
            mb={4}
          >
            <img src={Logo} alt="Logo" style={{ width: 90 }} />
          </Box>

          <Typography variant="h3" fontWeight={700} mb={1}>
            Forgot password?
          </Typography>

          <Typography variant="h6" fontWeight={500} mb={3}>
            Reset it securely
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <AuthInput
                label="Username / Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <AuthButton
                onClick={handleSendOtp}
                disabled={loading}
                sx={{ mt: 2, borderRadius: 999, py: 1.3 }}
              >
                {loading ? 'Sending…' : 'Send OTP'}
              </AuthButton>
            </>
          )}

          {/* STEP 2 – OTP DIALOG */}
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
            onClose={() => {
              setStep(1);   // ✅ CLOSE DIALOG
              setOtp('');
              setError('');
            }}
          />


          {/* STEP 3 */}
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

              <AuthButton
                onClick={handleResetPassword}
                disabled={loading}
                sx={{ mt: 2, borderRadius: 999, py: 1.3 }}
              >
                Reset password
              </AuthButton>
            </>
          )}

          <Typography variant="body2" mt={4}>
            Back to{' '}
            <Link href="/" fontWeight={500}>
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
