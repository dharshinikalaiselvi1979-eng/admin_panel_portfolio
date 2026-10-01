import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ author: '', position: '', text: '', image: '' });
  const API_URL = process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/testimonials`);
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/content/testimonials`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ author: '', position: '', text: '', image: '' });
      fetchTestimonials();
    } catch (err) {
      alert('Error adding testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await axios.delete(`${API_URL}/content/testimonials/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTestimonials();
      } catch (err) {
        alert('Error deleting testimonial');
      }
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Testimonials</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="author"
            placeholder="Author name"
            value={form.author}
            onChange={handleChange}
            className="p-3 border rounded"
          />
          <input
            type="text"
            name="position"
            placeholder="Position/Title"
            value={form.position}
            onChange={handleChange}
            className="p-3 border rounded"
          />
        </div>
        <textarea
          name="text"
          placeholder="Testimonial text"
          value={form.text}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />
        <button className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
          Add Testimonial
        </button>
      </form>

      <div className="space-y-3">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="p-4 border rounded bg-gray-50">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="italic text-gray-700 mb-3">"{testimonial.text}"</p>
                <p className="font-bold">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.position}</p>
              </div>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
