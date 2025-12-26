import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    TextField,
    Typography,
    Alert,
} from '@mui/material';

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
}) => {
    return (
        <Dialog open={open}>
            <DialogTitle>Verify OTP</DialogTitle>

            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    An OTP has been sent to your registered email address.
                </Typography>

                {/* ❌ ERROR MESSAGE */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="OTP"
                    fullWidth
                    margin="normal"
                    value={otp}
                    placeholder="Enter 6-digit OTP"
                    inputProps={{
                        maxLength: 6,
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                    }}
                    onChange={(e) => {
                        const value = e.target.value;

                        // allow only digits
                        if (/^\d*$/.test(value)) {
                            setOtp(value);
                            clearError(); // clear error while typing
                        }
                    }}
                />


                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={onVerify}
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Typography
                    variant="body2"
                    align="center"
                    sx={{ mt: 2, color: 'text.secondary' }}
                >
                    {canResend ? (
                        <Button variant="text" onClick={onResend}>
                            Resend OTP
                        </Button>
                    ) : (
                        `Resend OTP in ${resendTimer}s`
                    )}
                </Typography>

            </DialogContent>
        </Dialog>
    );
};

export default OtpDialog;
