import { GoogleOAuthProvider } from '@react-oauth/google';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="528217628474-f367o4v1qhed2oi2a7njfocl1aq96nn3.apps.googleusercontent.com">
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </GoogleOAuthProvider>
);

