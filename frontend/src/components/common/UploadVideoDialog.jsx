import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { useState } from "react";
import api from "../../services/api";

export default function UploadVideoDialog({ open, onClose, onUploaded }) {
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });



  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpload = async () => {
    if (!video) {
      showSnackbar("Please select a video", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("title", title);
    formData.append("description", description);

    try {
      setLoading(true);

      await api.post("/videos/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setVideo(null);
      setTitle("");
      setDescription("");

      showSnackbar("Video uploaded successfully", "success");
      onUploaded();
      onClose();
    } catch {
      showSnackbar("Video upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          Create new post
        </DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Upload Box */}
            <Box
              component="label"
              sx={{
                border: "2px dashed #ddd",
                borderRadius: 3,
                height: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.5,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <CloudUploadOutlinedIcon sx={{ fontSize: 60, color: "#555" }} />

              <Typography fontSize={16}>
                Drag photos and videos here
              </Typography>

              <Button variant="contained" component="span">
                Select from computer
              </Button>

              <input
                hidden
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files[0])}
              />
            </Box>

            {video && (
              <Typography variant="body2" color="text.secondary">
                Selected: {video.name}
              </Typography>
            )}

            {/* Title */}
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />

            {/* Description */}
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            {/* Upload Button */}
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload Video"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
