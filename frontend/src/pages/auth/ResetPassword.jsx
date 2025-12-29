import { Box, Typography, Alert } from '@mui/material';
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import AuthInput from '../../components/common/AuthInput';
import AuthButton from '../../components/common/AuthButton';
import { resetPassword } from '../../services/authService';

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
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="background.default"
    >
      <Box width={420} bgcolor="#fff" p={4} borderRadius={2} boxShadow={3}>
        <Typography variant="h4" textAlign="center" mb={1}>
          Reset Password
        </Typography>

        <Typography variant="body2" textAlign="center" mb={3}>
          Create a strong new password
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

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

        <AuthButton onClick={handleReset} disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </AuthButton>
      </Box>
    </Box>
  );
};

export default ResetPassword;
