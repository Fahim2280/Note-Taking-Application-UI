import { apiFetch } from './client';

export const getAdminUsersApi = async (page = 1, limit = 5) => {
  return apiFetch(`/admin/users?page=${page}&limit=${limit}`);
};

export const createAdminUserApi = async (userData) => {
  return apiFetch('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const updateAdminUserApi = async (id, updateData) => {
  return apiFetch(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
};

export const deleteAdminUserApi = async (id) => {
  return apiFetch(`/admin/users/${id}`, {
    method: 'DELETE'
  });
};

export const getAdminNotesApi = async (page = 1, limit = 5) => {
  return apiFetch(`/admin/notes?page=${page}&limit=${limit}`);
};
