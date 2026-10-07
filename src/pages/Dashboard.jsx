import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../utils/config';
import About from './content/About';
import Skills from './content/Skills';
import Projects from './content/Projects';
import Blogs from './content/Blogs';
import Experience from './content/Experience';
import Testimonials from './content/Testimonials';
import Services from './content/Services';
import Messages from './content/Messages';
import MediaLibrary from './content/MediaLibrary';

function DashboardHome() {
  const [stats, setStats] = useState({
    projects: 0,
    blogs: 0,
    skills: 0,
    experience: 0,
    testimonials: 0,
    services: 0,
    messages: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      const [projectsRes, blogsRes, skillsRes, expRes, testRes, servRes, msgRes, mediaRes] = await Promise.all([
        axios.get(`${API_URL}/content/projects`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/content/blogs`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/content/skills`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/content/experience`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/content/testimonials`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/content/services`).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/contact`, authHeaders).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/upload/media`, authHeaders).catch(() => ({ data: [] })),
      ]);

      setStats({
        projects: Array.isArray(projectsRes.data) ? projectsRes.data.length : 0,
        blogs: Array.isArray(blogsRes.data) ? blogsRes.data.length : 0,
        skills: Array.isArray(skillsRes.data) ? skillsRes.data.length : 0,
        experience: Array.isArray(expRes.data) ? expRes.data.length : 0,
        testimonials: Array.isArray(testRes.data) ? testRes.data.length : 0,
        services: Array.isArray(servRes.data) ? servRes.data.length : 0,
        messages: Array.isArray(msgRes.data) ? msgRes.data.length : 0,
        media: Array.isArray(mediaRes.data) ? mediaRes.data.length : 0,
      });
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Projects', count: stats.projects, link: '/projects', color: 'bg-blue-500' },
    { title: 'Blog Posts', count: stats.blogs, link: '/blogs', color: 'bg-green-500' },
    { title: 'Skills', count: stats.skills, link: '/skills', color: 'bg-purple-500' },
    { title: 'Experience Entries', count: stats.experience, link: '/experience', color: 'bg-amber-500' },
    { title: 'Testimonials', count: stats.testimonials, link: '/testimonials', color: 'bg-rose-500' },
    { title: 'Services Offered', count: stats.services, link: '/services', color: 'bg-cyan-500' },
    { title: 'Contact Messages', count: stats.messages, link: '/messages', color: 'bg-indigo-500' },
    { title: 'Uploaded Media', count: stats.media, link: '/media', color: 'bg-emerald-500' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
      <p className="text-gray-600 mb-8">Manage your portfolio content dynamically from one central hub.</p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <h3 className="text-gray-500 text-sm font-medium">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-2">{card.count}</p>
              </div>
              <div className={`w-12 h-12 rounded-full ${card.color} text-white flex items-center justify-center font-bold text-lg`}>
                {card.count}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('cms_auth_token');
    localStorage.removeItem('cms_refresh_token');
    window.location.href = '/login';
  };

  const navItems = [
    { label: '📊 Dashboard', path: '/' },
    { label: '👤 About', path: '/about' },
    { label: '⚡ Skills', path: '/skills' },
    { label: '🚀 Projects', path: '/projects' },
    { label: '✍️ Blogs', path: '/blogs' },
    { label: '💼 Experience', path: '/experience' },
    { label: '💬 Testimonials', path: '/testimonials' },
    { label: '🛠️ Services', path: '/services' },
    { label: '✉️ Messages', path: '/messages' },
    { label: '🖼️ Media Library', path: '/media' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
            ⚡ Portfolio CMS
          </h1>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2.5 rounded font-medium text-sm transition ${
                    isActive ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="pt-6 border-t border-gray-800 mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 p-2.5 rounded font-bold hover:bg-red-700 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/services" element={<Services />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/media" element={<MediaLibrary />} />
        </Routes>
      </div>
    </div>
  );
}

