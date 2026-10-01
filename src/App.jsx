import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [token, setToken] = useState(localStorage.getItem('cms_auth_token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('cms_auth_token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route element={<PrivateRoute token={token} />}>
          <Route path="/*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
