import client from './client';

export const getCategories = async () => {
  const response = await client.get('/api/categories');
  return response.data.data;
};

export const getTransactions = async (params = {}) => {
  const response = await client.get('/api/transactions', { params });
  return response.data.data;
};

export const createTransaction = async (data) => {
  const response = await client.post('/api/transactions', data);
  return response.data.data;
};

export const updateTransaction = async (id, data) => {
  const response = await client.patch(`/api/transactions/${id}`, data);
  return response.data.data;
};

export const deleteTransaction = async (id) => {
  const response = await client.delete(`/api/transactions/${id}`);
  return response.data.data;
};
