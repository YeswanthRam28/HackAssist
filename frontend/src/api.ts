// Centralized API Base URL
// During local development, it falls back to localhost:8000
// In production (Vercel), it uses the VITE_API_URL environment variable
export const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';
