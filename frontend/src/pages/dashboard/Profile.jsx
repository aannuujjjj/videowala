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
  Paper,
  Chip,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

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
    severity: "success",
  });

  const token = localStorage.getItem("token");

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchProfile = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    showSnackbar("Profile photo selected (not uploaded yet)", "info");
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
      <Box sx={{ width: "100%", px: { xs: 1.5, sm: 2, md: 3 }, pb: 3 }}>
        {/* Header Section */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} color="text.primary" mb={1}>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information and preferences
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* LEFT COLUMN - Profile Card */}
          <Grid item xs={12} md={4}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3} alignItems="center">
                  <Box position="relative">
                    <Avatar
                      src={preview}
                      sx={{
                        width: 140,
                        height: 140,
                        bgcolor: "primary.main",
                        fontSize: 48,
                        fontWeight: 600,
                        border: '4px solid',
                        borderColor: 'background.default',
                        boxShadow: '0 4px 20px rgba(0,64,102,0.15)',
                      }}
                    >
                      {user.username?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    
                    <Box
                      component="label"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: 2,
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          transform: 'scale(1.05)',
                        },
                      }}
                    >
                      <EditIcon sx={{ color: 'white', fontSize: 20 }} />
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </Box>
                  </Box>

                  <Box textAlign="center" width="100%">
                    <Typography variant="h6" fontWeight={700} mb={0.5}>
                      {user.username || "User"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {user.email}
                    </Typography>
                    <Chip 
                      label="Active Account" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'success.light',
                        color: 'success.dark',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Divider sx={{ width: '100%' }} />

                  <Stack spacing={2} width="100%">
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'background.default',
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <PersonIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Username
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            @{user.username}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'background.default',
                        borderRadius: 2,
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <EmailIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Email Address
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ wordBreak: 'break-all' }}>
                            {user.email || "Not provided"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    {user.phone && (
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 2, 
                          bgcolor: 'background.default',
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <PhoneIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Phone Number
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {user.phone}
                            </Typography>
                          </Box>
                        </Stack>
                      </Paper>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT COLUMN - Edit Form */}
          <Grid item xs={12} md={8}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box mb={3}>
                  <Typography variant="h6" fontWeight={700} mb={0.5}>
                    Profile Information
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Update your personal details and bio
                  </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography 
                      variant="body2" 
                      fontWeight={600} 
                      mb={1.5}
                      color="text.primary"
                    >
                      Username
                    </Typography>
                    <TextField
                      value={user.username}
                      fullWidth
                      disabled
                      size="medium"
                      placeholder="Username"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'background.default',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                      Username cannot be changed
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography 
                      variant="body2" 
                      fontWeight={600} 
                      mb={1.5}
                      color="text.primary"
                    >
                      Bio
                    </Typography>
                    <TextField
                      name="bio"
                      multiline
                      rows={5}
                      fullWidth
                      value={user.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                      Brief description for your profile
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography 
                      variant="body2" 
                      fontWeight={600} 
                      mb={1.5}
                      color="text.primary"
                    >
                      Phone Number
                    </Typography>
                    <TextField
                      name="phone"
                      fullWidth
                      value={user.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                      Your contact phone number
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="large"
                        onClick={fetchProfile}
                        sx={{
                          px: 3,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2,
                          },
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleUpdate}
                        sx={{
                          px: 4,
                          boxShadow: '0 4px 14px rgba(0,64,102,0.25)',
                          '&:hover': {
                            boxShadow: '0 6px 20px rgba(0,64,102,0.35)',
                          },
                        }}
                      >
                        Save Changes
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          elevation={6}
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}