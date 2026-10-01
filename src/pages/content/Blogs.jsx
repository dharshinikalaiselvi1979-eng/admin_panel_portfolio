import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', content: '', image: '', tags: [] });
  const [tagInput, setTagInput] = useState('');
  const [search, setSearch] = useState('');
  const API_URL = process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api';
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/blogs`);
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setForm({ ...form, tags: form.tags.filter((_, i) => i !== index) });
  };

  const insertFormatting = (prefix, suffix = '') => {
    setForm((prev) => ({
      ...prev,
      content: prev.content + `${prefix}text${suffix}`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/content/blogs/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Blog post updated!');
      } else {
        await axios.post(`${API_URL}/content/blogs`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Blog post created!');
      }
      resetForm();
      fetchBlogs();
    } catch (err) {
      alert('Error saving blog');
    }
  };

  const startEdit = (blog) => {
    setEditingId(blog._id || blog.id);
    setForm({
      title: blog.title || '',
      description: blog.description || '',
      content: blog.content || '',
      image: blog.image || '',
      tags: blog.tags || []
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: '', description: '', content: '', image: '', tags: [] });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this blog?')) {
      try {
        await axios.delete(`${API_URL}/content/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBlogs();
      } catch (err) {
        alert('Error deleting blog');
      }
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.description?.toLowerCase().includes(search.toLowerCase()) ||
      b.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blogs</h1>
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
        <h2 className="text-lg font-bold mb-4">{editingId ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
        
        <input
          type="text"
          name="title"
          placeholder="Blog title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="description"
          placeholder="Short summary/description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Formatting Toolbar */}
        <div className="flex gap-2 mb-2 bg-gray-200 p-2 rounded text-xs font-semibold">
          <span>Format Content:</span>
          <button type="button" onClick={() => insertFormatting('**', '**')} className="px-2 py-1 bg-white rounded border hover:bg-gray-100">Bold</button>
          <button type="button" onClick={() => insertFormatting('*', '*')} className="px-2 py-1 bg-white rounded border hover:bg-gray-100">Italic</button>
          <button type="button" onClick={() => insertFormatting('### ')} className="px-2 py-1 bg-white rounded border hover:bg-gray-100">Heading</button>
          <button type="button" onClick={() => insertFormatting('- ')} className="px-2 py-1 bg-white rounded border hover:bg-gray-100">Bullet List</button>
          <button type="button" onClick={() => insertFormatting('```\n', '\n```')} className="px-2 py-1 bg-white rounded border hover:bg-gray-100">Code Block</button>
        </div>

        <textarea
          name="content"
          placeholder="Full blog content (markdown/text supported)..."
          value={form.content}
          onChange={handleChange}
          rows="8"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />

        <div className="mb-4">
          <input
            type="text"
            name="image"
            placeholder="Cover Image URL (e.g. https://...)"
            value={form.image}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {form.image && (
            <div className="mt-2">
              <span className="text-xs text-gray-500 block mb-1">Image Preview:</span>
              <img src={form.image} alt="Preview" className="h-32 object-cover rounded border" />
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Add tag (e.g. React, WebDev)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={addTag} className="bg-gray-700 text-white px-5 rounded font-bold hover:bg-gray-800">
              Add Tag
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag, i) => (
              <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                #{tag}
                <button type="button" onClick={() => removeTag(i)} className="text-red-500 font-bold hover:text-red-700">×</button>
              </span>
            ))}
          </div>
        </div>

        <button className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 w-full transition">
          {editingId ? 'Update Blog Post' : 'Publish Blog Post'}
        </button>
      </form>

      {/* Filter / Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="🔍 Search blog posts by title, description or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {filteredBlogs.map((blog) => {
          const id = blog._id || blog.id;
          return (
            <div key={id} className="p-4 border rounded bg-gray-50 hover:bg-white transition shadow-sm">
              <div className="flex justify-between items-start gap-4">
                {blog.image && (
                  <img src={blog.image} alt={blog.title} className="w-24 h-24 object-cover rounded flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{blog.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{blog.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {blog.tags && blog.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">#{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(blog)}
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
