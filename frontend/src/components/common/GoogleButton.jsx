import { GoogleLogin } from '@react-oauth/google';
import { Box, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';

const GoogleButton = ({ onSuccess }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Box mb={2}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            onSuccess(credentialResponse);

            // optional success feedback
            setSnackbarMessage('Google login successful');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
          }}
          onError={() => {
            setSnackbarMessage('Google login failed. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          }}
        />
      </Box>

      {/* 🔔 SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GoogleButton;
