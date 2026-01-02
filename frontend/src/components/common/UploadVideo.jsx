import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://walavideo-backend.azurewebsites.net';

const UploadVideo = () => {
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchVideos = async () => {
    try {
      const res = await axios.get(`${API}/videos/my-videos`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVideos(res.data.videos);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

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

      await axios.post(`${API}/videos/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Video uploaded');
      setVideo(null);
      fetchVideos();

    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/videos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchVideos();
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div>
      <h3>Upload Video</h3>

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
        <div key={v._id} style={{ marginBottom: '15px' }}>
          <video width="300" controls>
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
