const getApiUrl = () => {
  // 1. Custom URL set by user in localStorage
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('cms_custom_api_url');
    if (custom && custom.trim()) {
      const c = custom.trim().replace(/\/+$/, '');
      return c.endsWith('/api') ? c : `${c}/api`;
    }
  }

  // 2. Environment variable (ignore if it's dead p9w4 or localhost on production)
  const env = process.env.REACT_APP_CMS_API_URL;
  const isBrowserOnCloud = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');

  if (env && env.trim()) {
    const trimmed = env.trim();
    // Don't use localhost or defunct p9w4 backend when running live on Vercel/Render
    if (!(isBrowserOnCloud && (trimmed.includes('localhost') || trimmed.includes('p9w4')))) {
      const c = trimmed.replace(/\/+$/, '');
      return c.endsWith('/api') ? c : `${c}/api`;
    }
  }

  // 3. Active live cloud backend on Render
  return 'https://portfolio-backend-4l27.onrender.com/api';
};

export const API_URL = getApiUrl();
export default API_URL;
