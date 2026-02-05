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
import deviceId from '../../utils/deviceId';

import Logo from '../../assets/Logo.png';

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
      navigate('/dashboard/all-videos');
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
      const data = await loginUser({
        ...form,
        deviceId,
      });

      localStorage.setItem('acesstoken', data.token);
      localStorage.setItem('refreshtoken', data.refreshToken);
      navigate('/dashboard/all-videos');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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

      {/* RIGHT AUTH SECTION */}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
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
            Login now
          </Typography>

          <Typography variant="h6" fontWeight={500} mb={3}>
            Sign in to continue
          </Typography>

          <GoogleButton onSuccess={handleGoogleSuccess} />

          <Divider sx={{ my: 3 }}>or</Divider>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

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

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={1}
          >
            <FormControlLabel
              control={<Checkbox size="small" />}
              label="Remember me"
            />
            <Link href="/forgot-password" underline="hover">
              Forgot password?
            </Link>
          </Box>

          <AuthButton
            onClick={handleLogin}
            disabled={loading}
            sx={{
              mt: 3,
              borderRadius: 999,
              fontSize: 16,
              py: 1.3,
            }}
          >
            {loading ? 'Logging in…' : 'Sign in'}
          </AuthButton>

          <Typography variant="body2" mt={4} align="center">
            Don’t have an account?{' '}
            <Link href="/signup" fontWeight={500}>
              Create one
            </Link>
          </Typography>


          <Typography variant="body2" mt={1} align="center">
            <Link href="/contact" fontWeight={500}>
              Contact Us
            </Link>
          </Typography>


        </Box>
      </Box>
    </Box>
  );
};

export default Login;
