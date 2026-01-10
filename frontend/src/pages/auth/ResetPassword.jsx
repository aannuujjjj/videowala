import { Box, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import AuthInput from '../../components/common/AuthInput';
import AuthButton from '../../components/common/AuthButton';
import { resetPassword } from '../../services/authService';
import Logo from '../../assets/Logo.png';

const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9\W]).{8,}$/;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = async () => {
    setError('');
    setSuccess('');

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (!password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, contain one uppercase letter and one number or special character'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        token,
        newPassword: password,
      });

      setSuccess(res.message || 'Password reset successful');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
            Reset password
          </Typography>

          <Typography variant="h6" fontWeight={500} mb={3}>
            Create a strong new password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <AuthInput
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <AuthInput
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <AuthButton
            onClick={handleReset}
            disabled={loading}
            sx={{
              mt: 2,
              borderRadius: 999,
              py: 1.3,
              fontSize: 16,
            }}
          >
            {loading ? 'Resetting…' : 'Reset password'}
          </AuthButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ResetPassword;
