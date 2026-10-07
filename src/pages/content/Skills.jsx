import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STORAGE_KEY = 'cms_local_skills';

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ name: '', level: 'Intermediate', category: 'Frontend' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchSkills();
  }, []);

  const getLocalSkills = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const saveLocalSkills = (list) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Failed to save skills locally', e);
    }
  };

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/content/skills`, { timeout: 4000 });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setSkills(res.data);
        saveLocalSkills(res.data);
      } else {
        // Fall back to locally stored skills if server has none
        const local = getLocalSkills();
        setSkills(local);
      }
    } catch (err) {
      console.warn('Backend unavailable, using cached local skills:', err.message);
      const local = getLocalSkills();
      setSkills(local);
      setStatus({
        type: 'warning',
        text: 'Backend is offline or unreachable. Showing locally stored skills.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setStatus({ type: 'error', text: 'Please enter a skill name.' });
      return;
    }

    const newSkill = {
      _id: 'local_' + Date.now(),
      name: form.name.trim(),
      level: form.level || 'Intermediate',
      category: form.category || 'General'
    };

    try {
      const res = await axios.post(`${API_URL}/content/skills`, form, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 4000
      });
      const savedSkill = res.data || newSkill;
      const updated = [savedSkill, ...skills];
      setSkills(updated);
      saveLocalSkills(updated);
      setStatus({ type: 'success', text: '✅ Skill added and synced to server!' });
      setForm({ name: '', level: 'Intermediate', category: 'Frontend' });
    } catch (err) {
      // Offline fallback: save to localStorage so the user is never blocked
      const updated = [newSkill, ...skills];
      setSkills(updated);
      saveLocalSkills(updated);
      setStatus({
        type: 'warning',
        text: '⚠️ Skill saved locally! (Backend server is offline or not configured in Vercel environment variables).'
      });
      setForm({ name: '', level: 'Intermediate', category: 'Frontend' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return;

    try {
      if (!String(id).startsWith('local_')) {
        await axios.delete(`${API_URL}/content/skills/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 4000
        });
      }
    } catch (err) {
      console.warn('Could not delete from server, removing locally:', err.message);
    }

    const updated = skills.filter((s) => (s._id || s.id) !== id);
    setSkills(updated);
    saveLocalSkills(updated);
    setStatus({ type: 'info', text: 'Skill removed.' });
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Skills</h1>
          <p className="text-sm text-gray-500 mt-1">Manage technical skills and proficiencies</p>
        </div>
        <button
          onClick={fetchSkills}
          className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50 text-gray-600"
          title="Refresh from server"
        >
          {loading ? 'Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {status && (
        <div
          className={`p-4 mb-6 rounded-lg text-sm flex justify-between items-center ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : status.type === 'error'
              ? 'bg-red-50 text-red-800 border border-red-200'
              : status.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border border-amber-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}
        >
          <span>{status.text}</span>
          <button onClick={() => setStatus(null)} className="ml-4 font-bold text-gray-500 hover:text-gray-800">
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Skill</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Skill Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. React.js, Python"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Proficiency Level</label>
            <input
              type="text"
              name="level"
              placeholder="Beginner / Intermediate / Expert"
              value={form.level}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
            <input
              type="text"
              name="category"
              placeholder="Frontend / Backend / Tools"
              value={form.category}
              onChange={handleChange}
              className="w-full p-3 border rounded bg-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2.5 rounded font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          Add Skill
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Current Skills ({skills.length})</h2>
        {skills.length === 0 ? (
          <p className="text-gray-500 italic p-4 bg-gray-50 rounded border text-center">
            No skills added yet. Fill in the form above to add your first skill!
          </p>
        ) : (
          skills.map((skill) => {
            const skillId = skill._id || skill.id;
            return (
              <div
                key={skillId}
                className="flex justify-between items-center p-4 border rounded bg-gray-50 hover:bg-white transition"
              >
                <div>
                  <h3 className="font-bold text-gray-900">{skill.name}</h3>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-700">{skill.category || 'General'}</span> • {skill.level || 'Intermediate'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(skillId)}
                  className="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
