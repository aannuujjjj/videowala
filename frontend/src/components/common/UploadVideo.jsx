import React, { useState } from 'react';
import axios from 'axios';

const UploadVideo = () => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!video) {
      setMessage('Please select a video');
      return;
    }

    const formData = new FormData();
    formData.append('video', video);

    try {
      setLoading(true);
      setMessage('');

      const token = localStorage.getItem('token'); // same token you already use

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/videos/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setMessage(res.data.message || 'Video uploaded');
      setVideo(null);

    } catch (err) {
      setMessage(
        err.response?.data?.message || 'Upload failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Upload Video</h3>

      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      <p>{message}</p>
    </div>
  );
};

export default UploadVideo;
