import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: '', level: '', category: '' });
  const API_URL = process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/skills`);
      setSkills(res.data);
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
      await axios.post(`${API_URL}/content/skills`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ name: '', level: '', category: '' });
      fetchSkills();
    } catch (err) {
      alert('Error adding skill');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this skill?')) {
      try {
        await axios.delete(`${API_URL}/content/skills/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSkills();
      } catch (err) {
        alert('Error deleting skill');
      }
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Skills</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Skill name"
            value={form.name}
            onChange={handleChange}
            className="p-3 border rounded"
          />
          <input
            type="text"
            name="level"
            placeholder="Level (Beginner/Intermediate/Expert)"
            value={form.level}
            onChange={handleChange}
            className="p-3 border rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="p-3 border rounded"
          />
        </div>
        <button className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
          Add Skill
        </button>
      </form>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.id} className="flex justify-between items-center p-4 border rounded bg-gray-50">
            <div>
              <h3 className="font-bold">{skill.name}</h3>
              <p className="text-sm text-gray-600">{skill.category} • {skill.level}</p>
            </div>
            <button
              onClick={() => handleDelete(skill.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
