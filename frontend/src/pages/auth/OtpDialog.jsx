import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const OtpDialog = ({
  open,
  otp,
  setOtp,
  loading,
  onVerify,
  error,
  clearError,
  canResend,
  resendTimer,
  onResend,
  onClose, // ✅ ADD THIS
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose} // ✅ IMPORTANT
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Verify OTP
        </Typography>

        <IconButton
          size="small"
          onClick={onClose} // ✅ CLOSE DIALOG
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter the 6-digit OTP sent to your registered email address.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          value={otp}
          placeholder="● ● ● ● ● ●"
          inputProps={{
            maxLength: 6,
            inputMode: 'numeric',
            pattern: '[0-9]*',
            style: {
              textAlign: 'center',
              letterSpacing: '0.4em',
              fontSize: 20,
              fontWeight: 600,
            },
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setOtp(value);
              clearError();
            }
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, borderRadius: 999, py: 1.2 }}
          onClick={onVerify}
          disabled={loading}
        >
          {loading ? 'Verifying…' : 'Verify OTP'}
        </Button>

        <Box mt={2} textAlign="center">
          {canResend ? (
            <Button variant="text" onClick={onResend}>
              Resend OTP
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Resend OTP in {resendTimer}s
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};


export default OtpDialog;
