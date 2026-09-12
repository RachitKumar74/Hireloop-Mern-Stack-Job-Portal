const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ORIGIN = API_URL.replace(/\/api\/?$/, '');

export const fileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${ORIGIN}${path}`;
};