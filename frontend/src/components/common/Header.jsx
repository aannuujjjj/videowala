import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick, drawerWidth }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove auth token
    localStorage.removeItem("token");

    // Redirect to login
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* App title */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          VideoWala
        </Typography>

        {/* Logout Button */}
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
