import { Snackbar, Alert } from '@mui/material';

const SuccessSnackbar = ({ open, message, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert severity="success" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SuccessSnackbar;
