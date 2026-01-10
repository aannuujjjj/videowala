import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";

const drawerWidth = 240;

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Header
        drawerWidth={drawerWidth}
        onMenuClick={() => setMobileOpen(!mobileOpen)}
      />

      <Sidebar
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          bgcolor: "background.default",
          ml: { sm: `${drawerWidth}px` }, // ✅ KEY FIX
        }}
      >
        {/* Push content below header */}
        <Toolbar />

        {/* ROUTED PAGE WILL RENDER BELOW */}
        <Outlet />
      </Box>
    </Box>
  );
}
