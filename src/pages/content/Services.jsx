import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/config';

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', icon: '' });
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/content/services`);
      setServices(res.data);
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
      await axios.post(`${API_URL}/content/services`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ title: '', description: '', icon: '' });
      fetchServices();
    } catch (err) {
      alert('Error adding service');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this service?')) {
      try {
        await axios.delete(`${API_URL}/content/services/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchServices();
      } catch (err) {
        alert('Error deleting service');
      }
    }
  };

  return (
    <div className="max-w-4xl bg-white p-8 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">Services</h1>

      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg">
        <input
          type="text"
          name="title"
          placeholder="Service title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />
        <textarea
          name="description"
          placeholder="Service description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 border rounded mb-4"
        />
        <input
          type="text"
          name="icon"
          placeholder="Icon emoji or name (e.g., 🚀)"
          value={form.icon}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4"
        />
        <button className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
          Add Service
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const serviceId = service._id || service.id;
          return (
            <div key={serviceId} className="p-4 border rounded bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-4xl">{service.icon}</span>
                <button
                  onClick={() => handleDelete(serviceId)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
              <h3 className="font-bold text-lg">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
