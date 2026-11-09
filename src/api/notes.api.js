import { apiFetch } from './client';

export const getNotesApi = async (page = 1, limit = 5) => {
  return apiFetch(`/notes?page=${page}&limit=${limit}`);
};

export const getNoteByIdApi = async (id) => {
  return apiFetch(`/notes/${id}`);
};

export const createNoteApi = async ({ title, content }) => {
  return apiFetch('/notes', {
    method: 'POST',
    body: JSON.stringify({ title, content })
  });
};

export const updateNoteApi = async (id, { title, content }) => {
  return apiFetch(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content })
  });
};

export const deleteNoteApi = async (id) => {
  return apiFetch(`/notes/${id}`, {
    method: 'DELETE'
  });
};
