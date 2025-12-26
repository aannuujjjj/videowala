import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthInput from '../../components/common/AuthInput';
import AuthButton from '../../components/common/AuthButton';
import GoogleButton from '../../components/common/GoogleButton';
import { loginUser, googleLogin } from '../../services/authService';

import Logo from '../../assets/Logo.png'; // 👈 ADD LOGO

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const data = await googleLogin({
        token: credentialResponse.credential,
      });

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch {
      setError('Google login failed');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const data = await loginUser(form);
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex">
      {/* LEFT BRAND SECTION */}
      <Box
        flex={1}
        display={{ xs: 'none', md: 'flex' }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          background: 'linear-gradient(135deg, #1976d2, #d32f2f)',
          color: '#fff',
        }}
      >
        <Box
          flex={1}
          display={{ xs: 'none', md: 'flex' }}
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


        {/* <Typography variant="h4" fontWeight="bold">
          Welcome Back
        </Typography> */}
      </Box>

      {/* RIGHT LOGIN SECTION */}
      {/* RIGHT LOGIN SECTION */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="#f4f6f8"
      >
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
            <img
              src={Logo}
              alt="Logo"
              style={{
                width: 120,
                height: 'auto',
              }}
            />
          </Box>

          <Typography variant="h4" textAlign="center" mb={1}>
            Login
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            mb={3}
            color="text.secondary"
          >
            Enter your credentials to continue
          </Typography>

          <GoogleButton onSuccess={handleGoogleSuccess} />

          <Divider sx={{ my: 2 }}>or</Divider>

          {error && <Alert severity="error">{error}</Alert>}

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

          <Box display="flex" justifyContent="space-between" mt={1}>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Remember me"
            />
            <Link href="/forgot-password" underline="none" color="primary">
              Forgot password?
            </Link>
          </Box>

          <AuthButton
            onClick={handleLogin}
            disabled={loading}
            sx={{
              mt: 2,
              background: 'linear-gradient(90deg, #1976d2, #d32f2f)',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </AuthButton>

          <Typography variant="body2" textAlign="center" mt={3}>
            Don’t have an account?{' '}
            <Link href="/signup" underline="none" color="primary">
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>

    </Box>
  );
};

export default Login;
