import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  TextField,
  Button,
  Grid,
  Divider,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Profile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    bio: "",
    phone: "",
    avatar: "",
  });

  const [preview, setPreview] = useState("");

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const token = localStorage.getItem("token");

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setPreview(res.data.user.avatar || "");
    } catch (err) {
      console.error("Fetch profile failed:", err);
      showSnackbar("Failed to load profile", "error");
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    showSnackbar("Profile photo selected (not uploaded yet)", "info");
    // Later you’ll upload this file to backend
  };

  const handleUpdate = async () => {
    try {
      await api.put(
        "/users/profile",
        {
          bio: user.bio,
          phone: user.phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showSnackbar("Profile updated successfully", "success");
    } catch (err) {
      console.error("Profile update failed:", err);
      showSnackbar("Failed to update profile", "error");
    }
  };

  return (
    <>
      <Box maxWidth="1000px" mx="auto">
        {/* Page Title */}
        <Typography variant="h5" fontWeight={600} mb={3}>
          My Profile
        </Typography>

        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Grid container spacing={4}>
              {/* LEFT COLUMN */}
              <Grid item xs={12} md={4}>
                <Stack spacing={2} alignItems="center">
                  <Avatar
                    src={preview}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "primary.main",
                      fontSize: 36,
                    }}
                  >
                    {user.username?.charAt(0)?.toUpperCase()}
                  </Avatar>

                  <Button variant="outlined" component="label" size="small">
                    Upload Photo
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </Button>

                  <Box textAlign="center">
                    <Typography fontWeight={600}>
                      @{user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>

              {/* RIGHT COLUMN */}
              <Grid item xs={12} md={8}>
                <Typography fontWeight={600} mb={1}>
                  Profile Information
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      value={user.username}
                      fullWidth
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Bio"
                      name="bio"
                      multiline
                      rows={4}
                      fullWidth
                      value={user.bio}
                      onChange={handleChange}
                      placeholder="Tell something about yourself..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Phone"
                      name="phone"
                      fullWidth
                      value={user.phone}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdate}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
