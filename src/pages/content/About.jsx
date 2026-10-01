import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function About() {
  const [form, setForm] = useState({ title: '', description: '', image: '', social: {} });
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/about`);
      setForm({ title: '', description: '', image: '', ...res.data, social: res.data?.social || {} });
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSocial = (e) => {
    setForm({ ...form, social: { ...form.social, [e.target.name]: e.target.value } });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await axios.post(`${API_URL}/upload/image`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm((f) => ({ ...f, image: res.data.url }));
    } catch (err) {
      alert('Image upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/content/about`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('About updated!');
    } catch (err) {
      alert('Error updating about');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">About</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-bold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={form.title || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-2">Description</label>
          <textarea
            name="description"
            value={form.description || ''}
            onChange={handleChange}
            rows="6"
            className="w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-2">Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image || ''}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />
        </div>
        <div>
          <label className="block font-bold mb-2">Upload profile photo</label>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
        {['github', 'linkedin', 'twitter', 'email'].map((key) => (
          <div key={key}>
            <label className="block font-bold mb-2 capitalize">{key}{key === 'email' ? ' address' : ' URL'}</label>
            <input
              type="text"
              name={key}
              value={form.social[key] || ''}
              onChange={handleSocial}
              className="w-full p-3 border rounded"
            />
          </div>
        ))}
        <button className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
