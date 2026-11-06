import client from './client';

export const registerUser = async (userData) => {
  const response = await client.post('/api/auth/register', userData);
  return response.data.data;
};

export const loginUser = async (credentials) => {
  const response = await client.post('/api/auth/login', credentials);
  return response.data.data;
};

export const getMe = async () => {
  const response = await client.get('/api/auth/me');
  return response.data.data.user;
};
