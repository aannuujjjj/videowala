import { Box, Typography, Link, Divider, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AuthInput from '../../components/common/AuthInput';
import AuthButton from '../../components/common/AuthButton';
import GoogleButton from '../../components/common/GoogleButton';
import { registerUser } from '../../services/authService';
import { Snackbar } from '@mui/material';
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isStrongPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasAlphanumeric = /[a-z0-9]/.test(password); // 👈 FIX

    return minLength && hasUppercase && hasAlphanumeric;
  };



  // ✅ SINGLE, CORRECT handleSubmit
  const handleSubmit = async () => {
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
      await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        dob: form.dob ? form.dob.toISOString() : null,
      });

      setSnackbarMessage('Signup successful. Please login.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate('/');
      }, 1500);

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };


  return (
    <Box minHeight="100vh" display="flex">
      {/* LEFT BRAND SECTION (DESKTOP ONLY) */}
      <Box
        flex={1}
        display={{ xs: 'none', md: 'flex' }}
        sx={{
          background: 'linear-gradient(135deg, #1976d2, #d32f2f)',
        }}
      >
        <img
          src={Logo}
          alt="Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* RIGHT SIGNUP SECTION */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f4f6f8"
      >
        {/* SNACKBAR */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            severity={snackbarSeverity}
            onClose={() => setSnackbarOpen(false)}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Box
          width={420}
          bgcolor="#fff"
          p={4}
          borderRadius={3}
          boxShadow="0 10px 40px rgba(0,0,0,0.1)"
        >
          {/* MOBILE LOGO */}
          <Box
            display={{ xs: 'flex', md: 'none' }}
            justifyContent="center"
            mb={2}
          >
            <img src={Logo} alt="Logo" width={120} />
          </Box>

          <Typography variant="h4" textAlign="center" mb={1}>
            Create Account
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            mb={3}
            color="text.secondary"
          >
            Sign up to get started
          </Typography>

          <GoogleButton />

          <Divider sx={{ my: 2 }}>or</Divider>

          {error && <Alert severity="error">{error}</Alert>}

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
              onChange={(newValue) => {
                setForm({ ...form, dob: newValue });
              }}
              slotProps={{
                textField: { fullWidth: true, margin: 'normal' },
              }}
            />
          </LocalizationProvider>

          <AuthButton
            onClick={handleSubmit}
            sx={{
              mt: 2,
              background: 'linear-gradient(90deg, #1976d2, #d32f2f)',
            }}
          >
            Create Account
          </AuthButton>

          <Typography variant="body2" textAlign="center" mt={3}>
            Already have an account?{' '}
            <Link href="/" underline="none" color="primary">
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );

};

export default Signup;
