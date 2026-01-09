import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

export default function UploadDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upload Video</DialogTitle>
      <DialogContent>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
