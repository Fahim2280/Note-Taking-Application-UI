const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const getBaseUrl = () => API_BASE_URL;

const getSafeToken = () => {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
  } catch {
    return null;
  }
};

export async function apiFetch(endpoint, options = {}) {
  const token = getSafeToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ensure endpoint starts with a slash
  const urlPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  // Strip trailing slash from base URL if present
  const cleanBase = API_BASE_URL.replace(/\/+$/, '');
  const url = `${cleanBase}${urlPath}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg =
        (data && (data.message || data.error)) ||
        `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}
