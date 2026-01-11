import { Box, Typography, Button,  Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState, useCallback } from "react";
import UploadVideoDialog from "../../components/common/UploadVideoDialog";
import VideoCard from "../../components/common/VideoCard";
import api from "../../services/api";

const API = api.defaults.baseURL;

export default function MyVideos() {
  const [open, setOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const token = localStorage.getItem("token");

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get("/videos/my-videos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("Fetch videos failed:", err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDeleteClick = (videoId) => {
    setSelectedVideoId(videoId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/videos/${selectedVideoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos((prev) =>
        prev.filter((v) => v._id !== selectedVideoId)
      );

      setSnackbar({
        open: true,
        message: "Video deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Delete failed", error);
      setSnackbar({
        open: true,
        message: "Failed to delete video",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedVideoId(null);
    }
  };

  return (
    <>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ width: "100%", px: { xs: 1.5, sm: 2, md: 3 }, pb: 3 }}
      >
        <Typography variant="h4" fontWeight={600}>
          My Videos
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Upload Video
        </Button>
      </Box>

      {/* Loading */}
      {loading && (
        <Typography color="text.secondary">
          Loading videos...
        </Typography>
      )}

      {/* Empty State */}
      {!loading && videos.length === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mt={6}
        >
          <Typography variant="h6" color="text.secondary">
            No videos uploaded yet
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Upload your first video to get started 🎥
          </Typography>
        </Box>
      )}

      {/* Video Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr", // ✅ Always 3 per row
          },
          gap: 3,
        }}
      >
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            video={video}
            apiBase={API}
            onDelete={handleDeleteClick}
          />
        ))}
      </Box>


      {/* Upload Dialog */}
      <UploadVideoDialog
        open={open}
        onClose={() => setOpen(false)}
        onUploaded={fetchVideos}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Video</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this video?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
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
