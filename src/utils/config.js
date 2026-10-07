const raw = process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api';
const clean = raw.trim().replace(/\/+$/, '');
export const API_URL = clean.endsWith('/api') ? clean : `${clean}/api`;
export default API_URL;
