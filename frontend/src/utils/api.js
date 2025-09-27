// API configuration utility
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to build upload URLs  
export const buildUploadUrl = (filename) => {
  return `${API_BASE_URL}/uploads/${filename}`;
};