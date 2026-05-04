export const getFileUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Use Render backend URL or Vite proxy API URL base
  const BASE_URL = (import.meta.env.VITE_API_URL || 'https://tegronlearnify-2.onrender.com/api').replace(/\/api$/, '');
  
  if (path.startsWith('/')) {
    return `${BASE_URL}${path}`;
  }
  return `${BASE_URL}/${path}`;
};
