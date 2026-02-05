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
      console.error(err);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showSnackbar("Bank account saved successfully");
      setIsEditingBank(false);
      fetchBankAccount();
    } catch {
      showSnackbar("Failed to save bank details", "error");
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", px: { xs: 1.5, sm: 2, md: 3 }, pb: 3 }}>
        <Grid container spacing={3}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={4}>
            <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3} alignItems="center">
                  <Box position="relative">
                    <Avatar src={preview} sx={{ width: 140, height: 140 }}>
                      {user.username?.charAt(0)}
                    </Avatar>
                    <Box component="label" sx={{ position: "absolute", bottom: 0, right: 0 }}>
                      <EditIcon />
                      <input hidden type="file" onChange={handleAvatarChange} />
                    </Box>
                  </Box>

                  <Typography fontWeight={700}>{user.username}</Typography>
                  <Typography color="text.secondary">{user.email}</Typography>

                  <Divider sx={{ width: "100%" }} />

                  <Paper sx={{ p: 2 }}><PersonIcon /> @{user.username}</Paper>
                  <Paper sx={{ p: 2 }}><EmailIcon /> {user.email}</Paper>
                  {user.phone && <Paper sx={{ p: 2 }}><PhoneIcon /> {user.phone}</Paper>}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={8}>
            {/* PROFILE */}
            <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField value={user.username} fullWidth disabled />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField name="bio" value={user.bio} onChange={handleChange} fullWidth multiline rows={4} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField name="phone" value={user.phone} onChange={handleChange} fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                      <Button variant="outlined" onClick={fetchProfile}>Reset</Button>
                      <Button variant="contained" onClick={handleUpdate}>Save</Button>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* BANK ACCOUNT */}
            <Card sx={{ mt: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Box>
                    <Typography fontWeight={700}>Bank Account Details</Typography>
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
                      onClick={() => setIsEditingBank(true)}
                    >
                      Change Bank A/c
                    </Button>
                  </Stack>
                </Box>

                {/* VIEW MODE – PROFESSIONAL */}
                {!isEditingBank && (
                  <Grid container spacing={3}>
                    {[
                      { label: "A/c Holder", value: bankAccount.accountHolderName },
                      { label: "Bank Name", value: bankAccount.bankName },
                      { label: "Branch", value: bankAccount.branchAddress },
                      { label: "IFSC", value: bankAccount.ifsc },
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "#fafafa",
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                          >
                            {item.label}
                          </Typography>
                          <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                            {item.value || "—"}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {/* EDIT MODE – UNCHANGED */}
                {isEditingBank && (
                  <>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="A/c Holder Name"
                          fullWidth
                          value={bankAccount.accountHolderName}
                          onChange={(e) =>
                            setBankAccount({ ...bankAccount, accountHolderName: e.target.value })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Bank Name"
                          fullWidth
                          value={bankAccount.bankName}
                          onChange={(e) =>
                            setBankAccount({ ...bankAccount, bankName: e.target.value })
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          label="Bank Branch Address"
                          fullWidth
                          value={bankAccount.branchAddress}
                          onChange={(e) =>
                            setBankAccount({ ...bankAccount, branchAddress: e.target.value })
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Bank IFSC"
                          fullWidth
                          value={bankAccount.ifsc}
                          onChange={(e) =>
                            setBankAccount({ ...bankAccount, ifsc: e.target.value })
                          }
                        />
                      </Grid>
                    </Grid>

                    <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
                      <Button variant="outlined" onClick={() => setIsEditingBank(false)}>
                        Cancel
                      </Button>
                      <Button variant="contained" onClick={handleBankSubmit}>
                        Submit
                      </Button>
                    </Box>
                  </>
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
