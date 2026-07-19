// Base URL for the backend API (NestJS on Render in production).
// Configure NEXT_PUBLIC_API_URL in the environment; falls back to local dev.
// The /api/v1 prefix is appended automatically if missing, so both
// "https://host" and "https://host/api/v1" work as configured values.
const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
const trimmed = raw.replace(/\/+$/, '');

export const API_BASE = trimmed.endsWith('/api/v1')
  ? trimmed
  : `${trimmed}/api/v1`;
