// Centralized API/Uploads configuration with sane defaults and normalization
const normalizeBase = (url) => (url || '').replace(/\/$/, '');

// Prefer env vars; fallback to current origin for same-origin deployments
export const API_BASE_URL = normalizeBase(import.meta.env.VITE_API_BASE_URL) || window.location.origin;
export const UPLOADS_BASE_URL = normalizeBase(import.meta.env.VITE_UPLOADS_BASE_URL) || window.location.origin;

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