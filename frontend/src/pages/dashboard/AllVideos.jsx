import {
  Box,
  Typography,
  Grid,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import VideoCard from "../../components/common/VideoCard";
import api from "../../services/api";

export default function AllVideos() {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  const fetchVideos = async (pageNo) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/videos/all?page=${pageNo}&limit=9`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setVideos(res.data.videos);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch all videos", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        All Videos
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && videos.length === 0 && (
        <Typography color="text.secondary">
          No videos available.
        </Typography>
      )}

      <Grid container spacing={3}>
        {videos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video._id}>
            <VideoCard video={video} readOnly />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
