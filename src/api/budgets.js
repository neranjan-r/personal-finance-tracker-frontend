import client from './client';

export const getBudgets = async (params = {}) => {
  const response = await client.get('/api/budgets', { params });
  return response.data.data;
};

export const setBudget = async (data) => {
  const response = await client.put('/api/budgets', data);
  return response.data.data;
};

export const deleteBudget = async (id) => {
  const response = await client.delete(`/api/budgets/${id}`);
  return response.data.data;
};
