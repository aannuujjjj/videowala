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

  // BANK STATES
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [bankStatus, setBankStatus] = useState("NON_VERIFIED");
  const [bankAccount, setBankAccount] = useState({
    accountHolderName: "",
    bankName: "",
    branchAddress: "",
    ifsc: "",
    status: "NON_VERIFIED",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // FETCH PROFILE
  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      setPreview(res.data.user.avatar || "");
    } catch {
      showSnackbar("Failed to load profile", "error");
    }
  }, [token]);

  // FETCH BANK ACCOUNT ✅ FIXED PATH
  const fetchBankAccount = useCallback(async () => {
    try {
      const res = await api.get("/api/bank-accounts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.bankAccount) {
        setBankAccount(res.data.bankAccount);
        setBankStatus(res.data.bankAccount.status);
      }
    } catch (err) {
      console.error("Fetch bank account failed", err);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
    fetchBankAccount();
  }, [fetchProfile, fetchBankAccount]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      await api.put(
        "/users/profile",
        { bio: user.bio, phone: user.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar("Profile updated successfully");
    } catch {
      showSnackbar("Failed to update profile", "error");
    }
  };

  // BANK SUBMIT ✅ FIXED PATH
  const handleBankSubmit = async () => {
    try {
      await api.put(
        "/api/bank-accounts",
        {
          accountHolderName: bankAccount.accountHolderName,
          bankName: bankAccount.bankName,
          branchAddress: bankAccount.branchAddress,
          ifsc: bankAccount.ifsc,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showSnackbar("Bank account saved successfully");
      setIsEditingBank(false);
      fetchBankAccount();
    } catch (err) {
      console.error("Bank submit failed", err);
      showSnackbar("Failed to save bank details", "error");
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", px: { xs: 1.5, sm: 2, md: 3 }, pb: 3 }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} mb={1}>
            My Profile
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your personal information and preferences
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={4}>
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3} alignItems="center">
                  <Box position="relative">
                    <Avatar src={preview} sx={{ width: 140, height: 140, fontSize: 48 }}>
                      {user.username?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <EditIcon sx={{ color: "white" }} />
                      <input hidden type="file" onChange={handleAvatarChange} />
                    </Box>
                  </Box>

                  <Typography variant="h6" fontWeight={700}>
                    {user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>

                  <Chip label="Active Account" color="success" size="small" />

                  <Divider sx={{ width: "100%" }} />

                  <Stack spacing={2} width="100%">
                    <Paper sx={{ p: 2 }}><PersonIcon /> @{user.username}</Paper>
                    <Paper sx={{ p: 2 }}><EmailIcon /> {user.email}</Paper>
                    {user.phone && <Paper sx={{ p: 2 }}><PhoneIcon /> {user.phone}</Paper>}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={8}>
            {/* PROFILE INFO */}
            <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" fontWeight={700} mb={3}>
                  Profile Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField value={user.username} fullWidth disabled />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField name="bio" multiline rows={4} value={user.bio} onChange={handleChange} fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField name="phone" value={user.phone} onChange={handleChange} fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button variant="outlined" onClick={fetchProfile}>Reset</Button>
                      <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* BANK ACCOUNT */}
            <Card elevation={0} sx={{ mt: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>Bank Account Details</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add and manage your bank account information
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2}>
                    <Chip
                      label={bankStatus === "VERIFIED" ? "Verified" : "Non Verified"}
                      color={bankStatus === "VERIFIED" ? "success" : "warning"}
                      variant="outlined"
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      disabled={isEditingBank}
                      onClick={() => {
                        setIsEditingBank(true);
                        setBankStatus("NON_VERIFIED");
                      }}
                    >
                      Change Bank A/c
                    </Button>
                  </Stack>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      disabled={!isEditingBank}
                      label="A/c Holder Name"
                      value={bankAccount.accountHolderName}
                      onChange={(e) =>
                        setBankAccount({ ...bankAccount, accountHolderName: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      disabled={!isEditingBank}
                      label="Bank Name"
                      value={bankAccount.bankName}
                      onChange={(e) =>
                        setBankAccount({ ...bankAccount, bankName: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      disabled={!isEditingBank}
                      label="Bank Branch Address"
                      value={bankAccount.branchAddress}
                      onChange={(e) =>
                        setBankAccount({ ...bankAccount, branchAddress: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      disabled={!isEditingBank}
                      label="Bank IFSC"
                      value={bankAccount.ifsc}
                      onChange={(e) =>
                        setBankAccount({ ...bankAccount, ifsc: e.target.value })
                      }
                    />
                  </Grid>
                </Grid>

                {isEditingBank && (
                  <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                    <Button variant="outlined" onClick={() => setIsEditingBank(false)}>
                      Cancel
                    </Button>
                    <Button variant="contained" onClick={handleBankSubmit}>
                      Submit
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
