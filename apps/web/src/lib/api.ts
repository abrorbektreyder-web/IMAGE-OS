// Base URL for the backend API (NestJS on Render in production).
// Configure NEXT_PUBLIC_API_URL in the environment; falls back to local dev.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
