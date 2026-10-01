import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { mediaUrl } from '../../utils/media';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', image: '', link: '', technologies: [] });
  const [techInput, setTechInput] = useState('');
  const [search, setSearch] = useState('');
  const API_URL = process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm({ ...form, technologies: [...form.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTech = (index) => {
    setForm({ ...form, technologies: form.technologies.filter((_, i) => i !== index) });
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
      alert('Image upload failed (use a JPG, PNG, GIF or WebP under 5 MB)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/content/projects/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Project updated!');
      } else {
        await axios.post(`${API_URL}/content/projects`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Project added!');
      }
      resetForm();
      fetchProjects();
    } catch (err) {
      alert('Error saving project');
    }
  };

  const startEdit = (proj) => {
    setEditingId(proj._id || proj.id);
    setForm({
      title: proj.title || '',
      description: proj.description || '',
      image: proj.image || '',
      link: proj.link || '',
      technologies: proj.technologies || []
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', description: '', image: '', link: '', technologies: [] });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      try {
        await axios.delete(`${API_URL}/content/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProjects();
      } catch (err) {
        alert('Error deleting project');
      }
    }
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.technologies?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {editingId && (
          <button
            onClick={resetForm}
            className="text-sm bg-gray-200 px-3 py-1 rounded text-gray-700 hover:bg-gray-300"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
        <input
          type="text"
          name="title"
          placeholder="Project title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mb-4">
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="mt-2">
            <label className="text-sm text-gray-600 block mb-1">Or upload a screenshot:</label>
            <input type="file" accept="image/*" onChange={handleUpload} />
          </div>
          {form.image && (
            <div className="mt-2">
              <span className="text-xs text-gray-500 block mb-1">Preview:</span>
              <img src={mediaUrl(form.image)} alt="Preview" className="h-32 object-cover rounded border" />
            </div>
          )}
        </div>
        <input
          type="text"
          name="link"
          placeholder="Project link / GitHub repository URL"
          value={form.link}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add technology (e.g. React, Node.js)"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={addTech} className="bg-gray-700 text-white px-5 rounded font-bold hover:bg-gray-800">
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.technologies.map((tech, i) => (
              <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                {tech}
                <button type="button" onClick={() => removeTech(i)} className="text-red-500 font-bold hover:text-red-700">×</button>
              </span>
            ))}
          </div>
        </div>
        <button className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 w-full transition">
          {editingId ? 'Update Project' : 'Add Project'}
        </button>
      </form>

      {/* Filter / Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search projects by title, description or technology..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {filteredProjects.map((project) => {
          const id = project._id || project.id;
          return (
            <div key={id} className="p-4 border rounded bg-gray-50 hover:bg-white transition shadow-sm">
              <div className="flex justify-between items-start gap-4">
                {project.image && (
                  <img src={mediaUrl(project.image)} alt={project.title} className="w-24 h-24 object-cover rounded flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies && project.technologies.map((tech, i) => (
                      <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(project)}
                    className="bg-amber-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-amber-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(id)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
