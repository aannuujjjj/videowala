import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

export default function Header({ onMenuClick, drawerWidth }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: "#1f2937",
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          VideoHub
        </Typography>

        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>

        <Avatar sx={{ ml: 2 }} />
      </Toolbar>
    </AppBar>
  );
}
