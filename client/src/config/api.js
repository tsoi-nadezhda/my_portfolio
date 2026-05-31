/** Backend base URL. Empty in dev → Vite proxy handles /api */
export function apiUrl(path) {
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return base ? `${base}${path}` : path;
}
