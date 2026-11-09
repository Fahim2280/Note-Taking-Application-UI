import { apiFetch } from './client';

export const getUsersByInterestsApi = async (page = 1, limit = 5) => {
  return apiFetch(`/users/group-by-interests?page=${page}&limit=${limit}`);
};
