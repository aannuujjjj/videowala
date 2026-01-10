import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";

export default function VideoCard({
  video,
  apiBase,
  onDelete,
  readOnly = false,
}) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const videoUrl = video.url?.startsWith("http")
    ? video.url
    : `${apiBase}/${video.videoPath}`;

  const handleDelete = async () => {
    try {
      await onDelete?.(video._id);

      
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to delete video",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: 4,
          borderRadius: 2,
        }}
      >
        {/* Video */}
        <CardMedia
          component="video"
          src={videoUrl}
          controls
          sx={{ height: 200, objectFit: "cover" }}
        />

        {/* Content */}
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            fontWeight={600}
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {video.title || "Untitled Video"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {video.description || "No description"}
          </Typography>

          {!readOnly && (
            <Box mt="auto" display="flex" justifyContent="space-between">
              <IconButton color="primary">
                <EditIcon />
              </IconButton>

              <IconButton color="error" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
