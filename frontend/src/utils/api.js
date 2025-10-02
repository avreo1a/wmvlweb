// Centralized API/Uploads configuration with sane defaults and normalization
const normalizeBase = (url) => (url || '').replace(/\/$/, '');

// Handle production domain mismatch between www.wmvlradio.org and wmvlradio.org
const getApiBaseUrl = () => {
  // If we have an env var, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return normalizeBase(import.meta.env.VITE_API_BASE_URL);
  }
  
  // In production, handle the www/non-www domain issue
  if (window.location.hostname === 'www.wmvlradio.org') {
    return 'https://wmvlradio.org';  // API server is on non-www domain
  }
  
  // Default fallback to current origin
  return window.location.origin;
};

const getUploadsBaseUrl = () => {
  // If we have an env var, use it  
  if (import.meta.env.VITE_UPLOADS_BASE_URL) {
    return normalizeBase(import.meta.env.VITE_UPLOADS_BASE_URL);
  }
  
  // In production, uploads are served from the same domain as API
  if (window.location.hostname === 'www.wmvlradio.org') {
    return 'https://wmvlradio.org';  // Uploads served from non-www domain
  }
  
  // Default fallback to current origin
  return window.location.origin;
};

export const API_BASE_URL = getApiBaseUrl();
export const UPLOADS_BASE_URL = getUploadsBaseUrl();

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
};

// Helper function to build upload URLs
export const buildUploadUrl = (filename) => {
  const safe = encodeURIComponent(filename);
  return `${UPLOADS_BASE_URL}/uploads/${safe}`;
};