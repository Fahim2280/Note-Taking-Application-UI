import { apiFetch } from './client';

export const getPostsApi = async (page = 1, limit = 5) => {
  return apiFetch(`/posts?page=${page}&limit=${limit}`);
};

export const createPostApi = async ({ title, content, body }) => {
  const text = body || content || '';
  return apiFetch('/posts', {
    method: 'POST',
    body: JSON.stringify({
      title,
      body: text,
      status: 'published'
    })
  });
};

export const getUserPostsWithLookupApi = async (userId, page = 1, limit = 5) => {
  return apiFetch(`/users/${userId}/posts?page=${page}&limit=${limit}`);
};
