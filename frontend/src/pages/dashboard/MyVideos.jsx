import { Box, Typography, Button, Grid } from "@mui/material";
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

  const handleDelete = async (id) => {
    try {
      await api.delete(`/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVideos();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" fontWeight={600}>
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
      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <VideoCard
              video={video}
              apiBase={API}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      {/* Upload Dialog */}
      <UploadVideoDialog
        open={open}
        onClose={() => setOpen(false)}
        onUploaded={fetchVideos}
      />
    </>
  );
}
