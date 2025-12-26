import { Button } from '@mui/material';

const AuthButton = ({ children, onClick, disabled }) => {
  return (
    <Button
      variant="contained"
      fullWidth
      sx={{ mt: 2 }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default AuthButton;
