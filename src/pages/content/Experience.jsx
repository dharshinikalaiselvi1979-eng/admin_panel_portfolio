import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({ company: '', position: '', description: '', start_date: '', end_date: '' });
  const API_URL = process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/experience`);
      setExperiences(res.data);
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
      await axios.post(`${API_URL}/content/experience`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ company: '', position: '', description: '', start_date: '', end_date: '' });
      fetchExperience();
    } catch (err) {
      alert('Error adding experience');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this experience?')) {
      try {
        await axios.delete(`${API_URL}/content/experience/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchExperience();
      } catch (err) {
        alert('Error deleting experience');
      }
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Experience</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={form.company}
            onChange={handleChange}
            className="p-3 border rounded"
          />
          <input
            type="text"
            name="position"
            placeholder="Position"
            value={form.position}
            onChange={handleChange}
            className="p-3 border rounded"
          />
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 border rounded mb-4"
        />
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            name="start_date"
            placeholder="Start date (e.g., Jan 2020)"
            value={form.start_date}
            onChange={handleChange}
            className="p-3 border rounded"
          />
          <input
            type="text"
            name="end_date"
            placeholder="End date (e.g., Dec 2023)"
            value={form.end_date}
            onChange={handleChange}
            className="p-3 border rounded"
          />
        </div>
        <button className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
          Add Experience
        </button>
      </form>

      <div className="space-y-3">
        {experiences.map((exp) => (
          <div key={exp.id} className="p-4 border-l-4 border-blue-600 bg-gray-50 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.start_date} - {exp.end_date}</p>
                <p className="text-gray-600 mt-2">{exp.description}</p>
              </div>
              <button
                onClick={() => handleDelete(exp.id)}
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
