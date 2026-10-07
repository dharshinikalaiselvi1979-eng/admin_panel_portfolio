import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { mediaUrl } from '../../utils/media';
import { API_URL } from '../../utils/config';

export default function MediaLibrary() {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState('');
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await axios.get(`${API_URL}/upload/media`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMediaList(res.data);
    } catch (err) {
      console.error('Error fetching media list', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setUploading(true);

    try {
      await axios.post(`${API_URL}/upload/image`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMedia();
      e.target.value = '';
    } catch (err) {
      alert('Upload failed: Ensure image is JPG, PNG, GIF, or WebP under 5 MB');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this media file permanently?')) {
      try {
        await axios.delete(`${API_URL}/upload/media/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMedia();
      } catch (err) {
        alert('Error deleting media file');
      }
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2500);
  };

  return (
    <div className="max-w-6xl bg-white p-8 rounded-lg shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">Upload and manage image assets used throughout the portfolio</p>
        </div>
        <label className={`cursor-pointer px-5 py-2.5 rounded font-bold text-white transition ${
          uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}>
          {uploading ? 'Processing Image...' : '+ Upload New Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {copiedUrl && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 text-sm font-semibold rounded border border-green-200">
          ✅ Image URL copied to clipboard: {copiedUrl}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading media library...</div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded border text-gray-500">
          No uploaded media assets yet. Click "+ Upload New Image" above.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mediaList.map((item) => (
            <div key={item._id} className="border rounded-lg overflow-hidden bg-gray-50 group hover:shadow transition">
              <div className="h-40 bg-gray-200 overflow-hidden flex items-center justify-center">
                <img
                  src={mediaUrl(item.url)}
                  alt={item.filename}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-800 truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex justify-between items-center text-[11px] text-gray-400 mt-1">
                  <span>{item.size ? `${(item.size / 1024).toFixed(1)} KB` : 'WebP'}</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => copyToClipboard(item.url)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs py-1.5 rounded font-medium transition"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 text-xs px-2.5 py-1.5 rounded font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
