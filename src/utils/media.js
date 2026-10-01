const API = (process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

// Uploaded images are stored as "/uploads/xyz.webp" on the backend.
export function mediaUrl(src) {
  if (!src) return '';
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;
  return API + (src.startsWith('/') ? src : '/' + src);
}
