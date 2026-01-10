import { Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const drawerWidth = 240;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* HEADER */}
      <Header
        drawerWidth={drawerWidth}
        onMenuClick={handleDrawerToggle}
      />

      {/* SIDEBAR */}
      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#f5f6fa",
          minHeight: "100vh",
        }}
      >
        {/* Push content below header */}
        <Toolbar />

        {/* PAGE TITLE */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Dashboard
        </Typography>

        {/* ROUTED PAGE WILL RENDER BELOW */}
        <Outlet />
      </Box>
    </Box>
  );
}
