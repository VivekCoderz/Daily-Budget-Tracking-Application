// Centralized Configuration File
// Changing VITE_API_BASE_URL or API_BASE_URL here updates the server endpoint across the entire application.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001/api';
