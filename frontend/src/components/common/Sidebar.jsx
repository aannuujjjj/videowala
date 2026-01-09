import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from "@mui/material";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ drawerWidth, mobileOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "All Videos",
      icon: <FolderIcon />,
      path: "/dashboard",
    },
    {
      text: "My Videos",
      icon: <VideoLibraryIcon />,
      path: "/dashboard/my-videos",
    },
    {
      text: "Profile",
      icon: <PersonIcon />,
      path: "/dashboard/profile",
    },
  ];

  const drawer = (
    <Box>
      <Toolbar />
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.text}
              selected={isActive}
              onClick={() => {
                navigate(item.path);
                if (mobileOpen) onClose();
              }}
              sx={{
                mx: 1,
                borderRadius: 1,
                "&.Mui-selected": {
                  bgcolor: "#1f2937",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "#374151",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? "#60a5fa" : "#9ca3af",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box component="nav">
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#111827",
            color: "#fff",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            bgcolor: "#111827",
            color: "#fff",
            borderRight: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
