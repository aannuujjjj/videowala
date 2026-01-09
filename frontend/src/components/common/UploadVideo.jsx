import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';

const UploadVideo = () => {
  const API = "https://walavideo-backend.azurewebsites.net";
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchVideos = useCallback(async () => {
    try {
      const res = await api.get('/videos/my-videos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVideos(res.data.videos);
    } catch (err) {
      console.error('FETCH VIDEOS ERROR', err);
    }
  }, [token]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

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

      await api.post('/videos/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Video uploaded');
      setVideo(null);
      fetchVideos();
    } catch (err) {
      setMessage('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchVideos();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>

      <p>{message}</p>

      <hr />

      <h4>Your Videos</h4>

      {videos.length === 0 && <p>No videos uploaded</p>}

      {videos.map((v) => (
        <div
          key={v._id}
          style={{
            marginBottom: '30px',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
          }}
        >
          <video width="100%" controls>
            <source src={`${API}/${v.videoPath}`} type="video/mp4" />
          </video>
          <br />
          <button onClick={() => handleDelete(v._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default UploadVideo;
