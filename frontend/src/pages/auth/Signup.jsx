import {
  Box,
  Typography,
  Link,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AuthInput from '../../components/common/AuthInput';
import AuthButton from '../../components/common/AuthButton';
import GoogleButton from '../../components/common/GoogleButton';
import { registerUser } from '../../services/authService';
import Logo from '../../assets/Logo.png';

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: null,
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isStrongPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasAlphanumeric = /[a-z0-9]/.test(password);
    return minLength && hasUppercase && hasAlphanumeric;
  };

  const handleSubmit = async () => {
    if (loading) return;

    setError('');

    if (!isStrongPassword(form.password)) {
      setError(
        'Password must be at least 8 characters long, contain 1 uppercase letter and 1 alphanumeric character'
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        dob: form.dob ? form.dob.toISOString() : null,
      });

      setSnackbarMessage('Signup successful. Please login.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" bgcolor="#fff">
      {/* LEFT BRAND (X STYLE) */}
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

      {/* RIGHT SIGNUP SECTION */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={3}
      >
        {/* SNACKBAR (UNCHANGED LOGIC) */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          onClose={() => {
            setSnackbarOpen(false);
            navigate('/');
          }}
        >
          <Alert severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

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
            Join today
          </Typography>

          <Typography variant="h6" fontWeight={500} mb={3}>
            Create your account
          </Typography>

          <GoogleButton />

          <Divider sx={{ my: 2 }}>or</Divider>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <AuthInput
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <AuthInput
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />

          <AuthInput
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Birth"
              value={form.dob}
              onChange={(newValue) => setForm({ ...form, dob: newValue })}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: 'normal',
                },
              }}
            />
          </LocalizationProvider>

          <AuthButton
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              mt: 3,
              borderRadius: 999,
              py: 1.3,
              fontSize: 16,
            }}
          >
            {loading ? 'Creating…' : 'Create account'}
          </AuthButton>

          <Typography variant="body2" mt={2}>
            Already have an account?{' '}
            <Link href="/" fontWeight={500}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
