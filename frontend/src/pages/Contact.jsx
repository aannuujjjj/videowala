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
import Logo from "../assets/Logo.png";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value) => {
    setForm({ ...form, phone: value });
    setErrors((prev) => ({ ...prev, phone: "" }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, "");
    const localNumber = digitsOnly.startsWith("91")
      ? digitsOnly.slice(2)
      : digitsOnly;
    return localNumber.length === 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone || !form.message) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (!validateEmail(form.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    if (!validatePhone(form.phone)) {
      setErrors({ phone: "Please enter a valid 10-digit phone number" });
      return;
    }

    if (form.message.trim().length < 10) {
      setErrors({ message: "Message must be at least 10 characters long" });
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
      setErrorMsg(
        err?.response?.data?.message || "Server error. Try again later."
      );
      setStatus("error");
    }
  };

  return (
    <Box minHeight="100vh" display="flex" bgcolor="#fff">
      
      {/* LEFT BRAND SECTION (LIKE LOGIN PAGE) */}
      <Box
        flex={1}
        display={{ xs: "none", md: "flex" }}
        justifyContent="center"
        alignItems="center"
      >
        <img
          src={Logo}
          alt="Logo"
          style={{ width: 320, maxWidth: "70%" }}
        />
      </Box>

      {/* RIGHT CONTACT FORM SECTION */}
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={3}
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
            value={form.email}
            onChange={handleChange}
            required
            error={!!errors.email}
            helperText={errors.email}
          />

          <MuiTelInput
            defaultCountry="IN"
            value={form.phone}
            onChange={handlePhoneChange}
            label="Phone Number"
            fullWidth
            required
            error={!!errors.phone}
            helperText={errors.phone}
          />

          <TextField
            label="Message"
            name="message"
            multiline
            rows={4}
            value={form.message}
            onChange={handleChange}
            required
            error={!!errors.message}
            helperText={errors.message}
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
    </Box>
  );
}
