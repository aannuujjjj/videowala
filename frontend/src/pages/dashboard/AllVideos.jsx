import {
  Box,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import VideoCard from "../../components/common/VideoCard";
import api from "../../services/api";

const API_BASE = api.defaults.baseURL;

export default function AllVideos() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  const fetchVideos = async (pageNo) => {
    try {
      setLoading(true);
      const res = await api.get(`/videos/all?page=${pageNo}&limit=9`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVideos(res.data.videos || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch all videos", error);
      setSnackbar({
        open: true,
        message: "Failed to load videos",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Open delete dialog
  const handleDeleteClick = (videoId) => {
    setSelectedVideoId(videoId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
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
    <Box sx={{ width: "100%", px: { xs: 1.5, sm: 2, md: 3 }, pb: 3 }}>
      <Typography
        variant="h5"
        fontWeight={600}
        mb={3}
        textAlign={{ xs: "center", sm: "left" }}
      >
        All Videos
      </Typography>

      {/* Loading */}
      {loading && (
        <Box minHeight="40vh" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}

      {/* Empty state */}
      {!loading && videos.length === 0 && (
        <Box minHeight="40vh" display="flex" justifyContent="center" alignItems="center">
          <Typography color="text.secondary">
            No videos available.
          </Typography>
        </Box>
      )}

      {/* Videos Grid */}
      {!loading && videos.length > 0 && (
        <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
              <VideoCard
                video={video}
                apiBase={API_BASE}
                onDelete={() => handleDeleteClick(video._id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="small"
          />
        </Box>
      )}

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
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
