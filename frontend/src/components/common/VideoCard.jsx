import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function VideoCard({ video, apiBase, onDelete }) {
  return (
    <Card sx={{ boxShadow: 4 }}>
      <CardMedia
        component="video"
        height="180"
        controls
        src={`${apiBase}/${video.videoPath}`}
      />

      <CardContent>
        <Typography fontWeight={600}>
          {video.title || "Untitled Video"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {video.description || "No description"}
        </Typography>

        <Box display="flex" justifyContent="space-between" mt={1}>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>

          <IconButton color="secondary" onClick={() => onDelete(video._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}
