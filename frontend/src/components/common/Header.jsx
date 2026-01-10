import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header({ onMenuClick, drawerWidth }) {
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

        {/* Right side actions */}
        {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          <Avatar />
        </Box> */}
      </Toolbar>
    </AppBar>
  );
}
