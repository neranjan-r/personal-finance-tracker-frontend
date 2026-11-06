import client from './client';

export const getSummary = async (params = {}) => {
  const response = await client.get('/api/stats/summary', { params });
  return response.data.data;
};

export const getByCategory = async (params = {}) => {
  const response = await client.get('/api/stats/by-category', { params });
  return response.data.data;
};

export const getMonthly = async (params = {}) => {
  const response = await client.get('/api/stats/monthly', { params });
  return response.data.data;
};
