import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/config';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const token = localStorage.getItem('cms_auth_token');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this message?')) {
      try {
        await axios.delete(`${API_URL}/contact/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (selectedMessage?._id === id) setSelectedMessage(null);
        fetchMessages();
      } catch (err) {
        alert('Error deleting message');
      }
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.message?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-gray-500 text-sm mt-1">Inquiries sent via the portfolio contact form</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
          Total: {messages.length}
        </span>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search messages by sender name, email, or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading messages...</div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded border text-gray-500">
          No contact messages found.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?._id === msg._id;
              return (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded border cursor-pointer transition ${
                    isSelected ? 'bg-blue-50 border-blue-500 shadow-sm' : 'bg-gray-50 hover:bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800 text-sm truncate">{msg.name}</h3>
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 truncate">{msg.email}</p>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">{msg.message}</p>
                </div>
              );
            })}
          </div>

          {/* Message Detail View */}
          <div className="lg:col-span-2 border rounded p-6 bg-gray-50">
            {selectedMessage ? (
              <div>
                <div className="flex justify-between items-start pb-4 border-b mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedMessage.name}</h2>
                    <p className="text-sm text-blue-600">{selectedMessage.email}</p>
                    {selectedMessage.phone && (
                      <p className="text-xs text-gray-500 mt-1">Phone: {selectedMessage.phone}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Received: {new Date(selectedMessage.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(selectedMessage._id)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600 transition"
                  >
                    Delete Message
                  </button>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message Body</h4>
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                    {selectedMessage.message}
                  </p>
                </div>
                <div className="mt-4">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-blue-700 transition"
                  >
                    Reply via Email ✉️
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 py-20">
                Select a message from the list to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
