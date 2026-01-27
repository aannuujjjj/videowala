import { useState } from "react";
import api from "../services/api";

import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

import { MuiTelInput } from "mui-tel-input";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setForm({ ...form, phone: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.message) {
      setErrorMsg("All fields are required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await api.post("/api/contact", form);

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      console.error("Contact submit error:", err);
      setErrorMsg(
        err?.response?.data?.message || "Server error. Try again later."
      );
      setStatus("error");
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f4f6f8"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        width={420}
        bgcolor="white"
        p={4}
        borderRadius={3}
        boxShadow={4}
        display="flex"
        flexDirection="column"
        gap={2.5}
      >
        <Typography variant="h5" fontWeight={700}>
          Contact Us
        </Typography>

        <TextField
          label="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <TextField
          label="Email Address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* 🌍 International Phone Input */}
        <MuiTelInput
          defaultCountry="IN"
          value={form.phone}
          onChange={handlePhoneChange}
          label="Phone Number"
          fullWidth
          required
        />

        <TextField
          label="Message"
          name="message"
          multiline
          rows={4}
          value={form.message}
          onChange={handleChange}
          required
        />

        {status === "success" && (
          <Alert severity="success">Message sent successfully.</Alert>
        )}

        {status === "error" && (
          <Alert severity="error">{errorMsg}</Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </Box>
  );
}
